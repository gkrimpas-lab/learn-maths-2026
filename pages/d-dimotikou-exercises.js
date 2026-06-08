import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function DDimotikouExercises() {
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});
  
  // State για την αποθήκευση των 5 τυχαίων αριθμών της Άσκησης 5
  const [randomData, setRandomData] = useState([]);

  // Στατικά δεδομένα για τις πρώτες 4 ασκήσεις
  const exercisesData = {
    ex1_1: { q: "90 ÷ 10", ans: "9", explanation: "Διώχνουμε 1 μηδενικό από το τέλος του 90, άρα μένει 9." },
    ex1_2: { q: "240 ÷ 10", ans: "24", explanation: "Διώχνουμε 1 μηδενικό από το τέλος του 240, άρα μένει 24." },
    ex1_3: { q: "1.500 ÷ 10", ans: "150", explanation: "Σβήνουμε 1 μηδενικό από το τέλος, άρα το 1500 γίνεται 150." },
    ex1_4: { q: "8.920 ÷ 10", ans: "892", explanation: "Σβήνουμε το τελευταίο μηδενικό, άρα μένει 892." },

    ex2_1: { q: "600 ÷ 100", ans: "6", explanation: "Το 100 έχει δύο μηδενικά, άρα σβήνουμε δύο μηδενικά από το 600 και μένει 6." },
    ex2_2: { q: "1.400 ÷ 100", ans: "14", explanation: "Διώχνουμε και τα δύο μηδενικά από το τέλος, άρα μένει 14." },
    ex2_3: { q: "5.000 ÷ 100", ans: "50", explanation: "Σβήνουμε δύο μηδενικά από το τέλος του 5000, άρα μένει 50." },
    ex2_4: { q: "23.800 ÷ 100", ans: "238", explanation: "Σβήνουμε δύο μηδενικά από το τέλος, άρα μένει 238." },

    ex3_1: { q: "4.000 ÷ 1000", ans: "4", explanation: "Το 1000 έχει 3 μηδενικά. Σβήνουμε 3 μηδενικά από το 4000 και μένει 4." },
    ex3_2: { q: "9.000 ÷ 1000", ans: "9", explanation: "Σβήνουμε και τα 3 μηδενικά από το τέλος, άρα μένει 9." },
    ex3_3: { q: "15.000 ÷ 1000", ans: "15", explanation: "Σβήνουμε 3 μηδενικά από το τέλος του 15000, άρα μένει 15." },
    ex3_4: { q: "70.000 ÷ 1000", ans: "70", explanation: "Σβήνουμε 3 μηδενικά από το τέλος, άρα το 70000 γίνεται 70." },

    ex4_1: { q: "800 ÷ ... = 8", ans: "100", explanation: "Ο αριθμός 800 έχασε 2 μηδενικά για να γίνει 8, άρα διαιρέθηκε με το 100." },
    ex4_2: { q: "3.200 ÷ ... = 320", ans: "10", explanation: "Ο αριθμός έχασε 1 μηδενικό, άρα διαιρέθηκε με το 10." },
    ex4_3: { q: "6.000 ÷ ... = 6", ans: "1000", explanation: "Χάθηκαν 3 μηδενικά, άρα διαιρέθηκε με το 1000." },
    ex4_4: { q: "... ÷ 100 = 14", ans: "1400", explanation: "Αφού διαιρέθηκε με το 100 και έβγαλε 14, σημαίνει ότι στην αρχή είχε δύο μηδενικά παραπάνω (14 × 100 = 1400)." }
  };

  // 🔴 5η ΑΣΚΗΣΗ: ΔΗΜΙΟΥΡΓΙΑ 5 ΤΥΧΑΙΩΝ ΑΡΙΘΜΩΝ ΚΑΙ ΔΥΝΑΜΙΚΩΝ ΑΠΑΝΤΗΣΕΩΝ
  useEffect(() => {
    generateRandomExercises();
  }, []);

  const generateRandomExercises = () => {
    const tempRandoms = [];
    const operations = [10, 100, 1000, 10, 100]; // Διαφορετικοί διαιρέτες για ποικιλία
    
    for (let i = 0; i < 5; i++) {
      const num = Math.floor(Math.random() * 9999) + 1; // Τυχαίος από 1 έως 9999
      const divisor = operations[i];
      
      // Υπολογισμός σωστού αποτελέσματος σε μορφή string με ελληνικό κόμμα
      let correctResult = (num / divisor).toString().replace('.', ',');
      
      // Δυναμική παραγωγή επεξήγησης ανάλογα με τον αν ο αριθμός έχει μηδενικά ή όχι
      let expl = "";
      if (num % divisor === 0) {
        const zeros = divisor === 10 ? "1 μηδενικό" : (divisor === 100 ? "2 μηδενικά" : "3 μηδενικά");
        expl = `Επειδή ο αριθμός τελειώνει σε μηδενικά, διώχνουμε ${zeros} από το τέλος του ${num}.`;
      } else {
        const positions = divisor === 10 ? "1 θέση" : (divisor === 100 ? "2 θέσεις" : "3 θέσεις");
        expl = `Επειδή ο αριθμός δεν έχει μηδενικά, βάζουμε υποδιαστολή πηγαίνοντας ${positions} προς τα αριστερά.`;
      }

      tempRandoms.push({
        id: `rand_${i}`,
        q: `${num.toLocaleString('el-GR')} ÷ ${divisor}`,
        ans: correctResult,
        explanation: expl
      });
    }
    setRandomData(tempRandoms);
    // Καθαρισμός παλιών αποτελεσμάτων αν πατηθεί επαναφόρτωση
    setAnswers({});
    setResults({});
  };

  const handleInputChange = (id, val) => {
    const formattedVal = val.replace('.', ',');
    setAnswers({ ...answers, [id]: formattedVal });
  };

  const checkAnswer = (id, isRandom = false, randItem = null) => {
    const userAnswer = answers[id]?.trim();
    const correctAnswer = isRandom ? randItem.ans : exercisesData[id].ans;
    const explanation = isRandom ? randItem.explanation : exercisesData[id].explanation;
    
    if (!userAnswer) return;

    if (userAnswer === correctAnswer) {
      setResults(prev => ({ ...prev, [id]: { status: 'correct' } }));
    } else {
      setResults(prev => ({ ...prev, [id]: { status: 'wrong', msg: explanation, correctVal: correctAnswer } }));
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
            <button onClick={generateRandomExercises} className="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold px-4 py-2 rounded-xl border border-indigo-200 transition active:scale-95">
              🔀 Νέοι Τυχαίοι Αριθμοί
            </button>
          </div>

          {/* ΑΣΚΗΣΕΙΣ 1-3 */}
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
                      <button onClick={() => checkAnswer(id)} className="bg-green-700 text-white px-2 py-0.5 rounded text-[11px]">✔</button>
                    </div>
                    {results[id]?.status === 'correct' && <div className="text-[11px] text-emerald-600">🎉 Σωστά!</div>}
                    {results[id]?.status === 'wrong' && <div className="text-[11px] text-red-600 bg-white p-1.5 rounded border border-red-200 font-medium">Σωστό: {results[id].correctVal}. {results[id].msg}</div>}
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
                      <button onClick={() => checkAnswer(id)} className="bg-blue-700 text-white px-2 py-0.5 rounded text-[11px]">✔</button>
                    </div>
                    {results[id]?.status === 'correct' && <div className="text-[11px] text-emerald-600">🎉 Σωστά!</div>}
                    {results[id]?.status === 'wrong' && <div className="text-[11px] text-red-600 bg-white p-1.5 rounded border border-red-200 font-medium">Σωστό: {results[id].correctVal}. {results[id].msg}</div>}
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
                      <button onClick={() => checkAnswer(id)} className="bg-orange-700 text-white px-2 py-0.5 rounded text-[11px]">✔</button>
                    </div>
                    {results[id]?.status === 'correct' && <div className="text-[11px] text-emerald-600">🎉 Σωστά!</div>}
                    {results[id]?.status === 'wrong' && <div className="text-[11px] text-red-600 bg-white p-1.5 rounded border border-red-200 font-medium">Σωστό: {results[id].correctVal}. {results[id].msg}</div>}
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
                <div key={id} className="text-sm font-bold bg-white p-3 rounded-xl border flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono">{exercisesData[id].q.includes('...') ? exercisesData[id].q.split('...')[0] : ''} 
                      {exercisesData[id].q.includes('...') ? <input type="text" value={answers[id] || ''} onChange={(e) => handleInputChange(id, e.target.value)} className="w-16 border rounded text-center text-indigo-600 bg-slate-50 mx-1" placeholder="..." /> : <input type="text" value={answers[id] || ''} onChange={(e) => handleInputChange(id, e.target.value)} className="w-16 border rounded text-center text-indigo-600 bg-slate-50 mx-1" placeholder="..." />}
                      {exercisesData[id].q.includes('...') ? exercisesData[id].q.split('...')[1] : exercisesData[id].q}
                    </span>
                    <button onClick={() => checkAnswer(id)} className="bg-slate-700 text-white px-3 py-1 rounded-lg text-xs">Έλεγχος</button>
                  </div>
                  {results[id]?.status === 'correct' && <div className="text-[11px] text-emerald-600">🎉 Σωστά!</div>}
                  {results[id]?.status === 'wrong' && <div className="text-[11px] text-red-600 bg-red-50/60 p-2 rounded border border-red-200 font-medium">Σωστό: {results[id].correctVal}. {results[id].msg}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* 🔴 5η ΑΣΚΗΣΗ: 5 ΤΥΧΑΙΟΙ ΑΡΙΘΜΟΙ ΑΠΟ 1 ΕΩΣ 9999 (ΠΡΟΣΤΕΘΗΚΕ!) */}
          <div className="bg-indigo-50/40 p-5 rounded-2xl border border-indigo-200">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-bold text-xs text-indigo-800 bg-indigo-100 px-3 py-1 rounded-lg inline-block">🚀 5. Δοκιμασία Προχωρημένων (Τυχαίοι Αριθμοί με Υποδιαστολή)</h4>
            </div>
            <p className="text-xs text-slate-500 mb-4 font-medium">Κάθε φορά που πατάς «Νέοι Τυχαίοι Αριθμοί» στην κορυφή, εμφανίζονται 5 διαφορετικές προκλήσεις!</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {randomData.map((item) => (
                <div key={item.id} className="text-sm font-bold bg-white p-3 rounded-xl border flex flex-col gap-1.5 shadow-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-slate-800">{item.q} =</span>
                    <div className="flex gap-1.5">
                      <input type="text" value={answers[item.id] || ''} onChange={(e) => handleInputChange(item.id, e.target.value)} className="w-20 border rounded p-1 text-center font-mono text-indigo-600" placeholder="0,00" />
                      <button onClick={() => checkAnswer(item.id, true, item)} className="bg-indigo-600 text-white px-2 py-1 rounded-lg text-xs">Έλεγχος</button>
                    </div>
                  </div>
                  {results[item.id]?.status === 'correct' && <div className="text-[11px] text-emerald-600">🎉 Εξαιρετικά! Σωστή απάντηση.</div>}
                  {results[item.id]?.status === 'wrong' && <div className="text-[11px] text-red-600 bg-red-50 p-2 rounded-lg border border-red-200 font-medium">Σωστό: {results[item.id].correctVal}. {results[item.id].msg}</div>}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
