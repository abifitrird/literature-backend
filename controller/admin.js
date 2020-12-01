const { Literature, User } = require("../models");
const { Op } = require("sequelize");

// funtion to get all Literature data
exports.getAllLiterature = async (req, res) => {
  const { id } = req.user;

  const accessUser = await User.findOne({
    where: {
      id,
    },
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });

  if (accessUser.role != 1) {
    res.status(404).send({
      error: {
        message: "Access Denied",
      },
    });
    return false;
  }

  try {
    const allData = await Literature.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res.send({
      message: "Data has been loaded successfully",
      data: {
        literature: allData,
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

// function to update status approvement
exports.updateStatus = async (req, res) => {
  const user = req.user;
  const accessUser = await User.findOne({
    where: {
      id: user.id,
    },
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });

  if (accessUser.role != 1) {
    res.status(404).send({
      error: {
        message: "Access Denied",
      },
    });
    return false;
  }

  const { id } = req.params;
  const { status } = req.params;
  try {
    const dataLiterature = await Literature.findOne({
      where: {
        id,
      },
    });

    if (dataLiterature) {
      await Literature.update(
        {
          status: status,
        },
        {
          where: {
            id,
          },
        }
      );
      const updatedLiterature = await Literature.findOne({
        where: {
          id,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      res.send({
        message: "Your request has been updated successfully",
        data: {
          literature: updatedLiterature,
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

exports.getByStatus = async (req, res) => {
  const { sortStatus } = req.params;
  try {
    const sortLiterature = await Literature.findAll({
      where: {
        status: {
          [Op.like]: `%${sortStatus}%`,
        },
      },
    });
    res.send({
      message: "Data has been sorted by status",
      data: {
        literatures: sortLiterature,
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
