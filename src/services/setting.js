const groups = {};
const openKeys = [];
const selectedKeys = [];
class Setting {
  static getGroup(group) {
    return groups[group];
  }

  static addGroup(options) {
    const { text, icon } = options;
    if (!groups[text]) {
      groups[text] = {};
    }
    groups[text].icon = icon;
    groups[text].settings = [];
  }

  static add(options) {
    groups[options.group].settings.push(options);
  }

  static getAll() {
    return groups;
  }

  static getOpenKeys() {
    return openKeys;
  }

  static addOpenKeys(key) {
    openKeys.push(key);
  }

  static getSelectedKeys() {
    return selectedKeys;
  }

  static addSelectedKeys(key) {
    selectedKeys.push(key);
  }
}

export default Setting;
