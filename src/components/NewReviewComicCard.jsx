import React, { useState } from 'react';

const NewReviewComicCard = ({ onSubmit }) => { 
  const [text, setReviewText] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ text, rating });
    setReviewText('');
    setRating(0);
  };

  return (
    <div>
      <h3>Adaugă o recenzie nouă pentru comics</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Introdu textul recenziei"
        />
        <input
          type="number"
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
          min="1"
          max="5"
          placeholder="Rating (1-5)"
        />
        <button type="submit">Adaugă recenzie</button>
      </form>
    </div>
  );
};

export default NewReviewComicCard;
