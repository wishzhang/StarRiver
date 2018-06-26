var express=require('express');
var path=require('path')
var router=require(path.join(__dirname,'router'));
var app=express();
app.engine('html',require('express-art-template'));

app.use(router);

app.listen(4000,function () {
    console.log('服务器已启动...');
})