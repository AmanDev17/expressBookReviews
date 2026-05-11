const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const reg_users = express.Router();

// This is the single source of truth for users
let users = [];

const isValid = (username)=>{ 
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  return userswithsamename.length > 0;
}

const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  return validusers.length > 0;
}

// Task 8: Login
reg_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Task 9: Add or modify a book review
reg_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let review = req.query.review;
  let username = req.session.authorization['username'];
  
  if (books[isbn]) {
      let book = books[isbn];
      book.reviews[username] = review;
      return res.status(200).send("The review for the book with ISBN " + isbn + " has been added/updated.");
  } else {
      return res.status(404).json({message: `Book with ISBN ${isbn} not found`});
  }
});

// Task 10: Delete a book review
reg_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let username = req.session.authorization['username'];
  
  if (books[isbn]) {
      delete books[isbn].reviews[username];
      return res.status(200).send("Reviews for the ISBN " + isbn + " posted by the user " + username + " deleted.");
  } else {
      return res.status(404).json({message: `Book with ISBN ${isbn} not found`});
  }
});

module.exports.authenticated = reg_users;
module.exports.isValid = isValid;
module.exports.users = users;