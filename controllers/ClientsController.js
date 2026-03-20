const db = require("../db/queries");
const { body, validationResult, matchedData } = require("express-validator");

const validateClient = [
  body("name")
    .trim()
    .isAlpha()
    .withMessage("Name must contains only letters")
    .isLength({ min: 1, max: 10 })
    .withMessage("Name must be between 1 and 10 chars"),

  body("lastname")
    .trim()
    .isAlpha()
    .withMessage("Last name must contains only letters.")
    .isLength({ min: 1, max: 10 })
    .withMessage("Last name must be between 1 and 10 chars"),

  body("email")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .custom(async (value) => {
      const user = await db.findUserByEmail(value);
      if (user) throw new Error("E-mail already in use");
      return true;
    }),

  body("birth_date")
    .isISO8601()
    .withMessage("Date should be in date format")
    .isAfter("1918-11-11")
    .withMessage("You're too old for this world !")
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
  body("phone_number", "Incorrect format")
    .isMobilePhone(["fr-FR"])
    .custom(async (value) => {
      const user = await db.findUserByPhone(value);
      if (user) throw new Error("Phone number already exists");
      return true;
    }),
  body("sub_status").isIn(["inactive", "active"]),
];
const isSubStatusEqualsActive = body("sub_status").equals("active");
const validateSubClient = [
  body("sub_type").if(isSubStatusEqualsActive).isIn(["monthly", "quarterly"]),
  body("start_date")
    .if(isSubStatusEqualsActive)
    .isISO8601()
    .isBefore()
    .toDate(),
  body("method").if(isSubStatusEqualsActive).isIn(["cb"]),
  body("end_date")
    .if(isSubStatusEqualsActive)
    .isISO8601()
    .toDate()
    .custom((endDate, { req }) => {
      const startDate = new Date(req.body.start_date);
      const MS_PER_DAY = 1000 * 60 * 60 * 24;
      const diffInDays = Math.round((endDate - startDate) / MS_PER_DAY);

      if (diffInDays != 30)
        throw new Error(
          "End date should be 30 days or 60 days after the subscription start date"
        );
      return true;
    }),
  body("amount", "Amount should contain only numbers")
    .if(isSubStatusEqualsActive)
    .isFloat({ min: 59.99, max: 159.99 })
    .toFloat(),
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

exports.userPost = [
  validateClient,
  validateSubClient,
  async (req, res, next) => {
    const errors = validationResult(req);
    const { name, lastname, email, birth_date, phone_number, sub_status } =
      matchedData(req);

    if (!errors.isEmpty()) {
      try {
        const users = await db.getAllClients();
        return res.status(400).render("clients", {
          errors: errors.array(),
          user: {
            name: req.body.name,
            lastname: req.body.lastname,
            email: req.body.email,
            birth_date: req.body.birth_date,
            phone_number: req.body.phone_number,
            sub_status: req.body.sub_status,
          },
          users,
        });
      } catch (err) {
        next(err);
      }
    }

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
        const { start_date, end_date, sub_type, amount, method } =
          matchedData(req);
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
      console.log("redirecting...");
      res.redirect("/");
    } catch (err) {
      next(err);
    }
  },
];
