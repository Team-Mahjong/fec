import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import StarRating from './StarRating.jsx';
import RatingsBreakDown from './RatingsBreakDown.jsx';
import ProductBreakDown from './ProductBreakDown.jsx';
import ReviewForm from './ReviewForm.jsx';
import ReviewList from './ReviewList.jsx';
import ReviewListItem from './ReviewListItem.jsx';
import calculateRating from '../../helper.js';
import { getReviewsMeta, getReviewsById } from '../../reviewRequest.js';
import getAllReviews from './getAllReviews.js';
import './ratings.css';

const RatingsAndReviews = () => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [recommended, setRecommended] = useState(0);
  const [notRecommended, setNotRecommended] = useState(0);
  const [ratings, setRatings] = useState({});
  const [characteristics, setCharacteristics] = useState({});
  const ratingsBreakDown = useMemo(() => calculateRating(ratings), [ratings]);
  // const [reviews, setReviews] = useState([]);

  const [sortOption, setSortOption] = useState('relevant');
  const [productId, setProductId] = useState(13023);
  const [page, setPage] = useState(1);
  const {
    reviews, hasMore, loading, error
  } = getAllReviews(productId, page, sortOption);
  const [filteredReviews, setFilteredReviews] = useState(reviews);
  const observer = useRef();
  const lastReviewRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) {
      observer.current.disconnect();
    }
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prev) => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  console.log(filteredReviews);

  // const params = {
  //   product_id: productId,
  //   page,
  //   count: 2,
  //   sort: sortOption,
  // };

  // useEffect(() => {
  //   getReviewsById(params).then((result) => {
  //     setReviews(result);
  //     setFilteredReviews(result);
  //   });
  // }, [sortOption]);

  useEffect(() => {
    getReviewsMeta(productId).then((result) => {
      setRatings(result.ratings);
      setRecommended(parseInt(result.recommended.true, 10));
      setNotRecommended(parseInt(result.recommended.false, 10));
      setCharacteristics(result.characteristics);
    });
  }, [productId]);

  // input rating is a digit number
  const handleFilterByRating = (rating) => {
    const filteredDta = reviews.filter((review) => review.rating === rating);
    setFilteredReviews(filteredDta);
  };

  const handleChangeSort = (option) => {
    setSortOption(option);
  };
  const handleAddReview = (newReview) => {
    setReviews([...reviews, newReview]);
  };

  return (
    <div id="review-form-modal" className="reviews-root">
      <h3>Ratings &amp; Reviews</h3>
      <div className="ratings-reviews">
        <div className="breakdown">
          <div className="overall-rating">
            <div>{ratingsBreakDown.averageRatings.toFixed(1)}</div>
            <StarRating rating={ratingsBreakDown.averageRatings} />
          </div>
          <br />
          <div>
            {((recommended * 100) / (recommended + notRecommended)).toFixed(0)}
            % of reviews recommend this product
          </div>
          <br />
          <RatingsBreakDown
            ratings={ratingsBreakDown}
            handleFilterByRating={handleFilterByRating}
          />
          <br />
          <ProductBreakDown characteristics={characteristics} />
        </div>

        <div className="review-list">
          <div>
            {ratingsBreakDown.totalReviews}
            {' reviews, sorted by '}
            <select
              onChange={(e) => {
                handleChangeSort(e.target.value);
              }}
            >
              <option value="relevant">Relevant</option>
              <option value="helpful">Helpful</option>
              <option value="newest">Newest</option>
            </select>
          </div>
          {filteredReviews.map((review) => <ReviewListItem review={review} key={review.review_id} />
          )}
          {/* <ReviewList
            reviews={filteredReviews}
          /> */}
          <button type="button">MORE REVIEWS</button>
          <button type="button" onClick={() => setShowReviewForm(true)}>ADD A REVIEW  + </button>
        </div>

      </div>
      <ReviewForm
        showModal={showReviewForm}
        productId={productId}
        characteristics={characteristics}
        onClose={() => setShowReviewForm(false)}
        handleAddReview={handleAddReview}
      />
    </div>
  );
};
export default RatingsAndReviews;