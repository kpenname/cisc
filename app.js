const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const db = require("./config/db");
const pageRouter = require("./routes/pageRoute");
const accountRouter = require("./routes/accountRoute");
const hbs = require("hbs");
const login = require("./middleware/login");

const userModel = require("./model/userModel");

const app = express();
const port = 2000;

app.use(express.urlencoded({ extended: true }));
hbs.registerPartials(path.join(__dirname, "/views/parts"));
app.set("view engine", "hbs");
app.use(cookieParser());

app.use("/res/", express.static(path.join(__dirname, "/public")));

// middleware
app.use(login);

// routes
app.use("/", pageRouter);
app.use("/addAccount", accountRouter);

app.listen(port, () => {
  db.init();
  console.log(`listening on port: ${port}`);
});
