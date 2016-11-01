import React from 'react';
import Header from '../header/header';
import Birthday from '../../components/birthday/birtyday';
import styles from './main.styl';

function Main({ children }) {
  return (
    <section className={styles.container} >
      <Header />
      <div className={styles.children} >
        {children}
      </div>
      <Birthday />
    </section>
  );
}

Main.propTypes = {
  children: React.PropTypes.node
};

export default Main;
