const { model, schema, Schema } = require('mongoose');

const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    createAt: String,
    // timestamps: { createdAt: 'created_at' }
})

module.exports = model("User", userSchema);
