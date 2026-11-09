// pages/st-dimotikou/62-xrimata.js
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Βοηθητικό component εμφάνισης κλάσματος με οριζόντια κλασματική γραμμή (καθαρό JSX)
function Fraction({ num, den, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono ${className}`}>
      <span className="border-b-2 border-current px-1.5 pb-0.5 text-center leading-none">
        {num}
      </span>
      <span className="px-1.5 pt-0.5 text-center leading-none">
        {den}
      </span>
    </span>
  );
}

// Αφαίρεση τόνων για κεφαλαία (εξαιρείται αυστηρά το ΣΤ')
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

// Λεξικό διεθνοποίησης (i18n)
const TRANSLATIONS = {
  el: {
    metaTitle: "Το Ευρώ, Μετατροπές, Τόκος & Επιτόκιο - ΣΤ' Δημοτικού | LearnMaths.gr",
    metaDesc: "Θεωρία για τη νομισματική μονάδα (ευρώ, λεπτά), κανόνες μετατροπής, υπολογισμό ρέστων, καθώς και την έννοια του τόκου, του κεφαλαίου και του επιτοκίου.",
    gradeBadge: "ΚΕΦΑΛΑΙΟ 62 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Χρήματα: Το Ευρώ, Μετατροπές, Τόκος & Επιτόκιο",
    heroDesc: "Εξερευνούμε τη νομισματική μονάδα της χώρας μας: το ευρώ (€) και την υποδιαίρεσή του (λεπτό). Μαθαίνουμε να μετατρέπουμε ποσά, να υπολογίζουμε ρέστα σε καθημερινές συναλλαγές και ανακαλύπτουμε τις βασικές οικονομικές έννοιες της αποταμίευσης: το κεφάλαιο, το επιτόκιο (%) και τον τόκο.",
    heroSubbadge: "Μετατροπέας Ευρώ/Λεπτών & Διαδραστικός Υπολογιστής Τόκου",
    heroBtn: "Δοκίμασε τις Ασκήσεις",
    btnExercises: "Ασκήσεις",
    backLinkText: "ΣΤ' Δημοτικού",

    stepsHeading: "Νομίσματα & Οικονομικές Έννοιες σε 4 Βήματα",
    stepsSubheading: "Από τα καθημερινά κέρματα και χαρτονομίσματα μέχρι την αποταμίευση στην τράπεζα.",

    step1Badge: "ΒΗΜΑ 1",
    step1Tag: "Νομισματική Μονάδα",
    step1Title: "Το Ευρώ (€) & το Λεπτό (cent)",
    step1Desc: "Επίσημο νόμισμα της Ελλάδας και της Ευρωζώνης είναι το ευρώ (€). Η υποδιαίρεσή του είναι το λεπτό (ή cent):",
    step1Eq1: "1 ευρώ (€) ＝ 100 λεπτά",
    step1Prefix: "1 λεπτό ＝ ",
    step1Suffix: " του ευρώ ＝ 0,01 €",
    coinsLabel: "Κέρματα:",
    coinsList: "1λ, 2λ, 5λ, 10λ, 20λ, 50λ, 1€, 2€.",
    notesLabel: "Χαρτονομίσματα:",
    notesList: "5€, 10€, 20€, 50€, 100€, 200€, 500€.",
    step1Tip: "Το ευρώ ακολουθεί το δεκαδικό σύστημα, άρα οι μετατροπές γίνονται πάντα με πολλαπλασιασμό ή διαίρεση με το 100!",

    step2Badge: "ΒΗΜΑ 2",
    step2Tag: "Κανόνες Μετατροπής",
    step2Title: "Μετατροπές Ευρώ σε Λεπτά & Αντίστροφα",
    step2Desc: "Εφαρμόζουμε απλούς κανόνες για τη μετακίνηση της υποδιαστολής:",
    step2Rule1Title: "Από Ευρώ σε Λεπτά:",
    step2Rule1Text: "Πολλαπλασιάζουμε επί 100.",
    step2Rule1Ex: "3,50 € · 100 ＝ 350 λεπτά",
    step2Rule2Title: "Από Λεπτά σε Ευρώ:",
    step2Rule2Text: "Διαιρούμε με το 100.",
    step2Rule2Ex: "475 λεπτά : 100 ＝ 4,75 €",
    step2Tip: "Στα δεκαδικά ευρώ, τα δύο πρώτα ψηφία μετά την υποδιαστολή δείχνουν πάντοτε τα λεπτά (π.χ. 2,05 € ＝ 2 € και 5 λεπτά).",

    step3Badge: "ΒΗΜΑ 3",
    step3Tag: "Αποταμίευση",
    step3Title: "Κεφάλαιο, Τόκος & Επιτόκιο",
    step3Desc: "Όταν καταθέτουμε χρήματα σε έναν τραπεζικό λογαριασμό, η τράπεζα μας προσφέρει μια επιπλέον αμοιβή:",
    step3Pt1Title: "Κεφάλαιο (Κ):",
    step3Pt1Text: "Το αρχικό χρηματικό ποσό που καταθέτουμε.",
    step3Pt2Title: "Τόκος (Τ):",
    step3Pt2Text: "Το επιπλέον κέρδος που αποδίδει το κεφάλαιο για ορισμένο χρονικό διάστημα.",
    step3Pt3Title: "Επιτόκιο (Ε%):",
    step3Pt3Text: "Ο τόκος που κερδίζουν 100€ σε διάστημα 1 έτους (εκφράζεται σε ποσοστό στα 100).",
    step3Tip: "Αν το επιτόκιο είναι 3%, σημαίνει ότι για κάθε 100€ που καταθέτουμε, κερδίζουμε 3€ τόκο κάθε χρόνο.",

    step4Badge: "ΒΗΜΑ 4",
    step4Tag: "Μαθηματικός Τύπος",
    step4Title: "Ο Τύπος του Απλού Τόκου",
    step4Desc: "Για να υπολογίσουμε τον τόκο για ορισμένα έτη (χ), χρησιμοποιούμε τον βασικό μαθηματικό τύπο:",
    step4FormulaLong: "Τόκος ＝ (Κεφάλαιο · Επιτόκιο · Χρόνος) : 100",
    step4FormulaShort: "Τ ＝ (Κ · Ε · χ) : 100",
    step4TotalPrompt: "Τελικό Ποσό ＝ Κεφάλαιο ＋ Τόκος",
    step4TotalSub: "(όσα χρήματα θα έχουμε συνολικά στο τέλος).",
    step4Tip: "Ο τόκος αυξάνεται ανάλογα με το κεφάλαιο, το επιτόκιο και τα χρόνια της κατάθεσης.",

    lab1Badge: "ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1",
    lab1Title: "Δυναμικός Μετατροπέας Ευρώ (€) & Λεπτών (cents)",
    lab1Desc: "Ρύθμισε το χρηματικό ποσό σε ευρώ και δες πώς αναλύεται άμεσα σε ολόκληρα ευρώ, λεπτά και κέρματα.",
    amountLabel: "ΧΡΗΜΑΤΙΚΟ ΠΟΣΟ:",
    analysisTitle: "ΑΝΑΛΥΣΗ ΤΟΥ ΠΟΣΟΥ ΣΕ ΕΥΡΩ ΚΑΙ ΛΕΠΤΑ",
    wholeEurosLabel: "Ολόκληρα Ευρώ:",
    remCentsLabel: "Υπόλοιπο σε Λεπτά:",
    totalCentsLabel: "Συνολικά Λεπτά (cents):",
    fractionFormLabel: "Κλασματική Μορφή:",
    centsWord: "λεπτά",
    mathRelationTitle: "Μαθηματική Σχέση:",
    orWord: "ή",
    andWord: "και",

    lab2Badge: "ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΤΡΑΠΕΖΙΚΟΣ ΥΠΟΛΟΓΙΣΜΟΣ",
    lab2Title: "Υπολογιστής Τόκου & Τελικού Κεφαλαίου",
    lab2Desc: "Ρύθμισε το Κεφάλαιο (Κ), το Ετήσιο Επιτόκιο (Ε%) και τον Χρόνο (χ σε έτη) για να δεις πώς υπολογίζεται ο τόκος:",
    capitalLabel: "Αρχικό Κεφάλαιο (Κ):",
    rateLabel: "Ετήσιο Επιτόκιο (Ε%):",
    yearsLabel: "Χρόνος Κατάθεσης (χ):",
    yearUnitSingular: "έτος",
    yearUnitPlural: "έτη",
    formulaHeader: "ΥΠΟΛΟΓΙΣΜΟΣ ΜΕ ΤΟΝ ΤΥΠΟ: Τ ＝ (Κ · Ε · χ) : 100",
    interestResult: "Τόκος ＝",
    finalCapitalLabel: "Τελικό Ποσό Κατάθεσης (Κ ＋ Τ):",
    lab2Summary1: "Σε",
    lab2Summary2: "με επιτόκιο",
    lab2Summary3: "τα",
    lab2Summary4: "σας θα αποδώσουν τόκο",
    lab2Summary5: "και θα έχετε συνολικά",

    problemsHeading: "Λυμένα Προβλήματα Καθημερινής Ζωής",
    problemsSubheading: "Αναλυτικά βήματα επίλυσης σε προβλήματα αγορών, ρέστων και τραπεζικού τόκου.",

    prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΑΓΟΡΕΣ & ΡΕΣΤΑ",
    prob1Tag: "Σούπερ Μάρκετ",
    prob1Title: "Υπολογισμός Κόστους και Ρέστων σε Ευρώ & Λεπτά",
    prob1Desc: "Η Ελένη αγόρασε 3 τετράδια προς 1,80 € το καθένα και 2 μαρκαδόρους προς 85 λεπτά (0,85 €) τον καθένα. Πλήρωσε με χαρτονόμισμα των 10 €. Πόσα ρέστα θα πάρει;",
    prob1TableTitle: "ΑΝΑΛΥΣΗ ΑΓΟΡΩΝ",
    notebooksLabel: "Τετράδια",
    markersLabel: "Μαρκαδόροι",
    paymentLabel: "Πληρωμή",
    stepsTitle: "Βήματα Επίλυσης:",
    costNotebooks: "Κόστος τετραδίων:",
    costMarkers: "Κόστος μαρκαδόρων:",
    totalExpense: "Συνολική δαπάνη:",
    changeLabel: "Ρέστα:",
    prob1Secret: "Μετατρέπουμε όλα τα ποσά στην ίδια μονάδα (σε δεκαδικά ευρώ) πριν κάνουμε τις προσθαφαιρέσεις.",

    prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΤΡΑΠΕΖΙΚΟΣ ΤΟΚΟΣ",
    prob2Tag: "Αποταμίευση",
    prob2Title: "Υπολογισμός Ετήσιου Τόκου & Τελικού Ποσού",
    prob2Desc: "Ο κύριος Ανδρέας κατέθεσε στην τράπεζα κεφάλαιο 2.400 € με ετήσιο επιτόκιο 2,5% για 3 έτη. Πόσο τόκο θα εισπράξει στο τέλος της τριετίας και ποιο θα είναι το συνολικό ποσό που θα έχει στον λογαριασμό του;",
    prob2TableTitle: "ΔΕΔΟΜΕΝΑ ΚΑΤΑΘΕΣΗΣ",
    depositCapital: "Κεφάλαιο (Κ)",
    depositRate: "Επιτόκιο (Ε)",
    depositYears: "Χρόνος (χ)",
    applyFormula: "Εφαρμογή τύπου:",
    calcLabel: "Υπολογισμός:",
    interestWord: "τόκος",
    finalAmountLabel: "Τελικό ποσό:",
    prob2Secret: "Κάθε χρόνο ο τόκος ήταν 60 € (2.400 · 2,5 : 100 ＝ 60 €). Στα 3 χρόνια: 3 · 60 € ＝ 180 €.",

    ctaHeading: "Ώρα για Εξάσκηση στα Χρήματα & τον Τόκο!",
    ctaDesc: "Δοκίμασε τις δυνάμεις σου σε 10 διαδραστικές ασκήσεις με μετατροπές ευρώ και λεπτών, υπολογισμούς ρέστων, κεφαλαίου, επιτοκίου και τόκου για τη ΣΤ' Δημοτικού.",
    ctaBtn: "Έναρξη Ασκήσεων"
  },
  en: {
    metaTitle: "The Euro, Conversions, Interest & Interest Rate - 6th Grade | LearnMaths.gr",
    metaDesc: "Theory on currency units (euro, cents), conversion rules, calculating change, and the concepts of capital, interest rate, and simple interest.",
    gradeBadge: "CHAPTER 62 • 6TH GRADE",
    heroTitle: "Money: The Euro, Conversions, Interest & Interest Rate",
    heroDesc: "Explore our currency: the euro (€) and its sub-unit (cent). Learn how to convert monetary amounts, compute change in everyday transactions, and master foundational financial literacy concepts: capital, annual interest rate (%), and simple interest.",
    heroSubbadge: "Euro/Cent Converter & Interactive Simple Interest Calculator",
    heroBtn: "Try the Exercises",
    btnExercises: "Exercises",
    backLinkText: "6th Grade",

    stepsHeading: "Currency & Financial Concepts in 4 Steps",
    stepsSubheading: "From coins and banknotes to bank savings and simple interest.",

    step1Badge: "STEP 1",
    step1Tag: "Currency Unit",
    step1Title: "The Euro (€) & the Cent (c)",
    step1Desc: "The official currency of Greece and the Eurozone is the euro (€). Its sub-unit is the cent:",
    step1Eq1: "1 euro (€) ＝ 100 cents",
    step1Prefix: "1 cent ＝ ",
    step1Suffix: " of a euro ＝ 0.01 €",
    coinsLabel: "Coins:",
    coinsList: "1c, 2c, 5c, 10c, 20c, 50c, 1€, 2€.",
    notesLabel: "Banknotes:",
    notesList: "5€, 10€, 20€, 50€, 100€, 200€, 500€.",
    step1Tip: "The euro operates on a base-10 decimal system, so conversions are always performed by multiplying or dividing by 100!",

    step2Badge: "STEP 2",
    step2Tag: "Conversion Rules",
    step2Title: "Converting Euros to Cents & Vice Versa",
    step2Desc: "We apply straightforward decimal shifting rules:",
    step2Rule1Title: "From Euros to Cents:",
    step2Rule1Text: "Multiply by 100.",
    step2Rule1Ex: "3.50 € · 100 ＝ 350 cents",
    step2Rule2Title: "From Cents to Euros:",
    step2Rule2Text: "Divide by 100.",
    step2Rule2Ex: "475 cents : 100 ＝ 4.75 €",
    step2Tip: "In decimal euro amounts, the two digits right after the decimal separator always represent cents (e.g., 2.05 € ＝ 2 € and 5 cents).",

    step3Badge: "STEP 3",
    step3Tag: "Savings",
    step3Title: "Principal, Interest & Interest Rate",
    step3Desc: "When depositing money into a savings account, the bank pays an additional return:",
    step3Pt1Title: "Principal / Capital (C):",
    step3Pt1Text: "The initial sum of money deposited.",
    step3Pt2Title: "Interest (I):",
    step3Pt2Text: "The additional monetary gain produced by the principal over a given time period.",
    step3Pt3Title: "Interest Rate (R%):",
    step3Pt3Text: "The interest earned on 100 € over 1 year (expressed as a percentage).",
    step3Tip: "If the annual interest rate is 3%, it means that for every 100 € deposited, 3 € in interest is earned per year.",

    step4Badge: "STEP 4",
    step4Tag: "Mathematical Formula",
    step4Title: "The Simple Interest Formula",
    step4Desc: "To calculate interest over a number of years (t), we apply the core mathematical formula:",
    step4FormulaLong: "Interest ＝ (Principal · Rate · Time) : 100",
    step4FormulaShort: "I ＝ (C · R · t) : 100",
    step4TotalPrompt: "Total Amount ＝ Principal ＋ Interest",
    step4TotalSub: "(the total sum of money available at maturity).",
    step4Tip: "Interest grows proportionally with the deposited principal, the interest rate, and the duration.",

    lab1Badge: "INTERACTIVE LAB 1",
    lab1Title: "Dynamic Euro (€) & Cents Converter",
    lab1Desc: "Adjust the monetary sum in euros to see an immediate breakdown into whole euros, cents, and fraction representation.",
    amountLabel: "MONETARY AMOUNT:",
    analysisTitle: "BREAKDOWN OF AMOUNT IN EUROS AND CENTS",
    wholeEurosLabel: "Whole Euros:",
    remCentsLabel: "Remaining Cents:",
    totalCentsLabel: "Total Cents:",
    fractionFormLabel: "Fractional Form:",
    centsWord: "cents",
    mathRelationTitle: "Mathematical Relationship:",
    orWord: "or",
    andWord: "and",

    lab2Badge: "INTERACTIVE LAB 2: BANK CALCULATION",
    lab2Title: "Simple Interest & Final Capital Calculator",
    lab2Desc: "Set the Principal (C), Annual Rate (R%), and Time (t in years) to see how simple interest is computed step-by-step:",
    capitalLabel: "Initial Principal (C):",
    rateLabel: "Annual Rate (R%):",
    yearsLabel: "Deposit Duration (t):",
    yearUnitSingular: "year",
    yearUnitPlural: "years",
    formulaHeader: "CALCULATION WITH FORMULA: I ＝ (C · R · t) : 100",
    interestResult: "Interest ＝",
    finalCapitalLabel: "Total Balance at Maturity (C ＋ I):",
    lab2Summary1: "Over",
    lab2Summary2: "at an annual rate of",
    lab2Summary3: "your",
    lab2Summary4: "will earn an interest of",
    lab2Summary5: "yielding a total balance of",

    problemsHeading: "Worked Real-Life Financial Problems",
    problemsSubheading: "Step-by-step solutions for everyday shopping, change calculations, and bank interest.",

    prob1Badge: "PROBLEM 1: SHOPPING & CHANGE",
    prob1Tag: "Supermarket",
    prob1Title: "Computing Purchase Cost and Change in Euros & Cents",
    prob1Desc: "Helen bought 3 notebooks for 1.80 € each and 2 highlighters for 85 cents (0.85 €) each. She paid with a 10 € banknote. How much change will she receive?",
    prob1TableTitle: "PURCHASE ANALYSIS",
    notebooksLabel: "Notebooks",
    markersLabel: "Highlighters",
    paymentLabel: "Payment",
    stepsTitle: "Solution Steps:",
    costNotebooks: "Cost of notebooks:",
    costMarkers: "Cost of highlighters:",
    totalExpense: "Total expenditure:",
    changeLabel: "Change:",
    prob1Secret: "Convert all amounts into the same currency unit (decimal euros) before performing addition and subtraction.",

    prob2Badge: "PROBLEM 2: BANK INTEREST",
    prob2Tag: "Savings Account",
    prob2Title: "Calculating Annual Interest & Total Balance",
    prob2Desc: "Mr. Andreas deposited a principal of 2,400 € at an annual rate of 2.5% for 3 years. How much interest will he earn at the end of the 3 years, and what will be the total balance in his account?",
    prob2TableTitle: "DEPOSIT PARAMETERS",
    depositCapital: "Principal (C)",
    depositRate: "Rate (R)",
    depositYears: "Time (t)",
    applyFormula: "Applying formula:",
    calcLabel: "Calculation:",
    interestWord: "interest",
    finalAmountLabel: "Total balance:",
    prob2Secret: "Each year the interest was 60 € (2,400 · 2.5 : 100 ＝ 60 €). Over 3 years: 3 · 60 € ＝ 180 €.",

    ctaHeading: "Ready to Practice Money & Interest?",
    ctaDesc: "Test your skills across 10 interactive questions covering euro-to-cent conversions, change calculations, principal, interest rate, and simple interest for 6th Grade.",
    ctaBtn: "Start Exercises"
  }
};

export default function XrimataTheoryPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  // Εργαστήριο 1: Μετατροπέας Ευρώ & Λεπτών
  const [euroAmount, setEuroAmount] = useState(4.75);

  const moneyConversions = useMemo(() => {
    const totalCents = Math.round(euroAmount * 100);
    const wholeEuros = Math.floor(euroAmount);
    const remCents = totalCents % 100;
    return {
      totalCents,
      wholeEuros,
      remCents
    };
  }, [euroAmount]);

  // Εργαστήριο 2: Υπολογιστής Τόκου (Κεφάλαιο, Επιτόκιο, Χρόνος σε έτη)
  const [capital, setCapital] = useState(1000);
  const [rate, setRate] = useState(3);
  const [years, setYears] = useState(2);

  const interestData = useMemo(() => {
    // Τ = (Κ · Ε · χ) : 100
    const interest = Number(((capital * rate * years) / 100).toFixed(2));
    const totalAmount = Number((capital + interest).toFixed(2));
    return {
      interest,
      totalAmount
    };
  }, [capital, rate, years]);

  // Αριθμητική μορφοποίηση ανάλογα με τη γλώσσα (el-GR / en-US)
  const formatNumberLocale = (val, decimals = 2) => {
    if (val === null || val === undefined || isNaN(Number(val))) return '0';
    const numLocale = locale === 'en' ? 'en-US' : 'el-GR';
    return Number(val).toLocaleString(numLocale, {
      minimumFractionDigits: Number.isInteger(val) ? 0 : decimals,
      maximumFractionDigits: decimals
    });
  };

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDesc}
      backUrl="/st-dimotikou"
      backText={t.backLinkText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/62-xrimata-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 {t.btnExercises}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-28 sm:pb-36 overflow-x-hidden">

        {/* 1. HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{t.gradeBadge}</span>
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
              <span>{t.heroSubbadge}</span>
            </div>
            <Link
              href="/st-dimotikou/62-xrimata-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>{t.heroBtn}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΑΝΑΛΥΣΗΣ ΘΕΩΡΙΑΣ ΣΕ 4 ΒΗΜΑΤΑ */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              {t.stepsHeading}
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              {t.stepsSubheading}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-5 sm:gap-6 2xl:gap-8">

            {/* ΒΗΜΑ 1 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step1Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step1Tag}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step1Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step1Desc}
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div className="text-blue-900 font-bold">{t.step1Eq1}</div>
                  <div className="flex items-center flex-wrap">
                    <span>{t.step1Prefix}</span>
                    <Fraction num={1} den={100} />
                    <span>{t.step1Suffix}</span>
                  </div>
                  <div className="text-slate-600 font-sans text-[11px] pt-1 leading-normal">
                    <strong>{t.coinsLabel}</strong> {t.coinsList}<br />
                    <strong>{t.notesLabel}</strong> {t.notesList}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 {t.step1Tip}
              </div>
            </article>

            {/* ΒΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step2Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step2Tag}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step2Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step2Desc}
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div>
                    • <strong>{t.step2Rule1Title}</strong> {t.step2Rule1Text}<br />
                    <span className="text-amber-800 font-bold">{t.step2Rule1Ex}</span>
                  </div>
                  <div>
                    • <strong>{t.step2Rule2Title}</strong> {t.step2Rule2Text}<br />
                    <span className="text-blue-800 font-bold">{t.step2Rule2Ex}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ {t.step2Tip}
              </div>
            </article>

            {/* ΒΗΜΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step3Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step3Tag}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step3Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step3Desc}
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 text-slate-700">
                  <div><strong>{t.step3Pt1Title}</strong> {t.step3Pt1Text}</div>
                  <div><strong>{t.step3Pt2Title}</strong> {t.step3Pt2Text}</div>
                  <div><strong>{t.step3Pt3Title}</strong> {t.step3Pt3Text}</div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 {t.step3Tip}
              </div>
            </article>

            {/* ΒΗΜΑ 4 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step4Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step4Tag}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step4Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step4Desc}
                </p>

                <div className="bg-emerald-50/70 p-3.5 sm:p-4 rounded-2xl border border-emerald-200 text-xs sm:text-sm space-y-2 text-emerald-950 font-mono text-center">
                  <div className="font-bold text-sm sm:text-base">
                    {t.step4FormulaLong}
                  </div>
                  <div className="text-xs text-emerald-800">
                    <strong>{t.step4FormulaShort}</strong>
                  </div>
                  <p className="font-sans text-[11px] text-slate-600 leading-normal text-left pt-1">
                    <strong>{t.step4TotalPrompt}</strong> {t.step4TotalSub}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 {t.step4Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΜΕΤΑΤΡΟΠΕΑΣ ΕΥΡΩ & ΛΕΠΤΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 {t.lab1Badge}</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              {t.lab1Title}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.lab1Desc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">

            {/* Χειριστήριο Ρύθμισης Ποσού (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-blue-900 tracking-wider">
                    {t.amountLabel}
                  </span>
                  <span className="font-mono font-black text-base sm:text-xl text-blue-700 bg-white px-3 py-1 rounded-xl border border-blue-200 shadow-sm">
                    {formatNumberLocale(euroAmount, 2)} €
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση ποσού"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEuroAmount((prev) => Math.max(0.1, Number((prev - 0.25).toFixed(2)))); }}
                    disabled={euroAmount <= 0.25}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={0.25}
                    max={20}
                    step={0.25}
                    value={euroAmount}
                    onChange={(e) => setEuroAmount(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer touch-manipulation"
                  />
                  <button
                    type="button"
                    aria-label="Αύξηση ποσού"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEuroAmount((prev) => Math.min(20, Number((prev + 0.25).toFixed(2)))); }}
                    disabled={euroAmount >= 20}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Γρήγορες Επιλογές */}
              <div className="grid grid-cols-4 gap-2">
                {[1, 2.5, 5, 12.5].map((quickVal) => (
                  <button
                    key={`btn-euro-${quickVal}`}
                    type="button"
                    onClick={() => setEuroAmount(quickVal)}
                    className="bg-white border border-slate-200 hover:bg-slate-100 py-2 rounded-xl font-bold text-xs sm:text-sm text-slate-700 shadow-sm transition active:scale-95 text-center touch-manipulation"
                  >
                    {formatNumberLocale(quickVal, 2)} €
                  </button>
                ))}
              </div>
            </div>

            {/* Πίνακας Ανάλυσης (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-3">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block text-center">
                {t.analysisTitle}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-mono">
                <div className="p-3.5 bg-white rounded-2xl border border-blue-200 flex items-center justify-between">
                  <span className="text-slate-600 font-sans">{t.wholeEurosLabel}</span>
                  <span className="font-black text-blue-700">{formatNumberLocale(moneyConversions.wholeEuros, 0)} €</span>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-amber-200 flex items-center justify-between">
                  <span className="text-slate-600 font-sans">{t.remCentsLabel}</span>
                  <span className="font-black text-amber-700">{formatNumberLocale(moneyConversions.remCents, 0)} {t.centsWord}</span>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-emerald-200 flex items-center justify-between">
                  <span className="text-slate-600 font-sans">{t.totalCentsLabel}</span>
                  <span className="font-black text-emerald-700">{formatNumberLocale(moneyConversions.totalCents, 0)} {t.centsWord}</span>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-purple-200 flex items-center justify-between">
                  <span className="text-slate-600 font-sans">{t.fractionFormLabel}</span>
                  <span className="font-black text-purple-700 inline-flex items-center">
                    <Fraction num={moneyConversions.totalCents} den={100} /> €
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-slate-200 font-sans text-xs sm:text-sm text-slate-600 space-y-1 text-center">
                💡 <strong>{t.mathRelationTitle}</strong> {formatNumberLocale(euroAmount, 2)} € ＝ {formatNumberLocale(euroAmount, 2)} · 100 ＝ <strong>{formatNumberLocale(moneyConversions.totalCents, 0)} {t.centsWord}</strong> ({t.orWord} {formatNumberLocale(moneyConversions.wholeEuros, 0)} € {t.andWord} {formatNumberLocale(moneyConversions.remCents, 0)} {t.centsWord}).
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ ΤΟΚΟΥ & ΕΠΙΤΟΚΙΟΥ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
              <span>🏦 {t.lab2Badge}</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              {t.lab2Title}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.lab2Desc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

            {/* Χειριστήρια Παραμέτρων Τόκου (6 στήλες) */}
            <div className="lg:col-span-6 space-y-3.5">
              
              {/* Κεφάλαιο */}
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold">
                  <span className="text-slate-700">{t.capitalLabel}</span>
                  <span className="font-mono text-base font-black text-blue-700">{formatNumberLocale(capital, 0)} €</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={5000}
                  step={100}
                  value={capital}
                  onChange={(e) => setCapital(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer touch-manipulation"
                />
              </div>

              {/* Επιτόκιο */}
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold">
                  <span className="text-slate-700">{t.rateLabel}</span>
                  <span className="font-mono text-base font-black text-emerald-700">{formatNumberLocale(rate, 1)}%</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={8}
                  step={0.5}
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer touch-manipulation"
                />
              </div>

              {/* Χρόνος */}
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold">
                  <span className="text-slate-700">{t.yearsLabel}</span>
                  <span className="font-mono text-base font-black text-indigo-700">
                    {years} {years === 1 ? t.yearUnitSingular : t.yearUnitPlural}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
              </div>

            </div>

            {/* Αποτέλεσμα & Ανάλυση Τύπου (6 στήλες) */}
            <div className="lg:col-span-6 bg-emerald-50/50 p-5 sm:p-7 rounded-3xl border border-emerald-200 space-y-4">
              <span className="text-xs font-black uppercase text-emerald-900 tracking-wider block text-center">
                {t.formulaHeader}
              </span>

              <div className="bg-white p-4 rounded-2xl border border-emerald-200 text-center font-mono space-y-2">
                <div className="text-xs text-slate-500">
                  Τ ＝ ({formatNumberLocale(capital, 0)} · {formatNumberLocale(rate, 1)} · {years}) : 100 ＝ {formatNumberLocale(capital * rate * years, 0)} : 100
                </div>
                <div className="text-xl sm:text-3xl font-black text-emerald-700">
                  {t.interestResult} {formatNumberLocale(interestData.interest, 2)} €
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex justify-between items-center font-mono">
                <div>
                  <span className="text-[11px] text-slate-500 block font-sans">{t.finalCapitalLabel}</span>
                  <span className="text-base sm:text-xl font-black text-slate-900">
                    {formatNumberLocale(capital, 0)} ＋ {formatNumberLocale(interestData.interest, 2)} ＝ <strong className="text-blue-700">{formatNumberLocale(interestData.totalAmount, 2)} €</strong>
                  </span>
                </div>
              </div>

              <p className="text-xs text-emerald-950 font-sans text-center leading-relaxed">
                💡 {t.lab2Summary1} {years} {years === 1 ? t.yearUnitSingular : t.yearUnitPlural} {t.lab2Summary2} {formatNumberLocale(rate, 1)}%, {t.lab2Summary3} {formatNumberLocale(capital, 0)} € {t.lab2Summary4} <strong>{formatNumberLocale(interestData.interest, 2)} €</strong> {t.lab2Summary5} <strong>{formatNumberLocale(interestData.totalAmount, 2)} €</strong>.
              </p>
            </div>

          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ ΚΑΘΗΜΕΡΙΝΗΣ ΖΩΗΣ */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              {t.problemsHeading}
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.problemsSubheading}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ΠΡΟΒΛΗΜΑ 1 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-black rounded-lg uppercase">
                  {t.prob1Badge}
                </span>
                <span className="text-xs font-bold text-slate-400">{t.prob1Tag}</span>
              </div>
              <h3 className="text-lg font-black text-slate-900">
                {t.prob1Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.prob1Desc}
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  {t.prob1TableTitle}
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.notebooksLabel}</span> 3 · 1,80 € ＝ 5,40 €
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.markersLabel}</span> 2 · 0,85 € ＝ 1,70 €
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.paymentLabel}</span> 10,00 €
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">{t.stepsTitle}</span>
                  <div><strong>{t.costNotebooks}</strong> 3 · 1,80 € ＝ <strong>5,40 €</strong>.</div>
                  <div><strong>{t.costMarkers}</strong> 2 · 0,85 € ＝ <strong>1,70 €</strong>.</div>
                  <div><strong>{t.totalExpense}</strong> 5,40 € ＋ 1,70 € ＝ <strong>7,10 €</strong>.</div>
                  <div><strong>{t.changeLabel}</strong> 10,00 € － 7,10 € ＝ <strong className="text-blue-700">2,90 €</strong> (2 € {t.andWord} 90 {t.centsWord}).</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
                💡 {t.prob1Secret}
              </div>
            </article>

            {/* ΠΡΟΒΛΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-lg uppercase">
                  {t.prob2Badge}
                </span>
                <span className="text-xs font-bold text-slate-400">{t.prob2Tag}</span>
              </div>
              <h3 className="text-lg font-black text-slate-900">
                {t.prob2Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.prob2Desc}
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  {t.prob2TableTitle}
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.depositCapital}</span> 2.400 €
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.depositRate}</span> 2,5%
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.depositYears}</span> 3 {t.yearUnitPlural}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">{t.stepsTitle}</span>
                  <div><strong>{t.applyFormula}</strong> Τ ＝ (Κ · Ε · χ) : 100.</div>
                  <div><strong>{t.calcLabel}</strong> (2.400 · 2,5 · 3) : 100 ＝ 18.000 : 100 ＝ <strong className="text-amber-700">180 € {t.interestWord}</strong>.</div>
                  <div><strong>{t.finalAmountLabel}</strong> {t.depositCapital} ＋ {t.interestWord} ＝ 2.400 € ＋ 180 € ＝ <strong className="text-emerald-700">2.580 €</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
                ⚡ {t.prob2Secret}
              </div>
            </article>

          </div>
        </section>

        {/* 6. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              {t.ctaHeading}
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              {t.ctaDesc}
            </p>
          </div>

          <Link
            href="/st-dimotikou/62-xrimata-ask"
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