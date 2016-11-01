import React from 'react';
import { Modal } from 'antd';
import moment from 'moment';
import propsInject from '../../decorators/props-inject';

@propsInject({
  store: 'commonOfflineStorage',
  auth: 'auth'
})
class Birthday extends React.Component {

  static BRITHDAY_YEAR_STORE_KEY = 'prev-birthday-year';
  static propTypes = {
    store: React.PropTypes.object,
    auth: React.PropTypes.object
  };

  state = {
    visible: false,
    year: moment().format('YYYY')
  };

  componentDidMount() {
    const { auth, store } = this.props;
    Promise.all([
      auth.getAccount(),
      store.get(Birthday.BRITHDAY_YEAR_STORE_KEY)
    ]).then(([account, year]) => {
      const isBirthdayDay = moment().format('MMDD') ===
        moment(account.birthday).format('MMDD');
      if (account.birthday && isBirthdayDay && this.state.year !== year) {
        this.setState({
          visible: true
        });
      }
    });
  }

  onClose() {
    this.props.store
      .add(Birthday.BRITHDAY_YEAR_STORE_KEY, this.state.year)
      .then(() => {
        this.setState({
          visible: false
        });
      });
  }

  render() {
    const { visible } = this.state;
    return (
      <Modal
        width="50%"
        visible={visible}
        onCancel={() => this.onClose()}
        footer=""
      >
        <div>
          hhhhh
        </div>
      </Modal>
    );
  }
}

export default Birthday;
