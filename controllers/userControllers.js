const res = require('express/lib/response')
const { User, Thought } = require('../models')

const ttlFriends = async () =>
    User.aggregate()
    .count('ttlFriends')
    .then((numberOfFriends) => numberOfFriends)

module.exports = {
    //Get all users in collection
    getAllUsers(req, res) {
        User.find()
        .then(async (users) =>{
            const userObject = {
                users
            }
            return res.json(userObject)
        })
        .catch((err) =>{
            console.log(err)
            return res.status(500).json(err)
        })
    },

    //Get one user from collection, Using id
    getOneUser(req, res) {
        User.findOne({ _id: req.params.userId })
        .select('-__v')
        .then(async (user) =>
            !user
            ? res.status(404).json({ message: 'User Not Found' })
            : res.json({
                user,
                ttlFriends : await ttlFriends()
            })
        )
        .catch((err) => {
            console.log(err)
            return res.status(500).json(err)
        })
    },

    //Create a new user
    createNewUser(req, res) {
        User.create(req.body) 
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json(err))
        
    },

    //Update user from collection, Using id and body
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { new: true }
        )
        .then((user) =>
            !user
            ? res.status(404).json({ message: 'User Not Found' })
            : res.json(user)
        )
        .catch((err) => {
            console.log(err)
            return res.status(500).json(err)
        })
    },

    //Delete user from collection, Using id
    deleteUser(req, res){
        User.findOneAndRemove({ _id: req.params.userId })
        .then((user) =>
         !user
            ? res.status(404).json({ message: 'User Not Found' })
            : Thought.findOneAndUpdate(
                { username: req.params.username },
                { $pull: { username: req.params.username } },
                { new: true }
            )
        )
        .then((thought) =>
         !thought
            ? res.status(404).json({ message: 'User Deleted, No thoughts found'})
            : res.json({ message: 'User Deleted'})
        )
        .catch((err) => {
            console.log(err)
            return res.status(500).json(err)
        })
    },

    //Add a friend using user id
    addFriend(req, res){
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet : { friends : req.params.friendId } },
            { runValidators: true, new: true }
        )
        .then((friend) =>
         !friend
            ? res.status(404).json({ message: 'Friend not found' })
            : res.json(friend)
        )
        .catch((err) => res.status(500).json(err))
    },

    //delete a friend using user id
    deleteFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friend: req.params.friendId } },
            { runValidators: true, new: true }
        )
        .then((user) =>
         !user
            ? res.status(404).json({ message: 'User Not Found' })
            : res.json(user)
        )
        .catch((err) => res.status(500).json(err))
    },
}