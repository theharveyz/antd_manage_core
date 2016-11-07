import React from 'react';
import _ from 'lodash';
import { Button } from 'antd';
const ButtonGroup = Button.Group;
const seriesTypeGroups = [
  {
    text: '折线',
    value: 'line'
  },
  {
    text: '柱状',
    value: 'bar'
  }
];

const ChartSeriesTypeGroup = ({ value, onChange, className }) => (
  <ButtonGroup className={className} >
    {_.map(seriesTypeGroups, (item) => {
      if (item.value === value) {
        return (
          <Button
            type="primary"
            onClick={() => onChange(item.value)}
            key={item.text}
          >
            {item.text}
          </Button>
        );
      }
      return (
        <Button
          onClick={() => onChange(item.value)}
          key={item.text}
        >
          {item.text}
        </Button>
      );
    })}
  </ButtonGroup>
);

ChartSeriesTypeGroup.propTypes = {
  value: React.PropTypes.string,
  onChange: React.PropTypes.func,
  className: React.PropTypes.string
};

export default ChartSeriesTypeGroup;
