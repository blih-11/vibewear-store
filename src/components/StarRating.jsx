export default function StarRating({ rating, reviews, size = 'sm' }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const filled = i <= Math.floor(rating);
    const partial = !filled && i <= rating + 0.5;
    stars.push(
      <svg
        key={i}
        className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5'}
        viewBox="0 0 24 24"
        fill={filled ? 'currentColor' : partial ? 'url(#half)' : 'none'}
        stroke="currentColor"
        strokeWidth={1.5}
      >
        {partial && (
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
        )}
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <div className={`flex text-yellow-400 ${size === 'sm' ? 'gap-0.5' : 'gap-1'}`}>
        {stars}
      </div>
      {reviews !== undefined && (
        <span className="font-body text-brand-muted text-xs ml-1">({reviews})</span>
      )}
    </div>
  );
}
