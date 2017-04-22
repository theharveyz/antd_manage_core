import React from 'react';
import Breadcrumb from '../breadcrumb/breadcrumb';
import AccountInfo from '../account-info/account-info';
import styles from './header.styl';

const Header = ({ toggle }) => (
  <header className={ toggle ? `${styles.container} ${styles.toggle}`: styles.container} >
    <Breadcrumb />
    <AccountInfo />
  </header>
);

Header.propTypes = {
  toggle: React.PropTypes.bool
};

export default Header;

