import React from 'react';
import DI from '../../di';
import { Modal } from 'antd';
import moment from 'moment';
import styles from './birthday.styl';

class Birthday extends React.Component {

  static BRITHDAY_YEAR_STORE_KEY = 'prev-birthday-year';

  state = {
    visible: false,
    year: moment().format('YYYY')
  };

  componentDidMount() {
    Promise.all([
      DI.get('auth').getAccount(),
      DI.get('commonOfflineStorage').get(Birthday.BRITHDAY_YEAR_STORE_KEY)
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
    DI.get('commonOfflineStorage')
    .add(Birthday.BRITHDAY_YEAR_STORE_KEY, this.state.year)
    .then(() => {
      this.setState({
        visible: false
      });
    });
  }

  render() {
    const { visible } = this.state;
    const imgStyle = {
      width: '100%',
      display: 'block'
    };
    const closable = false;
    return (
      <Modal
        width="50%"
        visible={visible}
        onCancel={() => this.onClose()}
        footer=""
        closable={closable}
        wrapClassName={styles.modal}
      >
        <div>
          <img
            style={imgStyle}
            src="https://o2qq673j2.qnssl.com/Fp0vJoC-FiA1eCYxxUyOSqwXK3NM"
            role="presentation"
          />
        </div>
      </Modal>
    );
  }
}

export default Birthday;
