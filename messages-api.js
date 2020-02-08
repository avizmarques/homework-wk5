const express = require("express");
const app = express();
const port = 3000;
const bodyParser = express.json();

let reqCount = 0;

reqCountMiddleware = (req, res, next) => {
  reqCount++;
  return reqCount < 6 ? next() : res.status(429).end();
};

app.use(bodyParser);
app.use(reqCountMiddleware);
app.listen(port);

app.post("/messages", (req, res) =>
  Object.keys(req.body).length &&
  Object.values(req.body).every(val => val.length)
    ? res.json(req.body)
    : res.status(400).end()
);
