const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const db = require("./config/db");
const defaultRouter = require("./routes/pageRoute");
const hbs = require("hbs");

const app = express();
const port = 2000;

hbs.registerPartials(path.join(__dirname, "/views/parts"));
app.set("view engine", "hbs");
app.use(cookieParser());

app.use(
  "/res/",
  express.static(path.join(__dirname, "/public"))
);

app.use("/", defaultRouter);

app.listen(port, () => {
  db.init();
  console.log(`listening on port: ${port}`);
});
