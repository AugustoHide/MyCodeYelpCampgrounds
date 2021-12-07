const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {});


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
})

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 90) + 10;
        const camp = new Campground({
            author: '619d6a0efe12d19375d033e7',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo consequuntur soluta obcaecati optio quasi, architecto placeat, doloribus corporis, officia possimus mollitia. Vitae blanditiis error enim corrupti architecto, provident recusandae dolorem.`,
            price,
            images: [
                {
                    url: 'https://res.cloudinary.com/dthtysqh9/image/upload/v1637790101/YelpCamp/h34ixkz9wdszxuf5rbdb.png',
                    filename: 'YelpCamp/h34ixkz9wdszxuf5rbdb'
                },
                {
                    url: 'https://res.cloudinary.com/dthtysqh9/image/upload/v1637790096/YelpCamp/zvxydh5ydrppidmepotc.webp',
                    filename: 'YelpCamp/zvxydh5ydrppidmepotc'
                }
            ],
            geometry: {
                type: 'Point',
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            }
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});