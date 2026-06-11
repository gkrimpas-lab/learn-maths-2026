import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function BGymnasiou() {
  const [activeTab, setActiveTab] = useState('variables');
  
  // States για το διαδραστικό παράδειγμα της συνάρτησης y = ax
  const [alpha, setAlpha] = useState(2);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans scroll-smooth">
      <Head>
        <title>Β' Γυμνασίου: Μαθηματικά - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </Head>

      {/* NAVBAR */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black text-blue-600 tracking-tight">
            LearnMaths<span className="text-indigo-600">.gr</span>
          </Link>
          <Link href="/" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold transition">
            🏠 Αρχική
          </Link>
        </div>
      </nav>

      {/* HEADER */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-10 text-center shadow-inner">
        <h1 className="text-4xl font-black mb-2">📐 Μαθηματικά Β' Γυμνασίου</h1>
        <p className="text-indigo-100 opacity-90 font-medium">Συναρτήσεις, Εξισώσεις & Γεωμετρία</p>
      </header>

      {/* ΚΑΡΤΕΛΕΣ ΠΛΟΗΓΗΣΗΣ */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="flex flex-wrap bg-white p-2 rounded-xl shadow-sm gap-2 w-full lg:w-max border">
          <button 
            type="button"
            onClick={() => setActiveTab('variables')} 
            className={`px-4 py-2 text-center rounded-lg font-bold transition duration-200 text-xs sm:text-sm ${activeTab === 'variables' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            📊 1. Μεταβλητές
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('coordinates')} 
            className={`px-4 py-2 text-center rounded-lg font-bold transition duration-200 text-xs sm:text-sm ${activeTab === 'coordinates' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            📍 2. Καρτεσιανές Συντεταγμένες
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('function_linear')} 
            className={`px-4 py-2 text-center rounded-lg font-bold transition duration-200 text-xs sm:text-sm ${activeTab === 'function_linear' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            📈 3. Η Συνάρτηση y = αx
          </button>
        </div>
      </div>

      {/* ΚΥΡΙΩΣ ΠΕΡΙΕΧΟΜΕΝΟ */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* ΚΑΡΤΕΛΑ 1: ΜΕΤΑΒΛΗΤΕΣ */}
        {activeTab === 'variables' && (
          <div className="space-y-6 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
            <h2 className="text-2xl font-black text-gray-900">📊 Έννοια της Μεταβλητής</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              Στα Μαθηματικά, χρησιμοποιούμε γράμματα (όπως το $x, y, t$) για να παραστήσουμε ποσότητες που μπορούν να αλλάξουν τιμές. Αυτά τα γράμματα ονομάζονται <strong>μεταβλητές</strong>.
            </p>
          </div>
        )}

        {/* ΚΑΡΤΕΛΑ 2: ΣΥΝΤΕΤΑΓΜΕΝΕΣ */}
        {activeTab === 'coordinates' && (
          <div className="space-y-6 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
            <h2 className="text-2xl font-black text-gray-900">📍 Καρτεσιανό Σύστημα Συντεταγμένων</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              Το επίπεδο ορίζεται από δύο κάθετους άξονες: τον οριζόντιο άξονα των τετμημένων ($x'x$) και τον κατακόρυφο άξονα των τεταγμένων ($y'y$).
            </p>
          </div>
        )}

        {/* 📈 ΚΑΡΤΕΛΑ 3: Η ΣΥΝΑΡΤΗΣΗ y = αx */}
        {activeTab === 'function_linear' && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
            
            {/* ΤΙΤΛΟΣ & ΕΙΣΑΓΩΓΗ */}
            <div>
              <h2 className="text-2xl font-black text-indigo-950 flex items-center gap-2">📈 Η Συνάρτηση $y = \alpha x$</h2>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Η συνάρτηση αυτή εκφράζει τη σχέση ανάμεσα σε δύο **ανάλογα ποσά**. Όταν μεταβάλλεται το ποσό $x$, το ποσό $y$ μεταβάλλεται με τέτοιο τρόπο ώστε ο λόγος τους $\frac{y}{x}$ να παραμένει πάντα σταθερός και ίσος με $\alpha$.
              </p>
            </div>

            {/* ΘΕΩΡΙΑ & ΙΔΙΟΤΗΤΕΣ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-5 rounded-2xl border border-indigo-100 space-y-3">
                <h3 className="font-black text-sm text-indigo-900 uppercase tracking-wide">💡 Βασικές Έννοιες</h3>
                <ul className="text-xs text-slate-700 space-y-2.5 list-none pl-0">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">&bull;</span>
                    <span>Ο αριθμός <strong>$\alpha$</strong> ονομάζεται <strong>συντελεστής αναλογίας</strong> και είναι πάντα σταθερός ($\alpha \neq 0$).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">&bull;</span>
                    <span>Ο συντελεστής $\alpha$ καθορίζει την <strong>κλίση</strong> της ευθείας (πόσο απότομα ανεβαίνει ή κατεβαίνει).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">&bull;</span>
                    <span>Αν διπλασιάσουμε το $x$, τότε διπλασιάζεται και το $y$. Αν τριπλασιάσουμε το $x$, τριπλασιάζεται και το $y$.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-900 text-white p-5 rounded-2xl border shadow-md space-y-3">
                <h3 className="font-black text-sm text-amber-400 uppercase tracking-wide">📐 Η Γραφική Παράσταση</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Η γραφική παράσταση της συνάρτησης $y = \alpha x$ είναι πάντα μια <strong>ευθεία γραμμή</strong> η οποία:
                </p>
                <div className="text-xs space-y-2 font-mono text-amber-200">
                  <div className="bg-slate-800/80 p-2 rounded border border-slate-700">
                    📍 Διέρχεται πάντα από την <strong>αρχή των αξόνων $O(0,0)$</strong>.
                  </div>
                  {/* 🔴 ΔΙΟΡΘΩΘΗΚΕ: Χρήση του &gt; αντί για σκέτο > */}
                  <div className="bg-slate-800/80 p-2 rounded border border-slate-700">
                    📈 Αν <strong>$\alpha$ &gt; 0</strong>, η ευθεία βρίσκεται στο 1ο και 3ο τεταρτημόριο (ανηφορική).
                  </div>
                  {/* 🔴 ΔΙΟΡΘΩΘΗΚΕ: Χρήση του &lt; αντί για σκέτο < */}
                  <div className="bg-slate-800/80 p-2 rounded border border-slate-700">
                    📉 Αν <strong>$\alpha$ &lt; 0</strong>, η ευθεία βρίσκεται στο 2ο και 4ο τεταρτημόριο (κατηφορική).
                  </div>
                </div>
              </div>
            </div>

            {/* ΔΙΑΔΡΑΣΤΙΚΟ ΠΑΡΑΔΕΙΓΜΑ ΜΕ SLIDER */}
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200 space-y-6">
              <h3 className="font-black text-base text-slate-800 text-center">🎮 Πειραματίσου με την κλίση της ευθείας</h3>
              <p className="text-xs text-slate-500 text-center">Σύρε τη μπάρα για να αλλάξεις την τιμή του $\alpha$ και δες πώς αλλάζει η συνάρτηση!</p>
              
              {/* Slider για το α */}
              <div className="bg-white p-4 rounded-xl border max-w-md mx-auto space-y-2 shadow-sm">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>Μεταβολή του συντελεστή $\alpha$:</span>
                  <span className="font-mono bg-indigo-50 text-indigo-700 px-3 py-1 rounded border border-indigo-200 font-black text-sm">α = {alpha}</span>
                </div>
                <input 
                  type="range" min="-5" max="5" step="1" value={alpha}
                  onChange={(e) => setAlpha(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Live Τύπος & Πίνακας Τιμών */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center max-w-3xl mx-auto">
                
                {/* Εξίσωση */}
                <div className="bg-white p-5 rounded-2xl border text-center space-y-2 shadow-sm">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Ο Τύπος σου</span>
                  <div className="text-3xl font-mono font-black text-indigo-600">
                    {alpha === 0 ? 'y = 0' : `y = ${alpha}x`}
                  </div>
                  <span className="text-xs text-slate-500 block italic">
                    {alpha > 0 && '📈 Η ευθεία ανεβαίνει προς τα δεξιά'}
                    {alpha < 0 && '📉 Η ευθεία κατεβαίνει προς τα δεξιά'}
                    {alpha === 0 && '🛑 Η ευθεία συμπίπτει με τον οριζόντιο άξονα x\'x'}
                  </span>
                </div>

                {/* Πίνακας Τιμών */}
                <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                  <table className="w-full text-center text-xs font-mono">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b">
                        <th className="py-2.5 border-r">x</th>
                        <th className="py-2.5 border-r">-2</th>
                        <th className="py-2.5 border-r">-1</th>
                        <th className="py-2.5 border-r">0</th>
                        <th className="py-2.5 border-r">1</th>
                        <th className="py-2.5">2</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-slate-800 font-bold">
                        <td className="py-2.5 bg-slate-50 border-r text-indigo-600">y</td>
                        <td className="py-2.5 border-r">{-2 * alpha}</td>
                        <td className="py-2.5 border-r">{-1 * alpha}</td>
                        <td className="py-2.5 border-r text-red-500 font-black">0</td>
                        <td className="py-2.5 border-r">{1 * alpha}</td>
                        <td className="py-2.5">{2 * alpha}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="p-2 bg-slate-50 text-[10px] text-center text-slate-400 border-t font-sans">
                    Κάθε ζευγάρι (x, y) σχηματίζει ένα σημείο της ευθείας, π.χ. (1, {alpha}).
                  </div>
                </div>

              </div>
            </div>

            {/* ΠΡΑΚΤΙΚΟ ΠΑΡΑΔΕΙΓΜΑ ΑΠΟ ΤΗ ΖΩΗ */}
            <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200 space-y-2">
              <h4 className="font-black text-xs text-amber-900 uppercase tracking-wide flex items-center gap-1">🚗 Παράδειγμα από την καθημερινότητα</h4>
              <p className="text-xs text-amber-950 leading-relaxed">
                Φαντάσου ένα αυτοκίνητο που κινείται σε έναν αυτοκινητόδρομο με σταθερή ταχύτητα <strong>$100\text{ km/h}$</strong>. 
                Η συνάρτηση που μας δείχνει την απόσταση ($y$) που διανύει ανάλογα με τις ώρες ($x$) είναι η: <span className="font-mono font-bold text-sm text-indigo-700 bg-white px-1.5 py-0.5 rounded border">y = 100x</span>.
              </p>
              <p className="text-xs text-amber-900 italic">
                Σε 1 ώρα ($x=1$) θα έχει διανύσει $100\text{ km}$. Σε 2 ώρες ($x=2$) θα έχει διανύσει $200\text{ km}$ κ.ο.κ. Ο λόγος της απόστασης προς το χρόνο είναι πάντα σταθερός και ίσος με την ταχύτητα ($100$).
              </p>
            </div>

          </div>
        )}

      </main>

      <footer className="bg-gray-800 text-gray-400 py-8 text-center text-sm mt-12">
        <p>© {new Date().getFullYear()} LearnMaths.gr. Σχεδιασμένο για τη Β' Γυμνασίου.</p>
      </footer>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
}
