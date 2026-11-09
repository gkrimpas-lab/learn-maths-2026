// pages/st-dimotikou/40-logos.js
import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';

const LIMITS = {
  MIN_ITEMS: 1,
  MAX_ITEMS: 24,
  MIN_CUPS: 1,
  MAX_CUPS: 12
};

// Αυστηρή συνάρτηση αφαίρεσης τόνων για κεφαλαία (εξαιρείται το ΣΤ')
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

// Βοηθητικό component εμφάνισης κλάσματος με οριζόντια γραμμή
function Fraction({ num, den, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono leading-none ${className}`}>
      <span className="border-b-2 border-current px-1.5 pb-0.5 text-center leading-none">
        {num}
      </span>
      <span className="px-1.5 pt-0.5 text-center leading-none">
        {den}
      </span>
    </span>
  );
}

// Εύρεση Μεγίστου Κοινού Διαιρέτη (ΜΚΔ) για απλοποίηση λόγου
function getGCD(a, b) {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

// Λεξικό i18n
const TRANSLATIONS = {
  el: {
    pageTitle: "Η Έννοια του Λόγου - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Πλήρης θεωρία με παραδείγματα για την έννοια του λόγου, σύγκριση μεγεθών, απλοποίηση, δεκαδική τιμή λόγου και διαδραστικό εργαστήριο για τη ΣΤ' Δημοτικού.",
    backText: "ΣΤ' Δημοτικού",
    navExercises: "🎯 Ασκήσεις",
    heroBadge: "ΚΕΦΑΛΑΙΟ 40 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Η Έννοια του Λόγου",
    heroDesc: "Μαθαίνουμε πώς να συγκρίνουμε δύο μεγέθη μέσω της διαίρεσης, πώς εκφράζουμε έναν λόγο ως κλάσμα, πώς υπολογίζουμε την τιμή του και πώς εφαρμόζουμε την απλοποίηση στην καθημερινή ζωή και τις συνταγές.",
    heroFeature: "Θεωρία & Δυναμική Οπτικοποίηση Σύγκρισης Μεγεθών",
    heroCta: "Δοκίμασε τις Ασκήσεις",
    theoryTitle: "Βασικές Έννοιες σε 4 Βήματα",
    theorySubtitle: "Η μαθηματική ουσία του λόγου, η δομή των όρων του και οι μορφές έκφρασης.",
    step1Badge: "ΒΗΜΑ 1",
    step1Sub: "Ορισμός",
    step1Title: "Τι ονομάζουμε Λόγο;",
    step1Text: "Λόγος δύο αριθμών ή μεγεθών ονομάζεται το πηλίκο της διαίρεσης του πρώτου αριθμού με τον δεύτερο (όταν ο δεύτερος δεν είναι μηδέν).",
    step1Notation: "Συμβολισμός & Μορφή:",
    step1Or: "ή",
    step1TermsNote: (
      <>
        Ο αριθμός <strong>α</strong> ονομάζεται <em>προηγούμενος όρος</em> (αριθμητής) και ο <strong>β</strong> <em>επόμενος όρος</em> (παρονομαστής).
      </>
    ),
    step1Tip: "💡 Ο λόγος συγκρίνει πόσες φορές το ένα μέγεθος περιέχεται ή αντιστοιχεί στο άλλο.",
    step2Badge: "ΒΗΜΑ 2",
    step2Sub: "Κανόνας Σειράς",
    step2Title: "Η Σειρά των Όρων Μετράει!",
    step2Text: "Η σειρά με την οποία αναφέρονται οι ποσότητες είναι καθοριστική. Αν αλλάξουμε τη σειρά, αλλάζει η σημασία και η τιμή του λόγου:",
    step2RatioA: "Λόγος του 2 προς το 5 ＝",
    step2RatioB: "Λόγος του 5 προς το 2 ＝",
    step2InverseNote: "Οι δύο αυτοί λόγοι λέγονται αντίστροφοι.",
    step2Tip: (
      <>
        ⚡ <strong>Αντίστροφοι Λόγοι:</strong> Το γινόμενο δύο αντίστροφων λόγων είναι πάντα ίσο με 1 (π.χ. <Fraction num="2" den="5" /> · <Fraction num="5" den="2" /> ＝ 1).
      </>
    ),
    step3Badge: "ΒΗΜΑ 3",
    step3Sub: "Απλοποίηση & Τιμή",
    step3Title: "Απλοποίηση σε Ανάγωγο",
    step3Text: "Επειδή ο λόγος γράφεται ως κλάσμα, απλοποιείται διαιρώντας και τους δύο όρους με τον Μέγιστο Κοινό Διαιρέτη (ΜΚΔ):",
    step3ExampleTitle: "Παράδειγμα για 8 προς 12:",
    step3GcdLabel: "ΜΚΔ(8, 12) ＝ 4",
    step3SimpLabel: "(8 : 4) : (12 : 4) ＝",
    step3ValLabel: "Τιμή λόγου: 8 : 12 ≈ 0,67",
    step3Tip: "🎯 Ο απλοποιημένος λόγος εκφράζει την απλούστερη σχέση μεταξύ των δύο μεγεθών.",
    step4Badge: "ΒΗΜΑ 4",
    step4Sub: "Ομοειδή Μεγέθη",
    step4Title: "Σύγκριση Μεγεθών & Μονάδες",
    step4Text: "Όταν συγκρίνουμε ομοειδή μεγέθη, πρέπει απαραίτητα να εκφράζονται στην ίδια μονάδα μέτρησης:",
    step4SameLabel: "Ομοειδή:",
    step4SameText: "40 cm προς 2 m ＝ 40 cm προς 200 cm ＝ 40 : 200 ＝ 1 : 5 (καθαρός αριθμός χωρίς μονάδα).",
    step4DiffLabel: "Ετεροειδή:",
    step4DiffText: "120 km σε 2 h ＝ 120 : 2 ＝ 60 km/h (ταχύτητα, παράγωγο μέγεθος με μονάδα).",
    step4Tip: "🚀 Ο λόγος δύο ομοειδών μεγεθών δεν έχει μονάδα μέτρησης — είναι απλώς ένας αριθμός!",
    lab1Badge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1",
    lab1Title: "Δυναμικός Υπολογιστής & Αναλυτής Λόγου",
    lab1Subtitle: "Μεταβάλλετε τα στοιχεία για να δείτε τον αρχικό λόγο, την αναγωγή του μέσω ΜΚΔ, τη δεκαδική τιμή και την οπτική αντιστοίχιση.",
    blueTermLabel: "1ΟΣ ΟΡΟΣ (ΜΠΛΕ ΣΤΟΙΧΕΙΑ)",
    orangeTermLabel: "2ΟΣ ΟΡΟΣ (ΠΟΡΤΟΚΑΛΙ ΣΤΟΙΧΕΙΑ)",
    visualTotalLabel: (total) => `ΟΠΤΙΚΗ ΑΠΕΙΚΟΝΙΣΗ (ΣΥΝΟΛΟ: ${total} ΣΤΟΙΧΕΙΑ)`,
    blueLegend: (count) => `Μπλε (${count})`,
    orangeLegend: (count) => `Πορτοκαλί (${count})`,
    blueInitial: "Μ",
    orangeInitial: "Π",
    reductionPhrase: (b, o) => `💬 Σχέση Αναγωγής: Για κάθε ${b} μπλε ${b === 1 ? 'στοιχείο' : 'στοιχεία'}, αντιστοιχούν ${o} πορτοκαλί ${o === 1 ? 'στοιχείο' : 'στοιχεία'}.`,
    ratioCardHeader: "ΑΝΑΛΥΣΗ ΚΑΙ ΤΙΜΗ ΤΟΥ ΛΟΓΟΥ",
    gcdReducedNote: (b, o, g) => `Ο λόγος απλοποιήθηκε διαιρώντας και τους δύο όρους με τον ΜΚΔ(${b}, ${o}) ＝ ${g}.`,
    gcdIrreducibleNote: "Ο λόγος είναι ήδη ανάγωγος, καθώς οι αριθμοί είναι πρώτοι μεταξύ τους [ΜΚΔ ＝ 1].",
    lab2Badge: "🥤 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2",
    lab2Title: "Πραγματική Εφαρμογή: Αναλογία σε Συνταγή Χυμού",
    lab2Subtitle: "Όταν φτιάχνουμε έναν χυμό, ο λόγος καθορίζει τη γεύση και την πυκνότητα ανεξάρτητα από τη συνολική ποσότητα.",
    juiceLabel: "🍊 ΦΥΣΙΚΟΣ ΧΥΜΟΣ (ΠΟΤΗΡΙΑ)",
    waterLabel: "💧 ΝΕΡΟ (ΠΟΤΗΡΙΑ)",
    recipeTotalLabel: (total) => `ΣΥΝΘΕΣΗ ΜΕΙΓΜΑΤΟΣ (${total} ΠΟΤΗΡΙΑ ΣΥΝΟΛΙΚΑ)`,
    juiceRatioCol: "Λόγος Χυμού προς Νερό",
    irreducibleCol: "Ανάγωγη Μορφή",
    densityCol: "Τιμή Λόγου (Πυκνότητα)",
    ctaTitle: "Ώρα για Εξάσκηση στον Λόγο!",
    ctaDesc: "Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις υπολογισμού και απλοποίησης λόγων, σύγκρισης ομοειδών και ετεροειδών μεγεθών, καθώς και σε ρεαλιστικά προβλήματα αναλογιών.",
    ctaBtn: "Έναρξη Ασκήσεων"
  },
  en: {
    pageTitle: "The Concept of Ratio - 6th Grade | LearnMaths.gr",
    pageDesc: "Complete theory and examples on ratios, comparing quantities, simplifying ratios, decimal ratio values, and interactive labs for 6th Grade.",
    backText: "6th Grade",
    navExercises: "🎯 Exercises",
    heroBadge: "CHAPTER 40 • 6TH GRADE",
    heroTitle: "The Concept of Ratio",
    heroDesc: "Learn how to compare two quantities using division, how to express a ratio as a fraction, calculate its value, and apply simplification in everyday life and recipes.",
    heroFeature: "Theory & Dynamic Visualization of Ratio Comparisons",
    heroCta: "Try the Exercises",
    theoryTitle: "Core Concepts in 4 Steps",
    theorySubtitle: "The mathematical essence of a ratio, term order, and forms of expression.",
    step1Badge: "STEP 1",
    step1Sub: "Definition",
    step1Title: "What is a Ratio?",
    step1Text: "A ratio of two numbers or quantities is the quotient of dividing the first number by the second (when the second is not zero).",
    step1Notation: "Notation & Form:",
    step1Or: "or",
    step1TermsNote: (
      <>
        The number <strong>a</strong> is called the <em>antecedent</em> (numerator) and <strong>b</strong> is called the <em>consequent</em> (denominator).
      </>
    ),
    step1Tip: "💡 A ratio compares how many times one quantity is contained within or corresponds to another.",
    step2Badge: "STEP 2",
    step2Sub: "Order Rule",
    step2Title: "Order Matters!",
    step2Text: "The order in which quantities are stated is essential. Reversing the terms changes both the meaning and the value of the ratio:",
    step2RatioA: "Ratio of 2 to 5 ＝",
    step2RatioB: "Ratio of 5 to 2 ＝",
    step2InverseNote: "These two ratios are called reciprocals (or inverse ratios).",
    step2Tip: (
      <>
        ⚡ <strong>Reciprocal Ratios:</strong> The product of two reciprocal ratios is always equal to 1 (e.g. <Fraction num="2" den="5" /> · <Fraction num="5" den="2" /> ＝ 1).
      </>
    ),
    step3Badge: "STEP 3",
    step3Sub: "Simplification & Value",
    step3Title: "Simplifying to Lowest Terms",
    step3Text: "Because a ratio can be written as a fraction, it simplifies by dividing both terms by their Greatest Common Divisor (GCD):",
    step3ExampleTitle: "Example for 8 to 12:",
    step3GcdLabel: "GCD(8, 12) ＝ 4",
    step3SimpLabel: "(8 : 4) : (12 : 4) ＝",
    step3ValLabel: "Ratio value: 8 : 12 ≈ 0.67",
    step3Tip: "🎯 The simplified ratio expresses the simplest relationship between the two quantities.",
    step4Badge: "STEP 4",
    step4Sub: "Like Quantities",
    step4Title: "Comparing Quantities & Units",
    step4Text: "When comparing like quantities, they must always be converted into the same unit of measurement:",
    step4SameLabel: "Like:",
    step4SameText: "40 cm to 2 m ＝ 40 cm to 200 cm ＝ 40 : 200 ＝ 1 : 5 (pure number without units).",
    step4DiffLabel: "Unlike:",
    step4DiffText: "120 km in 2 h ＝ 120 : 2 ＝ 60 km/h (speed, a rate with units).",
    step4Tip: "🚀 The ratio of two like quantities has no unit of measurement — it is simply a pure number!",
    lab1Badge: "🔬 INTERACTIVE LAB 1",
    lab1Title: "Dynamic Ratio Calculator & Analyzer",
    lab1Subtitle: "Change the counts to inspect the initial ratio, its simplification via GCD, decimal value, and visual correspondence.",
    blueTermLabel: "1ST TERM (BLUE ITEMS)",
    orangeTermLabel: "2ND TERM (ORANGE ITEMS)",
    visualTotalLabel: (total) => `VISUAL REPRESENTATION (TOTAL: ${total} ITEMS)`,
    blueLegend: (count) => `Blue (${count})`,
    orangeLegend: (count) => `Orange (${count})`,
    blueInitial: "B",
    orangeInitial: "O",
    reductionPhrase: (b, o) => `💬 Reduction Rule: For every ${b} blue ${b === 1 ? 'item' : 'items'}, there are ${o} orange ${o === 1 ? 'item' : 'items'}.`,
    ratioCardHeader: "RATIO ANALYSIS & VALUE",
    gcdReducedNote: (b, o, g) => `The ratio was simplified by dividing both terms by GCD(${b}, ${o}) ＝ ${g}.`,
    gcdIrreducibleNote: "The ratio is already irreducible, as the numbers are coprime [GCD ＝ 1].",
    lab2Badge: "🥤 INTERACTIVE LAB 2",
    lab2Title: "Real-Life Application: Recipe Juice Ratio",
    lab2Subtitle: "When mixing juice, the ratio determines flavor and concentration regardless of the total batch size.",
    juiceLabel: "🍊 PURE JUICE (CUPS)",
    waterLabel: "💧 WATER (CUPS)",
    recipeTotalLabel: (total) => `RECIPE COMPOSITION (${total} TOTAL CUPS)`,
    juiceRatioCol: "Juice to Water Ratio",
    irreducibleCol: "Simplest Form",
    densityCol: "Ratio Value (Concentration)",
    ctaTitle: "Time to Practice Ratios!",
    ctaDesc: "Test your skills with interactive exercises on computing and simplifying ratios, comparing like vs. unlike quantities, and real-world proportion problems.",
    ctaBtn: "Start Exercises"
  }
};

export default function LogosTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  // Εργαστήριο 1: Σύγκριση δύο ποσοτήτων (Μπλε vs Πορτοκαλί)
  const [blueCount, setBlueCount] = useState(8);
  const [orangeCount, setOrangeCount] = useState(12);

  // Εργαστήριο 2: Πρακτική Εφαρμογή Αναλογίας Χυμού (Χυμός vs Νερό)
  const [juiceCups, setJuiceCups] = useState(3);
  const [waterCups, setWaterCups] = useState(6);

  // Υπολογισμοί Εργαστηρίου 1
  const gcd1 = useMemo(() => getGCD(blueCount, orangeCount), [blueCount, orangeCount]);
  const simpBlue = blueCount / gcd1;
  const simpOrange = orangeCount / gcd1;
  const decimalRatio1 = (blueCount / orangeCount).toFixed(2).replace('.', locale === 'el' ? ',' : '.');
  const totalItems = blueCount + orangeCount;

  // Υπολογισμοί Εργαστηρίου 2
  const gcd2 = useMemo(() => getGCD(juiceCups, waterCups), [juiceCups, waterCups]);
  const simpJuice = juiceCups / gcd2;
  const simpWater = waterCups / gcd2;
  const totalCups = juiceCups + waterCups;
  const juicePercent = Math.round((juiceCups / totalCups) * 100);
  const waterPercent = 100 - juicePercent;
  const decimalRatio2 = (juiceCups / waterCups).toFixed(2).replace('.', locale === 'el' ? ',' : '.');

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/40-logos-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>{t.navExercises}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-28 sm:pb-36 overflow-x-hidden">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{t.heroBadge}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              {t.heroDesc}
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t.heroFeature}</span>
            </div>
            <Link
              href="/st-dimotikou/40-logos-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>{t.heroCta}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΑΝΑΛΥΣΗΣ ΘΕΩΡΙΑΣ ΣΕ 4 ΒΗΜΑΤΑ */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              {t.theoryTitle}
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              {t.theorySubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-5 sm:gap-6 2xl:gap-8">
            
            {/* Βήμα 1ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step1Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step1Sub}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step1Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step1Text}
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm">
                  <p className="text-slate-700 font-semibold">{t.step1Notation}</p>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-mono font-bold text-slate-900 shadow-inner flex flex-wrap items-center justify-center gap-3 text-sm sm:text-base">
                    <span>{locale === 'en' ? 'a : b' : 'α : β'}</span>
                    <span className="text-slate-400 font-normal">{t.step1Or}</span>
                    <div className="inline-flex items-center">
                      <Fraction num={locale === 'en' ? 'a' : 'α'} den={locale === 'en' ? 'b' : 'β'} />
                    </div>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    {t.step1TermsNote}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                {t.step1Tip}
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step2Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step2Sub}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step2Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step2Text}
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm font-mono">
                  <div>{t.step2RatioA} <strong className="text-amber-800 font-black">2 : 5 ＝ {locale === 'el' ? '0,4' : '0.4'}</strong></div>
                  <div>{t.step2RatioB} <strong className="text-amber-800 font-black">5 : 2 ＝ {locale === 'el' ? '2,5' : '2.5'}</strong></div>
                  <div className="pt-2 border-t border-slate-200 text-slate-700 font-sans text-[11px]">
                    {t.step2InverseNote}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                {t.step2Tip}
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step3Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step3Sub}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step3Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step3Text}
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm">
                  <p className="text-slate-700 font-semibold">{t.step3ExampleTitle}</p>
                  <div className="font-mono text-slate-700 text-xs space-y-1">
                    <div>{t.step3GcdLabel}</div>
                    <div>{t.step3SimpLabel} <strong className="text-indigo-700 font-bold">2 : 3</strong></div>
                    <div className="pt-1 text-slate-900 font-bold">
                      {t.step3ValLabel}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                {t.step3Tip}
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step4Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step4Sub}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step4Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step4Text}
                </p>

                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    <strong>{t.step4SameLabel}</strong> {t.step4SameText}
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-950">
                    <strong>{t.step4DiffLabel}</strong> {t.step4DiffText}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {t.step4Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΟΠΤΙΚΟΠΟΙΗΣΗ ΛΟΓΟΥ & ΑΠΛΟΠΟΙΗΣΗ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 sm:pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>{t.lab1Badge}</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                {t.lab1Title}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                {t.lab1Subtitle}
              </p>
            </div>
          </div>

          {/* Πλέγμα Χειριστηρίων Steppers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 2xl:gap-6">
            
            {/* 1ος Όρος (Μπλε) */}
            <div className="bg-blue-50/70 p-3.5 sm:p-4 rounded-2xl border border-blue-200 space-y-2">
              <div className="h-8 flex items-center justify-between text-left">
                <span className="text-[11px] sm:text-xs font-black uppercase text-blue-900 tracking-wider">
                  {t.blueTermLabel}
                </span>
                <span className="min-w-[48px] sm:min-w-[56px] text-center font-mono font-black text-base sm:text-lg text-blue-600 bg-white px-2 py-0.5 rounded-lg border border-blue-200">
                  {blueCount}
                </span>
              </div>
              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  aria-label="Μείωση μπλε στοιχείων"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setBlueCount((prev) => Math.max(LIMITS.MIN_ITEMS, prev - 1));
                  }}
                  disabled={blueCount <= LIMITS.MIN_ITEMS}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                >
                  －
                </button>
                <input
                  type="range"
                  min={LIMITS.MIN_ITEMS}
                  max={LIMITS.MAX_ITEMS}
                  value={blueCount}
                  onChange={(e) => setBlueCount(Number(e.target.value))}
                  aria-label="Μπλε Στοιχεία"
                  className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                />
                <button
                  type="button"
                  aria-label="Αύξηση μπλε στοιχείων"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setBlueCount((prev) => Math.min(LIMITS.MAX_ITEMS, prev + 1));
                  }}
                  disabled={blueCount >= LIMITS.MAX_ITEMS}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* 2ος Όρος (Πορτοκαλί) */}
            <div className="bg-amber-50/70 p-3.5 sm:p-4 rounded-2xl border border-amber-200 space-y-2">
              <div className="h-8 flex items-center justify-between text-left">
                <span className="text-[11px] sm:text-xs font-black uppercase text-amber-900 tracking-wider">
                  {t.orangeTermLabel}
                </span>
                <span className="min-w-[48px] sm:min-w-[56px] text-center font-mono font-black text-base sm:text-lg text-amber-600 bg-white px-2 py-0.5 rounded-lg border border-amber-200">
                  {orangeCount}
                </span>
              </div>
              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  aria-label="Μείωση πορτοκαλί στοιχείων"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOrangeCount((prev) => Math.max(LIMITS.MIN_ITEMS, prev - 1));
                  }}
                  disabled={orangeCount <= LIMITS.MIN_ITEMS}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                >
                  －
                </button>
                <input
                  type="range"
                  min={LIMITS.MIN_ITEMS}
                  max={LIMITS.MAX_ITEMS}
                  value={orangeCount}
                  onChange={(e) => setOrangeCount(Number(e.target.value))}
                  aria-label="Πορτοκαλί Στοιχεία"
                  className="w-full min-w-0 max-w-full accent-amber-600 cursor-pointer"
                />
                <button
                  type="button"
                  aria-label="Αύξηση πορτοκαλί στοιχείων"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOrangeCount((prev) => Math.min(LIMITS.MAX_ITEMS, prev + 1));
                  }}
                  disabled={orangeCount >= LIMITS.MAX_ITEMS}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                >
                  ＋
                </button>
              </div>
            </div>

          </div>

          {/* Οπτική Παράθεση Στοιχείων */}
          <div className="bg-slate-50 p-4 sm:p-6 2xl:p-7 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-bold text-slate-500">
              <span>{t.visualTotalLabel(totalItems)}</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-blue-600"></span>
                  <span className="text-slate-700">{t.blueLegend(blueCount)}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-amber-500"></span>
                  <span className="text-slate-700">{t.orangeLegend(orangeCount)}</span>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {Array.from({ length: blueCount }).map((_, i) => (
                <span
                  key={`b-${i}`}
                  className="w-8 h-8 2xl:w-10 2xl:h-10 rounded-xl bg-blue-600 text-white font-black text-xs 2xl:text-sm flex items-center justify-center shadow-sm select-none"
                >
                  {t.blueInitial}
                </span>
              ))}
              {Array.from({ length: orangeCount }).map((_, i) => (
                <span
                  key={`o-${i}`}
                  className="w-8 h-8 2xl:w-10 2xl:h-10 rounded-xl bg-amber-500 text-white font-black text-xs 2xl:text-sm flex items-center justify-center shadow-sm select-none"
                >
                  {t.orangeInitial}
                </span>
              ))}
            </div>
            <p className="text-xs 2xl:text-sm text-slate-600 pt-1 leading-normal">
              {t.reductionPhrase(simpBlue, simpOrange)}
            </p>
          </div>

          {/* Τελική Κάρτα Αποτελέσματος Λόγου */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-950 text-white p-5 sm:p-7 2xl:p-8 rounded-3xl text-center shadow-lg max-w-3xl mx-auto space-y-3">
            <span className="text-xs 2xl:text-sm uppercase font-black text-sky-300 tracking-wider block">
              {t.ratioCardHeader}
            </span>
            <div className="text-lg sm:text-2xl 2xl:text-3xl font-black font-mono flex flex-wrap items-center justify-center gap-2 sm:gap-4">
              <span>{blueCount} : {orangeCount}</span>
              <span className="text-sky-300">＝</span>
              <span className="text-amber-300 bg-white/10 px-3 py-1 rounded-xl">
                {simpBlue} : {simpOrange}
              </span>
              <span className="text-sky-300">≈</span>
              <span className="text-emerald-300 font-mono">
                {decimalRatio1}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-sky-100 max-w-xl mx-auto pt-1 leading-relaxed">
              {gcd1 > 1 ? (
                t.gcdReducedNote(blueCount, orangeCount, gcd1)
              ) : (
                t.gcdIrreducibleNote
              )}
            </p>
          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΠΡΑΚΤΙΚΗ ΕΦΑΡΜΟΓΗ ΣΕ ΣΥΝΤΑΓΗ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 sm:pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs 2xl:text-sm font-bold text-amber-800 mb-1">
                <span>{t.lab2Badge}</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                {t.lab2Title}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                {t.lab2Subtitle}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 2xl:gap-6">
            
            {/* Ποτήρια Χυμού */}
            <div className="bg-amber-50/70 p-3.5 sm:p-4 rounded-2xl border border-amber-200 space-y-2">
              <div className="h-8 flex items-center justify-between text-left">
                <span className="text-[11px] sm:text-xs font-black uppercase text-amber-900 tracking-wider">
                  {t.juiceLabel}
                </span>
                <span className="min-w-[48px] sm:min-w-[56px] text-center font-mono font-black text-base sm:text-lg text-amber-600 bg-white px-2 py-0.5 rounded-lg border border-amber-200">
                  {juiceCups}
                </span>
              </div>
              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  aria-label="Μείωση ποτηριών χυμού"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setJuiceCups((prev) => Math.max(LIMITS.MIN_CUPS, prev - 1));
                  }}
                  disabled={juiceCups <= LIMITS.MIN_CUPS}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                >
                  －
                </button>
                <input
                  type="range"
                  min={LIMITS.MIN_CUPS}
                  max={LIMITS.MAX_CUPS}
                  value={juiceCups}
                  onChange={(e) => setJuiceCups(Number(e.target.value))}
                  aria-label="Ποτήρια Χυμού"
                  className="w-full min-w-0 max-w-full accent-amber-600 cursor-pointer"
                />
                <button
                  type="button"
                  aria-label="Αύξηση ποτηριών χυμού"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setJuiceCups((prev) => Math.min(LIMITS.MAX_CUPS, prev + 1));
                  }}
                  disabled={juiceCups >= LIMITS.MAX_CUPS}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Ποτήρια Νερού */}
            <div className="bg-sky-50/70 p-3.5 sm:p-4 rounded-2xl border border-sky-200 space-y-2">
              <div className="h-8 flex items-center justify-between text-left">
                <span className="text-[11px] sm:text-xs font-black uppercase text-sky-900 tracking-wider">
                  {t.waterLabel}
                </span>
                <span className="min-w-[48px] sm:min-w-[56px] text-center font-mono font-black text-base sm:text-lg text-sky-600 bg-white px-2 py-0.5 rounded-lg border border-sky-200">
                  {waterCups}
                </span>
              </div>
              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  type="button"
                  aria-label="Μείωση ποτηριών νερού"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setWaterCups((prev) => Math.max(LIMITS.MIN_CUPS, prev - 1));
                  }}
                  disabled={waterCups <= LIMITS.MIN_CUPS}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                >
                  －
                </button>
                <input
                  type="range"
                  min={LIMITS.MIN_CUPS}
                  max={LIMITS.MAX_CUPS}
                  value={waterCups}
                  onChange={(e) => setWaterCups(Number(e.target.value))}
                  aria-label="Ποτήρια Νερού"
                  className="w-full min-w-0 max-w-full accent-sky-600 cursor-pointer"
                />
                <button
                  type="button"
                  aria-label="Αύξηση ποτηριών νερού"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setWaterCups((prev) => Math.min(LIMITS.MAX_CUPS, prev + 1));
                  }}
                  disabled={waterCups >= LIMITS.MAX_CUPS}
                  className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                >
                  ＋
                </button>
              </div>
            </div>

          </div>

          {/* Μπάρα Αναλογίας & Σύνθεση */}
          <div className="bg-slate-50 p-4 sm:p-6 2xl:p-8 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-bold text-slate-700">
              <span>{t.recipeTotalLabel(totalCups)}</span>
              <div className="flex items-center gap-4">
                <span className="text-amber-700">{locale === 'en' ? 'Juice:' : 'Χυμός:'} {juicePercent} %</span>
                <span className="text-sky-700">{locale === 'en' ? 'Water:' : 'Νερό:'} {waterPercent} %</span>
              </div>
            </div>

            {/* Visual ProgressBar */}
            <div className="h-6 w-full bg-slate-200 rounded-2xl overflow-hidden flex shadow-inner">
              <div
                style={{ width: `${juicePercent}%` }}
                className="bg-amber-500 transition-all duration-300 flex items-center justify-center text-[11px] font-bold text-white overflow-hidden"
              >
                {juicePercent >= 15 && `${juicePercent} %`}
              </div>
              <div
                style={{ width: `${waterPercent}%` }}
                className="bg-sky-400 transition-all duration-300 flex items-center justify-center text-[11px] font-bold text-white overflow-hidden"
              >
                {waterPercent >= 15 && `${waterPercent} %`}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-center">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 block">{t.juiceRatioCol}</span>
                <span className="font-mono font-bold text-slate-800 text-base sm:text-lg">
                  {juiceCups} : {waterCups}
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 block">{t.irreducibleCol}</span>
                <span className="font-mono font-bold text-indigo-700 text-base sm:text-lg">
                  {simpJuice} : {simpWater}
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 block">{t.densityCol}</span>
                <span className="font-mono font-bold text-slate-800 text-base sm:text-lg">
                  {decimalRatio2}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
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
            href="/st-dimotikou/40-logos-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 {toCleanUppercase(t.ctaBtn)}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}