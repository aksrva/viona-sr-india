const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    mobile: {type: String, required: true, unique: true, minlength:10, maxlength:10},
    password: {type: String, required: true, unique: false},
    jwt: {type: String},
    role: {type: String}
});
// virtual 
const virtual = userSchema.virtual('id');
virtual.get(function(){
    return this._id;
})
userSchema.set('toJSON', {
    virtuals:true,
    versionKey: false,
    transform: function(doc, ret){delete ret._id}
})
// Create model
exports.Users = mongoose.model('User', userSchema);