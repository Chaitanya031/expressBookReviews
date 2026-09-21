const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const {username,password} = req.body;
  if (!username || !password) return res.status(400).json({message:"Username and password required"});
  if (users.some(u => u.username === username)) return res.status(409).json({message:"User already exists"});
  users.push({username,password});
  return res.status(201).json({message:"User successfully registered. Now you can login"});
});

public_users.get('/', (req,res) => {
  res.json(books);
});

public_users.get('/isbn/:isbn', (req,res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({message:"Book not found"});
  res.json(book);
});

public_users.get('/author/:author', (req,res) => {
  const author = req.params.author.toLowerCase();
  const result = Object.values(books).filter(b => b.author.toLowerCase().includes(author));
  res.json(result);
});

public_users.get('/title/:title', (req,res) => {
  const title = req.params.title.toLowerCase();
  const result = Object.values(books).filter(b => b.title.toLowerCase().includes(title));
  res.json(result);
});

public_users.get('/review/:isbn', (req,res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({message:"Book not found"});
  res.json(book.reviews);
});

module.exports.general = public_users;
