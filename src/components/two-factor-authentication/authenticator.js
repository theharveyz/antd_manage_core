import React from 'react';
import styles from './two-factor-authentication.styl';
import SelectMobileSystem from './select-mobile-system';
import Verify from './verify';
import InstallAuthenticator from './install-authenticator';

class Authenticator extends React.Component {

  static propTypes = {
    onVerifySuccess: React.PropTypes.func
  };

  state = {
    currentStep: 0,
    mobileSystem: ''
  };

  onSelectMobileSystem(mobileSystem) {
    this.setState({
      mobileSystem
    }, () => {
      this.onChangeStep(this.state.currentStep + 1);
    });
  }

  onVerifySuccess() {
    this.setState({
      currentStep: 0
    });
    this.props.onVerifySuccess();
  }

  onChangeStep(step) {
    this.setState({
      currentStep: step
    });
  }

  render() {
    const { currentStep, mobileSystem } = this.state;

    let content;

    const onPrev = () => this.onChangeStep(currentStep - 1);
    const onNext = () => this.onChangeStep(currentStep + 1);
    switch (currentStep) {
      case 1:
        content = (
          <InstallAuthenticator
            mobileSystem={mobileSystem}
            onPrev={onPrev}
            onNext={onNext}
          />
        );
        break;
      case 2:
        content = (
          <Verify
            onPrev={onPrev}
            onVerifySuccess={::this.onVerifySuccess}
          />
        );
        break;
      default:
        content = (<SelectMobileSystem onSelectMobileSystem={::this.onSelectMobileSystem} />);
    }

    return (
      <div className={styles.container} >
        <div className={styles.content} >
          {content}
        </div>
      </div>
    );
  }
}

export default Authenticator;
