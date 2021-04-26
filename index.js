const { request, response } = require('express')
const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    {
        id:1,
        "name":"Arto Hellas",
        "number": "0876671221"
    },
    {
        id:2,
        "name":"Ada Lovelace",
        "number": "0837819211"
    },
    {
        id:3,
        "name":"Dan Abramov",
        "number": "0867719212"
    },
    {
        id:4,
        "name":"Mary Poppendick",
        "number": "0879912121"
    }
]

app.get('/api/persons', (request,response) => {
    response.json(persons)
})

app.get('/info', (request,response) => {
    response.end(
    `The phonebook has info for ${persons.length} people

${new Date()}
    `
    )
})

app.get('/api/persons/:id', (request,response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if(person){
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request,response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    
    response.status(204).end()
})

const generateID = () => {
    const id = Math.round(Math.random() * 1000)
    return id
}

app.post('/api/persons', (request,response) => {
    const body = request.body

    console.log(body);

    if(!body.name ){
        return response.status(400).json({error:"Missing name"})
    }

    if(!body.number ){
        return response.status(400).json({error:"Missing number"})
    }

    if(persons.find(person =>n person.name === body.name) ){
        return response.status(400).json({error:"Name must be unique"})
    }

    const person = {
        id : generateID(),
        name : body.name,
        number : body.number,
    }

    persons = persons.concat(person)
    response.json(person)
    
})

const PORT = 3001
app.listen(PORT , () => {
    console.log("Server Running")
})