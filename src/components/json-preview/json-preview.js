import React from 'react';
import styles from './json-preview.styl';

export default class JSONPreview extends React.Component {
  static propTypes = {
    jsonString: React.PropTypes.string,
    json: React.PropTypes.object
  };

  getInnerContent(content) {
    const inContent = content;
    return {
      __html: this.syntaxHighlight(inContent)
    };
  }

  syntaxHighlight(jsonInput) {
    let json = jsonInput;
    if (typeof json !== 'string') {
      json = JSON.stringify(json, undefined, 2);
    }
    if (!json) {
      return '';
    }
    json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
    return json.replace(
      /*eslint max-len: ["error", 180]*/
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = 'number';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'key';
          } else {
            cls = 'string';
          }
        } else if (/true|false/.test(match)) {
          cls = 'boolean';
        } else if (/null/.test(match)) {
          cls = 'null';
        }
        return `<span class=${styles[cls]}>  ${match}  </span>`;
      }
    );
  }

  render() {
    const { jsonString, json } = this.props;
    return (
      <div className="jsonPreviewBox">
        <pre dangerouslySetInnerHTML={this.getInnerContent(jsonString || json)} className="previewStyle">
        </pre>
      </div>
    );
  }
}
