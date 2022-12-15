const querys = require('./querys');
const path = require('path')
const express = require('express');
const app = express();
app.use(express.static('./public'));
app.set('view engine' , 'ejs')

app.get('/', async (req,res)=>{
    data = await querys.getLast_state(1)
    res.render('index',{data: data})
});

app.listen(4000,()=>{
    console.log('app is listing on port 4000');
})