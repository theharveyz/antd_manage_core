import React from 'react';
import './google-material-icon.styl';
const GoogleMaterialIcon = ({ type, style }) => (
  <i className="material-icons" style={style} >{type}</i>
);

GoogleMaterialIcon.propTypes = {
  type: React.PropTypes.string,
  style: React.PropTypes.object
};
export default GoogleMaterialIcon;
