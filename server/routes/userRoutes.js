const router = require('express').Router();
const { register, login, setAvatar } = require('../controllers/usersControllers')

const userRoutes = router.post('/register', register)
router.post('/login', login)
router.post('/setAvatar/:id', setAvatar)

module.exports = userRoutes; 