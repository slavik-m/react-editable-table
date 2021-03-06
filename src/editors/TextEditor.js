var React = require('react');

var TextEditor = React.createClass({
  getInitialState() {
    return {
      value: this.props.value
    }
  },

  componentDidMount() {
    this.getDOMNode().focus();
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value
    });
  },

  handleChange(ev) {
    this.setState({
      value: ev.target.value
    });
  },

  handleFocus(ev) {
    ev.target.focus();
    var length = ev.target.value.length;
    ev.target.setSelectionRange(length, length);
  },

  handleSave(ev) {
    this.props.onCancel();
    this.props.onChange(this.state.value);
  },

  handleBlur(ev) {
    if(this.props.col.hasOwnProperty('validation')){
      if(this.props.col.validation.test(ev.target.value)) {
        this.handleSave();
      } else {
        this.props.onCancel(this.props.col, this.props.row, this.props.target);
      }
    } else {
      this.handleSave();
    }
  },

  handleKeyUp(ev) {
    if (ev.keyCode === 13) {
      this.handleSave(ev);
    }
    if (ev.keyCode === 27) {
      this.props.onCancel(this.props.col, this.props.row, this.props.target);
    }
  },

  render() {
    return (
      <input type="text"
             style={{width: '100%'}}
             className="edit-input"
             value={this.state.value}
             onChange={this.handleChange}
             onBlur={this.handleBlur}
             onFocus={this.handleFocus}
             onKeyUp={this.handleKeyUp}/>
    );
  }
});

module.exports = TextEditor;
