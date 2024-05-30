const User = require('../models/user')
exports.read = (req, res) => {
  const _id = req.params.id
  User.findById({ _id })
    .then((user) => {
      if (!user) {
        return res.status(400).json({
          error: 'User not found',
        })
      } else {
        user.hashed_password = undefined
        user.salt = undefined
        return res.json(user)
      }
    })
    .catch((err) => {
      return res.status(400).json({
        error: `Internal server error ${err}`,
      })
    })
}

exports.update = (req, res) => {
  console.log('Update user-req.user', req.user, 'Update data', req.body)
  const _id = req.params.id
  const { name, password } = req.body
  User.findById({ _id })
    .then((user) => {
      if (!user) {
        return res.status(400).json({
          error: 'User not found',
        })
      }
      if (!name) {
        return res.status(400).json({
          error: 'Name is Required',
        })
      } else {
        user.name = name
      }
      if (password) {
        if (password.length < 6) {
          return res.status(400).json({
            error: 'Password should be min 6 characters long',
          })
        } else {
          user.password = password
        }
      }
      user
        .save()
        .then(() => {
          console.log('User details are updated')
          return res.status(200).json({
            message: 'User details are updated',
          })
        })
        .catch((err) => {
          return res.status(401).json({
            error: 'unable to update to database',
          })
        })
    })
    .catch((err) => {
      return res.status(400).json({
        error: `Internal server error ${err}`,
      })
    })
}
