const express = require("express");
const path = require("node:path");
const clientsRouter = require("./routes/Clients");

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
  if (err) {
    throw err;
  } else {
    console.log(`Server listening on PORT ${PORT}`);
  }
});
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use("/clients", clientsRouter);
