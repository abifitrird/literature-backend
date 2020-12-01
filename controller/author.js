const { User } = require("../models");

// function to get all literature that created by user
exports.getMyLiterature = async (req, res) => {
  const { id } = req.user;
  try {
    // get 1 user object (author)
    const user = await User.findOne({
      where: {
        id,
      },
    });
    const myLiterature = await user.getWork();
    res.send({
      message: "Data has been loaded successfully",
      data: {
        creation: myLiterature,
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
