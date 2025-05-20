require('openai/shims/node');
require('@testing-library/jest-dom');

const fetch = require('node-fetch'); // v2
const { Request, Response, Headers } = fetch;

global.fetch = fetch;
global.Request = Request;
global.Response = Response;
global.Headers = Headers;