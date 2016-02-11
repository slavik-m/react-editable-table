'use strict';

var React = require('react');

var SearchField = React.createClass({

  onChange(e) {
    if(e.keyCode == 13) {
      this.props.onChange(e.target.value);
    }
  },

  render() {
    return (
      <div className="table-search">
        <label htmlFor={this.props.id}>{this.props.label}</label>
        <input
          id={this.props.id}
          className="form-control"
          type="text"
          defaultValue={this.props.value}
          onKeyUp={this.onChange}
        />
      </div>
    );
  }

});

module.exports = SearchField;
