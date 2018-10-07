import * as moment from 'moment';

import {Report} from '../report';

export default function sumReports(reports: Report[]): Report {
  // tslint:disable-next-line:triple-equals
  if (reports.some(report => report == null)) return null;

  if (moment.isDuration(reports[0])) {
    return reports.reduce(
      (total: moment.Duration, current) => total.add(current as moment.Duration),
      moment.duration()
    );
  }

  return reports.reduce((total: number, current) => total + (current as number), 0);
}
