//External Libraries
import moment from "moment";
import numbro from "numbro";
//Other Formatters
import { MathOp } from "./MathOp";

/*CONSTANT DATE FORMATTERS*/
export const dateFormat = "MMM D, YYYY";
export const serverDateFormat = "YYYY-MM-DD";
export const datetimeFormatWithYear = "MMM D, YYYY, HH:mm";
export const datetimeFormatWithoutYear = "MMM D, HH:mm";


/*Format Number Data Values*/
export function isNumber(value) {
  return value !== null && !isNaN(value);
}

export function formatFloat(value) {
  return MathOp.divide(value, 100);
}

export function formatInteger(value) {
  return parseInt(value);
}

export function formatThousands(value, precision = 2) {
  return isNumber(value) ? numbro(value).format({thousandSeparated: true, mantissa: precision}) : value
}

/*Format Percentage Values*/
export function formatPercent(value, precision = 2) {
  return isNumber(value) ? numbro(value).format({output: "percent", mantissa: precision}) : value
}

export function addPercent(value) {
  return value === null ? '-' : value.toFixed(2) + '%';
}

/*Format Date Values*/
export function formatDate(date, format = "DD-MMM-YY") {
  return date ? moment(date).format(format) : null;
}

export function formatDatetime(datetime, includeYear = false) {
  const format = includeYear ? datetimeFormatWithYear : datetimeFormatWithoutYear;
  return datetime ? moment(datetime).format(format) : '';
}

export function formatServerDate(momentInstance) {
  return momentInstance ? momentInstance.format(serverDateFormat) : momentInstance;
}

export function formatServerDatetime(momentInstance) {
  return momentInstance ? momentInstance.format("YYYY-MM-DD HH:mm") : momentInstance;
}

export function addYears(value, precision = 1) {
  return formatThousands(value, precision) + ' yrs';
}

export function addMonths(value, precision = 0) {
  return formatThousands(value, precision) + ' months';
}

export function addDays(days) {
  const str = days.toFixed(2);
  const finalDays = parseFloat(str);

  if (finalDays === 1)
    return `${finalDays} day`;
  else
    return `${finalDays} days`;
}

/*Format Currency Values*/
export function formatEuro(value, type = 'thousands', precision = 2) {
  if (!isNumber(value))
    return value;

  let format = {mantissa: precision};

  if (type === 'thousands')
    format.thousandSeparated = true;
  else if (type === 'k')
    format.average = true;

  return `€${numbro(value).format(format)}`;
}


/*Shorted Formatters*/

export const formatters = {
  default: value => value,

  /*All Date Formatters*/
  date: (value) => formatDate(value),
  addDays: value => addDays(value),
  addMonths: value => addMonths(value),
  addYears: value => addYears(value),
  dateTime: value => formatDatetime(value),
  serverDate: value => formatServerDate(value),
  serverDateTime: value => formatServerDatetime(value),

  /*All Value Formatters*/
  float: value => formatFloat(value),
  integer: value => formatInteger(value),
  thousands: value => formatThousands(value),
  thousandsNoPrecision: value => formatThousands(value, 0),

  /*All Percent Formatters*/
  percent: formatPercent,
  addPercent: value => addPercent(value),
  percentNoPrecision: value => formatPercent(value, 0),
  percentOnePrecision: value => formatPercent(value, 1),

  /*All Currency Formatters*/
  euroThousands: value => formatEuro(value),
  euroK: value => formatEuro(value, 'k')
}