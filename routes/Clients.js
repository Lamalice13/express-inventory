const { Router } = require("express");
const clientsController = require("../controllers/ClientsController");
const clientsRouter = Router();

clientsRouter
  .route("/")
  .post(clientsController.userPost)
  .get(clientsController.userListGet);

module.exports = clientsRouter;
