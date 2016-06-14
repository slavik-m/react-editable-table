'use strict';

var { sort, filter } = require('./utils');
var _ = require('lodash');

var containsIgnoreCase = function(a, b) {
  a = (a + '').toLowerCase().trim();
  b = (b + '').toLowerCase().trim();
  return b.indexOf(a) >= 0;
};

module.exports = {

  getInitialState() {
    var data = this.convertFromArray(this.props.initialData);
    var itemKeys = this.props.columns.map(item => item.prop);

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

  getDefaultProps() {
    return {
      initialPageLength: 10,
      pageLengthOptions: [ 5, 10, 20 ],
      filters: {
        globalSearch: {
          filter: containsIgnoreCase
        }
      }
    };
  },

  componentWillMount() {
    // Do the initial sorting if specified.
    var {sortBy, data} = this.state;
    if (sortBy) {
      this.setState({ data: sort(sortBy, data) });
    }
  },

  componentWillReceiveProps(nextProps) {
    if(_.isEqual(this.props, nextProps)) {
      return;
    }
    var {filterValues, sortBy} = this.state;
    var {initialData, filters} = nextProps;

    var newInitialData = this.convertFromArray(initialData);

    if(this.state.filterValues.globalSearch) {
      var newData = filter.call(this, filters, filterValues, newInitialData);
      // newData = sort(sortBy, newData);
      this.setState({
        data: newData,
        stateCache: newInitialData,
        filterValues: filterValues,
        currentPage: 0
      });
    } else {
      this.setState({
        data: newInitialData,
        initialData: newInitialData,
        stateCache: newInitialData,
        currentPage: 0,
        filterValues: {
          globalSearch: ''
        }
      });
    }
  },

  convertFromArray (data) {
    if(this.props.dataType === "ARRAY" && this.props.dataScheme.length === 1) {
      return data.map(item => {
        return {
          [this.props.dataScheme[0]]: item,
          ukey: _.uniqueId()
        }
      });
    }
    return data;
  },

  convertToArray (data) {
    return data.map(item => {
      return item[this.props.dataScheme[0]]
    });
  },

  onSort(sortBy, type) {
    this.setState({
      sortBy: sortBy,
      data: sort(sortBy, this.state.data, type)
    });
  },

  onFilter(filterName, filterValue) {
    var {filterValues, sortBy, data} = this.state;
    var {initialData, filters, columns} = this.props;
    var type = _.find(columns, { 'prop': sortBy.prop }).type;
    var newInitialData = this.convertFromArray(initialData);

    filterValues[filterName] = filterValue;
    var newData = filter.call(this, filters, filterValues, newInitialData);
    // newData = sort(sortBy, newData, type);
    // console.log("OnFilter", newData, "Cache", data.slice(0));

    this.setState({
      data: newData,
      stateCache: data.slice(0),
      filterValues: filterValues,
      currentPage: 0
    });
  },

  handleChange(col, row, val) {
    var prop = col.prop;
    row[prop] = val;

    if(prop !== "checked"){
      this.props.onChange(this.convertToArray(this.state.data));
    } else {
      // _.find(this.state.data, ['active', false]);
      this.setState(this.state.data);
    }

    // this.props.onChange(_.union(this.state.data, this.convertFromArray(this.props.initialData)));
    //console.log("onChange", col, row, val, this.convertToArray(this.state.data));
    //this.props.onChange(this.convertToArray(this.state.data));
    // this.props.onChange(_.union(this.convertToArray(this.state.data), this.props.initialData));
  },

  handleDelete() {
    _.remove(this.state.data, item => item.checked);
    _.remove(this.state.stateCache, item => item.checked);
    this.props.onChange(this.convertToArray(this.state.stateCache));
  },

  handleAdd() {
    var { initialData } = _.clone(this.state);
    var newObj = { ukey: Date.now()};
    this.state.itemKeys.forEach(key => {
      newObj[key] = '';
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
  buildPage() {
    var {data, currentPage, pageLength} = this.state;
    var start = pageLength * currentPage;
    return {
      data: data.slice(start, start + pageLength),
      currentPage: currentPage,
      totalPages: Math.ceil(data.length / pageLength)
    };
  },

  onChangePage(pageNumber) {
    this.setState({ currentPage: pageNumber });
  },

  onPageLengthChange(value) {
    var newPageLength = +value;
    var {currentPage, pageLength} = this.state;
    var newPage = Math.floor((currentPage * pageLength) / newPageLength);

    this.setState({
      pageLength: newPageLength,
      currentPage: newPage
    });
  }

};
