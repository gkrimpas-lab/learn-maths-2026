import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function DDimotikouExercises() {
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});
  const [randomData, setRandomData] = useState([]);

  // Στατικά δεδομένα για τις πρώτες 4 ασκήσεις
  const exercisesData = {
    ex1_1: { q: "90 ÷ 10", ans: "9", explanation: "Το 10 έχει 1 μηδενικό, οπότε διώχνουμε 1 μηδενικό από το τέλος του 90 και μένει 9." },
    ex1_2: { q: "240 ÷ 10", ans: "24", explanation: "Το 10 έχει 1 μηδενικό, οπότε σβήνουμε 1 μηδενικό από το τέλος του 240 και μένει 24." },
    ex1_3: { q: "1.500 ÷ 10", ans: "150", explanation: "Διώχνουμε 1 μηδενικό από το τέλος του 1.500, οπότε ο αριθμός γίνεται 150." },
    ex1_4: { q: "8.920 ÷ 10", ans: "892", explanation: "Το 10 έχει 1 μηδενικό, άρα σβήνουμε το τελευταίο μηδενικό του αριθμού και μένει 892." },

    ex2_1: { q: "600 ÷ 100", ans: "6", explanation: "Το 100 έχει 2 μηδενικά, οπότε σβήνουμε 2 μηδενικά από το τέλος του 600 και μένει 6." },
    ex2_2: { q: "1.400 ÷ 100", ans: "14", explanation: "Το 100 έχει 2 μηδενικά, οπότε διώχνουμε 2 μηδενικά από το τέλος του 1.400 και μένει 14." },
    ex2_3: { q: "5.000 ÷ 100", ans: "50", explanation: "Το 100 έχει 2 μηδενικά, οπότε αφαιρούμε 2 μηδενικά από το τέλος του 5.000 και μένει 50." },
    ex2_4: { q: "23.800 ÷ 100", ans: "238", explanation: "Σβήνουμε τα 2 μηδενικά από το τέλος του αριθμού 23.800 και μένει 238." },

    ex3_1: { q: "4.000 ÷ 1000", ans: "4", explanation: "Το 1.000 έχει 3 μηδενικά, οπότε διώχνουμε 3 μηδενικά από το τέλος του 4.000 και μένει 4." },
    ex3_2: { q: "9.000 ÷ 1000", ans: "9", explanation: "Το 1.000 έχει 3 μηδενικά, οπότε σβήνουμε και τα 3 μηδενικά από το τέλος και μένει 9." },
    ex3_3: { q: "15.000 ÷ 1000", ans: "15", explanation: "Αφαιρούμε 3 μηδενικά από το τέλος του 15.000, οπότε ο αριθμός γίνεται 15." },
    ex3_4: { q: "70.000 ÷ 1000", ans: "70", explanation: "Σβήνουμε 3 μηδενικά από το τέλος του αριθμού 70.000 και μένει 70." },

    ex4_1: { q: "800 ÷ ... = 8", ans: "100", explanation: "Ο αριθμός 800 έχασε 2 μηδενικά για να γίνει 8, πράγμα που σημαίνει ότι διαιρέθηκε με το 100." },
    ex4_2: { q: "3.200 ÷ ... = 320", ans: "10", explanation: "Ο αριθμός 3.200 έχασε 1 μηδενικό για να γίνει 320, άρα διαιρέθηκε με το 10." },
    ex4_3: { q: "6.000 ÷ ... = 6", ans: "1000", explanation: "Ο αριθμός 6.000 έχασε και τα 3 μηδενικά του για να γίνει 6, άρα διαιρέθηκε με το 1.000." },
    ex4_4: { q: "... ÷ 100 = 14", ans: "1400", explanation: "Αφού ο αριθμός διαιρέθηκε με το 100 και έδωσε 14, σημαίνει ότι στην αρχή είχε δύο μηδενικά παραπάνω στο τέλος (14 × 100 = 1.400)." }
  };

  useEffect(() => {
    generateRandomExercises();
  }, []);

  const generateRandomExercises = () => {
    const tempRandoms = [];
    const operations = [10, 100, 1000, 10, 100];
    
    for (let i = 0; i < 5; i++) {
      const num = Math.floor(Math.random() * 9999) + 1;
      const divisor = operations[i];
      let correctResult = (num / divisor).toString().replace('.', ',');
      
      let expl = "";
      if (num % divisor === 0) {
        const zeros = divisor === 10 ? "1 μηδενικό" : (divisor === 100 ? "2 μηδενικά" : "3 μηδενικά");
        expl = `Επειδή ο αριθμός τελειώνει σε μηδενικά, διώχνουμε απλά ${zeros} από το τέλος του ${num.toLocaleString('el-GR')}.`;
      } else {
        const positions = divisor === 10 ? "1 θέση" : (divisor === 100 ? "2 θέσεις" : "3 θέσεις");
        expl = `Επειδή ο αριθμός δεν έχει μηδενικά, φανταζόμαστε την υποδιαστολή στο τέλος και τη μετακινούμε ${positions} προς τα αριστερά στον αριθμό ${num.toLocaleString('el-GR')}.`;
      }

      tempRandoms.push({
        id: `rand_${i}`,
        q: `${num.toLocaleString('el-GR')} ÷ ${divisor}`,
        ans: correctResult,
        explanation: expl
      });
    }
    setRandomData(tempRandoms);
    setAnswers({});
    setResults({});
  };

  const handleInputChange = (id, val) => {
    const formattedVal = val.replace('.', ',');
    setAnswers(prev => ({ ...prev, [id]: formattedVal }));
  };

  // 🔴 ΔΙΟΡΘΩΘΗΚΕ: Πλήρης και αυστηρός έλεγχος ισότητας χωρίς λογικά κενά
  const checkAnswer = (id, isRandom = false, randItem = null) => {
    const userAnswer = answers[id] ? answers[id].trim() : "";
    
    // Αν το πεδίο είναι άδειο, μην κάνεις τίποτα
    if (userAnswer === "") return;

    const correctAnswer = isRandom ? randItem.ans : exercisesData[id].ans;
    const explanation = isRandom ? randItem.explanation : exercisesData[id].explanation;
    
    if (userAnswer === correctAnswer) {
      setResults(prev => ({
        ...prev,
        [id]: { status: 'correct' }
      }));
    } else {
      setResults(prev => ({
        ...prev,
        [id]: { status: 'wrong', msg: explanation, correctVal: correctAnswer }
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-4 md:p-8">
      <Head>
        <title>Ψηφιακή Εξάσκηση: Διαίρεση με 10, 100, 1000</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div className="max-w-4xl mx-auto space-y-6">
        
        <Link href="/d-dimotikou" className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:underline">
          &larr; Επιστροφή στο Μάθημα
        </Link>

        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
          <div className="border-b pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-black text-indigo-950">⚡ Ασκήσεις: Διαίρεση με 10, 100, 1000</h1>
              <p className="text-xs text-gray-500 mt-1">Λύσε τις πράξεις και έλεγξε την απάντησή σου!</p>
            </div>
            <button onClick={generateRandomExercises} className="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold px-4 py-2 rounded-xl border border-indigo-200 transition active:scale-95 shadow-sm">
              🔀 Νέοι Τυχαίοι Αριθμοί
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 10 */}
            <div className="space-y-3 bg-green-50/30 p-4 rounded-2xl border border-green-100">
              <h4 className="font-bold text-xs text-green-800 bg-green-100 px-2 py-1 rounded inline-block">1. Διαιρέσεις με το 10</h4>
              <div className="space-y-4 pt-2">
                {['ex1_1', 'ex1_2', 'ex1_3', 'ex1_4'].map(id => (
                  <div key={id} className="text-sm font-bold flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-1">
                      <span>{exercisesData[id].q} =</span>
                      <input type="text" value={answers[id] || ''} onChange={(e) => handleInputChange(id, e.target.value)} className="w-16 border rounded p-0.5 text-center font-mono text-indigo-600 bg-white" placeholder="?" />
                      <button onClick={() => checkAnswer(id)} className="bg-green-700 text-white px-2 py-0.5 rounded text-[11px] shadow-sm font-black">✓</button>
                    </div>
                    {results[id]?.status === 'correct' && <div className="text-[11px] text-emerald-600 font-black">🎉 Σωστά!</div>}
                    {results[id]?.status === 'wrong' && (
                      <div className="text-[11px] text-red-600 bg-white p-2.5 rounded border border-red-200 font-medium leading-relaxed shadow-sm">
                        🧐 Σωστό: <span className="font-black text-sm text-red-700">{results[id].correctVal}</span>.<br />
                        <span className="text-slate-500 font-normal">{results[id].msg}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 100 */}
            <div className="space-y-3 bg-blue-50/30 p-4 rounded-2xl border border-blue-100">
              <h4 className="font-bold text-xs text-blue-800 bg-blue-100 px-2 py-1 rounded inline-block">2. Διαιρέσεις με το 100</h4>
              <div className="space-y-4 pt-2">
                {['ex2_1', 'ex2_2', 'ex2_3', 'ex2_4'].map(id => (
                  <div key={id} className="text-sm font-bold flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-1">
                      <span>{exercisesData[id].q} =</span>
                      <input type="text" value={answers[id] || ''} onChange={(e) => handleInputChange(id, e.target.value)} className="w-16 border rounded p-0.5 text-center font-mono text-indigo-600 bg-white" placeholder="?" />
                      <button onClick={() => checkAnswer(id)} className="bg-blue-700 text-white px-2 py-0.5 rounded text-[11px] shadow-sm font-black">✓</button>
                    </div>
                    {results[id]?.status === 'correct' && <div className="text-[11px] text-emerald-600 font-black">🎉 Σωστά!</div>}
                    {results[id]?.status === 'wrong' && (
                      <div className="text-[11px] text-red-600 bg-white p-2.5 rounded border border-red-200 font-medium leading-relaxed shadow-sm">
                        🧐 Σωστό: <span className="font-black text-sm text-red-700">{results[id].correctVal}</span>.<br />
                        <span className="text-slate-500 font-normal">{results[id].msg}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 1000 */}
            <div className="space-y-3 bg-orange-50/30 p-4 rounded-2xl border border-orange-100">
              <h4 className="font-bold text-xs text-orange-800 bg-orange-100 px-2 py-1 rounded inline-block">3. Διαιρέσεις με το 1000</h4>
              <div className="space-y-4 pt-2">
                {['ex3_1', 'ex3_2', 'ex3_3', 'ex3_4'].map(id => (
                  <div key={id} className="text-sm font-bold flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-1">
                      <span>{exercisesData[id].q} =</span>
                      <input type="text" value={answers[id] || ''} onChange={(e) => handleInputChange(id, e.target.value)} className="w-16 border rounded p-0.5 text-center font-mono text-indigo-600 bg-white" placeholder="?" />
                      <button onClick={() => checkAnswer(id)} className="bg-orange-700 text-white px-2 py-0.5 rounded text-[11px] shadow-sm font-black">✓</button>
                    </div>
                    {results[id]?.status === 'correct' && <div className="text-[11px] text-emerald-600 font-black">🎉 Σωστά!</div>}
                    {results[id]?.status === 'wrong' && (
                      <div className="text-[11px] text-red-600 bg-white p-2.5 rounded border border-red-200 font-medium leading-relaxed shadow-sm">
                        🧐 Σωστό: <span className="font-black text-sm text-red-700">{results[id].correctVal}</span>.<br />
                        <span className="text-slate-500 font-normal">{results[id].msg}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ΑΣΚΗΣΗ 4 */}
          <div className="bg-slate-50 p-5 rounded-2xl border">
            <h4 className="font-bold text-xs text-slate-700 bg-slate-200 px-3 py-1 rounded-lg inline-block mb-3">4. Βρες τον αριθμό που λείπει</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['ex4_1', 'ex4_2', 'ex4_3', 'ex4_4'].map(id => (
                <div key={id} className="text-sm font-bold bg-white p-3 rounded-xl border flex flex-col gap-1.5 shadow-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono">
                      {exercisesData[id].q.includes('...') && exercisesData[id].q.split('...')[0]} 
                      <input type="text" value={answers[id] || ''} onChange={(e) => handleInputChange(id, e.target.value)} className="w-16 border rounded text-center text-indigo-600 bg-slate-50 mx-1 font-mono font-bold" placeholder="..." />
                      {exercisesData[id].q.includes('...') && Math.abs(exercisesData[id].q.split('...').length) > 1 && exercisesData[id].q.split('...')[1]}
                    </span>
                    <button onClick={() => checkAnswer(id)} className="bg-slate-700 text-white px-3 py-1 rounded-lg text-xs font-bold active:scale-95 transition shadow-sm">Έλεγχος</button>
                  </div>
                  {results[id]?.status === 'correct' && <div className="text-[11px] text-emerald-600 font-black">🎉 Σωστά!</div>}
                  {results[id]?.status === 'wrong' && (
                    <div className="text-[11px] text-red-600 bg-red-50/60 p-2.5 rounded border border-red-200 font-medium leading-relaxed">
                      🧐 Σωστό: <span className="font-black text-sm text-red-700">{results[id].correctVal}</span>.<br />
                      <span className="text-slate-500 font-normal">{results[id].msg}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 5η ΑΣΚΗΣΗ: ΤΥΧΑΙΟΙ ΑΡΙΘΜΟΙ ΑΠΟ 1 ΕΩΣ 9999 */}
          <div className="bg-indigo-50/40 p-5 rounded-2xl border border-indigo-200">
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-bold text-xs text-indigo-800 bg-indigo-100 px-3 py-1 rounded-lg inline-block">🚀 5. Δοκιμασία Προχωρημένων (Τυχαίοι Αριθμοί με Υποδιαστολή)</h4>
            </div>
            <p className="text-[11px] text-slate-500 mb-4 font-medium">Κάθε φορά που πατάς «Νέοι Τυχαίοι Αριθμοί» στην κορυφή της σελίδας, εμφανίζονται 5 καινούργιες τυχαίες πράξεις!</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {randomData.map((item) => (
                <div key={item.id} className="text-sm font-bold bg-white p-3 rounded-xl border flex flex-col gap-1.5 shadow-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-slate-800">{item.q} =</span>
                    <div className="flex gap-1.5">
                      <input type="text" value={answers[item.id] || ''} onChange={(e) => handleInputChange(item.id, e.target.value)} className="w-20 border rounded p-1 text-center font-mono font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-400" placeholder="0,0" />
                      <button onClick={() => checkAnswer(item.id, true, item)} className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-bold active:scale-95 transition shadow-sm">Έλεγχος</button>
                    </div>
                  </div>
                  {results[item.id]?.status === 'correct' && <div className="text-[11px] text-emerald-600 font-black">🎉 Εξαιρετικά! Σωστή απάντηση.</div>}
                  {results[item.id]?.status === 'wrong' && (
                    <div className="text-[11px] text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200 font-medium leading-relaxed shadow-sm">
                      🧐 Σωστό: <span className="font-black text-sm text-red-700">{results[item.id].correctVal}</span>.<br />
                      <span className="text-slate-500 font-normal">{results[item.id].msg}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
