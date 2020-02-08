const express = require("express");
const app = express();
const port = 3000;
const bodyParser = express.json();

app.locals.count = 0;

reqCountMiddleware = (req, res, next) =>
  app.locals.count < 5 ? next() : res.status(429).end();

app.use(bodyParser);
app.use(reqCountMiddleware);
app.listen(port);

app.post("/messages", (req, res) => {
  if (
    Object.keys(req.body).length &&
    Object.values(req.body).every(val => val.length)
  ) {
    app.locals.count = app.locals.count + 1;
    return res.send(req.body);
  }
  return res.status(400).end();
});
