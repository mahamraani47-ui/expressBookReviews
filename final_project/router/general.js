const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: "User already exists"
    });
  }

  users.push({ username, password });

  return res.status(200).json({
    message: "User successfully registered"
  });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const result = await Promise.resolve(books);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const result = await Promise.resolve(books[isbn]);

    if (result) {
      return res.status(200).json(result);
    }

    return res.status(404).json({ message: "Book not found" });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving book" });
  }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const result = await Promise.resolve(
      Object.values(books).filter(book => book.author === author)
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const result = await Promise.resolve(
      Object.values(books).filter(book => book.title === title)
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Get book review
public_users.get('/review/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const result = await Promise.resolve(books[isbn]);

    if (result) {
      return res.status(200).json(result.reviews);
    }

    return res.status(404).json({ message: "Book not found" });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving review" });
  }
});

module.exports.general = public_users;