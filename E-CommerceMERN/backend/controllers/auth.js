const User = require('../models/user')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const { expressjwt: expressjwt } = require('express-jwt')
const _ = require('lodash')
const { OAuth2Client } = require('google-auth-library')
// nodemailer.

// actual signup

// exports.signup = (req, res) => {
//     const { name, email, password } = req.body;

//     User.findOne({ email })
//         .then((user) => {
//             if (user) {
//                 console.log('Email is taken');
//                 return res.status(400).json({
//                     error: 'Email is taken',
//                 });
//             }

//             let newUser = new User({ name, email, password });

//             return newUser.save();
//         })
//         .then(() => {
//             console.log('Save credentials successful');
//             return res.status(200).json({
//                 message: 'Signup successful. Please signin.',
//             });
//         })
//         .catch((err) => {
//             console.error('Error in signup:', err);
//             // Ensure to return the response and stop further execution
//             return res.status(500).json({
//                 error: 'Internal server error',
//             });
//         });
// };

exports.signup = (req, res) => {
  const { name, email, password } = req.body
  User.findOne({ email }).then((user) => {
    if (user) {
      console.log('Email is taken')
      return res.status(400).json({
        error: 'Email is taken',
      })
    }
    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: '10m' }
    )
    console.log(process.env.CLIENT_URI)
    // console.log(token);
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_TO, // generated brevo user
        pass: process.env.BREVO_API_KEY, // generated brevo password
      },
    })
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Account activation link',
      html: `
      <h1>Please use the following link to activate your account</h1>
        <p> ${process.env.CLIENT_URI}/auth/activate/${token}</p>
        <hr/>
        <p>This mail may contain sensitive info</p>
        <p> ${process.env.CLIENT_URI}</p>
        `,
    }
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
        return res.status(400).json({
          error: 'Error in sending mail',
        })
      } else {
        console.log('email sent')
        return res.status(200).json({
          message: `Email have been sent to ${email} follow the steps`,
        })
      }
    })
  })
}

exports.accountActivation = (req, res) => {
  const { token } = req.body
  //   console.log(token)
  if (token) {
    jwt.verify(
      token,
      process.env.JWT_ACCOUNT_ACTIVATION,
      function (err, decoded) {
        if (err) {
          console.log('JWT verify in account activation error', err)
          return res.status(401).json({
            error: 'Expired link sign up again',
          })
        }
        const { name, email, password } = jwt.decode(token)
        const user = new User({ name, email, password })
        user
          .save()
          .then(() => {
            console.log('Save credentials successful')
            return res.status(200).json({
              message: 'Signup successful. Please signin.',
            })
          })
          .catch((err) => {
            return res.status(401).json({
              error: 'unable to save to database',
            })
          })
      }
    )
  } else {
    return res.status(401).json({
      error: 'Somethinng went wrong Try Again!!!',
    })
  }
}

exports.signin = (req, res) => {
  const { email, password } = req.body
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        console.log('User does not exist !!')
        return res.status(400).json({
          error: 'User does not exist please signup',
        })
      }
      //authenticate
      if (!user.authenticate(password)) {
        return res.status(400).json({
          error: 'Email and password does not match',
        })
      }
      //generate a token and sent to client
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      })
      const { _id, name, email, role } = user
      return res.json({
        token,
        user: { _id, name, email, role },
      })
    })
    .catch((err) => {
      console.error('Error in signin:', err)
      return res.status(500).json({
        error: 'Internal server error',
      })
    })
}

exports.requireSignin = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
})

exports.forgetPassword = async (req, res) => {
  const { email } = req.body
  User.findOne({ email })
    .then(async (user) => {
      if (!user) {
        console.log('User not found')
        return res.status(400).json({
          error: 'User not found',
        })
      }
      const token = jwt.sign(
        { _id: user._id, name: user.name },
        process.env.JWT_RESET_PASSWORD,
        { expiresIn: '10m' }
      )
      console.log(process.env.CLIENT_URI)
      // console.log(token);
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_TO, // generated brevo user
          pass: process.env.BREVO_API_KEY, // generated brevo password
        },
      })
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Password reset link',
        html: `
        <h1>Please use the following link to reset your account password</h1>
          <p> ${process.env.CLIENT_URI}/auth/password/reset/${token}</p>
          <hr/>
          <p>This mail may contain sensitive info</p>
          <p> ${process.env.CLIENT_URI}</p>
          `,
      }

      await user.updateOne(
        { resetPasswordLink: token },
        { $set: { resetPasswordLink: token } }
      )
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error)
          return res.status(400).json({ error: 'Error in sending mail' })
        } else {
          console.log('email sent')
          return res.status(200).json({
            message: `Email has been sent to ${email} follow the steps`,
          })
        }
      })
    })
    .catch((err) => {
      console.error('User not found:', err)
      return res.status(500).json({
        error: 'User not found error!!',
      })
    })
}

exports.resetPassword = (req, res) => {
  const { newPassword, resetPasswordLink } = req.body
  if (resetPasswordLink) {
    jwt.verify(
      resetPasswordLink,
      process.env.JWT_RESET_PASSWORD,
      function (err, decoded) {
        if (err) {
          return res.status(400).json({
            error: 'Expired Lnk Try again!!',
          })
        }
        User.findOne({ resetPasswordLink: resetPasswordLink })
          .then((user) => {
            if (!user) {
              console.log('Something went wrong Try later')
              return res.status(400).json({
                error: 'Something went wrong Try later',
              })
            }
            const updatedFields = {
              password: newPassword,
              resetPasswordLink: '',
            }
            user = _.extend(user, updatedFields)
            user
              .save()
              .then(() => {
                console.log('Updated credentials successful')
                return res.status(200).json({
                  message: 'Updated credentials successful!!Please login',
                })
              })
              .catch(() => {
                return res.status(401).json({
                  error: 'unable to update to database',
                })
              })
          })
          .catch((err) => {
            console.log('Something went wrong Try later', err)
            return res.status(400).json({
              error: 'Something went wrong Try later',
            })
          })
      }
    )
  }
}

// exports.googleLogin = (req, res) => {
//   const { code } = req.body;
//   console.log(code)
//   client
//     .verifyIdToken({idToken: code, audience: process.env.GOOGLE_CLIENT_ID })
//     .then((response) => {
//       console.log(response);
//       const { email_verified, name, email } = response.getPayload();
//       console.log(email);
//       if (email_verified) {
//         User.findOne({ email })
//           .then((user) => {
//             if (user) {
//               const token = jwt_sign(
//                 { _id: user._id },
//                 process.env.JWT_SECRET,
//                 { expiresIn: "7d" }
//               );
//               const { _id, email, name, role } = user;
//               return res.json({
//                 token,
//                 user: { _id, email, name, role },
//               });
//             } else {
//               let password = email + process.env.JWT_SECRET;
//               user = new User({ name, email, password });
//               user
//                 .save()
//                 .then(() => {
//                   const token = jwt_sign(
//                     { _id: user._id },
//                     process.env.JWT_SECRET,
//                     { expiresIn: "7d" }
//                   );
//                   const { _id, email, name, role } = user;
//                   return res.json({
//                     token,
//                     user: { _id, email, name, role },
//                   });
//                 })
//                 .catch(() => {
//                   return res.status(401).json({
//                     error: "unable to save or create the google login",
//                   });
//                 });
//             }
//           })
//           .catch((err) => {
//             console.log("Error in finding user in google login",err);
//             return res.status(400).json({
//               error: "Error in finding user in google login",
//             });
//           });
//       }
//       else{
//         return res.status(400).json({
//           error: "Google login failed try again...",
//         });
//       }
//     }).catch((error) => {
//       console.error("Token verification failed:", error);
//       return res.status(401).json({ error: "Invalid Google token" });
//     });
// };

exports.googleLogin = async (req, res) => {
  const client = new OAuth2Client(
    '13651812709-lo9jq1ue2udhm070lsvvpdja9qqnf8q3.apps.googleusercontent.com'
  )
  try {
    const { code } = req.body
    console.log(code, '\n')

    const response = await client.verifyIdToken({
      idToken: code,
      audience:
        '13651812709-lo9jq1ue2udhm070lsvvpdja9qqnf8q3.apps.googleusercontent.com',
    })

    console.log(response)
    const { email_verified, name, email } = response.getPayload()
    console.log(email)

    if (email_verified) {
      console.log('email_verified')
      const user = await User.findOne({ email })

      if (user) {
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: '7d',
        })

        const { _id, email, name, role } = user
        return res.json({
          token,
          user: { _id, email, name, role },
        })
      } else {
        let password = email + process.env.JWT_SECRET
        const newUser = new User({ name, email, password })

        await newUser.save()

        const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, {
          expiresIn: '7d',
        })

        const { _id, email, name, role } = newUser
        return res.json({
          token,
          user: { _id, email, name, role },
        })
      }
    } else {
      return res.status(400).json({
        error: 'Google login failed, try again...',
      })
    }
  } catch (error) {
    console.error('Error in Google login:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
