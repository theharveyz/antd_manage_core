const asyncLoadComponent = (path) => (location, callback) => {
  require.ensure([], (require) => {
    callback(null, require(`../../pages/${path}`).default);
  }, 'pages');
};

export default asyncLoadComponent;
