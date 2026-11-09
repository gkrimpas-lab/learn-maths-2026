// pages/st-dimotikou/61-xronos.js
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
    metaTitle: "Μονάδες Μέτρησης Χρόνου & Μετατροπές - ΣΤ' Δημοτικού | LearnMaths.gr",
    metaDesc: "Μαθαίνουμε για τη βασική μονάδα χρόνου (δευτερόλεπτο), λεπτό, ώρα, ημέρα, έτος, αιώνα, χιλιετία, μετατροπές μονάδων και την Ώρα Γκρίνουιτς (UTC).",
    gradeBadge: "ΚΕΦΑΛΑΙΟ 61 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Μονάδες Μέτρησης Χρόνου",
    heroDesc: "Ανακαλύπτουμε πώς μετράμε τον χρόνο: από το βασικό δευτερόλεπτο (s), τα λεπτά και τις ώρες, μέχρι τις ημέρες, τους αιώνες και τις χιλιετίες. Μαθαίνουμε πώς γίνονται οι μετατροπές με το 60, πώς υπολογίζουμε χρονικές διάρκειες και πώς λειτουργεί η παγκόσμια Ώρα Γκρίνουιτς (GMT / UTC).",
    heroSubbadge: "Θεωρία, Εξηκονταδικό Σύστημα, Αιώνες & Παγκόσμια Ώρα",
    heroBtn: "Δοκίμασε τις Ασκήσεις",
    btnExercises: "Ασκήσεις",
    backLinkText: "ΣΤ' Δημοτικού",

    stepsHeading: "Οι Μονάδες Χρόνου σε 4 Βήματα",
    stepsSubheading: "Από τα δευτερόλεπτα και τις ώρες μέχρι τις χιλιετίες και τις παγκόσμιες ζώνες ώρας.",

    step1Badge: "ΒΗΜΑ 1",
    step1Tag: "Εξηκονταδικό Σύστημα",
    step1Title: "Δευτερόλεπτο, Λεπτό & Ώρα",
    step1Desc: "Βασική μονάδα μέτρησης του χρόνου στο Διεθνές Σύστημα είναι το δευτερόλεπτο (s). Σε αντίθεση με το δεκαδικό σύστημα, ο χρόνος αλλάζει μονάδες ανά 60:",
    step1Eq1: "1 λεπτό (min) ＝ 60 δευτερόλεπτα (s)",
    step1Eq2: "1 ώρα (h) ＝ 60 λεπτά (min)",
    step1Eq3: "1 ώρα (h) ＝ 60 · 60 ＝ 3.600 s",
    step1Tip: "Προσοχή: 1,5 ώρα ΔΕΝ είναι 1 ώρα και 50 λεπτά! Είναι 1 ώρα και μισή, δηλαδή 1 h και 30 min.",

    step2Badge: "ΒΗΜΑ 2",
    step2Tag: "Ημερολογιακός Χρόνος",
    step2Title: "Ημέρα, Μήνας & Έτος",
    step2Desc: "Οι μεγαλύτερες μονάδες μέτρησης βασίζονται στις κινήσεις της Γης γύρω από τον εαυτό της και γύρω από τον Ήλιο:",
    step2Eq1: "1 ημέρα (24ωρο) ＝ 24 ώρες (h)",
    step2Eq2: "1 εβδομάδα ＝ 7 ημέρες",
    step2Eq3: "1 κοινό έτος ＝ 365 ημέρες (12 μήνες)",
    step2Eq4: "1 δίσεκτο έτος ＝ 366 ημέρες (κάθε 4 έτη)",
    step2Tip: "Στο δίσεκτο έτος ο Φεβρουάριος έχει 29 ημέρες αντί για 28, για να καλύψει τις επιπλέον ~6 ώρες της περιφοράς της Γης.",

    step3Badge: "ΒΗΜΑ 3",
    step3Tag: "Μεγάλες Περίοδοι",
    step3Title: "Δεκαετία, Αιώνας & Χιλιετία",
    step3Desc: "Για ιστορικά γεγονότα και μακροχρόνιες περιόδους ομαδοποιούμε τα έτη:",
    step3Eq1: "1 δεκαετία ＝ 10 έτη",
    step3Eq2: "1 αιώνας ＝ 100 έτη",
    step3Eq3: "1 χιλιετία ＝ 1.000 έτη (10 αιώνες)",
    step3Rule: "Κανόνας Αιώνα: Για το έτος 1821, παίρνουμε το 18 και προσθέτουμε 1 ➔ 19ος αιώνας! (Εξαίρεση: τα έτη που λήγουν σε 00, π.χ. το 1900 ήταν ο 19ος αιώνας).",
    step3Tip: "Σήμερα διανύουμε τον 21ο αιώνα (έτη 2001 έως 2100) και την 3η χιλιετία!",

    step4Badge: "ΒΗΜΑ 4",
    step4Tag: "Παγκόσμιος Χρόνος",
    step4Title: "Ώρα Γκρίνουιτς (GMT / UTC)",
    step4Desc: "Επειδή η Γη περιστρέφεται, δεν είναι η ίδια ώρα σε όλο τον πλανήτη. Η Γη χωρίζεται σε 24 ωριαίες ατράκτους (ζώνες ώρας):",
    step4Pt1Title: "Αρχικός Μεσημβρινός:",
    step4Pt1Text: "Περνά από το αστεροσκοπείο του Γκρίνουιτς (Greenwich) κοντά στο Λονδίνο (UTC 0).",
    step4Pt2Title: "Προς τα Ανατολικά:",
    step4Pt2Text: "Η ώρα προηγείται (προσθέτουμε ώρες, π.χ. Ελλάδα ＝ UTC＋2).",
    step4Pt3Title: "Προς τα Δυτικά:",
    step4Pt3Text: "Η ώρα ακολουθεί (αφαιρούμε ώρες, π.χ. Νέα Υόρκη ＝ UTC－5).",
    step4Tip: "Όταν στο Λονδίνο είναι 12:00 το μεσημέρι, στην Αθήνα είναι 14:00 (2 ώρες μπροστά)!",

    lab1Badge: "ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1",
    lab1Title: "Δυναμικός Μετατροπέας Χρόνου (Ώρες, Λεπτά, Δευτερόλεπτα)",
    lab1Desc: "Επίλεξε ώρες και λεπτά για να δεις τη μετατροπή σε συνολικά λεπτά, δευτερόλεπτα και σε δεκαδική / κλασματική μορφή ώρας.",
    hoursLabel: "ΩΡΕΣ (h):",
    minsLabel: "ΛΕΠΤΑ (min):",
    analysisTitle: "ΑΝΑΛΥΣΗ ΚΑΙ ΜΕΤΑΤΡΟΠΗ ΣΕ ΟΛΕΣ ΤΙΣ ΜΟΝΑΔΕΣ",
    totalMinsLabel: "Συνολικά λεπτά:",
    totalSecsLabel: "Συνολικά δευτερόλεπτα:",
    decimalHourLabel: "Δεκαδική μορφή ώρας:",
    fractionHourLabel: "Κλασματική μορφή:",
    andWord: "και",
    calcNoteTitle: "Μαθηματικός Υπολογισμός:",
    calcNoteDetail: "λεπτά",
    calcNoteSecs: "δευτερόλεπτα",

    lab2Badge: "ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΠΑΓΚΟΣΜΙΑ ΩΡΑ",
    lab2Title: "Ώρα Γκρίνουιτς (UTC) & Ζώνες Ώρας στον Πλανήτη",
    lab2Desc: "Επίλεξε την ώρα στο Greenwich του Λονδίνου (UTC 0) και δες αυτόματα τι ώρα είναι ταυτόχρονα σε άλλες πόλεις του πλανήτη:",
    gmtPickerLabel: "ΩΡΑ ΣΤΟ GREENWICH (ΛΟΝΔΙΝΟ - UTC 0):",
    localTimeLabel: "Τοπική Ώρα:",
    conclusionTitle: "Συμπέρασμα:",
    conclusionText: "Η Ελλάδα βρίσκεται στην ωριαία άτρακτο UTC＋2. Όταν στο Λονδίνο είναι",
    conclusionText2: ", στην Ελλάδα είναι πάντα 2 ώρες αργότερα (",

    problemsHeading: "Λυμένα Προβλήματα με Μονάδες Χρόνου",
    problemsSubheading: "Αναλυτικοί υπολογισμοί διάρκειας ταξιδιού και ιστορικών αιώνων.",

    prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΔΙΑΡΚΕΙΑ ΤΑΞΙΔΙΟΥ",
    prob1Tag: "Δρομολόγιο Πλοίου",
    prob1Title: "Υπολογισμός Διάρκειας με Δανεισμό 60 Λεπτών",
    prob1Desc: "Ένα πλοίο αναχώρησε από το λιμάνι του Πειραιά στις 08:45 το πρωί και έφτασε στη Νάξο στις 14:20 το μεσημέρι. Πόση ώρα διήρκεσε το ταξίδι;",
    prob1TableTitle: "ΔΕΔΟΜΕΝΑ ΔΡΟΜΟΛΟΓΙΟΥ",
    departureLabel: "Ώρα Αναχώρησης",
    arrivalLabel: "Ώρα Άφιξης",
    stepsTitle: "Βήματα Επίλυσης:",
    stepA: "Αφαίρεση:",
    stepB: "Δανεισμός 1 ώρας (60 λεπτά):",
    stepBDetail: "Τα 14 h 20 min γίνονται 13 h 80 min (αφού 20 ＋ 60 ＝ 80).",
    stepC: "Εκτέλεση αφαίρεσης:",
    stepCDetail: "(13 h 80 min) － (08 h 45 min) ＝ 5 h 35 min.",
    prob1Secret: "Μυστικό: Όταν τα λεπτά της άφιξης είναι λιγότερα, «δανειζόμαστε» 1 ώρα και προσθέτουμε 60 λεπτά (όχι 100!).",

    prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΑΙΩΝΕΣ & ΧΡΟΝΟΛΟΓΙΕΣ",
    prob2Tag: "Ιστορικά Γεγονότα",
    prob2Title: "Σε Ποιον Αιώνα Ανήκει Κάθε Έτος;",
    prob2Desc: "Να βρεθεί σε ποιον αιώνα συνέβησαν τα παρακάτω ιστορικά ορόσημα: (α) Η έναρξη της Ελληνικής Επανάστασης το 1821, (β) Η Μάχη του Μαραθώνα το 490 π.Χ., και (γ) Το έτος 2000.",
    prob2TableTitle: "ΣΥΣΧΕΤΙΣΗ ΕΤΟΥΣ ΚΑΙ ΑΙΩΝΑ",
    year1: "Έτος 1821",
    cent1: "19ος αιώνας",
    year2: "Έτος 490 π.Χ.",
    cent2: "5ος αι. π.Χ.",
    year3: "Έτος 2000",
    cent3: "20ός αιώνας",
    ruleTitle: "Κανόνας Υπολογισμού:",
    rule1Label: "1821:",
    rule1Text: "Κόβουμε τα 2 τελευταία ψηφία (18) και προσθέτουμε 1 ➔ 18 ＋ 1 ＝ 19ος αιώνας.",
    rule2Label: "490 π.Χ.:",
    rule2Text: "4 ＋ 1 ＝ 5ος αιώνας π.Χ.",
    rule3Label: "2000:",
    rule3Text: "Λήγει σε 00, άρα είναι το τελευταίο έτος του 20ού αιώνα (ο 21ος άρχισε το 2001).",
    prob2Secret: "Κάθε αιώνας ξεκινά από το έτος 01 και τελειώνει στο έτος 00 (π.χ. 20ός αιώνας: 1901 έως 2000).",

    ctaHeading: "Ώρα για Εξάσκηση στις Μονάδες Χρόνου!",
    ctaDesc: "Δοκίμασε τις δυνάμεις σου σε 10 διαδραστικές ασκήσεις με μετατροπές ωρών/λεπτών, υπολογισμό διάρκειας, αιώνες και ζώνες ώρας για τη ΣΤ' Δημοτικού.",
    ctaBtn: "Έναρξη Ασκήσεων",

    cities: [
      { city: 'Λονδίνο (Greenwich)', offset: 0, flag: '🇬🇧', desc: 'Βάση UTC / GMT 0' },
      { city: 'Αθήνα', offset: 2, flag: '🇬🇷', desc: 'UTC＋2 (Χειμερινή ώρα Ελλάδας)' },
      { city: 'Νέα Υόρκη', offset: -5, flag: '🇺🇸', desc: 'UTC－5 (5 ώρες πίσω)' },
      { city: 'Τόκιο', offset: 9, flag: '🇯🇵', desc: 'UTC＋9 (9 ώρες μπροστά)' },
      { city: 'Σίδνεϊ', offset: 11, flag: '🇦🇺', desc: 'UTC＋11 (11 ώρες μπροστά)' }
    ]
  },
  en: {
    metaTitle: "Units of Time Measurement & Conversions - 6th Grade | LearnMaths.gr",
    metaDesc: "Learn about the base unit of time (second), minute, hour, day, year, century, millennium, unit conversions, and Greenwich Mean Time (UTC).",
    gradeBadge: "CHAPTER 61 • 6TH GRADE",
    heroTitle: "Units of Time Measurement",
    heroDesc: "Discover how we measure time: from the fundamental second (s), minutes, and hours, to days, centuries, and millennia. Master conversions using 60, calculate elapsed time, and explore how Greenwich Mean Time (GMT / UTC) works worldwide.",
    heroSubbadge: "Theory, Sexagesimal System, Centuries & World Time",
    heroBtn: "Try the Exercises",
    btnExercises: "Exercises",
    backLinkText: "6th Grade",

    stepsHeading: "Units of Time in 4 Steps",
    stepsSubheading: "From seconds and hours to millennia and world time zones.",

    step1Badge: "STEP 1",
    step1Tag: "Sexagesimal System",
    step1Title: "Second, Minute & Hour",
    step1Desc: "The base unit of time in the International System (SI) is the second (s). Unlike the decimal system, time shifts units by 60:",
    step1Eq1: "1 minute (min) ＝ 60 seconds (s)",
    step1Eq2: "1 hour (h) ＝ 60 minutes (min)",
    step1Eq3: "1 hour (h) ＝ 60 · 60 ＝ 3,600 s",
    step1Tip: "Caution: 1.5 hours is NOT 1 hour and 50 minutes! It is 1 and a half hours, meaning 1 h and 30 min.",

    step2Badge: "STEP 2",
    step2Tag: "Calendar Time",
    step2Title: "Day, Month & Year",
    step2Desc: "Larger units of time are based on the astronomical movements of the Earth rotating on its axis and orbiting the Sun:",
    step2Eq1: "1 day (24-hour day) ＝ 24 hours (h)",
    step2Eq2: "1 week ＝ 7 days",
    step2Eq3: "1 common year ＝ 365 days (12 months)",
    step2Eq4: "1 leap year ＝ 366 days (every 4 years)",
    step2Tip: "In a leap year, February has 29 days instead of 28 to account for the extra ~6 hours of the Earth's orbit.",

    step3Badge: "STEP 3",
    step3Tag: "Long Periods",
    step3Title: "Decade, Century & Millennium",
    step3Desc: "For historical milestones and long eras, we group years together:",
    step3Eq1: "1 decade ＝ 10 years",
    step3Eq2: "1 century ＝ 100 years",
    step3Eq3: "1 millennium ＝ 1,000 years (10 centuries)",
    step3Rule: "Century Rule: For the year 1821, take 18 and add 1 ➔ 19th century! (Exception: years ending in 00, e.g., 1900 belonged to the 19th century).",
    step3Tip: "Today we are living in the 21st century (years 2001 to 2100) and the 3rd millennium!",

    step4Badge: "STEP 4",
    step4Tag: "World Time",
    step4Title: "Greenwich Mean Time (GMT / UTC)",
    step4Desc: "Because the Earth rotates, the time is not identical everywhere. Earth is divided into 24 standard time zones:",
    step4Pt1Title: "Prime Meridian:",
    step4Pt1Text: "Passes through the Royal Observatory in Greenwich near London (UTC 0).",
    step4Pt2Title: "Heading East:",
    step4Pt2Text: "Time moves ahead (hours are added, e.g., Greece ＝ UTC＋2).",
    step4Pt3Title: "Heading West:",
    step4Pt3Text: "Time lags behind (hours are subtracted, e.g., New York ＝ UTC－5).",
    step4Tip: "When it is 12:00 noon in London, it is 14:00 (2:00 PM) in Athens (2 hours ahead)!",

    lab1Badge: "INTERACTIVE LAB 1",
    lab1Title: "Dynamic Time Converter (Hours, Minutes, Seconds)",
    lab1Desc: "Select hours and minutes to see instant conversions to total minutes, total seconds, and decimal / fractional hour representations.",
    hoursLabel: "HOURS (h):",
    minsLabel: "MINUTES (min):",
    analysisTitle: "BREAKDOWN AND CONVERSION TO ALL UNITS",
    totalMinsLabel: "Total minutes:",
    totalSecsLabel: "Total seconds:",
    decimalHourLabel: "Decimal hour form:",
    fractionHourLabel: "Fractional form:",
    andWord: "and",
    calcNoteTitle: "Mathematical Calculation:",
    calcNoteDetail: "minutes",
    calcNoteSecs: "seconds",

    lab2Badge: "INTERACTIVE LAB 2: WORLD TIME",
    lab2Title: "Greenwich Mean Time (UTC) & Global Time Zones",
    lab2Desc: "Set the base time at Greenwich, London (UTC 0) to instantly observe corresponding local times across major world cities:",
    gmtPickerLabel: "TIME AT GREENWICH (LONDON - UTC 0):",
    localTimeLabel: "Local Time:",
    conclusionTitle: "Takeaway:",
    conclusionText: "Greece operates within the UTC＋2 time zone. When London is at",
    conclusionText2: ", Greece is always 2 hours ahead (",

    problemsHeading: "Worked Real-Life Time Problems",
    problemsSubheading: "Detailed step-by-step elapsed travel time and historical century determinations.",

    prob1Badge: "PROBLEM 1: TRAVEL DURATION",
    prob1Tag: "Ferry Route",
    prob1Title: "Elapsed Time Calculation with 60-Minute Borrowing",
    prob1Desc: "A ferry departed from the port of Piraeus at 08:45 AM and docked in Naxos at 14:20 (2:20 PM). How long did the voyage take?",
    prob1TableTitle: "SCHEDULE DATA",
    departureLabel: "Departure Time",
    arrivalLabel: "Arrival Time",
    stepsTitle: "Solution Steps:",
    stepA: "Subtraction:",
    stepB: "Borrowing 1 hour (60 minutes):",
    stepBDetail: "14 h 20 min transforms into 13 h 80 min (since 20 ＋ 60 ＝ 80).",
    stepC: "Executing subtraction:",
    stepCDetail: "(13 h 80 min) － (08 h 45 min) ＝ 5 h 35 min.",
    prob1Secret: "Key Insight: When arrival minutes are fewer than departure minutes, borrow 1 hour and add 60 minutes (not 100!).",

    prob2Badge: "PROBLEM 2: CENTURIES & HISTORICAL DATES",
    prob2Tag: "Historical Milestones",
    prob2Title: "Determining Which Century a Year Belongs To",
    prob2Desc: "Determine which century each historical milestone belongs to: (a) The outbreak of the Greek Revolution in 1821, (b) The Battle of Marathon in 490 BC, and (c) The year 2000.",
    prob2TableTitle: "YEAR AND CENTURY CORRELATION",
    year1: "Year 1821",
    cent1: "19th century",
    year2: "Year 490 BC",
    cent2: "5th cent. BC",
    year3: "Year 2000",
    cent3: "20th century",
    ruleTitle: "Calculation Rule:",
    rule1Label: "1821:",
    rule1Text: "Remove the last 2 digits (18) and add 1 ➔ 18 ＋ 1 ＝ 19th century.",
    rule2Label: "490 BC:",
    rule2Text: "4 ＋ 1 ＝ 5th century BC.",
    rule3Label: "2000:",
    rule3Text: "Ends in 00, making it the final year of the 20th century (the 21st started in 2001).",
    prob2Secret: "Every century starts at year 01 and concludes at year 00 (e.g., 20th century: 1901 through 2000).",

    ctaHeading: "Ready to Practice Units of Time?",
    ctaDesc: "Test your skills across 10 interactive questions covering hours/minutes conversions, elapsed travel time, centuries, and global time zones.",
    ctaBtn: "Start Exercises",

    cities: [
      { city: 'London (Greenwich)', offset: 0, flag: '🇬🇧', desc: 'Base UTC / GMT 0' },
      { city: 'Athens', offset: 2, flag: '🇬🇷', desc: 'UTC＋2 (Standard Time Greece)' },
      { city: 'New York', offset: -5, flag: '🇺🇸', desc: 'UTC－5 (5 hours behind)' },
      { city: 'Tokyo', offset: 9, flag: '🇯🇵', desc: 'UTC＋9 (9 hours ahead)' },
      { city: 'Sydney', offset: 11, flag: '🇦🇺', desc: 'UTC＋11 (11 hours ahead)' }
    ]
  }
};

export default function XronosTheoryPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  // Εργαστήριο 1: Μετατροπέας Χρόνου (Ώρες -> Λεπτά -> Δευτερόλεπτα)
  const [hoursInput, setHoursInput] = useState(2);
  const [minutesInput, setMinutesInput] = useState(30);

  const timeConversions = useMemo(() => {
    const totalMinutes = hoursInput * 60 + minutesInput;
    const totalSeconds = totalMinutes * 60;
    const decimalHours = hoursInput + minutesInput / 60;
    return {
      totalMinutes,
      totalSeconds,
      decimalHours
    };
  }, [hoursInput, minutesInput]);

  // Εργαστήριο 2: Παγκόσμιος Χρόνος Greenwich (Βάση ώρα 12:00 στο Λονδίνο)
  const [baseGmtHour, setBaseGmtHour] = useState(12);

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
          href="/st-dimotikou/61-xronos-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 {t.btnExercises}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:lg:px-12 2xl:px-16 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-28 sm:pb-36 overflow-x-hidden">

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
              href="/st-dimotikou/61-xronos-ask"
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

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 font-mono">
                  <div className="text-slate-900 font-bold">{t.step1Eq1}</div>
                  <div className="text-slate-900 font-bold">{t.step1Eq2}</div>
                  <div className="text-blue-700 font-black">{t.step1Eq3}</div>
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

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 font-mono">
                  <div>{t.step2Eq1}</div>
                  <div>{t.step2Eq2}</div>
                  <div>{t.step2Eq3}</div>
                  <div>{t.step2Eq4}</div>
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

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div>{t.step3Eq1}</div>
                  <div>{t.step3Eq2}</div>
                  <div>{t.step3Eq3}</div>
                  <div className="text-[11px] text-indigo-900 font-sans pt-1 leading-normal">
                    {t.step3Rule}
                  </div>
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

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 text-slate-700">
                  <div><strong>{t.step4Pt1Title}</strong> {t.step4Pt1Text}</div>
                  <div><strong>{t.step4Pt2Title}</strong> {t.step4Pt2Text}</div>
                  <div><strong>{t.step4Pt3Title}</strong> {t.step4Pt3Text}</div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🌍 {t.step4Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΜΕΤΑΤΡΟΠΕΑΣ ΧΡΟΝΟΥ */}
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
            
            {/* Χειριστήρια Ρύθμισης (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Ρύθμιση Ωρών */}
              <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-blue-900 tracking-wider">
                    {t.hoursLabel}
                  </span>
                  <span className="font-mono font-black text-base sm:text-xl text-blue-700 bg-white px-3 py-1 rounded-xl border border-blue-200 shadow-sm">
                    {hoursInput} h
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση ωρών"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setHoursInput((prev) => Math.max(0, prev - 1)); }}
                    disabled={hoursInput <= 0}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={12}
                    step={1}
                    value={hoursInput}
                    onChange={(e) => setHoursInput(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer touch-manipulation"
                  />
                  <button
                    type="button"
                    aria-label="Αύξηση ωρών"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setHoursInput((prev) => Math.min(12, prev + 1)); }}
                    disabled={hoursInput >= 12}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Ρύθμιση Λεπτών */}
              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-amber-900 tracking-wider">
                    {t.minsLabel}
                  </span>
                  <span className="font-mono font-black text-base sm:text-xl text-amber-700 bg-white px-3 py-1 rounded-xl border border-amber-200 shadow-sm">
                    {minutesInput} min
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση λεπτών"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMinutesInput((prev) => Math.max(0, prev - 5)); }}
                    disabled={minutesInput <= 0}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={55}
                    step={5}
                    value={minutesInput}
                    onChange={(e) => setMinutesInput(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer touch-manipulation"
                  />
                  <button
                    type="button"
                    aria-label="Αύξηση λεπτών"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMinutesInput((prev) => Math.min(55, prev + 5)); }}
                    disabled={minutesInput >= 55}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

            </div>

            {/* Πίνακας Ισοδύναμων Μορφών Χρόνου (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-3">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block text-center">
                {t.analysisTitle}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-mono">
                <div className="p-3.5 bg-white rounded-2xl border border-blue-200 flex items-center justify-between">
                  <span className="text-slate-600 font-sans">{t.totalMinsLabel}</span>
                  <span className="font-black text-blue-700">{formatNumberLocale(timeConversions.totalMinutes, 0)} min</span>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-emerald-200 flex items-center justify-between">
                  <span className="text-slate-600 font-sans">{t.totalSecsLabel}</span>
                  <span className="font-black text-emerald-700">{formatNumberLocale(timeConversions.totalSeconds, 0)} s</span>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-purple-200 flex items-center justify-between">
                  <span className="text-slate-600 font-sans">{t.decimalHourLabel}</span>
                  <span className="font-black text-purple-700">{formatNumberLocale(timeConversions.decimalHours, 2)} h</span>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-amber-200 flex items-center justify-between">
                  <span className="text-slate-600 font-sans">{t.fractionHourLabel}</span>
                  <span className="font-black text-amber-700 inline-flex items-center">
                    {hoursInput > 0 ? `${hoursInput} ${t.andWord} ` : ''}
                    <Fraction num={minutesInput} den={60} /> h
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-slate-200 font-sans text-xs sm:text-sm text-slate-600 space-y-1 text-center">
                💡 <strong>{t.calcNoteTitle}</strong> ({hoursInput} · 60) ＋ {minutesInput} ＝ <strong>{formatNumberLocale(timeConversions.totalMinutes, 0)} {t.calcNoteDetail}</strong> ＝ {formatNumberLocale(timeConversions.totalMinutes, 0)} · 60 ＝ <strong>{formatNumberLocale(timeConversions.totalSeconds, 0)} {t.calcNoteSecs}</strong>.
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΠΑΓΚΟΣΜΙΟΣ ΧΡΟΝΟΣ & GREENWICH */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
              <span>🌍 {t.lab2Badge}</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              {t.lab2Title}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.lab2Desc}
            </p>
          </div>

          <div className="space-y-6">
            
            {/* Ρύθμιση Ώρας Greenwich */}
            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 max-w-xl mx-auto space-y-3 text-center">
              <span className="text-xs font-bold text-slate-700 block uppercase">
                {t.gmtPickerLabel}
              </span>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  aria-label="Μείωση ώρας Greenwich"
                  onClick={() => setBaseGmtHour((prev) => (prev === 0 ? 23 : prev - 1))}
                  className="w-10 h-10 bg-white hover:bg-slate-100 rounded-xl border border-slate-300 font-black text-lg text-slate-800 transition active:scale-95 shadow-sm touch-manipulation"
                >
                  －
                </button>
                <span className="font-mono font-black text-2xl sm:text-3xl text-indigo-700 bg-white px-5 py-1.5 rounded-2xl border border-indigo-200 shadow-sm">
                  {String(baseGmtHour).padStart(2, '0')}:00
                </span>
                <button
                  type="button"
                  aria-label="Αύξηση ώρας Greenwich"
                  onClick={() => setBaseGmtHour((prev) => (prev === 23 ? 0 : prev + 1))}
                  className="w-10 h-10 bg-white hover:bg-slate-100 rounded-xl border border-slate-300 font-black text-lg text-slate-800 transition active:scale-95 shadow-sm touch-manipulation"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Κάρτες Πόλεων */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              {t.cities.map((tz, idx) => {
                const calculatedHour = (baseGmtHour + tz.offset + 24) % 24;
                const isBase = tz.offset === 0;

                return (
                  <div
                    key={`tz-${idx}`}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                      isBase 
                        ? 'bg-blue-50 border-blue-300 shadow-md ring-2 ring-blue-300' 
                        : 'bg-white border-slate-200 shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="text-2xl mb-1">{tz.flag}</div>
                      <h4 className="font-black text-sm text-slate-900">{tz.city}</h4>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">{tz.desc}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">{t.localTimeLabel}</span>
                      <span className={`font-mono text-xl sm:text-2xl font-black ${isBase ? 'text-blue-700' : 'text-slate-800'}`}>
                        {String(calculatedHour).padStart(2, '0')}:00
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-center font-sans text-xs sm:text-sm text-sky-950">
              💡 <strong>{t.conclusionTitle}</strong> {t.conclusionText} {String(baseGmtHour).padStart(2, '0')}:00{t.conclusionText2}{String((baseGmtHour + 2) % 24).padStart(2, '0')}:00).
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
                <div className="grid grid-cols-2 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.departureLabel}</span> 08 h 45 min
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.arrivalLabel}</span> 14 h 20 min
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">{t.stepsTitle}</span>
                  <div><strong>{t.stepA}</strong> 14 h 20 min － 08 h 45 min.</div>
                  <div><strong>{t.stepB}</strong> {t.stepBDetail}</div>
                  <div><strong>{t.stepC}</strong> {t.stepCDetail}</div>
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
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  {t.prob2TableTitle}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.year1}</span> {t.cent1}
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.year2}</span> {t.cent2}
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.year3}</span> {t.cent3}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">{t.ruleTitle}</span>
                  <div><strong>{t.rule1Label}</strong> {t.rule1Text}</div>
                  <div><strong>{t.rule2Label}</strong> {t.rule2Text}</div>
                  <div><strong>{t.rule3Label}</strong> {t.rule3Text}</div>
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
            href="/st-dimotikou/61-xronos-ask"
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