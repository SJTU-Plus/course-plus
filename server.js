const Bundler = require('parcel-bundler')
const express = require('express')
const serveStatic = require('serve-static')

const app = express()

app.use('/course-plus-data', serveStatic('public/course-plus-data'))

const bundler = new Bundler('index.html')
app.use(bundler.middleware())

app.listen(+process.env.PORT || 1234, '0.0.0.0')
