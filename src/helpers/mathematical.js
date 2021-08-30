import { isNumber } from "./formatters";
import {MathOp} from "./MathOp";

export function computeTotal(parameters, attr) {
  let total = 0;
  parameters.forEach(parameter => {
    const value = attr ? parameter[attr] : parameter;
    total = MathOp.add(total, parseFloat(value || 0))
  });
  return total;
}

/**
 * Get two array of objects and return the weightedSum base on given parameters
 * @param array1 {Array} - The first array of objects
 * @param entity1 {string} - The parameter to be considered on array1
 * @param array2 {Array} - The second array of objects
 * @param entity2 {string} - The parameter to be considered on array2
 * @param percent {boolean} - If true, the result will be divided by 100
 * @returns number - the weighted Sum
 */
export function weightedSum(array1, entity1, array2, entity2, percent = false) {
  let sum = 0;
  for (let index = 0; index < array1.length; index++) {
    sum += array1[index][entity1] * array2[index][entity2];
  }
  return percent ? MathOp.divide(sum, 100) : sum
}

export function roundValue(value, precision = 4) {
  if (!isNumber(value))
    return null;

  return Math.floor(parseFloat(value.toFixed(precision)));
}

export function round(value, precision = 4) {
  if (!isNumber(value))
    return null;
  const factor = Math.pow(10, precision);
  return Math.floor(value * factor) / factor;
}

export function balance(distribution, goal, precision) {
  if (distribution.length === 1) {
    return [goal];
  }

  // If all values are empty or zero, distribute equally
  let allEmpty = true;
  for (let value of distribution) {
    if (value !== '' && value !== 0) {
      allEmpty = false;
    }
  }

  let newDistribution;

  if (allEmpty) {
    newDistribution = distribution.map(() => round(goal / distribution.length, precision))
  } else {
    // Remove empty values
    distribution = distribution.map(value => value === '' ? 0 : value);

    // Reduce the distribution to the sum of its values
    const sum = distribution.reduce((sum, value) => sum + value, 0);
    // For each value in the distribution, get its percentage.
    const percentages = distribution.map(value => value / sum);
    // For each percentage, multiply the goal to get an equally distributed value.
    newDistribution = percentages.map(percentage => round(goal * percentage, precision));
  }

  // Make sure that the goal is met
  const newTotal = computeTotal(newDistribution);

  if (newTotal < goal)
    newDistribution[0] = MathOp.add(newDistribution[0], MathOp.subtract(goal, newTotal));

  return newDistribution;
}

export function balanceParameters(oldParameters, newParameters, attr, goal = 1, precision = 4) {
  const valuesToDistribute = [];
  const updatedIndexes = [];
  let updatedTotal = 0;
  newParameters.forEach((parameter, index) => {
    const oldParameter = oldParameters[index];
    const newValue = parameter[attr];

    // Treat the parameter as to be distributed if it wasn't changed or if it is new
    if (!oldParameter || oldParameter[attr] !== newValue) {
      updatedTotal += newValue;
      updatedIndexes.push(index);
    } else {
      valuesToDistribute.push(newValue);
    }
  });

  let finalParameters;
  // If all the parameters were updated or updated total exceeds 100, balance all
  if (updatedIndexes.length === newParameters.length || updatedTotal >= goal) {
    const newValues = balance(newParameters.map(p => p[attr]), goal, precision);
    finalParameters = newParameters.map((parameter, i) => ({...parameter, [attr]: newValues[i]}))
  }
  // Else, balance only not updated values
  else {
    const totalToDistribute = goal - updatedTotal;
    let currentIndex = 0;
    const newValues = balance(valuesToDistribute, totalToDistribute, precision);
    finalParameters = newParameters.map((parameter, i) => {
      return {
        ...parameter,
        // Set balanced value if not updated, else do nothing
        [attr]: (updatedIndexes.includes(i) ? parameter[attr] : newValues[currentIndex++])
      }
    })
  }
  return finalParameters;
}
