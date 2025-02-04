const express = require("express");
const morgan = require("morgan");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(morgan("tiny"));

// Sample user data
let users = [
  {
    username: "john_doe",
    dob: "1990-01-01",
    email: "john_doe@example.com",
    password: "securepassword123",
    favoriteMovies: ["Inception", "The Matrix", "Interstellar"],
  },
  {
    username: "jane_doe",
    dob: "1992-02-02",
    email: "jane_doe@example.com",
    password: "securepassword456",
    favoriteMovies: ["The Shawshank Redemption", "Pulp Fiction"],
  },
];

// Sample movies data with title, director, year, genre, and director's date of birth
let movies = [
  {
    id: 1,
    title: "Inception",
    director: "Christopher Nolan",
    year: 2010,
    genre: "Sci-Fi",
    directorDOB: "1970-07-30",
  },
  {
    id: 2,
    title: "The Matrix",
    director: "Lana Wachowski",
    year: 1999,
    genre: "Action",
    directorDOB: "1965-06-21",
  },
  {
    id: 3,
    title: "Interstellar",
    director: "Christopher Nolan",
    year: 2014,
    genre: "Adventure",
    directorDOB: "1970-07-30",
  },
  {
    id: 4,
    title: "Pulp Fiction",
    director: "Quentin Tarantino",
    year: 1994,
    genre: "Crime",
    directorDOB: "1963-03-27",
  },
  {
    id: 5,
    title: "The Shawshank Redemption",
    director: "Frank Darabont",
    year: 1994,
    genre: "Drama",
    directorDOB: "1959-01-28",
  },
];

// GET all movies
app.get("/movies", (req, res) => {
  res.send(movies);
});

// GET a specific movie by ID
app.get("/movies/:id", (req, res) => {
  const movie = movies.find((m) => m.id === parseInt(req.params.id));
  if (!movie) return res.status(404).send("Movie not found");
  res.send(movie);
});

// GET movies by genre
app.get("/movies/genre/:genre", (req, res) => {
  const genre = req.params.genre.toLowerCase();
  const filteredMovies = movies.filter((m) => m.genre.toLowerCase() === genre);
  if (filteredMovies.length === 0)
    return res.status(404).send("No movies found for this genre");
  res.send(filteredMovies);
});

// GET movies by director
app.get("/movies/director/:director", (req, res) => {
  const director = req.params.director.toLowerCase();
  const filteredMovies = movies.filter(
    (m) => m.director.toLowerCase() === director
  );
  if (filteredMovies.length === 0)
    return res.status(404).send("No movies found for this director");
  res.send(filteredMovies);
});

// GET user by ID
app.get("/users/:id", (req, res) => {
  const user = users[parseInt(req.params.id) - 1]; // Assuming IDs start from 1
  if (!user) return res.status(404).send("User not found");
  res.send(user);
});

// POST to add a new user
app.post("/users", (req, res) => {
  const { username, dob, email, password } = req.body;
  const newUser = {
    username,
    dob,
    email,
    password,
    favoriteMovies: [],
  };
  users.push(newUser);
  res.status(201).send(newUser);
});

// PUT to update user
app.put("/users/:id", (req, res) => {
  const user = users[parseInt(req.params.id) - 1];
  if (!user) return res.status(404).send("User not found");

  const { username, dob, email, password } = req.body;
  user.username = username || user.username;
  user.dob = dob || user.dob;
  user.email = email || user.email;
  user.password = password || user.password;

  res.send(user);
});

// POST to add a movie to favorites
app.post("/users/:id/favorites", (req, res) => {
  const user = users[parseInt(req.params.id) - 1];
  const { movie } = req.body; // Expecting { "movie": "Movie Name" }

  if (!user) return res.status(404).send("User not found");

  if (!user.favoriteMovies.includes(movie)) {
    user.favoriteMovies.push(movie);
    return res.send("Movie has been added to favorites.");
  } else {
    return res.send("Movie is already in favorites.");
  }
});

// DELETE to remove a movie from favorites
app.delete("/users/:id/favorites", (req, res) => {
  const user = users[parseInt(req.params.id) - 1];
  const { movie } = req.body; // Expecting { "movie": "Movie Name" }

  if (!user) return res.status(404).send("User not found");

  const index = user.favoriteMovies.indexOf(movie);
  if (index > -1) {
    user.favoriteMovies.splice(index, 1);
    return res.send("Movie has been removed from favorites.");
  } else {
    return res.send("Movie is not in favorites.");
  }
});

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the Movie API");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
