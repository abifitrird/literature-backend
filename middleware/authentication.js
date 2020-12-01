const jwt = require("jsonwebtoken");

//   key for decrypt token
const jwtKey = process.env.JWT_KEY;

exports.authenticated = (req, res, next) => {
  let header, token;

  if (
    !(header = req.header("Authorization")) ||
    !(token = header.replace("Bearer ", ""))
  ) {
    return res.status(400).send({
      error: {
        message: "Access Denied",
      },
    });
  }

  try {
    const verified = jwt.verify(token, jwtKey);

    req.user = verified;
    next();
  } catch (err) {
    console.log(err);
    res.status(400).send({
      error: {
        message: "INVALID TOKEN",
      },
    });
  }
};
