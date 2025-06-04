const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if (username && !password) {
      return res.status(400).send({ message: "Password is required!" });
  }
  if (!username && password) {
      return res.status(400).send({ message: "Username is required!" });
  }
  if (users.some(user => user.username === username)) {
      return res.status(400).send({ message: `The user ${username} already exists!` });
  }
  if (username && password) {
      users.push({
          username: username,
          password: password
      });
      return res.send(`The user ${username} has been added!`);
  }
  res.status(400).send({ message: "Username and password are required!" });
});

/*
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
});
*/

public_users.get('/',function (req, res) {
  const get_books = new Promise ((resolve,reject) => {resolve(res.send(JSON.stringify(books,null,4)));});
  get_books.then(() => console.log("Promise for task 10 resolved"));
});

/*
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
*/

public_users.get('/isbn/:isbn',function (req, res) {
  const get_books_isbn = new Promise ((resolve,reject) => {
  const isbn = req.params.isbn;
    if (req.params.isbn <= 10) {resolve(res.send(books[isbn]));}
    else {reject(res.send("ISBN not found"))}
  });

  get_books_isbn.then(function(){console.log("Promise for task 11 resolved");}).catch(function(){console.log("ISBN not found");});

});

/*  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
    const authorName = req.params.author;
    const bookKeys = Object.keys(books);
    const booksByAuthor = [];

    bookKeys.forEach(key => {
        if (books[key].author === authorName) {
            booksByAuthor.push(books[key]);
        }
    });

    if (booksByAuthor.length > 0) {
        res.json(booksByAuthor);
    } else {
        res.status(404).json({ message: "No books found by this author." });
    }
});
*/

public_users.get('/author/:author',function (req, res) {
  const get_books_author = new Promise ((resolve,reject) => {
    let booksByAuthor = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["author"] === req.params.author) {
        booksByAuthor.push({"isbn":isbn,
                            "title":books[isbn]["title"],
                            "reviews":books[isbn]["reviews"]});
      resolve(res.send(JSON.stringify({booksByAuthor},null,4)));
        }
      });
      reject(res.send("Mentioned author does not exist"))

    });

    get_books_author.then(function(){console.log("Promise resolved");}).catch(function(){console.log("Mentioned author does not exist");});

    
});


/*
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const titleName = req.params.title;
  const bookKeys = Object.keys(books);
  const booksBytitle = [];

  bookKeys.forEach(key => {
      if (books[key].title === titleName) {
        booksBytitle.push(books[key]);
      }
  });

  if (booksBytitle.length > 0) {
      res.json(booksBytitle);
  } else {
      res.status(404).json({ message: "No books found by this title." });
  }
});
*/

public_users.get('/title/:title',function (req, res) {
  const get_books_title = new Promise ((resolve,reject) => {
    let booksByTitle = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["title"] === req.params.title) {
        booksByTitle.push({"isbn":isbn,
                            "author":books[isbn]["author"],
                            "reviews":books[isbn]["reviews"]});
      resolve(res.send(JSON.stringify({booksByTitle},null,4)));
        }
      });
      reject(res.send("Mentioned title does not exist"))

    });

    get_books_title.then(function(){console.log("Promise resolved");}).catch(function(){console.log("Mentioned title does not exist");});

    
});



//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]["reviews"]);
});



module.exports.general = public_users;
