const mongoose  = require('mongoose');

// Menu Schema
const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    imageURL: {
        type: String,
        required: false
    }
});

// User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Restaurant Schema
const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    restaurantID: {
        type: Number,
        required: true,
        unique: true
    }
});

// Order Schema
const orderSchema = new mongoose.Schema({
    customerName:{
      required: true,
      type: String
  },
    address: {
      required: true,
        type: String
    },
    itemName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

mongoose.connect('mongodb://localhost:27017/restaurant', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
});

module.exports = {
    User: mongoose.model('User', userSchema),
    Restaurant: mongoose.model('Restaurant', restaurantSchema),
    Menu: mongoose.model('Menu', menuSchema), // Assuming separate Menu model
    Order: mongoose.model('Order', orderSchema)
};
