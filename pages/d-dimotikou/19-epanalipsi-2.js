// pages/d-dimotikou/19-epanalipsi-geometrias.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Βοηθητική συνάρτηση για εγγυημένα 4 μοναδικές επιλογές
function make4UniqueOptions(correct, wrongs) {
  const cleanWrongs = Array.from(new Set(wrongs)).filter((w) => w !== correct);
  const selectedWrongs = cleanWrongs.slice(0, 3);

  while (selectedWrongs.length < 3) {
    const dummy = `${getRandomInt(10, 99)} cm`;
    if (dummy !== correct && !selectedWrongs.includes(dummy)) {
      selectedWrongs.push(dummy);
    }
  }

  const options = [correct, ...selectedWrongs];
  return options.sort(() => Math.random() - 0.5);
}

// ----------------------------------------------------
// ΒΟΗΘΗΤΙΚΑ ΚΑΘΑΡΑ SVG ΣΧΗΜΑΤΑ (ΧΩΡΙΣ ΥΠΟΔΕΙΞΕΙΣ)
// ----------------------------------------------------
const SVG_SHAPES = {
  parallelLines: (
    <svg className="w-52 h-28 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 100">
      <line x1="25" y1="35" x2="175" y2="35" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="25" y1="65" x2="175" y2="65" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
      <text x="180" y="38" fill="#7dd3fc" fontSize="11" fontWeight="bold" fontFamily="sans-serif">ε₁</text>
      <text x="180" y="68" fill="#7dd3fc" fontSize="11" fontWeight="bold" fontFamily="sans-serif">ε₂</text>
    </svg>
  ),
  perpendicularLines: (
    <svg className="w-52 h-28 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 100">
      <line x1="25" y1="50" x2="175" y2="50" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="100" y1="15" x2="100" y2="85" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 100 38 L 112 38 L 112 50" fill="none" stroke="#f59e0b" strokeWidth="2" />
      <text x="180" y="54" fill="#7dd3fc" fontSize="11" fontWeight="bold" fontFamily="sans-serif">ε₁</text>
      <text x="105" y="22" fill="#6ee7b7" fontSize="11" fontWeight="bold" fontFamily="sans-serif">ε₂</text>
    </svg>
  ),
  pointToLineClean: (
    <svg className="w-52 h-28 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 100">
      <line x1="20" y1="75" x2="180" y2="75" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
      <text x="185" y="78" fill="#7dd3fc" fontSize="11" fontWeight="bold" fontFamily="sans-serif">(ε)</text>
      <circle cx="100" cy="25" r="5" fill="#f43f5e" />
      <text x="100" y="17" fill="#f43f5e" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">Α</text>
    </svg>
  ),
  square: (
    <svg className="w-52 h-28 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 100">
      <rect x="65" y="15" width="70" height="70" rx="3" fill="#a855f7" fillOpacity="0.25" stroke="#c084fc" strokeWidth="3.5" />
    </svg>
  ),
  squareLabeled: (
    <svg className="w-52 h-28 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 100">
      <rect x="65" y="20" width="60" height="60" rx="3" fill="#a855f7" fillOpacity="0.25" stroke="#c084fc" strokeWidth="3" />
      <text x="54" y="18" fill="#fbbf24" fontSize="13" fontWeight="black" fontFamily="sans-serif">Α</text>
      <text x="133" y="18" fill="#fbbf24" fontSize="13" fontWeight="black" fontFamily="sans-serif">Β</text>
      <text x="133" y="92" fill="#fbbf24" fontSize="13" fontWeight="black" fontFamily="sans-serif">Γ</text>
      <text x="54" y="92" fill="#fbbf24" fontSize="13" fontWeight="black" fontFamily="sans-serif">Δ</text>
    </svg>
  ),
  rectangle: (
    <svg className="w-56 h-28 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 100">
      <rect x="35" y="25" width="130" height="50" rx="3" fill="#a855f7" fillOpacity="0.25" stroke="#c084fc" strokeWidth="3.5" />
    </svg>
  ),
  isoscelesTriangle: (
    <svg className="w-52 h-28 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 100">
      <polygon points="100,14 60,86 140,86" fill="#a855f7" fillOpacity="0.25" stroke="#c084fc" strokeWidth="3.5" strokeLinejoin="round" />
    </svg>
  ),
  equilateralTriangle: (
    <svg className="w-52 h-28 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 100">
      <polygon points="100,16 50,88 150,88" fill="#a855f7" fillOpacity="0.25" stroke="#c084fc" strokeWidth="3.5" strokeLinejoin="round" />
    </svg>
  ),
  scaleneTriangle: (
    <svg className="w-52 h-28 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 100">
      <polygon points="55,18 35,90 170,90" fill="#a855f7" fillOpacity="0.25" stroke="#c084fc" strokeWidth="3.5" strokeLinejoin="round" />
    </svg>
  ),
  rhombus: (
    <svg className="w-52 h-28 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 100">
      <polygon points="100,15 150,50 100,85 50,50" fill="#a855f7" fillOpacity="0.25" stroke="#c084fc" strokeWidth="3.5" strokeLinejoin="round" />
    </svg>
  ),
  genericQuadrilateral: (
    <svg className="w-52 h-28 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 100">
      <polygon points="40,25 150,20 170,85 30,75" fill="#a855f7" fillOpacity="0.25" stroke="#c084fc" strokeWidth="3.5" strokeLinejoin="round" />
    </svg>
  ),
  circle: (
    <svg className="w-52 h-28 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 100">
      <circle cx="100" cy="50" r="38" fill="#a855f7" fillOpacity="0.25" stroke="#c084fc" strokeWidth="3.5" />
    </svg>
  ),
  gridArea: (
    <svg className="w-52 h-28 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 100">
      <rect x="40" y="20" width="120" height="60" rx="2" fill="#a855f7" fillOpacity="0.2" stroke="#c084fc" strokeWidth="2.5" />
      <line x1="80" y1="20" x2="80" y2="80" stroke="#c084fc" strokeWidth="1" strokeDasharray="3,3" />
      <line x1="120" y1="20" x2="120" y2="80" stroke="#c084fc" strokeWidth="1" strokeDasharray="3,3" />
      <line x1="40" y1="50" x2="160" y2="50" stroke="#c084fc" strokeWidth="1" strokeDasharray="3,3" />
    </svg>
  )
};

// ----------------------------------------------------
// ΜΕΓΑΛΗ ΔΕΞΑΜΕΝΗ 45+ ΔΥΝΑΜΙΚΩΝ ΘΕΜΑΤΩΝ ΓΕΩΜΕΤΡΙΑΣ
// ----------------------------------------------------
const GEOMETRY_QUESTIONS_POOL = [
  // --- 1. ΠΑΡΑΛΛΗΛΕΣ & ΚΑΘΕΤΕΣ ΕΥΘΕΙΕΣ ---
  () => ({
    q: 'Δύο ευθείες που βρίσκονται στο ίδιο επίπεδο και δεν τέμνονται ποτέ, όσο κι αν τις προεκτείνουμε, ονομάζονται:',
    correct: 'Παράλληλες ευθείες',
    wrongs: ['Κάθετες ευθείες', 'Τεμνόμενες ευθείες', 'Συμπίπτουσες ευθείες'],
    explainText: 'Παράλληλες ονομάζονται οι ευθείες που διατηρούν σταθερή απόσταση μεταξύ τους και δεν έχουν κανένα κοινό σημείο.',
    svg: SVG_SHAPES.parallelLines
  }),
  () => ({
    q: 'Όταν δύο ευθείες τέμνονται και σχηματίζουν 4 ορθές γωνίες (90°), ονομάζονται:',
    correct: 'Κάθετες ευθείες',
    wrongs: ['Παράλληλες ευθείες', 'Τεμνόμενες μη κάθετες', 'Οριζόντιες ευθείες'],
    explainText: 'Δύο ευθείες είναι κάθετες όταν διασταυρώνονται σχηματίζοντας ορθές γωνίες ακριβώς 90°.',
    svg: SVG_SHAPES.perpendicularLines
  }),
  () => {
    const d = getRandomInt(3, 15);
    return {
      q: `Δύο παράλληλες ευθείες (ε₁) και (ε₂) απέχουν μεταξύ τους ${d} cm. Αν τις προεκτείνουμε κατά 50 cm, πόση θα είναι η μεταξύ τους απόσταση;`,
      correct: `${d} cm`,
      wrongs: [`${d + 50} cm`, `${d * 2} cm`, '0 cm', `${d + 10} cm`],
      explainText: `Οι παράλληλες ευθείες διατηρούν σταθερή απόσταση (${d} cm) σε όλο το μήκος τους.`,
      svg: SVG_SHAPES.parallelLines
    };
  },
  () => ({
    q: 'Ποιο όργανο γεωμετρίας χρησιμοποιούμε για να ελέγξουμε αν δύο ευθείες είναι κάθετες μεταξύ τους;',
    correct: 'Τον γνώμονα',
    wrongs: ['Τον χάρακα (ρίγα)', 'Τον διαβήτη', 'Το μοιρογνωμόνιο'],
    explainText: 'Με τον γνώμονα ελέγχουμε αν η γωνία τομής είναι ορθή (90°).',
    svg: SVG_SHAPES.perpendicularLines
  }),
  () => ({
    q: 'Ποιο από τα παρακάτω ζεύγη γραμμών αποτελεί χαρακτηριστικό παράδειγμα παράλληλων ευθειών;',
    correct: 'Οι δύο απέναντι πλευρές ενός ορθογωνίου',
    wrongs: ['Οι δύο διπλανές πλευρές ενός τετραγώνου', 'Οι δείκτες του ρολογιού στις 3:00', 'Οι διαγώνιοι ενός τετραγώνου'],
    explainText: 'Στο ορθογώνιο οι απέναντι πλευρές είναι παράλληλες και ίσες ανά δύο.',
    svg: SVG_SHAPES.rectangle
  }),

  // --- 2. ΑΠΟΣΤΑΣΗ ΣΗΜΕΙΟΥ ΑΠΟ ΕΥΘΕΙΑ ---
  () => ({
    q: 'Απόσταση ενός σημείου Α από μια ευθεία (ε) ονομάζεται το μήκος του ευθύγραμμου τμήματος που είναι:',
    correct: 'Κάθετο από το σημείο προς την ευθεία',
    wrongs: ['Παράλληλο προς την ευθεία', 'Οποιοδήποτε πλάγιο τμήμα', 'Το μεγαλύτερο δυνατό τμήμα'],
    explainText: 'Η απόσταση ορίζεται αυστηρά ως το μήκος του κάθετου ευθύγραμμου τμήματος.',
    svg: SVG_SHAPES.pointToLineClean
  }),
  () => {
    const d = getRandomInt(4, 14);
    return {
      q: `Το κάθετο τμήμα από το σημείο Κ προς την ευθεία (ε) έχει μήκος ${d} cm, ενώ ένα πλάγιο τμήμα έχει μήκος ${d + 4} cm. Πόση είναι η απόσταση του σημείου Κ από την ευθεία;`,
      correct: `${d} cm`,
      wrongs: [`${d + 4} cm`, `${2 * d + 4} cm`, '4 cm', `${d + 2} cm`],
      explainText: `Η απόσταση μετριέται αποκλειστικά κατά μήκος του κάθετου τμήματος (${d} cm).`,
      svg: SVG_SHAPES.pointToLineClean
    };
  },
  () => ({
    q: 'Ανάμεσα σε όλα τα ευθύγραμμα τμήματα που συνδέουν ένα σημείο Α με μια ευθεία (ε), ποιο έχει πάντοτε το μικρότερο μήκος;',
    correct: 'Το κάθετο ευθύγραμμο τμήμα',
    wrongs: ['Το πιο λοξό πλάγιο τμήμα', 'Το τμήμα που καταλήγει πιο δεξιά', 'Όλα έχουν το ίδιο μήκος'],
    explainText: 'Το κάθετο ευθύγραμμο τμήμα αποτελεί τη συντομότερη διαδρομή από ένα σημείο προς μια ευθεία.',
    svg: SVG_SHAPES.pointToLineClean
  }),
  () => {
    const s = getRandomInt(5, 15);
    return {
      q: `Σε ένα τετράγωνο ΑΒΓΔ πλευράς ${s} cm, πόση είναι η απόσταση της κορυφής Α από την απέναντι πλευρά ΓΔ;`,
      correct: `${s} cm`,
      wrongs: [`${2 * s} cm`, `${s * s} cm`, `${s / 2} cm`, `${s + 4} cm`],
      explainText: `Επειδή η πλευρά ΑΔ είναι κάθετη στη ΓΔ, η απόσταση ισούται ακριβώς με το μήκος της πλευράς του τετραγώνου (${s} cm).`,
      svg: SVG_SHAPES.squareLabeled
    };
  },

  // --- 3. ΠΕΡΙΜΕΤΡΟΣ ---
  () => {
    const a = getRandomInt(4, 15);
    return {
      q: `Ένα τετράγωνο έχει πλευρά a ＝ ${a} cm. Πόση είναι η περίμετρός του;`,
      correct: `${4 * a} cm`,
      wrongs: [`${a * a} cm`, `${2 * a} cm`, `${a + 4} cm`, `${3 * a} cm`],
      explainText: `Περίμετρος τετραγώνου: 4 · ${a} ＝ ${4 * a} cm.`,
      svg: SVG_SHAPES.square
    };
  },
  () => {
    const w = getRandomInt(8, 20), h = getRandomInt(4, 12);
    const p = 2 * w + 2 * h;
    return {
      q: `Ένα ορθογώνιο έχει μήκος ${w} cm και πλάτος ${h} cm. Πόση είναι η περίμετρός του;`,
      correct: `${p} cm`,
      wrongs: [`${w + h} cm`, `${w * h} cm`, `${2 * w + h} cm`, `${p + 4} cm`],
      explainText: `Περίμετρος ορθογωνίου: (2 · ${w}) ＋ (2 · ${h}) ＝ ${p} cm.`,
      svg: SVG_SHAPES.rectangle
    };
  },
  () => {
    const s = getRandomInt(6, 18);
    const p = 3 * s;
    return {
      q: `Ένα ισόπλευρο τρίγωνο έχει συνολική περίμετρο ${p} cm. Πόσο είναι το μήκος της μίας πλευράς του;`,
      correct: `${s} cm`,
      wrongs: [`${p} cm`, `${s / 3} cm`, `${s * 3} cm`, `${s + 3} cm`],
      explainText: `Το ισόπλευρο τρίγωνο έχει 3 ίσες πλευρές: ${p} ： 3 ＝ ${s} cm.`,
      svg: SVG_SHAPES.equilateralTriangle
    };
  },
  () => {
    const s = getRandomInt(4, 15);
    const perim = 4 * s;
    return {
      q: `Ένα τετράγωνο έχει συνολική περίμετρο ${perim} cm. Πόσο μήκος έχει η κάθε πλευρά του;`,
      correct: `${s} cm`,
      wrongs: [`${perim / 2} cm`, `${perim * 4} cm`, `${s + 4} cm`, `${perim - 4} cm`],
      explainText: `Πλευρά τετραγώνου: ${perim} ： 4 ＝ ${s} cm.`,
      svg: SVG_SHAPES.square
    };
  },

  // --- 4. ΕΜΒΑΔΟΝ ---
  () => ({
    q: 'Τι εκφράζει το εμβαδόν ενός γεωμετρικού σχήματος;',
    correct: 'Το μέγεθος της εσωτερικής επιφάνειας που καλύπτει το σχήμα',
    wrongs: ['Το συνολικό μήκος του εξωτερικού περιγράμματός του', 'Τον αριθμό των κορυφών του', 'Την απόσταση από το κέντρο του'],
    explainText: 'Το εμβαδόν μετράει το μέγεθος της επιφάνειας που περικλείεται μέσα στις γραμμές του σχήματος.',
    svg: SVG_SHAPES.gridArea
  }),
  () => {
    const a = getRandomInt(3, 12);
    return {
      q: `Ένα τετράγωνο έχει πλευρά a ＝ ${a} cm. Πόσο είναι το εμβαδόν του;`,
      correct: `${a * a} cm²`,
      wrongs: [`${4 * a} cm²`, `${2 * a} cm²`, `${a + a} cm²`, `${a * 2} cm²`],
      explainText: `Εμβαδόν τετραγώνου: ${a} · ${a} ＝ ${a * a} cm².`,
      svg: SVG_SHAPES.square
    };
  },
  () => {
    const w = getRandomInt(5, 14), h = getRandomInt(3, 9);
    const area = w * h;
    return {
      q: `Ένα ορθογώνιο έχει μήκος ${w} cm και πλάτος ${h} cm. Πόσο είναι το εμβαδόν του;`,
      correct: `${area} cm²`,
      wrongs: [`${2 * w + 2 * h} cm²`, `${w + h} cm²`, `${2 * area} cm²`, `${area + 4} cm²`],
      explainText: `Εμβαδόν ορθογωνίου: μήκος · πλάτος ＝ ${w} · ${h} ＝ ${area} cm².`,
      svg: SVG_SHAPES.rectangle
    };
  },
  () => ({
    q: 'Ποια είναι η θεμελιώδης μονάδα μέτρησης του εμβαδού στο μετρικό σύστημα;',
    correct: 'Το τετραγωνικό μέτρο (τ.μ.)',
    wrongs: ['Το μέτρο (m)', 'Το τετραγωνικό δεκατόμετρο (τ.δ.)', 'Το γραμμάριο (g)'],
    explainText: 'Βασική μονάδα μέτρησης επιφανειών είναι το τετραγωνικό μέτρο (1 τ.μ.).',
    svg: SVG_SHAPES.gridArea
  }),
  () => {
    const w = getRandomInt(4, 12), h = getRandomInt(2, 8);
    const area = w * h;
    return {
      q: `Ένα ορθογώνιο έχει εμβαδόν ${area} cm² και μήκος ${w} cm. Πόσο είναι το πλάτος του;`,
      correct: `${h} cm`,
      wrongs: [`${area * w} cm`, `${area + w} cm`, `${w / 2} cm`, `${area - w} cm`],
      explainText: `Πλάτος: ${area} ： ${w} ＝ ${h} cm.`,
      svg: SVG_SHAPES.rectangle
    };
  },

  // --- 5. ΤΕΤΡΑΠΛΕΥΡΑ ---
  () => ({
    q: 'Ποιο κανονικό τετράπλευρο έχει ΚΑΙ τις 4 πλευρές του ίσες ΚΑΙ 4 ορθές γωνίες (90°);',
    correct: 'Το Τετράγωνο',
    wrongs: ['Ο Ρόμβος', 'Το Ορθογώνιο', 'Το Τραπέζιο'],
    explainText: 'Το τετράγωνο συνδυάζει 4 ίσες πλευρές και 4 ορθές γωνίες.',
    svg: SVG_SHAPES.square
  }),
  () => ({
    q: 'Ποια είναι η βασική ιδιότητα του Ρόμβου;',
    correct: 'Έχει 4 ίσες πλευρές, αλλά οι γωνίες του δεν είναι ορθές',
    wrongs: ['Έχει μόνο 2 ίσες πλευρές', 'Έχει 4 ορθές γωνίες', 'Έχει 3 κορυφές'],
    explainText: 'Ο ρόμβος έχει και τις 4 πλευρές ίσες, αλλά οι γωνίες του είναι πλάγιες (όχι 90°).',
    svg: SVG_SHAPES.rhombus
  }),
  () => ({
    q: 'Ποιο από τα παρακάτω τετράπλευρα ΔΕΝ είναι παραλληλόγραμμο;',
    correct: 'Το Τραπέζιο',
    wrongs: ['Το Τετράγωνο', 'Το Ορθογώνιο', 'Ο Ρόμβος'],
    explainText: 'Τα παραλληλόγραμμα έχουν απέναντι πλευρές παράλληλες ανά δύο. Το τραπέζιο έχει μόνο ένα ζεύγος παράλληλων πλευρών.',
    svg: SVG_SHAPES.genericQuadrilateral
  }),

  // --- 6. ΣΥΜΜΕΤΡΙΑ & ΑΞΟΝΑΣ ΣΥΜΜΕΤΡΙΑΣ ---
  () => ({
    q: 'Πόσους άξονες συμμετρίας έχει συνολικά το Τετράγωνο;',
    correct: '4',
    wrongs: ['2', '1', 'Άπειρους'],
    explainText: 'Το τετράγωνο έχει 4 άξονες συμμετρίας: 1 κατακόρυφο, 1 οριζόντιο και 2 διαγώνιους.',
    svg: SVG_SHAPES.square
  }),
  () => ({
    q: 'Πόσους άξονες συμμετρίας έχει το Ορθογώνιο Παραλληλόγραμμο;',
    correct: '2',
    wrongs: ['4', '1', '0'],
    explainText: 'Το ορθογώνιο έχει 2 άξονες συμμετρίας (1 κατακόρυφο και 1 οριζόντιο). Οι διαγώνιοί του δεν είναι άξονες συμμετρίας.',
    svg: SVG_SHAPES.rectangle
  }),
  () => ({
    q: 'Πόσους άξονες συμμετρίας έχει ο Κύκλος;',
    correct: 'Αμέτρητους (άπειρους)',
    wrongs: ['4', '2', '1'],
    explainText: 'Κάθε ευθεία που διέρχεται από το κέντρο του κύκλου είναι άξονας συμμετρίας.',
    svg: SVG_SHAPES.circle
  }),
  () => ({
    q: 'Πόσους άξονες συμμετρίας έχει ένα Σκαληνό Τρίγωνο (με όλες τις πλευρές άνισες);',
    correct: '0',
    wrongs: ['1', '2', '3'],
    explainText: 'Το σκαληνό τρίγωνο δεν έχει κανέναν άξονα συμμετρίας (0).',
    svg: SVG_SHAPES.scaleneTriangle
  }),
  () => ({
    q: 'Πόσους άξονες συμμετρίας έχει το Ισόπλευρο Τρίγωνο;',
    correct: '3',
    wrongs: ['1', '2', '0'],
    explainText: 'Το ισόπλευρο τρίγωνο έχει 3 άξονες συμμετρίας, έναν από κάθε κορυφή του.',
    svg: SVG_SHAPES.equilateralTriangle
  }),
  () => ({
    q: 'Πόσους άξονες συμμετρίας έχει το Ισοσκελές Τρίγωνο;',
    correct: '1',
    wrongs: ['3', '2', '0'],
    explainText: 'Το ισοσκελές τρίγωνο (με 2 ίσες πλευρές) έχει μόνο 1 άξονα συμμετρίας.',
    svg: SVG_SHAPES.isoscelesTriangle
  }),
  () => {
    const halfArea = getRandomInt(12, 40);
    return {
      q: `Ένας άξονας συμμετρίας χωρίζει ένα σχήμα σε δύο συμμετρικά μέρη. Αν το ένα μέρος έχει εμβαδόν ${halfArea} cm², πόσο είναι το συνολικό εμβαδόν του σχήματος;`,
      correct: `${2 * halfArea} cm²`,
      wrongs: [`${halfArea} cm²`, `${halfArea * halfArea} cm²`, `${halfArea + 4} cm²`, `${2 * halfArea + 6} cm²`],
      explainText: `Τα δύο συμμετρικά μέρη είναι ίσα: ${halfArea} ＋ ${halfArea} ＝ ${2 * halfArea} cm².`,
      svg: SVG_SHAPES.rectangle
    };
  },
  () => {
    const perim = getRandomInt(15, 35);
    return {
      q: `Ένας άξονας συμμετρίας χωρίζει ένα σχήμα σε δύο συμμετρικά μέρη. Αν το πρώτο μέρος έχει περίμετρο ${perim} cm, πόση είναι η περίμετρος του δεύτερου μέρους;`,
      correct: `${perim} cm`,
      wrongs: [`${2 * perim} cm`, `${perim / 2} cm`, 'Δεν υπολογίζεται', `${perim + 4} cm`],
      explainText: `Τα συμμετρικά μέρη έχουν ακριβώς την ίδια περίμετρο (${perim} cm).`,
      svg: SVG_SHAPES.square
    };
  }
];

// ----------------------------------------------------
// GENERATOR 15 ΤΥΧΑΙΩΝ ΕΡΩΤΗΣΕΩΝ ΜΕ 4 UNIQUE OPTIONS
// ----------------------------------------------------
function generateRandomExam() {
  const shuffled = [...GEOMETRY_QUESTIONS_POOL].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 15);

  return selected.map((fn, index) => {
    const raw = fn();
    const uniqueOptions = make4UniqueOptions(raw.correct, raw.wrongs);
    return {
      id: index + 1,
      q: raw.q,
      correct: raw.correct,
      explainText: raw.explainText,
      svg: raw.svg,
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
    setAnswers((prev) => ({ ...prev, [qId]: optionText }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let currentScore = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct) {
        currentScore += 1;
      }
    });

    setScore(currentScore);
    setSubmitted(true);
  };

  return (
    <Layout
      title="Μεγάλη Επανάληψη Γεωμετρίας (Δ' Δημοτικού) | LearnMaths.gr"
      description="Επαναληπτικές ασκήσεις γεωμετρίας για τη Δ' Δημοτικού (Ενότητες 13 - 18): παράλληλες και κάθετες ευθείες, απόσταση, περίμετρος, εμβαδόν, τετράπλευρα και συμμετρία."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <button
          onClick={loadNewExam}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>🔄</span> Νέο Τεστ
        </button>
      }
    >
      <div className="space-y-8">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              Δ' ΔΗΜΟΤΙΚΟΥ • ΕΠΑΝΑΛΗΨΗ ΓΕΩΜΕΤΡΙΑΣ (13 - 18)
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              📐 Μεγάλη Επανάληψη Γεωμετρίας
            </h1>
            <p className="text-indigo-100 text-xs sm:text-sm md:text-base">
              15 τυχαίες ερωτήσεις από όλη τη γεωμετρία της Δ' τάξης. Πατώντας «Νέο Τεστ» τα θέματα ανανεώνονται αυτόματα!
            </p>
          </div>

          <button
            onClick={loadNewExam}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-blue-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 Αλλαγή Ερωτήσεων
          </button>
        </div>

        {/* FORM ΕΡΩΤΗΣΕΩΝ & PB SAFE AREA ΓΙΑ ΤΟ BOTTOM SCORE BAR */}
        <form onSubmit={handleSubmit} className="space-y-6 pb-28 sm:pb-32">
          {questions.map((q) => {
            const isUserCorrect = answers[q.id] === q.correct;

            return (
              <div
                key={q.id}
                className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
                  submitted
                    ? isUserCorrect
                      ? 'border-emerald-500 bg-emerald-50/20'
                      : 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-100'
                }`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <span className="bg-indigo-600 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
                    {q.id}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {q.q}
                  </h3>
                </div>

                {/* SVG ΣΧΗΜΑ */}
                {q.svg && <div className="mb-4">{q.svg}</div>}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:pl-11">
                  {q.options.map((opt, idx) => {
                    const isSelected = answers[q.id] === opt;

                    return (
                      <label
                        key={idx}
                        className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition select-none text-xs sm:text-sm ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/80 font-bold text-indigo-950 shadow-sm'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        } ${submitted ? 'cursor-default pointer-events-none' : ''}`}
                      >
                        <input
                          type="radio"
                          id={`question-${q.id}-opt-${idx}`}
                          name={`question-${q.id}`}
                          value={opt}
                          checked={isSelected}
                          onChange={() => handleSelectOption(q.id, opt)}
                          disabled={submitted}
                          className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 shrink-0"
                        />
                        <span className="leading-snug">{opt}</span>
                      </label>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
                    {isUserCorrect ? (
                      <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                        {q.explainText}
                      </p>
                    ) : (
                      <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                        Η σωστή απάντηση είναι: <strong className="font-bold text-rose-900">{q.correct}</strong>. {q.explainText}
                      </p>
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
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white text-base sm:text-lg font-black px-10 py-4 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95"
              >
                🎯 Έλεγχος Απαντήσεων
              </button>
            </div>
          )}
        </form>
      </div>

      {/* STICKY FOOTER SCORES & FEEDBACK BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 z-50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-base sm:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆 Σκορ:</span>
              <span className="text-xl sm:text-2xl font-mono">{score} / 15</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                Επιτυχία: <span className="text-emerald-400 font-black">{Math.round((score / 15) * 100)}%</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                onClick={loadNewExam}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2 rounded-xl shadow-md transition text-xs sm:text-sm flex items-center gap-2"
              >
                <span>🔄</span> Νέο Τεστ
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">
                Συμπλήρωσε όλες τις ερωτήσεις και πάτα «Έλεγχος Απαντήσεων»!
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
