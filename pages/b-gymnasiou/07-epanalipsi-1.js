import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// --- Βοηθητική Συνάρτηση για Άτονα Κεφαλαία (διατηρεί το Β') ---
function toCleanUppercase(str) {
  if (!str) return '';
  return str
    .replace(/Β'/g, '___BETA_PRIME___')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/___BETA_PRIME___/g, "Β'");
}

// --- Custom Μαθηματικά Components ---
const Angle = ({ children }) => (
  <span className="inline-flex flex-col items-center leading-none align-baseline mx-0.5 select-none">
    <svg
      viewBox="0 0 18 7"
      className="w-3.5 h-1.5 -mb-0.5 text-current overflow-visible"
      aria-hidden="true"
    >
      <path
        d="M 1.5 6 L 9 1.2 L 16.5 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <span className="leading-none">{children}</span>
  </span>
);

const Arc = ({ children }) => (
  <span className="inline-flex flex-col items-center leading-none align-baseline mx-0.5 select-none">
    <svg
      viewBox="0 0 24 8"
      className="w-5 h-2 -mb-0.5 text-current overflow-visible"
      aria-hidden="true"
    >
      <path
        d="M 1.5 6.5 Q 12 0.5 22.5 6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
    <span className="leading-none">{children}</span>
  </span>
);

const Frac = ({ num, den, className = '' }) => (
  <span
    className={`inline-flex flex-col items-center justify-center align-middle mx-1 text-center leading-tight ${className}`}
  >
    <span className="px-1 pb-0.5 border-b border-current font-semibold">
      {num}
    </span>
    <span className="px-1 pt-0.5 font-semibold">{den}</span>
  </span>
);

const Radical = ({ children, index = null }) => (
  <span className="inline-flex items-stretch align-middle mx-0.5 select-none">
    {index && (
      <sup className="text-[0.65em] font-bold -mr-1.5 mt-0.5">{index}</sup>
    )}
    <svg
      viewBox="0 0 14 24"
      className="w-3 h-5 text-current shrink-0 overflow-visible"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M 1 14 L 4.5 14 L 7.5 22.5 L 13 1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <span className="border-t-2 border-current px-1 pt-0.5 leading-none inline-flex items-center">
      {children}
    </span>
  </span>
);

// --- Βοηθητικές Συναρτήσεις Παραγωγής & Ελέγχου Μοναδικότητας ---
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
  const seenKeys = new Set([correctOpt.key]);
  const seenLabels = new Set([String(correctOpt.sig || correctOpt.key)]);
  const result = [correctOpt];

  for (const d of shuffle(distractorPool)) {
    const dSig = String(d.sig || d.key);
    if (!seenKeys.has(d.key) && !seenLabels.has(dSig)) {
      seenKeys.add(d.key);
      seenLabels.add(dSig);
      result.push(d);
    }
    if (result.length === 4) break;
  }

  let fallbackVal = 17;
  while (result.length < 4) {
    const fk = `fb_${fallbackVal}`;
    const fsig = String(fallbackVal);
    if (!seenKeys.has(fk) && !seenLabels.has(fsig)) {
      seenKeys.add(fk);
      seenLabels.add(fsig);
      result.push({ key: fk, sig: fsig, labelEl: fsig, labelEn: fsig });
    }
    fallbackVal += 3;
  }
  return shuffle(result);
}

// ============================================================================
// ΔΕΞΑΜΕΝΕΣ ΑΣΚΗΣΕΩΝ (10 ΔΙΑΦΟΡΕΤΙΚΕΣ ΠΑΡΑΛΛΑΓΕΣ ΑΝΑ ΕΡΩΤΗΣΗ)
// ============================================================================

// ΚΕΦΑΛΑΙΟ 1: Δυνάμεις ρητών με εκθέτη ακέραιο
function genCh1Ex1(mode) {
  switch (mode) {
    case 0: {
      const b = pickRandom([2, 3, 4, 5]);
      const e = b === 2 ? pickRandom([2, 3, 4]) : 2;
      const den = Math.pow(b, e);
      const correctOpt = { key: `1/${den}`, sig: `1/${den}`, labelEl: <Frac num="1" den={String(den)} />, labelEn: <Frac num="1" den={String(den)} /> };
      return {
        sig: `ch1_e1_m0_${b}_${e}`,
        type: 'mcq',
        promptEl: <span>Ποια είναι η τιμή της δύναμης {b}<sup>-{e}</sup>;</span>,
        promptEn: <span>What is the value of the power {b}<sup>-{e}</sup>?</span>,
        options: ensureFourUniqueOptions(correctOpt, [
          { key: `-${den}`, sig: `-${den}`, labelEl: `-${den}`, labelEn: `-${den}` },
          { key: `-1/${den}`, sig: `-1/${den}`, labelEl: <span>-<Frac num="1" den={String(den)} /></span>, labelEn: <span>-<Frac num="1" den={String(den)} /></span> },
          { key: `${den}`, sig: `${den}`, labelEl: String(den), labelEn: String(den) },
          { key: `1/${b * e}`, sig: `1/${b * e}`, labelEl: <Frac num="1" den={String(b * e)} />, labelEn: <Frac num="1" den={String(b * e)} /> },
        ]),
        correct: correctOpt.key,
        correctTextEl: <Frac num="1" den={String(den)} />,
        correctTextEn: <Frac num="1" den={String(den)} />,
        explanationEl: <span>Από τον ορισμό του αρνητικού εκθέτη: {b}<sup>-{e}</sup> = <Frac num="1" den={<span>{b}<sup>{e}</sup></span>} /> = <Frac num="1" den={String(den)} />.</span>,
        explanationEn: <span>By definition: {b}<sup>-{e}</sup> = <Frac num="1" den={<span>{b}<sup>{e}</sup></span>} /> = <Frac num="1" den={String(den)} />.</span>,
      };
    }
    case 1: {
      const den = pickRandom([2, 3, 4, 5]);
      const exp = den === 2 ? pickRandom([2, 3, 4]) : 2;
      const ans = Math.pow(den, exp);
      return {
        sig: `ch1_e1_m1_${den}_${exp}`,
        type: 'input',
        promptEl: <span className="inline-flex items-center">Υπολογίστε την τιμή της δύναμης (<Frac num="1" den={String(den)} />)<sup>-{exp}</sup>:</span>,
        promptEn: <span className="inline-flex items-center">Calculate the value of (<Frac num="1" den={String(den)} />)<sup>-{exp}</sup>:</span>,
        correct: String(ans),
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span>(<Frac num="1" den={String(den)} />)<sup>-{exp}</sup> = (<Frac num={String(den)} den="1" />)<sup>{exp}</sup> = {den}<sup>{exp}</sup> = {ans}.</span>,
        explanationEn: <span>(<Frac num="1" den={String(den)} />)<sup>-{exp}</sup> = {den}<sup>{exp}</sup> = {ans}.</span>,
      };
    }
    case 2: {
      const b = pickRandom([3, 5, 7, 9]);
      return {
        sig: `ch1_e1_m2_${b}`,
        type: 'tf',
        promptEl: <span>Ισχύει η ισότητα: (-{b})<sup>0</sup> = -1.</span>,
        promptEn: <span>The equality (-{b})<sup>0</sup> = -1 holds true.</span>,
        correct: 'false',
        correctTextEl: 'Λάθος',
        correctTextEn: 'False',
        explanationEl: <span>Κάθε μη μηδενικός αριθμός σε παρένθεση υψωμένος στη 0 ισούται με +1: (-{b})<sup>0</sup> = 1.</span>,
        explanationEn: <span>Any non-zero number in parentheses raised to 0 equals +1: (-{b})<sup>0</sup> = 1.</span>,
      };
    }
    case 3: {
      const m = pickRandom([5, 6, 7]);
      const n = pickRandom([-2, -3, -4]);
      const sum = m + n;
      const correctOpt = { key: `x^${sum}`, sig: `x^${sum}`, labelEl: <span>x<sup>{sum}</sup></span>, labelEn: <span>x<sup>{sum}</sup></span> };
      return {
        sig: `ch1_e1_m3_${m}_${n}`,
        type: 'mcq',
        promptEl: <span>Για x ≠ 0, το γινόμενο x<sup>{m}</sup> · x<sup>{n}</sup> γράφεται ως:</span>,
        promptEn: <span>For x ≠ 0, the product x<sup>{m}</sup> · x<sup>{n}</sup> equals:</span>,
        options: ensureFourUniqueOptions(correctOpt, [
          { key: `x^${m * n}`, sig: `x^${m * n}`, labelEl: <span>x<sup>{m * n}</sup></span>, labelEn: <span>x<sup>{m * n}</sup></span> },
          { key: `x^${m - n}`, sig: `x^${m - n}`, labelEl: <span>x<sup>{m - n}</sup></span>, labelEn: <span>x<sup>{m - n}</sup></span> },
          { key: `x^${-sum}`, sig: `x^${-sum}`, labelEl: <span>x<sup>{-sum}</sup></span>, labelEn: <span>x<sup>{-sum}</sup></span> },
          { key: `2x^${sum}`, sig: `2x^${sum}`, labelEl: <span>2x<sup>{sum}</sup></span>, labelEn: <span>2x<sup>{sum}</sup></span> },
        ]),
        correct: correctOpt.key,
        correctTextEl: <span>x<sup>{sum}</sup></span>,
        correctTextEn: <span>x<sup>{sum}</sup></span>,
        explanationEl: <span>x<sup>{m}</sup> · x<sup>{n}</sup> = x<sup>{m} + ({n})</sup> = x<sup>{sum}</sup>.</span>,
        explanationEn: <span>x<sup>{m}</sup> · x<sup>{n}</sup> = x<sup>{m} + ({n})</sup> = x<sup>{sum}</sup>.</span>,
      };
    }
    case 4: {
      const num = pickRandom([2, 3]);
      const den = pickRandom([5, 7]);
      const correctOpt = {
        key: `${den * den}/${num * num}`,
        sig: `${den * den}/${num * num}`,
        labelEl: <Frac num={String(den * den)} den={String(num * num)} />,
        labelEn: <Frac num={String(den * den)} den={String(num * num)} />,
      };
      return {
        sig: `ch1_e1_m4_${num}_${den}`,
        type: 'mcq',
        promptEl: <span className="inline-flex items-center">Η δύναμη (<Frac num={String(num)} den={String(den)} />)<sup>-2</sup> ισούται με:</span>,
        promptEn: <span className="inline-flex items-center">The power (<Frac num={String(num)} den={String(den)} />)<sup>-2</sup> equals:</span>,
        options: ensureFourUniqueOptions(correctOpt, [
          { key: `-${num * num}/${den * den}`, sig: `-${num * num}/${den * den}`, labelEl: <span>-<Frac num={String(num * num)} den={String(den * den)} /></span>, labelEn: <span>-<Frac num={String(num * num)} den={String(den * den)} /></span> },
          { key: `${num * num}/${den * den}`, sig: `${num * num}/${den * den}`, labelEl: <Frac num={String(num * num)} den={String(den * den)} />, labelEn: <Frac num={String(num * num)} den={String(den * den)} /> },
          { key: `-${den * den}/${num * num}`, sig: `-${den * den}/${num * num}`, labelEl: <span>-<Frac num={String(den * den)} den={String(num * num)} /></span>, labelEn: <span>-<Frac num={String(den * den)} den={String(num * num)} /></span> },
          { key: `${den}/${num}`, sig: `${den}/${num}`, labelEl: <Frac num={String(den)} den={String(num)} />, labelEn: <Frac num={String(den)} den={String(num)} /> },
        ]),
        correct: correctOpt.key,
        correctTextEl: <Frac num={String(den * den)} den={String(num * num)} />,
        correctTextEn: <Frac num={String(den * den)} den={String(num * num)} />,
        explanationEl: <span>(<Frac num={String(num)} den={String(den)} />)<sup>-2</sup> = (<Frac num={String(den)} den={String(num)} />)<sup>2</sup> = <Frac num={String(den * den)} den={String(num * num)} />.</span>,
        explanationEn: <span>(<Frac num={String(num)} den={String(den)} />)<sup>-2</sup> = (<Frac num={String(den)} den={String(num)} />)<sup>2</sup> = <Frac num={String(den * den)} den={String(num * num)} />.</span>,
      };
    }
    case 5: {
      const m = pickRandom([2, 3, 4]);
      const n = pickRandom([-2, -3]);
      const prod = m * n;
      return {
        sig: `ch1_e1_m5_${m}_${n}`,
        type: 'tf',
        promptEl: <span>Για α ≠ 0 ισχύει: (α<sup>{m}</sup>)<sup>{n}</sup> = α<sup>{prod}</sup>.</span>,
        promptEn: <span>For α ≠ 0: (α<sup>{m}</sup>)<sup>{n}</sup> = α<sup>{prod}</sup>.</span>,
        correct: 'true',
        correctTextEl: 'Σωστό',
        correctTextEn: 'True',
        explanationEl: <span>Στη δύναμη δύναμης πολλαπλασιάζουμε τους εκθέτες: {m} · ({n}) = {prod}.</span>,
        explanationEn: <span>In a power of a power, multiply exponents: {m} · ({n}) = {prod}.</span>,
      };
    }
    case 6: {
      const a = pickRandom([2, 3, 4]);
      const ans = a + 1;
      return {
        sig: `ch1_e1_m6_${a}`,
        type: 'input',
        promptEl: <span>Υπολογίστε την τιμή της παράστασης: {a}<sup>1</sup> + {a}<sup>0</sup></span>,
        promptEn: <span>Calculate the value of: {a}<sup>1</sup> + {a}<sup>0</sup></span>,
        correct: String(ans),
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span>{a}<sup>1</sup> + {a}<sup>0</sup> = {a} + 1 = {ans}.</span>,
        explanationEn: <span>{a}<sup>1</sup> + {a}<sup>0</sup> = {a} + 1 = {ans}.</span>,
      };
    }
    case 7: {
      const m = pickRandom([3, 4]);
      const n = pickRandom([-2, -3]);
      const diff = m - n;
      const correctOpt = { key: `y^${diff}`, sig: `y^${diff}`, labelEl: <span>y<sup>{diff}</sup></span>, labelEn: <span>y<sup>{diff}</sup></span> };
      return {
        sig: `ch1_e1_m7_${m}_${n}`,
        type: 'mcq',
        promptEl: <span className="inline-flex items-center">Για y ≠ 0, το πηλίκο <Frac num={<span>y<sup>{m}</sup></span>} den={<span>y<sup>{n}</sup></span>} /> ισούται με:</span>,
        promptEn: <span className="inline-flex items-center">For y ≠ 0, the quotient <Frac num={<span>y<sup>{m}</sup></span>} den={<span>y<sup>{n}</sup></span>} /> equals:</span>,
        options: ensureFourUniqueOptions(correctOpt, [
          { key: `y^${m + n}`, sig: `y^${m + n}`, labelEl: <span>y<sup>{m + n}</sup></span>, labelEn: <span>y<sup>{m + n}</sup></span> },
          { key: `y^${n - m}`, sig: `y^${n - m}`, labelEl: <span>y<sup>{n - m}</sup></span>, labelEn: <span>y<sup>{n - m}</sup></span> },
          { key: `y^${m * n}`, sig: `y^${m * n}`, labelEl: <span>y<sup>{m * n}</sup></span>, labelEn: <span>y<sup>{m * n}</sup></span> },
          { key: `1`, sig: `1`, labelEl: '1', labelEn: '1' },
        ]),
        correct: correctOpt.key,
        correctTextEl: <span>y<sup>{diff}</sup></span>,
        correctTextEn: <span>y<sup>{diff}</sup></span>,
        explanationEl: <span><Frac num={<span>y<sup>{m}</sup></span>} den={<span>y<sup>{n}</sup></span>} /> = y<sup>{m} - ({n})</sup> = y<sup>{m} + {Math.abs(n)}</sup> = y<sup>{diff}</sup>.</span>,
        explanationEn: <span><Frac num={<span>y<sup>{m}</sup></span>} den={<span>y<sup>{n}</sup></span>} /> = y<sup>{m} - ({n})</sup> = y<sup>{diff}</sup>.</span>,
      };
    }
    case 8: {
      const b = pickRandom([3, 4, 5]);
      return {
        sig: `ch1_e1_m8_${b}`,
        type: 'input',
        promptEl: <span>Υπολογίστε το γινόμενο: {b}<sup>-3</sup> · {b}<sup>4</sup></span>,
        promptEn: <span>Calculate the product: {b}<sup>-3</sup> · {b}<sup>4</sup></span>,
        correct: String(b),
        correctTextEl: String(b),
        correctTextEn: String(b),
        explanationEl: <span>{b}<sup>-3 + 4</sup> = {b}<sup>1</sup> = {b}.</span>,
        explanationEn: <span>{b}<sup>-3 + 4</sup> = {b}<sup>1</sup> = {b}.</span>,
      };
    }
    default: {
      const exp = pickRandom([-3, -5]);
      return {
        sig: `ch1_e1_m9_${exp}`,
        type: 'tf',
        promptEl: <span>Η δύναμη (-2)<sup>{exp}</sup> είναι αρνητικός αριθμός.</span>,
        promptEn: <span>The power (-2)<sup>{exp}</sup> is a negative number.</span>,
        correct: 'true',
        correctTextEl: 'Σωστό',
        correctTextEn: 'True',
        explanationEl: <span>Επειδή η βάση -2 είναι αρνητική και ο εκθέτης {exp} είναι περιττός, η δύναμη είναι αρνητική.</span>,
        explanationEn: <span>Since the base -2 is negative and the exponent {exp} is odd, the power is negative.</span>,
      };
    }
  }
}

function genCh1Ex2(mode) {
  switch (mode) {
    case 0: {
      const b = pickRandom([2, 3, 5]);
      const k = pickRandom([4, 5, 6]);
      const ans = b * b;
      return {
        sig: `ch1_e2_m0_${b}_${k}`,
        type: 'input',
        promptEl: <span className="inline-flex items-center">Υπολογίστε: <Frac num={<span>{b}<sup>{k}</sup></span>} den={<span>{b}<sup>{k - 2}</sup></span>} /></span>,
        promptEn: <span className="inline-flex items-center">Calculate: <Frac num={<span>{b}<sup>{k}</sup></span>} den={<span>{b}<sup>{k - 2}</sup></span>} /></span>,
        correct: String(ans),
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span><Frac num={<span>{b}<sup>{k}</sup></span>} den={<span>{b}<sup>{k - 2}</sup></span>} /> = {b}<sup>{k} - ({k - 2})</sup> = {b}<sup>2</sup> = {ans}.</span>,
        explanationEn: <span><Frac num={<span>{b}<sup>{k}</sup></span>} den={<span>{b}<sup>{k - 2}</sup></span>} /> = {b}<sup>2</sup> = {ans}.</span>,
      };
    }
    case 1: {
      const n = pickRandom([3, 4, 5]);
      const correctOpt = { key: `x^${n}y^${n}`, sig: `x^${n}y^${n}`, labelEl: <span>x<sup>{n}</sup> · y<sup>{n}</sup></span>, labelEn: <span>x<sup>{n}</sup> · y<sup>{n}</sup></span> };
      return {
        sig: `ch1_e2_m1_${n}`,
        type: 'mcq',
        promptEl: <span>Η δύναμη γινομένου (x · y)<sup>{n}</sup> ισούται με:</span>,
        promptEn: <span>The power of a product (x · y)<sup>{n}</sup> equals:</span>,
        options: ensureFourUniqueOptions(correctOpt, [
          { key: `xy^${n}`, sig: `xy^${n}`, labelEl: <span>x · y<sup>{n}</sup></span>, labelEn: <span>x · y<sup>{n}</sup></span> },
          { key: `x^${n}y`, sig: `x^${n}y`, labelEl: <span>x<sup>{n}</sup> · y</span>, labelEn: <span>x<sup>{n}</sup> · y</span> },
          { key: `x^${2 * n}y^${2 * n}`, sig: `x^${2 * n}y^${2 * n}`, labelEl: <span>x<sup>{2 * n}</sup> · y<sup>{2 * n}</sup></span>, labelEn: <span>x<sup>{2 * n}</sup> · y<sup>{2 * n}</sup></span> },
          { key: `${n}xy`, sig: `${n}xy`, labelEl: `${n}xy`, labelEn: `${n}xy` },
        ]),
        correct: correctOpt.key,
        correctTextEl: <span>x<sup>{n}</sup> · y<sup>{n}</sup></span>,
        correctTextEn: <span>x<sup>{n}</sup> · y<sup>{n}</sup></span>,
        explanationEl: <span>Από την ιδιότητα δύναμης γινομένου: (x · y)<sup>{n}</sup> = x<sup>{n}</sup> · y<sup>{n}</sup>.</span>,
        explanationEn: <span>By the power of a product rule: (x · y)<sup>{n}</sup> = x<sup>{n}</sup> · y<sup>{n}</sup>.</span>,
      };
    }
    case 2: {
      const a = pickRandom([2, 3, 5]);
      const b = pickRandom([4, 7]);
      const exp = pickRandom([3, 4]);
      return {
        sig: `ch1_e2_m2_${a}_${b}_${exp}`,
        type: 'input',
        promptEl: <span className="inline-flex items-center">Υπολογίστε το γινόμενο (<Frac num={String(a)} den={String(b)} />)<sup>{exp}</sup> · (<Frac num={String(b)} den={String(a)} />)<sup>{exp}</sup>:</span>,
        promptEn: <span className="inline-flex items-center">Calculate (<Frac num={String(a)} den={String(b)} />)<sup>{exp}</sup> · (<Frac num={String(b)} den={String(a)} />)<sup>{exp}</sup>:</span>,
        correct: '1',
        correctTextEl: '1',
        correctTextEn: '1',
        explanationEl: <span>(<Frac num={String(a)} den={String(b)} /> · <Frac num={String(b)} den={String(a)} />)<sup>{exp}</sup> = 1<sup>{exp}</sup> = 1.</span>,
        explanationEn: <span>(<Frac num={String(a)} den={String(b)} /> · <Frac num={String(b)} den={String(a)} />)<sup>{exp}</sup> = 1<sup>{exp}</sup> = 1.</span>,
      };
    }
    case 3: {
      const k = pickRandom([2, 3, 4]);
      return {
        sig: `ch1_e2_m3_${k}`,
        type: 'tf',
        promptEl: <span>Ισχύει η ισότητα: 2<sup>{k}</sup> · 5<sup>{k}</sup> = 10<sup>{k}</sup>.</span>,
        promptEn: <span>The equality 2<sup>{k}</sup> · 5<sup>{k}</sup> = 10<sup>{k}</sup> holds true.</span>,
        correct: 'true',
        correctTextEl: 'Σωστό',
        correctTextEn: 'True',
        explanationEl: <span>2<sup>{k}</sup> · 5<sup>{k}</sup> = (2 · 5)<sup>{k}</sup> = 10<sup>{k}</sup>.</span>,
        explanationEn: <span>2<sup>{k}</sup> · 5<sup>{k}</sup> = (2 · 5)<sup>{k}</sup> = 10<sup>{k}</sup>.</span>,
      };
    }
    case 4: {
      const b = pickRandom([2, 3, 4]);
      const correctOpt = { key: `${b}^-3`, sig: `1/${Math.pow(b, 3)}`, labelEl: <Frac num="1" den={String(Math.pow(b, 3))} />, labelEn: <Frac num="1" den={String(Math.pow(b, 3))} /> };
      return {
        sig: `ch1_e2_m4_${b}`,
        type: 'mcq',
        promptEl: <span className="inline-flex items-center">Η τιμή της παράστασης <Frac num={<span>{b}<sup>-5</sup></span>} den={<span>{b}<sup>-2</sup></span>} /> είναι:</span>,
        promptEn: <span className="inline-flex items-center">The value of <Frac num={<span>{b}<sup>-5</sup></span>} den={<span>{b}<sup>-2</sup></span>} /> is:</span>,
        options: ensureFourUniqueOptions(correctOpt, [
          { key: `${Math.pow(b, 3)}`, sig: `${Math.pow(b, 3)}`, labelEl: String(Math.pow(b, 3)), labelEn: String(Math.pow(b, 3)) },
          { key: `1/${Math.pow(b, 7)}`, sig: `1/${Math.pow(b, 7)}`, labelEl: <Frac num="1" den={String(Math.pow(b, 7))} />, labelEn: <Frac num="1" den={String(Math.pow(b, 7))} /> },
          { key: `-${Math.pow(b, 3)}`, sig: `-${Math.pow(b, 3)}`, labelEl: `-${Math.pow(b, 3)}`, labelEn: `-${Math.pow(b, 3)}` },
          { key: `1/${b}`, sig: `1/${b}`, labelEl: <Frac num="1" den={String(b)} />, labelEn: <Frac num="1" den={String(b)} /> },
        ]),
        correct: correctOpt.key,
        correctTextEl: <Frac num="1" den={String(Math.pow(b, 3))} />,
        correctTextEn: <Frac num="1" den={String(Math.pow(b, 3))} />,
        explanationEl: <span>{b}<sup>-5 - (-2)</sup> = {b}<sup>-3</sup> = <Frac num="1" den={<span>{b}<sup>3</sup></span>} /> = <Frac num="1" den={String(Math.pow(b, 3))} />.</span>,
        explanationEn: <span>{b}<sup>-5 - (-2)</sup> = {b}<sup>-3</sup> = <Frac num="1" den={String(Math.pow(b, 3))} />.</span>,
      };
    }
    case 5: {
      const k = pickRandom([3, 4, 5]);
      return {
        sig: `ch1_e2_m5_${k}`,
        type: 'tf',
        promptEl: <span>Ισχύει ότι 3<sup>{k}</sup> + 3<sup>{k}</sup> = 3<sup>{2 * k}</sup>.</span>,
        promptEn: <span>It holds that 3<sup>{k}</sup> + 3<sup>{k}</sup> = 3<sup>{2 * k}</sup>.</span>,
        correct: 'false',
        correctTextEl: 'Λάθος',
        correctTextEn: 'False',
        explanationEl: <span>Οι εκθέτες προστίθενται στον πολλαπλασιασμό (3<sup>{k}</sup> · 3<sup>{k}</sup> = 3<sup>{2 * k}</sup>), όχι στην πρόσθεση (3<sup>{k}</sup> + 3<sup>{k}</sup> = 2 · 3<sup>{k}</sup>).</span>,
        explanationEn: <span>Exponents add in multiplication, not addition (3<sup>{k}</sup> + 3<sup>{k}</sup> = 2 · 3<sup>{k}</sup>).</span>,
      };
    }
    case 6: {
      const exp = pickRandom([2, 3]);
      const ans = Math.pow(4, exp);
      return {
        sig: `ch1_e2_m6_${exp}`,
        type: 'input',
        promptEl: <span>Υπολογίστε: 20<sup>{exp}</sup> : 5<sup>{exp}</sup></span>,
        promptEn: <span>Calculate: 20<sup>{exp}</sup> ÷ 5<sup>{exp}</sup></span>,
        correct: String(ans),
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span>(<Frac num="20" den="5" />)<sup>{exp}</sup> = 4<sup>{exp}</sup> = {ans}.</span>,
        explanationEn: <span>(<Frac num="20" den="5" />)<sup>{exp}</sup> = 4<sup>{exp}</sup> = {ans}.</span>,
      };
    }
    case 7: {
      const k = pickRandom([3, 4, 5]);
      const correctOpt = { key: `x^${k}`, sig: `x^${k}`, labelEl: <span>x<sup>{k}</sup></span>, labelEn: <span>x<sup>{k}</sup></span> };
      return {
        sig: `ch1_e2_m7_${k}`,
        type: 'mcq',
        promptEl: <span className="inline-flex items-center">Για x ≠ 0, η παράσταση <Frac num="1" den={<span>x<sup>-{k}</sup></span>} /> ισούται με:</span>,
        promptEn: <span className="inline-flex items-center">For x ≠ 0, <Frac num="1" den={<span>x<sup>-{k}</sup></span>} /> equals:</span>,
        options: ensureFourUniqueOptions(correctOpt, [
          { key: `-x^${k}`, sig: `-x^${k}`, labelEl: <span>-x<sup>{k}</sup></span>, labelEn: <span>-x<sup>{k}</sup></span> },
          { key: `x^-${k}`, sig: `x^-${k}`, labelEl: <span>x<sup>-{k}</sup></span>, labelEn: <span>x<sup>-{k}</sup></span> },
          { key: `-${k}x`, sig: `-${k}x`, labelEl: `-${k}x`, labelEn: `-${k}x` },
          { key: `1/${k}x`, sig: `1/(${k}x)`, labelEl: <Frac num="1" den={`${k}x`} />, labelEn: <Frac num="1" den={`${k}x`} /> },
        ]),
        correct: correctOpt.key,
        correctTextEl: <span>x<sup>{k}</sup></span>,
        correctTextEn: <span>x<sup>{k}</sup></span>,
        explanationEl: <span><Frac num="1" den={<span>x<sup>-{k}</sup></span>} /> = (x<sup>-{k}</sup>)<sup>-1</sup> = x<sup>(-{k}) · (-1)</sup> = x<sup>{k}</sup>.</span>,
        explanationEn: <span><Frac num="1" den={<span>x<sup>-{k}</sup></span>} /> = x<sup>{k}</sup>.</span>,
      };
    }
    case 8: {
      const ans = 9;
      return {
        sig: 'ch1_e2_m8',
        type: 'input',
        promptEl: <span>Υπολογίστε: (-3)<sup>5</sup> · (-3)<sup>-3</sup></span>,
        promptEn: <span>Calculate: (-3)<sup>5</sup> · (-3)<sup>-3</sup></span>,
        correct: String(ans),
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span>(-3)<sup>5 - 3</sup> = (-3)<sup>2</sup> = 9.</span>,
        explanationEn: <span>(-3)<sup>5 - 3</sup> = (-3)<sup>2</sup> = 9.</span>,
      };
    }
    default: {
      const b = pickRandom([2, 3]);
      return {
        sig: `ch1_e2_m9_${b}`,
        type: 'tf',
        promptEl: <span>Ισχύει ότι -{b}<sup>2</sup> = (-{b})<sup>2</sup>.</span>,
        promptEn: <span>It holds that -{b}<sup>2</sup> = (-{b})<sup>2</sup>.</span>,
        correct: 'false',
        correctTextEl: 'Λάθος',
        correctTextEn: 'False',
        explanationEl: <span>-{b}<sup>2</sup> = -{b * b}, ενώ (-{b})<sup>2</sup> = +{b * b}.</span>,
        explanationEn: <span>-{b}<sup>2</sup> = -{b * b}, whereas (-{b})<sup>2</sup> = +{b * b}.</span>,
      };
    }
  }
}

// ΚΕΦΑΛΑΙΟ 2: Τυποποιημένη μορφή ρητών αριθμών (Scientific Notation)
function genCh2Ex1(mode) {
  switch (mode) {
    case 0: {
      const d1 = pickRandom([3, 4, 5, 7, 8]);
      const d2 = pickRandom([2, 5, 6]);
      const exp = pickRandom([5, 6, 7]);
      const numEl = `${d1}${d2}${'0'.repeat(exp - 1)}`;
      const correctOpt = {
        key: `${d1}.${d2}*10^${exp}`,
        sig: `${d1},${d2}*10^${exp}`,
        labelEl: <span>{d1},{d2} · 10<sup>{exp}</sup></span>,
        labelEn: <span>{d1}.{d2} · 10<sup>{exp}</sup></span>,
      };
      return {
        sig: `ch2_e1_m0_${d1}_${d2}_${exp}`,
        type: 'mcq',
        promptEl: `Ποια είναι η τυποποιημένη μορφή του αριθμού ${numEl};`,
        promptEn: `What is the scientific notation of ${numEl}?`,
        options: ensureFourUniqueOptions(correctOpt, [
          { key: `${d1}${d2}*10^${exp - 1}`, sig: `${d1}${d2}*10^${exp - 1}`, labelEl: <span>{d1}{d2} · 10<sup>{exp - 1}</sup></span>, labelEn: <span>{d1}{d2} · 10<sup>{exp - 1}</sup></span> },
          { key: `${d1}.${d2}*10^${exp + 1}`, sig: `${d1},${d2}*10^${exp + 1}`, labelEl: <span>{d1},{d2} · 10<sup>{exp + 1}</sup></span>, labelEn: <span>{d1}.{d2} · 10<sup>{exp + 1}</sup></span> },
          { key: `0.${d1}${d2}*10^${exp + 1}`, sig: `0,${d1}${d2}*10^${exp + 1}`, labelEl: <span>0,{d1}{d2} · 10<sup>{exp + 1}</sup></span>, labelEn: <span>0.{d1}{d2} · 10<sup>{exp + 1}</sup></span> },
          { key: `${d1}.${d2}*10^-${exp}`, sig: `${d1},${d2}*10^-${exp}`, labelEl: <span>{d1},{d2} · 10<sup>-{exp}</sup></span>, labelEn: <span>{d1}.{d2} · 10<sup>-{exp}</sup></span> },
        ]),
        correct: correctOpt.key,
        correctTextEl: <span>{d1},{d2} · 10<sup>{exp}</sup></span>,
        correctTextEn: <span>{d1}.{d2} · 10<sup>{exp}</sup></span>,
        explanationEl: <span>Μετακινούμε την υποδιαστολή {exp} θέσεις αριστερά ώστε ο συντελεστής α να ικανοποιεί 1 ≤ α &lt; 10: {d1},{d2} · 10<sup>{exp}</sup>.</span>,
        explanationEn: <span>Move the decimal point {exp} places left so 1 ≤ a &lt; 10: {d1}.{d2} · 10<sup>{exp}</sup>.</span>,
      };
    }
    case 1: {
      const d = pickRandom([4, 6, 7, 9]);
      const zeros = pickRandom([3, 4, 5]);
      const exp = -(zeros + 1);
      const decEl = `0,${'0'.repeat(zeros)}${d}`;
      const decEn = `0.${'0'.repeat(zeros)}${d}`;
      return {
        sig: `ch2_e1_m1_${d}_${zeros}`,
        type: 'input',
        unitEl: '(εκθέτης ν)',
        unitEn: '(exponent n)',
        promptEl: <span>Ο αριθμός {decEl} γράφεται σε τυποποιημένη μορφή ως {d} · 10<sup>ν</sup>. Ποια είναι η τιμή του εκθέτη ν;</span>,
        promptEn: <span>The number {decEn} is written in scientific notation as {d} · 10<sup>n</sup>. What is the exponent n?</span>,
        correct: String(exp),
        correctTextEl: String(exp),
        correctTextEn: String(exp),
        explanationEl: <span>Μετακινούμε την υποδιαστολή {Math.abs(exp)} θέσεις δεξιά, άρα ν = {exp}.</span>,
        explanationEn: <span>Move the decimal point {Math.abs(exp)} places right, so n = {exp}.</span>,
      };
    }
    case 2: {
      const k = pickRandom([12, 15, 24]);
      return {
        sig: `ch2_e1_m2_${k}`,
        type: 'tf',
        promptEl: <span>Η παράσταση {k} · 10<sup>5</sup> είναι γραμμένη σε τυποποιημένη μορφή.</span>,
        promptEn: <span>The expression {k} · 10<sup>5</sup> is written in scientific notation.</span>,
        correct: 'false',
        correctTextEl: 'Λάθος',
        correctTextEn: 'False',
        explanationEl: <span>Στην τυποποιημένη μορφή α · 10<sup>ν</sup> πρέπει να ισχύει 1 ≤ |α| &lt; 10, ενώ εδώ α = {k} ≥ 10.</span>,
        explanationEn: <span>In scientific notation a · 10<sup>n</sup>, we must have 1 ≤ |a| &lt; 10, whereas {k} ≥ 10.</span>,
      };
    }
    case 3: {
      const a = pickRandom([2, 3, 4]);
      const b = pickRandom([5, 6, 8]);
      const exp = pickRandom([3, 4]);
      const ans = Math.round(a * Math.pow(10, exp) + b * Math.pow(10, exp - 1));
      return {
        sig: `ch2_e1_m3_${a}_${b}_${exp}`,
        type: 'input',
        promptEl: <span>Γράψτε ως κανονικό δεκαδικό/ακέραιο αριθμό: {a},{b} · 10<sup>{exp}</sup></span>,
        promptEn: <span>Write as a standard number: {a}.{b} · 10<sup>{exp}</sup></span>,
        correct: String(ans),
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span>{a},{b} · {Math.pow(10, exp)} = {ans}.</span>,
        explanationEn: <span>{a}.{b} · {Math.pow(10, exp)} = {ans}.</span>,
      };
    }
    case 4: {
      const d = pickRandom([3, 5, 8]);
      const correctOpt = { key: `${d}*10^-4`, sig: `${d}*10^-4`, labelEl: <span>{d} · 10<sup>-4</sup></span>, labelEn: <span>{d} · 10<sup>-4</sup></span> };
      return {
        sig: `ch2_e1_m4_${d}`,
        type: 'mcq',
        promptEl: `Ποια είναι η τυποποιημένη μορφή του δεκαδικού αριθμού 0,000${d};`,
        promptEn: `What is the scientific notation of 0.000${d}?`,
        options: ensureFourUniqueOptions(correctOpt, [
          { key: `${d}*10^-3`, sig: `${d}*10^-3`, labelEl: <span>{d} · 10<sup>-3</sup></span>, labelEn: <span>{d} · 10<sup>-3</sup></span> },
          { key: `${d}*10^-5`, sig: `${d}*10^-5`, labelEl: <span>{d} · 10<sup>-5</sup></span>, labelEn: <span>{d} · 10<sup>-5</sup></span> },
          { key: `${d}*10^4`, sig: `${d}*10^4`, labelEl: <span>{d} · 10<sup>4</sup></span>, labelEn: <span>{d} · 10<sup>4</sup></span> },
          { key: `0.${d}*10^-3`, sig: `0,${d}*10^-3`, labelEl: <span>0,{d} · 10<sup>-3</sup></span>, labelEn: <span>0.{d} · 10<sup>-3</sup></span> },
        ]),
        correct: correctOpt.key,
        correctTextEl: <span>{d} · 10<sup>-4</sup></span>,
        correctTextEn: <span>{d} · 10<sup>-4</sup></span>,
        explanationEl: <span>0,000{d} = {d} · 10<sup>-4</sup>.</span>,
        explanationEn: <span>0.000{d} = {d} · 10<sup>-4</sup>.</span>,
      };
    }
    case 5: {
      return {
        sig: 'ch2_e1_m5',
        type: 'tf',
        promptEl: <span>Ο αριθμός 0,85 · 10<sup>6</sup> είναι γραμμένος σε τυποποιημένη μορφή.</span>,
        promptEn: <span>The number 0.85 · 10<sup>6</sup> is written in scientific notation.</span>,
        correct: 'false',
        correctTextEl: 'Λάθος',
        correctTextEn: 'False',
        explanationEl: <span>Ο συντελεστής 0,85 είναι μικρότερος από 1 (η σωστή μορφή είναι 8,5 · 10<sup>5</sup>).</span>,
        explanationEn: <span>The coefficient 0.85 is less than 1 (the correct form is 8.5 · 10<sup>5</sup>).</span>,
      };
    }
    case 6: {
      const m = pickRandom([4, 5, 6]);
      const n = pickRandom([2, 3]);
      const ans = m + n;
      return {
        sig: `ch2_e1_m6_${m}_${n}`,
        type: 'input',
        unitEl: '(εκθέτης ν)',
        unitEn: '(exponent n)',
        promptEl: <span>Το γινόμενο (2 · 10<sup>{m}</sup>) · (3 · 10<sup>{n}</sup>) γράφεται σε τυποποιημένη μορφή ως 6 · 10<sup>ν</sup>. Ποιος είναι ο εκθέτης ν;</span>,
        promptEn: <span>The product (2 · 10<sup>{m}</sup>) · (3 · 10<sup>{n}</sup>) equals 6 · 10<sup>n</sup>. What is n?</span>,
        correct: String(ans),
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span>(2 · 3) · 10<sup>{m} + {n}</sup> = 6 · 10<sup>{ans}</sup>, άρα ν = {ans}.</span>,
        explanationEn: <span>(2 · 3) · 10<sup>{m} + {n}</sup> = 6 · 10<sup>{ans}</sup>, so n = {ans}.</span>,
      };
    }
    case 7: {
      const correctOpt = { key: '4.5*10^7', sig: '4,5*10^7', labelEl: <span>4,5 · 10<sup>7</sup></span>, labelEn: <span>4.5 · 10<sup>7</sup></span> };
      return {
        sig: 'ch2_e1_m7',
        type: 'mcq',
        promptEl: 'Ο πληθυσμός μιας χώρας είναι 45.000.000 κάτοικοι. Σε τυποποιημένη μορφή γράφεται:',
        promptEn: 'A country has a population of 45,000,000. In scientific notation this is:',
        options: ensureFourUniqueOptions(correctOpt, [
          { key: '45*10^6', sig: '45*10^6', labelEl: <span>45 · 10<sup>6</sup></span>, labelEn: <span>45 · 10<sup>6</sup></span> },
          { key: '4.5*10^6', sig: '4,5*10^6', labelEl: <span>4,5 · 10<sup>6</sup></span>, labelEn: <span>4.5 · 10<sup>6</sup></span> },
          { key: '4.5*10^8', sig: '4,5*10^8', labelEl: <span>4,5 · 10<sup>8</sup></span>, labelEn: <span>4.5 · 10<sup>8</sup></span> },
          { key: '0.45*10^8', sig: '0,45*10^8', labelEl: <span>0,45 · 10<sup>8</sup></span>, labelEn: <span>0.45 · 10<sup>8</sup></span> },
        ]),
        correct: correctOpt.key,
        correctTextEl: <span>4,5 · 10<sup>7</sup></span>,
        correctTextEn: <span>4.5 · 10<sup>7</sup></span>,
        explanationEl: <span>45.000.000 = 4,5 · 10<sup>7</sup>.</span>,
        explanationEn: <span>45,000,000 = 4.5 · 10<sup>7</sup>.</span>,
      };
    }
    case 8: {
      return {
        sig: 'ch2_e1_m8',
        type: 'tf',
        promptEl: <span>Ισχύει ότι 5 · 10<sup>-2</sup> = 0,05.</span>,
        promptEn: <span>It holds that 5 · 10<sup>-2</sup> = 0.05.</span>,
        correct: 'true',
        correctTextEl: 'Σωστό',
        correctTextEn: 'True',
        explanationEl: <span>5 · 10<sup>-2</sup> = <Frac num="5" den="100" /> = 0,05.</span>,
        explanationEn: <span>5 · 10<sup>-2</sup> = <Frac num="5" den="100" /> = 0.05.</span>,
      };
    }
    default: {
      const k = pickRandom([4, 6, 8]);
      const ans = k / 2;
      return {
        sig: `ch2_e1_m9_${k}`,
        type: 'input',
        promptEl: <span className="inline-flex items-center">Υπολογίστε τον συντελεστή α στην τυποποιημένη μορφή του πηλίκου <Frac num={<span>{k} · 10<sup>8</sup></span>} den={<span>2 · 10<sup>5</sup></span>} /> = α · 10<sup>3</sup>:</span>,
        promptEn: <span className="inline-flex items-center">Find the coefficient a in <Frac num={<span>{k} · 10<sup>8</sup></span>} den={<span>2 · 10<sup>5</sup></span>} /> = a · 10<sup>3</sup>:</span>,
        correct: String(ans),
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span><Frac num={String(k)} den="2" /> · 10<sup>8 - 5</sup> = {ans} · 10<sup>3</sup>, άρα α = {ans}.</span>,
        explanationEn: <span><Frac num={String(k)} den="2" /> · 10<sup>8 - 5</sup> = {ans} · 10<sup>3</sup>, so a = {ans}.</span>,
      };
    }
  }
}

function genCh2Ex2(mode) {
  switch (mode) {
    case 0: {
      const correctOpt = { key: '3.2*10^6', sig: '3,2*10^6', labelEl: <span>3,2 · 10<sup>6</sup></span>, labelEn: <span>3.2 · 10<sup>6</sup></span> };
      return {
        sig: 'ch2_e2_m0',
        type: 'mcq',
        promptEl: 'Ποιος από τους παρακάτω αριθμούς είναι μεγαλύτερος;',
        promptEn: 'Which of the following numbers is the greatest?',
        options: ensureFourUniqueOptions(correctOpt, [
          { key: '9.8*10^5', sig: '9,8*10^5', labelEl: <span>9,8 · 10<sup>5</sup></span>, labelEn: <span>9.8 · 10<sup>5</sup></span> },
          { key: '2.9*10^6', sig: '2,9*10^6', labelEl: <span>2,9 · 10<sup>6</sup></span>, labelEn: <span>2.9 · 10<sup>6</sup></span> },
          { key: '8.5*10^4', sig: '8,5*10^4', labelEl: <span>8,5 · 10<sup>4</sup></span>, labelEn: <span>8.5 · 10<sup>4</sup></span> },
          { key: '1.1*10^6', sig: '1,1*10^6', labelEl: <span>1,1 · 10<sup>6</sup></span>, labelEn: <span>1.1 · 10<sup>6</sup></span> },
        ]),
        correct: correctOpt.key,
        correctTextEl: <span>3,2 · 10<sup>6</sup></span>,
        correctTextEn: <span>3.2 · 10<sup>6</sup></span>,
        explanationEl: <span>Συγκρίνουμε πρώτα τους εκθέτες του 10 (10<sup>6</sup> &gt; 10<sup>5</sup>) και μετά τους συντελεστές (3,2 &gt; 2,9 &gt; 1,1).</span>,
        explanationEn: <span>Compare exponents of 10 first (10<sup>6</sup> &gt; 10<sup>5</sup>), then coefficients (3.2 &gt; 2.9).</span>,
      };
    }
    case 1: {
      const a = pickRandom([4, 5, 6]);
      const b = pickRandom([3, 4]);
      const prod = a * b; // π.χ. 4 * 3 = 12 -> 1.2 * 10^1
      const exp = pickRandom([4, 5]);
      const finalExp = exp + 1;
      return {
        sig: `ch2_e2_m1_${a}_${b}_${exp}`,
        type: 'input',
        unitEl: '(εκθέτης ν)',
        unitEn: '(exponent n)',
        promptEl: <span>Το γινόμενο ({a} · 10<sup>{exp}</sup>) · ({b} · 10<sup>0</sup>) γράφεται σε τυποποιημένη μορφή ως {prod / 10} · 10<sup>ν</sup>. Ποιος είναι ο εκθέτης ν;</span>,
        promptEn: <span>The product ({a} · 10<sup>{exp}</sup>) · ({b} · 10<sup>0</sup>) equals {prod / 10} · 10<sup>n</sup>. What is n?</span>,
        correct: String(finalExp),
        correctTextEl: String(finalExp),
        correctTextEn: String(finalExp),
        explanationEl: <span>{prod} · 10<sup>{exp}</sup> = {String(prod / 10).replace('.', ',')} · 10<sup>1</sup> · 10<sup>{exp}</sup> = {String(prod / 10).replace('.', ',')} · 10<sup>{finalExp}</sup>.</span>,
        explanationEn: <span>{prod} · 10<sup>{exp}</sup> = {prod / 10} · 10<sup>{finalExp}</sup>.</span>,
      };
    }
    case 2: {
      return {
        sig: 'ch2_e2_m2',
        type: 'tf',
        promptEl: <span>Ισχύει ότι 2 · 10<sup>-4</sup> &lt; 3 · 10<sup>-5</sup>.</span>,
        promptEn: <span>It holds that 2 · 10<sup>-4</sup> &lt; 3 · 10<sup>-5</sup>.</span>,
        correct: 'false',
        correctTextEl: 'Λάθος',
        correctTextEn: 'False',
        explanationEl: <span>Επειδή -4 &gt; -5, ισχύει 10<sup>-4</sup> &gt; 10<sup>-5</sup>, άρα 2 · 10<sup>-4</sup> &gt; 3 · 10<sup>-5</sup>.</span>,
        explanationEn: <span>Since -4 &gt; -5, we have 2 · 10<sup>-4</sup> &gt; 3 · 10<sup>-5</sup>.</span>,
      };
    }
    case 3: {
      const m = pickRandom([5, 6, 7]);
      const ans = 2 * m + 1; // (4 * 10^m)^2 = 16 * 10^(2m) = 1.6 * 10^(2m+1)
      const correctOpt = { key: `1.6*10^${ans}`, sig: `1,6*10^${ans}`, labelEl: <span>1,6 · 10<sup>{ans}</sup></span>, labelEn: <span>1.6 · 10<sup>{ans}</sup></span> };
      return {
        sig: `ch2_e2_m3_${m}`,
        type: 'mcq',
        promptEl: <span>Η δύναμη (4 · 10<sup>{m}</sup>)<sup>2</sup> σε τυποποιημένη μορφή γράφεται:</span>,
        promptEn: <span>The power (4 · 10<sup>{m}</sup>)<sup>2</sup> in scientific notation is:</span>,
        options: ensureFourUniqueOptions(correctOpt, [
          { key: `16*10^${2 * m}`, sig: `16*10^${2 * m}`, labelEl: <span>16 · 10<sup>{2 * m}</sup></span>, labelEn: <span>16 · 10<sup>{2 * m}</sup></span> },
          { key: `1.6*10^${2 * m}`, sig: `1,6*10^${2 * m}`, labelEl: <span>1,6 · 10<sup>{2 * m}</sup></span>, labelEn: <span>1.6 · 10<sup>{2 * m}</sup></span> },
          { key: `8*10^${2 * m}`, sig: `8*10^${2 * m}`, labelEl: <span>8 · 10<sup>{2 * m}</sup></span>, labelEn: <span>8 · 10<sup>{2 * m}</sup></span> },
          { key: `1.6*10^${m + 2}`, sig: `1,6*10^${m + 2}`, labelEl: <span>1,6 · 10<sup>{m + 2}</sup></span>, labelEn: <span>1.6 · 10<sup>{m + 2}</sup></span> },
        ]),
        correct: correctOpt.key,
        correctTextEl: <span>1,6 · 10<sup>{ans}</sup></span>,
        correctTextEn: <span>1.6 · 10<sup>{ans}</sup></span>,
        explanationEl: <span>4<sup>2</sup> · (10<sup>{m}</sup>)<sup>2</sup> = 16 · 10<sup>{2 * m}</sup> = 1,6 · 10<sup>{ans}</sup>.</span>,
        explanationEn: <span>4<sup>2</sup> · (10<sup>{m}</sup>)<sup>2</sup> = 16 · 10<sup>{2 * m}</sup> = 1.6 · 10<sup>{ans}</sup>.</span>,
      };
    }
    case 4: {
      const k = pickRandom([3, 4, 5]);
      return {
        sig: `ch2_e2_m4_${k}`,
        type: 'input',
        promptEl: <span>Υπολογίστε: (2,5 · 10<sup>{k}</sup>) · (4 · 10<sup>-{k}</sup>)</span>,
        promptEn: <span>Calculate: (2.5 · 10<sup>{k}</sup>) · (4 · 10<sup>-{k}</sup>)</span>,
        correct: '10',
        correctTextEl: '10',
        correctTextEn: '10',
        explanationEl: <span>(2,5 · 4) · 10<sup>{k} - {k}</sup> = 10 · 10<sup>0</sup> = 10.</span>,
        explanationEn: <span>(2.5 · 4) · 10<sup>0</sup> = 10.</span>,
      };
    }
    case 5: {
      const a = pickRandom([2, 3, 4]);
      const b = pickRandom([5, 6]);
      const sum = a + b;
      return {
        sig: `ch2_e2_m5_${a}_${b}`,
        type: 'input',
        promptEl: <span>Το άθροισμα ({a} · 10<sup>6</sup>) + ({b} · 10<sup>6</sup>) γράφεται ως α · 10<sup>6</sup>. Ποια είναι η τιμή του α;</span>,
        promptEn: <span>The sum ({a} · 10<sup>6</sup>) + ({b} · 10<sup>6</sup>) equals a · 10<sup>6</sup>. What is a?</span>,
        correct: String(sum),
        correctTextEl: String(sum),
        correctTextEn: String(sum),
        explanationEl: <span>({a} + {b}) · 10<sup>6</sup> = {sum} · 10<sup>6</sup>, άρα α = {sum}.</span>,
        explanationEn: <span>({a} + {b}) · 10<sup>6</sup> = {sum} · 10<sup>6</sup>, so a = {sum}.</span>,
      };
    }
    case 6: {
      const correctOpt = { key: '7.5*10^-6', sig: '7,5*10^-6', labelEl: <span>7,5 · 10<sup>-6</sup> m</span>, labelEn: <span>7.5 · 10<sup>-6</sup> m</span> };
      return {
        sig: 'ch2_e2_m6',
        type: 'mcq',
        promptEl: 'Η διάμετρος ενός κυττάρου είναι 0,0000075 m. Σε τυποποιημένη μορφή γράφεται:',
        promptEn: 'The diameter of a cell is 0.0000075 m. In scientific notation this is:',
        options: ensureFourUniqueOptions(correctOpt, [
          { key: '7.5*10^-5', sig: '7,5*10^-5', labelEl: <span>7,5 · 10<sup>-5</sup> m</span>, labelEn: <span>7.5 · 10<sup>-5</sup> m</span> },
          { key: '75*10^-7', sig: '75*10^-7', labelEl: <span>75 · 10<sup>-7</sup> m</span>, labelEn: <span>75 · 10<sup>-7</sup> m</span> },
          { key: '7.5*10^-7', sig: '7,5*10^-7', labelEl: <span>7,5 · 10<sup>-7</sup> m</span>, labelEn: <span>7.5 · 10<sup>-7</sup> m</span> },
          { key: '7.5*10^6', sig: '7,5*10^6', labelEl: <span>7,5 · 10<sup>6</sup> m</span>, labelEn: <span>7.5 · 10<sup>6</sup> m</span> },
        ]),
        correct: correctOpt.key,
        correctTextEl: <span>7,5 · 10<sup>-6</sup> m</span>,
        correctTextEn: <span>7.5 · 10<sup>-6</sup> m</span>,
        explanationEl: <span>Μετακινούμε την υποδιαστολή 6 θέσεις δεξιά: 7,5 · 10<sup>-6</sup> m.</span>,
        explanationEn: <span>Move the decimal point 6 places right: 7.5 · 10<sup>-6</sup> m.</span>,
      };
    }
    case 7: {
      return {
        sig: 'ch2_e2_m7',
        type: 'tf',
        promptEl: <span>Ο αριθμός -3,4 · 10<sup>5</sup> είναι γραμμένος σε τυποποιημένη μορφή (1 ≤ |-3,4| &lt; 10).</span>,
        promptEn: <span>The number -3.4 · 10<sup>5</sup> is in scientific notation (1 ≤ |-3.4| &lt; 10).</span>,
        correct: 'true',
        correctTextEl: 'Σωστό',
        correctTextEn: 'True',
        explanationEl: <span>Η τυποποιημένη μορφή α · 10<sup>ν</sup> ισχύει για κάθε ρητό με 1 ≤ |α| &lt; 10, και εδώ |-3,4| = 3,4.</span>,
        explanationEn: <span>Scientific notation holds for any rational with 1 ≤ |a| &lt; 10, and |-3.4| = 3.4.</span>,
      };
    }
    case 8: {
      const m = pickRandom([4, 6, 8]);
      const ans = m / 2;
      return {
        sig: `ch2_e2_m8_${m}`,
        type: 'input',
        unitEl: '(εκθέτης ν)',
        unitEn: '(exponent n)',
        promptEl: <span>Η τετραγωνική ρίζα <Radical>9 · 10<sup>{m}</sup></Radical> γράφεται σε τυποποιημένη μορφή ως 3 · 10<sup>ν</sup>. Ποιος είναι ο εκθέτης ν;</span>,
        promptEn: <span>The square root <Radical>9 · 10<sup>{m}</sup></Radical> equals 3 · 10<sup>n</sup>. What is n?</span>,
        correct: String(ans),
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span><Radical>9</Radical> · <Radical>10<sup>{m}</sup></Radical> = 3 · 10<sup>{m / 2}</sup>, άρα ν = {ans}.</span>,
        explanationEn: <span><Radical>9</Radical> · <Radical>10<sup>{m}</sup></Radical> = 3 · 10<sup>{m / 2}</sup>, so n = {ans}.</span>,
      };
    }
    default: {
      const correctOpt = { key: '5*10^4', sig: '5*10^4', labelEl: <span>5 · 10<sup>4</sup></span>, labelEn: <span>5 · 10<sup>4</sup></span> };
      return {
        sig: 'ch2_e2_m9',
        type: 'mcq',
        promptEl: 'Το μισό του αριθμού 10⁵ (δηλαδή 10⁵ : 2) σε τυποποιημένη μορφή είναι:',
        promptEn: 'Half of 10⁵ (i.e. 10⁵ ÷ 2) in scientific notation is:',
        options: ensureFourUniqueOptions(correctOpt, [
          { key: '10^2.5', sig: '10^2,5', labelEl: <span>10<sup>2,5</sup></span>, labelEn: <span>10<sup>2.5</sup></span> },
          { key: '5*10^5', sig: '5*10^5', labelEl: <span>5 · 10<sup>5</sup></span>, labelEn: <span>5 · 10<sup>5</sup></span> },
          { key: '0.5*10^5', sig: '0,5*10^5', labelEl: <span>0,5 · 10<sup>5</sup></span>, labelEn: <span>0.5 · 10<sup>5</sup></span> },
          { key: '2*10^4', sig: '2*10^4', labelEl: <span>2 · 10<sup>4</sup></span>, labelEn: <span>2 · 10<sup>4</sup></span> },
        ]),
        correct: correctOpt.key,
        correctTextEl: <span>5 · 10<sup>4</sup></span>,
        correctTextEn: <span>5 · 10<sup>4</sup></span>,
        explanationEl: <span><Frac num="1" den="2" /> · 10<sup>5</sup> = 0,5 · 10<sup>5</sup> = 5 · 10<sup>4</sup>.</span>,
        explanationEn: <span><Frac num="1" den="2" /> · 10<sup>5</sup> = 0.5 · 10<sup>5</sup> = 5 · 10<sup>4</sup>.</span>,
      };
    }
  }
}

// ΚΕΦΑΛΑΙΟ 3: Υπολογισμός αριθμητικών παραστάσεων & προτεραιότητα πράξεων
function genCh3Ex1(mode) {
  switch (mode) {
    case 0: {
      const a = pickRandom([2, 3, 4]);
      const b = pickRandom([3, 4, 5]);
      const ans = a + b * 4;
      return {
        sig: `ch3_e1_m0_${a}_${b}`,
        type: 'input',
        promptEl: <span>Υπολογίστε την τιμή της παράστασης: {a} + {b} · (-2)<sup>2</sup></span>,
        promptEn: <span>Calculate the value of: {a} + {b} · (-2)<sup>2</sup></span>,
        correct: String(ans),
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span>Προηγείται η δύναμη (-2)<sup>2</sup> = 4, μετά ο πολλαπλασιασμός {b} · 4 = {b * 4}, και τέλος {a} + {b * 4} = {ans}.</span>,
        explanationEn: <span>Power first (-2)<sup>2</sup> = 4, then multiplication {b} · 4 = {b * 4}, then {a} + {b * 4} = {ans}.</span>,
      };
    }
    case 1: {
      const a = pickRandom([10, 12, 15]);
      const ans = a - 9;
      return {
        sig: `ch3_e1_m1_${a}`,
        type: 'input',
        promptEl: <span>Υπολογίστε την τιμή της παράστασης: {a} - 3<sup>2</sup></span>,
        promptEn: <span>Calculate the value of: {a} - 3<sup>2</sup></span>,
        correct: String(ans),
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span>Υπολογίζουμε πρώτα τη δύναμη 3<sup>2</sup> = 9, άρα {a} - 9 = {ans}.</span>,
        explanationEn: <span>Evaluate the power 3<sup>2</sup> = 9 first, so {a} - 9 = {ans}.</span>,
      };
    }
    case 2: {
      const b = pickRandom([2, 3]);
      const c = pickRandom([4, 5]);
      const ans = b * (-c) - 1;
      const correctOpt = { key: String(ans), sig: String(ans), labelEl: String(ans), labelEn: String(ans) };
      return {
        sig: `ch3_e1_m2_${b}_${c}`,
        type: 'mcq',
        promptEl: <span>Η τιμή της αριθμητικής παράστασης {b} · (1 - {c + 1}) - 7<sup>0</sup> είναι:</span>,
        promptEn: <span>The value of {b} · (1 - {c + 1}) - 7<sup>0</sup> is:</span>,
        options: ensureFourUniqueOptions(correctOpt, [
          { key: String(ans + 2), sig: String(ans + 2), labelEl: String(ans + 2), labelEn: String(ans + 2) },
          { key: String(-ans), sig: String(-ans), labelEl: String(-ans), labelEn: String(-ans) },
          { key: String(b * c - 1), sig: String(b * c - 1), labelEl: String(b * c - 1), labelEn: String(b * c - 1) },
          { key: String(ans - 6), sig: String(ans - 6), labelEl: String(ans - 6), labelEn: String(ans - 6) },
        ]),
        correct: correctOpt.key,
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span>{b} · (-{c}) - 1 = {-b * c} - 1 = {ans}.</span>,
        explanationEn: <span>{b} · (-{c}) - 1 = {-b * c} - 1 = {ans}.</span>,
      };
    }
    case 3: {
      return {
        sig: 'ch3_e1_m3',
        type: 'tf',
        promptEl: <span>Στην παράσταση 2 + 3 · 4<sup>2</sup>, εκτελούμε πρώτα την πρόσθεση 2 + 3.</span>,
        promptEn: <span>In the expression 2 + 3 · 4<sup>2</sup>, we perform the addition 2 + 3 first.</span>,
        correct: 'false',
        correctTextEl: 'Λάθος',
        correctTextEn: 'False',
        explanationEl: <span>Κατά την προτεραιότητα πράξεων εκτελούνται πρώτα οι δυνάμεις (4<sup>2</sup> = 16), έπειτα οι πολλαπλασιασμοί και τελευταίες οι προσθέσεις.</span>,
        explanationEn: <span>By order of operations, powers come first, then multiplication, and addition last.</span>,
      };
    }
    case 4: {
      const k = pickRandom([2, 3, 4]);
      const ans = Math.pow(2, k) - 4;
      return {
        sig: `ch3_e1_m4_${k}`,
        type: 'input',
        promptEl: <span className="inline-flex items-center">Υπολογίστε: (<Frac num="1" den="2" />)<sup>-{k}</sup> - (-2)<sup>2</sup></span>,
        promptEn: <span className="inline-flex items-center">Calculate: (<Frac num="1" den="2" />)<sup>-{k}</sup> - (-2)<sup>2</sup></span>,
        correct: String(ans),
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span>(<Frac num="1" den="2" />)<sup>-{k}</sup> - (-2)<sup>2</sup> = 2<sup>{k}</sup> - 4 = {Math.pow(2, k)} - 4 = {ans}.</span>,
        explanationEn: <span>(<Frac num="1" den="2" />)<sup>-{k}</sup> - (-2)<sup>2</sup> = {Math.pow(2, k)} - 4 = {ans}.</span>,
      };
    }
    case 5: {
      const a = pickRandom([4, 6, 8]);
      const ans = a / 2 - 5;
      const correctOpt = { key: String(ans), sig: String(ans), labelEl: String(ans), labelEn: String(ans) };
      return {
        sig: `ch3_e1_m5_${a}`,
        type: 'mcq',
        promptEl: <span className="inline-flex items-center">Η τιμή της παράστασης <Frac num={String(a)} den={<span>2<sup>1</sup></span>} /> - 5 · (-1)<sup>4</sup> είναι:</span>,
        promptEn: <span className="inline-flex items-center">The value of <Frac num={String(a)} den={<span>2<sup>1</sup></span>} /> - 5 · (-1)<sup>4</sup> is:</span>,
        options: ensureFourUniqueOptions(correctOpt, [
          { key: String(ans + 10), sig: String(ans + 10), labelEl: String(ans + 10), labelEn: String(ans + 10) },
          { key: String(a - 5), sig: String(a - 5), labelEl: String(a - 5), labelEn: String(a - 5) },
          { key: String(-ans), sig: String(-ans), labelEl: String(-ans), labelEn: String(-ans) },
          { key: '0', sig: '0', labelEl: '0', labelEn: '0' },
        ]),
        correct: correctOpt.key,
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span>{a / 2} - 5 · 1 = {a / 2} - 5 = {ans}.</span>,
        explanationEn: <span>{a / 2} - 5 · 1 = {ans}.</span>,
      };
    }
    case 6: {
      const n = pickRandom([3, 5, 7]);
      return {
        sig: `ch3_e1_m6_${n}`,
        type: 'tf',
        promptEl: <span>Ισχύει ότι (-1)<sup>{n}</sup> + (-1)<sup>{n + 1}</sup> = 0.</span>,
        promptEn: <span>It holds that (-1)<sup>{n}</sup> + (-1)<sup>{n + 1}</sup> = 0.</span>,
        correct: 'true',
        correctTextEl: 'Σωστό',
        correctTextEn: 'True',
        explanationEl: <span>Επειδή ο {n} είναι περιττός και ο {n + 1} άρτιος, έχουμε -1 + 1 = 0.</span>,
        explanationEn: <span>Since {n} is odd and {n + 1} is even, we get -1 + 1 = 0.</span>,
      };
    }
    case 7: {
      const x = pickRandom([2, 3, 4]);
      const ans = 2 * x * x - 3 * x + 1;
      return {
        sig: `ch3_e1_m7_${x}`,
        type: 'input',
        promptEl: `Υπολογίστε την τιμή της παράστασης 2x² - 3x + 1 για x = ${x}:`,
        promptEn: `Evaluate 2x² - 3x + 1 for x = ${x}:`,
        correct: String(ans),
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: `2 · ${x}² - 3 · ${x} + 1 = 2 · ${x * x} - ${3 * x} + 1 = ${2 * x * x - 3 * x} + 1 = ${ans}.`,
        explanationEn: `2 · ${x}² - 3 · ${x} + 1 = ${ans}.`,
      };
    }
    case 8: {
      const mult = pickRandom([3, 5, 7]);
      const correctOpt = { key: String(mult), sig: String(mult), labelEl: String(mult), labelEn: String(mult) };
      return {
        sig: `ch3_e1_m8_${mult}`,
        type: 'mcq',
        promptEl: <span>Η τιμή της παράστασης {mult} · (2<sup>-1</sup> + 2<sup>-1</sup>) είναι:</span>,
        promptEn: <span>The value of {mult} · (2<sup>-1</sup> + 2<sup>-1</sup>) is:</span>,
        options: ensureFourUniqueOptions(correctOpt, [
          { key: String(mult * 2), sig: String(mult * 2), labelEl: String(mult * 2), labelEn: String(mult * 2) },
          { key: String(mult * 4), sig: String(mult * 4), labelEl: String(mult * 4), labelEn: String(mult * 4) },
          { key: `${mult}/2`, sig: `${mult}/2`, labelEl: <Frac num={String(mult)} den="2" />, labelEn: <Frac num={String(mult)} den="2" /> },
          { key: '1', sig: '1', labelEl: '1', labelEn: '1' },
        ]),
        correct: correctOpt.key,
        correctTextEl: String(mult),
        correctTextEn: String(mult),
        explanationEl: <span>2<sup>-1</sup> + 2<sup>-1</sup> = <Frac num="1" den="2" /> + <Frac num="1" den="2" /> = 1, άρα {mult} · 1 = {mult}.</span>,
        explanationEn: <span>2<sup>-1</sup> + 2<sup>-1</sup> = <Frac num="1" den="2" /> + <Frac num="1" den="2" /> = 1, so {mult} · 1 = {mult}.</span>,
      };
    }
    default: {
      const a = pickRandom([5, 7, 9]);
      const ans = a - 8;
      return {
        sig: `ch3_e1_m9_${a}`,
        type: 'input',
        promptEl: <span>Υπολογίστε την τιμή της παράστασης: {a} + (-2)<sup>3</sup></span>,
        promptEn: <span>Calculate the value of: {a} + (-2)<sup>3</sup></span>,
        correct: String(ans),
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span>(-2)<sup>3</sup> = -8, άρα {a} + (-8) = {ans}.</span>,
        explanationEn: <span>(-2)<sup>3</sup> = -8, so {a} + (-8) = {ans}.</span>,
      };
    }
  }
}

function genCh3Ex2(mode) {
  switch (mode) {
    case 0: {
      const a = pickRandom([3, 4, 5]);
      const ans = a * 2 + 1;
      return {
        sig: `ch3_e2_m0_${a}`,
        type: 'input',
        promptEl: <span className="inline-flex items-center">Υπολογίστε: <Frac num={<span>{a} · 2<sup>3</sup></span>} den="4" /> + (-1)<sup>6</sup></span>,
        promptEn: <span className="inline-flex items-center">Calculate: <Frac num={<span>{a} · 2<sup>3</sup></span>} den="4" /> + (-1)<sup>6</sup></span>,
        correct: String(ans),
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span><Frac num={<span>{a} · 8</span>} den="4" /> + 1 = {a * 2} + 1 = {ans}.</span>,
        explanationEn: <span><Frac num={<span>{a} · 8</span>} den="4" /> + 1 = {ans}.</span>,
      };
    }
    case 1: {
      const k = pickRandom([2, 3, 4]);
      const ans = 1 - Math.pow(3, 2);
      const correctOpt = { key: String(ans), sig: String(ans), labelEl: String(ans), labelEn: String(ans) };
      return {
        sig: `ch3_e2_m1_${k}`,
        type: 'mcq',
        promptEl: <span className="inline-flex items-center">Η τιμή της παράστασης (<Frac num="2" den="3" />)<sup>0</sup> - <Frac num={<span>3<sup>{k + 2}</sup></span>} den={<span>3<sup>{k}</sup></span>} /> είναι:</span>,
        promptEn: <span className="inline-flex items-center">The value of (<Frac num="2" den="3" />)<sup>0</sup> - <Frac num={<span>3<sup>{k + 2}</sup></span>} den={<span>3<sup>{k}</sup></span>} /> is:</span>,
        options: ensureFourUniqueOptions(correctOpt, [
          { key: '8', sig: '8', labelEl: '8', labelEn: '8' },
          { key: '-9', sig: '-9', labelEl: '-9', labelEn: '-9' },
          { key: '-5', sig: '-5', labelEl: '-5', labelEn: '-5' },
          { key: '10', sig: '10', labelEl: '10', labelEn: '10' },
        ]),
        correct: correctOpt.key,
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span>1 - 3<sup>2</sup> = 1 - 9 = -8.</span>,
        explanationEn: <span>1 - 3<sup>2</sup> = 1 - 9 = -8.</span>,
      };
    }
    case 2: {
      const x = pickRandom([-2, -3]);
      const ans = x * x + 2 * x;
      return {
        sig: `ch3_e2_m2_${x}`,
        type: 'input',
        promptEl: `Υπολογίστε την τιμή της παράστασης x² + 2x για x = ${x}:`,
        promptEn: `Evaluate x² + 2x for x = ${x}:`,
        correct: String(ans),
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: `(${x})² + 2 · (${x}) = ${x * x} + (${2 * x}) = ${ans}.`,
        explanationEn: `(${x})² + 2 · (${x}) = ${ans}.`,
      };
    }
    case 3: {
      return {
        sig: 'ch3_e2_m3',
        type: 'tf',
        promptEl: <span className="inline-flex items-center">Ισχύει ότι <Frac num={<span>2<sup>3</sup> + 2<sup>3</sup></span>} den={<span>2<sup>3</sup></span>} /> = 2.</span>,
        promptEn: <span className="inline-flex items-center">It holds that <Frac num={<span>2<sup>3</sup> + 2<sup>3</sup></span>} den={<span>2<sup>3</sup></span>} /> = 2.</span>,
        correct: 'true',
        correctTextEl: 'Σωστό',
        correctTextEn: 'True',
        explanationEl: <span><Frac num="8 + 8" den="8" /> = <Frac num="16" den="8" /> = 2 (ή <Frac num={<span>2 · 2<sup>3</sup></span>} den={<span>2<sup>3</sup></span>} /> = 2).</span>,
        explanationEn: <span><Frac num="8 + 8" den="8" /> = <Frac num="16" den="8" /> = 2.</span>,
      };
    }
    case 4: {
      const a = pickRandom([2, 3, 5]);
      const ans = a * 4 - 3;
      return {
        sig: `ch3_e2_m4_${a}`,
        type: 'input',
        promptEl: <span className="inline-flex items-center">Υπολογίστε: {a} · (<Frac num="1" den="2" />)<sup>-2</sup> - 3 · (-1)<sup>8</sup></span>,
        promptEn: <span className="inline-flex items-center">Calculate: {a} · (<Frac num="1" den="2" />)<sup>-2</sup> - 3 · (-1)<sup>8</sup></span>,
        correct: String(ans),
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span>{a} · 4 - 3 · 1 = {a * 4} - 3 = {ans}.</span>,
        explanationEn: <span>{a} · 4 - 3 · 1 = {ans}.</span>,
      };
    }
    case 5: {
      const b = pickRandom([4, 5, 6]);
      const ans = 2 - b;
      const correctOpt = { key: String(ans), sig: String(ans), labelEl: String(ans), labelEn: String(ans) };
      return {
        sig: `ch3_e2_m5_${b}`,
        type: 'mcq',
        promptEl: <span>Η τιμή της παράστασης (-2)<sup>3</sup> : (-4) - {b} είναι:</span>,
        promptEn: <span>The value of (-2)<sup>3</sup> ÷ (-4) - {b} is:</span>,
        options: ensureFourUniqueOptions(correctOpt, [
          { key: String(-2 - b), sig: String(-2 - b), labelEl: String(-2 - b), labelEn: String(-2 - b) },
          { key: String(2 + b), sig: String(2 + b), labelEl: String(2 + b), labelEn: String(2 + b) },
          { key: String(b - 2), sig: String(b - 2), labelEl: String(b - 2), labelEn: String(b - 2) },
          { key: '0', sig: '0', labelEl: '0', labelEn: '0' },
        ]),
        correct: correctOpt.key,
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span>(-8) : (-4) - {b} = 2 - {b} = {ans}.</span>,
        explanationEn: <span>(-8) ÷ (-4) - {b} = 2 - {b} = {ans}.</span>,
      };
    }
    case 6: {
      const c = pickRandom([3, 4, 5]);
      return {
        sig: `ch3_e2_m6_${c}`,
        type: 'tf',
        promptEl: <span>Η παράσταση -({c})<sup>2</sup> + {c}<sup>2</sup> ισούται με 0.</span>,
        promptEn: <span>The expression -({c})<sup>2</sup> + {c}<sup>2</sup> equals 0.</span>,
        correct: 'true',
        correctTextEl: 'Σωστό',
        correctTextEn: 'True',
        explanationEl: <span>-({c * c}) + {c * c} = 0.</span>,
        explanationEn: <span>-({c * c}) + {c * c} = 0.</span>,
      };
    }
    case 7: {
      const ans = 5;
      return {
        sig: 'ch3_e2_m7',
        type: 'input',
        promptEl: <span className="inline-flex items-center">Υπολογίστε: <Frac num={<span>3<sup>2</sup> + 2<sup>0</sup></span>} den="2" /></span>,
        promptEn: <span className="inline-flex items-center">Calculate: <Frac num={<span>3<sup>2</sup> + 2<sup>0</sup></span>} den="2" /></span>,
        correct: String(ans),
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span><Frac num="9 + 1" den="2" /> = <Frac num="10" den="2" /> = 5.</span>,
        explanationEn: <span><Frac num="9 + 1" den="2" /> = <Frac num="10" den="2" /> = 5.</span>,
      };
    }
    case 8: {
      const k = pickRandom([2, 3]);
      const ans = Math.pow(2, k) + Math.pow(3, 2);
      const correctOpt = { key: String(ans), sig: String(ans), labelEl: String(ans), labelEn: String(ans) };
      return {
        sig: `ch3_e2_m8_${k}`,
        type: 'mcq',
        promptEl: <span className="inline-flex items-center">Η τιμή της παράστασης (<Frac num="1" den="2" />)<sup>-{k}</sup> + (<Frac num="1" den="3" />)<sup>-2</sup> είναι:</span>,
        promptEn: <span className="inline-flex items-center">The value of (<Frac num="1" den="2" />)<sup>-{k}</sup> + (<Frac num="1" den="3" />)<sup>-2</sup> is:</span>,
        options: ensureFourUniqueOptions(correctOpt, [
          { key: String(ans - 2), sig: String(ans - 2), labelEl: String(ans - 2), labelEn: String(ans - 2) },
          { key: String(-ans), sig: String(-ans), labelEl: String(-ans), labelEn: String(-ans) },
          { key: String(2 * k + 6), sig: String(2 * k + 6), labelEl: String(2 * k + 6), labelEn: String(2 * k + 6) },
          { key: '1', sig: '1', labelEl: '1', labelEn: '1' },
        ]),
        correct: correctOpt.key,
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span>2<sup>{k}</sup> + 3<sup>2</sup> = {Math.pow(2, k)} + 9 = {ans}.</span>,
        explanationEn: <span>2<sup>{k}</sup> + 3<sup>2</sup> = {Math.pow(2, k)} + 9 = {ans}.</span>,
      };
    }
    default: {
      const a = pickRandom([2, 3, 4]);
      const ans = a * 9 - 4;
      return {
        sig: `ch3_e2_m9_${a}`,
        type: 'input',
        promptEl: <span>Υπολογίστε: {a} · (-3)<sup>2</sup> - 2<sup>2</sup></span>,
        promptEn: <span>Calculate: {a} · (-3)<sup>2</sup> - 2<sup>2</sup></span>,
        correct: String(ans),
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span>{a} · 9 - 4 = {a * 9} - 4 = {ans}.</span>,
        explanationEn: <span>{a} · 9 - 4 = {ans}.</span>,
      };
    }
  }
}

// ΚΕΦΑΛΑΙΟ 4: Τετραγωνική ρίζα θετικού αριθμού
function genCh4Ex1(mode) {
  switch (mode) {
    case 0: {
      const r = pickRandom([6, 7, 8, 9, 11, 12]);
      const sq = r * r;
      return {
        sig: `ch4_e1_m0_${sq}`,
        type: 'input',
        promptEl: <span>Υπολογίστε την τετραγωνική ρίζα: <Radical>{sq}</Radical></span>,
        promptEn: <span>Calculate the square root: <Radical>{sq}</Radical></span>,
        correct: String(r),
        correctTextEl: String(r),
        correctTextEn: String(r),
        explanationEl: <span>Επειδή {r} &gt; 0 και {r}<sup>2</sup> = {sq}, ισχύει <Radical>{sq}</Radical> = {r}.</span>,
        explanationEn: <span>Since {r} &gt; 0 and {r}<sup>2</sup> = {sq}, we have <Radical>{sq}</Radical> = {r}.</span>,
      };
    }
    case 1: {
      const num = pickRandom([2, 3, 5]);
      const den = pickRandom([4, 7, 9]);
      const correctOpt = { key: `${num}/${den}`, sig: `${num}/${den}`, labelEl: <Frac num={String(num)} den={String(den)} />, labelEn: <Frac num={String(num)} den={String(den)} /> };
      return {
        sig: `ch4_e1_m1_${num}_${den}`,
        type: 'mcq',
        promptEl: <span className="inline-flex items-center">Η τιμή της ρίζας <Radical><Frac num={String(num * num)} den={String(den * den)} /></Radical> είναι:</span>,
        promptEn: <span className="inline-flex items-center">The value of <Radical><Frac num={String(num * num)} den={String(den * den)} /></Radical> is:</span>,
        options: ensureFourUniqueOptions(correctOpt, [
          { key: `${num * num}/${den}`, sig: `${num * num}/${den}`, labelEl: <Frac num={String(num * num)} den={String(den)} />, labelEn: <Frac num={String(num * num)} den={String(den)} /> },
          { key: `${num}/${den * den}`, sig: `${num}/${den * den}`, labelEl: <Frac num={String(num)} den={String(den * den)} />, labelEn: <Frac num={String(num)} den={String(den * den)} /> },
          { key: `${den}/${num}`, sig: `${den}/${num}`, labelEl: <Frac num={String(den)} den={String(num)} />, labelEn: <Frac num={String(den)} den={String(num)} /> },
          { key: `-${num}/${den}`, sig: `-${num}/${den}`, labelEl: <span>-<Frac num={String(num)} den={String(den)} /></span>, labelEn: <span>-<Frac num={String(num)} den={String(den)} /></span> },
        ]),
        correct: correctOpt.key,
        correctTextEl: <Frac num={String(num)} den={String(den)} />,
        correctTextEn: <Frac num={String(num)} den={String(den)} />,
        explanationEl: <span><Radical><Frac num={String(num * num)} den={String(den * den)} /></Radical> = <Frac num={<Radical>{num * num}</Radical>} den={<Radical>{den * den}</Radical>} /> = <Frac num={String(num)} den={String(den)} />.</span>,
        explanationEn: <span><Radical><Frac num={String(num * num)} den={String(den * den)} /></Radical> = <Frac num={String(num)} den={String(den)} />.</span>,
      };
    }
    case 2: {
      const k = pickRandom([5, 7, 11]);
      return {
        sig: `ch4_e1_m2_${k}`,
        type: 'tf',
        promptEl: <span>Η τετραγωνική ρίζα <Radical>-{k * k}</Radical> ορίζεται στους πραγματικούς αριθμούς και ισούται με -{k}.</span>,
        promptEn: <span>The square root <Radical>-{k * k}</Radical> is defined in real numbers and equals -{k}.</span>,
        correct: 'false',
        correctTextEl: 'Λάθος',
        correctTextEn: 'False',
        explanationEl: <span>Δεν ορίζεται τετραγωνική ρίζα αρνητικού αριθμού στους πραγματικούς, γιατί κανένας πραγματικός στο τετράγωνο δεν είναι αρνητικός.</span>,
        explanationEn: <span>The square root of a negative number is not defined in ℝ.</span>,
      };
    }
    case 3: {
      const k = pickRandom([3, 5, 6, 8]);
      return {
        sig: `ch4_e1_m3_${k}`,
        type: 'input',
        promptEl: <span>Υπολογίστε την τιμή της παράστασης (<Radical>{k}</Radical>)<sup>2</sup>:</span>,
        promptEn: <span>Calculate the value of (<Radical>{k}</Radical>)<sup>2</sup>:</span>,
        correct: String(k),
        correctTextEl: String(k),
        correctTextEn: String(k),
        explanationEl: <span>Από τον ορισμό της τετραγωνικής ρίζας θετικού αριθμού, (<Radical>{k}</Radical>)<sup>2</sup> = {k}.</span>,
        explanationEn: <span>By definition of the square root, (<Radical>{k}</Radical>)<sup>2</sup> = {k}.</span>,
      };
    }
    case 4: {
      const d = pickRandom([2, 3, 4, 5]);
      const decEl = `0,0${d * d}`;
      const decEn = `0.0${d * d}`;
      const ans = `0.${d}`;
      return {
        sig: `ch4_e1_m4_${d}`,
        type: 'input',
        promptEl: <span>Υπολογίστε τη ρίζα: <Radical>{decEl}</Radical></span>,
        promptEn: <span>Calculate the root: <Radical>{decEn}</Radical></span>,
        correct: ans,
        correctTextEl: `0,${d}`,
        correctTextEn: ans,
        explanationEl: <span>Επειδή (0,{d})<sup>2</sup> = 0,0{d * d}, έχουμε <Radical>0,0{d * d}</Radical> = 0,{d}.</span>,
        explanationEn: <span>Since (0.{d})<sup>2</sup> = 0.0{d * d}, we get <Radical>0.0{d * d}</Radical> = 0.{d}.</span>,
      };
    }
    case 5: {
      const a = pickRandom([4, 9, 16]);
      const b = pickRandom([25, 36, 49]);
      const ans = Math.sqrt(a) * Math.sqrt(b);
      const correctOpt = { key: String(ans), sig: String(ans), labelEl: String(ans), labelEn: String(ans) };
      return {
        sig: `ch4_e1_m5_${a}_${b}`,
        type: 'mcq',
        promptEl: <span>Η τιμή της παράστασης <Radical>{a} · {b}</Radical> είναι:</span>,
        promptEn: <span>The value of <Radical>{a} · {b}</Radical> is:</span>,
        options: ensureFourUniqueOptions(correctOpt, [
          { key: String(Math.sqrt(a) + Math.sqrt(b)), sig: String(Math.sqrt(a) + Math.sqrt(b)), labelEl: String(Math.sqrt(a) + Math.sqrt(b)), labelEn: String(Math.sqrt(a) + Math.sqrt(b)) },
          { key: String(a + b), sig: String(a + b), labelEl: String(a + b), labelEn: String(a + b) },
          { key: String(ans * 2), sig: String(ans * 2), labelEl: String(ans * 2), labelEn: String(ans * 2) },
          { key: String(ans - 1), sig: String(ans - 1), labelEl: String(ans - 1), labelEn: String(ans - 1) },
        ]),
        correct: correctOpt.key,
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span><Radical>{a} · {b}</Radical> = <Radical>{a}</Radical> · <Radical>{b}</Radical> = {Math.sqrt(a)} · {Math.sqrt(b)} = {ans}.</span>,
        explanationEn: <span><Radical>{a} · {b}</Radical> = <Radical>{a}</Radical> · <Radical>{b}</Radical> = {ans}.</span>,
      };
    }
    case 6: {
      return {
        sig: 'ch4_e1_m6',
        type: 'tf',
        promptEl: <span>Ισχύει η ισότητα <Radical>9 + 16</Radical> = <Radical>9</Radical> + <Radical>16</Radical>.</span>,
        promptEn: <span>The equality <Radical>9 + 16</Radical> = <Radical>9</Radical> + <Radical>16</Radical> holds true.</span>,
        correct: 'false',
        correctTextEl: 'Λάθος',
        correctTextEn: 'False',
        explanationEl: <span><Radical>9 + 16</Radical> = <Radical>25</Radical> = 5, ενώ <Radical>9</Radical> + <Radical>16</Radical> = 3 + 4 = 7. Η ρίζα δεν επιμερίζεται στην πρόσθεση!</span>,
        explanationEn: <span><Radical>9 + 16</Radical> = <Radical>25</Radical> = 5, whereas 3 + 4 = 7.</span>,
      };
    }
    case 7: {
      const k = pickRandom([2, 3, 5]);
      const ans = k * 10;
      return {
        sig: `ch4_e1_m7_${k}`,
        type: 'input',
        promptEl: <span>Υπολογίστε: <Radical>{k * k * 100}</Radical></span>,
        promptEn: <span>Calculate: <Radical>{k * k * 100}</Radical></span>,
        correct: String(ans),
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span><Radical>{k * k} · 100</Radical> = {k} · 10 = {ans}.</span>,
        explanationEn: <span><Radical>{k * k} · 100</Radical> = {k} · 10 = {ans}.</span>,
      };
    }
    case 8: {
      const k = pickRandom([4, 6, 8]);
      const ans = Math.pow(3, k / 2);
      const correctOpt = { key: String(ans), sig: String(ans), labelEl: String(ans), labelEn: String(ans) };
      return {
        sig: `ch4_e1_m8_${k}`,
        type: 'mcq',
        promptEl: <span>Η τιμή της ρίζας <Radical>3<sup>{k}</sup></Radical> είναι:</span>,
        promptEn: <span>The value of <Radical>3<sup>{k}</sup></Radical> is:</span>,
        options: ensureFourUniqueOptions(correctOpt, [
          { key: String(Math.pow(3, k)), sig: String(Math.pow(3, k)), labelEl: String(Math.pow(3, k)), labelEn: String(Math.pow(3, k)) },
          { key: String(3 * (k / 2)), sig: String(3 * (k / 2)), labelEl: String(3 * (k / 2)), labelEn: String(3 * (k / 2)) },
          { key: String(ans * 3), sig: String(ans * 3), labelEl: String(ans * 3), labelEn: String(ans * 3) },
          { key: '3', sig: '3', labelEl: '3', labelEn: '3' },
        ]),
        correct: correctOpt.key,
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span><Radical>3<sup>{k}</sup></Radical> = <Radical>(3<sup>{k / 2}</sup>)<sup>2</sup></Radical> = 3<sup>{k / 2}</sup> = {ans}.</span>,
        explanationEn: <span><Radical>3<sup>{k}</sup></Radical> = 3<sup>{k / 2}</sup> = {ans}.</span>,
      };
    }
    default: {
      const r = pickRandom([4, 5, 6, 7]);
      const ans = r;
      return {
        sig: `ch4_e1_m9_${r}`,
        type: 'input',
        unitEl: '(θετικός x)',
        unitEn: '(positive x)',
        promptEl: <span>Αν x &gt; 0 και x<sup>2</sup> = {r * r}, ποια είναι η τιμή του x;</span>,
        promptEn: <span>If x &gt; 0 and x<sup>2</sup> = {r * r}, what is x?</span>,
        correct: String(ans),
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span>x = <Radical>{r * r}</Radical> = {ans}.</span>,
        explanationEn: <span>x = <Radical>{r * r}</Radical> = {ans}.</span>,
      };
    }
  }
}

function genCh4Ex2(mode) {
  switch (mode) {
    case 0: {
      const k = pickRandom([2, 3, 5]);
      const coef = pickRandom([2, 3, 4]);
      const rad = coef * coef * k;
      const correctOpt = { key: `${coef}sqrt${k}`, sig: `${coef}√${k}`, labelEl: <span>{coef}<Radical>{k}</Radical></span>, labelEn: <span>{coef}<Radical>{k}</Radical></span> };
      return {
        sig: `ch4_e2_m0_${rad}`,
        type: 'mcq',
        promptEl: <span>Η απλοποιημένη μορφή της ρίζας <Radical>{rad}</Radical> είναι:</span>,
        promptEn: <span>The simplified form of <Radical>{rad}</Radical> is:</span>,
        options: ensureFourUniqueOptions(correctOpt, [
          { key: `${k}sqrt${coef}`, sig: `${k}√${coef}`, labelEl: <span>{k}<Radical>{coef}</Radical></span>, labelEn: <span>{k}<Radical>{coef}</Radical></span> },
          { key: `${coef * coef}sqrt${k}`, sig: `${coef * coef}√${k}`, labelEl: <span>{coef * coef}<Radical>{k}</Radical></span>, labelEn: <span>{coef * coef}<Radical>{k}</Radical></span> },
          { key: `${coef + k}`, sig: `${coef + k}`, labelEl: String(coef + k), labelEn: String(coef + k) },
          { key: `2sqrt${rad / 2}`, sig: `2√${rad / 2}`, labelEl: <span>2<Radical>{rad / 2}</Radical></span>, labelEn: <span>2<Radical>{rad / 2}</Radical></span> },
        ]),
        correct: correctOpt.key,
        correctTextEl: <span>{coef}<Radical>{k}</Radical></span>,
        correctTextEn: <span>{coef}<Radical>{k}</Radical></span>,
        explanationEl: <span><Radical>{rad}</Radical> = <Radical>{coef * coef} · {k}</Radical> = {coef}<Radical>{k}</Radical>.</span>,
        explanationEn: <span><Radical>{rad}</Radical> = <Radical>{coef * coef} · {k}</Radical> = {coef}<Radical>{k}</Radical>.</span>,
      };
    }
    case 1: {
      const k = pickRandom([2, 3, 5]);
      const a = pickRandom([2, 3, 4]);
      const b = pickRandom([3, 4, 5]);
      const sum = a + b;
      const correctOpt = { key: `${sum}sqrt${k}`, sig: `${sum}√${k}`, labelEl: <span>{sum}<Radical>{k}</Radical></span>, labelEn: <span>{sum}<Radical>{k}</Radical></span> };
      return {
        sig: `ch4_e2_m1_${a}_${b}_${k}`,
        type: 'mcq',
        promptEl: <span>Το άθροισμα {a}<Radical>{k}</Radical> + {b}<Radical>{k}</Radical> ισούται με:</span>,
        promptEn: <span>The sum {a}<Radical>{k}</Radical> + {b}<Radical>{k}</Radical> equals:</span>,
        options: ensureFourUniqueOptions(correctOpt, [
          { key: `${sum}sqrt${2 * k}`, sig: `${sum}√${2 * k}`, labelEl: <span>{sum}<Radical>{2 * k}</Radical></span>, labelEn: <span>{sum}<Radical>{2 * k}</Radical></span> },
          { key: `${a * b}sqrt${k}`, sig: `${a * b}√${k}`, labelEl: <span>{a * b}<Radical>{k}</Radical></span>, labelEn: <span>{a * b}<Radical>{k}</Radical></span> },
          { key: `${sum * k}`, sig: `${sum * k}`, labelEl: String(sum * k), labelEn: String(sum * k) },
          { key: `sqrt${sum * k}`, sig: `√${sum * k}`, labelEl: <Radical>{sum * k}</Radical>, labelEn: <Radical>{sum * k}</Radical> },
        ]),
        correct: correctOpt.key,
        correctTextEl: <span>{sum}<Radical>{k}</Radical></span>,
        correctTextEn: <span>{sum}<Radical>{k}</Radical></span>,
        explanationEl: <span>({a} + {b})<Radical>{k}</Radical> = {sum}<Radical>{k}</Radical>.</span>,
        explanationEn: <span>({a} + {b})<Radical>{k}</Radical> = {sum}<Radical>{k}</Radical>.</span>,
      };
    }
    case 2: {
      const q = pickRandom([4, 9, 16, 25]);
      const d = pickRandom([2, 3, 5]);
      const ans = Math.sqrt(q);
      return {
        sig: `ch4_e2_m2_${q}_${d}`,
        type: 'input',
        promptEl: <span className="inline-flex items-center">Υπολογίστε το πηλίκο <Frac num={<Radical>{q * d}</Radical>} den={<Radical>{d}</Radical>} />:</span>,
        promptEn: <span className="inline-flex items-center">Calculate the quotient <Frac num={<Radical>{q * d}</Radical>} den={<Radical>{d}</Radical>} />:</span>,
        correct: String(ans),
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span><Frac num={<Radical>{q * d}</Radical>} den={<Radical>{d}</Radical>} /> = <Radical><Frac num={String(q * d)} den={String(d)} /></Radical> = <Radical>{q}</Radical> = {ans}.</span>,
        explanationEn: <span><Frac num={<Radical>{q * d}</Radical>} den={<Radical>{d}</Radical>} /> = <Radical>{q}</Radical> = {ans}.</span>,
      };
    }
    case 3: {
      const a = pickRandom([2, 3]);
      const b = pickRandom([5, 7]);
      const ans = a * a * b;
      return {
        sig: `ch4_e2_m3_${a}_${b}`,
        type: 'input',
        promptEl: <span>Υπολογίστε την τιμή της παράστασης ({a}<Radical>{b}</Radical>)<sup>2</sup>:</span>,
        promptEn: <span>Calculate the value of ({a}<Radical>{b}</Radical>)<sup>2</sup>:</span>,
        correct: String(ans),
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span>({a}<Radical>{b}</Radical>)<sup>2</sup> = {a}<sup>2</sup> · (<Radical>{b}</Radical>)<sup>2</sup> = {a * a} · {b} = {ans}.</span>,
        explanationEn: <span>({a}<Radical>{b}</Radical>)<sup>2</sup> = {a * a} · {b} = {ans}.</span>,
      };
    }
    case 4: {
      const a = pickRandom([3, 4]);
      const b = pickRandom([2, 3]);
      return {
        sig: `ch4_e2_m4_${a}_${b}`,
        type: 'tf',
        promptEl: <span>Ισχύει ότι {a}<Radical>{b}</Radical> = <Radical>{a * a * b}</Radical>.</span>,
        promptEn: <span>It holds that {a}<Radical>{b}</Radical> = <Radical>{a * a * b}</Radical>.</span>,
        correct: 'true',
        correctTextEl: 'Σωστό',
        correctTextEn: 'True',
        explanationEl: <span>Βάζοντας το {a} μέσα στη ρίζα υψώνεται στο τετράγωνο: <Radical>{a}² · {b}</Radical> = <Radical>{a * a * b}</Radical>.</span>,
        explanationEn: <span>Moving {a} inside the square root squares it: <Radical>{a}² · {b}</Radical> = <Radical>{a * a * b}</Radical>.</span>,
      };
    }
    case 5: {
      const k = pickRandom([2, 3, 6]);
      const ans = k * 3;
      return {
        sig: `ch4_e2_m5_${k}`,
        type: 'input',
        promptEl: <span>Υπολογίστε το γινόμενο <Radical>{k}</Radical> · <Radical>{9 * k}</Radical>:</span>,
        promptEn: <span>Calculate the product <Radical>{k}</Radical> · <Radical>{9 * k}</Radical>:</span>,
        correct: String(ans),
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span><Radical>{k} · {9 * k}</Radical> = <Radical>9 · {k}²</Radical> = 3 · {k} = {ans}.</span>,
        explanationEn: <span><Radical>{k} · {9 * k}</Radical> = 3 · {k} = {ans}.</span>,
      };
    }
    case 6: {
      const a = pickRandom([2, 3]);
      const b = pickRandom([5, 6]);
      const correctOpt = { key: `${a}sqrt${b}`, sig: `${a}√${b}`, labelEl: <span>{a}<Radical>{b}</Radical></span>, labelEn: <span>{a}<Radical>{b}</Radical></span> };
      return {
        sig: `ch4_e2_m6_${a}_${b}`,
        type: 'mcq',
        promptEl: 'Ποιος από τους παρακάτω αριθμούς είναι μεγαλύτερος;',
        promptEn: 'Which of the following numbers is the greatest?',
        options: ensureFourUniqueOptions(correctOpt, [
          { key: `sqrt${a * a * b - 2}`, sig: `√${a * a * b - 2}`, labelEl: <Radical>{a * a * b - 2}</Radical>, labelEn: <Radical>{a * a * b - 2}</Radical> },
          { key: `sqrt${a * b}`, sig: `√${a * b}`, labelEl: <Radical>{a * b}</Radical>, labelEn: <Radical>{a * b}</Radical> },
          { key: `sqrt${a + b}`, sig: `√${a + b}`, labelEl: <Radical>{a + b}</Radical>, labelEn: <Radical>{a + b}</Radical> },
          { key: `1`, sig: `1`, labelEl: '1', labelEn: '1' },
        ]),
        correct: correctOpt.key,
        correctTextEl: <span>{a}<Radical>{b}</Radical></span>,
        correctTextEn: <span>{a}<Radical>{b}</Radical></span>,
        explanationEl: <span>{a}<Radical>{b}</Radical> = <Radical>{a * a * b}</Radical>, που είναι μεγαλύτερο από τα υπόλοιπα.</span>,
        explanationEn: <span>{a}<Radical>{b}</Radical> = <Radical>{a * a * b}</Radical>, which is greater than the others.</span>,
      };
    }
    case 7: {
      return {
        sig: 'ch4_e2_m7',
        type: 'tf',
        promptEl: <span>Ισχύει ότι <Radical>12</Radical> + <Radical>27</Radical> = 5<Radical>3</Radical>.</span>,
        promptEn: <span>It holds that <Radical>12</Radical> + <Radical>27</Radical> = 5<Radical>3</Radical>.</span>,
        correct: 'true',
        correctTextEl: 'Σωστό',
        correctTextEn: 'True',
        explanationEl: <span><Radical>12</Radical> + <Radical>27</Radical> = 2<Radical>3</Radical> + 3<Radical>3</Radical> = 5<Radical>3</Radical>.</span>,
        explanationEn: <span><Radical>12</Radical> + <Radical>27</Radical> = 2<Radical>3</Radical> + 3<Radical>3</Radical> = 5<Radical>3</Radical>.</span>,
      };
    }
    case 8: {
      const k = pickRandom([2, 3, 5]);
      const ans = k * k;
      return {
        sig: `ch4_e2_m8_${k}`,
        type: 'input',
        promptEl: <span>Υπολογίστε την τιμή της δύναμης (<Radical>{k}</Radical>)<sup>4</sup>:</span>,
        promptEn: <span>Calculate the value of (<Radical>{k}</Radical>)<sup>4</sup>:</span>,
        correct: String(ans),
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span>(<Radical>{k}</Radical>)<sup>4</sup> = ((<Radical>{k}</Radical>)<sup>2</sup>)<sup>2</sup> = {k}<sup>2</sup> = {ans}.</span>,
        explanationEn: <span>(<Radical>{k}</Radical>)<sup>4</sup> = {k}<sup>2</sup> = {ans}.</span>,
      };
    }
    default: {
      const a = pickRandom([2, 3, 5]);
      const ans = a + 1;
      const correctOpt = { key: String(ans), sig: String(ans), labelEl: String(ans), labelEn: String(ans) };
      return {
        sig: `ch4_e2_m9_${a}`,
        type: 'mcq',
        promptEl: <span>Η τιμή της παράστασης (<Radical>{a + 2}</Radical> - 1)(<Radical>{a + 2}</Radical> + 1) είναι:</span>,
        promptEn: <span>The value of (<Radical>{a + 2}</Radical> - 1)(<Radical>{a + 2}</Radical> + 1) is:</span>,
        options: ensureFourUniqueOptions(correctOpt, [
          { key: String(a + 3), sig: String(a + 3), labelEl: String(a + 3), labelEn: String(a + 3) },
          { key: String(a + 2), sig: String(a + 2), labelEl: String(a + 2), labelEn: String(a + 2) },
          { key: String(a), sig: String(a), labelEl: String(a), labelEn: String(a) },
          { key: '0', sig: '0', labelEl: '0', labelEn: '0' },
        ]),
        correct: correctOpt.key,
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span>Από τη διαφορά τετραγώνων: (<Radical>{a + 2}</Radical>)<sup>2</sup> - 1<sup>2</sup> = {a + 2} - 1 = {ans}.</span>,
        explanationEn: <span>By difference of squares: (<Radical>{a + 2}</Radical>)<sup>2</sup> - 1<sup>2</sup> = {ans}.</span>,
      };
    }
  }
}

// ΚΕΦΑΛΑΙΟ 5: Ρητοί και άρρητοι αριθμοί - Πραγματικοί αριθμοί
function genCh5Ex1(mode) {
  switch (mode) {
    case 0: {
      const irr = pickRandom([2, 3, 5, 7, 11]);
      const correctOpt = { key: `sqrt_${irr}`, sig: `√${irr}`, labelEl: <Radical>{irr}</Radical>, labelEn: <Radical>{irr}</Radical> };
      return {
        sig: `ch5_e1_m0_${irr}`,
        type: 'mcq',
        promptEl: 'Ποιος από τους παρακάτω αριθμούς είναι άρρητος;',
        promptEn: 'Which of the following numbers is irrational?',
        options: ensureFourUniqueOptions(correctOpt, [
          { key: 'sqrt_16', sig: '√16', labelEl: <Radical>16</Radical>, labelEn: <Radical>16</Radical> },
          { key: 'frac', sig: '-5/8', labelEl: <Frac num="-5" den="8" />, labelEn: <Frac num="-5" den="8" /> },
          { key: 'per', sig: '0,(6)', labelEl: '0,(6)', labelEn: '0.(6)' },
          { key: 'dec', sig: '-3,14', labelEl: '-3,14', labelEn: '-3.14' },
        ]),
        correct: correctOpt.key,
        correctTextEl: <Radical>{irr}</Radical>,
        correctTextEn: <Radical>{irr}</Radical>,
        explanationEl: <span>Οι <Radical>16</Radical> = 4, <Frac num="-5" den="8" />, 0,(6) και -3,14 είναι ρητοί, ενώ ο <Radical>{irr}</Radical> είναι άρρητος.</span>,
        explanationEn: <span><Radical>16</Radical> = 4, <Frac num="-5" den="8" />, 0.(6), and -3.14 are rational, while <Radical>{irr}</Radical> is irrational.</span>,
      };
    }
    case 1: {
      return {
        sig: 'ch5_e1_m1',
        type: 'tf',
        promptEl: 'Ο αριθμός π (3,14159265...) είναι άρρητος αριθμός.',
        promptEn: 'The number π (3.14159265...) is an irrational number.',
        correct: 'true',
        correctTextEl: 'Σωστό',
        correctTextEn: 'True',
        explanationEl: 'Το π έχει άπειρα μη περιοδικά δεκαδικά ψηφία και δεν γράφεται ως κλάσμα ακεραίων, άρα είναι άρρητος.',
        explanationEn: 'π has an infinite non-repeating decimal expansion, so it is irrational.',
      };
    }
    case 2: {
      const sq = pickRandom([9, 25, 36, 49, 64, 81]);
      return {
        sig: `ch5_e1_m2_${sq}`,
        type: 'tf',
        promptEl: <span>Ο αριθμός <Radical>{sq}</Radical> ανήκει στο σύνολο των άρρητων αριθμών (𝕀).</span>,
        promptEn: <span>The number <Radical>{sq}</Radical> belongs to the set of irrational numbers (𝕀).</span>,
        correct: 'false',
        correctTextEl: 'Λάθος',
        correctTextEn: 'False',
        explanationEl: <span><Radical>{sq}</Radical> = {Math.sqrt(sq)} ∈ ℕ ⊂ ℚ, άρα είναι ρητός αριθμός.</span>,
        explanationEn: <span><Radical>{sq}</Radical> = {Math.sqrt(sq)} ∈ ℕ ⊂ ℚ, so it is rational.</span>,
      };
    }
    case 3: {
      const correctOpt = { key: '0.1010010001...', sig: '0,1010010001...', labelEl: '0,1010010001...', labelEn: '0.1010010001...' };
      return {
        sig: 'ch5_e1_m3',
        type: 'mcq',
        promptEl: 'Ποιος από τους παρακάτω δεκαδικούς αριθμούς παριστάνει άρρητο αριθμό;',
        promptEn: 'Which of the following decimal numbers represents an irrational number?',
        options: ensureFourUniqueOptions(correctOpt, [
          { key: '0.125', sig: '0,125', labelEl: '0,125', labelEn: '0.125' },
          { key: '2.(45)', sig: '2,(45)', labelEl: '2,(45)', labelEn: '2.(45)' },
          { key: '1.777...', sig: '1,777...', labelEl: '1,777...', labelEn: '1.777...' },
          { key: '-4.5', sig: '-4,5', labelEl: '-4,5', labelEn: '-4.5' },
        ]),
        correct: correctOpt.key,
        correctTextEl: '0,1010010001...',
        correctTextEn: '0.1010010001...',
        explanationEl: 'Ο αριθμός 0,1010010001... έχει άπειρα δεκαδικά ψηφία χωρίς επαναλαμβανόμενη περίοδο, άρα είναι άρρητος.',
        explanationEn: '0.1010010001... has infinite non-repeating decimals, so it is irrational.',
      };
    }
    case 4: {
      const k = pickRandom([3, 5, 7]);
      return {
        sig: `ch5_e1_m4_${k}`,
        type: 'tf',
        promptEl: <span>Το άθροισμα 2 + <Radical>{k}</Radical> είναι πραγματικός αριθμός.</span>,
        promptEn: <span>The sum 2 + <Radical>{k}</Radical> is a real number.</span>,
        correct: 'true',
        correctTextEl: 'Σωστό',
        correctTextEn: 'True',
        explanationEl: 'Κάθε ρητός και κάθε άρρητος αριθμός (καθώς και το άθροισμά τους) ανήκει στο σύνολο ℝ των πραγματικών αριθμών.',
        explanationEn: 'Every rational and irrational number, as well as their sum, belongs to the real numbers ℝ.',
      };
    }
    case 5: {
      const correctOpt = { key: 'Q_union_I', sig: 'Q ∪ I', labelEl: 'ℝ = ℚ ∪ 𝕀', labelEn: 'ℝ = ℚ ∪ 𝕀' };
      return {
        sig: 'ch5_e1_m5',
        type: 'mcq',
        promptEl: 'Το σύνολο των πραγματικών αριθμών ℝ αποτελείται από:',
        promptEn: 'The set of real numbers ℝ consists of:',
        options: ensureFourUniqueOptions(correctOpt, [
          { key: 'only_Q', sig: 'Q', labelEl: 'Μόνο τους ρητούς (ℚ)', labelEn: 'Only rational numbers (ℚ)' },
          { key: 'only_Z', sig: 'Z', labelEl: 'Μόνο τους ακεραίους (ℤ)', labelEn: 'Only integers (ℤ)' },
          { key: 'only_I', sig: 'I', labelEl: 'Μόνο τους άρρητους (𝕀)', labelEn: 'Only irrational numbers (𝕀)' },
          { key: 'N_Z', sig: 'N ∪ Z', labelEl: 'Μόνο φυσικούς και ακεραίους', labelEn: 'Only natural numbers and integers' },
        ]),
        correct: correctOpt.key,
        correctTextEl: 'ℝ = ℚ ∪ 𝕀',
        correctTextEn: 'ℝ = ℚ ∪ 𝕀',
        explanationEl: 'Οι ρητοί (ℚ) μαζί με τους άρρητους (𝕀) σχηματίζουν το σύνολο των πραγματικών αριθμών ℝ.',
        explanationEn: 'Rational (ℚ) and irrational (𝕀) numbers together form the real numbers ℝ.',
      };
    }
    case 6: {
      const d = pickRandom([1, 2, 4, 5, 7, 8]);
      return {
        sig: `ch5_e1_m6_${d}`,
        type: 'input',
        unitEl: '(παρονομαστής)',
        unitEn: '(denominator)',
        promptEl: <span>Ο περιοδικός δεκαδικός αριθμός 0,({d}) γράφεται ως κλάσμα <Frac num={String(d)} den="β" />. Ποιος είναι ο παρονομαστής β;</span>,
        promptEn: <span>The repeating decimal 0.({d}) can be written as <Frac num={String(d)} den="b" />. What is the denominator b?</span>,
        correct: '9',
        correctTextEl: '9',
        correctTextEn: '9',
        explanationEl: <span>0,({d}) = <Frac num={String(d)} den="9" />, άρα β = 9.</span>,
        explanationEn: <span>0.({d}) = <Frac num={String(d)} den="9" />, so b = 9.</span>,
      };
    }
    case 7: {
      return {
        sig: 'ch5_e1_m7',
        type: 'tf',
        promptEl: 'Κάθε πραγματικός αριθμός αντιστοιχεί σε ένα μοναδικό σημείο της ευθείας των πραγματικών αριθμών.',
        promptEn: 'Every real number corresponds to a unique point on the real number line.',
        correct: 'true',
        correctTextEl: 'Σωστό',
        correctTextEn: 'True',
        explanationEl: 'Υπάρχει αμφιμονοσήμαντη αντιστοιχία ανάμεσα στους πραγματικούς αριθμούς ℝ και στα σημεία μιας ευθείας.',
        explanationEn: 'There is a one-to-one correspondence between real numbers ℝ and the points on a line.',
      };
    }
    case 8: {
      const correctOpt = { key: 'sqrt2_sq', sig: '(√2)²', labelEl: <span>(<Radical>2</Radical>)<sup>2</sup></span>, labelEn: <span>(<Radical>2</Radical>)<sup>2</sup></span> };
      return {
        sig: 'ch5_e1_m8',
        type: 'mcq',
        promptEl: 'Ποια από τις παρακάτω παραστάσεις δίνει ρητό αποτέλεσμα;',
        promptEn: 'Which of the following expressions yields a rational result?',
        options: ensureFourUniqueOptions(correctOpt, [
          { key: 'sqrt2_plus_1', sig: '√2 + 1', labelEl: <span><Radical>2</Radical> + 1</span>, labelEn: <span><Radical>2</Radical> + 1</span> },
          { key: '3sqrt2', sig: '3√2', labelEl: <span>3<Radical>2</Radical></span>, labelEn: <span>3<Radical>2</Radical></span> },
          { key: 'sqrt2_div_2', sig: '√2/2', labelEl: <Frac num={<Radical>2</Radical>} den="2" />, labelEn: <Frac num={<Radical>2</Radical>} den="2" /> },
          { key: 'pi_plus_2', sig: 'π + 2', labelEl: 'π + 2', labelEn: 'π + 2' },
        ]),
        correct: correctOpt.key,
        correctTextEl: <span>(<Radical>2</Radical>)<sup>2</sup></span>,
        correctTextEn: <span>(<Radical>2</Radical>)<sup>2</sup></span>,
        explanationEl: <span>(<Radical>2</Radical>)<sup>2</sup> = 2 ∈ ℚ (ρητός), ενώ οι υπόλοιπες παραστάσεις είναι άρρητοι αριθμοί.</span>,
        explanationEn: <span>(<Radical>2</Radical>)<sup>2</sup> = 2 ∈ ℚ (rational), while the rest are irrational.</span>,
      };
    }
    default: {
      return {
        sig: 'ch5_e1_m9',
        type: 'tf',
        promptEl: 'Υπάρχουν αριθμοί που είναι ταυτόχρονα ρητοί και άρρητοι.',
        promptEn: 'There exist numbers that are both rational and irrational.',
        correct: 'false',
        correctTextEl: 'Λάθος',
        correctTextEn: 'False',
        explanationEl: 'Τα σύνολα ℚ και 𝕀 είναι ξένα μεταξύ τους (ℚ ∩ 𝕀 = ∅).',
        explanationEn: 'The sets ℚ and 𝕀 are disjoint (ℚ ∩ 𝕀 = ∅).',
      };
    }
  }
}

function genCh5Ex2(mode) {
  switch (mode) {
    case 0: {
      const n = pickRandom([6, 10, 14, 21, 30, 42]);
      const low = Math.floor(Math.sqrt(n));
      return {
        sig: `ch5_e2_m0_${n}`,
        type: 'input',
        unitEl: '(ακέραιος κ)',
        unitEn: '(integer k)',
        promptEl: <span>Αν κ &lt; <Radical>{n}</Radical> &lt; κ + 1 (με κ ∈ ℕ), ποια είναι η τιμή του κ;</span>,
        promptEn: <span>If k &lt; <Radical>{n}</Radical> &lt; k + 1 (with k ∈ ℕ), what is k?</span>,
        correct: String(low),
        correctTextEl: String(low),
        correctTextEn: String(low),
        explanationEl: <span>{low * low} &lt; {n} &lt; {(low + 1) * (low + 1)} ⇒ {low} &lt; <Radical>{n}</Radical> &lt; {low + 1}, άρα κ = {low}.</span>,
        explanationEn: <span>{low * low} &lt; {n} &lt; {(low + 1) * (low + 1)} ⇒ {low} &lt; <Radical>{n}</Radical> &lt; {low + 1}, so k = {low}.</span>,
      };
    }
    case 1: {
      const correctOpt = { key: 'sqrt10', sig: '√10', labelEl: <Radical>10</Radical>, labelEn: <Radical>10</Radical> };
      return {
        sig: 'ch5_e2_m1',
        type: 'mcq',
        promptEl: 'Ποιος από τους παρακάτω άρρητους αριθμούς βρίσκεται ανάμεσα στο 3 και στο 4;',
        promptEn: 'Which of the following irrational numbers lies between 3 and 4?',
        options: ensureFourUniqueOptions(correctOpt, [
          { key: 'sqrt5', sig: '√5', labelEl: <Radical>5</Radical>, labelEn: <Radical>5</Radical> },
          { key: 'sqrt8', sig: '√8', labelEl: <Radical>8</Radical>, labelEn: <Radical>8</Radical> },
          { key: 'sqrt18', sig: '√18', labelEl: <Radical>18</Radical>, labelEn: <Radical>18</Radical> },
          { key: 'sqrt26', sig: '√26', labelEl: <Radical>26</Radical>, labelEn: <Radical>26</Radical> },
        ]),
        correct: correctOpt.key,
        correctTextEl: <Radical>10</Radical>,
        correctTextEn: <Radical>10</Radical>,
        explanationEl: <span>Επειδή 3 = <Radical>9</Radical> και 4 = <Radical>16</Radical>, ανάμεσά τους βρίσκεται ο <Radical>10</Radical>.</span>,
        explanationEn: <span>Since 3 = <Radical>9</Radical> and 4 = <Radical>16</Radical>, <Radical>10</Radical> lies between them.</span>,
      };
    }
    case 2: {
      const a = pickRandom([2, 3, 4]);
      const ans = a * a + 1;
      return {
        sig: `ch5_e2_m2_${a}`,
        type: 'input',
        promptEl: <span>Ποιος είναι ο μικρότερος φυσικός αριθμός ν ώστε ο <Radical>ν</Radical> να είναι μεγαλύτερος από το {a};</span>,
        promptEn: <span>What is the smallest natural number n such that <Radical>n</Radical> is greater than {a}?</span>,
        correct: String(ans),
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span>{a} = <Radical>{a * a}</Radical>, άρα ο αμέσως επόμενος φυσικός υπόρριζος είναι {a * a} + 1 = {ans}.</span>,
        explanationEn: <span>{a} = <Radical>{a * a}</Radical>, so the next natural radicand is {ans}.</span>,
      };
    }
    case 3: {
      return {
        sig: 'ch5_e2_m3',
        type: 'tf',
        promptEl: <span>Ισχύει η διάταξη: 2 &lt; <Radical>5</Radical> &lt; 3.</span>,
        promptEn: <span>The ordering 2 &lt; <Radical>5</Radical> &lt; 3 holds true.</span>,
        correct: 'true',
        correctTextEl: 'Σωστό',
        correctTextEn: 'True',
        explanationEl: <span>4 &lt; 5 &lt; 9 ⇒ <Radical>4</Radical> &lt; <Radical>5</Radical> &lt; <Radical>9</Radical> ⇒ 2 &lt; <Radical>5</Radical> &lt; 3.</span>,
        explanationEn: <span>4 &lt; 5 &lt; 9 ⇒ 2 &lt; <Radical>5</Radical> &lt; 3.</span>,
      };
    }
    case 4: {
      const k = pickRandom([3, 5, 7]);
      const correctOpt = { key: `-sqrt${k}`, sig: `-√${k}`, labelEl: <span>-<Radical>{k}</Radical></span>, labelEn: <span>-<Radical>{k}</Radical></span> };
      return {
        sig: `ch5_e2_m4_${k}`,
        type: 'mcq',
        promptEl: <span>Ο αντίθετος του άρρητου αριθμού <Radical>{k}</Radical> είναι:</span>,
        promptEn: <span>The opposite of the irrational number <Radical>{k}</Radical> is:</span>,
        options: ensureFourUniqueOptions(correctOpt, [
          { key: `1/sqrt${k}`, sig: `1/√${k}`, labelEl: <Frac num="1" den={<Radical>{k}</Radical>} />, labelEn: <Frac num="1" den={<Radical>{k}</Radical>} /> },
          { key: `sqrt${k}`, sig: `√${k}`, labelEl: <Radical>{k}</Radical>, labelEn: <Radical>{k}</Radical> },
          { key: `-${k}`, sig: `-${k}`, labelEl: `-${k}`, labelEn: `-${k}` },
          { key: '0', sig: '0', labelEl: '0', labelEn: '0' },
        ]),
        correct: correctOpt.key,
        correctTextEl: <span>-<Radical>{k}</Radical></span>,
        correctTextEn: <span>-<Radical>{k}</Radical></span>,
        explanationEl: <span>Ο αντίθετος του <Radical>{k}</Radical> είναι ο -<Radical>{k}</Radical>, αφού <Radical>{k}</Radical> + (-<Radical>{k}</Radical>) = 0.</span>,
        explanationEn: <span>The opposite of <Radical>{k}</Radical> is -<Radical>{k}</Radical>.</span>,
      };
    }
    case 5: {
      const k = pickRandom([2, 3, 5]);
      return {
        sig: `ch5_e2_m5_${k}`,
        type: 'tf',
        promptEl: <span>Η απόλυτη τιμή |-<Radical>{k}</Radical>| ισούται με <Radical>{k}</Radical>.</span>,
        promptEn: <span>The absolute value |-<Radical>{k}</Radical>| equals <Radical>{k}</Radical>.</span>,
        correct: 'true',
        correctTextEl: 'Σωστό',
        correctTextEn: 'True',
        explanationEl: <span>Η απόλυτη τιμή κάθε αρνητικού πραγματικού αριθμού είναι ο αντίθετός του: |-<Radical>{k}</Radical>| = <Radical>{k}</Radical>.</span>,
        explanationEn: <span>The absolute value of a negative real number is its opposite: |-<Radical>{k}</Radical>| = <Radical>{k}</Radical>.</span>,
      };
    }
    case 6: {
      const ans = 5;
      return {
        sig: 'ch5_e2_m6',
        type: 'input',
        unitEl: '(ακέραιος μ)',
        unitEn: '(integer m)',
        promptEl: <span>Αν μ - 1 &lt; <Radical>20</Radical> &lt; μ (με μ ∈ ℕ), ποια είναι η τιμή του μ;</span>,
        promptEn: <span>If m - 1 &lt; <Radical>20</Radical> &lt; m (with m ∈ ℕ), what is m?</span>,
        correct: String(ans),
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span>16 &lt; 20 &lt; 25 ⇒ 4 &lt; <Radical>20</Radical> &lt; 5, άρα μ = 5.</span>,
        explanationEn: <span>16 &lt; 20 &lt; 25 ⇒ 4 &lt; <Radical>20</Radical> &lt; 5, so m = 5.</span>,
      };
    }
    case 7: {
      const correctOpt = { key: 'sqrt15', sig: '√15', labelEl: <Radical>15</Radical>, labelEn: <Radical>15</Radical> };
      return {
        sig: 'ch5_e2_m7',
        type: 'mcq',
        promptEl: 'Ποιος από τους παρακάτω αριθμούς είναι μικρότερος από το 4;',
        promptEn: 'Which of the following numbers is less than 4?',
        options: ensureFourUniqueOptions(correctOpt, [
          { key: 'sqrt17', sig: '√17', labelEl: <Radical>17</Radical>, labelEn: <Radical>17</Radical> },
          { key: 'sqrt20', sig: '√20', labelEl: <Radical>20</Radical>, labelEn: <Radical>20</Radical> },
          { key: '2sqrt5', sig: '2√5', labelEl: <span>2<Radical>5</Radical></span>, labelEn: <span>2<Radical>5</Radical></span> },
          { key: 'sqrt25', sig: '√25', labelEl: <Radical>25</Radical>, labelEn: <Radical>25</Radical> },
        ]),
        correct: correctOpt.key,
        correctTextEl: <Radical>15</Radical>,
        correctTextEn: <Radical>15</Radical>,
        explanationEl: <span>4 = <Radical>16</Radical>, άρα ο <Radical>15</Radical> &lt; <Radical>16</Radical> = 4.</span>,
        explanationEn: <span>4 = <Radical>16</Radical>, so <Radical>15</Radical> &lt; 4.</span>,
      };
    }
    case 8: {
      return {
        sig: 'ch5_e2_m8',
        type: 'tf',
        promptEl: <span>Ισχύει ότι -<Radical>7</Radical> &gt; -<Radical>5</Radical>.</span>,
        promptEn: <span>It holds that -<Radical>7</Radical> &gt; -<Radical>5</Radical>.</span>,
        correct: 'false',
        correctTextEl: 'Λάθος',
        correctTextEn: 'False',
        explanationEl: <span>Επειδή <Radical>7</Radical> &gt; <Radical>5</Radical>, στους αρνητικούς ισχύει το αντίστροφο: -<Radical>7</Radical> &lt; -<Radical>5</Radical>.</span>,
        explanationEn: <span>Since <Radical>7</Radical> &gt; <Radical>5</Radical>, we have -<Radical>7</Radical> &lt; -<Radical>5</Radical>.</span>,
      };
    }
    default: {
      const k = pickRandom([2, 3, 5]);
      return {
        sig: `ch5_e2_m9_${k}`,
        type: 'input',
        promptEl: <span>Υπολογίστε την τιμή της παράστασης (<Radical>{k}</Radical> - 2) + (5 - <Radical>{k}</Radical>):</span>,
        promptEn: <span>Calculate the value of (<Radical>{k}</Radical> - 2) + (5 - <Radical>{k}</Radical>):</span>,
        correct: '3',
        correctTextEl: '3',
        correctTextEn: '3',
        explanationEl: <span>Οι αντίθετοι άρρητοι <Radical>{k}</Radical> και -<Radical>{k}</Radical> απαλείφονται: -2 + 5 = 3.</span>,
        explanationEn: <span>The opposite irrationals cancel out: -2 + 5 = 3.</span>,
      };
    }
  }
}

// ΚΕΦΑΛΑΙΟ 6: Τοποθέτηση άρρητων στην ευθεία, τετράγωνοι αριθμοί & δυνάμεις
function genCh6Ex1(mode) {
  switch (mode) {
    case 0: {
      const configs = [
        { a: 1, b: 1, res: 2, w1: 3, w2: 4, w3: 5 },
        { a: 2, b: 1, res: 5, w1: 3, w2: 4, w3: 6 },
        { a: 2, b: 2, res: 8, w1: 4, w2: 6, w3: 10 },
        { a: 3, b: 1, res: 10, w1: 4, w2: 8, w3: 12 },
      ];
      const c = pickRandom(configs);
      const correctOpt = { key: `sqrt_${c.res}`, sig: `√${c.res}`, labelEl: <Radical>{c.res}</Radical>, labelEn: <Radical>{c.res}</Radical> };
      return {
        sig: `ch6_e1_m0_${c.a}_${c.b}`,
        type: 'mcq',
        promptEl: `Για να τοποθετήσουμε άρρητο αριθμό στην ευθεία ℝ, κατασκευάζουμε ορθογώνιο τρίγωνο με κάθετες ${c.a} και ${c.b}. Ποιος αριθμός αντιστοιχεί στην ακτίνα διαβήτη ρ (υποτείνουσα);`,
        promptEn: `To locate an irrational on ℝ, we draw a right triangle with legs ${c.a} and ${c.b}. Which number corresponds to the compass radius ρ (hypotenuse)?`,
        options: ensureFourUniqueOptions(correctOpt, [
          { key: `sqrt_${c.w1}`, sig: `√${c.w1}`, labelEl: <Radical>{c.w1}</Radical>, labelEn: <Radical>{c.w1}</Radical> },
          { key: `sqrt_${c.w2}`, sig: `√${c.w2}`, labelEl: <Radical>{c.w2}</Radical>, labelEn: <Radical>{c.w2}</Radical> },
          { key: `sqrt_${c.w3}`, sig: `√${c.w3}`, labelEl: <Radical>{c.w3}</Radical>, labelEn: <Radical>{c.w3}</Radical> },
          { key: `${c.a + c.b}`, sig: `${c.a + c.b}`, labelEl: String(c.a + c.b), labelEn: String(c.a + c.b) },
        ]),
        correct: correctOpt.key,
        correctTextEl: <Radical>{c.res}</Radical>,
        correctTextEn: <Radical>{c.res}</Radical>,
        explanationEl: <span>Από το Πυθαγόρειο Θεώρημα: ρ<sup>2</sup> = {c.a}<sup>2</sup> + {c.b}<sup>2</sup> = {c.res} ⇒ ρ = <Radical>{c.res}</Radical>.</span>,
        explanationEn: <span>By the Pythagorean Theorem: ρ<sup>2</sup> = {c.a}<sup>2</sup> + {c.b}<sup>2</sup> = {c.res} ⇒ ρ = <Radical>{c.res}</Radical>.</span>,
        renderFeedbackDiagram: () => (
          <div className="mt-3 max-w-sm rounded-xl bg-white border border-slate-200 p-2.5">
            <svg viewBox="0 0 300 135" className="w-full h-auto max-w-full block">
              <line x1="20" y1="110" x2="280" y2="110" stroke="#334155" strokeWidth="2" />
              <polygon points="50,110 155,110 155,30" fill="#d1fae5" stroke="#059669" strokeWidth="2" />
              <polyline points="143,110 143,98 155,98" fill="none" stroke="#059669" strokeWidth="1.5" />
              <text x="98" y="126" fontSize="12" fontWeight="700" fill="#065f46">{c.a}</text>
              <text x="161" y="75" fontSize="12" fontWeight="700" fill="#065f46">{c.b}</text>
              <text x="68" y="62" fontSize="13" fontWeight="800" fill="#4f46e5">ρ = √{c.res}</text>
              <path d="M 155 30 A 132 132 0 0 1 182 110" fill="none" stroke="#4f46e5" strokeWidth="2" strokeDasharray="4 3" />
              <circle cx="182" cy="110" r="4.5" fill="#dc2626" />
              <text x="175" y="128" fontSize="12" fontWeight="800" fill="#dc2626">√{c.res}</text>
            </svg>
          </div>
        ),
      };
    }
    case 1: {
      const k = pickRandom([2, 3, 5]);
      const ans = k * k * k;
      return {
        sig: `ch6_e1_m1_${k}`,
        type: 'input',
        promptEl: <span>Υπολογίστε την τιμή της δύναμης (<Radical>{k}</Radical>)<sup>6</sup>:</span>,
        promptEn: <span>Calculate the value of (<Radical>{k}</Radical>)<sup>6</sup>:</span>,
        correct: String(ans),
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span>(<Radical>{k}</Radical>)<sup>6</sup> = ((<Radical>{k}</Radical>)<sup>2</sup>)<sup>3</sup> = {k}<sup>3</sup> = {ans}.</span>,
        explanationEn: <span>(<Radical>{k}</Radical>)<sup>6</sup> = {k}<sup>3</sup> = {ans}.</span>,
      };
    }
    case 2: {
      const sq1 = pickRandom([9, 16, 25]);
      const sq2 = pickRandom([36, 49, 64]);
      const ans = Math.sqrt(sq1) + Math.sqrt(sq2);
      return {
        sig: `ch6_e1_m2_${sq1}_${sq2}`,
        type: 'input',
        promptEl: <span>Υπολογίστε το άθροισμα των ριζών των τετράγωνων αριθμών: <Radical>{sq1}</Radical> + <Radical>{sq2}</Radical></span>,
        promptEn: <span>Calculate the sum of square roots: <Radical>{sq1}</Radical> + <Radical>{sq2}</Radical></span>,
        correct: String(ans),
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span><Radical>{sq1}</Radical> + <Radical>{sq2}</Radical> = {Math.sqrt(sq1)} + {Math.sqrt(sq2)} = {ans}.</span>,
        explanationEn: <span><Radical>{sq1}</Radical> + <Radical>{sq2}</Radical> = {ans}.</span>,
      };
    }
    case 3: {
      const k = pickRandom([2, 3, 5]);
      const correctOpt = { key: `1/${k}`, sig: `1/${k}`, labelEl: <Frac num="1" den={String(k)} />, labelEn: <Frac num="1" den={String(k)} /> };
      return {
        sig: `ch6_e1_m3_${k}`,
        type: 'mcq',
        promptEl: <span>Η τιμή της δύναμης (<Radical>{k}</Radical>)<sup>-2</sup> είναι:</span>,
        promptEn: <span>The value of (<Radical>{k}</Radical>)<sup>-2</sup> is:</span>,
        options: ensureFourUniqueOptions(correctOpt, [
          { key: `-${k}`, sig: `-${k}`, labelEl: `-${k}`, labelEn: `-${k}` },
          { key: `${k}`, sig: `${k}`, labelEl: String(k), labelEn: String(k) },
          { key: `-1/${k}`, sig: `-1/${k}`, labelEl: <span>-<Frac num="1" den={String(k)} /></span>, labelEn: <span>-<Frac num="1" den={String(k)} /></span> },
          { key: `1/${k * k}`, sig: `1/${k * k}`, labelEl: <Frac num="1" den={String(k * k)} />, labelEn: <Frac num="1" den={String(k * k)} /> },
        ]),
        correct: correctOpt.key,
        correctTextEl: <Frac num="1" den={String(k)} />,
        correctTextEn: <Frac num="1" den={String(k)} />,
        explanationEl: <span>(<Radical>{k}</Radical>)<sup>-2</sup> = <Frac num="1" den={<span>(<Radical>{k}</Radical>)<sup>2</sup></span>} /> = <Frac num="1" den={String(k)} />.</span>,
        explanationEn: <span>(<Radical>{k}</Radical>)<sup>-2</sup> = <Frac num="1" den={String(k)} />.</span>,
      };
    }
    case 4: {
      const n = pickRandom([8, 9, 10]);
      const ans = n * n;
      return {
        sig: `ch6_e1_m4_${n}`,
        type: 'input',
        promptEl: `Ποιος είναι ο ${n}-ος θετικός τετράγωνος αριθμός (δηλαδή το ${n}²);`,
        promptEn: `What is the ${n}th positive square number (i.e. ${n}²)?`,
        correct: String(ans),
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: `${n}² = ${n} · ${n} = ${ans}.`,
        explanationEn: `${n}² = ${ans}.`,
      };
    }
    case 5: {
      return {
        sig: 'ch6_e1_m5',
        type: 'tf',
        promptEl: <span>Για να κατασκευάσουμε τον <Radical>3</Radical> στην ευθεία ℝ, αρκεί ένα ορθογώνιο τρίγωνο με κάθετες πλευρές <Radical>2</Radical> και 1.</span>,
        promptEn: <span>To construct <Radical>3</Radical> on ℝ, a right triangle with legs <Radical>2</Radical> and 1 suffices.</span>,
        correct: 'true',
        correctTextEl: 'Σωστό',
        correctTextEn: 'True',
        explanationEl: <span>(<Radical>2</Radical>)<sup>2</sup> + 1<sup>2</sup> = 2 + 1 = 3 ⇒ ρ = <Radical>3</Radical>.</span>,
        explanationEn: <span>(<Radical>2</Radical>)<sup>2</sup> + 1<sup>2</sup> = 3 ⇒ ρ = <Radical>3</Radical>.</span>,
      };
    }
    case 6: {
      const k = pickRandom([2, 3, 5]);
      const ans = k * k;
      return {
        sig: `ch6_e1_m6_${k}`,
        type: 'input',
        promptEl: <span>Υπολογίστε: (<Radical>{k}</Radical>)<sup>5</sup> · (<Radical>{k}</Radical>)<sup>-1</sup></span>,
        promptEn: <span>Calculate: (<Radical>{k}</Radical>)<sup>5</sup> · (<Radical>{k}</Radical>)<sup>-1</sup></span>,
        correct: String(ans),
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span>(<Radical>{k}</Radical>)<sup>5 - 1</sup> = (<Radical>{k}</Radical>)<sup>4</sup> = {k}<sup>2</sup> = {ans}.</span>,
        explanationEn: <span>(<Radical>{k}</Radical>)<sup>4</sup> = {k}<sup>2</sup> = {ans}.</span>,
      };
    }
    case 7: {
      const k = pickRandom([3, 5, 7]);
      return {
        sig: `ch6_e1_m7_${k}`,
        type: 'tf',
        promptEl: <span>Η δύναμη (<Radical>{k}</Radical>)<sup>0</sup> ισούται με 1.</span>,
        promptEn: <span>The power (<Radical>{k}</Radical>)<sup>0</sup> equals 1.</span>,
        correct: 'true',
        correctTextEl: 'Σωστό',
        correctTextEn: 'True',
        explanationEl: <span>Κάθε μη μηδενικός πραγματικός αριθμός υψωμένος στη μηδενική δύναμη ισούται με 1.</span>,
        explanationEn: <span>Any non-zero real number raised to the 0th power equals 1.</span>,
      };
    }
    case 8: {
      const k = pickRandom([2, 3, 5]);
      const correctOpt = { key: `${k}^3`, sig: `${k * k * k}`, labelEl: String(k * k * k), labelEn: String(k * k * k) };
      return {
        sig: `ch6_e1_m8_${k}`,
        type: 'mcq',
        promptEl: <span className="inline-flex items-center">Το πηλίκο <Frac num={<span>(<Radical>{k}</Radical>)<sup>4</sup></span>} den={<span>(<Radical>{k}</Radical>)<sup>-2</sup></span>} /> ισούται με:</span>,
        promptEn: <span className="inline-flex items-center">The quotient <Frac num={<span>(<Radical>{k}</Radical>)<sup>4</sup></span>} den={<span>(<Radical>{k}</Radical>)<sup>-2</sup></span>} /> equals:</span>,
        options: ensureFourUniqueOptions(correctOpt, [
          { key: `${k}`, sig: `${k}`, labelEl: String(k), labelEn: String(k) },
          { key: `${k * k}`, sig: `${k * k}`, labelEl: String(k * k), labelEn: String(k * k) },
          { key: `1/${k}`, sig: `1/${k}`, labelEl: <Frac num="1" den={String(k)} />, labelEn: <Frac num="1" den={String(k)} /> },
          { key: '1', sig: '1', labelEl: '1', labelEn: '1' },
        ]),
        correct: correctOpt.key,
        correctTextEl: String(k * k * k),
        correctTextEn: String(k * k * k),
        explanationEl: <span>(<Radical>{k}</Radical>)<sup>4 - (-2)</sup> = (<Radical>{k}</Radical>)<sup>6</sup> = {k}<sup>3</sup> = {k * k * k}.</span>,
        explanationEn: <span>(<Radical>{k}</Radical>)<sup>6</sup> = {k}<sup>3</sup> = {k * k * k}.</span>,
      };
    }
    default: {
      const ans = 25;
      return {
        sig: 'ch6_e1_m9',
        type: 'input',
        promptEl: 'Ποιος είναι ο μοναδικός τετράγωνος αριθμός ανάμεσα στο 20 και στο 30;',
        promptEn: 'What is the only square number between 20 and 30?',
        correct: String(ans),
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: '5² = 25, ενώ 4² = 16 και 6² = 36.',
        explanationEn: '5² = 25, while 4² = 16 and 6² = 36.',
      };
    }
  }
}

function genCh6Ex2(mode) {
  switch (mode) {
    case 0: {
      const b = pickRandom([2, 3, 5]);
      const ans = b * b;
      return {
        sig: `ch6_e2_m0_${b}`,
        type: 'input',
        promptEl: <span className="inline-flex items-center">Υπολογίστε την τιμή της παράστασης: <Frac num={<span>{b}<sup>-3</sup> · ({b}<sup>4</sup>)<sup>2</sup></span>} den={<span>{b}<sup>3</sup></span>} /></span>,
        promptEn: <span className="inline-flex items-center">Calculate the value of: <Frac num={<span>{b}<sup>-3</sup> · ({b}<sup>4</sup>)<sup>2</sup></span>} den={<span>{b}<sup>3</sup></span>} /></span>,
        correct: String(ans),
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span><Frac num={<span>{b}<sup>-3</sup> · {b}<sup>8</sup></span>} den={<span>{b}<sup>3</sup></span>} /> = <Frac num={<span>{b}<sup>5</sup></span>} den={<span>{b}<sup>3</sup></span>} /> = {b}<sup>2</sup> = {ans}.</span>,
        explanationEn: <span><Frac num={<span>{b}<sup>5</sup></span>} den={<span>{b}<sup>3</sup></span>} /> = {b}<sup>2</sup> = {ans}.</span>,
      };
    }
    case 1: {
      const k = pickRandom([2, 3]);
      const ans = k * k + 1;
      const correctOpt = { key: String(ans), sig: String(ans), labelEl: String(ans), labelEn: String(ans) };
      return {
        sig: `ch6_e2_m1_${k}`,
        type: 'mcq',
        promptEl: <span className="inline-flex items-center">Η τιμή της παράστασης (<Frac num="1" den={<Radical>{k}</Radical>} />)<sup>-4</sup> + π<sup>0</sup> είναι:</span>,
        promptEn: <span className="inline-flex items-center">The value of (<Frac num="1" den={<Radical>{k}</Radical>} />)<sup>-4</sup> + π<sup>0</sup> is:</span>,
        options: ensureFourUniqueOptions(correctOpt, [
          { key: String(k + 1), sig: String(k + 1), labelEl: String(k + 1), labelEn: String(k + 1) },
          { key: String(k * k), sig: String(k * k), labelEl: String(k * k), labelEn: String(k * k) },
          { key: String(ans + 2), sig: String(ans + 2), labelEl: String(ans + 2), labelEn: String(ans + 2) },
          { key: '1', sig: '1', labelEl: '1', labelEn: '1' },
        ]),
        correct: correctOpt.key,
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span>(<Radical>{k}</Radical>)<sup>4</sup> + 1 = {k}<sup>2</sup> + 1 = {ans}.</span>,
        explanationEn: <span>(<Radical>{k}</Radical>)<sup>4</sup> + 1 = {ans}.</span>,
      };
    }
    case 2: {
      const m = pickRandom([3, 4, 5]);
      return {
        sig: `ch6_e2_m2_${m}`,
        type: 'tf',
        promptEl: <span>Για κάθε μη μηδενικό πραγματικό α ισχύει (<Frac num="1" den="α" />)<sup>-{m}</sup> = α<sup>{m}</sup>.</span>,
        promptEn: <span>For every non-zero real α, (<Frac num="1" den="α" />)<sup>-{m}</sup> = α<sup>{m}</sup>.</span>,
        correct: 'true',
        correctTextEl: 'Σωστό',
        correctTextEn: 'True',
        explanationEl: <span>Αντιστρέφοντας τη βάση <Frac num="1" den="α" /> παίρνουμε α και ο εκθέτης γίνεται θετικός ({m}).</span>,
        explanationEn: <span>Inverting <Frac num="1" den="α" /> gives α and the exponent becomes positive ({m}).</span>,
      };
    }
    case 3: {
      const k = pickRandom([2, 3, 5]);
      const ans = k * 3;
      return {
        sig: `ch6_e2_m3_${k}`,
        type: 'input',
        promptEl: <span>Υπολογίστε: (<Radical>{k}</Radical> · <Radical>3</Radical>)<sup>2</sup></span>,
        promptEn: <span>Calculate: (<Radical>{k}</Radical> · <Radical>3</Radical>)<sup>2</sup></span>,
        correct: String(ans),
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span>(<Radical>{k}</Radical>)<sup>2</sup> · (<Radical>3</Radical>)<sup>2</sup> = {k} · 3 = {ans}.</span>,
        explanationEn: <span>(<Radical>{k}</Radical>)<sup>2</sup> · (<Radical>3</Radical>)<sup>2</sup> = {ans}.</span>,
      };
    }
    case 4: {
      const e = pickRandom([3, 4]);
      const correctOpt = { key: '1', sig: '1', labelEl: '1', labelEn: '1' };
      return {
        sig: `ch6_e2_m4_${e}`,
        type: 'mcq',
        promptEl: <span>Το γινόμενο (<Radical>2</Radical>)<sup>{e}</sup> · (<Radical>5</Radical>)<sup>{e}</sup> · (<Radical>10</Radical>)<sup>-{e}</sup> ισούται με:</span>,
        promptEn: <span>The product (<Radical>2</Radical>)<sup>{e}</sup> · (<Radical>5</Radical>)<sup>{e}</sup> · (<Radical>10</Radical>)<sup>-{e}</sup> equals:</span>,
        options: ensureFourUniqueOptions(correctOpt, [
          { key: '10', sig: '10', labelEl: '10', labelEn: '10' },
          { key: '100', sig: '100', labelEl: '100', labelEn: '100' },
          { key: '0', sig: '0', labelEl: '0', labelEn: '0' },
          { key: '1/10', sig: '1/10', labelEl: <Frac num="1" den="10" />, labelEn: <Frac num="1" den="10" /> },
        ]),
        correct: '1',
        correctTextEl: '1',
        correctTextEn: '1',
        explanationEl: <span>(<Radical>2</Radical> · <Radical>5</Radical>)<sup>{e}</sup> · (<Radical>10</Radical>)<sup>-{e}</sup> = (<Radical>10</Radical>)<sup>{e}</sup> · (<Radical>10</Radical>)<sup>-{e}</sup> = (<Radical>10</Radical>)<sup>0</sup> = 1.</span>,
        explanationEn: <span>(<Radical>10</Radical>)<sup>{e}</sup> · (<Radical>10</Radical>)<sup>-{e}</sup> = (<Radical>10</Radical>)<sup>0</sup> = 1.</span>,
      };
    }
    case 5: {
      const a = pickRandom([2, 3, 4]);
      const ans = a * a + (a + 1) * (a + 1);
      return {
        sig: `ch6_e2_m5_${a}`,
        type: 'input',
        promptEl: <span>Υπολογίστε το άθροισμα των δύο διαδοχικών τετράγωνων αριθμών: {a}<sup>2</sup> + ({a + 1})<sup>2</sup></span>,
        promptEn: <span>Calculate the sum of two consecutive square numbers: {a}<sup>2</sup> + ({a + 1})<sup>2</sup></span>,
        correct: String(ans),
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span>{a * a} + {(a + 1) * (a + 1)} = {ans}.</span>,
        explanationEn: <span>{a * a} + {(a + 1) * (a + 1)} = {ans}.</span>,
      };
    }
    case 6: {
      return {
        sig: 'ch6_e2_m6',
        type: 'tf',
        promptEl: <span>Ο αριθμός (<Radical>3</Radical>)<sup>3</sup> είναι ρητός αριθμός.</span>,
        promptEn: <span>The number (<Radical>3</Radical>)<sup>3</sup> is a rational number.</span>,
        correct: 'false',
        correctTextEl: 'Λάθος',
        correctTextEn: 'False',
        explanationEl: <span>(<Radical>3</Radical>)<sup>3</sup> = (<Radical>3</Radical>)<sup>2</sup> · <Radical>3</Radical> = 3<Radical>3</Radical>, που είναι άρρητος.</span>,
        explanationEn: <span>(<Radical>3</Radical>)<sup>3</sup> = 3<Radical>3</Radical>, which is irrational.</span>,
      };
    }
    case 7: {
      const ans = 4;
      return {
        sig: 'ch6_e2_m7',
        type: 'input',
        promptEl: <span className="inline-flex items-center">Υπολογίστε: (<Frac num={<Radical>8</Radical>} den={<Radical>2</Radical>} />)<sup>2</sup></span>,
        promptEn: <span className="inline-flex items-center">Calculate: (<Frac num={<Radical>8</Radical>} den={<Radical>2</Radical>} />)<sup>2</sup></span>,
        correct: String(ans),
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span>(<Radical><Frac num="8" den="2" /></Radical>)<sup>2</sup> = (<Radical>4</Radical>)<sup>2</sup> = 4.</span>,
        explanationEn: <span>(<Radical><Frac num="8" den="2" /></Radical>)<sup>2</sup> = 4.</span>,
      };
    }
    case 8: {
      const correctOpt = { key: 'pi^-2', sig: '1/π²', labelEl: <Frac num="1" den={<span>π<sup>2</sup></span>} />, labelEn: <Frac num="1" den={<span>π<sup>2</sup></span>} /> };
      return {
        sig: 'ch6_e2_m8',
        type: 'mcq',
        promptEl: <span>Η δύναμη π<sup>-2</sup> γράφεται ισοδύναμα ως:</span>,
        promptEn: <span>The power π<sup>-2</sup> is equivalently written as:</span>,
        options: ensureFourUniqueOptions(correctOpt, [
          { key: '-pi^2', sig: '-π²', labelEl: <span>-π<sup>2</sup></span>, labelEn: <span>-π<sup>2</sup></span> },
          { key: '-2pi', sig: '-2π', labelEl: '-2π', labelEn: '-2π' },
          { key: '1/2pi', sig: '1/(2π)', labelEl: <Frac num="1" den="2π" />, labelEn: <Frac num="1" den="2π" /> },
          { key: 'pi/2', sig: 'π/2', labelEl: <Frac num="π" den="2" />, labelEn: <Frac num="π" den="2" /> },
        ]),
        correct: correctOpt.key,
        correctTextEl: <Frac num="1" den={<span>π<sup>2</sup></span>} />,
        correctTextEn: <Frac num="1" den={<span>π<sup>2</sup></span>} />,
        explanationEl: <span>Από τον ορισμό του αρνητικού εκθέτη: π<sup>-2</sup> = <Frac num="1" den={<span>π<sup>2</sup></span>} />.</span>,
        explanationEn: <span>By definition: π<sup>-2</sup> = <Frac num="1" den={<span>π<sup>2</sup></span>} />.</span>,
      };
    }
    default: {
      const ans = 10;
      return {
        sig: 'ch6_e2_m9',
        type: 'input',
        promptEl: <span>Υπολογίστε: 2<sup>-1</sup> · (<Radical>20</Radical>)<sup>2</sup></span>,
        promptEn: <span>Calculate: 2<sup>-1</sup> · (<Radical>20</Radical>)<sup>2</sup></span>,
        correct: String(ans),
        correctTextEl: String(ans),
        correctTextEn: String(ans),
        explanationEl: <span><Frac num="1" den="2" /> · 20 = 10.</span>,
        explanationEn: <span><Frac num="1" den="2" /> · 20 = 10.</span>,
      };
    }
  }
}

// ============================================================================
// 6 ΔΥΣΚΟΛΑ ΣΥΝΔΥΑΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ (1 ΑΠΟ ΚΑΘΕ ΚΕΦΑΛΑΙΟ, 10 ΠΑΡΑΛΛΑΓΕΣ ΕΚΑΣΤΟ)
// ============================================================================

// ΠΡΟΒΛΗΜΑ 1 (ΚΕΦ. 1): Σύνθετες παραστάσεις δυνάμεων με ακέραιο εκθέτη
function genProb1(mode) {
  const b = mode % 2 === 0 ? 2 : 3;
  const k = (mode % 5) + 2; // 2..6
  const p1 = -k;
  const ans = b * b + 1;
  return {
    sig: `prob1_m${mode}_${b}_${k}`,
    type: 'input',
    promptEl: (
      <span className="inline-flex flex-wrap items-center gap-x-1">
        <span>Υπολογίστε την τιμή της παράστασης:</span>
        <span className="inline-flex items-center font-bold">
          Α = <Frac num={<span>{b}<sup>{p1}</sup> · ({b}<sup>{k}</sup>)<sup>2</sup></span>} den={<span>{b}<sup>{k - 2}</sup></span>} /> + (<Frac num="1" den={String(b)} />)<sup>0</sup>
        </span>
      </span>
    ),
    promptEn: (
      <span className="inline-flex flex-wrap items-center gap-x-1">
        <span>Calculate the value of:</span>
        <span className="inline-flex items-center font-bold">
          Α = <Frac num={<span>{b}<sup>{p1}</sup> · ({b}<sup>{k}</sup>)<sup>2</sup></span>} den={<span>{b}<sup>{k - 2}</sup></span>} /> + (<Frac num="1" den={String(b)} />)<sup>0</sup>
        </span>
      </span>
    ),
    correct: String(ans),
    correctTextEl: String(ans),
    correctTextEn: String(ans),
    explanationEl: <span>Με διαδοχική εφαρμογή των ιδιοτήτων δυνάμεων βρίσκουμε Α = {b * b} + 1 = {ans}.</span>,
    explanationEn: <span>Applying exponent properties step-by-step yields Α = {b * b} + 1 = {ans}.</span>,
    tableData: [
      {
        stepEl: '1. Δύναμη δύναμης',
        stepEn: '1. Power of a power',
        calc: <span>({b}<sup>{k}</sup>)<sup>2</sup> = {b}<sup>{2 * k}</sup></span>,
      },
      {
        stepEl: '2. Απλοποίηση κλάσματος',
        stepEn: '2. Simplify fraction',
        calc: <span><Frac num={<span>{b}<sup>-{k}</sup> · {b}<sup>{2 * k}</sup></span>} den={<span>{b}<sup>{k - 2}</sup></span>} /> = <Frac num={<span>{b}<sup>{k}</sup></span>} den={<span>{b}<sup>{k - 2}</sup></span>} /> = {b}<sup>{k} - ({k - 2})</sup> = {b}<sup>2</sup> = {b * b}</span>,
      },
      {
        stepEl: '3. Τελικό άθροισμα',
        stepEn: '3. Final sum',
        calc: <span>Α = {b * b} + 1 = {ans}</span>,
      },
    ],
  };
}

// ΠΡΟΒΛΗΜΑ 2 (ΚΕΦ. 2): Εφαρμογή τυποποιημένης μορφής σε φυσική/αστρονομία
function genProb2(mode) {
  const speed = 3; // 3 * 10^8 m/s
  const mins = [2, 4, 5, 6, 8, 10, 12, 15, 20, 25][mode % 10];
  const secs = mins * 60;
  const distMeters = speed * secs;
  const sciCoef = distMeters / 100;
  const sciExp = 10;
  const correctOpt = {
    key: `${sciCoef}*10^${sciExp}`,
    sig: `${String(sciCoef).replace('.', ',')}*10^${sciExp}`,
    labelEl: <span>{String(sciCoef).replace('.', ',')} · 10<sup>{sciExp}</sup> m</span>,
    labelEn: <span>{sciCoef} · 10<sup>{sciExp}</sup> m</span>,
  };
  return {
    sig: `prob2_m${mode}_${mins}`,
    type: 'mcq',
    promptEl: <span>Το φως ταξιδεύει με ταχύτητα 3 · 10<sup>8</sup> m/s. Πόσα μέτρα διανύει σε {mins} λεπτά (εκφρασμένα σε τυποποιημένη μορφή);</span>,
    promptEn: <span>Light travels at 3 · 10<sup>8</sup> m/s. How many meters does it travel in {mins} minutes (in scientific notation)?</span>,
    options: ensureFourUniqueOptions(correctOpt, [
      { key: `${distMeters}*10^8`, sig: `${distMeters}*10^8`, labelEl: <span>{distMeters} · 10<sup>8</sup> m</span>, labelEn: <span>{distMeters} · 10<sup>8</sup> m</span> },
      { key: `${sciCoef}*10^9`, sig: `${String(sciCoef).replace('.', ',')}*10^9`, labelEl: <span>{String(sciCoef).replace('.', ',')} · 10<sup>9</sup> m</span>, labelEn: <span>{sciCoef} · 10<sup>9</sup> m</span> },
      { key: `${sciCoef}*10^11`, sig: `${String(sciCoef).replace('.', ',')}*10^11`, labelEl: <span>{String(sciCoef).replace('.', ',')} · 10<sup>11</sup> m</span>, labelEn: <span>{sciCoef} · 10<sup>11</sup> m</span> },
      { key: `${3 * mins}*10^8`, sig: `${3 * mins}*10^8`, labelEl: <span>{3 * mins} · 10<sup>8</sup> m</span>, labelEn: <span>{3 * mins} · 10<sup>8</sup> m</span> },
    ]),
    correct: correctOpt.key,
    correctTextEl: <span>{String(sciCoef).replace('.', ',')} · 10<sup>{sciExp}</sup> m</span>,
    correctTextEn: <span>{sciCoef} · 10<sup>{sciExp}</sup> m</span>,
    explanationEl: <span>Μετατρέπουμε τα {mins} λεπτά σε {secs} s και πολλαπλασιάζουμε με την ταχύτητα του φωτός.</span>,
    explanationEn: <span>Convert {mins} minutes to {secs} s and multiply by the speed of light.</span>,
    tableData: [
      {
        stepEl: '1. Μετατροπή χρόνου',
        stepEn: '1. Convert time',
        calc: <span>t = {mins} · 60 s = {secs} s = {String(secs / 100).replace('.', ',')} · 10<sup>2</sup> s</span>,
      },
      {
        stepEl: '2. Υπολογισμός απόστασης',
        stepEn: '2. Calculate distance',
        calc: <span>s = (3 · 10<sup>8</sup>) · ({String(secs / 100).replace('.', ',')} · 10<sup>2</sup>) = {String(sciCoef).replace('.', ',')} · 10<sup>10</sup> m</span>,
      },
    ],
  };
}

// ΠΡΟΒΛΗΜΑ 3 (ΚΕΦ. 3): Σύνθετη αριθμητική παράσταση με παρενθέσεις & αρνητικούς εκθέτες
function genProb3(mode) {
  const c = (mode % 5) + 2; // 2..6
  const ans = 4 * c + 1;
  return {
    sig: `prob3_m${mode}_${c}`,
    type: 'input',
    promptEl: (
      <span className="inline-flex flex-wrap items-center gap-x-1">
        <span>Υπολογίστε την τιμή της παράστασης:</span>
        <span className="inline-flex items-center font-bold">
          Β = [(-2)<sup>3</sup> + 3 · (<Frac num="1" den="2" />)<sup>-2</sup>] · {c} - (-1)<sup>7</sup>
        </span>
      </span>
    ),
    promptEn: (
      <span className="inline-flex flex-wrap items-center gap-x-1">
        <span>Calculate the value of:</span>
        <span className="inline-flex items-center font-bold">
          Β = [(-2)<sup>3</sup> + 3 · (<Frac num="1" den="2" />)<sup>-2</sup>] · {c} - (-1)<sup>7</sup>
        </span>
      </span>
    ),
    correct: String(ans),
    correctTextEl: String(ans),
    correctTextEn: String(ans),
    explanationEl: <span>Υπολογίζουμε πρώτα τις δυνάμεις μέσα στην αγκύλη και έπειτα τον πολλαπλασιασμό: Β = 4 · {c} + 1 = {ans}.</span>,
    explanationEn: <span>Evaluate powers inside the brackets first, then multiply: Β = 4 · {c} + 1 = {ans}.</span>,
    tableData: [
      {
        stepEl: '1. Υπολογισμός αγκύλης',
        stepEn: '1. Evaluate brackets',
        calc: <span>(-2)<sup>3</sup> + 3 · 2<sup>2</sup> = -8 + 3 · 4 = -8 + 12 = 4</span>,
      },
      {
        stepEl: '2. Πολλαπλασιασμός & αφαίρεση',
        stepEn: '2. Multiply & subtract',
        calc: <span>Β = 4 · {c} - (-1) = {4 * c} + 1 = {ans}</span>,
      },
    ],
  };
}

// ΠΡΟΒΛΗΜΑ 4 (ΚΕΦ. 4): Γεωμετρικό πρόβλημα εμβαδού/περιμέτρου με ρίζες
function genProb4(mode) {
  const k = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15][mode % 10];
  const area = 6 * k;
  return {
    sig: `prob4_m${mode}_${k}`,
    type: 'input',
    unitEl: 'cm²',
    unitEn: 'cm²',
    promptEl: (
      <span>
        Ένα ορθογώνιο παραλληλόγραμμο έχει μήκος 3<Radical>{k}</Radical> cm και πλάτος 2<Radical>{k}</Radical> cm. Ποιο είναι το εμβαδόν του;
      </span>
    ),
    promptEn: (
      <span>
        A rectangle has length 3<Radical>{k}</Radical> cm and width 2<Radical>{k}</Radical> cm. What is its area?
      </span>
    ),
    correct: String(area),
    correctTextEl: `${area} cm²`,
    correctTextEn: `${area} cm²`,
    explanationEl: <span>Ε = μήκος · πλάτος = (3<Radical>{k}</Radical>) · (2<Radical>{k}</Radical>) = 6 · (<Radical>{k}</Radical>)<sup>2</sup> = 6 · {k} = {area} cm².</span>,
    explanationEn: <span>Area = (3<Radical>{k}</Radical>) · (2<Radical>{k}</Radical>) = 6 · {k} = {area} cm².</span>,
    tableData: [
      {
        stepEl: '1. Τύπος εμβαδού',
        stepEn: '1. Area formula',
        calc: <span>Ε = (3<Radical>{k}</Radical>) · (2<Radical>{k}</Radical>)</span>,
      },
      {
        stepEl: '2. Ιδιότητα ριζών',
        stepEn: '2. Square root property',
        calc: <span>Ε = (3 · 2) · (<Radical>{k}</Radical>)<sup>2</sup> = 6 · {k} = {area} cm²</span>,
      },
    ],
    renderFeedbackDiagram: () => (
      <div className="mt-3 max-w-xs rounded-xl bg-white border border-slate-200 p-2.5">
        <svg viewBox="0 0 260 130" className="w-full h-auto max-w-full block">
          <rect x="35" y="20" width="170" height="80" fill="#eef2ff" stroke="#4f46e5" strokeWidth="2.2" />
          <text x="95" y="65" fontSize="13" fontWeight="800" fill="#312e81">Ε = {area} cm²</text>
          <text x="95" y="116" fontSize="12" fontWeight="700" fill="#0f172a">3√{k} cm</text>
          <text x="210" y="65" fontSize="12" fontWeight="700" fill="#0f172a">2√{k}</text>
        </svg>
      </div>
    ),
  };
}

// ΠΡΟΒΛΗΜΑ 5 (ΚΕΦ. 5): Πλήθος ακεραίων ανάμεσα σε δύο άρρητους αριθμούς
function genProb5(mode) {
  const configs = [
    { a: 3, b: 15, ints: [2, 3], count: 2 },
    { a: 5, b: 24, ints: [3, 4], count: 2 },
    { a: 2, b: 17, ints: [2, 3, 4], count: 3 },
    { a: 3, b: 26, ints: [2, 3, 4, 5], count: 4 },
    { a: 10, b: 35, ints: [4, 5], count: 2 },
    { a: 5, b: 37, ints: [3, 4, 5, 6], count: 4 },
    { a: 2, b: 10, ints: [2, 3], count: 2 },
    { a: 17, b: 48, ints: [5, 6], count: 2 },
    { a: 10, b: 50, ints: [4, 5, 6, 7], count: 4 },
    { a: 26, b: 63, ints: [6, 7], count: 2 },
  ];
  const c = configs[mode % 10];
  return {
    sig: `prob5_m${mode}_${c.a}_${c.b}`,
    type: 'input',
    unitEl: '(ακέραιοι)',
    unitEn: '(integers)',
    promptEl: (
      <span>
        Πόσοι ακέραιοι αριθμοί βρίσκονται ανάμεσα στους άρρητους <Radical>{c.a}</Radical> και <Radical>{c.b}</Radical>;
      </span>
    ),
    promptEn: (
      <span>
        How many integers lie between the irrational numbers <Radical>{c.a}</Radical> and <Radical>{c.b}</Radical>?
      </span>
    ),
    correct: String(c.count),
    correctTextEl: `${c.count} (${c.ints.join(', ')})`,
    correctTextEn: `${c.count} (${c.ints.join(', ')})`,
    explanationEl: <span>Οι ακέραιοι x που ικανοποιούν <Radical>{c.a}</Radical> &lt; x &lt; <Radical>{c.b}</Radical> έχουν τετράγωνα x<sup>2</sup> ανάμεσα στο {c.a} και στο {c.b}.</span>,
    explanationEn: <span>Integers x between <Radical>{c.a}</Radical> and <Radical>{c.b}</Radical> have squares x<sup>2</sup> between {c.a} and {c.b}.</span>,
    tableData: [
      {
        stepEl: '1. Υψώνουμε στο τετράγωνο',
        stepEn: '1. Square the bounds',
        calc: <span>Αναζητούμε ακέραιους x &gt; 0 με {c.a} &lt; x<sup>2</sup> &lt; {c.b}.</span>,
      },
      {
        stepEl: '2. Εύρεση τετραγώνων',
        stepEn: '2. Find square numbers',
        calc: <span>Οι ακέραιοι είναι: {c.ints.join(', ')} (πλήθος: {c.count}).</span>,
      },
    ],
  };
}

// ΠΡΟΒΛΗΜΑ 6 (ΚΕΦ. 6): Τετράγωνος κήπος & τοποθέτηση πλευράς στην ευθεία ℝ
function genProb6(mode) {
  const configs = [
    { area: 8, coef: 2, rad: 2, low: 2, high: 3 },
    { area: 12, coef: 2, rad: 3, low: 3, high: 4 },
    { area: 18, coef: 3, rad: 2, low: 4, high: 5 },
    { area: 20, coef: 2, rad: 5, low: 4, high: 5 },
    { area: 27, coef: 3, rad: 3, low: 5, high: 6 },
    { area: 32, coef: 4, rad: 2, low: 5, high: 6 },
    { area: 45, coef: 3, rad: 5, low: 6, high: 7 },
    { area: 48, coef: 4, rad: 3, low: 6, high: 7 },
    { area: 50, coef: 5, rad: 2, low: 7, high: 8 },
    { area: 72, coef: 6, rad: 2, low: 8, high: 9 },
  ];
  const c = configs[mode % 10];
  const correctOpt = {
    key: `${c.coef}sqrt${c.rad}`,
    sig: `${c.coef}√${c.rad}`,
    labelEl: <span>{c.coef}<Radical>{c.rad}</Radical> m</span>,
    labelEn: <span>{c.coef}<Radical>{c.rad}</Radical> m</span>,
  };
  return {
    sig: `prob6_m${mode}_${c.area}`,
    type: 'mcq',
    promptEl: (
      <span>
        Ένας τετράγωνος χώρος έχει εμβαδόν <span className="font-extrabold">{c.area} m²</span>. Ποιο είναι το ακριβές μήκος της πλευράς του σε απλοποιημένη μορφή;
      </span>
    ),
    promptEn: (
      <span>
        A square plot has an area of <span className="font-extrabold">{c.area} m²</span>. What is the exact simplified length of its side?
      </span>
    ),
    options: ensureFourUniqueOptions(correctOpt, [
      { key: `${c.rad}sqrt${c.coef}`, sig: `${c.rad}√${c.coef}`, labelEl: <span>{c.rad}<Radical>{c.coef}</Radical> m</span>, labelEn: <span>{c.rad}<Radical>{c.coef}</Radical> m</span> },
      { key: `${c.area / 2}`, sig: `${c.area / 2}`, labelEl: `${c.area / 2} m`, labelEn: `${c.area / 2} m` },
      { key: `${c.low}`, sig: `${c.low}`, labelEl: `${c.low} m`, labelEn: `${c.low} m` },
      { key: `${c.coef * c.coef}sqrt${c.rad}`, sig: `${c.coef * c.coef}√${c.rad}`, labelEl: <span>{c.coef * c.coef}<Radical>{c.rad}</Radical> m</span>, labelEn: <span>{c.coef * c.coef}<Radical>{c.rad}</Radical> m</span> },
    ]),
    correct: correctOpt.key,
    correctTextEl: <span>{c.coef}<Radical>{c.rad}</Radical> m</span>,
    correctTextEn: <span>{c.coef}<Radical>{c.rad}</Radical> m</span>,
    explanationEl: <span>Η πλευρά είναι α = <Radical>{c.area}</Radical> = {c.coef}<Radical>{c.rad}</Radical> m και βρίσκεται στην ευθεία ℝ ανάμεσα στο {c.low} και στο {c.high}.</span>,
    explanationEn: <span>The side is α = <Radical>{c.area}</Radical> = {c.coef}<Radical>{c.rad}</Radical> m, lying between {c.low} and {c.high}.</span>,
    tableData: [
      {
        stepEl: '1. Εύρεση πλευράς',
        stepEn: '1. Find side length',
        calc: <span>Ε = α<sup>2</sup> = {c.area} ⇒ α = <Radical>{c.area}</Radical> = <Radical>{c.coef * c.coef} · {c.rad}</Radical> = {c.coef}<Radical>{c.rad}</Radical> m</span>,
      },
      {
        stepEl: '2. Θέση στην ευθεία ℝ',
        stepEn: '2. Position on ℝ',
        calc: <span>{c.low * c.low} &lt; {c.area} &lt; {c.high * c.high} ⇒ {c.low} &lt; <Radical>{c.area}</Radical> &lt; {c.high}</span>,
      },
    ],
    renderFeedbackDiagram: () => (
      <div className="mt-3 max-w-sm rounded-xl bg-white border border-slate-200 p-2.5">
        <svg viewBox="0 0 300 110" className="w-full h-auto max-w-full block">
          <line x1="25" y1="70" x2="275" y2="70" stroke="#334155" strokeWidth="2.2" />
          <polygon points="275,70 266,65 266,75" fill="#334155" />
          <circle cx="75" cy="70" r="4" fill="#0f172a" />
          <text x="65" y="92" fontSize="12" fontWeight="700" fill="#0f172a">{c.low} (√{c.low * c.low})</text>
          <circle cx="225" cy="70" r="4" fill="#0f172a" />
          <text x="210" y="92" fontSize="12" fontWeight="700" fill="#0f172a">{c.high} (√{c.high * c.high})</text>
          <circle cx="145" cy="70" r="5.5" fill="#dc2626" />
          <text x="122" y="50" fontSize="13" fontWeight="900" fill="#dc2626">√{c.area} = {c.coef}√{c.rad}</text>
        </svg>
      </div>
    ),
  };
}

// --- Συγκρότηση Πλήρους Επαναληπτικού Τεστ (18 Ερωτήσεις χωρίς καμία επανάληψη) ---
function generateReviewTest() {
  const usedSignatures = new Set();

  const pickUniqueFromPool = (generatorFn) => {
    const modes = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (const m of modes) {
      const candidate = generatorFn(m);
      if (!usedSignatures.has(candidate.sig)) {
        usedSignatures.add(candidate.sig);
        return candidate;
      }
    }
    for (let attempt = 0; attempt < 25; attempt++) {
      const candidate = generatorFn(randInt(0, 9));
      if (!usedSignatures.has(candidate.sig)) {
        usedSignatures.add(candidate.sig);
        return candidate;
      }
    }
    return generatorFn(randInt(0, 9));
  };

  const specs = [
    { ch: 1, exNum: 1, isProblem: false, gen: genCh1Ex1 },
    { ch: 1, exNum: 2, isProblem: false, gen: genCh1Ex2 },
    { ch: 2, exNum: 1, isProblem: false, gen: genCh2Ex1 },
    { ch: 2, exNum: 2, isProblem: false, gen: genCh2Ex2 },
    { ch: 3, exNum: 1, isProblem: false, gen: genCh3Ex1 },
    { ch: 3, exNum: 2, isProblem: false, gen: genCh3Ex2 },
    { ch: 4, exNum: 1, isProblem: false, gen: genCh4Ex1 },
    { ch: 4, exNum: 2, isProblem: false, gen: genCh4Ex2 },
    { ch: 5, exNum: 1, isProblem: false, gen: genCh5Ex1 },
    { ch: 5, exNum: 2, isProblem: false, gen: genCh5Ex2 },
    { ch: 6, exNum: 1, isProblem: false, gen: genCh6Ex1 },
    { ch: 6, exNum: 2, isProblem: false, gen: genCh6Ex2 },
    { ch: 1, probNum: 1, isProblem: true, gen: genProb1 },
    { ch: 2, probNum: 2, isProblem: true, gen: genProb2 },
    { ch: 3, probNum: 3, isProblem: true, gen: genProb3 },
    { ch: 4, probNum: 4, isProblem: true, gen: genProb4 },
    { ch: 5, probNum: 5, isProblem: true, gen: genProb5 },
    { ch: 6, probNum: 6, isProblem: true, gen: genProb6 },
  ];

  return specs.map((spec, index) => {
    const q = pickUniqueFromPool(spec.gen);
    return {
      ...q,
      id: index + 1,
      chapter: spec.ch,
      isProblem: spec.isProblem,
      badgeEl: spec.isProblem
        ? `ΠΡΟΒΛΗΜΑ ${spec.probNum} • ΚΕΦ. ${spec.ch} • ΥΨΗΛΗ ΔΥΣΚΟΛΙΑ`
        : `ΚΕΦ. ${spec.ch} • ΑΣΚΗΣΗ ${spec.exNum}`,
      badgeEn: spec.isProblem
        ? `PROBLEM ${spec.probNum} • CH. ${spec.ch} • HIGH DIFFICULTY`
        : `CH. ${spec.ch} • EXERCISE ${spec.exNum}`,
    };
  });
}

export default function Epanalipsi1Page() {
  const router = useRouter();
  const isEn = router?.locale === 'en';

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const initTest = useCallback(() => {
    setQuestions(generateReviewTest());
    setAnswers({});
    setSubmitted(false);
  }, []);

  useEffect(() => {
    initTest();
  }, [initTest]);

  const handleSelect = (qId, val) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleReset = () => {
    initTest();
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
      return sanitizeInput(userVal) === sanitizeInput(q.correct);
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
    ? 'Review Test 1 (Chapters 1–6) | 8th Grade Algebra'
    : "Επαναληπτικό Τεστ 1 (Κεφάλαια 1–6) | Β' Γυμνασίου";

  const actionButton = (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleReset}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-sm transition-colors"
      >
        <span aria-hidden="true">🔄</span>
        <span>{toCleanUppercase(isEn ? 'NEW TEST' : 'ΝΕΟ ΤΕΣΤ')}</span>
      </button>
      <Link
        href="/b-gymnasiou"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-colors"
      >
        <span aria-hidden="true">🔙</span>
        <span>{isEn ? '8th Grade' : "Β' Γυμνασίου"}</span>
      </Link>
    </div>
  );

  return (
    <Layout
      title={pageTitle}
      actionButton={actionButton}
      backUrl="/b-gymnasiou"
      backLabel={isEn ? '8th Grade' : "Β' Γυμνασίου"}
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] 8k:max-w-[5120px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 8k:px-32 py-4 sm:py-6 pb-28 sm:pb-36 overflow-x-hidden text-slate-800 box-border">
        {/* Hero Header */}
        <header className="rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 text-white p-6 sm:p-8 lg:p-10 shadow-xl mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 text-indigo-100 text-xs sm:text-sm font-extrabold tracking-wider mb-3">
              <span>
                {toCleanUppercase(
                  isEn
                    ? 'REVIEW TEST 1 • CHAPTERS 1–6 • 8TH GRADE'
                    : "ΕΠΑΝΑΛΗΠΤΙΚΟ ΤΕΣΤ 1 • ΚΕΦΑΛΑΙΑ 1–6 • Β' ΓΥΜΝΑΣΙΟΥ"
                )}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
              {isEn
                ? 'Comprehensive Review: Powers, Scientific Notation, Square Roots & Real Numbers'
                : 'Επαναληπτικό Σετ: Δυνάμεις, Τυποποιημένη Μορφή, Ρίζες & Πραγματικοί Αριθμοί'}
            </h1>
            <p className="text-indigo-200 text-sm sm:text-base leading-relaxed">
              {isEn
                ? '12 targeted exercises (2 per chapter) + 6 challenging applied problems (1 per chapter) with dynamic numbers.'
                : '12 στοχευμένες ασκήσεις (2 από κάθε κεφάλαιο) + 6 συνδυαστικά προβλήματα αυξημένης δυσκολίας (1 από κάθε κεφάλαιο) με δυναμικούς αριθμούς.'}
            </p>
          </div>

          <div className="shrink-0">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg transition-all"
            >
              {toCleanUppercase(isEn ? 'GENERATE NEW QUESTIONS' : 'ΝΕΕΣ ΑΣΚΗΣΕΙΣ')}
            </button>
          </div>
        </header>

        {/* Ενότητα 1: 12 Ασκήσεις (2 ανά κεφάλαιο) */}
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-lg sm:text-2xl font-black text-slate-900">
            {toCleanUppercase(
              isEn
                ? 'PART A: EXERCISES BY CHAPTER (1–12)'
                : 'ΜΕΡΟΣ Α: ΕΠΑΝΑΛΗΠΤΙΚΕΣ ΑΣΚΗΣΕΙΣ ΑΝΑ ΚΕΦΑΛΑΙΟ (1–12)'
            )}
          </h2>
        </div>

        <div className="space-y-6 mb-12">
          {questions.map((q, idx) => {
            const userVal = answers[q.id] ?? '';
            const correct = submitted && isQuestionCorrect(q);
            const showPartBHeader = idx === 12;

            return (
              <React.Fragment key={q.id}>
                {showPartBHeader && (
                  <div className="pt-6 pb-2 border-t-2 border-slate-200">
                    <h2 className="text-lg sm:text-2xl font-black text-purple-950">
                      {toCleanUppercase(
                        isEn
                          ? 'PART B: CHALLENGING COMBINED PROBLEMS (13–18)'
                          : 'ΜΕΡΟΣ Β: ΣΥΝΔΥΑΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ ΕΦΑΡΜΟΓΗΣ (13–18)'
                      )}
                    </h2>
                  </div>
                )}

                <article
                  className={`rounded-3xl bg-white border-2 p-5 sm:p-7 shadow-sm transition-colors ${
                    submitted
                      ? correct
                        ? 'border-emerald-400 bg-emerald-50/20'
                        : 'border-rose-300 bg-rose-50/20'
                      : q.isProblem
                      ? 'border-purple-200 bg-purple-50/10'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-slate-900 text-white text-xs font-black flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold ${
                          q.isProblem
                            ? 'bg-purple-100 text-purple-900'
                            : 'bg-indigo-50 text-indigo-800'
                        }`}
                      >
                        {toCleanUppercase(isEn ? q.badgeEn : q.badgeEl)}
                      </span>
                    </div>

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

                  {/* Τύπος MCQ (4 αυστηρά μοναδικές επιλογές) */}
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
                                  <td className="px-3 sm:px-4 py-2.5">
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
              </React.Fragment>
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
