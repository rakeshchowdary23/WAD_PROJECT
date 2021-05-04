const express = require('express');
const router = express.Router({ mergeParams: true });

const catchAsync = require('../utils/catchAsync');

const House = require('../models/house');
const Review = require('../models/review');


const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');



router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const house = await House.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    house.reviews.push(review);
    await review.save();
    await house.save();
    req.flash('success', 'Posted a new review');
    res.redirect(`/houses/${house._id}`);
}));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await House.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted the review');
    res.redirect(`/houses/${id}`);
}));



module.exports = router;