const { compareSync } = require("bcryptjs");
const createTokens = require("../../auth");

module.exports = async (_parent, { email, password }, { prisma, res }) => {
  //find a user
  const foundUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
    include: {
      todos: true,
      category: true,
    },
  });
  if (!foundUser) {
    throw new Error("user not found");
  }

  const passwordMatch = compareSync(password, foundUser.password);
  if (!passwordMatch) {
    throw new Error("invalid credentials");
  }

  //create the token in the cookie
  const { accessToken, refreshToken } = createTokens(foundUser);

  res.cookie("accessToken", accessToken, {
    maxAge: 60 * 60 * 15,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.cookie("refreshToken", refreshToken, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  return foundUser;
};
