const db = require("../config/db");
const crypto = require("crypto");
module.exports = {
  setCookieHash: async function(user, chash) {
    let conn = await db.getConnection();
    const row = await conn.query(
      "UPDATE `users` SET `cookieHash`=? WHERE `username`=?",
      [chash, user]
    );
    conn.end();
    return true;
  },
  // authenticate user with a cookie hash
  getAuthorizedWithHash: async function(user, hash) {
    let conn = await db.getConnection();
    // run prepared query finding matching user
    const row = await conn.query(
      "SELECT * FROM users WHERE username = ?",
      [user]
    );
    conn.end();

    // check if there are matching users
    if (row[0] !== undefined) {
      // check if hash matches

      if (row[0].cookieHash === hash) {
        return { auth: true, user: row[0] };
      }
    }
    return { auth: false };
  },
  getAuthorizedWithPassword: async function(user, pwd) {
    let conn = await db.getConnection();
    const row = await conn.query(
      "SELECT * FROM users WHERE username = ?",
      [user]
    );
    conn.end();
    const hash = crypto
      .createHash("sha1")
      .update(pwd)
      .digest("base64");

    if (row[0] !== undefined) {
      if (hash === row[0].passHash) {
        // if the user is authenticated
        const chash = crypto
          .createHash("sha1")
          .update(hash)
          .digest("base64");
        this.setCookieHash(user, chash);
        return { auth: true, user: row[0], cookieHash: chash };
      }
    }
    return { auth: false };
  }
};
