const express = require('express')
const router = express.Router()

const {
  signup,
  accountActivation,
  signin,
  forgetPassword,
  resetPassword,
  googleLogin,
} = require('../controllers/auth')

//import validators
const {
  userSignupValidator,
  userSigninValidator,
  forgetPasswordValidator,
  resetPasswordValidator,
} = require('../validators/auth')
const { runValidation } = require('../validators/index')

router.post('/signup', userSignupValidator, runValidation, signup)
router.post('/signin', userSigninValidator, runValidation, signin)
router.post('/account-activation', accountActivation)
//forget reset password
router.put(
  '/forget-password',
  forgetPasswordValidator,
  runValidation,
  forgetPassword
)
router.put(
  '/reset-password',
  resetPasswordValidator,
  runValidation,
  resetPassword
)

//google
router.post('/google-login', googleLogin)
module.exports = router
