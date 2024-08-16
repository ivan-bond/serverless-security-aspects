const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();

exports.handler = async (event) => {
    const functionName = 'addTodo';

    try {
        current_concurrency = await lambda.getFunctionConcurrency({
            FunctionName: functionName
        }).promise();

        if (current_concurrency == 5) {
            try {
                await lambda.deleteFunctionConcurrency({
                    FunctionName: functionName
                }).promise();
                console.log(`Removed concurrency limit for function ${functionName}`);
            } catch (error) {
                console.error(`Failed to remove concurrency limit: ${error.message}`);
            }
        } else {
            console.log("Concurrency limit of function already unlimited")
        }
    } catch (error) {
        console.error(`Failed to get current concurrency limit: ${error.message}`);
    }
};
