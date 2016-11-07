import React from 'react';
import Main from '../main/main';
import Navigation from '../navigation/navigation';
import LoginModal from '../login/login-modal';

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
    </div>
  );
}

Layout.propTypes = {
  children: React.PropTypes.element
};


export default Layout;
