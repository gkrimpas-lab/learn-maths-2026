// pages/st-dimotikou/60-baros.js
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

// Βοηθητικο component εμφανισης κλασματος με οριζοντια γραμμη (καθαρο JSX, οχι LaTeX)
function Fraction({ num, den, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono leading-none ${className}`}>
      <span className="border-b border-current px-1.5 pb-0.5 text-center text-[0.9em] font-bold">
        {num}
      </span>
      <span className="px-1.5 pt-0.5 text-center text-[0.9em] font-bold">
        {den}
      </span>
    </span>
  );
}

// Μορφοποιηση αριθμου αναλογα με το locale
function formatNum(val, locale = 'el', decimals = 3) {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  const loc = locale === 'en' ? 'en-US' : 'el-GR';
  const num = Number(val);
  if (Number.isInteger(num)) {
    return num.toLocaleString(loc);
  }
  return num.toLocaleString(loc, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export default function BarosTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';

  const t = useMemo(() => {
    return {
      el: {
        pageTitle: "Μονάδες Μέτρησης Βάρους & Μετατροπές - ΣΤ' Δημοτικού | LearnMaths.gr",
        metaDescription: "Μαθαίνουμε για τη βασική μονάδα βάρους (χιλιόγραμμο/κιλό), τον τόνο, το γραμμάριο, το χιλιοστόγραμμο, τους κανόνες μετατροπής και τη σχέση καθαρού, μικτού βάρους και αποβάρου.",
        backText: "ΣΤ' Δημοτικού",
        actionBtn: "🎯 Ασκήσεις",
        chapterBadge: "ΚΕΦΑΛΑΙΟ 60 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
        headerTitle: "Μονάδες Μέτρησης Βάρους (Μάζας)",
        headerDesc: "Ανακαλύπτουμε πώς ζυγίζουμε τα σώματα: Γνωρίζουμε τη βασική μονάδα μέτρησης (χιλιόγραμμο ή κιλό), το πολλαπλάσιο (τόνος) και τις υποδιαιρέσεις (γραμμάριο, χιλιοστόγραμμο), μαθαίνουμε τους ασφαλείς κανόνες μετατροπών και εξασκούμαστε στο καθαρό, το μικτό βάρος και το απόβαρο.",
        headerSub: "Θεωρία, Κλίμακα Μετατροπών & Διαδραστική Ζυγαριά Ισορροπίας",
        tryExercises: "Δοκίμασε τις Ασκήσεις",
        roadmapTitle: "Οι Μονάδες Βάρους σε 4 Βήματα",
        roadmapDesc: "Από τη βασική μονάδα της καθημερινότητας μέχρι τα μεγάλα φορτία και τα ευαίσθητα φάρμακα.",
        step1Badge: "ΒΗΜΑ 1",
        step1Tag: "Βασική Μονάδα",
        step1Title: "Το Χιλιόγραμμο (kg)",
        step1Text: "Βασική μονάδα μέτρησης του βάρους (μάζας) στην καθημερινή μας ζωή είναι το χιλιόγραμμο, που συνήθως το λέμε απλά κιλό (kg).",
        step1Bullet1: "1 kg: Ζυγίζει περίπου όσο 1 λίτρο καθαρού νερού.",
        step1Bullet2: "Χρήση: Μετράμε το βάρος των ανθρώπων, των φρούτων, των τροφίμων.",
        step1Tip: "💡 Το κιλό είναι η σταθερή βάση αναφοράς για όλες τις υπόλοιπες μονάδες βάρους.",
        step2Badge: "ΒΗΜΑ 2",
        step2Tag: "Υποδιαιρέσεις",
        step2Title: "Γραμμάριο (g) & Χιλιοστόγραμμο (mg)",
        step2Text: "Για αντικείμενα μικρού βάρους χρησιμοποιούμε τις υποδιαιρέσεις του κιλού:",
        step2Sub1: "1 kg ＝ 1.000 g (γραμμάρια)",
        step2Sub2: "1 g ＝ 1.000 mg (χιλιοστόγραμμα)",
        step2Usage: "Το γραμμάριο χρησιμοποιείται στη ζαχαροπλαστική και τα μπαχαρικά, ενώ το χιλιοστόγραμμο στα φάρμακα και τα κοσμήματα.",
        step2Tip: "⚡ 1 γραμμάριο είναι 1.000 φορές μικρότερο από το κιλό (1 g ＝ 0,001 kg).",
        step3Badge: "ΒΗΜΑ 3",
        step3Tag: "Πολλαπλάσιο",
        step3Title: "Ο Τόνος (t)",
        step3Text: "Για τη μέτρηση πολύ μεγάλων φορτίων (οχήματα, πλοία, παραγωγή σιτηρών) χρησιμοποιούμε τον τόνο (t):",
        step3TonEq: "1 t ＝ 1.000 kg ＝ 1.000.000 g",
        step3InversePrefix: "Αντίστροφα: 1 kg ＝ 0,001 t (ή",
        step3InverseSuffix: "του τόνου).",
        step3Tip: "🎯 Ένα μικρό επιβατικό αυτοκίνητο ζυγίζει περίπου 1 έως 1,5 τόνο (1.000 - 1.500 kg).",
        step4Badge: "ΒΗΜΑ 4",
        step4Tag: "Εμπορική Ορολογία",
        step4Title: "Μικτό, Καθαρό & Απόβαρο",
        step4Text: "Στο εμπόριο το περιεχόμενο βρίσκεται πάντα μέσα σε συσκευασία:",
        step4Gross: "Μικτό Βάρος: Βάρος εμπορεύματος ＋ Βάρος συσκευασίας",
        step4Tare: "Απόβαρο (τάρα): Το βάρος μόνο της συσκευασίας (κουτί, τελάρο)",
        step4Net: "Καθαρό Βάρος ＝ Μικτό Βάρος － Απόβαρο",
        step4Tip: "🚀 Πληρώνουμε πάντοτε μόνο το καθαρό βάρος του προϊόντος!",
        lab1Badge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1",
        lab1Title: "Δυναμικός Μετατροπέας Βάρους (t, kg, g, mg)",
        lab1Desc: "Ρυθμίστε το βάρος σε κιλά (kg) και παρακολουθήστε πώς μετατρέπεται ταυτόχρονα σε τόνους, γραμμάρια και χιλιοστόγραμμα.",
        lab1InputLabel: "ΑΡΧΙΚΟ ΒΑΡΟΣ ΣΕ ΚΙΛΑ (kg):",
        lab1AllUnitsTitle: "ΤΑΥΤΟΧΡΟΝΗ ΑΠΕΙΚΟΝΙΣΗ ΣΕ ΟΛΕΣ ΤΙΣ ΜΟΝΑΔΕΣ ΒΑΡΟΥΣ",
        unitTon: "Τόνοι (t):",
        unitKgBase: "Κιλά (kg) [Βάση]:",
        unitG: "Γραμμάρια (g):",
        unitMg: "Χιλιοστόγραμμα (mg):",
        ruleText: (kg, g) => `💡 Κανόνας: Για να πάμε από kg σε g πολλαπλασιάζουμε επί 1.000 (${kg} · 1.000 ＝ ${g} g). Για να πάμε σε τόνους (t) διαιρούμε με το 1.000.`,
        lab2Badge: "⚖️ ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΟΠΤΙΚΗ ΙΣΟΡΡΟΠΙΑ",
        lab2Title: "Ζυγαριά Ισορροπίας: Εξισορροπούμε το Αντίβαρο του 1 kg",
        lab2Desc: "Στον αριστερό δίσκο υπάρχει ένα σταθερό αντίβαρο 1 kg. Προσθέστε ή αφαιρέστε γραμμάρια στον δεξιό δίσκο μέχρι η ζυγαριά να έρθει σε απόλυτη ισορροπία (1.000 g):",
        panRightLabel: "ΒΑΡΟΣ ΣΤΟΝ ΔΕΞΙΟ ΔΙΣΚΟ (ΣΕ ΓΡΑΜΜΑΡΙΑ):",
        currentGramsLabel: "Τρέχοντα Γραμμάρια:",
        btnWeight250: "＋ Σταθμό 250 g",
        btnWeight500: "＋ Σταθμό 500 g",
        scaleDiagramTitle: "ΣΧΗΜΑ: ΖΥΓΑΡΙΑ ΔΥΟ ΔΙΣΚΩΝ",
        scaleEquivLabel: "Αριστερός Δίσκος: 1 kg ＝ Δεξιός Δίσκος: 1.000 g",
        balanceBalanced: "Ισορροπία (1 kg ＝ 1.000 g)",
        balanceUnder: (rem) => `Υπολείπονται ${rem} g για ισορροπία`,
        balanceOver: (sur) => `Περίσσευμα ${sur} g (υπέρβαρο)`,
        problemsHeading: "Λυμένα Προβλήματα Καθημερινής Ζωής",
        problemsDesc: "Δύο ολοκληρωμένα προβλήματα με υπολογισμούς καθαρού βάρους και μετατροπές σε τόνους.",
        prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΜΙΚΤΟ & ΚΑΘΑΡΟ ΒΑΡΟΣ",
        prob1Tag: "Εμπόριο Φρούτων",
        prob1Title: "Υπολογισμός Καθαρού Βάρους σε Τελάρα Μήλων",
        prob1Desc: "Ένας μανάβης παρέλαβε 20 τελάρα με μήλα. Το μικτό βάρος κάθε τελάρου (μήλα μαζί με το ξύλινο κιβώτιο) ήταν 18,5 kg. Αν το κάθε άδειο τελάρο (απόβαρο) ζυγίζει 1.500 g, ποιο είναι το συνολικό καθαρό βάρος των μήλων σε κιλά (kg);",
        prob1TableHeading: "ΣΤΟΙΧΕΙΑ ΑΝΑ ΤΕΛΑΡΟ",
        prob1Gross: "Μικτό Βάρος",
        prob1Tare: "Απόβαρο",
        prob1Boxes: "Τελάρα",
        prob1BoxesUnit: "τεμάχια",
        prob1StepsTitle: "Βήματα Επίλυσης:",
        prob1Step1: "Απόβαρο σε κιλά: 1.500 : 1.000 ＝ 1,5 kg.",
        prob1Step2: "Καθαρό βάρος ανά τελάρο: 18,5 － 1,5 ＝ 17 kg.",
        prob1Step3: "Συνολικό καθαρό βάρος (20 τελάρα): 20 · 17 ＝ 340 kg.",
        prob1Tip: "💡 Το απόβαρο αφαιρείται πάντα στην ίδια μονάδα μέτρησης (kg) πριν πολλαπλασιάσουμε με το πλήθος των κιβωτίων.",
        prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΜΕΤΑΦΟΡΕΣ & ΤΟΝΟΙ",
        prob2Tag: "Φορτηγό",
        prob2Title: "Μέγιστο Φορτίο & Υπέρβαρο σε Τόνους",
        prob2Desc: "Ένα φορτηγό έχει επιτρεπόμενο μέγιστο βάρος φορτίου 3,5 t. Φορτώθηκαν σε αυτό 80 τσουβάλια τσιμέντου των 40 kg το καθένα. Πόσους τόνους (t) ζυγίζει το φορτίο και πόσα επιπλέον κιλά (kg) μπορούν να φορτωθούν;",
        prob2TableHeading: "ΔΕΔΟΜΕΝΑ ΦΟΡΤΙΟΥ",
        prob2Limit: "Όριο Φορτίου",
        prob2Bags: "Τσουβάλια",
        prob2StepsTitle: "Βήματα Επίλυσης:",
        prob2Step1: "Βάρος τσουβαλιών: 80 · 40 ＝ 3.200 kg.",
        prob2Step2: "Βάρος σε τόνους: 3.200 : 1.000 ＝ 3,2 t.",
        prob2Step3: "Υπόλοιπο χωρητικότητας: 3.500 － 3.200 ＝ 300 kg (ή 0,3 t).",
        prob2Tip: "💡 Το φορτηγό δεν έχει υπέρβαρο, καθώς τα 3,2 t είναι λιγότερα από το όριο των 3,5 t.",
        ctaTitle: "Ώρα για Εξάσκηση στις Μονάδες Βάρους!",
        ctaDesc: "Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικές ασκήσεις μετατροπών μονάδων (t, kg, g, mg), προβλημάτων καθαρού βάρους και ζυγίσεων για τη ΣΤ' Δημοτικού.",
        ctaBtn: "🎯 Έναρξη Ασκήσεων",
      },
      en: {
        pageTitle: "Weight (Mass) Units of Measurement & Conversions - 6th Grade | LearnMaths.gr",
        metaDescription: "Learn about the base unit of weight (kilogram/kg), metric tons, grams, milligrams, conversion rules, and the relationship between gross, net, and tare weight.",
        backText: "6th Grade",
        actionBtn: "🎯 Exercises",
        chapterBadge: "CHAPTER 60 • 6TH GRADE",
        headerTitle: "Weight (Mass) Units of Measurement",
        headerDesc: "Discover how we weigh objects: We learn the base measurement unit (kilogram/kg), its multiple (ton), and subdivisions (gram, milligram), master metric conversion rules, and solve problems with gross, net, and tare weight.",
        headerSub: "Theory, Conversion Scale & Interactive Balance Scale",
        tryExercises: "Try the Exercises",
        roadmapTitle: "Units of Weight in 4 Steps",
        roadmapDesc: "From everyday standard weight to heavy transport loads and precision medicine doses.",
        step1Badge: "STEP 1",
        step1Tag: "Base Unit",
        step1Title: "The Kilogram (kg)",
        step1Text: "The standard unit of weight (mass) in everyday life is the kilogram, commonly called kilo (kg).",
        step1Bullet1: "1 kg: Weighs approximately the same as 1 liter of pure water.",
        step1Bullet2: "Use: Measuring people's weight, fruit, groceries, and bulk goods.",
        step1Tip: "💡 The kilogram serves as the central reference base for all other units of weight.",
        step2Badge: "STEP 2",
        step2Tag: "Subdivisions",
        step2Title: "Gram (g) & Milligram (mg)",
        step2Text: "For lighter objects, we use metric subdivisions of the kilogram:",
        step2Sub1: "1 kg ＝ 1,000 g (grams)",
        step2Sub2: "1 g ＝ 1,000 mg (milligrams)",
        step2Usage: "Grams are used in baking and cooking spices, while milligrams are used in pharmacology and jewelry.",
        step2Tip: "⚡ 1 gram is 1,000 times smaller than a kilogram (1 g ＝ 0.001 kg).",
        step3Badge: "STEP 3",
        step3Tag: "Multiple",
        step3Title: "The Metric Ton (t)",
        step3Text: "For measuring exceptionally heavy loads (vehicles, shipping containers, grain crops), we use the metric ton (t):",
        step3TonEq: "1 t ＝ 1,000 kg ＝ 1,000,000 g",
        step3InversePrefix: "Inversely: 1 kg ＝ 0.001 t (or",
        step3InverseSuffix: "of a ton).",
        step3Tip: "🎯 A compact passenger car weighs roughly 1 to 1.5 tons (1,000 - 1,500 kg).",
        step4Badge: "STEP 4",
        step4Tag: "Commercial Terms",
        step4Title: "Gross, Net & Tare Weight",
        step4Text: "In trade and commerce, products are always contained within packaging:",
        step4Gross: "Gross Weight: Goods weight ＋ Packaging container weight",
        step4Tare: "Tare Weight: Weight of packaging only (empty box, crate)",
        step4Net: "Net Weight ＝ Gross Weight － Tare Weight",
        step4Tip: "🚀 Customers only ever pay for the actual net weight of the goods!",
        lab1Badge: "🔬 INTERACTIVE LAB 1",
        lab1Title: "Dynamic Weight Converter (t, kg, g, mg)",
        lab1Desc: "Adjust the weight in kilograms (kg) and watch it convert simultaneously into tons, grams, and milligrams.",
        lab1InputLabel: "BASE WEIGHT IN KILOGRAMS (kg):",
        lab1AllUnitsTitle: "SIMULTANEOUS DISPLAY ACROSS ALL WEIGHT UNITS",
        unitTon: "Tons (t):",
        unitKgBase: "Kilograms (kg) [Base]:",
        unitG: "Grams (g):",
        unitMg: "Milligrams (mg):",
        ruleText: (kg, g) => `💡 Rule: To convert from kg to g, multiply by 1,000 (${kg} · 1,000 ＝ ${g} g). To convert to tons (t), divide by 1,000.`,
        lab2Badge: "⚖️ INTERACTIVE LAB 2: VISUAL BALANCE",
        lab2Title: "Two-Pan Balance Scale: Balancing the 1 kg Counterweight",
        lab2Desc: "On the left pan rests a fixed 1 kg counterweight. Add or remove grams on the right pan until the scale reaches perfect equilibrium (1,000 g):",
        panRightLabel: "RIGHT PAN WEIGHT (IN GRAMS):",
        currentGramsLabel: "Current Grams:",
        btnWeight250: "＋ 250 g Weight",
        btnWeight500: "＋ 500 g Weight",
        scaleDiagramTitle: "DIAGRAM: TWO-PAN BALANCE SCALE",
        scaleEquivLabel: "Left Pan: 1 kg ＝ Right Pan: 1,000 g",
        balanceBalanced: "Balanced (1 kg ＝ 1,000 g)",
        balanceUnder: (rem) => `Needs ${rem} g to balance`,
        balanceOver: (sur) => `Overweight by ${sur} g`,
        problemsHeading: "Worked Everyday Problems",
        problemsDesc: "Two comprehensive word problems featuring net weight calculations and conversions to tons.",
        prob1Badge: "PROBLEM 1: GROSS & NET WEIGHT",
        prob1Tag: "Fruit Trade",
        prob1Title: "Calculating Net Weight in Crates of Apples",
        prob1Desc: "A grocer received 20 crates of apples. The gross weight of each crate (apples plus wooden crate) was 18.5 kg. If each empty crate (tare) weighs 1,500 g, what is the total net weight of the apples in kilograms (kg)?",
        prob1TableHeading: "DATA PER CRATE",
        prob1Gross: "Gross Weight",
        prob1Tare: "Tare Weight",
        prob1Boxes: "Crates",
        prob1BoxesUnit: "crates",
        prob1StepsTitle: "Solution Steps:",
        prob1Step1: "Tare in kilograms: 1,500 : 1,000 ＝ 1.5 kg.",
        prob1Step2: "Net weight per crate: 18.5 － 1.5 ＝ 17 kg.",
        prob1Step3: "Total net weight (20 crates): 20 · 17 ＝ 340 kg.",
        prob1Tip: "💡 Tare must always be converted to the same unit (kg) before multiplying by the number of crates.",
        prob2Badge: "PROBLEM 2: FREIGHT & TONS",
        prob2Tag: "Trucking",
        prob2Title: "Maximum Payload & Overweight in Tons",
        prob2Desc: "A freight truck has an allowed maximum cargo capacity of 3.5 t. It was loaded with 80 bags of cement weighing 40 kg each. How many tons (t) does the cargo weigh, and how many extra kilograms (kg) can still be loaded?",
        prob2TableHeading: "CARGO DATA",
        prob2Limit: "Cargo Limit",
        prob2Bags: "Cement Bags",
        prob2StepsTitle: "Solution Steps:",
        prob2Step1: "Weight of bags: 80 · 40 ＝ 3,200 kg.",
        prob2Step2: "Weight in tons: 3,200 : 1,000 ＝ 3.2 t.",
        prob2Step3: "Remaining capacity: 3,500 － 3,200 ＝ 300 kg (or 0.3 t).",
        prob2Tip: "💡 The truck is within legal limits, as 3.2 t is less than the 3.5 t payload limit.",
        ctaTitle: "Time to Practice Weight Units!",
        ctaDesc: "Test your skills with 10 dynamic exercises on weight conversions (t, kg, g, mg), net weight calculations, and scale balancing for 6th Grade.",
        ctaBtn: "🎯 Start Exercises",
      }
    }[locale];
  }, [locale]);

  // Εργαστηριο 1: Διαδραστικος Μετατροπεας Βαρους (Βαση το Κιλο - kg)
  const [kgValue, setKgValue] = useState(3.5);

  const conversions = useMemo(() => {
    return {
      t: Number((kgValue / 1000).toFixed(4)),
      kg: kgValue,
      g: Number((kgValue * 1000).toFixed(1)),
      mg: Number((kgValue * 1000000).toFixed(0))
    };
  }, [kgValue]);

  // Εργαστηριο 2: Διαδραστικη Ζυγαρια Ισορροπιας (1 kg = 1000 g)
  const [currentGrams, setCurrentGrams] = useState(600);

  const balanceState = useMemo(() => {
    const diff = currentGrams - 1000;
    if (diff === 0) {
      return { status: 'balanced', text: t.balanceBalanced, tilt: 0 };
    }
    if (diff < 0) {
      return { status: 'under', text: t.balanceUnder(formatNum(1000 - currentGrams, locale, 0)), tilt: -8 };
    }
    return { status: 'over', text: t.balanceOver(formatNum(currentGrams - 1000, locale, 0)), tilt: 8 };
  }, [currentGrams, t, locale]);

  return (
    <Layout
      title={t.pageTitle}
      description={t.metaDescription}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/60-baros-ask"
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
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              {t.headerDesc}
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t.headerSub}</span>
            </div>
            <Link
              href="/st-dimotikou/60-baros-ask"
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

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 text-slate-700">
                  <div>• <strong>{t.step1Bullet1}</strong></div>
                  <div>• <strong>{t.step1Bullet2}</strong></div>
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

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 font-mono">
                  <div className="text-slate-900 font-bold">• {t.step2Sub1}</div>
                  <div className="text-slate-900 font-bold">• {t.step2Sub2}</div>
                  <div className="text-slate-700 font-sans text-[11px] pt-1 leading-normal">
                    {t.step2Usage}
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

                <div className="bg-indigo-50/70 p-3 sm:p-4 rounded-2xl border border-indigo-200 text-xs sm:text-sm space-y-2 text-indigo-950 font-mono text-center">
                  <div className="font-bold text-sm sm:text-base">
                    {t.step3TonEq}
                  </div>
                  <div className="font-sans text-[11px] text-slate-600 leading-normal flex items-center justify-center flex-wrap gap-1">
                    <span>{t.step3InversePrefix}</span>
                    <Fraction num="1" den="1.000" className="text-xs text-indigo-700" />
                    <span>{t.step3InverseSuffix}</span>
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

                <div className="space-y-1.5 text-xs sm:text-sm font-mono">
                  <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 text-[11px]">
                    <strong>{t.step4Gross}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-[11px]">
                    <strong>{t.step4Tare}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-[11px]">
                    <strong>{t.step4Net}</strong>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {t.step4Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΔΥΝΑΜΙΚΟΣ ΜΕΤΑΤΡΟΠΕΑΣ ΒΑΡΟΥΣ */}
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
            
            {/* Χειριστηριο Ρυθμισης Βαρους */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-blue-900 tracking-wider">
                    {t.lab1InputLabel}
                  </span>
                  <span className="font-mono font-black text-base sm:text-xl text-blue-700 bg-white px-3 py-1 rounded-xl border border-blue-200 shadow-sm">
                    {formatNum(kgValue, locale, 2)} kg
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Decrease weight"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setKgValue((prev) => Math.max(0.5, Number((prev - 0.5).toFixed(1)))); }}
                    disabled={kgValue <= 0.5}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={0.5}
                    max={20}
                    step={0.5}
                    value={kgValue}
                    onChange={(e) => setKgValue(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    aria-label="Increase weight"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setKgValue((prev) => Math.min(20, Number((prev + 0.5).toFixed(1)))); }}
                    disabled={kgValue >= 20}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Γρηγορες Επιλογες */}
              <div className="grid grid-cols-4 gap-2">
                {[1, 2.5, 5, 10].map((quickVal) => (
                  <button
                    key={`btn-kg-${quickVal}`}
                    type="button"
                    onClick={() => setKgValue(quickVal)}
                    className="bg-white border border-slate-200 hover:bg-slate-100 py-2 rounded-xl font-bold text-xs sm:text-sm text-slate-700 shadow-sm transition active:scale-95 text-center touch-manipulation"
                  >
                    {formatNum(quickVal, locale, 1)} kg
                  </button>
                ))}
              </div>
            </div>

            {/* Πινακας Ισοδυναμων Μονάδων */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-3">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block text-center">
                {toCleanUppercase(t.lab1AllUnitsTitle)}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm font-mono">
                <div className="p-3 bg-white rounded-2xl border border-purple-200 flex items-center justify-between">
                  <span className="text-slate-600 font-sans">{t.unitTon}</span>
                  <span className="font-bold text-purple-700">{formatNum(conversions.t, locale, 4)} t</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-blue-300 flex items-center justify-between bg-blue-50/30">
                  <span className="text-blue-900 font-sans font-bold">{t.unitKgBase}</span>
                  <span className="font-black text-blue-700">{formatNum(conversions.kg, locale, 2)} kg</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-emerald-200 flex items-center justify-between">
                  <span className="text-slate-600 font-sans">{t.unitG}</span>
                  <span className="font-bold text-emerald-700">{formatNum(conversions.g, locale, 1)} g</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-rose-200 flex items-center justify-between">
                  <span className="text-slate-600 font-sans">{t.unitMg}</span>
                  <span className="font-bold text-rose-700">{formatNum(conversions.mg, locale, 0)} mg</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-slate-200 text-center font-sans text-xs text-slate-600 space-y-1">
                <div>
                  {t.ruleText(formatNum(kgValue, locale, 1), formatNum(conversions.g, locale, 0))}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΖΥΓΑΡΙΑ ΙΣΟΡΡΟΠΙΑΣ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs 2xl:text-sm font-bold text-amber-800 mb-1">
              <span>{toCleanUppercase(t.lab2Badge)}</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              {t.lab2Title}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.lab2Desc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Κουμπιά Προσθήκης Σταθμών */}
            <div className="lg:col-span-5 space-y-3.5">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-700 block">
                  {t.panRightLabel}
                </span>
                
                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-xs font-semibold text-slate-600">{t.currentGramsLabel}</span>
                  <span className="font-mono font-black text-lg sm:text-xl text-amber-700">
                    {currentGrams} g ({formatNum(currentGrams / 1000, locale, 3)} kg)
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setCurrentGrams((prev) => Math.max(0, prev - 100))}
                    disabled={currentGrams <= 0}
                    className="p-2 bg-white hover:bg-slate-100 disabled:opacity-40 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm transition active:scale-95"
                  >
                    － 100 g
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentGrams(1000)}
                    className="p-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-black text-emerald-800 shadow-sm transition active:scale-95"
                  >
                    🎯 1.000 g
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentGrams((prev) => Math.min(2000, prev + 100))}
                    disabled={currentGrams >= 2000}
                    className="p-2 bg-white hover:bg-slate-100 disabled:opacity-40 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm transition active:scale-95"
                  >
                    ＋ 100 g
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentGrams((prev) => Math.min(2000, prev + 250))}
                    disabled={currentGrams >= 2000}
                    className="p-2 bg-white hover:bg-slate-100 disabled:opacity-40 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm transition active:scale-95"
                  >
                    {t.btnWeight250}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentGrams((prev) => Math.min(2000, prev + 500))}
                    disabled={currentGrams >= 2000}
                    className="p-2 bg-white hover:bg-slate-100 disabled:opacity-40 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm transition active:scale-95"
                  >
                    {t.btnWeight500}
                  </button>
                </div>
              </div>

              <div className={`p-3 rounded-2xl border text-xs font-bold text-center ${
                balanceState.status === 'balanced'
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : balanceState.status === 'under'
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-rose-100 text-rose-900 border-rose-300'
              }`}>
                {balanceState.text}
              </div>
            </div>

            {/* Σχημα SVG Ζυγαριας */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-2">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                {toCleanUppercase(t.scaleDiagramTitle)}
              </span>

              <div className="w-full max-w-[420px] aspect-[16/10] bg-white rounded-2xl border border-slate-200 p-2 shadow-inner flex items-center justify-center">
                <svg viewBox="0 0 360 210" className="w-full h-full overflow-visible">
                  <rect x="165" y="60" width="10" height="110" fill="#475569" rx="2" />
                  <path d="M 130 185 L 210 185 L 195 170 L 145 170 Z" fill="#334155" />
                  <circle cx="170" cy="60" r="7" fill="#1e293b" />

                  <g transform={`rotate(${balanceState.tilt}, 170, 60)`}>
                    <line x1="50" y1="60" x2="290" y2="60" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
                    
                    {/* Αριστερος Δισκος */}
                    <line x1="60" y1="60" x2="45" y2="120" stroke="#94a3b8" strokeWidth="1.5" />
                    <line x1="60" y1="60" x2="75" y2="120" stroke="#94a3b8" strokeWidth="1.5" />
                    <ellipse cx="60" cy="120" rx="30" ry="7" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
                    <rect x="47" y="93" width="26" height="25" fill="#2563eb" rx="3" stroke="#1d4ed8" strokeWidth="1.5" />
                    <text x="60" y="110" fontSize="10" fontWeight="900" fill="#ffffff" textAnchor="middle">
                      1 kg
                    </text>

                    {/* Δεξιος Δισκος */}
                    <line x1="280" y1="60" x2="265" y2="120" stroke="#94a3b8" strokeWidth="1.5" />
                    <line x1="280" y1="60" x2="295" y2="120" stroke="#94a3b8" strokeWidth="1.5" />
                    <ellipse cx="280" cy="120" rx="30" ry="7" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
                    <rect x="264" y="96" width="32" height="22" fill="#d97706" rx="3" stroke="#b45309" strokeWidth="1.5" />
                    <text x="280" y="111" fontSize="9.5" fontWeight="900" fill="#ffffff" textAnchor="middle">
                      {currentGrams}g
                    </text>
                  </g>
                </svg>
              </div>

              <div className="text-[11px] font-mono font-bold text-slate-600 text-center">
                {t.scaleEquivLabel}
              </div>
            </div>

          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΑΡΑΔΕΙΓΜΑΤΑ ΠΡΟΒΛΗΜΑΤΩΝ ΜΕ ΣΧΗΜΑΤΑ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              {t.problemsHeading}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.problemsDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Παραδειγμα 1 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-black rounded-lg">
                  {toCleanUppercase(t.prob1Badge)}
                </span>
                <span className="text-xs font-bold text-slate-400">{t.prob1Tag}</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                {t.prob1Title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.prob1Desc}
              </p>

              {/* Οπτικος Πινακας Δεδομενων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  {toCleanUppercase(t.prob1TableHeading)}
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob1Gross}</span> 18,5 kg
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob1Tare}</span> 1.500 g ＝ 1,5 kg
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob1Boxes}</span> 20 {t.prob1BoxesUnit}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">{t.prob1StepsTitle}</span>
                  <div>• {t.prob1Step1}</div>
                  <div>• {t.prob1Step2}</div>
                  <div>• <strong>{t.prob1Step3}</strong></div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
                {t.prob1Tip}
              </div>
            </article>

            {/* Παραδειγμα 2 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-lg">
                  {toCleanUppercase(t.prob2Badge)}
                </span>
                <span className="text-xs font-bold text-slate-400">{t.prob2Tag}</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                {t.prob2Title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.prob2Desc}
              </p>

              {/* Οπτικος Πινακας Δεδομενων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  {toCleanUppercase(t.prob2TableHeading)}
                </span>
                <div className="grid grid-cols-2 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob2Limit}</span> 3,5 t ＝ 3.500 kg
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob2Bags}</span> 80 · 40 kg
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">{t.prob2StepsTitle}</span>
                  <div>• {t.prob2Step1}</div>
                  <div>• {t.prob2Step2}</div>
                  <div>• <strong>{t.prob2Step3}</strong></div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
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
            href="/st-dimotikou/60-baros-ask"
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