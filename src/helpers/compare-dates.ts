import moment from 'moment';

const compareDates = (date1: string, date2: string): boolean => {
  return moment(date1).isSame(moment(date2));
};

export default compareDates
