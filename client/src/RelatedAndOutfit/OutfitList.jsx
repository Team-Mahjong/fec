import React, {
  useState, useRef, useEffect, useContext,
} from 'react';
import axios from 'axios';
import OutfitCard from './OutfitCard.jsx';
import './list.css';
import options from '../config/config.js';
import { OutfitContext } from './RelatedAndOutfit.jsx';

const OutfitList = () => {
  // get current product from global state
  const [currProduct, setCurrProduct] = useState({});
  const [current, setCurrent] = useState(0);
  const [len, setLen] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [cards, setCards] = useState(0);
  const outfitsContext = useContext(OutfitContext);

  const updateWidth = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    setLen(outfitsContext.outfits.length - 1);
    window.addEventListener('resize', updateWidth);
    return () => { window.removeEventListener('resize', updateWidth); };
  }, []);

  useEffect(() => {
    let possibleCards = Math.floor((windowWidth - 100) / 230);
    if (possibleCards >= len) {
      possibleCards = len;
    }
    setCards(possibleCards);
  }, [windowWidth]);

  const listRef = useRef(null);

  const nextCard = () => {
    let newCurrent = current;
    if (newCurrent !== len - 1) {
      newCurrent = current + 1;
    }
    if (listRef.current) {
      listRef.current.scrollBy({
        top: 0,
        left: 231,
        behavior: 'smooth',
      });
    }
    setCurrent(newCurrent);
  };

  const prevCard = () => {
    let newCurrent = 0;
    if (current > 0) {
      newCurrent = current - 1;
    }
    if (listRef.current) {
      listRef.current.scrollBy({
        top: 0,
        left: -231,
        behavior: 'smooth',
      });
    }
    setCurrent(newCurrent);
  };

  return (
    <div className="list-section">
      {current !== 0 && <button type="button" className="btn-list-left" onClick={prevCard}>prev</button>}
      <div className="list-cards" style={{ width: `${cards * 230}px` }} ref={listRef}>
        {outfitsContext.outfits.map((product) => (
          <OutfitCard key={product.id} product={product} currProduct={currProduct} />
        ))}
      </div>
      {current !== len - cards && <button type="button" className="btn-list-right" onClick={nextCard}>next</button>}
    </div>
  );
};

export default OutfitList;