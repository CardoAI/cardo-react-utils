import moment from "moment";
import { formatServerDate } from "./formatters";

/**
 * Helper function that returns an instance of today's date
 */
export const today = () => {
  return new Date();
}

/**
 * Returns the end of the month for the date entered and also optionally formatted for backend
 */
export const endOfMonth = (date, format = true) => {
  if (!date)
    return null;
  let clonedDate = date.clone().endOf("month");
  if (format)
    clonedDate = formatServerDate(clonedDate);
  return clonedDate;
}

/**
 * Returns the end of month date for the previous month passed as argument starting from today's date or another one
 */
export const getPreviousEndOfMonth = (previous, date = moment()) => {
  return date.clone().subtract(previous, 'months').endOf('month');
}


/**
 * Returns the difference in days by default between 2 dates
 */
export function getDifferenceOfDates(dateString1, dateString2, unit = 'days') {
  return moment(dateString2).diff(moment(dateString1), unit)
}

/**
 * Returns the date as a moment instance
 */
export function getDateAsMoment(date) {
  if (!date)
    return moment();
  return moment(date);
}

/**
 * Returns true if the date is before today's date
 */
export function isPast(dateString) {
  return moment(dateString).isBefore(moment(), 'day');
}

/**
 * Returns true if the date is before or same as today's date
 */
export function isPastOrToday(dateString) {
  return moment(dateString).isSameOrBefore(moment(), 'day');
}

/**
 * Returns true if the date is the same as today's date
 */
export function isToday(dateString) {
  return moment().isSame(moment(dateString), 'day');
}

/**
 * Returns true if the date is after today's date
 */
export function isFuture(dateString) {
  return moment(dateString).isAfter(moment(), 'day');
}

/**
 * Compares two dates and returns true if the first date is after the second one
 */
export function isAfter(date1, date2) {
  return moment(date1).isAfter(moment(date2), 'day');
}

/**
 * Compares two dates and returns true if the first date is the same or after the second date
 */
export function isSameOrAfter(date1, date2) {
  return moment(date1).isSameOrAfter(moment(date2), 'day');
}

/**
 * Returns true if the date is the same or after today's date
 */
export function isTodayOrFuture(dateString) {
  return moment(dateString).isSameOrAfter(moment(), 'day');
}

/**
 * Returns true if the two dates provided are the same
 */
export function sameDate(date1, date2) {
  return moment(date1).isSame(date2, 'day')
}

/**
 * Returns the time passed since the date used as an argument
 */
export function fromNow(datetime) {
  return moment(datetime).fromNow();
}

/**
 * Returns an array with dates between the two dates provided as arguments
 */
export function getDatesBetween(firstDate, lastDate) {

  const currentDate = moment(firstDate).startOf('day');
  const finalDate = moment(lastDate).startOf('day');

  const dates = [currentDate.clone()];

  while (currentDate.add(1, 'days').diff(finalDate) < 0) {
    dates.push(currentDate.clone());
  }

  dates.push(finalDate.clone());

  return dates;
}

/**
 * Get Month Label from month index
 */
export function getMonthLabel(monthIndex, format = "MMM") {
  return moment().month(monthIndex).format(format);
}