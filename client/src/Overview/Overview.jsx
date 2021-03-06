import React, { useReducer, useEffect, useContext } from 'react';
import Gallery from './Gallery/Gallery.jsx';
import './main.css';
import UserShop from './UserShop/UserShop.jsx';
import { globalContext } from '../index.jsx';
import axios from 'axios';
import options from '../config/config.js';

const initialState = {
  isExpanded: false,
  styleIndex: 0,
  styleResults: [],
  images: [],
  thumbnails: [],
  originalPrice: '',
  salePrice: '',
  onSale: false,
  styleName: '',
  styleThumbnails: [],
  sku: {},
  sizes: [],
  quantities: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'expand':
      return { ...state, isExpanded: true };
    case 'unexpand':
      return { ...state, isExpanded: false };
    case 'changeStyleIndex':
      return { ...state, styleIndex: action.data };
    case 'updateStyleResults':
      return { ...state, styleResults: action.data };
    case 'updateImages':
      return { ...state, images: action.data };
    case 'updateThumbnails':
      return { ...state, thumbnails: action.data };
    case 'updatePrice':
      return { ...state, originalPrice: action.data };
    case 'updateSale':
      return { ...state, onSale: action.data };
    case 'updateSalePrice':
      return { ...state, salePrice: action.data };
    case 'updateStyleName':
      return { ...state, styleName: action.data };
    case 'updateStyleThumbnails':
      return { ...state, styleThumbnails: action.data };
    case 'updateSku':
      return { ...state, sku: action.data };
    case 'updateSizes':
      return { ...state, sizes: action.data };
    case 'updateQuantities':
      return { ...state, quantities: action.data };
    default:
      return state;
  }
};

export const ExpandContext = React.createContext();

const Overview = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const globalData = useContext(globalContext);

  useEffect(() => {
    axios.get(`${options.url}products/${globalData.state.productId}/styles`, { headers: options.headers })
      .then((response) => {
        dispatch({ type: 'updateStyleResults', data: response.data.results });
        const imgs = response.data.results[state.styleIndex].photos.map((photo) => photo.url);
        const thumbnailImgs = response.data.results[state.styleIndex]
          .photos.map((photo) => photo.thumbnail_url);
        dispatch({ type: 'updateImages', data: imgs });
        dispatch({ type: 'updateThumbnails', data: thumbnailImgs });

        const price = response.data.results[state.styleIndex].original_price;
        dispatch({ type: 'updatePrice', data: price });
        if (response.data.results[state.styleIndex].sale_price !== null) {
          dispatch({ type: 'updateSale', data: true });
          const saleprice = response.data.results[state.styleIndex].sale_price;
          dispatch({ type: 'updateSalePrice', data: saleprice });
        } else {
          dispatch({ type: 'updateSale', data: false });
        }

        const stylename = response.data.results[state.styleIndex].name;
        dispatch({ type: 'updateStyleName', data: stylename });
        const thumbnails = response.data.results.map((styleObj) => (
          styleObj.photos[0].thumbnail_url
        ));
        dispatch({ type: 'updateStyleThumbnails', data: thumbnails });

        const skuData = {};
        const sizeData = [];
        const quantityData = {};
        const { skus } = response.data.results[state.styleIndex];

        Object.keys(skus).forEach((key) => {
          skuData[key] = skus[key];
          sizeData.push(skus[key].size);
          quantityData[skus[key].size] = skus[key].quantity;
        });
        dispatch({ type: 'updateSku', data: skuData });
        dispatch({ type: 'updateSizes', data: sizeData });
        dispatch({ type: 'updateQuantities', data: quantityData });
      })
      .catch((err) => {
        console.log('styles data fetching err', err);
      });
  }, [globalData.state.productId]);

  useEffect(() => {
    if (state.styleResults[state.styleIndex]) {
      const imgs = state.styleResults[state.styleIndex].photos.map((photo) => photo.url);
      const thumbnailImgs = state.styleResults[state.styleIndex]
        .photos.map((photo) => photo.thumbnail_url);
      dispatch({ type: 'updateImages', data: imgs });
      dispatch({ type: 'updateThumbnails', data: thumbnailImgs });

      const price = state.styleResults[state.styleIndex].original_price;
      dispatch({ type: 'updatePrice', data: price });
      if (state.styleResults[state.styleIndex].sale_price !== null) {
        dispatch({ type: 'updateSale', data: true });
        const saleprice = state.styleResults[state.styleIndex].sale_price;
        dispatch({ type: 'updateSalePrice', data: saleprice });
      } else {
        dispatch({ type: 'updateSale', data: false });
      }

      const stylename = state.styleResults[state.styleIndex].name;
      dispatch({ type: 'updateStyleName', data: stylename });

      const skuData = {};
      const sizeData = [];
      const quantityData = {};
      const { skus } = state.styleResults[state.styleIndex];

      Object.keys(skus).forEach((key) => {
        skuData[key] = skus[key];
        sizeData.push(skus[key].size);
        quantityData[skus[key].size] = skus[key].quantity;
      });
      dispatch({ type: 'updateSku', data: skuData });
      dispatch({ type: 'updateSizes', data: sizeData });
      dispatch({ type: 'updateQuantities', data: quantityData });
    }
  }, [state.styleIndex]);

  return (
    <div className="container">
      <ExpandContext.Provider value={{ currState: state, dispatchFunc: dispatch }}>
        <Gallery />
        {!state.isExpanded && <UserShop />}
      </ExpandContext.Provider>
    </div>
  );
};
export default Overview;
