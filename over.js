const path = require('path')
const express = require('express')
const app = express()
const execSync = require('child_process').execSync;
require('date-utils')
const dt = new Date()

app.use('/dist', express.static('dist'))

app.get('/api/count', (req, res) => {
  res.contentType('application/json')
  const now = dt.toFormat("YYYYMMDDTHH24MISS"); 
    execSync("echo '"+decodeURI(req.query.text)+"' > ./toots/toot."+now+".txt");
  
  let text = execSync("cat echo.txt").toString();
  while(true){
    try {
      text = execSync("cat ./echos/echo."+now+".txt").toString();
      const obj = {
        "amount": 100,
        "text": text,
      };
      res.json(obj);
    } catch(err){
    }
  }
    
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
