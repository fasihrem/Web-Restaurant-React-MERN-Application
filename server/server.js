const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const bcrypt = require('bcrypt'); // For password hashing
const multer = require('multer');


const app = express();
const port = process.env.PORT || 5000;

const bodyParser = require('body-parser');
// const menu = require("../application/src/Menu");
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

const mongoURI = 'mongodb://localhost:27017/restaurant';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

const UserSchema = new mongoose.Schema({
    name: String,
    phoneNumber: Number,
    password: String,
});

const MenuSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: String,
    imageURL: String
});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;

const MenuModel = mongoose.model('menus', MenuSchema);
module.exports = MenuModel;

app.use(cors({ origin: 'http://localhost:3000' }));

// SIGNS UP NEW USER
app.post('/api/signup', async (req, res) => {
    console.log('Received signup request:', req.body);
    const { name, phoneNumber, password } = req.body;

    try {
        const newUser = new UserModel({ name, phoneNumber, password });
        const savedUser = await newUser.save();
        res.json({ message: 'Signup successful!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Signup failed!' });
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/Users/fasihrem/Downloads/University/Web Dev/backend/application/src/img/'); // Specify the upload directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Generate unique filenames
    },
});

const upload = multer({ storage });

// ADDS ITEMS IN MENU
app.post('/api/updateMenu', upload.single('image'), async (req, res ) => {
    console.log("menu addition request recieved", req.body);
    const {name, description, price, imageURL} = req.body;

    if (!req.file) {
        return res.status(400).json({ message: 'Please upload an image' });
    }

    try{
        const newMenuItem = new MenuModel({
            name,
            description,
            price,
            imageURL: req.file.filename,
        });
        const saveMenuItem = await newMenuItem.save();
        res.json({message: 'menu addition succesful'});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: 'menu addition failed'});
    }
});

// DISPLAYS THE MENU
// app.get('/api/getMenu', (req, res) => {
//     MenuModel.find()
//         .then(menus => res.json(menus))
//         .catch(err => res.json(err));
//     console.log('menu display sent:', req.body); // Log sent data
//
// });


// DISPLAYS THE MENU
app.get('/api/getMenu', async (req, res) => {
    try {
        const menus = await MenuModel.find();
        const menusWithImageUrl = menus.map(menu => {
            menu.imageUrl = process.cwd() + '/Users/fasihrem/Downloads/University/Web Dev/backend/application/src/img/' + menu.imageUrl;
            return menu;
        });
        res.json(menusWithImageUrl);
    } catch (err) {
        res.json({ message: err.message });
    }
});


//data menu
app.get('/api/Menu', async (req, res) => {
    try {
        const menus = await Menu.find();
        res.json(menus);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// DELETE ITEMS IN MENU
app.delete('/api/deleteMenu/:id', async (req, res) => {
    try {
        const deletedMenu = await MenuModel.findByIdAndDelete(req.params.id);
        if (!deletedMenu) {
            return res.status(404).json({ message: 'Menu not found' });
        }
        res.json({ message: 'Menu deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// DISPLAYS THE USERS
app.get('/api/getUsers', (req, res) => {
    UserModel.find()
        .then(users => res.json(users))
        .catch(err => res.json(err));
    console.log('menu display sent:', req.body);

});

app.post('/api/login', async (req, res) => {
    const { name, password } = req.body;

    try {
        const user = await UserModel.findOne({ name });
        if (!user) {
            console.log("no user by this name");
            console.log(req.body);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.json({ message: 'Login successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
