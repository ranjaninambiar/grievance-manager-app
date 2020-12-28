var express = require("express");
var mysql = require("mysql");
var app = express();
var bodyParser = require('body-parser');
const ejs=require('body-parser');
var fs=require('fs');
const path=require('path');
const { fstat } = require("fs");
const { response } = require("express");
app.use(express.static('grievanceapp-master'));
app.use(bodyParser.urlencoded({extended:true}));

app.set('views',path.join(__dirname,'views'));

//Set View Engine
app.set('view engine','ejs')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    port: "3306",
    database: "mydb",
});

connection.connect(function (err) {
    if (err){
        console.error("DB connection failed"+err.stack);
        return;
    }
    console.log("Connected to RDS");
});
var check=0;

app.get('/',(req,res)=>{
        res.render('emp_view',{
            title:"USER MANAGEMENT SYSTEM"
        })
    })

app.post("/grievanceapp-master/register.html", function (req, res,html) {
    console.log("came in");
    var name = req.param("name", null);
    var email = req.param("email", null);
    var phone_number=req.param("phone_number",null);
    var state = req.param("state", null);
    var city = req.param("city", null);
    var aadhar = req.param("aadhar",null);
    var date = req.param("date",null);
    var uname = req.param("uname",null);
    var pwd = req.param("password",null);

    var sql = "INSERT INTO details VALUES('" +uname+"','" +name +"','"+email+"','"+state+"','"+city+"','"+date+"','"+aadhar+"')"; 
    console.log(sql);
    connection.query(sql, function (err, result) { 
        if (err){
            console.error("DB connection failed "+err.stack);
            return;
        };
        res.send("Successfully logged in..")
        //console.log("FirstName: "+FirstName +" LastName: "+LastName +" Username: " +username +" Password: " +password); 
    }); 
    var sql1 = "INSERT INTO phone_no VALUES('" +uname+"','" + phone_number +"')"; 
    console.log(sql1);
    connection.query(sql1, function (err, result) { 
        if (err){
            console.error("DB connection failed "+err.stack);
            return;
        };
        console.log("Successfully loaded into phone_no!!!");
    }); 
    var sql2 = "INSERT INTO login VALUES('" +uname+"','" + pwd +"')";
    console.log(sql2);
    connection.query(sql2, function (err, result) { 
        if (err){
            console.error("DB connection failed "+err.stack);
            return;
        };
        console.log("Successfully loaded into login_details!!!");
    }); 
}); 

var test=0;
var emp=0;

app.get("/grievanceapp-master/login.html",function(req,res,html){
    
    var username = req.param('uname', null)
    var password = req.param('password', null)
    connection.query('SELECT * from login', function (error, results, fields) {
        if (error){
            console.error("Not Working"+error.stack);
            return;
        };

    connection.query('SELECT * from employee', function (error, results1, fields) {
        if (error){
            console.error("Not Working"+error.stack);
            return;
        };
    
    var length = results.length;
    var length1 = results1.length;
    for (i = 0; i < length; i++){
      if (results[i].username === username && results[i].password === password){
        test = 1
      }
    }

    for (i = 0; i < length1; i++){
        if (results1[i].username === username ){
          emp=1;
        }
    }    
    if (test === 1 && emp===1){
        res.render('/emp_view');
        //res.send("Logged in as a Employee");
        /*res.writeHead(200,{'Content-Type':'text/html'});
        res.write(`<h1>WELCOME!!!</h1><h4>You have been logged in as a emplyee</h4><a href='grievanceapp-master/views/emp_view'><button>Click here to continue</button></a>`);
        res.end;*/
        //res.sendFile(path.join(__dirname,'/employeeelastic.html'));
         // res.redirect('/views/emp_view');
        //return res.redirect('file:///C:/Users/SNEHA%20LATHA/Desktop/grievanceapp-master/employeeelastic.html');
}
    else if(test== 1 && emp==0){
        //res.sendFile('elastic.html');
    } 
    else{
      //res.sendFile('login.html');
    }
  });
    });
});
app.listen(3000);