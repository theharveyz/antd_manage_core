import React from 'react';
import { Select } from 'antd';
import DI from '../../di';
import _ from 'lodash';
import { hashHistory } from 'react-router';
import styles from './navigation-search.styl';

const { Option, OptGroup } = Select;
export default class NavigationSearch extends React.Component {
  state = {
    configs: [],
    value: undefined
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
    const configGroup = {};
    _.map(searchableNav, (nav) => {
      const name = nav.title;
      if (name.indexOf('-') < 0) {
        configGroup[name] = [nav];
      } else {
        const group = name.split('-')[0];
        if (!configGroup[group]) {
          configGroup[group] = [];
        }
        configGroup[group].push({
          ...nav,
          title: nav.title.replace(`${group}-`, '')
        });
      }
    });
    this.setState({ configs: configGroup });
  }

  nav = [];

  getAllNavigation(configs, title) {
    _.map(configs, (c) => {
      const nextTitle = title ? `${title}-${c.name}` : c.name;
      if (c.component && c.path) {
        this.nav.push({ ...c, title: nextTitle });
      }
      if (c.child) {
        this.getAllNavigation(c.child, nextTitle);
      }
    })
  }

  render() {
    const { value, configs } = this.state;
    const options = _.map(configs, (conf, key) => {
      return (
        <OptGroup label={key} key={key}>
          {conf.map(d => <Option key={d.title} value={d.path}>{d.title}</Option>)}
        </OptGroup>
      )
    });
    return (
      <div className={styles.container}>
        <Select
          ref="search"
          showSearch
          style={{ width: 250, marginTop: '-5px' }}
          placeholder="搜索..."
          optionFilterProp="children"
          onChange={::this.handleChange}
          value={value}
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {options}
        </Select>
      </div>
    );
  }
}
