const router = require("express").Router();
const pageModel = require("../model/pageModel");

router.get("/", async (req, res) => {
  getPageWithDefault(req, res);
});
router.get("/:key", async (req, res) => {
  await getPageWithDefault(req, res);
});

async function getPageWithDefault(req, res) {
  if (req.params.key === undefined) {
    req.params = {};
    req.params.key = "home";
  }
  let page = await pageModel.getPage(req.params.key);
  let menu = await pageModel.getMenu();

  //console.log(menu);
  if (page[0] !== undefined) {
    res.render("pageView", { page: page[0], menu: menu });
  } else {
    req.params.key = "home";
    getPageWithDefault(req,res);
  }
}

module.exports = router;
