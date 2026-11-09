import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Βοηθητική συνάρτηση για άτονα κεφαλαία (διατηρεί μόνο το Γ')
function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Γ')/g);
  return parts
    .map((part) => {
      if (part === "Γ'") return "Γ'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

// Επαναχρησιμοποιήσιμο Component Τετραγωνικής Ρίζας (Inline SVG + Vinculum) - Responsive & Overflow Safe
function Radical({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center align-middle font-mono shrink-0 mx-0.5 ${className}`}>
      <svg
        viewBox="0 0 12 24"
        className="w-[0.52em] h-[1.12em] shrink-0 text-current overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M1 13 L3.5 13 L6.5 21 L12 2" />
      </svg>
      <span className="border-t-[1.8px] border-current pl-0.5 pr-1 py-0 leading-none text-[0.95em]">
        {children}
      </span>
    </span>
  );
}

// Επαναχρησιμοποιήσιμο Component Κλάσματος (Fraction) - Responsive & No-Horizontal-Scroll Safe
function Frac({ num, den, className = "" }) {
  return (
    <span
      className={`inline-flex flex-col text-center align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full ${className}`}
    >
      <span className="border-b border-current px-0.5 sm:px-1 pb-0.5 break-all">
        {num}
      </span>
      <span className="pt-0.5 break-all">
        {den}
      </span>
    </span>
  );
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function ensureFourUniqueOptions(correct, distractorsGen) {
  const set = new Set([String(correct).trim()]);
  let attempts = 0;
  while (set.size < 4 && attempts < 60) {
    attempts++;
    const cand = distractorsGen();
    if (cand !== undefined && cand !== null && cand !== '') {
      set.add(String(cand).trim());
    }
  }
  let fallbackCount = 1;
  while (set.size < 4) {
    set.add(`${correct} (${fallbackCount++})`);
  }
  return shuffle(Array.from(set));
}

// ==================== ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q9 - Q12) ====================

// POOL Q9: Σύγκριση ρητού με άρρητο μέσω τετραγώνων (6 σενάρια με i18n)
const PROBLEM_POOL_Q9 = [
  (locale) => {
    const isEl = locale === 'el';
    const dec = isEl ? ',' : '.';
    const notComp = isEl ? 'Δεν συγκρίνονται' : 'Not comparable';
    return {
      title: isEl ? 'Σύγκριση Ρίζας 7 με Ρητό' : 'Comparing Root 7 with Rational',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Ποια είναι η σωστή σχέση διάταξης ανάμεσα στον άρρητο' : 'What is the correct ordering relation between the irrational'}</span>
          <Radical>7</Radical>
          <span>{isEl ? `και τον ρητό αριθμό 2${dec}6;` : `and the rational number 2${dec}6?`}</span>
        </span>
      ),
      correct: `√7 ＞ 2${dec}6`,
      type: 'mcq',
      distractors: () => [`√7 ＜ 2${dec}6`, `√7 ＝ 2${dec}6`, notComp][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === `√7 ＞ 2${dec}6`) return <span className="inline-flex items-center whitespace-nowrap"><Radical>7</Radical> ＞ 2{dec}6</span>;
        if (opt === `√7 ＜ 2${dec}6`) return <span className="inline-flex items-center whitespace-nowrap"><Radical>7</Radical> ＜ 2{dec}6</span>;
        if (opt === `√7 ＝ 2${dec}6`) return <span className="inline-flex items-center whitespace-nowrap"><Radical>7</Radical> ＝ 2{dec}6</span>;
        return opt;
      },
      tableData: isEl ? [
        { label: 'Τετράγωνο της ρίζας', details: '7' },
        { label: 'Τετράγωνο του 2,6', details: '2,6² ＝ 6,76' },
        { label: 'Σύγκριση', details: '7 ＞ 6,76' }
      ] : [
        { label: 'Square of root', details: '7' },
        { label: 'Square of 2.6', details: '2.6² ＝ 6.76' },
        { label: 'Comparison', details: '7 ＞ 6.76' }
      ],
      explanation: isEl ? (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>Υψώνουμε στο τετράγωνο:</span>
          <span className="inline-flex items-center whitespace-nowrap">(<Radical>7</Radical>)² ＝ 7</span>
          <span>και 2,6² ＝ 6,76. Επειδή 7 ＞ 6,76, ισχύει</span>
          <span className="inline-flex items-center whitespace-nowrap"><Radical>7</Radical> ＞ 2,6.</span>
        </span>
      ) : (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>Squaring both sides:</span>
          <span className="inline-flex items-center whitespace-nowrap">(<Radical>7</Radical>)² ＝ 7</span>
          <span>and 2.6² ＝ 6.76. Since 7 ＞ 6.76, we have</span>
          <span className="inline-flex items-center whitespace-nowrap"><Radical>7</Radical> ＞ 2.6.</span>
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    const dec = isEl ? ',' : '.';
    const notComp = isEl ? 'Δεν συγκρίνονται' : 'Not comparable';
    return {
      title: isEl ? 'Σύγκριση Ρίζας 10 με Ρητό' : 'Comparing Root 10 with Rational',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Ποια είναι η σωστή σχέση διάταξης ανάμεσα στον άρρητο' : 'What is the correct ordering relation between the irrational'}</span>
          <Radical>10</Radical>
          <span>{isEl ? `και τον ρητό αριθμό 3${dec}2;` : `and the rational number 3${dec}2?`}</span>
        </span>
      ),
      correct: `√10 ＜ 3${dec}2`,
      type: 'mcq',
      distractors: () => [`√10 ＞ 3${dec}2`, `√10 ＝ 3${dec}2`, notComp][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === `√10 ＜ 3${dec}2`) return <span className="inline-flex items-center whitespace-nowrap"><Radical>10</Radical> ＜ 3{dec}2</span>;
        if (opt === `√10 ＞ 3${dec}2`) return <span className="inline-flex items-center whitespace-nowrap"><Radical>10</Radical> ＞ 3{dec}2</span>;
        if (opt === `√10 ＝ 3${dec}2`) return <span className="inline-flex items-center whitespace-nowrap"><Radical>10</Radical> ＝ 3{dec}2</span>;
        return opt;
      },
      tableData: isEl ? [
        { label: 'Τετράγωνο της ρίζας', details: '10' },
        { label: 'Τετράγωνο του 3,2', details: '3,2² ＝ 10,24' },
        { label: 'Σύγκριση', details: '10 ＜ 10,24' }
      ] : [
        { label: 'Square of root', details: '10' },
        { label: 'Square of 3.2', details: '3.2² ＝ 10.24' },
        { label: 'Comparison', details: '10 ＜ 10.24' }
      ],
      explanation: isEl ? (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span className="inline-flex items-center whitespace-nowrap">(<Radical>10</Radical>)² ＝ 10</span>
          <span>και 3,2² ＝ 10,24. Επειδή 10 ＜ 10,24, ισχύει</span>
          <span className="inline-flex items-center whitespace-nowrap"><Radical>10</Radical> ＜ 3,2.</span>
        </span>
      ) : (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span className="inline-flex items-center whitespace-nowrap">(<Radical>10</Radical>)² ＝ 10</span>
          <span>and 3.2² ＝ 10.24. Since 10 ＜ 10.24, we have</span>
          <span className="inline-flex items-center whitespace-nowrap"><Radical>10</Radical> ＜ 3.2.</span>
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    const dec = isEl ? ',' : '.';
    const notComp = isEl ? 'Δεν συγκρίνονται' : 'Not comparable';
    return {
      title: isEl ? 'Σύγκριση Ρίζας 3 με Ρητό' : 'Comparing Root 3 with Rational',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Ποια είναι η σωστή σχέση διάταξης ανάμεσα στον άρρητο' : 'What is the correct ordering relation between the irrational'}</span>
          <Radical>3</Radical>
          <span>{isEl ? `και τον ρητό αριθμό 1${dec}7;` : `and the rational number 1${dec}7?`}</span>
        </span>
      ),
      correct: `√3 ＞ 1${dec}7`,
      type: 'mcq',
      distractors: () => [`√3 ＜ 1${dec}7`, `√3 ＝ 1${dec}7`, notComp][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === `√3 ＞ 1${dec}7`) return <span className="inline-flex items-center whitespace-nowrap"><Radical>3</Radical> ＞ 1{dec}7</span>;
        if (opt === `√3 ＜ 1${dec}7`) return <span className="inline-flex items-center whitespace-nowrap"><Radical>3</Radical> ＜ 1{dec}7</span>;
        if (opt === `√3 ＝ 1${dec}7`) return <span className="inline-flex items-center whitespace-nowrap"><Radical>3</Radical> ＝ 1{dec}7</span>;
        return opt;
      },
      tableData: isEl ? [
        { label: 'Τετράγωνο της ρίζας', details: '3' },
        { label: 'Τετράγωνο του 1,7', details: '1,7² ＝ 2,89' },
        { label: 'Σύγκριση', details: '3 ＞ 2,89' }
      ] : [
        { label: 'Square of root', details: '3' },
        { label: 'Square of 1.7', details: '1.7² ＝ 2.89' },
        { label: 'Comparison', details: '3 ＞ 2.89' }
      ],
      explanation: isEl ? (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span className="inline-flex items-center whitespace-nowrap">(<Radical>3</Radical>)² ＝ 3</span>
          <span>και 1,7² ＝ 2,89. Επειδή 3 ＞ 2,89, ισχύει</span>
          <span className="inline-flex items-center whitespace-nowrap"><Radical>3</Radical> ＞ 1,7.</span>
        </span>
      ) : (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span className="inline-flex items-center whitespace-nowrap">(<Radical>3</Radical>)² ＝ 3</span>
          <span>and 1.7² ＝ 2.89. Since 3 ＞ 2.89, we have</span>
          <span className="inline-flex items-center whitespace-nowrap"><Radical>3</Radical> ＞ 1.7.</span>
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    const dec = isEl ? ',' : '.';
    const notComp = isEl ? 'Δεν συγκρίνονται' : 'Not comparable';
    return {
      title: isEl ? 'Σύγκριση Ρίζας 5 με Ρητό' : 'Comparing Root 5 with Rational',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Ποια είναι η σωστή σχέση διάταξης ανάμεσα στον άρρητο' : 'What is the correct ordering relation between the irrational'}</span>
          <Radical>5</Radical>
          <span>{isEl ? `και τον ρητό αριθμό 2${dec}3;` : `and the rational number 2${dec}3?`}</span>
        </span>
      ),
      correct: `√5 ＜ 2${dec}3`,
      type: 'mcq',
      distractors: () => [`√5 ＞ 2${dec}3`, `√5 ＝ 2${dec}3`, notComp][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === `√5 ＜ 2${dec}3`) return <span className="inline-flex items-center whitespace-nowrap"><Radical>5</Radical> ＜ 2{dec}3</span>;
        if (opt === `√5 ＞ 2${dec}3`) return <span className="inline-flex items-center whitespace-nowrap"><Radical>5</Radical> ＞ 2{dec}3</span>;
        if (opt === `√5 ＝ 2${dec}3`) return <span className="inline-flex items-center whitespace-nowrap"><Radical>5</Radical> ＝ 2{dec}3</span>;
        return opt;
      },
      tableData: isEl ? [
        { label: 'Τετράγωνο της ρίζας', details: '5' },
        { label: 'Τετράγωνο του 2,3', details: '2,3² ＝ 5,29' },
        { label: 'Σύγκριση', details: '5 ＜ 5,29' }
      ] : [
        { label: 'Square of root', details: '5' },
        { label: 'Square of 2.3', details: '2.3² ＝ 5.29' },
        { label: 'Comparison', details: '5 ＜ 5.29' }
      ],
      explanation: isEl ? (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span className="inline-flex items-center whitespace-nowrap">(<Radical>5</Radical>)² ＝ 5</span>
          <span>και 2,3² ＝ 5,29. Επειδή 5 ＜ 5,29, ισχύει</span>
          <span className="inline-flex items-center whitespace-nowrap"><Radical>5</Radical> ＜ 2,3.</span>
        </span>
      ) : (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span className="inline-flex items-center whitespace-nowrap">(<Radical>5</Radical>)² ＝ 5</span>
          <span>and 2.3² ＝ 5.29. Since 5 ＜ 5.29, we have</span>
          <span className="inline-flex items-center whitespace-nowrap"><Radical>5</Radical> ＜ 2.3.</span>
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    const dec = isEl ? ',' : '.';
    const notComp = isEl ? 'Δεν συγκρίνονται' : 'Not comparable';
    return {
      title: isEl ? 'Σύγκριση Αρνητικών Αριθμών' : 'Comparing Negative Numbers',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Ποια είναι η σωστή σχέση ανάμεσα στους αρνητικούς αριθμούς' : 'What is the correct relation between the negative numbers'}</span>
          <span className="inline-flex items-center whitespace-nowrap">－<Radical>2</Radical></span>
          <span>{isEl ? `και －1${dec}5;` : `and －1${dec}5?`}</span>
        </span>
      ),
      correct: `－√2 ＞ －1${dec}5`,
      type: 'mcq',
      distractors: () => [`－√2 ＜ －1${dec}5`, `－√2 ＝ －1${dec}5`, notComp][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === `－√2 ＞ －1${dec}5`) return <span className="inline-flex items-center whitespace-nowrap">－<Radical>2</Radical> ＞ －1{dec}5</span>;
        if (opt === `－√2 ＜ －1${dec}5`) return <span className="inline-flex items-center whitespace-nowrap">－<Radical>2</Radical> ＜ －1{dec}5</span>;
        if (opt === `－√2 ＝ －1${dec}5`) return <span className="inline-flex items-center whitespace-nowrap">－<Radical>2</Radical> ＝ －1{dec}5</span>;
        return opt;
      },
      tableData: isEl ? [
        {
          label: 'Θετικές τιμές',
          details: (
            <span className="inline-flex items-center whitespace-nowrap">
              <Radical>2</Radical>
              <span>≈ 1,414 ＜ 1,5</span>
            </span>
          )
        },
        { label: 'Κανόνας αρνητικών', details: 'Αν α ＜ β τότε －α ＞ －β' },
        {
          label: 'Σύγκριση',
          details: (
            <span className="inline-flex items-center whitespace-nowrap">
              <span>－</span>
              <Radical>2</Radical>
              <span>＞ －1,5</span>
            </span>
          )
        }
      ] : [
        {
          label: 'Positive values',
          details: (
            <span className="inline-flex items-center whitespace-nowrap">
              <Radical>2</Radical>
              <span>≈ 1.414 ＜ 1.5</span>
            </span>
          )
        },
        { label: 'Negative rule', details: 'If a ＜ b then －a ＞ －b' },
        {
          label: 'Comparison',
          details: (
            <span className="inline-flex items-center whitespace-nowrap">
              <span>－</span>
              <Radical>2</Radical>
              <span>＞ －1.5</span>
            </span>
          )
        }
      ],
      explanation: isEl ? (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>Επειδή</span>
          <span className="inline-flex items-center whitespace-nowrap"><Radical>2</Radical> ≈ 1,414 ＜ 1,5</span>,
          <span>αλλάζοντας πρόσημο η φορά της ανισότητας αντιστρέφεται:</span>
          <span className="inline-flex items-center whitespace-nowrap">－<Radical>2</Radical> ＞ －1,5.</span>
        </span>
      ) : (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>Since</span>
          <span className="inline-flex items-center whitespace-nowrap"><Radical>2</Radical> ≈ 1.414 ＜ 1.5</span>,
          <span>inverting the sign reverses the inequality:</span>
          <span className="inline-flex items-center whitespace-nowrap">－<Radical>2</Radical> ＞ －1.5.</span>
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    const notComp = isEl ? 'Δεν συγκρίνονται' : 'Not comparable';
    return {
      title: isEl ? 'Σύγκριση π και 22/7' : 'Comparing π and 22/7',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Ποια είναι η σωστή σχέση ανάμεσα στον αριθμό' : 'What is the correct relation between the number'}</span>
          <span className="font-serif italic text-[1.05em]">π</span>
          <span>{isEl ? 'και την κλασματική προσέγγιση του Αρχιμήδη' : 'and Archimedes\' fractional approximation'}</span>
          <Frac num="22" den="7" />
          <span>{isEl ? ';' : '?'}</span>
        </span>
      ),
      correct: 'π ＜ 22/7',
      type: 'mcq',
      distractors: () => ['π ＝ 22/7', 'π ＞ 22/7', notComp][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === 'π ＜ 22/7') {
          return (
            <span className="inline-flex items-center gap-1">
              <span className="font-serif italic text-[1.05em]">π</span>
              <span>＜</span>
              <Frac num="22" den="7" />
            </span>
          );
        }
        if (opt === 'π ＝ 22/7') {
          return (
            <span className="inline-flex items-center gap-1">
              <span className="font-serif italic text-[1.05em]">π</span>
              <span>＝</span>
              <Frac num="22" den="7" />
            </span>
          );
        }
        if (opt === 'π ＞ 22/7') {
          return (
            <span className="inline-flex items-center gap-1">
              <span className="font-serif italic text-[1.05em]">π</span>
              <span>＞</span>
              <Frac num="22" den="7" />
            </span>
          );
        }
        return opt;
      },
      tableData: isEl ? [
        {
          label: 'Αριθμός π',
          details: (
            <span className="inline-flex items-center gap-1">
              <span className="font-serif italic text-[1.05em]">π</span>
              <span>≈ 3,14159...</span>
            </span>
          )
        },
        {
          label: 'Κλάσμα 22/7',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="22" den="7" />
              <span>≈ 3,14285...</span>
            </span>
          )
        },
        { label: 'Σύγκριση', details: '3,14159... ＜ 3,14285...' }
      ] : [
        {
          label: 'Number π',
          details: (
            <span className="inline-flex items-center gap-1">
              <span className="font-serif italic text-[1.05em]">π</span>
              <span>≈ 3.14159...</span>
            </span>
          )
        },
        {
          label: 'Fraction 22/7',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="22" den="7" />
              <span>≈ 3.14285...</span>
            </span>
          )
        },
        { label: 'Comparison', details: '3.14159... ＜ 3.14285...' }
      ],
      explanation: isEl ? (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>Ο αριθμός</span>
          <span className="font-serif italic text-[1.05em]">π</span>
          <span>ισούται με 3,14159... ενώ το κλάσμα</span>
          <Frac num="22" den="7" />
          <span>ισούται με 3,14285... Επομένως</span>
          <span className="font-serif italic text-[1.05em]">π</span>
          <span>＜</span>
          <Frac num="22" den="7" />.
        </span>
      ) : (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>The number</span>
          <span className="font-serif italic text-[1.05em]">π</span>
          <span>equals 3.14159... while the fraction</span>
          <Frac num="22" den="7" />
          <span>equals 3.14285... Hence</span>
          <span className="font-serif italic text-[1.05em]">π</span>
          <span>＜</span>
          <Frac num="22" den="7" />.
        </span>
      )
    };
  }
];

// POOL Q10: Ταξινόμηση σε αριθμητικά σύνολα (6 σενάρια με i18n)
const PROBLEM_POOL_Q10 = [
  (locale) => {
    const isEl = locale === 'el';
    const correctStr = isEl ? 'ℕ (Φυσικοί αριθμοί)' : 'ℕ (Natural numbers)';
    return {
      title: isEl ? 'Σύνολο Αριθμού 36' : 'Set of Root 36',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Σε ποιο από τα παρακάτω σύνολα ανήκει ο αριθμός' : 'Which set does the number'}</span>
          <Radical>36</Radical>
          <span>{isEl ? 'ανήκει;' : 'belong to?'}</span>
        </span>
      ),
      correct: correctStr,
      type: 'mcq',
      distractors: () => isEl ? [
        'Μόνο στους Άρρητους',
        'Μόνο στους Αρνητικούς',
        'Σε κανένα σύνολο'
      ][randInt(0, 2)] : [
        'Only in Irrationals',
        'Only in Negatives',
        'In no set'
      ][randInt(0, 2)],
      tableData: isEl ? [
        { label: 'Υπολογισμός', details: '6' },
        { label: 'Σύνολο', details: 'Το 6 ανήκει στο ℕ' }
      ] : [
        { label: 'Calculation', details: '6' },
        { label: 'Set', details: '6 belongs to ℕ' }
      ],
      explanation: isEl ? (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>Επειδή 6² ＝ 36, ισχύει</span>
          <span className="inline-flex items-center whitespace-nowrap"><Radical>36</Radical> ＝ 6</span>,
          <span>που είναι φυσικός αριθμός.</span>
        </span>
      ) : (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>Since 6² ＝ 36,</span>
          <span className="inline-flex items-center whitespace-nowrap"><Radical>36</Radical> ＝ 6</span>,
          <span>which is a natural number.</span>
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    const correctStr = isEl ? 'ℤ (Ακέραιοι αριθμοί)' : 'ℤ (Integers)';
    return {
      title: isEl ? 'Σύνολο Κλάσματος' : 'Set of Fraction',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Ποιο είναι το μικρότερο αριθμητικό σύνολο στο οποίο ανήκει ο αριθμός' : 'What is the smallest number set to which the number'}</span>
          <Frac num="－10" den="2" />
          <span>{isEl ? 'ανήκει;' : 'belongs?'}</span>
        </span>
      ),
      correct: correctStr,
      type: 'mcq',
      distractors: () => isEl ? [
        'ℕ (Φυσικοί αριθμοί)',
        'Άρρητοι αριθμοί',
        'Μόνο στο ℝ'
      ][randInt(0, 2)] : [
        'ℕ (Natural numbers)',
        'Irrational numbers',
        'Only in ℝ'
      ][randInt(0, 2)],
      tableData: isEl ? [
        { label: 'Υπολογισμός', details: '－5' },
        { label: 'Σύνολο', details: 'Το －5 ανήκει στο ℤ' }
      ] : [
        { label: 'Calculation', details: '－5' },
        { label: 'Set', details: '－5 belongs to ℤ' }
      ],
      explanation: isEl
        ? 'Το κλάσμα απλοποιείται σε －5, που είναι ακέραιος αριθμός.'
        : 'The fraction simplifies to －5, which is an integer.'
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    const correctStr = isEl ? 'ℚ (Ρητοί αριθμοί)' : 'ℚ (Rational numbers)';
    return {
      title: isEl ? 'Σύνολο Περιοδικού' : 'Set of Repeating Decimal',
      prompt: isEl ? 'Σε ποιο σύνολο ανήκει ο περιοδικός δεκαδικός αριθμός 0,777...;' : 'Which set does the repeating decimal 0.777... belong to?',
      correct: correctStr,
      type: 'mcq',
      distractors: () => isEl ? [
        'Άρρητοι αριθμοί',
        'ℤ (Ακέραιοι αριθμοί)',
        'ℕ (Φυσικοί αριθμοί)'
      ][randInt(0, 2)] : [
        'Irrational numbers',
        'ℤ (Integers)',
        'ℕ (Natural numbers)'
      ][randInt(0, 2)],
      tableData: isEl ? [
        { label: 'Κλασματική μορφή', details: <Frac num="7" den="9" /> },
        { label: 'Σύνολο', details: 'Ανήκει στο ℚ' }
      ] : [
        { label: 'Fractional form', details: <Frac num="7" den="9" /> },
        { label: 'Set', details: 'Belongs to ℚ' }
      ],
      explanation: isEl ? (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>Κάθε περιοδικός δεκαδικός γράφεται ως κλάσμα</span>
          <span className="inline-flex items-center whitespace-nowrap">(0,777... ＝ <Frac num="7" den="9" />)</span>,
          <span>άρα είναι ρητός αριθμός.</span>
        </span>
      ) : (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>Every repeating decimal can be written as a fraction</span>
          <span className="inline-flex items-center whitespace-nowrap">(0.777... ＝ <Frac num="7" den="9" />)</span>,
          <span>so it is a rational number.</span>
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    const correctStr = isEl ? 'Των Άρρητων αριθμών' : 'The set of Irrational numbers';
    return {
      title: isEl ? 'Σύνολο Ρίζας 8' : 'Set of Root 8',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Ο αριθμός' : 'The number'}</span>
          <Radical>8</Radical>
          <span>{isEl ? 'ανήκει στο σύνολο:' : 'belongs to:'}</span>
        </span>
      ),
      correct: correctStr,
      type: 'mcq',
      distractors: () => isEl ? [
        'ℚ (Ρητοί αριθμοί)',
        'ℤ (Ακέραιοι αριθμοί)',
        'ℕ (Φυσικοί αριθμοί)'
      ][randInt(0, 2)] : [
        'ℚ (Rational numbers)',
        'ℤ (Integers)',
        'ℕ (Natural numbers)'
      ][randInt(0, 2)],
      tableData: isEl ? [
        { label: 'Έλεγχος τετραγώνου', details: 'Το 8 δεν είναι τέλειο τετράγωνο' },
        { label: 'Σύνολο', details: 'Άρρητος αριθμός' }
      ] : [
        { label: 'Square check', details: '8 is not a perfect square' },
        { label: 'Set', details: 'Irrational number' }
      ],
      explanation: isEl ? (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>Το 8 δεν είναι τέλειο τετράγωνο φυσικού αριθμού, άρα η τετραγωνική του ρίζα</span>
          <Radical>8</Radical>
          <span>είναι άρρητος αριθμός.</span>
        </span>
      ) : (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>8 is not a perfect square, so its square root</span>
          <Radical>8</Radical>
          <span>is an irrational number.</span>
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    const correctStr = isEl ? 'ℕ (Φυσικοί αριθμοί)' : 'ℕ (Natural numbers)';
    return {
      title: isEl ? 'Σύνολο του 0' : 'Set of 0',
      prompt: isEl ? 'Ποιο είναι το μικρότερο αριθμητικό σύνολο στο οποίο ανήκει ο αριθμός 0;' : 'What is the smallest number set that the number 0 belongs to?',
      correct: correctStr,
      type: 'mcq',
      distractors: () => isEl ? [
        'Μόνο στους Ακέραιους',
        'Μόνο στους Ρητούς',
        'Στους Άρρητους'
      ][randInt(0, 2)] : [
        'Only in Integers',
        'Only in Rationals',
        'In Irrationals'
      ][randInt(0, 2)],
      tableData: isEl ? [
        { label: 'Σύνολο ℕ', details: 'ℕ ＝ {0, 1, 2, 3, ...}' },
        { label: 'Συμπέρασμα', details: 'Το 0 ανήκει στους φυσικούς' }
      ] : [
        { label: 'Set ℕ', details: 'ℕ ＝ {0, 1, 2, 3, ...}' },
        { label: 'Conclusion', details: '0 belongs to natural numbers' }
      ],
      explanation: isEl
        ? 'Σύμφωνα με το σχολικό βιβλίο, το 0 είναι φυσικός αριθμός (0 ∈ ℕ).'
        : 'In the curriculum, 0 is considered a natural number (0 ∈ ℕ).'
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    const correctStr = isEl ? 'Των Άρρητων αριθμών (και στο ℝ)' : 'Irrational numbers (and in ℝ)';
    return {
      title: isEl ? 'Σύνολο του π' : 'Set of π',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Ο αριθμός' : 'The number'}</span>
          <span className="font-serif italic text-[1.05em]">π</span>
          <span>{isEl ? 'ανήκει στο σύνολο:' : 'belongs to the set:'}</span>
        </span>
      ),
      correct: correctStr,
      type: 'mcq',
      distractors: () => isEl ? [
        'ℚ (Ρητοί αριθμοί)',
        'ℤ (Ακέραιοι αριθμοί)',
        'ℕ (Φυσικοί αριθμοί)'
      ][randInt(0, 2)] : [
        'ℚ (Rational numbers)',
        'ℤ (Integers)',
        'ℕ (Natural numbers)'
      ][randInt(0, 2)],
      tableData: isEl ? [
        { label: 'Δεκαδική μορφή', details: '3,14159... (χωρίς περίοδο)' },
        { label: 'Σύνολο', details: 'Άρρητος' }
      ] : [
        { label: 'Decimal form', details: '3.14159... (non-repeating)' },
        { label: 'Set', details: 'Irrational' }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Ο αριθμός' : 'The number'}</span>
          <span className="font-serif italic text-[1.05em]">π</span>
          <span>{isEl ? 'έχει αποδειχθεί ότι είναι άρρητος αριθμός.' : 'has been proven to be an irrational number.'}</span>
        </span>
      )
    };
  }
];

// POOL Q11: Σχετική θέση στον άξονα & τετμημένη (6 σενάρια με i18n)
const PROBLEM_POOL_Q11 = [
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Απόσταση από το Μηδέν' : 'Distance from Origin',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Ποιος από τους παρακάτω αριθμούς βρίσκεται ΠΙΟ ΚΟΝΤΑ στο μηδέν (O) στον άξονα των πραγματικών αριθμών:' : 'Which of the following numbers is CLOSEST to zero (O) on the real number line:'}</span>
          <span className="inline-flex items-center whitespace-nowrap">－<Radical>2</Radical>,</span>
          <span>{isEl ? '1,5,' : '1.5,'}</span>
          <Frac num="1" den="2" />,
          <span>－2;</span>
        </span>
      ),
      correct: '1/2',
      type: 'mcq',
      distractors: () => ['－√2', isEl ? '1,5' : '1.5', '－2'][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === '1/2') return <Frac num="1" den="2" />;
        if (opt === '－√2') return <span className="inline-flex items-center whitespace-nowrap">－<Radical>2</Radical></span>;
        return opt;
      },
      tableData: isEl ? [
        {
          label: '|1/2|',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>|</span><Frac num="1" den="2" /><span>| ＝ 0,5</span>
            </span>
          )
        },
        {
          label: '|－√2|',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>|－</span><Radical>2</Radical><span>| ≈ 1,414</span>
            </span>
          )
        },
        { label: '|1,5|', details: '1,5' },
        { label: '|－2|', details: '2' }
      ] : [
        {
          label: '|1/2|',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>|</span><Frac num="1" den="2" /><span>| ＝ 0.5</span>
            </span>
          )
        },
        {
          label: '|－√2|',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>|－</span><Radical>2</Radical><span>| ≈ 1.414</span>
            </span>
          )
        },
        { label: '|1.5|', details: '1.5' },
        { label: '|－2|', details: '2' }
      ],
      explanation: isEl ? (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>Η απόσταση από το μηδέν ισούται με την απόλυτη τιμή. Η μικρότερη απόλυτη τιμή είναι του</span>
          <Frac num="1" den="2" />
          <span>(0,5).</span>
        </span>
      ) : (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>Distance from zero equals the absolute value. The smallest absolute value belongs to</span>
          <Frac num="1" den="2" />
          <span>(0.5).</span>
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Μέσο Διαστήματος στον Άξονα' : 'Midpoint on Real Axis',
      prompt: isEl
        ? 'Ποιο είναι το μέσο του διαστήματος ανάμεσα στους αριθμούς －3 και 5 στον άξονα των πραγματικών αριθμών;'
        : 'What is the midpoint between numbers －3 and 5 on the real number axis?',
      correct: 1,
      type: 'input',
      tableData: isEl ? [
        { label: 'Τύπος μέσου M', details: <Frac num="α ＋ β" den="2" /> },
        {
          label: 'Υπολογισμός',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="－3 ＋ 5" den="2" />
              <span>＝</span>
              <Frac num="2" den="2" />
              <span>＝ 1</span>
            </span>
          )
        }
      ] : [
        { label: 'Midpoint formula M', details: <Frac num="a ＋ b" den="2" /> },
        {
          label: 'Calculation',
          details: (
            <span className="inline-flex items-center gap-1">
              <Frac num="－3 ＋ 5" den="2" />
              <span>＝</span>
              <Frac num="2" den="2" />
              <span>＝ 1</span>
            </span>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Το μέσο ισούται με' : 'The midpoint equals'}</span>
          <Frac num="－3 ＋ 5" den="2" />
          <span>＝</span>
          <Frac num="2" den="2" />
          <span>＝ 1.</span>
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Απόσταση Δύο Σημείων στον Άξονα' : 'Distance between Two Points',
      prompt: isEl
        ? 'Πόση είναι η απόσταση ανάμεσα στα σημεία Α(－4) και Β(3) στον πραγματικό άξονα;'
        : 'What is the distance between points A(－4) and B(3) on the real axis?',
      correct: 7,
      type: 'input',
      unit: isEl ? 'μονάδες' : 'units',
      tableData: isEl ? [
        { label: 'Τύπος απόστασης d', details: '|β － α|' },
        { label: 'Υπολογισμός', details: '|3 － (－4)| ＝ |3 ＋ 4| ＝ 7' }
      ] : [
        { label: 'Distance formula d', details: '|b － a|' },
        { label: 'Calculation', details: '|3 － (－4)| ＝ |3 ＋ 4| ＝ 7' }
      ],
      explanation: isEl
        ? 'Η απόσταση ισούται με |3 － (－4)| ＝ 7 μονάδες.'
        : 'The distance equals |3 － (－4)| ＝ 7 units.'
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Ακέραιοι ανάμεσα σε Ρίζες' : 'Integers between Roots',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Πόσοι ΑΚΕΡΑΙΟΙ αριθμοί βρίσκονται ανάμεσα στο' : 'How many INTEGERS lie between'}</span>
          <span className="inline-flex items-center whitespace-nowrap">－<Radical>5</Radical></span>
          <span>{isEl ? 'και στο' : 'and'}</span>
          <Radical>5</Radical>
          <span>{isEl ? ';' : '?'}</span>
        </span>
      ),
      correct: 5,
      type: 'input',
      tableData: isEl ? [
        {
          label: 'Τιμή της ρίζας',
          details: (
            <span className="inline-flex items-center gap-1">
              <Radical>5</Radical>
              <span>≈ 2,236</span>
            </span>
          )
        },
        { label: 'Διάστημα', details: '－2,236 ＜ x ＜ 2,236' },
        { label: 'Ακέραιοι', details: '－2, －1, 0, 1, 2 (συνολικά 5)' }
      ] : [
        {
          label: 'Root value',
          details: (
            <span className="inline-flex items-center gap-1">
              <Radical>5</Radical>
              <span>≈ 2.236</span>
            </span>
          )
        },
        { label: 'Interval', details: '－2.236 ＜ x ＜ 2.236' },
        { label: 'Integers', details: '－2, －1, 0, 1, 2 (total 5)' }
      ],
      explanation: isEl ? (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>Επειδή</span>
          <span className="inline-flex items-center whitespace-nowrap"><Radical>5</Radical> ≈ 2,236</span>,
          <span>οι ακέραιοι που βρίσκονται ανάμεσα είναι οι －2, －1, 0, 1, 2 (συνολικά 5).</span>
        </span>
      ) : (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>Because</span>
          <span className="inline-flex items-center whitespace-nowrap"><Radical>5</Radical> ≈ 2.236</span>,
          <span>the integers between them are －2, －1, 0, 1, 2 (total 5).</span>
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Φυσικοί Αριθμοί και Ρίζα' : 'Natural Numbers and Root',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Πόσοι ΦΥΣΙΚΟΙ αριθμοί είναι αυστηρά μικρότεροι από το' : 'How many NATURAL numbers are strictly less than'}</span>
          <Radical>17</Radical>
          <span>{isEl ? ';' : '?'}</span>
        </span>
      ),
      correct: 5,
      type: 'input',
      tableData: isEl ? [
        { label: 'Τιμή της ρίζας', details: '4² ＝ 16 ＜ 17 ＜ 25 ＝ 5²' },
        { label: 'Φυσικοί αριθμοί', details: '0, 1, 2, 3, 4 (συνολικά 5)' }
      ] : [
        { label: 'Root value', details: '4² ＝ 16 ＜ 17 ＜ 25 ＝ 5²' },
        { label: 'Natural numbers', details: '0, 1, 2, 3, 4 (total 5)' }
      ],
      explanation: isEl ? (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>Οι φυσικοί αριθμοί μικρότεροι από το</span>
          <span className="inline-flex items-center whitespace-nowrap"><Radical>17</Radical> (≈ 4,12)</span>
          <span>είναι οι 0, 1, 2, 3, 4 (συνολικά 5).</span>
        </span>
      ) : (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>The natural numbers less than</span>
          <span className="inline-flex items-center whitespace-nowrap"><Radical>17</Radical> (≈ 4.12)</span>
          <span>are 0, 1, 2, 3, 4 (total 5).</span>
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Διάταξη Αρνητικών στον Άξονα' : 'Ordering Negatives on Axis',
      prompt: isEl
        ? 'Ποιο σημείο βρίσκεται ΑΡΙΣΤΕΡΟΤΕΡΑ στον άξονα: Α(－5), Β(－2), Γ(0), Δ(1);'
        : 'Which point lies FURTHEST LEFT on the axis: A(－5), B(－2), C(0), D(1)?',
      correct: isEl ? 'Α(－5)' : 'A(－5)',
      type: 'mcq',
      distractors: () => isEl ? ['Β(－2)', 'Γ(0)', 'Δ(1)'][randInt(0, 2)] : ['B(－2)', 'C(0)', 'D(1)'][randInt(0, 2)],
      tableData: isEl ? [
        { label: 'Τετμημένες', details: '－5 ＜ －2 ＜ 0 ＜ 1' },
        { label: 'Αριστερότερο σημείο', details: 'Το Α(－5) γιατί έχει τη μικρότερη τετμημένη' }
      ] : [
        { label: 'Coordinates', details: '－5 ＜ －2 ＜ 0 ＜ 1' },
        { label: 'Furthest left point', details: 'A(－5) because it has the smallest coordinate' }
      ],
      explanation: isEl
        ? 'Αριστερότερα στον προσανατολισμένο άξονα βρίσκεται το σημείο με τη μικρότερη τετμημένη, δηλαδή το Α(－5).'
        : 'Furthest left on the oriented axis is the point with the smallest coordinate, which is A(－5).'
    };
  }
];

// POOL Q12: Σύνθετα προβλήματα διάταξης και πραγματικών καταστάσεων (6 σενάρια με i18n)
const PROBLEM_POOL_Q12 = [
  (locale) => {
    const temp1 = -3.5;
    const temp2 = -1.2;
    const diff = Math.round((temp2 - temp1) * 10) / 10;
    const isEl = locale === 'el';
    const dec = isEl ? ',' : '.';
    const t1Formatted = String(temp1).replace('-', '－').replace('.', dec);
    const t2Formatted = String(temp2).replace('-', '－').replace('.', dec);
    const diffFormatted = String(diff).replace('.', dec);
    return {
      title: isEl ? 'Διαφορά Θερμοκρασιών στον Πραγματικό Άξονα' : 'Temperature Difference on Real Axis',
      prompt: isEl
        ? `Σε μια ορεινή πόλη η θερμοκρασία το πρωί ήταν ${t1Formatted} °C και το μεσημέρι ανήλθε σε ${t2Formatted} °C. Πόσους βαθμούς Κελσίου (°C) αυξήθηκε η θερμοκρασία;`
        : `In a mountain town, morning temperature was ${t1Formatted} °C and by noon it rose to ${t2Formatted} °C. By how many degrees Celsius (°C) did the temperature increase?`,
      correct: diff,
      type: 'input',
      unit: '°C',
      tableData: isEl ? [
        { label: 'Αρχική θερμοκρασία', details: `${t1Formatted} °C` },
        { label: 'Τελική θερμοκρασία', details: `${t2Formatted} °C` },
        {
          label: 'Διαφορά',
          details: `${t2Formatted} － (${t1Formatted}) ＝ ${diffFormatted} °C`
        }
      ] : [
        { label: 'Initial temperature', details: `${t1Formatted} °C` },
        { label: 'Final temperature', details: `${t2Formatted} °C` },
        {
          label: 'Difference',
          details: `${t2Formatted} － (${t1Formatted}) ＝ ${diffFormatted} °C`
        }
      ],
      explanation: `${t2Formatted} － (${t1Formatted}) ＝ ${t2Formatted} ＋ ${Math.abs(temp1).toString().replace('.', dec)} ＝ ${diffFormatted} °C.`
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    const correctLabel = isEl ? '√8 m (Άρρητος)' : '√8 m (Irrational)';
    return {
      title: isEl ? 'Σύγκριση Περιμέτρων Τετραγώνων' : 'Square Side from Area',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Δύο τετράγωνα έχουν εμβαδά 8 m² και 9 m² αντίστοιχα. Ποια είναι η πλευρά του πρώτου τετραγώνου;' : 'Two squares have areas of 8 m² and 9 m² respectively. What is the side length of the first square?'}</span>
        </span>
      ),
      correct: correctLabel,
      type: 'mcq',
      distractors: () => ['4 m', '2 m', '3 m'][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === correctLabel) {
          return (
            <span className="inline-flex items-center whitespace-nowrap">
              <Radical>8</Radical>
              <span>m {isEl ? '(Άρρητος)' : '(Irrational)'}</span>
            </span>
          );
        }
        return opt;
      },
      tableData: isEl ? [
        { label: 'Εμβαδόν 1ου', details: 'E₁ ＝ α² ＝ 8' },
        {
          label: 'Πλευρά 1ου',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>α ＝</span>
              <Radical>8</Radical>
              <span>m</span>
            </span>
          )
        }
      ] : [
        { label: 'Area 1', details: 'A₁ ＝ a² ＝ 8' },
        {
          label: 'Side 1',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>a ＝</span>
              <Radical>8</Radical>
              <span>m</span>
            </span>
          )
        }
      ],
      explanation: isEl ? (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>Η πλευρά τετραγώνου με εμβαδόν 8 είναι</span>
          <span className="inline-flex items-center whitespace-nowrap">
            <Radical>8</Radical>
            <span>m</span>
          </span>
          <span>(άρρητος αριθμός).</span>
        </span>
      ) : (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>The side of a square with area 8 is</span>
          <span className="inline-flex items-center whitespace-nowrap">
            <Radical>8</Radical>
            <span>m</span>
          </span>
          <span>(an irrational number).</span>
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Αντίθετος Πραγματικός Αριθμός' : 'Opposite Real Number',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Ποιος είναι ο αντίθετος του αριθμού' : 'What is the opposite of the number'}</span>
          <span className="inline-flex items-center whitespace-nowrap">3 － <Radical>2</Radical>{isEl ? ';' : '?'}</span>
        </span>
      ),
      correct: '√2 － 3',
      type: 'mcq',
      distractors: () => ['－3 － √2', '3 ＋ √2', '√2 ＋ 3'][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === '√2 － 3') return <span className="inline-flex items-center whitespace-nowrap"><Radical>2</Radical> － 3</span>;
        if (opt === '－3 － √2') return <span className="inline-flex items-center whitespace-nowrap">－3 － <Radical>2</Radical></span>;
        if (opt === '3 ＋ √2') return <span className="inline-flex items-center whitespace-nowrap">3 ＋ <Radical>2</Radical></span>;
        if (opt === '√2 ＋ 3') return <span className="inline-flex items-center whitespace-nowrap"><Radical>2</Radical> ＋ 3</span>;
        return opt;
      },
      tableData: isEl ? [
        {
          label: 'Αρχικός αριθμός',
          details: (
            <span className="inline-flex items-center gap-0.5">
              <span>3 －</span>
              <Radical>2</Radical>
            </span>
          )
        },
        {
          label: 'Αντίθετος',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>－(3 －</span>
              <Radical>2</Radical>
              <span>) ＝</span>
              <Radical>2</Radical>
              <span>－ 3</span>
            </span>
          )
        }
      ] : [
        {
          label: 'Original number',
          details: (
            <span className="inline-flex items-center gap-0.5">
              <span>3 －</span>
              <Radical>2</Radical>
            </span>
          )
        },
        {
          label: 'Opposite',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>－(3 －</span>
              <Radical>2</Radical>
              <span>) ＝</span>
              <Radical>2</Radical>
              <span>－ 3</span>
            </span>
          )
        }
      ],
      explanation: isEl ? (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>Ο αντίθετος προκύπτει αλλάζοντας τα πρόσημα όλων των όρων:</span>
          <span className="inline-flex items-center whitespace-nowrap">
            <span>－(3 －</span>
            <Radical>2</Radical>
            <span>) ＝</span>
            <Radical>2</Radical>
            <span>－ 3.</span>
          </span>
        </span>
      ) : (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>The opposite is obtained by negating all terms:</span>
          <span className="inline-flex items-center whitespace-nowrap">
            <span>－(3 －</span>
            <Radical>2</Radical>
            <span>) ＝</span>
            <Radical>2</Radical>
            <span>－ 3.</span>
          </span>
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Αντίστροφος Πραγματικός Αριθμός' : 'Reciprocal Real Number',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Ποιο είναι το γινόμενο του αριθμού' : 'What is the product of'}</span>
          <Radical>5</Radical>
          <span>{isEl ? 'με τον αντίστροφό του;' : 'and its reciprocal?'}</span>
        </span>
      ),
      correct: 1,
      type: 'input',
      tableData: isEl ? [
        { label: 'Αριθμός', details: <Radical>5</Radical> },
        { label: 'Γινόμενο με αντίστροφο', details: '1' }
      ] : [
        { label: 'Number', details: <Radical>5</Radical> },
        { label: 'Product with reciprocal', details: '1' }
      ],
      explanation: isEl
        ? 'Το γινόμενο κάθε μη μηδενικού πραγματικού αριθμού με τον αντίστροφό του ισούται πάντοτε με 1.'
        : 'The product of any non-zero real number with its reciprocal is always 1.'
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    return {
      title: isEl ? 'Απόλυτη Τιμή Διαφοράς' : 'Absolute Value of Difference',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Πόσο ισούται η παράσταση' : 'What does the expression'}</span>
          <span className="inline-flex items-center whitespace-nowrap">|<Radical>2</Radical> － 2|</span>
          <span>{isEl ? ';' : 'equal?'}</span>
        </span>
      ),
      correct: '2 － √2',
      type: 'mcq',
      distractors: () => ['√2 － 2', '√2 ＋ 2', '2'][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === '2 － √2') return <span className="inline-flex items-center whitespace-nowrap">2 － <Radical>2</Radical></span>;
        if (opt === '√2 － 2') return <span className="inline-flex items-center whitespace-nowrap"><Radical>2</Radical> － 2</span>;
        if (opt === '√2 ＋ 2') return <span className="inline-flex items-center whitespace-nowrap"><Radical>2</Radical> ＋ 2</span>;
        return opt;
      },
      tableData: isEl ? [
        {
          label: 'Πρόσημο υπό απόλυτο',
          details: (
            <div className="flex flex-col gap-1">
              <span className="inline-flex items-center whitespace-nowrap">
                <Radical>2</Radical>
                <span>＜ 2</span>
              </span>
              <span className="inline-flex items-center whitespace-nowrap font-bold text-indigo-700">
                <span>⇒</span>
                <Radical>2</Radical>
                <span>－ 2 ＜ 0</span>
              </span>
            </div>
          )
        },
        { label: 'Ορισμός απολύτου', details: '|x| ＝ －x όταν x ＜ 0' }
      ] : [
        {
          label: 'Sign inside absolute',
          details: (
            <div className="flex flex-col gap-1">
              <span className="inline-flex items-center whitespace-nowrap">
                <Radical>2</Radical>
                <span>＜ 2</span>
              </span>
              <span className="inline-flex items-center whitespace-nowrap font-bold text-indigo-700">
                <span>⇒</span>
                <Radical>2</Radical>
                <span>－ 2 ＜ 0</span>
              </span>
            </div>
          )
        },
        { label: 'Definition of absolute', details: '|x| ＝ －x when x ＜ 0' }
      ],
      explanation: isEl ? (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>Επειδή</span>
          <span className="inline-flex items-center whitespace-nowrap"><Radical>2</Radical> ＜ 2</span>,
          <span>η διαφορά</span>
          <span className="inline-flex items-center whitespace-nowrap"><Radical>2</Radical> － 2</span>
          <span>είναι αρνητική. Άρα</span>
          <span className="inline-flex items-center whitespace-nowrap">|<Radical>2</Radical> － 2| ＝ 2 － <Radical>2</Radical>.</span>
        </span>
      ) : (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>Since</span>
          <span className="inline-flex items-center whitespace-nowrap"><Radical>2</Radical> ＜ 2</span>,
          <span>the difference</span>
          <span className="inline-flex items-center whitespace-nowrap"><Radical>2</Radical> － 2</span>
          <span>is negative. Hence</span>
          <span className="inline-flex items-center whitespace-nowrap">|<Radical>2</Radical> － 2| ＝ 2 － <Radical>2</Radical>.</span>
        </span>
      )
    };
  },
  (locale) => {
    const isEl = locale === 'el';
    const notComp = isEl ? 'Δεν συγκρίνονται' : 'Not comparable';
    return {
      title: isEl ? 'Σύγκριση Κλασμάτων με Ρίζα' : 'Comparing Fractions with Root',
      prompt: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Ποια είναι η σωστή σχέση ανάμεσα στον αριθμό' : 'What is the correct relation between the number'}</span>
          <Frac num="1" den="2" />
          <span>{isEl ? 'και τον αριθμό' : 'and the number'}</span>
          <Frac num="1" den={<Radical>2</Radical>} />
          <span>{isEl ? ';' : '?'}</span>
        </span>
      ),
      correct: '1/2 ＜ 1/√2',
      type: 'mcq',
      distractors: () => ['1/2 ＞ 1/√2', '1/2 ＝ 1/√2', notComp][randInt(0, 2)],
      renderOption: (opt) => {
        if (opt === '1/2 ＜ 1/√2') {
          return (
            <span className="inline-flex items-center gap-1">
              <Frac num="1" den="2" />
              <span>＜</span>
              <Frac num="1" den={<Radical>2</Radical>} />
            </span>
          );
        }
        if (opt === '1/2 ＞ 1/√2') {
          return (
            <span className="inline-flex items-center gap-1">
              <Frac num="1" den="2" />
              <span>＞</span>
              <Frac num="1" den={<Radical>2</Radical>} />
            </span>
          );
        }
        if (opt === '1/2 ＝ 1/√2') {
          return (
            <span className="inline-flex items-center gap-1">
              <Frac num="1" den="2" />
              <span>＝</span>
              <Frac num="1" den={<Radical>2</Radical>} />
            </span>
          );
        }
        return opt;
      },
      tableData: isEl ? [
        {
          label: 'Παρονομαστές',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>2 ＞</span>
              <Radical>2</Radical>
              <span>(αφού 4 ＞ 2)</span>
            </span>
          )
        },
        { label: 'Κανόνας κλασμάτων', details: 'Με ίδιο αριθμητή, μεγαλύτερο είναι το κλάσμα με τον μικρότερο παρονομαστή' }
      ] : [
        {
          label: 'Denominators',
          details: (
            <span className="inline-flex items-center gap-1">
              <span>2 ＞</span>
              <Radical>2</Radical>
              <span>(since 4 ＞ 2)</span>
            </span>
          )
        },
        { label: 'Fraction rule', details: 'With identical numerators, the fraction with smaller denominator is greater' }
      ],
      explanation: isEl ? (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>Επειδή 2 ＞</span>
          <Radical>2</Radical>,
          <span>το κλάσμα με τον μικρότερο παρονομαστή είναι μεγαλύτερο:</span>
          <span className="inline-flex items-center whitespace-nowrap">
            <Frac num="1" den="2" />
            <span>＜</span>
            <Frac num="1" den={<Radical>2</Radical>} />.
          </span>
        </span>
      ) : (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>Since 2 ＞</span>
          <Radical>2</Radical>,
          <span>the fraction with the smaller denominator is larger:</span>
          <span className="inline-flex items-center whitespace-nowrap">
            <Frac num="1" den="2" />
            <span>＜</span>
            <Frac num="1" den={<Radical>2</Radical>} />.
          </span>
        </span>
      )
    };
  }
];

export default function PragmatikoiExercises() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const isEl = locale === 'el';

  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Συγκεντρωτικό λεξικό UI
  const t = {
    el: {
      metaTitle: "Ασκήσεις: Πραγματικοί Αριθμοί | Γ' Γυμνασίου",
      metaDesc: "Διαδραστικές ασκήσεις στους πραγματικούς αριθμούς, σύνολα, διάταξη και άξονα με αναλυτικά βήματα για τη Γ' Γυμνασίου.",
      backText: "Θεωρία Κεφ. 3",
      btnTheory: "ΘΕΩΡΙΑ",
      badgeClass: "ΑΣΚΗΣΕΙΣ • Γ' ΓΥΜΝΑΣΙΟΥ",
      bannerTitle: "Πραγματικοί Αριθμοί: Εξάσκηση",
      bannerSubtitle: "12 δυναμικές ερωτήσεις και αυτούσια προβλήματα διάταξης και συνόλων. Απαντήστε και πατήστε «Έλεγχος Απαντήσεων».",
      btnNewExercises: "ΝΕΕΣ ΑΣΚΗΣΕΙΣ",
      resultHeading: (s) => `Αποτέλεσμα: ${s} / 12 (${Math.round((s / 12) * 100)}%)`,
      feedbackExcellent: "Εξαιρετική επίδοση! Κατανοείτε σε βάθος τους πραγματικούς αριθμούς, τη διάταξη και τις σχέσεις των συνόλων.",
      feedbackGood: "Πολύ καλή προσπάθεια! Μελετήστε τα αναλυτικά βήματα παρακάτω στα σημεία που δυσκολευτήκατε.",
      feedbackPoor: "Χρειάζεται λίγη εξάσκηση ακόμα. Συμβουλευτείτε τη θεωρία για τη διάταξη των πραγματικών αριθμών!",
      btnTryNewSet: "ΔΟΚΙΜΑΣΤΕ ΝΕΟ ΣΕΤ",
      correctBadge: "✓ Σωστό",
      wrongBadge: "✗ Λάθος",
      inputPlaceholder: "Απάντηση...",
      thStep: "Στοιχείο / Βήμα",
      thData: "Ανάλυση Δεδομένων",
      correctAnswerLabel: "Σωστή Απάντηση:",
      answeredLabel: "ΑΠΑΝΤΗΘΗΚΑΝ",
      scoreLabel: "ΣΚΟΡ",
      btnCheck: "ΕΛΕΓΧΟΣ",
      trueLabel: "Σωστό",
      falseLabel: "Λάθος"
    },
    en: {
      metaTitle: "Exercises: Real Numbers | 9th Grade",
      metaDesc: "Interactive exercises on real numbers, sets, ordering, and the real axis with detailed step-by-step solutions for 9th Grade.",
      backText: "Theory Ch. 3",
      btnTheory: "THEORY",
      badgeClass: "EXERCISES • 9TH GRADE",
      bannerTitle: "Real Numbers: Practice",
      bannerSubtitle: "12 dynamic questions and applied ordering/set problems. Complete your answers and click «Check Answers».",
      btnNewExercises: "NEW EXERCISES",
      resultHeading: (s) => `Result: ${s} / 12 (${Math.round((s / 12) * 100)}%)`,
      feedbackExcellent: "Outstanding performance! You thoroughly understand real numbers, ordering, and number set hierarchies.",
      feedbackGood: "Very good effort! Review the detailed steps below for the questions you found tricky.",
      feedbackPoor: "Needs a bit more practice. Consult the theory for the ordering of real numbers!",
      btnTryNewSet: "TRY NEW SET",
      correctBadge: "✓ Correct",
      wrongBadge: "✗ Incorrect",
      inputPlaceholder: "Answer...",
      thStep: "Item / Step",
      thData: "Data Analysis",
      correctAnswerLabel: "Correct Answer:",
      answeredLabel: "ANSWERED",
      scoreLabel: "SCORE",
      btnCheck: "CHECK",
      trueLabel: "True",
      falseLabel: "False"
    }
  };

  const cur = t[locale] || t.el;

  const loadNewSet = () => {
    const qList = [];

    // Q1: True / False - Ορισμός πραγματικών αριθμών
    const q1IsCorrect = Math.random() < 0.5;
    qList.push({
      id: 1,
      title: isEl ? 'Ορισμός Πραγματικών Αριθμών' : 'Definition of Real Numbers',
      prompt: isEl
        ? (q1IsCorrect
            ? 'Το σύνολο των πραγματικών αριθμών (ℝ) αποτελείται από την ένωση όλων των ρητών και όλων των άρρητων αριθμών.'
            : 'Υπάρχουν πραγματικοί αριθμοί οι οποίοι δεν είναι ούτε ρητοί ούτε άρρητοι.')
        : (q1IsCorrect
            ? 'The set of real numbers (ℝ) consists of the union of all rational and all irrational numbers.'
            : 'There exist real numbers that are neither rational nor irrational.'),
      type: 'tf',
      correct: q1IsCorrect ? cur.trueLabel : cur.falseLabel,
      options: [cur.trueLabel, cur.falseLabel],
      explanation: isEl
        ? 'Εξ ορισμού, κάθε πραγματικός αριθμός είναι είτε ρητός είτε άρρητος (ℝ ＝ ℚ ∪ Άρρητοι).'
        : 'By definition, every real number is either rational or irrational (ℝ ＝ ℚ ∪ Irrationals).'
    });

    // Q2: True / False - Υποσύνολα
    const q2Choice = Math.random() < 0.5;
    qList.push({
      id: 2,
      title: isEl ? 'Σχέση Υποσυνόλων ℕ και ℚ' : 'Subset Relation ℕ and ℚ',
      prompt: isEl
        ? (q2Choice
            ? 'Κάθε φυσικός αριθμός είναι και ρητός αριθμός (δηλαδή ℕ ⊆ ℚ).'
            : 'Υπάρχουν φυσικοί αριθμοί που δεν μπορούν να γραφούν ως ρητοί αριθμοί.')
        : (q2Choice
            ? 'Every natural number is also a rational number (i.e. ℕ ⊆ ℚ).'
            : 'There are natural numbers that cannot be represented as rational numbers.'),
      type: 'tf',
      correct: q2Choice ? cur.trueLabel : cur.falseLabel,
      options: [cur.trueLabel, cur.falseLabel],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          {isEl ? (
            <>
              <span>Ισχύει ℕ ⊆ ℤ ⊆ ℚ ⊆ ℝ. Κάθε φυσικός k γράφεται ως</span>
              <Frac num="k" den="1" />
              <span>, άρα είναι ρητός.</span>
            </>
          ) : (
            <>
              <span>It holds that ℕ ⊆ ℤ ⊆ ℚ ⊆ ℝ. Every natural number k can be written as</span>
              <Frac num="k" den="1" />
              <span>, hence it is rational.</span>
            </>
          )}
        </span>
      )
    });

    // Q3: MCQ - Ξένα σύνολα
    const q3CorrectStr = isEl
      ? 'Το κενό σύνολο (∅), δεν έχουν κανένα κοινό στοιχείο'
      : 'The empty set (∅), they share no common elements';
    qList.push({
      id: 3,
      title: isEl ? 'Τομή Ρητών και Άρρητων' : 'Intersection of Rationals and Irrationals',
      prompt: isEl
        ? 'Ποια είναι η τομή του συνόλου των ρητών αριθμών (ℚ) και του συνόλου των άρρητων αριθμών;'
        : 'What is the intersection of the set of rational numbers (ℚ) and the set of irrational numbers?',
      type: 'mcq',
      correct: q3CorrectStr,
      options: ensureFourUniqueOptions(q3CorrectStr, () => isEl ? [
        'Το σύνολο των φυσικών αριθμών (ℕ)',
        'Ο αριθμός μηδέν {0}',
        'Όλοι οι δεκαδικοί αριθμοί'
      ][randInt(0, 2)] : [
        'The set of natural numbers (ℕ)',
        'The number zero {0}',
        'All decimal numbers'
      ][randInt(0, 2)]),
      explanation: isEl
        ? 'Ένας αριθμός είναι είτε ρητός είτε άρρητος. Δεν μπορεί να είναι και τα δύο ταυτόχρονα.'
        : 'A number is either rational or irrational. It cannot be both at the same time.'
    });

    // Q4: MCQ - Τετραγωνική ρίζα αρνητικού
    const q4CorrectStr = isEl
      ? 'Δεν ορίζεται (δεν είναι πραγματικός αριθμός)'
      : 'Undefined (not a real number)';
    qList.push({
      id: 4,
      title: isEl ? 'Ρίζα Αρνητικού Αριθμού' : 'Square Root of Negative Number',
      prompt: (
        <span className="inline-flex items-center gap-1">
          <span>{isEl ? 'Η παράσταση' : 'The expression'}</span>
          <Radical>－9</Radical>
          <span>{isEl ? 'στο σύνολο των πραγματικών αριθμών (ℝ):' : 'in the set of real numbers (ℝ):'}</span>
        </span>
      ),
      type: 'mcq',
      correct: q4CorrectStr,
      options: ensureFourUniqueOptions(q4CorrectStr, () => isEl ? [
        'Ισούται με －3',
        'Ισούται με 3',
        'Είναι άρρητος αριθμός'
      ][randInt(0, 2)] : [
        'Equals －3',
        'Equals 3',
        'Is an irrational number'
      ][randInt(0, 2)]),
      explanation: isEl
        ? 'Στο σύνολο των πραγματικών αριθμών δεν ορίζεται τετραγωνική ρίζα αρνητικού αριθμού.'
        : 'In the set of real numbers, square roots of negative numbers are undefined.'
    });

    // Q5: Input - Υπολογισμός ρίζας
    qList.push({
      id: 5,
      title: isEl ? 'Υπολογισμός Ρίζας' : 'Square Root Computation',
      prompt: (
        <span className="inline-flex items-center gap-1">
          <span>{isEl ? 'Πόσο ισούται η τιμή του πραγματικού αριθμού' : 'What is the value of the real number'}</span>
          <span className="inline-flex items-center whitespace-nowrap">(<Radical>7</Radical>)²{isEl ? ';' : '?'}</span>
        </span>
      ),
      type: 'input',
      correct: 7,
      explanation: isEl ? (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>Για κάθε μη αρνητικό αριθμό α, ισχύει</span>
          <span className="inline-flex items-center whitespace-nowrap">(<Radical>α</Radical>)² ＝ α.</span>
          <span>Άρα</span>
          <span className="inline-flex items-center whitespace-nowrap">(<Radical>7</Radical>)² ＝ 7.</span>
        </span>
      ) : (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>For any non-negative number a,</span>
          <span className="inline-flex items-center whitespace-nowrap">(<Radical>a</Radical>)² ＝ a.</span>
          <span>Hence</span>
          <span className="inline-flex items-center whitespace-nowrap">(<Radical>7</Radical>)² ＝ 7.</span>
        </span>
      )
    });

    // Q6: MCQ - Αναγνώριση Άρρητου
    const validArritoi = ['√2', '√3', '√5', 'π'];
    const invalidArritoi = ['√4 (＝ 2)', '√9 (＝ 3)', isEl ? '0,25' : '0.25', '－3'];
    const q6Correct = validArritoi[randInt(0, validArritoi.length - 1)];
    qList.push({
      id: 6,
      title: isEl ? 'Αναγνώριση Άρρητου Αριθμού' : 'Identifying Irrational Numbers',
      prompt: isEl ? 'Ποιος από τους παρακάτω πραγματικούς αριθμούς είναι άρρητος;' : 'Which of the following real numbers is irrational?',
      type: 'mcq',
      correct: q6Correct,
      options: ensureFourUniqueOptions(q6Correct, () => invalidArritoi[randInt(0, invalidArritoi.length - 1)]),
      renderOption: (opt) => {
        if (opt === '√2') return <Radical>2</Radical>;
        if (opt === '√3') return <Radical>3</Radical>;
        if (opt === '√5') return <Radical>5</Radical>;
        if (opt === 'π') return <span className="font-serif italic text-[1.1em]">π</span>;
        if (opt === '√4 (＝ 2)') return (
          <span className="inline-flex items-center whitespace-nowrap align-middle">
            <Radical>4</Radical> <span>(＝ 2)</span>
          </span>
        );
        if (opt === '√9 (＝ 3)') return (
          <span className="inline-flex items-center whitespace-nowrap align-middle">
            <Radical>9</Radical> <span>(＝ 3)</span>
          </span>
        );
        return opt;
      },
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1 leading-relaxed">
          <span>{isEl ? 'Μη τέλεια τετράγωνα κάτω από ρίζα καθώς και ο αριθμός' : 'Non-perfect squares under a square root and the number'}</span>
          <span className="font-serif italic text-[1.05em]">π</span>
          <span>{isEl ? 'είναι άρρητοι αριθμοί.' : 'are irrational numbers.'}</span>
        </span>
      )
    });

    // Q7: Input - Απόλυτη τιμή αρνητικού
    const negVal = randInt(4, 9);
    qList.push({
      id: 7,
      title: isEl ? 'Απόλυτη Τιμή Πραγματικού' : 'Absolute Value of Real Number',
      prompt: isEl
        ? `Ποια είναι η τιμή της παράστασης |－${negVal}|;`
        : `What is the value of the expression |－${negVal}|?`,
      type: 'input',
      correct: negVal,
      explanation: isEl
        ? `Η απόλυτη τιμή ενός αρνητικού αριθμού ισούται με τον αντίθετό του: |－${negVal}| ＝ ${negVal}.`
        : `The absolute value of a negative number equals its opposite: |－${negVal}| ＝ ${negVal}.`
    });

    // Q8: MCQ - Πληρότητα Άξονα
    const q8CorrectStr = isEl
      ? 'Κάθε σημείο της ευθείας αντιστοιχεί σε έναν μοναδικό πραγματικό αριθμό και αντίστροφα'
      : 'Every point on the line corresponds to a unique real number and vice versa';
    qList.push({
      id: 8,
      title: isEl ? 'Η Ευθεία των Πραγματικών Αριθμών' : 'The Real Number Line',
      prompt: isEl
        ? 'Ποια από τις παρακάτω προτάσεις περιγράφει σωστά τον άξονα των πραγματικών αριθμών;'
        : 'Which of the following statements correctly describes the real number axis?',
      type: 'mcq',
      correct: q8CorrectStr,
      options: ensureFourUniqueOptions(q8CorrectStr, () => isEl ? [
        'Στην ευθεία υπάρχουν κενά σημεία που δεν αντιστοιχούν σε αριθμούς',
        'Μόνο οι ρητοί αριθμοί μπορούν να τοποθετηθούν στον άξονα',
        'Κάθε σημείο της ευθείας παριστάνει τουλάχιστον δύο διαφορετικούς αριθμούς'
      ][randInt(0, 2)] : [
        'There are gaps on the line that do not correspond to numbers',
        'Only rational numbers can be placed on the line',
        'Each point on the line represents at least two different numbers'
      ][randInt(0, 2)]),
      explanation: isEl
        ? 'Η αντιστοιχία ανάμεσα στα σημεία της ευθείας και τους πραγματικούς αριθμούς είναι αμφιμονοσήμαντη (1-προς-1).'
        : 'The correspondence between the points on the line and real numbers is bijective (one-to-one).'
    });

    // Q9 - Q12: Επιλογή από ανεξάρτητες δεξαμενές
    const p9 = PROBLEM_POOL_Q9[randInt(0, PROBLEM_POOL_Q9.length - 1)](locale);
    const p10 = PROBLEM_POOL_Q10[randInt(0, PROBLEM_POOL_Q10.length - 1)](locale);
    const p11 = PROBLEM_POOL_Q11[randInt(0, PROBLEM_POOL_Q11.length - 1)](locale);
    const p12 = PROBLEM_POOL_Q12[randInt(0, PROBLEM_POOL_Q12.length - 1)](locale);

    const formatPoolItem = (item, id) => {
      let options = undefined;
      if (item.type === 'mcq') {
        options = ensureFourUniqueOptions(item.correct, item.distractors);
      }
      return {
        id,
        title: item.title,
        prompt: item.prompt,
        type: item.type,
        correct: item.correct,
        options,
        renderOption: item.renderOption,
        unit: item.unit,
        tableData: item.tableData,
        explanation: item.explanation
      };
    };

    qList.push(formatPoolItem(p9, 9));
    qList.push(formatPoolItem(p10, 10));
    qList.push(formatPoolItem(p11, 11));
    qList.push(formatPoolItem(p12, 12));

    setQuestions(qList);
    setUserAnswers({});
    setSubmitted(false);
    setScore(0);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    loadNewSet();
  }, [locale]);

  const handleAnswerChange = (qId, val) => {
    if (submitted) return;
    setUserAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleSubmit = () => {
    let s = 0;
    questions.forEach(q => {
      const uAns = userAnswers[q.id];
      if (uAns === undefined || uAns === null || uAns === '') return;

      if (q.type === 'input') {
        const parsedUser = parseFloat(String(uAns).replace(',', '.').trim());
        const parsedCorrect = parseFloat(String(q.correct).replace(',', '.').trim());
        if (!isNaN(parsedUser) && Math.abs(parsedUser - parsedCorrect) <= 0.05) {
          s += 1;
        }
      } else {
        if (String(uAns).trim() === String(q.correct).trim()) {
          s += 1;
        }
      }
    });

    setScore(s);
    setSubmitted(true);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const answeredCount = Object.keys(userAnswers).filter(k => userAnswers[k] !== '' && userAnswers[k] !== undefined).length;

  return (
    <Layout
      title={cur.metaTitle}
      description={cur.metaDesc}
      backUrl="/g-gymnasiou/03-pragmatikoi"
      backText={cur.backText}
      showAds={true}
      actionButton={
        <Link
          href="/g-gymnasiou/03-pragmatikoi"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all duration-200"
        >
          <span>📖 {toCleanUppercase(cur.btnTheory)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 py-4 sm:py-6 pb-28 sm:pb-36 overflow-x-hidden text-slate-800 box-border">
        
        {/* Header Banner - Responsive */}
        <section className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-blue-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 mb-6 sm:mb-8 shadow-xl w-full min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0">
              <span className="inline-block px-2.5 py-1 bg-white/10 rounded-full text-indigo-200 text-[11px] sm:text-xs font-bold uppercase tracking-wider border border-white/10 break-words [overflow-wrap:anywhere]">
                {toCleanUppercase(cur.badgeClass)}
              </span>
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-black mt-2 leading-tight break-words [overflow-wrap:anywhere]">
                {cur.bannerTitle}
              </h1>
              <p className="text-indigo-200 text-xs sm:text-base mt-1 break-words [overflow-wrap:anywhere]">
                {cur.bannerSubtitle}
              </p>
            </div>
            <div className="shrink-0">
              <button
                type="button"
                onClick={loadNewSet}
                className="w-full sm:w-auto px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow transition-all duration-150 text-xs sm:text-sm whitespace-nowrap"
              >
                🔄 {toCleanUppercase(cur.btnNewExercises)}
              </button>
            </div>
          </div>
        </section>

        {/* Results Banner */}
        {submitted && (
          <section className="p-5 sm:p-8 bg-white border-2 border-indigo-200 rounded-2xl sm:rounded-3xl shadow-lg mb-6 sm:mb-8 text-center animate-fade-in w-full min-w-0">
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 mb-2 break-words [overflow-wrap:anywhere]">
              {cur.resultHeading(score)}
            </h2>
            <p className="text-slate-600 text-xs sm:text-base max-w-xl mx-auto mb-4 break-words [overflow-wrap:anywhere]">
              {score >= 10
                ? cur.feedbackExcellent
                : score >= 6
                ? cur.feedbackGood
                : cur.feedbackPoor}
            </p>
            <button
              type="button"
              onClick={loadNewSet}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl sm:rounded-2xl shadow transition text-xs sm:text-sm"
            >
              🔄 {toCleanUppercase(cur.btnTryNewSet)}
            </button>
          </section>
        )}

        {/* Λίστα Ερωτήσεων */}
        <div className="space-y-4 sm:space-y-6 w-full min-w-0">
          {questions.map((q, idx) => {
            let isCorrect = false;
            if (submitted) {
              if (q.type === 'input') {
                const u = parseFloat(String(userAnswers[q.id]).replace(',', '.').trim());
                const c = parseFloat(String(q.correct).replace(',', '.').trim());
                isCorrect = !isNaN(u) && Math.abs(u - c) <= 0.05;
              } else {
                isCorrect = String(userAnswers[q.id]).trim() === String(q.correct).trim();
              }
            }

            return (
              <div
                key={q.id}
                className={`bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border transition-all w-full min-w-0 ${
                  submitted
                    ? isCorrect
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : 'border-rose-300 bg-rose-50/20'
                    : 'border-slate-200 shadow-sm'
                }`}
              >
                {/* Header Ερώτησης */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs sm:text-sm shrink-0">
                      {idx + 1}
                    </span>
                    <h3 className="font-bold text-sm sm:text-lg text-slate-900 leading-snug break-words [overflow-wrap:anywhere]">
                      {q.title}
                    </h3>
                  </div>
                  {submitted && (
                    <span
                      className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold shrink-0 ${
                        isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? cur.correctBadge : cur.wrongBadge}
                    </span>
                  )}
                </div>

                {/* Εκφώνηση - No Giveaway */}
                <div className="text-slate-800 text-xs sm:text-base leading-relaxed mb-4 sm:mb-6 font-medium break-words [overflow-wrap:anywhere]">
                  {q.prompt}
                </div>

                {/* Πεδία Απάντησης */}
                <div className="mb-2 w-full min-w-0">
                  {q.type === 'tf' && (
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 max-w-xs sm:max-w-md">
                      {q.options.map(opt => {
                        const isSelected = userAnswers[q.id] === opt;
                        return (
                          <button
                            type="button"
                            key={opt}
                            disabled={submitted}
                            onClick={() => handleAnswerChange(q.id, opt)}
                            className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm border transition-all ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {q.type === 'mcq' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 w-full">
                      {q.options.map(opt => {
                        const isSelected = userAnswers[q.id] === opt;
                        return (
                          <button
                            type="button"
                            key={opt}
                            disabled={submitted}
                            onClick={() => handleAnswerChange(q.id, opt)}
                            className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl text-left border flex items-center gap-2.5 transition-all min-h-[48px] sm:min-h-[56px] min-w-0 ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            <span
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                isSelected ? 'border-white bg-white' : 'border-slate-400'
                              }`}
                            >
                              {isSelected && <span className="w-2 h-2 rounded-full bg-indigo-600" />}
                            </span>
                            <span className="break-words whitespace-normal leading-snug flex-1 font-semibold text-xs sm:text-sm [overflow-wrap:anywhere]">
                              {q.renderOption ? q.renderOption(opt) : opt}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {q.type === 'input' && (
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 w-full sm:max-w-xs">
                      <input
                        type="text"
                        maxLength={10}
                        disabled={submitted}
                        value={userAnswers[q.id] || ''}
                        onChange={(e) => {
                          let val = e.target.value.replace('.', ',');
                          val = val.replace(/[^0-9,]/g, '');
                          const parts = val.split(',');
                          if (parts.length > 2) {
                            val = parts[0] + ',' + parts.slice(1).join('');
                          }
                          handleAnswerChange(q.id, val);
                        }}
                        placeholder={cur.inputPlaceholder}
                        className="w-full px-3.5 py-2 sm:px-4 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-bold text-slate-900 text-xs sm:text-sm"
                      />
                      {q.unit && (
                        <span className="text-xs sm:text-sm font-bold text-slate-500 whitespace-nowrap">
                          {q.unit}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* FEEDBACK SECTION - SAFE SCROLL TABLES */}
                {submitted && (
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200 space-y-3 animate-fade-in w-full min-w-0">
                    {q.tableData && q.tableData.length > 0 && (
                      <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white">
                        <table className="w-full text-xs text-left min-w-[280px]">
                          <thead className="bg-slate-100 text-slate-700 font-bold">
                            <tr>
                              <th className="p-2 border-b">{cur.thStep}</th>
                              <th className="p-2 border-b">{cur.thData}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-[11px] sm:text-xs">
                            {q.tableData.map((row, rIdx) => (
                              <tr key={rIdx}>
                                <td className="p-2 font-semibold text-slate-800 whitespace-nowrap">{row.label}</td>
                                <td className="p-2 font-mono text-indigo-900 break-words [overflow-wrap:anywhere]">{row.details}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    <div className="p-3 sm:p-4 bg-slate-100/70 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-slate-800 leading-relaxed break-words [overflow-wrap:anywhere]">
                      <div className="font-bold text-slate-900 mb-1 flex flex-wrap items-center gap-1.5">
                        <span>{cur.correctAnswerLabel}</span>
                        <span className="font-mono text-emerald-700 font-bold inline-flex flex-wrap items-center gap-1">
                          {q.renderOption ? q.renderOption(q.correct) : q.correct} {q.unit || ''}
                        </span>
                      </div>
                      <div className="break-words [overflow-wrap:anywhere]">{q.explanation}</div>
                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>

        {/* STICKY BOTTOM FOOTER - MOBILE OPTIMIZED */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white px-3 sm:px-6 py-2.5 sm:py-3.5 shadow-2xl">
          <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
            <div className="min-w-0">
              {!submitted ? (
                <div className="text-[11px] sm:text-sm font-bold text-slate-300 truncate">
                  {toCleanUppercase(cur.answeredLabel)}: <span className="text-amber-400 font-black">{answeredCount}</span> / 12
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 text-[11px] sm:text-sm font-black">
                  <span className="text-emerald-400">{toCleanUppercase(cur.scoreLabel)}: {score} / 12</span>
                  <span className="hidden xs:inline text-slate-600">|</span>
                  <span className="text-amber-400">{Math.round((score / 12) * 100)}%</span>
                </div>
              )}
            </div>

            <div className="shrink-0 flex items-center gap-2">
              {!submitted ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={answeredCount === 0}
                  className={`px-3.5 py-2 sm:px-6 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
                    answeredCount > 0
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md font-black'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {toCleanUppercase(cur.btnCheck)}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={loadNewSet}
                  className="px-3.5 py-2 sm:px-6 sm:py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-black text-xs sm:text-sm shadow-md transition whitespace-nowrap"
                >
                  {toCleanUppercase(cur.btnNewExercises)}
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}