/* Value formatters */
import moment from "moment";
import FormatText from 'react-nl2br';
import { MathOp } from "./index";
import numbro from "numbro";
import { months } from "./utility";
// import { AUTH_STORE } from "../redux/auth/constants";

/*Date Constants*/
export const dateFormat = "MMM D, YYYY";
export const serverDateFormat = "YYYY-MM-DD";
export const datetimeFormatWithYear = "MMM D, YYYY, HH:mm";
export const datetimeFormatWithoutYear = "MMM D, HH:mm";

/*Validate Number*/
export function isNumber(value) {
  return value !== null && !isNaN(value);
}

/*Format Number Data Types*/
export function formatFloat(value) {
  return MathOp.divide(value, 100);
}

export function formatInteger(value) {
  return parseInt(value);
}

/*Format Percentage Values*/
export function formatPercent(value, precision = 2) {
  return isNumber(value) ? numbro(value).format({output: "percent", mantissa: precision}) : value
}

export function addPercent(value) {
  return value === null ? '-' : value.toFixed(2) + '%';
}


export function formatMillions(value, precision) {
  let finalSymbol = "";

//   const currency = AUTH_STORE.getCurrency();
//   if (currency && currency.symbol)
//     finalSymbol = currency.symbol;
//
//   return `${finalSymbol}${MathOp.divide(value, 1000000, precision)}m`;
}

export function isBillion(value) {
  return (value > 1000000 && MathOp.divide(value, 1000000000)) > 0.1;
}

export function isKType(value) {
  return (value > 100000 && value <= 500000)
}

/*Format Currencies*/
export function formatCurrency(value, type = 'thousands', precision = 2) {
  if (!isNumber(value))
    return value;

  let format = {mantissa: precision};

  if (type === 'thousands')
    format.thousandSeparated = true;
  else if (type === 'k')
    format.average = true;

  let finalSymbol = "";

  // const currency = AUTH_STORE.getCurrency();
  // if (currency && currency.symbol)
  //   finalSymbol = currency.symbol;
  //
  // return `${finalSymbol}${numbro(value).format(format)}`;
}

export function formatCurrencyShort(value, precision = 2) {
  /*Do not allow billion values,automatically format to million instead*/
  if (isBillion(value))
    return formatMillions(value, precision);

  if (isKType(value))
    return formatMillions(value, precision);

  return formatCurrency(value, 'k', precision);
}

/*Format Thousands Values*/
export function formatThousands(value, precision = 2) {
  return isNumber(value) ? numbro(value).format({thousandSeparated: true, mantissa: precision}) : value
}

export function formatZeroPrecision(value) {
  return formatThousands(value, 0)
}

/*Format Date Values*/
export function formatDate(date, format = "DD-MMM-YY") {
  return date ? moment(date).format(format) : null;
}

export function formatYears(value, precision = 1) {
  return formatThousands(value, precision) + ' yrs';
}

export function formatMonths(value, precision = 0) {
  return formatThousands(value, precision) + ' months';
}

export function formatMonthly(date) {
  let [month, year] = date.split('-');
  month = Number(month) - 1;
  year = Number(year);
  return `${months[month]},${year}`;
}

export function formatDays(days) {
  const str = days.toFixed(2);
  const finalDays = parseFloat(str);

  if (finalDays === 1)
    return `${finalDays} day`;
  else
    return `${finalDays} days`;
}

export function today(format = false) {
  const currentDate = new Date();
  if (format)
    return new Date(currentDate);
  return currentDate
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

/*Format String to line break*/
export const Text = (str) => {
  return FormatText(str);
};


export const formatters = {
  default: value => value,
  /*All Date Formatters*/
  date: (value) => formatDate(value),
  shortedDate: value => formatDate(value, "MMM-YY"),
  days: value => formatDays(value),
  months: value => formatMonths(value),
  years: value => formatYears(value),

  /*Server Formatter*/
  formatServerDate: value => formatServerDate(value),

  /*All Currency Formatters*/
  currency: value => formatCurrency(value),
  currencyNoPrecision: value => formatCurrency(value, 'thousands', 0),
  currencyShorted: value => formatCurrencyShort(value),

  /*All Value Formatters*/
  thousands: value => formatThousands(value),
  thousandsShorted: value => formatZeroPrecision(value),

  /*All Percent Formatters*/
  percent: formatPercent,
  percentNoPrecision: value => formatPercent(value, 0),
  percentOnePrecision: value => formatPercent(value, 1),
  addPercent: value => addPercent(value)
}
