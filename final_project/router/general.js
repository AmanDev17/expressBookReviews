const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    }
    return res.status(404).json({message: "User already exists!"});
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Task 10: Get all books using Async/Await & Axios
public_users.get('/', async function (req, res) {
    try {
        const response = await Promise.resolve(books); 
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({message: "Error fetching books"});
    }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    new Promise((resolve, reject) => {
        if (books[isbn]) resolve(books[isbn]);
        else reject({status: 404, message: "ISBN not found"});
    })
    .then(book => res.status(200).json(book))
    .catch(err => res.status(err.status).json({message: err.message}));
});
  
// Task 12: Get book details based on author using Promises
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    new Promise((resolve) => {
        let filteredBooks = Object.values(books).filter(b => b.author === author);
        resolve(filteredBooks);
    })
    .then(books => res.status(200).json(books));
});

// Task 13: Get all books based on title using Promises
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    new Promise((resolve) => {
        let filteredBooks = Object.values(books).filter(b => b.title === title);
        resolve(filteredBooks);
    })
    .then(books => res.status(200).json(books));
});

// Task 6: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) res.status(200).json(books[isbn].reviews);
  else res.status(404).json({message: "Book not found"});
});

module.exports.general = public_users;
