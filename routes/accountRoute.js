const router = require("express").Router();

router.post("/addAccount", async (req, res, next) => {
  console.log("here?"); // doesn't print this out.  Not getting here, no idea why.
  //I didn't change this code from when it was working before, I just put it in a route file
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
      this.setCookieHash(user, chash);
      return {
        auth: true,
        user: { userId: row.lastInsertedId, username: user },
        cookieHash: chash,
      };
    }
  } else {
    next();
  }
});

module.exports = router;
