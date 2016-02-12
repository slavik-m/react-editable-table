'use strict';

var React = require('react');

var SearchField = React.createClass({

  getDefaultProps: function() {
    return {
      searchIcon: 'glyphicon glyphicon-search'
    };
  },

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
          <div className="input-group-btn">
            <button className="btn btn-default" type="button"  onClick={this.handleClick}>
              <span className={this.props.searchIcon}></span>
            </button>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = SearchField;
