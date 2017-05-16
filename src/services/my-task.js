import { injectable } from '../decorators';
import DI from '../di';
import { message } from 'antd';

@injectable()
export default class MyTask {

  show() {
    this.taskComponent.onShow();
  }

  hide() {
    this.taskComponent.onCancel();
  }

  setTaskComponent(component) {
    this.taskComponent = component;
  }

  download(record){
    DI.get('excelHttp')
    .get(record.mq_id)
    .then((url) => {
      window.open(url);
    })
    .catch(() => {
      message.error('下载失败!');
    });
  }
}
