// pages/e-dimotikou/7-diairetes.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const LIMITS = {
  DIV_NUMBER_MIN: 2,
  DIV_NUMBER_MAX: 100
};

export default function DiairetesPage() {
  const [divSingleNumber, setDivSingleNumber] = useState(24);

  // Συνάρτηση εύρεσης όλων των διαιρετών ενός αριθμού
  const getDivisors = (num) => {
    const divisors = [];
    for (let i = 1; i <= num; i++) {
      if (num % i === 0) divisors.push(i);
    }
    return divisors;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Head>
        <title>🛡️ Διαιρέτες ενός Αριθμού - LearnMaths.gr</title>
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
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-black text-gray-900">🛡️ Διαιρέτες ενός Αριθμού</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Διαιρέτες ενός φυσικού αριθμού ονομάζονται όλοι οι μικρότεροι ή ίσοι φυσικοί αριθμοί με τους οποίους αν διαιρέσουμε τον αρχικό αριθμό, η διαίρεση είναι <strong>τέλεια</strong> (δηλαδή το υπόλοιπο είναι 0).
          </p>
          
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm max-w-xs mx-auto">
              <span className="font-bold text-gray-700 text-sm">Επιλογή Αριθμού:</span>
              <div className="flex items-center gap-3">
                <button onClick={() => setDivSingleNumber(Math.max(LIMITS.DIV_NUMBER_MIN, divSingleNumber - 1))} className="bg-indigo-500 text-white w-8 h-8 rounded-full font-bold hover:bg-indigo-600 transition shadow-sm">-</button>
                <span className="text-2xl font-black text-indigo-600 w-10 text-center">{divSingleNumber}</span>
                <button onClick={() => setDivSingleNumber(Math.min(LIMITS.DIV_NUMBER_MAX, divSingleNumber + 1))} className="bg-indigo-500 text-white w-8 h-8 rounded-full font-bold hover:bg-indigo-600 transition shadow-sm">+</button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm text-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-4">Οι διαιρέτες του {divSingleNumber}:</span>
              <div className="flex flex-wrap justify-center gap-2">
                {getDivisors(divSingleNumber).map((d) => (
                  <div key={d} className="bg-indigo-50 text-indigo-900 border border-indigo-200 font-black text-xl p-3 px-5 rounded-xl shadow-sm transition transform hover:scale-105 hover:bg-indigo-100">
                    {d}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
