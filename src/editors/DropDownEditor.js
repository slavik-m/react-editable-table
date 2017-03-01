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
    /* this.setState({
      value: nextProps.value
    }); */
  },

  handleChange(ev) {
    console.log('change', ev.target.value );
    /* this.setState({
      value: ev.target.value
    }); */
  },

  handleFocus(ev) {
    // ev.target.focus();
  },

  handleSave(ev) {
    this.props.onChange(this.props.col, this.props.row, this.state.value, this.props.target);
  },

  handleBlur(ev) {
    console.log('Blur');
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

  /* handleKeyUp(ev) {
    if (ev.keyCode === 13) {
      this.handleSave(ev);
    }
    if (ev.keyCode === 27) {
      this.props.onCancel(this.props.col, this.props.row, this.props.target);
    }
  },*/

  render() {
    return (
      <select style={{width: '100%'}}
             className="edit-input"
             value={this.state.value}
             onChange={this.handleChange}
             // onBlur={this.handleBlur}
             // onFocus={this.handleFocus}
             //onKeyUp={this.handleKeyUp}
      >
        {this.props.editor.options.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
      </select>
    );
  }
});

module.exports = DropDownEditor;
