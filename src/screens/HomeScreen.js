import React, { Component, Fragment } from 'react';
import { FlatList, View, ScrollView, RefreshControl } from 'react-native';

import { Styles } from '../theme';
import MenuItem from '../components/custom/MenuItem';
import CommonWidget from '../components/custom/CommonWidget';
import ScoreCard from '../components/custom/ScoreCard';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    const { menu } = this.props;
    this.state = {
      loading: false,
      menuList: menu && menu.childNodes ? this._configMenuList([], menu.childNodes) : []
    };
  }

  _configMenuList(list, nodes) {
    if (nodes && nodes.length > 0) {
      for (let i = 0, ni = nodes.length; i < ni; i++) {
        const node = nodes[i];
        list.push(node);
        if (node.collapsable && node.childNodes && node.childNodes.length && node.depth < 2) {
          this._configMenuList(list, node.childNodes);
        }
      }
    }
    return list;
  }

  _keyExtractor(item, index) {
    return `${index}`;
  }

  refresh() {
    this.setState({
      loading: true
    });
    const { menu } = this.props;
    this.setState({
      menuList: menu && menu.childNodes ? this._configMenuList([], menu.childNodes) : [],
      loading: false
    });
  }

  renderMenuItem({ item }) {
    return (
      <Fragment>
        <MenuItem
          menu={item}
          onPress={item.data ? this.props.onMenuPress : () => {}}
        />
        {item.data && (
          <ScoreCard type="game" data={item.data} />
        )}
      </Fragment>
    );
  }

  render() {
    const { menu } = this.props;
    const { menuList, loading } = this.state;
    return (
      <ScrollView
        style={Styles.container}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={this.refresh.bind(this)} />
        }
      >
        <View>
          {
            !loading && menuList.length > 0 && (
              <FlatList
                data={menuList}
                keyExtractor={this._keyExtractor.bind(this)}
                renderItem={this.renderMenuItem.bind(this)}
              />
            )
          }
        </View>
        <View style={Styles.sectionContainer}>
          {
            !loading && menu.childNodes[0]['description'] ? (
              <View style={Styles.section}>
                {CommonWidget.renderHtml(menu.childNodes[0]['description'])}
              </View>
            ) : null
          }
        </View>
      </ScrollView>
    );
  }
}

export default HomeScreen;
