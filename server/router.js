var express=require('express');
var session=require('express-session');
var path=require('path');
var bodyParser = require('body-parser')
var Register=require(path.join(__dirname,'./model/register'));
var router=express.Router();

router.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}))

router.use(function (req,res,next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:63342');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

// router.use(bodyParser.urlencoded({ extended: false }));

router.get('/',function (req,res) {
    if(typeof req.session.user==='undefined'){
        res.send(JSON.stringify({code:1}))
    }else{
        res.send(JSON.stringify(req.session.user));
    }
});

router.get('/register',function (req,res) {
     Register.find({username:req.query.username},function (err,docs) {
         if(err){
             console.log(err);
             res.send(JSON.stringify({code:2,data:{}}));
             return;
         }
         if(docs.length===0){
             new Register(req.query).save(function (err,tank) {
                 if(err){
                     res.status(500).send();
                     return;
                 }
                 res.send(JSON.stringify({code:0,data:req.query}));
             })
             //保存登录状态信息
             req.session.user={code:0,data:req.query};
         }else{
             res.send(JSON.stringify({code:1,data:{}}));
         }
     })
});

//code:0 成功
//code:1 服务器内部出错
//code:2 账号未注册
//code:3 密码错误
router.get('/login',function (req,res) {
   Register.findOne({username:req.query.username},function (err,docs) {
       if(err){
           console.log(err);
           res.send({code:1});
           return;
       }
       if(docs===null){
           res.send({code:2});
       }else if(docs.password!==req.query.password){
           res.send({code:3});
       }else{
           //保存登录状态信息，这两句顺序不能倒，不然/接受到的req.session.user为undefined -_-
           req.session.user={code:0,data:req.query};
           res.send({code:0,data:docs});
       }
   })
});

router.get('/out',function (req,res) {
    res.send(JSON.stringify({code:0}));
})

module.exports=router;