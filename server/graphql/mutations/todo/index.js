const createTodo = async (_parent, { title, categoryId }, { req, prisma }) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) throw new Error("user not found");

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (!category) throw new Error("category not found");

  try {
    const created = await prisma.todo.create({
      data: {
        title,
        categoryId: category.id,
        userId: user.id,
      },
    });
    console.log(created);
  } catch (error) {
    console.error(error);
    throw new Error("something went wrong creating todo");
  }

  return true;
};

const updateTodo = async (_parent, { title, todoId }, { req, prisma }) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.userId,
    },
  });

  if (!user) {
    throw new Error("user not found");
  }

  const todo = await prisma.todo.findUnique({
    where: {
      id: todoId,
    },
  });

  if (!todo) {
    throw new Error("category not found");
  }

  try {
    await prisma.todo.update({
      where: {
        id: todo.id,
      },
      data: {
        title,
      },
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const deleteTodo = async (_parent, { todoId }, { req, prisma }) => {
  const todo = await prisma.todo.findUnique({
    where: {
      id: todoId,
    },
  });

  if (!todo) {
    throw new Error("todo not found");
  }

  if (req.userId !== todo.userId) {
    throw new Error("category does not belong to ya");
  }

  try {
    await prisma.todo.delete({
      where: {
        id: todo.id,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("something went wrong deleting todo");
  }

  return true;
};

const toggleDone = async (_parent, { todoId }, { req, prisma }) => {
  console.log(req.userId);
  const todo = await prisma.todo.findUnique({ where: { id: todoId } });
  if (!todo) throw new Error("todo not found");

  if (req.userId !== todo.userId) throw new Error("todo does not belong to ya");

  try {
    await prisma.todo.update({
      where: { id: todo.id },
      data: {
        done: !this.done,
      },
    });
  } catch (error) {
    console.error(error);
    return false;
  }
  return true;
};
module.exports = { createTodo, updateTodo, deleteTodo, toggleDone };
