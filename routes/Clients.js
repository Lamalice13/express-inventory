const { Router } = require("express");
const clientsController = require("../controllers/ClientsController");
const clientsRouter = Router();

clientsRouter
  .route("/")
  .get(clientsController.userListGet)
  .post(clientsController.userPost);

clientsRouter
  .route("/:id/update")
  .get(clientsController.userUpdateGet)
  .post(clientsController.userUpdate);

module.exports = clientsRouter;
