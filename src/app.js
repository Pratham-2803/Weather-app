const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast');
// const { log } = require('console');

const app = express()

// define paths for Express  Config
const publicDirectoryPath = path.join(__dirname,'../public');
const viewsPath= path.join(__dirname,'../templates/views')
const partialsPath= path.join(__dirname,'../templates/partials')

//setup handlebars engine and views location 
app.set('view engine','hbs'); 
app.set('views',viewsPath); 
hbs.registerPartials(partialsPath)

// / setup static directory to Server
app. use(express.static(publicDirectoryPath));

app.get('',(req,res)=>{
    res.render('index',{
        title:'weather',
        name:'Pratham Prajapati'
    });
})
app.get('/about',(req,res)=>{
    res.render('about',{
        title:'weather',
        name:'Pratham Prajapati'
    });
})
app.get('/help',(req,res)=>{
    res.render('help',{
        title:'help',
        name:'Pratham Prajapati'
    });
})

app.get('/weather', (req, res) => {
    console.log(req.query);

    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }
    // if(!req.body){
    //     return res.send({
    //         error: 'You must provide Body'
    //     })
    // }

    geocode(req.query.address, (error, { latitude, longitude, location }={}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Pratham Prajapati',
        errorMessage: 'Help article not found.'
    })
})

    app.get('/*', (req, res) => {
        res.render('404', {
            title: '404',
            name: 'Pratham Prajapati',
            errorMessage: 'Page not found.'
        })
    })

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
    // doSomething()
})

// function doSomething(){
//         fetch("http://localhost:3000/weather?address=goa").then(res=>{
//         return res.json()    
       
//     }).then(res=>{
//         console.log(res)
//     }).catch(e=>{
//         console.log(e)
//     })
// }