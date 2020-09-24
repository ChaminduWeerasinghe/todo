const connection = require("./supportfiles/connect");
const handler = require("./supportfiles/handler");
var parser = require("body-parser");
const exp = require("express");
var expressConst = exp();
const port = 3300;

expressConst.use(parser.json())

if (connection.conn){
    console.log("Connection Successful...");
}else{
    console.log("DB Connection error...");
}

var server = expressConst.listen(port,()=>{
    console.log("Express server started");
    var host = server.address().address;
    var pot = server.address().port;
    console.log(`listning at http://${host}${pot}`)

});


expressConst.delete("/delete/:id",(req,res)=>{
    handler.deleteTodo(req,res)
});

expressConst.get('/',(req,res)=>{
    console.log("came here")
    handler.getTodos(req,res);
});

expressConst.get("/todo/:id",(req,res)=>{
    handler.getTodo(req,res);
});
