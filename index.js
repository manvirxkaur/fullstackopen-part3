require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const Person = require('./models/person')
app.use(express.static('frontend-src/build'))
app.use(cors())
app.use(bodyParser.json())

morgan.token('body', function(req, res, param) {
  if (req.method !== 'POST') { return ' ' }
	return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const api = '/api'

app.post(`${api}/persons`, (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => response.json(savedPerson.toJSON()))
})

app.get(`/`, (req, res) => res.send('<h1>Hello World!</h1>'))

app.get(`/info`, (req, res) => {
  Person.find({}).then(persons =>
    res.send(`
      <p>Phonebook has info for ${persons.length} ${persons.length === 1 ? 'person' : 'people'}</p>
      <p>${new Date()}</p>
    `)
  )
})

app.get(`${api}/persons`, (req, res) => {
  Person.find({}).then(persons => res.json(persons))
})

app.get(`${api}/persons/:id`, (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
        if (person) {
          response.json(person.toJSON())
        } else {
          response.status(404).end()
        }
      })
    .catch(error => next(error))
})

app.put(`${api}/persons/:id`, (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  console.log(person)

  Person.findByIdAndUpdate(request.params.id, person, {
      new: true
    })
    .then(updatedPerson => {
      response.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

app.delete(`${api}/persons/:id`, (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => response.status(204).end())
    .catch(error => next(error))
})


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({
      error: 'malformatted id'
    })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
