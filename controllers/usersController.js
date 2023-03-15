const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({
  errorFormat: "pretty",
  log: ["error"],
});

/**
 * Helper functions
 */
extractUserInfo = (user) => {
  return {
    userId: user.id,
    email: user.email,
    username: user.username,
    type: user.type,
  };
};

generateToken = (user) => {
  return jwt.sign(
    {
      ...user,
      expiresIn: process.env.TOKEN_DURATION,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: process.env.TOKEN_DURATION,
    }
  );
};

generateRefreshToken = (user) => {
  return jwt.sign(
    {
      ...user,
    },
    process.env.REFRESH_TOKEN_KEY
  );
};

comparePassword = (user, candidatePassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
      if (err) return reject(err);
      if (!isMatch) return reject(false);
      resolve(true);
    });
  });
};

generateTokenThroughToken = async (refreshToken, res) => {
  if (!refreshToken) {
    return res.status(400).send({
      code: "AUTH03",
      error: "Neispravan refresh token",
    });
  }

  const refToken = await prisma.userAuth.findUnique({
    where: {
      refreshToken: refreshToken,
    },
  });

  if (!refToken)
    return res.status(403).send({
      code: "AUTH04",
      error: "Neispravan refresh token",
    });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (err, user) => {
    if (err)
      return res.status(403).send({
        code: "AUTH05",
        error: "Neispravan refresh token",
      });

    try {
      const newToken = generateToken(user);
      const newRefreshToken = generateRefreshToken(user);

      prisma.userAuth.delete({
        where: {
          refreshToken: refreshToken,
        },
      });
      prisma.userAuth.create({
        data: {
          user,
          refreshToken: newRefreshToken,
        },
      });

      return res.status(200).send({
        token: newToken,
        refreshToken: newRefreshToken,
      });
    } catch (err) {
      return res.status(403).send({
        code: "UC01",
        error: err,
      });
    }
  });
};

generateTokenThroughCredentials = async (email, password, res) => {
  if (!email || !password) {
    return res.status(400).send({
      code: "AUTH06",
      error: "Email adresa i šifra su obavezni",
    });
  }


  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      // include: {
      //   city: true,
      // },
    });

    if (!user)
      return res.status(404).send({
        code: "AUTH07",
        error: "Neispravna email adresa/šifra",
      });

    await comparePassword(user, password);
    const token = generateToken(extractUserInfo(user));
    const refreshToken = generateRefreshToken(extractUserInfo(user));
    res.send({
      token,
      refreshToken,
    });
  } catch (err) {
    return res.status(400).send({
      code: "AUTH0",
      error: "Neispravna email adresa/šifra",
    });
  }
};

exports.createUserAsAdmin = async (req, res) => {
  res.status(501).send({
    error: "Metoda nije implementirana.",
  });
};

exports.getUsersPage = async (req, res) => {
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const page = req.query.page ? parseInt(req.query.page) : 0;
  const sortBy = req.query.sortBy;
  const sortOrder = req.query.sortOrder;

  try {
    const t = await prisma.user.findMany({
      skip: pageSize * page,
      take: pageSize,
      sortBy: sortBy,
      sortOrder: sortOrder,
    });
    res.status(200).send(t);
  } catch (err) {
    res.status(400).send({
      code: "UC06",
      error: err,
    });
  }
};

/**
 * Registers a new user
 */
exports.signUp = async (req, res) => {
  let { email, password, username } = req.body;
  try {
    bcrypt.genSalt(10, async (err, salt) => {
      if (err) throw err;

      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          return next(err);
        }
        password = hash;

        const user = await prisma.user.create({
          data: {
            email,
            password,
            username,
          },
        });
        const token = generateToken(extractUserInfo(user));
        const refreshToken = generateRefreshToken(extractUserInfo(user));
        res.send({
          token,
          refreshToken,
        });
      });
    });
  } catch (err) {
    return res.status(400).send({
      code: "UC07",
      error: err,
    });
  }
};

/**
 * Generates a new token either through refresh token or credentials
 */
exports.getToken = async (req, res) => {
  const { grantType, email, password, refreshToken } = req.body;
  switch (grantType) {
    case "refreshToken":
      return generateTokenThroughToken(refreshToken, res);
    case "credentials":
    default:
      return generateTokenThroughCredentials(email, password, res);
  }
};

exports.getUserById = async (req, res) => {
  const id = req.params.id;

  try {
    const t = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
      select: {
        id: true,
        active: true,
        city: true,
        role: true,
        email: true,
        username: true,
        phoneNumber: true,
      },
    });
    res.status(200).send(t);
  } catch (err) {
    res.status(400).send({
      code: "UC09",
      error: err,
    });
  }
};
