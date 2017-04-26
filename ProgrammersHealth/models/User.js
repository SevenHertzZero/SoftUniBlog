const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const encryption = require('./../utilities/encryption');

let userSchema = mongoose.Schema(
    {
        email: {type: String, required: true, unique: true},
        passwordHash: {type: String, required: true},
        fullName: {type: String, required: true},
        articles: {type:[ObjectId], default: []},
        salt: {type: String, required: true}
    }
);

userSchema.method({

    authenticate: function (password) {
        console.log('password: ' + password);
        let inputPasswordHash = encryption.hashPassword(password, this.salt);
        let isSamePasswordHash = inputPasswordHash === this.passwordHash;
        console.log('inputPasswordHash: ' + inputPasswordHash);
        console.log('isSamePassword: ' + isSamePasswordHash);
        return isSamePasswordHash;

    }
});
const User = mongoose.model('User', userSchema);

module.exports = User;