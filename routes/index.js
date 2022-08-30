// Importing express and setting up the router
var express = require('express');
var router = express.Router();

// Getting movies data
const movies = require('../data/movies')

/* GET home page. */
router.get('/', function(req, res, next) {
  	res.render('index', { title: 'Express' });
});

// Most popular shows will be served in /most_popular/ route
router.get('/most_popular', (req, res, next) => {
	// Defining a page number to group results in 20, and if note provided in query string it will be set to 1 as default
	let page = req.query.page
	if (page === undefined) {
		page = 1
	}

	// Getting most popular shows via filter method used on movies array, grouping them in 20, then sending json with page number and results
    let results = movies.filter(movie => movie.most_popular)
	const indexToStart = (page - 1) * 20
	results = results.slice(indexToStart, indexToStart + 19)
  	res.json({ 
		page,
		results
	})
})

// Exporting the router to be used in app.js
module.exports = router;
