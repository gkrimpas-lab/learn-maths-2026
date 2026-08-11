import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Βοηθητική συνάρτηση για αφαίρεση διπλότυπων επιλογών
function makeUniqueOptions(correct, wrongs) {
  const uniqueWrongs = Array.from(new Set(wrongs)).filter(w => w !== correct);
  const options = [correct, ...uniqueWrongs.slice(0, 3)];
  return options.sort(() => Math.random() - 0.5);
}

// ----------------------------------------------------
// ΜΕΓΑΛΗ ΔΕΞΑΜΕΝΗ 45+ ΔΥΝΑΜΙΚΩΝ ΘΕΜΑΤΩΝ ΓΕΩΜΕΤΡΙΑΣ
// ----------------------------------------------------
const GEOMETRY_QUESTIONS_POOL = [
  // --- 1. ΠΑΡΑΛΛΗΛΕΣ & ΚΑΘΕΤΕΣ ΕΥΘΕΙΕΣ ---
  () => ({
    q: 'Δύο ευθείες που βρίσκονται στο ίδιο επίπεδο και δεν τέμνονται (δεν συναντιούνται) ποτέ, όσο κι αν τις προεκτείνουμε, λέγονται:',
    correct: 'Παράλληλες ευθείες',
    wrongs: ['Κάθετες ευθείες', 'Τεμνόμενες ευθείες', 'Διαγώνιες ευθείες'],
    explain: 'Παράλληλες λέγονται οι ευθείες που διατηρούν πάντα σταθερή απόσταση μεταξύ τους και δεν συναντιούνται ποτέ.'
  }),
  () => ({
    q: 'Όταν δύο ευθείες τέμνονται και σχηματίζουν 4 ορθές γωνίες (90°), ονομάζονται:',
    correct: 'Κάθετες ευθείες',
    wrongs: ['Παράλληλες ευθείες', 'Οριζόντιες ευθείες', 'Κατακόρυφες ευθείες'],
    explain: 'Δύο ευθείες είναι κάθετες όταν τέμνονται σχηματίζοντας ορθές γωνίες (90°).'
  }),
  () => {
    const d = getRandomInt(3, 15);
    return {
      q: `Δύο παράλληλες ευθείες (ε1) και (ε2) απέχουν μεταξύ τους ${d} cm. Αν τις προεκτείνουμε κατά 50 cm, πόση θα είναι η μεταξύ τους απόσταση;`,
      correct: `${d} cm`,
      wrongs: [`${d + 50} cm`, `${d * 2} cm`, '0 cm', `${d + 5} cm`],
      explain: `Οι παράλληλες ευθείες διατηρούν ΠΑΝΤΑ σταθερή την μεταξύ τους απόσταση (${d} cm).`
    };
  },
  () => ({
    q: 'Ποιο όργανο σχεδίασης χρησιμοποιούμε για να ελέγξουμε αν δύο ευθείες είναι κάθετες;',
    correct: 'Το γνώμονα',
    wrongs: ['Το χάρακα (ρίγα)', 'Το διαβήτη', 'Το μοιρογνωμόνιο'],
    explain: 'Με το γνώμονα ελέγχουμε αν μια γωνία είναι ορθή (90°).'
  }),
  () => ({
    q: 'Ποιο από τα παρακάτω ζεύγη γραμμών είναι παράλληλες;',
    correct: 'Οι δύο απέναντι πλευρές ενός ορθογωνίου',
    wrongs: ['Οι δύο διπλανές πλευρές ενός τετραγώνου', 'Οι δείκτες του ρολογιού στις 3:00', 'Οι πλευρές μιας γωνίας'],
    explain: 'Οι απέναντι πλευρές του ορθογωνίου είναι παράλληλες.'
  }),
  () => ({
    q: 'Αν η ευθεία (ε1) είναι κάθετη στην (ε2) και η (ε2) είναι κάθετη στην (ε3), τότε οι ευθείες (ε1) και (ε3) μεταξύ τους είναι:',
    correct: 'Παράλληλες',
    wrongs: ['Κάθετες', 'Τεμνόμενες', 'Ταυτιζόμενες'],
    explain: 'Δύο ευθείες κάθετες στην ίδια ευθεία είναι παράλληλες μεταξύ τους.'
  }),

  // --- 2. ΑΠΟΣΤΑΣΗ ΣΗΜΕΙΟΥ ΑΠΟ ΕΥΘΕΙΑ ---
  () => ({
    q: 'Απόσταση ενός σημείου Α από μια ευθεία (ε) ονομάζεται το μήκος του ευθύγραμμου τμήματος που είναι:',
    correct: 'Κάθετο από το σημείο προς την ευθεία',
    wrongs: ['Παράλληλο προς την ευθεία', 'Οποιοδήποτε λοξό τμήμα', 'Το μεγαλύτερο δυνατό τμήμα'],
    explain: 'Η απόσταση σημείου από ευθεία είναι πάντα το μήκος του ΚΑΘΕΤΟΥ ευθύγραμμου τμήματος.'
  }),
  () => {
    const d = getRandomInt(4, 15);
    return {
      q: `Το κάθετο τμήμα από το σημείο Κ προς την ευθεία (ε) έχει μήκος ${d} cm. Ένα λοξό τμήμα από το Κ προς την (ε) έχει μήκος ${d + 4} cm. Πόση είναι η απόσταση του σημείου Κ από την ευθεία (ε);`,
      correct: `${d} cm`,
      wrongs: [`${d + 4} cm`, `${2 * d + 4} cm`, '4 cm'],
      explain: `Η απόσταση είναι ΜΟΝΟ το μήκος του κάθετου τμήματος (${d} cm).`
    };
  },
  () => ({
    q: 'Ανάμεσα σε όλα τα ευθύγραμμα τμήματα που κινούνται από ένα σημείο Α προς μια ευθεία (ε), ποιο έχει το μικρότερο μήκος;',
    correct: 'Το κάθετο ευθύγραμμο τμήμα',
    wrongs: ['Το πιο λοξό τμήμα', 'Το οριζόντιο τμήμα', 'Όλα έχουν το ίδιο μήκος'],
    explain: 'Το κάθετο τμήμα είναι το συντομότερο μονοπάτι (μικρότερο μήκος).'
  }),
  () => {
    const s = getRandomInt(5, 15);
    return {
      q: `Σε ένα τετράγωνο ΑΒΓΔ πλευράς ${s} cm, πόση είναι η απόσταση της κορυφής Α από την απέναντι πλευρά ΓΔ;`,
      correct: `${s} cm`,
      wrongs: [`${2 * s} cm`, `${s * s} cm`, `${s / 2} cm`],
      explain: `Αφού οι πλευρές του τετραγώνου είναι κάθετες, η απόσταση είναι ίση με το μήκος της πλευράς (${s} cm).`
    };
  },
  () => ({
    q: 'Αν ένα σημείο Α βρίσκεται ΠΑΝΩ στην ευθεία (ε), πόση είναι η απόστασή του από την ευθεία;',
    correct: '0 cm',
    wrongs: ['1 cm', 'Άπειρη', 'Δεν μπορούμε να ξέρουμε'],
    explain: 'Αφού το σημείο ανήκει στην ευθεία, η απόστασή του από αυτήν είναι μηδέν (0).'
  }),

  // --- 3. ΠΕΡΙΜΕΤΡΟΣ ---
  () => {
    const a = getRandomInt(4, 15);
    return {
      q: `Ένα τετράγωνο έχει πλευρά a = ${a} cm. Πόση είναι η περίμετρός του;`,
      correct: `${4 * a} cm`,
      wrongs: [`${a * a} cm`, `${2 * a} cm`, `${a + 4} cm`],
      explain: `Περίμετρος τετραγώνου = 4 × πλευρά = 4 × ${a} = ${4 * a} cm.`
    };
  },
  () => {
    const w = getRandomInt(8, 20), h = getRandomInt(4, 12);
    return {
      q: `Ένα ορθογώνιο έχει μήκος ${w} cm και πλάτος ${h} cm. Πόση είναι η περίμετρός του;`,
      correct: `${2 * w + 2 * h} cm`,
      wrongs: [`${w + h} cm`, `${w * h} cm`, `${2 * w + h} cm`],
      explain: `Περίμετρος ορθογωνίου = (2 × ${w}) + (2 × ${h}) = ${2 * w + 2 * h} cm.`
    };
  },
  () => {
    const s = getRandomInt(6, 18);
    return {
      q: `Ένα ισόπλευρο τρίγωνο έχει περίμετρο ${3 * s} cm. Πόσο είναι το μήκος της μίας πλευράς του;`,
      correct: `${s} cm`,
      wrongs: [`${3 * s} cm`, `${s / 3} cm`, `${s * 3} cm`],
      explain: `Αφού το ισόπλευρο τρίγωνο έχει 3 ίσες πλευρές: ${3 * s} : 3 = ${s} cm.`
    };
  },
  () => {
    const perim = getRandomInt(4, 15) * 4;
    return {
      q: `Ένα τετράγωνο έχει συνολική περίμετρο ${perim} cm. Πόσο μήκος έχει η κάθε πλευρά του;`,
      correct: `${perim / 4} cm`,
      wrongs: [`${perim / 2} cm`, `${perim * 4} cm`, `${perim - 4} cm`],
      explain: `Πλευρά τετραγώνου = Περίμετρος : 4 = ${perim} : 4 = ${perim / 4} cm.`
    };
  },
  () => {
    const a = getRandomInt(5, 12), b = getRandomInt(6, 12), c = getRandomInt(7, 14);
    return {
      q: `Ένα τριγωνικό παρτέρι έχει πλευρές ${a} m, ${b} m και ${c} m. Πόσα μέτρα περίφραξη χρειάζεται γύρω-γύρω;`,
      correct: `${a + b + c} m`,
      wrongs: [`${a * b * c} m`, `${2 * (a + b)} m`, `${a + b} m`],
      explain: `Περίμετρος τριγώνου = ${a} + ${b} + ${c} = ${a + b + c} m.`
    };
  },
  () => {
    const s = getRandomInt(4, 12);
    return {
      q: `Ένα κανονικό πεντάγωνο έχει πλευρά ${s} cm. Πόση είναι η περίμετρός του;`,
      correct: `${5 * s} cm`,
      wrongs: [`${4 * s} cm`, `${6 * s} cm`, `${s * s} cm`],
      explain: `Περίμετρος κανονικού πενταγώνου = 5 × πλευρά = 5 × ${s} = ${5 * s} cm.`
    };
  },

  // --- 4. ΕΜΒΑΔΟΝ ---
  () => ({
    q: 'Τι εκφράζει το εμβαδόν ενός γεωμετρικού σχήματος;',
    correct: 'Το μέγεθος της επιφάνειας που καλύπτει το σχήμα',
    wrongs: ['Το συνολικό μήκος του περιγράμματός του', 'Τον αριθμό των γωνιών του', 'Το βάρος του σχήματος'],
    explain: 'Το εμβαδόν μετράει την εσωτερική επιφάνεια (το «μέσα») ενός σχήματος.'
  }),
  () => {
    const a = getRandomInt(3, 12);
    return {
      q: `Ένα τετράγωνο έχει πλευρά a = ${a} cm. Πόσο είναι το εμβαδόν του;`,
      correct: `${a * a} cm²`,
      wrongs: [`${4 * a} cm²`, `${2 * a} cm²`, `${a + a} cm²`],
      explain: `Εμβαδόν τετραγώνου = πλευρά × πλευρά = ${a} × ${a} = ${a * a} cm².`
    };
  },
  () => {
    const w = getRandomInt(5, 15), h = getRandomInt(3, 10);
    return {
      q: `Ένα ορθογώνιο έχει μήκος ${w} cm και πλάτος ${h} cm. Πόσο είναι το εμβαδόν του;`,
      correct: `${w * h} cm²`,
      wrongs: [`${2 * w + 2 * h} cm²`, `${w + h} cm²`, `${2 * (w * h)} cm²`],
      explain: `Εμβαδόν ορθογωνίου = μήκος × πλάτος = ${w} × ${h} = ${w * h} cm².`
    };
  },
  () => ({
    q: 'Ποια είναι η θεμελιώδης μονάδα μέτρησης του εμβαδού;',
    correct: 'Το τετραγωνικό μέτρο (m²)',
    wrongs: ['Το μέτρο (m)', 'Το εκατοστό (cm)', 'Το λίτρο (L)'],
    explain: 'Το εμβαδόν μετριέται σε τετραγωνικές μονάδες (m², cm², mm²).'
  }),
  () => {
    const w = getRandomInt(4, 12), h = getRandomInt(2, 8);
    const area = w * h;
    return {
      q: `Ένα ορθογώνιο έχει εμβαδόν ${area} cm² και μήκος ${w} cm. Πόσο είναι το πλάτος του;`,
      correct: `${h} cm`,
      wrongs: [`${area * w} cm`, `${area + w} cm`, `${w / 2} cm`],
      explain: `Πλάτος = Εμβαδόν : Μήκος = ${area} : ${w} = ${h} cm.`
    };
  },
  () => {
    const s = getRandomInt(3, 10);
    const area = s * s;
    return {
      q: `Ένα τετράγωνο έχει εμβαδόν ${area} cm². Πόσο είναι το μήκος της πλευράς του;`,
      correct: `${s} cm`,
      wrongs: [`${area / 4} cm`, `${area * 2} cm`, `${s * 2} cm`],
      explain: `Ψάχνουμε αριθμό που επί τον εαυτό του δίνει ${area}: ${s} × ${s} = ${area} cm, άρα πλευρά = ${s} cm.`
    };
  },

  // --- 5. ΤΕΤΡΑΠΛΕΥΡΑ ---
  () => ({
    q: 'Ποιο τετράπλευρο έχει 4 ίσες πλευρές και 4 ορθές γωνίες;',
    correct: 'Το Τετράγωνο',
    wrongs: ['Ο Ρόμβος', 'Το Ορθογώνιο', 'Το Τραπέζιο'],
    explain: 'Το τετράγωνο συνδυάζει 4 ίσες πλευρές ΚΑΙ 4 ορθές γωνίες.'
  }),
  () => ({
    q: 'Ποια είναι η βασική ιδιότητα του Ρόμβου;',
    correct: 'Έχει 4 ίσες πλευρές, αλλά οι γωνίες του δεν είναι ορθές',
    wrongs: ['Έχει μόνο 2 ίσες πλευρές', 'Έχει 4 ορθές γωνίες', 'Έχει 3 πλευρές'],
    explain: 'Ο ρόμβος έχει 4 ίσες πλευρές όπως το τετράγωνο, αλλά οι γωνίες του είναι οξείες και αμβλείες.'
  }),
  () => ({
    q: 'Ένα τετράπλευρο που έχει ΜΟΝΟ δύο πλευρές παράλληλες μεταξύ τους ονομάζεται:',
    correct: 'Τραπέζιο',
    wrongs: ['Παραλληλόγραμμο', 'Ρόμβος', 'Τετράγωνο'],
    explain: 'Το τραπέζιο έχει μόνο μία ομάδα παράλληλων πλευρών (τις βάσεις του).'
  }),
  () => ({
    q: 'Πόσες μοίρες είναι το άθροισμα των γωνιών οποιουδήποτε τετράπλευρου;',
    correct: '360°',
    wrongs: ['180°', '90°', '540°'],
    explain: 'Το άθροισμα των γωνιών κάθε τετράπλευρου είναι πάντα 360°.'
  }),
  () => ({
    q: 'Ποιο από τα παρακάτω σχήματα ΔΕΝ είναι παραλληλόγραμμο;',
    correct: 'Το Τραπέζιο',
    wrongs: ['Το Τετράγωνο', 'Το Ορθογώνιο', 'Ο Ρόμβος'],
    explain: 'Τα παραλληλόγραμμα έχουν τις απέναντι πλευρές παράλληλες ανά δύο. Το τραπέζιο έχει μόνο μία ομάδα παράλληλων πλευρών.'
  }),
  () => ({
    q: 'Ποια από τα παρακάτω τετράπλευρα έχουν τις διαγώνιές τους κάθετες μεταξύ τους;',
    correct: 'Το Τετράγωνο και ο Ρόμβος',
    wrongs: ['Το Ορθογώνιο και το Τραπέζιο', 'Όλα τα παραλληλόγραμμα', 'Κανένα τετράπλευρο'],
    explain: 'Μόνο στο τετράγωνο και στο ρόμβο οι διαγώνιοι τέμνονται κάθετα.'
  }),

  // --- 6. ΣΥΜΜΕΤΡΙΑ & ΑΞΟΝΑΣ ΣΥΜΜΕΤΡΙΑΣ ---
  () => ({
    q: 'Πόσους άξονες συμμετρίας έχει το Τετράγωνο;',
    correct: '4',
    wrongs: ['2', '1', 'Άπειρους'],
    explain: 'Το τετράγωνο έχει 4 άξονες συμμετρίας (1 κατακόρυφο, 1 οριζόντιο, 2 διαγώνιους).'
  }),
  () => ({
    q: 'Πόσους άξονες συμμετρίας έχει το Ορθογώνιο Παραλληλόγραμμο;',
    correct: '2',
    wrongs: ['4', '1', '0'],
    explain: 'Το ορθογώνιο έχει 2 άξονες συμμετρίας (1 κατακόρυφο, 1 οριζόντιο).'
  }),
  () => ({
    q: 'Πόσους άξονες συμμετρίας έχει ο Κύκλος;',
    correct: 'Απεριορίστους (άπειρους)',
    wrongs: ['4', '2', '1'],
    explain: 'Κάθε ευθεία που περνάει από το κέντρο του κύκλου είναι άξονας συμμετρίας.'
  }),
  () => ({
    q: 'Πόσους άξονες συμμετρίας έχει ένα Σκαληνό Τρίγωνο (με όλες τις πλευρές άνισες);',
    correct: '0',
    wrongs: ['1', '2', '3'],
    explain: 'Το σκαληνό τρίγωνο δεν έχει κανέναν άξονα συμμετρίας (0).'
  }),
  () => ({
    q: 'Πόσους άξονες συμμετρίας έχει το Ισόπλευρο Τρίγωνο;',
    correct: '3',
    wrongs: ['1', '2', '0'],
    explain: 'Το ισόπλευρο τρίγωνο έχει 3 άξονες συμμετρίας (έναν από κάθε κορυφή).'
  }),
  () => ({
    q: 'Πόσους άξονες συμμετρίας έχει το Ισοσκελές Τρίγωνο;',
    correct: '1',
    wrongs: ['3', '2', '0'],
    explain: 'Το ισοσκελές τρίγωνο έχει μόνο 1 άξονα συμμετρίας.'
  }),
  () => {
    const halfArea = getRandomInt(12, 40);
    return {
      q: `Ένας άξονας συμμετρίας χωρίζει ένα σχήμα σε δύο συμμετρικά μέρη. Αν το ένα μέρος έχει εμβαδόν ${halfArea} cm², πόσο είναι το συνολικό εμβαδόν του σχήματος;`,
      correct: `${2 * halfArea} cm²`,
      wrongs: [`${halfArea} cm²`, `${halfArea * halfArea} cm²`, `${halfArea + 2} cm²`],
      explain: `Τα δύο συμμετρικά μέρη είναι ακριβώς ίσα: ${halfArea} + ${halfArea} = ${2 * halfArea} cm².`
    };
  },
  () => {
    const perim = getRandomInt(15, 35);
    return {
      q: `Ένας άξονας συμμετρίας χωρίζει ένα σχήμα σε δύο συμμετρικά μέρη. Αν το πρώτο μέρος έχει περίμετρο ${perim} cm, πόση είναι η περίμετρος του δεύτερου μέρους;`,
      correct: `${perim} cm`,
      wrongs: [`${2 * perim} cm`, `${perim / 2} cm`, 'Δεν μπορούμε να υπολογίσουμε'],
      explain: `Τα δύο συμμετρικά μέρη είναι ακριβώς ίσα, επομένως έχουν ΑΚΡΙΒΩΣ την ίδια περίμετρο (${perim} cm).`
    };
  }
];

// ----------------------------------------------------
// GENERATOR 15 ΤΥΧΑΙΩΝ ΕΡΩΤΗΣΕΩΝ ΜΕ UNIQUE OPTIONS
// ----------------------------------------------------
function generateRandomExam() {
  const shuffled = [...GEOMETRY_QUESTIONS_POOL].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 15);

  return selected.map((fn, index) => {
    const raw = fn();
    const uniqueOptions = makeUniqueOptions(raw.correct, raw.wrongs);
    return {
      id: index + 1,
      q: raw.q,
      correct: raw.correct,
      explain: raw.explain,
      options: uniqueOptions
    };
  });
}

export default function EpanalipsiGeometryPage() {
  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewExam = () => {
    const newQuestions = generateRandomExam();
    setQuestions(newQuestions);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  useEffect(() => {
    loadNewExam();
  }, []);

  if (!questions) return null;

  const handleSelectOption = (qId, optionText) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optionText }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let currentScore = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct) {
        currentScore += 1;
      }
    });

    setScore(currentScore);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between pb-24">
      <Head>
        <title>📐 Επανάληψη Γεωμετρίας (Δ' Δημοτικού) - LearnMaths.gr</title>
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
              <button 
                onClick={loadNewExam}
                className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2"
              >
                <span>🔄</span> Νέες Ερωτήσεις
              </button>
              <Link href="/d-dimotikou" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-bold transition shadow-sm">
                🔙 Επιστροφή
              </Link>
            </div>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-10 space-y-8`}>
          
          {/* HEADER BANNER */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-8 rounded-3xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                Δ' ΔΗΜΟΤΙΚΟΥ • ΕΝΟΤΗΤΑ 19
              </span>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight mt-2">
                📐 Μεγάλη Επανάληψη Γεωμετρίας
              </h1>
              <p className="text-indigo-100 text-sm md:text-base mt-1">
                15 Δυναμικές Ερωτήσεις! Πατώντας **«Νέες Ερωτήσεις»** οι ασκήσεις και οι αριθμοί αλλάζουν.
              </p>
            </div>

            <button
              onClick={loadNewExam}
              className="bg-white text-gray-900 font-black px-5 py-3 rounded-2xl shadow-lg hover:bg-amber-50 transition transform active:scale-95 text-sm whitespace-nowrap"
            >
              🔄 Αλλαγή Ερωτήσεων
            </button>
          </div>

          {/* FORM ΕΡΩΤΗΣΕΩΝ */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {questions.map((q) => {
              const isUserCorrect = answers[q.id] === q.correct;

              return (
                <div 
                  key={q.id}
                  className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
                    submitted 
                      ? (isUserCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
                      : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-indigo-600 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">
                      {q.id}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 leading-snug">{q.q}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-0 md:pl-11">
                    {q.options.map((opt, idx) => {
                      const isSelected = answers[q.id] === opt;

                      return (
                        <label 
                          key={idx} 
                          className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                            isSelected 
                              ? 'border-indigo-600 bg-indigo-50/80 font-bold text-indigo-900' 
                              : 'border-gray-200 hover:bg-gray-50 text-gray-800'
                          }`}
                        >
                          <input 
                            type="radio" 
                            name={`question-${q.id}`}
                            value={opt}
                            checked={isSelected}
                            onChange={() => handleSelectOption(q.id, opt)}
                            disabled={submitted}
                            className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm md:text-base font-bold">{opt}</span>
                        </label>
                      );
                    })}
                  </div>

                  {submitted && (
                    <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
                      {isUserCorrect ? (
                        <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
                      ) : (
                        <p className="text-red-600">❌ Λάθος. {q.explain || `Η σωστή απάντηση είναι: ${q.correct}`}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

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
              <span className="text-2xl font-mono">{score} / 15</span>
            </div>
            {submitted && (
              <span className="text-sm font-bold text-slate-300">
                Ποσοστό Επιτυχίας: <span className="text-emerald-400 font-black">{Math.round((score / 15) * 100)}%</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                onClick={loadNewExam}
                className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-black px-6 py-2.5 rounded-xl shadow-md transition text-sm flex items-center gap-2"
              >
                <span>🔄</span> Παίξε ξανά με νέες ερωτήσεις!
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden md:block">
                Συμπλήρωσε όλες τις ερωτήσεις και πάτα «Έλεγχος Απαντήσεων»!
              </p>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
