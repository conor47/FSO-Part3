/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const { request, response } = require('express')
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Contact = require('./models/contact')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('body',  (req, res) => JSON.stringify(req.body))

const morganLog = morgan(function(tokens, req, res){
  return [
    tokens.method(req,res),
    tokens.url(req,res),
    tokens.status(req,res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req,res),'ms',
    tokens['body'](req,res)
  ].join(' ')
})

app.use(morganLog)

app.get('/api/persons', (request,response) => {
  Contact.find({}).then(contacts => {
    response.json(contacts)
  })
})

app.get('/info', (request,response) => {

  Contact.countDocuments({})
    .then(count => {
      response.send(`<p>There are ${count} contacts in the phonebook</p>`)
    })
    .catch(error =>  next(error))
})

app.put('/api/persons/:id', (request,response, next) => {
  const body = request.body

  const contact = {
    name : body.name,
    number : body.number,
  }

  Contact.findByIdAndUpdate(request.params.id, contact, { new:true })
    .then(updatedContact => {
      response.json(updatedContact)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request,response,next) => {

  Contact.findById(request.params.id).then(contact => {
    response.json(contact)
  })
    .catch( error => next(error))
})

app.delete('/api/persons/:id', (request,response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch( error => next(error))
})

const generateID = () => {
  const id = Math.round(Math.random() * 1000)
  return id
}

app.post('/api/persons', (request,response, next) => {
  const body = request.body

  const contact = new Contact ({
    name : body.name,
    number : body.number,
  })

  contact.save().then(savedContact => {
    response.json(savedContact)
  })
    .catch(error => next(error))

})

const PORT = process.env.PORT
app.listen(PORT , () => {
  console.log('Server Running')
})

const errorHandler = (error, request, response,next) => {
  console.log(error.message)

  if(error.name === 'CastError'){
    return response.status(404).send({ error: 'malformed id' })
  } else if (error.name === 'ValidationError'){
    return response.status(400).json({ error:error.message })
  }

  next(error)
}

app.use(errorHandler)