const { send } = require('micro');
const users = require('./src/services/user.service');
const auth = require('./src/authentication/authentication');
const db = require('./src/models/db');

module.exports = async function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,HEAD,OPTIONS,POST,PUT,DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Authorization, Access-Control-Allow-Headers, Access-Control-Allow-Methods, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
  );

  if (req.method == 'OPTIONS') {
    return '';
  }
  try {
    switch (req.url) {
      case '/api/setup':
        send(res, 200, await users.setup());
        break;

      //case '/api/authentication':
      //  return auth.login(req, res);

      case '/api/login':
        return auth.login(req,res);

      case '/api/verify': {
        let payload = auth.decode(req, res);
        if (payload !== null) {
          send(res, 200, payload);
        }
        break;
      }

      case '/api/users': { // or any api call that requires token to access
        let payload = auth.decode(req, res);
        if (payload !== null) {
          // console.log("Current user making api call: ", payload);
          send(res, 200, await users.list());
        }
        break;
      }

      default:
        break;
    }
  } catch (err) {
    if (process.env.NODE_ENV !== 'production' && err.stack) {
      console.error(err.stack);
    }

    send(res, err.statusCode || 500, { error: true, message: err.message });
  }
};
