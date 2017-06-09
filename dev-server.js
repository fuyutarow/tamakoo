const path = require('path')
const express = require('express')
const app = express()
const execSync = require('child_process').execSync;

app.use('/dist', express.static('dist'))

app.get('/api/toot', (req, res) => {
  res.contentType('application/json')
  let text;

  console.log(decodeURI(req.query.text))
  try {
    text = execSync("python echo-dev.py -n 100 -s '"+decodeURI(req.query.text)+"'").toString();
  } catch(err){
    text = decodeURI(req.query.text)
  }

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

var port = 3000;
app.listen(port , (err) => {
  if (err) {
    console.log(err)
  }
  console.log("server start at port "+port)
})
