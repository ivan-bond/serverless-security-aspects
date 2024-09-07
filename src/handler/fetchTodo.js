const { v4 } = require("uuid")
const AWS = require("aws-sdk")

const middy = require("middy")
const { errorHandler } = require("../utils/errorHandler")
const { authorize } = require("../utils/tokenValidator")

const fetchTodo = middy(async (event) => {

  const dynamo = new AWS.DynamoDB.DocumentClient()
  
  const { id } = event.pathParameters

  let todo;

  try {
    const result = await dynamo.get({
        TableName: "TodoTable",
        Key: { id }
    }).promise()
    todo = result.Item
  } catch (error) {
    console.log(error)
  }

  return {
    statusCode: 200,
    body: JSON.stringify(todo),
  };
}).use(authorize())
  .use(errorHandler());

module.exports = {
  handler: fetchTodo
}
