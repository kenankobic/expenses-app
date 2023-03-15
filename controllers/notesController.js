const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({
  errorFormat: "pretty",
  log: ["error"],
});

exports.getById = async (req, res) => {
  try {
    const t = await prisma.note.findUnique({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).send(t);
  } catch (err) {
    res.status(400).send({
      code: "NC01",
      error: err,
    });
  }
};

exports.getPage = async (req, res) => {
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 12;
  const page = req.query.page ? parseInt(req.query.page) : 0;
  const sortBy = req.query.sortBy;
  const sortOrder = req.query.sortOrder;

  try {
    const t = await prisma.note.findMany({
      skip: pageSize * page,
      take: pageSize,
      sortBy: sortBy,
      sortOrder: sortOrder,
    });
    res.status(200).send(t);
  } catch (err) {
    res.status(400).send({
      code: "NC02",
      error: err,
    });
  }
};

exports.getList = async (req, res) => {
  const sortBy = req.query.sortBy;
  const sortOrder = req.query.sortOrder;

  try {
    const t = await prisma.note.findMany({
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    res.status(200).send(t);
  } catch (err) {
    res.status(400).send({
      code: "NC03",
      error: err,
    });
  }
};

exports.create = async (req, res) => {
  let { name, priority } = req.body;

  try {
    const t = await prisma.note.create({
      data: {
        name,
        priority,
      },
    });
    res.status(200).send(t);
  } catch (err) {
    res.status(400).send({
      code: "NC04",
      error: err,
    });
  }
};

exports.update = async (req, res) => {
  let { id, name, priority } = req.body;

  try {
    const t = await prisma.note.update({
      where: {
        id: id,
      },
      data: {
        name,
        priority,
      },
    });
    res.status(200).send(t);
  } catch (err) {
    res.status(400).send({
      code: "NC05",
      error: err,
    });
  }
};

exports.remove = async (req, res) => {
  let { id } = req.params.id;
  try {
    const t = await prisma.note.delete({
      where: {
        id: id,
      },
    });
    res.status(200).send(t);
  } catch (err) {
    res.status(400).send({
      code: "NC06",
      error: err,
    });
  }
};
