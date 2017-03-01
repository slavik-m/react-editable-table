'use strict';

var React = require('react');

// Used to cancel events.
var preventDefault = function preventDefault(e) {
  return e.preventDefault();
};

var Pagination = React.createClass({
  displayName: 'Pagination',
  shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
    var props = this.props;

    return props.totalPages !== nextProps.totalPages || props.currentPage !== nextProps.currentPage || props.showPages !== nextProps.showPages;
  },


  propTypes: {
    onChangePage: React.PropTypes.func.isRequired,
    totalPages: React.PropTypes.number.isRequired,
    currentPage: React.PropTypes.number.isRequired,
    showPages: React.PropTypes.number
  },

  getDefaultProps: function getDefaultProps() {
    return { showPages: 5 };
  },
  onChangePage: function onChangePage(pageNumber, event) {
    event.preventDefault();
    this.props.onChangePage(pageNumber);
  },
  render: function render() {
    var _props = this.props,
        totalPages = _props.totalPages,
        showPages = _props.showPages,
        currentPage = _props.currentPage;


    if (totalPages === 0) {
      return null;
    }

    var diff = Math.floor(showPages / 2),
        start = Math.max(currentPage - diff, 0),
        end = Math.min(start + showPages, totalPages);

    if (totalPages >= showPages && end >= totalPages) {
      start = totalPages - showPages;
    }

    var buttons = [],
        btnEvent,
        isCurrent;
    for (var i = start; i < end; i++) {
      isCurrent = currentPage === i;
      // If the button is for the current page then disable the event.
      if (isCurrent) {
        btnEvent = preventDefault;
      } else {
        btnEvent = this.onChangePage.bind(this, i);
      }
      buttons.push(React.createElement(
        'li',
        { key: i, className: isCurrent ? 'active' : null },
        React.createElement(
          'a',
          { role: 'button', href: '#', onClick: btnEvent, tabIndex: '0' },
          React.createElement(
            'span',
            null,
            i + 1
          ),
          isCurrent ? React.createElement(
            'span',
            { className: 'sr-only' },
            '(current)'
          ) : null
        )
      ));
    }

    // First and Prev button handlers and class.
    var firstHandler = preventDefault;
    var prevHandler = preventDefault;
    var isNotFirst = currentPage > 0;
    if (isNotFirst) {
      firstHandler = this.onChangePage.bind(this, 0);
      prevHandler = this.onChangePage.bind(this, currentPage - 1);
    }

    // Next and Last button handlers and class.
    var nextHandler = preventDefault;
    var lastHandler = preventDefault;
    var isNotLast = currentPage < totalPages - 1;
    if (isNotLast) {
      nextHandler = this.onChangePage.bind(this, currentPage + 1);
      lastHandler = this.onChangePage.bind(this, totalPages - 1);
    }

    return React.createElement(
      'ul',
      { className: this.props.className, 'aria-label': 'Pagination' },
      React.createElement(
        'li',
        { className: !isNotFirst ? 'disabled' : null },
        React.createElement(
          'a',
          { role: 'button', href: '#', tabIndex: '0',
            onClick: firstHandler,
            'aria-disabled': !isNotFirst,
            'aria-label': 'First' },
          React.createElement('span', { className: 'fa fa-angle-double-left', 'aria-hidden': 'true' })
        )
      ),
      React.createElement(
        'li',
        { className: !isNotFirst ? 'disabled' : null },
        React.createElement(
          'a',
          { role: 'button', href: '#', tabIndex: '0',
            onClick: prevHandler,
            'aria-disabled': !isNotFirst,
            'aria-label': 'Previous' },
          React.createElement('span', { className: 'fa fa-angle-left', 'aria-hidden': 'true' })
        )
      ),
      buttons,
      React.createElement(
        'li',
        { className: !isNotLast ? 'disabled' : null },
        React.createElement(
          'a',
          { role: 'button', href: '#', tabIndex: '0',
            onClick: nextHandler,
            'aria-disabled': !isNotLast,
            'aria-label': 'Next' },
          React.createElement('span', { className: 'fa fa-angle-right', 'aria-hidden': 'true' })
        )
      ),
      React.createElement(
        'li',
        { className: !isNotLast ? 'disabled' : null },
        React.createElement(
          'a',
          { role: 'button', href: '#', tabIndex: '0',
            onClick: lastHandler,
            'aria-disabled': !isNotLast,
            'aria-label': 'Last' },
          React.createElement('span', { className: 'fa fa-angle-double-right', 'aria-hidden': 'true' })
        )
      )
    );
  }
});

module.exports = Pagination;