import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function DDimotikouExercises() {
  // State για τις απαντήσεις και τα αποτελέσματα ελέγχου
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});

  // Η βάση δεδομένων των ασκήσεων με τις σωστές απαντήσεις και τις επεξηγήσεις τους
  const exercisesData = {
    ex1_1: { q: "90 ÷ 10", ans: "9", type: "zero", explanation: "Διώχνουμε 1 μηδενικό από το τέλος του 90, άρα μένει 9." },
    ex1_2: { q: "240 ÷ 10", ans: "24", type: "zero", explanation: "Διώχνουμε 1 μηδενικό από το τέλος του 240, άρα μένει 24." },
    ex1_3: { q: "1.500 ÷ 10", ans: "150", type: "zero", explanation: "Σβήνουμε 1 μηδενικό από το τέλος, άρα το 1500 γίνεται 150." },
    ex1_4: { q: "8.920 ÷ 10", ans: "892", type: "zero", explanation: "Σβήνουμε το τελευταίο μηδενικό, άρα μένει 892." },

    ex2_1: { q: "600 ÷ 100", ans: "6", type: "zero", explanation: "Το 100 έχει δύο μηδενικά, άρα σβήνουμε δύο μηδενικά από το 600 και μένει 6." },
    ex2_2: { q: "1.400 ÷ 100", ans: "14", type: "zero", explanation: "Διώχνουμε και τα δύο μηδενικά από το τέλος, άρα μένει 14." },
    ex2_3: { q: "5.000 ÷ 100", ans: "50", type: "zero", explanation: "Σβήνουμε δύο μηδενικά από το τέλος του 5000, άρα μένει 50." },
    ex2_4: { q: "23.800 ÷ 100", ans: "238", type: "zero", explanation: "Σβήνουμε δύο μηδενικά από το τέλος, άρα μένει 238." },

    ex3_1: { q: "4.000 ÷ 1000", ans: "4", type: "zero", explanation: "Το 1000 έχει 3 μηδενικά. Σβήνουμε 3 μηδενικά από το 4000 και μένει 4." },
    ex3_2: { q: "9.000 ÷ 1000", ans: "9", type: "zero", explanation: "Σβήνουμε και τα 3 μηδενικά από το τέλος, άρα μένει 9." },
    ex3_3: { q: "15.000 ÷ 1000", ans: "15", type: "zero", explanation: "Σβήνουμε 3 μηδενικά από το τέλος του 15000, άρα μένει 15." },
    ex3_4: { q: "70.000 ÷ 1000", ans: "70", type: "zero", explanation: "Σβήνουμε 3 μηδενικά από το τέλος, άρα το 70000 γίνεται 70." },

    ex4_1: { q: "800 ÷ ... = 8", ans: "100", type: "missing", explanation: "Ο αριθμός 800 έχασε 2 μηδενικά για να γίνει 8, άρα διαιρέθηκε με το 100." },
    ex4_2: { q: "3.200 ÷ ... = 320", ans: "10", type: "missing", explanation: "Ο αριθμός έχασε 1 μηδενικό, άρα διαιρέθηκε με το 10." },
    ex4_3: { q: "6.000 ÷ ... = 6", ans: "1000", type: "missing", explanation: "Χάθηκαν 3 μηδενικά, άρα διαιρέθηκε με το 1000." },
    ex4_4: { q: "... ÷ 100 = 14", ans: "1400", type: "missing", explanation: "Αφού διαιρέθηκε με το 100 και έβγαλε 14, πάει να πει ότι στην αρχή είχε δύο μηδενικά παραπάνω (14 × 100 = 1400)." },

    // 🔴 ΝΕΕΣ ΔΥΣΚΟΛΕΣ ΑΣΚΗΣΕΙΣ ΜΕ ΥΠΟΔΙΑΣΤΟΛΗ
    ex5_1: { q: "135 ÷ 10", ans: "13,5", type: "comma", explanation: "Το 135 δεν έχει μηδενικά. Το 10 έχει 1 μηδενικό, άρα βάζουμε υποδιαστολή 1 θέση από το τέλος: 13,5." },
    ex5_2: { q: "47 ÷ 10", ans: "4,7", type: "comma", explanation: "Το 10 έχει 1 μηδενικό, άρα η υποδιαστολή πηγαίνει 1 θέση αριστερά: 4,7." },
    ex5_3: { q: "268 ÷ 100", ans: "2,68", type: "comma", explanation: "Το 100 έχει 2 μηδενικά, άρα βάζουμε την υποδιαστολή 2 θέσεις αριστερά: 2,68." },
    ex5_4: { q: "9 ÷ 10", ans: "0,9", type: "comma", explanation: "Μετακινούμε την υποδιαστολή 1 θέση αριστερά. Επειδή δεν υπάρχει άλλος αριθμός μπροστά, βάζουμε μηδέν: 0,9." }
  };

  const handleInputChange = (id, val) => {
    // Αντικαθιστούμε την τελεία με κόμμα για να είναι συμβατό με τη σχολική γραφή
    const formattedVal = val.replace('.', ',');
    setAnswers({ ...answers, [id]: formattedVal });
  };

  const checkAnswer = (id) => {
    const userAnswer = answers[id]?.trim();
    const correctAnswer = exercisesData[id].ans;
    
    if (!userAnswer) return;

    if (userAnswer === correctAnswer) {
      setResults({ ...results, [id]: { status: 'correct' } });
    } else {
      setResults({ ...results, [id]: { status: 'wrong', msg: exercisesData[id].explanation } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-4 md:p-8">
      <Head>
        <title>Ψηφιακή Εξάσκηση: Διαίρεση με 10, 100, 1000</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* ΚΟΥΜΠΙ ΕΠΙΣΤΡΟΦΗΣ */}
        <Link href="/d-dimotikou" className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:underline">
          &larr; Επιστροφή στο Μάθημα
        </Link>

        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="border-b pb-4">
            <h1 className="text-2xl font-black text-indigo-950">✍️ Ψηφιακό Τετράδιο Ασκήσεων</h1>
            <p className="text-xs text-gray-500 mt-1">Λύσε τις πράξεις και πάτα «Έλεγχος» για να δεις αν τα κατάφερες!</p>
          </div>

          {/* ΟΜΑΔΑ 1 */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-green-800 bg-green-50 px-3 py-1 rounded-lg inline-block">1. Διαιρέσεις με το 10 (Σβήνω 1 μηδενικό)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['ex1_1', 'ex1_2', 'ex1_3', 'ex1_4'].map((id) => (
                <div key={id} className="p-3 bg-slate-50 rounded-xl border flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold">{exercisesData[id].q} =</span>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        onChange={(e) => handleInputChange(id, e.target.value)}
                        className="w-24 border rounded-lg p-1 text-center font-bold text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                        placeholder="?" 
                      />
                      <button onClick={() => checkAnswer(id)} className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-indigo-700">Έλεγχος</button>
                    </div>
                  </div>
                  {results[id]?.status === 'correct' && <div className="text-xs font-bold text-emerald-600">🎉 Σωστά! Μπράβο.</div>}
                  {results[id]?.status === 'wrong' && <div className="text-xs text-red-600 bg-red-50 p-2 rounded-lg font-medium">❌ {results[id].msg}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* ΟΜΑΔΑ 2 */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-blue-800 bg-blue-50 px-3 py-1 rounded-lg inline-block">2. Διαιρέσεις με το 100 (Σβήνω 2 μηδενικά)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['ex2_1', 'ex2_2', 'ex2_3', 'ex2_4'].map((id) => (
                <div key={id} className="p-3 bg-slate-50 rounded-xl border flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold">{exercisesData[id].q} =</span>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        onChange={(e) => handleInputChange(id, e.target.value)}
                        className="w-24 border rounded-lg p-1 text-center font-bold text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                        placeholder="?" 
                      />
                      <button onClick={() => checkAnswer(id)} className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-indigo-700">Έλεγχος</button>
                    </div>
                  </div>
                  {results[id]?.status === 'correct' && <div className="text-xs font-bold text-emerald-600">🎉 Σωστά! Μπράβο.</div>}
                  {results[id]?.status === 'wrong' && <div className="text-xs text-red-600 bg-red-50 p-2 rounded-lg font-medium">❌ {results[id].msg}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* ΟΜΑΔΑ 3 */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-orange-800 bg-orange-50 px-3 py-1 rounded-lg inline-block">3. Διαιρέσεις με το 1000 (Σβήνω 3 μηδενικά)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['ex3_1', 'ex3_2', 'ex3_3', 'ex3_4'].map((id) => (
                <div key={id} className="p-3 bg-slate-50 rounded-xl border flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold">{exercisesData[id].q} =</span>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        onChange={(e) => handleInputChange(id, e.target.value)}
                        className="w-24 border rounded-lg p-1 text-center font-bold text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                        placeholder="?" 
                      />
                      <button onClick={() => checkAnswer(id)} className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-indigo-700">Έλεγχος</button>
                    </div>
                  </div>
                  {results[id]?.status === 'correct' && <div className="text-xs font-bold text-emerald-600">🎉 Σωστά! Μπράβο.</div>}
                  {results[id]?.status === 'wrong' && <div className="text-xs text-red-600 bg-red-50 p-2 rounded-lg font-medium">❌ {results[id].msg}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* 🔴 ΟΜΑΔΑ 4: ΝΕΕΣ ΔΥΣKΟΛΕΣ ΑΣΚΗΣΕΙΣ ΜΕ ΥΠΟΔΙΑΣΤΟΛΗ (ΚΟΜΜΑ) */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-red-800 bg-red-50 px-3 py-1.5 rounded-lg inline-block">🚀 4. Προχωρημένες Ασκήσεις: Προσοχή στην Υποδιαστολή!</h3>
            <p className="text-xs text-gray-500">Θυμήσου: Αν δεν υπάρχουν μηδενικά, βάζουμε κόμμα ( , ) πηγαίνοντας προς τα αριστερά!</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['ex5_1', 'ex5_2', 'ex5_3', 'ex5_4'].map((id) => (
                <div key={id} className="p-3 bg-amber-50/40 rounded-xl border border-amber-200 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-slate-800">{exercisesData[id].q} =</span>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        onChange={(e) => handleInputChange(id, e.target.value)}
                        className="w-24 border rounded-lg p-1 text-center font-bold text-amber-900 bg-white border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500" 
                        placeholder="0,0" 
                      />
                      <button onClick={() => checkAnswer(id)} className="bg-amber-600 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-amber-700">Έλεγχος</button>
                    </div>
                  </div>
                  {results[id]?.status === 'correct' && <div className="text-xs font-bold text-emerald-600">🎉 Σωστά! Είσαι αστέρι!</div>}
                  {results[id]?.status === 'wrong' && <div className="text-xs text-red-600 bg-red-50 p-2 rounded-lg font-medium">❌ {results[id].msg}</div>}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
