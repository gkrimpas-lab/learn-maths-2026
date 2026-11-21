import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// --- Βοηθητική Συνάρτηση για Άτονα Κεφαλαία (διατηρεί το Β') ---
function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Β')/g);
  return parts
    .map((part) => {
      if (part === "Β'") return "Β'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

// --- Custom Μαθηματικά Components ---
function Angle({ children, className = '' }) {
  return (
    <span className={`relative inline-block leading-none mx-[1px] ${className}`}>
      <svg
        viewBox="0 0 12 6"
        className="w-[0.75em] h-[0.36em] absolute -top-[0.38em] left-1/2 -translate-x-1/2 text-current overflow-visible pointer-events-none"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M1 5 L6 1 L11 5" />
      </svg>
      <span>{children}</span>
    </span>
  );
}

function Arc({ children, className = '' }) {
  return (
    <span className={`relative inline-block leading-none mx-[1px] ${className}`}>
      <svg
        viewBox="0 0 16 6"
        className="w-[0.95em] h-[0.36em] absolute -top-[0.4em] left-1/2 -translate-x-1/2 text-current overflow-visible pointer-events-none"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M1 5 Q8 0.5 15 5" />
      </svg>
      <span>{children}</span>
    </span>
  );
}

function Frac({ num, den, className = '' }) {
  return (
    <span
      className={`inline-flex flex-col text-center align-middle mx-0.5 sm:mx-1 font-mono text-[0.88em] leading-none shrink-0 max-w-full ${className}`}
    >
      <span className="border-b border-current px-1 pb-0.5 whitespace-nowrap font-semibold">
        {num}
      </span>
      <span className="px-1 pt-0.5 whitespace-nowrap font-semibold">
        {den}
      </span>
    </span>
  );
}

function Radical({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-stretch align-middle font-mono shrink-0 select-none mx-0.5 ${className}`}
    >
      <svg
        viewBox="0 0 14 24"
        className="w-[0.6em] self-stretch shrink-0 text-current overflow-visible"
        preserveAspectRatio="none"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        aria-hidden="true"
      >
        <path d="M 1 13.5 L 4 13.5 L 7.5 22.8 L 13.6 0.8" />
      </svg>
      <span className="border-t-[1.9px] border-current pl-0.5 pr-1 pt-0.5 pb-[1px] leading-none inline-flex items-center text-[0.95em] font-semibold">
        {children}
      </span>
    </span>
  );
}

function Pow({ base, exp, parens = false, className = '' }) {
  return (
    <span className={`inline-flex items-baseline font-mono leading-none mx-[1px] ${className}`}>
      {parens ? (
        <span className="inline-flex items-center">
          <span>(</span>
          {base}
          <span>)</span>
        </span>
      ) : (
        <span>{base}</span>
      )}
      <sup className="text-[0.72em] font-bold leading-none ml-[1px] -top-[0.45em] relative">
        {exp}
      </sup>
    </span>
  );
}

// --- Βοηθητικές Συναρτήσεις Παραγωγής Ασκήσεων ---
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

function sanitizeInput(val) {
  if (val === null || val === undefined) return '';
  return String(val)
    .trim()
    .replace(/\s+/g, '')
    .replace(/,/g, '.')
    .replace(/^\+/, '');
}

function ensureFourUniqueOptions(correctOpt, distractorPool) {
  const seen = new Set([correctOpt.key]);
  const result = [correctOpt];
  for (const d of shuffle(distractorPool)) {
    if (!seen.has(d.key)) {
      seen.add(d.key);
      result.push(d);
    }
    if (result.length === 4) break;
  }
  let fallbackIdx = 1;
  while (result.length < 4) {
    const fk = `fallback_${fallbackIdx++}`;
    if (!seen.has(fk)) {
      seen.add(fk);
      result.push({ key: fk, labelEl: String(fallbackIdx * 7), labelEn: String(fallbackIdx * 7) });
    }
  }
  return shuffle(result);
}

// --- Γεννήτρια 12 Δυναμικών Ερωτήσεων Κεφαλαίου 7 ---
function generateQuestions() {
  const questions = [];

  // Q1 (TF): Ορισμός γραμμικής κανονικότητας & σταθερή διαφορά
  {
    const mode = randInt(1, 3);
    if (mode === 1) {
      const a = pickRandom([2, 3, 4, 5]);
      const b = pickRandom([1, 2, 3, 7]);
      questions.push({
        id: 1,
        type: 'tf',
        promptEl: `Στη γραμμική αριθμητική κανονικότητα y ＝ ${a} · ν ＋ ${b}, η διαφορά οποιωνδήποτε δύο διαδοχικών όρων είναι σταθερή και ίση με ${a}.`,
        promptEn: `In the linear number pattern y ＝ ${a} · ν ＋ ${b}, the difference between any two consecutive terms is constant and equal to ${a}.`,
        correct: 'true',
        correctTextEl: 'Σωστό',
        correctTextEn: 'True',
        explanationEl: `Ο συντελεστής α ＝ ${a} εκφράζει τη σταθερή διαφορά (βήμα) ανάμεσα σε κάθε όρο και τον προηγούμενό του.`,
        explanationEn: `The coefficient α ＝ ${a} represents the constant step difference between consecutive terms.`,
      });
    } else if (mode === 2) {
      const a = pickRandom([3, 4, 5]);
      const b = pickRandom([2, 6, 8]);
      questions.push({
        id: 1,
        type: 'tf',
        promptEl: `Στη γραμμική κανονικότητα y ＝ ${a} · ν ＋ ${b}, ο 1ος όρος (ν ＝ 1) ισούται με ${b}.`,
        promptEn: `In the linear pattern y ＝ ${a} · ν ＋ ${b}, the 1st term (ν ＝ 1) equals ${b}.`,
        correct: 'false',
        correctTextEl: 'Λάθος',
        correctTextEn: 'False',
        explanationEl: `Για ν ＝ 1 έχουμε y₁ ＝ ${a} · 1 ＋ ${b} ＝ ${a + b} (όχι ${b}).`,
        explanationEn: `For ν ＝ 1 we get y₁ ＝ ${a} · 1 ＋ ${b} ＝ ${a + b} (not ${b}).`,
      });
    } else {
      questions.push({
        id: 1,
        type: 'tf',
        promptEl: (
          <span className="inline-flex flex-wrap items-baseline gap-1">
            <span>Η ακολουθία των τετράγωνων αριθμών y ＝</span>
            <Pow base="ν" exp="2" />
            <span>(1, 4, 9, 16, ...) είναι γραμμική αριθμητική κανονικότητα.</span>
          </span>
        ),
        promptEn: (
          <span className="inline-flex flex-wrap items-baseline gap-1">
            <span>The sequence of square numbers y ＝</span>
            <Pow base="ν" exp="2" />
            <span>(1, 4, 9, 16, ...) is a linear number pattern.</span>
          </span>
        ),
        correct: 'false',
        correctTextEl: 'Λάθος',
        correctTextEn: 'False',
        explanationEl: 'Οι διαφορές διαδοχικών τετράγωνων αριθμών (+3, +5, +7, ...) δεν είναι σταθερές, άρα δεν είναι γραμμική κανονικότητα.',
        explanationEn: 'Consecutive differences (+3, +5, +7, ...) are not constant, so it is not linear.',
      });
    }
  }

  // Q2 (Input): Υπολογισμός όρου y για δοσμένη θέση ν (y = α * ν + β με ακέραιους)
  {
    const a = pickRandom([2, 3, 4, 5, 6]);
    const b = pickRandom([-3, -2, -1, 1, 2, 4, 5]);
    const n = pickRandom([6, 7, 8, 9, 11, 12]);
    const ans = a * n + b;
    const formulaStr = b > 0 ? `y ＝ ${a} · ν ＋ ${b}` : `y ＝ ${a} · ν － ${Math.abs(b)}`;
    questions.push({
      id: 2,
      type: 'input',
      promptEl: `Δίνεται η γραμμική κανονικότητα ${formulaStr}. Ποιος είναι ο ${n}ος όρος (ν ＝ ${n});`,
      promptEn: `Given the linear pattern ${formulaStr}, what is the ${n}th term (ν ＝ ${n})?`,
      correct: String(ans),
      correctTextEl: String(ans),
      correctTextEn: String(ans),
      explanationEl: `Αντικαθιστούμε ν ＝ ${n}: y ＝ ${a} · ${n} ${b > 0 ? `＋ ${b}` : `－ ${Math.abs(b)}`} ＝ ${a * n} ${b > 0 ? `＋ ${b}` : `－ ${Math.abs(b)}`} ＝ ${ans}.`,
      explanationEn: `Substitute ν ＝ ${n}: y ＝ ${a} · ${n} ${b > 0 ? `＋ ${b}` : `－ ${Math.abs(b)}`} ＝ ${ans}.`,
    });
  }

  // Q3 (Input): Γραμμική κανονικότητα με ρητούς συντελεστές (δεκαδικό ή κλάσμα)
  {
    const mode = randInt(1, 2);
    if (mode === 1) {
      const a = pickRandom([0.5, 1.5, 2.5]);
      const b = pickRandom([1, 2, 3]);
      const n = pickRandom([4, 6, 8, 10]);
      const ans = a * n + b;
      const aEl = String(a).replace('.', ',');
      questions.push({
        id: 3,
        type: 'input',
        promptEl: `Σε μια γραμμική κανονικότητα ρητών αριθμών ισχύει y ＝ ${aEl} · ν ＋ ${b}. Ποιος είναι ο όρος στη θέση ν ＝ ${n};`,
        promptEn: `In a linear rational pattern y ＝ ${a} · ν ＋ ${b}, what is the term at position ν ＝ ${n}?`,
        correct: String(ans),
        correctTextEl: String(ans).replace('.', ','),
        correctTextEn: String(ans),
        explanationEl: `Για ν ＝ ${n}: y ＝ ${aEl} · ${n} ＋ ${b} ＝ ${String(a * n).replace('.', ',')} ＋ ${b} ＝ ${String(ans).replace('.', ',')}.`,
        explanationEn: `For ν ＝ ${n}: y ＝ ${a} · ${n} ＋ ${b} ＝ ${a * n} ＋ ${b} ＝ ${ans}.`,
      });
    } else {
      const den = pickRandom([2, 3, 4]);
      const b = pickRandom([1, 2, 5]);
      const n = den * pickRandom([2, 3, 4]);
      const ans = n / den + b;
      questions.push({
        id: 3,
        type: 'input',
        promptEl: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>Δίνεται η κανονικότητα y ＝</span>
            <Frac num="1" den={String(den)} />
            <span>· ν ＋ {b}. Ποιος είναι ο όρος για ν ＝ {n};</span>
          </span>
        ),
        promptEn: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>Given the pattern y ＝</span>
            <Frac num="1" den={String(den)} />
            <span>· ν ＋ {b}, find the term for ν ＝ {n}:</span>
          </span>
        ),
        correct: String(ans),
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>y ＝</span>
            <Frac num="1" den={String(den)} />
            <span>· {n} ＋ {b} ＝ {n / den} ＋ {b} ＝ {ans}.</span>
          </span>
        ),
        explanationEn: (
          <span className="inline-flex flex-wrap items-center gap-1">
            <span>y ＝</span>
            <Frac num="1" den={String(den)} />
            <span>· {n} ＋ {b} ＝ {ans}.</span>
          </span>
        ),
      });
    }
  }

  // Q4 (MCQ): Αναγνώριση τύπου κανονικότητας από 4 πρώτους όρους
  {
    const a = pickRandom([2, 3, 4, 5]);
    const b = pickRandom([-2, -1, 1, 2, 3]);
    const seq = [1, 2, 3, 4].map((n) => a * n + b);
    const fmtF = (aa, bb) => {
      if (bb === 0) return `y ＝ ${aa} · ν`;
      return bb > 0 ? `y ＝ ${aa} · ν ＋ ${bb}` : `y ＝ ${aa} · ν － ${Math.abs(bb)}`;
    };
    const correctLabel = fmtF(a, b);
    const correctOpt = {
      key: 'correct',
      labelEl: correctLabel,
      labelEn: correctLabel,
    };
    const distractors = [
      { key: 'w1', labelEl: fmtF(seq[0], a), labelEn: fmtF(seq[0], a) },
      { key: 'w2', labelEl: fmtF(a + 1, b), labelEn: fmtF(a + 1, b) },
      { key: 'w3', labelEl: fmtF(a, -b === 0 ? 2 : -b), labelEn: fmtF(a, -b === 0 ? 2 : -b) },
      { key: 'w4', labelEl: fmtF(a, b + a), labelEn: fmtF(a, b + a) },
    ];
    questions.push({
      id: 4,
      type: 'mcq',
      promptEl: `Οι τέσσερις πρώτοι όροι μιας γραμμικής κανονικότητας είναι: ${seq.join(', ')}. Ποιος είναι ο τύπος της κανονικότητας;`,
      promptEn: `The first four terms of a linear pattern are: ${seq.join(', ')}. Which formula represents this pattern?`,
      options: ensureFourUniqueOptions(correctOpt, distractors),
      correct: 'correct',
      correctTextEl: correctLabel,
      correctTextEn: correctLabel,
      explanationEl: `Η σταθερή διαφορά είναι α ＝ ${seq[1]} － (${seq[0]}) ＝ ${a}, ενώ β ＝ y₁ － α ＝ ${seq[0]} － ${a} ＝ ${b}. Άρα ${correctLabel}.`,
      explanationEn: `Constant difference α ＝ ${a} and β ＝ y₁ － α ＝ ${b}, giving ${correctLabel}.`,
    });
  }

  // Q5 (Input): Εύρεση θέσης ν για δοσμένο όρο y
  {
    const a = pickRandom([3, 4, 5, 6]);
    const b = pickRandom([1, 2, 3, 4, 5]);
    const targetN = pickRandom([7, 8, 9, 11, 12, 14]);
    const targetY = a * targetN + b;
    questions.push({
      id: 5,
      type: 'input',
      unitEl: '(θέση ν)',
      unitEn: '(position ν)',
      promptEl: `Στη γραμμική κανονικότητα y ＝ ${a} · ν ＋ ${b}, σε ποια θέση ν βρίσκεται ο όρος ${targetY};`,
      promptEn: `In the linear pattern y ＝ ${a} · ν ＋ ${b}, at which position ν is the term ${targetY}?`,
      correct: String(targetN),
      correctTextEl: String(targetN),
      correctTextEn: String(targetN),
      explanationEl: (
        <span className="inline-flex flex-wrap items-center gap-1">
          <span>Λύνουμε: {a} · ν ＋ {b} ＝ {targetY} ⇒ {a} · ν ＝ {targetY - b} ⇒ ν ＝</span>
          <Frac num={String(targetY - b)} den={String(a)} />
          <span>＝ {targetN}.</span>
        </span>
      ),
      explanationEn: (
        <span className="inline-flex flex-wrap items-center gap-1">
          <span>Solve: {a} · ν ＋ {b} ＝ {targetY} ⇒ ν ＝</span>
          <Frac num={String(targetY - b)} den={String(a)} />
          <span>＝ {targetN}.</span>
        </span>
      ),
    });
  }

  // Q6 (MCQ): Φθίνουσα γραμμική κανονικότητα (αρνητικό α)
  {
    const start = pickRandom([20, 25, 30, 35]);
    const step = pickRandom([3, 4, 5]);
    const t1 = start;
    const t2 = start - step;
    const t3 = start - 2 * step;
    const t5 = start - 4 * step;
    const correctOpt = { key: String(t5), labelEl: String(t5), labelEn: String(t5) };
    const distractors = [
      { key: String(start - 3 * step), labelEl: String(start - 3 * step), labelEn: String(start - 3 * step) },
      { key: String(start - 5 * step), labelEl: String(start - 5 * step), labelEn: String(start - 5 * step) },
      { key: String(start + 4 * step), labelEl: String(start + 4 * step), labelEn: String(start + 4 * step) },
      { key: String(t3 - 1), labelEl: String(t3 - 1), labelEn: String(t3 - 1) },
    ];
    questions.push({
      id: 6,
      type: 'mcq',
      promptEl: `Μια φθίνουσα γραμμική κανονικότητα ξεκινά με τους όρους: ${t1}, ${t2}, ${t3}, ... Ποιος είναι ο 5ος όρος της (ν ＝ 5);`,
      promptEn: `A decreasing linear pattern begins with: ${t1}, ${t2}, ${t3}, ... What is the 5th term (ν ＝ 5)?`,
      options: ensureFourUniqueOptions(correctOpt, distractors),
      correct: correctOpt.key,
      correctTextEl: String(t5),
      correctTextEn: String(t5),
      explanationEl: `Σε κάθε βήμα αφαιρούμε ${step} (α ＝ -${step}): 4ος όρος ＝ ${t3 - step}, 5ος όρος ＝ ${t5}.`,
      explanationEn: `Each step subtracts ${step} (α ＝ -${step}): 4th term ＝ ${t3 - step}, 5th term ＝ ${t5}.`,
    });
  }

  // Q7 (Input): Υπολογισμός ν-οστού τετράγωνου αριθμού
  {
    const n = pickRandom([7, 8, 9, 11, 12, 13, 15]);
    const ans = n * n;
    questions.push({
      id: 7,
      type: 'input',
      promptEl: `Ποιος είναι ο ${n}ος θετικός τετράγωνος αριθμός (θέση ν ＝ ${n});`,
      promptEn: `What is the ${n}th positive square number (position ν ＝ ${n})?`,
      correct: String(ans),
      correctTextEl: String(ans),
      correctTextEn: String(ans),
      explanationEl: (
        <span className="inline-flex items-baseline gap-1">
          <span>Από τον τύπο y ＝</span>
          <Pow base="ν" exp="2" />
          <span>, για ν ＝ {n} έχουμε y ＝</span>
          <Pow base={String(n)} exp="2" />
          <span>＝ {ans}.</span>
        </span>
      ),
      explanationEn: (
        <span className="inline-flex items-baseline gap-1">
          <span>From y ＝</span>
          <Pow base="ν" exp="2" />
          <span>, for ν ＝ {n} we get</span>
          <Pow base={String(n)} exp="2" />
          <span>＝ {ans}.</span>
        </span>
      ),
    });
  }

  // Q8 (Input): Εύρεση θέσης ν ενός τετράγωνου αριθμού
  {
    const n = pickRandom([6, 8, 9, 11, 12, 14]);
    const sq = n * n;
    questions.push({
      id: 8,
      type: 'input',
      unitEl: '(θέση ν)',
      unitEn: '(position ν)',
      promptEl: `Ο αριθμός ${sq} είναι τετράγωνος αριθμός. Σε ποια θέση ν της ακολουθίας 1, 4, 9, 16, ... βρίσκεται;`,
      promptEn: `The number ${sq} is a square number. At which position ν of 1, 4, 9, 16, ... does it appear?`,
      correct: String(n),
      correctTextEl: String(n),
      correctTextEn: String(n),
      explanationEl: (
        <span className="inline-flex flex-wrap items-center gap-1">
          <Pow base="ν" exp="2" />
          <span>＝ {sq} ⇒ ν ＝</span>
          <Radical>{sq}</Radical>
          <span>＝ {n}.</span>
        </span>
      ),
      explanationEn: (
        <span className="inline-flex flex-wrap items-center gap-1">
          <Pow base="ν" exp="2" />
          <span>＝ {sq} ⇒ ν ＝</span>
          <Radical>{sq}</Radical>
          <span>＝ {n}.</span>
        </span>
      ),
    });
  }

 // Q9 (MCQ): Άθροισμα των ν πρώτων περιττών αριθμών = ν² (με αναλυτική εξήγηση & SVG)
  {
    const n = pickRandom([6, 7, 8, 9, 11]);
    const lastOdd = 2 * n - 1;
    const ans = n * n;
    const correctOpt = { key: String(ans), labelEl: String(ans), labelEn: String(ans) };
    const distractors = [
      { key: String(lastOdd * 2), labelEl: String(lastOdd * 2), labelEn: String(lastOdd * 2) },
      { key: String((n - 1) * (n - 1)), labelEl: String((n - 1) * (n - 1)), labelEn: String((n - 1) * (n - 1)) },
      { key: String((n + 1) * (n + 1)), labelEl: String((n + 1) * (n + 1)), labelEn: String((n + 1) * (n + 1)) },
      { key: String(n * 2), labelEl: String(n * 2), labelEn: String(n * 2) },
    ];
    questions.push({
      id: 9,
      type: 'mcq',
      promptEl: `Πόσο ισούται το άθροισμα των ${n} πρώτων περιττών φυσικών αριθμών: 1 ＋ 3 ＋ 5 ＋ ... ＋ ${lastOdd};`,
      promptEn: `What is the sum of the first ${n} odd natural numbers: 1 ＋ 3 ＋ 5 ＋ ... ＋ ${lastOdd}?`,
      options: ensureFourUniqueOptions(correctOpt, distractors),
      correct: correctOpt.key,
      correctTextEl: String(ans),
      correctTextEn: String(ans),
      explanationEl: (
        <div className="space-y-1.5">
          <div>
            Παρατηρούμε το μοτίβο των τετράγωνων αριθμών: προσθέτοντας κάθε επόμενο περιττό αριθμό σχηματίζουμε το επόμενο τετράγωνο:
          </div>
          <div className="font-mono text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span>
              1 ＝ <Pow base="1" exp="2" />
            </span>
            <span>|</span>
            <span>
              1 ＋ 3 ＝ 4 ＝ <Pow base="2" exp="2" />
            </span>
            <span>|</span>
            <span>
              1 ＋ 3 ＋ 5 ＝ 9 ＝ <Pow base="3" exp="2" />
            </span>
            <span>|</span>
            <span>
              1 ＋ 3 ＋ 5 ＋ 7 ＝ 16 ＝ <Pow base="4" exp="2" />
            </span>
          </div>
          <div className="flex flex-wrap items-baseline gap-1">
            <span>
              Επομένως, το άθροισμα των <strong>{n}</strong> πρώτων περιττών ισούται με τον <strong>{n}ο</strong> τετράγωνο αριθμό:
            </span>
            <Pow base={String(n)} exp="2" />
            <span>＝ <strong>{ans}</strong>.</span>
          </div>
        </div>
      ),
      explanationEn: (
        <div className="space-y-1.5">
          <div>
            Notice the square numbers pattern: each consecutive odd number adds a new L-shaped layer to form the next square:
          </div>
          <div className="font-mono text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span>
              1 ＝ <Pow base="1" exp="2" />
            </span>
            <span>|</span>
            <span>
              1 ＋ 3 ＝ 4 ＝ <Pow base="2" exp="2" />
            </span>
            <span>|</span>
            <span>
              1 ＋ 3 ＋ 5 ＝ 9 ＝ <Pow base="3" exp="2" />
            </span>
            <span>|</span>
            <span>
              1 ＋ 3 ＋ 5 ＋ 7 ＝ 16 ＝ <Pow base="4" exp="2" />
            </span>
          </div>
          <div className="flex flex-wrap items-baseline gap-1">
            <span>
              Therefore, the sum of the first <strong>{n}</strong> odd numbers equals the <strong>{n}th</strong> square number:
            </span>
            <Pow base={String(n)} exp="2" />
            <span>＝ <strong>{ans}</strong>.</span>
          </div>
        </div>
      ),
      renderFeedbackDiagram: () => (
        <div className="mt-3 max-w-sm rounded-xl bg-white border border-slate-200 p-3">
          <svg viewBox="0 0 320 115" className="w-full h-auto max-w-full block">
            {[1, 2, 3, 4].map((k, idx) => {
              const baseX = [18, 72, 146, 236][idx];
              const cell = 15;
              const topY = 74 - k * cell;
              return (
                <g key={k}>
                  {Array.from({ length: k }).map((_, r) =>
                    Array.from({ length: k }).map((__, c) => (
                      <rect
                        key={`${r}-${c}`}
                        x={baseX + c * cell}
                        y={topY + r * cell}
                        width={cell - 2}
                        height={cell - 2}
                        rx="2.5"
                        fill={r === k - 1 || c === k - 1 ? '#f59e0b' : '#4f46e5'}
                        fillOpacity="0.88"
                      />
                    ))
                  )}
                  <text
                    x={baseX + (k * cell) / 2 - 1}
                    y="92"
                    textAnchor="middle"
                    fontSize="10.5"
                    fontWeight="800"
                    fill="#1e293b"
                    fontFamily="monospace"
                  >
                    {k}×{k}＝{k * k}
                  </text>
                  <text
                    x={baseX + (k * cell) / 2 - 1}
                    y="106"
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight="700"
                    fill="#b45309"
                    fontFamily="monospace"
                  >
                    +{2 * k - 1}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      ),
    });
  }

  // Q10 (MCQ): Διάκριση ποια ακολουθία είναι γραμμική κανονικότητα
  {
    const a = pickRandom([3, 4, 6]);
    const b = pickRandom([1, 2, 5]);
    const linSeq = [1, 2, 3, 4].map((n) => a * n + b).join(', ') + ', ...';
    const correctOpt = { key: 'lin', labelEl: linSeq, labelEn: linSeq };
    const distractors = [
      { key: 'sq', labelEl: '1, 4, 9, 16, ...', labelEn: '1, 4, 9, 16, ...' },
      { key: 'pow2', labelEl: '2, 4, 8, 16, ...', labelEn: '2, 4, 8, 16, ...' },
      { key: 'tri', labelEl: '1, 3, 6, 10, ...', labelEn: '1, 3, 6, 10, ...' },
    ];
    questions.push({
      id: 10,
      type: 'mcq',
      promptEl: 'Ποια από τις παρακάτω ακολουθίες αποτελεί γραμμική αριθμητική κανονικότητα;',
      promptEn: 'Which of the following sequences is a linear number pattern?',
      options: ensureFourUniqueOptions(correctOpt, distractors),
      correct: 'lin',
      correctTextEl: linSeq,
      correctTextEn: linSeq,
      explanationEl: `Μόνο στην ακολουθία ${linSeq} η διαφορά διαδοχικών όρων είναι σταθερή (α ＝ ${a}).`,
      explanationEn: `Only ${linSeq} has a constant difference (α ＝ ${a}) between consecutive terms.`,
    });
  }

  // Q11 (Input): Εύρεση τύπου y = α·ν + β από δύο μη διαδοχικούς όρους (y₂ και y₅)
  {
    const a = pickRandom([2, 3, 4, 5]);
    const b = pickRandom([1, 2, 3, 4]);
    const y2 = 2 * a + b;
    const y5 = 5 * a + b;
    const y10 = 10 * a + b;
    questions.push({
      id: 11,
      type: 'input',
      promptEl: `Σε μια γραμμική κανονικότητα γνωρίζουμε ότι ο 2ος όρος είναι ${y2} (y₂ ＝ ${y2}) και ο 5ος όρος είναι ${y5} (y₅ ＝ ${y5}). Ποιος είναι ο 10ος όρος (y₁₀);`,
      promptEn: `In a linear pattern, the 2nd term is ${y2} (y₂ ＝ ${y2}) and the 5th term is ${y5} (y₅ ＝ ${y5}). What is the 10th term (y₁₀)?`,
      correct: String(y10),
      correctTextEl: String(y10),
      correctTextEn: String(y10),
      explanationEl: (
        <span className="inline-flex flex-wrap items-center gap-1">
          <span>Από τη θέση 2 στη θέση 5 έχουμε 3 βήματα: 3 · α ＝ {y5} － {y2} ＝ {y5 - y2} ⇒ α ＝ {a}. Τότε β ＝ {y2} － 2 · {a} ＝ {b}, άρα y₁₀ ＝ {a} · 10 ＋ {b} ＝ {y10}.</span>
        </span>
      ),
      explanationEn: (
        <span>
          From ν＝2 to ν＝5 there are 3 steps: 3 · α ＝ {y5 - y2} ⇒ α ＝ {a}, β ＝ {b}, so y₁₀ ＝ {a} · 10 ＋ {b} ＝ {y10}.
        </span>
      ),
    });
  }

  // Q12 (Input - Συνδυαστικό πρόβλημα γεωμετρικής γραμμικής κανονικότητας με διάγραμμα & tableData)
  {
    const baseSticks = pickRandom([3, 4]); // 3 για τρίγωνα, 4 για τετράγωνα
    const stepSticks = baseSticks - 1; // 2 ή 3 σπίρτα ανά νέο σχήμα
    const targetN = pickRandom([12, 15, 18, 20]);
    const ans = stepSticks * targetN + 1;
    const shapeNameEl = baseSticks === 3 ? 'ισόπλευρα τρίγωνα' : 'τετράγωνα';
    const shapeNameEn = baseSticks === 3 ? 'equilateral triangles' : 'squares';

    questions.push({
      id: 12,
      type: 'input',
      unitEl: '(σπίρτα)',
      unitEn: '(matchsticks)',
      promptEl: `Κατασκευάζουμε στη σειρά συνεχόμενα ${shapeNameEl} με σπίρτα: για 1 σχήμα χρειάζονται ${baseSticks} σπίρτα, για 2 σχήματα ${baseSticks + stepSticks} σπίρτα, για 3 σχήματα ${baseSticks + 2 * stepSticks} σπίρτα. Πόσα σπίρτα θα χρειαστούμε για ν ＝ ${targetN} συνεχόμενα ${shapeNameEl};`,
      promptEn: `We build consecutive ${shapeNameEn} with matchsticks: 1 shape needs ${baseSticks} sticks, 2 shapes need ${baseSticks + stepSticks}, 3 shapes need ${baseSticks + 2 * stepSticks}. How many sticks are needed for ν ＝ ${targetN} consecutive ${shapeNameEn}?`,
      correct: String(ans),
      correctTextEl: String(ans),
      correctTextEn: String(ans),
      explanationEl: `Η κανονικότητα είναι γραμμική με α ＝ ${stepSticks} και β ＝ ${baseSticks} － ${stepSticks} ＝ 1, άρα y ＝ ${stepSticks} · ν ＋ 1. Για ν ＝ ${targetN} έχουμε y ＝ ${stepSticks} · ${targetN} ＋ 1 ＝ ${ans}.`,
      explanationEn: `The linear rule is y ＝ ${stepSticks} · ν ＋ 1. For ν ＝ ${targetN}, y ＝ ${stepSticks} · ${targetN} ＋ 1 ＝ ${ans}.`,
      tableData: [
        {
          stepEl: '1. Σταθερή διαφορά α',
          stepEn: '1. Constant step α',
          calc: `α ＝ ${baseSticks + stepSticks} － ${baseSticks} ＝ ${stepSticks}`,
        },
        {
          stepEl: '2. Σταθερός όρος β & τύπος',
          stepEn: '2. Constant β & formula',
          calc: `β ＝ ${baseSticks} － ${stepSticks} ＝ 1 ⇒ y ＝ ${stepSticks} · ν ＋ 1`,
        },
        {
          stepEl: `3. Υπολογισμός για ν ＝ ${targetN}`,
          stepEn: `3. Evaluate for ν ＝ ${targetN}`,
          calc: `y ＝ ${stepSticks} · ${targetN} ＋ 1 ＝ ${stepSticks * targetN} ＋ 1 ＝ ${ans}`,
        },
      ],
      renderFeedbackDiagram: () => (
        <div className="mt-3 max-w-sm rounded-xl bg-white border border-slate-200 p-3">
          <svg viewBox="0 0 300 95" className="w-full h-auto max-w-full block">
            {baseSticks === 3 ? (
              <>
                <polygon points="30,65 70,65 50,28" fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinejoin="round" />
                <polyline points="70,65 110,65 90,28 70,65" fill="none" stroke="#059669" strokeWidth="3" strokeLinejoin="round" />
                <polyline points="110,65 150,65 130,28 110,65" fill="none" stroke="#d97706" strokeWidth="3" strokeLinejoin="round" />
              </>
            ) : (
              <>
                <rect x="30" y="26" width="38" height="38" fill="none" stroke="#4f46e5" strokeWidth="3" />
                <polyline points="68,26 106,26 106,64 68,64" fill="none" stroke="#059669" strokeWidth="3" />
                <polyline points="106,26 144,26 144,64 106,64" fill="none" stroke="#d97706" strokeWidth="3" />
              </>
            )}
            <text x="175" y="42" fontSize="11.5" fontWeight="800" fill="#1e293b" fontFamily="monospace">
              ν＝1: {baseSticks} | ν＝2: {baseSticks + stepSticks}
            </text>
            <text x="175" y="62" fontSize="12" fontWeight="900" fill="#4f46e5" fontFamily="monospace">
              y ＝ {stepSticks}·ν ＋ 1
            </text>
          </svg>
        </div>
      ),
    });
  }

  return questions;
}

export default function KanonikotitesExercisesPage() {
  const router = useRouter();
  const isEn = router?.locale === 'en';

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const initExercises = useCallback(() => {
    setQuestions(generateQuestions());
    setAnswers({});
    setSubmitted(false);
  }, []);

  useEffect(() => {
    initExercises();
  }, [initExercises]);

  const handleSelect = (qId, val) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleReset = () => {
    initExercises();
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const isQuestionCorrect = (q) => {
    const userVal = answers[q.id];
    if (userVal === undefined || userVal === '') return false;
    if (q.type === 'input') {
      const u = parseFloat(sanitizeInput(userVal));
      const c = parseFloat(sanitizeInput(q.correct));
      return !isNaN(u) && Math.abs(u - c) <= 0.02;
    }
    return userVal === q.correct;
  };

  const answeredCount = questions.filter((q) => {
    const v = answers[q.id];
    return v !== undefined && String(v).trim() !== '';
  }).length;

  const score = submitted ? questions.filter(isQuestionCorrect).length : 0;
  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  const pageTitle = isEn
    ? 'Chapter 7 Exercises: Linear Number Patterns & Square Numbers | Grade 8'
    : "Ασκήσεις Κεφαλαίου 7: Γραμμικές Κανονικότητες & Τετράγωνοι Αριθμοί | Β' Γυμνασίου";

  const actionButton = (
    <Link
      href="/b-gymnasiou/08-kanonikotites"
      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-colors"
    >
      <span aria-hidden="true">📖</span>
      <span>{toCleanUppercase(isEn ? 'THEORY' : 'ΘΕΩΡΙΑ')}</span>
    </Link>
  );

  return (
    <Layout
      title={pageTitle}
      actionButton={actionButton}
      backUrl="/b-gymnasiou"
      backText={isEn ? 'Grade 8' : "Β' Γυμνασίου"}
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] 8k:max-w-[5120px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 8k:px-32 py-4 sm:py-6 pb-28 sm:pb-36 overflow-x-hidden text-slate-800 box-border">
        {/* Header */}
        <header className="rounded-3xl bg-gradient-to-r from-indigo-900 to-blue-800 text-white p-6 sm:p-8 shadow-lg mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-indigo-100 text-xs font-extrabold tracking-wider mb-3">
              <span>
                {toCleanUppercase(
                  isEn ? 'CHAPTER 7 • GRADE 8' : "ΚΕΦΑΛΑΙΟ 7 • Β' ΓΥΜΝΑΣΙΟΥ"
                )}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              {isEn
                ? 'Exercises: Linear Number Patterns & Square Numbers'
                : 'Ασκήσεις: Γραμμικές Αριθμητικές Κανονικότητες & Τετράγωνοι Αριθμοί'}
            </h1>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow transition-colors"
            >
              {toCleanUppercase(isEn ? 'NEW EXERCISES' : 'ΝΕΕΣ ΑΣΚΗΣΕΙΣ')}
            </button>
          </div>
        </header>

        {/* Λίστα 12 Ασκήσεων */}
        <div className="space-y-6">
          {questions.map((q, idx) => {
            const userVal = answers[q.id] ?? '';
            const correct = submitted && isQuestionCorrect(q);

            return (
              <article
                key={q.id}
                className={`rounded-3xl bg-white border-2 p-5 sm:p-7 shadow-sm transition-colors ${
                  submitted
                    ? correct
                      ? 'border-emerald-400 bg-emerald-50/20'
                      : 'border-rose-300 bg-rose-50/20'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-extrabold">
                    {toCleanUppercase(
                      isEn ? `EXERCISE ${idx + 1} OF 12` : `ΑΣΚΗΣΗ ${idx + 1} ΑΠΟ 12`
                    )}
                  </span>

                  {submitted && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black ${
                        correct
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {toCleanUppercase(
                        correct
                          ? isEn
                            ? 'CORRECT'
                            : 'ΣΩΣΤΟ'
                          : isEn
                          ? 'INCORRECT'
                          : 'ΛΑΘΟΣ'
                      )}
                    </span>
                  )}
                </div>

                {/* Εκφώνηση */}
                <div className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed mb-5">
                  {isEn ? q.promptEn : q.promptEl}
                </div>

                {/* Τύπος TF */}
                {q.type === 'tf' && (
                  <div className="grid grid-cols-2 gap-3 max-w-md">
                    {[
                      { val: 'true', label: isEn ? 'True' : 'Σωστό' },
                      { val: 'false', label: isEn ? 'False' : 'Λάθος' },
                    ].map((opt) => {
                      const selected = userVal === opt.val;
                      return (
                        <button
                          key={opt.val}
                          type="button"
                          disabled={submitted}
                          onClick={() => handleSelect(q.id, opt.val)}
                          className={`py-3 px-4 rounded-2xl border-2 font-extrabold text-sm sm:text-base transition-all ${
                            selected
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300'
                          } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Τύπος MCQ */}
                {q.type === 'mcq' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((opt, optIdx) => {
                      const selected = userVal === opt.key;
                      const letter = ['Α', 'Β', 'Γ', 'Δ'][optIdx];
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          disabled={submitted}
                          onClick={() => handleSelect(q.id, opt.key)}
                          className={`p-3.5 rounded-2xl border-2 text-left font-bold text-sm sm:text-base flex items-center gap-3 transition-all ${
                            selected
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-950 shadow-sm'
                              : 'border-slate-200 bg-white text-slate-800 hover:border-indigo-300'
                          } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          <span
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                              selected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {letter}
                          </span>
                          <span className="inline-flex flex-wrap items-center">
                            {isEn ? opt.labelEn : opt.labelEl}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Τύπος INPUT */}
                {q.type === 'input' && (
                  <div className="flex flex-wrap items-center gap-3 max-w-md">
                    <input
                      type="text"
                      inputMode="decimal"
                      disabled={submitted}
                      value={userVal}
                      onChange={(e) => handleSelect(q.id, e.target.value)}
                      placeholder={isEn ? 'Type your answer...' : 'Γράψε την απάντηση...'}
                      className="w-44 sm:w-52 px-4 py-3 rounded-2xl border-2 border-slate-300 focus:border-indigo-600 focus:outline-none font-bold text-base text-slate-900 bg-white disabled:bg-slate-100"
                    />
                    {(q.unitEl || q.unitEn) && (
                      <span className="text-xs sm:text-sm font-bold text-slate-500">
                        {isEn ? q.unitEn : q.unitEl}
                      </span>
                    )}
                  </div>
                )}

                {/* Feedback ΜΟΝΟ μετά την υποβολή (No-Giveaway Κανόνας) */}
                {submitted && (
                  <div className="mt-5 pt-4 border-t border-slate-200 space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base">
                      <span className="font-bold text-slate-700">
                        {isEn ? 'Correct answer:' : 'Σωστή απάντηση:'}
                      </span>
                      <span className="inline-flex flex-wrap items-center gap-x-1 break-words [overflow-wrap:anywhere] max-w-full px-3 py-1 rounded-xl bg-emerald-100 text-emerald-900 font-black">
                        {isEn ? q.correctTextEn : q.correctTextEl}
                      </span>
                    </div>

                    <div className="text-sm sm:text-base text-slate-700 leading-relaxed flex flex-wrap items-center gap-x-1 gap-y-1">
                      <span className="font-extrabold text-slate-900">
                        {isEn ? 'Explanation:' : 'Επεξήγηση:'}
                      </span>
                      <span>{isEn ? q.explanationEn : q.explanationEl}</span>
                    </div>

                    {q.tableData && (
                      <div className="overflow-hidden rounded-2xl border border-slate-200 mt-3">
                        <table className="w-full table-fixed text-xs sm:text-sm text-left bg-white">
                          <thead className="bg-slate-100 text-slate-800 font-extrabold">
                            <tr>
                              <th className="w-1/3 px-3 sm:px-4 py-2.5">
                                {isEn ? 'Step' : 'Βήμα'}
                              </th>
                              <th className="w-2/3 px-3 sm:px-4 py-2.5">
                                {isEn ? 'Analysis' : 'Ανάλυση'}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {q.tableData.map((row, rIdx) => (
                              <tr key={rIdx}>
                                <td className="px-3 sm:px-4 py-2.5 font-bold text-slate-800">
                                  {isEn ? row.stepEn : row.stepEl}
                                </td>
                                <td className="px-3 sm:px-4 py-2.5 font-mono">
                                  <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                                    {row.calc}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {q.renderFeedbackDiagram && q.renderFeedbackDiagram()}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Score Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] 8k:max-w-[5120px] mx-auto px-3 sm:px-6 lg:px-12 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-sm font-extrabold text-slate-700">
              {isEn ? 'Answered:' : 'Απαντημένες:'}{' '}
              <span className="text-indigo-700 font-black">
                {answeredCount} / {questions.length}
              </span>
            </span>

            {submitted && (
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs sm:text-sm font-black">
                {isEn
                  ? `Score: ${score}/${questions.length} (${percentage}%)`
                  : `Βαθμολογία: ${score}/${questions.length} (${percentage}%)`}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {!submitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow transition-colors"
              >
                {toCleanUppercase(isEn ? 'CHECK ANSWERS' : 'ΕΛΕΓΧΟΣ')}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm shadow transition-colors"
              >
                {toCleanUppercase(isEn ? 'NEW EXERCISES' : 'ΝΕΕΣ ΑΣΚΗΣΕΙΣ')}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}