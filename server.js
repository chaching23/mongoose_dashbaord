var session = require('express-session');
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
// const flash = require('express-flash');
// app.use(flash());

app.use(session({
  secret: 'keyboardkitteh',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))

app.use(bodyParser.urlencoded({ extended: true }));
var path = require('path');
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');




mongoose.connect('mongodb://localhost/dashboard');
var UserSchema = new mongoose.Schema({
    name:  { type: String },
    species:  { type: String }, 
    strength: { type: String }, 
    weakness:   { type: String }
}); 

  
mongoose.model('User', UserSchema); 
var User = mongoose.model('User') 



app.get('/', function(request, response) {
    User.find({}, function(err, x){
    
      response.render('index', {users: x});
    
    });
    });


app.get('/new', function(req, res) {
    res.render('new');
});

app.post('/users', function(req, res) {
    var user = new User({name: req.body.name, species: req.body.species, strength: req.body.strength, weakness: req.body.weakness});
    user.save(function(err) {
        if(err) {
            console.log('something went wrong');
          } else { // else console.log that we did well and then redirect to the root route
            console.log('successfully added a user!');
          }
          res.redirect('/');
        })
      })


app.get('/delete/:id', function(req, res) {
    User.remove({_id: req.params.id}, function(err){
        console.log('removed')
        
});
res.redirect('/');
});

app.get('/show/:id', function(req, res) {
    User.findOne({_id: req.params.id}, function(err, x) {
        

res.render('view', {users: x});
});
});


app.get('/edit/:id', function(req, res) {
    User.findOne({_id: req.params.id}, function(err, x) {
        
res.render('edit', {users: x});
});
});

app.post('/update/:id', function(req, res) {
    // var user = new User({name: req.body.name, species: req.body.species, strength: req.body.strength, weakness: req.body.weakness});
    User.update({_id: req.params.id}, {name: req.body.name, species: req.body.species, strength: req.body.strength, weakness: req.body.weakness}, function(err){


        if(err) {
            console.log('something went wrong');
          } else { // else console.log that we did well and then redirect to the root route
            console.log('successfully added a user!');
          }
          res.redirect('/');
        })
      })
  



app.listen(8000, function() {
    console.log("listening on port 8000");
})
