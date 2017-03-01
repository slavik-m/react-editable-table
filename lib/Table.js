'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var getEditorByType = require('./editors/getEditorByType');

var simpleGet = function simpleGet(key) {
  return function (data) {
    return data[key];
  };
};
var keyGetter = function keyGetter(keys) {
  return function (data) {
    return keys.map(function (key) {
      return data[key];
    });
  };
};

var isEmpty = function isEmpty(value) {
  return value === undefined || value === null || value === '';
};
var _ = require('lodash');

var getCellValue = function getCellValue(_ref, row) {
  var prop = _ref.prop,
      defaultContent = _ref.defaultContent,
      render = _ref.render;
  return (
    // Return `defaultContent` if the value is empty.
    !isEmpty(prop) && isEmpty(row[prop]) ? defaultContent :
    // Use the render function for the value.
    render ? render(row[prop], row) :
    // Otherwise just return the value.
    row[prop]
  );
};

var getCellClass = function getCellClass(_ref2, row) {
  var prop = _ref2.prop,
      className = _ref2.className;
  return !isEmpty(prop) && isEmpty(row[prop]) ? 'empty-cell' : typeof className === 'function' ? className(row[prop], row) : className;
};

function buildSortProps(col, sortBy, onSort) {
  var order = sortBy.prop === col.prop ? sortBy.order : 'none';
  var nextOrder = order === 'ascending' ? 'descending' : 'ascending';
  var sortEvent = onSort.bind(null, { prop: col.prop, order: nextOrder });

  return {
    'onClick': sortEvent,
    // Fire the sort event on enter.
    'onKeyDown': function onKeyDown(e) {
      if (e.keyCode === 13) sortEvent();
    },
    // Prevents selection with mouse.
    'onMouseDown': function onMouseDown(e) {
      return e.preventDefault();
    },
    'tabIndex': 0,
    'aria-sort': order,
    'aria-label': col.title + ': activate to sort column ' + nextOrder
  };
}

var Cell = React.createClass({
  displayName: 'Cell',
  getInitialState: function getInitialState() {
    return {
      edit: false,
      focused: false
    };
  },
  handleChange: function handleChange(value) {
    var _props = this.props,
        col = _props.col,
        row = _props.row;

    this.props.onChange(col, row, value);
    this.state.focused = false;
  },
  handleCancel: function handleCancel() {
    this.state.edit = false;
    this.state.focused = false;
    this.setState(this.state);
  },
  handleCellClick: function handleCellClick() {
    this.state.edit = true;
    this.setState(this.state);
  },
  handleKeyUp: function handleKeyUp(ev) {
    if (ev.keyCode === 13 && this.state.focused) {
      this.state.edit = true;
      this.setState(this.state);
    }
  },
  handleFocus: function handleFocus() {
    this.state.focused = true;
    this.setState(this.state);
  },
  handleBlur: function handleBlur() {
    this.state.focused = false;
    this.setState(this.state);
  },
  render: function render() {
    var _props2 = this.props,
        col = _props2.col,
        row = _props2.row;

    var Editor = getEditorByType(col.editor.type);

    return React.createElement(
      'td',
      {
        tabIndex: 0,
        className: getCellClass(col, row),
        onClick: this.handleCellClick,
        onFocus: this.handleFocus,
        onBlur: this.handleBlur,
        onKeyUp: this.handleKeyUp
      },
      !this.state.edit ? getCellValue(col, row) : React.createElement(Editor, {
        editor: col.editor,
        value: row[col.prop],
        col: col,
        row: row,
        onChange: this.handleChange,
        onCancel: this.handleCancel
      })
    );
  }
});

var Table = React.createClass({
  displayName: 'Table',


  propTypes: {
    keys: React.PropTypes.oneOfType([React.PropTypes.arrayOf(React.PropTypes.string), React.PropTypes.string]).isRequired,
    columns: React.PropTypes.arrayOf(React.PropTypes.shape({
      title: React.PropTypes.string.isRequired,
      prop: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
      render: React.PropTypes.func,
      sortable: React.PropTypes.bool,
      defaultContent: React.PropTypes.string,
      width: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
      className: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.func])
    })).isRequired,
    dataArray: React.PropTypes.arrayOf(React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.object])).isRequired,
    buildRowOpts: React.PropTypes.func,
    sortBy: React.PropTypes.shape({
      prop: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
      order: React.PropTypes.oneOf(['ascending', 'descending'])
    }),
    onSort: React.PropTypes.func,
    onChange: React.PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      buildRowOpts: function buildRowOpts() {
        return {};
      },
      sortBy: {}
    };
  },
  componentDidMount: function componentDidMount() {
    // If no width was specified, then set the width that the browser applied
    // initially to avoid recalculating width between pages.
    for (var i = 0; i < this.props.columns.length; i++) {
      var thDom = this.refs['th-' + i].getDOMNode();
      if (!thDom.style.width) {
        thDom.style.width = thDom.offsetWidth + 'px';
      }
    }
  },
  setError: function setError(target) {
    target.classList.add('error');
  },
  handleCellClick: function handleCellClick(col, row, ev) {
    ev.target.classList.remove('empty-cell');
    var Editor = getEditorByType(col.editor.type);

    React.render(React.createElement(Editor, {
      editor: col.editor,
      value: row[col.prop],
      col: col,
      row: row,
      target: ev.target,
      onChange: this.handleChange,
      onCancel: this.handleCancel }), ev.target);
  },
  handleChange: function handleChange(col, row, val) {
    if (col.hasOwnProperty('validation')) {
      if (col.validation.test(val)) {
        target.classList.remove('error');
        this.props.onChange(col, row, val);
      } else {
        this.setError(target);
      }
    } else {
      this.props.onChange(col, row, val);
    }
  },
  handleDelete: function handleDelete() {
    this.props.onDelete();
  },
  handleAdd: function handleAdd() {
    this.props.onAdd();
  },
  handleCheck: function handleCheck(row, ev) {
    this.props.onChange({ prop: 'checked' }, row, ev.target.checked);
  },
  handleCheckAll: function handleCheckAll(ev) {
    this.props.onToggleCheckAll(ev.target.checked);
  },
  isCheckedAll: function isCheckedAll() {
    return _.every(this.props.dataArray, { checked: true });
  },
  render: function render() {
    var _this = this;

    var _props3 = this.props,
        columns = _props3.columns,
        keys = _props3.keys,
        buildRowOpts = _props3.buildRowOpts,
        sortBy = _props3.sortBy,
        onSort = _props3.onSort;


    var headers = columns.map(function (col, idx) {
      var sortProps, order;
      // Only add sorting events if the column has a property and is sortable.
      if (col.sortable !== false && 'prop' in col) {
        sortProps = buildSortProps(col, sortBy, onSort);
        order = sortProps['aria-sort'];
      }

      return React.createElement(
        'th',
        _extends({
          ref: 'th-' + idx,
          key: idx,
          style: { width: col.width },
          role: 'columnheader',
          scope: 'col'
        }, sortProps),
        React.createElement(
          'span',
          null,
          col.title
        ),
        typeof order !== 'undefined' ? React.createElement('span', { className: 'sort-icon sort-' + order, 'aria-hidden': 'true' }) : null
      );
    });

    var getKeys = Array.isArray(keys) ? keyGetter(keys) : simpleGet(keys);
    var rows = this.props.dataArray.map(function (row, r) {
      return React.createElement(
        'tr',
        _extends({ key: getKeys(row) }, buildRowOpts(row), { className: 'data-tr' }),
        React.createElement(
          'td',
          { key: r, className: 'checkbox-td' },
          React.createElement(
            'div',
            { className: 'checkbox-container' },
            React.createElement('input', { id: 'check' + r, className: 'checkbox', type: 'checkbox', checked: row.checked,
              onChange: _this.handleCheck.bind(_this, row) }),
            React.createElement('label', { htmlFor: 'check' + r })
          )
        ),
        columns.map(function (col, i) {
          var edit = col.hasOwnProperty('editable') ? col.editable : true;
          return edit ? React.createElement(Cell, {
            key: i,
            ref: i + getCellValue(col, row),
            className: getCellClass(col, row),
            col: col,
            row: row,
            onChange: _this.handleChange
          }) : React.createElement(
            'td',
            { key: i,
              ref: i + getCellValue(col, row),
              className: getCellClass(col, row) },
            getCellValue(col, row)
          );
        })
      );
    });

    var style = {
      position: 'absolute',
      width: 'calc(100% + 40px)',
      height: '100%',
      left: '-40px'
    };
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'table-controls' },
        React.createElement(
          'button',
          { className: 'btn btn-primary btn-sm opt-btn', onClick: this.handleAdd },
          '+'
        ),
        React.createElement(
          'button',
          { className: 'btn btn-danger btn-sm opt-btn', onClick: this.handleDelete },
          '-'
        )
      ),
      React.createElement(
        'table',
        { className: this.props.className },
        React.createElement(
          'caption',
          { className: 'sr-only', role: 'alert', 'aria-live': 'polite' },
          'Sorted by ' + sortBy.prop + ': ' + sortBy.order + ' order'
        ),
        React.createElement(
          'thead',
          null,
          React.createElement(
            'tr',
            null,
            React.createElement(
              'th',
              { className: 'checkbox-th' },
              React.createElement(
                'div',
                { className: 'checkbox-container' },
                React.createElement('input', { id: 'check-all', className: 'checkbox', type: 'checkbox', checked: this.isCheckedAll(),
                  onChange: this.handleCheckAll }),
                React.createElement('label', { htmlFor: 'check-all' })
              )
            ),
            headers
          )
        ),
        React.createElement(
          'tbody',
          null,
          rows.length > 0 ? rows : React.createElement(
            'tr',
            null,
            React.createElement(
              'td',
              { colSpan: columns.length + 1, className: 'text-center' },
              'No data'
            )
          )
        )
      )
    );
  }
});

module.exports = Table;