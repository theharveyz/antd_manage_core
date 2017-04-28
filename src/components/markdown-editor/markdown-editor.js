import React from 'react';
import _ from 'lodash';
import marked from 'marked';
import { Spin } from 'antd';
import ToolBar from './editor/toolbar';
import StatusBar from './editor/statusbar';
import { generateNewValue, setFocus } from './editor/utils';
import styles from './markdown-editor.styl';

export default class MarkdownEditor extends React.Component {
  static propTypes = {
    onChange: React.PropTypes.func,
    value: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    disabledTools: React.PropTypes.array,
    qiniuToken: React.PropTypes.object
  };

  state = { value: '', preview: '', showPreview: false, loading: false };

  componentWillMount() {
    if ('value' in this.props) {
      const { value } = this.props;
      this.setState({ value });
    }
  }

  injectTrigger(inject) {
    const { value } = this.state;
    const { newValue, newPosition } = generateNewValue(this.editorTemp, value, inject);
    this.setState({ value: newValue }, () => {
      this.captureTextareaChange(newValue);
      setFocus(this.markdown, newPosition);
    });
  }

  showLoading() {
    this.setState({ loading: true });
  }

  hideLoading() {
    this.setState({ loading: false });
  }

  captureTextareaChange = _.debounce((e) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(e);
    }
  }, 200);

  editorTemp = {};

  handleTextareaChange(e) {
    this.captureTextareaChange(e.target.value);
    this.setState({ value: e.target.value });
  }

  handleCursorChange(e) {
    this.editorTemp.selectionStart = e.target.selectionStart;
    this.editorTemp.selectionEnd = e.target.selectionEnd;
  }

  renderMarkdown() {
    const { value, showPreview } = this.state;
    if (!showPreview) {
      const preview = marked(value || '');
      this.setState({ preview, showPreview: true });
    } else {
      this.setState({ showPreview: false });
    }
  }

  render() {
    const { placeholder, disabledTools, qiniuToken } = this.props;
    const { value, preview, showPreview, loading } = this.state;
    return (
      <div>
        <div className={styles.editor}>
          <Spin spinning={loading}>
            <ToolBar
              disabledTools={disabledTools}
              markdownTrigger={::this.renderMarkdown}
              injectTrigger={::this.injectTrigger}
              showLoading={::this.showLoading}
              hideLoading={::this.hideLoading}
              qiniuToken={qiniuToken}
            />
            <div className={styles.main}>
              {
                !showPreview ?
                  <textarea
                    className={styles.textArea}
                    placeholder={placeholder}
                    value={value}
                    onChange={::this.handleTextareaChange}
                    onMouseUp={::this.handleCursorChange}
                    onBlur={::this.handleCursorChange}
                    ref={(r) => {
                      this.markdown = r;
                    }}
                  /> :
                  <div
                    className={styles.preview}
                    dangerouslySetInnerHTML={{ __html: preview }}
                  />
              }
            </div>
            <StatusBar
              value={value}
            />
          </Spin>
        </div>
      </div>
    );
  }
}
