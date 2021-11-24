const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const CampgroundSchema = new Schema({
    title: String,
    images: [
        { url: String, filename: String }
    ],
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    console.log(doc);
    if (doc) {
        const res = await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
        console.log(res)
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);