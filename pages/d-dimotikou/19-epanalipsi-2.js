// pages/d-dimotikou/19-epanalipsi-geometrias.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Δ')/g);
  return parts
    .map((part) => {
      if (part === "Δ'") return "Δ'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNum(num, locale) {
  if (typeof num !== 'number') return num;
  return locale === 'en' ? num.toLocaleString('en-US') : num.toLocaleString('el-GR');
}

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
function getSvgShapes(locale) {
  const lineLabel1 = locale === 'en' ? 'L₁' : 'ε₁';
  const lineLabel2 = locale === 'en' ? 'L₂' : 'ε₂';
  const singleLineLabel = locale === 'en' ? '(L)' : '(ε)';

  return {
    parallelLines: (
      <svg className="w-52 h-28 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 100">
        <line x1="25" y1="35" x2="175" y2="35" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="25" y1="65" x2="175" y2="65" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
        <text x="180" y="38" fill="#7dd3fc" fontSize="11" fontWeight="bold" fontFamily="sans-serif">{lineLabel1}</text>
        <text x="180" y="68" fill="#7dd3fc" fontSize="11" fontWeight="bold" fontFamily="sans-serif">{lineLabel2}</text>
      </svg>
    ),
    perpendicularLines: (
      <svg className="w-52 h-28 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 100">
        <line x1="25" y1="50" x2="175" y2="50" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="100" y1="15" x2="100" y2="85" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M 100 38 L 112 38 L 112 50" fill="none" stroke="#f59e0b" strokeWidth="2" />
        <text x="180" y="54" fill="#7dd3fc" fontSize="11" fontWeight="bold" fontFamily="sans-serif">{lineLabel1}</text>
        <text x="105" y="22" fill="#6ee7b7" fontSize="11" fontWeight="bold" fontFamily="sans-serif">{lineLabel2}</text>
      </svg>
    ),
    pointToLineClean: (
      <svg className="w-52 h-28 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 100">
        <line x1="20" y1="75" x2="180" y2="75" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
        <text x="185" y="78" fill="#7dd3fc" fontSize="11" fontWeight="bold" fontFamily="sans-serif">{singleLineLabel}</text>
        <circle cx="100" cy="25" r="5" fill="#f43f5e" />
        <text x="100" y="17" fill="#f43f5e" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">A</text>
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
        <text x="54" y="18" fill="#fbbf24" fontSize="13" fontWeight="black" fontFamily="sans-serif">A</text>
        <text x="133" y="18" fill="#fbbf24" fontSize="13" fontWeight="black" fontFamily="sans-serif">B</text>
        <text x="133" y="92" fill="#fbbf24" fontSize="13" fontWeight="black" fontFamily="sans-serif">{locale === 'en' ? 'C' : 'Γ'}</text>
        <text x="54" y="92" fill="#fbbf24" fontSize="13" fontWeight="black" fontFamily="sans-serif">{locale === 'en' ? 'D' : 'Δ'}</text>
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
    ),
  };
}

const translations = {
  el: {
    metaTitle: "Μεγάλη Επανάληψη Γεωμετρίας (Δ' Δημοτικού) | LearnMaths.gr",
    metaDesc:
      "Επαναληπτικές ασκήσεις γεωμετρίας για τη Δ' Δημοτικού (Ενότητες 13 - 18): παράλληλες και κάθετες ευθείες, απόσταση, περίμετρος, εμβαδόν, τετράπλευρα και συμμετρία.",
    backText: "Δ' Δημοτικού",
    newTestBtn: 'Νέο Τεστ',
    badge: "Δ' ΔΗΜΟΤΙΚΟΥ • ΕΠΑΝΑΛΗΨΗ ΓΕΩΜΕΤΡΙΑΣ (13 - 18)",
    title: '📐 Μεγάλη Επανάληψη Γεωμετρίας',
    subtitle:
      "15 τυχαίες ερωτήσεις από όλη τη γεωμετρία της Δ' τάξης. Πατώντας «Αλλαγή Ερωτήσεων» τα θέματα ανανεώνονται αυτόματα!",
    refreshBtn: '🔄 Αλλαγή Ερωτήσεων',
    checkBtn: '🎯 Έλεγχος Απαντήσεων',
    scoreLabel: '🏆 Σκορ:',
    successRate: 'Επιτυχία:',
    footerPrompt: 'Συμπλήρωσε όλες τις ερωτήσεις και πάτα «Έλεγχος Απαντήσεων»!',
    correctAnswerIs: 'Η σωστή απάντηση είναι:',
    unitCm: 'cm',
    unitM: 'm',
    unitCm2: 'cm²',
    questions: [
      // 1. Παράλληλες & Κάθετες
      (loc, svg) => ({
        q: 'Δύο ευθείες που βρίσκονται στο ίδιο επίπεδο και δεν τέμνονται ποτέ, όσο κι αν τις προεκτείνουμε, ονομάζονται:',
        correct: 'Παράλληλες ευθείες',
        wrongs: ['Κάθετες ευθείες', 'Τεμνόμενες ευθείες', 'Συμπίπτουσες ευθείες'],
        explainText: 'Παράλληλες ονομάζονται οι ευθείες που διατηρούν σταθερή απόσταση μεταξύ τους και δεν έχουν κανένα κοινό σημείο.',
        svg: svg.parallelLines,
      }),
      (loc, svg) => ({
        q: 'Όταν δύο ευθείες τέμνονται και σχηματίζουν 4 ορθές γωνίες (90°), ονομάζονται:',
        correct: 'Κάθετες ευθείες',
        wrongs: ['Παράλληλες ευθείες', 'Τεμνόμενες μη κάθετες', 'Οριζόντιες ευθείες'],
        explainText: 'Δύο ευθείες είναι κάθετες όταν διασταυρώνονται σχηματίζοντας ορθές γωνίες ακριβώς 90°.',
        svg: svg.perpendicularLines,
      }),
      (loc, svg) => {
        const d = getRandomInt(3, 15);
        return {
          q: `Δύο παράλληλες ευθείες (ε₁) και (ε₂) απέχουν μεταξύ τους ${d} cm. Αν τις προεκτείνουμε κατά 50 cm, πόση θα είναι η μεταξύ τους απόσταση;`,
          correct: `${formatNum(d, loc)} cm`,
          wrongs: [`${formatNum(d + 50, loc)} cm`, `${formatNum(d * 2, loc)} cm`, '0 cm', `${formatNum(d + 10, loc)} cm`],
          explainText: `Οι παράλληλες ευθείες διατηρούν σταθερή απόσταση (${d} cm) σε όλο το μήκος τους.`,
          svg: svg.parallelLines,
        };
      },
      (loc, svg) => ({
        q: 'Ποιο όργανο γεωμετρίας χρησιμοποιούμε για να ελέγξουμε αν δύο ευθείες είναι κάθετες μεταξύ τους;',
        correct: 'Τον γνώμονα',
        wrongs: ['Τον χάρακα (ρίγα)', 'Τον διαβήτη', 'Το μοιρογνωμόνιο'],
        explainText: 'Με τον γνώμονα ελέγχουμε αν η γωνία τομής είναι ορθή (90°).',
        svg: svg.perpendicularLines,
      }),
      (loc, svg) => ({
        q: 'Ποιο από τα παρακάτω ζεύγη γραμμών αποτελεί χαρακτηριστικό παράδειγμα παράλληλων ευθειών;',
        correct: 'Οι δύο απέναντι πλευρές ενός ορθογωνίου',
        wrongs: ['Οι δύο διπλανές πλευρές ενός τετραγώνου', 'Οι δείκτες του ρολογιού στις 3:00', 'Οι διαγώνιοι ενός τετραγώνου'],
        explainText: 'Στο ορθογώνιο οι απέναντι πλευρές είναι παράλληλες και ίσες ανά δύο.',
        svg: svg.rectangle,
      }),

      // 2. Απόσταση Σημείου από Ευθεία
      (loc, svg) => ({
        q: 'Απόσταση ενός σημείου Α από μια ευθεία (ε) ονομάζεται το μήκος του ευθύγραμμου τμήματος που είναι:',
        correct: 'Κάθετο από το σημείο προς την ευθεία',
        wrongs: ['Παράλληλο προς την ευθεία', 'Οποιοδήποτε πλάγιο τμήμα', 'Το μεγαλύτερο δυνατό τμήμα'],
        explainText: 'Η απόσταση ορίζεται αυστηρά ως το μήκος του κάθετου ευθύγραμμου τμήματος.',
        svg: svg.pointToLineClean,
      }),
      (loc, svg) => {
        const d = getRandomInt(4, 14);
        return {
          q: `Το κάθετο τμήμα από το σημείο Κ προς την ευθεία (ε) έχει μήκος ${d} cm, ενώ ένα πλάγιο τμήμα έχει μήκος ${d + 4} cm. Πόση είναι η απόσταση του σημείου Κ από την ευθεία;`,
          correct: `${formatNum(d, loc)} cm`,
          wrongs: [`${formatNum(d + 4, loc)} cm`, `${formatNum(2 * d + 4, loc)} cm`, '4 cm', `${formatNum(d + 2, loc)} cm`],
          explainText: `Η απόσταση μετριέται αποκλειστικά κατά μήκος του κάθετου τμήματος (${d} cm).`,
          svg: svg.pointToLineClean,
        };
      },
      (loc, svg) => ({
        q: 'Ανάμεσα σε όλα τα ευθύγραμμα τμήματα που συνδέουν ένα σημείο Α με μια ευθεία (ε), ποιο έχει πάντοτε το μικρότερο μήκος;',
        correct: 'Το κάθετο ευθύγραμμο τμήμα',
        wrongs: ['Το πιο λοξό πλάγιο τμήμα', 'Το τμήμα που καταλήγει πιο δεξιά', 'Όλα έχουν το ίδιο μήκος'],
        explainText: 'Το κάθετο ευθύγραμμο τμήμα αποτελεί τη συντομότερη διαδρομή από ένα σημείο προς μια ευθεία.',
        svg: svg.pointToLineClean,
      }),
      (loc, svg) => {
        const s = getRandomInt(5, 15);
        return {
          q: `Σε ένα τετράγωνο ΑΒΓΔ πλευράς ${s} cm, πόση είναι η απόσταση της κορυφής Α από την απέναντι πλευρά ΓΔ;`,
          correct: `${formatNum(s, loc)} cm`,
          wrongs: [`${formatNum(2 * s, loc)} cm`, `${formatNum(s * s, loc)} cm`, `${formatNum(s + 4, loc)} cm`, `${formatNum(s * 4, loc)} cm`],
          explainText: `Επειδή η πλευρά ΑΔ είναι κάθετη στη ΓΔ, η απόσταση ισούται ακριβώς με το μήκος της πλευράς του τετραγώνου (${s} cm).`,
          svg: svg.squareLabeled,
        };
      },

      // 3. Περίμετρος
      (loc, svg) => {
        const a = getRandomInt(4, 15);
        const p = 4 * a;
        return {
          q: `Ένα τετράγωνο έχει πλευρά a ＝ ${a} cm. Πόση είναι η περίμετρός του;`,
          correct: `${formatNum(p, loc)} cm`,
          wrongs: [`${formatNum(a * a, loc)} cm`, `${formatNum(2 * a, loc)} cm`, `${formatNum(a + 4, loc)} cm`, `${formatNum(3 * a, loc)} cm`],
          explainText: `Περίμετρος τετραγώνου: 4 · ${a} ＝ ${p} cm.`,
          svg: svg.square,
        };
      },
      (loc, svg) => {
        const w = getRandomInt(8, 20), h = getRandomInt(4, 12);
        const p = 2 * w + 2 * h;
        return {
          q: `Ένα ορθογώνιο έχει μήκος ${w} cm και πλάτος ${h} cm. Πόση είναι η περίμετρός του;`,
          correct: `${formatNum(p, loc)} cm`,
          wrongs: [`${formatNum(w + h, loc)} cm`, `${formatNum(w * h, loc)} cm`, `${formatNum(2 * w + h, loc)} cm`, `${formatNum(p + 4, loc)} cm`],
          explainText: `Περίμετρος ορθογωνίου: (2 · ${w}) ＋ (2 · ${h}) ＝ ${p} cm.`,
          svg: svg.rectangle,
        };
      },
      (loc, svg) => {
        const s = getRandomInt(6, 18);
        const p = 3 * s;
        return {
          q: `Ένα ισόπλευρο τρίγωνο έχει συνολική περίμετρο ${p} cm. Πόσο είναι το μήκος της μίας πλευράς του;`,
          correct: `${formatNum(s, loc)} cm`,
          wrongs: [`${formatNum(p, loc)} cm`, `${formatNum(s * 2, loc)} cm`, `${formatNum(s * 3, loc)} cm`, `${formatNum(s + 3, loc)} cm`],
          explainText: `Το ισόπλευρο τρίγωνο έχει 3 ίσες πλευρές: ${p} : 3 ＝ ${s} cm.`,
          svg: svg.equilateralTriangle,
        };
      },
      (loc, svg) => {
        const s = getRandomInt(4, 15);
        const perim = 4 * s;
        return {
          q: `Ένα τετράγωνο έχει συνολική περίμετρο ${perim} cm. Πόσο μήκος έχει η κάθε πλευρά του;`,
          correct: `${formatNum(s, loc)} cm`,
          wrongs: [`${formatNum(perim / 2, loc)} cm`, `${formatNum(perim * 2, loc)} cm`, `${formatNum(s + 4, loc)} cm`, `${formatNum(perim * 4, loc)} cm`],
          explainText: `Πλευρά τετραγώνου: ${perim} : 4 ＝ ${s} cm.`,
          svg: svg.square,
        };
      },

      // 4. Εμβαδόν
      (loc, svg) => ({
        q: 'Τι εκφράζει το εμβαδόν ενός γεωμετρικού σχήματος;',
        correct: 'Το μέγεθος της εσωτερικής επιφάνειας που καλύπτει το σχήμα',
        wrongs: ['Το συνολικό μήκος του εξωτερικού περιγράμματός του', 'Τον αριθμό των κορυφών του', 'Την απόσταση από το κέντρο του'],
        explainText: 'Το εμβαδόν μετράει το μέγεθος της επιφάνειας που περικλείεται μέσα στις γραμμές του σχήματος.',
        svg: svg.gridArea,
      }),
      (loc, svg) => {
        const a = getRandomInt(3, 12);
        const area = a * a;
        return {
          q: `Ένα τετράγωνο έχει πλευρά a ＝ ${a} cm. Πόσο είναι το εμβαδόν του;`,
          correct: `${formatNum(area, loc)} cm²`,
          wrongs: [`${formatNum(4 * a, loc)} cm²`, `${formatNum(2 * a, loc)} cm²`, `${formatNum(a + a, loc)} cm²`, `${formatNum(a + 4, loc)} cm²`],
          explainText: `Εμβαδόν τετραγώνου: ${a} · ${a} ＝ ${area} cm².`,
          svg: svg.square,
        };
      },
      (loc, svg) => {
        const w = getRandomInt(5, 14), h = getRandomInt(3, 9);
        const area = w * h;
        return {
          q: `Ένα ορθογώνιο έχει μήκος ${w} cm και πλάτος ${h} cm. Πόσο είναι το εμβαδόν του;`,
          correct: `${formatNum(area, loc)} cm²`,
          wrongs: [`${formatNum(2 * w + 2 * h, loc)} cm²`, `${formatNum(w + h, loc)} cm²`, `${formatNum(2 * area, loc)} cm²`, `${formatNum(area + 4, loc)} cm²`],
          explainText: `Εμβαδόν ορθογωνίου: μήκος · πλάτος ＝ ${w} · ${h} ＝ ${area} cm².`,
          svg: svg.rectangle,
        };
      },
      (loc, svg) => ({
        q: 'Ποια είναι η θεμελιώδης μονάδα μέτρησης του εμβαδού στο μετρικό σύστημα;',
        correct: 'Το τετραγωνικό μέτρο (τ.μ.)',
        wrongs: ['Το μέτρο (m)', 'Το τετραγωνικό δεκατόμετρο (τ.δ.)', 'Το γραμμάριο (g)'],
        explainText: 'Βασική μονάδα μέτρησης επιφανειών είναι το τετραγωνικό μέτρο (1 τ.μ.).',
        svg: svg.gridArea,
      }),
      (loc, svg) => {
        const w = getRandomInt(4, 12), h = getRandomInt(2, 8);
        const area = w * h;
        return {
          q: `Ένα ορθογώνιο έχει εμβαδόν ${area} cm² και μήκος ${w} cm. Πόσο είναι το πλάτος του;`,
          correct: `${formatNum(h, loc)} cm`,
          wrongs: [`${formatNum(area - w, loc)} cm`, `${formatNum(area + w, loc)} cm`, `${formatNum(w + 2, loc)} cm`, `${formatNum(area * w, loc)} cm`],
          explainText: `Πλάτος: ${area} : ${w} ＝ ${h} cm.`,
          svg: svg.rectangle,
        };
      },

      // 5. Τετράπλευρα
      (loc, svg) => ({
        q: 'Ποιο κανονικό τετράπλευρο έχει ΚΑΙ τις 4 πλευρές του ίσες ΚΑΙ 4 ορθές γωνίες (90°);',
        correct: 'Το Τετράγωνο',
        wrongs: ['Ο Ρόμβος', 'Το Ορθογώνιο', 'Το Τραπέζιο'],
        explainText: 'Το τετράγωνο συνδυάζει 4 ίσες πλευρές και 4 ορθές γωνίες.',
        svg: svg.square,
      }),
      (loc, svg) => ({
        q: 'Ποια είναι η βασική ιδιότητα του Ρόμβου;',
        correct: 'Έχει 4 ίσες πλευρές, αλλά οι γωνίες του δεν είναι ορθές',
        wrongs: ['Έχει μόνο 2 ίσες πλευρές', 'Έχει 4 ορθές γωνίες', 'Έχει 3 κορυφές'],
        explainText: 'Ο ρόμβος έχει και τις 4 πλευρές ίσες, αλλά οι γωνίες του είναι πλάγιες (όχι 90°).',
        svg: svg.rhombus,
      }),
      (loc, svg) => ({
        q: 'Ποιο από τα παρακάτω τετράπλευρα ΔΕΝ είναι παραλληλόγραμμο;',
        correct: 'Το Τραπέζιο',
        wrongs: ['Το Τετράγωνο', 'Το Ορθογώνιο', 'Ο Ρόμβος'],
        explainText: 'Τα παραλληλόγραμμα έχουν απέναντι πλευρές παράλληλες ανά δύο. Το τραπέζιο έχει μόνο ένα ζεύγος παράλληλων πλευρών.',
        svg: svg.genericQuadrilateral,
      }),

      // 6. Συμμετρία
      (loc, svg) => ({
        q: 'Πόσους άξονες συμμετρίας έχει συνολικά το Τετράγωνο;',
        correct: '4',
        wrongs: ['2', '1', 'Άπειρους'],
        explainText: 'Το τετράγωνο έχει 4 άξονες συμμετρίας: 1 κατακόρυφο, 1 οριζόντιο και 2 διαγώνιους.',
        svg: svg.square,
      }),
      (loc, svg) => ({
        q: 'Πόσους άξονες συμμετρίας έχει το Ορθογώνιο Παραλληλόγραμμο;',
        correct: '2',
        wrongs: ['4', '1', '0'],
        explainText: 'Το ορθογώνιο έχει 2 άξονες συμμετρίας (1 κατακόρυφο και 1 οριζόντιο). Οι διαγώνιοί του δεν είναι άξονες συμμετρίας.',
        svg: svg.rectangle,
      }),
      (loc, svg) => ({
        q: 'Πόσους άξονες συμμετρίας έχει ο Κύκλος;',
        correct: 'Αμέτρητους (άπειρους)',
        wrongs: ['4', '2', '1'],
        explainText: 'Κάθε ευθεία που διέρχεται από το κέντρο του κύκλου είναι άξονας συμμετρίας.',
        svg: svg.circle,
      }),
      (loc, svg) => ({
        q: 'Πόσους άξονες συμμετρίας έχει ένα Σκαληνό Τρίγωνο (με όλες τις πλευρές άνισες);',
        correct: '0',
        wrongs: ['1', '2', '3'],
        explainText: 'Το σκαληνό τρίγωνο δεν έχει κανέναν άξονα συμμετρίας (0).',
        svg: svg.scaleneTriangle,
      }),
      (loc, svg) => ({
        q: 'Πόσους άξονες συμμετρίας έχει το Ισόπλευρο Τρίγωνο;',
        correct: '3',
        wrongs: ['1', '2', '0'],
        explainText: 'Το ισόπλευρο τρίγωνο έχει 3 άξονες συμμετρίας, έναν από κάθε κορυφή του.',
        svg: svg.equilateralTriangle,
      }),
      (loc, svg) => ({
        q: 'Πόσους άξονες συμμετρίας έχει το Ισοσκελές Τρίγωνο;',
        correct: '1',
        wrongs: ['3', '2', '0'],
        explainText: 'Το ισοσκελές τρίγωνο (με 2 ίσες πλευρές) έχει μόνο 1 άξονα συμμετρίας.',
        svg: svg.isoscelesTriangle,
      }),
      (loc, svg) => {
        const halfArea = getRandomInt(12, 40);
        const total = 2 * halfArea;
        return {
          q: `Ένας άξονας συμμετρίας χωρίζει ένα σχήμα σε δύο συμμετρικά μέρη. Αν το ένα μέρος έχει εμβαδόν ${halfArea} cm², πόσο είναι το συνολικό εμβαδόν του σχήματος;`,
          correct: `${formatNum(total, loc)} cm²`,
          wrongs: [`${formatNum(halfArea, loc)} cm²`, `${formatNum(halfArea * halfArea, loc)} cm²`, `${formatNum(halfArea + 4, loc)} cm²`, `${formatNum(total + 6, loc)} cm²`],
          explainText: `Τα δύο συμμετρικά μέρη είναι ίσα: ${halfArea} ＋ ${halfArea} ＝ ${total} cm².`,
          svg: svg.rectangle,
        };
      },
      (loc, svg) => {
        const perim = getRandomInt(15, 35);
        return {
          q: `Ένας άξονας συμμετρίας χωρίζει ένα σχήμα σε δύο συμμετρικά μέρη. Αν το πρώτο μέρος έχει περίμετρο ${perim} cm, πόση είναι η περίμετρος του δεύτερου μέρους;`,
          correct: `${formatNum(perim, loc)} cm`,
          wrongs: [`${formatNum(2 * perim, loc)} cm`, `${formatNum(perim + 2, loc)} cm`, 'Δεν υπολογίζεται', `${formatNum(perim + 4, loc)} cm`],
          explainText: `Τα συμμετρικά μέρη έχουν ακριβώς την ίδια περίμετρο (${perim} cm).`,
          svg: svg.square,
        };
      },
    ],
  },
  en: {
    metaTitle: 'Comprehensive Geometry Review (Grade 4) | LearnMaths.gr',
    metaDesc:
      'Review geometry exercises for Grade 4 (Units 13 - 18): parallel and perpendicular lines, distance, perimeter, area, quadrilaterals, and symmetry.',
    backText: 'Grade 4',
    newTestBtn: 'New Test',
    badge: 'GRADE 4 • GEOMETRY REVIEW (13 - 18)',
    title: '📐 Comprehensive Geometry Review',
    subtitle:
      '15 randomized questions covering all Grade 4 geometry topics. Click "Change Questions" to load a new set!',
    refreshBtn: '🔄 Change Questions',
    checkBtn: '🎯 Check Answers',
    scoreLabel: '🏆 Score:',
    successRate: 'Success:',
    footerPrompt: 'Answer all questions and click "Check Answers"!',
    correctAnswerIs: 'The correct answer is:',
    unitCm: 'cm',
    unitM: 'm',
    unitCm2: 'cm²',
    questions: [
      // 1. Parallel & Perpendicular Lines
      (loc, svg) => ({
        q: 'Two lines lying in the same plane that never intersect, no matter how far they are extended, are called:',
        correct: 'Parallel lines',
        wrongs: ['Perpendicular lines', 'Intersecting lines', 'Coincident lines'],
        explainText: 'Parallel lines maintain a constant distance from each other and share no common points.',
        svg: svg.parallelLines,
      }),
      (loc, svg) => ({
        q: 'When two lines intersect to form 4 right angles (90°), they are called:',
        correct: 'Perpendicular lines',
        wrongs: ['Parallel lines', 'Non-perpendicular intersecting lines', 'Horizontal lines'],
        explainText: 'Two lines are perpendicular when they cross each other at right angles of exactly 90°.',
        svg: svg.perpendicularLines,
      }),
      (loc, svg) => {
        const d = getRandomInt(3, 15);
        return {
          q: `Two parallel lines (L₁) and (L₂) are ${d} cm apart. If extended by 50 cm, what will the distance between them be?`,
          correct: `${formatNum(d, loc)} cm`,
          wrongs: [`${formatNum(d + 50, loc)} cm`, `${formatNum(d * 2, loc)} cm`, '0 cm', `${formatNum(d + 10, loc)} cm`],
          explainText: `Parallel lines maintain a constant distance (${d} cm) along their entire length.`,
          svg: svg.parallelLines,
        };
      },
      (loc, svg) => ({
        q: 'Which geometry tool do we use to verify whether two lines are perpendicular to each other?',
        correct: 'Set square',
        wrongs: ['Ruler', 'Compass', 'Protractor'],
        explainText: 'A set square is used to test whether an intersection angle is a right angle (90°).',
        svg: svg.perpendicularLines,
      }),
      (loc, svg) => ({
        q: 'Which of the following pairs of lines is a prime example of parallel lines?',
        correct: 'Opposite sides of a rectangle',
        wrongs: ['Adjacent sides of a square', 'Clock hands at 3:00', 'Diagonals of a square'],
        explainText: 'In a rectangle, opposite sides are parallel and equal in pairs.',
        svg: svg.rectangle,
      }),

      // 2. Distance from a Point to a Line
      (loc, svg) => ({
        q: 'The distance from a point A to a line (L) is defined as the length of the line segment that is:',
        correct: 'Perpendicular from the point to the line',
        wrongs: ['Parallel to the line', 'Any oblique line segment', 'The longest possible segment'],
        explainText: 'Distance is strictly defined as the length of the perpendicular segment.',
        svg: svg.pointToLineClean,
      }),
      (loc, svg) => {
        const d = getRandomInt(4, 14);
        return {
          q: `The perpendicular segment from point K to line (L) has a length of ${d} cm, while a slanted segment has a length of ${d + 4} cm. What is the distance of point K from the line?`,
          correct: `${formatNum(d, loc)} cm`,
          wrongs: [`${formatNum(d + 4, loc)} cm`, `${formatNum(2 * d + 4, loc)} cm`, '4 cm', `${formatNum(d + 2, loc)} cm`],
          explainText: `Distance is measured exclusively along the perpendicular segment (${d} cm).`,
          svg: svg.pointToLineClean,
        };
      },
      (loc, svg) => ({
        q: 'Among all line segments connecting a point A to a line (L), which one always has the shortest length?',
        correct: 'The perpendicular line segment',
        wrongs: ['The most slanted segment', 'The segment ending farthest to the right', 'All have the same length'],
        explainText: 'The perpendicular segment represents the shortest path from a point to a line.',
        svg: svg.pointToLineClean,
      }),
      (loc, svg) => {
        const s = getRandomInt(5, 15);
        return {
          q: `In a square ABCD with side length ${s} cm, what is the distance from vertex A to the opposite side CD?`,
          correct: `${formatNum(s, loc)} cm`,
          wrongs: [`${formatNum(2 * s, loc)} cm`, `${formatNum(s * s, loc)} cm`, `${formatNum(s + 4, loc)} cm`, `${formatNum(s * 4, loc)} cm`],
          explainText: `Since side AD is perpendicular to CD, the distance equals exactly the side length of the square (${s} cm).`,
          svg: svg.squareLabeled,
        };
      },

      // 3. Perimeter
      (loc, svg) => {
        const a = getRandomInt(4, 15);
        const p = 4 * a;
        return {
          q: `A square has side length a ＝ ${a} cm. What is its perimeter?`,
          correct: `${formatNum(p, loc)} cm`,
          wrongs: [`${formatNum(a * a, loc)} cm`, `${formatNum(2 * a, loc)} cm`, `${formatNum(a + 4, loc)} cm`, `${formatNum(3 * a, loc)} cm`],
          explainText: `Square perimeter: 4 · ${a} ＝ ${p} cm.`,
          svg: svg.square,
        };
      },
      (loc, svg) => {
        const w = getRandomInt(8, 20), h = getRandomInt(4, 12);
        const p = 2 * w + 2 * h;
        return {
          q: `A rectangle has length ${w} cm and width ${h} cm. What is its perimeter?`,
          correct: `${formatNum(p, loc)} cm`,
          wrongs: [`${formatNum(w + h, loc)} cm`, `${formatNum(w * h, loc)} cm`, `${formatNum(2 * w + h, loc)} cm`, `${formatNum(p + 4, loc)} cm`],
          explainText: `Rectangle perimeter: (2 · ${w}) ＋ (2 · ${h}) ＝ ${p} cm.`,
          svg: svg.rectangle,
        };
      },
      (loc, svg) => {
        const s = getRandomInt(6, 18);
        const p = 3 * s;
        return {
          q: `An equilateral triangle has a total perimeter of ${p} cm. What is the length of one of its sides?`,
          correct: `${formatNum(s, loc)} cm`,
          wrongs: [`${formatNum(p, loc)} cm`, `${formatNum(s * 2, loc)} cm`, `${formatNum(s * 3, loc)} cm`, `${formatNum(s + 3, loc)} cm`],
          explainText: `An equilateral triangle has 3 equal sides: ${p} : 3 ＝ ${s} cm.`,
          svg: svg.equilateralTriangle,
        };
      },
      (loc, svg) => {
        const s = getRandomInt(4, 15);
        const perim = 4 * s;
        return {
          q: `A square has a total perimeter of ${perim} cm. What is the length of each of its sides?`,
          correct: `${formatNum(s, loc)} cm`,
          wrongs: [`${formatNum(perim / 2, loc)} cm`, `${formatNum(perim * 2, loc)} cm`, `${formatNum(s + 4, loc)} cm`, `${formatNum(perim * 4, loc)} cm`],
          explainText: `Side of a square: ${perim} : 4 ＝ ${s} cm.`,
          svg: svg.square,
        };
      },

      // 4. Area
      (loc, svg) => ({
        q: 'What does the area of a geometric shape represent?',
        correct: 'The measure of the flat internal surface covered by the shape',
        wrongs: ['The total length of its outer boundary', 'The total number of its vertices', 'The distance from its center'],
        explainText: 'Area measures the size of the 2D surface enclosed within the boundary of a shape.',
        svg: svg.gridArea,
      }),
      (loc, svg) => {
        const a = getRandomInt(3, 12);
        const area = a * a;
        return {
          q: `A square has side length a ＝ ${a} cm. What is its area?`,
          correct: `${formatNum(area, loc)} cm²`,
          wrongs: [`${formatNum(4 * a, loc)} cm²`, `${formatNum(2 * a, loc)} cm²`, `${formatNum(a + a, loc)} cm²`, `${formatNum(a + 4, loc)} cm²`],
          explainText: `Area of a square: ${a} · ${a} ＝ ${area} cm².`,
          svg: svg.square,
        };
      },
      (loc, svg) => {
        const w = getRandomInt(5, 14), h = getRandomInt(3, 9);
        const area = w * h;
        return {
          q: `A rectangle has length ${w} cm and width ${h} cm. What is its area?`,
          correct: `${formatNum(area, loc)} cm²`,
          wrongs: [`${formatNum(2 * w + 2 * h, loc)} cm²`, `${formatNum(w + h, loc)} cm²`, `${formatNum(2 * area, loc)} cm²`, `${formatNum(area + 4, loc)} cm²`],
          explainText: `Area of a rectangle: length · width ＝ ${w} · ${h} ＝ ${area} cm².`,
          svg: svg.rectangle,
        };
      },
      (loc, svg) => ({
        q: 'What is the base unit of measurement for area in the metric system?',
        correct: 'Square meter (sq.m)',
        wrongs: ['Meter (m)', 'Square decimeter (sq.dm)', 'Gram (g)'],
        explainText: 'The standard base unit for measuring area is the square meter (1 sq.m).',
        svg: svg.gridArea,
      }),
      (loc, svg) => {
        const w = getRandomInt(4, 12), h = getRandomInt(2, 8);
        const area = w * h;
        return {
          q: `A rectangle has an area of ${area} cm² and a length of ${w} cm. What is its width?`,
          correct: `${formatNum(h, loc)} cm`,
          wrongs: [`${formatNum(area - w, loc)} cm`, `${formatNum(area + w, loc)} cm`, `${formatNum(w + 2, loc)} cm`, `${formatNum(area * w, loc)} cm`],
          explainText: `Width: ${area} : ${w} ＝ ${h} cm.`,
          svg: svg.rectangle,
        };
      },

      // 5. Quadrilaterals
      (loc, svg) => ({
        q: 'Which regular quadrilateral has BOTH all 4 sides equal AND 4 right angles (90°)?',
        correct: 'The Square',
        wrongs: ['The Rhombus', 'The Rectangle', 'The Trapezoid'],
        explainText: 'A square combines 4 equal sides and 4 right angles.',
        svg: svg.square,
      }),
      (loc, svg) => ({
        q: 'What is the key defining property of a Rhombus?',
        correct: 'It has 4 equal sides, but its angles are not right angles',
        wrongs: ['It only has 2 equal sides', 'It has 4 right angles', 'It has 3 vertices'],
        explainText: 'A rhombus has all 4 sides equal, but its angles are slanted (not 90°).',
        svg: svg.rhombus,
      }),
      (loc, svg) => ({
        q: 'Which of the following quadrilaterals is NOT a parallelogram?',
        correct: 'The Trapezoid',
        wrongs: ['The Square', 'The Rectangle', 'The Rhombus'],
        explainText: 'Parallelograms have opposite sides parallel in pairs. A trapezoid has only one pair of parallel sides.',
        svg: svg.genericQuadrilateral,
      }),

      // 6. Symmetry
      (loc, svg) => ({
        q: 'How many lines of symmetry does a Square have in total?',
        correct: '4',
        wrongs: ['2', '1', 'Infinite'],
        explainText: 'A square has 4 lines of symmetry: 1 vertical, 1 horizontal, and 2 diagonals.',
        svg: svg.square,
      }),
      (loc, svg) => ({
        q: 'How many lines of symmetry does a Rectangle have?',
        correct: '2',
        wrongs: ['4', '1', '0'],
        explainText: 'A rectangle has 2 lines of symmetry (1 vertical and 1 horizontal). Its diagonals are not lines of symmetry.',
        svg: svg.rectangle,
      }),
      (loc, svg) => ({
        q: 'How many lines of symmetry does a Circle have?',
        correct: 'Infinite (∞)',
        wrongs: ['4', '2', '1'],
        explainText: 'Every straight line passing through the center of a circle is a line of symmetry.',
        svg: svg.circle,
      }),
      (loc, svg) => ({
        q: 'How many lines of symmetry does a Scalene Triangle (with all sides unequal) have?',
        correct: '0',
        wrongs: ['1', '2', '3'],
        explainText: 'A scalene triangle has no lines of symmetry (0).',
        svg: svg.scaleneTriangle,
      }),
      (loc, svg) => ({
        q: 'How many lines of symmetry does an Equilateral Triangle have?',
        correct: '3',
        wrongs: ['1', '2', '0'],
        explainText: 'An equilateral triangle has 3 lines of symmetry, one passing through each vertex.',
        svg: svg.equilateralTriangle,
      }),
      (loc, svg) => ({
        q: 'How many lines of symmetry does an Isosceles Triangle have?',
        correct: '1',
        wrongs: ['3', '2', '0'],
        explainText: 'An isosceles triangle (with 2 equal sides) has only 1 line of symmetry.',
        svg: svg.isoscelesTriangle,
      }),
      (loc, svg) => {
        const halfArea = getRandomInt(12, 40);
        const total = 2 * halfArea;
        return {
          q: `A line of symmetry divides a shape into two symmetrical halves. If one half has an area of ${halfArea} cm², what is the total area of the shape?`,
          correct: `${formatNum(total, loc)} cm²`,
          wrongs: [`${formatNum(halfArea, loc)} cm²`, `${formatNum(halfArea * halfArea, loc)} cm²`, `${formatNum(halfArea + 4, loc)} cm²`, `${formatNum(total + 6, loc)} cm²`],
          explainText: `Both symmetrical halves are equal: ${halfArea} ＋ ${halfArea} ＝ ${total} cm².`,
          svg: svg.rectangle,
        };
      },
      (loc, svg) => {
        const perim = getRandomInt(15, 35);
        return {
          q: `A line of symmetry divides a shape into two symmetrical halves. If the first half has a perimeter of ${perim} cm, what is the perimeter of the second half?`,
          correct: `${formatNum(perim, loc)} cm`,
          wrongs: [`${formatNum(2 * perim, loc)} cm`, `${formatNum(perim + 2, loc)} cm`, 'Cannot be determined', `${formatNum(perim + 4, loc)} cm`],
          explainText: `Symmetrical halves have exactly the same perimeter (${perim} cm).`,
          svg: svg.square,
        };
      },
    ],
  },
};

function generateRandomExam(t, locale) {
  const svgs = getSvgShapes(locale);
  const shuffled = [...t.questions].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 15);

  return selected.map((fn, index) => {
    const raw = fn(locale, svgs);
    const uniqueOptions = make4UniqueOptions(raw.correct, raw.wrongs);
    return {
      id: index + 1,
      q: raw.q,
      correct: raw.correct,
      explainText: raw.explainText,
      svg: raw.svg,
      options: uniqueOptions,
    };
  });
}

export default function EpanalipsiGeometryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewExam = () => {
    const newQuestions = generateRandomExam(t, locale);
    setQuestions(newQuestions);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  useEffect(() => {
    loadNewExam();
  }, [locale]);

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
      title={t.metaTitle}
      description={t.metaDesc}
      backUrl="/d-dimotikou"
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <button
          onClick={loadNewExam}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>🔄</span> {t.newTestBtn}
        </button>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              {toCleanUppercase(t.badge)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              {t.title}
            </h1>
            <p className="text-indigo-100 text-xs sm:text-sm md:text-base">{t.subtitle}</p>
          </div>

          <button
            onClick={loadNewExam}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-blue-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            {t.refreshBtn}
          </button>
        </div>

        {/* FORM ΕΡΩΤΗΣΕΩΝ */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
                        <span className="break-words whitespace-normal leading-snug flex-1">
                          {opt}
                        </span>
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
                        {t.correctAnswerIs} <strong className="font-bold text-rose-900">{q.correct}</strong>. {q.explainText}
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
                {t.checkBtn}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* STICKY FOOTER SCORES & FEEDBACK BAR */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-base sm:text-lg flex items-center gap-2 shadow-sm">
              <span>{t.scoreLabel}</span>
              <span className="text-xl sm:text-2xl font-mono">{score} / 15</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {t.successRate}{' '}
                <span className="text-emerald-400 font-black">
                  {Math.round((score / 15) * 100)}%
                </span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                onClick={loadNewExam}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2 rounded-xl shadow-md transition text-xs sm:text-sm flex items-center gap-2"
              >
                <span>🔄</span> {t.newTestBtn}
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">{t.footerPrompt}</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}