// pages/e-dimotikou/12-pososta-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Συνάρτηση για άτονα κεφαλαία με εξαίρεση το Ε'
function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Ε')/g);
  return parts
    .map((part) => {
      if (part === "Ε'") return "Ε'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

// Οπτική απόδοση κλάσματος (αριθμητής πάνω, κλασματική γραμμή, παρονομαστής κάτω)
function MathFraction({ numerator, denominator, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono font-bold leading-none ${className}`}>
      <span className="px-1 text-center border-b-[1.5px] border-current w-full pb-0.5">
        {numerator}
      </span>
      <span className="px-1 text-center pt-0.5 w-full">
        {denominator}
      </span>
    </span>
  );
}

// --- ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ --- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Υπολογισμός Ποσοστού επί Ποσού & Μετατροπή Κλάσματος σε Ποσοστό (Input)
function makeDirectCalculationQuestion(isFractionToPct = false, isEn = false) {
  const numberLocale = isEn ? 'en-US' : 'el-GR';

  if (!isFractionToPct) {
    // q1: Υπολογισμός ποσοστού επί ποσού (π.χ. 25% των 360 €)
    const pcts = [15, 20, 25, 30, 35, 40, 50];
    const pct = pcts[getRandomInt(0, pcts.length - 1)];
    const baseAmounts = [120, 160, 200, 240, 280, 320, 360, 400, 500];
    const amount = baseAmounts[getRandomInt(0, baseAmounts.length - 1)];
    const product = amount * pct;
    const correctVal = Math.round(product / 100);

    const amountFmt = amount.toLocaleString(numberLocale);
    const pctFmt = pct.toLocaleString(numberLocale);
    const prodFmt = product.toLocaleString(numberLocale);
    const correctFmt = correctVal.toLocaleString(numberLocale);

    return {
      type: 'input',
      correct: correctVal,
      unit: '€',
      prompt: isEn
        ? `Calculate ${pctFmt}% of the amount of ${amountFmt} €:`
        : `Υπολόγισε το ${pctFmt}% του χρηματικού ποσού των ${amountFmt} €:`,
      explanation: isEn ? (
        <span className="flex flex-wrap items-center gap-1">
          <span>Multiply the amount by the percentage and divide by 100:</span>
          <MathFraction numerator={`${amountFmt} · ${pctFmt}`} denominator="100" />
          <span>＝</span>
          <MathFraction numerator={prodFmt} denominator="100" />
          <span>＝ {correctFmt} €.</span>
        </span>
      ) : (
        <span className="flex flex-wrap items-center gap-1">
          <span>Πολλαπλασιάζουμε το ποσό με το ποσοστό και διαιρούμε με το 100:</span>
          <MathFraction numerator={`${amountFmt} · ${pctFmt}`} denominator="100" />
          <span>＝</span>
          <MathFraction numerator={prodFmt} denominator="100" />
          <span>＝ {correctFmt} €.</span>
        </span>
      )
    };
  } else {
    // q2: Μετατροπή κλάσματος σε ποσοστό (π.χ. 3/20 -> 15%)
    const fractionBases = [
      { num: 3, den: 20, mult: 5, pct: 15 },
      { num: 7, den: 20, mult: 5, pct: 35 },
      { num: 9, den: 20, mult: 5, pct: 45 },
      { num: 7, den: 25, mult: 4, pct: 28 },
      { num: 12, den: 25, mult: 4, pct: 48 },
      { num: 18, den: 25, mult: 4, pct: 72 },
      { num: 13, den: 50, mult: 2, pct: 26 },
      { num: 27, den: 50, mult: 2, pct: 54 }
    ];
    const item = fractionBases[getRandomInt(0, fractionBases.length - 1)];

    const numFmt = item.num.toLocaleString(numberLocale);
    const denFmt = item.den.toLocaleString(numberLocale);
    const multFmt = item.mult.toLocaleString(numberLocale);
    const pctFmt = item.pct.toLocaleString(numberLocale);

    return {
      type: 'input',
      correct: item.pct,
      unit: '%',
      prompt: isEn ? (
        <span className="inline-flex items-center gap-1 flex-wrap">
          <span>Write the fraction</span>
          <MathFraction numerator={numFmt} denominator={denFmt} />
          <span>as a percentage ( % ):</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 flex-wrap">
          <span>Γράψε το κλάσμα</span>
          <MathFraction numerator={numFmt} denominator={denFmt} />
          <span>ως ποσοστό στα εκατό ( % ):</span>
        </span>
      ),
      explanation: isEn ? (
        <span className="flex flex-wrap items-center gap-1">
          <span>Expand the fraction so its denominator becomes 100:</span>
          <MathFraction numerator={`${numFmt} · ${multFmt}`} denominator={`${denFmt} · ${multFmt}`} />
          <span>＝</span>
          <MathFraction numerator={pctFmt} denominator="100" />
          <span>＝ {pctFmt}%.</span>
        </span>
      ) : (
        <span className="flex flex-wrap items-center gap-1">
          <span>Διαπλατύνουμε το κλάσμα ώστε να αποκτήσει παρονομαστή το 100:</span>
          <MathFraction numerator={`${numFmt} · ${multFmt}`} denominator={`${denFmt} · ${multFmt}`} />
          <span>＝</span>
          <MathFraction numerator={pctFmt} denominator="100" />
          <span>＝ {pctFmt}%.</span>
        </span>
      )
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Μετατροπές Τριπλής Μορφής (MCQ)
function makeTripleFormQuestion(isPctToFraction = false, isEn = false) {
  const numberLocale = isEn ? 'en-US' : 'el-GR';

  if (!isPctToFraction) {
    // q3: Ποσοστό σε δεκαδικό αριθμό
    const pairs = [
      { pct: 8, decNum: 0.08, fakeNums: [0.8, 0.008, 8.0] },
      { pct: 14, decNum: 0.14, fakeNums: [1.4, 0.014, 0.41] },
      { pct: 35, decNum: 0.35, fakeNums: [3.5, 0.035, 0.53] },
      { pct: 75, decNum: 0.75, fakeNums: [7.5, 0.075, 0.57] },
      { pct: 5, decNum: 0.05, fakeNums: [0.5, 0.005, 5.0] }
    ];
    const item = pairs[getRandomInt(0, pairs.length - 1)];
    const formatDec = (n) => n.toLocaleString(numberLocale, { minimumFractionDigits: 2, maximumFractionDigits: 3 });

    const correctStr = formatDec(item.decNum);
    const uniqueRawOptions = [...new Set([item.decNum, ...item.fakeNums])];
    const options = shuffleArray(uniqueRawOptions).map(formatDec);
    const pctFmt = item.pct.toLocaleString(numberLocale);

    return {
      type: 'mcq',
      correct: correctStr,
      options,
      prompt: isEn
        ? `Which decimal number corresponds exactly to ${pctFmt}%?`
        : `Ποιος δεκαδικός αριθμός αντιστοιχεί ακριβώς στο ποσοστό ${pctFmt}%;`,
      explanation: isEn ? (
        <span className="flex flex-wrap items-center gap-1">
          <span>To convert a percentage to a decimal, divide by 100: {pctFmt}% ＝</span>
          <MathFraction numerator={pctFmt} denominator="100" />
          <span>＝ {correctStr}.</span>
        </span>
      ) : (
        <span className="flex flex-wrap items-center gap-1">
          <span>Για να μετατρέψουμε ποσοστό σε δεκαδικό αριθμό, διαιρούμε με το 100: {pctFmt}% ＝</span>
          <MathFraction numerator={pctFmt} denominator="100" />
          <span>＝ {correctStr}.</span>
        </span>
      )
    };
  } else {
    // q4: Ποσοστό σε ανάγωγο κλάσμα
    const fractions = [
      { pct: 20, num: 1, den: 5, fake: [{ num: 2, den: 5 }, { num: 1, den: 4 }, { num: 1, den: 10 }] },
      { pct: 25, num: 1, den: 4, fake: [{ num: 2, den: 5 }, { num: 1, den: 5 }, { num: 3, den: 8 }] },
      { pct: 40, num: 2, den: 5, fake: [{ num: 4, den: 5 }, { num: 1, den: 4 }, { num: 3, den: 10 }] },
      { pct: 60, num: 3, den: 5, fake: [{ num: 2, den: 3 }, { num: 4, den: 5 }, { num: 3, den: 4 }] },
      { pct: 75, num: 3, den: 4, fake: [{ num: 7, den: 10 }, { num: 4, den: 5 }, { num: 5, den: 8 }] },
      { pct: 80, num: 4, den: 5, fake: [{ num: 3, den: 4 }, { num: 5, den: 6 }, { num: 7, den: 8 }] }
    ];
    const item = fractions[getRandomInt(0, fractions.length - 1)];
    const correctFraction = `${item.num}/${item.den}`;

    const rawOptions = [correctFraction, ...item.fake.map((f) => `${f.num}/${f.den}`)];
    const uniqueOptions = [...new Set(rawOptions)];
    const options = shuffleArray(uniqueOptions);
    const pctFmt = item.pct.toLocaleString(numberLocale);

    return {
      type: 'mcq',
      isFractionMCQ: true,
      correct: correctFraction,
      options,
      prompt: isEn
        ? `Which irreducible fraction equals exactly ${pctFmt}%?`
        : `Ποιο ανάγωγο κλάσμα ισούται ακριβώς με το ποσοστό ${pctFmt}%;`,
      explanation: isEn ? (
        <span className="flex flex-wrap items-center gap-1">
          <span>We write the percentage as a fraction with denominator 100 and simplify:</span>
          <MathFraction numerator={pctFmt} denominator="100" />
          <span>＝</span>
          <MathFraction numerator={item.num.toString()} denominator={item.den.toString()} />.
        </span>
      ) : (
        <span className="flex flex-wrap items-center gap-1">
          <span>Γράφουμε το ποσοστό ως κλάσμα με παρονομαστή το 100 και απλοποιούμε:</span>
          <MathFraction numerator={pctFmt} denominator="100" />
          <span>＝</span>
          <MathFraction numerator={item.num.toString()} denominator={item.den.toString()} />.
        </span>
      )
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Έκπτωση & Τελική Τιμή / Αντίστροφο Ποσοστό (Input & MCQ)
function makeDiscountAndReverseQuestion(isReverse = false, isEn = false) {
  const numberLocale = isEn ? 'en-US' : 'el-GR';

  if (!isReverse) {
    // q5: Υπολογισμός τελικής τιμής μετά από έκπτωση (Input)
    const initialPrices = [60, 80, 120, 150, 160, 200, 240];
    const pcts = [15, 20, 25, 30, 40];
    const initialPrice = initialPrices[getRandomInt(0, initialPrices.length - 1)];
    const pct = pcts[getRandomInt(0, pcts.length - 1)];
    const discount = Math.round((initialPrice * pct) / 100);
    const finalPrice = initialPrice - discount;

    const initFmt = initialPrice.toLocaleString(numberLocale);
    const pctFmt = pct.toLocaleString(numberLocale);
    const discFmt = discount.toLocaleString(numberLocale);
    const finalFmt = finalPrice.toLocaleString(numberLocale);

    return {
      type: 'input',
      correct: finalPrice,
      unit: isEn ? '€ (final price)' : '€ (τελική τιμή)',
      prompt: isEn
        ? `A pair of trousers originally costs ${initFmt} € and is on sale with a ${pctFmt}% discount. What is the final price after the discount?`
        : `Ένα παντελόνι κοστίζει αρχικά ${initFmt} € και πωλείται με έκπτωση ${pctFmt}%. Ποια είναι η τελική τιμή του μετά την έκπτωση;`,
      explanation: isEn ? (
        <span className="flex flex-wrap items-center gap-1">
          <span>Calculate the discount:</span>
          <MathFraction numerator={`${initFmt} · ${pctFmt}`} denominator="100" />
          <span>＝ {discFmt} €. Subtract from original price: {initFmt} － {discFmt} ＝ {finalFmt} €.</span>
        </span>
      ) : (
        <span className="flex flex-wrap items-center gap-1">
          <span>Υπολογίζουμε την έκπτωση:</span>
          <MathFraction numerator={`${initFmt} · ${pctFmt}`} denominator="100" />
          <span>＝ {discFmt} €. Αφαιρούμε την έκπτωση από την αρχική τιμή: {initFmt} － {discFmt} ＝ {finalFmt} €.</span>
        </span>
      )
    };
  } else {
    // q6: Εύρεση αρχικού ποσού όταν γνωρίζουμε το μέρος και το ποσοστό (MCQ)
    const cases = [
      { pct: 20, part: 40, total: 200 },
      { pct: 25, part: 60, total: 240 },
      { pct: 30, part: 90, total: 300 },
      { pct: 40, part: 120, total: 300 },
      { pct: 50, part: 140, total: 280 }
    ];
    const c = cases[getRandomInt(0, cases.length - 1)];

    const distractors = [c.total + 50, c.total - 40, c.total + 100].filter((v) => v !== c.total && v > 0);
    const uniqueRawOptions = [...new Set([c.total, ...distractors])].slice(0, 4);
    const options = shuffleArray(uniqueRawOptions).map((v) => `${v.toLocaleString(numberLocale)} €`);

    const pctFmt = c.pct.toLocaleString(numberLocale);
    const partFmt = c.part.toLocaleString(numberLocale);
    const onePctFmt = (c.part / c.pct).toLocaleString(numberLocale);
    const totalFmt = c.total.toLocaleString(numberLocale);

    return {
      type: 'mcq',
      correct: `${totalFmt} €`,
      options,
      prompt: isEn
        ? `If ${pctFmt}% of an amount is ${partFmt} €, what is the total original amount (100%)?`
        : `Αν το ${pctFmt}% ενός χρηματικού ποσού είναι ${partFmt} €, ποιο είναι ολόκληρο το αρχικό ποσό (το 100%);`,
      explanation: isEn ? (
        <span className="flex flex-wrap items-center gap-1">
          <span>If {pctFmt}% is {partFmt} €, then 1% is:</span>
          <MathFraction numerator={partFmt} denominator={pctFmt} />
          <span>＝ {onePctFmt} €. The whole amount (100%) is: {onePctFmt} · 100 ＝ {totalFmt} €.</span>
        </span>
      ) : (
        <span className="flex flex-wrap items-center gap-1">
          <span>Αν το ${pctFmt}% είναι ${partFmt} €, τότε το 1% είναι:</span>
          <MathFraction numerator={partFmt} denominator={pctFmt} />
          <span>＝ {onePctFmt} €. Ολόκληρο το ποσό (100%) είναι: {onePctFmt} · 100 ＝ {totalFmt} €.</span>
        </span>
      )
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Σύνθετα Προβλήματα Αύξησης/ΦΠΑ & Ποσοστού επί του Συνόλου (Input & MCQ)
function makeComplexPercentageProblem(isMCQ = false, isEn = false) {
  const numberLocale = isEn ? 'en-US' : 'el-GR';

  if (!isMCQ) {
    // q7: Υπολογισμός τελικής τιμής με αύξηση / επιβάρυνση (Input)
    const initialPrice = [50, 100, 150, 200, 250][getRandomInt(0, 4)];
    const pctIncrease = [10, 12, 16, 20, 24][getRandomInt(0, 4)];
    const increaseAmount = Math.round((initialPrice * pctIncrease) / 100);
    const finalPrice = initialPrice + increaseAmount;

    const initFmt = initialPrice.toLocaleString(numberLocale);
    const pctFmt = pctIncrease.toLocaleString(numberLocale);
    const incFmt = increaseAmount.toLocaleString(numberLocale);
    const finalFmt = finalPrice.toLocaleString(numberLocale);

    return {
      type: 'input',
      correct: finalPrice,
      unit: isEn ? '€ (with markup)' : '€ (με αύξηση)',
      prompt: isEn
        ? `The price of a power tool was ${initFmt} € and increased by ${pctFmt}%. What is the new price of the tool?`
        : `Η τιμή ενός ηλεκτρικού εργαλείου ήταν ${initFmt} € και αυξήθηκε κατά ${pctFmt}%. Ποια είναι η νέα τιμή του εργαλείου;`,
      explanation: isEn ? (
        <span className="flex flex-wrap items-center gap-1">
          <span>Calculate the increase:</span>
          <MathFraction numerator={`${initFmt} · ${pctFmt}`} denominator="100" />
          <span>＝ {incFmt} €. Add to original price: {initFmt} ＋ {incFmt} ＝ {finalFmt} €.</span>
        </span>
      ) : (
        <span className="flex flex-wrap items-center gap-1">
          <span>Υπολογίζουμε την αύξηση:</span>
          <MathFraction numerator={`${initFmt} · ${pctFmt}`} denominator="100" />
          <span>＝ {incFmt} €. Προσθέτουμε στην αρχική τιμή: {initFmt} ＋ {incFmt} ＝ {finalFmt} €.</span>
        </span>
      )
    };
  } else {
    // q8: Εύρεση ποσοστού από γνωστό πλήθος επί συνόλου (MCQ)
    const cases = [
      { total: 50, part: 18, pct: 36 },
      { total: 50, part: 24, pct: 48 },
      { total: 25, part: 9, pct: 36 },
      { total: 25, part: 14, pct: 56 },
      { total: 20, part: 7, pct: 35 },
      { total: 20, part: 11, pct: 55 }
    ];
    const c = cases[getRandomInt(0, cases.length - 1)];

    const distractors = [c.pct + 10, c.pct - 8, c.pct + 5].filter((v) => v !== c.pct);
    const uniqueRawOptions = [...new Set([c.pct, ...distractors.slice(0, 3)])];
    const options = shuffleArray(uniqueRawOptions).map((v) => `${v.toLocaleString(numberLocale)}%`);

    const partFmt = c.part.toLocaleString(numberLocale);
    const totalFmt = c.total.toLocaleString(numberLocale);
    const multFmt = (100 / c.total).toLocaleString(numberLocale);
    const pctFmt = c.pct.toLocaleString(numberLocale);

    return {
      type: 'mcq',
      correct: `${pctFmt}%`,
      options,
      prompt: isEn
        ? `In a club of ${totalFmt} students, ${partFmt} children are learning chess. What percentage of the club's students is learning chess?`
        : `Σε έναν όμιλο ${totalFmt} μαθητών, τα ${partFmt} παιδιά μαθαίνουν σκάκι. Τι ποσοστό στα εκατό ( % ) των μαθητών του ομίλου μαθαίνει σκάκι;`,
      explanation: isEn ? (
        <span className="flex flex-wrap items-center gap-1">
          <span>Form the fraction</span>
          <MathFraction numerator={partFmt} denominator={totalFmt} />
          <span>and convert to an equivalent fraction with denominator 100:</span>
          <MathFraction numerator={`${partFmt} · ${multFmt}`} denominator={`${totalFmt} · ${multFmt}`} />
          <span>＝</span>
          <MathFraction numerator={pctFmt} denominator="100" />
          <span>＝ {pctFmt}%.</span>
        </span>
      ) : (
        <span className="flex flex-wrap items-center gap-1">
          <span>Σχηματίζουμε το κλάσμα</span>
          <MathFraction numerator={partFmt} denominator={totalFmt} />
          <span>και το μετατρέπουμε σε ισοδύναμο με παρονομαστή το 100:</span>
          <MathFraction numerator={`${partFmt} · ${multFmt}`} denominator={`${totalFmt} · ${multFmt}`} />
          <span>＝</span>
          <MathFraction numerator={pctFmt} denominator="100" />
          <span>＝ {pctFmt}%.</span>
        </span>
      )
    };
  }
}

function generateQuestions(isEn = false) {
  return {
    q1: makeDirectCalculationQuestion(false, isEn),
    q2: makeDirectCalculationQuestion(true, isEn),
    q3: makeTripleFormQuestion(false, isEn),
    q4: makeTripleFormQuestion(true, isEn),
    q5: makeDiscountAndReverseQuestion(false, isEn),
    q6: makeDiscountAndReverseQuestion(true, isEn),
    q7: makeComplexPercentageProblem(false, isEn),
    q8: makeComplexPercentageProblem(true, isEn)
  };
}

const I18N = {
  el: {
    pageTitle: "Ασκήσεις: Ποσοστά (% και ‰) - Ε' Δημοτικού | LearnMaths.gr",
    pageDescription: "Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στα ποσοστά: υπολογισμός ποσοστού επί ποσού, μετατροπές τριπλής μορφής, προβλήματα έκπτωσης και αύξησης.",
    backText: "Ε' Δημοτικού",
    theoryButton: "Θεωρία",
    badgeChapter: "Ε' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    pageHeader: "📝 Ασκήσεις: Ποσοστά (% και ‰)",
    pageSubheader: "Κάθε φορά που πατάς «Νέες Ασκήσεις», δημιουργούνται νέα παραδείγματα από τη δεξαμενή!",
    newExercisesBtn: "Νέες Ασκήσεις",
    submitBtn: "Έλεγχος Απαντήσεων",
    scoreBadge: "Σκορ:",
    successRate: "Επιτυχία:",
    bottomPrompt: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    correctFeedbackPrefix: "Η σωστή απάντηση είναι:",
    qTitles: {
      q1: "ΥΠΟΛΟΓΙΣΜΟΣ ΠΟΣΟΣΤΟΥ ΕΠΙ ΠΟΣΟΥ",
      q2: "ΜΕΤΑΤΡΟΠΗ ΚΛΑΣΜΑΤΟΣ ΣΕ ΠΟΣΟΣΤΟ",
      q3: "ΠΟΣΟΣΤΟ ΣΕ ΔΕΚΑΔΙΚΟ ΑΡΙΘΜΟ",
      q4: "ΠΟΣΟΣΤΟ ΣΕ ΑΝΑΓΩΓΟ ΚΛΑΣΜΑ",
      q5: "ΠΡΟΒΛΗΜΑ ΕΚΠΤΩΣΗΣ & ΤΕΛΙΚΗΣ ΤΙΜΗΣ",
      q6: "ΕΥΡΕΣΗ ΑΡΧΙΚΟΥ ΠΟΣΟΥ ΑΠΟ ΠΟΣΟΣΤΟ",
      q7: "ΠΡΟΒΛΗΜΑ ΑΥΞΗΣΗΣ ΤΙΜΗΣ",
      q8: "ΥΠΟΛΟΓΙΣΜΟΣ ΠΟΣΟΣΤΟΥ ΕΠΙ ΤΟΥ ΣΥΝΟΛΟΥ"
    }
  },
  en: {
    pageTitle: "Exercises: Percentages (% and ‰) - 5th Grade | LearnMaths.gr",
    pageDescription: "Challenging 5th Grade math exercises on percentages: calculating percent of an amount, triple-form conversions, discount and markup word problems.",
    backText: "5th Grade",
    theoryButton: "Theory",
    badgeChapter: "5TH GRADE • PRACTICE",
    pageHeader: "📝 Exercises: Percentages (% and ‰)",
    pageSubheader: "Every time you click \"New Exercises\", a fresh randomized problem set is generated!",
    newExercisesBtn: "New Exercises",
    submitBtn: "Check Answers",
    scoreBadge: "Score:",
    successRate: "Success:",
    bottomPrompt: "Complete all questions and click \"Check Answers\"!",
    correctFeedbackPrefix: "The correct answer is:",
    qTitles: {
      q1: "CALCULATE PERCENTAGE OF AN AMOUNT",
      q2: "CONVERT FRACTION TO PERCENTAGE",
      q3: "PERCENTAGE TO DECIMAL NUMBER",
      q4: "PERCENTAGE TO IRREDUCIBLE FRACTION",
      q5: "DISCOUNT & FINAL PRICE PROBLEM",
      q6: "FIND TOTAL AMOUNT FROM PERCENTAGE",
      q7: "PRICE INCREASE PROBLEM",
      q8: "CALCULATE PERCENTAGE OF A WHOLE"
    }
  }
};

export default function PosostaAskPage() {
  const router = useRouter();
  const { locale } = router;
  const isEn = locale === 'en';
  const t = isEn ? I18N.en : I18N.el;
  const numberLocale = isEn ? 'en-US' : 'el-GR';

  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewQuestions = () => {
    setQuestions(generateQuestions(isEn));
    setAnswers({ q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '' });
    setSubmitted(false);
    setScore(0);
  };

  useEffect(() => {
    loadNewQuestions();
  }, [locale]);

  if (!questions) return null;

  const handleInputChange = (key, val) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const handleNumericInput = (key, rawVal) => {
    if (submitted) return;
    const clean = rawVal.replace(/[^0-9]/g, '').slice(0, 10);
    setAnswers((prev) => ({ ...prev, [key]: clean }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let currentScore = 0;

    if (parseInt(answers.q1, 10) === questions.q1.correct) currentScore += 1;
    if (parseInt(answers.q2, 10) === questions.q2.correct) currentScore += 1;
    if (answers.q3 === questions.q3.correct) currentScore += 1;
    if (answers.q4 === questions.q4.correct) currentScore += 1;
    if (parseInt(answers.q5, 10) === questions.q5.correct) currentScore += 1;
    if (answers.q6 === questions.q6.correct) currentScore += 1;
    if (parseInt(answers.q7, 10) === questions.q7.correct) currentScore += 1;
    if (answers.q8 === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render Component για Ερωτήσεις MCQ
  const renderMCQ = (qKey, qData, numLabel, badgeTitle, accentColor) => {
    const isCorrect = answers[qKey] === qData.correct;
    return (
      <div
        className={`bg-white p-5 sm:p-7 2xl:p-9 rounded-3xl shadow-sm border transition-all ${
          submitted
            ? isCorrect
              ? 'border-emerald-500 bg-emerald-50/20'
              : 'border-rose-400 bg-rose-50/20'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-start gap-3 mb-4">
          <span
            className={`${accentColor} text-white font-black text-xs sm:text-sm 2xl:text-base w-7 h-7 sm:w-8 sm:h-8 2xl:w-10 2xl:h-10 rounded-xl shrink-0 flex items-center justify-center shadow-sm`}
          >
            {numLabel}
          </span>
          <div className="space-y-1">
            <span className="text-[11px] 2xl:text-xs font-black tracking-wider text-slate-400">
              {toCleanUppercase(badgeTitle)}
            </span>
            <div className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-snug">
              {qData.prompt}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:pl-11 2xl:pl-13">
          {qData.options.map((opt, idx) => {
            const isSelected = answers[qKey] === opt;
            const isFractionOption = qData.isFractionMCQ && opt.includes('/');
            const [num, den] = isFractionOption ? opt.split('/') : [null, null];

            return (
              <label
                key={idx}
                className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition select-none text-sm sm:text-base 2xl:text-lg font-mono font-bold ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                } ${submitted ? 'cursor-default pointer-events-none' : ''}`}
              >
                <input
                  type="radio"
                  id={`${qKey}-opt-${idx}`}
                  name={qKey}
                  value={opt}
                  checked={isSelected}
                  onChange={() => handleInputChange(qKey, opt)}
                  disabled={submitted}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 shrink-0"
                />
                <span className="break-words whitespace-normal leading-snug flex-1 flex items-center">
                  {isFractionOption ? (
                    <MathFraction numerator={num} denominator={den} />
                  ) : (
                    opt
                  )}
                </span>
              </label>
            );
          })}
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 2xl:pl-13 text-xs sm:text-sm 2xl:text-base leading-relaxed">
            {isCorrect ? (
              <div className="text-emerald-800 font-semibold bg-emerald-50 p-3 rounded-2xl border border-emerald-200/60 font-mono">
                {qData.explanation}
              </div>
            ) : (
              <div className="text-rose-800 font-medium bg-rose-50 p-3 rounded-2xl border border-rose-200/60 font-mono flex flex-wrap items-center gap-1.5">
                <span>{t.correctFeedbackPrefix}</span>
                <strong className="font-bold text-rose-950 flex items-center">
                  {qData.isFractionMCQ && qData.correct.includes('/') ? (
                    <MathFraction
                      numerator={qData.correct.split('/')[0]}
                      denominator={qData.correct.split('/')[1]}
                    />
                  ) : (
                    qData.correct
                  )}
                </strong>.
                <span>{qData.explanation}</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Component για Ερωτήσεις Input
  const renderInput = (qKey, qData, numLabel, badgeTitle, accentColor) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
    return (
      <div
        className={`bg-white p-5 sm:p-7 2xl:p-9 rounded-3xl shadow-sm border transition-all ${
          submitted
            ? isCorrect
              ? 'border-emerald-500 bg-emerald-50/20'
              : 'border-rose-400 bg-rose-50/20'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-start gap-3 mb-4">
          <span
            className={`${accentColor} text-white font-black text-xs sm:text-sm 2xl:text-base w-7 h-7 sm:w-8 sm:h-8 2xl:w-10 2xl:h-10 rounded-xl shrink-0 flex items-center justify-center shadow-sm`}
          >
            {numLabel}
          </span>
          <div className="space-y-1">
            <span className="text-[11px] 2xl:text-xs font-black tracking-wider text-slate-400">
              {toCleanUppercase(badgeTitle)}
            </span>
            <div className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-snug">
              {qData.prompt}
            </div>
          </div>
        </div>

        <div className="sm:pl-11 2xl:pl-13 space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder="?"
              maxLength={10}
              value={answers[qKey]}
              onChange={(e) => handleNumericInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-32 sm:w-40 h-12 sm:h-14 p-3 text-center rounded-2xl border-2 border-slate-300 font-mono text-lg sm:text-xl 2xl:text-2xl font-black focus:border-indigo-600 focus:outline-none bg-slate-50/60 focus:bg-white text-slate-900 disabled:opacity-75"
            />
            <span className="text-xs sm:text-sm 2xl:text-base font-semibold text-slate-600">
              {qData.unit}
            </span>
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 2xl:pl-13 text-xs sm:text-sm 2xl:text-base leading-relaxed">
            {isCorrect ? (
              <div className="text-emerald-800 font-semibold bg-emerald-50 p-3 rounded-2xl border border-emerald-200/60 font-mono">
                {qData.explanation}
              </div>
            ) : (
              <div className="text-rose-800 font-medium bg-rose-50 p-3 rounded-2xl border border-rose-200/60 font-mono flex flex-wrap items-center gap-1.5">
                <span>{t.correctFeedbackPrefix}</span>
                <strong className="font-bold text-rose-950">
                  {qData.correct.toLocaleString(numberLocale)} {qData.unit}
                </strong>.
                <span>{qData.explanation}</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDescription}
      backUrl="/e-dimotikou"
      backText={t.backText}
      hideFooter={true}
      actionButton={
        <Link
          href="/e-dimotikou/12-pososta"
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl text-sm 2xl:text-base transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> {t.theoryButton}
        </Link>
      }
    >
      {/* Container πλήρους εύρους σύμφωνα με τις προδιαγραφές */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1.5 max-w-4xl">
            <span className="bg-white/10 border border-white/20 text-sky-200 text-xs 2xl:text-sm font-black px-3 py-1 rounded-full tracking-wider inline-block">
              {toCleanUppercase(t.badgeChapter)}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-black tracking-tight pt-1">
              {t.pageHeader}
            </h1>
            <p className="text-sky-100 text-xs sm:text-sm md:text-base 2xl:text-lg">
              {t.pageSubheader}
            </p>
          </div>

          <button
            type="button"
            onClick={loadNewQuestions}
            className="bg-amber-400 text-slate-950 font-black px-4 py-2.5 sm:px-5 sm:py-3 2xl:px-7 2xl:py-4 rounded-2xl shadow-lg hover:bg-amber-300 transition active:scale-95 text-xs sm:text-sm 2xl:text-base whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 {t.newExercisesBtn}
          </button>
        </div>

        {/* ΦΟΡΜΑ ΑΣΚΗΣΕΩΝ */}
        <form onSubmit={handleSubmit} className="space-y-6 pb-28 sm:pb-32">
          {renderInput('q1', questions.q1, 1, t.qTitles.q1, 'bg-blue-600')}
          {renderInput('q2', questions.q2, 2, t.qTitles.q2, 'bg-blue-600')}

          {renderMCQ('q3', questions.q3, 3, t.qTitles.q3, 'bg-indigo-600')}
          {renderMCQ('q4', questions.q4, 4, t.qTitles.q4, 'bg-indigo-600')}

          {renderInput('q5', questions.q5, 5, t.qTitles.q5, 'bg-teal-600')}
          {renderMCQ('q6', questions.q6, 6, t.qTitles.q6, 'bg-teal-600')}

          {renderInput('q7', questions.q7, 7, t.qTitles.q7, 'bg-purple-600')}
          {renderMCQ('q8', questions.q8, 8, t.qTitles.q8, 'bg-purple-600')}

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="text-center pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white text-base sm:text-lg 2xl:text-xl font-black px-10 py-4 2xl:px-14 2xl:py-5 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95"
              >
                🎯 {t.submitBtn}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* ΣΤΑΘΕΡΟ BOTTOM FOOTER */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 2xl:py-5">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 2xl:px-5 2xl:py-2 rounded-xl text-base sm:text-lg 2xl:text-xl flex items-center gap-2 shadow-sm">
              <span>🏆 {t.scoreBadge}</span>
              <span className="text-xl sm:text-2xl 2xl:text-3xl font-mono">{score} / 8</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm 2xl:text-base font-bold text-slate-300">
                {t.successRate} <span className="text-emerald-400 font-black">{Math.round((score / 8) * 100)}%</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                type="button"
                onClick={loadNewQuestions}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2 2xl:px-7 2xl:py-2.5 rounded-xl shadow-md transition text-xs sm:text-sm 2xl:text-base flex items-center gap-2 active:scale-95"
              >
                <span>🔄</span> {t.newExercisesBtn}
              </button>
            ) : (
              <p className="text-xs 2xl:text-sm text-slate-400 hidden sm:block">
                {t.bottomPrompt}
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}