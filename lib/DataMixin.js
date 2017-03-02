'use strict';

var _require = require('./utils'),
    sort = _require.sort,
    filter = _require.filter;

var _ = require('lodash');

var containsIgnoreCase = function containsIgnoreCase(a, b) {
  a = (a + '').toLowerCase().trim();
  b = (b + '').toLowerCase().trim();
  return b.indexOf(a) >= 0;
};

function setUKeys(data) {
  return data.map(function (item) {
    item.ukey = _.uniqueId();
    return item;
  });
}

function removeUKeys(data) {
  return data.map(function (item) {
    delete item.ukey;
    // TODO: checked
    delete item.checked;
    return item;
  });
}

module.exports = {
  getInitialState: function getInitialState() {
    // var data = this.convertFromArray(this.props.initialData);
    var itemKeys = this.props.columns.map(function (item) {
      return item.prop;
    });
    var data = setUKeys(this.props.initialData);

    return {
      // Clone the initialData.
      data: data,
      initialData: data,
      stateCache: data,
      sortBy: this.props.initialSortBy,
      filterValues: {},
      currentPage: 0,
      itemKeys: itemKeys,
      pageLength: this.props.initialPageLength
    };
  },
  getDefaultProps: function getDefaultProps() {
    return {
      initialPageLength: 10,
      pageLengthOptions: [5, 10, 20],
      filters: {
        globalSearch: {
          filter: containsIgnoreCase
        }
      }
    };
  },
  componentWillMount: function componentWillMount() {
    // Do the initial sorting if specified.
    var _state = this.state,
        sortBy = _state.sortBy,
        data = _state.data;

    if (sortBy) {
      this.setState({ data: sort(sortBy, data) });
    }
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var _state2 = this.state,
        filterValues = _state2.filterValues,
        sortBy = _state2.sortBy;
    var initialData = nextProps.initialData,
        filters = nextProps.filters;

    // var newInitialData = this.convertFromArray(initialData);

    var newInitialData = setUKeys(initialData);

    if (this.state.filterValues.globalSearch) {
      var newData = filter.call(this, filters, filterValues, newInitialData);
      // newData = sort(sortBy, newData);
      this.setState({
        data: newData,
        stateCache: newInitialData,
        filterValues: filterValues
      });
    } else {
      this.setState({
        data: newInitialData,
        initialData: newInitialData,
        stateCache: newInitialData,
        // currentPage: 0,
        filterValues: {
          globalSearch: ''
        }
      });
    }
  },
  onSort: function onSort(sortBy, type) {
    this.setState({
      sortBy: sortBy,
      data: sort(sortBy, this.state.data, type)
    });
  },
  onFilter: function onFilter(filterName, filterValue) {
    var _state3 = this.state,
        filterValues = _state3.filterValues,
        sortBy = _state3.sortBy,
        data = _state3.data;
    var _props = this.props,
        initialData = _props.initialData,
        filters = _props.filters,
        columns = _props.columns;

    var type = _.find(columns, { 'prop': sortBy.prop }).type;
    // var newInitialData = this.convertFromArray(initialData);

    filterValues[filterName] = filterValue;
    var newData = filter.call(this, filters, filterValues, initialData);
    // newData = sort(sortBy, newData, type);
    // console.log("OnFilter", newData, "Cache", data.slice(0));

    this.setState({
      data: newData,
      stateCache: initialData.slice(0),
      filterValues: filterValues,
      currentPage: 0
    });
  },
  handleChange: function handleChange(col, row, val) {
    var index = _.findIndex(this.state.stateCache, function (item) {
      return item.ukey == row.ukey;
    });

    var prop = col.prop;
    row[prop] = val;

    if (index !== -1) {
      this.state.stateCache.splice(index, 1, row);
    }

    // const data = _.merge(this.props.initialData, this.state.data);

    if (prop !== "checked") {
      this.props.onChange(removeUKeys(this.state.stateCache));
    } else {}
    // _.find(this.state.data, ['active', false]);
    /*this.setState({
      // data: this.state.stateCache,
      stateCache: this.state.stateCache.slice(0),
    }); */


    // this.props.onChange(_.union(this.state.data, this.convertFromArray(this.props.initialData)));
    //console.log("onChange", col, row, val, this.convertToArray(this.state.data));
    //this.props.onChange(this.convertToArray(this.state.data));
    // this.props.onChange(_.union(this.convertToArray(this.state.data), this.props.initialData));
  },
  handleToggleCheckAll: function handleToggleCheckAll(flag) {
    // console.log('check all', this.state.data);
    // console.log(this.buildPage());
    this.buildPage().data.forEach(function (item) {
      item.checked = !!flag;
      return item;
    });
    this.setState(this.state.data);
  },
  handleDelete: function handleDelete() {
    _.remove(this.state.data, function (item) {
      return item.checked;
    });
    _.remove(this.state.stateCache, function (item) {
      return item.checked;
    });
    this.props.onChange(removeUKeys(this.state.stateCache));
  },
  handleAdd: function handleAdd() {
    var _this = this;

    var _$clone = _.clone(this.state),
        initialData = _$clone.initialData;

    var newObj = { ukey: Date.now() };
    this.state.itemKeys.forEach(function (key) {
      var col = _.find(_this.props.columns, function (item) {
        return item.prop === key;
      });
      newObj[key] = col.defaultValue || '';
    });
    initialData.unshift(newObj);

    this.setState({
      data: initialData,
      filterValues: {
        globalSearch: ''
      }
    });
  },


  // Pagination
  buildPage: function buildPage() {
    var _state4 = this.state,
        data = _state4.data,
        currentPage = _state4.currentPage,
        pageLength = _state4.pageLength;

    var start = pageLength * currentPage;
    return {
      data: data.slice(start, start + pageLength),
      currentPage: currentPage,
      totalPages: Math.ceil(data.length / pageLength)
    };
  },
  onChangePage: function onChangePage(pageNumber) {
    this.setState({ currentPage: pageNumber });
  },
  onPageLengthChange: function onPageLengthChange(value) {
    var newPageLength = +value;
    var _state5 = this.state,
        currentPage = _state5.currentPage,
        pageLength = _state5.pageLength;

    var newPage = Math.floor(currentPage * pageLength / newPageLength);

    this.setState({
      pageLength: newPageLength,
      currentPage: newPage
    });
  }
};