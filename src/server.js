const http = require('http');
const url = require('url');
const query = require('querystring');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const responseHandler = require('./responses.js');

// Post - string together data as recieved
const parseContent = (request, response, handlerFunction) => {
  const content = [];

  request.on('error', () => {
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (dataChunk) => {
    content.push(dataChunk);
  });

  request.on('end', () => {
    const contentString = Buffer.concat(content).toString();
    const params = query.parse(contentString);

    console.log('calling handler function...');
    handlerFunction(request, response, params);
  });
};

const handlePost = (request, response, parsedUrl) => {
  console.log('handling post...');
  // STUCK HERE
  if (parsedUrl.pathname === '/addUser') {
    console.log('inside if statement');
    parseContent(request, response, responseHandler.jsonPostUser);
  }
};

// Get
const handleGet = (request, response, parsedUrl) => {
  switch (parsedUrl.pathname) {
    case '/style.css':
      responseHandler.getStyle(request, response);
      break;
    case '/getUsers':
      responseHandler.jsonGetUsers(request, response);
      break;
    case '/':
      responseHandler.getIndex(request, response);
      break;
    default:
      responseHandler.notFoundGet(request, response);
      break;
  }
};

// Head
const handleHead = (request, response, parsedUrl) => {
  switch (parsedUrl.pathname) {
    case '/getUsers':
      responseHandler.jsonHeadUsers(request, response);
      break;
    default:
      responseHandler.notFoundHead(request, response);
      break;
  }
};

// This method sends the user to different urls, depending on the request.
const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  switch (request.method) {
    case 'POST':
      console.log('Post request received. Beginning handlePost');
      handlePost(request, response, parsedUrl);
      break;
    case 'HEAD':
      handleHead(request, response, parsedUrl);
      break;
    case 'GET':
    default:
      handleGet(request, response, parsedUrl);
      break;
  }
};

http.createServer(onRequest).listen(port);
// console.log(`Listening on 127.0.0.1: ${port}`);
