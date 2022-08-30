// Importing express and setting up the router
var express = require('express');
var router = express.Router();

// Getting movie details data
const movieDetails = require('../data/movieDetails')

// A middleware to check the datas content type is application/json
function requireJson(req, res, next) {
    if (!req.is('application/json')) {
        res.json({
            msg: "Content type must be application/json"
        })
    } else {
        next()
    }
}

// Check if movieId wildcard has used in query string
router.param(('movieId'), (req, res, next) => {
    // if only certain apikeys are allowed to hit movieId
    // update the db with analytics data
    console.log("Someone hit a route that used the movieId wildcard");
    next()
})

/* GET movie page. */
// /movie/...

// GET /movie/top_rated
router.get('/top_rated', (req, res, next) => {
    // Getting page number for grouping, 1 as default
    let page = req.query.page
    if (!page) {
        page = 1
    }
    // Sorting results by decending rating
    const results = movieDetails.sort((a, b) => {
        return b.vote_average - a.vote_average
    })
    // Grouping results in 20
    let indexToStart = (page - 1) * 20
    res.json(results.slice(indexToStart, indexToStart + 20))
})

// GET /movie/movieId
// This one need to come last of all
router.get('/:movieId', (req, res, next) => {
    // Getting movie id, finding the movie id in movies, if there is send all as json, if not send back a message
    const movieId = req.params.movieId
    const results = movieDetails.find(movie => movieId == movie.id)
    if (!results) {
        res.json({
            msg: "Movie ID is not found",
            production_companies: []
        })
    } else {
        res.json(results)
    }
})

// POST /movie/movieId/rating
// Router that allows sending rating to a specific movie. Checking if the content type is application/json
router.post(':movieId/rating', requireJson, (req, res, next) => {
    // Getting movieId from query string
    const movieId = req.params.movieId
    // console.log(req.get('content-type'));
    // Checking the rating whether it is between the allowed limits, if it is send back the a message and status code of 200
    const userRating = req.body.value
    if ((userRating < .5) || (userRating > 10)) {
        res.json({
            msg: "Rating must be between 0.5 and 10"
        })
    } else {
        res.json({
            msg: "Thank you for submitting your rating",
            status_code: 200
        })
    }
})

// DELETE /movie/movieId/rating
// Router that allows to delete a rating from a specific movie. Checking if the content type is application/json or not, if it is send back a message
router.delete('/:movieId/rating', requireJson, (req, res, next) => {
    res.json({
        msg: "Rating deleted"
    })
})

// Exporting router to be used in app.js
module.exports = router;
