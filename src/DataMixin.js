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
    var data = this.props.initialData.slice(0);
    var itemKeys = this.props.columns.map(item => item.prop);
    // if()
    return {
      // Clone the initialData.
      data: data,
      initialData: data,
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
    if(this.state.filterValues.globalSearch) {
      var {filterValues, sortBy} = this.state;
      var {initialData, filters} = nextProps;

      var newData = filter.call(this, filters, filterValues, initialData);
      newData = sort(sortBy, newData);
      this.setState({
        data: newData,
        filterValues: filterValues,
        currentPage: 0
      });
    } else {
      this.setState({
        data: nextProps.initialData,
        initialData: nextProps.initialData,
        currentPage: 0,
        filterValues: {
          globalSearch: ''
        }
      });
    }
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

    filterValues[filterName] = filterValue;
    var newData = filter.call(this, filters, filterValues, initialData);
    newData = sort(sortBy, newData, type);

    this.setState({
      data: newData,
      filterValues: filterValues,
      currentPage: 0
    });
  },

  handleChange(col, row, val) {
    var prop = col.prop;
    row[prop] = val;
    this.props.onChange(this.state.data);
  },

  handleDelete() {
    _.remove(this.state.data, item => item.checked);
    this.props.onChange(this.state.data);
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
