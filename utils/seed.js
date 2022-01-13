const connection = require('../config/connection')
const { User, Thought } = require('../models/index')
const {usernames, email, thoughts} = require('./data')

connection.on('error', (err) => err);

connection.once('open', async () => {
    console.log('connected')

    await User.deleteMany({})


    console.log('================Collections Emptied================');

    const user = []

    function userData() {
        for(let i = 0; i < usernames.length; i++ ){
            const userObject = {
                username: usernames[i],
                email: email[i]
            }
            user.push(userObject)
        }
    }

    userData()

    await User.insertMany(user);

    console.table(user);

    console.info('================Users Seeded================')

    //---------------------------------------------------------------

    await Thought.deleteMany({})


    console.log('================Collections Emptied================');

    const thought = []

    function thoughtData() {
        for(let i = 0; i < thoughts.length; i++ ){
            const thoughtsObject = {
                username: usernames[i],
                thoughtName: thoughts[i]
            }
            thought.push(thoughtsObject)
        }
    }

    thoughtData()

    console.log(thought);

    await Thought.insertMany(thought);

    console.table(Thought);

    console.info('================Thoughts Seeded================')

    process.exit(0);
})

