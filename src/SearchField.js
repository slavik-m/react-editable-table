'use strict';

var React = require('react');
var emptyFunction = function () {
};

var SearchField = React.createClass({

  getInitialState: function () {
    return {
      value: this.props.value
    };
  },

  getDefaultProps: function () {
    return {
      searchIcon: 'glyphicon glyphicon-search',
      searchBtnClass: 'btn btn-default'
    };
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState({
      value: nextProps.value
    });
  },

  onKeyUp(e) {
    if (e.keyCode == 13) {
      this.props.onChange(e.target.value);
    }
  },

  onChange: function(ev) {
    this.setState({
      value: ev.target.value
    });
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
            value={this.state.value}
            onChange={this.onChange}
            onKeyUp={this.onKeyUp}
            />
          <div className="input-group-btn">
            <button className={this.props.searchBtnClass} type="button" onClick={this.handleClick}>
              <span className={this.props.searchIcon}></span>
            </button>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = SearchField;
