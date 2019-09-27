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

app.get(`${api}/persons/:id`, (request, response) => {
  Person.findById(request.params.id)
    .then(person => response.json(person.toJSON())
)
})

app.delete(`${api}/persons/:id`, (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
