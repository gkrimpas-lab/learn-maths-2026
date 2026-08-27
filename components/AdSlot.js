import { useEffect } from 'react';

// Ρύθμιση ενεργοποίησης διαφημίσεων (προς το παρόν false)
const ADS_ENABLED = false;

export default function AdSlot({ slotId, format = 'horizontal' }) {
  useEffect(() => {
    if (ADS_ENABLED && typeof window !== 'undefined') {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }
  }, []);

  if (!ADS_ENABLED) {
    return null; // Δεν πιάνει καθόλου χώρο
  }

  return (
    <div className="w-full flex justify-center items-center my-4 overflow-hidden">
      <div
        className={`w-full bg-slate-100/60 border border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center p-2 min-h-[60px] sm:min-h-[90px] ${
          format === 'horizontal' ? 'max-w-5xl' : 'max-w-md'
        }`}
      >
        <span className="uppercase tracking-widest text-[9px] text-slate-400 mb-1">Διαφήμιση</span>
        <ins
          className="adsbygoogle w-full block text-center"
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Μελλοντικό ID
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
