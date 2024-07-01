"use strict"

const { v4 } = require("uuid")
const AWS = require("aws-sdk")

const middy = require("middy")
const Joi = require("joi")
const { errorHandler } = require("../utils/errorHandler")
const { bodyValidator } = require("../utils/validator")
const { authorize } = require("../utils/tokenValidator")

const todoSchema = Joi.object({
  todo: Joi.string().required(),
})

const addTodo = middy(async (event) => {

  const dynamo = new AWS.DynamoDB.DocumentClient()

  const { username: userEmail } = event.user
  const { todo } = JSON.parse(event.body)
  const createdAt = new Date().toISOString()
  const id = v4()

  console.log("This is an id:", id)

  const newTodo = {
    id,
    userEmail,
    todo,
    createdAt,
    completed: false
  }

  const params = {
    TableName: "TodoTable",
    Item: newTodo
  }
  
  console.log("Saving new todo:", newTodo);

  await dynamo.put(params).promise()

  console.log("New todo saved successfully:", newTodo);

  return {
    statusCode: 200,
    body: JSON.stringify(newTodo),
  };

}).use(authorize())
  .use(bodyValidator(todoSchema))
  .use(errorHandler());

  module.exports = {
    handler: addTodo
  }