var express = require('express');
var router = express.Router();
var db=require('../database');
// another routes also appear here
// this script to fetch data from MySQL databse table
app.get('/emp-list', function(req, res, next) {
    var sql='select employee.username,employee.emp_id,details.name,details.email,details.state,details.city,count from employee,details,emp_count where employee.username=details.username and employee.emp_id=emp_count.emp_id';
    connection.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.render('emp-list', { title: 'User List', userData: data});
  });
});
app.get('/delete/:emp_id',function(req,res,next){
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
    res.redirect('emp-list');
});

app.get('/edit/:username', function(req, res, next) {
    var username= req.params.username;
    var sql=`SELECT username,name,email,state,city,dob,aadhar_no,count FROM details,emp_count WHERE username='${username}' and emp_id=(select emp_id from employee where username='${username}')`;
    app.query(sql, function (err, data) {
      if (err) throw err;
     
      res.render('employee', { title: 'Employee List', editData: data[0]});
    });
});
app.post('/edit/:username', function(req, res, next) {
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
res.redirect('/employee/emp-list');
});
module.exports = router;
