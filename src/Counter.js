'use strict';

var React = require('react');

var Counter = React.createClass({displayName: "Pagination",

  shouldComponentUpdate:function(nextProps) {
    var props = this.props;

    return props.showing !== nextProps.showing ||
      props.to !== nextProps.to ||
      props.count !== nextProps.count;
  },

  propTypes: {
    showing: React.PropTypes.number.isRequired,
    to: React.PropTypes.number.isRequired,
    count: React.PropTypes.number
  },

  getDefaultProps:function() {
    return {
      showing: 0,
      to: 0,
      count: 0
    };
  },

  render:function() {
    return (
      <div className="data-count">Showing {this.props.showing} to {this.props.to} of {this.props.count} entries</div>
    );
  }
});

module.exports = Counter;
