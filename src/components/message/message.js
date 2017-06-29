import { message } from 'antd';

export default {
  info(content, duration, onClose) {
    return message.info(content, duration, onClose);
  },
  success(content, duration, onClose) {
    return message.success(content, duration, onClose);
  },
  error(content, duration, onClose) {
    return message.error(content, duration = 10, onClose);
  },
  warning(content, duration, onClose) {
    return message.warning(content, duration, onClose);
  },
  warn(content, duration, onClose) {
    return message.warn(content, duration, onClose);
  },
  loading(content, duration, onClose) {
    return message.loading(content, duration, onClose);
  }
};
