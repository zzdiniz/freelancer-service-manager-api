import moment from 'moment-timezone';

const parseToLocalDate = (mysqlDatetime: string): string => {
  return moment.utc(mysqlDatetime).tz('America/Sao_Paulo').format('DD/MM/YYYY HH:mm');
};

export default parseToLocalDate