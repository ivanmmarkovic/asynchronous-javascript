
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
let usersList = require('./UsersList');
const usersCalculated = [];
for(let i = 0; i < 100; i++){
    usersCalculated.push(...usersList);
}
usersList = usersCalculated;
console.log('Length of users array', usersList.length);

const UserModel = require('./models/User');

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true 
})
    .then(() => console.log('Connected to db'))
    .catch(e => console.log(e.message));



app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', async (req, res, next) => {
    console.log('------------------------HI');
    return res.status(200).json('Hi');
});

app.post('/users', async (req, res, next) => {
    let promisesArray = [];
    let start = new Date().getTime();
    for(let user of usersList){
        await UserModel.create({...user});
        // promisesArray.push(UserModel.create({...user}));
    }

    console.log('For loop out --------------------------------------------------------');
    // await Promise.allSettled(promisesArray);
    // console.log('Promise.allSettled finished --------------------------------------------------------');
    let end = new Date().getTime();


    return res.status(200).json((end - start) / 1000);
});

app.get('/users', async (req, res, next) => {
    let users = await UserModel.find({$or: [{firstName: "Séréna"}, {lastName: "Gladman"}]});
    return res.status(200).json(users);
});




app.listen(5000, () => console.log(`Listen on port ${PORT}`));