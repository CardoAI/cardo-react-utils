import MinusOutlined from "@ant-design/icons/lib/icons/MinusOutlined";
import React from "react";
import clone from "clone"

export const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];

/*Check Validity of values*/
export function hasValue(item) {
    return item !== null && item !== undefined;
}

export function validateValue(value, format, callbackUI = <MinusOutlined/>) {
    const check = value !== undefined && value !== null && value !== "";
    return check ? format ? format(value) : value : callbackUI
}

/* Get value from event*/
export function extractValue(event) {
    return (event && typeof event === 'object') ? event.target.value : event;
}

export const stopPropagation = event => event.stopPropagation();

/*---Objects---*/

/*Check if Array or Object is Empty*/
export function isEmpty(object) {

    if (!hasValue(object))
        return true;
    if (Array.isArray(object))
        return object.length === 0;
    else
        return Object.keys(object).length === 0;
}

/**
 * Get an object with the differences between two objects
 * @param oldObject
 * @param newObject
 * @param skipKeys - An array of keys that should not be compared
 * @returns {object} - An object containing the properties of newObject that are different from oldObject
 *                     or false if no differences were found
 */
export function getDifferences(oldObject, newObject, skipKeys = []) {
    let difference = {};

    Object.keys(oldObject).forEach(key => {
        if (!skipKeys.includes(key) && JSON.stringify(oldObject[key]) !== JSON.stringify(newObject[key]))
            difference[key] = newObject[key]
    });

    return isEmpty(Object.keys(difference)) ? false : difference;
}

/*Check if object has keys*/
export function isEmptyObject(obj) {
    for (let prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}

/*Find record by ID in an object*/
export function findById(data, id) {
    return data.find(rec => rec.id === id);
}

/*
  Get a nested value, checking in each step if the attribute exists
 */
export function getNested(object, ...attributes) {
    if (!object)
        return undefined;

    let current = object;
    for (let attr of attributes) {
        if (!current.hasOwnProperty(attr))
            return undefined;
        current = current[attr];
    }
    return current;
}

/**
 * Assign some values to the object of a deeply nested attribute. Create the intermediate objects if necessary
 * @param object - The original object
 * @param attributes - The list of attributes to reach the nested object
 * @param valuesObj - Object containing the values to be assigned
 */
export function setNested(object, attributes, valuesObj) {
    let current = object;

    for (let attr of attributes.slice(0, attributes.length - 1)) {
        if (!current.hasOwnProperty(attr))
            current[attr] = {};
        current = current[attr];
    }
    const lastAttribute = attributes[attributes.length - 1];
    assign(current, lastAttribute, valuesObj);
}

/**
 * Assign a value to an inner object or initialize it if not defined
 */
export function assign(object, attr, valuesObj) {
    if (object[attr])
        Object.assign(object[attr], valuesObj);
    else
        object[attr] = valuesObj;
}

export function getRecordsUpdates(originalRecords, editedRecords) {
    const updates = {};

    editedRecords.forEach(editedRecord => {
        // Created
        if (!editedRecord.id) {
            pushToInnerArray(updates, "created", editedRecord);
        } else {
            const originalRecord = findById(originalRecords, editedRecord.id);
            const differences = getDifferences(originalRecord, editedRecord);
            // Updated
            if (differences)
                pushToInnerArray(updates, "updated", {
                    id: editedRecord.id,
                    ...differences
                });
        }
    });

    // Find deleted
    originalRecords.forEach(originalRecord => {
        if (!findById(editedRecords, originalRecord.id))
            pushToInnerArray(updates, "deleted", originalRecord.id);
    });

    return !isEmpty(updates) ? updates : null;
}

export function splitRecords(data, maxEntries) {
    let allRecords = [];
    let tmpRecords = [];
    let initialIndex = null;
    let availableEntries = null;
    data.forEach((entry, index) => {
        if (initialIndex === null) {
            initialIndex = index;
            availableEntries = maxEntries;
            while (initialIndex + availableEntries > data.length) {
                availableEntries--;
            }
        }
        tmpRecords.push(entry);
        if (tmpRecords.length === availableEntries) {
            allRecords.push(tmpRecords);
            tmpRecords = [];
            initialIndex = null;
        }
    });
    return allRecords;
}

export function getFirstId(records) {
    if (!isEmpty(records))
        return records[0].id;
    return null
}

/*---Arrays---*/
/*Copy Arrays*/
export const copyArray = (records) => {
    return clone(records)
}

/*Check if Arrays are Equal*/
export function equalArrays(array1, array2) {
    array1.sort();
    array2.sort();
    if (array1.length !== array2.length)
        return false;
    for (let index = 0; index < array1.length; index++)
        if (array1[index] !== array2[index])
            return false;
    return true;
}

export function getArrayDifferences(oldArray, newArray, idAttr = 'id', skipKeys = [],) {
    const differences = [];

    oldArray.forEach((element, index) => {
        const difference = getDifferences(element, newArray[index], skipKeys);
        if (difference)
            differences.push({[idAttr]: element[idAttr], ...difference});
    });

    return isEmpty(differences) ? false : differences;
}

export function removeFromArray(array, element) {
    array.splice(array.indexOf(element), 1);
}

/*Get Last Element in an Array*/
export function last(array) {
    return array[array.length - 1]
}

export function pushToInnerArray(object, arrayAttr, value) {
    if (object[arrayAttr])
        object[arrayAttr].push(value);
    else
        object[arrayAttr] = [value]
}

export function range(start, end, step = 1) {
    const array = [];
    let current = start;
    while (current < end) {
        array.push(current);
        current += step;
    }
    return array;
}

export function getRange(range, type) {
    return type === 'min' ? range[0] : range[1];
}

export function sort(values, key) {
    if (key) {
        values.sort((a, b) => +b[key] - +a[key]);
    } else {
        values.sort((a, b) => +b - +a);
    }
}

export function sum(values, key) {
    let s, i, n;

    for (s = 0, i = 0, n = values.length; i < n; ++i) {
        s += key ? +values[i][key] : +values[i];
    }

    return s;
}


export function stringify(value) {
    if (!value)
        return value;

    return value.toString();
}


export function getRandomKey(length = 6) {
    let randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (var i = 0; i < length; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}
