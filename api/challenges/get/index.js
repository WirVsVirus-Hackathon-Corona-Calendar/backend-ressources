const { DynamoDB } = require('aws-sdk')

const headers =  {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Headers': '*',
};

exports.handler = async (event) => {
  const docClient = new DynamoDB.DocumentClient();

  const params = { TableName: 'challenges' }; 
  
  const result = await docClient
    .scan(params)
    .promise()
    .catch(console.error);
    
  if (!result) {
    return {
      statusCode: 500,
       headers,
    }
  }
  
  if (!result.Items || result.Items.length < 1) {
    return {
      statusCode: 204,
       headers,
    }
  }
  
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(result.Items)
  };
};

