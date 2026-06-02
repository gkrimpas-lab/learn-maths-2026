import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  // Κατάσταση για το αν είναι ανοιχτό το παράθυρο των κλασμάτων
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Κατάσταση για τον διαδραστικό προσομοιωτή κλασμάτων
  const [numerator, setNumerator] = useState(3);
  const [denominator, setDenominator] = useState(4);

  // Συνάρτηση που σχεδιάζει τα κομμάτια της πίτας (SVG Paths)
  const renderPieSlices = (pieIndex, totalSlicesToColor) => {
    const slices = [];
    const radius = 50;
    const cx = 60;
    const cy = 60;

    for (let i = 0; i < denominator; i++) {
      // Υπολογισμός γωνιών για κάθε κομμάτι
      const startAngle = (i * 360) / denominator - 90;
      const endAngle = ((i + 1) * 360) / denominator - 90;

      const x1 = cx + radius * Math.cos((startAngle * Math.PI) / 180);
      const y1 = cy + radius * Math.sin((startAngle * Math.PI) / 180);
      const x2 = cx + radius * Math.cos((endAngle * Math.PI) / 180);
      const y2 = cy + radius * Math.sin((endAngle * Math.PI) / 180);

      // Έλεγχος αν το συγκεκριμένο κομμάτι πρέπει να χρωματιστεί
      const currentSliceNumber = pieIndex * denominator + i;
      const isColored = currentSliceNumber < totalSlicesToColor;

      // Αν ο παρονομαστής είναι 1, σχεδιάζουμε ολόκληρο κύκλο
      if (denominator === 1) {
        slices.push(
          <circle 
            key={i} cx={cx} cy={cy} r={radius} 
            className={`${isColored ? 'fill-orange-500' : 'fill-gray-200'} stroke-white stroke-2`} 
          />
        );
        continue;
      }

      const largeArcFlag = 360 / denominator > 180 ? 1 : 0;
      const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

      slices.push(
        <path
          key={i}
          d={pathData}
          className={`${isColored ? 'fill-orange-500' : 'fill-gray-100'} stroke-blue-600 stroke-[1.5] transition-colors duration-200`}
        />
      );
    }
    return slices;
  };

  // Υπολογισμός πόσες πίτες χρειαζόμαστε συνολικά
  const totalPiesNeeded = Math.max(1, Math.ceil(numerator / denominator));

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans scroll-smooth">
      <Head>
        <title>LearnMaths.gr - Τα Μαθηματικά Αλλιώς</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <meta name="description" content="Η σύγχρονη πλατφόρμα εκμάθησης Μαθηματικών για το Δημοτικό, το Γυμνάσιο και τα Πρότυπα Σχολεία" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* NAVBAR */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-2xl font-black text-blue-600 tracking-tight">
            LearnMaths<span className="text-indigo-600">.gr</span>
          </div>
          <div className="flex items-center gap-6 font-medium">
            <a href="#demotiko" className="hover:text-blue-600 transition">Δημοτικό</a>
            <a href="#gymnasio" className="hover:text-indigo-600 transition">Γυμνάσιο</a>
            <a href="#protypa" className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition duration-300">
              🎯 Εισαγωγή σε Πρότυπα
            </a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="bg-gradient-to-r py-16 text-center text-white from-blue-600 to-indigo-700 shadow-lg">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">LearnMaths.gr</h1>
          <p className="text-xl font-light opacity-90 mb-8">
            Μάθε τα Μαθηματικά εύκολα, γρήγορα και διαδραστικά από το Δημοτικό έως το Γυμνάσιο!
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <a href="#demotiko" className="bg-white text-blue-700 px-6 py-3 rounded-full font-bold shadow-md hover:bg-gray-100 transition duration-300">
              Δημοτικό 🎒
            </a>
            <a href="#gymnasio" className="bg-indigo-500 text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-indigo-600 transition duration-300 border border-indigo-400">
              Γυμνάσιο 📐
            </a>
          </div>

          {/* GOOGLE PLAY STORE BADGE */}
          <div className="flex flex-col items-center justify-center mt-4">
            <p className="text-xs font-semibold opacity-75 mb-2 uppercase tracking-wider">Κατεβάστε την εφαρμογή</p>
            <a href="https://play.google.com/store/apps/details?id=com.gkrimpas.learn_maths&pcampaignid=web_share" target="_blank" rel="noopener noreferrer" className="inline-block transform hover:scale-105 transition duration-300">
              <img src="https://play.google.com/intl/en_us/badges/static/images/badges/el_badge_web_generic.png" alt="Get it on Google Play" className="w-48 h-auto mx-auto" />
            </a>
          </div>
        </div>
      </header>

      {/* ΕΝΟΤΗΤΑ ΠΡΟΤΥΠΩΝ ΣΧΟΛΕΙΩΝ */}
      <section id="protypa" className="py-16 bg-amber-50 border-b border-amber-200">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-block bg-amber-200 text-amber-800 font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wide mb-3">Ειδική Προετοιμασία</div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">🎯 Εισαγωγή στα Πρότυπα Σχολεία</h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto mb-12">
            Κάνε τη μετάβαση από την ΣΤ' Δημοτικού στην Α' Γυμνασίου με απόλυτη επιτυχία! Κατέβασε συγκεντρωμένα όλα τα θέματα και τις επίσημες απαντήσεις προηγούμενων ετών.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-200 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <span className="text-2xl mb-3 block">📚</span>
                <h4 className="font-bold text-gray-900 mb-2 text-base leading-tight">Μαθηματικά & Γλώσσα</h4>
                <p className="text-gray-500 text-xs mb-4">Θέματα εξετάσεων μαζί για τα έτη 2020 έως και 2025.</p>
              </div>
              <a href="/protypa_2020_2025.pdf" download className="w-full text-center bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-xl text-xs font-bold transition shadow-sm">📥 Λήψη Αρχείου (PDF)</a>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-200 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <span className="text-2xl mb-3 block">📐</span>
                <h4 className="font-bold text-gray-900 mb-2 text-base leading-tight">Μαθηματικά</h4>
                <p className="text-gray-500 text-xs mb-4">Ξεχωριστά όλα τα θέματα Μαθηματικών από το 2016 έως και το 2019.</p>
              </div>
              <a href="/maths_2016_2019.pdf" download className="w-full text-center bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-xl text-xs font-bold transition shadow-sm">📥 Λήψη Αρχείου (PDF)</a>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-200 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <span className="text-2xl mb-3 block">✍️</span>
                <h4 className="font-bold text-gray-900 mb-2 text-base leading-tight">Νεοελληνική Γλώσσα</h4>
                <p className="text-gray-500 text-xs mb-4">Ξεχωριστά όλα τα θέματα της Γλώσσας από το 2016 έως και το 2019.</p>
              </div>
              <a href="/glossa_2016_2019.pdf" download className="w-full text-center bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-xl text-xs font-bold transition shadow-sm">📥 Λήψη Αρχείου (PDF)</a>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-emerald-400 bg-emerald-50/30 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <span className="text-2xl mb-3 block">✅</span>
                <h4 className="font-bold text-emerald-900 mb-2 text-base leading-tight">Απαντήσεις Θεμάτων</h4>
                <p className="text-emerald-700 text-xs mb-4">Ένα ενιαίο αρχείο με τις απαντήσεις για όλα τα έτη (2016 έως 2025).</p>
              </div>
              <a href="/apanteseis_2016_2025.pdf" download className="w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold transition shadow-sm">📥 Λήψη Απαντήσεων</a>
            </div>
          </div>
        </div>
      </section>

      {/* ΔΗΜΟΤΙΚΟ SECTION */}
      <section id="demotiko" className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2 text-blue-600">🎒 Μαθηματικά Δημοτικού</h2>
          <p className="text-center text-gray-500 mb-10">Χτίζουμε γερές βάσεις για το μέλλον</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200">
              <div className="bg-teal-500 py-4 text-center text-white font-bold text-xl">Δ' Δημοτικού</div>
              <div className="p-6 text-center">
                <p className="text-gray-600 mb-6 text-sm">Μεγάροι αριθμοί, γεωμετρικά σχήματα & βασικές πράξεις.</p>
                <button className="w-full bg-teal-500 text-white py-2 rounded-lg font-medium opacity-60 cursor-not-allowed">Σύντομα Διαθέσιμο</button>
              </div>
            </div>

            {/* Ε' ΔΗΜΟΤΙΚΟΥ - ΔΙΑΔΡΑΣΤΙΚΗ ΚΑΡΤΕΛΑ */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl border-2 border-cyan-400 transform scale-105 duration-300">
              <div className="bg-cyan-500 py-4 text-center text-white font-bold text-xl flex items-center justify-center gap-2">
                Ε' Δημοτικού ⭐
              </div>
              <div className="p-6 text-center">
                <p className="text-gray-800 font-semibold mb-2 text-sm">Ενότητα: Κλάσματα</p>
                <p className="text-gray-500 mb-6 text-xs">Μάθε τι είναι ο αριθμητής και ο παρονομαστής με τον διαδραστικό προσομοιωτή πίτας!</p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-cyan-500 text-white py-2 rounded-lg font-bold hover:bg-cyan-600 transition shadow-md"
                >
                  🚀 Είσοδος στην Τάξη
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200">
              <div className="bg-blue-500 py-4 text-center text-white font-bold text-xl">ΣΤ' Δημοτικού</div>
              <div className="p-6 text-center">
                <p className="text-gray-600 mb-6 text-sm">Ανάλογα ποσά, εξισώσεις, κλίμακες & προετοιμασία για το Γυμνάσιο.</p>
                <button className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium opacity-60 cursor-not-allowed">Σύντομα Διαθέσιμο</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ΓΥΜΝΑΣΙΟΥ SECTION */}
      <section id="gymnasio" className="py-16 bg-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2 text-indigo-600">📐 Μαθηματικά Γυμνασίου</h2>
          <p className="text-center text-gray-500 mb-10">Εμβαθύνουμε στην άλγεβρα και τη γεωμετρία</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200">
              <div className="bg-indigo-500 py-4 text-center text-white font-bold text-xl">Α' Γυμνασίου</div>
              <div className="p-6 text-center">
                <p className="text-gray-600 mb-6 text-sm">Κλάσματα, Εξισώσεις, Ποσοστά & βασική Γεωμετρία.</p>
                <button className="w-full bg-indigo-500 text-white py-2 rounded-lg font-medium opacity-60 cursor-not-allowed">Σύντομα Διαθέσιμο</button>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200">
              <div className="bg-violet-500 py-4 text-center text-white font-bold text-xl">Β' Γυμνασίου</div>
              <div className="p-6 text-center">
                <p className="text-gray-600 mb-6 text-sm">Ρητοί Αριθμοί, Συναρτήσεις, Πυθαγόρειο Θεώρημα.</p>
                <button className="w-full bg-violet-500 text-white py-2 rounded-lg font-medium opacity-60 cursor-not-allowed">Σύντομα Διαθέσιμο</button>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200">
              <div className="bg-purple-500 py-4 text-center text-white font-bold text-xl">Γ' Γυμνασίου</div>
              <div className="p-6 text-center">
                <p className="text-gray-600 mb-6 text-sm">Αλγεβρικές Παραστάσεις, Μονώνυμα, Ταυτότητες & Ομοιότητα.</p>
                <button className="w-full bg-purple-500 text-white py-2 rounded-lg font-medium opacity-60 cursor-not-allowed">Σύντομα Διαθέσιμο</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL (ΑΝΑΔΥΟΜΕΝΟ ΠΑΡΑΘΥΡΟ) ΓΙΑ ΤΑ ΚΛΑΣΜΑΤΑ Ε' ΔΗΜΟΤΙΚΟΥ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col">
            
            {/* ΚΕΦΑΛΙΔΑ MODAL */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-2xl font-black text-cyan-600">🎒 Ε' Δημοτικού: Μαθαίνω τα Κλάσματα</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 font-bold p-2 px-4 rounded-full text-sm transition"
              >
                Κλείσιμο ✕
              </button>
            </div>

            {/* ΠΕΡΙΕΧΟΜΕΝΟ MODAL */}
            <div className="p-6 space-y-8 flex-1">
              
              {/* ΜΕΡΟΣ 1: ΘΕΩΡΙΑ & ΨΗΦΙΑΚΗ ΚΑΡΤΑ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-3 text-sm leading-relaxed text-gray-600">
                  <h4 className="text-lg font-bold text-gray-900">Τι είναι το Κλάσμα;</h4>
                  <p>
                    Κλάσμα είναι ένας αριθμός που μας δείχνει **σε πόσα ίσα μέρη** έχουμε χωρίσει μια μονάδα (π.χ. μια πίτσα ή μια σοκολάτα) και **πόσα από αυτά τα μέρη** έχουμε πάρει.
                  </p>
                  <ul className="space-y-1 bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs">
                    <li>🔹 <strong>Παρονομαστής (κάτω):</strong> Σε πόσα ίσα μέρη χωρίσαμε το όλο.</li>
                    <li>🔹 <strong>Αριθμητής (πάνω):</strong> Πόσα κομμάτια πήραμε ή χρωματίσαμε.</li>
                  </ul>
                </div>

                {/* ΣΥΝΟΠΤΙΚΗ ΟΠΤΙΚΗ ΚΑΡΤΑ ΘΕΩΡΙΑΣ */}
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-6 rounded-2xl shadow-md text-center border-b-4 border-blue-700">
                  <span className="text-xs uppercase font-bold tracking-wider opacity-75 block mb-2">Συνοπτική Θεωρία</span>
                  <div className="inline-flex flex-col items-center font-black text-3xl my-2">
                    <div className="text-amber-300 tracking-wide pb-1">Αριθμητής</div>
                    <div className="w-32 h-1 bg-white rounded-full my-1"></div>
                    <div className="text-white tracking-wide pt-1">Παρονομαστής</div>
                  </div>
                  <div className="text-xs space-y-1 opacity-90 mt-4 text-left border-t border-white/20 pt-3">
                    <p>☝️ <strong>Αριθμητής:</strong> Δείχνει τα κομμάτια που έχω.</p>
                    <p>👇 <strong>Παρονομαστής:</strong> Δείχνει τα συνολικά κομμάτια.</p>
                  </div>
                </div>
              </div>

              {/* ΜΕΡΟΣ 2: ΔΙΑΔΡΑΣΤΙΚΟΣ ΠΡΟΣΟΜΟΙΩΤΗΣ (ΠΙΤΑ) */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h4 className="text-lg font-bold text-slate-800 text-center mb-4">🍕 Παίξε με το Κλάσμα & Δες την Πίτα!</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  
                  {/* ΧΕΙΡΙΣΤΗΡΙΑ ΑΛΛΑΓΗΣ ΑΡΙΘΜΩΝ */}
                  <div className="flex flex-col items-center justify-center space-y-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    {/* ΕΠΙΛΟΓΕΑΣ ΑΡΙΘΜΗΤΗ */}
                    <div className="flex items-center gap-4">
                      <span className="w-24 text-right text-xs font-bold text-gray-500">Αριθμητής:</span>
                      <button 
                        onClick={() => setNumerator(Math.max(1, numerator - 1))}
                        className="bg-red-500 text-white w-8 h-8 rounded-full font-bold hover:bg-red-600 transition"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xl font-black text-red-600">{numerator}</span>
                      <button 
                        onClick={() => setNumerator(Math.min(20, numerator + 1))}
                        className="bg-green-500 text-white w-8 h-8 rounded-full font-bold hover:bg-green-600 transition"
                      >
                        +
                      </button>
                    </div>

                    {/* ΚΛΑΣΜΑΤΙΚΗ ΓΡΑΜΜΗ */}
                    <div className="w-40 h-1 bg-slate-300 rounded-full"></div>

                    {/* ΕΠΙΛΟΓΕΑΣ ΠΑΡΟΝΟΜΑΣΤΗ */}
                    <div className="flex items-center gap-4">
                      <span className="w-24 text-right text-xs font-bold text-gray-500">Παρονομαστής:</span>
                      <button 
                        onClick={() => {
                          const newDen = Math.max(1, denominator - 1);
                          setDenominator(newDen);
                        }}
                        className="bg-red-500 text-white w-8 h-8 rounded-full font-bold hover:bg-red-600 transition"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xl font-black text-blue-600">{denominator}</span>
                      <button 
                        onClick={() => setDenominator(Math.min(12, denominator + 1))}
                        className="bg-green-500 text-white w-8 h-8 rounded-full font-bold hover:bg-green-600 transition"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-center mt-2">
                      <span className="text-xs text-gray-400 block">Τύπος Κλάσματος:</span>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${numerator > denominator ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                        {numerator === denominator ? 'Ίσο με τη Μονάδα' : numerator > denominator ? 'Καταχρηστικό (>1)' : 'Γνήσιο (<1)'}
                      </span>
                    </div>
                  </div>

                  {/* ΔΥΝΑΜΙΚΗ ΣΧΕΔΙΑΣΗ ΠΙΤΩΝ (SVG) */}
                  <div className="flex flex-wrap justify-center gap-6 p-4 bg-white rounded-xl border border-slate-200 shadow-sm min-h-[160px] items-center">
                    {Array.from({ length: totalPiesNeeded }).map((_, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <svg width="120" height="120" className="drop-shadow-md">
                          {renderPieSlices(index, numerator)}
                        </svg>
                        <span className="text-[10px] text-gray-400 mt-1">Πίτα {index + 1}</span>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-8 text-center text-sm">
        <p>© {new Date().getFullYear()} LearnMaths.gr. Με ❤️ για τους μαθητές μας.</p>
      </footer>
    </div>
  );
}
