const { Router } = require("express");
const clientsController = require("../controllers/ClientsController");
const clientsRouter = Router();

clientsRouter
  .route("/")
  .get(clientsController.userListGet)
  .post(clientsController.userPost);

module.exports = clientsRouter;
