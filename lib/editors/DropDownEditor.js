'use strict';

var React = require('react');

var DropDownEditor = React.createClass({
  displayName: 'DropDownEditor',
  getInitialState: function getInitialState() {
    return {
      value: this.props.value
    };
  },
  componentDidMount: function componentDidMount() {
    this.getDOMNode().focus();
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value
    });
  },
  handleChange: function handleChange(ev) {
    this.props.onChange(ev.target.value);
    this.props.onCancel();
  },
  handleFocus: function handleFocus(ev) {
    ev.target.focus();
  },
  handleSave: function handleSave(ev) {
    this.props.onChange(this.state.value);
  },
  handleBlur: function handleBlur(ev) {
    if (this.props.col.hasOwnProperty('validation')) {
      if (this.props.col.validation.test(ev.target.value)) {
        this.handleSave();
      } else {
        this.props.onCancel();
      }
    } else {
      this.props.onCancel();
    }
  },
  handleKeyUp: function handleKeyUp(ev) {
    if (ev.keyCode === 13) {
      this.handleSave(ev);
    }
    if (ev.keyCode === 27) {
      this.props.onCancel();
    }
  },
  render: function render() {
    return React.createElement(
      'select',
      { style: { width: '100%' },
        className: 'edit-input',
        value: this.state.value,
        onChange: this.handleChange,
        onBlur: this.handleBlur,
        onFocus: this.handleFocus,
        onKeyUp: this.handleKeyUp
      },
      this.props.editor.options.map(function (item) {
        return React.createElement(
          'option',
          { key: item.value, value: item.value },
          item.label
        );
      })
    );
  }
});

module.exports = DropDownEditor;