const path = require('path')
const express = require('express')
const app = express()
const execSync = require('child_process').execSync;

app.use('/dist', express.static('dist'))

app.get('/api/count', (req, res) => {
  res.contentType('application/json')
  let text = "good";
  text = execSync("echo '"+decodeURI(req.query.text)+"' | mecab -Owakati").toString();
  const obj = {
    "amount": 100,
    "text": text,
  }
  setTimeout(() => res.json(obj), 500)
  //res.status(400).json(obj) //for error testing
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(3341, (err) => {
  if (err) {
    console.log(err)
  }
  console.log("server start at port 3341")
})
