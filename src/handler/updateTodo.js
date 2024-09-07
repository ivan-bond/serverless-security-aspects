const { v4 } = require("uuid")
const AWS = require("aws-sdk")

const middy = require("middy")
const Joi = require("joi")
const { errorHandler } = require("../utils/errorHandler")
const { bodyValidator } = require("../utils/validator")
const { authorize } = require("../utils/tokenValidator")

const todoSchema = Joi.object({
  completed: Joi.boolean()
})

const updateTodo = middy(async (event) => {

  const dynamo = new AWS.DynamoDB.DocumentClient()

  const { completed } = JSON.parse(event.body)
  const { id } = event.pathParameters

  await dynamo.update({
    TableName: "TodoTable",
    Key: { id },
    UpdateExpression: 'set completed = :completed',
    ExpressionAttributeValues: {
        ':completed': completed
    },
    ReturnValues: "ALL_NEW"
  }).promise()

  return {
    statusCode: 200,
    body: JSON.stringify({
        msg: "Todo Updated"
    }),
  };
}).use(authorize())
  .use(bodyValidator(todoSchema))
  .use(errorHandler());

module.exports = {
  handler: updateTodo
}
