const express = require("express");

const router = express.Router();

const Users = require("./userDb");
const Posts = require("../posts/postDb");

router.use(express.json());

router.post("/", validateUser, (req, res) => {
  Users.insert(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ errorMessage: "Error adding the user" });
    });
});

router.post("/:id/posts", (req, res) => {
  const postInfo = { ...req.body, user_id: req.params.id };

  Posts.insert(postInfo)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ errorMessage: "Error posting this post" });
    });
});

router.get("/", (req, res) => {
  Users.get(req.query)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "Error retrieving the user" });
    });
});

router.get("/:id", (req, res) => {
  Users.getById(req.params.id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "Error retrieving the user" });
    });
});

router.get("/:id/posts", (req, res) => {
  Users.getUserPosts(req.params.id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ message: "Error getting the posts for this user" });
    });
});

router.delete("/:id", (req, res) => {
  Users.remove(req.params.id)
    .then(user => {
      if (user > 0) {
        res
          .status(200)
          .json({ message: "The user has been deleted successfully" });
      } else {
        res.status(400).json({ message: "The user could not be found" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "Error removing the user" });
    });
});

router.put("/:id", (req, res) => {
  Users.update(req.params.id, req.body)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "The user could not be found" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "Error updating the user" });
    });
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
  const posts = req.body;

  if (!posts.user_id) {
    res.status(400).json({ message: "Missing user data" });
  } else if (!posts.text) {
    res.status(400).json({ message: "Missing required text field" });
  } else {
    next();
  }
}

module.exports = router;
