import React from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  const price = Number(product?.price ?? 0);
  const img = product?.imageUrl || 'https://via.placeholder.com/640x360?text=No+Image';

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl">
      <img src={img} alt={product?.name || 'Product'} className="w-full h-40 object-cover" />
      <div className="p-4 flex flex-col items-center text-center">
        <h3 className="font-semibold text-gray-900 text-lg">{product?.name || 'Unnamed Product'}</h3>
        <p className="text-green-600 font-bold mt-1">₱{price.toFixed(2)}</p>
        <button
          type="button"
          onClick={() => onAddToCart(product)}
          className="mt-3 w-full py-2 bg-green-500 text-white font-semibold rounded-full shadow-md hover:bg-green-600 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
