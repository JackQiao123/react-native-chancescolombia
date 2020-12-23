import { Platform } from 'react-native';

const config = {
  API_ENDPOINTS: {
    MAIN: 'https://chancescolombia.com/mobile-api-new',
    APP: 'https://chancescolombia.com/mobile-api-new'
  },

  // ADMOB
  ADMOB: {
    REWARDED_MAX: 4,
    SECRETS: Platform.select({
      ios: {
        BANNER: 'ca-app-pub-1196303242456869/7018140233',
        INTERSTITIAL: 'ca-app-pub-1196303242456869/1892153674'
      },
      android: {
        BANNER: 'ca-app-pub-1196303242456869/1377061661',
        INTERSTITIAL: 'ca-app-pub-1196303242456869/9965998123'
      }
    })
  },

  SETTINGS: {
    ENCRYPT: true,
    REFRESH_INTERVAL: 90000,
    APP_NAME: 'app_chancescolombia'
  },

  VIEW_OPTIONS: {
    THEME: 'dark',
    INITIAL_MENU: {
      ID: 'home',
      OPTIONS: {
        toggle: true,
        trigger: true
      }
    },
    MENUS: {
      SHOW_COMPANIES: true
    },
    LAYOUTS: {
      LOGO_ASPECT_RATIO: 247 / 110,
      SHOW_ALL_GAMES_AT_COMPANY: true,
      BREED_CRUMB_COMPANY_DISTINCTION: true,
      MENU_PRIMARY_DISTINCTION: true
    },
    NAVIGATIONS: {
      SHOW_TITLE: true
    }
  },
  ENUMS: {
    SCREEN_TYPE: {
      HOME: 1,
      MENU: 2,
      GAME: 3,
    },
    MENU_TYPE: {
      PRIMARY: 1,
      GAME: 2,
      DATE: 3,
    }
  },

  VARIABLES: {
    app: null
  }
};

export default config;
