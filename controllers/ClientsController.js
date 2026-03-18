const db = require("../db/queries");

exports.userListGet = async (req, res, next) => {
  try {
    const users = await db.getAllClients();

    return res.render("clients", {
      users,
    });
  } catch (err) {
    next(err);
  }
};
