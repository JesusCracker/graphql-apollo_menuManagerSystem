const {model, Schema} = require('mongoose');

const strongholdSchema = new Schema({
    code: {type: String, required: true},
    username: String,
    createAt: String,
    updatedAt: String,
    name: {type: String, required: true},
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

module.exports = model("Stronghold", strongholdSchema);


