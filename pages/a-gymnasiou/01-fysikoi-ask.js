import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Βοηθητική συνάρτηση τυχαίου ακέραιου [min, max]
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Βοηθητική συνάρτηση ανακατέματος πίνακα (Fisher-Yates)
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// ==========================================
// ΔΕΞΑΜΕΝΗ 20 ΔΙΑΦΟΡΕΤΙΚΩΝ ΤΥΠΩΝ ΑΣΚΗΣΕΩΝ
// ==========================================
const EXERCISE_GENERATORS = [
  // 1. Δύναμη φυσικού (Input)
  () => {
    const base = randInt(2, 6);
    const exp = randInt(2, 4);
    const ans = Math.pow(base, exp);
    return {
      type: 'input',
      topic: 'Δυνάμεις',
      question: `Υπολόγισε την τιμή της δύναμης: ${base}<sup>${exp}</sup>`,
      correctAnswer: ans.toString(),
      solution: `${base}<sup>${exp}</sup> ＝ ${Array(exp).fill(base).join(' · ')} ＝ ${ans}`,
    };
  },

  // 2. Δύναμη με εκθέτη 0 (MCQ)
  () => {
    const base = randInt(12, 99);
    return {
      type: 'mcq',
      topic: 'Ιδιότητες Δυνάμεων',
      question: `Ποια είναι η τιμή της παράστασης ${base}<sup>0</sup> ;`,
      options: shuffleArray(['1', '0', `${base}`, `${base * 10}`]),
      correctAnswer: '1',
      solution: `Για κάθε φυσικό αριθμό α ≠ 0 ισχύει εξ ορισμού ότι α<sup>0</sup> ＝ 1. Επομένως ${base}<sup>0</sup> ＝ 1.`,
    };
  },

  // 3. Δύναμη με βάση το 10 (Input)
  () => {
    const exp = randInt(2, 5);
    const ans = Math.pow(10, exp);
    return {
      type: 'input',
      topic: 'Δυνάμεις του 10',
      question: `Υπολόγισε την τιμή της δύναμης του 10: 10<sup>${exp}</sup>`,
      correctAnswer: ans.toString(),
      solution: `Το 10<sup>${exp}</sup> ισούται με τη μονάδα ακολουθούμενη από ${exp} μηδενικά, δηλαδή ${ans.toLocaleString('el-GR')}.`,
    };
  },

  // 4. Επιμεριστική ιδιότητα ως προς την πρόσθεση (Input)
  () => {
    const a = randInt(3, 8);
    const b = randInt(10, 20);
    const c = randInt(2, 9);
    const ans = a * (b + c);
    return {
      type: 'input',
      topic: 'Επιμεριστική Ιδιότητα',
      question: `Υπολόγισε την τιμή της παράστασης: ${a} · (${b} ＋ ${c})`,
      correctAnswer: ans.toString(),
      solution: `Εφαρμόζοντας την επιμεριστική ιδιότητα: ${a} · (${b} ＋ ${c}) ＝ ${a} · ${b} ＋ ${a} · ${c} ＝ ${a * b} ＋ ${a * c} ＝ ${ans}.`,
    };
  },

  // 5. Επιμεριστική ιδιότητα ως προς την αφαίρεση (Input)
  () => {
    const a = randInt(4, 9);
    const b = randInt(15, 25);
    const c = randInt(2, 10);
    const ans = a * (b - c);
    return {
      type: 'input',
      topic: 'Επιμεριστική Ιδιότητα',
      question: `Υπολόγισε την τιμή: ${a} · ${b} － ${a} · ${c}`,
      correctAnswer: ans.toString(),
      solution: `Βγάζουμε κοινό παράγοντα το ${a}: ${a} · (${b} － ${c}) ＝ ${a} · ${b - c} ＝ ${ans}.`,
    };
  },

  // 6. Αναγνώριση ιδιότητας πολλαπλασιασμού (MCQ)
  () => {
    const a = randInt(12, 45);
    const b = randInt(50, 99);
    return {
      type: 'mcq',
      topic: 'Ιδιότητες Πολλαπλασιασμού',
      question: `Ποια ιδιότητα εκφράζει η ισότητα: ${a} · ${b} ＝ ${b} · ${a} ;`,
      options: shuffleArray([
        'Αντιμεταθετική ιδιότητα',
        'Προσεταιριστική ιδιότητα',
        'Επιμεριστική ιδιότητα',
        'Ουδέτερο στοιχείο',
      ]),
      correctAnswer: 'Αντιμεταθετική ιδιότητα',
      solution: `Η αλλαγή της σειράς των παραγόντων χωρίς να μεταβάλλεται το γινόμενο είναι η Αντιμεταθετική ιδιότητα (α · β ＝ β · α).`,
    };
  },

  // 7. Προσεταιριστική ιδιότητα (Input)
  () => {
    const a = 25;
    const b = randInt(11, 39);
    const c = 4;
    const ans = a * b * c;
    return {
      type: 'input',
      topic: 'Προσεταιριστική Ιδιότητα',
      question: `Υπολόγισε έξυπνα το γινόμενο: ${a} · ${b} · ${c}`,
      correctAnswer: ans.toString(),
      solution: `Ομαδοποιούμε προσεταιριστικά: (${a} · ${c}) · ${b} ＝ 100 · ${b} ＝ ${ans}.`,
    };
  },

  // 8. Μηδενικό στοιχείο πολλαπλασιασμού (MCQ)
  () => {
    const a = randInt(10, 80);
    const b = randInt(10, 80);
    return {
      type: 'mcq',
      topic: 'Πολλαπλασιασμός με το Μηδέν',
      question: `Ποιο είναι το αποτέλεσμα της παράστασης: (${a} · ${b}) · 0 · 15 ;`,
      options: shuffleArray(['0', '1', `${a * b}`, '15']),
      correctAnswer: '0',
      solution: `Το 0 είναι το απορροφητικό (μηδενικό) στοιχείο του πολλαπλασιασμού: κάθε γινόμενο που περιέχει παράγοντα 0 ισούται με 0.`,
    };
  },

  // 9. Άθροισμα δυνάμεων (Input)
  () => {
    const a = randInt(2, 4);
    const b = randInt(2, 3);
    const valA = Math.pow(a, 2);
    const valB = Math.pow(b, 3);
    const ans = valA + valB;
    return {
      type: 'input',
      topic: 'Υπολογισμός Δυνάμεων',
      question: `Υπολόγισε την τιμή: ${a}<sup>2</sup> ＋ ${b}<sup>3</sup>`,
      correctAnswer: ans.toString(),
      solution: `${a}<sup>2</sup> ＝ ${valA} και ${b}<sup>3</sup> ＝ ${valB}. Άρα ${valA} ＋ ${valB} ＝ ${ans}.`,
    };
  },

  // 10. Προτεραιότητα πράξεων: Πολλαπλασιασμός πριν την πρόσθεση (Input)
  () => {
    const a = randInt(10, 30);
    const b = randInt(3, 8);
    const c = randInt(4, 7);
    const ans = a + b * c;
    return {
      type: 'input',
      topic: 'Προτεραιότητα Πράξεων',
      question: `Υπολόγισε το αποτέλεσμα: ${a} ＋ ${b} · ${c}`,
      correctAnswer: ans.toString(),
      solution: `Προηγείται ο πολλαπλασιασμός: ${b} · ${c} ＝ ${b * c}. Στη συνέχεια προσθέτουμε: ${a} ＋ ${b * c} ＝ ${ans}.`,
    };
  },

  // 11. Προτεραιότητα πράξεων με δύναμη (Input)
  () => {
    const a = randInt(2, 5);
    const b = randInt(2, 3);
    const c = randInt(5, 15);
    const ans = a * Math.pow(b, 2) + c;
    return {
      type: 'input',
      topic: 'Προτεραιότητα Πράξεων',
      question: `Υπολόγισε: ${a} · ${b}<sup>2</sup> ＋ ${c}`,
      correctAnswer: ans.toString(),
      solution: `Πρώτα εκτελούμε τη δύναμη: ${b}<sup>2</sup> ＝ ${b * b}. Μετά τον πολλαπλασιασμό: ${a} · ${b * b} ＝ ${a * b * b}. Τέλος την πρόσθεση: ${a * b * b} ＋ ${c} ＝ ${ans}.`,
    };
  },

  // 12. Σύγκριση δυνάμεων (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'Σύγκριση Δυνάμεων',
      question: `Ποια σχέση ισχύει μεταξύ του 2<sup>4</sup> και του 4<sup>2</sup> ;`,
      options: shuffleArray(['2⁴ ＝ 4²', '2⁴ ＞ 4²', '2⁴ ＜ 4²']),
      correctAnswer: '2⁴ ＝ 4²',
      solution: `2<sup>4</sup> ＝ 16 και 4<sup>2</sup> ＝ 16. Επομένως 2<sup>4</sup> ＝ 4<sup>2</sup>.`,
    };
  },

  // 13. Δύναμη με βάση το 0 (MCQ)
  () => {
    const exp = randInt(3, 9);
    return {
      type: 'mcq',
      topic: 'Ιδιότητες Δυνάμεων',
      question: `Ποια είναι η τιμή της δύναμης 0<sup>${exp}</sup> ;`,
      options: shuffleArray(['0', '1', `${exp}`, 'Δεν ορίζεται']),
      correctAnswer: '0',
      solution: `Για κάθε φυσικό αριθμό ν ≠ 0 ισχύει ότι 0<sup>ν</sup> ＝ 0.`,
    };
  },

  // 14. Δύναμη με βάση το 1 (MCQ)
  () => {
    const exp = randInt(25, 150);
    return {
      type: 'mcq',
      topic: 'Ιδιότητες Δυνάμεων',
      question: `Ποια είναι η τιμή της δύναμης 1<sup>${exp}</sup> ;`,
      options: shuffleArray(['1', '0', `${exp}`, `${exp * 10}`]),
      correctAnswer: '1',
      solution: `Η μονάδα υψωμένη σε οποιαδήποτε δύναμη ισούται πάντα με 1 (1<sup>ν</sup> ＝ 1).`,
    };
  },

  // 15. Γραφή γινομένου ως δύναμη (MCQ)
  () => {
    const base = randInt(3, 7);
    const times = randInt(4, 6);
    const prodStr = Array(times).fill(base).join(' · ');
    return {
      type: 'mcq',
      topic: 'Έννοια Δύναμης',
      question: `Πώς γράφεται συνοπτικά το γινόμενο: ${prodStr} ;`,
      options: shuffleArray([
        `${base}<sup>${times}</sup>`,
        `${times}<sup>${base}</sup>`,
        `${base} · ${times}`,
        `${base + times}`,
      ]),
      correctAnswer: `${base}<sup>${times}</sup>`,
      solution: `Το γινόμενο ${times} ίσων παραγόντων με τιμή ${base} γράφεται ως δύναμη με βάση το ${base} και εκθέτη το ${times}, δηλαδή ${base}<sup>${times}</sup>.`,
    };
  },

  // 16. Διαδοχικοί φυσικοί αριθμοί (Input)
  () => {
    const n = randInt(15, 60);
    const ans = n + (n + 1);
    return {
      type: 'input',
      topic: 'Φυσικοί Αριθμοί',
      question: `Βρες το άθροισμα του φυσικού αριθμού ${n} και του αμέσως επόμενου (διαδοχικού) του.`,
      correctAnswer: ans.toString(),
      solution: `Ο επόμενος του ${n} είναι ο ${n + 1}. Το άθροισμά τους είναι ${n} ＋ ${n + 1} ＝ ${ans}.`,
    };
  },

  // 17. Πλήθος μηδενικών σε δύναμη του 10 (MCQ)
  () => {
    const exp = randInt(4, 8);
    return {
      type: 'mcq',
      topic: 'Δυνάμεις του 10',
      question: `Πόσα μηδενικά έχει ο αριθμός που προκύπτει από τη δύναμη 10<sup>${exp}</sup> ;`,
      options: shuffleArray([`${exp}`, `${exp - 1}`, `${exp + 1}`, `${exp * 10}`]),
      correctAnswer: `${exp}`,
      solution: `Σε κάθε δύναμη 10<sup>ν</sup>, ο αριθμός των μηδενικών μετά το 1 είναι ίσος με τον εκθέτη ν. Άρα έχει ${exp} μηδενικά.`,
    };
  },

  // 18. Ουδέτερο στοιχείο πολλαπλασιασμού (MCQ)
  () => {
    return {
      type: 'mcq',
      topic: 'Ιδιότητες Πολλαπλασιασμού',
      question: `Ποιος αριθμός αποτελεί το ουδέτερο στοιχείο του πολλαπλασιασμού στους φυσικούς αριθμούς;`,
      options: shuffleArray(['Το 1', 'Το 0', 'Το 2', 'Δεν υπάρχει']),
      correctAnswer: 'Το 1',
      solution: `Το 1 είναι το ουδέτερο στοιχείο του πολλαπλασιασμού, επειδή α · 1 ＝ 1 · α ＝ α για κάθε φυσικό αριθμό α.`,
    };
  },

  // 19. Προτεραιότητα παρενθέσεων και πολλαπλασιασμού (Input)
  () => {
    const a = randInt(2, 6);
    const b = randInt(3, 8);
    const c = randInt(2, 5);
    const ans = (a + b) * c;
    return {
      type: 'input',
      topic: 'Προτεραιότητα Πράξεων',
      question: `Υπολόγισε το αποτέλεσμα: (${a} ＋ ${b}) · ${c}`,
      correctAnswer: ans.toString(),
      solution: `Πρώτα εκτελούμε την πράξη μέσα στην παρένθεση: ${a} ＋ ${b} ＝ ${a + b}. Στη συνέχεια πολλαπλασιάζουμε: ${a + b} · ${c} ＝ ${ans}.`,
    };
  },

  // 20. Διαφορά τετραγώνων φυσικών (Input)
  () => {
    const a = randInt(6, 10);
    const b = randInt(2, 5);
    const ans = Math.pow(a, 2) - Math.pow(b, 2);
    return {
      type: 'input',
      topic: 'Υπολογισμός Δυνάμεων',
      question: `Υπολόγισε την τιμή: ${a}<sup>2</sup> － ${b}<sup>2</sup>`,
      correctAnswer: ans.toString(),
      solution: `${a}<sup>2</sup> ＝ ${a * a} και ${b}<sup>2</sup> ＝ ${b * b}. Άρα ${a * a} － ${b * b} ＝ ${ans}.`,
    };
  },
];

export default function FysikoiAsk() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Δημιουργία 10 τυχαίων ερωτήσεων από τη δεξαμενή
  const generateQuestions = () => {
    const shuffledGen = shuffleArray(EXERCISE_GENERATORS);
    const selected = shuffledGen.slice(0, 10).map((gen, idx) => ({
      id: idx + 1,
      ...gen(),
    }));
    setQuestions(selected);
    setUserAnswers({});
    setIsSubmitted(false);
    setScore(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    generateQuestions();
  }, []);

  // Αυστηρός έλεγχος εισαγωγής input
  const handleInputChange = (id, val) => {
    if (isSubmitted) return;
    let clean = val.replace('.', ',');
    clean = clean.replace(/[^0-9,]/g, '');
    const commaCount = (clean.match(/,/g) || []).length;
    if (commaCount > 1) return;
    if (clean.length > 10) return;

    setUserAnswers((prev) => ({ ...prev, [id]: clean }));
  };

  const handleMCQSelect = (id, option) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [id]: option }));
  };

  // Έλεγχος απαντήσεων
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitted) return;

    let totalCorrect = 0;
    questions.forEach((q) => {
      const userAns = (userAnswers[q.id] || '').trim().replace(/\s+/g, '');
      const correctAns = q.correctAnswer.trim().replace(/\s+/g, '');
      if (userAns === correctAns) {
        totalCorrect += 1;
      }
    });

    setScore(totalCorrect);
    setIsSubmitted(true);
  };

  const answeredCount = Object.keys(userAnswers).filter(
    (k) => userAnswers[k] && userAnswers[k].trim() !== ''
  ).length;

  const scorePercentage = Math.round((score / 10) * 100);

  return (
    <Layout
      title="Ασκήσεις: Φυσικοί Αριθμοί & Δυνάμεις | Α' Γυμνασίου"
      description="Εξάσκηση με 10 δυναμικές ασκήσεις στους φυσικούς αριθμούς, τον πολλαπλασιασμό και τις δυνάμεις για την Α' Γυμνασίου."
      backUrl="/a-gymnasiou"
      backText="Α' Γυμνασίου"
      hideFooter={true}
      actionButton={
        <Link
          href="/a-gymnasiou/01-fysikoi"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all shadow-md"
        >
          <span>📖</span>
          <span>ΘΕΩΡΙΑ</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 pb-32 sm:pb-36 space-y-8">
        {/* Banner Header - Ενιαίο Indigo Theme της Α' Γυμνασίου */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Α' ΓΥΜΝΑΣΙΟΥ • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Φυσικοί Αριθμοί, Πολλαπλασιασμός & Δυνάμεις
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Απάντησε στις παρακάτω 10 επιλεγμένες ασκήσεις. Στο τέλος πάτησε «ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ» για να δεις τη βαθμολογία και την αναλυτική λύση κάθε άσκησης.
            </p>
          </div>
        </section>

        {/* Φόρμα Ασκήσεων */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
            {questions.map((q) => {
              const userAns = userAnswers[q.id] || '';
              const isCorrect =
                isSubmitted &&
                userAns.trim().replace(/\s+/g, '') ===
                  q.correctAnswer.trim().replace(/\s+/g, '');

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all shadow-sm flex flex-col justify-between space-y-4 ${
                    isSubmitted
                      ? isCorrect
                        ? 'border-emerald-400 ring-2 ring-emerald-100'
                        : 'border-rose-400 ring-2 ring-rose-100'
                      : 'border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-extrabold text-xs sm:text-sm">
                        {q.id}
                      </span>
                      <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase bg-slate-100 px-2.5 py-1 rounded-md">
                        {q.topic}
                      </span>
                    </div>

                    <div
                      className="text-slate-900 font-semibold text-base sm:text-lg leading-snug"
                      dangerouslySetInnerHTML={{ __html: q.question }}
                    />
                  </div>

                  {/* Τύπος Ερώτησης: Input ή MCQ */}
                  <div className="space-y-2 pt-2">
                    {q.type === 'input' ? (
                      <div className="relative max-w-xs">
                        <input
                          type="text"
                          inputMode="decimal"
                          maxLength={10}
                          disabled={isSubmitted}
                          placeholder="Απάντηση..."
                          value={userAns}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          className={`w-full h-11 px-4 text-base font-bold rounded-xl border transition-all outline-none ${
                            isSubmitted
                              ? isCorrect
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                                : 'bg-rose-50 border-rose-500 text-rose-950'
                              : 'bg-slate-50 border-slate-300 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-slate-900'
                          }`}
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = userAns === opt;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              disabled={isSubmitted}
                              onClick={() => handleMCQSelect(q.id, opt)}
                              className={`h-11 px-3 text-xs sm:text-sm font-bold rounded-xl border text-left flex items-center justify-between transition-all touch-manipulation active:scale-[0.98] ${
                                isSelected
                                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              } ${isSubmitted ? 'cursor-default' : ''}`}
                            >
                              <span dangerouslySetInnerHTML={{ __html: opt }} />
                              {isSelected && <span>✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Feedback & Λύση μετά την υποβολή */}
                    {isSubmitted && (
                      <div
                        className={`p-3.5 rounded-xl text-xs sm:text-sm space-y-1.5 mt-3 border ${
                          isCorrect
                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                            : 'bg-rose-50/70 border-rose-200 text-rose-900'
                        }`}
                      >
                        <div className="font-extrabold flex items-center gap-1.5">
                          {isCorrect ? (
                            <>
                              <span>✅</span>
                              <span>ΣΩΣΤΟ!</span>
                            </>
                          ) : (
                            <>
                              <span>❌</span>
                              <span>
                                ΛΑΘΟΣ (Σωστό: <span dangerouslySetInnerHTML={{ __html: q.correctAnswer }} />)
                              </span>
                            </>
                          )}
                        </div>
                        <div
                          className="text-slate-700 leading-relaxed font-normal"
                          dangerouslySetInnerHTML={{ __html: q.solution }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Κουμπί Υποβολής εντός φόρμας */}
          <div className="flex justify-center pt-4">
            {!isSubmitted ? (
              <button
                type="submit"
                disabled={answeredCount === 0}
                className="w-full sm:w-auto min-w-[260px] h-13 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>🎯</span>
                <span>ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΕΩΝ</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="w-full sm:w-auto min-w-[260px] h-13 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                <span>ΝΕΕΣ ΑΣΚΗΣΕΙΣ</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* FIXED BOTTOM SCORE BAR */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3 px-4 sm:px-8 shadow-2xl">
        <div className="max-w-[1920px] 2xl:max-w-[2400px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                {isSubmitted ? 'ΤΕΛΙΚΟ ΣΚΟΡ' : 'ΠΡΟΟΔΟΣ'}
              </div>
              <div className="text-base sm:text-xl font-black text-amber-400 font-mono">
                {isSubmitted ? `${score} / 10` : `${answeredCount} / 10`}
              </div>
            </div>

            {isSubmitted && (
              <div className="border-l border-slate-700 pl-4 sm:pl-6 hidden xs:block">
                <div className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                  ΕΠΙΤΥΧΙΑ
                </div>
                <div
                  className={`text-base sm:text-xl font-black font-mono ${
                    scorePercentage >= 80
                      ? 'text-emerald-400'
                      : scorePercentage >= 50
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {scorePercentage}%
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={generateQuestions}
              className="px-3 sm:px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-xs sm:text-sm rounded-xl border border-slate-700 transition flex items-center gap-1.5"
            >
              <span>🔄</span>
              <span className="hidden sm:inline">ΝΕΕΣ ΑΣΚΗΣΕΙΣ</span>
            </button>

            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={answeredCount === 0}
                className="px-4 sm:px-6 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <span>🎯</span>
                <span>ΕΛΕΓΧΟΣ</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={generateQuestions}
                className="px-4 sm:px-6 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition"
              >
                ΕΠΑΝΑΛΗΨΗ
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
