const { hashSync } = require("bcryptjs");
let users = require("../data/users");
const loginMutation = require("./mutations/loginMutation");
const {
  createCategory,
  updateCategory,
  deleteCategory,
} = require("./mutations/category");
const {
  createTodo,
  updateTodo,
  deleteTodo,
  toggleDone,
} = require("./mutations/todo");

const resolvers = {
  Query: {
    me: async (_parent, _args, { req, prisma }) => {
      const foundUser = await prisma.user.findUnique({
        where: {
          id: req.userId,
        },
        include: {
          todos: { include: { category: true } },
          category: true,
        },
      });

      if (!foundUser) {
        throw new Error("user not found");
      }

      return foundUser;
    },
    getTodos: async (_, __, { prisma }) => {
      return await prisma.todo.findMany({ include: { category: true } });
    },
  },

  Mutation: {
    deleteAll: async (_, __, { prisma }) => {
      try {
        await prisma.category.deleteMany();
        await prisma.todo.deleteMany();
        await prisma.user.deleteMany();

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },

    // registers a user
    register: async (_parent, { name, email, password }, { prisma }) => {
      const hashedPassword = hashSync(password, 12);

      try {
        await prisma.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
          },
        });
      } catch (error) {
        console.error(error);
        throw new Error("something went wrong creating your account");
      }
      return true;
    },

    // login user
    login: loginMutation,

    invalidateToken: (_parent, _args, { req, res }) => {
      if (!req.userId) {
        return false;
      }

      const user = users.find((user) => user.id == req.userId);
      if (!user) {
        return false;
      }

      user.count += 1;
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return true;
    },

    createCategory,
    updateCategory,
    deleteCategory,

    createTodo,
    updateTodo,
    deleteTodo,
    toggleDone,
  },
};

module.exports = resolvers;
