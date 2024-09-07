const { v4 } = require("uuid")
const AWS = require("aws-sdk")

const middy = require("middy")
const { errorHandler } = require("../utils/errorHandler")
const { authorize } = require("../utils/tokenValidator")

const fetchTodos = middy(async (event) => {

  const dynamo = new AWS.DynamoDB.DocumentClient()

  let todos;

  try {
    const result = await dynamo.scan({ TableName: "TodoTable" }).promise()
    todos = result.Items
  } catch (error) {
    console.log(error)
  }

  return {
    statusCode: 200,
    body: JSON.stringify(todos),
  };
}).use(authorize())
  .use(errorHandler());

module.exports = {
  handler: fetchTodos
}
