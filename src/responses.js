const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);

// Holds all the user objects.
const users = {};

// Respond Function
const respond = (request, response, content, status, type) => {
  response.writeHead(status, { 'Content-Type': type });
  response.write(content);
  response.end();
};

// HTML responses
const getIndex = (request, response) => {
  respond(request, response, index, 200, 'text/html');
};

const getStyle = (request, response) => {
  respond(request, response, style, 200, 'text/css');
};

// GET
const jsonGetData = (request, response, status, jsonObj) => {
  respond(request, response, JSON.stringify(jsonObj), status, 'application/json');
};

const jsonGetUsers = (request, response) => {
  const responseJSON = {
    users,
  };

  return jsonGetData(request, response, 200, responseJSON);
};

const notFoundGet = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  jsonGetData(request, response, 404, responseJSON);
};

// HEAD
const jsonHeadData = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

const jsonHeadUsers = (request, response) => jsonHeadData(request, response, 200);

const notFoundHead = (request, response) => jsonHeadData(request, response, 404);

// Post

const jsonPostUser = (request, response, body) => {
  // We assume that the user has not passed the correct parameters
  console.log('inside jsonPostUser...');
  const responseObj = {
    message: 'Missing required params.',
  };

  // If this is true return out of the method with a bad request response
  if (!body.name || !body.age) {
    responseObj.id = 'missingParams';
    return jsonGetData(request, response, 400, responseObj);
  }

  // If we get this far user has passed proper parameters in
  let status = 204;

  // If user does not exist, create a new one
  if (!users[body.name]) {
    status = 201;
    users[body.name] = {};
  }

  // assign data to the object
  users[body.name].name = body.name;
  users[body.name].age = body.age;

  // add a message if the user was just added
  if (status === 201) {
    responseObj.message = 'Created Successfully';
    return jsonGetData(request, response, status, responseObj);
  }

  console.log('reached end of post request, sending response...');
  return jsonHeadData(request, response, status);
};

module.exports = {
  getIndex,
  getStyle,
  jsonGetUsers,
  jsonHeadUsers,
  notFoundGet,
  notFoundHead,
  jsonPostUser,
};
