import fetch from "node-fetch"

let getBestMovieFrom = async function (directorName) {
    // Get the ID of the desired director
    let directors = await (await fetch('https://dhekumar.github.io/asynchronous-javascript/directors.json')).json();
    let director = directors.find(director => director["name"] === directorName);
    // If the input director was not found, return early
    if (typeof director === 'undefined') { return [] };
    let directorId = director["id"];
    // Find all the movies by the desired director
    let movies = await (await fetch(`https://dhekumar.github.io/asynchronous-javascript/directors/${directorId}/movies.json`)).json();
    let movieIdToMovie = new Map();
    let movieIdToScore = new Map();
    movies.forEach(movie => movieIdToMovie.set(movie["id"], movie));
    // Get all the reviews for each movie and sum up their rating
    for (let movieId of movieIdToMovie.keys()) {
        let sumReviewScores = 0;
        let reviews = await (await fetch(`https://dhekumar.github.io/asynchronous-javascript/movies/${movieId}/reviews.json`)).json();
        reviews.forEach(review => sumReviewScores += review["rating"]);
        movieIdToScore.set(movieId, sumReviewScores);
    };
    // Find the maximum review rating
    let maxScore = Math.max(...movieIdToScore.values());
    // Return all the movies that have the maximum rating
    movies = [];
    for (const [id, score] of movieIdToScore) {
        if (score == maxScore) {
            movies.push(movieIdToMovie.get(id));
        };
    };
    return movies;
};

console.log(await (getBestMovieFrom("Stanley Kubrick")));