const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let users = require("./auth_users.js").users;

const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Username and password required" });

  if (users.some(u => u.username === username))
    return res.status(409).json({ message: "User already exists" });

  users.push({ username, password });

  res.status(201).json({
    message: "User successfully registered. Now you can login"
  });
});

public_users.get("/", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/data");
    res.json(response.data);
  } catch (error) {
    res.json(books);
  }
});

public_users.get("/data", (req, res) => {
  res.json(books);
});

public_users.get("/isbn/:isbn", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/data");
    const book = response.data[req.params.isbn];

    if (!book)
      return res.status(404).json({ message: "Book not found" });

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving book" });
  }
});

public_users.get("/author/:author", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/data");
    const author = req.params.author.toLowerCase();

    const result = Object.values(response.data).filter(book =>
      book.author.toLowerCase().includes(author)
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

public_users.get("/title/:title", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/data");
    const title = req.params.title.toLowerCase();

    const result = Object.values(response.data).filter(book =>
      book.title.toLowerCase().includes(title)
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

public_users.get("/review/:isbn", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/data");
    const book = response.data[req.params.isbn];

    if (!book)
      return res.status(404).json({ message: "Book not found" });

    res.json(book.reviews);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving review" });
  }
});

module.exports.general = public_users;