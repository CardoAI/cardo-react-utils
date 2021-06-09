import React from "react";
//External Libs
import clone from "clone";
import queryString from "query-string";
//Custom Components
import { Select } from "antd";
// import settings from "../settings";
import { hasValue } from "./index";

export const renderOptions = (options, key = "id", attr = "name", appendAll = true) => {
  const prepareOption = (key, value) => {
    return (
      <Select.Option key={key}>
        {value}
      </Select.Option>
    )
  };

  const totalOptions = [];

  if (appendAll)
    totalOptions.push(prepareOption("all", "All"));

  options.forEach(option => {
    let optionName = option[attr];
    const optionKey = option[key];

    if (attr === "name" && typeof optionName !== "string")
      optionName = option.selectionName;

    totalOptions.push(prepareOption(optionKey, optionName))
  });

  return totalOptions;
};

export function filterSelectOptions(input, option) {
  return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
}

export const getPopupContainer = trigger => trigger.parentNode;

export const generateUrl = (endpoint, queryParams) => {
  return endpoint + "/?" + queryString.stringify(queryParams);
};

export const getUrl = (apiUrl, url) => {
  return apiUrl + url;
};

export function makeUrl(string) {
  if (!string.startsWith('http'))
    string = "http://" + string;
  return string;
}

export const sortRecords = (key, reverse) => {
  const moveSmaller = reverse ? 1 : -1;
  const moveLarger = reverse ? -1 : 1;

  return (a, b) => {
    // equal items sort equally
    if (a[key] === b[key])
      return 0;

    if (a[key] < b[key]) {
      return moveSmaller;
    }
    if (a[key] > b[key]) {
      return moveLarger;
    }
    return 0;
  };
};

export function prepend(label, string, separator = "_") {
  return `${label}${separator}${string}`
}

export function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.substring(1);
}

export function humanString(string) {
  if (!hasValue(string))
    return "";
  const words = string.match(/[A-Za-z][a-z]*/g) || [];
  return words.map(capitalize).join(" ");
}

export function chunkArray(input, chunk = 2) {
  return input.reduce((resultArray, item, index) => {
    const newRecord = clone(item);
    const chunkIndex = Math.floor(index / chunk)

    if (!resultArray[chunkIndex])
      resultArray[chunkIndex] = [] // start a new chunk

    resultArray[chunkIndex].push(newRecord)

    return resultArray
  }, [])
}

