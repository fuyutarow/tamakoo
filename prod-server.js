const path = require('path')
const express = require('express')
const app = express()
const execSync = require('child_process').execSync;
require('date-utils')
const dt = new Date()
const fs = require('fs');
app.use('/dist', express.static('dist'))
function fileGetContents( filename ){
    var fs = require("fs");
    var fileContent = "";
    var stat = fs.statSync(filename);

    var fd = fs.openSync(filename, "r");
    var bytes = fs.readSync(fd, stat.size, 0, "ascii");
    fileContent += bytes[0];
    fs.closeSync(fd);

    return fileContent;
};

app.get('/api/count', (req, res) => {
  res.contentType('application/json')
  const now = dt.toFormat("YYYYMMDDTHH24MISS"); 
    execSync("echo '"+decodeURI(req.query.text)+"' > ./toots/toot."+now+".txt");
  
  let text = execSync("cat echo.txt").toString();
  console.log("Now searching ./echos/echo."+now+".txt")
  while(true){
    try {
      //text = execSync("cat ./echos/echo."+now+".txt").toString();
      text = fileGetContents("./echos/echo."+now+".txt");      
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
