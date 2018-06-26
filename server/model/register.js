var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/starriver');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('已连接数据库...');
});

var registerSchema = mongoose.Schema({
    username: {
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

var Register=mongoose.model('Register',registerSchema);

module.exports=Register;


