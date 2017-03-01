'use strict';

var React = require('react');
var Table = require('./Table');
var Pagination = require('./Pagination');
var SelectField = require('./SelectField');
var SearchField = require('./SearchField');
var Counter = require('./Counter');

var DataMixin = require('./DataMixin');

var DataTable = React.createClass({
  displayName: 'DataTable',


  mixins: [DataMixin],

  render: function render() {
    var page = this.buildPage();
    // const cols = this.props.columns.slice(0);
    // cols.unshift({title: '', prop: 'checked', sort: false, editable: false });
    return React.createElement(
      'div',
      { className: this.props.className },
      React.createElement(
        'div',
        { className: 'row table-options' },
        React.createElement(
          'div',
          { className: 'col-xs-4' },
          React.createElement(SelectField, {
            id: 'page-menu',
            label: 'Page size:',
            value: this.state.pageLength,
            options: this.props.pageLengthOptions,
            onChange: this.onPageLengthChange
          })
        ),
        React.createElement(
          'div',
          { className: 'col-xs-6 col-xs-offset-2' },
          React.createElement(SearchField, {
            id: 'search-field pull-right',
            ref: 'search',
            label: 'Search:',
            value: this.state.filterValues.globalSearch,
            searchIcon: this.props.searchIcon,
            searchBtnClass: this.props.searchBtnClass,
            onChange: this.onFilter.bind(this, 'globalSearch')
          })
        )
      ),
      React.createElement(Table, {
        className: 'table table-bordered editable-table',
        dataArray: page.data,
        columns: this.props.columns,
        keys: this.props.keys,
        sortBy: this.state.sortBy,
        onSort: this.onSort,
        onToggleCheckAll: this.handleToggleCheckAll,
        onChange: this.handleChange,
        onDelete: this.handleDelete,
        onAdd: this.handleAdd
      }),
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'div',
          { className: 'col-xs-4' },
          React.createElement(Counter, {
            showing: this.state.pageLength * page.currentPage + 1,
            to: this.state.pageLength * page.currentPage + page.data.length,
            count: this.state.data.length
          })
        ),
        React.createElement(
          'div',
          { className: 'col-xs-8' },
          React.createElement(Pagination, {
            className: 'pagination pull-right pagination-sm',
            currentPage: page.currentPage,
            totalPages: page.totalPages,
            onChangePage: this.onChangePage
          })
        )
      )
    );
  }
});

module.exports = DataTable;
/*
 <div className="row">
 <pre>
 <code>
 {JSON.stringify(this.state.data, null, "\t")}
 </code>
 </pre>
 </div>
 */