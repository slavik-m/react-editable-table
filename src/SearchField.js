'use strict';

var React = require('react');

var SearchField = React.createClass({

  onChange(e) {
    this.props.onChange(e.target.value);
  },

  render() {
    return (
      <div className="table-search">
        <label htmlFor={this.props.id}>{this.props.label}</label>
        <input
          id={this.props.id}
          className="form-control"
          type="text"
          value={this.props.value}
          onChange={this.onChange}
        />
      </div>
    );
  }

});

module.exports = SearchField;
