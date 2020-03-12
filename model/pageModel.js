const db = require("../config/db");

module.exports = {

  addPage: async function(pageKey, title, content, shownInMenu, menuOrder) {
    if(shownInMenu === undefined){
      shownInMenu = false;
    }
    if(menuOrder === undefined) {
      menuOrder = 4;
    }
    let conn = await db.getConnection();
    const result = await conn.query(
      "INSERT INTO `pages` (`pageKey`, `menuOrder`, `showninMenu`, `title`, `content`) VALUES ('?,?,?,?,?);",
      []
    );
    conn.end();
    console.log(result);
  },

  getPage: async function(key) {
    //key = tolowercase(trim(key));
    let conn = await db.getConnection();
    const row = await conn.query(
      "SELECT pageKey, title,content FROM pages WHERE pageKey = ?",
      [pageKey, title, content, shownInMenu, menuOrder]
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
