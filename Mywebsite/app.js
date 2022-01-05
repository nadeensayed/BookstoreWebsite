var express = require('express');
var path = require('path');
var app = express();
var fs = require('fs');
var session = require('express-session');
const { error } = require('console');
const { render } = require('ejs');
const { RequestHeaderFieldsTooLarge } = require('http-errors');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret:'secret',resave: true,saveUninitialized: true
}))


app.get('/',function(req,res){
  res.render('login',{message:""})
});
app.get('/login',function(req,res){
  res.render('login',{message:""})
});
app.get('/registration',function(req,res){
  res.render('registration',{message:""})
});

app.get('/dune',function(req,res){
  res.render('dune',{added:false})
});
app.get('/fiction',function(req,res){
  res.render('fiction')
});
app.get('/flies',function(req,res){
  res.render('flies',{added:false})
});
app.get('/grapes',function(req,res){
  res.render('grapes',{added:false})
});
app.get('/home',function(req,res){
  res.render('home')
});
app.get('/leaves',function(req,res){
  res.render('leaves',{added:false})
});
app.get('/mockingbird',function(req,res){
  res.render('mockingbird',{added:false})
});
app.get('/novel',function(req,res){
  res.render('novel')
});
app.get('/poetry',function(req,res){
  res.render('poetry')
});
app.get('/readlist',function(req,res){
  res.render('readlist',{u:{}})
});
app.get('/searchresults',function(req,res){
  res.render('searchresults',{u:{}})
});

app.get('/sun',function(req,res){
  res.render('sun',{added:false})
});
app.post('/login',function(req,res){

  var x =req.body.username;
  var y=req.body.password;
  var data = JSON.parse(fs.readFileSync('users.json'));
  var i;
  for(i=0; i<data.length;i++){
    if(data[i].username==x){
      if(data[i].password==y){
        req.session.name=x
        res.render('home');
        return;
      }
    }
  }
  res.render('login',{message:"Incorrect Username or Password"})

});
app.post('/readlist',function(req,res){
  var data = JSON.parse(fs.readFileSync('userreadlist.json'))
  var u2
   for(i in data){
      if(data[i].username==req.session.name){
        u2 = data[i]
      }
    }
  res.render('readlist', {u : u2})
});

app.post('/addTo',function(req,res){
  var data = JSON.parse(fs.readFileSync('userreadlist.json'))
  var added=false
   for(i in data){
      if(data[i].username==req.session.name){
        if(data[i][req.body.bookname]==true){
          added=true
          break          
        }

        else{
        data[i][req.body.bookname]=true
        fs.writeFileSync('userreadlist.json',JSON.stringify(data,null,2))
        break
       }
      }
    }
    if(req.body.bookname == 'dune')
      res.render('dune',{added:added})
    else if(req.body.bookname == 'grapes')
    res.render('grapes',{added:added})
    else if(req.body.bookname == 'flies')
    res.render('flies',{added:added})
    else if(req.body.bookname == 'leaves')
    res.render('leaves',{added:added})
    else if(req.body.bookname == 'sun')
    res.render('sun',{added:added})
    else
    res.render('mockingbird',{added:added})
});
app.post('/register',function(req,res){
  var x =req.body.username;
  var y =req.body.password;
  if(x=="" || y==""){
      res.render('registration',{message:"Please enter both"})
      return;
  }
  var data = JSON.parse(fs.readFileSync('users.json'))
   for(i in data){
    if(data[i].username==x){
      res.render('registration',{message:"Username already taken"})
      return;
      }
    }
    data.push({username:x, password:y});
    var s=JSON.stringify(data,null,2);
    fs.writeFileSync('users.json',s)
    var data2 = JSON.parse(fs.readFileSync('userreadlist.json'))
    data2.push({username:x, dune:false, flies:false, grapes:false, leaves:false, sun:false, mockingbird: false})
    fs.writeFileSync('userreadlist.json',JSON.stringify(data2,null,2))
    //  userjson = x.concat(".JSON");
    //  fs.writeFileSync(userjson,"");
    res.render('login',{message:""})
  });

  app.post('/search',function(req,res){
    var s = req.body.Search
    var books = {dune:false, flies:false, grapes:false, leaves:false, sun:false, mockingbird: false}
    if('dune'.includes(s.toLowerCase()))
      books.dune=true
    if('lord of the flies'.includes(s.toLowerCase()))
      books.flies=true
    if('the grapes of wrath'.includes(s.toLowerCase()))
      books.grapes=true
    if('leaves of grass'.includes(s.toLowerCase()))
      books.leaves=true
    if('the sun and her flowers'.includes(s.toLowerCase()))
      books.sun=true
    if('to kill a mockingbird'.includes(s.toLowerCase()))
      books.mockingbird=true

    res.render('searchresults',{u: books})
  });

if(process.env.PORT){
    app.listen(process.env.PORT,function() {console.log('Server started')})
}
else{
  app.listen(7777,function() {console.log('Server started on port 7777')})
}

