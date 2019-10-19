# micro-authentication-starter

small starter project for a REST api with Authentication using username and password
and generating JWT.

### included

* micro
* jwt
* bcrypt
* mongodb

### usage

```
MONGODB=<url> SECRET=<secret> npm run start
e.g. $ MONGODB=mongodb://localhost/test2 SECRET=123456 npm run start
```

* navigate to `localhost:3000/api/setup`
* user `admin:password` is created
