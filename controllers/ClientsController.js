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

exports.userPost = async (req, res, next) => {
  const { name, lastname, email, birth_date, phone_number, sub_status } =
    req.body;

  try {
    if (sub_status === "inactive") {
      await db.createUnsubClient(
        name,
        lastname,
        email,
        birth_date,
        phone_number,
        sub_status
      );
    } else {
      const { start_date, end_date, sub_type, amount, method } = req.body;
      console.log(req.body);
      await db.createSubClient(
        name,
        lastname,
        email,
        birth_date,
        phone_number,
        sub_status,
        start_date,
        end_date,
        sub_type,
        amount,
        method
      );
    }

    res.redirect("/");
  } catch (err) {
    next(err);
  }
};
