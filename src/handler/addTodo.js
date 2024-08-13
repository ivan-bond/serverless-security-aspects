"use strict"

const { v4 } = require("uuid")
const AWS = require("aws-sdk")
const dynamo = new AWS.DynamoDB.DocumentClient()

const middy = require("middy")
const Joi = require("joi")
const { errorHandler } = require("../utils/errorHandler")
const { bodyValidator } = require("../utils/validator")
const { authorize } = require("../utils/tokenValidator")

const todoSchema = Joi.object({
  todo: Joi.string().required(),
  priority: Joi.number().integer().min(1).max(5)
})

module.exports.handler = middy(async (event) => {

  const { username: userEmail } = event.user
  const { todo } = JSON.parse(event.body)
  const { priority } = JSON.parse(event.body)
  const createdAt = new Date().toISOString()
  const id = v4()

  console.log("This is the id:", id)

  const newTodo = {
    id,
    userEmail,
    todo,
    priority,
    createdAt,
    completed: false
  }

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: newTodo
  }
  
  console.log("Saving new todo:", newTodo);

  try {
    await dynamo.put(params).promise()
  } catch (error) {
    console.log(error)
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Note has been added successfully",
    }),
  };

}).use(authorize())
  .use(bodyValidator(todoSchema))
  .use(errorHandler());