import React, { Component } from 'react';
import {
  Animated, Text, TouchableOpacity, View
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { setDate } from '../../actions/global';

import { Colors, Fonts, Metrics } from '../../theme';

const styles = {
  breedCrumb: {
    backgroundColor: Colors.breedCrumbBackground,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: Colors.breedCrumbBorder,
    borderBottomWidth: 1,
    paddingHorizontal: Metrics.paddingDefault,
    height: (Metrics.paddingDefault + Metrics.iconDefault)
  },
  breedCrumbSide: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  breedCrumbMain: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  breedCrumbButton: {
    justifyContent: 'center',
    padding: Metrics.paddingDefault
  },
  breedCrumbCalendar: {
    marginVertical: -Metrics.marginDefault,
    width: (Metrics.paddingDefault * 2) + (Fonts.size.h6 * 1.5)
  },
  breedCrumbButtonIcon: {
    color: Colors.breedCrumbText,
    fontSize: Fonts.size.h2
  },
  breedCrumbButtonLeft: {
    paddingRight: Metrics.paddingDefault * 2,
    paddingLeft: Metrics.paddingDefault,
    marginLeft: -Metrics.marginDefault,
    paddingVertical: 0
  },
  breedCrumbButtonIconLeft: {
    color: Colors.breedCrumbText,
    fontSize: Fonts.size.h2 * 1.4
  },
  breedCrumbContent: {
    justifyContent: 'center'
  },
  breedCrumbImage: {
    width: Metrics.iconDefault,
    height: Metrics.iconDefault,
    marginRight: Metrics.marginDefault
  },
  breedCrumbTitle: {
    color: Colors.breedCrumbText,
    fontSize: Fonts.size.h5
  },
  breedCrumbDescription: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  breedCrumbDescriptionText: {
    color: Colors.breedCrumbTextMuted,
    fontSize: Fonts.size.default * 0.8
  },
  breedCrumbDescriptionIcon: {
    width: Fonts.size.tiny,
    height: Fonts.size.tiny,
    borderRadius: Fonts.size.tiny,
    marginRight: Metrics.marginDefault / 2
  }
};

class TopBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      date: props.global.date
    };
  }

  UNSAFE_componentWillMount() {
    this.animatedValue = new Animated.Value(0);
  }

  componentDidMount() {
    this.cycleAnimation();
  }

  onCalendarPress() {
    this.setState({
      show: true,
    });
  }

  onChangeDate(value) {
    let date = new Date(value);

    let yy = date.getFullYear();
    let mm = date.getMonth() + 1;
    let dd = date.getDate();
    let full = (dd > 9 ? '' : '0') + dd + '-' + (mm > 9 ? '' : '0') + mm + '-' + yy;
    this.setState({
        show: false,
        date: full
    });
    this.props.setDate(full);
    this.props.onCalendarPress(full);
  }

  hanldeReset() {
    const { onRefreshPress } = this.props;
    this.props.setDate('');
    onRefreshPress('reset');
    this.setState({ date: '' });
  }

  cycleAnimation() {
    this.animatedValue.setValue(0);
    Animated.timing(this.animatedValue, {
      toValue: 360,
      duration: 1500,
      useNativeDriver: true
    }).start(() => {
      this.cycleAnimation();
    });
  }

  render() {
    const { show, date } = this.state;
    return (
      <View style={styles.breedCrumb}>
        <View style={[styles.breedCrumbMain]}>
            <View style={styles.breedCrumbContent}>
                <Text style={styles.breedCrumbTitle}>{date ? moment(date, 'DD-MM-YYYY').format('DD MMM YYYY') : ''}</Text>
            </View>
        </View>
        <View style={[styles.breedCrumbSide]}>
            <TouchableOpacity
                style={styles.breedCrumbButton}
                onPress={this.onCalendarPress.bind(this)}
            >
                <Icon style={styles.breedCrumbButtonIcon} name="calendar" />
            </TouchableOpacity>
            <DateTimePickerModal
                isVisible={show}
                mode="date"
                onConfirm={this.onChangeDate.bind(this)}
                onCancel={() => this.setState({show: false})}
            />
            <TouchableOpacity style={styles.breedCrumbButton} onPress={this.hanldeReset.bind(this)}>
                <Icon style={styles.breedCrumbButtonIcon} name="refresh" />
            </TouchableOpacity>
        </View>
      </View>
    );
  }
}

TopBar.defaultProps = {
  onCalendarPress: () => {},
  onRefreshPress: () => {}
};

const mapStateToProps = state => ({
  global: state.get('global')
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  setDate: date => dispatch(setDate(date))
});

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
