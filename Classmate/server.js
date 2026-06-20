const express = require('express');
const app = express();
const port = 8080;
const users = require('./routes/user.js');
const session = require('express-session');
const flash = require('connect-flash');
const ejsMate = require('ejs-mate');
const path = require('path');

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = {
    secret: "mysupersecretstring",
    resave:false,
    saveUninitialized:true
}

app.use(session(sessionOptions)); 
app.use(flash());

//===============flash msg===============

app.use((req,res,next)=>{
    res.locals.successMsg = req.flash('success');
    res.locals.errorMsg = req.flash('err');
    next();
})

app.get('/register',(req,res)=>{
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    if(name === "anonymous"){
        req.flash("err","user not register");
    }
    else{
        req.flash("success","Registered successfully!")
    }
      
    res.redirect('/hello');
})  

app.get('/hello',(req,res)=>{
    
    res.render('page.ejs', {name : req.session.name});
})





// app.get('/reqcount',(req,res)=>{

//     if(req.session.count){
//         req.session.count++;
//     }
//     else{
//          req.session.count = 1;
//     }
   
//     res.send(`you sent a request ${req.session.count} times`);
// })



// app.get('/test',(req, res)=>{
//     res.send("test successful");
// })

app.listen(port, ()=>{
    console.log(`Listing on the port ${port}`)
})