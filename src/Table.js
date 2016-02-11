'use strict';

var React = require('react');

var simpleGet = key => data => data[key];
var keyGetter = keys => data => keys.map(key => data[key]);

var isEmpty = value => value === undefined || value === null || value === '';

var getCellValue =
  ({ prop, defaultContent, render }, row) =>
    // Return `defaultContent` if the value is empty.
    !isEmpty(prop) && isEmpty(row[prop]) ? defaultContent :
      // Use the render function for the value.
      render ? render(row[prop], row) :
        // Otherwise just return the value.
        row[prop];

var getCellClass =
  ({ prop, className }, row) =>
    !isEmpty(prop) && isEmpty(row[prop]) ? 'empty-cell' :
      typeof className === 'function' ? className(row[prop], row) :
        className;

function buildSortProps(col, sortBy, onSort) {
  var order = sortBy.prop === col.prop ? sortBy.order : 'none';
  var nextOrder = order === 'ascending' ? 'descending' : 'ascending';
  var sortEvent = onSort.bind(null, {prop: col.prop, order: nextOrder});

  return {
    'onClick': sortEvent,
    // Fire the sort event on enter.
    'onKeyDown': e => {
      if (e.keyCode === 13) sortEvent();
    },
    // Prevents selection with mouse.
    'onMouseDown': e => e.preventDefault(),
    'tabIndex': 0,
    'aria-sort': order,
    'aria-label': `${col.title}: activate to sort column ${nextOrder}`
  };
}

var EditInput = React.createClass({
  getInitialState() {
    return {
      value: this.props.value
    }
  },

  componentDidMount() {
    this.getDOMNode().focus();
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value
    });
  },

  handleChange(ev) {
    this.setState({
      value: ev.target.value
    });
  },

  handleFocus(ev) {
    ev.target.focus();
    var length = ev.target.value.length;
    ev.target.setSelectionRange(length, length);
  },

  handleSave(ev) {
    this.props.onChange(this.props.col, this.props.row, this.state.value, this.props.target);
  },

  handleKeyUp(ev) {
    if (ev.keyCode === 13) {
      this.handleSave(ev);
    }
    if (ev.keyCode === 27) {
      // console.log("Cancel");
    }
  },

  render() {
    return (
      <input type="text"
             style={{width: '100%'}}
             className="edit-input"
             value={this.state.value}
             onChange={this.handleChange}
             onBlur={this.handleSave}
             onFocus={this.handleFocus}
             onKeyUp={this.handleKeyUp}/>
    );
  }
});

var Table = React.createClass({

  propTypes: {
    keys: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.string),
      React.PropTypes.string
    ]).isRequired,
    columns: React.PropTypes.arrayOf(React.PropTypes.shape({
      title: React.PropTypes.string.isRequired,
      prop: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
      ]),
      render: React.PropTypes.func,
      sortable: React.PropTypes.bool,
      defaultContent: React.PropTypes.string,
      width: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
      ]),
      className: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.func
      ])
    })).isRequired,
    dataArray: React.PropTypes.arrayOf(React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.object
    ])).isRequired,
    buildRowOpts: React.PropTypes.func,
    sortBy: React.PropTypes.shape({
      prop: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
      ]),
      order: React.PropTypes.oneOf(['ascending', 'descending'])
    }),
    onSort: React.PropTypes.func,
    onChange: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      buildRowOpts: () => ({}),
      sortBy: {}
    };
  },

  componentDidMount() {
    // If no width was specified, then set the width that the browser applied
    // initially to avoid recalculating width between pages.
    for (var i = 0; i < this.props.columns.length; i++) {
      var thDom = this.refs[`th-${i}`].getDOMNode();
      if (!thDom.style.width) {
        thDom.style.width = `${thDom.offsetWidth}px`;
      }
    }
  },

  handleCellClick(col, row, ev) {
    const val = getCellValue(col, row);
    React.render(<EditInput value={val} col={col} row={row} target={ev.target}
                            onChange={this.handleChange}/>, ev.target);
  },

  handleChange(col, row, val, target) {
    this.props.onChange(col, row, val);
    React.render(<span>{val}</span>, target);
  },

  handleDelete(row, ev) {
    this.props.onDelete(row);
    React.unmountComponentAtNode(this.refs.tableContainer.getDOMNode());
  },

  handleTrHover(row, ev) {
    // var position = ev.target.parentNode.getBoundingClientRect();
    var width = 40,
      height = 40,
      x = ev.target.parentNode.offsetLeft ,
      y = ev.target.parentNode.offsetTop + ev.target.parentNode.offsetHeight/2 - height/2;

    // console.log(ev.target.parentNode.getBoundingClientRect().top);
    // console.log('render');
    React.render(<div id="remove" style={{position: 'absolute', top: y, left: x, width: width, height: height}}>
      <div className="table-remove-tr glyphicon glyphicon-remove-circle" onClick={this.handleDelete.bind(this, row)}></div>
    </div>, this.refs.tableContainer.getDOMNode());
  },

  handleHoverComponent(ev) {
    ev.target.dataset.hovered = true;
  },

  handleRemoveOptionsComponent(ev) {
    // console.log('remove', document.getElementById('remove'));
    ev.target.dataset.hovered = false;
    React.unmountComponentAtNode(this.refs.tableContainer.getDOMNode());
  },

  handleTrHoverLeave: function() {
    // console.log(!this.refs.tableContainer.getDOMNode().dataset.hovered);
    if(!this.refs.tableContainer.getDOMNode().dataset.hovered){
      React.unmountComponentAtNode(this.refs.tableContainer.getDOMNode());
    }
  },

  render() {
    var { columns, keys, buildRowOpts, sortBy, onSort } = this.props;

    var headers = columns.map((col, idx) => {
      var sortProps, order;
      // Only add sorting events if the column has a property and is sortable.
      if (col.sortable !== false && 'prop' in col) {
        sortProps = buildSortProps(col, sortBy, onSort);
        order = sortProps['aria-sort'];
      }

      return (
        <th
          ref={`th-${idx}`}
          key={idx}
          style={{width: col.width}}
          role="columnheader"
          scope="col"
          {...sortProps}>
          <span>{col.title}</span>
          {typeof order !== 'undefined' ?
            <span className={`sort-icon sort-${order}`} aria-hidden="true"/> :
            null}
        </th>
      );
    });

    var getKeys = Array.isArray(keys) ? keyGetter(keys) : simpleGet(keys);
    var rows = this.props.dataArray.map(row =>
      <tr key={getKeys(row)} {...buildRowOpts(row)} className="data-tr"
          onMouseEnter={this.handleTrHover.bind(this, row)}
          onMouseLeave={this.handleTrHoverLeave}
        >
        {columns.map(
          (col, i) =>
            <td key={i}
                ref={i + getCellValue(col, row)}
                className={getCellClass(col, row)}
                onClick={this.handleCellClick.bind(this, col, row)}>
              {getCellValue(col, row)}
            </td>
        )}
      </tr>);

    var style = {
      position: 'absolute',
      width: 'calc(100% + 40px)',
      height: '100%',
      left: '-40px'
    };
    return (
      <div style={{position: 'relative'}}>
        <div ref="tableContainer"
             style={style}
             onMouseEnter={this.handleHoverComponent}
             onMouseLeave={this.handleRemoveOptionsComponent}></div>
        <table className={this.props.className}>
          <caption className="sr-only" role="alert" aria-live="polite">
            {`Sorted by ${sortBy.prop}: ${sortBy.order} order`}
          </caption>
          <thead>
          <tr>
            {headers}
          </tr>
          </thead>
          <tbody>
          {rows.length > 0 ? rows :
            <tr>
              <td colSpan={columns.length} className="text-center">No data</td>
            </tr>}
          </tbody>
        </table>
      </div>
    );
  }
});

module.exports = Table;
