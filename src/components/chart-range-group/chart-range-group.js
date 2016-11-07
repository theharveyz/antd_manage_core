import React from 'react';
import _ from 'lodash';
import { Button } from 'antd';
const ButtonGroup = Button.Group;
const rangeGroups = [
  {
    text: '累计',
    value: 'total'
  },
  {
    text: '按年',
    value: 'year'
  },
  {
    text: '按月',
    value: 'month'
  },
  {
    text: '按周',
    value: 'week'
  },
  {
    text: '按日',
    value: 'days'
  }
];

const ChartRangeGroup = ({ value, onChange, className, hidden }) => (
  <ButtonGroup className={className} >
    {_.map(_.filter(rangeGroups, (item) => hidden.indexOf(item.value) === -1), (item) => {
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

ChartRangeGroup.propTypes = {
  value: React.PropTypes.string,
  onChange: React.PropTypes.func,
  className: React.PropTypes.string,
  hidden: React.PropTypes.array
};

ChartRangeGroup.defaultProps = {
  hidden: []
};
export default ChartRangeGroup;
