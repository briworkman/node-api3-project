const express = require("express");

const router = express.Router();

const userDb = require("./userDb");
const postDb = require("../posts/postDb");

router.post("/", (req, res) => {
  // do your magic!
});

router.post("/:id/posts", (req, res) => {
  // do your magic!
});

router.get("/", (req, res) => {
  // do your magic!
});

router.get("/:id", (req, res) => {
  // do your magic!
});

router.get("/:id/posts", (req, res) => {
  // do your magic!
});

router.delete("/:id", (req, res) => {
  // do your magic!
});

router.put("/:id", (req, res) => {
  // do your magic!
});

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params;

  userDb
    .getById(id)
    .then(userId => {
      if (userId) {
        userId = req.user;
        next();
      } else {
        res.status(400).json({ errorMessage: "Invalid user id." });
      }
    })
    .catch(error => {
      console.log(
        res
          .status(500)
          .json({ error: "There was an error validating the user id" })
      );
    });
}

function validateUser(req, res, next) {
  const newUser = req.body;

  if (!newUser) {
    res.status(400).json({ message: "Missing user data" });
  } else if (!newUser.name) {
    res.status(400).json({ message: "Missing required name field" });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  // do your magic!
}

module.exports = router;
