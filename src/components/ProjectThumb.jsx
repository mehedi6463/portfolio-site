/**
 * Stylised browser mock-up used as a thumbnail until a real screenshot is supplied.
 * Each `layout` sketches a different kind of site so the grid doesn't look repetitive.
 */
const B = ({ className = '' }) => <div className={`rounded-[3px] bg-teal-200/20 ${className}`} />;
const A = ({ className = '' }) => <div className={`rounded-[3px] bg-teal-200/70 ${className}`} />;

const layouts = {
  business: (
    <>
      <div className="grid grid-cols-5 gap-2">
        <div className="col-span-3 space-y-1.5 pt-2">
          <A className="h-2.5 w-4/5" />
          <B className="h-2.5 w-3/5" />
          <B className="h-1.5 w-full" />
          <B className="h-1.5 w-4/5" />
          <A className="mt-2 h-3 w-1/3 rounded-full" />
        </div>
        <div className="col-span-2 h-20 rounded-md bg-gradient-to-br from-teal-500/60 to-teal-800" />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-1 rounded-md border border-teal-200/10 p-1.5">
            <A className="size-2.5 rounded-full" />
            <B className="h-1.5 w-full" />
            <B className="h-1.5 w-2/3" />
          </div>
        ))}
      </div>
    </>
  ),
  corporate: (
    <>
      <div className="flex h-16 flex-col items-center justify-center gap-1.5 rounded-md bg-gradient-to-r from-teal-800 to-teal-500/50">
        <A className="h-2.5 w-1/2" />
        <B className="h-1.5 w-1/3" />
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="space-y-1">
            <div className="h-8 rounded-md bg-teal-200/10" />
            <B className="h-1.5 w-full" />
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <B className="h-1.5 flex-1" />
        <B className="h-1.5 flex-1" />
      </div>
    </>
  ),
  portfolio: (
    <>
      <div className="flex items-center gap-2">
        <div className="size-8 rounded-full bg-gradient-to-br from-teal-200 to-teal-500" />
        <div className="flex-1 space-y-1">
          <A className="h-2 w-2/5" />
          <B className="h-1.5 w-3/5" />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1.5">
        <div className="row-span-2 rounded-md bg-teal-500/50" />
        <div className="h-10 rounded-md bg-teal-200/15" />
        <div className="h-10 rounded-md bg-teal-800" />
        <div className="h-10 rounded-md bg-teal-200/30" />
        <div className="h-10 rounded-md bg-teal-500/30" />
      </div>
    </>
  ),
  ecommerce: (
    <div className="grid grid-cols-4 gap-2">
      <div className="space-y-1.5 border-r border-teal-200/10 pr-2">
        <A className="h-1.5 w-3/4" />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="size-1.5 rounded-sm border border-teal-200/40" />
            <B className="h-1 flex-1" />
          </div>
        ))}
      </div>
      <div className="col-span-3 grid grid-cols-3 gap-1.5">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="space-y-1">
            <div className={`h-9 rounded-md ${i % 2 ? 'bg-teal-500/40' : 'bg-teal-200/15'}`} />
            <B className="h-1 w-full" />
            <A className="h-1 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  ),
  dashboard: (
    <div className="flex gap-2">
      <div className="w-8 space-y-1.5 rounded-md bg-teal-800/80 p-1.5">
        <A className="size-3 rounded-full" />
        {[0, 1, 2, 3].map((i) => (
          <B key={i} className="h-1.5 w-full" />
        ))}
      </div>
      <div className="flex-1 space-y-2">
        <div className="grid grid-cols-3 gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-1 rounded-md border border-teal-200/10 p-1.5">
              <B className="h-1 w-1/2" />
              <A className="h-2 w-3/4" />
            </div>
          ))}
        </div>
        <div className="flex h-14 items-end gap-1 rounded-md border border-teal-200/10 p-1.5">
          {[40, 65, 45, 80, 55, 90, 70, 60, 85].map((h, i) => (
            <div key={i} className="flex-1 rounded-sm bg-teal-200/50" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  ),
  landing: (
    <div className="flex flex-col items-center text-center">
      <B className="h-2 w-1/5 rounded-full" />
      <A className="mt-2 h-3 w-3/4" />
      <A className="mt-1.5 h-3 w-1/2" />
      <B className="mt-2 h-1.5 w-2/3" />
      <div className="mt-2.5 flex gap-1.5">
        <A className="h-3.5 w-12 rounded-full" />
        <div className="h-3.5 w-12 rounded-full border border-teal-200/40" />
      </div>
      <div className="mt-3 grid w-full grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col items-center gap-1 rounded-md bg-teal-200/5 p-1.5">
            <div className="size-3 rounded-md bg-teal-500" />
            <B className="h-1 w-full" />
          </div>
        ))}
      </div>
    </div>
  ),
};

export default function ProjectThumb({ layout = 'business', image, title }) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-teal-800 via-teal-950 to-[#061a23]">
      {image ? (
        <img
          src={image}
          alt={`Screenshot of ${title}`}
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <>
          <div className="bg-grid absolute inset-0 opacity-50" aria-hidden="true" />
          <div
            className="absolute inset-x-[9%] top-[14%] bottom-0 rounded-t-xl border border-b-0 border-teal-200/15 bg-[#0b2a38] shadow-2xl transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-2 group-hover:scale-[1.02]"
            aria-hidden="true"
          >
            <div className="flex items-center gap-1 border-b border-teal-200/10 px-3 py-2">
              <span className="size-1.5 rounded-full bg-teal-200/30" />
              <span className="size-1.5 rounded-full bg-teal-200/30" />
              <span className="size-1.5 rounded-full bg-teal-200/30" />
              <span className="ml-2 h-2 flex-1 rounded-full bg-teal-200/10" />
            </div>
            <div className="p-3">{layouts[layout]}</div>
          </div>
        </>
      )}
    </div>
  );
}
