const User = require('../model/userModel');
const bcrypt = require('bcrypt')

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username })
    const emailCheck = await User.findOne({ email })
    if (usernameCheck) {
      return res.json({ msg: 'Username already exists', status: false })
    }
    if (emailCheck) {
      return res.json({ msg: 'Email already used', status: false })
    }
    const hashedPassword = await bcrypt.hash(password, 7)
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    })
    delete user.password
    return res.json({
      status: true,
      user
    })
  } catch (err) {
    next(err)
  }
}


module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username })
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!user) {
      return res.json({ msg: 'Incorrect username or password', status: false })
    }
    if (!isPasswordCorrect) {
      return res.json({ msg: 'Incorrect username or password', status: false })
    }
    delete user.password
    return res.json({
      status: true,
      user
    })
  } catch (err) {
    next(err)
  }
}

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      avatarImage
    })
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage
    })
  } catch (err) {
    next(err)
  }
}