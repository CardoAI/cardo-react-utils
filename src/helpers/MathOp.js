import Big from 'big-js';
import { isNumber } from "./formatters";

function areValid(num1, num2) {
  return !(num1 === null || num1 === undefined || num1 === '' || num2 === null || num2 === undefined || num2 === '');
}

function add(num1, num2) {
  if (!areValid(num1, num2))
    return null;
  const result = new Big(num1).plus(num2).toString();
  return parseFloat(result);
}

function subtract(num1, num2) {
  if (!areValid(num1, num2))
    return null;

  const result = new Big(num1).minus(num2).toString();

  return parseFloat(result);
}

function multiply(num1, num2, toFixed) {
  if (!areValid(num1, num2))
    return null;

  const result = new Big(num1).times(num2).toFixed(toFixed);

  return parseFloat(result);
}

function divide(num1, num2, toFixed) {
  if (!areValid(num1, num2))
    return null;

  const result = new Big(num1).div(num2).toFixed(toFixed);

  return parseFloat(result);
}

export function round(value, precision = 4) {
  // return Math.floor(parseFloat(value.toFixed(precision)));
  if (!isNumber(value))
    return null;

  const factor = Math.pow(10, precision);
  return Math.floor(value * factor) / factor;
}

export const MathOp =  {
  add,
  round,
  subtract,
  multiply,
  divide
};