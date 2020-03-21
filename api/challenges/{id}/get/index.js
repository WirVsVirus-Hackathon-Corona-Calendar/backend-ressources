const { DynamoDB } = require('aws-sdk')

exports.handler = async (event) => {
  const docClient = new DynamoDB.DocumentClient();
  
  console.info('%o', event);
  
  if (!event || !event.pathParameters.id) {
      return {
          statusCode: 400,
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
    }
  }
  
  if (!result.Item) {
    return {
      statusCode: 204
    }
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify(result.Item)
  };
};

