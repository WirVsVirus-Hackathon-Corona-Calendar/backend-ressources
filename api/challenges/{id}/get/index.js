const { DynamoDB } = require('aws-sdk')

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Headers': '*',
};

exports.handler = async (event) => {
  const docClient = new DynamoDB.DocumentClient();
  
  console.info('%o', event);
  
  if (!event || !event.pathParameters.id) {
      return {
          statusCode: 400,
           headers,
          body: 'id is required'
      }
  } 

  const { id } = event.pathParameters;
  
  const params = { 
    TableName: 'challenges',
    Key: {
      id,
    }  
  };
  
  console.info('Query challenges with id: %s', id);

  const result = await docClient
    .get(params)
    .promise()
    .catch(console.error);
    
  if (!result) {
    return {
      statusCode: 500,
       headers,
    }
  }
  
  if (!result.Item) {
    return {
       headers,
      statusCode: 204
    }
  }
  
  return {
    statusCode: 200,
      headers,
      body: JSON.stringify(result.Item)
  };
};

