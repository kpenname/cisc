const router = require("express").Router();
const pageModel = require("../model/pageModel");

// router.post("/login", async (req, res) => {
//   console.log(req.body);
//   res.send("body " + req.body.username);
// });

router.all("/", async (req, res) => {
  getPageWithDefault(req, res);
});
router.all("/:key", async (req, res) => {
  getPageWithDefault(req, res);
});

async function getPageWithDefault(req, res) {
  if (req.params.key === undefined) {
    req.params.key = "home";
  }
  let page = await pageModel.getPage(req.params.key);
  let menu = await pageModel.getMenu();

  //console.log(menu);
  if (page[0] !== undefined) {
    res.render("pageView", { page: page[0], menu: menu });
  } else {
    //res.statusMessage = "Page not available";
    res.status(404);
    res.render("statusView", { code: 404, status: "Not Found" });
  }
}

module.exports = router;