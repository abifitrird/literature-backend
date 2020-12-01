const { Literature, User } = require("../models");
const { Op } = require("sequelize");
var dayjs = require("dayjs");

// funtion to get all Literature data
exports.getLiteratures = async (req, res) => {
  try {
    const allData = await Literature.findAll({
      where: {
        status: "Approved",
      },
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

// function to get literature detail
exports.getOneLiterature = async (req, res) => {
  try {
    const { id } = req.params;
    const detailLiterature = await Literature.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res.send({
      message: "Data has been loaded successfully",
      data: {
        literature: detailLiterature,
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

// funtion to get all Literature data
exports.getByTitle = async (req, res) => {
  const { keyword } = req.params;
  try {
    const literatureData = await Literature.findAll({
      where: {
        title: {
          [Op.like]: `%${keyword}%`,
        },
        status: "Approved",
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res.send({
      message: "Data has been loaded successfully",
      data: {
        literature: literatureData,
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

// function to get Literature data filtered by date
exports.getByYear = async (req, res) => {
  const { year } = req.params;
  // dayjs.extend(isBetween);

  try {
    const filteredByYear = await Literature.findAll({
      where: {
        publication: {
          // [Op.between]: [`${year}-01-01`, `${year}-12-31`],
          [Op.gte]: [`${year}-01-01`],
        },
        status: "Approved",
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res.send({
      message: `Here are literature which published in ${year}`,
      data: {
        literature: filteredByYear,
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
exports.addLiterature = async (req, res) => {
  const { id } = req.user;
  try {
    const { title, publication, pages, isbn, author, status } = req.body;
    const file = req.files["file"][0].filename;

    // get 1 user object (author)
    const user = await User.findOne({
      where: {
        id,
      },
    });

    // create literature data
    const literatureCreated = await Literature.create({
      title,
      publication,
      pages,
      isbn,
      author,
      status,
      file,
    });

    // add new literature with all data that have been stored in literatureCreated
    await user.addWork(literatureCreated);

    res.send({
      message: "New literature entry has been created successfully",
      data: {
        literature: literatureCreated,
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

exports.getYears = async (req, res) => {
  try {
    const yearsData = await Literature.findAll({
      where: {
        status: "Approved",
      },
      group: ["publication"],
      attributes: ["publication"],
    });
    res.send({
      message: "List of years that available on database",
      data: {
        years: yearsData,
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

exports.downloadFile = async (req, res) => {
  try {
    const { id } = req.params;

    const fileName = await Literature.findOne({
      where: {
        id,
      },
      attributes: ["file"],
    });
    console.log(fileName.file);

    const literatureFile = `${__dirname}/../uploads/files/${fileName.file}`;
    res.download(literatureFile, function (error) {
      console.log("Error : ", error);
    }); // Set disposition and send it.

    res.send({
      message: "File has been downloaded",
      data: {
        id: id,
        file: fileName.file,
      },
    });
  } catch (err) {
    res.status(500).send({
      error: {
        message: "SERVER ERROR",
      },
    });
  }
};
