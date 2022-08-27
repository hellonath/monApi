const express = require('express')
require('dotenv').config()
const apiRouter = require('./routes/api.routes').router

// Utilisation du Framework Express + ses fonctions
const app = express()

app.use(express.urlencoded({
    extended:true
}))

app.use(express.json())

// API ROUTE
app.use('/api/', apiRouter)





app.listen(process.env.APP_PORT, () => {
    console.log(process.env.APP_PORT);
})




