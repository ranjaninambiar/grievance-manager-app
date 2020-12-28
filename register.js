var express = require("express");
var mysql = require("mysql");
var app = express();
var session = require('express-session')
var bodyParser = require('body-parser');
const ejs=require('body-parser');
var fs=require('fs');
var router = express.Router();
app.use(express.static(__dirname + '/public'));
const path=require('path');
const { fstat } = require("fs");
const { response } = require("express");
app.use(express.static('grievanceapp-master'));
app.use(bodyParser.urlencoded({extended:true}));

app.set('views',path.join(__dirname,'views'));
//var loginRouter = require('./routes/login');

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

app.get("/register",function(req,res,html){
    res.render('register'),{
        title:"Sign Up"
    }
})

app.post("/register", function (req, res,html) {
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
        //console.log("FirstName: "+FirstName +" LastName: "+LastName +" Username: " +username +" Password: " +password); 
        usernames=uname;
        res.sendFile('/log');
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

app.get("/log",function(req,res,html){
    res.render('login'),{
        title:"Login"
    }
})



app.get("/login",function(req,res,html){
    
    var username = req.param('uname', null)
    var password = req.param('password', null)
    const usernames=username;
    //console.log(usernames);
    console.log(username+"  "+password)
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
    console.log(test+"  "+emp); 
    if(username==='admin'){
      res.render('admin_view');
    }
    else{
      if (test === 1 && emp===1){
         res.render('emp_view');
        }
      else if(test== 1 && emp==0){
          res.render('user_view');
        } 
      else{
        res.render('register');
        }
      test=0;
      emp=0;
     }
  });
    });

    app.get("/grievance",function(req,res,html){
        res.render('grievance'),{
            title:"complaint"
        }
    })
    
    app.get("/emp_view",function(req,res,html){
        res.render('emp_view'),{
            title:"complaint"
        }
    })
    
    app.get("/grievance_status",function(req,res,html){
        let sql="SELECT grievance_id,status FROM grievance";
        let query=connection.query(sql,(err,rows)=>{
            if(err)throw err;
            res.render('grievance_status',{
                title:"Grievance updates",
                users:rows
            })
        })
    })
    
    app.get("/edit/:grievance_id",(req,res)=>{
        const grievance_id=req.params.grievance_id;
        let sql=`SELECT grievance_id,status FROM grievance where grievance_id like '${grievance_id}'`;
        let query=connection.query(sql,(err,results)=>{
            if(err)throw err;
            res.render('grievance_edit',{
                title:"Editting User Data:",
                user:results[0]
            })
        })
    })
    
    app.post('/update',(req,res)=>{
        const userId=req.body.grievance_id;
        let sql="UPDATE grievance SET status='"+req.body.status+"' WHERE grievance_id like '"+userId+"'";
        let query=connection.query(sql,(err,result)=>{
            if(err)throw err;
            res.redirect('/grievance_status')
        })
    })
    
    app.get("/admin_grievance_status",function(req,res,html){
        let sql="SELECT grievance_id,status FROM grievance";
        let query=connection.query(sql,(err,rows)=>{
            if(err)throw err;
            res.render('admin_grievance_status',{
                title:"Grievance updates",
                users:rows
            })
        })
    })
    
    app.get("/editat/:grievance_id",(req,res)=>{
        const grievance_id=req.params.grievance_id;
        let sql=`SELECT grievance_id,status FROM grievance where grievance_id like '${grievance_id}'`;
        let query=connection.query(sql,(err,results)=>{
            if(err)throw err;
            res.render('admin_grievance_edit',{
                title:"Editting User Data:",
                user:results[0]
            })
        })
    })
    
    app.post('/updates',(req,res)=>{
        const userId=req.body.grievance_id;
        let sql="UPDATE grievance SET status='"+req.body.status+"' WHERE grievance_id like '"+userId+"'";
        let query=connection.query(sql,(err,result)=>{
            if(err)throw err;
            res.redirect('admin_view')
        })
    })
    
    app.post('/grievance',(req,res)=>{
        var grievacne_type = req.param("grievance_type", null);
        var date=req.param("received_date",null);
        var dep_name = req.param("dep_name", null);
        var status = "pending";
        console.log("helloo");
        console.log(grievacne_type+" "+date+" "+dep_name);
        var sql="SELECT max(grievance_id) as grievance_id from grievance"
        connection.query(sql,function(err,res){
            if (err) throw err;
            console.log(res);
            var gid=(res[0].grievance_id)+1;
            console.log(gid);
        var sql = "INSERT INTO grievance VALUES( "+gid+",'" +grievacne_type +"','"+date+"','"+dep_name+"','"+status+"')"; 
        console.log(sql);
        connection.query(sql,function(err,res){
            if(err) throw err;
        var sql1=`SELECT emp_id FROM emp_count WHERE count=(SELECT min(count) from emp_count)`
        connection.query(sql1,function(err,res){
            if (err) err;
            console.log("2");
            var sql2="INSERT INTO grievance_dept values ('" +usernames+"'," +gid +",'"+res[0].emp_id+"')";
        connection.query(sql2, function (err, result) { 
            if (err){
                console.error("DB connection failed "+err.stack);
                return;
            };
            
        });
    });
});
});
res.render('user_view',{
    title:"User View"
})
    });
    
    app.get("/user_view",function(req,res,html){
        res.render('user_view',{
            title:"User View"
        })
    })

    app.get("/inquiry",function(req,res,html){
        res.render('inquiry',{
            title:"Inquiry to particular Department"
        })
    })
    
    app.get("/admin_inquiry",function(req,res,html){
        res.render('admin_inquiry',{
            title:"Inquiry to particular Department"
        })
    })

    app.get("/trial",function(req,res,html){
        res.render('trial',{
            title:"Inquiry to particular Department"
        })
    })

    app.post("/admin_inquiry",function(req,res,html){
        var grievance_id = req.param("grievance_id", null);
        var emp_id = req.param("emp_id", null);
        var dep_id=req.param("dep_id",null);
        var date = req.param("date", null);
        var sql = "INSERT INTO inquiry VALUES('" +grievance_id+"','" +emp_id +"','"+dep_id+"','"+date+"')"; 
        console.log(sql);
        connection.query(sql, function (err, result) { 
            if (err){
                console.error("DB connection failed "+err.stack);
                return;
            };
            //console.log("FirstName: "+FirstName +" LastName: "+LastName +" Username: " +username +" Password: " +password); 
            res.render('admin_view',{
                title:"Admin View"
            })
        }); 
    })
    
    app.post("/inquiry",function(req,res,html){
        var grievance_id = req.param("grievance_id", null);
        var emp_id = req.param("emp_id", null);
        var dep_id=req.param("dep_id",null);
        var date = req.param("date", null);
        var sql = "INSERT INTO inquiry VALUES('" +grievance_id+"','" +emp_id +"','"+dep_id+"','"+date+"')"; 
        console.log(sql);
        connection.query(sql, function (err, result) { 
            if (err){
                console.error("DB connection failed "+err.stack);
                return;
            };
            //console.log("FirstName: "+FirstName +" LastName: "+LastName +" Username: " +username +" Password: " +password); 
            res.render('emp_view',{
                title:"Emp ViewS"
            })
        }); 
    })

//sakthi

app.get("/user-list", function(req, res, next) {
    console.log(usernames);
    //var username=req.params.username;                     // username from login page
    var sql=`SELECT * FROM grievance_dept WHERE username like '${usernames}'`;
    connection.query(sql,function(err,data,fields){
      
    if (err) throw err;
    console.log(data);
     id=data[0].grievance_id;
    
    var sql=`SELECT * FROM grievance WHERE grievance_id like '${id}'`;
    connection.query(sql, function (err, data, fields) {
    if (err) throw err;
    console.log("grievance data: "+data);
    res.render('user-list', { title: 'grievacne List', userData: data});
  });
  });
});


app.get("/deletes/:grievance_id", function(req, res, next) {
    var grievance_id= req.params.grievance_id;
    console.log(grievance_id);

    var sql=`Select grievance_id where grievance_id='${grievance_id}'`
    connection.query(sql,function(err,data){
        if (err) throw err;
        if (data[0].grievance_id=='undefined'){
            res.redirect('no_grievance');
        } 
    })

    var sql2 = `DELETE FROM inquiry WHERE grievance_id = '${grievance_id}'`;
    connection.query(sql2, function (err, data) {
    if (err) throw err;});

  var sql2 = `DELETE FROM grievance_dept WHERE grievance_id = '${grievance_id}'`;
  connection.query(sql2, function (err, data) {
  if (err) throw err;});
  

    var sql1 = `DELETE FROM grievance WHERE grievance_id = '${grievance_id}'`;
    connection.query(sql1, function (err, data) {
    if (err) throw err;});

        res.redirect('user_view');
  });

// write here create & display data script
 
app.get('/edits/:grievance_id', function(req, res, next) {
      var grievance_id= req.params.grievance_id;
      var sql=`SELECT * FROM grievance WHERE grievance_id='${grievance_id}'`;
      connection.query(sql, function (err, data) {
        if (err) throw err;
        res.render('users', { title: 'User List', editData: data[0]});
      });
});
app.post('/edits/:grievance_id', function(req, res, next) {
  var grievance_id= req.params.grievance_id;
    var updateData=req.body;
    console.log(updateData.dep_name);
    dep=updateData.dep_name;
    var sql = `UPDATE grievance SET ? WHERE  grievance_id= ?`;
    connection.query(sql, [updateData, grievance_id], function (err, data) {
    if (err) throw err;
    console.log(data.affectedRows + " record(s) updated");
  });
  var sql=`SELECT dep_id from department where dep_name like '${dep}'`;
  connection.query(sql,function (err, data) {
    if (err) throw err;
    depid=data[0].dep_id;
    console.log("dep id",depid);           

var sql1=`UPDATE inquiry SET dep_id= '${depid}' WHERE  grievance_id like '${id}'`; 
console.log(sql1);
connection.query(sql1,function(err,data){
  if (err) throw err;
  console.log("id "+id+data.affectedRows + " record(s) updated in inquiry");
  console.log(data);
});
  });
var sql=`SELECT * from inquiry WHERE grievance_id like '${id}'`;
connection.query(sql,function(err,data){
  if (err) throw err;
  console.log(data);
});


  res.redirect('/user-list');
});


//Employee

app.get('/emp-list', function(req, res, next) {
    var sql='select employee.username,employee.emp_id,details.name,details.email,details.state,details.city,count from employee,details,emp_count where employee.username=details.username and employee.emp_id=emp_count.emp_id';
    connection.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.render('emp-list', { title: 'User List', userData: data});
  });
});
app.get('/deletess/:emp_id',function(req,res,next){
    var emp_id= req.params.emp_id;
    //console.log(emp_id);
    var sql1=`select grievance_id from grievance_dept where emp_id='${emp_id}'`;
    connection.query(sql1,function(err,Data_gid,feilds){
    if(err) throw err;
    //console.log(Data_gid[parseInt(i)].greievance_id);
    Data_gid.forEach(myFunction); 
    function myFunction(item, index)   
    { 
    //console.log(item.grievance_id); 
    var sql2=`select emp_id from emp_count where emp_id!='${emp_id}' and count=(select min(count) from emp_count)` 
    connection.query(sql2,function(err,Data_emprep,feilds){
        var sql3=`update grievance_dept set emp_id='${Data_emprep[0].emp_id}' where grievance_id='${item.grievance_id}'`;
        var sql4=`update inquiry set emp_id='${Data_emprep[0].emp_id}' where grievance_id='${item.grievance_id}'`;
        var sql5=`update emp_count set count=(select count+1 from emp_count where emp_id='${Data_emprep[0].emp_id}' ) where emp_id='${Data_emprep[0].emp_id}'`;
        connection.query(sql3, function (err, data, fields) {
            if (err) throw err;
        });
        connection.query(sql4, function (err, data, fields) {
            if (err) throw err;
        });
        connection.query(sql5, function (err, data, fields) {
            if (err) throw err;
        });
        console.log("greivance_id"+item.grievance_id+"emprep"+Data_emprep[0].emp_id);
    });
    }
    var sql7=`delete from emp_count where emp_id='${emp_id}'`;
    var sql8=`delete from login where username=(select username from employee where emp_id='${emp_id}')`
    var sql9=`delete from phone_no where username=(select username from employee where emp_id='${emp_id}')`
    var sql11=`delete from employee where emp_id='${emp_id}'`;
    var sql12=`select username from employee where emp_id='${emp_id}'`;
    connection.query(sql7,function(err,data,feilds){
       if(err) throw err;
     });
   connection.query(sql9,function(err,data,feilds){
       if(err) throw err;
     });
   connection.query(sql8,function(err,data,feilds){
       if(err) throw err;
     });
     
     connection.query(sql12,function(err,data,feilds){
       if(err) throw err;
       
       var username=data[0].username;
       connection.query(sql11,function(err,data,feilds){
           if(err) throw err;
         });
       var sql10=`delete from details where username='${username}'`;
       connection.query(sql10,function(err,data,feilds){
           if(err) throw err;
         });
       });
    });
    res.redirect('/emp-list');
});

app.get('/editss/:username', function(req, res, next) {
    var username= req.params.username;
    var sql=`SELECT username,name,email,state,city,dob,aadhar_no,count FROM details,emp_count WHERE username='${username}' and emp_id=(select emp_id from employee where username='${username}')`;
    connection.query(sql, function (err, data) {
      if (err) throw err;
     
      res.render('employee', { title: 'Employee List', editData: data[0]});
    });
});
app.post('/editss/:username', function(req, res, next) {
var username= req.params.username;
  var updateData=req.body;
  console.log(updateData);
  var sql = `UPDATE details SET name='${updateData.name}',email='${updateData.email}',state='${updateData.state}',city='${updateData.city}',dob='${updateData.dob}',aadhar_no='${updateData.aadhar_no}' WHERE username= ?`;
  connection.query(sql,[username],function (err, data) {
  if (err) throw err;
  console.log(data.affectedRows + " record(s) updated");
});
var sql = `UPDATE emp_count SET count=${updateData.count} WHERE emp_id=(select emp_id from employee where username='${username}')`;
connection.query(sql,function (err, data) {
if (err) throw err;
console.log(data.affectedRows + " record(s) updated");
});
res.redirect('/emp-list');
});

app.get('/admin_view',function(req,res){
    res.render('admin_view',{
        title:"Admin View"
    })
})

app.get('/list-user', function(req, res, next) {
    var sql='SELECT * FROM details WHERE username NOT IN (SELECT username FROM employee)';
    connection.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.render('list-user', { title: 'User List', userData: data});
  });
});
app.get('/deletesss/:username', function(req, res, next) {
  var username= req.params.username;
    console.log(username);
    var sql1 = `DELETE FROM login WHERE username = '${username}'`;
    connection.query(sql1, function (err, data) {
    if (err) throw err;});
  
    var sql2 = `DELETE FROM phone_no WHERE username = '${username}'`;
    connection.query(sql2, function (err, data) {
    if (err) throw err;});

    var sql2 = `DELETE FROM grievance WHERE grievance_id IN (SELECT grievance_id from grievance_dept WHERE username = '${username}')`;
    connection.query(sql2, function (err, data) {
    if (err) throw err;});

    var sql2 = `DELETE FROM inquiry WHERE grievance_id IN (SELECT grievance_id from grievance_dept WHERE username = '${username}')`;
    connection.query(sql2, function (err, data) {
    if (err) throw err;});
  
    var sql2 = `DELETE FROM grievance_dept WHERE username = '${username}'`;
    connection.query(sql2, function (err, data) {
    if (err) throw err;});

    var sql = `DELETE FROM details WHERE username = '${username}'`;
    connection.query(sql, function (err, data) {
    if (err) throw err;
    console.log(data.affectedRows + " record(s) updated");
  });
  res.redirect('/users/user-list');
  });

// write here create & display data script
 
app.get('/editsss/:username', function(req, res, next) {
      var username= req.params.username;
      var sql=`SELECT * FROM details WHERE username='${username}'`;
      connection.query(sql, function (err, data) {
        if (err) throw err;
       
        res.render('users', { title: 'User List', editData: data[0]});
      });
});
app.post('/editsss/:username', function(req, res, next) {
  var username= req.params.username;
    var updateData=req.body;
    var sql = `UPDATE details SET ? WHERE username= ?`;
    connection.query(sql, [updateData, username], function (err, data) {
    if (err) throw err;
    console.log(data.affectedRows + " record(s) updated");
  });
  res.redirect('/users/user-list');
});
app.get('/insert/',function(req,res,next){
  res.render('newuser',{title:'User List'});
});
module.exports = router;
});
//console.log(usernames);
app.listen(3000);