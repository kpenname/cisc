const router = require("express").Router();
const pageModel = require("../model/pageModel");

router.get("/", async (req, res) => {
  getPageOrDefault(req, res);
  // res.render(""); if we had a template we could use this
});

router.get("/:key", async (req, res) => {
  getPageOrDefault(req, res);
});

async function getPageOrDefault(req, res) {
  if (req.params.key === undefined) {
    req.params.key = "home";

    let page = await pageModel.getPage(req.params.key);
    let menu = await pageModel.getMenu();

    if (page[0] !== undefined) {
      res.render("pageView", { page: page[0], menu: menu });
    } else {
      req.params.key = "home";
      getPageOrDefault(req, res);
    }
  }
}

module.exports = router;
