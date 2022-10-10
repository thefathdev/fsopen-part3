require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()

const Person = require('./models/person')

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(express.static('build'))
app.use(express.json())
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person)
  })
})

app.get('/info', (request, response) => {
  Person.estimatedDocumentCount().then((result) => {
    const people = `<p>Phonebook has info for ${result} people </p>`
    const date = `<p>${new Date()}</p>`
    response.send(people + date)
  })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then((savedPerson) => {
    response.json(savedPerson)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  Person.deleteOne({ _id: request.params.id }).then((result) => {
    response.json(result)
  })
})

const PORT = process.env.PORT

app.listen(PORT, () => console.log(`Server is listening to port ${PORT}`))
