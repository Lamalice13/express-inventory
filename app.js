const express = require("express");
const path = require("node:path");

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
  if (err) {
    throw err;
  } else {
    console.log(`Server listening on PORT ${PORT}`);
  }
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static("public"));
