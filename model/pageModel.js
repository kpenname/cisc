const db = require("../config/db");

module.exports = {
  getPage: async function(key) {
    //key = tolowercase(trim(key));
    let conn = await db.getConnection();
    const row = await conn.query(
      "SELECT pageKey, title,content FROM pages WHERE pageKey = ?",
      [key]
    );
    conn.end();
    return row;
  },
  getMenu: async function() {
    let conn = await db.getConnection();
    const rows = await conn.query(
      "SELECT pageKey, title FROM pages WHERE shownInMenu = 1 ORDER BY menuOrder"
    );
    conn.end();
    return rows;
  }
};
