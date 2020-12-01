const { User } = require("../models");

exports.getUsersData = async (req, res) => {
  try {
    const userData = await User.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });
    res.send({
      message: "Data has been loaded successfully",
      data: {
        users: userData,
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

exports.changePhoto = async (req, res) => {
  const user = req.user;
  console.log(user);
  try {
    const photo = req.files["photo"][0].filename;

    // get user info
    const findUser = await User.findOne({
      where: {
        id: user.id,
      },
    });

    // if user exist in database, then update the photo
    if (findUser) {
      await User.update(
        {
          photo: photo,
        },
        {
          where: {
            id: user.id,
          },
        }
      );
      res.send({
        message: "Your photo has been updated",
        data: {
          userId: user.id,
          photo: photo,
        },
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      error: {
        message: "SERVER ERROR",
      },
    });
  }
};
