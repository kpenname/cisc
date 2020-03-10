const router = require("express").Router();
const pageModel = require("../model/pageModel");

router.get("/", (req, res) => {
  res.send("<h1>home</h1>");
});

router.get("/:key", async (req, res) => {
  let page = await pageModel.getPage(req.params.key);
  //console.log(page[0]);
  if (page[0] !== undefined) {
    res.send(`<h1>${page[0].content} does not exist</h1>`);
  } else {
    res.send(`<h1>${req.params.key} does not exist</h1>`);
  }
});

module.exports = router;