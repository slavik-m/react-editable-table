var React = require('react');

var DropDownEditor = React.createClass({
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
    this.props.onChange(ev.target.value);
    this.props.onCancel();
  },

  handleFocus(ev) {
    ev.target.focus();
  },

  handleSave(ev) {
    this.props.onChange(this.state.value);
  },

  handleBlur(ev) {
    if(this.props.col.hasOwnProperty('validation')){
      if(this.props.col.validation.test(ev.target.value)) {
        this.handleSave();
      } else {
        this.props.onCancel();
      }
    } else {
      this.props.onCancel();
    }
  },

  handleKeyUp(ev) {
    if (ev.keyCode === 13) {
      this.handleSave(ev);
    }
    if (ev.keyCode === 27) {
      this.props.onCancel();
    }
  },

  render() {
    return (
      <select style={{width: '100%'}}
             className="edit-input"
             value={this.state.value}
             onChange={this.handleChange}
             onBlur={this.handleBlur}
             onFocus={this.handleFocus}
             onKeyUp={this.handleKeyUp}
      >
        {this.props.editor.options.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
      </select>
    );
  }
});

module.exports = DropDownEditor;
