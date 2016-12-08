import { injectable } from '../decorators';

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

}
