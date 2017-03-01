'use strict';

var React = require('react');
var emptyFunction = function emptyFunction() {};

var SearchField = React.createClass({
  displayName: 'SearchField',


  getInitialState: function getInitialState() {
    return {
      value: this.props.value
    };
  },

  getDefaultProps: function getDefaultProps() {
    return {
      searchIcon: 'glyphicon glyphicon-search',
      searchBtnClass: 'btn btn-default'
    };
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value
    });
  },

  onKeyUp: function onKeyUp(e) {
    if (e.keyCode == 13) {
      this.props.onChange(e.target.value);
    }
  },


  onChange: function onChange(ev) {
    this.setState({
      value: ev.target.value
    });
  },

  handleClick: function handleClick() {
    this.props.onChange(this.refs.input.getDOMNode().value);
  },
  render: function render() {
    return React.createElement(
      'div',
      { className: 'table-search' },
      React.createElement(
        'label',
        { htmlFor: this.props.id },
        this.props.label
      ),
      React.createElement(
        'div',
        { className: 'input-group' },
        React.createElement('input', {
          ref: 'input',
          id: this.props.id,
          className: 'form-control',
          type: 'text',
          value: this.state.value,
          onChange: this.onChange,
          onKeyUp: this.onKeyUp
        }),
        React.createElement(
          'div',
          { className: 'input-group-btn' },
          React.createElement(
            'button',
            { className: this.props.searchBtnClass, type: 'button', onClick: this.handleClick },
            React.createElement('span', { className: this.props.searchIcon })
          )
        )
      )
    );
  }
});

module.exports = SearchField;