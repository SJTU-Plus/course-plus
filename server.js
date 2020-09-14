const Bundler = require('parcel-bundler')
const express = require('express')
const serveStatic = require('serve-static')

const app = express()

app.use('/course-plus-data', serveStatic('public/course-plus-data'))

let loggedIn = false

app.use('/login', (req, res) => {
    loggedIn = true
    res.redirect('/')
})

app.use('/api/course/lesson', (req, res) => {
    if (loggedIn) {
        setTimeout(() => res.json({
            error: "success",
            entities: ["(2020-2021-1)-CS410-1", "(2020-2021-1)-CS467-1"].map(x => ({ name: x }))
        }), 3000)
    } else {
        res.json({ 'error': 'not logged in' })
    }
})

const bundler = new Bundler('index.html')
app.use(bundler.middleware())

app.listen(+process.env.PORT || 1234, '0.0.0.0')
