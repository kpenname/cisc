const userModel = require("../model/userModel");

module.exports = async (req, res, next) => {
  req.user = { auth: false };
  if (req.query.logout !== undefined) {
    res.clearCookie("user");
    res.clearCookie("chash");
    res.user = { auth: false };
  } else {
    if (req.body.username !== undefined && req.body.password !== undefined) {
      let user = req.body.username.trim().toLowerCase();
      let pwd = req.body.password;

      const userStatus = await userModel.getAuthorizedWithPassword(user, pwd);
      req.user = userStatus;
      if (userStatus.auth) {
        res.cookie("user", userStatus.user.username, {
          maxAge: 1000 * 60 * 60 * 12,
        });
        res.cookie("chash", userStatus.cookieHash, {
          maxAge: 1000 * 60 * 60 * 12,
        });
      }
    } else if (
      req.body.createUsername !== undefined &&
      req.body.createPassword !== undefined
    ) {
      let user = req.body.createUsername.trim().toLowerCase();
      let pwd = req.body.createPassword;

      console.log(pwd);

      const userStatus = await userModel.createNewAccount(user, pwd);
      req.user = userStatus;

      if (userStatus.auth) {
        res.cookie("user", userStatus.user.username, {
          maxAge: 1000 * 60 * 60 * 12,
        });
        res.cookie("chash", userStatus.cookieHash, {
          maxAge: 1000 * 60 * 60 * 12,
        });
      }
      // this is to update the account record with a first name
    } else if (req.body.firstName !== undefined) {
      let user = req.body.firstName.trim();

      const userStatus = await userModel.getUserInfo(user);
      req.user = userStatus;

      // this gets the cookies if they're set and uses them to authorize the user
    } else if (
      req.cookies.user !== undefined &&
      req.cookies.chash !== undefined
    ) {
      req.user = await userModel.getAuthorizedWithHash(
        req.cookies.user,
        req.cookies.chash
      );
    }
  }
  next();
};
