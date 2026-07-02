// pages/e-dimotikou/5-pollaplasia.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const LIMITS = {
  MULT_NUMBER_MIN: 2,
  MULT_NUMBER_MAX: 15,
  MULT_COUNT_TO_SHOW: 30
};

export default function PollaplasiaPage() {
  const [singleNumber, setSingleNumber] = useState(4);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Head>
        <title>🔢 Πολλαπλάσια Αριθμού - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      {/* NAVBAR */}
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/e-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">LearnMaths<span className="text-indigo-600">.gr</span></Link>
          <Link href="/e-dimotikou" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold transition">🔙 Επιστροφή</Link>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-black text-gray-900">🔢 Πολλαπλάσια Αριθμού</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Πολλαπλάσια ενός αριθμού είναι οι αριθμοί που προκύπτουν όταν τον πολλαπλασιάσουμε με το 0, το 1, το 2, το 3, το 4 κ.ο.κ.
          </p>
          
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6 text-center">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm max-w-xs mx-auto">
              <span className="font-bold text-gray-700 text-sm">Επιλογή Αριθμού:</span>
              <div className="flex justify-center items-center gap-4">
                <button onClick={() => setSingleNumber(Math.max(LIMITS.MULT_NUMBER_MIN, singleNumber - 1))} className="bg-blue-600 text-white w-8 h-8 rounded-full font-bold hover:bg-blue-700 transition shadow-sm">-</button>
                <span className="text-3xl font-black text-blue-600 w-10 text-center">{singleNumber}</span>
                <button onClick={() => setSingleNumber(Math.min(LIMITS.MULT_NUMBER_MAX, singleNumber + 1))} className="bg-blue-600 text-white w-8 h-8 rounded-full font-bold hover:bg-blue-700 transition shadow-sm">+</button>
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-10 gap-2">
              {Array.from({ length: LIMITS.MULT_COUNT_TO_SHOW }).map((_, i) => (
                <div key={i} className="bg-white p-3 rounded-lg border font-bold text-sm text-blue-800 shadow-sm flex flex-col justify-center items-center transition hover:border-blue-400 hover:shadow">
                  <span className="text-[9px] text-gray-400 font-normal">{singleNumber} × {i}</span>
                  <span className="text-base mt-0.5">{singleNumber * i}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
