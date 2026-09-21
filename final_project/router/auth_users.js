const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some(u => u.username === username);
};

const authenticatedUser = (username,password) => {
  return users.some(u => u.username === username && u.password === password);
};

regd_users.post("/login", (req,res) => {
  const {username,password} = req.body;
  if (!authenticatedUser(username,password))
    return res.status(401).json({message:"Invalid username or password"});

  const token = jwt.sign({username}, "fingerprint_customer", {expiresIn:"1h"});
  res.json({message:"Login successful", token});
});

regd_users.put("/auth/review/:isbn", (req,res) => {
  const username = req.user.username;
  const isbn = req.params.isbn;
  if (!books[isbn]) return res.status(404).json({message:"Book not found"});

  books[isbn].reviews[username] = req.body.review;
  res.json({message:"Review added/updated successfully", reviews:books[isbn].reviews});
});

regd_users.delete("/auth/review/:isbn", (req,res) => {
  const username = req.user.username;
  const isbn = req.params.isbn;
  if (!books[isbn]) return res.status(404).json({message:"Book not found"});

  delete books[isbn].reviews[username];
  res.json({message:"Review deleted successfully", reviews:books[isbn].reviews});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
