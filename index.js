const express = require('express')
const users = require('./MOCK_DATA.json')
const fs = require('fs')
const app = express()
const port = 3000;

app.use(express.urlencoded({extended:false}))
app.get('/api/users', (req, res) => {
    return res.json(users)
})

app.get('/users', (req, res) => {
    const html = `
    <ul>
    ${users.map(user => `<li>${user.first_name}</li>`).join('')}
    </ul>
    `
    return res.send(html)
})
app.route('/api/users/:id')
    .get((req, res) => {
        const id = Number(req.params.id)
        const user = users.find((user) => user.id === id)
        return res.json(user)
    }).patch((req, res) => {
        res.json({status:'pending'})

    }).delete((req, res) => {
        res.json({status:'pending'})
    })
app.post('/api/users',(req, res) => {
    const body = req.body
    users.push({...body,id:users.length + 1})
    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err,data)=>{

        res.json({status:'Success',id:users.lengt})
    })

})
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`))