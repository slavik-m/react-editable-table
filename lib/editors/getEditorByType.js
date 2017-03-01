'use strict';

var TextEditor = require('./TextEditor');
var DropDownEditor = require('./DropDownEditor');

function getEditorByType(type) {
  switch (type) {
    case 'text':
      return TextEditor;
    case 'dropdown':
      return DropDownEditor;
    default:
      return TextEditor;
  }
}

module.exports = getEditorByType;