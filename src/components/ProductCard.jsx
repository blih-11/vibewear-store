import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import StarRating from './StarRating';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { requestAddToCart } = useCart();
  const { formatPrice } = useCurrency();

  const price = Number(product?.price) || 0;
  const originalPrice = Number(product?.originalPrice) || null;

  const discount =
    originalPrice && price
      ? Math.round((1 - price / originalPrice) * 100)
      : null;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const size = product?.sizes?.[0] ?? 'One Size';
    const color = product?.colors?.[0] ?? 'Default';
    requestAddToCart(product, size, color);
  };

  return (
    <div
      className="group relative bg-brand-surface rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-xl hover:shadow-black/20 border border-white/5"
      onClick={() => navigate(`/products/${product._id || product.id}`)}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-white/5">
        <img
          src={product?.image}
          alt={product?.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product?.isNew && (
            <span className="bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">
              New
            </span>
          )}
          {discount && (
            <span className="bg-black/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">
              -{discount}%
            </span>
          )}
          {!product?.inStock && (
            <span className="bg-black/70 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">
              Sold Out
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <StarRating rating={product?.rating || 0} reviews={product?.reviews || 0} />

        <h3 className="text-brand-cream text-sm font-medium mt-2 mb-1 leading-snug line-clamp-2">
          {product?.name || 'Unnamed Product'}
        </h3>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-brand-cream font-bold text-base">
            {formatPrice(price)}
          </span>
          {originalPrice && (
            <span className="text-brand-muted text-sm line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        <div
          className={`text-[11px] font-medium mb-3 ${
            product?.inStock ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {product?.inStock ? '● In Stock' : '● Out of Stock'}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!product?.inStock}
          className="w-full bg-black text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          {product?.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}
