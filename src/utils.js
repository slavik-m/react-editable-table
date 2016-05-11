'use strict';
var React = require('react');

/**
 * Determines if at least one element in the object matches a truth test.
 *
 * @param {function(val, key)} pred Predicate function.
 * @param {object|array} obj
 * @return {boolean}
 */
function some(pred, obj) {
  var val;
  for (var key in obj) {
    if(~this.props.keys.indexOf(key)) {
      continue;
    }
    if(React.isValidElement(obj[key])) {
      val = obj[key].props.sortValue ? obj[key].props.sortValue.toLocaleLowerCase() : '';
      if (pred(val, key) === true) {
        return true;
      }
    }
    if (pred(obj[key], key) === true) {
      return true;
    }
  }
  return false;
}

/**
 * Creates a compare function with a property to sort on.
 *
 * @param {string} prop Property to sort.
 * @return {function(object, object)} Compare function.
 */
var sortByFn =
  function(prop)
  {return function(a, b)  {return a[prop] < b[prop] ? -1 : a[prop] > b[prop] ? 1 : 0;};};

/**
 * Creates a compare function with a number property to sort on.
 *
 * @param {string} prop Property to sort.
 * @return {function(object, object)} Compare function.
 */
var sortByNumberFn = function(prop) {
  return function(a, b)  {
    var aVal = a[prop] ? parseFloat(a[prop].replace(/[\s\$%,]/gm, ''), 10) : -Infinity,
      bVal = b[prop] ? parseFloat(b[prop].replace(/[\s\$%,]/gm, ''), 10) : -Infinity;
    return aVal - bVal;
  };
};

/**
 * Creates a compare function with a string property of ReactElement to sort on.
 *
 * @param {string} prop Property to sort.
 * @return {function(object, object)} Compare function.
 */
var sortByElementStringFn = function(prop) {
  return function(a, b) {
    var aVal = a[prop].props.sortValue ? a[prop].props.sortValue.toLowerCase() : '',
      bVal = b[prop].props.sortValue ? b[prop].props.sortValue.toLowerCase() : '';
    return aVal < bVal ? -1 : (aVal > bVal ? 1 : 0);
  };
};

/**
 * Creates a compare function with a number property of ReactElement to sort on.
 *
 * @param {string} prop Property to sort.
 * @return {function(object, object)} Compare function.
 */
var sortByElementNumberFn = function(prop) {
  return function(a, b) {
    var aVal = a[prop].props.sortValue ? parseFloat(a[prop].props.sortValue.replace(/[\s\$%,]/gm, ''), 10) : -Infinity,
      bVal = b[prop].props.sortValue ? parseFloat(b[prop].props.sortValue.replace(/[\s\$%,]/gm, ''), 10) : -Infinity;
    return aVal - bVal;
  };
};

/**
 * @param {object} sortBy Object containing `prop` and `order`.
 * @param {array} data Array to sort.
 * @param {string} type Field type.
 * @return {array} Sorted array.
 */
function sort(sortBy, data, type) {
  var sortedData;
  if (data.length === 0) {
    return [];
  }

  switch(type) {
    case 'ELEMENT_NUMBER':
      sortedData = data.sort(sortByElementNumberFn(sortBy.prop)); break;
    case 'ELEMENT_STRING':
      sortedData = data.sort(sortByElementStringFn(sortBy.prop)); break;
    case 'NUMBER':
      sortedData = data.sort(sortByNumberFn(sortBy.prop)); break;
    case 'STRING':
      sortedData = data.sort(sortByFn(sortBy.prop)); break;
    default:
      sortedData = data.sort(sortByFn(sortBy.prop)); break;
  }
  if (sortBy.order === 'descending') {
    sortedData.reverse();
  }
  return sortedData;
}

/**
 * @param {!object} filters
 * @param {!array} data
 * @return {function(*, string)} Function to be executed for each entry in data.
 */
function filterPass(filters, data) {
  return (filterValue, key) => {
    var filterDef = filters[key];
    var partial = filterDef.filter.bind(null, filterValue);
    if (!filterDef.prop) {
      // Filter is for all properties
      return some.call(this, function(each)  {
        return partial(each);}, data);
    } else {
      // Filter is for one property
      return partial(data[filterDef.prop]);
    }
  };
}

/**
 * Example of filter and filterValues.
 * filters = { globalSearch: { filter: containsIgnoreCase } }
 * filterValues = { globalSearch: 'filter value' }
 *
 * @param {object} filters Definition of the filters.
 * @param {object} filterValues Values of the filters.
 * @param {array} data Array to filter.
 * @return {array} Filtered array.
 */
function filter(filters, filterValues, data) {
  var filterFunc = filterPass.bind(this, filters);
  return data.filter(each => {return some.call(this, filterFunc(each), filterValues);});
}

module.exports = {filter:filter, filterPass:filterPass, sort:sort, sortByFunc: sortByFn, some:some};
