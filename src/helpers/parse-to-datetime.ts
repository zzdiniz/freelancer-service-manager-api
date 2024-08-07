import moment from 'moment-timezone';

const parseToDatetime = (dateString: string): string => {
  return moment.tz(dateString, 'DD/MM/YYYY HH:mm', 'America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');
};

export default parseToDatetime