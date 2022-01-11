const { type } = require('express/lib/response');
const { Schema, model, Types } = require('mongoose');

const reactionSchema = new Schema({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId()
    },
    reactionBody: {
        type: String,
        maxlength: 200,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    createdAt :{
        type: Date,
        default: Date.now
    },
})

const thoughtSchema = new Schema(
    {
        thoughtsId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        thoughtName: {
            type: String,
            required: true,
            maxlength: 120,
            minlength: 1,
            default: 'Untitled Thought'
        },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        reactions: [reactionSchema]
    },
    {
        toJSON: {
            getters: true,
            virtuals: true,
        },
        id: false,
    }
);

thoughtSchema
    .virtual('reactionCount')
    .get(function() {
        return this.reactions.length;
    })

const Thought = model('thought', thoughtSchema)

module.exports = Thought;