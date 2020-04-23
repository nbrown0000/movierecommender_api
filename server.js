if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config({path: __dirname + '/.env'});
}
const express = require('express');
const port = 3300;
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const axios = require('axios');


app.get('/', (req,res) => res.send('Hello World!'));


app.post('/searchByTitle', (req,res) => {
  let arrayOfFetchUrls = [];
  const searchTerm = req.body.title.split(' ').join('+');
  const fetchString = 'https://api.themoviedb.org/3/search/movie?api_key='+
      process.env.TMDB_APIKEY+'&query='+searchTerm;
  axios.get(fetchString)
  .then(response => {
    for(let i=1; i<=response.data.total_pages; i++) {
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