const express = require('express');
const morgan = require('morgan'); // Import morgan
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(morgan('tiny')); // Use morgan middleware

// Sample movie data
let movies = [
{ id: 1, title: "Inception", director: "Christopher Nolan", year: 2010 },
{ id: 2, title: "The Matrix", director: "The Wachowskis", year: 1999 }
];

// GET all movies
app.get('/movies', (req, res) => {
res.json(movies);
});

// GET a single movie by ID
app.get('/movies/:id', (req, res) => {
const movie = movies.find(m => m.id === parseInt(req.params.id));
if (!movie) return res.status(404).send('Movie not found');
res.json(movie);
});

// POST a new movie
app.post('/movies', (req, res) => {
const { title, director, year } = req.body;
const newMovie = {
id: movies.length + 1,
title,
director,
year
};
movies.push(newMovie);
res.status(201).json(newMovie);
});

// PUT to update a movie
app.put('/movies/:id', (req, res) => {
const movie = movies.find(m => m.id === parseInt(req.params.id));
if (!movie) return res.status(404).send('Movie not found');

const { title, director, year } = req.body;
movie.title = title;
movie.director = director;
movie.year = year;

res.json(movie);
});

// DELETE a movie
app.delete('/movies/:id', (req, res) => {
const movieIndex = movies.findIndex(m => m.id === parseInt(req.params.id));
if (movieIndex === -1) return res.status(404).send('Movie not found');

movies.splice(movieIndex, 1);
res.status(204).send();
});

// Start the server
app.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`);
});
