const mongoose = require('mongoose')

if (process.argv.length < 5 && process.argv.length > 3) {
  console.log('Please provide the password, name and number as an argument: node mongo.js <password> <name> <number>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]


const url =
  `mongodb+srv://fullstack:${password}@cluster0.7vlnq.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const contactSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Contact = mongoose.model('Contact', contactSchema)

const contact = new Contact({
  name: name,
  number:number
})

contact.save().then(result => {
  console.log(`Added ${contact.name} number ${contact.number} to the phonebook`)
  mongoose.connection.close()
})

if (process.argv.length === 3 ){
    
    const password = process.argv[2]
    
    Contact.find({}).then(result => {
        result.forEach(note => {
          console.log(note)
        })
        mongoose.connection.close()
      })
}

