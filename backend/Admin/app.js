const express=require('express')
const mongoose=require('mongoose')
const session=require('express-session')
const api=require('./routes/api')
const auth=require('./routes/auth')
const app=express();

app.use(express.static(path.join(__dirname,'public')))
app.use(express.json())
app.use(express.session({
    secret:'secret',
    resave:false,
    saveUninitialized:false,
    cookie:{maxAge:600000}  //10 minutes
}))
app.use(api)
app.use(auth)

mongoose.connect('mongodb://localhost:27017/AdminService',{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
    console.log('Admin connected to database.')
    app.listen(3000,()=>{console.log('Admin on 3000.')})
})
