import moment from "moment";
import { formatServerDate } from "./formatters";

export const today = () => {
  return new Date();
}

export const endOfMonth = (date, format = true) => {
  if (!date)
    return null
  let clonedDate = date.clone().endOf("month");
  if (format)
    clonedDate = formatServerDate(clonedDate);
  return clonedDate
}

export const getDifferenceInMonths = (difference, date = moment()) => {
  return date.clone().subtract(difference, 'months').endOf('month');
}


export function getDate(date) {
  if (!date)
    return moment();
  return moment(date);
}

export function isPast(dateString) {
  return moment(dateString).isBefore(moment(), 'day');
}

export function isPastOrToday(dateString) {
  return moment(dateString).isSameOrBefore(moment(), 'day');
}

export function isToday(dateString) {
  return moment().isSame(moment(dateString), 'day');
}

export function isFuture(dateString) {
  return moment(dateString).isAfter(moment(), 'day');
}

export function isAfter(date1, date2) {
  return moment(date1).isAfter(moment(date2), 'day');
}

export function isSameOrAfter(date1, date2) {
  return moment(date1).isSameOrAfter(moment(date2), 'day');
}

export function isTodayOrFuture(dateString) {
  return moment(dateString).isSameOrAfter(moment(), 'day');
}

export function dateDifference(dateString1, dateString2, unit = 'days') {
  return moment(dateString2).diff(moment(dateString1), unit)
}

export function fromNow(datetime) {
  return moment(datetime).fromNow();
}

