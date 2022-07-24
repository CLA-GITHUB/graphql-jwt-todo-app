const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    me: User!
    getTodos: [Todo]!
  }
  type Mutation {
    login(email: String!, password: String!): User!
    register(name: String!, email: String!, password: String!): Boolean
    invalidateToken: Boolean!
    deleteAll: Boolean!
    createCategory(title: String!): Boolean!
    updateCategory(title: String!, categoryId: Int!): Boolean!
    deleteCategory(categoryId: Int!): Boolean!
    createTodo(title: String!, categoryId: Int!): Boolean!
    updateTodo(title: String!, todoId: Int!): Boolean!
    deleteTodo(todoId: Int!): Boolean!
    toggleDone(todoId: Int!): Boolean!
  }

  type Todo {
    id: ID!
    userId: ID!
    category: Category!
    categoryId: ID!
    title: String!
    done: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Category {
    id: ID!
    creatorId: ID!
    title: String!
    createdAt: String!
    updatedAt: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    todos: [Todo]!
    category: [Category]!
    count: Int!
  }
`;

module.exports = typeDefs;
