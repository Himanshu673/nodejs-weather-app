const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define Paths for Express Config
const directoryPath = path.join(__dirname, '../public')
const viewPath = path.join(__dirname, '../templates/views')
const partialPath = path.join(__dirname, '../templates/partials')

// Setup Handlebar engine and views location
app.set('view engine', 'hbs')
app.set('views', viewPath)

hbs.registerPartials(partialPath)

// Setup Static Directory to serve 
app.use(express.static(directoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App', 
        name: 'Himanshu Singhal'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About App', 
        name: 'Himanshu Singhal'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        message: 'Urgent Help Needed!',
        title: 'Help Page',
        name: 'Himanshu Singhal'
    })
})


app.get('/weather', (request, response) => {
    if(!request.query.address) {
        return response.send({
            error: "Must Provide a Address Value!"
        })
    }

    geocode( request.query.address , (error, { latitude, longitude, location} = {}) => {
        if(error) {
            return response.send({error})
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if(error) {
                return response.send({error})
            }
            response.send({
                forecast: forecastData,
                location,
                address: request.query.address
            })
        })
    })
})

app.get('/products', (request, response) => {
    if(!request.query.search) {
        return response.send({
            error: "Must Provide a Search Value!"
        })
    }

    response.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('error', {
        message: 'Help Article not found',
        title: 'Help Page',
        name: 'Himanshu Singhal'
    })
})

app.get('*', (req, res) => {
    res.render('error', {
        message: 'Page not Found',
        title: 'Weather',
        name: 'Himanshu Singhal'
    })
})


app.listen(port, () => {
    console.log("Server is up on port " + port)
})