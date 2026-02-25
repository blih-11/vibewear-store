import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { fetchProducts } from '../lib/api';
import StarRating from '../components/StarRating';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { requestAddToCart, setCartOpen } = useCart();
  const { formatPrice } = useCurrency();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedImg, setSelectedImg] = useState(0);
  const [sizeError, setSizeError] = useState(false);
  const [colorError, setColorError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setSelectedSize(null);
    setSelectedColor(null);
    setSelectedImg(0);

    fetch(`http://localhost:4000/api/products/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setProduct(data.product);
          // Fetch related products
          return fetch('http://localhost:4000/api/products')
            .then(r => r.json())
            .then(all => {
              if (all.success) {
                const rel = all.products
                  .filter(p => p._id !== data.product._id && p.category?.some(c => data.product.category?.includes(c)))
                  .slice(0, 4);
                setRelated(rel);
              }
            });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white/10 border-t-white/50 rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center gap-4 text-center px-4">
      <h2 className="text-brand-cream font-bold text-2xl">Product not found</h2>
      <button onClick={() => navigate('/products')} className="text-white text-sm hover:underline">Browse Products</button>
    </div>
  );

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;
  const images = product.images?.length > 0 ? product.images : [product.image];

  const handleAddToCart = () => {
    if (!selectedSize) { setSizeError(true); return; }
    if (!selectedColor) { setColorError(true); return; }
    setSizeError(false); setColorError(false);
    requestAddToCart(product, selectedSize, selectedColor);
  };

  return (
    <div className="bg-brand-bg min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <nav className="flex mt-12 items-center gap-2 text-brand-muted text-xs">
          <button onClick={() => navigate('/')} className="hover:text-brand-cream transition-colors">Home</button>
          <span>/</span>
          <button onClick={() => navigate('/products')} className="hover:text-brand-cream transition-colors">Products</button>
          <span>/</span>
          <span className="text-brand-cream truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-14">
          {/* Images */}
          <div className="space-y-3">
            <div className="aspect-[4/5] rounded-xl overflow-hidden bg-white/5">
              <img src={images[selectedImg] || product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImg(i)} className={`w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${selectedImg === i ? 'border-white' : 'border-white/10 hover:border-white/30'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {product.isNew && <span className="bg-white/10 text-white border border-white/20 text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wide">New Arrival</span>}
              {discount && <span className="bg-white/8 text-brand-cream border border-white/15 text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wide">-{discount}% Off</span>}
              {!product.inStock && <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wide">Out of Stock</span>}
            </div>

            <h1 className="text-brand-cream text-2xl md:text-3xl font-bold leading-tight mb-3">{product.name}</h1>
            <div className="mb-4"><StarRating rating={product.rating} reviews={product.reviews} size="md" /></div>

            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-brand-cream font-black text-3xl">{formatPrice(product.price)}</span>
              {product.originalPrice && <span className="text-brand-muted text-lg line-through">${product.originalPrice.toFixed(2)}</span>}
              {discount && <span className="text-white text-sm font-bold">Save {formatPrice(product.originalPrice - product.price)}</span>}
            </div>
            <div className={`text-xs font-semibold uppercase tracking-wider mb-5 ${product.inStock ? 'text-green-400' : 'text-red-400'}`}>
              {product.inStock ? '● In Stock — Ready to Ship' : '● Out of Stock'}
            </div>

            {/* Color */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-brand-cream text-sm font-medium">Color {selectedColor && <span className="text-brand-muted font-normal">— {selectedColor}</span>}</label>
                {colorError && <span className="text-red-400 text-xs">Please select a color</span>}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors?.map(color => (
                  <button key={color} onClick={() => { setSelectedColor(color); setColorError(false); }}
                    className={`px-4 py-2 rounded-lg border text-sm transition-all duration-200 ${selectedColor === color ? 'border-white bg-white/10 text-white' : 'border-white/15 text-brand-muted hover:border-white/35 hover:text-brand-cream'}`}>
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mb-7">
              <div className="flex items-center justify-between mb-2">
                <label className="text-brand-cream text-sm font-medium">Size {selectedSize && <span className="text-brand-muted font-normal">— {selectedSize}</span>}</label>
                {sizeError && <span className="text-red-400 text-xs">Please select a size</span>}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes?.map(size => (
                  <button key={size} onClick={() => { setSelectedSize(size); setSizeError(false); }}
                    className={`min-w-[50px] px-3 py-2 rounded-lg border text-sm transition-all duration-200 font-medium ${selectedSize === size ? 'border-white bg-white/10 text-white' : 'border-white/15 text-brand-muted hover:border-white/35 hover:text-brand-cream'}`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-7">
              <button onClick={handleAddToCart} disabled={!product.inStock}
                className="flex-1 bg-black text-white font-semibold py-3.5 px-6 rounded-xl border border-white/20 hover:bg-white hover:text-black transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm">
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button onClick={() => setCartOpen(true)} className="px-6 py-3.5 border border-white/15 text-brand-cream rounded-xl hover:border-white/50 hover:text-white transition-all text-sm font-medium">
                View Cart
              </button>
            </div>

            <div className="border-t border-white/8 pt-5">
              <h3 className="text-brand-cream font-semibold text-sm mb-2">Product Details</h3>
              <p className="text-brand-muted text-sm leading-relaxed">{product.description}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {product.tags?.map(tag => (
                <span key={tag} className="bg-white/5 text-brand-muted text-[11px] px-2.5 py-1 rounded capitalize">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16 pt-12 border-t border-white/8">
            <h2 className="text-brand-cream font-bold text-2xl mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {related.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
