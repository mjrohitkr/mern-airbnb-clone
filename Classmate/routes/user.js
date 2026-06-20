    const express = require('express');
    const router = express.Router();



    router.get('/',(req,res)=>{
        res.send("Home Page");
    })


    router.post('/:id',(req,res)=>{
        let id = req.params;
        res.send(id);
    })



    router.get('/',(req,res)=>{
        res.send("Home Page")
    })


    router.delete('/users',(req,res)=>{
        res.send("Delete");
    })


    module.exports = router;