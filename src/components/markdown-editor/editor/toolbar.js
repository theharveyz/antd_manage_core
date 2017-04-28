import React from 'react';
import { Upload, message } from 'antd';
import _ from 'lodash';
import ToolBarTemp from './toolbar-template';
import { generateLink, generateImg } from './utils';
import styles from '../markdown-editor.styl';

export default class ToolBar extends React.Component {
  static propTypes = {
    disabledTools: React.PropTypes.array,
    markdownTrigger: React.PropTypes.func,
    injectTrigger: React.PropTypes.func,
    showLoading: React.PropTypes.func,
    hideLoading: React.PropTypes.func,
    qiniuToken: React.PropTypes.object
  };

  static defaultProps = {
    disabledTools: [],
    qiniuToken: {}
  };

  onUploadChange(info) {
    const { qiniuToken, hideLoading, injectTrigger } = this.props;
    const { bucketUrl } = qiniuToken;
    const file = _.last(info.fileList.slice(-2));
    if (file && file.status === 'done') {
      injectTrigger(generateImg(bucketUrl, file));
    }
    if (file && file.status === 'error') {
      message.error(`上传失败 请刷新页面后重试 ${file.error}`);
    }
    hideLoading();
  }

  onPreview() {
    const { markdownTrigger } = this.props;
    markdownTrigger();
  }

  triggerHelp() {
    window.open('https://daringfireball.net/projects/markdown/syntax');
  }

  insertLink() {
    const { injectTrigger } = this.props;
    injectTrigger(generateLink());
  }

  render() {
    const { disabledTools, showLoading, qiniuToken } = this.props;
    const tools = [];
    const imgProps = {
      action: 'https://up.qbox.me',
      accept: '.jpg,.jpeg,.png,.gif',
      beforeUpload: () => {
        showLoading();
      },
      onChange: (info) => this.onUploadChange(info),
      showUploadList: false,
      data: {
        token: qiniuToken.token
      }
    };
    const insertLink = (
      <ToolBarTemp
        icon="link"
        key="insertLink"
        helper="插入链接"
        trigger={::this.insertLink}
      />
    );
    tools.push(insertLink);
    const insertImg = (
      <Upload
        {...imgProps}
        key="insertImg"
      >
        <ToolBarTemp
          icon="picture"
          helper="上传图片"
        />
      </Upload>
    );
    tools.push(insertImg);
    const preview = (
      <ToolBarTemp
        icon="eye-o"
        iconActive="eye"
        key="preview"
        helper="预览"
        trigger={::this.onPreview}
      />
    );
    tools.push(preview);
    const help = (
      <ToolBarTemp
        icon="question"
        key="help"
        helper="帮助"
        trigger={this.triggerHelp}
      />
    );
    tools.push(help);
    return (
      <div className={styles.toolbar}>
        {tools.map(tool => {
          if (disabledTools.indexOf(tool.key) === -1) {
            return tool;
          }
          return null;
        })}
      </div>
    );
  }
}
