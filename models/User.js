const { type } = require('express/lib/response');
const { Schema, model } = require('mongoose');
const thoughtSchema = require('./Thought')


const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please use a valid email address']
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'thoughts'
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'user'
            }
        ]
    },
    {
        toJSON: {
            getters: true,
            virtuals: true,
        },
    }
);

userSchema
.virtual('ttlFriends')
.get(function () {
        return this.friends.length
    })

const User = model('user', userSchema)

module.exports = User;