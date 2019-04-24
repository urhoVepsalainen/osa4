const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.get('/', async (request, response, next) => {

  try {
    //palauttaa kaikki vitun käyttäjät tähän halutaan vain omat
    const result = await User.find({})
    //esimerkki populatesta
    //.populate('blogs',{ title: 1, author: 1, url: 1, likes: 1 })
    response.status(200).json(result)
  }catch(error){
    next(error)
  }
})

userRouter.post('/', async (request, response, next) => {
  const body = request.body

  if( typeof body.password === 'undefined' || body.password.length < 3 ) {
    return response.status(400).json({ error: "password must be at least 3 charecters long" })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    name: body.user,
    username: body.username,
    passwordHash
  })
  try {
    const result = await user.save()
    response.status(201).json(result)
  }catch(error){
    next(error)
  }
})

//harkitse jätetäänkö tälläiseksi vai tuleeko käyttäjälle mahdollisuus poistaa oma käyttäjänsä
userRouter.delete('/:id', async (request, response, next) => {
  // const idToDelete = request.body.id
  // CHECHKKAA TOKENI
  try {
    await User.findByIdAndRemove(request.params.id)
    response.status(204).end()
  }catch(error){
    next(error)
  }
})

module.exports = userRouter