// pages/st-dimotikou/56-pinakas-sixnotiton.js
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Ατονα ελληνικα κεφαλαια με εξαιρεση το ΣΤ'
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

// Μορφοποιηση αριθμου αναλογα με το locale
function formatNum(val, locale = 'el', decimals = 1) {
  if (val === undefined || val === null || isNaN(val)) return '0';
  const loc = locale === 'en' ? 'en-US' : 'el-GR';
  if (Number.isInteger(val)) {
    return val.toLocaleString(loc);
  }
  return Number(val.toFixed(decimals)).toLocaleString(loc, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// Κανονικη μορφη κλασματος (αριθμητης πανω, γραμμη, παρονομαστης κατω)
function Fraction({ num, den, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center align-middle mx-1 text-center font-mono leading-none ${className}`}>
      <span className="text-[0.9em] font-bold pb-0.5 px-1 border-b border-current">{num}</span>
      <span className="text-[0.9em] font-bold pt-0.5 px-1">{den}</span>
    </span>
  );
}

// Τυχαιος ακεραιος
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function PinakasSixnotitonTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';

  // Λεξικο i18n
  const t = useMemo(() => {
    return {
      el: {
        pageTitle: "Πίνακας Συχνοτήτων & Ταξινόμηση Δεδομένων - ΣΤ' Δημοτικού | LearnMaths.gr",
        metaDescription: "Μαθαίνουμε πώς ταξινομούμε πρωτογενή δεδομένα, πώς κατασκευάζουμε πίνακα κατανομής συχνοτήτων και σχετικών συχνοτήτων και πώς εξάγουμε ασφαλή συμπεράσματα.",
        backText: "ΣΤ' Δημοτικού",
        actionBtn: "🎯 Ασκήσεις",
        chapterBadge: "ΚΕΦΑΛΑΙΟ 56 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
        headerTitle: "Ταξινόμηση Δεδομένων & Πίνακας Συχνοτήτων",
        headerDesc: "Ανακαλύπτουμε πώς μετατρέπουμε μια άτακτη συλλογή πληροφοριών σε έναν οργανωμένο πίνακα κατανομής συχνοτήτων. Υπολογίζουμε συχνότητες, σχετικές συχνότητες και ποσοστά (%), και μαθαίνουμε να εξάγουμε έγκυρα στατιστικά συμπεράσματα.",
        headerSub: "Θεωρία, Οπτικοί Πίνακες & Διαδραστικός Υπολογιστής Συχνοτήτων",
        tryExercises: "Δοκίμασε τις Ασκήσεις",
        roadmapTitle: "Η Διαδρομή της Στατιστικής Έρευνας σε 4 Βήματα",
        roadmapDesc: "Από την πρωτογενή καταγραφή των αριθμών στην ερμηνεία και τα συμπεράσματα.",
        step1Badge: "ΒΗΜΑ 1",
        step1Tag: "Διαλογή",
        step1Title: "Συλλογή & Ταξινόμηση",
        step1Text: "Όταν συγκεντρώνουμε μετρήσεις (π.χ. βαθμούς διαγωνίσματος), τα δεδομένα είναι άτακτα. Κάνουμε διαλογή μετρώντας πόσες φορές εμφανίζεται κάθε τιμή:",
        step1Raw: "Άτακτα δεδομένα:",
        step1Sorted: "Ταξινόμηση σε αύξουσα σειρά:",
        step1Tip: "💡 Η ταξινόμηση από το μικρότερο στο μεγαλύτερο αποτρέπει τα λάθη καταμέτρησης.",
        step2Badge: "ΒΗΜΑ 2",
        step2Tag: "Πίνακας",
        step2Title: "Πίνακας Συχνοτήτων",
        step2Text: "Ο πίνακας κατανομής συχνοτήτων καταγράφει σε στήλες τις τιμές της μεταβλητής και το πλήθος των εμφανίσεών τους:",
        step2Bullet1: "Συχνότητα (ν): Πόσες φορές εμφανίζεται η τιμή.",
        step2Bullet2: "Μέγεθος Δείγματος (Ν): Το άθροισμα όλων των συχνοτήτων (σύνολο παρατηρήσεων).",
        step2Tip: "⚡ Αν αθροίσουμε όλες τις συχνότητες, βρίσκουμε υποχρεωτικά το συνολικό μέγεθος του δείγματος.",
        step3Badge: "ΒΗΜΑ 3",
        step3Tag: "Αναλογία",
        step3Title: "Σχετική Συχνότητα & %",
        step3Text: "Η σχετική συχνότητα εκφράζει το μέρος του συνόλου που αντιστοιχεί σε κάθε τιμή:",
        step3FormulaText: "Σχετική Συχνότητα ＝",
        step3PctText: "Ποσοστό (%) ＝ Σχετική Συχνότητα · 100",
        step3Tip: "🎯 Το άθροισμα των σχετικών συχνοτήτων ισούται πάντα με 1 (ή το 100%).",
        step4Badge: "ΒΗΜΑ 4",
        step4Tag: "Συμπεράσματα",
        step4Title: "Επικρατούσα Τιμή & Εύρος",
        step4Text: "Από τον πίνακα διαβάζουμε άμεσα τα βασικά στατιστικά χαρακτηριστικά:",
        step4Bullet1: "Επικρατούσα Τιμή (Mode): Η τιμή με τη μεγαλύτερη συχνότητα.",
        step4Bullet2: "Εύρος: Μέγιστη τιμή － Ελάχιστη τιμή.",
        step4Tip: "🚀 Έτσι απαντάμε σε ερωτήματα όπως: «Ποιος βαθμός σημειώθηκε τις περισσότερες φορές;»",
        lab1Badge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1",
        lab1Title: "Δυναμικός Πίνακας Κατανομής & Σχετικών Συχνοτήτων",
        lab1Desc: "Μεταβάλλετε τις συχνότητες των 4 βαθμολογιών ανά 1 μαθητή. Ο πίνακας υπολογίζει αυτόματα το σύνολο, τις σχετικές συχνότητες, τα ποσοστά και την επικρατούσα τιμή.",
        grade10: "Βαθμός 10",
        grade9: "Βαθμός 9",
        grade8: "Βαθμός 8",
        grade7: "Βαθμός 7",
        studentsUnit: "μαθητές",
        tableHeading: "ΠΙΝΑΚΑΣ ΚΑΤΑΝΟΜΗΣ ΣΥΧΝΟΤΗΤΩΝ",
        totalLabel: "Σύνολο:",
        colValue: "Τιμή",
        colFreq: "ν",
        colRelFreq: "Σχ. ν",
        colPct: "%",
        colFreqFull: "Συχνότητα (ν)",
        colRelFreqFull: "Σχετική Συχνότητα",
        colPctFull: "Ποσοστό (%)",
        tableTotal: "ΣΥΝΟΛΟ",
        modeTitle: "Επικρατούσα τιμή:",
        lab2Badge: "⚡ ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΔΙΑΛΟΓΗ",
        lab2Title: "Πώς Κάνουμε Διαλογή με Γραμμές Καταμέτρησης",
        lab2Desc: "Πατήστε «Νέα Τυχαία Δεδομένα» και δείτε πώς ταξινομούνται αυτόματα τα πρωτογενή νούμερα με γραμμές καταμέτρησης (|) στον πίνακα:",
        newRandomBtn: "🔄 Νέα Τυχαία Δεδομένα",
        rawSampleTitle: "ΠΡΩΤΟΓΕΝΗ ΔΕΔΟΜΕΝΑ (12 ΠΑΡΑΤΗΡΗΣΕΙΣ)",
        rawSampleDesc: "Όταν τα δεδομένα είναι διάσπαρτα, είναι δύσκολο να καταλάβουμε ποιος αριθμός εμφανίζεται συχνότερα.",
        tallyTableTitle: "ΠΙΝΑΚΑΣ ΔΙΑΛΟΓΗΣ ΚΑΙ ΣΥΧΝΟΤΗΤΩΝ",
        colTally: "Καταμέτρηση",
        valueLabel: "Τιμή",
        tallyTip: "Με τις γραμμές καταμέτρησης η μετατροπή σε συχνότητες γίνεται γρήγορα και αλάνθαστα!",
        problemsHeading: "Λυμένα Προβλήματα με Πίνακες & Σχήματα",
        problemsDesc: "Δύο ολοκληρωμένα παραδείγματα στατιστικής ανάλυσης με πίνακες συχνοτήτων και γραφικά.",
        prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΒΑΘΜΟΛΟΓΙΕΣ ΔΙΑΓΩΝΙΣΜΑΤΟΣ",
        prob1Tag: "Σχολείο",
        prob1Title: "Κατανομή Βαθμών σε Τμήμα 25 Μαθητών",
        prob1Desc: "Σε ένα διαγώνισμα Μαθηματικών 25 μαθητών καταγράφηκαν οι βαθμοί: 5 μαθητές πήραν «10», 10 μαθητές πήραν «9», 7 μαθητές πήραν «8» και 3 μαθητές πήραν «7».",
        prob1ConclTitle: "Συμπεράσματα από τον Πίνακα:",
        prob1Concl1: "Επικρατούσα τιμή: Βαθμός 9 (10 μαθητές, 40%).",
        prob1Concl2: "Βαθμός τουλάχιστον 9: 5 ＋ 10 ＝ 15 μαθητές (60%).",
        prob1Tip: "💡 Ο πίνακας μας δείχνει αμέσως ότι η πλειοψηφία των μαθητών (60%) έγραψε πολύ καλά (9 ή 10).",
        prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΚΑΘΗΜΕΡΙΝΕΣ ΣΥΝΗΘΕΙΕΣ",
        prob2Tag: "Έρευνα",
        prob2Title: "Ώρες Ενασχόλησης με το Διάβασμα",
        prob2Desc: "Σε έρευνα 20 μαθητών για τις ώρες που διαβάζουν καθημερινά στο σπίτι καταγράφηκαν: 1 ώρα (4 μαθητές), 2 ώρες (10 μαθητές), 3 ώρες (6 μαθητές).",
        prob2Row1: "1 ώρα",
        prob2Row2: "2 ώρες (Mode)",
        prob2Row3: "3 ώρες",
        prob2ConclTitle: "Συμπεράσματα από τον Πίνακα:",
        prob2Concl1: "Επικρατούσα τιμή: 2 ώρες (50% των μαθητών).",
        prob2Concl2: "Πάνω από 1 ώρα: 10 ＋ 6 ＝ 16 μαθητές (80%).",
        prob2Tip: "💡 Το 80% των παιδιών διαβάζει από 2 ώρες και πάνω, γεγονός που αποτυπώνεται καθαρά στον πίνακα.",
        ctaTitle: "Ώρα για Εξάσκηση στον Πίνακα Συχνοτήτων!",
        ctaDesc: "Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικές ασκήσεις ταξινόμησης δεδομένων, συμπλήρωσης πινάκων κατανομής συχνοτήτων και εξαγωγής στατιστικών συμπερασμάτων για τη ΣΤ' Δημοτικού.",
        ctaBtn: "🎯 Έναρξη Ασκήσεων",
      },
      en: {
        pageTitle: "Frequency Tables & Data Organization - 6th Grade | LearnMaths.gr",
        metaDescription: "Learn how to organize raw data, construct frequency and relative frequency distribution tables, and draw valid statistical conclusions.",
        backText: "6th Grade",
        actionBtn: "🎯 Exercises",
        chapterBadge: "CHAPTER 56 • 6TH GRADE",
        headerTitle: "Data Organization & Frequency Tables",
        headerDesc: "Discover how to transform an unorganized collection of data into a structured frequency distribution table. We compute frequencies, relative frequencies, percentages (%), and learn to draw sound statistical conclusions.",
        headerSub: "Theory, Visual Tables & Interactive Frequency Calculator",
        tryExercises: "Try the Exercises",
        roadmapTitle: "The Statistical Investigation Journey in 4 Steps",
        roadmapDesc: "From raw data collection to interpretation and conclusions.",
        step1Badge: "STEP 1",
        step1Tag: "Tallying",
        step1Title: "Collection & Ordering",
        step1Text: "When collecting measurements (e.g. test scores), raw data is unordered. We tally and sort the values by counting how many times each value appears:",
        step1Raw: "Raw data:",
        step1Sorted: "Sorted in ascending order:",
        step1Tip: "💡 Sorting from smallest to largest prevents counting mistakes.",
        step2Badge: "STEP 2",
        step2Tag: "Table",
        step2Title: "Frequency Table",
        step2Text: "A frequency distribution table displays the distinct values and their number of occurrences in structured columns:",
        step2Bullet1: "Frequency (f): How many times each value occurs.",
        step2Bullet2: "Sample Size (N): The sum of all frequencies (total observations).",
        step2Tip: "⚡ Adding all individual frequencies always equals the total sample size.",
        step3Badge: "STEP 3",
        step3Tag: "Proportion",
        step3Title: "Relative Frequency & %",
        step3Text: "Relative frequency represents the fraction of the total corresponding to each distinct value:",
        step3FormulaText: "Relative Frequency ＝",
        step3PctText: "Percentage (%) ＝ Relative Frequency · 100",
        step3Tip: "🎯 The sum of all relative frequencies always equals 1 (or 100%).",
        step4Badge: "STEP 4",
        step4Tag: "Conclusions",
        step4Title: "Mode & Range",
        step4Text: "From the table we can directly identify key statistical summary measures:",
        step4Bullet1: "Mode: The value with the highest frequency.",
        step4Bullet2: "Range: Maximum value － Minimum value.",
        step4Tip: "🚀 This answers questions such as: “Which score was achieved most frequently?”",
        lab1Badge: "🔬 INTERACTIVE LAB 1",
        lab1Title: "Dynamic Distribution & Relative Frequency Table",
        lab1Desc: "Adjust the frequencies of the 4 scores. The table automatically recalculates the total, relative frequencies, percentages, and mode.",
        grade10: "Grade 10",
        grade9: "Grade 9",
        grade8: "Grade 8",
        grade7: "Grade 7",
        studentsUnit: "students",
        tableHeading: "FREQUENCY DISTRIBUTION TABLE",
        totalLabel: "Total:",
        colValue: "Value",
        colFreq: "f",
        colRelFreq: "Rel. f",
        colPct: "%",
        colFreqFull: "Frequency (f)",
        colRelFreqFull: "Relative Frequency",
        colPctFull: "Percentage (%)",
        tableTotal: "TOTAL",
        modeTitle: "Mode:",
        lab2Badge: "⚡ INTERACTIVE LAB 2: TALLYING",
        lab2Title: "Sorting Data with Tally Marks",
        lab2Desc: "Click “New Random Data” to see how raw data is automatically counted and tallied (|) in the table:",
        newRandomBtn: "🔄 New Random Data",
        rawSampleTitle: "RAW DATA (12 OBSERVATIONS)",
        rawSampleDesc: "When numbers are scattered, it is difficult to see at a glance which value appears most often.",
        tallyTableTitle: "TALLY & FREQUENCY TABLE",
        colTally: "Tally",
        valueLabel: "Value",
        tallyTip: "Tally marks make counting quick, organized, and error-free!",
        problemsHeading: "Worked Problems with Tables & Visuals",
        problemsDesc: "Two complete examples of statistical analysis with frequency tables and interpretation.",
        prob1Badge: "PROBLEM 1: TEST SCORES",
        prob1Tag: "School",
        prob1Title: "Grade Distribution in a Class of 25 Students",
        prob1Desc: "In a Math test taken by 25 students, scores were: 5 students scored “10”, 10 scored “9”, 7 scored “8”, and 3 scored “7”.",
        prob1ConclTitle: "Conclusions from the Table:",
        prob1Concl1: "Mode: Grade 9 (10 students, 40%).",
        prob1Concl2: "Score of at least 9: 5 ＋ 10 ＝ 15 students (60%).",
        prob1Tip: "💡 The table makes it clear that the majority of students (60%) performed very well (9 or 10).",
        prob2Badge: "PROBLEM 2: DAILY HABITS",
        prob2Tag: "Survey",
        prob2Title: "Daily Study Hours",
        prob2Desc: "In a survey of 20 students regarding daily home study hours: 1 hour (4 students), 2 hours (10 students), 3 hours (6 students).",
        prob2Row1: "1 hour",
        prob2Row2: "2 hours (Mode)",
        prob2Row3: "3 hours",
        prob2ConclTitle: "Conclusions from the Table:",
        prob2Concl1: "Mode: 2 hours (50% of students).",
        prob2Concl2: "More than 1 hour: 10 ＋ 6 ＝ 16 students (80%).",
        prob2Tip: "💡 80% of students study for 2 or more hours daily, as shown clearly in the table.",
        ctaTitle: "Time to Practice Frequency Tables!",
        ctaDesc: "Test your skills with 10 dynamic exercises on data sorting, completing frequency tables, and statistical conclusions for 6th Grade.",
        ctaBtn: "🎯 Start Exercises",
      }
    }[locale];
  }, [locale]);

  // Εργαστηριο 1: Διαδραστικος Πινακας Κατανομης Συχνοτητων
  const [freqA, setFreqA] = useState(6);  // Βαθμος 10
  const [freqB, setFreqB] = useState(10); // Βαθμος 9
  const [freqC, setFreqC] = useState(5);  // Βαθμος 8
  const [freqD, setFreqD] = useState(4);  // Βαθμος 7

  const totalN = freqA + freqB + freqC + freqD;

  const tableRows = useMemo(() => {
    const rawData = [
      { label: t.grade10, shortLabel: '10', freq: freqA, color: '#10b981' },
      { label: t.grade9, shortLabel: '9', freq: freqB, color: '#3b82f6' },
      { label: t.grade8, shortLabel: '8', freq: freqC, color: '#f59e0b' },
      { label: t.grade7, shortLabel: '7', freq: freqD, color: '#ec4899' }
    ];

    return rawData.map((row) => {
      const relFreq = totalN > 0 ? row.freq / totalN : 0;
      const pct = totalN > 0 ? (row.freq / totalN) * 100 : 0;
      return {
        ...row,
        relFreq: Number(relFreq.toFixed(2)),
        pct: Number(pct.toFixed(1))
      };
    });
  }, [freqA, freqB, freqC, freqD, totalN, t]);

  // Επικρατουσα κατηγορια (μεγαλυτερη συχνοτητα)
  const maxFreqRow = useMemo(() => {
    return [...tableRows].sort((a, b) => b.freq - a.freq)[0];
  }, [tableRows]);

  // Εργαστηριο 2: Ταξινομηση & Καταμετρηση Πρωτογενων Δεδομενων
  const [rawSample, setRawSample] = useState([2, 3, 1, 2, 4, 3, 2, 1, 3, 2, 4, 2]);

  const tallyCounts = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
    rawSample.forEach((val) => {
      if (counts[val] !== undefined) counts[val]++;
    });
    return counts;
  }, [rawSample]);

  const generateNewRawData = () => {
    const newArr = [];
    for (let i = 0; i < 12; i++) {
      newArr.push(randInt(1, 4));
    }
    setRawSample(newArr);
  };

  const freqSymbol = locale === 'en' ? 'f' : 'ν';

  return (
    <Layout
      title={t.pageTitle}
      description={t.metaDescription}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/56-pinakas-sixnotiton-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>{t.actionBtn}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-28 sm:pb-36 overflow-x-hidden">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{toCleanUppercase(t.chapterBadge)}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {t.headerTitle}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-2xl leading-relaxed max-w-4xl">
              {t.headerDesc}
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t.headerSub}</span>
            </div>
            <Link
              href="/st-dimotikou/56-pinakas-sixnotiton-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>{t.tryExercises}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΑΝΑΛΥΣΗΣ ΘΕΩΡΙΑΣ ΣΕ 4 ΒΗΜΑΤΑ */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              {t.roadmapTitle}
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              {t.roadmapDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-5 sm:gap-6 2xl:gap-8">
            
            {/* Βημα 1ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step1Badge)}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step1Tag}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step1Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step1Text}
                </p>

                <div className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1 font-mono">
                  <div className="text-slate-500 font-sans text-[11px]">{t.step1Raw}</div>
                  <div className="font-bold text-slate-800 text-xs sm:text-sm">10, 9, 8, 9, 10, 9, 7, 8, 9</div>
                  <div className="text-slate-500 font-sans text-[11px] pt-1">{t.step1Sorted}</div>
                  <div className="font-bold text-blue-700 text-xs sm:text-sm">7, 8, 8, 9, 9, 9, 9, 10, 10</div>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                {t.step1Tip}
              </div>
            </article>

            {/* Βημα 2ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step2Badge)}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step2Tag}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step2Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step2Text}
                </p>

                <div className="space-y-1.5 text-xs sm:text-sm">
                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-950">
                    • <strong>{t.step2Bullet1}</strong>
                  </div>
                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-950">
                    • <strong>{t.step2Bullet2}</strong>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                {t.step2Tip}
              </div>
            </article>

            {/* Βημα 3ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step3Badge)}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step3Tag}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step3Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step3Text}
                </p>

                <div className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm font-mono text-center">
                  <div className="p-2 bg-white rounded-xl border border-slate-200 text-indigo-950 font-bold flex items-center justify-center flex-wrap gap-1">
                    <span>{t.step3FormulaText}</span>
                    <Fraction num={freqSymbol} den="Ν" className="text-base text-indigo-700" />
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-600 font-sans">
                    {t.step3PctText}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                {t.step3Tip}
              </div>
            </article>

            {/* Βημα 4ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step4Badge)}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step4Tag}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step4Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step4Text}
                </p>

                <div className="space-y-1.5 text-xs sm:text-sm">
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    • <strong>{t.step4Bullet1}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    • <strong>{t.step4Bullet2}</strong>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {t.step4Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΔΥΝΑΜΙΚΟΣ ΠΙΝΑΚΑΣ ΚΑΤΑΝΟΜΗΣ ΣΥΧΝΟΤΗΤΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 sm:pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>{toCleanUppercase(t.lab1Badge)}</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                {t.lab1Title}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                {t.lab1Desc}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* Χειριστηρια Συχνοτητων */}
            <div className="lg:col-span-5 space-y-3">
              
              {/* Βαθμος 10 */}
              <div className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> {t.grade10}
                  </span>
                  <span className="font-mono font-black text-xs sm:text-sm text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {freqA} {t.studentsUnit}
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-9 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFreqA((prev) => Math.max(0, prev - 1)); }}
                    disabled={freqA <= 0}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={15}
                    step={1}
                    value={freqA}
                    onChange={(e) => setFreqA(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFreqA((prev) => Math.min(15, prev + 1)); }}
                    disabled={freqA >= 15}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Βαθμος 9 */}
              <div className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> {t.grade9}
                  </span>
                  <span className="font-mono font-black text-xs sm:text-sm text-blue-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {freqB} {t.studentsUnit}
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-9 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFreqB((prev) => Math.max(0, prev - 1)); }}
                    disabled={freqB <= 0}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={15}
                    step={1}
                    value={freqB}
                    onChange={(e) => setFreqB(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFreqB((prev) => Math.min(15, prev + 1)); }}
                    disabled={freqB >= 15}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Βαθμος 8 */}
              <div className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> {t.grade8}
                  </span>
                  <span className="font-mono font-black text-xs sm:text-sm text-amber-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {freqC} {t.studentsUnit}
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-9 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFreqC((prev) => Math.max(0, prev - 1)); }}
                    disabled={freqC <= 0}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={15}
                    step={1}
                    value={freqC}
                    onChange={(e) => setFreqC(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFreqC((prev) => Math.min(15, prev + 1)); }}
                    disabled={freqC >= 15}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Βαθμος 7 */}
              <div className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span> {t.grade7}
                  </span>
                  <span className="font-mono font-black text-xs sm:text-sm text-pink-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {freqD} {t.studentsUnit}
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-9 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFreqD((prev) => Math.max(0, prev - 1)); }}
                    disabled={freqD <= 0}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={15}
                    step={1}
                    value={freqD}
                    onChange={(e) => setFreqD(Number(e.target.value))}
                    className="w-full accent-pink-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFreqD((prev) => Math.min(15, prev + 1)); }}
                    disabled={freqD >= 15}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

            </div>

            {/* Πινακας Κατανομης Συχνοτητων */}
            <div className="lg:col-span-7 bg-slate-50 p-3 sm:p-6 rounded-3xl border border-slate-200 space-y-3 sm:space-y-4 w-full">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {toCleanUppercase(t.tableHeading)}
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {t.totalLabel} <strong className="font-mono text-blue-700">{totalN}</strong>
                </span>
              </div>

              <div className="w-full">
                <table className="w-full table-fixed bg-white rounded-2xl border border-slate-200 text-center text-[11px] sm:text-xs md:text-sm font-mono overflow-hidden shadow-sm">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold font-sans">
                      <th className="w-[30%] p-1.5 sm:p-2.5 text-left pl-2 sm:pl-3 truncate">{t.colValue}</th>
                      <th className="w-[20%] p-1.5 sm:p-2.5 truncate" title={t.colFreqFull}>{t.colFreq}</th>
                      <th className="w-[25%] p-1.5 sm:p-2.5 truncate" title={t.colRelFreqFull}>{t.colRelFreq}</th>
                      <th className="w-[25%] p-1.5 sm:p-2.5 truncate" title={t.colPctFull}>{t.colPct}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((r, idx) => (
                      <tr key={`tr-${idx}`} className="border-b border-slate-100 hover:bg-slate-50 transition">
                        <td className="p-1.5 sm:p-2.5 text-left pl-2 sm:pl-3 font-bold font-sans flex items-center gap-1.5 truncate">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: r.color }}></span>
                          <span className="hidden sm:inline truncate">{r.label}</span>
                          <span className="sm:hidden font-mono font-bold">{r.shortLabel}</span>
                        </td>
                        <td className="p-1.5 sm:p-2.5 font-black text-slate-900">{r.freq}</td>
                        <td className="p-1.5 sm:p-2.5 text-slate-600">{formatNum(r.relFreq, locale, 2)}</td>
                        <td className="p-1.5 sm:p-2.5 font-bold text-emerald-700">{formatNum(r.pct, locale)}%</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-100/70 font-black text-slate-900 font-sans border-t border-slate-200">
                      <td className="p-1.5 sm:p-2.5 text-left pl-2 sm:pl-3 truncate">{toCleanUppercase(t.tableTotal)}</td>
                      <td className="p-1.5 sm:p-2.5 font-mono">{totalN}</td>
                      <td className="p-1.5 sm:p-2.5 font-mono">{formatNum(1.0, locale, 2)}</td>
                      <td className="p-1.5 sm:p-2.5 font-mono text-emerald-800">100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Ενημερωτικη Καρτα Επικρατουσας Τιμης */}
              <div className="p-2.5 sm:p-3.5 bg-blue-50/80 rounded-2xl border border-blue-200 text-xs sm:text-sm text-blue-950 flex items-center justify-between gap-2">
                <span className="truncate">
                  🌟 <strong>{t.modeTitle}</strong> {maxFreqRow ? maxFreqRow.label : '-'} ({freqSymbol} ＝ {maxFreqRow ? maxFreqRow.freq : 0})
                </span>
                <span className="font-bold text-blue-800 text-[11px] sm:text-xs shrink-0">
                  {maxFreqRow ? `${formatNum(maxFreqRow.pct, locale)}%` : ''}
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΔΙΑΛΟΓΗ & ΚΑΤΑΜΕΤΡΗΣΗ ΠΡΩΤΟΓΕΝΩΝ ΔΕΔΟΜΕΝΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-5 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 sm:pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
                <span>{toCleanUppercase(t.lab2Badge)}</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                {t.lab2Title}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                {t.lab2Desc}
              </p>
            </div>

            <button
              type="button"
              onClick={generateNewRawData}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs sm:text-sm shadow-sm transition active:scale-95 shrink-0 self-start sm:self-center"
            >
              {t.newRandomBtn}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-center">
            
            {/* Πρωτογενη Ατακτα Δεδομενα */}
            <div className="lg:col-span-5 bg-slate-50 p-4 sm:p-5 rounded-3xl border border-slate-200 space-y-2.5">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {toCleanUppercase(t.rawSampleTitle)}
              </span>
              <div className="grid grid-cols-6 sm:grid-cols-4 gap-1.5 sm:gap-2">
                {rawSample.map((num, i) => (
                  <span
                    key={`raw-${i}`}
                    className="aspect-square rounded-xl bg-white border border-slate-200 font-mono font-black text-sm sm:text-base text-slate-800 flex items-center justify-center shadow-sm"
                  >
                    {num}
                  </span>
                ))}
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed pt-1">
                {t.rawSampleDesc}
              </p>
            </div>

            {/* Πινακας Διαλογης με Tally Marks */}
            <div className="lg:col-span-7 bg-white p-3.5 sm:p-5 rounded-3xl border-2 border-slate-200 shadow-sm space-y-2.5 w-full">
              <span className="text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider block text-center">
                {toCleanUppercase(t.tallyTableTitle)}
              </span>

              <div className="w-full">
                <table className="w-full table-fixed text-center text-xs sm:text-sm font-mono">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-600 font-bold font-sans">
                      <th className="w-[30%] p-1.5 text-left pl-2">{t.colValue}</th>
                      <th className="w-[45%] p-1.5">{t.colTally}</th>
                      <th className="w-[25%] p-1.5">{t.colFreqFull}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4].map((val) => {
                      const count = tallyCounts[val];
                      return (
                        <tr key={`tally-${val}`} className="border-b border-slate-100">
                          <td className="p-1.5 text-left pl-2 font-bold text-slate-900 font-sans truncate">
                            {t.valueLabel} {val}
                          </td>
                          <td className="p-1.5 text-xs sm:text-base tracking-widest text-blue-600 font-black truncate">
                            {count > 0 ? '| '.repeat(count) : '-'}
                          </td>
                          <td className="p-1.5 font-black text-slate-900">{count}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="text-[11px] sm:text-xs text-slate-500 text-center font-sans pt-1">
                {t.tallyTip}
              </div>
            </div>

          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΑΡΑΔΕΙΓΜΑΤΑ ΠΡΟΒΛΗΜΑΤΩΝ ΜΕ ΣΧΗΜΑΤΑ & ΠΙΝΑΚΕΣ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              {t.problemsHeading}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.problemsDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            
            {/* Παραδειγμα 1 */}
            <article className="bg-white p-4 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 bg-blue-100 text-blue-900 text-[11px] sm:text-xs font-black rounded-lg">
                  {toCleanUppercase(t.prob1Badge)}
                </span>
                <span className="text-xs font-bold text-slate-400">{t.prob1Tag}</span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-slate-900">
                {t.prob1Title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.prob1Desc}
              </p>

              {/* ΠΙΝΑΚΑΣ ΠΑΡΑΔΕΙΓΜΑΤΟΣ 1 */}
              <div className="bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-200 w-full">
                <table className="w-full table-fixed text-center text-[10.5px] sm:text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-600 font-bold font-sans">
                      <th className="w-[30%] p-1 text-left pl-1.5 truncate">{t.colValue}</th>
                      <th className="w-[20%] p-1 truncate" title={t.colFreqFull}>{t.colFreq}</th>
                      <th className="w-[25%] p-1 truncate">{t.colRelFreq}</th>
                      <th className="w-[25%] p-1 truncate">{t.colPct}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="p-1 text-left pl-1.5 font-sans font-bold truncate">{t.grade10}</td>
                      <td className="p-1 font-bold">5</td>
                      <td className="p-1">{formatNum(0.20, locale, 2)}</td>
                      <td className="p-1 font-bold text-emerald-700">20%</td>
                    </tr>
                    <tr className="border-b border-slate-100 bg-blue-50/50">
                      <td className="p-1 text-left pl-1.5 font-sans font-bold text-blue-900 truncate">{t.grade9} (Mode)</td>
                      <td className="p-1 font-black text-blue-900">10</td>
                      <td className="p-1 text-blue-900 font-bold">{formatNum(0.40, locale, 2)}</td>
                      <td className="p-1 font-black text-blue-900">40%</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-1 text-left pl-1.5 font-sans font-bold truncate">{t.grade8}</td>
                      <td className="p-1 font-bold">7</td>
                      <td className="p-1">{formatNum(0.28, locale, 2)}</td>
                      <td className="p-1 font-bold text-emerald-700">28%</td>
                    </tr>
                    <tr>
                      <td className="p-1 text-left pl-1.5 font-sans font-bold truncate">{t.grade7}</td>
                      <td className="p-1 font-bold">3</td>
                      <td className="p-1">{formatNum(0.12, locale, 2)}</td>
                      <td className="p-1 font-bold text-emerald-700">12%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-1.5 text-xs sm:text-sm font-mono pt-1">
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px] font-bold">{t.prob1ConclTitle}</span>
                  <div>• <strong>{t.prob1Concl1}</strong></div>
                  <div>• <strong>{t.prob1Concl2}</strong></div>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 bg-blue-50 rounded-xl border border-blue-200 text-[11px] sm:text-xs text-blue-950 font-medium">
                {t.prob1Tip}
              </div>
            </article>

            {/* Παραδειγμα 2 */}
            <article className="bg-white p-4 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs font-black rounded-lg">
                  {toCleanUppercase(t.prob2Badge)}
                </span>
                <span className="text-xs font-bold text-slate-400">{t.prob2Tag}</span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-slate-900">
                {t.prob2Title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.prob2Desc}
              </p>

              {/* ΠΙΝΑΚΑΣ ΠΑΡΑΔΕΙΓΜΑΤΟΣ 2 */}
              <div className="bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-200 w-full">
                <table className="w-full table-fixed text-center text-[10.5px] sm:text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-600 font-bold font-sans">
                      <th className="w-[30%] p-1 text-left pl-1.5 truncate">{t.colValue}</th>
                      <th className="w-[20%] p-1 truncate" title={t.colFreqFull}>{t.colFreq}</th>
                      <th className="w-[25%] p-1 truncate">{t.colRelFreq}</th>
                      <th className="w-[25%] p-1 truncate">{t.colPct}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="p-1 text-left pl-1.5 font-sans font-bold truncate">{t.prob2Row1}</td>
                      <td className="p-1 font-bold">4</td>
                      <td className="p-1">{formatNum(0.20, locale, 2)}</td>
                      <td className="p-1 font-bold text-amber-800">20%</td>
                    </tr>
                    <tr className="border-b border-slate-100 bg-amber-50/50">
                      <td className="p-1 text-left pl-1.5 font-sans font-bold text-amber-950 truncate">{t.prob2Row2}</td>
                      <td className="p-1 font-black text-amber-900">10</td>
                      <td className="p-1 text-amber-900 font-bold">{formatNum(0.50, locale, 2)}</td>
                      <td className="p-1 font-black text-amber-900">50%</td>
                    </tr>
                    <tr>
                      <td className="p-1 text-left pl-1.5 font-sans font-bold truncate">{t.prob2Row3}</td>
                      <td className="p-1 font-bold">6</td>
                      <td className="p-1">{formatNum(0.30, locale, 2)}</td>
                      <td className="p-1 font-bold text-amber-800">30%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-1.5 text-xs sm:text-sm font-mono pt-1">
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px] font-bold">{t.prob2ConclTitle}</span>
                  <div>• <strong>{t.prob2Concl1}</strong></div>
                  <div>• <strong>{t.prob2Concl2}</strong></div>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] sm:text-xs text-amber-950 font-medium">
                {t.prob2Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 6. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              {t.ctaTitle}
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              {t.ctaDesc}
            </p>
          </div>

          <Link
            href="/st-dimotikou/56-pinakas-sixnotiton-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>{t.ctaBtn}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}