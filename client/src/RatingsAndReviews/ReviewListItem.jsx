import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './reviews.css';
import { RatingView } from 'react-simple-star-rating';
import axios from 'axios';
import options from '../config/config';

const ReviewListItem = ({ review }) => {
  const [helpfull, setHelpfull] = useState(review.helpfulness);
  const [reported, setReported] = useState(false);

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const month = monthNames[d.getMonth()];
    const day = d.getDate() + 1;
    const year = d.getFullYear();
    return `${month} ${day}, ${year}`;
  };
  const handleAddHelpful = () => {
    setHelpfull(() => helpfull + 1);
    axios.put(
      `${options.url}reviews/${review.review_id}/helpful`,
      {
        helpfulness: helpfull,
      },
      {
        headers: options.headers,
      },
    )
      .then()
      .catch((err) => {
        throw err;
      });
  };

  // TODO: which value should we update by click "report"? can't find in the reviews
  const handleReport = () => {
    setReported(!reported);
    axios.put(
      `${options.url}reviews/${review.review_id}/report`,
      {
        headers: options.headers,
      },
    )
      .then()
      .catch((err) => {
        throw err;
      });
  };
  // const email = 'lisa@gamil.com';
  // TODO: review.email should also match the sale system as the verified purchaser
  // TODO: repsonse from seller section
  return (
    <div>
      <div className="review-list-overall">
        <RatingView ratingValue={review.rating} fillColor="black" />
        <span>
          {review.reviewer_name}
          {review.email ? <span>(Verified Purchaser)</span> : null}
          {', '}
          {formatDate(review.date)}
        </span>
      </div>
      <div className="review-summary">{review.summary}</div>
      <div>{review.body}</div>
      <div>
        {review.recommend ? <span>&#10003; I recommend this product</span> : null}
      </div>
      {/* {review.response ? <div>{review.response}</div> : ''} */}
      <div>
        <span>Helpful?</span>
        <span onClick={handleAddHelpful} onKeyDown={() => { }} role="link" tabIndex={0}>
          Yes(
          {helpfull}
          )
        </span>
        <span>{' | '}</span>
        <span onClick={handleReport} onKeyDown={() => { }} role="link" tabIndex={0}>
          {reported ? 'Reported' : 'Report'}
        </span>
      </div>
      <br />
    </div>
  );
};
ReviewListItem.propTypes = {
  review: PropTypes.shape({
    review_id: PropTypes.number,
    rating: PropTypes.number,
    summary: PropTypes.string,
    reviewer_name: PropTypes.string,
    date: PropTypes.string,
    body: PropTypes.string,
    recommend: PropTypes.bool,
    helpfulness: PropTypes.number,
    email: PropTypes.string,
  }),
};
ReviewListItem.defaultProps = {
  review: {},
};
export default ReviewListItem;
