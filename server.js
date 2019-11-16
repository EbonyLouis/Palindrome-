const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const url = 'mongodb+srv://ebonyjlouis:demo@palindrome-wjzio.mongodb.net/test?retryWrites=true&w=majority'
var db, collection;
const dbName = "palindrome";


app.listen(3000, () => {
    MongoClient.connect(url, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  //console.log(db)
  db.collection('palindrome').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {canCallThisAnything: result})
  })
})

app.post('/palindrome', (req, res) => {
  // request body always get sent over with your form
  let word = req.body.word
  console.log(word)
  let wordReversed = word.split("").reverse().join("")
  let isItAPalindrome = false
  if(word === wordReversed){
    isItAPalindrome = true
  }
  db.collection('palindrome').save({word: word, isItAPalindrome: isItAPalindrome}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})
