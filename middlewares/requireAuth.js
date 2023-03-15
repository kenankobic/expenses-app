const { PrismaClient, Role } = require("@prisma/client");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const prisma = new PrismaClient({
  errorFormat: "pretty",
  log: ["error"],
});;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send({
      code: "AUTH01",
      error: "Zabranjen pristup! Molimo prijavite se.",
    });
  }

  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, process.env.SECRET_KEY, async (err, payload) => {
    if (err) {
      return res.status(401).send({
        code: "AUTH02",
        error: "Zabranjen pristup! Molimo prijavite se.",
      });
    }

    const { userId } = payload;
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        city: true,
      },
    });
    req.user = user;
    next();
  });
};
