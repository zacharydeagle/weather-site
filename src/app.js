const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')


const app = express();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath) //Changing HBS default folder 
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req,res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Zachary Deagle',
    })
})

app.get('/about', (req,res) => {
    res.render('about', {
        title: 'About me',
        name: 'Zachary Deagle'
    })
})

app.get('/help', (req,res) => {
    res.render('help', {
        title: 'Help Page',
        date: 'Dec 12 2021',
        name: 'Zachary Deagle',
        coursePage: 'Udemy'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error: 'Please provide an address query'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} ={}) => {
          if (error) {return res.send({error})} 
          
          forecast(latitude, longitude, (error, forecastData) => {
            if (error) {return res.send({error})}
            
            res.send({
                location,
                weather: forecastData,
                address: req.query.address,
            })
          })
      })

})

//Example query string for search
app.get('/products', (req,res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
        res.send({
            products:[]
        })
    
})

//Help 404s
app.get('/help/*', (req, res) => {
    res.render('404', {
        errorText: 'Help article not found',
        name: 'Zachary Deagle',
        title: '404 Help'
    })
})

//All 404s
app.get('*', (req, res) => {
    res.render('404', {
        errorText: 'Page not found',
        name: 'Zachary Deagle',
        title: '404'
    })
})

//Set up for development on localhost:3000
app.listen(3000, () => {
    console.log('Server started correctly on port 3000');
});

