// server.js
const express = require('express');
const app = express();
const PORT = 3000;

// Add this near the top of server.js, after creating the app
app.set('view engine', 'ejs');

// TODO: Allow your server to parse JSON bodies in requests
// Hint: look at express.json() middleware

app.use(express.json())

app.get('/', (req, res) => {
    // TODO: Send back a string that says "Hello World"
    res.send("Hello World")
});



let books = [
    { id: 1, title: "The Great Gatsby" },
    { id: 2, title: "1984" }
];

// GET: Fetch all books
app.get('/books', (req, res) => {
    res.json(books);
});

// POST: Add a new book
app.post('/books', (req, res) => {
    // TODO: Take the book title from req.body and add it to the books array
    // Then, return the new list with a 201 status code
    const {title} = req.body;

    const newBook = {
        id: Math.max(0, ...books.map(book => book.id)) + 1,
        title: title
    };
    books.push(newBook);
    res.status(201).json(books);
});

// PATCH: Update a book's title by ID
app.patch('/books/:id', (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    // TODO: Find the book with the matching id and update its title to the one requested in req.body
    // Return the updated book, or a 404 error if not found
    const book = books.find(book => book.id === Number(id));

    if (!book) {
        return res.status(404).json({error: "Book not found"});

    }
    book.title = title;
    res.json(book);
});

// DELETE: Remove a book by ID
app.delete('/books/:id', (req, res) => {
    const { id } = req.params;
    // TODO: Filter the books array to remove the book with the matching id
    // Return the updated array
    books = books.filter(book => book.id !== Number(id));

    res.json(books);
});

app.get('/books/view', (req, res) => {
    res.render('books', { books: books });
});

require('dotenv').config();

app.get('/secrets', (req, res) => {
    // TODO: Access the SPOTIFY_KEY from process.env and send it back to the client
    const spotifyKey = process.env.SPOTIFY_KEY;
    res.send(spotifyKey);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});