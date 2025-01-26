const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
        unique: true,
    }
},{
    versionKey: false,
    toJSON: { virtuals: true },
});

userSchema.virtual('notes',{
    ref: 'note',
    localField: '_id',
    foreignField: 'userId',
    justOne: false,
});

const UserModel = mongoose.model('user', userSchema);

module.exports = {UserModel};