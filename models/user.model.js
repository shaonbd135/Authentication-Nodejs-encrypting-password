const mongoose = require('mongoose');

// const encrypt = require('mongoose-encryption');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
})

// encrypting password with secret key

// const encKey = process.env.ENC_KEY;
// userSchema.plugin(encrypt, {
//     secret: encKey,
//     encryptedFields: ['password']
// });

module.exports = mongoose.model('database-matching', userSchema);