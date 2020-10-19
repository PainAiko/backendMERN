const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const Schema = mongoose.Schema;
const router = express.Router()

//body parser
app.use(bodyParser.json());
app.listen(5000, () => {
    console.log('server is up and running on port 4000');
})

const db ="mongodb://localhost:27017/todos";
mongoose.connect(db ,  { useUnifiedTopology: true , useNewUrlParser: true})
.then(() => {console.log('successfully connected to db')})
.catch((err) => console.log(err))

//schema
let todoSchema = new Schema({
    text: String,
    isCompleted: Boolean
})

let Todo = mongoose.model('Todo', todoSchema);
//route
app.use('/todos',router);
//get All
router.route('/').get((req, res) => {
  Todo.find((err,items) => {
      if(err) {
            res.status(400).json(err);
            console.log(err)
      }
      else {
          res.status(200).json(items);
      }
   })
}) 



router.route('/add').post((req,res) => {
    let todo = new Todo(req.body);
    todo.save()
    .then((data) => {
        console.log('todo successfully'); 
        res.status(200).json(data)
     })
    .catch(err => {
        res.status(400).json(err);
        console.log(err);
    });
    //console.log(res);
    
}) 

router.route('/:id').put((req,res) => {
    Todo.findById(req.params.id, (err,todo) => {
        if(err) {console.log(res.send(err))}
        todo.text =req.body.text;
        todo.isCompleted =req.body.isCompleted;
        todo.save()
        .then((data) =>{
            console.log('todo update successfully ');
            res.json(data);
        })
        .catch(err =>{
            res.status(500).send({message : err.message});
        })
    })
    
}) 

router.route('/:id').delete((req,res) => {
    Todo.findByIdAndRemove(req.params.id, (err,todo) => {
        if(err) {res.send(err)}
        todo.save((err,data) =>{
            if(err) {res.send(err)}
            console.log('todo deleted successfully');
            console.log(data);
            res.json({ message:'todo deleted successfully '});
        });
    })
    
}) 

router.route('/:id').get((req,res) => {
    Todo.findById(req.params.id, (err,todo) => {
        if(err) {res.send({"message": "id n'existe pas"})}
        res.json(todo); 
    })
    
}) 

