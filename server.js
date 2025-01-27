const express = require("express");
const helmet = require("helmet");

const userRouter = require("./users/userRouter");

const server = express();

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(
    `${req.method} to ${req.originalUrl} at [${new Date().toISOString()}]`
  );
  next();
}

server.use(helmet());
server.use(express.json());
server.use(logger);

server.use("/api/users", userRouter);

module.exports = server;
