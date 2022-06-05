const express = require('express')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const users = [
    {
        name: 'Jon snow',
        age: 17
    },
    {
        name: 'Edart Stakl',
        age: 43
    }
]

const app = express()
app.use(express.json())

app.get('/users', auth, (req, res) => {
    res.send(req.user)
})

app.post('/login', (req, res) => {
    const name = req.body.name
    
    if(name === 'Jon snow' || name === 'Edart Stark'){
       
        const token = jwt.sign({ name }, process.env.SECRET_KEY, { expiresIn: '15s'})
        res.send({ token })

    }else{
        res.send({ error: 'please create an account' })
    }
})


async function auth(req, res, next){
    try{
        const token = req.headers.authorization.replace('Bearer ', '')
        
        await jwt.verify(token, process.env.SECRET_KEY)

        req.token = token
        
        const decodedUser = jwt.decode(token, process.env.SECRET_KEY)
       
        const user = users.filter(user => user.name === decodedUser.name)
        
        req.user = user[0]
        next()
        
    }catch(err){
        res.status(401).send({error: 'please authenticate'})
    }
}


app.listen(3000)