const dbe = require("mariadb");
const dbOpt = require("./keys");

module.exports = {
  connected: false,
  init: function() {
    try {
      this.pool = dbe.createPool(dbOpt);
      this.connected = true;
    } catch (e) {
      console.log(e);
    }
  },
  getConnection: async function() {
    if (this.connected) {
      return await this.pool.getConnection();
    } else {
      console.log("Database not connected!");
    }
  }
};
