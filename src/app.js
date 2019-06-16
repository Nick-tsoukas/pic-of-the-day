require('dotenv').config();

const express = require('express'),
      sources = require('./utils/getSources'),
      axios   = require('axios'),
      path    = require('path'),
      app     = express(),
      hbs     = require('hbs'),
      PORT    = 3000 || process.env;

const eURL = `https://eonet.sci.gsfc.nasa.gov/api/v2.1/events?api_key=${process.env.API_KEY}&sources=${sources}&limit=20`
const url  = `https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}&hd=true`;

app.use(express.static(path.join(__dirname, '../public')));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../templates/views'));
hbs.registerPartials(path.join(__dirname, '../templates/partials'));

app.get('', (req, res) => {
    axios.get(url)
        .then(response => {
            const {
                title,
                url,
                explanation
            } = response.data;
            res.render('index', {
                title,
                url,
                explanation
            });
        })
        .catch((error) => console.log(error));
});

app.get('/about', (req,res) => {
    res.render('about')
});

app.get('/events', (req, res) => {
    axios.get(eURL)
        .then(response => {
         const [ ...events ] = response.data.events;
         return events;
        }).then((events) => {
            res.render('events', {events})
        })
        .catch((error) => console.log(error));
})

app.get('*', (req, res) => {
    res.render('404',{message: "Sorry ... Something went wrong"});
})

app.listen(PORT, () => {
    console.log('the server is now listening');
})
