// pages/e-dimotikou/11-mesitimi-ask.js
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

// 1. ΖΕΥΓΟΣ 1 (q1, q2): Άμεσος Υπολογισμός Μέσης Τιμής (Input)
function makeDirectAverageQuestion(isFourValues = false, isEn = false) {
  const numberLocale = isEn ? 'en-US' : 'el-GR';

  if (!isFourValues) {
    // q1: 5 τιμές με ακέραιο μέσο όρο (π.χ. βαθμοί μαθητή)
    const targetAvg = getRandomInt(14, 19);
    const deltas = [-3, -1, 0, 1, 3]; // άθροισμα = 0
    const shuffledDeltas = shuffleArray(deltas);
    const scores = shuffledDeltas.map((d) => targetAvg + d);
    const sum = scores.reduce((a, b) => a + b, 0);

    const scoresListFormatted = scores.map((s) => s.toLocaleString(numberLocale)).join(', ');
    const scoresSumFormatted = scores.map((s) => s.toLocaleString(numberLocale)).join(' ＋ ');
    const sumFormatted = sum.toLocaleString(numberLocale);
    const targetAvgFormatted = targetAvg.toLocaleString(numberLocale);

    return {
      type: 'input',
      correct: targetAvg,
      unit: isEn ? 'points' : 'βαθμοί',
      prompt: isEn
        ? `A student scored the following marks on 5 term tests: ${scoresListFormatted}. What is the mean score (average) of the tests?`
        : `Ένας μαθητής έγραψε στα 5 διαγωνίσματα του τριμήνου τους εξής βαθμούς: ${scoresListFormatted}. Ποια είναι η μέση τιμή (μέσος όρος) της βαθμολογίας του;`,
      explanation: isEn ? (
        <span className="flex flex-wrap items-center gap-1">
          <span>Find the total sum: {scoresSumFormatted} ＝ {sumFormatted}. Divide by the number of tests:</span>
          <MathFraction numerator={sumFormatted} denominator="5" />
          <span>＝ {targetAvgFormatted} points.</span>
        </span>
      ) : (
        <span className="flex flex-wrap items-center gap-1">
          <span>Βρίσκουμε το συνολικό άθροισμα: {scoresSumFormatted} ＝ {sumFormatted}. Διαιρούμε με το πλήθος των διαγωνισμάτων:</span>
          <MathFraction numerator={sumFormatted} denominator="5" />
          <span>＝ {targetAvgFormatted} βαθμοί.</span>
        </span>
      )
    };
  } else {
    // q2: 4 τιμές θερμοκρασίας με ακέραιο μέσο όρο
    const targetAvg = getRandomInt(16, 26);
    const deltas = [-4, -2, 2, 4];
    const shuffledDeltas = shuffleArray(deltas);
    const temps = shuffledDeltas.map((d) => targetAvg + d);
    const sum = temps.reduce((a, b) => a + b, 0);

    const tempsListFormatted = temps.map((t) => `${t.toLocaleString(numberLocale)}°C`).join(', ');
    const tempsSumFormatted = temps.map((t) => `${t.toLocaleString(numberLocale)}°C`).join(' ＋ ');
    const sumFormatted = sum.toLocaleString(numberLocale);
    const targetAvgFormatted = targetAvg.toLocaleString(numberLocale);

    return {
      type: 'input',
      correct: targetAvg,
      unit: '°C',
      prompt: isEn
        ? `The recorded temperatures over 4 consecutive days were: ${tempsListFormatted}. What was the average temperature for the four-day period?`
        : `Οι θερμοκρασίες που καταγράφηκαν για 4 διαδοχικές ημέρες ήταν: ${tempsListFormatted}. Ποια ήταν η μέση θερμοκρασία του τετραημέρου;`,
      explanation: isEn ? (
        <span className="flex flex-wrap items-center gap-1">
          <span>Sum the temperatures: {tempsSumFormatted} ＝ {sumFormatted}°C. Divide by the 4 days:</span>
          <MathFraction numerator={`${sumFormatted}°C`} denominator="4" />
          <span>＝ {targetAvgFormatted}°C.</span>
        </span>
      ) : (
        <span className="flex flex-wrap items-center gap-1">
          <span>Αθροίζουμε τις θερμοκρασίες: {tempsSumFormatted} ＝ {sumFormatted}°C. Διαιρούμε με τις 4 ημέρες:</span>
          <MathFraction numerator={`${sumFormatted}°C`} denominator="4" />
          <span>＝ {targetAvgFormatted}°C.</span>
        </span>
      )
    };
  }
}

// 2. ΖΕΥΓΟΣ 2 (q3, q4): Ανάστροφος Υπολογισμός Αθροίσματος & Ιδιότητες Ορίων (MCQ)
function makeReverseAndPropertiesQuestion(isProperties = false, isEn = false) {
  const numberLocale = isEn ? 'en-US' : 'el-GR';

  if (!isProperties) {
    // q3: Εύρεση συνολικού ποσού από γνωστό μέσο όρο
    const count = [4, 5, 6, 7][getRandomInt(0, 3)];
    const avgVal = getRandomInt(15, 35) * 2; // π.χ. 40 €
    const totalVal = count * avgVal;

    const rawDistractors = [
      totalVal + avgVal,
      totalVal - avgVal,
      count * (avgVal + 5),
      totalVal + 10,
      totalVal - 10
    ].filter((v) => v !== totalVal && v > 0);

    const uniqueRawOptions = [...new Set([totalVal, ...rawDistractors])].slice(0, 4);
    const options = shuffleArray(uniqueRawOptions).map((v) => `${v.toLocaleString(numberLocale)} €`);

    return {
      type: 'mcq',
      correct: `${totalVal.toLocaleString(numberLocale)} €`,
      options,
      prompt: isEn
        ? `In a group of ${count} friends, each person spent an average of ${avgVal.toLocaleString(numberLocale)} €. How much money did they spend altogether?`
        : `Σε μια παρέα ${count} φίλων, ο μέσος όρος των χρημάτων που ξόδεψε κάθε παιδί είναι ${avgVal.toLocaleString(numberLocale)} €. Πόσα χρήματα ξόδεψαν συνολικά όλοι μαζί;`,
      explanation: isEn
        ? `The total sum is found by multiplying the mean value by the number of friends: ${avgVal.toLocaleString(numberLocale)} · ${count} ＝ ${totalVal.toLocaleString(numberLocale)} €.`
        : `Το συνολικό άθροισμα προκύπτει πολλαπλασιάζοντας τη μέση τιμή με το πλήθος των παιδιών: ${avgVal.toLocaleString(numberLocale)} · ${count} ＝ ${totalVal.toLocaleString(numberLocale)} €.`
    };
  } else {
    // q4: Έλεγχος ορίων μέσης τιμής (πρέπει να βρίσκεται μεταξύ ελαχίστου και μεγίστου)
    const minVal = 12;
    const maxVal = 20;
    const validAvg = 16;
    const invalidOptions = [11, 21, 24];

    const uniqueRawOptions = [...new Set([validAvg, ...invalidOptions])];
    const options = shuffleArray(uniqueRawOptions).map((v) => `${v.toLocaleString(numberLocale)} kg`);

    return {
      type: 'mcq',
      correct: `${validAvg.toLocaleString(numberLocale)} kg`,
      options,
      prompt: isEn
        ? `In a warehouse, the weights of four parcels are 12 kg, 15 kg, 17 kg, and 20 kg. Without computing the full calculation, which of the following could be the mean weight?`
        : `Σε μια αποθήκη, τα βάρη τεσσάρων δεμάτων είναι 12 kg, 15 kg, 17 kg και 20 kg. Χωρίς να κάνεις όλες τις πράξεις, ποια από τις παρακάτω τιμές θα μπορούσε να είναι η μέση τιμή των βαρών;`,
      explanation: isEn
        ? `The mean value is ALWAYS between the lowest value (12 kg) and the highest value (20 kg). The only option within the 12 kg and 20 kg limits is ${validAvg.toLocaleString(numberLocale)} kg.`
        : `Η μέση τιμή βρίσκεται ΠΑΝΤΑ ανάμεσα στη μικρότερη τιμή (12 kg) και τη μεγαλύτερη τιμή (20 kg). Η μόνη τιμή ανάμεσα στα όρια 12 kg και 20 kg είναι τα ${validAvg.toLocaleString(numberLocale)} kg.`
    };
  }
}

// 3. ΖΕΥΓΟΣ 3 (q5, q6): Εύρεση Άγνωστης Τιμής με Δεδομένο Μέσο Όρο (Input & MCQ)
function makeMissingValueAverageQuestion(isMCQ = false, isEn = false) {
  const numberLocale = isEn ? 'en-US' : 'el-GR';

  if (!isMCQ) {
    // q5: Εύρεση βαθμού 4ου μαθήματος (Input)
    const targetAvg = getRandomInt(16, 19);
    const totalNeeded = targetAvg * 4;
    const g1 = getRandomInt(14, targetAvg + 1);
    const g2 = getRandomInt(15, targetAvg + 1);
    const g3 = getRandomInt(14, targetAvg + 1);
    const currentSum = g1 + g2 + g3;
    const neededGrade = totalNeeded - currentSum;

    return {
      type: 'input',
      correct: neededGrade,
      unit: isEn ? 'points' : 'βαθμοί',
      prompt: isEn
        ? `Elena has grades of ${g1.toLocaleString(numberLocale)}, ${g2.toLocaleString(numberLocale)}, and ${g3.toLocaleString(numberLocale)} in three subjects. What score must she achieve in the 4th subject so that her overall average is exactly ${targetAvg.toLocaleString(numberLocale)}?`
        : `Η Ελένη έχει βαθμούς ${g1.toLocaleString(numberLocale)}, ${g2.toLocaleString(numberLocale)} και ${g3.toLocaleString(numberLocale)} σε τρία μαθήματα. Τι βαθμό πρέπει να πάρει στο 4ο μάθημα ώστε ο γενικός μέσος όρος της να είναι ακριβώς ${targetAvg.toLocaleString(numberLocale)};`,
      explanation: isEn
        ? `For an average of ${targetAvg.toLocaleString(numberLocale)} across 4 subjects, the required total sum is: ${targetAvg.toLocaleString(numberLocale)} · 4 ＝ ${totalNeeded.toLocaleString(numberLocale)} points. The sum of the first 3 grades is: ${g1.toLocaleString(numberLocale)} ＋ ${g2.toLocaleString(numberLocale)} ＋ ${g3.toLocaleString(numberLocale)} ＝ ${currentSum.toLocaleString(numberLocale)}. Therefore, for the 4th subject she needs: ${totalNeeded.toLocaleString(numberLocale)} － ${currentSum.toLocaleString(numberLocale)} ＝ ${neededGrade.toLocaleString(numberLocale)} points.`
        : `Για μέσο όρο ${targetAvg.toLocaleString(numberLocale)} σε 4 μαθήματα, το συνολικό άθροισμα πρέπει να είναι: ${targetAvg.toLocaleString(numberLocale)} · 4 ＝ ${totalNeeded.toLocaleString(numberLocale)} βαθμοί. Το άθροισμα των 3 πρώτων είναι: ${g1.toLocaleString(numberLocale)} ＋ ${g2.toLocaleString(numberLocale)} ＋ ${g3.toLocaleString(numberLocale)} ＝ ${currentSum.toLocaleString(numberLocale)}. Άρα στο 4ο μάθημα χρειάζεται: ${totalNeeded.toLocaleString(numberLocale)} － ${currentSum.toLocaleString(numberLocale)} ＝ ${neededGrade.toLocaleString(numberLocale)} βαθμούς.`
    };
  } else {
    // q6: Εύρεση άγνωστης ποσότητας με δοσμένο μέσο όρο 3 ημερών (MCQ)
    const targetAvg = getRandomInt(25, 45);
    const totalNeeded = targetAvg * 3;
    const v1 = targetAvg - getRandomInt(3, 7);
    const v2 = targetAvg + getRandomInt(2, 6);
    const v3 = totalNeeded - (v1 + v2);

    const rawDistractors = [v3 + 3, Math.max(5, v3 - 3), v3 + 6, v3 - 5].filter((v) => v !== v3 && v > 0);
    const uniqueRawOptions = [...new Set([v3, ...rawDistractors])].slice(0, 4);
    const unitText = isEn ? 'pages' : 'σελίδες';
    const options = shuffleArray(uniqueRawOptions).map((v) => `${v.toLocaleString(numberLocale)} ${unitText}`);

    return {
      type: 'mcq',
      correct: `${v3.toLocaleString(numberLocale)} ${unitText}`,
      options,
      prompt: isEn
        ? `A student read ${v1.toLocaleString(numberLocale)} pages on Monday and ${v2.toLocaleString(numberLocale)} pages on Tuesday. How many pages did they read on Wednesday, if their 3-day average was ${targetAvg.toLocaleString(numberLocale)} pages per day?`
        : `Ένας μαθητής διάβασε ${v1.toLocaleString(numberLocale)} σελίδες τη Δευτέρα και ${v2.toLocaleString(numberLocale)} σελίδες την Τρίτη. Πόσες σελίδες διάβασε την Τετάρτη, αν ο μέσος όρος των τριών ημερών ήταν ${targetAvg.toLocaleString(numberLocale)} σελίδες την ημέρα;`,
      explanation: isEn
        ? `Total pages over the three days: ${targetAvg.toLocaleString(numberLocale)} · 3 ＝ ${totalNeeded.toLocaleString(numberLocale)}. On the first two days they read: ${v1.toLocaleString(numberLocale)} ＋ ${v2.toLocaleString(numberLocale)} ＝ ${(v1 + v2).toLocaleString(numberLocale)}. Therefore, on Wednesday they read: ${totalNeeded.toLocaleString(numberLocale)} － ${(v1 + v2).toLocaleString(numberLocale)} ＝ ${v3.toLocaleString(numberLocale)} pages.`
        : `Συνολικές σελίδες του τριημέρου: ${targetAvg.toLocaleString(numberLocale)} · 3 ＝ ${totalNeeded.toLocaleString(numberLocale)}. Τις δύο πρώτες ημέρες διάβασε: ${v1.toLocaleString(numberLocale)} ＋ ${v2.toLocaleString(numberLocale)} ＝ ${(v1 + v2).toLocaleString(numberLocale)}. Άρα την Τετάρτη διάβασε: ${totalNeeded.toLocaleString(numberLocale)} － ${(v1 + v2).toLocaleString(numberLocale)} ＝ ${v3.toLocaleString(numberLocale)} σελίδες.`
    };
  }
}

// 4. ΖΕΥΓΟΣ 4 (q7, q8): Σύνθετα Προβλήματα Μέσης Τιμής Πραγματικής Ζωής (Input & MCQ)
function makeComplexAverageWordProblem(isMCQ = false, isEn = false) {
  const numberLocale = isEn ? 'en-US' : 'el-GR';

  if (!isMCQ) {
    // q7: Μέση απόσταση / χιλιόμετρα ταξιδιού ανά ημέρα (Input)
    const days = 5;
    const dailyKm = [120, 140, 110, 150, 130];
    const totalKm = dailyKm.reduce((a, b) => a + b, 0);
    const avgKm = totalKm / days;

    const dailyKmSumFormatted = dailyKm.map((k) => `${k.toLocaleString(numberLocale)} km`).join(' ＋ ');
    const totalKmFormatted = totalKm.toLocaleString(numberLocale);
    const avgKmFormatted = avgKm.toLocaleString(numberLocale);

    return {
      type: 'input',
      correct: avgKm,
      unit: isEn ? 'km per day' : 'km την ημέρα',
      prompt: isEn
        ? `On a ${days}-day road trip, a family drove: Day 1: 120 km, Day 2: 140 km, Day 3: 110 km, Day 4: 150 km, and Day 5: 130 km. How many kilometers did they drive on average each day?`
        : `Μια οικογένεια σε ένα οδικό ταξίδι ${days} ημερών διένυσε: 1η μέρα 120 km, 2η μέρα 140 km, 3η μέρα 110 km, 4η μέρα 150 km και 5η μέρα 130 km. Πόσα χιλιόμετρα διένυε κατά μέσο όρο κάθε ημέρα;`,
      explanation: isEn ? (
        <span className="flex flex-wrap items-center gap-1">
          <span>Total distance: {dailyKmSumFormatted} ＝ {totalKmFormatted} km. Divide by the {days} days:</span>
          <MathFraction numerator={`${totalKmFormatted} km`} denominator={days.toString()} />
          <span>＝ {avgKmFormatted} km per day.</span>
        </span>
      ) : (
        <span className="flex flex-wrap items-center gap-1">
          <span>Συνολικά χιλιόμετρα: {dailyKmSumFormatted} ＝ {totalKmFormatted} km. Διαιρούμε με τις {days} ημέρες:</span>
          <MathFraction numerator={`${totalKmFormatted} km`} denominator={days.toString()} />
          <span>＝ {avgKmFormatted} km την ημέρα.</span>
        </span>
      )
    };
  } else {
    // q8: Μέσος όρος εισπράξεων καταστήματος (MCQ)
    const count = 4;
    const amounts = [240, 310, 190, 260];
    const total = amounts.reduce((a, b) => a + b, 0); // 1000
    const avg = total / count; // 250

    const rawDistractors = [avg + 20, avg - 25, avg + 50, avg - 40].filter((v) => v !== avg && v > 0);
    const uniqueRawOptions = [...new Set([avg, ...rawDistractors])].slice(0, 4);
    const options = shuffleArray(uniqueRawOptions).map((v) => `${v.toLocaleString(numberLocale)} €`);

    const amountsListFormatted = amounts.map((a) => `${a.toLocaleString(numberLocale)} €`).join(', ');
    const amountsSumFormatted = amounts.map((a) => `${a.toLocaleString(numberLocale)} €`).join(' ＋ ');
    const totalFormatted = total.toLocaleString(numberLocale);
    const avgFormatted = avg.toLocaleString(numberLocale);

    return {
      type: 'mcq',
      correct: `${avgFormatted} €`,
      options,
      prompt: isEn
        ? `A small shop had the following daily revenue over 4 days: ${amountsListFormatted}. What was the average daily revenue?`
        : `Ένα μικρό κατάστημα είχε τις εξής εισπράξεις σε 4 ημέρες: ${amountsListFormatted}. Ποια ήταν η μέση ημερήσια είσπραξη;`,
      explanation: isEn ? (
        <span className="flex flex-wrap items-center gap-1">
          <span>Total revenue: {amountsSumFormatted} ＝ {totalFormatted} €. Divide by the {count} days:</span>
          <MathFraction numerator={`${totalFormatted} €`} denominator={count.toString()} />
          <span>＝ {avgFormatted} €.</span>
        </span>
      ) : (
        <span className="flex flex-wrap items-center gap-1">
          <span>Συνολικές εισπράξεις: {amountsSumFormatted} ＝ {totalFormatted} €. Διαιρούμε με τις {count} ημέρες:</span>
          <MathFraction numerator={`${totalFormatted} €`} denominator={count.toString()} />
          <span>＝ {avgFormatted} €.</span>
        </span>
      )
    };
  }
}

function generateQuestions(isEn = false) {
  return {
    q1: makeDirectAverageQuestion(false, isEn),
    q2: makeDirectAverageQuestion(true, isEn),
    q3: makeReverseAndPropertiesQuestion(false, isEn),
    q4: makeReverseAndPropertiesQuestion(true, isEn),
    q5: makeMissingValueAverageQuestion(false, isEn),
    q6: makeMissingValueAverageQuestion(true, isEn),
    q7: makeComplexAverageWordProblem(false, isEn),
    q8: makeComplexAverageWordProblem(true, isEn)
  };
}

const I18N = {
  el: {
    pageTitle: "Ασκήσεις: Μέση Τιμή (Μέσος Όρος) - Ε' Δημοτικού | LearnMaths.gr",
    pageDescription: "Απαιτητικές ασκήσεις μαθηματικών Ε' Δημοτικού στη μέση τιμή: υπολογισμός μέσου όρου, εύρεση άγνωστης τιμής και σύνθετα προβλήματα καθημερινής ζωής.",
    backText: "Ε' Δημοτικού",
    theoryButton: "Θεωρία",
    badgeChapter: "Ε' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
    pageHeader: "📝 Ασκήσεις: Μέση Τιμή (Μέσος Όρος)",
    pageSubheader: "Κάθε φορά που πατάς «Νέες Ασκήσεις», δημιουργούνται νέα παραδείγματα από τη δεξαμενή!",
    newExercisesBtn: "Νέες Ασκήσεις",
    submitBtn: "Έλεγχος Απαντήσεων",
    scoreBadge: "Σκορ:",
    successRate: "Επιτυχία:",
    bottomPrompt: "Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!",
    correctFeedbackPrefix: "Η σωστή απάντηση είναι:",
    qTitles: {
      q1: "ΜΕΣΟΣ ΟΡΟΣ ΒΑΘΜΟΛΟΓΙΑΣ",
      q2: "ΜΕΣΗ ΘΕΡΜΟΚΡΑΣΙΑ ΤΕΤΡΑΗΜΕΡΟΥ",
      q3: "ΕΥΡΕΣΗ ΣΥΝΟΛΙΚΟΥ ΠΟΣΟΥ ΑΠΟ ΜΕΣΟ ΟΡΟ",
      q4: "ΕΛΕΓΧΟΣ ΟΡΙΩΝ ΜΕΣΗΣ ΤΙΜΗΣ",
      q5: "ΕΥΡΕΣΗ ΑΓΝΩΣΤΟΥ ΒΑΘΜΟΥ",
      q6: "ΕΥΡΕΣΗ ΑΓΝΩΣΤΗΣ ΠΟΣΟΤΗΤΑΣ",
      q7: "ΠΡΟΒΛΗΜΑ ΜΕΣΗΣ ΗΜΕΡΗΣΙΑΣ ΑΠΟΣΤΑΣΗΣ",
      q8: "ΠΡΟΒΛΗΜΑ ΜΕΣΩΝ ΕΙΣΠΡΑΞΕΩΝ"
    }
  },
  en: {
    pageTitle: "Exercises: Mean Value (Average) - 5th Grade | LearnMaths.gr",
    pageDescription: "Challenging 5th Grade math exercises on mean value: calculating averages, finding unknown quantities, and solving real-world word problems.",
    backText: "5th Grade",
    theoryButton: "Theory",
    badgeChapter: "5TH GRADE • PRACTICE",
    pageHeader: "📝 Exercises: Mean Value (Average)",
    pageSubheader: "Every time you click \"New Exercises\", a fresh randomized problem set is generated!",
    newExercisesBtn: "New Exercises",
    submitBtn: "Check Answers",
    scoreBadge: "Score:",
    successRate: "Success:",
    bottomPrompt: "Complete all questions and click \"Check Answers\"!",
    correctFeedbackPrefix: "The correct answer is:",
    qTitles: {
      q1: "AVERAGE GRADE CALCULATION",
      q2: "FOUR-DAY AVERAGE TEMPERATURE",
      q3: "FINDING TOTAL FROM MEAN VALUE",
      q4: "MEAN VALUE BOUNDS CHECK",
      q5: "FINDING UNKNOWN GRADE",
      q6: "FINDING UNKNOWN QUANTITY",
      q7: "AVERAGE DAILY TRAVEL DISTANCE",
      q8: "AVERAGE STORE REVENUE"
    }
  }
};

export default function MesiTimiAskPage() {
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
            <h3 className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-snug">
              {qData.prompt}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:pl-11 2xl:pl-13">
          {qData.options.map((opt, idx) => {
            const isSelected = answers[qKey] === opt;
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
                <span className="break-words whitespace-normal leading-snug flex-1">{opt}</span>
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
                <strong className="font-bold text-rose-950">{qData.correct}</strong>.
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
            <h3 className="text-base sm:text-lg 2xl:text-xl font-bold text-slate-900 leading-snug">
              {qData.prompt}
            </h3>
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
          href="/e-dimotikou/11-mesitimi"
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