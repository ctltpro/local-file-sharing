const fs = require('fs')
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload')
app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  limit: "20mb",
  extended: true,
  parameterLimit: 50000
}));

var handlebars = require('express-handlebars').create({
  defaultLayout: 'main'
  // helpers: require('./lib/helpers')
})

app.use(fileUpload({
    useTempFiles : false,
    // tempFileDir : 'files',
    preserveExtension : true,
}));

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

io.on('connection',client=>{
    client.on('uploaded',()=>{
        client.broadcast.emit('do-sync')
    })
})


app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use('/static_files', express.static(__dirname + '/static_files'));


app.get('/', (req, res) => {
  res.render("home",{filepond:true})
})

app.get('/get-files', (req,res)=>{
    fs.readdir('files',(err,data)=>{
        if(err) return res.status(503).send("Unable to get the file data")
        var fileObj = {}
        for(var d of data){
            fileObj[d] = fs.lstatSync(`files/${d}`).isDirectory() ? "Directory" : "File"
        }
        res.send(fileObj)
    })
})

app.post('/upload',(req,res)=>{
    req.files.filepond.mv(`files/${req.files.filepond.name}`,(err,data)=>{
        res.send("OK")
    })
})

app.get('/delete-file',(req,res)=>{
    fs.unlinkSync("files/"+req.query.file)
    res.redirect('/')
})

app.get('/download',(req,res)=>{
    if(req.query.type === 'File'){
        res.download(`files/${req.query.file}`)
    }else{
        res.send("Download is a folder")
    }
})

app.get('*', (req, res) => res.redirect("/"))

console.log("Listening on 8009")
server.listen(8009)
