const { defaultNamespace } = require('./default');

module.exports = (io) => {
    defaultNamespace(io);
};
