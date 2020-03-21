const { DynamoDB } = require('aws-sdk')

exports.handler = async (event) => {
  const docClient = new DynamoDB.DocumentClient();
  
  console.info(event);

  const params = { TableName: 'challenges' }; 
  
  const result = await docClient
    .scan(params)
    .promise()
    .catch(console.error);
    
  if (!result) {
    return {
      statusCode: 500,
    }
  }
  
  if (!result.Items || result.Items.length < 1) {
    return {
      statusCode: 204
    }
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify(result.Items)
  };
};

