if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config({path: __dirname + '/.env'});
}
const express = require('express');
const port = 3000;
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser());
const axios = require('axios');

app.get('/', (req,res) => res.send('Hello World!'));

app.post('/search', (req,res) => {
  const searchTerm = req.body.keywords.split(' ').join('+');
  const fetchString = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_APIKEY}&query=${searchTerm}`;

  axios.get(fetchString)
    .then(response => {
      res.send(response.data.results)
    })
    .catch(error => res.send(`Something went wrong: ${error}`))
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});