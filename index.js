const express = require('express')
const morgan = require('morgan')
const app = express()

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(express.static('build'))
app.use(express.json())
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

const generateId = () => {
  return Math.floor(Math.random() * 100000)
}

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find((person) => person.id === id)

  if (!person) {
    response.status(404).end()
  } else {
    response.send(person)
  }
})

app.get('/info', (request, response) => {
  const people = `<p>Phonebook has info for ${persons.length} people </p>`
  const date = `<p>${new Date()}</p>`

  response.send(people + date)
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name must be filled',
    })
  } else if (!body.number) {
    return response.status(400).json({
      error: 'number must be filled',
    })
  }

  if (persons.some((person) => person.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique',
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter((person) => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => console.log(`Server is listening to port ${PORT}`))
