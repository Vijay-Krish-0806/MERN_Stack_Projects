const express= require('express');
const router= express.Router();

const {requireSignin}=require('../controllers/auth');
const {read,update}=require('../controllers/user');


router.get('/user/:id',requireSignin,read);
router.put('/user/update/:id',requireSignin,update);


module.exports=router;
