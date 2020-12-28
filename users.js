var express = require('express');
var router = express.Router();
var db=require('../database');
// another routes also appear here
// this script to fetch data from MySQL databse table
app.get('/list-user', function(req, res, next) {
    var sql='SELECT * FROM details WHERE username NOT IN (SELECT username FROM employee)';
    connection.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.render('list-user', { title: 'User List', userData: data});
  });
});
app.get('/delete/:username', function(req, res, next) {
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
 
app.get('/edit/:username', function(req, res, next) {
      var username= req.params.username;
      var sql=`SELECT * FROM details WHERE username='${username}'`;
      connection.query(sql, function (err, data) {
        if (err) throw err;
       
        res.render('users', { title: 'User List', editData: data[0]});
      });
});
connection.post('/edit/:username', function(req, res, next) {
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