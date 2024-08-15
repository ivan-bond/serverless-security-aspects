const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();

exports.handler = async (event) => {
    // Beispielhafte Logik, um die maximale Anzahl gleichzeitiger Ausführungen festzulegen
    const functionName = 'addTodo';
    const concurrencyLimit = 5; // Anzahl der maximalen gleichzeitigen Ausführungen

    try {
        await lambda.putFunctionConcurrency({
            FunctionName: functionName,
            ReservedConcurrentExecutions: concurrencyLimit
        }).promise();
        console.log(`Set concurrency limit of ${concurrencyLimit} for function ${functionName}`);
    } catch (error) {
        console.error(`Failed to set concurrency limit: ${error.message}`);
    }
};
