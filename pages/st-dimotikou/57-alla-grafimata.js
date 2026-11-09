// pages/st-dimotikou/57-alla-grafimata.js
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
  if (val === undefined || val === null || isNaN(Number(val))) return '0';
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

// Κανονικη μορφη κλασματος (αριθμητης πανω, κλασματικη γραμμη, παρονομαστης κατω)
function Fraction({ num, den, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center align-middle mx-1 text-center font-mono leading-none ${className}`}>
      <span className="text-[0.9em] font-bold pb-0.5 px-1 border-b border-current">{num}</span>
      <span className="text-[0.9em] font-bold pt-0.5 px-1">{den}</span>
    </span>
  );
}

export default function AllaGrafimataTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';

  const t = useMemo(() => {
    return {
      el: {
        pageTitle: "Άλλα Γραφήματα: Γραμμής, Οριζόντιο, Κυκλικό - ΣΤ' Δημοτικού | LearnMaths.gr",
        metaDescription: "Μαθαίνουμε πότε χρησιμοποιούμε γράφημα γραμμής, οριζόντιο ραβδόγραμμα και κυκλικό διάγραμμα (πίτα), πώς υπολογίζουμε επίκεντρες γωνίες και ερμηνεύουμε στατιστικά στοιχεία.",
        backText: "ΣΤ' Δημοτικού",
        actionBtn: "🎯 Ασκήσεις",
        chapterBadge: "ΚΕΦΑΛΑΙΟ 57 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
        headerTitle: "Άλλα Είδη Γραφημάτων: Γραμμής, Οριζόντιο & Κυκλικό",
        headerDesc: "Επεκτείνουμε τις γνώσεις μας στη στατιστική απεικόνιση: Μαθαίνουμε να αποτυπώνουμε τη διαχρονική εξέλιξη με γραφήματα γραμμής, να συγκρίνουμε ονόματα με οριζόντια ραβδογράμματα και να διαιρούμε το όλο σε ποσοστά και μοίρες με κυκλικά διαγράμματα.",
        headerSub: "Θεωρία, Οπτικά Παραδείγματα & Διαδραστική Εναλλαγή Γραφημάτων",
        tryExercises: "Δοκίμασε τις Ασκήσεις",
        roadmapTitle: "Επιλογή του Κατάλληλου Γραφήματος σε 4 Βήματα",
        roadmapDesc: "Κάθε είδος γραφήματος έχει έναν συγκεκριμένο ρόλο ανάλογα με τα δεδομένα που θέλουμε να προβάλουμε.",
        step1Badge: "ΒΗΜΑ 1",
        step1Tag: "Εξέλιξη Χρόνου",
        step1Title: "Γράφημα Γραμμής",
        step1Text: "Χρησιμοποιείται όταν θέλουμε να δείξουμε πώς μεταβάλλεται ένα μέγεθος με την πάροδο του χρόνου (χρονοσειρά):",
        step1Bullet1: "Οριζόντιος άξονας (χ): Ο χρόνος (ώρες, ημέρες, μήνες, έτη).",
        step1Bullet2: "Κατακόρυφος άξονας (ψ): Το μέγεθος (θερμοκρασία, ύψος, πωλήσεις).",
        step1Bullet3: "Σημεία & Ευθύγραμμα τμήματα: Ενώνουμε τα σημεία για να δούμε αν η τάση είναι ανοδική, καθοδική ή σταθερή.",
        step1Tip: "💡 Ιδανικό για: ημερήσιες θερμοκρασίες, ανάπτυξη φυτού, μηνιαία έξοδα.",
        step2Badge: "ΒΗΜΑ 2",
        step2Tag: "Σύγκριση Ονομάτων",
        step2Title: "Οριζόντιο Ραβδόγραμμα",
        step2Text: "Είναι ένα κλασικό ραβδόγραμμα «ξαπλωμένο» οριζόντια. Προτιμάται όταν οι κατηγορίες έχουν μεγάλα ονόματα:",
        step2Bullet1: "Κατακόρυφος άξονας: Οι κατηγορίες / ονόματα.",
        step2Bullet2: "Οριζόντιος άξονας: Η κλίμακα των αριθμητικών τιμών.",
        step2Bullet3: "Μήκος ράβδου: Δείχνει τη συχνότητα της κάθε κατηγορίας.",
        step2Tip: "⚡ Διευκολύνει την ανάγνωση χωρίς να χρειάζεται να γέρνουμε το κεφάλι για να διαβάσουμε μεγάλες λέξεις!",
        step3Badge: "ΒΗΜΑ 3",
        step3Tag: "Μέρος προς Όλο",
        step3Title: "Κυκλικό Διάγραμμα (Πίτα)",
        step3Text: "Αναπαριστά τη σχέση των επιμέρους τμημάτων με το σύνολο. Ολόκληρος ο κύκλος αντιπροσωπεύει το 100%:",
        step3CircleWhole: "Ολόκληρος Κύκλος ＝ 100 % ＝ 360°",
        step3HalfLabel: "Μισός Κύκλος",
        step3QuarterLabel: "Τέταρτο Κύκλου",
        step3Tip: "🎯 Κάθε τομέας του κύκλου έχει επίκεντρη γωνία ανάλογη με το ποσοστό της κατηγορίας.",
        step4Badge: "ΒΗΜΑ 4",
        step4Tag: "Μαθηματικός Τύπος",
        step4Title: "Υπολογισμός Επίκεντρης Γωνίας",
        step4Text: "Για να σχεδιάσουμε έναν κυκλικό τομέα με μοιρογνωμόνιο, βρίσκουμε τις μοίρες με αναλογία:",
        step4FormulaTitle: "Μοίρες (α°) ＝",
        step4FormulaNum: "Ποσοστό % · 360°",
        step4FormulaDen: "100",
        step4Example: "Παράδειγμα: Το 20% αντιστοιχεί σε (20 · 360) : 100 ＝ 72°.",
        step4Tip: "🚀 Το άθροισμα των γωνιών όλων των κυκλικών τομέων ισούται αυστηρά με 360°.",
        lab1Badge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1",
        lab1Title: "Δυναμικός Μετατροπέας: Ίδια Δεδομένα σε 3 Διαφορετικά Γραφήματα",
        lab1Desc: "Ρυθμίστε τις τιμές ανά 1 μονάδα και αλλάξτε την προβολή για να δείτε πώς τα ίδια δεδομένα παρουσιάζονται σε Γράφημα Γραμμής, Οριζόντιο Ραβδόγραμμα ή Κυκλικό Διάγραμμα.",
        tabLine: "📈 Γραμμής",
        tabHbar: "📊 Οριζόντιο",
        tabPie: "🥧 Κυκλικό",
        pointPrefix: "Σημείο",
        unitsLabel: "μονάδες",
        totalUnits: "Σύνολο μονάδων:",
        chartTitleLine: "ΓΡΑΦΗΜΑ ΓΡΑΜΜΗΣ (ΧΡΟΝΟΣΕΙΡΑ)",
        chartTitleHbar: "ΟΡΙΖΟΝΤΙΟ ΡΑΒΔΟΓΡΑΜΜΑ (ΣΥΓΚΡΙΣΗ)",
        chartTitlePie: "ΚΥΚΛΙΚΟ ΔΙΑΓΡΑΜΜΑ (ΜΕΡΟΣ ΠΡΟΣ ΟΛΟ)",
        chartTakeaway: "Η επιλογή του γραφήματος εξαρτάται από τον στόχο: εξέλιξη (γραμμή), σύγκριση (ραβδόγραμμα) ή ποσοστά (κυκλικό)!",
        lab2Badge: "📐 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΑΝΑΛΟΓΙΑ ΜΟΙΡΩΝ ΚΑΙ ΠΟΣΟΣΤΩΝ",
        lab2Title: "Πώς Υπολογίζουμε την Επίκεντρη Γωνία (360° ＝ 100%)",
        lab2Desc: "Σύρετε το ποσοστό (%) για να δείτε ακριβώς πόσες μοίρες επίκεντρης γωνίας πρέπει να σχεδιάσουμε με το μοιρογνωμόνιο και παρατηρήστε το άνοιγμα της γωνίας στον κύκλο:",
        pctInputLabel: "ΠΟΣΟΣΤΟ ΚΑΤΗΓΟΡΙΑΣ (%):",
        circleAngleLabel: "ΑΝΟΙΓΜΑ ΓΩΝΙΑΣ ΣΤΟΝ ΚΥΚΛΟ",
        circleCenterO: "Ο",
        centralLabel: "Επίκεντρη:",
        boxAngleHeading: "ΕΠΙΚΕΝΤΡΗ ΓΩΝΙΑ ΣΕ ΜΟΙΡΕΣ (α°)",
        proportionLabel: "Αναλογία:",
        boxExplanation: (pct, deg) => `Στο 100% αντιστοιχούν 360°. Στο ${pct}% αντιστοιχούν ακριβώς ${deg}°.`,
        problemsHeading: "Λυμένα Παραδείγματα Προβλημάτων με Σχήματα",
        problemsDesc: "Δύο ολοκληρωμένα προβλήματα με γράφημα γραμμής και κυκλικό διάγραμμα.",
        prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΓΡΑΦΗΜΑ ΓΡΑΜΜΗΣ",
        prob1Tag: "Μετεωρολογία",
        prob1Title: "Διακύμανση Θερμοκρασίας στη Διάρκεια της Ημέρας",
        prob1Desc: "Σε έναν μετεωρολογικό σταθμό καταγράφηκε η θερμοκρασία: 08:00 (12°C), 12:00 (20°C), 16:00 (18°C), 20:00 (14°C).",
        prob1DiagramTitle: "ΣΧΗΜΑ: ΧΡΟΝΟΣΕΙΡΑ ΘΕΡΜΟΚΡΑΣΙΑΣ (°C)",
        prob1QA: "Ερωτήματα & Απαντήσεις:",
        prob1Max: "Μέγιστη θερμοκρασία: 20°C (στις 12:00 το μεσημέρι).",
        prob1Range: "Εύρος διακύμανσης: 20°C － 12°C ＝ 8°C.",
        prob1Tip: "💡 Το γράφημα γραμμής δείχνει καθαρά την άνοδο της θερμοκρασίας μέχρι το μεσημέρι και τη βαθμιαία πτώση της προς το απόγευμα.",
        prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΚΥΚΛΙΚΟ ΔΙΑΓΡΑΜΜΑ",
        prob2Tag: "Δραστηριότητες",
        prob2Title: "Κατανομή Ελεύθερου Χρόνου Μαθητή",
        prob2Desc: "Ένας μαθητής αφιερώνει τον ελεύθερο χρόνο του ως εξής: Αθλητισμός 50 %, Διάβασμα εξωσχολικών βιβλίων 25 %, Μουσική 25 %.",
        prob2DiagramTitle: "ΣΧΗΜΑ: ΚΥΚΛΙΚΟΣ ΤΟΜΕΑΣ ΑΝΑΛΟΓΙΑΣ",
        prob2LegendSport: "● Αθλητισμός (50% / 180°)",
        prob2LegendReading: "● Διάβασμα (25% / 90°)",
        prob2LegendMusic: "● Μουσική (25% / 90°)",
        prob2CalcTitle: "Υπολογισμός Επίκεντρων Γωνιών:",
        prob2CalcSport: "Αθλητισμός (50%): (50 · 360) : 100 ＝ 180°",
        prob2CalcReading: "Διάβασμα (25%): (25 · 360) : 100 ＝ 90°",
        prob2CalcMusic: "Μουσική (25%): (25 · 360) : 100 ＝ 90°",
        prob2Tip: "💡 Το άθροισμα των γωνιών είναι: 180° ＋ 90° ＋ 90° ＝ 360° (ένας πλήρης κύκλος).",
        ctaTitle: "Ώρα για Εξάσκηση στα Άλλα Είδη Γραφημάτων!",
        ctaDesc: "Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικές ασκήσεις με γραφήματα γραμμής, οριζόντια ραβδογράμματα, κυκλικά διαγράμματα και υπολογισμούς επίκεντρων γωνιών για τη ΣΤ' Δημοτικού.",
        ctaBtn: "🎯 Έναρξη Ασκήσεων",
      },
      en: {
        pageTitle: "Other Graphs: Line, Horizontal Bar, Circle - 6th Grade | LearnMaths.gr",
        metaDescription: "Learn when to use line graphs, horizontal bar charts, and pie charts, how to calculate central angles, and how to interpret statistical data.",
        backText: "6th Grade",
        actionBtn: "🎯 Exercises",
        chapterBadge: "CHAPTER 57 • 6TH GRADE",
        headerTitle: "Other Graph Types: Line, Horizontal Bar & Pie Charts",
        headerDesc: "We expand our statistical visualization skills: Learn to show progress over time with line graphs, compare categories with horizontal bar charts, and divide the whole into percentages and degrees with pie charts.",
        headerSub: "Theory, Visual Examples & Interactive Chart Converter",
        tryExercises: "Try the Exercises",
        roadmapTitle: "Choosing the Right Chart in 4 Steps",
        roadmapDesc: "Every graph type serves a distinct purpose depending on the data you want to communicate.",
        step1Badge: "STEP 1",
        step1Tag: "Change Over Time",
        step1Title: "Line Graph",
        step1Text: "Used when displaying how a quantity changes over time (time series data):",
        step1Bullet1: "Horizontal axis (x): Time (hours, days, months, years).",
        step1Bullet2: "Vertical axis (y): The measured quantity (temperature, height, sales).",
        step1Bullet3: "Points & Line segments: We connect points to observe upward, downward, or steady trends.",
        step1Tip: "💡 Ideal for: daily temperatures, plant growth, monthly expenses.",
        step2Badge: "STEP 2",
        step2Tag: "Comparing Categories",
        step2Title: "Horizontal Bar Chart",
        step2Text: "A standard bar chart placed horizontally. Best suited when category names are long or descriptive:",
        step2Bullet1: "Vertical axis: Categories or descriptive labels.",
        step2Bullet2: "Horizontal axis: Numerical value scale.",
        step2Bullet3: "Bar length: Displays the frequency of each category.",
        step2Tip: "⚡ Makes reading long category names comfortable without tilting your head!",
        step3Badge: "STEP 3",
        step3Tag: "Part to Whole",
        step3Title: "Pie Chart (Circle Graph)",
        step3Text: "Represents the proportion of each part relative to the entire whole. The full circle represents 100%:",
        step3CircleWhole: "Full Circle ＝ 100 % ＝ 360°",
        step3HalfLabel: "Half Circle",
        step3QuarterLabel: "Quarter Circle",
        step3Tip: "🎯 Each circular sector has a central angle proportional to the category's percentage.",
        step4Badge: "STEP 4",
        step4Tag: "Mathematical Formula",
        step4Title: "Calculating Central Angle",
        step4Text: "To draw a circle sector using a protractor, calculate its degrees using proportion:",
        step4FormulaTitle: "Angle (α°) ＝",
        step4FormulaNum: "Percentage % · 360°",
        step4FormulaDen: "100",
        step4Example: "Example: 20% corresponds to (20 · 360) : 100 ＝ 72°.",
        step4Tip: "🚀 The sum of all sector angles in a pie chart must strictly equal 360°.",
        lab1Badge: "🔬 INTERACTIVE LAB 1",
        lab1Title: "Dynamic Converter: Same Data in 3 Distinct Graphs",
        lab1Desc: "Adjust values by 1 unit and switch chart views to see how the exact same dataset is represented as a Line Graph, Horizontal Bar Chart, or Pie Chart.",
        tabLine: "📈 Line",
        tabHbar: "📊 Horizontal",
        tabPie: "🥧 Pie",
        pointPrefix: "Point",
        unitsLabel: "units",
        totalUnits: "Total units:",
        chartTitleLine: "LINE GRAPH (TIME SERIES)",
        chartTitleHbar: "HORIZONTAL BAR CHART (COMPARISON)",
        chartTitlePie: "PIE CHART (PART TO WHOLE)",
        chartTakeaway: "Chart selection depends on your goal: trend over time (line), comparing labels (bar), or percentages (pie)!",
        lab2Badge: "📐 INTERACTIVE LAB 2: DEGREES & PERCENTAGES PROPORTION",
        lab2Title: "How to Compute Central Angle (360° ＝ 100%)",
        lab2Desc: "Drag the percentage slider to see how many degrees to measure with a protractor, and observe the central angle open dynamically in the circle:",
        pctInputLabel: "CATEGORY PERCENTAGE (%):",
        circleAngleLabel: "CENTRAL ANGLE IN CIRCLE",
        circleCenterO: "O",
        centralLabel: "Central Angle:",
        boxAngleHeading: "CENTRAL ANGLE IN DEGREES (α°)",
        proportionLabel: "Proportion:",
        boxExplanation: (pct, deg) => `100% corresponds to 360°. Therefore, ${pct}% corresponds to exactly ${deg}°.`,
        problemsHeading: "Worked Problems with Visuals",
        problemsDesc: "Two complete worked problems illustrating a line graph and a pie chart.",
        prob1Badge: "PROBLEM 1: LINE GRAPH",
        prob1Tag: "Meteorology",
        prob1Title: "Daily Temperature Variation",
        prob1Desc: "A weather station recorded temperatures: 08:00 (12°C), 12:00 (20°C), 16:00 (18°C), 20:00 (14°C).",
        prob1DiagramTitle: "DIAGRAM: TEMPERATURE TIME SERIES (°C)",
        prob1QA: "Questions & Answers:",
        prob1Max: "Maximum temperature: 20°C (at 12:00 noon).",
        prob1Range: "Variation range: 20°C － 12°C ＝ 8°C.",
        prob1Tip: "💡 The line graph clearly displays the temperature rising until noon and gradually dropping toward the evening.",
        prob2Badge: "PROBLEM 2: PIE CHART",
        prob2Tag: "Activities",
        prob2Title: "Free Time Allocation of a Student",
        prob2Desc: "A student spends free time as follows: Sports 50 %, Reading extracurricular books 25 %, Music 25 %.",
        prob2DiagramTitle: "DIAGRAM: CIRCLE SECTOR PROPORTIONS",
        prob2LegendSport: "● Sports (50% / 180°)",
        prob2LegendReading: "● Reading (25% / 90°)",
        prob2LegendMusic: "● Music (25% / 90°)",
        prob2CalcTitle: "Central Angle Calculations:",
        prob2CalcSport: "Sports (50%): (50 · 360) : 100 ＝ 180°",
        prob2CalcReading: "Reading (25%): (25 · 360) : 100 ＝ 90°",
        prob2CalcMusic: "Music (25%): (25 · 360) : 100 ＝ 90°",
        prob2Tip: "💡 Sum of angles: 180° ＋ 90° ＋ 90° ＝ 360° (a complete circle).",
        ctaTitle: "Time to Practice Other Graph Types!",
        ctaDesc: "Test your skills with 10 dynamic exercises on line graphs, horizontal bar charts, pie charts, and central angle calculations for 6th Grade.",
        ctaBtn: "🎯 Start Exercises",
      }
    }[locale];
  }, [locale]);

  // Εργαστηριο 1: Διαδραστικη Απεικονιση Δεδομενων σε 3 ειδη γραφηματων
  const [chartType, setChartType] = useState('line'); // 'line', 'hbar', 'pie'
  const [val1, setVal1] = useState(15);
  const [val2, setVal2] = useState(25);
  const [val3, setVal3] = useState(35);
  const [val4, setVal4] = useState(20);

  const total = val1 + val2 + val3 + val4;

  const dataset = useMemo(() => [
    { label: `${t.pointPrefix} A`, value: val1, color: '#3b82f6', angle: total > 0 ? (val1 / total) * 360 : 0 },
    { label: `${t.pointPrefix} B`, value: val2, color: '#10b981', angle: total > 0 ? (val2 / total) * 360 : 0 },
    { label: `${t.pointPrefix} C`, value: val3, color: '#f59e0b', angle: total > 0 ? (val3 / total) * 360 : 0 },
    { label: `${t.pointPrefix} D`, value: val4, color: '#ec4899', angle: total > 0 ? (val4 / total) * 360 : 0 }
  ], [val1, val2, val3, val4, total, t]);

  // Εργαστηριο 2: Υπολογιστης Επικεντρης Γωνιας
  const [percentInput, setPercentInput] = useState(25); // 25%

  const degreesCalculated = useMemo(() => {
    return Number(((percentInput * 360) / 100).toFixed(1));
  }, [percentInput]);

  // Υπολογισμος γεωμετριας τομεα για τον δυναμικο κυκλο του Εργαστηριου 2
  const angleSectorData = useMemo(() => {
    const cx = 100;
    const cy = 100;
    const r = 75;
    const angle = degreesCalculated;

    if (angle >= 360) {
      return {
        path: `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r} Z`,
        arcPath: '',
        endX: cx,
        endY: cy - r
      };
    }

    const rad = (Math.PI * (angle - 90)) / 180;
    const endX = cx + r * Math.cos(rad);
    const endY = cy + r * Math.sin(rad);
    const largeArc = angle > 180 ? 1 : 0;
    const path = `M ${cx} ${cy} L ${cx} ${cy - r} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY} Z`;

    const rSmall = 26;
    const endXSmall = cx + rSmall * Math.cos(rad);
    const endYSmall = cy + rSmall * Math.sin(rad);
    const arcPath = `M ${cx} ${cy - rSmall} A ${rSmall} ${rSmall} 0 ${largeArc} 1 ${endXSmall} ${endYSmall}`;

    return { path, arcPath, endX, endY };
  }, [degreesCalculated]);

  return (
    <Layout
      title={t.pageTitle}
      description={t.metaDescription}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/57-alla-grafimata-ask"
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
              href="/st-dimotikou/57-alla-grafimata-ask"
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
                  <div>• <strong>{t.step1Bullet3}</strong></div>
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

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 text-slate-700">
                  <div>• <strong>{t.step2Bullet1}</strong></div>
                  <div>• <strong>{t.step2Bullet2}</strong></div>
                  <div>• <strong>{t.step2Bullet3}</strong></div>
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

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm text-center font-mono">
                  <div className="text-indigo-950 font-bold">
                    {t.step3CircleWhole}
                  </div>
                  <div className="text-slate-700 font-sans text-xs flex flex-wrap items-center justify-center gap-3 pt-1 border-t border-slate-200">
                    <span className="inline-flex items-center">
                      <Fraction num="1" den="2" className="text-sm text-indigo-700" />
                      <span>{t.step3HalfLabel} ＝ 50 % ＝ 180°</span>
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="inline-flex items-center">
                      <Fraction num="1" den="4" className="text-sm text-indigo-700" />
                      <span>{t.step3QuarterLabel} ＝ 25 % ＝ 90°</span>
                    </span>
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

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm font-mono text-center">
                  <div className="p-2 bg-white rounded-xl border border-slate-200 text-emerald-900 font-bold flex items-center justify-center flex-wrap gap-1">
                    <span>{t.step4FormulaTitle}</span>
                    <Fraction num={t.step4FormulaNum} den={t.step4FormulaDen} className="text-sm text-emerald-700" />
                  </div>
                  <div className="text-[11px] text-slate-500 font-sans">
                    {t.step4Example}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {t.step4Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΔΥΝΑΜΙΚΟΣ ΜΕΤΑΤΡΟΠΕΑΣ ΓΡΑΦΗΜΑΤΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
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

            {/* Διακοπτης 3 Τυπων Γραφηματος */}
            <div className="grid grid-cols-3 sm:flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setChartType('line')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition text-center ${
                  chartType === 'line'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.tabLine}
              </button>
              <button
                type="button"
                onClick={() => setChartType('hbar')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition text-center ${
                  chartType === 'hbar'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.tabHbar}
              </button>
              <button
                type="button"
                onClick={() => setChartType('pie')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition text-center ${
                  chartType === 'pie'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.tabPie}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* Χειριστηρια Τιμων */}
            <div className="lg:col-span-5 space-y-3 sm:space-y-3.5">
              
              {/* Σημειο Α */}
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> {dataset[0].label}
                  </span>
                  <span className="font-mono font-black text-xs sm:text-sm text-blue-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {val1} {t.unitsLabel}
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label={`Decrease ${dataset[0].label}`}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setVal1((prev) => Math.max(5, prev - 1)); }}
                    disabled={val1 <= 5}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={5}
                    max={50}
                    step={1}
                    value={val1}
                    onChange={(e) => setVal1(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    aria-label={`Increase ${dataset[0].label}`}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setVal1((prev) => Math.min(50, prev + 1)); }}
                    disabled={val1 >= 50}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Σημειο Β */}
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> {dataset[1].label}
                  </span>
                  <span className="font-mono font-black text-xs sm:text-sm text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {val2} {t.unitsLabel}
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label={`Decrease ${dataset[1].label}`}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setVal2((prev) => Math.max(5, prev - 1)); }}
                    disabled={val2 <= 5}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={5}
                    max={50}
                    step={1}
                    value={val2}
                    onChange={(e) => setVal2(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    aria-label={`Increase ${dataset[1].label}`}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setVal2((prev) => Math.min(50, prev + 1)); }}
                    disabled={val2 >= 50}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Σημειο Γ */}
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> {dataset[2].label}
                  </span>
                  <span className="font-mono font-black text-xs sm:text-sm text-amber-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {val3} {t.unitsLabel}
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label={`Decrease ${dataset[2].label}`}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setVal3((prev) => Math.max(5, prev - 1)); }}
                    disabled={val3 <= 5}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={5}
                    max={50}
                    step={1}
                    value={val3}
                    onChange={(e) => setVal3(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    aria-label={`Increase ${dataset[2].label}`}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setVal3((prev) => Math.min(50, prev + 1)); }}
                    disabled={val3 >= 50}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Σημειο Δ */}
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span> {dataset[3].label}
                  </span>
                  <span className="font-mono font-black text-xs sm:text-sm text-pink-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {val4} {t.unitsLabel}
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label={`Decrease ${dataset[3].label}`}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setVal4((prev) => Math.max(5, prev - 1)); }}
                    disabled={val4 <= 5}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={5}
                    max={50}
                    step={1}
                    value={val4}
                    onChange={(e) => setVal4(Number(e.target.value))}
                    className="w-full accent-pink-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    aria-label={`Increase ${dataset[3].label}`}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setVal4((prev) => Math.min(50, prev + 1)); }}
                    disabled={val4 >= 50}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Συνολο Μοναδων */}
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 text-center font-bold text-xs sm:text-sm text-blue-950">
                {t.totalUnits} <strong className="font-mono text-sm sm:text-base">{total}</strong>
              </div>

            </div>

            {/* Οπτικη Προβολη Γραφηματος (SVG) */}
            <div className="lg:col-span-7 bg-slate-50 p-3.5 sm:p-6 rounded-3xl border border-slate-200 flex flex-col items-center justify-center w-full min-h-[340px]">
              
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 sm:mb-3 text-center">
                {chartType === 'line' && toCleanUppercase(t.chartTitleLine)}
                {chartType === 'hbar' && toCleanUppercase(t.chartTitleHbar)}
                {chartType === 'pie' && toCleanUppercase(t.chartTitlePie)}
              </span>

              {/* 1. Γραφημα Γραμμης (Line Chart) */}
              {chartType === 'line' && (
                <div className="w-full max-w-[460px] aspect-[4/3] sm:aspect-[16/10] bg-white rounded-2xl border border-slate-200 p-2 sm:p-4 shadow-sm flex items-center justify-center">
                  <svg viewBox="0 0 380 240" className="w-full h-auto max-h-[260px] overflow-visible">
                    {[0, 15, 30, 45, 60].map((tick) => {
                      const y = 195 - (tick / 60) * 150;
                      return (
                        <g key={`l-tick-${tick}`}>
                          <line x1="42" y1={y} x2="365" y2={y} stroke="#f1f5f9" strokeWidth="1.5" />
                          <text x="35" y={y + 4} fontSize="10" fontWeight="bold" fill="#64748b" textAnchor="end">
                            {tick}
                          </text>
                        </g>
                      );
                    })}

                    <line x1="42" y1="195" x2="370" y2="195" stroke="#334155" strokeWidth="2" />
                    <line x1="42" y1="195" x2="42" y2="25" stroke="#334155" strokeWidth="2" />

                    {(() => {
                      const pts = dataset.map((d, i) => {
                        const px = 80 + i * 85;
                        const py = 195 - (d.value / 60) * 150;
                        return { px, py, ...d };
                      });
                      const polyStr = pts.map(p => `${p.px},${p.py}`).join(' ');

                      return (
                        <g>
                          <polyline points={polyStr} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                          {pts.map((p, idx) => (
                            <g key={`pt-${idx}`}>
                              <circle cx={p.px} cy={p.py} r="5.5" fill={p.color} stroke="#ffffff" strokeWidth="2" />
                              <text x={p.px} y={p.py - 9} fontSize="11" fontWeight="bold" fill="#0f172a" textAnchor="middle">
                                {p.value}
                              </text>
                              <text x={p.px} y="215" fontSize="10.5" fontWeight="bold" fill="#475569" textAnchor="middle">
                                {p.label}
                              </text>
                            </g>
                          ))}
                        </g>
                      );
                    })()}
                  </svg>
                </div>
              )}

              {/* 2. Οριζοντιο Ραβδογραμμα (Horizontal Bar Chart) */}
              {chartType === 'hbar' && (
                <div className="w-full max-w-[460px] aspect-[4/3] sm:aspect-[16/10] bg-white rounded-2xl border border-slate-200 p-2 sm:p-4 shadow-sm flex items-center justify-center">
                  <svg viewBox="0 0 380 240" className="w-full h-auto max-h-[260px] overflow-visible">
                    {[0, 15, 30, 45, 60].map((tick) => {
                      const x = 75 + (tick / 60) * 260;
                      return (
                        <g key={`h-tick-${tick}`}>
                          <line x1={x} y1="25" x2={x} y2="195" stroke="#f1f5f9" strokeWidth="1.5" />
                          <text x={x} y="210" fontSize="10" fontWeight="bold" fill="#64748b" textAnchor="middle">
                            {tick}
                          </text>
                        </g>
                      );
                    })}

                    <line x1="75" y1="195" x2="350" y2="195" stroke="#334155" strokeWidth="2" />
                    <line x1="75" y1="195" x2="75" y2="25" stroke="#334155" strokeWidth="2" />

                    {dataset.map((d, i) => {
                      const bh = 24;
                      const by = 38 + i * 38;
                      const bw = (d.value / 60) * 260;

                      return (
                        <g key={`hbar-${i}`}>
                          <text x="68" y={by + 16} fontSize="10.5" fontWeight="bold" fill="#334155" textAnchor="end">
                            {d.label}
                          </text>
                          <rect x="75" y={by} width={Math.max(bw, 3)} height={bh} fill={d.color} rx="4" />
                          <text x={75 + bw + 6} y={by + 17} fontSize="10.5" fontWeight="bold" fill="#0f172a">
                            {d.value}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              )}

              {/* 3. Κυκλικο Διαγραμμα (Pie Chart) */}
              {chartType === 'pie' && (
                <div className="w-full max-w-[460px] bg-white rounded-2xl border border-slate-200 p-3 sm:p-5 shadow-sm flex flex-col items-center justify-center gap-3">
                  
                  <div className="w-full max-w-[190px] sm:max-w-[210px] aspect-square flex items-center justify-center">
                    <svg viewBox="0 0 220 220" className="w-full h-full overflow-visible">
                      {(() => {
                        let cumulativeAngle = 0;
                        return dataset.map((d, i) => {
                          const startAngle = cumulativeAngle;
                          const sliceAngle = d.angle;
                          cumulativeAngle += sliceAngle;

                          if (sliceAngle <= 0) return null;

                          const x1 = 110 + 85 * Math.cos((Math.PI * (startAngle - 90)) / 180);
                          const y1 = 110 + 85 * Math.sin((Math.PI * (startAngle - 90)) / 180);
                          const x2 = 110 + 85 * Math.cos((Math.PI * (startAngle + sliceAngle - 90)) / 180);
                          const y2 = 110 + 85 * Math.sin((Math.PI * (startAngle + sliceAngle - 90)) / 180);
                          const largeArc = sliceAngle > 180 ? 1 : 0;

                          const pathData = `M 110 110 L ${x1} ${y1} A 85 85 0 ${largeArc} 1 ${x2} ${y2} Z`;

                          return (
                            <path
                              key={`slice-${i}`}
                              d={pathData}
                              fill={d.color}
                              stroke="#ffffff"
                              strokeWidth="2"
                            />
                          );
                        });
                      })()}
                    </svg>
                  </div>

                  {/* Υπομνημα Κυκλικου */}
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2 w-full text-[11px] sm:text-xs font-mono pt-1">
                    {dataset.map((d, i) => {
                      const pct = total > 0 ? ((d.value / total) * 100).toFixed(0) : 0;
                      return (
                        <div
                          key={`pie-leg-${i}`}
                          className="flex items-center justify-between gap-1 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-200"
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }}></span>
                            <span className="font-sans font-bold text-slate-700 truncate">{d.label}</span>
                          </div>
                          <span className="font-bold text-slate-900 shrink-0">
                            {pct}% ({formatNum(d.angle, locale, 0)}°)
                          </span>
                        </div>
                      );
                    })}
                  </div>

                </div>
              )}

              <span className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-2.5 text-center leading-normal">
                {t.chartTakeaway}
              </span>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ ΕΠΙΚΕΝΤΡΗΣ ΓΩΝΙΑΣ */}
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
            
            {/* Ρυθμισεις Ποσοστου */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>{t.pctInputLabel}</span>
                  <span className="font-mono text-base sm:text-lg text-amber-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 font-black">
                    {percentInput} %
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Decrease percentage"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPercentInput((prev) => Math.max(1, prev - 1)); }}
                    disabled={percentInput <= 1}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={100}
                    step={1}
                    value={percentInput}
                    onChange={(e) => setPercentInput(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    aria-label="Increase percentage"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPercentInput((prev) => Math.min(100, prev + 1)); }}
                    disabled={percentInput >= 100}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Γρηγορες Επιλογες */}
              <div className="grid grid-cols-4 gap-2">
                {[10, 25, 50, 75].map((presetPct) => (
                  <button
                    key={`pre-${presetPct}`}
                    type="button"
                    onClick={() => setPercentInput(presetPct)}
                    className="bg-white border border-slate-200 hover:bg-slate-100 py-2 rounded-xl font-bold text-xs sm:text-sm text-slate-700 shadow-sm transition active:scale-95 text-center touch-manipulation"
                  >
                    {presetPct} %
                  </button>
                ))}
              </div>
            </div>

            {/* Δυναμικος Κυκλος με Ανοιγμα Επικεντρης Γωνιας */}
            <div className="lg:col-span-3 bg-slate-50 p-4 rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
                {toCleanUppercase(t.circleAngleLabel)}
              </span>
              <div className="w-full max-w-[180px] aspect-square bg-white rounded-2xl border border-slate-200 p-2 shadow-inner flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
                  <circle cx="100" cy="100" r="75" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 3" />
                  
                  <path
                    d={angleSectorData.path}
                    fill="#f59e0b"
                    fillOpacity="0.28"
                    stroke="#d97706"
                    strokeWidth="2.5"
                  />

                  <line x1="100" y1="100" x2="100" y2="25" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" />

                  {degreesCalculated < 360 && (
                    <line
                      x1="100"
                      y1="100"
                      x2={angleSectorData.endX}
                      y2={angleSectorData.endY}
                      stroke="#b45309"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  )}

                  {degreesCalculated > 0 && degreesCalculated < 360 && angleSectorData.arcPath && (
                    <path
                      d={angleSectorData.arcPath}
                      fill="none"
                      stroke="#d97706"
                      strokeWidth="2"
                    />
                  )}

                  <circle cx="100" cy="100" r="4.5" fill="#78350f" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="100" y="116" fontSize="10" fontWeight="bold" fill="#78350f" textAnchor="middle">
                    {t.circleCenterO}
                  </text>
                </svg>
              </div>
              <div className="text-[11px] font-mono font-bold text-amber-800 text-center">
                {t.centralLabel} <strong className="text-sm">{formatNum(degreesCalculated, locale, 1)}°</strong> ({percentInput}%)
              </div>
            </div>

            {/* Αποτελεσμα & Τυπος */}
            <div className="lg:col-span-4 bg-amber-50/60 p-5 sm:p-6 rounded-3xl border border-amber-200 space-y-3 text-center">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                {toCleanUppercase(t.boxAngleHeading)}
              </span>
              <div className="text-3xl sm:text-5xl font-black text-amber-700 font-mono">
                {formatNum(degreesCalculated, locale, 1)}°
              </div>
              <div className="p-2.5 sm:p-3 bg-white rounded-2xl border border-amber-100 text-xs sm:text-sm text-slate-700 font-mono flex items-center justify-center flex-wrap gap-1">
                <span>{t.proportionLabel} ({percentInput} · 360°) : 100 ＝</span>
                <strong className="text-amber-800">{formatNum(degreesCalculated, locale, 1)}°</strong>
              </div>
              <p className="text-xs text-slate-500 font-sans">
                {t.boxExplanation(percentInput, formatNum(degreesCalculated, locale, 1))}
              </p>
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

              {/* ΣΧΗΜΑ 1: SVG Γραφημα Γραμμης Responsive */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1">
                  {toCleanUppercase(t.prob1DiagramTitle)}
                </span>
                <div className="w-full max-w-[340px] mx-auto aspect-[16/9] bg-white rounded-xl border border-slate-200 p-2 shadow-inner">
                  <svg viewBox="0 0 320 150" className="w-full h-full overflow-visible">
                    {[0, 10, 20].map((deg) => {
                      const y = 120 - (deg / 20) * 95;
                      return (
                        <g key={`deg-${deg}`}>
                          <line x1="35" y1={y} x2="310" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                          <text x="28" y={y + 3.5} fontSize="9" fontWeight="bold" fill="#64748b" textAnchor="end">{deg}°</text>
                        </g>
                      );
                    })}
                    <line x1="35" y1="120" x2="315" y2="120" stroke="#334155" strokeWidth="1.5" />
                    <line x1="35" y1="120" x2="35" y2="15" stroke="#334155" strokeWidth="1.5" />

                    <polyline points="60,63 130,25 200,34 270,53" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
                    {[
                      { x: 60, y: 63, label: '08:00', val: '12°' },
                      { x: 130, y: 25, label: '12:00', val: '20°' },
                      { x: 200, y: 34, label: '16:00', val: '18°' },
                      { x: 270, y: 53, label: '20:00', val: '14°' }
                    ].map((pt, idx) => (
                      <g key={`pt-temp-${idx}`}>
                        <circle cx={pt.x} cy={pt.y} r="4" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" />
                        <text x={pt.x} y={pt.y - 6} fontSize="9.5" fontWeight="bold" fill="#0f172a" textAnchor="middle">{pt.val}</text>
                        <text x={pt.x} y="134" fontSize="8.5" fontWeight="bold" fill="#475569" textAnchor="middle">{pt.label}</text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">{t.prob1QA}</span>
                  <div>• <strong>{t.prob1Max}</strong></div>
                  <div>• <strong>{t.prob1Range}</strong></div>
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

              {/* ΣΧΗΜΑ 2: SVG Κυκλικο Διαγραμμα Responsive */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1">
                  {toCleanUppercase(t.prob2DiagramTitle)}
                </span>
                <div className="w-full max-w-[280px] mx-auto aspect-square bg-white rounded-xl border border-slate-200 p-2 shadow-inner flex flex-col items-center justify-center">
                  <svg viewBox="0 0 160 160" className="w-32 h-32 sm:w-36 sm:h-36">
                    <path d="M 80 80 L 80 10 A 70 70 0 0 1 80 150 Z" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" />
                    <path d="M 80 80 L 80 150 A 70 70 0 0 1 10 80 Z" fill="#10b981" stroke="#fff" strokeWidth="1.5" />
                    <path d="M 80 80 L 10 80 A 70 70 0 0 1 80 10 Z" fill="#f59e0b" stroke="#fff" strokeWidth="1.5" />
                  </svg>
                  <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 pt-2 text-[10px] font-mono">
                    <span className="text-blue-700 font-bold">{t.prob2LegendSport}</span>
                    <span className="text-emerald-700 font-bold">{t.prob2LegendReading}</span>
                    <span className="text-amber-700 font-bold">{t.prob2LegendMusic}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">{t.prob2CalcTitle}</span>
                  <div>• {t.prob2CalcSport}</div>
                  <div>• {t.prob2CalcReading}</div>
                  <div>• {t.prob2CalcMusic}</div>
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
            href="/st-dimotikou/57-alla-grafimata-ask"
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