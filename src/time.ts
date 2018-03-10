import * as M from 'moment';

const secondsInADay = 86400;
const resetOptions = {hour: 0, minute: 0, seconds: 0};

export const getDayIndex = (moment: M.Moment): number =>
  Math.round(moment.set(resetOptions).unix() / secondsInADay);

export const parseDayIndex = (index: number): M.Moment => {
  return M.unix(index * secondsInADay).set(resetOptions);
};
