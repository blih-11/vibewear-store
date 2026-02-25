import { useCart } from '../context/CartContext';

export default function ConfirmModal() {
  const { confirmItem, confirmAdd, cancelAdd } = useCart();
  if (!confirmItem) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-[80] flex items-center justify-center p-4">
      <div className="bg-brand-bg border border-white/12 rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-slide-up">
        <div className="flex items-center gap-4 mb-5">
          <img src={confirmItem.product.image} alt={confirmItem.product.name} className="w-16 h-20 object-cover rounded-lg flex-shrink-0" />
          <div>
            <h3 className="text-brand-cream font-bold text-sm leading-snug">{confirmItem.product.name}</h3>
            <p className="text-brand-muted text-xs mt-1">{confirmItem.size} · {confirmItem.color}</p>
            <p className="text-brand-accent font-bold mt-1">${confirmItem.product.price.toFixed(2)}</p>
          </div>
        </div>
        <p className="text-brand-muted text-sm mb-5">Add this item to your cart?</p>
        <div className="flex gap-3">
          <button onClick={cancelAdd} className="flex-1 border border-white/15 text-brand-cream font-medium py-3 rounded-xl hover:bg-white/5 transition-colors text-sm">Cancel</button>
          <button onClick={confirmAdd} className="flex-1 bg-black text-white font-semibold py-3 rounded-xl hover:bg-white hover:text-black border border-white/20 transition-all text-sm">Add to Cart</button>
        </div>
      </div>
    </div>
  );
}
