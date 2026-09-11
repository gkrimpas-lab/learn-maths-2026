// pages/d-dimotikou/17-perimetros-ask.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// ----------------------------------------------------
// ΔΕΞΑΜΕΝΗ 30+ ΠΡΟΒΛΗΜΑΤΩΝ ΚΑΘΗΜΕΡΙΝΟΤΗΤΑΣ
// ----------------------------------------------------
const REAL_PROBLEMS_POOL = [
  // 1-10: Περιφράξεις & Κήποι / Αυλές (Ορθογώνια & Τετράγωνα)
  () => {
    const w = getRandomInt(10, 30), h = getRandomInt(5, 15), c = 2 * w + 2 * h;
    return {
      q: `Ο κύριος Νίκος περιφράζει έναν ορθογώνιο κήπο μήκους ${w} m και πλάτους ${h} m. Πόσα μέτρα συρματόπλεγμα θα χρειαστεί συνολικά;`,
      correct: `${c} m`,
      wrongs: [`${w + h} m`, `${2 * w + h} m`, `${w * h} m`],
      explainText: `Για την ορθογώνια περίφραξη προσθέτουμε όλες τις πλευρές: (2 · ${w}) ＋ (2 · ${h}) ＝ ${c} m.`
    };
  },
  () => {
    const s = getRandomInt(6, 20), c = 4 * s;
    return {
      q: `Μια τετράγωνη παιδική χαρά έχει πλευρά ${s} m. Πόσο μήκος έχει το προστατευτικό κιγκλίδωμα γύρω-γύρω;`,
      correct: `${c} m`,
      wrongs: [`${s * 2} m`, `${s * 3} m`, `${s * s} m`],
      explainText: `Το τετράγωνο έχει 4 ίσες πλευρές, επομένως: 4 · ${s} ＝ ${c} m.`
    };
  },
  () => {
    const w = getRandomInt(12, 25), h = getRandomInt(6, 12), c = 2 * w + 2 * h;
    return {
      q: `Η σχολική αυλή είναι ορθογώνια με μήκος ${w} m και πλάτος ${h} m. Τα παιδιά τρέχουν 1 πλήρη γύρο γύρω από την αυλή. Πόσα μέτρα διανύουν;`,
      correct: `${c} m`,
      wrongs: [`${w + h} m`, `${2 * (w + h) + 6} m`, `${w * h} m`],
      explainText: `Ο ένας γύρος ισούται με την περίμετρο του ορθογωνίου: (2 · ${w}) ＋ (2 · ${h}) ＝ ${c} m.`
    };
  },
  () => {
    const s = getRandomInt(8, 18), c = 4 * s;
    return {
      q: `Ένα τετράγωνο οικόπεδο έχει πλευρά ${s} m. Πόσα μέτρα μήκος έχει ο τοίχος που το περιβάλλει;`,
      correct: `${c} m`,
      wrongs: [`${s * 2} m`, `${s * 3} m`, `${s * 8} m`],
      explainText: `Η περίμετρος του τετραγώνου δίνεται από τον τύπο: 4 · ${s} ＝ ${c} m.`
    };
  },
  () => {
    const w = getRandomInt(15, 35), h = getRandomInt(10, 20), c = 2 * w + 2 * h;
    return {
      q: `Ένα ποδοσφαιρικό γήπεδο 5x5 έχει μήκος ${w} m και πλάτος ${h} m. Πόσα μέτρα είναι συνολικά οι άσπρες γραμμές του εξωτερικού περιγράμματός του;`,
      correct: `${c} m`,
      wrongs: [`${w + h} m`, `${w * h} m`, `${2 * w + h} m`],
      explainText: `Το περίγραμμα είναι η περίμετρος: (2 · ${w}) ＋ (2 · ${h}) ＝ ${c} m.`
    };
  },
  () => {
    const w = getRandomInt(8, 20), h = getRandomInt(4, 10), c = 2 * w + 2 * h;
    return {
      q: `Ο κ. Γιώργος θέλει να βάλει ξύλινο φράχτη γύρω από το μποστάνι του (μήκους ${w} m και πλάτους ${h} m). Πόσα μέτρα φράχτη θα αγοράσει;`,
      correct: `${c} m`,
      wrongs: [`${w + h} m`, `${2 * w + 2 * h + 8} m`, `${w * 2} m`],
      explainText: `Η περίμετρος του ορθογωνίου είναι: (2 · ${w}) ＋ (2 · ${h}) ＝ ${c} m.`
    };
  },
  () => {
    const s = getRandomInt(5, 15), c = 4 * s;
    return {
      q: `Ένας τετράγωνος λαχανόκηπος έχει πλευρά ${s} m. Πόσα μέτρα προστατευτικό δίχτυ χρειαζόμαστε για να τον περιφράξουμε γύρω-γύρω;`,
      correct: `${c} m`,
      wrongs: [`${s * 2} m`, `${s + 4} m`, `${s * 3} m`],
      explainText: `Για 4 ίσες πλευρές μήκους ${s} m, η περίμετρος είναι 4 · ${s} ＝ ${c} m.`
    };
  },
  () => {
    const w = getRandomInt(20, 40), h = getRandomInt(10, 25), c = 2 * w + 2 * h;
    return {
      q: `Ένα αγρόκτημα έχει ορθογώνιο σχήμα με μήκος ${w} m και πλάτος ${h} m. Πόση είναι η συνολική περίμετρός του;`,
      correct: `${c} m`,
      wrongs: [`${w + h} m`, `${w * h} m`, `${w + 2 * h} m`],
      explainText: `Υπολογίζουμε την περίμετρο: 2 · (${w} ＋ ${h}) ＝ ${c} m.`
    };
  },
  () => {
    const s = getRandomInt(10, 30), c = 4 * s;
    return {
      q: `Μια τετράγωνη πισίνα έχει πλευρά ${s} m. Πόσα μέτρα αντιολισθητική ταινία χρειαζόμαστε για να τοποθετήσουμε γύρω από τα χείλη της;`,
      correct: `${c} m`,
      wrongs: [`${s * 2} m`, `${s * 3} m`, `${s * 5} m`],
      explainText: `Το μήκος της ταινίας ισούται με την περίμετρο του τετραγώνου: 4 · ${s} ＝ ${c} m.`
    };
  },
  () => {
    const w = getRandomInt(14, 28), h = getRandomInt(7, 14), c = 2 * w + 2 * h;
    return {
      q: `Ένα ορθογώνιο πάρκο έχει μήκος ${w} m και πλάτος ${h} m. Πόση απόσταση διανύει ένας περιπατητής που κάνει τον γύρο του συνόρου του;`,
      correct: `${c} m`,
      wrongs: [`${w + h} m`, `${2 * w + h} m`, `${w * h} m`],
      explainText: `Ο γύρος του πάρκου είναι η περίμετρος: (2 · ${w}) ＋ (2 · ${h}) ＝ ${c} m.`
    };
  },

  // 11-20: Κορνίζες, Πίνακες, Τραπέζια & Δωμάτια (cm & m)
  () => {
    const w = getRandomInt(20, 50), h = getRandomInt(15, 30), c = 2 * w + 2 * h;
    return {
      q: `Μια ορθογώνια κορνίζα έχει μήκος ${w} cm και πλάτος ${h} cm. Πόσα εκατοστά ξύλινο πηχάκι χρειάστηκε για την κατασκευή του περιγράμματός της;`,
      correct: `${c} cm`,
      wrongs: [`${w + h} cm`, `${w * h} cm`, `${2 * w + h} cm`],
      explainText: `Το συνολικό μήκος του πλαισίου είναι η περίμετρος: (2 · ${w}) ＋ (2 · ${h}) ＝ ${c} cm.`
    };
  },
  () => {
    const s = getRandomInt(15, 40), c = 4 * s;
    return {
      q: `Ένας τετράγωνος πίνακας ζωγραφικής έχει πλευρά ${s} cm. Πόσο είναι το συνολικό μήκος του πλαισίου του;`,
      correct: `${c} cm`,
      wrongs: [`${s * 2} cm`, `${s * 3} cm`, `${s + 4} cm`],
      explainText: `Το τετράγωνο πλαίσιο έχει μήκος 4 · ${s} ＝ ${c} cm.`
    };
  },
  () => {
    const w = getRandomInt(4, 8), h = getRandomInt(3, 6), c = 2 * w + 2 * h;
    return {
      q: `Ένα ορθογώνιο δωμάτιο έχει μήκος ${w} m και πλάτος ${h} m. Πόσα μέτρα σοβατεπί θα τοποθετηθούν στο δάπεδο περιμετρικά;`,
      correct: `${c} m`,
      wrongs: [`${w + h} m`, `${w * h} m`, `${2 * w + h} m`],
      explainText: `Το σοβατεπί τοποθετείται στην περίμετρο του δωματίου: (2 · ${w}) ＋ (2 · ${h}) ＝ ${c} m.`
    };
  },
  () => {
    const s = getRandomInt(80, 150), c = 4 * s;
    return {
      q: `Ένα τετράγωνο τραπέζι έχει πλευρά ${s} cm. Πόσα εκατοστά δαντέλα χρειαζόμαστε για να ράψουμε γύρω από το τραπεζομάντηλο;`,
      correct: `${c} cm`,
      wrongs: [`${s * 2} cm`, `${s * 3} cm`, `${s + 100} cm`],
      explainText: `Η περίμετρος του τετράγωνου τραπεζομάντηλου είναι: 4 · ${s} ＝ ${c} cm.`
    };
  },
  () => {
    const w = getRandomInt(100, 200), h = getRandomInt(60, 120), c = 2 * w + 2 * h;
    return {
      q: `Ένας σχολικός μαυροπίνακας έχει μήκος ${w} cm και πλάτος ${h} cm. Πόση είναι η περίμετρός του;`,
      correct: `${c} cm`,
      wrongs: [`${w + h} cm`, `${2 * w + h} cm`, `${w * h} cm`],
      explainText: `Η περίμετρος του πίνακα είναι: (2 · ${w}) ＋ (2 · ${h}) ＝ ${c} cm.`
    };
  },
  () => {
    const s = getRandomInt(10, 25), c = 4 * s;
    return {
      q: `Ένα τετράγωνο κεραμικό πλακάκι έχει πλευρά ${s} cm. Πόση είναι η περίμετρος του πλακακίου;`,
      correct: `${c} cm`,
      wrongs: [`${s * 2} cm`, `${s * 3} cm`, `${s * s} cm`],
      explainText: `Η περίμετρος του πλακακίου είναι: 4 · ${s} ＝ ${c} cm.`
    };
  },
  () => {
    const w = getRandomInt(120, 200), h = getRandomInt(80, 120), c = 2 * w + 2 * h;
    return {
      q: `Ένα ορθογώνιο χαλί έχει μήκος ${w} cm και πλάτος ${h} cm. Πόσα εκατοστά κρόσσια θα χρειαστούν αν μπούνε σε όλες τις πλευρές του;`,
      correct: `${c} cm`,
      wrongs: [`${w + h} cm`, `${w * h} cm`, `${2 * w + h} cm`],
      explainText: `Σε όλες τις πλευρές του ορθογωνίου: (2 · ${w}) ＋ (2 · ${h}) ＝ ${c} cm.`
    };
  },
  () => {
    const s = getRandomInt(25, 60), c = 4 * s;
    return {
      q: `Ένα τετράγωνο διακοσμητικό μαξιλάρι έχει πλευρά ${s} cm. Πόσα εκατοστά ρέλι χρειάζεται περιμετρικά;`,
      correct: `${c} cm`,
      wrongs: [`${s * 2} cm`, `${s * 3} cm`, `${s + 20} cm`],
      explainText: `Η περίμετρος του τετράγωνου μαξιλαριού είναι: 4 · ${s} ＝ ${c} cm.`
    };
  },

  // 21-30: Τρίγωνα, Πολύγωνα & Σήματα
  () => {
    const a = getRandomInt(10, 25), b = getRandomInt(10, 25), c = getRandomInt(10, 25), total = a + b + c;
    return {
      q: `Ένα τριγωνικό παρτέρι έχει πλευρές ${a} m, ${b} m και ${c} m. Πόσα μέτρα περίφραξης χρειαζόμαστε συνολικά;`,
      correct: `${total} m`,
      wrongs: [`${a + b} m`, `${2 * (a + b)} m`, `${a + c} m`],
      explainText: `Προσθέτουμε τις 3 πλευρές του τριγώνου: ${a} ＋ ${b} ＋ ${c} ＝ ${total} m.`
    };
  },
  () => {
    const s = getRandomInt(12, 30), c = 3 * s;
    return {
      q: `Ένα ισόπλευρο τριγωνικό σήμα οδικής κυκλοφορίας έχει πλευρά ${s} cm. Πόση είναι η περίμετρός του;`,
      correct: `${c} cm`,
      wrongs: [`${s * 2} cm`, `${s * 4} cm`, `${s + 3} cm`],
      explainText: `Το ισόπλευρο τρίγωνο έχει 3 ίσες πλευρές: 3 · ${s} ＝ ${c} cm.`
    };
  },
  () => {
    const s = getRandomInt(5, 12), c = 5 * s;
    return {
      q: `Ένα κανονικό πεντάγωνο παρτέρι έχει 5 ίσες πλευρές μήκους ${s} m η καθεμία. Πόση είναι η περίμετρός του;`,
      correct: `${c} m`,
      wrongs: [`${s * 4} m`, `${s * 6} m`, `${s + 5} m`],
      explainText: `Το κανονικό πεντάγωνο έχει 5 ίσες πλευρές: 5 · ${s} ＝ ${c} m.`
    };
  },
  () => {
    const s = getRandomInt(4, 10), c = 6 * s;
    return {
      q: `Ένα κανονικό εξάγωνο κιόσκι έχει 6 ίσες πλευρές μήκους ${s} m. Πόσα μέτρα είναι ολόκληρος ο γύρος του κιόσκι;`,
      correct: `${c} m`,
      wrongs: [`${s * 5} m`, `${s * 4} m`, `${s * 8} m`],
      explainText: `Το κανονικό εξάγωνο έχει 6 ίσες πλευρές: 6 · ${s} ＝ ${c} m.`
    };
  },
  () => {
    const s = getRandomInt(8, 20), c = 3 * s;
    return {
      q: `Μια τριγωνική ισόπλευρη σημαία έχει μήκος πλευράς ${s} cm. Πόσο ρέλι χρειαζόμαστε γύρω-γύρω;`,
      correct: `${c} cm`,
      wrongs: [`${s * 2} cm`, `${s * 4} cm`, `${s + 12} cm`],
      explainText: `Η περίμετρος της ισόπλευρης σημαίας είναι: 3 · ${s} ＝ ${c} cm.`
    };
  },
  () => {
    const a = getRandomInt(8, 15), b = getRandomInt(10, 20), total = 2 * a + b;
    return {
      q: `Ένα ισοσκελές τριγωνικό οικόπεδο έχει δύο ίσες πλευρές από ${a} m και βάση ${b} m. Πόση είναι η περίμετρός του;`,
      correct: `${total} m`,
      wrongs: [`${2 * a} m`, `${2 * b + a} m`, `${a + b} m`],
      explainText: `Στο ισοσκελές τρίγωνο προσθέτουμε τις 2 ίσες πλευρές και τη βάση: (2 · ${a}) ＋ ${b} ＝ ${total} m.`
    };
  },
  () => {
    const s = getRandomInt(10, 25), c = 8 * s;
    return {
      q: `Ένα κανονικό οκτάγωνο σήμα «STOP» έχει 8 ίσες πλευρές μήκους ${s} cm. Πόση είναι η περίμετρός του;`,
      correct: `${c} cm`,
      wrongs: [`${s * 6} cm`, `${s * 4} cm`, `${s + 8} cm`],
      explainText: `Το κανονικό οκτάγωνο έχει 8 ίσες πλευρές: 8 · ${s} ＝ ${c} cm.`
    };
  }
];

// ----------------------------------------------------
// ΔΕΞΑΜΕΝΗ 30+ ΠΡΟΤΑΣΕΩΝ ΣΩΣΤΟΥ / ΛΑΘΟΥΣ
// (Χωρίς «Σωστά!» ή «Λάθος!» στο κείμενο εξήγησης)
// ----------------------------------------------------
const TRUE_FALSE_POOL = [
  // 1-10: Θεμελιώδεις ορισμοί & Βασικοί κανόνες
  {
    q: 'Η περίμετρος ενός σχήματος είναι το συνολικό μήκος του εξωτερικού περιγράμματός του.',
    correct: 'Σωστό',
    explain: 'Η περίμετρος ισούται με το άθροισμα των μηκών όλων των εξωτερικών πλευρών ενός σχήματος.'
  },
  {
    q: 'Για να βρούμε την περίμετρο οποιουδήποτε πολυγώνου, προσθέτουμε τα μήκη όλων των πλευρών του.',
    correct: 'Σωστό',
    explain: 'Ο βασικός κανόνας υπολογισμού της περιμέτρου είναι η πρόσθεση όλων των πλευρών.'
  },
  {
    q: 'Η περίμετρος εκφράζεται πάντοτε σε μονάδες μέτρησης μήκους (π.χ. μέτρα, εκατοστά, χιλιοστά).',
    correct: 'Σωστό',
    explain: 'Επειδή η περίμετρος είναι μονοδιάστατο μήκος, μετριέται σε m, dm, cm ή mm.'
  },
  {
    q: 'Η περίμετρος ενός επίπεδου σχήματος μετριέται σε τετραγωνικά μέτρα (τ.μ.).',
    correct: 'Λάθος',
    explain: 'Σε τετραγωνικές μονάδες (τ.μ., τ.εκ.) μετριέται το εμβαδόν μιας επιφάνειας και όχι η περίμετρος.'
  },
  {
    q: 'Δύο διαφορετικά γεωμετρικά σχήματα είναι αδύνατον να έχουν την ίδια περίμετρο.',
    correct: 'Λάθος',
    explain: 'Διαφορετικά σχήματα μπορούν να έχουν ίση περίμετρο (π.χ. τετράγωνο πλευράς 3 cm και ορθογώνιο 4 × 2 cm έχουν περίμετρο 12 cm).'
  },
  {
    q: 'Αν διπλασιάσουμε το μήκος όλων των πλευρών ενός σχήματος, η περίμετρός του διπλασιάζεται.',
    correct: 'Σωστό',
    explain: 'Όταν διπλασιάζεται κάθε πλευρά, διπλασιάζεται ακριβώς και το συνολικό τους άθροισμα.'
  },
  {
    q: 'Η περίμετρος εκφράζει το μέγεθος του «μέσα» μέρους (της επιφάνειας) ενός σχήματος.',
    correct: 'Λάθος',
    explain: 'Το μέγεθος της εσωτερικής επιφάνειας είναι το εμβαδόν, ενώ η περίμετρος είναι μόνο το περίγραμμα.'
  },
  {
    q: 'Όσο περισσότερες πλευρές έχει ένα πολύγωνο, τόσο μεγαλύτερη είναι υποχρεωτικά η περίμετρός του.',
    correct: 'Λάθος',
    explain: 'Η περίμετρος εξαρτάται από το μήκος των πλευρών και όχι από το πλήθος τους.'
  },
  {
    q: 'Αν ένα σχήμα έχει πλευρές εκφρασμένες σε εκατοστά (cm), η περίμετρός του υπολογίζεται επίσης σε εκατοστά (cm).',
    correct: 'Σωστό',
    explain: 'Η περίμετρος διατηρεί την ίδια ακριβώς μονάδα μέτρησης μήκους με τις πλευρές του σχήματος.'
  },
  {
    q: 'Περίμετρος είναι η απόσταση που διανύουμε αν κάνουμε έναν πλήρη γύρο γύρω από τα όρια ενός σχήματος.',
    correct: 'Σωστό',
    explain: 'Αυτός είναι ο πρακτικός και διαισθητικός ορισμός της περιμέτρου στην καθημερινή ζωή.'
  },

  // 11-20: Τετράγωνα & Ορθογώνια
  {
    q: 'Για να βρούμε την περίμετρο ενός τετραγώνου, αρκεί να πολλαπλασιάσουμε το μήκος της μίας πλευράς επί 4.',
    correct: 'Σωστό',
    explain: 'Επειδή το τετράγωνο έχει 4 ίσες πλευρές, ισχύει Π ＝ 4 · πλευρά.'
  },
  {
    q: 'Για να βρούμε την περίμετρο ενός ορθογωνίου, προσθέτουμε το μήκος και το πλάτος του μόνο μία φορά.',
    correct: 'Λάθος',
    explain: 'Το ορθογώνιο έχει 4 πλευρές, άρα προσθέτουμε δύο φορές το μήκος και δύο φορές το πλάτος.'
  },
  {
    q: 'Αν ένα τετράγωνο έχει πλευρά 5 cm, η περίμετρός του είναι 20 cm.',
    correct: 'Σωστό',
    explain: 'Υπολογίζουμε 4 · 5 ＝ 20 cm.'
  },
  {
    q: 'Αν ένα ορθογώνιο έχει μήκος 6 cm και πλάτος 4 cm, η περίμετρός του είναι 10 cm.',
    correct: 'Λάθος',
    explain: 'Η περίμετρος του ορθογωνίου είναι (2 · 6) ＋ (2 · 4) ＝ 12 ＋ 8 ＝ 20 cm.'
  },
  {
    q: 'Αν ένα τετράγωνο έχει συνολική περίμετρο 36 cm, η πλευρά του ισούται με 9 cm.',
    correct: 'Σωστό',
    explain: 'Διαιρούμε την περίμετρο με το 4: 36 ： 4 ＝ 9 cm.'
  },
  {
    q: 'Ένα ορθογώνιο με μήκος 5 cm και πλάτος 3 cm έχει την ίδια περίμετρο με ένα τετράγωνο πλευράς 4 cm.',
    correct: 'Σωστό',
    explain: 'Το ορθογώνιο έχει περίμετρο 2·(5＋3) ＝ 16 cm και το τετράγωνο 4·4 ＝ 16 cm.'
  },
  {
    q: 'Αν γνωρίζουμε την περίμετρο ενός τετραγώνου, βρίσκουμε την πλευρά του διαιρώντας την περίμετρο με το 4.',
    correct: 'Σωστό',
    explain: 'Το τετράγωνο έχει 4 ίσες πλευρές, επομένως η πλευρά είναι το ένα τέταρτο της περιμέτρου.'
  },
  {
    q: 'Η περίμετρος ενός τετραγώνου είναι πάντοτε τετραπλάσια από το μήκος της πλευράς του.',
    correct: 'Σωστό',
    explain: 'Ισχύει πάντοτε η σχέση Π ＝ 4 · α.'
  },

  // 21-30+: Τρίγωνα & Άλλα Πολύγωνα
  {
    q: 'Για να βρούμε την περίμετρο ενός ισόπλευρου τριγώνου, πολλαπλασιάζουμε το μήκος της μίας πλευράς του επί 3.',
    correct: 'Σωστό',
    explain: 'Το ισόπλευρο τρίγωνο έχει 3 ίσες πλευρές, επομένως Π ＝ 3 · πλευρά.'
  },
  {
    q: 'Αν ένα ισόπλευρο τρίγωνο έχει περίμετρο 27 cm, η πλευρά του είναι 9 cm.',
    correct: 'Σωστό',
    explain: 'Διαιρούμε την περίμετρο με το 3: 27 ： 3 ＝ 9 cm.'
  },
  {
    q: 'Ένα κανονικό πεντάγωνο με πλευρά 6 cm έχει περίμετρο 30 cm.',
    correct: 'Σωστό',
    explain: 'Το κανονικό πεντάγωνο έχει 5 ίσες πλευρές: 5 · 6 ＝ 30 cm.'
  },
  {
    q: 'Ένα κανονικό εξάγωνο με πλευρά 5 cm έχει περίμετρο 25 cm.',
    correct: 'Λάθος',
    explain: 'Το κανονικό εξάγωνο έχει 6 ίσες πλευρές, επομένως η περίμετρος είναι 6 · 5 ＝ 30 cm.'
  },
  {
    q: 'Σε ένα σκαληνό τρίγωνο με 3 άνισες πλευρές, η περίμετρος βρίσκεται προσθέτοντας και τις 3 πλευρές.',
    correct: 'Σωστό',
    explain: 'Η περίμετρος κάθε τριγώνου είναι πάντοτε το άθροισμα των τριών πλευρών του: a ＋ b ＋ c.'
  },
  {
    q: 'Ένας ρόμβος με πλευρά 7 cm έχει περίμετρο 28 cm.',
    correct: 'Σωστό',
    explain: 'Ο ρόμβος έχει 4 ίσες πλευρές, επομένως Π ＝ 4 · 7 ＝ 28 cm.'
  }
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
      q: `Υπολόγισε την περίμετρο του τετραγώνου με πλευρά a ＝ ${a} cm:`,
      correct,
      unit: 'cm',
      explainText: `Το τετράγωνο έχει 4 ίσες πλευρές: 4 · ${a} ＝ ${correct} cm.`,
      svg: (
        <svg className="w-52 h-32 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 120">
          <rect x="65" y="25" width="70" height="70" rx="3" fill="#f59e0b" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="3.5" />
          <text x="100" y="18" fill="#fbbf24" fontWeight="bold" fontSize="12" fontFamily="monospace" textAnchor="middle">{a} cm</text>
          <text x="145" y="65" fill="#fbbf24" fontWeight="bold" fontSize="12" fontFamily="monospace">{a} cm</text>
        </svg>
      )
    };
  } else if (shapeType === 'rectangle') {
    const a = getRandomInt(6, 15);
    const b = getRandomInt(3, a - 1);
    const correct = 2 * a + 2 * b;
    return {
      shapeType,
      q: `Υπολόγισε την περίμετρο του ορθογωνίου με μήκος ${a} cm και πλάτος ${b} cm:`,
      correct,
      unit: 'cm',
      explainText: `Στο ορθογώνιο προσθέτουμε τις απέναντι πλευρές: (2 · ${a}) ＋ (2 · ${b}) ＝ ${correct} cm.`,
      svg: (
        <svg className="w-56 h-32 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 220 120">
          <rect x="40" y="30" width="140" height="60" rx="3" fill="#f59e0b" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="3.5" />
          <text x="110" y="22" fill="#fbbf24" fontWeight="bold" fontSize="12" fontFamily="monospace" textAnchor="middle">{a} cm</text>
          <text x="190" y="65" fill="#fbbf24" fontWeight="bold" fontSize="12" fontFamily="monospace">{b} cm</text>
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
      q: `Υπολόγισε την περίμετρο του τριγώνου με πλευρές a ＝ ${a} cm, b ＝ ${b} cm, c ＝ ${c} cm:`,
      correct,
      unit: 'cm',
      explainText: `Προσθέτουμε όλες τις πλευρές του τριγώνου: ${a} ＋ ${b} ＋ ${c} ＝ ${correct} cm.`,
      svg: (
        <svg className="w-52 h-32 mx-auto bg-slate-950 rounded-2xl border border-slate-800" viewBox="0 0 200 120">
          <polygon points="100,20 40,95 160,95" fill="#f59e0b" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="3.5" strokeLinejoin="round" />
          <text x="56" y="55" fill="#fbbf24" fontWeight="bold" fontSize="11" fontFamily="monospace">{a} cm</text>
          <text x="140" y="55" fill="#fbbf24" fontWeight="bold" fontSize="11" fontFamily="monospace">{b} cm</text>
          <text x="100" y="112" fill="#fbbf24" fontWeight="bold" fontSize="11" fontFamily="monospace" textAnchor="middle">{c} cm</text>
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
      explainText: `Αφού το τετράγωνο έχει 4 ίσες πλευρές, διαιρούμε με το 4: ${perim} ： 4 ＝ ${side} cm.`
    };
  } else {
    const side = getRandomInt(5, 18);
    const perim = side * 3;
    return {
      isSquare: false,
      q: `Ένα ισόπλευρο τρίγωνο (με 3 ίσες πλευρές) έχει περίμετρο ${perim} cm. Πόσο είναι το μήκος της κάθε πλευράς του;`,
      correct: side,
      unit: 'cm',
      explainText: `Αφού το ισόπλευρο τρίγωνο έχει 3 ίσες πλευρές, διαιρούμε με το 3: ${perim} ： 3 ＝ ${side} cm.`
    };
  }
}

// 3. Προβλήματα Καθημερινότητας από τη Δεξαμενή 30+ (ΟΜΑΔΑ Α - 4 Επιλογές MCQ)
function makeRealProblemQuestion(prevQ = null) {
  let probObj;
  while (true) {
    const rawFunc = REAL_PROBLEMS_POOL[getRandomInt(0, REAL_PROBLEMS_POOL.length - 1)];
    probObj = rawFunc();
    if (!prevQ || prevQ.q !== probObj.q) break;
  }

  const options = [
    { text: probObj.correct, isCorrect: true },
    ...probObj.wrongs.slice(0, 3).map((w) => ({ text: w, isCorrect: false }))
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

  const tf1 = TRUE_FALSE_POOL[getRandomInt(0, TRUE_FALSE_POOL.length - 1)];
  let tf2;
  while (true) {
    tf2 = TRUE_FALSE_POOL[getRandomInt(0, TRUE_FALSE_POOL.length - 1)];
    if (tf2.q !== tf1.q) break;
  }

  return { q1, q2, q3, q4, q5, q6, q7: tf1, q8: tf2 };
}

export default function PerimetrosAskPage() {
  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: ''
  });
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
    setAnswers((prev) => ({ ...prev, [key]: val }));
  };

  const handleNumericInput = (key, rawVal) => {
    if (submitted) return;
    const clean = rawVal.replace(/\D/g, '');
    setAnswers((prev) => ({ ...prev, [key]: clean }));
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

  // Render Αριθμητικών Inputs (Q1 - Q4)
  const renderInputNumber = (qKey, qData, numLabel, colorClass) => {
    const isCorrect = parseInt(answers[qKey], 10) === qData.correct;
    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className={`${colorClass} text-slate-950 font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm`}>
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {qData.q}
          </h3>
        </div>

        {qData.svg && <div className="mb-4">{qData.svg}</div>}

        <div className="sm:pl-11 space-y-3">
          <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 font-mono text-base sm:text-xl font-bold text-slate-800 w-full">
            <span className="text-xs sm:text-sm font-sans font-bold text-slate-500">Περίμετρος:</span>
            <span>＝</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              id={`input-${qKey}`}
              name={`input-${qKey}`}
              placeholder="Αριθμός"
              value={answers[qKey]}
              onChange={(e) => handleNumericInput(qKey, e.target.value)}
              disabled={submitted}
              className="w-28 sm:w-36 p-2 rounded-xl border border-slate-300 font-mono text-base sm:text-xl font-black text-center text-amber-950 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-sm"
            />
            <span className="font-bold text-slate-600 font-sans text-sm sm:text-base">{qData.unit}</span>
          </div>
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {qData.explainText}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                Η σωστή απάντηση είναι <span className="font-mono font-bold text-rose-900">{formatNumber(qData.correct)} {qData.unit}</span>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Προβλημάτων Καθημερινότητας (Q5 & Q6, 4 Επιλογές)
  const renderMcqQuestion = (qKey, qData, numLabel) => {
    const isCorrect = answers[qKey] === qData.correct;
    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-orange-500 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {qData.q}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:pl-11">
          {qData.options.map((opt, idx) => {
            const isSelected = answers[qKey] === opt.text;
            return (
              <label
                key={idx}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition select-none text-xs sm:text-sm ${
                  isSelected
                    ? 'border-amber-600 bg-amber-50/80 font-bold text-amber-950 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                } ${submitted ? 'cursor-default pointer-events-none' : ''}`}
              >
                <input
                  type="radio"
                  id={`${qKey}-opt-${idx}`}
                  name={qKey}
                  value={opt.text}
                  checked={isSelected}
                  onChange={() => handleInputChange(qKey, opt.text)}
                  disabled={submitted}
                  className="w-4 h-4 text-amber-600 focus:ring-amber-500 shrink-0"
                />
                <span className="leading-snug">{opt.text}</span>
              </label>
            );
          })}
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {qData.explainText}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                Η σωστή απάντηση είναι: <strong className="font-bold text-rose-900">{qData.correct}</strong>. {qData.explainText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Σωστό / Λάθος (Q7 & Q8)
  const renderTrueFalse = (qKey, qData, numLabel) => {
    const isCorrect = answers[qKey] === qData.correct;
    return (
      <div className={`bg-white p-5 sm:p-7 rounded-3xl shadow-sm border transition-all ${
        submitted
          ? (isCorrect ? 'border-emerald-500 bg-emerald-50/20' : 'border-rose-400 bg-rose-50/20')
          : 'border-slate-100'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="bg-rose-500 text-white font-black text-xs sm:text-sm w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
            {numLabel}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {qData.q}
          </h3>
        </div>

        <div className="flex gap-3 sm:pl-11">
          {['Σωστό', 'Λάθος'].map((opt) => (
            <button
              type="button"
              key={opt}
              onClick={() => handleInputChange(qKey, opt)}
              disabled={submitted}
              className={`px-6 sm:px-8 py-3 rounded-2xl font-black text-sm sm:text-base border transition active:scale-95 touch-manipulation select-none ${
                answers[qKey] === opt
                  ? (opt === 'Σωστό' ? 'bg-emerald-600 text-white border-emerald-700 shadow-md' : 'bg-rose-600 text-white border-rose-700 shadow-md')
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {submitted && (
          <div className="mt-4 sm:pl-11 text-xs sm:text-sm leading-relaxed">
            {isCorrect ? (
              <p className="text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                {qData.explain}
              </p>
            ) : (
              <p className="text-rose-700 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200/60">
                Η πρόταση είναι <strong className="font-bold text-rose-900">«{qData.correct}»</strong>: {qData.explain}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout
      title="Ασκήσεις: Υπολογισμός Περιμέτρου | LearnMaths.gr"
      description="Διαδραστικές ασκήσεις μαθηματικών Δ' Δημοτικού στην περίμετρο: υπολογισμός από σχήμα, εύρεση άγνωστης πλευράς και πρακτικά προβλήματα καθημερινότητας."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/d-dimotikou/17-perimetros"
          className="bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>📖</span> Θεωρία
        </Link>
      }
    >
      <div className="space-y-8">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              Δ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight pt-1">
              📝 Ασκήσεις: Υπολογισμός Περιμέτρου
            </h1>
            <p className="text-amber-100 text-xs sm:text-sm md:text-base">
              Πατώντας «Νέες Ασκήσεις», τα σχήματα και τα προβλήματα ανανεώνονται αυτόματα από τη δεξαμενή!
            </p>
          </div>

          <button
            onClick={loadNewQuestions}
            className="bg-white text-slate-900 font-black px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-lg hover:bg-amber-50 transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            🔄 Νέες Ασκήσεις
          </button>
        </div>

        {/* ΦΟΡΜΑ ΜΕ ΑΣΚΗΣΕΙΣ & PB SAFE AREA ΓΙΑ ΤΟ BOTTOM SCORE BAR */}
        <form onSubmit={handleSubmit} className="space-y-6 pb-28 sm:pb-32">
          {renderInputNumber('q1', questions.q1, 1, 'bg-amber-400')}
          {renderInputNumber('q2', questions.q2, 2, 'bg-amber-400')}

          {renderInputNumber('q3', questions.q3, 3, 'bg-amber-500')}
          {renderInputNumber('q4', questions.q4, 4, 'bg-amber-500')}

          {renderMcqQuestion('q5', questions.q5, 5)}
          {renderMcqQuestion('q6', questions.q6, 6)}

          {renderTrueFalse('q7', questions.q7, 7)}
          {renderTrueFalse('q8', questions.q8, 8)}

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="text-center pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white text-base sm:text-lg font-black px-10 py-4 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95"
              >
                🎯 Έλεγχος Απαντήσεων
              </button>
            </div>
          )}
        </form>
      </div>

      {/* STICKY FOOTER SCORES & FEEDBACK BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 z-50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-base sm:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆 Σκορ:</span>
              <span className="text-xl sm:text-2xl font-mono">{score} / 8</span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                Επιτυχία: <span className="text-emerald-400 font-black">{Math.round((score / 8) * 100)}%</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                onClick={loadNewQuestions}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2 rounded-xl shadow-md transition text-xs sm:text-sm flex items-center gap-2"
              >
                <span>🔄</span> Νέες Ασκήσεις
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">
                Συμπλήρωσε τις ασκήσεις και πάτα «Έλεγχος Απαντήσεων»!
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
