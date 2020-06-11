const router = require("express").Router();
const pageModel = require("../model/pageModel");

router.all("/", async (req, res) => {
  getPageWithDefault(req, res);
});

router.post("/edit/", async (req, res, next) => {
  if (req.user !== undefined && req.user.auth) {
    let d = req.body;
    const result = await pageModel.editPage(
      d.pageKey,
      d.title,
      d.content,
      d.shownInMenu === "on",
      d.menuOrder
    );

    if (result.error !== undefined) {
      res.render("editedPageView", {
        page: { title: "Error Edit Page", pageKey: d.pageKey },
        added: false,
        user: req.user,
        error: result.error,
      });
    } else {
      res.render("editedPageView", {
        page: { title: d.title, pageKey: d.pageKey },
        user: req.user,
        added: false,
        menu: await pageModel.getMenu(),
      });
    }
  } else {
    next();
  }
});
router.post("/add/", async (req, res, next) => {
  if (req.user !== undefined && req.user.auth) {
    let d = req.body;
    const result = await pageModel.addPage(
      d.pageKey,
      d.title,
      d.content,
      d.shownInMenu === "on",
      d.menuOrder
    );

    if (result.error !== undefined) {
      res.render("editedPageView", {
        page: { title: "Error Adding Page", pageKey: d.pageKey },
        user: req.user,
        added: true,
        error: result.error,
      });
    } else {
      res.render("editedPageView", {
        page: { title: d.title, pageKey: d.pageKey },
        user: req.user,
        added: true,
        menu: await pageModel.getMenu(),
      });
    }
  } else {
    next();
  }
});

router.get("/add/", async (req, res, next) => {
  if (req.user !== undefined && req.user.auth) {
    let menu = await pageModel.getMenu();
    res.render("editPageView", {
      page: { title: "Add Page" },
      menu: menu,
      user: req.user,
    });
  } else {
    next();
  }
});

router.get("/edit/:key", async (req, res, next) => {
  if (req.user !== undefined && req.user.auth) {
    let menu = await pageModel.getMenu();
    let page = await pageModel.getPage(req.params.key);
    res.render("editPageView", {
      page: { title: "Edit Page", data: page[0] },
      menu: menu,
      user: req.user,
    });
  } else {
    next();
  }
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

  console.log(req.user);
  if (page[0] !== undefined) {
    res.render("userView", {
      page: page[0],
      menu: menu,
      user: req.user,
    });
  } else {
    //res.statusMessage = "Page not available";
    res.status(404);
    res.render("statusView", { code: 404, status: "Not Found" });
  }
}

module.exports = router;
