'use strict';

var React = require('react');

var SelectField = React.createClass({
  displayName: 'SelectField',
  onChange: function onChange(e) {
    this.props.onChange(e.target.value);
  },
  render: function render() {
    var _props = this.props,
        id = _props.id,
        options = _props.options,
        label = _props.label,
        value = _props.value;

    var mappedOpts = options.map(function (each) {
      return React.createElement(
        'option',
        { key: each, value: each },
        each
      );
    });

    return React.createElement(
      'div',
      null,
      React.createElement(
        'label',
        { htmlFor: id },
        label
      ),
      React.createElement(
        'select',
        { id: id, value: value, onChange: this.onChange, className: 'form-control' },
        mappedOpts
      )
    );
  }
});

module.exports = SelectField;