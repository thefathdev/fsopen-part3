const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>'
  )
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb://uvfxg5bujrmyrvjoe3q8:${password}@n1-c2-mongodb-clevercloud-customers.services.clever-cloud.com:27017,n2-c2-mongodb-clevercloud-customers.services.clever-cloud.com:27017/bj55wtkem5idkcz?replicaSet=rs0`

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  mongoose
    .connect(url)
    .then(() => {
      return Person.find()
    })
    .then((result) => {
      console.log('Phonebook:')
      result.forEach((person) => {
        console.log(person.name, person.number)
      })
      return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
} else {
  const personName = process.argv[3]
  const personNumber = process.argv[4]

  mongoose
    .connect(url)
    .then(() => {
      const person = new Person({
        name: personName,
        number: personNumber,
      })

      return person.save()
    })
    .then((result) => {
      console.log(`added ${result.name} number ${result.number} to phonebook`)
      return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
}
