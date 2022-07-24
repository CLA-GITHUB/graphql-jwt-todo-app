const createCategory = async (_parent, { title }, { req, res, prisma }) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.userId,
    },
  });

  if (!user) {
    throw new Error("user not found");
  }

  try {
    await prisma.category.create({
      data: {
        title,
        creatorId: req.userId,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("something went wrong creating category");
  }

  return true;
};

const updateCategory = async (
  _parent,
  { title, categoryId },
  { req, prisma }
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.userId,
    },
  });

  if (!user) {
    throw new Error("user not found");
  }

  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    throw new Error("category not found");
  }

  if (user.id !== category.creatorId) {
    throw new Error("category does not belong to ya");
  }

  try {
    await prisma.category.update({
      where: {
        id: category.id,
      },
      data: {
        title,
      },
    });
  } catch (error) {
    console.error(error);
    return false;
  }
  return true;
};

const deleteCategory = async (_parent, { categoryId }, { req, prisma }) => {
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    throw new Error("category not found");
  }

  if (req.userId !== category.creatorId) {
    throw new Error("category does not belong to ya");
  }

  try {
    await prisma.todo.deletMany({
      where: {
        categoryId: category.id,
      },
    });
    await prisma.category.delete({
      where: {
        id: category.id,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("something went wrong deleting category");
  }

  return true;
};

module.exports = { createCategory, updateCategory, deleteCategory };
