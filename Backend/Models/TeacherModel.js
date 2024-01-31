const mongoose = require('mongoose')

const teacherSchema = mongoose.Schema({
    name : {type:String,required:true},
    age : {type:Number,required:true},
    department: {
        type: String,
        enum: ['Math', 'English', 'History', 'Geography'],
        required: true
    },
    
    createrId: { type: mongoose.Types.ObjectId, required: true },
});

const TeacherModel = mongoose.model('Teachers',teacherSchema);

module.exports = {TeacherModel}
