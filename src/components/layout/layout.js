import React from 'react';
import Main from '../main/main';
import Navigation from '../navigation/navigation';
import LoginModal from '../login/login-modal';
import MyTask from '../my-task/my-task';
import DI from '../../di';

export default class Layout extends React.Component {

  static propTypes = {
    children: React.PropTypes.element
  };

  state = {
    toggle: undefined
  };

  componentWillMount() {
    DI.get('commonOfflineStorage').get('menuToggleStatus')
    .then((toggle) => {
      this.setState({ toggle: !!toggle });
    })
    .catch(() => {
      this.setState({ toggle: false });
    })
  }

  boradcastMenuToggle(val) {
    this.setState({
      toggle: val
    }, () => {
      DI.get('commonOfflineStorage').add('menuToggleStatus', val);
    });
  }

  render() {
    let { children } = this.props;
    const { toggle } = this.state;
    let location = {};
    if (children) {
      location = children.props.location;
    }
    return (
      <div>
        <LoginModal />
          <Navigation
            location={location}
            onToggle={::this.boradcastMenuToggle}
            toggle={toggle}
          />
        <Main children={children} toggle={toggle} />
        <MyTask />
      </div>
    );
  }

};
