const router = require("express").Router();
const db = require("../config/db");
const User = require("../model/userModel");
const crypto = require("crypto");

router.post("/add", async (req, res, next) => {
  if (req.user !== undefined) {
    let user = req.body.createUsername.trim().toLowerCase();
    let pwd = req.body.createPassword;
    const hash = crypto.createHash("sha1").update(pwd).digest("base64");
    let conn = await db.getConnection();

    const row = await conn.query(
      "INSERT INTO users (username, passHash) VALUES (?,?)",
      [user, hash]
    );
    conn.end();

    if (row.affectedRows === 1) {
      const chash = crypto.createHash("sha1").update(hash).digest("base64");
      let cookieHash = await User.setCookieHash(user, chash);

      console.log(row.user.lastInsertedId);

      res.render("userView", {
        page: "home",
        user: req.user,
      });
      return {
        auth: true,
        user: { userId: row.lastInsertedId, username: user },
        cookieHash: cookieHash,
      };
    }
  } else {
    next();
  }
});

module.exports = router;
