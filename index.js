const express = require('express')
const users = require('./MOCK_DATA.json')
const fs = require('fs')
const app = express()
const port = 3000;

app.use(express.urlencoded({ extended: false }))

app.use((req, res, next) => {
    console.log('Hello from middleware 1');// this will stop the response
    req.MyUserName = "Amaan"
    fs.appendFile('log.txt', `${Date.now()},${req.method},${req.path}`, (err, data) => {
        next();
    })
    // next()// this will let the server give the response to client
})
app.use((req, res, next) => {
    console.log('Hello from middleware 2');// this will stop the response
    return res.end('End')
})

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
        res.json({ status: 'pending' })

    }).delete((req, res) => {
        res.json({ status: 'pending' })
    })
app.post('/api/users', (req, res) => {
    const body = req.body
    if (!body || !body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title) {
        return res.status(404).json({ msg: "All field are required" })
    }
    users.push({ ...body, id: users.length + 1 })
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
        return res.status(201).json({ status: 'Success', id: users.lengt })
    })

})
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`))