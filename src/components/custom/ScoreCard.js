import React, { Component } from 'react';
import { Text, View, Dimensions } from 'react-native';
import I18n from 'react-native-i18n';
import moment from 'moment';

import { Colors, Fonts, Metrics } from '../../theme';
import AppHelper from '../../helpers/AppHelper';
import CommonWidget from './CommonWidget';
import Icon from 'react-native-vector-icons/FontAwesome';

const styles = {
  scoreCard: {
    backgroundColor: Colors.scoreCardBackground,
    borderColor: Colors.scoreCardBorder,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Metrics.paddingDefault
  },
  scoreCardDateContainer: {
    flexDirection: 'row',
    marginBottom: Metrics.marginDefault * 0.7
  },
  scoreCardDate: {
    borderRadius: Metrics.paddingDefault * 2,
    marginRight: Metrics.marginDefault,
    marginTop: 4,
    paddingHorizontal: Metrics.paddingDefault,
    paddingVertical: 4
  },
  scoreCardDateText: {
    color: Colors.scoreCardDateText,
    fontSize: Fonts.size.default
  },
  scoreCardDelay: {
    flexDirection: 'row',
    paddingTop: 4
  },
  scoreCardDelayIcon: {
    color: 'grey',
    fontSize: Fonts.size.h5,
    marginHorizontal: Metrics.marginDefault,
    marginTop: Metrics.marginDefault * 0.4
  },
  scoreCardDelayText: {
    color: 'grey',
    fontSize: Fonts.size.h5
  }
};

class ScoreCard extends Component {
  render() {
    const { type, mode, data } = this.props;

    const isRecentlyUpdated = AppHelper.isRecentlyUpdated(data.datetime);

    let d = new Date();
    let utc = d.getTime();
    let date = new Date(utc - (3600000 * 4));
    let today = moment(date).format('DD-MM-YYYY');

    let scoreView = null;
    if (data.score) {
      if (mode === 'text') {
        scoreView = CommonWidget.renderStandardNumbers(data.score, 0, isRecentlyUpdated);
      } else {
        if (today == data.date) {
          scoreView = CommonWidget.renderTodayNumbers(data.score, 0, isRecentlyUpdated);
        } else {
          scoreView = CommonWidget.renderCircleNumbers(data.score, 0, isRecentlyUpdated)
        }
      }
    }

    const screenWidth = Math.round(Dimensions.get('window').width);

    return (
      <View style={styles.scoreCard}>
        {
          (data.delay && data.date != today) || !scoreView ? (
            <View style={styles.scoreCardDelay}>
              <Icon style={styles.scoreCardDelayIcon} name="clock-o" />
              <Text style={styles.scoreCardDelayText}>{I18n.t('delayed')}</Text>
              <Text style={styles.scoreCardDelayText}>{data.delay_reason ? ': ' + data.delay_reason : ''}</Text>
            </View>
          ) : (
            <View style={{width:screenWidth - 120}}>{scoreView}</View>
          )
        }
        
        <View style={[styles.scoreCardDateContainer]}>
          {
            (type == 'company' || type == 'game') && (
              <View style={[styles.scoreCardDate]}>
                <Text style={{color: 'grey'}}>{data.delay ? today : data.date}</Text>
              </View>
            )
          }
          {
            data.no_game_today ? (
              <View style={[styles.scoreCardDate, { backgroundColor: Colors.scoreCardDateBackgroundHighlight }]}>
                <Text style={styles.scoreCardDateText}>{I18n.t('no_game_today')}</Text>
              </View>
            ) : null
          }
        </View>
      </View>
    );
  }
}

export default ScoreCard;
