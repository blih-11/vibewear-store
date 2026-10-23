import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { optimizeImage } from '../lib/optimizeImage';

// Opens from a "Curated For You" card. Shows every piece in the fit with its own
// price, a checkbox (so a shopper can skip a piece) and a size picker (required
// per checked piece). Adds each checked piece to the cart as its own normal line
// item — so stock, pricing and the server-side order pricing all work exactly as
// they do for individually-bought products.
export default function FitQuickAddModal({ fit, onClose, onAdded }) {
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  const items = fit.items || [];
  const [checked, setChecked] = useState(() => Object.fromEntries(items.map(i => [i._id, i.inStock !== false])));
  const [sizes, setSizes] = useState({});
  const [errors, setErrors] = useState({});

  const chosen = items.filter(i => checked[i._id]);
  const total = chosen.reduce((s, i) => s + i.price, 0);

  const handleAdd = () => {
    const newErrors = {};
    chosen.forEach(i => {
      if (i.sizes?.length > 0 && !sizes[i._id]) newErrors[i._id] = true;
    });
    setErrors(newErrors);
    if (chosen.length === 0 || Object.keys(newErrors).length > 0) return;

    chosen.forEach(i => addToCart(i, sizes[i._id] || null, null, 1));
    onAdded({
      name: fit.name,
      lines: chosen.map(i => ({ name: i.name, size: sizes[i._id] || null, price: i.price })),
      total,
    });
  };

  return (
    <div className="fixed inset-0 z-[90] bg-black/60 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-lg max-h-[92vh] overflow-auto sm:rounded-2xl rounded-t-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="text-black font-bold text-sm uppercase tracking-wide">{fit.name}</h3>
          <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-black text-2xl leading-none">×</button>
        </div>

        <div className="bg-[#f8f8f8]">
          <img src={optimizeImage(fit.image, { width: 900 })} alt={fit.name} className="w-full max-h-72 object-contain" />
        </div>

        <div className="px-5 py-4 space-y-4">
          {items.map(i => {
            const out = i.inStock === false;
            const on = !!checked[i._id];
            return (
              <div key={i._id} className={out ? 'opacity-50' : ''}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={on} disabled={out}
                    onChange={e => setChecked(c => ({ ...c, [i._id]: e.target.checked }))}
                    className="w-4 h-4 accent-black" />
                  <img src={optimizeImage(i.image, { width: 120 })} alt="" className="w-12 h-14 object-contain bg-[#f8f8f8] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-black text-sm font-medium truncate">{i.name}</p>
                    <p className="text-gray-500 text-xs">{out ? 'Out of stock' : formatPrice(i.price)}</p>
                  </div>
                </label>

                {on && i.sizes?.length > 0 && (
                  <div className="mt-2 ml-7">
                    <div className="flex flex-wrap gap-2">
                      {i.sizes.map(s => (
                        <button key={s} type="button"
                          onClick={() => { setSizes(p => ({ ...p, [i._id]: s })); setErrors(p => ({ ...p, [i._id]: false })); }}
                          className={`min-w-[40px] px-2 py-1.5 text-xs border ${sizes[i._id] === s ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black'}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                    {errors[i._id] && <p className="text-red-500 text-[11px] mt-1">Select a size</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="px-5 py-4 border-t border-gray-100 sticky bottom-0 bg-white">
          <div className="flex justify-between text-sm mb-3">
            <span className="text-gray-500">{chosen.length} item{chosen.length === 1 ? '' : 's'}</span>
            <span className="text-black font-bold">{formatPrice(total)}</span>
          </div>
          <button onClick={handleAdd} disabled={chosen.length === 0}
            className="w-full bg-black text-white py-3.5 text-sm font-bold uppercase tracking-widest disabled:opacity-40">
            Add {chosen.length === items.length ? 'Fit' : 'Selected'} to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
