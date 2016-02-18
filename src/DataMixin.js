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
    if(this.state.filterValues.globalSearch) {
      var {filterValues, sortBy} = this.state;
      var {initialData, filters} = nextProps;

      var newData = filter(filters, filterValues, initialData);
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

  onSort(sortBy) {
    this.setState({
      sortBy: sortBy,
      data: sort(sortBy, this.state.data)
    });
  },

  onFilter(filterName, filterValue) {
    var {filterValues, sortBy} = this.state;
    var {initialData, filters} = this.props;

    filterValues[filterName] = filterValue;
    var newData = filter(filters, filterValues, initialData);
    newData = sort(sortBy, newData);
    this.setState({
      data: newData,
      filterValues: filterValues,
      currentPage: 0
    });
  },

  handleChange(col, row, val) {
    var { initialData } = _.clone(this.state);
    var index = _.indexOf(initialData, _.find(initialData, row)),
      prop = col.prop;

    var newRow = _.clone(row);
      newRow[prop] = val;

    initialData.splice(index, 1, newRow);

    this.setState({
      initialData: initialData
    }, () => {
      if(prop !== 'checked') {
        this.props.onChange(initialData.map(item => {
          delete item.checked;
          return item;
        }));
      }
    });
  },

  handleDelete() {
    var { initialData } = _.clone(this.state);
    _.remove(initialData, item => item.checked);

    this.setState({
      data: initialData
    }, () => {
      this.props.onChange(initialData.map(item => {
        delete item.checked;
        return item;
      }));
    });
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
