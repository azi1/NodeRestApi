const {mongoose} = require('../db/mongoose');

var user = mongoose.model('Users', {
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
    },
});


module.exports =  { user };