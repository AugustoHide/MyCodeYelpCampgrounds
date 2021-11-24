const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find();
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
    //if (!req.body.campground) throw new ExpressError('Incomplete Campground Data', 400);
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    await campground.save();
    console.log(campground);
    console.log(campground.images);
    req.flash('success', 'Successfully created new Campground!!!')
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author').populate('images');
    if (!campground) {
        req.flash('error', 'Cannot find this campground');
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find this campground to edit');
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async (req, res) => {
    const campgroundToUpdate = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground }, { useFindAndModify: false });
    req.flash('success', 'Successfully updated the camp')
    res.redirect(`/campgrounds/${campgroundToUpdate._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id, { useFindAndModify: false });
    res.redirect('/campgrounds');
}