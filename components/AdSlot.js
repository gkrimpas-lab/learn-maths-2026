import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

// Ρύθμιση ενεργοποίησης διαφημίσεων
const ADS_ENABLED = false;
const AD_CLIENT_ID = 'ca-pub-XXXXXXXXXXXXXXXX'; // Συμπλήρωσε το επίσημο AdSense Publisher ID

export default function AdSlot({ slotId, format = 'horizontal' }) {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const adPushedRef = useRef(false);

  useEffect(() => {
    if (!ADS_ENABLED || typeof window === 'undefined') return;

    // Αποφυγή διπλού push στο ίδιο instance
    if (!adPushedRef.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        adPushedRef.current = true;
      } catch (err) {
        console.error('AdSense push error:', err);
      }
    }
  }, []);

  if (!ADS_ENABLED) {
    return null;
  }

  // Δέσμευση σταθερού χώρου ανά τύπο format για μηδενικό CLS
  const isHorizontal = format === 'horizontal';
  const containerClasses = isHorizontal
    ? 'w-full max-w-5xl min-h-[90px] sm:min-h-[100px]'
    : 'w-full max-w-md min-h-[250px]';

  return (
    <div className="w-full flex justify-center items-center my-4 overflow-hidden" aria-hidden="true">
      <div
        className={`${containerClasses} bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col items-center justify-center p-2 text-center transition-all`}
      >
        <span className="uppercase tracking-widest text-[9px] font-bold text-slate-400 mb-1">
          {locale === 'en' ? 'Advertisement' : 'Διαφήμιση'}
        </span>
        <ins
          className="adsbygoogle w-full block"
          style={{ display: 'block' }}
          data-ad-client={AD_CLIENT_ID}
          data-ad-slot={slotId}
          data-ad-format={isHorizontal ? 'horizontal' : 'rectangle'}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}