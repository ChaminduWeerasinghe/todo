var conn = require("./connect")
const { request, response } = require("express");
const sql = require("mysql");

exports.getTodos = function(req,res){
    if(conn.condetails != null)
    {
        conn.condetails.query("select * from todo",(err,rows,fields)=>{
            if(!err){
                res.send(rows);
            }else{
                console.log("Invalid Query or no Table exists");
            }
        });
    }else{
        console.log("connection object is null");   
    }
}

exports.getTodo = function(req,res)
{
    if(conn.condetails != null)
    {
        conn.condetails.query("select * from todo where id = ?",[req.params.id],(error,rows,fields)=>{
            if(!error){
                console.log(rows)
                res.send(rows);
            }else{
                console.log("Invalid Query or no Table exists");
            }
        });
    }
}

exports.deleteTodo = function(req,res)
{
    conn.condetails.query("delete from todo where id = ?",[req.params.id],(err,result)=>{
        if(!err){
            var rtn = `{"deleted": "${result.affectedRows}"}`
            res.send(rtn)
        }
        else{
            console.log("Error while delete item")
        }
    })
}