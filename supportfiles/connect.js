const sql = require("mysql");

exports.condetails = sql.createConnection({
    host:"localhost",
    user: "root",
    password: "",
    port: "3306",
    database: "todoapp"
});

exports.conn = function()
{
    exports.condetails.connect((error)=>{
        if(!error)
        {
            return true;
        }
        else
        {
            console.log("Error: "+JSON.stringify(error))
            return false;
        }
    });
}

