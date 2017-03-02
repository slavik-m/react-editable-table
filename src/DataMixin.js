'use strict';

var { sort, filter } = require('./utils');
var _ = require('lodash');

var containsIgnoreCase = function(a, b) {
  a = (a + '').toLowerCase().trim();
  b = (b + '').toLowerCase().trim();
  return b.indexOf(a) >= 0;
};

function setUKeys(data) {
  return _.cloneDeep(data).map(item => {
    item.ukey = _.uniqueId();
    return item;
  });
}

function removeUKeys(data) {
  return _.cloneDeep(data).map(item => {
    delete item.ukey;
    // TODO: checked
    delete item.checked;
    return item;
  });
}

module.exports = {

  getInitialState() {
    // var data = this.convertFromArray(this.props.initialData);
    var itemKeys = this.props.columns.map(item => item.prop);
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
    var {filterValues, sortBy} = this.state;
    var {initialData, filters} = nextProps;

    // var newInitialData = this.convertFromArray(initialData);

    var newInitialData = setUKeys(initialData);

    if(this.state.filterValues.globalSearch) {
      var newData = filter.call(this, filters, filterValues, newInitialData);
      // newData = sort(sortBy, newData);
      this.setState({
        data: newData,
        stateCache: newInitialData,
        filterValues: filterValues,
        // currentPage: 0
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

  handleChange(col, row, val) {
    const index = _.findIndex(this.state.stateCache, function(item) { return item.ukey == row.ukey; });

    var prop = col.prop;
    row[prop] = val;

    if(index !== -1) {
      this.state.stateCache.splice(index, 1, row);
    }

    // const data = _.merge(this.props.initialData, this.state.data);

    if(prop !== "checked"){
      const data = removeUKeys(_.cloneDeep(this.state.stateCache));
      this.props.onChange(data);
    } else {
      // _.find(this.state.data, ['active', false]);
      /*this.setState({
        // data: this.state.stateCache,
        stateCache: this.state.stateCache.slice(0),
      }); */
    }

    // this.props.onChange(_.union(this.state.data, this.convertFromArray(this.props.initialData)));
    //console.log("onChange", col, row, val, this.convertToArray(this.state.data));
    //this.props.onChange(this.convertToArray(this.state.data));
    // this.props.onChange(_.union(this.convertToArray(this.state.data), this.props.initialData));
  },

  handleToggleCheckAll(flag) {
    // console.log('check all', this.state.data);
    // console.log(this.buildPage());
    this.buildPage().data.forEach(item => {
      item.checked = !!flag;
      return item;
    });
    this.setState(this.state.data);
  },

  handleDelete() {
    _.remove(this.state.data, item => item.checked);
    _.remove(this.state.stateCache, item => item.checked);
    this.props.onChange(removeUKeys(this.state.stateCache));
  },

  handleAdd() {
    var { initialData } = _.clone(this.state);
    var newObj = { ukey: Date.now()};
    this.state.itemKeys.forEach(key => {
      var col = _.find(this.props.columns, (item) => item.prop === key);
      newObj[key] = col.defaultValue || '';
    });
    initialData.unshift(newObj);

    this.setState({
      data: initialData,
      filterValues: {
        globalSearch: ''
      }
    });

    // this.props.onChange(removeUKeys(initialData));
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
