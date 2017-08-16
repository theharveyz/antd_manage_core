import React from 'react';
import _ from 'lodash';
import DI from '../../di';
import message from '../message/message';
import { Spin, Upload, Button, Icon } from 'antd';
import styles from './editor.styl';

export default class Editor extends React.Component {
  static propTypes = {
    onChange: React.PropTypes.func,
    value: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    toolbars: React.PropTypes.array,
    qiniuToken: React.PropTypes.object
  };

  static defaultProps = {
    toolbars: ['fullscreen', 'source', 'bold', 'italic', 'underline',
      'strikethrough', 'fontfamily',
      'fontsize', 'paragraph', 'justifyleft', 'justifycenter',
      'justifyright', 'justifyjustify', 'forecolor',
      'backcolor']
  };

  constructor(props) {
    super(props);
    this.id = `ueditor-${(Date.now())}`;
  }

  state = { loading: true, value: '' };

  componentDidMount() {
    if (!window.UE) {
      this.loadEditor();
    } else {
      this.initEditor();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { loading } = this.state;
    if ('value' in nextProps) {
      const { value } = nextProps;
      if (value && value !== this.state.value && !loading) {
        this.ue.setContent(value);
        this.setState({ value });
      }
    }
  }

  componentWillUnmount() {
    const { loading } = this.state;
    if (!loading) {
      window.UE.delEditor(this.id);
    }
  }

  captureTextareaChange = _.debounce((e) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(e);
    }
  }, 200);

  handleValueChange(value) {
    this.captureTextareaChange(value);
    this.setState({ value });
  }

  initEditor() {
    const { toolbars } = this.props;
    this.ue = new window.UE.ui.Editor({
      toolbars: [toolbars],
      autoFloatEnabled: false,
      zIndex: 0
    });
    this.ue.render(this.id);
    this.ue.ready(() => {
      const { value, placeholder } = this.props;
      if (value) {
        this.ue.setContent(value);
      }
      if (placeholder && !value) {
        this.ue.setContent(placeholder);
      }
      this.ue.addListener('contentChange', () => {
        this.handleValueChange(this.ue.getContent());
      });
      this.setState({ loading: false });
    });
  }

  loadEditor() {
    this.setState({ loading: true });
    const configUrl = 'https://apps.bdimg.com/libs/ueditor/1.4.3.1/ueditor.config.js';
    const editorUrl = 'https://apps.bdimg.com/libs/ueditor/1.4.3.1/ueditor.all.min.js';
    this.loadScript(configUrl, () => {
      this.loadScript(editorUrl, () => {
        this.initEditor();
      });
    });
  }

  loadScript(url, callback) {
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = url;
    s.onload = callback;
    document.body.appendChild(s);
  }

  imageUpload(info) {
    const { qiniuToken } = this.props;
    const { bucketUrl } = qiniuToken;
    const file = _.last(info.fileList.slice(-2));
    if (file && file.status === 'done') {
      const image = `${bucketUrl}/${file.response.key}`;
      this.ue.execCommand('inserthtml', `<image src="${image}" />`);
      message.error('lala');
    }
    if (file && file.status === 'error') {
      message.error(`上传失败 请刷新页面后重试 ${file.error}`);
    }
    this.setState({ loading: false });
  }

  render() {
    const { loading } = this.state;
    const { qiniuToken } = this.props;
    const outerPicProps = {
      action: DI.get('config').get('qiniu.url'),
      beforeUpload: () => this.setState({ loading: true }),
      onChange: (info) => this.imageUpload(info),
      showUploadList: false,
      data: {
        token: qiniuToken && qiniuToken.token
      }
    };
    return (
      <div
        className={[styles.editor, 'core-editor'].join(' ')}
      >
        <Spin
          spinning={loading}
        >
          <div
            className={styles.main}
            id={this.id}
          />
          <div
            className={styles.tool}
          >
            <Upload
              {...outerPicProps}
            >
              <Button type="ghost">
                <Icon
                  type="picture"
                />
              </Button>
            </Upload>
          </div>
        </Spin>
      </div>
    );
  }
}
