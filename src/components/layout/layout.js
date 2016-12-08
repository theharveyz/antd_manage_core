import React from 'react';
import Main from '../main/main';
import Navigation from '../navigation/navigation';
import LoginModal from '../login/login-modal';
import MyTask from '../my-task/my-task';

function Layout({ children = {} }) {
  let location = {};

  if (children) {
    location = children.props.location;
  }

  return (
    <div>
      <LoginModal />
      <Navigation location={location} />
      <Main children={children} />
      <MyTask />
    </div>
  );
}

Layout.propTypes = {
  children: React.PropTypes.element
};


export default Layout;
