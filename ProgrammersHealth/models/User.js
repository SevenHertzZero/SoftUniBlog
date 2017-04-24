const mongoose = require('mongoose');


let userSchema = mongoose.Schema(
    {
        email: {type: String, required: true, unique: true},
        passwordHash: {type: String, required: true},
        fullName: {type: String, required: true},
        salt: {type: String, required: true}
    }
);

userSchema.method({
    authenticate: function (password) {
        let inputPasswordHash = encription.hashPassword(password, this.salt);
        let isSamePasswordHash = inputPasswordHash === this.passwordHash;
        return isSamePasswordHash;
    }
});
const User = mongoose.model('User', userSchema);

module.exports = User;