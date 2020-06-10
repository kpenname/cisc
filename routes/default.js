const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("<h1>testing</h1>");
  // res.render(""); if we had a template we could use this
});

router.get("/:page", (req, res) => {
  res.send(`<h1>${req.params.page}</h1>`);
});

module.exports = router;
