const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({
  errorFormat: "pretty",
  log: ["error"],
});

exports.getById = async (req, res) => {
  try {
    const t = await prisma.expense.findUnique({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).send(t);
  } catch (err) {
    res.status(400).send({
      code: "EC01",
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
    const t = await prisma.expense.findMany({
      skip: pageSize * page,
      take: pageSize,
      sortBy: sortBy,
      sortOrder: sortOrder,
    });
    res.status(200).send(t);
  } catch (err) {
    res.status(400).send({
      code: "EC02",
      error: err,
    });
  }
};

exports.getList = async (req, res) => {
  const sortBy = req.query.sortBy;
  const sortOrder = req.query.sortOrder;

  try {
    const t = await prisma.expense.findMany({
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    res.status(200).send(t);
  } catch (err) {
    res.status(400).send({
      code: "EC03",
      error: err,
    });
  }
};

exports.create = async (req, res) => {
  let { name, priority } = req.body;

  try {
    const t = await prisma.expense.create({
      data: {
        name,
        priority,
      },
    });
    res.status(200).send(t);
  } catch (err) {
    res.status(400).send({
      code: "EC04",
      error: err,
    });
  }
};

exports.update = async (req, res) => {
  let { id, name, priority } = req.body;

  try {
    const t = await prisma.expense.update({
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
      code: "EC05",
      error: err,
    });
  }
};

exports.remove = async (req, res) => {
  let { id } = req.params.id;
  try {
    const t = await prisma.expense.delete({
      where: {
        id: id,
      },
    });
    res.status(200).send(t);
  } catch (err) {
    res.status(400).send({
      code: "EC06",
      error: err,
    });
  }
};
