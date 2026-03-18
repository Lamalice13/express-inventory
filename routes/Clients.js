const { Router } = require("express");
const clientsController = require("../controllers/ClientsController");
const clientsRouter = Router();

clientsRouter.route("/").get(clientsController.userListGet);

module.exports = clientsRouter;
