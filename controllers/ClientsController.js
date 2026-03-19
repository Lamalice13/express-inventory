const db = require("../db/queries");
const { body, validationResult, matchedData } = require("express-validator");

const validateClient = [
  body("name")
    .trim()
    .isAlpha()
    .withMessage("Name must contains only letters.")
    .isLength({ min: 1, max: 10 })
    .withMessage("Name must be between 1 and 10 chars."),

  body("lastname")
    .trim()
    .isAlpha.withMessage("Last name must contains only letters.")
    .isLength({ min: 1, max: 10 })
    .withMessage("Last name must be between 1 and 10 chars."),

  body("email")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .custom(async (value) => {
      const user = await db.findUserByEmail(value);
      if (user) throw new Error("E-mail already in use");
      return true;
    }),

  body("birth_date")
    .isDate()
    .isISO8601()
    .withMessage("Date should be in date format.")
    .toDate()
    .custom((birthDate) => {
      const today = new Date();
      const eighteenYearsAgo = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
      );
      const isEighteen = birthDate <= eighteenYearsAgo;

      if (!isEighteen) throw new Error("Must be 18 years old");

      return true;
    }),
  body("phone_number")
    .isMobilePhone(["fr-FR"])
    .withMessage("Phone number must be in the correct format.")
    .custom(async (value) => {
      const user = await db.findUserByPhone(value);
      if (!user) throw new Error("Phone number already exists");
      return true;
    }),
  body("sub_status").isIn(["inactive", "active"]),
];
const validateSubClient = [
  body("sub_type"),
  body("start_date").isBefore().isISO8601(),
  body("end_date"),
  body("amount"),
];

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
