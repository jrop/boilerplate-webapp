/* @flow */
import express from 'express'

const app = express()
app.set('view engine', 'pug')
app.set('views', `${__dirname}/../../views`)

app.use(express.static(`${__dirname}/../public`))
app.use(require('./routes').default)

const port = process.env.PORT || 3000

// eslint-disable-next-line no-console
app.listen(port, err => err ? console.error(err) : console.log(`:${port}`))
