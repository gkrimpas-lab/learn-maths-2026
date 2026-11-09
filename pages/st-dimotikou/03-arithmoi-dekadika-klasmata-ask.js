// pages/st-dimotikou/03-arithmoi-dekadika-klasmata-ask.js
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(ΣΤ')/g);
  return parts
    .map((part) => {
      if (part === "ΣΤ'") return "ΣΤ'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
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

function formatNum(val, locale = 'el', decimals = 3) {
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
  return locale === 'en' ? String(rounded) : String(rounded).replace('.', ',');
}

function renderFraction(num, den) {
  return (
    `<span class="inline-flex flex-col text-center align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full">` +
    `<span class="border-b border-current px-0.5 sm:px-1 pb-0.5 break-all">${num}</span>` +
    `<span class="pt-0.5 break-all">${den}</span>` +
    `</span>`
  );
}

function makeUniqueOptions(correct, wrongCandidates, fallbackGenerator) {
  const unique = new Set([String(correct)]);
  for (const opt of wrongCandidates) {
    if (opt !== undefined && opt !== null && String(opt).trim() !== '') {
      unique.add(String(opt));
    }
    if (unique.size === 4) break;
  }
  let attempts = 0;
  while (unique.size < 4 && attempts < 25) {
    attempts++;
    const generated = fallbackGenerator ? fallbackGenerator(unique.size) : null;
    if (generated !== null && generated !== undefined) {
      unique.add(String(generated));
    }
  }
  return shuffle(Array.from(unique));
}

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_klasm_std_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const parts = 100;
      const shaded = randInt(25, 75);
      const decVal = Number((shaded / parts).toFixed(2));
      const decStr = formatNum(decVal, locale, 2);
      const fracHtml = renderFraction(shaded, parts);

      return {
        title: isEn ? 'SHADED PART OF A WHOLE UNIT' : 'ΧΡΩΜΑΤΙΣΜΕΝΟ ΜΕΡΟΣ ΜΟΝΑΔΑΣ',
        instruction: isEn ? 'Write the decimal number:' : 'Γράψτε τον δεκαδικό αριθμό με κόμμα:',
        text: isEn
          ? `In a square divided into 100 equal smaller squares, ${shaded} are shaded. Which decimal number represents the shaded part of the whole unit?`
          : `Σε ένα τετράγωνο χωρισμένο σε 100 ίσα τετραγωνάκια, χρωματίστηκαν τα ${shaded}. Ποιος δεκαδικός αριθμός εκφράζει το χρωματισμένο μέρος της μονάδας;`,
        tableData: {
          col1: isEn ? 'Shaded' : 'Χρωματισμένα',
          col2: isEn ? 'Total' : 'Συνολικά',
          r1: [`${shaded}`, `${parts}`],
          r2: [isEn ? 'Decimal Fraction' : 'Δεκαδικό Κλάσμα', `${shaded}/${parts}`]
        },
        correctVal: decVal,
        correctStr: decStr,
        explanationHtml: isEn
          ? `The shaded portion is <span class="inline-flex items-center align-middle">${fracHtml}</span> ＝ ${decStr}.`
          : `Το χρωματισμένο μέρος είναι <span class="inline-flex items-center align-middle">${fracHtml}</span> ＝ ${decStr}.`,
        explanation: isEn
          ? `The shaded portion is ${shaded}/100 ＝ ${decStr}.`
          : `Το χρωματισμένο μέρος είναι ${shaded}/100 ＝ ${decStr}.`
      };
    }
  },
  {
    id: 'p_klasm_std_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const bottles = 10;
      const fracNumer = randInt(6, 9);
      const capacityL = fracNumer / 10;
      const totalL = Number((bottles * capacityL).toFixed(1));
      const totalStr = `${formatNum(totalL, locale, 1)} L`;
      const fracHtml = renderFraction(fracNumer, 10);

      return {
        title: isEn ? 'TOTAL JUICE VOLUME' : 'ΣΥΝΟΛΙΚΟΣ ΟΓΚΟΣ ΧΥΜΟΥ',
        instruction: isEn ? 'Enter total liters (L):' : 'Συμπληρώστε τα συνολικά λίτρα (L) με κόμμα:',
        textHtml: isEn
          ? `We filled ${bottles} bottles with juice. Each bottle holds <span class="inline-flex items-center align-middle">${fracHtml}</span> of a liter. How many liters (L) of juice were used in total?`
          : `Γεμίσαμε ${bottles} μπουκάλια με χυμό. Κάθε μπουκάλι χωράει <span class="inline-flex items-center align-middle">${fracHtml}</span> του λίτρου. Πόσα λίτρα (L) χυμού χρησιμοποιήσαμε συνολικά;`,
        text: isEn
          ? `We filled ${bottles} bottles with juice. Each bottle holds ${fracNumer}/10 of a liter. How many liters (L) of juice were used in total?`
          : `Γεμίσαμε ${bottles} μπουκάλια με χυμό. Κάθε μπουκάλι χωράει ${fracNumer}/10 του λίτρου. Πόσα λίτρα (L) χυμού χρησιμοποιήσαμε συνολικά;`,
        tableData: {
          col1: isEn ? 'Bottles' : 'Μπουκάλια',
          col2: isEn ? 'Capacity' : 'Χωρητικότητα',
          r1: [isEn ? `${bottles} bottles` : `${bottles} μπουκάλια`, `${fracNumer}/10 L ＝ ${formatNum(capacityL, locale, 1)} L`],
          r2: [isEn ? 'Multiplication' : 'Πολλαπλασιασμός', totalStr]
        },
        correctVal: totalL,
        correctStr: formatNum(totalL, locale, 1),
        explanationHtml: isEn
          ? `<span class="inline-flex items-center align-middle">${fracHtml}</span> of a liter equals ${formatNum(capacityL, locale, 1)} L. For 10 bottles: 10 · ${formatNum(capacityL, locale, 1)} ＝ ${totalStr}.`
          : `<span class="inline-flex items-center align-middle">${fracHtml}</span> του λίτρου ισούται με ${formatNum(capacityL, locale, 1)} L. Για 10 μπουκάλια: 10 · ${formatNum(capacityL, locale, 1)} ＝ ${totalStr}.`,
        explanation: isEn
          ? `${fracNumer}/10 of a liter equals ${formatNum(capacityL, locale, 1)} L. For 10 bottles: 10 · ${formatNum(capacityL, locale, 1)} ＝ ${totalStr}.`
          : `${fracNumer}/10 του λίτρου ισούται με ${formatNum(capacityL, locale, 1)} L. Για 10 μπουκάλια: 10 · ${formatNum(capacityL, locale, 1)} ＝ ${totalStr}.`
      };
    }
  },
  {
    id: 'p_klasm_std_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const tenths = randInt(115, 185);
      const ribbonM = Number((tenths / 100).toFixed(2));
      const fracNum = tenths;
      const fracDen = 100;
      const fracHtml = renderFraction(fracNum, fracDen);

      return {
        title: isEn ? 'DECIMAL FRACTION NUMERATOR' : 'ΑΡΙΘΜΗΤΗΣ ΔΕΚΑΔΙΚΟΥ ΚΛΑΣΜΑΤΟΣ',
        instruction: isEn ? 'Enter the numerator of the decimal fraction (integer):' : 'Συμπληρώστε τον αριθμητή του δεκαδικού κλάσματος (ακέραιος):',
        text: isEn
          ? `A ribbon has a length of ${formatNum(ribbonM, locale)} m. What is the numerator of the decimal fraction with a denominator of 100 that equals the ribbon's length?`
          : `Μια κορδέλα έχει μήκος ${formatNum(ribbonM, locale)} m. Ποιος είναι ο αριθμητής του δεκαδικού κλάσματος με παρονομαστή το 100 που ισούται με το μήκος της κορδέλας;`,
        tableData: {
          col1: isEn ? 'Length' : 'Μήκος',
          col2: isEn ? 'Denominator' : 'Παρονομαστής',
          r1: [`${formatNum(ribbonM, locale)} m`, `${fracDen}`],
          r2: [isEn ? 'Numerator' : 'Αριθμητής', `${fracNum}`]
        },
        correctVal: fracNum,
        correctStr: String(fracNum),
        explanationHtml: isEn
          ? `The number ${formatNum(ribbonM, locale)} has 2 decimal places, so it is written as <span class="inline-flex items-center align-middle">${fracHtml}</span>. The numerator is ${fracNum}.`
          : `Ο αριθμός ${formatNum(ribbonM, locale)} έχει 2 δεκαδικά ψηφία, άρα γράφεται ως <span class="inline-flex items-center align-middle">${fracHtml}</span>. Ο αριθμητής είναι ${fracNum}.`,
        explanation: isEn
          ? `The number ${formatNum(ribbonM, locale)} has 2 decimal places, so it is written as ${fracNum}/${fracDen}. The numerator is ${fracNum}.`
          : `Ο αριθμός ${formatNum(ribbonM, locale)} έχει 2 δεκαδικά ψηφία, άρα γράφεται ως ${fracNum}/${fracDen}. Ο αριθμητής είναι ${fracNum}.`
      };
    }
  },
  {
    id: 'p_klasm_std_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const sackKg = randInt(25, 85);
      const decKg = Number((sackKg / 10).toFixed(1));
      const decStr = formatNum(decKg, locale, 1);
      const fracHtml = renderFraction(sackKg, 10);

      return {
        title: isEn ? 'WEIGHT CONVERSION TO DECIMAL' : 'ΜΕΤΑΤΡΟΠΗ ΒΑΡΟΥΣ ΣΕ ΔΕΚΑΔΙΚΟ',
        instruction: isEn ? 'Write the weight as a decimal in kilograms (kg):' : 'Γράψτε το βάρος ως δεκαδικό αριθμό σε κιλά (kg) με κόμμα:',
        textHtml: isEn
          ? `A sack contains <span class="inline-flex items-center align-middle">${fracHtml}</span> of a kilogram of flour. Which decimal number in kilograms (kg) corresponds to this amount?`
          : `Ένα σακί περιέχει <span class="inline-flex items-center align-middle">${fracHtml}</span> του κιλού αλεύρι. Ποιος δεκαδικός αριθμός σε κιλά (kg) αντιστοιχεί σε αυτή την ποσότητα;`,
        text: isEn
          ? `A sack contains ${sackKg}/10 of a kilogram of flour. Which decimal number in kilograms (kg) corresponds to this amount?`
          : `Ένα σακί περιέχει ${sackKg}/10 του κιλού αλεύρι. Ποιος δεκαδικός αριθμός σε κιλά (kg) αντιστοιχεί σε αυτή την ποσότητα;`,
        tableData: {
          col1: isEn ? 'Decimal Fraction' : 'Δεκαδικό Κλάσμα',
          col2: isEn ? 'Decimal Form' : 'Δεκαδική Μορφή',
          r1: [`${sackKg}/10 kg`, isEn ? 'Divide by 10' : 'Διαίρεση με 10'],
          r2: [isEn ? 'Result' : 'Αποτέλεσμα', `${decStr} kg`]
        },
        correctVal: decKg,
        correctStr: decStr,
        explanationHtml: isEn
          ? `<span class="inline-flex items-center align-middle">${fracHtml}</span> ＝ ${sackKg} : 10 ＝ ${decStr} kg.`
          : `<span class="inline-flex items-center align-middle">${fracHtml}</span> ＝ ${sackKg} : 10 ＝ ${decStr} kg.`,
        explanation: isEn
          ? `${sackKg}/10 ＝ ${sackKg} : 10 ＝ ${decStr} kg.`
          : `${sackKg}/10 ＝ ${sackKg} : 10 ＝ ${decStr} kg.`
      };
    }
  },
  {
    id: 'p_klasm_std_5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const wireM = randInt(12, 48);
      const decM = Number((wireM / 100).toFixed(2));
      const decStr = formatNum(decM, locale, 2);
      const fracHtml = renderFraction(wireM, 100);

      return {
        title: isEn ? 'WIRE LENGTH' : 'ΜΗΚΟΣ ΣΥΡΜΑΤΟΣ',
        instruction: isEn ? 'Write the length as a decimal in meters (m):' : 'Γράψτε το μήκος ως δεκαδικό αριθμό σε μέτρα (m) με κόμμα:',
        textHtml: isEn
          ? `A piece of wire has a length of <span class="inline-flex items-center align-middle">${fracHtml}</span> of a meter. Which decimal number in meters (m) represents the wire length?`
          : `Ένα κομμάτι σύρματος έχει μήκος <span class="inline-flex items-center align-middle">${fracHtml}</span> του μέτρου. Ποιος δεκαδικός αριθμός σε μέτρα (m) εκφράζει το μήκος του σύρματος;`,
        text: isEn
          ? `A piece of wire has a length of ${wireM}/100 of a meter. Which decimal number in meters (m) represents the wire length?`
          : `Ένα κομμάτι σύρματος έχει μήκος ${wireM}/100 του μέτρου. Ποιος δεκαδικός αριθμός σε μέτρα (m) εκφράζει το μήκος του σύρματος;`,
        tableData: {
          col1: isEn ? 'Decimal Fraction' : 'Δεκαδικό Κλάσμα',
          col2: isEn ? 'Decimal Number' : 'Δεκαδικός Αριθμός',
          r1: [`${wireM}/100 m`, isEn ? '2 decimal digits' : '2 δεκαδικά ψηφία'],
          r2: [isEn ? 'Result' : 'Αποτέλεσμα', `${decStr} m`]
        },
        correctVal: decM,
        correctStr: decStr,
        explanationHtml: isEn
          ? `<span class="inline-flex items-center align-middle">${fracHtml}</span> ＝ ${wireM} : 100 ＝ ${decStr} m.`
          : `<span class="inline-flex items-center align-middle">${fracHtml}</span> ＝ ${wireM} : 100 ＝ ${decStr} m.`,
        explanation: isEn
          ? `${wireM}/100 ＝ ${wireM} : 100 ＝ ${decStr} m.`
          : `${wireM}/100 ＝ ${wireM} : 100 ＝ ${decStr} m.`
      };
    }
  },
  {
    id: 'p_klasm_std_6',
    generate: (locale) => {
      const isEn = locale === 'en';
      const thousands = randInt(125, 875);
      const decKm = Number((thousands / 1000).toFixed(3));
      const decStr = formatNum(decKm, locale, 3);
      const thousandDenom = isEn ? '1,000' : '1.000';
      const fracHtml = renderFraction(thousands, thousandDenom);

      return {
        title: isEn ? 'DISTANCE IN KILOMETERS' : 'ΑΠΟΣΤΑΣΗ ΣΕ ΧΙΛΙΟΜΕΤΡΑ',
        instruction: isEn ? 'Write the distance as a decimal in kilometers (km):' : 'Γράψτε την απόσταση ως δεκαδικό αριθμό σε χιλιόμετρα (km) με κόμμα:',
        textHtml: isEn
          ? `A path is <span class="inline-flex items-center align-middle">${fracHtml}</span> of a kilometer long. Which decimal number in kilometers (km) is equal to this path?`
          : `Μια διαδρομή έχει μήκος <span class="inline-flex items-center align-middle">${fracHtml}</span> του χιλιομέτρου. Ποιος δεκαδικός αριθμός σε χιλιόμετρα (km) ισούται με τη διαδρομή αυτή;`,
        text: isEn
          ? `A path is ${thousands}/${thousandDenom} of a kilometer long. Which decimal number in kilometers (km) is equal to this path?`
          : `Μια διαδρομή έχει μήκος ${thousands}/${thousandDenom} του χιλιομέτρου. Ποιος δεκαδικός αριθμός σε χιλιόμετρα (km) ισούται με τη διαδρομή αυτή;`,
        tableData: {
          col1: isEn ? 'Decimal Fraction' : 'Δεκαδικό Κλάσμα',
          col2: isEn ? 'Decimal Number' : 'Δεκαδικός Αριθμός',
          r1: [`${thousands}/${thousandDenom} km`, isEn ? '3 decimal digits' : '3 δεκαδικά ψηφία'],
          r2: [isEn ? 'Result' : 'Αποτέλεσμα', `${decStr} km`]
        },
        correctVal: decKm,
        correctStr: decStr,
        explanationHtml: isEn
          ? `<span class="inline-flex items-center align-middle">${fracHtml}</span> ＝ ${thousands} : 1000 ＝ ${decStr} km.`
          : `<span class="inline-flex items-center align-middle">${fracHtml}</span> ＝ ${thousands} : 1.000 ＝ ${decStr} km.`,
        explanation: isEn
          ? `${thousands}/${thousandDenom} ＝ ${thousands} : 1000 ＝ ${decStr} km.`
          : `${thousands}/${thousandDenom} ＝ ${thousands} : 1.000 ＝ ${decStr} km.`
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'p_klasm_hard_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const a = randInt(2, 5);
      const bTenths = randInt(3, 7);
      const cHundr = randInt(2, 8);
      const totalDec = Number((a + bTenths * 0.1 + cHundr * 0.01).toFixed(2));
      const totalNum = a * 100 + bTenths * 10 + cHundr;

      const correctStr = String(totalNum);
      const fake1 = String(totalNum + 10);
      const fake2 = String(Math.max(10, totalNum - 10));
      const fake3 = String(a * 10 + bTenths * 10 + cHundr);

      const uniqueList = makeUniqueOptions(correctStr, [fake1, fake2, fake3], (i) =>
        String(totalNum + (i + 1) * 5)
      );
      const options = uniqueList.map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      const fA = renderFraction(a * 100, 100);
      const fB = renderFraction(bTenths * 10, 100);
      const fC = renderFraction(cHundr, 100);
      const fTot = renderFraction(totalNum, 100);

      return {
        title: isEn ? 'MIXTURE COMPOSITION IN HUNDREDTHS' : 'ΣΥΝΘΕΣΗ ΜΕΙΓΜΑΤΟΣ ΣΕ ΕΚΑΤΟΣΤΑ',
        instruction: isEn ? 'Select the correct numerator of the decimal fraction:' : 'Επιλέξτε τον σωστό αριθμητή του δεκαδικού κλάσματος:',
        textHtml: isEn
          ? `A mixture contains ${a} whole units, <span class="inline-flex items-center align-middle">${renderFraction(bTenths, 10)}</span> of a unit, and <span class="inline-flex items-center align-middle">${renderFraction(cHundr, 100)}</span> of a unit. What is the numerator if we write the entire quantity as a decimal fraction with a denominator of 100?`
          : `Ένα μείγμα περιέχει ${a} ακέραιες μονάδες, <span class="inline-flex items-center align-middle">${renderFraction(bTenths, 10)}</span> της μονάδας και <span class="inline-flex items-center align-middle">${renderFraction(cHundr, 100)}</span> της μονάδας. Ποιος είναι ο αριθμητής αν γράψουμε όλη την ποσότητα ως δεκαδικό κλάσμα με παρονομαστή το 100;`,
        text: isEn
          ? `A mixture contains ${a} whole units, ${bTenths}/10 of a unit, and ${cHundr}/100 of a unit. What is the numerator if we write the entire quantity as a decimal fraction with a denominator of 100?`
          : `Ένα μείγμα περιέχει ${a} ακέραιες μονάδες, ${bTenths}/10 της μονάδας και ${cHundr}/100 της μονάδας. Ποιος είναι ο αριθμητής αν γράψουμε όλη την ποσότητα ως δεκαδικό κλάσμα με παρονομαστή το 100;`,
        tableData: {
          col1: isEn ? 'Mixture' : 'Μείγμα',
          col2: isEn ? 'Conversion to hundredths' : 'Αναγωγή σε εκατοστά',
          r1: [`${a} unit ＝ ${a * 100}/100`, `${bTenths}/10 ＝ ${bTenths * 10}/100`],
          r2: [`${cHundr}/100`, isEn ? `Numerator: ${totalNum}` : `Αριθμητής: ${totalNum}`]
        },
        correctVal: totalNum,
        correctStr,
        options,
        correctText: correctStr,
        explanationHtml: isEn
          ? `Convert all parts to hundredths: <span class="inline-flex items-center align-middle">${fA}</span> ＋ <span class="inline-flex items-center align-middle">${fB}</span> ＋ <span class="inline-flex items-center align-middle">${fC}</span> ＝ <span class="inline-flex items-center align-middle">${fTot}</span>. The numerator is ${totalNum} (equals ${formatNum(totalDec, locale, 2)}).`
          : `Μετατρέπουμε όλα τα μέρη σε εκατοστά: <span class="inline-flex items-center align-middle">${fA}</span> ＋ <span class="inline-flex items-center align-middle">${fB}</span> ＋ <span class="inline-flex items-center align-middle">${fC}</span> ＝ <span class="inline-flex items-center align-middle">${fTot}</span>. Ο αριθμητής είναι το ${totalNum} (ισούται με ${formatNum(totalDec, locale, 2)}).`,
        explanation: isEn
          ? `Convert all parts to hundredths: ${a * 100}/100 ＋ ${bTenths * 10}/100 ＋ ${cHundr}/100 ＝ ${totalNum}/100. The numerator is ${totalNum} (equals ${formatNum(totalDec, locale, 2)}).`
          : `Μετατρέπουμε όλα τα μέρη σε εκατοστά: ${a * 100}/100 ＋ ${bTenths * 10}/100 ＋ ${cHundr}/100 ＝ ${totalNum}/100. Ο αριθμητής είναι το ${totalNum} (ισούται με ${formatNum(totalDec, locale, 2)}).`
      };
    }
  },
  {
    id: 'p_klasm_hard_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const f1Numer = 35;
      const f2Tenths = 4;
      const sum = Number((f1Numer / 100 + f2Tenths / 10).toFixed(2));
      const correctStr = `${formatNum(sum, locale, 2)} m`;
      const fake1 = `${formatNum(Number((sum + 0.15).toFixed(2)), locale, 2)} m`;
      const fake2 = `${formatNum(Number((Math.max(0.1, sum - 0.2)).toFixed(2)), locale, 2)} m`;
      const fake3 = `${formatNum(Number((sum + 0.35).toFixed(2)), locale, 2)} m`;

      const uniqueList = makeUniqueOptions(correctStr, [fake1, fake2, fake3], (i) =>
        `${formatNum(Number((sum + (i + 1) * 0.1).toFixed(2)), locale, 2)} m`
      );
      const options = uniqueList.map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      const f1Html = renderFraction(f1Numer, 100);
      const f2Html = renderFraction(f2Tenths, 10);
      const f2Equiv = renderFraction(40, 100);

      return {
        title: isEn ? 'FABRIC LENGTH ADDITION' : 'ΠΡΟΣΘΕΣΗ ΜΗΚΩΝ ΥΦΑΣΜΑΤΟΣ',
        instruction: isEn ? 'Select the correct total length in meters (m):' : 'Επιλέξτε το σωστό συνολικό μήκος σε μέτρα (m):',
        textHtml: isEn
          ? `From a roll of fabric, <span class="inline-flex items-center align-middle">${f1Html}</span> of a meter was used in the morning and another <span class="inline-flex items-center align-middle">${f2Html}</span> of a meter in the afternoon. How many meters (m) of fabric were used in total?`
          : `Από ένα ύφασμα χρησιμοποιήθηκαν τα <span class="inline-flex items-center align-middle">${f1Html}</span> του μέτρου το πρωί και άλλα <span class="inline-flex items-center align-middle">${f2Html}</span> του μέτρου το απόγευμα. Πόσα μέτρα (m) υφάσματος χρησιμοποιήθηκαν συνολικά;`,
        text: isEn
          ? `From a roll of fabric, ${f1Numer}/100 of a meter was used in the morning and another ${f2Tenths}/10 of a meter in the afternoon. How many meters (m) of fabric were used in total?`
          : `Από ένα ύφασμα χρησιμοποιήθηκαν τα ${f1Numer}/100 του μέτρου το πρωί και άλλα ${f2Tenths}/10 του μέτρου το απόγευμα. Πόσα μέτρα (m) υφάσματος χρησιμοποιήθηκαν συνολικά;`,
        tableData: {
          col1: isEn ? 'Morning' : 'Πρωί',
          col2: isEn ? 'Afternoon' : 'Απόγευμα',
          r1: [`${f1Numer}/100 m ＝ ${formatNum(0.35, locale)} m`, `${f2Tenths}/10 m ＝ ${formatNum(0.40, locale)} m`],
          r2: [isEn ? 'Addition' : 'Πρόσθεση', `${correctStr}`]
        },
        correctVal: sum,
        correctStr,
        options,
        correctText: correctStr,
        explanationHtml: isEn
          ? `<span class="inline-flex items-center align-middle">${f1Html}</span> ＝ ${formatNum(0.35, locale)} m and <span class="inline-flex items-center align-middle">${f2Html}</span> ＝ <span class="inline-flex items-center align-middle">${f2Equiv}</span> ＝ ${formatNum(0.40, locale)} m. In total: ${formatNum(0.35, locale)} ＋ ${formatNum(0.40, locale)} ＝ ${correctStr}.`
          : `<span class="inline-flex items-center align-middle">${f1Html}</span> ＝ 0,35 m και <span class="inline-flex items-center align-middle">${f2Html}</span> ＝ <span class="inline-flex items-center align-middle">${f2Equiv}</span> ＝ 0,40 m. Συνολικά: 0,35 ＋ 0,40 ＝ ${correctStr}.`,
        explanation: isEn
          ? `${f1Numer}/100 ＝ ${formatNum(0.35, locale)} m and ${f2Tenths}/10 ＝ 40/100 ＝ ${formatNum(0.40, locale)} m. In total: ${formatNum(0.35, locale)} ＋ ${formatNum(0.40, locale)} ＝ ${correctStr} (or 75/100 m).`
          : `${f1Numer}/100 ＝ 0,35 m και ${f2Tenths}/10 ＝ 40/100 ＝ 0,40 m. Συνολικά: 0,35 ＋ 0,40 ＝ ${correctStr} (ή 75/100 m).`
      };
    }
  },
  {
    id: 'p_klasm_hard_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const l1Tenths = 6;
      const l2Hundr = 25;
      const sumL = Number((l1Tenths / 10 + l2Hundr / 100).toFixed(2));
      const correctStr = `${formatNum(sumL, locale, 2)} L`;
      const fake1 = `${formatNum(Number((sumL + 0.2).toFixed(2)), locale, 2)} L`;
      const fake2 = `${formatNum(Number((Math.max(0.1, sumL - 0.15)).toFixed(2)), locale, 2)} L`;
      const fake3 = `${formatNum(Number((sumL + 0.4).toFixed(2)), locale, 2)} L`;

      const uniqueList = makeUniqueOptions(correctStr, [fake1, fake2, fake3], (i) =>
        `${formatNum(Number((sumL + (i + 1) * 0.12).toFixed(2)), locale, 2)} L`
      );
      const options = uniqueList.map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      const f1Html = renderFraction(l1Tenths, 10);
      const f2Html = renderFraction(l2Hundr, 100);

      return {
        title: isEn ? 'LIQUID MIXING IN LITERS' : 'ΑΝΑΜΕΙΞΗ ΥΓΡΩΝ ΣΕ ΛΙΤΡΑ',
        instruction: isEn ? 'Select the total volume in liters (L):' : 'Επιλέξτε τον συνολικό όγκο σε λίτρα (L):',
        textHtml: isEn
          ? `In a container, we poured <span class="inline-flex items-center align-middle">${f1Html}</span> of a liter of water and <span class="inline-flex items-center align-middle">${f2Html}</span> of a liter of juice. How many liters (L) of liquid does the container hold in total?`
          : `Σε ένα δοχείο ρίξαμε <span class="inline-flex items-center align-middle">${f1Html}</span> του λίτρου νερό και <span class="inline-flex items-center align-middle">${f2Html}</span> του λίτρου χυμό. Πόσα λίτρα (L) υγρού περιέχει συνολικά το δοχείο;`,
        text: isEn
          ? `In a container, we poured ${l1Tenths}/10 of a liter of water and ${l2Hundr}/100 of a liter of juice. How many liters (L) of liquid does the container hold in total?`
          : `Σε ένα δοχείο ρίξαμε ${l1Tenths}/10 του λίτρου νερό και ${l2Hundr}/100 του λίτρου χυμό. Πόσα λίτρα (L) υγρού περιέχει συνολικά το δοχείο;`,
        tableData: {
          col1: isEn ? 'Water' : 'Νερό',
          col2: isEn ? 'Juice' : 'Χυμός',
          r1: [`${l1Tenths}/10 L ＝ ${formatNum(0.60, locale)} L`, `${l2Hundr}/100 L ＝ ${formatNum(0.25, locale)} L`],
          r2: [isEn ? 'Total' : 'Σύνολο', `${correctStr}`]
        },
        correctVal: sumL,
        correctStr,
        options,
        correctText: correctStr,
        explanationHtml: isEn
          ? `<span class="inline-flex items-center align-middle">${f1Html}</span> L ＝ ${formatNum(0.60, locale)} L and <span class="inline-flex items-center align-middle">${f2Html}</span> L ＝ ${formatNum(0.25, locale)} L. Total: ${formatNum(0.60, locale)} ＋ ${formatNum(0.25, locale)} ＝ ${correctStr}.`
          : `<span class="inline-flex items-center align-middle">${f1Html}</span> L ＝ 0,60 L και <span class="inline-flex items-center align-middle">${f2Html}</span> L ＝ 0,25 L. Άρα συνολικά: 0,60 ＋ 0,25 ＝ ${correctStr}.`,
        explanation: isEn
          ? `${l1Tenths}/10 L ＝ ${formatNum(0.60, locale)} L and ${l2Hundr}/100 L ＝ ${formatNum(0.25, locale)} L. Total: ${formatNum(0.60, locale)} ＋ ${formatNum(0.25, locale)} ＝ ${correctStr}.`
          : `${l1Tenths}/10 L ＝ 0,60 L και ${l2Hundr}/100 L ＝ 0,25 L. Άρα συνολικά: 0,60 ＋ 0,25 ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_klasm_hard_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const kg1 = 45;
      const kg2 = 3;
      const sumKg = Number((kg1 / 100 + kg2 / 10).toFixed(2));
      const correctStr = `${formatNum(sumKg, locale, 2)} kg`;
      const fake1 = `${formatNum(Number((sumKg + 0.1).toFixed(2)), locale, 2)} kg`;
      const fake2 = `${formatNum(Number((Math.max(0.1, sumKg - 0.2)).toFixed(2)), locale, 2)} kg`;
      const fake3 = `${formatNum(Number((sumKg + 0.25).toFixed(2)), locale, 2)} kg`;

      const uniqueList = makeUniqueOptions(correctStr, [fake1, fake2, fake3], (i) =>
        `${formatNum(Number((sumKg + (i + 1) * 0.15).toFixed(2)), locale, 2)} kg`
      );
      const options = uniqueList.map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      const f1Html = renderFraction(kg1, 100);
      const f2Html = renderFraction(kg2, 10);

      return {
        title: isEn ? 'TOTAL SPICE WEIGHT' : 'ΣΥΝΟΛΙΚΟ ΒΑΡΟΣ ΜΠΑΧΑΡΙΚΩΝ',
        instruction: isEn ? 'Select the total weight in kilograms (kg):' : 'Επιλέξτε το συνολικό βάρος σε κιλά (kg):',
        textHtml: isEn
          ? `A chef bought <span class="inline-flex items-center align-middle">${f1Html}</span> of a kilogram of cinnamon and <span class="inline-flex items-center align-middle">${f2Html}</span> of a kilogram of clove. How many kilograms (kg) of spices did they buy in total?`
          : `Ένας σεφ αγόρασε <span class="inline-flex items-center align-middle">${f1Html}</span> του κιλού κανέλα και <span class="inline-flex items-center align-middle">${f2Html}</span> του κιλού γαρίφαλο. Πόσα κιλά (kg) μπαχαρικών αγόρασε συνολικά;`,
        text: isEn
          ? `A chef bought ${kg1}/100 of a kilogram of cinnamon and ${kg2}/10 of a kilogram of clove. How many kilograms (kg) of spices did they buy in total?`
          : `Ένας σεφ αγόρασε ${kg1}/100 του κιλού κανέλα και ${kg2}/10 του κιλού γαρίφαλο. Πόσα κιλά (kg) μπαχαρικών αγόρασε συνολικά;`,
        tableData: {
          col1: isEn ? 'Cinnamon' : 'Κανέλα',
          col2: isEn ? 'Clove' : 'Γαρίφαλο',
          r1: [`${kg1}/100 kg ＝ ${formatNum(0.45, locale)} kg`, `${kg2}/10 kg ＝ ${formatNum(0.30, locale)} kg`],
          r2: [isEn ? 'Addition' : 'Πρόσθεση', `${correctStr}`]
        },
        correctVal: sumKg,
        correctStr,
        options,
        correctText: correctStr,
        explanationHtml: isEn
          ? `<span class="inline-flex items-center align-middle">${f1Html}</span> ＝ ${formatNum(0.45, locale)} kg and <span class="inline-flex items-center align-middle">${f2Html}</span> ＝ ${formatNum(0.30, locale)} kg. In total: ${formatNum(0.45, locale)} ＋ ${formatNum(0.30, locale)} ＝ ${correctStr}.`
          : `<span class="inline-flex items-center align-middle">${f1Html}</span> ＝ 0,45 kg και <span class="inline-flex items-center align-middle">${f2Html}</span> ＝ 0,30 kg. Συνολικά: 0,45 ＋ 0,30 ＝ ${correctStr}.`,
        explanation: isEn
          ? `${kg1}/100 ＝ ${formatNum(0.45, locale)} kg and ${kg2}/10 ＝ ${formatNum(0.30, locale)} kg. In total: ${formatNum(0.45, locale)} ＋ ${formatNum(0.30, locale)} ＝ ${correctStr}.`
          : `${kg1}/100 ＝ 0,45 kg και ${kg2}/10 ＝ 0,30 kg. Συνολικά: 0,45 ＋ 0,30 ＝ ${correctStr}.`
      };
    }
  },
  {
    id: 'p_klasm_hard_5',
    generate: (locale) => {
      const isEn = locale === 'en';
      const totalKm = 1;
      const walkedTenths = 7;
      const walkedDec = walkedTenths / 10;
      const remainKm = Number((totalKm - walkedDec).toFixed(1));
      const correctStr = `${formatNum(remainKm, locale, 1)} km`;
      const fake1 = `${formatNum(Number((remainKm + 0.2).toFixed(1)), locale, 1)} km`;
      const fake2 = `${formatNum(Number((Math.max(0.1, remainKm - 0.1)).toFixed(1)), locale, 1)} km`;
      const fake3 = `${formatNum(0.7, locale, 1)} km`;

      const uniqueList = makeUniqueOptions(correctStr, [fake1, fake2, fake3], (i) =>
        `${formatNum(Number((remainKm + (i + 1) * 0.1).toFixed(1)), locale, 1)} km`
      );
      const options = uniqueList.map((text) => ({
        text,
        isCorrect: text === correctStr
      }));

      const fWalked = renderFraction(walkedTenths, 10);
      const fFull = renderFraction(10, 10);
      const fRemain = renderFraction(3, 10);

      return {
        title: isEn ? 'REMAINING RUN DISTANCE' : 'ΥΠΟΛΟΙΠΟ ΔΙΑΔΡΟΜΗΣ ΣΕ ΧΙΛΙΟΜΕΤΡΑ',
        instruction: isEn ? 'Select the remaining distance in kilometers (km):' : 'Επιλέξτε την υπολειπόμενη απόσταση σε χιλιόμετρα (km):',
        textHtml: isEn
          ? `A running track is exactly 1 km long. A runner has covered <span class="inline-flex items-center align-middle">${fWalked}</span> of a kilometer. How many kilometers (km) remain to complete the lap?`
          : `Μια κυκλική πίστα έχει μήκος ακριβώς 1 km. Ένας αθλητής διένυσε τα <span class="inline-flex items-center align-middle">${fWalked}</span> του χιλιομέτρου. Πόσα χιλιόμετρα (km) του απομένουν για να ολοκληρώσει τον γύρο;`,
        text: isEn
          ? `A running track is exactly 1 km long. A runner has covered ${walkedTenths}/10 of a kilometer. How many kilometers (km) remain to complete the lap?`
          : `Μια κυκλική πίστα έχει μήκος ακριβώς 1 km. Ένας αθλητής διένυσε τα ${walkedTenths}/10 του χιλιομέτρου. Πόσα χιλιόμετρα (km) του απομένουν για να ολοκληρώσει τον γύρο;`,
        tableData: {
          col1: isEn ? 'Full Lap' : 'Συνολικός Γύρος',
          col2: isEn ? 'Distance Covered' : 'Διανυθείσα Απόσταση',
          r1: ['1 km ＝ 10/10 km', `${walkedTenths}/10 km ＝ ${formatNum(0.7, locale)} km`],
          r2: [isEn ? 'Remaining' : 'Υπόλοιπο', `${correctStr}`]
        },
        correctVal: remainKm,
        correctStr,
        options,
        correctText: correctStr,
        explanationHtml: isEn
          ? `1 km ＝ <span class="inline-flex items-center align-middle">${fFull}</span> km. Subtract: <span class="inline-flex items-center align-middle">${fFull}</span> － <span class="inline-flex items-center align-middle">${fWalked}</span> ＝ <span class="inline-flex items-center align-middle">${fRemain}</span> km ＝ ${correctStr}.`
          : `1 km ＝ <span class="inline-flex items-center align-middle">${fFull}</span> km. Αφαιρούμε: <span class="inline-flex items-center align-middle">${fFull}</span> － <span class="inline-flex items-center align-middle">${fWalked}</span> ＝ <span class="inline-flex items-center align-middle">${fRemain}</span> km ＝ ${correctStr}.`,
        explanation: isEn
          ? `1 km ＝ 10/10 km. Subtract: 10/10 － ${walkedTenths}/10 ＝ 3/10 km ＝ ${correctStr}.`
          : `1 km ＝ 10/10 km. Αφαιρούμε: 10/10 － ${walkedTenths}/10 ＝ 3/10 km ＝ ${correctStr}.`
      };
    }
  }
];

function generateQuestions(locale = 'el') {
  const isEn = locale === 'en';
  const sep = isEn ? '.' : ',';
  const qList = [];

  // Q1 (Input - Decimal): Δεκαδικός σε Δεκαδικό Κλάσμα (Εύρεση Αριθμητή)
  {
    const denomPool = [10, 100, 1000];
    const denom = denomPool[randInt(0, 2)];
    let numer = 0;
    let decStr = '';

    if (denom === 10) {
      numer = randInt(1, 9);
      decStr = `0${sep}${numer}`;
    } else if (denom === 100) {
      numer = randInt(11, 89);
      decStr = `0${sep}${numer}`;
    } else {
      numer = randInt(105, 750);
      decStr = `0${sep}${numer}`;
    }

    const denomFormatted = denom.toLocaleString(isEn ? 'en-US' : 'el-GR');
    const fracPromptHtml = renderFraction('x', denomFormatted);
    const fracExplHtml = renderFraction(numer, denomFormatted);

    qList.push({
      id: 1,
      type: 'decimal_input',
      title: isEn ? 'QUESTION 1 • TO DECIMAL FRACTION (NUMERATOR)' : 'ΕΡΩΤΗΣΗ 1 • ΣΕ ΔΕΚΑΔΙΚΟ ΚΛΑΣΜΑ (ΑΡΙΘΜΗΤΗΣ)',
      instruction: isEn ? 'Enter the numerator x to make the equality true (integer):' : 'Συμπληρώστε τον αριθμητή ώστε να ισχύει η ισότητα (ακέραιος):',
      promptHtml: isEn
        ? `In the equality ${decStr} ＝ <span class="inline-flex items-center align-middle">${fracPromptHtml}</span>, what is the numerator x?`
        : `Στην ισότητα ${decStr} ＝ <span class="inline-flex items-center align-middle">${fracPromptHtml}</span>, ποιος είναι ο αριθμητής x;`,
      prompt: isEn
        ? `In the equality ${decStr} ＝ x / ${denomFormatted}, what is the numerator x?`
        : `Στην ισότητα ${decStr} ＝ x / ${denomFormatted}, ποιος είναι ο αριθμητής x;`,
      correctVal: numer,
      correctStr: String(numer),
      explanationHtml: isEn
        ? `The number ${decStr} has ${denom === 10 ? '1 decimal digit' : denom === 100 ? '2 decimal digits' : '3 decimal digits'}, so ${decStr} ＝ <span class="inline-flex items-center align-middle">${fracExplHtml}</span>. The numerator is ${numer}.`
        : `Ο αριθμός ${decStr} έχει ${denom === 10 ? '1 δεκαδικό ψηφίο' : denom === 100 ? '2 δεκαδικά ψηφία' : '3 δεκαδικά ψηφία'}, άρα ${decStr} ＝ <span class="inline-flex items-center align-middle">${fracExplHtml}</span>. Ο αριθμητής είναι το ${numer}.`,
      explanation: isEn
        ? `The number ${decStr} has ${denom === 10 ? '1 decimal digit' : denom === 100 ? '2 decimal digits' : '3 decimal digits'}, so ${decStr} ＝ ${numer} / ${denomFormatted}. The numerator is ${numer}.`
        : `Ο αριθμός ${decStr} έχει ${denom === 10 ? '1 δεκαδικό ψηφίο' : denom === 100 ? '2 δεκαδικά ψηφία' : '3 δεκαδικά ψηφία'}, άρα ${decStr} ＝ ${numer} / ${denomFormatted}. Ο αριθμητής είναι το ${numer}.`
    });
  }

  // Q2 (Input - Decimal): Μετατροπή Δεκαδικού Κλάσματος σε Δεκαδικό Αριθμό
  {
    const denomType = randInt(1, 3);
    let numer = 0;
    let denom = 10;
    let decAnswer = 0;

    if (denomType === 1) {
      numer = randInt(3, 9);
      denom = 10;
      decAnswer = numer / 10;
    } else if (denomType === 2) {
      numer = randInt(5, 95);
      denom = 100;
      decAnswer = numer / 100;
    } else {
      numer = randInt(12, 650);
      denom = 1000;
      decAnswer = numer / 1000;
    }

    const denomFormatted = denom.toLocaleString(isEn ? 'en-US' : 'el-GR');
    const answerStr = formatNum(decAnswer, locale, denom === 10 ? 1 : denom === 100 ? 2 : 3);
    const fracHtml = renderFraction(numer, denomFormatted);

    qList.push({
      id: 2,
      type: 'decimal_input',
      title: isEn ? 'QUESTION 2 • FRACTION TO DECIMAL NUMBER' : 'ΕΡΩΤΗΣΗ 2 • ΚΛΑΣΜΑ ΣΕ ΔΕΚΑΔΙΚΟ ΑΡΙΘΜΟ',
      instruction: isEn ? 'Write the fraction as a decimal number:' : 'Γράψτε το κλάσμα ως δεκαδικό αριθμό με κόμμα:',
      promptHtml: isEn
        ? `Which decimal number equals the decimal fraction <span class="inline-flex items-center align-middle">${fracHtml}</span>?`
        : `Ποιος δεκαδικός αριθμός ισούται με το δεκαδικό κλάσμα <span class="inline-flex items-center align-middle">${fracHtml}</span>;`,
      prompt: isEn
        ? `Which decimal number equals the decimal fraction ${numer} / ${denomFormatted}?`
        : `Ποιος δεκαδικός αριθμός ισούται με το δεκαδικό κλάσμα ${numer} / ${denomFormatted};`,
      correctVal: decAnswer,
      correctStr: answerStr,
      explanationHtml: isEn
        ? `Dividing ${numer} by ${denomFormatted} shifts the decimal point ${denom === 10 ? '1 place' : denom === 100 ? '2 places' : '3 places'} left: <span class="inline-flex items-center align-middle">${fracHtml}</span> ＝ ${numer} : ${denomFormatted} ＝ ${answerStr}.`
        : `Διαιρώντας το ${numer} με το ${denomFormatted} μετακινούμε την υποδιαστολή ${denom === 10 ? '1 θέση' : denom === 100 ? '2 θέσεις' : '3 θέσεις'} αριστερά: <span class="inline-flex items-center align-middle">${fracHtml}</span> ＝ ${numer} : ${denomFormatted} ＝ ${answerStr}.`,
      explanation: isEn
        ? `Dividing ${numer} by ${denomFormatted} shifts the decimal point ${denom === 10 ? '1 place' : denom === 100 ? '2 places' : '3 places'} left: ${numer} : ${denomFormatted} ＝ ${answerStr}.`
        : `Διαιρώντας το ${numer} με το ${denomFormatted} μετακινούμε την υποδιαστολή ${denom === 10 ? '1 θέση' : denom === 100 ? '2 θέσεις' : '3 θέσεις'} αριστερά: ${numer} : ${denomFormatted} ＝ ${answerStr}.`
    });
  }

  // Q3 (MCQ): Επιλογή ισοδύναμου δεκαδικού κλάσματος
  {
    const tenthsDigit = randInt(2, 8);
    const decVal = tenthsDigit / 10;
    const decStr = formatNum(decVal, locale, 1);
    const correctFrac = `${tenthsDigit * 10}/100`;

    const rawOptions = [
      correctFrac,
      `${tenthsDigit}/100`,
      `${tenthsDigit * 10}/10`,
      `${tenthsDigit * 100}/100`
    ];
    const uniqueOptions = makeUniqueOptions(correctFrac, rawOptions, (i) =>
      `${(tenthsDigit + i) * 10}/100`
    );
    const options = uniqueOptions.map((text) => ({
      text,
      isCorrect: text === correctFrac
    }));

    const origFracHtml = renderFraction(tenthsDigit, 10);
    const equivFracHtml = renderFraction(tenthsDigit * 10, 100);

    qList.push({
      id: 3,
      type: 'mcq',
      title: isEn ? 'QUESTION 3 • EQUIVALENT DECIMAL FRACTIONS' : 'ΕΡΩΤΗΣΗ 3 • ΙΣΟΔΥΝΑΜΑ ΔΕΚΑΔΙΚΑ ΚΛΑΣΜΑΤΑ',
      instruction: isEn ? 'Select the correct equivalent fraction:' : 'Επιλέξτε το σωστό ισοδύναμο κλάσμα:',
      prompt: isEn
        ? `Which of the following decimal fractions is equal to ${decStr}?`
        : `Ποιο από τα παρακάτω δεκαδικά κλάσματα είναι ίσο με τον αριθμό ${decStr};`,
      options,
      correctText: correctFrac,
      explanationHtml: isEn
        ? `${decStr} equals <span class="inline-flex items-center align-middle">${origFracHtml}</span>. Multiplying numerator and denominator by 10 yields the equivalent fraction <span class="inline-flex items-center align-middle">${equivFracHtml}</span>.`
        : `Το ${decStr} ισούται με <span class="inline-flex items-center align-middle">${origFracHtml}</span>. Πολλαπλασιάζοντας αριθμητή και παρονομαστή με το 10, προκύπτει το ισοδύναμο κλάσμα <span class="inline-flex items-center align-middle">${equivFracHtml}</span>.`,
      explanation: isEn
        ? `${decStr} equals ${tenthsDigit}/10. Multiplying numerator and denominator by 10 yields the equivalent fraction ${correctFrac}.`
        : `Το ${decStr} ισούται με ${tenthsDigit}/10. Πολλαπλασιάζοντας αριθμητή και παρονομαστή με το 10, προκύπτει το ισοδύναμο κλάσμα ${correctFrac}.`
    });
  }

  // Q4 (MCQ): Σύγκριση Δεκαδικού με Δεκαδικό Κλάσμα
  {
    const tenths = randInt(4, 8);
    const fracStr = `${tenths * 10}/100`;
    const correctDec = formatNum(tenths / 10, locale, 2);
    const w1 = formatNum((tenths + 1) / 10, locale, 1);
    const w2 = formatNum((tenths - 2) / 10, locale, 1);
    const w3 = `0${sep}0${tenths}`;

    const uniqueOptions = makeUniqueOptions(correctDec, [w1, w2, w3], (i) =>
      formatNum((tenths + i + 2) / 10, locale, 2)
    );
    const options = uniqueOptions.map((text) => ({
      text,
      isCorrect: text === correctDec
    }));

    const fracHtml = renderFraction(tenths * 10, 100);
    const simpFracHtml = renderFraction(tenths, 10);

    qList.push({
      id: 4,
      type: 'mcq',
      title: isEn ? 'QUESTION 4 • COMPARISON & EQUIVALENCE' : 'ΕΡΩΤΗΣΗ 4 • ΣΥΓΚΡΙΣΗ & ΙΣΟΔΥΝΑΜΙΑ',
      instruction: isEn ? 'Select the equal decimal number:' : 'Επιλέξτε τον ίσο δεκαδικό αριθμό:',
      promptHtml: isEn
        ? `Which decimal number is equal to the decimal fraction <span class="inline-flex items-center align-middle">${fracHtml}</span>?`
        : `Ποιος δεκαδικός αριθμός είναι ίσος με το δεκαδικό κλάσμα <span class="inline-flex items-center align-middle">${fracHtml}</span>;`,
      prompt: isEn
        ? `Which decimal number is equal to the decimal fraction ${fracStr}?`
        : `Ποιος δεκαδικός αριθμός είναι ίσος με το δεκαδικό κλάσμα ${fracStr};`,
      options,
      correctText: correctDec,
      explanationHtml: isEn
        ? `The fraction <span class="inline-flex items-center align-middle">${fracHtml}</span> simplifies to <span class="inline-flex items-center align-middle">${simpFracHtml}</span> ＝ ${correctDec}.`
        : `Το κλάσμα <span class="inline-flex items-center align-middle">${fracHtml}</span> απλοποιείται σε <span class="inline-flex items-center align-middle">${simpFracHtml}</span> ＝ ${correctDec}.`,
      explanation: isEn
        ? `The fraction ${fracStr} simplifies to ${tenths}/10 ＝ ${correctDec}.`
        : `Το κλάσμα ${fracStr} απλοποιείται σε ${tenths}/10 ＝ ${correctDec}.`
    });
  }

  // Q5 (MCQ): Κανόνας των Μηδενικών (4 μοναδικές επιλογές)
  {
    const q5IsTrue = Math.random() > 0.5;
    const q5Text = isEn
      ? (q5IsTrue
          ? 'In the fraction 45/100, the denominator has 2 zeros, so the decimal number (0.45) has exactly 2 decimal digits.'
          : 'In the fraction 45/100, the denominator has 2 zeros, so the decimal number will be 4.5 (1 decimal digit).')
      : (q5IsTrue
          ? 'Στο κλάσμα 45/100, ο παρονομαστής έχει 2 μηδενικά, άρα ο δεκαδικός αριθμός (0,45) έχει ακριβώς 2 δεκαδικά ψηφία.'
          : 'Στο κλάσμα 45/100, ο παρονομαστής έχει 2 μηδενικά, άρα ο δεκαδικός αριθμός θα είναι το 4,5 (1 δεκαδικό ψηφίο).');

    const c1 = isEn
      ? 'True: The number of zeros in the denominator (2) equals the number of decimal places (2).'
      : 'Σωστό: Το πλήθος των μηδενικών στον παρονομαστή (2) καθορίζει τα 2 δεκαδικά ψηφία (0,45).';
    const c2 = isEn
      ? 'False: 45/100 equals 0.45 (2 decimal digits), not 4.5.'
      : 'Λάθος: Το 45/100 ισούται με 0,45 (2 δεκαδικά ψηφία) και όχι με 4,5.';
    const w1 = isEn
      ? 'True: Every fraction with 100 in the denominator converts directly into a whole integer.'
      : 'Σωστό: Κάθε κλάσμα με παρονομαστή το 100 μετατρέπεται απευθείας σε ακέραιο αριθμό.';
    const w2 = isEn
      ? 'False: 45/100 corresponds to 3 decimal digits because 100 has three digits.'
      : 'Λάθος: Το 45/100 αντιστοιχεί σε 3 δεκαδικά ψηφία επειδή το 100 έχει τρία ψηφία.';

    const correctAns = q5IsTrue ? c1 : c2;
    const optionsPool = q5IsTrue ? [c1, c2, w1, w2] : [c2, c1, w1, w2];
    const uniqueOptions = makeUniqueOptions(correctAns, optionsPool);
    const options = uniqueOptions.map((text) => ({
      text,
      isCorrect: text === correctAns
    }));

    qList.push({
      id: 5,
      type: 'mcq',
      title: isEn ? 'QUESTION 5 • RULE OF ZEROS' : 'ΕΡΩΤΗΣΗ 5 • ΚΑΝΟΝΑΣ ΤΩΝ ΜΗΔΕΝΙΚΩΝ',
      instruction: isEn ? 'Select the correct statement evaluation:' : 'Επιλέξτε τη σωστή αξιολόγηση της πρότασης:',
      prompt: `«${q5Text}»`,
      options,
      correctText: correctAns,
      explanation: isEn
        ? (q5IsTrue
            ? 'Correct! The number of zeros in the denominator determines the exact number of decimal places.'
            : 'False! 45/100 has 2 zeros in the denominator, so it corresponds to 2 decimal places: 0.45.')
        : (q5IsTrue
            ? 'Σωστό! Το πλήθος των μηδενικών στον δεκαδικό παρονομαστή καθορίζει ακριβώς το πλήθος των δεκαδικών ψηφίων.'
            : 'Λάθος! 45/100 σημαίνει 2 μηδενικά στον παρονομαστή, άρα 2 δεκαδικά ψηφία: 0,45.')
    });
  }

  // Q6 (MCQ): Ισοδυναμία Μορφών (4 μοναδικές επιλογές)
  {
    const num = randInt(2, 7);
    const q6IsTrue = Math.random() > 0.5;
    const q6Text = isEn
      ? (q6IsTrue
          ? `The fractions ${num}/10 and ${num * 10}/100 represent exactly the same quantity (0.${num}).`
          : `The fraction ${num * 10}/100 is 10 times greater than ${num}/10.`)
      : (q6IsTrue
          ? `Τα κλάσματα ${num}/10 και ${num * 10}/100 εκφράζουν ακριβώς την ίδια ποσότητα (0,${num}).`
          : `Το κλάσμα ${num * 10}/100 είναι 10 φορές μεγαλύτερο από το κλάσμα ${num}/10.`);

    const c1 = isEn
      ? `True: ${num}/10 and ${num * 10}/100 are equivalent, both equal 0.${num}.`
      : `Σωστό: Τα ${num}/10 και ${num * 10}/100 είναι ισοδύναμα και ισούνται με 0,${num}.`;
    const c2 = isEn
      ? `False: The two fractions are equal; ${num * 10}/100 is not 10 times greater.`
      : `Λάθος: Τα δύο κλάσματα είναι ίσα· το ${num * 10}/100 δεν είναι 10 φορές μεγαλύτερο.`;
    const w1 = isEn
      ? `True: Adding a zero to the denominator always doubles the fraction value.`
      : `Σωστό: Η προσθήκη μηδενικού στον παρονομαστή διπλασιάζει πάντα την αξία του κλάσματος.`;
    const w2 = isEn
      ? `False: Fractions with denominator 100 are always smaller than any tenth.`
      : `Λάθος: Τα κλάσματα με παρονομαστή το 100 είναι πάντα μικρότερα από οποιοδήποτε δέκατο.`;

    const correctAns = q6IsTrue ? c1 : c2;
    const optionsPool = q6IsTrue ? [c1, c2, w1, w2] : [c2, c1, w1, w2];
    const uniqueOptions = makeUniqueOptions(correctAns, optionsPool);
    const options = uniqueOptions.map((text) => ({
      text,
      isCorrect: text === correctAns
    }));

    qList.push({
      id: 6,
      type: 'mcq',
      title: isEn ? 'QUESTION 6 • FORM EQUIVALENCE' : 'ΕΡΩΤΗΣΗ 6 • ΙΣΟΔΥΝΑΜΙΑ ΜΟΡΦΩΝ',
      instruction: isEn ? 'Select the correct statement evaluation:' : 'Επιλέξτε τη σωστή αξιολόγηση της πρότασης:',
      prompt: `«${q6Text}»`,
      options,
      correctText: correctAns,
      explanation: isEn
        ? (q6IsTrue
            ? 'Correct! Multiplying both numerator and denominator by 10 yields an equivalent fraction with identical value.'
            : `False! ${num}/10 and ${num * 10}/100 are equivalent fractions (both equal 0.${num}).`)
        : (q6IsTrue
            ? 'Σωστό! Πολλαπλασιάζοντας αριθμητή και παρονομαστή με το 10 προκύπτει ισοδύναμο κλάσμα με ίδια τιμή.'
            : `Λάθος! Τα ${num}/10 και ${num * 10}/100 είναι ισοδύναμα κλάσματα (εκφράζουν και τα δύο το 0,${num}).`)
    });
  }

  // Q7 (Input - Decimal): Οπτική Λωρίδα Δεκάτων
  {
    const count = randInt(2, 8);
    const decVal = count / 10;
    const decStr = formatNum(decVal, locale, 1);
    const fracHtml = renderFraction(count, 10);

    qList.push({
      id: 7,
      type: 'decimal_input',
      title: isEn ? 'QUESTION 7 • TENTHS STRIP' : 'ΕΡΩΤΗΣΗ 7 • ΟΠΤΙΚΗ ΛΩΡΙΔΑ ΔΕΚΑΤΩΝ',
      instruction: isEn ? 'Write the decimal number:' : 'Γράψτε τον δεκαδικό αριθμό με κόμμα:',
      prompt: isEn
        ? `In a strip divided into 10 equal parts, ${count} parts are shaded. Which decimal number represents the shaded portion?`
        : `Σε μια λωρίδα χωρισμένη σε 10 ίσα μέρη, έχουν χρωματιστεί τα ${count}. Ποιον δεκαδικό αριθμό εκφράζει το χρωματισμένο μέρος;`,
      correctVal: decVal,
      correctStr: decStr,
      explanationHtml: isEn
        ? `${count} out of 10 equal parts are shaded, so <span class="inline-flex items-center align-middle">${fracHtml}</span> ＝ ${decStr}.`
        : `Έχουν χρωματιστεί ${count} από τα 10 ίσα μέρη, δηλαδή <span class="inline-flex items-center align-middle">${fracHtml}</span> ＝ ${decStr}.`,
      explanation: isEn
        ? `${count} out of 10 equal parts are shaded, so ${count}/10 ＝ ${decStr}.`
        : `Έχουν χρωματιστεί ${count} από τα 10 ίσα μέρη, δηλαδή ${count}/10 ＝ ${decStr}.`
    });
  }

  // Q8 (MCQ): Οπτικό Πλέγμα Εκατοστών
  {
    const tens = randInt(2, 6);
    const units = randInt(1, 8);
    const totalSquares = tens * 10 + units;
    const decCorrect = formatNum(totalSquares / 100, locale, 2);
    const w1 = formatNum(totalSquares / 10, locale, 1);
    const w2 = `0${sep}0${totalSquares}`;
    const w3 = formatNum((totalSquares + 10) / 100, locale, 2);

    const uniqueOptions = makeUniqueOptions(decCorrect, [w1, w2, w3], (i) =>
      formatNum((totalSquares + (i + 1) * 3) / 100, locale, 2)
    );
    const options = uniqueOptions.map((text) => ({
      text,
      isCorrect: text === decCorrect
    }));

    const fracHtml = renderFraction(totalSquares, 100);

    qList.push({
      id: 8,
      type: 'mcq',
      title: isEn ? 'QUESTION 8 • HUNDREDTHS GRID' : 'ΕΡΩΤΗΣΗ 8 • ΟΠΤΙΚΟ ΠΛΕΓΜΑ ΕΚΑΤΟΣΤΩΝ',
      instruction: isEn ? 'Select the correct decimal number:' : 'Επιλέξτε τον σωστό δεκαδικό αριθμό:',
      prompt: isEn
        ? `In a grid of 100 squares, ${totalSquares} squares are shaded. Which decimal number does the grid show?`
        : `Σε ένα πλέγμα 100 τετραγώνων έχουν χρωματιστεί ${totalSquares} τετραγωνάκια. Ποιον δεκαδικό αριθμό δείχνει το πλέγμα;`,
      options,
      correctText: decCorrect,
      explanationHtml: isEn
        ? `In a 100-square grid, ${totalSquares} squares are shaded, hence <span class="inline-flex items-center align-middle">${fracHtml}</span> ＝ ${decCorrect}.`
        : `Στο πλέγμα 100 κουτιών έχουν χρωματιστεί ${totalSquares} κουτάκια, άρα <span class="inline-flex items-center align-middle">${fracHtml}</span> ＝ ${decCorrect}.`,
      explanation: isEn
        ? `In a 100-square grid, ${totalSquares} squares are shaded, hence ${totalSquares}/100 ＝ ${decCorrect}.`
        : `Στο πλέγμα 100 κουτιών έχουν χρωματιστεί ${totalSquares} κουτάκια, άρα ${totalSquares}/100 ＝ ${decCorrect}.`
    });
  }

  // Q9 & Q10: Προβλήματα από τις δεξαμενές
  {
    const shuffledStd = shuffle([...STANDARD_PROBLEMS_POOL]);
    const shuffledHard = shuffle([...HARD_PROBLEMS_POOL]);
    const stdProb = shuffledStd[0].generate(locale);
    const hardProb = shuffledHard[0].generate(locale);

    qList.push({
      id: 9,
      type: 'decimal_input',
      title: `${isEn ? 'QUESTION 9 • ' : 'ΕΡΩΤΗΣΗ 9 • '}${stdProb.title}`,
      instruction: stdProb.instruction,
      promptHtml: stdProb.textHtml,
      prompt: stdProb.text,
      tableData: stdProb.tableData,
      correctVal: stdProb.correctVal,
      correctStr: stdProb.correctStr,
      explanationHtml: stdProb.explanationHtml,
      explanation: stdProb.explanation
    });

    qList.push({
      id: 10,
      type: 'mcq',
      title: `${isEn ? 'QUESTION 10 • ' : 'ΕΡΩΤΗΣΗ 10 • '}${hardProb.title}`,
      instruction: hardProb.instruction,
      promptHtml: hardProb.textHtml,
      prompt: hardProb.text,
      tableData: hardProb.tableData,
      options: hardProb.options,
      correctText: hardProb.correctText,
      explanationHtml: hardProb.explanationHtml,
      explanation: hardProb.explanation
    });
  }

  return qList;
}

const UI_STRINGS = {
  el: {
    pageTitle: "Ασκήσεις: Δεκαδικοί & Κλάσματα - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "10 απαιτητικές ασκήσεις και προβλήματα στη μετατροπή δεκαδικών αριθμών σε δεκαδικά κλάσματα και το αντίστροφο για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    theoryBtn: "📖 Θεωρία",
    badgeChapter: "ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    heroTitle: "Ασκήσεις & Προβλήματα: Δεκαδικοί & Κλάσματα",
    heroDesc: "10 απαιτητικές δραστηριότητες μετατροπής δεκαδικών αριθμών σε δεκαδικά κλάσματα και το αντίστροφο, οπτικές αναπαραστάσεις μονάδας και 4 ρεαλιστικά προβλήματα καθημερινής ζωής.",
    heroDynamicNote: "⚡ Κάθε σετ δημιουργείται δυναμικά με τυχαίες παραμέτρους.",
    btnNewSet: "🔄 ΝΕΕΣ ΑΣΚΗΣΕΙΣ",
    badgeCorrect: "✓ ΣΩΣΤΟ",
    badgeWrong: "✗ ΛΑΘΟΣ",
    inputPlaceholder: "Απάντηση...",
    inputNote: "(Ακέραιος ή δεκαδικός με κόμμα)",
    feedbackGreat: "🎉 Εξαιρετικά!",
    feedbackExpl: "💡 Μαθηματική Επεξήγηση:",
    correctAnswerLabel: "Σωστή απάντηση:",
    btnCheckMain: "🎯 Έλεγχος Απαντήσεων",
    scoreLabel: "ΣΚΟΡ",
    scoreRatio: "/ 10",
    pctLabel: "ΠΟΣΟΣΤΟ",
    btnCheckBar: "ΕΛΕΓΧΟΣ"
  },
  en: {
    pageTitle: "Exercises: Decimals & Fractions - Grade 6 | LearnMaths.gr",
    pageDesc: "10 interactive math problems converting decimal numbers into decimal fractions and vice versa for Grade 6.",
    backText: "Grade 6",
    theoryBtn: "📖 Theory",
    badgeChapter: "GRADE 6 • PRACTICE",
    heroTitle: "Exercises & Problems: Decimals & Fractions",
    heroDesc: "10 practice problems on converting decimals to fractions and vice versa, visual grid models, and 4 applied real-world word problems.",
    heroDynamicNote: "⚡ Each exercise set is dynamically generated with random numbers.",
    btnNewSet: "🔄 NEW EXERCISES",
    badgeCorrect: "✓ CORRECT",
    badgeWrong: "✗ WRONG",
    inputPlaceholder: "Answer...",
    inputNote: "(Integer or decimal number)",
    feedbackGreat: "🎉 Excellent!",
    feedbackExpl: "💡 Mathematical Explanation:",
    correctAnswerLabel: "Correct answer:",
    btnCheckMain: "🎯 Check Answers",
    scoreLabel: "SCORE",
    scoreRatio: "/ 10",
    pctLabel: "PERCENTAGE",
    btnCheckBar: "CHECK"
  }
};

export default function MetatropiExercisesPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = UI_STRINGS[locale];

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = useCallback(() => {
    const q = generateQuestions(locale);
    setQuestions(q);
    setAnswers({});
    setIsSubmitted(false);
    setScore(0);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [locale]);

  useEffect(() => {
    loadNewSet();
  }, [loadNewSet]);

  const handleInputChange = (fieldKey, rawValue) => {
    if (isSubmitted) return;
    let sanitized = rawValue.replace(/[^0-9.,]/g, '');
    const firstSepMatch = sanitized.match(/[,.]/);
    if (firstSepMatch) {
      const sep = firstSepMatch[0];
      const parts = sanitized.split(/[,.]/);
      sanitized = parts[0] + sep + parts.slice(1).join('');
    }
    if (sanitized.length > 10) {
      sanitized = sanitized.slice(0, 10);
    }
    setAnswers((prev) => ({
      ...prev,
      [fieldKey]: sanitized
    }));
  };

  const handleSelectMCQ = (qId, optionText) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [`q_${qId}`]: optionText
    }));
  };

  const handleCheckAnswers = () => {
    let currentScore = 0;

    questions.forEach((q) => {
      if (q.type === 'mcq') {
        const userChoice = answers[`q_${q.id}`];
        if (userChoice === q.correctText) {
          currentScore += 1;
        }
      } else if (q.type === 'decimal_input') {
        const userValStr = (answers[`q_${q.id}`] || '').trim().replace(',', '.');
        const userVal = parseFloat(userValStr);
        if (!isNaN(userVal) && Math.abs(userVal - q.correctVal) < 0.05) {
          currentScore += 1;
        }
      }
    });

    setScore(currentScore);
    setIsSubmitted(true);
  };

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/03-arithmoi-dekadika-klasmata"
          locale={locale}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>{t.theoryBtn}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 pb-28 sm:pb-36 overflow-x-hidden">
        {/* Banner Header */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{t.badgeChapter}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight break-words [overflow-wrap:anywhere]">
              {t.heroTitle}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl break-words">
              {t.heroDesc}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs sm:text-sm 2xl:text-base text-sky-200 break-words">
              {t.heroDynamicNote}
            </span>
            <button
              type="button"
              onClick={loadNewSet}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base touch-manipulation cursor-pointer shrink-0"
            >
              <span>{t.btnNewSet}</span>
            </button>
          </div>
        </section>

        {/* Λίστα 10 Ασκήσεων */}
        <div className="space-y-6 sm:space-y-8">
          {questions.map((q, idx) => {
            let isCorrect = false;
            if (isSubmitted) {
              if (q.type === 'mcq') {
                isCorrect = answers[`q_${q.id}`] === q.correctText;
              } else if (q.type === 'decimal_input') {
                const uv = parseFloat((answers[`q_${q.id}`] || '').trim().replace(',', '.'));
                isCorrect = !isNaN(uv) && Math.abs(uv - q.correctVal) < 0.05;
              }
            }

            return (
              <article
                key={`q-${q.id}-${idx}`}
                className={`bg-white rounded-3xl border p-5 sm:p-8 2xl:p-10 shadow-sm transition-all overflow-hidden ${
                  isSubmitted
                    ? isCorrect
                      ? 'border-emerald-400 bg-emerald-50/20'
                      : 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Επικεφαλίδα Ερώτησης */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="text-xs 2xl:text-sm font-black tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg break-words">
                    {toCleanUppercase(q.title)}
                  </span>
                  {isSubmitted && (
                    <span
                      className={`text-xs 2xl:text-sm font-bold px-3 py-1 rounded-full shrink-0 ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? t.badgeCorrect : t.badgeWrong}
                    </span>
                  )}
                </div>

                {/* Εκφώνηση: Πλήρης αποφυγή πίνακα πριν την υποβολή */}
                <div className="space-y-3 mb-5">
                  {q.instruction && (
                    <p className="text-xs sm:text-sm 2xl:text-base font-semibold text-slate-500 break-words">
                      {q.instruction}
                    </p>
                  )}
                  {q.promptHtml ? (
                    <p
                      className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-relaxed break-words [overflow-wrap:anywhere]"
                      dangerouslySetInnerHTML={{ __html: q.promptHtml }}
                    />
                  ) : (
                    <p className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-relaxed break-words [overflow-wrap:anywhere]">
                      {q.prompt}
                    </p>
                  )}
                </div>

                {/* Περιοχή Απάντησης */}
                <div className="py-2">
                  {q.type === 'decimal_input' && (
                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="text"
                        inputMode="decimal"
                        maxLength={10}
                        disabled={isSubmitted}
                        placeholder={t.inputPlaceholder}
                        value={answers[`q_${q.id}`] || ''}
                        onChange={(e) => handleInputChange(`q_${q.id}`, e.target.value)}
                        className="w-36 sm:w-44 text-center font-mono font-bold text-base sm:text-lg text-slate-900 bg-white border border-slate-300 rounded-2xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed shadow-inner"
                      />
                      <span className="text-xs 2xl:text-sm text-slate-500 break-words">
                        {t.inputNote}
                      </span>
                    </div>
                  )}

                  {q.type === 'mcq' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-4xl">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = answers[`q_${q.id}`] === opt.text;
                        return (
                          <button
                            key={`opt-${q.id}-${oIdx}`}
                            type="button"
                            disabled={isSubmitted}
                            onClick={() => handleSelectMCQ(q.id, opt.text)}
                            className={`w-full p-3.5 rounded-2xl border text-left font-semibold text-xs sm:text-sm 2xl:text-base transition active:scale-95 touch-manipulation flex items-center justify-between gap-3 cursor-pointer ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                            } disabled:cursor-not-allowed`}
                          >
                            <span className="break-words whitespace-normal leading-snug flex-1 [overflow-wrap:anywhere]">
                              {opt.text}
                            </span>
                            <span
                              className={`w-5 h-5 shrink-0 rounded-full border flex items-center justify-center text-xs ${
                                isSelected
                                  ? 'border-white bg-white text-blue-600 font-bold'
                                  : 'border-slate-400 bg-transparent'
                              }`}
                            >
                              {isSelected ? '●' : ''}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Feedback μετά την υποβολή */}
                {isSubmitted && (
                  <div
                    className={`mt-4 p-4 rounded-2xl border text-xs sm:text-sm 2xl:text-base leading-relaxed space-y-2.5 ${
                      isCorrect
                        ? 'bg-emerald-100/60 border-emerald-300 text-emerald-950'
                        : 'bg-rose-100/60 border-rose-300 text-rose-950'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <span>{isCorrect ? t.feedbackGreat : t.feedbackExpl}</span>
                    </div>

                    {q.tableData && (
                      <div className="w-full overflow-x-auto block">
                        <div className="inline-block min-w-full sm:min-w-[340px] bg-white/90 border border-slate-200 rounded-2xl p-3 shadow-inner my-1 font-mono text-xs sm:text-sm">
                          <div className="grid grid-cols-2 gap-3 sm:gap-4 font-bold border-b pb-1.5 text-slate-600 text-center">
                            <span className="bg-blue-100/70 px-2 py-0.5 rounded-lg text-blue-900 break-words">
                              {q.tableData.col1}
                            </span>
                            <span className="bg-emerald-100/70 px-2 py-0.5 rounded-lg text-emerald-900 break-words">
                              {q.tableData.col2}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2 text-center font-bold text-slate-800">
                            <span className="break-words">{q.tableData.r1[0]}</span>
                            <span className="text-indigo-700 font-bold break-words">{q.tableData.r1[1]}</span>
                            <span className="break-words">{q.tableData.r2[0]}</span>
                            <span className="text-amber-600 font-black break-words">{q.tableData.r2[1]}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {q.explanationHtml ? (
                      <div
                        className="break-words [overflow-wrap:anywhere]"
                        dangerouslySetInnerHTML={{ __html: q.explanationHtml }}
                      />
                    ) : (
                      <div className="break-words [overflow-wrap:anywhere]">{q.explanation}</div>
                    )}

                    {!isCorrect && (
                      <div className="font-semibold pt-1 text-slate-800 break-words">
                        {t.correctAnswerLabel}{' '}
                        <span className="font-mono font-bold text-blue-900">
                          {q.correctStr || q.correctText}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Κουμπί Ελέγχου στο τέλος της σελίδας */}
        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={handleCheckAnswers}
            disabled={isSubmitted}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-base sm:text-lg 2xl:text-xl px-8 py-4 rounded-2xl shadow-xl transition active:scale-95 touch-manipulation cursor-pointer"
          >
            <span>{t.btnCheckMain}</span>
          </button>
        </div>
      </div>

      {/* Fixed Bottom Score Bar */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3.5 px-4 sm:px-8 shadow-2xl">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-8">
            <div>
              <span className="text-xs text-slate-400 font-semibold block">
                {t.scoreLabel}
              </span>
              <span className="font-mono font-black text-lg sm:text-2xl text-amber-300">
                {score} <span className="text-slate-500 text-base">{t.scoreRatio}</span>
              </span>
            </div>

            <div className="hidden xs:block border-l border-slate-700 pl-4 sm:pl-8">
              <span className="text-xs text-slate-400 font-semibold block">
                {t.pctLabel}
              </span>
              <span className="font-mono font-black text-lg sm:text-2xl text-emerald-400">
                {Math.round((score / 10) * 100)} %
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleCheckAnswers}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base shadow-md transition active:scale-95 touch-manipulation cursor-pointer"
              >
                {t.btnCheckBar}
              </button>
            ) : (
              <button
                type="button"
                onClick={loadNewSet}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base shadow-md transition active:scale-95 touch-manipulation cursor-pointer"
              >
                {t.btnNewSet}
              </button>
            )}
          </div>
        </div>
      </footer>
    </Layout>
  );
}