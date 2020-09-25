var conn = require("./connect")
const { request, response } = require("express");
var codes = require("http-status-codes")
const sql = require("mysql");

exports.getTodos = function(req,res){
    if(conn.condetails != null)
    {
        conn.condetails.query("select * from todo",(err,rows,fields)=>{
            if(!err){
                res.status(codes.StatusCodes.OK).send(rows);
            }else{
                console.log("Invalid Query or no Table exists");
                res.status(codes.StatusCodes.INTERNAL_SERVER_ERROR).send({
                    error : codes.getReasonPhrase(codes.StatusCodes.INTERNAL_SERVER_ERROR)
                })
            }
        });
    }else{
        console.log("connection object is null");
        res.status(codes.StatusCodes.INTERNAL_SERVER_ERROR).send({
            error : codes.getReasonPhrase(codes.StatusCodes.INTERNAL_SERVER_ERROR)
        }) 
    }
}

exports.getTodo = function(req,res)
{
    if(conn.condetails != null)
    {
        conn.condetails.query("select * from todo where id = ?",[req.params.id],(error,rows,fields)=>{
            if(!error){
                console.log(rows)
                res.status(codes.StatusCodes.OK).send(rows)
            }else{
                console.log("Invalid Query or no Table exists");
                res.status(codes.StatusCodes.INTERNAL_SERVER_ERROR).send({
                    error : codes.getReasonPhrase(codes.StatusCodes.INTERNAL_SERVER_ERROR)
                })
            }
        });
    }
}

exports.deleteTodo = function(req,res)
{
    conn.condetails.query("delete from todo where id = ?",[req.params.id],(err,result)=>{
        if(!err){
            if(result.affectedRows != 0)
            {
                res.status(codes.StatusCodes.ACCEPTED).send({
                    deleted : result.affectedRows
                })
            }else{
                res.status(codes.StatusCodes.NO_CONTENT).send({
                    error : codes.getReasonPhrase(codes.StatusCodes.NO_CONTENT)
                })
            }
            
        }
        else{
            res.status(codes.StatusCodes.INTERNAL_SERVER_ERROR).send({
                error : codes.getReasonPhrase(codes.StatusCodes.INTERNAL_SERVER_ERROR)
            })
        }
    })
}


function getLastAdded(res){
    var retriveSQL = "select * from todo where id = (select MAX(id) from todo)";
    conn.condetails.query(retriveSQL,(err,rows,fields)=>{
        if(!err){
            var obj = JSON.stringify(rows);
            res.status(codes.StatusCodes.OK).send(obj)
        }else{
            res.status(codes.StatusCodes.INTERNAL_SERVER_ERROR).send({
                error: codes.getReasonPhrase(codes.StatusCodes.INTERNAL_SERVER_ERROR)
            })
        }
    })
}

exports.addTodo = function(req,res)
{
    conn.condetails.query("insert into todo(content) values(?)",[req.body.content],(error,result)=>{
        if(!error){
            if(result.affectedRows > 0){
                getLastAdded(res);
            }
        }else{
            console.log("error")
            res.status(codes.StatusCodes.INTERNAL_SERVER_ERROR).send({
                error: codes.getReasonPhrase(codes.StatusCodes.INTERNAL_SERVER_ERROR)
            })
        }
    });
}


exports.updateTodo = function(req,res)
{
    const updateSQL = "update todo set content = ?, status = ? where id = ?"
    conn.condetails.query(updateSQL, [req.body.content,req.body.status,req.params.id],(error,result)=>{
        if(!error){
            if(result.affectedRows > 0){
                var rtn = `{
                    "id": ${req.params.id},
                    "content": ${req.body.content},
                    "status": ${req.body.status}
                }`;
                res.status(codes.StatusCodes.OK).send(rtn);
            }else{
                res.status(codes.StatusCodes.BAD_REQUEST).send({
                    error: codes.getReasonPhrase(codes.StatusCodes.BAD_REQUEST)
                })
            }
        }else{
            res.status(codes.StatusCodes.INTERNAL_SERVER_ERROR).send({
                error: codes.getReasonPhrase(codes.StatusCodes.INTERNAL_SERVER_ERROR)
            })
        }
    })

}