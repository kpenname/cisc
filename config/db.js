const dbEngine = require("mariadb");
const dbOptions = require("./keys");

module.exports = {
  connected: false,
  init: function () {
    try {
      this.pool = dbEngine.createPool(dbOptions);
      this.connected = true;
    } catch (e) {
      console.log(e + "you should connect the database server");
    }
  },
  getConnection: async function () {
    if (this.connected) {
      return await this.pool.getConnection();
    } else {
      console.log("Database not connected!");
    }
  },
};
