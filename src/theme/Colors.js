import CONFIG from '../config';

import colorsYellow from './ColorsYellow';
import colorsOrange from './ColorsOrange';
import colorsRed from './ColorsRed';
import colorsGreen from './ColorsGreen';
import colorsBlue from './ColorsBlue';
import colorsDark from './ColorsDark';

let colorsTable = null;
const theme = CONFIG.VIEW_OPTIONS.THEME;
switch (theme) {
  case 'yellow':
    colorsTable = colorsYellow;
    break;
  case 'orange':
    colorsTable = colorsOrange;
    break;
  case 'red':
    colorsTable = colorsRed;
    break;
  case 'green':
    colorsTable = colorsGreen;
    break;
  case 'blue':
    colorsTable = colorsBlue;
    break;
  case 'dark':
  default:
    colorsTable = colorsDark;
    break;
}

const colors = colorsTable;
export default colors;
