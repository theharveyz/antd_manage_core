import React from 'react';
import { Select } from 'antd';
import DI from '../../di';
import _ from 'lodash';
import { hashHistory } from 'react-router';
import styles from './navigation-search.styl';

const Option = Select.Option;
export default class NavigationSearch extends React.Component {
  state = {
    configs: []
  }

  handleChange(value) {
    hashHistory.push(value);
  }

  componentWillMount() {
    DI.get('navigation')
      .getConfigs()
      .then((configs) => this.processNavigation(configs));
  }

  processNavigation(configs) {
    this.getAllNavigation(configs);
    const searchableNav = _.filter(this.nav, (n) => {
      return (n.path.indexOf('/:') < 0) && (n.title.indexOf('贝米钱包') < 0)
    })
    this.setState({ configs: searchableNav });
  }

  nav = [];

  getAllNavigation(configs, title) {
    _.map(configs, (c) => {
      if (c.child) {
        this.getAllNavigation(c.child, c.name);
      } else {
        this.nav.push({ ...c, title: title ? `${title}-${c.name}` : c.name });
      }
    })
  }

  render() {
    const options = this.state.configs.map(d => <Option key={d.title} value={d.path}>{d.title}</Option>);
    return (
      <div className={styles.container}>
        <Select
          showSearch
          style={{ width: 200, marginTop: '-5px' }}
          placeholder="搜索..."
          optionFilterProp="children"
          onChange={this.handleChange}
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {options}
        </Select>
      </div>
    );
  }
}
