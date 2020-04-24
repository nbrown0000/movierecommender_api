if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config({path: __dirname + '/.env'});
}
var cors = require('cors')
const express = require('express');
var port = process.env.PORT || 8080;
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const axios = require('axios');


app.get('/', (req,res) => res.send('Hello World!'));


app.get('/getGenres', (req,res) => {
  const fetchString = 'https://api.themoviedb.org/3/genre/movie/list?api_key='+
      process.env.TMDB_APIKEY+'&language=en-US'
  axios.get(fetchString)
  .then(response => res.send(response.data))
})


app.post('/searchByTitle', (req,res) => {
  let arrayOfFetchUrls = [];
  let total_pages = 0;
  const searchTerm = req.body.title.split(' ').join('+');
  const fetchString = 'https://api.themoviedb.org/3/search/movie?api_key='+
      process.env.TMDB_APIKEY+'&query='+searchTerm;

  axios.get(fetchString)
  .then(response => {
    if(response.data.total_pages > 5) { total_pages=5; }
    else { total_pages = response.data.total_pages; }
    for(let i=1; i<=total_pages; i++) {
      arrayOfFetchUrls.push(fetchString+`&page=${i}`)
    }
    Promise.all(arrayOfFetchUrls.map(u => axios.get(u)))
    .then(result => Promise.all(result.map(u => u.data)))
    .then(result => res.send(result.reduce((acc,val) => {
      return acc = acc.concat(val.results)
    }, [] )))
    .catch(error => console.log(`Error: ${error}`))
  })
  .catch(error => console.log(`Error in get request: ${error}`))
})


app.post('/searchByGenres', (req,res) => {
  let arrayOfFetchUrls = [];
  let total_pages = 0;
  const fetchString = 'https://api.themoviedb.org/3/discover/movie?api_key='+
      process.env.TMDB_APIKEY+'&with_genres='+req.body.genre_ids;

  axios.get(fetchString)
  .then(response => {
    if(response.data.total_pages > 5) { total_pages=5; }
    else { total_pages = response.data.total_pages; }
    for(let i=1; i<=total_pages; i++) {
      arrayOfFetchUrls.push(fetchString+`&page=${i}`)
    }
    Promise.all(arrayOfFetchUrls.map(u => axios.get(u)))
    .then(result => Promise.all(result.map(u => u.data)))
    .then(result => res.send(result.reduce((acc,val) => {
      return acc = acc.concat(val.results)
    }, [] )))
    .catch(error => console.log(`Error: ${error}`))
  })
  .catch(error => console.log(`Error in get request: ${error}`))
})


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});