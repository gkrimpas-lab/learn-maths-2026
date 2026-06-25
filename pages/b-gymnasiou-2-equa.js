import Head from 'next/head';
import Link from 'next/link';

export default function BGymnasiouEquationsPlaceholder() {
  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans p-4 md:p-8 flex items-center justify-center">
      <Head>
        <title>2. Η Εξίσωση - Β' Γυμνασίου</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center space-y-6">
        <div className="text-4xl">⚖️</div>
        <h2 className="text-xl font-black text-slate-900">2. Η Εξίσωση (x + α = β)</h2>
        <p className="text-slate-500 text-sm leading-relaxed">
          Το περιεχόμενο αυτής της ενότητας θα προστεθεί σύντομα!
        </p>
        
        <div className="pt-2">
          <Link href="/b-gymnasiou" className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-xl shadow transition">
            &larr; Επιστροφή στον Πίνακα Μαθημάτων
          </Link>
        </div>
      </div>
    </div>
  );
}
