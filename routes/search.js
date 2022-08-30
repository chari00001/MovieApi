// Importing express and setting up the router
var express = require('express');
var router = express.Router();

// Getting movies and people data
const movies = require('../data/movies')
const people = require('../data/people')

// Middleware to check if query is provided
function queryRequired(req, res, next) {
    const searchTerm = req.query.query
    if (!searchTerm) {
        res.json({
            msg: "Query is required"
        })
    } else {
        next()
    } 
}

// This middleware will be used by al routes in this router
router.use(queryRequired)

/* GET search page. */
// /search/...
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// GET /search/movie
// Setting up the movie search router
router.get('/movie', (req, res, next) => {
    // Getting the search term from query
    const searchTerm = req.query.query
    // Filtering the movies by including the search term in title or overview
    const results = movies.filter(movie => {
        found = movie.overview.includes(searchTerm) || movie.title.includes(searchTerm)
        return found
    })
    // Sending back the search results
    res.json({ results })
})

// GET /search/person
// Setting up the person search router
router.get('/person', (req, res, next) => {
    // Getting the search term from query
    const searchTerm = req.query.query
    // Filtering the people by including search term in their name
    const results = people.filter(person => {
        found = person.name.includes(searchTerm)
        return found
    })
    // Sending back the search results
    res.json({ results })
})

// Exporting the router to be used in app.js
module.exports = router;