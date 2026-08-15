import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// SVG Αναπτύγματα για τις ερωτήσεις αναγνώρισης
const NETS_SVGS = {
  cube: (
    <svg className="w-36 h-36 mx-auto" viewBox="0 0 200 200">
      <rect x="75" y="20" width="40" height="40" fill="#60a5fa" fillOpacity="0.4" stroke="#1d4ed8" strokeWidth="2" />
      <rect x="75" y="60" width="40" height="40" fill="#3b82f6" fillOpacity="0.5" stroke="#1d4ed8" strokeWidth="2" />
      <rect x="35" y="60" width="40" height="40" fill="#93c5fd" fillOpacity="0.4" stroke="#1d4ed8" strokeWidth="2" />
      <rect x="115" y="60" width="40" height="40" fill="#93c5fd" fillOpacity="0.4" stroke="#1d4ed8" strokeWidth="2" />
      <rect x="75" y="100" width="40" height="40" fill="#2563eb" fillOpacity="0.5" stroke="#1d4ed8" strokeWidth="2" />
      <rect x="75" y="140" width="40" height="40" fill="#1d4ed8" fillOpacity="0.4" stroke="#1d4ed8" strokeWidth="2" />
      <line x1="75" y1="60" x2="115" y2="60" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3" />
      <line x1="75" y1="100" x2="115" y2="100" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3" />
      <line x1="75" y1="140" x2="115" y2="140" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3" />
      <line x1="75" y1="60" x2="75" y2="100" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3" />
      <line x1="115" y1="60" x2="115" y2="100" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3" />
    </svg>
  ),
  cuboid: (
    <svg className="w-36 h-36 mx-auto" viewBox="0 0 200 200">
      <rect x="63" y="16" width="74" height="26" fill="#2dd4bf" fillOpacity="0.45" stroke="#0f766e" strokeWidth="2" />
      <rect x="63" y="42" width="74" height="38" fill="#14b8a6" fillOpacity="0.55" stroke="#0f766e" strokeWidth="2" />
      <rect x="37" y="42" width="26" height="38" fill="#5eead4" fillOpacity="0.4" stroke="#0f766e" strokeWidth="2" />
      <rect x="137" y="42" width="26" height="38" fill="#5eead4" fillOpacity="0.4" stroke="#0f766e" strokeWidth="2" />
      <rect x="63" y="80" width="74" height="26" fill="#0d9488" fillOpacity="0.55" stroke="#0f766e" strokeWidth="2" />
      <rect x="63" y="106" width="74" height="38" fill="#0f766e" fillOpacity="0.45" stroke="#0f766e" strokeWidth="2" />
      <line x1="63" y1="42" x2="137" y2="42" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3" />
      <line x1="63" y1="80" x2="137" y2="80" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3" />
      <line x1="63" y1="106" x2="137" y2="106" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3" />
      <line x1="63" y1="42" x2="63" y2="80" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3" />
      <line x1="137" y1="42" x2="137" y2="80" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3" />
    </svg>
  ),
  sqPyramid: (
    <svg className="w-36 h-36 mx-auto" viewBox="0 0 200 200">
      <rect x="75" y="75" width="50" height="50" fill="#fbbf24" fillOpacity="0.5" stroke="#b45309" strokeWidth="2" />
      <polygon points="75,75 125,75 100,25" fill="#f59e0b" fillOpacity="0.4" stroke="#b45309" strokeWidth="2" />
      <polygon points="75,125 125,125 100,175" fill="#f59e0b" fillOpacity="0.4" stroke="#b45309" strokeWidth="2" />
      <polygon points="75,75 75,125 25,100" fill="#d97706" fillOpacity="0.4" stroke="#b45309" strokeWidth="2" />
      <polygon points="125,75 125,125 175,100" fill="#d97706" fillOpacity="0.4" stroke="#b45309" strokeWidth="2" />
      <rect x="75" y="75" width="50" height="50" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3" />
    </svg>
  ),
  triPyramid: (
    <svg className="w-36 h-36 mx-auto" viewBox="0 0 200 200">
      <polygon points="100,30 35,145 165,145" fill="#fda4af" fillOpacity="0.3" stroke="#be123c" strokeWidth="2" />
      <polygon points="67.5,87.5 132.5,87.5 100,145" fill="#f43f5e" fillOpacity="0.5" stroke="#be123c" strokeWidth="2" />
      <polygon points="67.5,87.5 132.5,87.5 100,145" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3" />
    </svg>
  ),
  cylinder: (
    <svg className="w-36 h-36 mx-auto" viewBox="0 0 200 200">
      <circle cx="100" cy="38" r="22" fill="#a78bfa" fillOpacity="0.5" stroke="#6d28d9" strokeWidth="2" />
      <rect x="40" y="65" width="120" height="70" fill="#8b5cf6" fillOpacity="0.4" stroke="#6d28d9" strokeWidth="2" />
      <circle cx="100" cy="162" r="22" fill="#a78bfa" fillOpacity="0.5" stroke="#6d28d9" strokeWidth="2" />
      <circle cx="100" cy="65" r="3" fill="#f59e0b" />
      <circle cx="100" cy="135" r="3" fill="#f59e0b" />
    </svg>
  ),
  cone: (
    <svg className="w-36 h-36 mx-auto" viewBox="0 0 200 200">
      <path d="M 100,25 L 35,95 A 95,95 0 0,0 165,95 Z" fill="#06b6d4" fillOpacity="0.4" stroke="#0e7490" strokeWidth="2.5" />
      <circle cx="100" cy="144" r="24" fill="#67e8f9" fillOpacity="0.6" stroke="#0e7490" strokeWidth="2.5" />
      <circle cx="100" cy="25" r="3.5" fill="#fbbf24" />
      <circle cx="100" cy="120" r="3" fill="#f59e0b" />
    </svg>
  )
};

const NETS_DATABASE = [
  { key: 'cube', name: 'Κύβος', shapes: '6 ίσα τετράγωνα' },
  { key: 'cuboid', name: 'Ορθογώνιο Παραλληλεπίπεδο', shapes: '6 ορθογώνια παραλληλόγραμμα' },
  { key: 'sqPyramid', name: 'Τετραγωνική Πυραμίδα', shapes: '1 τετράγωνο και 4 τρίγωνα' },
  { key: 'triPyramid', name: 'Τριγωνική Πυραμίδα', shapes: '4 τρίγωνα' },
  { key: 'cylinder', name: 'Κύλινδρος', shapes: '1 ορθογώνιο και 2 ίσοι κύκλοι' },
  { key: 'cone', name: 'Κώνος', shapes: '1 κυκλικός τομέας και 1 κύκλος' }
];

// Helper δημιουργίας ερώτησης αναγνώρισης για συγκεκριμένο στερεό
function makeRecognitionForSolid(solid) {
  const correctName = solid.name;
  const allNames = ['Κύβος', 'Ορθογώνιο Παραλληλεπίπεδο', 'Τετραγωνική Πυραμίδα', 'Τριγωνική Πυραμίδα', 'Κύλινδρος', 'Κώνος', 'Σφαίρα'];
  const wrongs = allNames.filter(n => n !== correctName);
  const shuffledWrongs = wrongs.sort(() => Math.random() - 0.5).slice(0, 3);
  const options = [correctName, ...shuffledWrongs].sort(() => Math.random() - 0.5);

  return {
    q: 'Αν διπλώσουμε το παρακάτω ανάπτυγμα, ποιο γεωμετρικό στερεό θα σχηματιστεί;',
    svg: NETS_SVGS[solid.key],
    options,
    correct: correctName,
    explain: `Το συγκεκριμένο ανάπτυγμα αποτελείται από ${solid.shapes} και σχηματίζει: ${correctName}.`
  };
}

// Δεξαμενή ερωτήσεων καταμέτρησης
const COUNT_QUESTIONS_POOL = [
  {
    q: 'Από πόσα ίσα τετράγωνα αποτελείται το επίπεδο ανάπτυγμα ενός Κύβου;',
    correct: 6,
    explain: 'Ο κύβος έχει 6 ίσες τετράγωνες έδρες, άρα το ανάπτυγμά του έχει 6 τετράγωνα.'
  },
  {
    q: 'Πόσα τρίγωνα έχει συνολικά το ανάπτυγμα μιας Τετραγωνικής Πυραμίδας;',
    correct: 4,
    explain: 'Η τετραγωνική πυραμίδα έχει 1 τετράγωνη βάση και 4 τριγωνικές παράπλευρες έδρες.'
  },
  {
    q: 'Από πόσα τρίγωνα αποτελείται συνολικά το ανάπτυγμα μιας Τριγωνικής Πυραμίδας (Τετραέδρου);',
    correct: 4,
    explain: 'Η τριγωνική πυραμίδα αποτελείται από 4 τρίγωνα (1 βάση + 3 πλαϊνές έδρες).'
  },
  {
    q: 'Πόσους κυκλικούς δίσκους (βάσεις) έχει το ανάπτυγμα ενός Κυλίνδρου;',
    correct: 2,
    explain: 'Ο κύλινδρος έχει 2 ίσους κυκλικούς δίσκους (την πάνω και την κάτω βάση).'
  },
  {
    q: 'Από πόσα ορθογώνια παραλληλόγραμμα αποτελείται το ανάπτυγμα ενός Ορθογωνίου Παραλληλεπιπέδου;',
    correct: 6,
    explain: 'Το ορθογώνιο παραλληλεπίπεδο αποτελείται από 6 ορθογώνια (ανά 2 απέναντι ίσα).'
  }
];

// Δεξαμενή ερωτήσεων αντιστοίχισης περιγραφής
const DESCRIPTION_MATCHING_POOL = [
  {
    desc: '1 ορθογώνιο παραλληλόγραμμο και 2 ίσοι κυκλικοί δίσκοι',
    correct: 'Κύλινδρος',
    wrongs: ['Κώνος', 'Κύβος', 'Σφαίρα']
  },
  {
    desc: '1 κυκλικός τομέας (τμήμα κύκλου) και 1 κυκλικός δίσκος',
    correct: 'Κώνος',
    wrongs: ['Κύλινδρος', 'Τετραγωνική Πυραμίδα', 'Σφαίρα']
  },
  {
    desc: '1 τετράγωνο και 4 ισοσκελή τρίγωνα',
    correct: 'Τετραγωνική Πυραμίδα',
    wrongs: ['Τριγωνική Πυραμίδα', 'Κύβος', 'Ορθογώνιο Παραλληλεπίπεδο']
  },
  {
    desc: '4 ισόπλευρα τρίγωνα',
    correct: 'Τριγωνική Πυραμίδα (Τετράεδρο)',
    wrongs: ['Τετραγωνική Πυραμίδα', 'Κύβος', 'Κώνος']
  },
  {
    desc: '6 ίσα τετράγωνα τοποθετημένα κατάλληλα',
    correct: 'Κύβος',
    wrongs: ['Ορθογώνιο Παραλληλεπίπεδο', 'Τετραγωνική Πυραμίδα', 'Κύλινδρος']
  }
];

// Δεξαμενή ερωτήσεων Σωστού/Λάθους
const TRUE_FALSE_POOL = [
  {
    q: 'Η σφαίρα έχει ένα επίπεδο ανάπτυγμα που αποτελείται από 2 κύκλους.',
    correct: 'Λάθος',
    explain: 'Λάθος! Η σφαίρα δεν έχει επίπεδο ανάπτυγμα επειδή η επιφάνειά της είναι καμπύλη.'
  },
  {
    q: 'Το ανάπτυγμα του κυλίνδρου αποτελείται από 1 ορθογώνιο και 2 κύκλους.',
    correct: 'Σωστό',
    explain: 'Σωστά! Το ορθογώνιο τυλίγεται και σχηματίζει το σώμα του κυλίνδρου.'
  },
  {
    q: 'Όλα τα αναπτύγματα του κύβου έχουν ακριβώς 6 τετράγωνα.',
    correct: 'Σωστό',
    explain: 'Σωστά! Ο κύβος έχει 6 έδρες, άρα κάθε έγκυρο ανάπτυγμά του έχει 6 τετράγωνα.'
  },
  {
    q: 'Στα αναπτύγματα, οι διακεκομμένες γραμμές δείχνουν πού πρέπει να κόψουμε με το ψαλίδι.',
    correct: 'Λάθος',
    explain: 'Λάθος! Οι διακεκομμένες γραμμές δείχνουν πού διπλώνουμε το χαρτί (οι συνεχόμενες είναι για κόψιμο).'
  },
  {
    q: 'Το ανάπτυγμα του κώνου αποτελείται από έναν κυκλικό τομέα και έναν κύκλο.',
    correct: 'Σωστό',
    explain: 'Σωστά! Ο κυκλικός τομέας («βεντάλια») σχηματίζει το χωνάκι και ο κύκλος τη βάση.'
  },
  {
    q: 'Το ανάπτυγμα της τετραγωνικής πυραμίδας έχει 5 τρίγωνα.',
    correct: 'Λάθος',
    explain: 'Λάθος! Έχει 1 τετράγωνο (βάση) και 4 τρίγωνα (παράπλευρες έδρες).'
  }
];

// Δημιουργία 8 Ερωτήσεων ΧΩΡΙΣ ΕΠΑΝΑΛΗΨΕΙΣ
function generateQuestions() {
  // 1. Επιλογή 2 διαφορετικών στερεών για Q1 και Q2
  const shuffledNets = [...NETS_DATABASE].sort(() => Math.random() - 0.5);
  const q1 = makeRecognitionForSolid(shuffledNets[0]);
  const q2 = makeRecognitionForSolid(shuffledNets[1]);

  // 2. Επιλογή 2 διαφορετικών ερωτήσεων καταμέτρησης για Q3 και Q4
  const shuffledCounts = [...COUNT_QUESTIONS_POOL].sort(() => Math.random() - 0.5);
  const q3 = shuffledCounts[0];
  const q4 = shuffledCounts[1];

  // 3. Επιλογή 2 διαφορετικών ερωτήσεων περιγραφής για Q5 και Q6
  const shuffledDesc = [...DESCRIPTION_MATCHING_POOL].sort(() => Math.random() - 0.5);
  const makeDescQuestion = (item) => {
    const options = [item.correct, ...item.wrongs].sort(() => Math.random() - 0.5);
    return {
      q: `Ποιο στερεό έχει ανάπτυγμα που αποτελείται από: «${item.desc}»;`,
      options,
      correct: item.correct,
      explain: `Αυτό είναι το ανάπτυγμα για το στερεό: ${item.correct}.`
    };
  };
  const q5 = makeDescQuestion(shuffledDesc[0]);
  const q6 = makeDescQuestion(shuffledDesc[1]);

  // 4. Επιλογή 2 διαφορετικών ερωτήσεων Σωστό/Λάθος για Q7 και Q8
  const shuffledTF = [...TRUE_FALSE_POOL].sort(() => Math.random() - 0.5);
  const q7 = shuffledTF[0];
  const q8 = shuffledTF[1];

  return { q1, q2, q3, q4, q5, q6, q7, q8 };
}

export default function StereaAnoigmaAskPage() {
  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({ q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '' });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewQuestions = () => {
    setQuestions(generateQuestions());
    setAnswers({ q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '' });
    setSubmitted(false);
    setScore(0);
  };

  useEffect(() => {
    loadNewQuestions();
  }, []);

  if (!questions) return null;

  const handleInputChange = (key, val) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [key]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let currentScore = 0;

    if (answers.q1 === questions.q1.correct) currentScore += 1;
    if (answers.q2 === questions.q2.correct) currentScore += 1;
    if (parseInt(answers.q3, 10) === questions.q3.correct) currentScore += 1;
    if (parseInt(answers.q4, 10) === questions.q4.correct) currentScore += 1;
    if (answers.q5 === questions.q5.correct) currentScore += 1;
    if (answers.q6 === questions.q6.correct) currentScore += 1;
    if (answers.q7 === questions.q7.correct) currentScore += 1;
    if (answers.q8 === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render MCQ Ασκήσεων με SVG (Q1 & Q2)
  const renderSvgMCQQuestion = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (answers[qKey] === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-indigo-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900 leading-snug">{qData.q}</h3>
      </div>

      {qData.svg && (
        <div className="bg-slate-900 p-4 rounded-2xl w-fit mx-auto mb-5 shadow-inner border border-slate-700">
          {qData.svg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-0 md:pl-11">
        {qData.options.map((opt, idx) => (
          <label 
            key={idx} 
            className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
              answers[qKey] === opt 
                ? 'border-indigo-600 bg-indigo-50/80 font-bold text-indigo-900' 
                : 'border-gray-200 hover:bg-gray-50 text-gray-800'
            }`}
          >
            <input 
              type="radio" 
              name={qKey} 
              value={opt}
              checked={answers[qKey] === opt}
              onChange={() => handleInputChange(qKey, opt)}
              disabled={submitted}
              className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm md:text-base font-bold">{opt}</span>
          </label>
        ))}
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {answers[qKey] === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. {qData.explain}</p>
          )}
        </div>
      )}
    </div>
  );

  // Render Input Number Ασκήσεων (Q3 & Q4)
  const renderInputNumber = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (parseInt(answers[qKey], 10) === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-purple-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900 leading-snug">{qData.q}</h3>
      </div>

      <div className="pl-0 md:pl-11 space-y-3">
        <div className="flex items-center gap-2">
          <input 
            type="number"
            placeholder="Γράψε τον αριθμό"
            value={answers[qKey]}
            onChange={(e) => handleInputChange(qKey, e.target.value)}
            disabled={submitted}
            className="w-full md:w-96 p-3.5 rounded-2xl border border-gray-300 font-mono text-lg font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {parseInt(answers[qKey], 10) === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. {qData.explain}</p>
          )}
        </div>
      )}
    </div>
  );

  // Render MCQ Λεκτικών Ασκήσεων (Q5 & Q6)
  const renderTextMCQQuestion = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (answers[qKey] === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-amber-500 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900 leading-snug">{qData.q}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-0 md:pl-11">
        {qData.options.map((opt, idx) => (
          <label 
            key={idx} 
            className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
              answers[qKey] === opt 
                ? 'border-amber-500 bg-amber-50/80 font-bold text-amber-950' 
                : 'border-gray-200 hover:bg-gray-50 text-gray-800'
            }`}
          >
            <input 
              type="radio" 
              name={qKey} 
              value={opt}
              checked={answers[qKey] === opt}
              onChange={() => handleInputChange(qKey, opt)}
              disabled={submitted}
              className="w-5 h-5 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-sm md:text-base font-bold">{opt}</span>
          </label>
        ))}
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {answers[qKey] === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. {qData.explain}</p>
          )}
        </div>
      )}
    </div>
  );

  // Render Σωστό / Λάθος (Q7 & Q8)
  const renderTrueFalse = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (answers[qKey] === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-teal-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900 leading-snug">{qData.q}</h3>
      </div>

      <div className="flex gap-4 pl-0 md:pl-11">
        {['Σωστό', 'Λάθος'].map((opt) => (
          <button
            type="button"
            key={opt}
            onClick={() => handleInputChange(qKey, opt)}
            disabled={submitted}
            className={`px-8 py-3 rounded-2xl font-black text-base border transition ${
              answers[qKey] === opt
                ? (opt === 'Σωστό' ? 'bg-emerald-600 text-white border-emerald-700 shadow-md' : 'bg-rose-600 text-white border-rose-700 shadow-md')
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {answers[qKey] === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. {qData.explain}</p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between pb-24">
      <Head>
        <title>📦 Ασκήσεις: Αναπτύγματα Στερεών - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR */}
        <nav className="bg-white shadow-md w-full sticky top-0 z-50">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            <Link href="/d-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/d-dimotikou/28-sterea-anoigma" className="bg-teal-100 hover:bg-teal-200 text-teal-800 font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
                <span>📖</span> Θεωρία
              </Link>
              <button 
                onClick={loadNewQuestions}
                className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2"
              >
                <span>🔄</span> Νέες Ασκήσεις
              </button>
            </div>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-10 space-y-8`}>
          
          {/* HEADER BANNER */}
          <div className="bg-gradient-to-r from-teal-600 via-indigo-600 to-purple-600 text-white p-8 rounded-3xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
              </span>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight mt-2">
                📝 Ασκήσεις: Αναπτύγματα Στερεών Σωμάτων
              </h1>
              <p className="text-indigo-100 text-sm md:text-base mt-1">
                8 Μοναδικές ασκήσεις! Πατώντας **«Νέες Ασκήσεις»** τα αναπτύγματα και οι ερωτήσεις αλλάζουν χωρίς καμία επανάληψη.
              </p>
            </div>

            <button
              onClick={loadNewQuestions}
              className="bg-white text-gray-900 font-black px-5 py-3 rounded-2xl shadow-lg hover:bg-amber-50 transition transform active:scale-95 text-sm whitespace-nowrap"
            >
              🔄 Αλλαγή Αριθμών
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {renderSvgMCQQuestion('q1', questions.q1, 1)}
            {renderSvgMCQQuestion('q2', questions.q2, 2)}

            {renderInputNumber('q3', questions.q3, 3)}
            {renderInputNumber('q4', questions.q4, 4)}

            {renderTextMCQQuestion('q5', questions.q5, 5)}
            {renderTextMCQQuestion('q6', questions.q6, 6)}

            {renderTrueFalse('q7', questions.q7, 7)}
            {renderTrueFalse('q8', questions.q8, 8)}

            {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
            {!submitted && (
              <div className="text-center pt-4">
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-black px-10 py-4 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95"
                >
                  🎯 Έλεγχος Απαντήσεων
                </button>
              </div>
            )}

          </form>

        </main>
      </div>

      {/* STICKY FOOTER SCORES & FEEDBACK BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-4 px-6 z-50">
        <div className={`${LAYOUT.CONTAINER} flex flex-col md:flex-row justify-between items-center gap-3`}>
          
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-900 font-black px-4 py-2 rounded-xl text-lg flex items-center gap-2 shadow-sm">
              <span>🏆 Σκορ:</span>
              <span className="text-2xl font-mono">{score} / 8</span>
            </div>
            {submitted && (
              <span className="text-sm font-bold text-slate-300">
                Ποσοστό Επιτυχίας: <span className="text-emerald-400 font-black">{Math.round((score / 8) * 100)}%</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                onClick={loadNewQuestions}
                className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-black px-6 py-2.5 rounded-xl shadow-md transition text-sm flex items-center gap-2"
              >
                <span>🔄</span> Παίξε ξανά με νέες ασκήσεις!
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden md:block">
                Συμπλήρωσε όλες τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!
              </p>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
