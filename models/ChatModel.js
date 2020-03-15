const { model, Schema } = require('mongoose')

const chatSchema = new Schema({
    username: String,
    message: String,
    id: String
},
{
    timestamps: true,
    versionKey: false
})

module.exports = model('Chat', chatSchema)