// pages/e-dimotikou/01-klasma-ask.js
import { useState, useEffect, useId } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function KlasmaExercisesPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [keySeed, setKeySeed] = useState(0);

  const baseInputId = useId();

  // Βοηθητική συνάρτηση τυχαιοποίησης ακέραιου [min, max]
  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Ανακάτεμα πίνακα (Fisher-Yates)
  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Δημιουργία των 8 απαιτητικών ερωτήσεων με εγγυημένη μοναδικότητα ανά ζεύγος
  const generateQuiz = () => {
    // --- ΖΕΥΓΟΣ 1: Κλάσμα μέρους συνόλου με αντίστροφη ή σύνθετη σκέψη (q1, q2) ---
    // q1: Υπολογισμός υπολοίπου (π.χ. ξόδεψε τα k/m, πόσα περίσσεψαν;)
    const den1 = [5, 6, 8, 10][getRandomInt(0, 3)];
    const num1 = getRandomInt(2, den1 - 1);
    const multiplier1 = getRandomInt(4, 9);
    const totalItems1 = den1 * multiplier1;
    const spent1 = (totalItems1 / den1) * num1;
    const remaining1 = totalItems1 - spent1;

    // q2: Εύρεση αρχικού συνόλου από γνωστό μέρος (π.χ. τα 3/7 είναι X, πόσο είναι το όλο;)
    const den2Candidates = [3, 4, 7, 9].filter((d) => d !== den1);
    const den2 = den2Candidates[getRandomInt(0, den2Candidates.length - 1)];
    const num2 = getRandomInt(2, den2 - 1);
    const unitPart2 = getRandomInt(6, 15);
    const givenPartValue2 = num2 * unitPart2;
    const wholeValue2 = den2 * unitPart2;

    // --- ΖΕΥΓΟΣ 2: Καταχρηστικά κλάσματα, μεικτοί αριθμοί & ακέραιοι (q3, q4) ---
    // q3: Μετατροπή καταχρηστικού σε μεικτό (Ερώτηση Input: ζητείται ο ακέραιος και ο νέος αριθμητής)
    const den3 = [3, 4, 5, 7, 8][getRandomInt(0, 4)];
    const wholeUnits3 = getRandomInt(2, 5);
    const remParts3 = getRandomInt(1, den3 - 1);
    const num3 = wholeUnits3 * den3 + remParts3;

    // q4: Πόσα ίσα μέρη λείπουν για να φτάσουμε στον επόμενο ακέραιο (MCQ)
    const den4Candidates = [6, 9, 11, 12].filter((d) => d !== den3);
    const den4 = den4Candidates[getRandomInt(0, den4Candidates.length - 1)];
    const targetWhole4 = getRandomInt(2, 4);
    const currentNum4 = targetWhole4 * den4 - getRandomInt(2, den4 - 1);
    const missingParts4 = targetWhole4 * den4 - currentNum4;

    const q4Distractors = [
      missingParts4 + 1,
      Math.max(1, missingParts4 - 1),
      den4 - missingParts4
    ].filter((d) => d !== missingParts4);
    const q4Options = shuffleArray(
      Array.from(new Set([missingParts4, ...q4Distractors])).slice(0, 4)
    );

    // --- ΖΕΥΓΟΣ 3: Κλάσμα ως πηλίκο διαίρεσης & ισοδυναμία (q5, q6) ---
    // q5: Μοίρασμα ποσοτήτων (π.χ. X κιλά σε Y δοχεία, πόσα κιλά σε κάθε δοχείο;) (MCQ)
    const items5 = getRandomInt(5, 11);
    let containers5 = getRandomInt(3, 8);
    if (containers5 === items5) containers5 += 1;
    const correctFractionStr5 = `${items5}/${containers5}`;
    const q5Options = shuffleArray([
      `${items5}/${containers5}`,
      `${containers5}/${items5}`,
      `${items5 + 1}/${containers5}`,
      `${items5}/${containers5 + 1}`
    ]);

    // q6: Σύνθετη εύρεση άγνωστου όρου σε ισοδύναμο κλάσμα (Input)
    const baseNum6 = getRandomInt(2, 5);
    const baseDen6 = baseNum6 + getRandomInt(1, 4);
    const factor6 = getRandomInt(3, 7);
    const targetDen6 = baseDen6 * factor6;
    const correctNum6 = baseNum6 * factor6;

    // --- ΖΕΥΓΟΣ 4: Σύγκριση κλασμάτων με διαφορετικούς όρους (q7, q8) ---
    // q7: Σύγκριση με το 1/2 ως σημείο αναφοράς (MCQ)
    // Διαλέγουμε 4 κλάσματα: ακριβώς ένα είναι > 1/2
    const q7Candidates = [
      { text: '3/8', val: 3 / 8 },
      { text: '4/10', val: 4 / 10 },
      { text: '5/12', val: 5 / 12 },
      { text: '5/8', val: 5 / 8 },
      { text: '2/5', val: 2 / 5 },
      { text: '7/12', val: 7 / 12 }
    ];
    const greaterCandidates = q7Candidates.filter((c) => c.val > 0.5);
    const lesserCandidates = q7Candidates.filter((c) => c.val < 0.5);
    const chosenGreater = greaterCandidates[getRandomInt(0, greaterCandidates.length - 1)];
    const chosenLessers = shuffleArray(lesserCandidates).slice(0, 3);
    const q7Options = shuffleArray([chosenGreater.text, ...chosenLessers.map((c) => c.text)]);

    // q8: Πρόβλημα σύγκρισης καταναλώσεων σε απόλυτη τιμή (MCQ)
    const totalKm8 = 120;
    // Αυτοκίνητο Α: 3/4 των 120 = 90 km, Αυτοκίνητο Β: 4/5 των 120 = 96 km -> Διαφορά 6 km
    const optA = 90;
    const optB = 96;
    const diff8 = optB - optA;
    const q8Options = shuffleArray([
      `${diff8} km`,
      `${diff8 + 4} km`,
      `${diff8 + 6} km`,
      `${Math.max(2, diff8 - 2)} km`
    ]);

    const generated = [
      {
        id: 'q1',
        title: 'Ερώτηση 1η • Μέρος Συνόλου & Υπόλοιπο',
        type: 'input',
        text: `Ένα ανθοπωλείο παρέλαβε ${totalItems1} τριαντάφυλλα. Το πρωί πούλησε τα ${num1}/${den1} των τριαντάφυλλων. Πόσα τριαντάφυλλα έμειναν απούλητα στο κατάστημα;`,
        correctValue: String(remaining1),
        unit: 'τριαντάφυλλα',
        explanation: `Η σωστή απάντηση είναι: ${remaining1} τριαντάφυλλα. Υπολογίζουμε πρώτα το 1/${den1}: ${totalItems1} ： ${den1} ＝ ${multiplier1}. Τα ${num1}/${den1} είναι ${multiplier1} · ${num1} ＝ ${spent1} τριαντάφυλλα. Επομένως έμειναν: ${totalItems1} － ${spent1} ＝ ${remaining1} τριαντάφυλλα.`
      },
      {
        id: 'q2',
        title: 'Ερώτηση 2η • Ανάστροφος Υπολογισμός Συνόλου',
        type: 'input',
        text: `Ο Νίκος διάβασε τα ${num2}/${den2} ενός βιβλίου, δηλαδή ακριβώς ${givenPartValue2} σελίδες. Πόσες σελίδες έχει συνολικά ολόκληρο το βιβλίο;`,
        correctValue: String(wholeValue2),
        unit: 'σελίδες',
        explanation: `Η σωστή απάντηση είναι: ${wholeValue2} σελίδες. Αν τα ${num2}/${den2} είναι ${givenPartValue2} σελίδες, τότε το 1/${den2} είναι: ${givenPartValue2} ： ${num2} ＝ ${unitPart2} σελίδες. Ολόκληρο το βιβλίο (${den2}/${den2}) έχει: ${unitPart2} · ${den2} ＝ ${wholeValue2} σελίδες.`
      },
      {
        id: 'q3',
        title: 'Ερώτηση 3η • Καταχρηστικό Κλάσμα & Μεικτός Αριθμός',
        type: 'input',
        text: `Γράψε το καταχρηστικό κλάσμα ${num3}/${den3} ως μεικτό αριθμό. Πόσες είναι οι ακέραιες μονάδες του;`,
        correctValue: String(wholeUnits3),
        unit: 'ακέραιες μονάδες',
        explanation: `Η σωστή απάντηση είναι: ${wholeUnits3}. Εκτελούμε τη διαίρεση ${num3} ： ${den3} ＝ ${wholeUnits3} με υπόλοιπο ${remParts3}. Επομένως ${num3}/${den3} ＝ ${wholeUnits3} ＋ ${remParts3}/${den3} (δηλαδή ${wholeUnits3} ολόκληρες μονάδες).`
      },
      {
        id: 'q4',
        title: 'Ερώτηση 4η • Συμπλήρωση στον Επόμενο Ακέραιο',
        type: 'mcq',
        text: `Έχουμε το κλάσμα ${currentNum4}/${den4}. Πόσα ίσα μέρη (κλάσματα 1/${den4}) χρειάζεται να προσθέσουμε για να συμπληρωθεί ακριβώς ο ακέραιος αριθμός ${targetWhole4};`,
        options: q4Options.map(String),
        correctValue: String(missingParts4),
        explanation: `Η σωστή απάντηση είναι: ${missingParts4}. Ο ακέραιος ${targetWhole4} εκφράζεται ως κλάσμα με παρονομαστή το ${den4} ως εξής: ${targetWhole4} · ${den4} ＝ ${targetWhole4 * den4}/${den4}. Έχουμε ήδη ${currentNum4}/${den4}, άρα λείπουν: ${targetWhole4 * den4} － ${currentNum4} ＝ ${missingParts4} μέρη.`
      },
      {
        id: 'q5',
        title: 'Ερώτηση 5η • Κλάσμα ως Πηλίκο Διαίρεσης',
        type: 'mcq',
        text: `Μοιράζουμε ισότιμα ${items5} λίτρα ελαιόλαδου σε ${containers5} ίδια δοχεία. Ποιο κλάσμα εκφράζει την ακριβή ποσότητα λαδιού (σε λίτρα) που θα περιέχει κάθε δοχείο;`,
        options: q5Options,
        correctValue: correctFractionStr5,
        explanation: `Η σωστή απάντηση είναι: ${correctFractionStr5}. Το κλάσμα ισοδυναμεί με τη διαίρεση του διαιρετέου με τον διαιρέτη. Επομένως: ${items5} ： ${containers5} ＝ ${items5}/${containers5} L.`
      },
      {
        id: 'q6',
        title: 'Ερώτηση 6η • Εύρεση Όρου Ισοδύναμου Κλάσματος',
        type: 'input',
        text: `Αν ισχύει η ισότητα ${baseNum6}/${baseDen6} ＝ x/${targetDen6}, ποιος ακέραιος αριθμός είναι το x;`,
        correctValue: String(correctNum6),
        unit: 'τιμή του x',
        explanation: `Η σωστή απάντηση είναι: ${correctNum6}. Παρατηρούμε ότι ο παρονομαστής ${baseDen6} πολλαπλασιάστηκε με το ${factor6} για να γίνει ${targetDen6} (${baseDen6} · ${factor6} ＝ ${targetDen6}). Για να διατηρηθεί η ισοδυναμία, πολλαπλασιάζουμε και τον αριθμητή: ${baseNum6} · ${factor6} ＝ ${correctNum6}.`
      },
      {
        id: 'q7',
        title: 'Ερώτηση 7η • Σύγκριση με το Μισό ( 1/2 )',
        type: 'mcq',
        text: `Ποιο από τα παρακάτω κλάσματα είναι μεγαλύτερο από το μισό ( ＞ 1/2 );`,
        options: q7Options,
        correctValue: chosenGreater.text,
        explanation: `Η σωστή απάντηση είναι: ${chosenGreater.text}. Ένα κλάσμα είναι μεγαλύτερο από το 1/2 όταν ο αριθμητής του είναι μεγαλύτερος από το μισό του παρονομαστή του. Στο κλάσμα ${chosenGreater.text}, ο αριθμητής ξεπερνά το μισό του παρονομαστή.`
      },
      {
        id: 'q8',
        title: 'Ερώτηση 8η • Σύνθετο Πρόβλημα Σύγκρισης Αποστάσεων',
        type: 'mcq',
        text: `Μια διαδρομή είναι ${totalKm8} km. Το πράσινο όχημα διένυσε τα 3/4 της διαδρομής, ενώ το μπλε όχημα διένυσε τα 4/5 της ίδιας διαδρομής. Πόσα χιλιόμετρα παραπάνω διένυσε το μπλε όχημα;`,
        options: q8Options,
        correctValue: `${diff8} km`,
        explanation: `Η σωστή απάντηση είναι: ${diff8} km. Το πράσινο όχημα διένυσε: (${totalKm8} ： 4) · 3 ＝ 30 · 3 ＝ 90 km. Το μπλε όχημα διένυσε: (${totalKm8} ： 5) · 4 ＝ 24 · 4 ＝ 96 km. Η διαφορά τους είναι: 96 － 90 ＝ ${diff8} km.`
      }
    ];

    setQuestions(generated);
    setAnswers({});
    setSubmitted({});
  };

  useEffect(() => {
    generateQuiz();
  }, [keySeed]);

  // Χειρισμός αλλαγής απάντησης
  const handleInputChange = (id, val) => {
    // Φιλτράρισμα: μόνο αριθμητικοί χαρακτήρες
    const filtered = val.replace(/\D/g, '');
    setAnswers((prev) => ({ ...prev, [id]: filtered }));
  };

  const handleMcqSelect = (id, option) => {
    if (submitted[id]) return;
    setAnswers((prev) => ({ ...prev, [id]: option }));
  };

  const handleSubmitQuestion = (id) => {
    if (!answers[id] || submitted[id]) return;
    setSubmitted((prev) => ({ ...prev, [id]: true }));
  };

  // Υπολογισμός σκορ
  const answeredCount = Object.keys(submitted).length;
  const correctCount = questions.reduce((acc, q) => {
    if (submitted[q.id] && answers[q.id] === q.correctValue) {
      return acc + 1;
    }
    return acc;
  }, 0);
  const successRate =
    answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  return (
    <Layout
      title="Ασκήσεις: Η Έννοια του Κλάσματος - Ε' Δημοτικού | LearnMaths.gr"
      description="Διαδραστικές, απαιτητικές ασκήσεις στα κλάσματα για την Ε' Δημοτικού με αυτόματη αξιολόγηση και αναλυτική επεξήγηση."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou/01-klasma"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base"
        >
          <span>📖 Θεωρία</span>
        </Link>
      }
    >
      {/* Full-width container βελτιστοποιημένο για 2K / 4K και responsive σε κινητά */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-2 sm:px-6 lg:px-12 py-6 space-y-8 pb-32 sm:pb-36">
        
        {/* Header Σελίδας */}
        <div className="bg-white p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs 2xl:text-sm font-bold text-indigo-700">
              <span>🎯 Ενότητα 1 • Ε' Δημοτικού</span>
            </div>
            <h1 className="text-2xl sm:text-4xl 2xl:text-5xl font-black text-slate-900 tracking-tight">
              Ασκήσεις: Η Έννοια του Κλάσματος
            </h1>
            <p className="text-slate-600 text-sm sm:text-base 2xl:text-lg max-w-3xl leading-relaxed">
              Απάντησε στις 8 απαιτητικές ερωτήσεις. Σε κάθε ερώτηση λαμβάνεις άμεση μαθηματική αιτιολόγηση. Μπορείς να επαναλάβεις το σετ με νέες δυναμικές τιμές ανά πάσα στιγμή.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setKeySeed((prev) => prev + 1)}
            className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm 2xl:text-base shadow-sm transition active:scale-95"
          >
            <span>🔄 Νέες Ασκήσεις</span>
          </button>
        </div>

        {/* Πλέγμα Ερωτήσεων: 1 στήλη σε κινητά, 2 στήλες σε desktop/2K, 3-4 στήλες σε 4K (3xl+) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-3 4xl:grid-cols-4 gap-6 2xl:gap-8">
          {questions.map((q, idx) => {
            const isAnswered = !!submitted[q.id];
            const isCorrect = isAnswered && answers[q.id] === q.correctValue;
            const inputFieldId = `${baseInputId}-${q.id}`;

            return (
              <div
                key={`${q.id}-${keySeed}`}
                className={`bg-white rounded-3xl border transition-all duration-200 flex flex-col justify-between p-6 sm:p-7 2xl:p-8 shadow-sm ${
                  isAnswered
                    ? isCorrect
                      ? 'border-emerald-300 ring-2 ring-emerald-100'
                      : 'border-rose-300 ring-2 ring-rose-100'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-4">
                  {/* Τίτλος & Ένδειξη Κατάστασης */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs 2xl:text-sm font-black rounded-lg uppercase tracking-wider">
                      {q.title}
                    </span>
                    {isAnswered && (
                      <span
                        className={`text-xs 2xl:text-sm font-black px-2.5 py-1 rounded-lg border ${
                          isCorrect
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}
                      >
                        {isCorrect ? 'Σωστή Επιλογή' : 'Μη Ορθή Επιλογή'}
                      </span>
                    )}
                  </div>

                  {/* Εκφώνηση */}
                  <p className="text-slate-800 text-sm sm:text-base 2xl:text-lg font-medium leading-relaxed">
                    {q.text}
                  </p>

                  {/* Περιοχή Απάντησης */}
                  <div className="pt-2">
                    {q.type === 'mcq' ? (
                      /* Ερώτηση Πολλαπλής Επιλογής (MCQ - 4 Επιλογές) */
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = answers[q.id] === opt;
                          return (
                            <button
                              key={`opt-${idx}-${optIdx}`}
                              type="button"
                              onClick={() => handleMcqSelect(q.id, opt)}
                              disabled={isAnswered}
                              className={`p-3.5 rounded-2xl border text-sm sm:text-base 2xl:text-lg font-mono font-bold transition flex items-center justify-center select-none touch-manipulation active:scale-98 ${
                                isSelected
                                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm'
                                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                              } disabled:pointer-events-none`}
                            >
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      /* Ερώτηση Εισαγωγής Αριθμού (Input) */
                      <div className="space-y-2">
                        <label
                          htmlFor={inputFieldId}
                          className="block text-xs 2xl:text-sm font-bold text-slate-500 uppercase tracking-wider"
                        >
                          Συμπλήρωσε την τιμή ({q.unit}):
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            id={inputFieldId}
                            name={inputFieldId}
                            type="text"
                            inputMode="numeric"
                            autoComplete="off"
                            disabled={isAnswered}
                            value={answers[q.id] || ''}
                            onChange={(e) => handleInputChange(q.id, e.target.value)}
                            placeholder="?"
                            className="w-32 2xl:w-40 h-12 2xl:h-14 px-4 text-center text-xl 2xl:text-2xl font-mono font-black border-2 border-slate-300 rounded-2xl focus:border-indigo-600 focus:outline-none bg-slate-50 focus:bg-white text-slate-900 disabled:opacity-75 disabled:bg-slate-100 transition"
                          />
                          <span className="text-sm 2xl:text-base font-semibold text-slate-600">
                            {q.unit}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ενέργεια Ελέγχου & Επεξήγηση Feedback */}
                <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                  {!isAnswered ? (
                    <button
                      type="button"
                      onClick={() => handleSubmitQuestion(q.id)}
                      disabled={!answers[q.id]}
                      className="w-full py-3 2xl:py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:pointer-events-none text-white font-black text-sm 2xl:text-base shadow-sm transition active:scale-95"
                    >
                      Έλεγχος Απάντησης
                    </button>
                  ) : (
                    <div
                      className={`p-4 rounded-2xl border text-xs sm:text-sm 2xl:text-base leading-relaxed ${
                        isCorrect
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                          : 'bg-rose-50/70 border-rose-200 text-rose-950'
                      }`}
                    >
                      <div className="font-mono font-semibold">
                        {q.explanation}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FIXED BOTTOM SCORE BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-950/95 backdrop-blur-md border-t border-slate-800 text-white py-3.5 px-4 sm:px-8 z-50 shadow-2xl">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6 2xl:gap-10">
            <div>
              <div className="text-[10px] 2xl:text-xs uppercase tracking-wider text-slate-400 font-bold">
                Σκορ
              </div>
              <div className="text-lg sm:text-2xl 2xl:text-3xl font-mono font-black text-white">
                {correctCount}{' '}
                <span className="text-slate-500 text-sm sm:text-lg">/ {questions.length}</span>
              </div>
            </div>

            <div className="hidden sm:block h-8 w-[1px] bg-slate-800"></div>

            <div>
              <div className="text-[10px] 2xl:text-xs uppercase tracking-wider text-slate-400 font-bold">
                Απαντημένες
              </div>
              <div className="text-lg sm:text-2xl 2xl:text-3xl font-mono font-black text-sky-400">
                {answeredCount}{' '}
                <span className="text-slate-500 text-sm sm:text-lg">/ {questions.length}</span>
              </div>
            </div>

            <div className="hidden sm:block h-8 w-[1px] bg-slate-800"></div>

            <div>
              <div className="text-[10px] 2xl:text-xs uppercase tracking-wider text-slate-400 font-bold">
                Επιτυχία
              </div>
              <div className="text-lg sm:text-2xl 2xl:text-3xl font-mono font-black text-amber-400">
                {successRate}%
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setKeySeed((prev) => prev + 1)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 2xl:px-7 2xl:py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm 2xl:text-base shadow-md transition active:scale-95 ml-auto sm:ml-0"
          >
            <span>🔄 Νέες Ασκήσεις</span>
          </button>
        </div>
      </div>
    </Layout>
  );
}
