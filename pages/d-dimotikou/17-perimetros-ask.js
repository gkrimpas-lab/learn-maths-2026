import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ----------------------------------------------------
// ΔΕΞΑΜΕΝΗ 30+ ΠΡΟΒΛΗΜΑΤΩΝ ΚΑΘΗΜΕΡΙΝΟΤΗΤΑΣ
// ----------------------------------------------------
const REAL_PROBLEMS_POOL = [
  // 1-10: Περιφράξεις & Κήποι / Αυλές (Ορθογώνια & Τετράγωνα)
  () => {
    const w = getRandomInt(10, 30), h = getRandomInt(5, 15), c = 2 * w + 2 * h;
    return { q: `Ο κύριος Νίκος περιφράζει έναν ορθογώνιο κήπο μήκους ${w} m και πλάτους ${h} m. Πόσα μέτρα συρματόπλεγμα θα χρειαστεί;`, correct: `${c} m`, wrongs: [`${w + h} m`, `${2 * w + h} m`, `${w * h} m`] };
  },
  () => {
    const s = getRandomInt(6, 20), c = 4 * s;
    return { q: `Μια τετράγωνη παιδική χαρά έχει πλευρά ${s} m. Πόσο μήκος έχει το προστατευτικό κιγκλίδωμα γύρω-γύρω;`, correct: `${c} m`, wrongs: [`${s * 2} m`, `${s * 3} m`, `${s * s} m`] };
  },
  () => {
    const w = getRandomInt(12, 25), h = getRandomInt(6, 12), c = 2 * w + 2 * h;
    return { q: `Η σχολική αυλή είναι ορθογώνια με μήκος ${w} m και πλάτος ${h} m. Τα παιδιά τρέχουν 1 γύρο γύρω από την αυλή. Πόσα μέτρα διανύουν;`, correct: `${c} m`, wrongs: [`${w + h} m`, `${2 * (w + h) + 5} m`, `${w * h} m`] };
  },
  () => {
    const s = getRandomInt(8, 18), c = 4 * s;
    return { q: `Ένα τετράγωνο οικόπεδο έχει πλευρά ${s} m. Πόσα μέτρα είναι ο τοίχος που το περιβάλλει;`, correct: `${c} m`, wrongs: [`${s * 2} m`, `${s * 3} m`, `${s * 10} m`] };
  },
  () => {
    const w = getRandomInt(15, 35), h = getRandomInt(10, 20), c = 2 * w + 2 * h;
    return { q: `Ένα ποδοσφαιρικό γήπεδο έχει μήκος ${w} m και πλάτος ${h} m. Πόσα μέτρα είναι οι γραμμές του περιγράμματός του;`, correct: `${c} m`, wrongs: [`${w + h} m`, `${w * h} m`, `${2 * w + h} m`] };
  },
  () => {
    const w = getRandomInt(8, 20), h = getRandomInt(4, 10), c = 2 * w + 2 * h;
    return { q: `Ο κ. Γιώργος θέλει να βάλει ξύλινο φράχτη γύρω από το μποστάνι του (μήκος ${w} m, πλάτος ${h} m). Πόσο φράχτη θα αγοράσει;`, correct: `${c} m`, wrongs: [`${w + h} m`, `${2 * w + 2 * h + 5} m`, `${w * 2} m`] };
  },
  () => {
    const s = getRandomInt(5, 15), c = 4 * s;
    return { q: `Ένας τετράγωνος λαχανόκηπος έχει πλευρά ${s} m. Πόσα μέτρα δίχτυ χρειαζόμαστε για να τον καλύψουμε γύρω-γύρω;`, correct: `${c} m`, wrongs: [`${s * 2} m`, `${s + 4} m`, `${s * 3} m`] };
  },
  () => {
    const w = getRandomInt(20, 40), h = getRandomInt(10, 25), c = 2 * w + 2 * h;
    return { q: `Ένα αγρόκτημα έχει ορθογώνιο σχήμα με μήκος ${w} m και πλάτος ${h} m. Πόση είναι η περίμετρός του;`, correct: `${c} m`, wrongs: [`${w + h} m`, `${w * h} m`, `${w + 2 * h} m`] };
  },
  () => {
    const s = getRandomInt(10, 30), c = 4 * s;
    return { q: `Μια τετράγωνη πισίνα έχει πλευρά ${s} m. Πόσα μέτρα αντιολισθητική ταινία χρειαζόμαστε γύρω από τα χείλη της;`, correct: `${c} m`, wrongs: [`${s * 2} m`, `${s * 3} m`, `${s * 5} m`] };
  },
  () => {
    const w = getRandomInt(14, 28), h = getRandomInt(7, 14), c = 2 * w + 2 * h;
    return { q: `Ένα ορθογώνιο πάρκο έχει μήκος ${w} m και πλάτος ${h} m. Πόσο δρόμο κάνει κάποιος που περπατάει όλο το σύνορό του;`, correct: `${c} m`, wrongs: [`${w + h} m`, `${2 * w + h} m`, `${w * h} m`] };
  },

  // 11-20: Κορνίζες, Πίνακες, Τραπέζια & Δωμάτια (cm & m)
  () => {
    const w = getRandomInt(20, 50), h = getRandomInt(15, 30), c = 2 * w + 2 * h;
    return { q: `Μια ορθογώνια κορνίζα έχει μήκος ${w} cm και πλάτος ${h} cm. Πόσα εκατοστά ξύλινο πηχάκι χρειάστηκε για την κατασκευή της;`, correct: `${c} cm`, wrongs: [`${w + h} cm`, `${w * h} cm`, `${2 * w + h} cm`] };
  },
  () => {
    const s = getRandomInt(15, 40), c = 4 * s;
    return { q: `Ένας τετράγωνος πίνακας ζωγραφικής έχει πλευρά ${s} cm. Πόσο είναι το συνολικό μήκος του πλαισίου του;`, correct: `${c} cm`, wrongs: [`${s * 2} cm`, `${s * 3} cm`, `${s + 4} cm`] };
  },
  () => {
    const w = getRandomInt(4, 8), h = getRandomInt(3, 6), c = 2 * w + 2 * h;
    return { q: `Ένα ορθογώνιο δωμάτιο έχει μήκος ${w} m και πλάτος ${h} m. Πόσα μέτρα σοβατεπί θα βάλουμε στο πάτωμα γύρω-γύρω;`, correct: `${c} m`, wrongs: [`${w + h} m`, `${w * h} m`, `${2 * w + h} m`] };
  },
  () => {
    const s = getRandomInt(80, 150), c = 4 * s;
    return { q: `Ένα τετράγωνο τραπέζι έχει πλευρά ${s} cm. Πόσα εκατοστά δαντέλα χρειαζόμαστε για να ράψουμε γύρω από το τραπεζομάντηλο;`, correct: `${c} cm`, wrongs: [`${s * 2} cm`, `${s * 3} cm`, `${s + 100} cm`] };
  },
  () => {
    const w = getRandomInt(100, 200), h = getRandomInt(60, 120), c = 2 * w + 2 * h;
    return { q: `Ένας σχολικός μαυροπίνακας έχει μήκος ${w} cm και πλάτος ${h} cm. Πόση είναι η περίμετρός του;`, correct: `${c} cm`, wrongs: [`${w + h} cm`, `${2 * w + h} cm`, `${w * h} cm`] };
  },
  () => {
    const s = getRandomInt(10, 25), c = 4 * s;
    return { q: `Ένα τετράγωνο πλακάκι έχει πλευρά ${s} cm. Πόση είναι η περίμετρος του πλακακίου;`, correct: `${c} cm`, wrongs: [`${s * 2} cm`, `${s * 3} cm`, `${s * s} cm`] };
  },
  () => {
    const w = getRandomInt(120, 200), h = getRandomInt(80, 120), c = 2 * w + 2 * h;
    return { q: `Ένα ορθογώνιο χαλί έχει μήκος ${w} cm και πλάτος ${h} cm. Πόσα εκατοστά κρόσσια θα χρειαστούμε αν βάλουμε σε όλες τις πλευρές;`, correct: `${c} cm`, wrongs: [`${w + h} cm`, `${w * h} cm`, `${2 * w + h} cm`] };
  },
  () => {
    const s = getRandomInt(25, 60), c = 4 * s;
    return { q: `Ένα τετράγωνο μαξιλάρι έχει πλευρά ${s} cm. Πόσα εκατοστά ρέλι χρειάζεται γύρω-γύρω;`, correct: `${c} cm`, wrongs: [`${s * 2} cm`, `${s * 3} cm`, `${s + 20} cm`] };
  },
  () => {
    const w = getRandomInt(10, 20), h = getRandomInt(15, 30), c = 2 * w + 2 * h;
    return { q: `Ένα παράθυρο έχει μήκος ${w} cm και ύψος ${h} cm. Πόσο είναι το συνολικό περίγραμμα του παραθύρου;`, correct: `${c} cm`, wrongs: [`${w + h} cm`, `${2 * w + h} cm`, `${w * h} cm`] };
  },
  () => {
    const s = getRandomInt(30, 80), c = 4 * s;
    return { q: `Ένα τετράγωνο κουτί δώρου έχει πλευρά ${s} cm. Πόση ταινία χρειαζόμαστε για να καλύψουμε την περίμετρο του καπακιού;`, correct: `${c} cm`, wrongs: [`${s * 2} cm`, `${s * 3} cm`, `${s + 50} cm`] };
  },

  // 21-30: Τρίγωνα & Πεντάγωνα / Εξάγωνα / Πολύγωνα
  () => {
    const a = getRandomInt(10, 25), b = getRandomInt(10, 25), c = getRandomInt(10, 25), total = a + b + c;
    return { q: `Ένα τριγωνικό παρτέρι έχει πλευρές ${a} m, ${b} m και ${c} m. Πόσα μέτρα περιφράξεως χρειαζόμαστε;`, correct: `${total} m`, wrongs: [`${a + b} m`, `${2 * (a + b)} m`, `${a + c} m`] };
  },
  () => {
    const s = getRandomInt(12, 30), c = 3 * s;
    return { q: `Ένα ισόπλευρο τριγωνικό σήμα τροχαίας έχει πλευρά ${s} cm. Πόση είναι η περίμετρός του;`, correct: `${c} cm`, wrongs: [`${s * 2} cm`, `${s * 4} cm`, `${s + 3} cm`] };
  },
  () => {
    const s = getRandomInt(5, 12), c = 5 * s;
    return { q: `Ένα κανονικό πεντάγωνο παρτέρι έχει 5 ίσες πλευρές μήκους ${s} m η καθμία. Πόση είναι η περίμετρός του;`, correct: `${c} m`, wrongs: [`${s * 4} m`, `${s * 6} m`, `${s + 5} m`] };
  },
  () => {
    const s = getRandomInt(4, 10), c = 6 * s;
    return { q: `Ένα κανονικό εξάγωνο κιόσκι έχει 6 ίσες πλευρές μήκους ${s} m. Πόσα μέτρα είναι ο γύρος του κιόσκι;`, correct: `${c} m`, wrongs: [`${s * 5} m`, `${s * 4} m`, `${s * 10} m`] };
  },
  () => {
    const a = getRandomInt(5, 12), b = getRandomInt(5, 12), c = getRandomInt(5, 12), d = getRandomInt(5, 12), e = getRandomInt(5, 12), total = a + b + c + d + e;
    return { q: `Ένας ανώμαλος πεντάγωνος στίβος έχει πλευρές ${a}m, ${b}m, ${c}m, ${d}m και ${e}m. Πόση είναι η περίμετρός του;`, correct: `${total} m`, wrongs: [`${a + b + c} m`, `${total + 10} m`, `${a * 5} m`] };
  },
  () => {
    const s = getRandomInt(8, 20), c = 3 * s;
    return { q: `Μια τριγωνική σημαία με 3 ίσες πλευρές έχει μήκος πλευράς ${s} cm. Πόση ρέλι χρειαζόμαστε γύρω-γύρω;`, correct: `${c} cm`, wrongs: [`${s * 2} cm`, `${s * 4} cm`, `${s + 10} cm`] };
  },
  () => {
    const a = getRandomInt(8, 15), b = getRandomInt(10, 20), c = getRandomInt(8, 15), total = a + b + c;
    return { q: `Ένα ισοσκελές τριγωνικό οικόπεδο έχει δύο ίσες πλευρές από ${a} m και βάση ${b} m. Πόση είναι η περίμετρός του;`, correct: `${total} m`, wrongs: [`${2 * a} m`, `${2 * b + a} m`, `${a + b} m`] };
  },
  () => {
    const s = getRandomInt(3, 8), c = 8 * s;
    return { q: `Ένα οκτάγωνο σήμα "STOP" έχει 8 ίσες πλευρές μήκους ${s} cm. Πόση είναι η περίμετρός του;`, correct: `${c} cm`, wrongs: [`${s * 6} cm`, `${s * 4} cm`, `${s + 8} cm`] };
  },
  () => {
    const a = getRandomInt(4, 8), b = getRandomInt(5, 10), c = getRandomInt(6, 12), d = getRandomInt(4, 9), total = a + b + c + d;
    return { q: `Ένα ανώμαλο τετράπλευρο έχει πλευρές ${a} cm, ${b} cm, ${c} cm και ${d} cm. Πόσο είναι το άθροισμα των πλευρών του;`, correct: `${total} cm`, wrongs: [`${a + b} cm`, `${total - 5} cm`, `${a * 4} cm`] };
  },
  () => {
    const s = getRandomInt(10, 25), c = 3 * s;
    return { q: `Ένας τριγωνικός καθρέφτης με 3 ίσες πλευρές έχει πλευρά ${s} cm. Πόσο πλαστικό πλαίσιο χρειάζεται γύρω του;`, correct: `${c} cm`, wrongs: [`${s * 2} cm`, `${s * 4} cm`, `${s + 20} cm`] };
  }
];

// ----------------------------------------------------
// ΔΕΞΑΜΕΝΗ 30+ ΠΡΟΤΑΣΕΩΝ ΣΩΣΤΟΥ / ΛΑΘΟΥΣ
// ----------------------------------------------------
const TRUE_FALSE_POOL = [
  // 1-10: Θεμελιώδεις ορισμοί & Βασικοί κανόνες
  { q: 'Η περίμετρος ενός σχήματος είναι το συνολικό μήκος του περιγράμματός του.', correct: 'Σωστό', explain: 'Σωστά! Είναι το άθροισμα όλων των εξωτερικών πλευρών του.' },
  { q: 'Για να βρούμε την περίμετρο οποιουδήποτε πολυγώνου, προσθέτουμε τα μήκη όλων των πλευρών του.', correct: 'Σωστό', explain: 'Σωστά! Η περίμετρος είναι πάντα το άθροισμα των πλευρών.' },
  { q: 'Η περίμετρος μετριέται σε μονάδες μήκους (π.χ. μέτρα, εκατοστά, χιλιοστά).', correct: 'Σωστό', explain: 'Σωστά! Αφού είναι μήκος, μετριέται σε m, cm, mm κλπ.' },
  { q: 'Η περίμετρος μετριέται σε τετραγωνικά μέτρα (τ.μ.).', correct: 'Λάθος', explain: 'Λάθος! Σε τετραγωνικά μέτρα μετριέται το εμβαδόν, όχι η περίμετρος.' },
  { q: 'Δύο διαφορετικά σχήματα είναι αδύνατον να έχουν την ίδια περίμετρο.', correct: 'Λάθος', explain: 'Λάθος! Διαφορετικά σχήματα μπορούν να έχουν την ίδια περίμετρο (π.χ. τετράγωνο 3cm και ορθογώνιο 4cm x 2cm).' },
  { q: 'Αν διπλασιάσουμε όλες τις πλευρές ενός σχήματος, η περίμετρός του διπλασιάζεται.', correct: 'Σωστό', explain: 'Σωστά! Αφού διπλασιάζονται όλες οι πλευρές, διπλασιάζεται και το άθροισμά τους.' },
  { q: 'Η περίμετρος εκφράζει το «μέσα» μέρος μιας επιφάνειας.', correct: 'Λάθος', explain: 'Λάθος! Το «μέσα» μέρος είναι το εμβαδόν. Η περίμετρος είναι το «γύρω-γύρω».' },
  { q: 'Όσο περισσότερες πλευρές έχει ένα πολύγωνο, τόσο μεγαλύτερη είναι πάντα η περίμετρός του.', correct: 'Λάθος', explain: 'Λάθος! Εξαρτάται από το μήκος των πλευρών (π.χ. ένα τρίγωνο με μεγάλες πλευρές μπορεί να έχει μεγαλύτερη περίμετρο από ένα εξάγωνο με μικρές).' },
  { q: 'Αν ένα σχήμα έχει πλευρές σε εκατοστά (cm), η περίμετρός του υπολογίζεται επίσης σε εκατοστά (cm).', correct: 'Σωστό', explain: 'Σωστά! Η περίμετρος έχει την ίδια μονάδα μέτρησης με τις πλευρές.' },
  { q: 'Περίμετρος είναι η απόσταση που διανύουμε αν κάνουμε έναν πλήρη γύρο γύρω από ένα σχήμα.', correct: 'Σωστό', explain: 'Σωστά! Αυτός είναι ο πρακτικός ορισμός της περιμέτρου.' },

  // 11-20: Τετράγωνα & Ορθογώνια
  { q: 'Για να βρούμε την περίμετρο ενός τετραγώνου, πολλαπλασιάζουμε το μήκος της μίας πλευράς επί 4.', correct: 'Σωστό', explain: 'Σωστά! Αφού το τετράγωνο έχει 4 ίσες πλευρές.' },
  { q: 'Για να βρούμε την περίμετρο ενός ορθογωνίου, προσθέτουμε μόνο το μήκος και το πλάτος του 1 φορά.', correct: 'Λάθος', explain: 'Λάθος! Πρέπει να τα προσθέσουμε από 2 φορές: (2 × μήκος) + (2 × πλάτος).' },
  { q: 'Αν ένα τετράγωνο έχει πλευρά 5 cm, η περίμετρός του είναι 20 cm.', correct: 'Σωστό', explain: 'Σωστά! 4 × 5 = 20 cm.' },
  { q: 'Αν ένα ορθογώνιο έχει μήκος 6 cm και πλάτος 4 cm, η περίμετρός του είναι 10 cm.', correct: 'Λάθος', explain: 'Λάθος! Η περίμετρος είναι (2 × 6) + (2 × 4) = 12 + 8 = 20 cm.' },
  { q: 'Αν ένα τετράγωνο έχει περίμετρο 36 cm, η πλευρά του είναι 9 cm.', correct: 'Σωστό', explain: 'Σωστά! 36 : 4 = 9 cm.' },
  { q: 'Ένα ορθογώνιο με μήκος 5 cm και πλάτος 3 cm έχει την ίδια περίμετρο με ένα τετράγωνο πλευράς 4 cm.', correct: 'Σωστό', explain: 'Σωστά! Ορθογώνιο: 5+5+3+3 = 16 cm. Τετράγωνο: 4 × 4 = 16 cm.' },
  { q: 'Αν ξέρουμε την περίμετρο ενός τετραγώνου, μπορούμε να βρούμε την πλευρά του διαιρώντας με το 4.', correct: 'Σωστό', explain: 'Σωστά! Αφού οι 4 πλευρές είναι ίσες.' },
  { q: 'Όλα τα ορθογώνια που έχουν την ίδια περίμετρο έχουν οπωσδήποτε και τα ίδια μήκη πλευρών.', correct: 'Λάθος', explain: 'Λάθος! Π.χ. ορθογώνιο 5x1 (περίμετρος 12) και ορθογώνιο 4x2 (περίμετρος 12).' },
  { q: 'Η περίμετρος ενός τετραγώνου είναι πάντα τετραπλάσια από το μήκος της πλευράς του.', correct: 'Σωστό', explain: 'Σωστά! Π = 4 × πλευρά.' },
  { q: 'Αν αυξήσουμε την πλευρά ενός τετραγώνου κατά 2 cm, η περίμετρός του θα αυξηθεί κατά 8 cm.', correct: 'Σωστό', explain: 'Σωστά! 2 cm σε κάθε μία από τις 4 πλευρές = 8 cm συνολική αύξηση.' },

  // 21-30+: Τρίγωνα & Άλλα Πολύγωνα
  { q: 'Για να βρούμε την περίμετρο ενός ισόπλευρου τριγώνου, πολλαπλασιάζουμε τη μία πλευρά του επί 3.', correct: 'Σωστό', explain: 'Σωστά! Αφού το ισόπλευρο τρίγωνο έχει 3 ίσες πλευρές.' },
  { q: 'Αν ένα ισόπλευρο τρίγωνο έχει περίμετρο 27 cm, η πλευρά του είναι 9 cm.', correct: 'Σωστό', explain: 'Σωστά! 27 : 3 = 9 cm.' },
  { q: 'Ένα κανονικό πεντάγωνο με πλευρά 6 cm έχει περίμετρο 30 cm.', correct: 'Σωστό', explain: 'Σωστά! 5 πλευρές × 6 cm = 30 cm.' },
  { q: 'Ένα κανονικό εξάγωνο με πλευρά 5 cm έχει περίμετρο 25 cm.', correct: 'Λάθος', explain: 'Λάθος! Το εξάγωνο έχει 6 πλευρές, οπότε 6 × 5 = 30 cm.' },
  { q: 'Σε ένα σκαληνό τρίγωνο (με 3 διαφορετικές πλευρές), η περίμετρος βρίσκεται προσθέτοντας και τις 3 πλευρές.', correct: 'Σωστό', explain: 'Σωστά! Π = a + b + c.' },
  { q: 'Ένα κανονικό οκτάγωνο με πλευρά 4 cm έχει περίμετρο 32 cm.', correct: 'Σωστό', explain: 'Σωστά! 8 πλευρές × 4 cm = 32 cm.' },
  { q: 'Αν ένα ισόπλευρο τρίγωνο έχει πλευρά 10 cm, η περίμετρός του είναι 20 cm.', correct: 'Λάθος', explain: 'Λάθος! Έχει 3 πλευρές, οπότε 3 × 10 = 30 cm.' },
  { q: 'Ένα ρόμβος με πλευρά 7 cm έχει περίμετρο 28 cm.', correct: 'Σωστό', explain: 'Σωστά! Ο ρόμβος έχει 4 ίσες πλευρές, οπότε 4 × 7 = 28 cm.' },
  { q: 'Η περίμετρος ενός σχήματος μπορεί να υπολογιστεί ακόμα κι αν λείπει το μήκος μίας πλευράς.', correct: 'Λάθος', explain: 'Λάθος! Πρέπει να γνωρίζουμε (ή να μπορούμε να υπολογίσουμε) τα μήκη όλων των πλευρών.' },
  { q: 'Ένα κανονικό δεκάγωνο με πλευρά 3 cm έχει περίμετρο 30 cm.', correct: 'Σωστό', explain: 'Σωστά! 10 πλευρές × 3 cm = 30 cm.' }
];

// ----------------------------------------------------
// ΣΥΝΑΡΤΗΣΕΙΣ ΔΗΜΙΟΥΡΓΙΑΣ ΑΣΚΗΣΕΩΝ
// ----------------------------------------------------

// 1. Υπολογισμός Περιμέτρου από Σχήμα (SVG)
function makeShapePerimeterQuestion(prevQ = null) {
  const shapes = ['square', 'rectangle', 'triangle'];
  let shapeType = shapes[getRandomInt(0, shapes.length - 1)];

  if (prevQ && prevQ.shapeType === shapeType) {
    shapeType = shapeType === 'square' ? 'rectangle' : 'square';
  }

  if (shapeType === 'square') {
    const a = getRandomInt(3, 12);
    const correct = 4 * a;
    return {
      shapeType,
      q: `Υπολόγισε την περίμετρο του παρακάτω τετραγώνου με πλευρά a = ${a} cm:`,
      correct,
      unit: 'cm',
      svg: (
        <svg className="w-48 h-32 mx-auto bg-slate-900 rounded-xl" viewBox="0 0 200 120">
          <rect x="65" y="25" width="70" height="70" fill="#f59e0b" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="3" />
          <text x="100" y="18" fill="#fbbf24" fontWeight="bold" fontSize="12" textAnchor="middle">{a} cm</text>
          <text x="145" y="65" fill="#fbbf24" fontWeight="bold" fontSize="12">{a} cm</text>
        </svg>
      )
    };
  } else if (shapeType === 'rectangle') {
    const a = getRandomInt(6, 15);
    const b = getRandomInt(3, a - 1);
    const correct = 2 * a + 2 * b;
    return {
      shapeType,
      q: `Υπολόγισε την περίμετρο του παρακάτω ορθογωνίου με μήκος ${a} cm και πλάτος ${b} cm:`,
      correct,
      unit: 'cm',
      svg: (
        <svg className="w-52 h-32 mx-auto bg-slate-900 rounded-xl" viewBox="0 0 220 120">
          <rect x="40" y="30" width="140" height="60" fill="#f59e0b" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="3" />
          <text x="110" y="22" fill="#fbbf24" fontWeight="bold" fontSize="12" textAnchor="middle">{a} cm</text>
          <text x="190" y="65" fill="#fbbf24" fontWeight="bold" fontSize="12">{b} cm</text>
        </svg>
      )
    };
  } else {
    const a = getRandomInt(4, 10);
    const b = getRandomInt(4, 10);
    const c = getRandomInt(4, 10);
    const correct = a + b + c;
    return {
      shapeType,
      q: `Υπολόγισε την περίμετρο του παρακάτω τριγώνου με πλευρές a = ${a} cm, b = ${b} cm, c = ${c} cm:`,
      correct,
      unit: 'cm',
      svg: (
        <svg className="w-48 h-32 mx-auto bg-slate-900 rounded-xl" viewBox="0 0 200 120">
          <polygon points="100,20 40,95 160,95" fill="#f59e0b" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="3" />
          <text x="60" y="55" fill="#fbbf24" fontWeight="bold" fontSize="11">{a} cm</text>
          <text x="140" y="55" fill="#fbbf24" fontWeight="bold" fontSize="11">{b} cm</text>
          <text x="100" y="112" fill="#fbbf24" fontWeight="bold" fontSize="11" textAnchor="middle">{c} cm</text>
        </svg>
      )
    };
  }
}

// 2. Εύρεση Άγνωστης Πλευράς (Input)
function makeMissingSideQuestion(prevQ = null) {
  const isSquare = prevQ ? !prevQ.isSquare : Math.random() > 0.5;

  if (isSquare) {
    const side = getRandomInt(4, 15);
    const perim = side * 4;
    return {
      isSquare: true,
      q: `Ένα τετράγωνο έχει συνολική περίμετρο ${perim} cm. Πόσο είναι το μήκος της μίας πλευράς του;`,
      correct: side,
      unit: 'cm',
      explain: `Αφού το τετράγωνο έχει 4 ίσες πλευρές: ${perim} : 4 = ${side} cm.`
    };
  } else {
    const side = getRandomInt(5, 18);
    const perim = side * 3;
    return {
      isSquare: false,
      q: `Ένα ισόπλευρο τρίγωνο (με 3 ίσες πλευρές) έχει περίμετρο ${perim} cm. Πόσο είναι η κάθε πλευρά του;`,
      correct: side,
      unit: 'cm',
      explain: `Αφού το ισόπλευρο τρίγωνο έχει 3 ίσες πλευρές: ${perim} : 3 = ${side} cm.`
    };
  }
}

// 3. Προβλήματα Καθημερινότητας από τη Δεξαμενή 30+
function makeRealProblemQuestion(prevQ = null) {
  let probObj;
  while (true) {
    const rawFunc = REAL_PROBLEMS_POOL[getRandomInt(0, REAL_PROBLEMS_POOL.length - 1)];
    probObj = rawFunc();
    if (!prevQ || prevQ.q !== probObj.q) break;
  }

  const options = [
    { text: probObj.correct, isCorrect: true },
    ...probObj.wrongs.map(w => ({ text: w, isCorrect: false }))
  ].sort(() => Math.random() - 0.5);

  return { ...probObj, options };
}

// 4. Δημιουργία 8 Ερωτήσεων
function generateQuestions() {
  const q1 = makeShapePerimeterQuestion();
  const q2 = makeShapePerimeterQuestion(q1);

  const q3 = makeMissingSideQuestion();
  const q4 = makeMissingSideQuestion(q3);

  const q5 = makeRealProblemQuestion();
  const q6 = makeRealProblemQuestion(q5);

  let tf1 = TRUE_FALSE_POOL[getRandomInt(0, TRUE_FALSE_POOL.length - 1)];
  let tf2;
  while (true) {
    tf2 = TRUE_FALSE_POOL[getRandomInt(0, TRUE_FALSE_POOL.length - 1)];
    if (tf2.q !== tf1.q) break;
  }

  return { q1, q2, q3, q4, q5, q6, q7: tf1, q8: tf2 };
}

export default function PerimetrosAskPage() {
  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({ q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '' });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewQuestions = () => {
    setQuestions(generateQuestions());
    setAnswers({ q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '' });
    setSubmitted(false);
    setScore(0);
  };

  useEffect(() => {
    loadNewQuestions();
  }, []);

  if (!questions) return null;

  const handleInputChange = (key, val) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [key]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;

    let currentScore = 0;
    if (parseInt(answers.q1, 10) === questions.q1.correct) currentScore += 1;
    if (parseInt(answers.q2, 10) === questions.q2.correct) currentScore += 1;
    if (parseInt(answers.q3, 10) === questions.q3.correct) currentScore += 1;
    if (parseInt(answers.q4, 10) === questions.q4.correct) currentScore += 1;
    if (answers.q5 === questions.q5.correct) currentScore += 1;
    if (answers.q6 === questions.q6.correct) currentScore += 1;
    if (answers.q7 === questions.q7.correct) currentScore += 1;
    if (answers.q8 === questions.q8.correct) currentScore += 1;

    setScore(currentScore);
    setSubmitted(true);
  };

  // Render Input Number Ασκήσεων (Q1 - Q4)
  const renderInputNumber = (qKey, qData, numLabel, colorClass) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (parseInt(answers[qKey], 10) === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className={`${colorClass} text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center`}>{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">{qData.q}</h3>
      </div>

      {qData.svg && <div className="mb-4">{qData.svg}</div>}

      <div className="pl-0 md:pl-11 space-y-3">
        <div className="flex items-center gap-2">
          <input 
            type="number"
            placeholder="Γράψε τον αριθμό"
            value={answers[qKey]}
            onChange={(e) => handleInputChange(qKey, e.target.value)}
            disabled={submitted}
            className="w-full md:w-96 p-3.5 rounded-2xl border border-gray-300 font-mono text-lg font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
          <span className="font-bold text-gray-600">{qData.unit}</span>
        </div>
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {parseInt(answers[qKey], 10) === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. {qData.explain || `Η σωστή απάντηση είναι: ${qData.correct} ${qData.unit}`}</p>
          )}
        </div>
      )}
    </div>
  );

  // Render MCQ (Q5 & Q6)
  const renderMcqQuestion = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (answers[qKey] === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-orange-500 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">{qData.q}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-0 md:pl-11">
        {qData.options.map((opt, idx) => (
          <label 
            key={idx} 
            className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
              answers[qKey] === opt.text 
                ? 'border-amber-600 bg-amber-50/80 font-bold text-amber-900' 
                : 'border-gray-200 hover:bg-gray-50 text-gray-800'
            }`}
          >
            <input 
              type="radio" 
              name={qKey} 
              value={opt.text}
              checked={answers[qKey] === opt.text}
              onChange={() => handleInputChange(qKey, opt.text)}
              disabled={submitted}
              className="w-5 h-5 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-sm md:text-base font-bold">{opt.text}</span>
          </label>
        ))}
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {answers[qKey] === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. Η σωστή απάντηση είναι: <span className="font-black">{qData.correct}</span></p>
          )}
        </div>
      )}
    </div>
  );

  // Render Σωστό / Λάθος (Q7 & Q8)
  const renderTrueFalse = (qKey, qData, numLabel) => (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border transition-all ${
      submitted 
        ? (answers[qKey] === qData.correct ? 'border-emerald-500 bg-emerald-50/20' : 'border-red-400 bg-red-50/20')
        : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-rose-500 text-white font-black text-sm w-8 h-8 rounded-xl flex items-center justify-center">{numLabel}</span>
        <h3 className="text-lg font-bold text-gray-900">{qData.q}</h3>
      </div>

      <div className="flex gap-4 pl-0 md:pl-11">
        {['Σωστό', 'Λάθος'].map((opt) => (
          <button
            type="button"
            key={opt}
            onClick={() => handleInputChange(qKey, opt)}
            disabled={submitted}
            className={`px-8 py-3 rounded-2xl font-black text-base border transition ${
              answers[qKey] === opt
                ? (opt === 'Σωστό' ? 'bg-emerald-600 text-white border-emerald-700 shadow-md' : 'bg-rose-600 text-white border-rose-700 shadow-md')
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {submitted && (
        <div className="mt-4 pl-0 md:pl-11 text-xs md:text-sm font-bold">
          {answers[qKey] === qData.correct ? (
            <p className="text-emerald-700">✅ Σωστό! (+1 πόντος)</p>
          ) : (
            <p className="text-red-600">❌ Λάθος. {qData.explain}</p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between pb-24">
      <Head>
        <title>📏 Ασκήσεις: Υπολογισμός Περιμέτρου - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR */}
        <nav className="bg-white shadow-md w-full sticky top-0 z-50">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            <Link href="/d-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/d-dimotikou/17-perimetros" className="bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
                <span>📖</span> Θεωρία
              </Link>
              <button 
                onClick={loadNewQuestions}
                className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2"
              >
                <span>🔄</span> Νέες Ασκήσεις
              </button>
            </div>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-10 space-y-8`}>
          
          {/* HEADER BANNER */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-8 rounded-3xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
              </span>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight mt-2">
                📝 Ασκήσεις: Υπολογισμός Περιμέτρου
              </h1>
              <p className="text-amber-100 text-sm md:text-base mt-1">
                Πατώντας «Νέες Ασκήσεις» οι ερωτήσεις και οι αριθμοί αλλάζουν.
              </p>
            </div>

            <button
              onClick={loadNewQuestions}
              className="bg-white text-gray-900 font-black px-5 py-3 rounded-2xl shadow-lg hover:bg-amber-50 transition transform active:scale-95 text-sm whitespace-nowrap"
            >
              🔄 Αλλαγή Αριθμών
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {renderInputNumber('q1', questions.q1, 1, 'bg-amber-500')}
            {renderInputNumber('q2', questions.q2, 2, 'bg-amber-500')}

            {renderInputNumber('q3', questions.q3, 3, 'bg-amber-600')}
            {renderInputNumber('q4', questions.q4, 4, 'bg-amber-600')}

            {renderMcqQuestion('q5', questions.q5, 5)}
            {renderMcqQuestion('q6', questions.q6, 6)}

            {renderTrueFalse('q7', questions.q7, 7)}
            {renderTrueFalse('q8', questions.q8, 8)}

            {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
            {!submitted && (
              <div className="text-center pt-4">
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-black px-10 py-4 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95"
                >
                  🎯 Έλεγχος Απαντήσεων
                </button>
              </div>
            )}

          </form>

        </main>
      </div>

      {/* STICKY FOOTER SCORES & FEEDBACK BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-4 px-6 z-50">
        <div className={`${LAYOUT.CONTAINER} flex flex-col md:flex-row justify-between items-center gap-3`}>
          
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-900 font-black px-4 py-2 rounded-xl text-lg flex items-center gap-2 shadow-sm">
              <span>🏆 Σκορ:</span>
              <span className="text-2xl font-mono">{score} / 8</span>
            </div>
            {submitted && (
              <span className="text-sm font-bold text-slate-300">
                Ποσοστό Επιτυχίας: <span className="text-emerald-400 font-black">{Math.round((score / 8) * 100)}%</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                onClick={loadNewQuestions}
                className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-black px-6 py-2.5 rounded-xl shadow-md transition text-sm flex items-center gap-2"
              >
                <span>🔄</span> Παίξε ξανά με νέες ερωτήσεις!
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden md:block">
                Συμπλήρωσε όλες τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!
              </p>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
