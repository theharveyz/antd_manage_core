import React from 'react';
import Header from '../header/header';
import Birthday from '../../components/birthday/birtyday';
import styles from './main.styl';

function Main({ children, toggle }) {
  console.log(toggle, 'propTypes');
  return (
    <section
      className={ toggle ? `${styles.container} ${styles.toggle}` : styles.container}
    >
      <Header toggle={toggle} />
      <div className={styles.children} >
        {children}
      </div>
      <Birthday />
    </section>
  );
}

Main.propTypes = {
  toggle: React.PropTypes.bool,
  children: React.PropTypes.node
};

export default Main;
