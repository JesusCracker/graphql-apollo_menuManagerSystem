const {model, Schema} = require('mongoose');
//沒用了哈,void Schema!!!!

const positionSchema = new Schema({
    code: String,
    username: String,
    createAt: String,
    name: String,
    mg: [
        {
            name: String,
            address: String,
            web: String,
            server: String,
            user: String,
            test: String,
            pm: String,
            username: String,
            createAt: String,
        }
    ],
    epg: [
        {
            name: String,
            address: String,
            web: String,
            server: String,
            user: String,
            test: String,
            pm: String,
            username: String,
            createAt: String,
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },

})

module.exports = model("Position", positionSchema);


