const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully added new review')
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const campId = id;
    await Campground.findByIdAndUpdate(campId, { $pull: { reviews: reviewId }, useFindAndModify: false });
    await Review.findByIdAndDelete(reviewId, { useFindAndModify: false });
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/campgrounds/${campId}`);
}