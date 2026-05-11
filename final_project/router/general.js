const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// --- Task 7: Register a new user ---
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// --- Task 10 (Async version of Task 2): Get the book list ---
public_users.get('/', function (req, res) {
  const get_books = new Promise((resolve, reject) => {
    resolve(res.send(JSON.stringify(books, null, 4)));
  });
  get_books.then(() => console.log("Promise for Task 10 resolved"));
});

// --- Task 11 (Async version of Task 3): Get book details based on ISBN ---
public_users.get('/isbn/:isbn', function (req, res) {
  const get_isbn = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        resolve(res.send(books[isbn]));
    } else {
        reject(res.status(404).json({message: "Book not found"}));
    }
  });
  get_isbn.then(() => console.log("Promise for Task 11 resolved"));
});
  
// --- Task 12 (Async version of Task 4): Get book details based on author ---
public_users.get('/author/:author', function (req, res) {
  const get_author = new Promise((resolve, reject) => {
    const author = req.params.author;
    let filtered_books = Object.values(books).filter(book => book.author === author);
    resolve(res.send(filtered_books));
  });
  get_author.then(() => console.log("Promise for Task 12 resolved"));
});

// --- Task 13 (Async version of Task 5): Get all books based on title ---
public_users.get('/title/:title', function (req, res) {
  const get_title = new Promise((resolve, reject) => {
    const title = req.params.title;
    let filtered_books = Object.values(books).filter(book => book.title === title);
    resolve(res.send(filtered_books));
  });
  get_title.then(() => console.log("Promise for Task 13 resolved"));
});

// --- Task 6: Get book review ---
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
      res.send(books[isbn].reviews);
  } else {
      res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
