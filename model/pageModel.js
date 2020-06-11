const db = require("../config/db");

module.exports = {
  editPage: async function (pageKey, title, content, shownInMenu, menuOrder) {
    if (shownInMenu === undefined) {
      shownInMenu = false;
    }
    if (menuOrder === undefined) {
      menuOrder = 4;
    }

    let conn = await db.getConnection();

    try {
      const result = await conn.query(
        "UPDATE `pages` SET menuOrder=?, title=?, shownInMenu=?, content=? WHERE pageKey=?;",
        [menuOrder, title, shownInMenu, content, pageKey]
      );
      conn.end();
      return result;
    } catch (e) {
      return { error: e.message };
    }
  },
  addPage: async function (pageKey, title, content, shownInMenu, menuOrder) {
    if (shownInMenu === undefined) {
      shownInMenu = false;
    }
    if (menuOrder === undefined) {
      menuOrder = 4;
    }

    let conn = await db.getConnection();

    try {
      const result = await conn.query(
        "INSERT INTO pages (`pageKey`, `title`, `content`,shownInMenu, menuOrder) VALUES (?, ?, ?, ?, ?);",
        [pageKey, title, content, shownInMenu, menuOrder]
      );
      conn.end();
      return result;
    } catch (e) {
      return { error: e.message };
    }
  },
  getPage: async function (key) {
    //key = tolowercase(trim(key));
    let conn = await db.getConnection();
    const row = await conn.query(
      "SELECT pageKey, title,content, shownInMenu, menuOrder FROM pages WHERE pageKey = ?",
      [key]
    );
    conn.end();
    return row;
  },
  getMenu: async function () {
    let conn = await db.getConnection();
    const rows = await conn.query(
      "SELECT pageKey, title FROM pages WHERE shownInMenu = 1 ORDER BY menuOrder"
    );
    conn.end();
    return rows;
  },
};
