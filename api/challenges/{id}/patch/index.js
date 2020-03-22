const { DynamoDB, S3 } = require('aws-sdk')

const  bucketName = 'corona-cal';
const bucketURL = 'https://corona-cal.s3-eu-west-1.amazonaws.com/';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Headers': '*',
};

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

exports.handler = async (event) => {
  const dynamoDb = new DynamoDB();
  const docClient = new DynamoDB.DocumentClient();
  const s3 = new S3();
  
  const id = event.pathParameters.id
  
  const { body } = event;
  
  let parsedBody;
  try {
    parsedBody = JSON.parse(body);
  } catch (error) {
    console.error(error);
    
    return {
        statusCode: 400,
        headers,
        body: 'body is invalid json'
    }
  }
  
  if (!parsedBody.title) return { statusCode: 400, headers,body: 'body is missing title' };
  if (!parsedBody.body) return { statusCode: 400, headers, body: 'body is missing body' };
  if (!parsedBody.img) return { statusCode: 400, headers, body: 'body is missing img' };
  
  // Create challenge
  const challenge = {
      id: {
        S: id,
      },
      title: {
        S: parsedBody.title,
      },
      body: {
        S: parsedBody.body,
      },
      icon_url: {
        S: bucketURL+id+".png",
      },
      order: {
        N:parsedBody.order.toString(),
      }
  }
  
  // upload to S3
  var buf = Buffer.from(parsedBody.img, 'base64');
  
  const paramsS3 = {
    Bucket: bucketName,
    Key: id + ".png",
    Body: buf,
    ContentType: "images/png"
  }
 
  const s3Result = await s3
    .putObject(paramsS3)
    .promise()
    .catch(console.error);
 
  if (!s3Result) {
   return {
      headers,
      statusCode: 500,
    }
  }
 
  const paramsPut = { 
    TableName: 'challenges',
    Item: challenge
  }; 
  
  const respPut = await dynamoDb
    .putItem(paramsPut)
    .promise()
    .catch(console.error);
    
  if (!respPut) {
    return {
      headers,
      statusCode: 500,
    }
  }
  
  // Get updated challenge
  const getParams = { 
    TableName: 'challenges',
    Key: {
      id,
    }  
  };

  const getResp = await docClient
    .get(getParams)
    .promise()
    .catch(console.error);
    
  if (!getResp || !getResp.Item) {
    return {
      statusCode: 500,
       headers,
    }
  }
  
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(getResp.Item)
  };
};