const { User } = require("../models");

// hasing or salting credential data such as password
const bycript = require("bcrypt");

// make token for authentication
const jwt = require("jsonwebtoken");

// import validator
const joi = require("@hapi/joi");

// key for decrypt token
const jwtKey = process.env.JWT_KEY;

// is token valid
exports.checkAuth = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });
    res.send({
      message: "User Valid",
      data: {
        user,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: {
        message: "SERVER ERROR",
      },
    });
  }
};

// function to handle register operation
exports.register = async (req, res) => {
  try {
    const {
      email,
      password,
      fullName,
      gender,
      phone,
      address,
      role,
    } = req.body;

    //   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> VALIDATION START <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    const schema = joi.object({
      email: joi.string().email().min(10).required(),
      password: joi.string().min(8).required(),
      fullName: joi.string().min(2).required(),
      gender: joi.string().min(4).required(),
      phone: joi.string().min(10).required(),
      address: joi.string().min(4).required(),
    });

    // get error from joi validation
    const { error } = schema.validate(req.body);

    // if there's any error, then throw validation error messages
    if (error) {
      return res.status(400).send({
        message: error.details[0].message,
      });
    }
    //   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> VALIDATION END <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    //   check if email already exist
    const checkEmail = await User.findOne({
      where: {
        email,
      },
    });
    // if email already exist, let user knows
    if (checkEmail) {
      return res.status(400).send({
        error: {
          message: "Operation failed. Email already exist",
        },
      });
    }

    // if email didn't exist yet
    //  salt strength
    const saltRounds = 10;
    //   salting password
    const hashedPassword = await bycript.hash(password, saltRounds);

    //   hold response body into a temporary variable
    const user = await User.create({
      email,
      password: hashedPassword,
      fullName,
      gender,
      phone,
      address,
      role,
    });

    //   create new jwt after register success
    const token = jwt.sign(
      {
        id: user.id,
      },
      jwtKey
    );

    // send response
    res.send({
      message: "You've been registered successfully",
      data: {
        email: user.email,
        token,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: {
        message: "SERVER ERROR",
      },
    });
  }
};

// function to handle login operation
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> VALIDATION START <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    // email and password validation with certain requirement
    const schema = joi.object({
      email: joi.string().email().min(10).required(),
      password: joi.string().min(8).required(),
    });

    // get error from joi validation
    const { error } = schema.validate(req.body);

    // if there's any error, then throw validation error messages
    if (error) {
      return res.status(400).send({
        message: error.details[0].message,
      });
    }
    //   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> VALIDATION END <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    //   check if email already exist
    const user = await User.findOne({
      where: {
        email,
      },
    });

    // if email already exist, let user knows
    if (!user) {
      return res.status(400).send({
        error: {
          message: "Operation failed. Email invalid",
        },
      });
    }

    // password validation, compare password from req.body to password on database
    const validPassword = await bycript.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send({
        error: {
          message: "Operation failed. Password invalid",
        },
      });
    }

    // make token whenever user login
    const token = jwt.sign(
      {
        id: user.id,
      },
      jwtKey
    );

    // send response
    res.send({
      message: "Login Success",
      data: {
        email,
        token,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: {
        message: "SERVER ERROR",
      },
    });
  }
};
