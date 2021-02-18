var http = require('http')
var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var server = http.Server(app)
var Product = require('./product.model')
const path = require('path');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

// DB Connection
var mongoose = require('mongoose')
mongoose.Promise = global.Promise
var dbURL = 'mongodb://localhost:27017/productsdb' //change this if you are using Atlas
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }) 
mongoose.connection.on('error', function (err) {
 console.log(err)
})


// your server routes go here
app.use('/css', express.static(path.join(__dirname , '../css')));
app.use('/js', express.static(path.join(__dirname , '../js')));
app.use('/files', express.static(path.join(__dirname , '../files')));

app.get('/', function(request, response){
    response.sendFile(path.join(__dirname , '../index.html'));
})

app.get('/shoppingCart', function(request, response){
    response.sendFile(path.join(__dirname , '../files/shoppingCart.html'));
})

app.get('/products/all', function(request, response){
    Product.find({}, function (err, data) {
      if(err){
        return response.status(400).json({
          error: 'data is missing'
        })
      }
        // console.log(data);
      return response.status(200).json(JSON.stringify(data));
      })
})



app.post('/product/new', function(request, response){
    var newProduct = new Product(request.body)

    newProduct.save(function (err, data) {
        if (err)
          return response.status(400).json({
            error: 'data is missing'
          })
        return response.status(200).json({
          message: 'Product created successfully'
        })
      })     
// 
})

app.put('/product/update/:id/:quantity/', (request, response) => {
  Product.findByIdAndUpdate(request.params.id,{'quantity':request.params.quantity}, {new:true}, (err, data) => {
    console.log(data);
    if(err){
      return response.status(400).json({
        error: 'Request failed'
      })
    }
    return response.status(200).json({
      message: 'Product updated successfully'
    })
  })
})

app.delete('/product/:id', (request, response) => {
  Product.findByIdAndRemove(request.params.id, (err, data) => {
    if(err){
      return response.status(400).json({
        error: 'Request failed'
      })
    }
    return response.status(200).json({
      message: 'Product deleted successfully'
    })
  })
})


server.listen(process.env.PORT || 3000,
  process.env.IP || 'localhost', function(){
  console.log('Server running');
})


