import React from 'react';
import { Tooltip } from 'antd';
import GoogleMaterialIcon from '../../components/google-material-icon/google-material-icon';

// 截至这一天的累计数量
const TableColumnHelp = ({ title, description }) => (
  <Tooltip title={description} placement="bottom" >
    <span>{title} <GoogleMaterialIcon type="help" /></span>
  </Tooltip>
);

TableColumnHelp.propTypes = {
  title: React.PropTypes.string,
  description: React.PropTypes.string
};

export default TableColumnHelp;
