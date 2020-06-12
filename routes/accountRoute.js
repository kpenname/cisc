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
      // hash of pwd hash
      const chash = crypto.createHash("sha1").update(hash).digest("base64");
      // store the cookie hash
      let cookieHash = await User.setCookieHash(user, chash);

      //console.log(row); // show the sql result data structure
      // eg. row = { affectedRows: 1, insertId: 18, warningStatus: 0 }

      // attach user info to the request object so we can use it later
      req.user = { auth: true, user: { userId: row.insertId, username: user } };

      // set cookies so user is "logged in" / remembered
      res.cookie("user", user, {
        maxAge: 1000 * 60 * 60 * 12,
      });
      res.cookie("chash", cookieHash, {
        maxAge: 1000 * 60 * 60 * 12,
      });

      // render the page view
      res.render("userView", {
        page: "home",
        user: req.user,
      });
    }
  } else {
    next();
  }
});

router.post("/update", async (req, res, next) => {
  if (req.user !== undefined) {
    let first = req.body.firstName.trim();
    let userId = req.userId;
    let conn = await db.getConnection();
    const row = await conn.query(
      "UPDATE users SET first = ? WHERE userId = ?;",
      [first, userId]
    );
    conn.end();
    // render the page view
    res.render("userView", {
      page: "home",
      user: req.user,
    });
  } else {
    next();
  }
});

module.exports = router;
