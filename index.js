const express = require('express')
const users = require('./MOCK_DATA.json')

const app = express() 
const port = 3000;

app.get('/',(req,res)=>{
   return res.json(users)
})

app.listen(port,()=>console.log(`Sercer listening on http://localhost:${port}`))