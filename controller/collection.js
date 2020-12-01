const { User, Literature, Collection } = require("../models");

// function to get all literature that add by user to their collection
exports.getMyCollection = async (req, res) => {
  const { id } = req.user;
  try {
    // get 1 user object (author)
    const user = await User.findOne({
      where: {
        id,
      },
    });
    const myCollection = await user.getLiterature();
    res.send({
      message: "Data has been loaded successfully",
      data: {
        collection: myCollection,
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

// funtion add new Literature data
exports.addCollection = async (req, res) => {
  const { id } = req.user;
  const { id_literature } = req.params;
  try {
    // get 1 user object
    const user = await User.findOne({
      where: {
        id,
      },
    });

    // find literature data
    const literatureData = await Literature.findOne({
      where: {
        id: id_literature,
      },
    });

    const isExist = await Collection.findOne({
      where: {
        userId: id,
        literatureId: id_literature,
      },
    });

    if (!isExist) {
      await user.addLiterature(literatureData);

      res.send({
        message: "Literature has been added to your collection",
        data: {
          literature: literatureData,
        },
      });
    } else {
      res.status(403).send({
        error: {
          message: "Data already exist",
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
