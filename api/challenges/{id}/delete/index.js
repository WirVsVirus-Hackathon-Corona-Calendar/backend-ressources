const { DynamoDB } = require('aws-sdk')

exports.handler = async (event) => {
  const dynamoDb = new DynamoDB();
  
  if (!event || !event.pathParameters.id) {
      return {
          statusCode: 400,
           headers: {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Headers': '*',
    },
          body: 'id is required'
      }
  } 

  const { id } = event.pathParameters;
  
  const params = { 
    TableName: 'challenges',
    Key: {
      id: {
          S: id,
      },
    },
  };
  
  console.info('Delete challenge with id: %s', id);

  const result = await dynamoDb
    .deleteItem(params)
    .promise()
    .catch(console.error);
    
  if (!result) {
    return {
       headers: {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Headers': '*',
    },
      statusCode: 500,
    }
  }
  
  return {
    statusCode: 200,
     headers: {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Headers': '*',
    },
    body: '{ "message": "Success" }',
  };
};

