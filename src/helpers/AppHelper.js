import I18n from 'react-native-i18n';
import moment from 'moment';

import CONFIG from '../config';

const AppHelper = {

  _getCompanyMenuNode: (company) => {
    const { SCREEN_TYPE, MENU_TYPE } = CONFIG.ENUMS;
    const { SHOW_ALL_GAMES_AT_COMPANY } = CONFIG.VIEW_OPTIONS.LAYOUTS;
    const node = {
      id: `company_${company.id}`,
      icon: company.logo ? { uri: company.logo } : null,
      text: company.title,
      description: company.description,
      screenType: (SHOW_ALL_GAMES_AT_COMPANY ? SCREEN_TYPE.COMPANY : SCREEN_TYPE.MENU),
      menuType: MENU_TYPE.COMPANY,
      expanded: false,
      collapsable: false,
      childNodes: [],
      data: company
    };

    company.games.forEach((game) => {
      const childNode = AppHelper._getGameMenuNode(game, 'company');
      node.childNodes.push(childNode);
    });
    
    return node;
  },

  _getGameMenuNode: (game, prefix) => {
    const { SCREEN_TYPE, MENU_TYPE } = CONFIG.ENUMS;
    return {
      id: `${prefix}_game_${game.id}`,
      icon: game.logoUrl ? { uri: game.logoUrl } : null,
      text: game.title,
      description: '',
      screenType: SCREEN_TYPE.GAME,
      menuType: MENU_TYPE.GAME,
      updated_at: game.data.datetime,
      date: game.date,
      data: game.data,
    };
  },

  _getCompaniesMenuNode: (games, date, description) => {
    const { SCREEN_TYPE, MENU_TYPE } = CONFIG.ENUMS;
    const node = {
      id: 'date_' + date,
      text: moment(new Date()).format('YYYY-MM-DD') == date ? I18n.t('result') + ' ' + I18n.t('today') + ' ' + moment(new Date()).format('DD MMM YYYY') : moment(date, 'YYYY-MM-DD').format('DD MMM YYYY'),
      menuType: MENU_TYPE.PRIMARY,
      screenType: SCREEN_TYPE.MENU,
      collapsable: true,
      expanded: true,
      description,
      childNodes: []
    };

    games.sort((a, b) => {
      if (a.data.datetime > b.data.datetime) {
        return -1;
      }
      return 1;
    });

    games.forEach((game) => {
      const childNode = AppHelper._getGameMenuNode(game, 'company');
      node.childNodes.push(childNode);
    });
    return node;
  },

  getMenuNode: (data) => {
    const { SCREEN_TYPE, MENU_TYPE } = CONFIG.ENUMS;
    const { games, sessions } = data;

    const node = {
      id: 'home',
      text: I18n.t(CONFIG.SETTINGS.APP_NAME),
      menuType: MENU_TYPE.PRIMARY,
      screenType: SCREEN_TYPE.HOME,
      childNodes: []
    };

    let dates = [];
    const keys = Object.keys(sessions);
    keys.forEach((key) => {
      if (dates.indexOf(key) === -1) {
        dates.push(key);
      }
    });

    dates.sort((a, b) => {
      if(moment(a).format('YYYYMMDD') > moment(b).format('YYYYMMDD')) {
        return -1;
      }
      return 1;
    });

    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      let data = [];
      sessions[date].forEach((session) => {
        session.score = session.score;
        session.date = date;
        session.id = session.game_id;
        let game = games[session.game_id];
        game.data = session;
        game.date = date;
        data.push(game);
      });
      const companiesNode = AppHelper._getCompaniesMenuNode(data, date, '');
      node.childNodes.push(companiesNode);
    }

    return node;
  },

  _getGameMenuListNode(game, prefix) {
    // const date = new Date();
    const data = game;
    // data.updated_at = moment(date).format('DD-MM-YYYY | h:mm:ss a');
    return {
      id: `${prefix}_game_${game.id}`,
      data
    };
  },

  _getCompanyMenuListNode(company) {
    // const date = new Date();
    const data = company;
    // data.updated_at = moment(date).format('DD-MM-YYYY | h:mm:ss a');
    return {
      id: `company_${company.id}`,
      data
    };
  },

  _getCompaniesMenuList(companies) {
    const list = [];
    companies.forEach((company) => {
      const node = AppHelper._getCompanyMenuListNode(company);
      list.push(node);
      company.games.forEach((game) => {
        const childNode = AppHelper._getGameMenuListNode(game, 'company');
        list.push(childNode);
      });
    });
    return list;
  },

  getMenuList: (data) => {
    const VIEW_OPTION_MENUS = CONFIG.VIEW_OPTIONS.MENUS;
    const { companies } = data;
    const list = [];

    if (VIEW_OPTION_MENUS.SHOW_COMPANIES) {
      const companiesList = AppHelper._getCompaniesMenuList(companies);
      list.push(...companiesList);
    }

    if (VIEW_OPTION_MENUS.SHOW_POOLS) {
      const poolsList = AppHelper._getPoolsMenuList(companies);
      list.push(...poolsList);
    }
    return list;
  },

  isRecentlyUpdated(updated_at) {
    const todayDate = new Date();
    return updated_at.indexOf(moment(todayDate).format('YYYY-MM-DD')) === 0;
  },

  buildHttpQuery: (params) => {
    const str = [];
    Object.keys(params).forEach((key) => {
      const value = params[key];
      str.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    });
    return str.join('&');
  },

  convertChartData(stats) {
    const keys = Object.keys(stats);
    const data = [];
    for (let i = 0; i < keys.length; i++) {
      data.push({ name: keys[i], v: stats[keys[i]] });
    }
    data.sort((a, b) => a.name - b.name);

    const mainData = [];
    for (let i = 0; i < data.length; i++) {
      const tempData = [];
      tempData.push(data[i]);
      mainData.push(tempData);
    }
    return mainData;
  },

  convertWaybackData(stats) {
    const keys = Object.keys(stats);
    const data = [];
    for (let i = 0; i < keys.length; i++) {
      data.push({ title: keys[i], content: stats[keys[i]] });
    }
    data.sort((a, b) => b.title - a.title);
    return data;
  }
};

export default AppHelper;
