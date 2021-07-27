import React from 'react';
// import PropTypes from 'prop-types';

const FiveStar = ({ ratings }) => {
  const oneStar = parseInt(ratings['1'], 10);
  const twoStar = parseInt(ratings['2'], 10);
  const threeStar = parseInt(ratings['3'], 10);
  const fourStar = parseInt(ratings['4'], 10);
  const fiveStar = parseInt(ratings['5'], 10);
  const totalReviews = oneStar + twoStar + threeStar + fourStar + fiveStar;
  const totalScores = oneStar + twoStar * 2 + threeStar * 3 + fourStar * 4 + fiveStar * 5;
  const averageRatings = (totalScores / totalReviews).toFixed(1);

  return (
    <div className="ratings">
      <span>
        {averageRatings}
      </span>
      <span>☆</span>
      <span>☆</span>
      <span>☆</span>
      <span>☆</span>
      <span>☆</span>
    </div>
  );
};

// FiveStar.propTypes = {
//   ratings: PropTypes.object.isRequired,
//   ratings['5']: PropTypes.string.isRequired,
//   ratings['4']: PropTypes.string.isRequired,
//   ratings['3']: PropTypes.string.isRequired,
//   ratings['2']: PropTypes.string.isRequired,
//   ratings['1']: PropTypes.string.isRequired
// }

export default FiveStar;
