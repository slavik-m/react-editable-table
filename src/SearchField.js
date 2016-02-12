'use strict';

var React = require('react');

var SearchField = React.createClass({

  onChange(e) {
    if(e.keyCode == 13) {
      this.props.onChange(e.target.value);
    }
  },

  handleClick() {
    this.props.onChange(this.refs.input.getDOMNode().value);
  },

  render() {
    return (
      <div className="table-search">
        <label htmlFor={this.props.id}>{this.props.label}</label>
        <div className="input-group">
          <input
            ref="input"
            id={this.props.id}
            className="form-control"
            type="text"
            defaultValue={this.props.value}
            onKeyUp={this.onChange}
          />
          <span className="btn btn-sm input-group-addon" onClick={this.handleClick}>
            <span className="glyphicon glyphicon-search"></span>
          </span>
        </div>
      </div>
    );
  }

});

module.exports = SearchField;
