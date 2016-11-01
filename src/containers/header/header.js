import React from 'react';
import Breadcrumb from '../breadcrumb/breadcrumb';
import AccountInfo from '../account-info/account-info';
import styles from './header.styl';

const Header = () => (
  <header className={styles.container} >
    <Breadcrumb />
    <AccountInfo />
  </header>
);

export default Header;

