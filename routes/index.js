var express = require('express');
var router = express.Router();
var fs = require('fs');
var Todo = require('../models/todoModel');
var mongoose = require('mongoose');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'todo'
    });
});

router.get('/items', function(req, res) {
    var data = [];
    Todo.find(function(err, items) {
        if (items.length !== 0) {
            data = items.map(function(item) {
                return item.toJSON();
            });
            res.setHeader('Content-Type', 'application/json');
            res.send(data);
        }
    });
});

router.post('/items', function(req, res) {
    var task = req.body.task;
    var item = new Todo({
        task: task
    });
    item.save(function(err, item) {
        if (err) {
            return console.error(err);
        } else {
            var data = [];
            Todo.find(function(err, items) {
                if (items.length !== 0) {
                    data = items.map(function(item) {
                        return item.toJSON();
                    });
                    res.setHeader('Content-Type', 'application/json');
                    res.send(data);
                }
            });
        }
    });
});

router.post('/delete', function(req, res) {
    var id = req.body.id;
    Todo.findByIdAndRemove(id, function(err, item){
        if(err){
            console.error(err);
        }
        else{
            res.setHeader('Content-Type', 'application/json');
            res.send({success: 'true'});
        }
    });
});

router.post('/deleteCompleted', function(req, res) {
    var ids = req.body.data.split(',').map(function(item){
        return new mongoose.Types.ObjectId(item);
    });
    Todo.remove({_id : { $in: ids}}).remove(function(err, items){
        if(err){
            console.error(err);
        }else {
            res.setHeader('Content-Type', 'application/json');
            res.send({success: 'true'});
        }
    });
});

module.exports = router;
