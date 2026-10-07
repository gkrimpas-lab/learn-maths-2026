// pages/st-dimotikou/66-epanalipsi-4.js
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { LAYOUT } from '../../shared/layout-config';

// ---------------------------------------------------------
// ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ & DEFENSIVE CHECKS
// ---------------------------------------------------------

function randInt(min, max) {
  const low = Math.ceil(min);
  const high = Math.floor(max);
  return Math.floor(Math.random() * (high - low + 1)) + low;
}

function shuffle(array) {
  if (!Array.isArray(array)) return [];
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function toCleanUppercase(str) {
  if (!str) return '';
  const cleaned = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
  return cleaned.replace(/\bΣΤ\b/g, "ΣΤ'");
}

function formatNum(num) {
  if (num === null || num === undefined || isNaN(Number(num))) return '0';
  return Number(num).toLocaleString('el-GR');
}

// ---------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΕΡΩΤΗΣΕΩΝ ΑΝΑ ΕΝΟΤΗΤΑ (ΚΕΦ. 55 ΕΩΣ 65)
// Τουλάχιστον 8 εκδοχές ανά ενότητα με δυναμικά νούμερα
// ---------------------------------------------------------

// ΚΕΦΑΛΑΙΟ 55: ΜΟΝΑΔΕΣ ΜΕΤΡΗΣΗΣ ΜΗΚΟΥΣ & ΜΕΤΑΤΡΟΠΕΣ
const POOL_CH55 = [
  () => {
    const m = randInt(3, 15);
    const cm = m * 100;
    return {
      title: 'Κεφ. 55 • Μήκος (m σε cm)',
      prompt: `Πόσα εκατοστά (cm) είναι τα ${m} μέτρα (m);`,
      type: 'input',
      correct: String(cm),
      explain: `1 m ＝ 100 cm. Άρα: ${m} · 100 ＝ ${cm} cm.`
    };
  },
  () => {
    const km = randInt(2, 8);
    const m = km * 1000;
    return {
      title: 'Κεφ. 55 • Μήκος (km σε m)',
      prompt: `Πόσα μέτρα (m) είναι τα ${km} χιλιόμετρα (km);`,
      type: 'input',
      correct: String(m),
      explain: `1 km ＝ 1.000 m. Άρα: ${km} · 1.000 ＝ ${m} m.`
    };
  },
  () => {
    const mm = randInt(250, 850);
    const cm = (mm / 10).toFixed(1).replace('.', ',');
    return {
      title: 'Κεφ. 55 • Μήκος (mm σε cm)',
      prompt: `Μετάτρεψε τα ${mm} χιλιοστά (mm) σε εκατοστά (cm):`,
      type: 'input',
      correct: cm,
      explain: `1 cm ＝ 10 mm. Άρα διαιρούμε με το 10: ${mm} : 10 ＝ ${cm} cm.`
    };
  },
  () => {
    const m = randInt(4, 9);
    const cm = randInt(15, 85);
    const totalCm = m * 100 + cm;
    return {
      title: 'Κεφ. 55 • Σύνθετο Μήκος',
      prompt: `Πόσα εκατοστά (cm) είναι συνολικά τα ${m} m και ${cm} cm;`,
      type: 'input',
      correct: String(totalCm),
      explain: `(${m} · 100) ＋ ${cm} ＝ ${m * 100} ＋ ${cm} ＝ ${totalCm} cm.`
    };
  },
  () => {
    const isTrue = Math.random() > 0.5;
    return {
      title: 'Κεφ. 55 • Θεωρία Μήκους',
      prompt: isTrue
        ? '«Το δεκατόμετρο (dm) είναι 10 φορές μικρότερο από το μέτρο (1 m ＝ 10 dm).»'
        : '«Το δεκατόμετρο (dm) είναι 100 φορές μεγαλύτερο από το μέτρο.»',
      type: 'tf',
      correct: isTrue,
      explain: isTrue ? 'Σωστά! 1 m ＝ 10 dm ＝ 100 cm.' : 'Λάθος! 1 m ＝ 10 dm (το δεκατόμετρο είναι υποδιαίρεση του μέτρου).'
    };
  },
  () => {
    const m = randInt(350, 850);
    const km = (m / 1000).toFixed(3).replace('.', ',');
    return {
      title: 'Κεφ. 55 • Μέτρα σε Χιλιόμετρα',
      prompt: `Πόσα χιλιόμετρα (km) είναι τα ${m} μέτρα;`,
      type: 'input',
      correct: km,
      explain: `Διαιρούμε με το 1.000: ${m} : 1.000 ＝ ${km} km.`
    };
  },
  () => {
    const dm = randInt(15, 60);
    const cm = dm * 10;
    return {
      title: 'Κεφ. 55 • Δεκατόμετρα σε Εκατοστά',
      prompt: `Πόσα εκατοστά (cm) είναι τα ${dm} δεκατόμετρα (dm);`,
      type: 'input',
      correct: String(cm),
      explain: `1 dm ＝ 10 cm. Άρα: ${dm} · 10 ＝ ${cm} cm.`
    };
  },
  () => {
    const a = randInt(12, 35);
    const b = randInt(8, 25);
    const peri = 2 * (a + b);
    return {
      title: 'Κεφ. 55 • Περίμετρος Ορθογωνίου',
      prompt: `Ένα ορθογώνιο έχει μήκος ${a} m και πλάτος ${b} m. Πόση είναι η περίμετρός του (σε m);`,
      type: 'input',
      correct: String(peri),
      explain: `Π ＝ 2 · (${a} ＋ ${b}) ＝ 2 · ${a + b} ＝ ${peri} m.`
    };
  }
];

// ΚΕΦΑΛΑΙΟ 56: ΜΟΝΑΔΕΣ ΜΕΤΡΗΣΗΣ ΕΠΙΦΑΝΕΙΑΣ (ΕΜΒΑΔΟΝ)
const POOL_CH56 = [
  () => {
    const sqm = randInt(2, 8);
    const sqcm = sqm * 10000;
    return {
      title: 'Κεφ. 56 • Επιφάνεια (τ.μ. σε τ.εκ.)',
      prompt: `Πόσα τετραγωνικά εκατοστά (τ.εκ. / cm²) είναι τα ${sqm} τετραγωνικά μέτρα (τ.μ. / m²);`,
      type: 'input',
      correct: String(sqcm),
      explain: `1 m² ＝ 100 · 100 ＝ 10.000 cm². Άρα: ${sqm} · 10.000 ＝ ${sqcm} cm².`
    };
  },
  () => {
    const stremma = randInt(3, 12);
    const sqm = stremma * 1000;
    return {
      title: 'Κεφ. 56 • Στρέμματα σε τ.μ.',
      prompt: `Πόσα τετραγωνικά μέτρα (τ.μ.) είναι τα ${stremma} στρέμματα;`,
      type: 'input',
      correct: String(sqm),
      explain: `1 στρέμμα ＝ 1.000 τ.μ. Άρα: ${stremma} · 1.000 ＝ ${sqm} τ.μ.`
    };
  },
  () => {
    const a = randInt(6, 15);
    const area = a * a;
    return {
      title: 'Κεφ. 56 • Εμβαδόν Τετραγώνου',
      prompt: `Ένα τετράγωνο οικόπεδο έχει πλευρά ${a} m. Πόσο είναι το εμβαδόν του σε τ.μ.;`,
      type: 'input',
      correct: String(area),
      explain: `Ε ＝ α · α ＝ ${a} · ${a} ＝ ${area} τ.μ.`
    };
  },
  () => {
    const a = randInt(10, 25);
    const b = randInt(4, 12);
    const area = a * b;
    return {
      title: 'Κεφ. 56 • Εμβαδόν Ορθογωνίου',
      prompt: `Ένα ορθογώνιο δωμάτιο έχει διαστάσεις ${a} m επί ${b} m. Πόσο είναι το εμβαδόν του;`,
      type: 'input',
      correct: String(area),
      explain: `Ε ＝ μήκος · πλάτος ＝ ${a} · ${b} ＝ ${area} τ.μ.`
    };
  },
  () => {
    const isTrue = Math.random() > 0.5;
    return {
      title: 'Κεφ. 56 • Σχέση Μονάδων Επιφάνειας',
      prompt: isTrue
        ? '«Στις μονάδες επιφάνειας, κάθε μονάδα είναι 100 φορές μεγαλύτερη από την αμέσως μικρότερή της (π.χ. 1 m² ＝ 100 dm²).»'
        : '«Στις μονάδες επιφάνειας, κάθε μονάδα είναι 10 φορές μεγαλύτερη από την αμέσως μικρότερή της.»',
      type: 'tf',
      correct: isTrue,
      explain: isTrue ? 'Σωστά! Επειδή μετράμε δύο διαστάσεις: 10 · 10 ＝ 100.' : 'Λάθος! Στις επιφάνειες οι μετατροπές γίνονται με το 100 (1 m² ＝ 100 dm²).'
    };
  },
  () => {
    const sqm = randInt(2500, 7500);
    const str = (sqm / 1000).toFixed(1).replace('.', ',');
    return {
      title: 'Κεφ. 56 • τ.μ. σε Στρέμματα',
      prompt: `Ένα αγροτεμάχιο έχει εμβαδόν ${sqm} τ.μ. Πόσα στρέμματα είναι;`,
      type: 'input',
      correct: str,
      explain: `Διαιρούμε με το 1.000: ${sqm} : 1.000 ＝ ${str} στρέμματα.`
    };
  },
  () => {
    const base = randInt(8, 16);
    const height = randInt(5, 12);
    const area = (base * height) / 2;
    return {
      title: 'Κεφ. 56 • Εμβαδόν Τριγώνου',
      prompt: `Ένα τρίγωνο έχει βάση ${base} cm και αντίστοιχο ύψος ${height} cm. Πόσο είναι το εμβαδόν του (σε cm²);`,
      type: 'input',
      correct: String(area),
      explain: `Ε ＝ (βάση · ύψος) : 2 ＝ (${base} · ${height}) : 2 ＝ ${base * height} : 2 ＝ ${area} cm².`
    };
  },
  () => {
    const sqdm = randInt(4, 15);
    const sqcm = sqdm * 100;
    return {
      title: 'Κεφ. 56 • dm² σε cm²',
      prompt: `Πόσα τετραγωνικά εκατοστά (cm²) είναι τα ${sqdm} τετραγωνικά δεκατόμετρα (dm²);`,
      type: 'input',
      correct: String(sqcm),
      explain: `1 dm² ＝ 100 cm². Άρα: ${sqdm} · 100 ＝ ${sqcm} cm².`
    };
  }
];

// ΚΕΦΑΛΑΙΟ 57: ΟΓΚΟΣ & ΧΩΡΗΤΙΚΟΤΗΤΑ
const POOL_CH57 = [
  () => {
    const l = randInt(2, 9);
    const ml = l * 1000;
    return {
      title: 'Κεφ. 57 • Λίτρα σε ml',
      prompt: `Πόσα χιλιοστόλιτρα (ml) είναι τα ${l} λίτρα (L);`,
      type: 'input',
      correct: String(ml),
      explain: `1 L ＝ 1.000 ml. Άρα: ${l} · 1.000 ＝ ${ml} ml.`
    };
  },
  () => {
    const a = randInt(3, 7);
    const vol = a * a * a;
    return {
      title: 'Κεφ. 57 • Όγκος Κύβου',
      prompt: `Ένας κύβος έχει ακμή ${a} cm. Πόσος είναι ο όγκος του σε κυβικά εκατοστά (cm³);`,
      type: 'input',
      correct: String(vol),
      explain: `V ＝ α · α · α ＝ ${a} · ${a} · ${a} ＝ ${vol} cm³.`
    };
  },
  () => {
    const a = randInt(4, 8);
    const b = randInt(3, 5);
    const c = randInt(2, 4);
    const vol = a * b * c;
    return {
      title: 'Κεφ. 57 • Ορθογώνιο Παραλληλεπίπεδο',
      prompt: `Ένα κουτί έχει μήκος ${a} cm, πλάτος ${b} cm και ύψος ${c} cm. Πόσος είναι ο όγκος του (σε cm³);`,
      type: 'input',
      correct: String(vol),
      explain: `V ＝ μήκος · πλάτος · ύψος ＝ ${a} · ${b} · ${c} ＝ ${vol} cm³.`
    };
  },
  () => {
    const isTrue = Math.random() > 0.5;
    return {
      title: 'Κεφ. 57 • Σχέση Όγκου & Χωρητικότητας',
      prompt: isTrue
        ? '«1 κυβικό δεκατόμετρο (1 dm³) καθαρού νερού χωράει ακριβώς 1 λίτρο (1 L).»'
        : '«1 κυβικό μέτρο (1 m³) χωράει ακριβώς 1 λίτρο νερού.»',
      type: 'tf',
      correct: isTrue,
      explain: isTrue ? 'Σωστά! 1 dm³ ＝ 1 L και 1 m³ ＝ 1.000 L.' : 'Λάθος! 1 m³ χωράει 1.000 λίτρα (1 dm³ ＝ 1 L).'
    };
  },
  () => {
    const cbm = randInt(2, 6);
    const liters = cbm * 1000;
    return {
      title: 'Κεφ. 57 • Κυβικά Μέτρα σε Λίτρα',
      prompt: `Πόσα λίτρα (L) νερού χωράει μια δεξαμενή όγκου ${cbm} m³;`,
      type: 'input',
      correct: String(liters),
      explain: `1 m³ ＝ 1.000 L. Άρα: ${cbm} · 1.000 ＝ ${liters} L.`
    };
  },
  () => {
    const ml = randInt(1500, 4500);
    const l = (ml / 1000).toFixed(2).replace('.', ',');
    return {
      title: 'Κεφ. 57 • ml σε Λίτρα',
      prompt: `Μετάτρεψε τα ${ml} ml σε λίτρα (L):`,
      type: 'input',
      correct: l,
      explain: `Διαιρούμε με το 1.000: ${ml} : 1.000 ＝ ${l} L.`
    };
  },
  () => {
    const cbdm = randInt(3, 10);
    const cbcm = cbdm * 1000;
    return {
      title: 'Κεφ. 57 • dm³ σε cm³',
      prompt: `Πόσα κυβικά εκατοστά (cm³) είναι τα ${cbdm} κυβικά δεκατόμετρα (dm³);`,
      type: 'input',
      correct: String(cbcm),
      explain: `1 dm³ ＝ 1.000 cm³. Άρα: ${cbdm} · 1.000 ＝ ${cbcm} cm³.`
    };
  },
  () => {
    const options = shuffle([...new Set(['1.000 φορές μεγαλύτερη', '100 φορές μεγαλύτερη', '10 φορές μεγαλύτερη', '10.000 φορές μεγαλύτερη'])]);
    return {
      title: 'Κεφ. 57 • Κλίμακα Μονάδων Όγκου',
      prompt: 'Στις μονάδες μέτρησης όγκου, κάθε μονάδα είναι από την αμέσως μικρότερή της:',
      type: 'mcq',
      options,
      correct: '1.000 φορές μεγαλύτερη',
      explain: 'Επειδή έχουμε 3 διαστάσεις: 10 · 10 · 10 ＝ 1.000.'
    };
  }
];

// ΚΕΦΑΛΑΙΟ 58: ΚΛΙΜΑΚΑ ΣΕ ΧΑΡΤΕΣ & ΣΧΕΔΙΑ
const POOL_CH58 = [
  () => {
    const cm = randInt(3, 8);
    const scale = 100000;
    const realKm = (cm * scale) / 100000;
    return {
      title: 'Κεφ. 58 • Κλίμακα Χάρτη 1:100.000',
      prompt: `Σε έναν χάρτη με κλίμακα 1:100.000, η απόσταση δύο πόλεων είναι ${cm} cm. Πόσα χιλιόμετρα (km) είναι η πραγματική απόσταση;`,
      type: 'input',
      correct: String(realKm),
      explain: `${cm} cm στον χάρτη ＝ ${cm} · 100.000 cm ＝ ${cm * 100000} cm ＝ ${realKm} km.`
    };
  },
  () => {
    const realM = randInt(15, 45);
    const scale = 100;
    const planCm = realM; // 1 m = 100 cm, so scale 1:100 means realM in cm on plan = realM
    return {
      title: 'Κεφ. 58 • Κλίμακα Κατόψεως 1:100',
      prompt: `Σε σχέδιο κτιρίου με κλίμακα 1:100, ένας τοίχος έχει πραγματικό μήκος ${realM} m. Πόσα εκατοστά (cm) θα σχεδιαστεί στο χαρτί;`,
      type: 'input',
      correct: String(planCm),
      explain: `${realM} m ＝ ${realM * 100} cm. Διαιρούμε με το 100: ${realM * 100} : 100 ＝ ${planCm} cm.`
    };
  },
  () => {
    const realKm = randInt(40, 120);
    const mapCm = realKm / 20; // for scale 1:2.000.000 -> 1cm = 20km
    return {
      title: 'Κεφ. 58 • Πραγματική Απόσταση & Χάρτης',
      prompt: `Σε χάρτη κλίμακας 1:2.000.000 (1 cm ＝ 20 km), δύο νησιά απέχουν ${realKm} km. Πόσα cm απέχουν στον χάρτη;`,
      type: 'input',
      correct: String(mapCm),
      explain: `Κάθε 1 cm αντιστοιχεί σε 20 km. Άρα: ${realKm} : 20 ＝ ${mapCm} cm.`
    };
  },
  () => {
    const options = shuffle([...new Set(['1 cm στο σχέδιο ＝ 50.000 cm στην πραγματικότητα', '1 m στο σχέδιο ＝ 50 km στην πραγματικότητα', 'Η πραγματικότητα είναι 500 φορές μεγαλύτερη', 'Το σχέδιο είναι 50.000 φορές μεγαλύτερο από την πραγματικότητα'])]);
    return {
      title: 'Κεφ. 58 • Σημασία Κλίμακας 1:50.000',
      prompt: 'Τι σημαίνει ότι ένας χάρτης έχει κλίμακα 1:50.000;',
      type: 'mcq',
      options,
      correct: '1 cm στο σχέδιο ＝ 50.000 cm στην πραγματικότητα',
      explain: 'Η κλίμακα δηλώνει ότι 1 μονάδα μήκους στον χάρτη αντιστοιχεί σε 50.000 ίδιες μονάδες στην πραγματικότητα.'
    };
  },
  () => {
    const isTrue = Math.random() > 0.5;
    return {
      title: 'Κεφ. 58 • Θεωρία Κλίμακας',
      prompt: isTrue
        ? '«Η κλίμακα είναι ο λόγος του μήκους στο σχέδιο προς το πραγματικό μήκος: Κλίμακα ＝ Μήκος σχεδίου : Πραγματικό μήκος.»'
        : '«Η κλίμακα είναι το γινόμενο του σχεδίου επί την πραγματική απόσταση.»',
      type: 'tf',
      correct: isTrue,
      explain: isTrue ? 'Σωστά! Κλίμακα ＝ (μήκος σχεδίου) : (πραγματικό μήκος).' : 'Λάθος! Η κλίμακα είναι λόγος (διαίρεση/κλάσμα), όχι γινόμενο.'
    };
  },
  () => {
    const cm = randInt(4, 9);
    const realM = cm * 5; // 1:500 -> 1cm = 5m
    return {
      title: 'Κεφ. 58 • Κλίμακα 1:500',
      prompt: `Σε ένα τοπογραφικό διάγραμμα κλίμακας 1:500 (1 cm ＝ 5 m), μια αυλή σχεδιάστηκε με μήκος ${cm} cm. Πόσα μέτρα είναι το πραγματικό της μήκος;`,
      type: 'input',
      correct: String(realM),
      explain: `1 cm αντιστοιχεί σε 5 m. Άρα: ${cm} · 5 ＝ ${realM} m.`
    };
  },
  () => {
    const realKm = randInt(15, 60);
    const mapCm = realKm / 5; // scale 1:500.000 -> 1cm = 5km
    return {
      title: 'Κεφ. 58 • Κλίμακα 1:500.000',
      prompt: `Σε χάρτη κλίμακας 1:500.000 (1 cm ＝ 5 km), δύο χωριά απέχουν πραγματικά ${realKm} km. Πόσα εκατοστά απέχουν στον χάρτη;`,
      type: 'input',
      correct: String(mapCm),
      explain: `${realKm} : 5 ＝ ${mapCm} cm στον χάρτη.`
    };
  },
  () => {
    const options = shuffle([...new Set(['1:10.000', '1:100.000', '1:1.000.000', '1:500.000'])]);
    return {
      title: 'Κεφ. 58 • Μεγαλύτερη Κλίμακα (Λεπτομέρεια)',
      prompt: 'Ποια από τις παρακάτω κλίμακες δείχνει έναν χάρτη με τη μεγαλύτερη λεπτομέρεια (μεγαλύτερη κλίμακα);',
      type: 'mcq',
      options,
      correct: '1:10.000',
      explain: 'Όσο μικρότερος είναι ο παρονομαστής (1:10.000), τόσο μεγαλύτερη είναι η κλίμακα και τόσο περισσότερη λεπτομέρεια απεικονίζεται.'
    };
  }
];

// ΚΕΦΑΛΑΙΟ 59: ΜΕΓΕΘΥΝΣΗ & ΣΜΙΚΡΥΝΣΗ ΣΧΗΜΑΤΩΝ
const POOL_CH59 = [
  () => {
    const side = randInt(4, 9);
    const factor = 3;
    const newSide = side * factor;
    return {
      title: 'Κεφ. 59 • Μεγέθυνση Τετραγώνου',
      prompt: `Ένα τετράγωνο έχει πλευρά ${side} cm. Αν το μεγεθύνουμε με συντελεστή 3 (τριπλασιασμός διαστάσεων), πόση θα είναι η νέα πλευρά του σε cm;`,
      type: 'input',
      correct: String(newSide),
      explain: `Πολλαπλασιάζουμε το μήκος της πλευράς επί 3: ${side} · 3 ＝ ${newSide} cm.`
    };
  },
  () => {
    const side = randInt(16, 40);
    const newSide = side / 2;
    return {
      title: 'Κεφ. 59 • Σμίκρυνση στο Μισό',
      prompt: `Μια φωτογραφία έχει πλάτος ${side} cm. Αν τη σμικρύνουμε στο μισό (συντελεστής 1/2), πόσο θα είναι το νέο πλάτος της;`,
      type: 'input',
      correct: String(newSide),
      explain: `Διαιρούμε με το 2: ${side} : 2 ＝ ${newSide} cm.`
    };
  },
  () => {
    const options = shuffle([...new Set(['Τετραπλασιάζεται (2 · 2 ＝ 4 φορές)', 'Διπλασιάζεται (2 φορές)', 'Παραμένει το ίδιο', 'Οκταπλασιάζεται'])]);
    return {
      title: 'Κεφ. 59 • Εμβαδόν σε Διπλασιασμό Διαστάσεων',
      prompt: 'Αν διπλασιάσουμε όλες τις διαστάσεις ενός ορθογωνίου (μήκος και πλάτος επί 2), πόσες φορές μεγαλώνει το εμβαδόν του;',
      type: 'mcq',
      options,
      correct: 'Τετραπλασιάζεται (2 · 2 ＝ 4 φορές)',
      explain: 'Το εμβαδόν μεγαλώνει κατά το τετράγωνο του συντελεστή: 2 · 2 ＝ 4 φορές μεγαλύτερο.'
    };
  },
  () => {
    const isTrue = Math.random() > 0.5;
    return {
      title: 'Κεφ. 59 • Γωνίες σε Μεγέθυνση',
      prompt: isTrue
        ? '«Κατά τη μεγέθυνση ή σμίκρυνση ενός σχήματος, οι γωνίες του παραμένουν ακριβώς οι ίδιες.»'
        : '«Κατά τη μεγέθυνση ενός τριγώνου, οι γωνίες του μεγαλώνουν ανάλογα.»',
      type: 'tf',
      correct: isTrue,
      explain: isTrue ? 'Σωστά! Στα όμοια σχήματα οι γωνίες παραμένουν ίσες, μόνο τα μήκη των πλευρών αλλάζουν.' : 'Λάθος! Οι γωνίες δεν αλλάζουν ποτέ κατά τη μεγέθυνση ή σμίκρυνση.'
    };
  },
  () => {
    const a = randInt(5, 10);
    const b = randInt(3, 7);
    const newA = a * 2;
    const newB = b * 2;
    const newPeri = 2 * (newA + newB);
    return {
      title: 'Κεφ. 59 • Περίμετρος σε Μεγέθυνση',
      prompt: `Ένα ορθογώνιο έχει διαστάσεις ${a} cm και ${b} cm (περίμετρος ${2 * (a + b)} cm). Αν διπλασιάσουμε τις διαστάσεις του, πόση θα είναι η νέα περίμετρος;`,
      type: 'input',
      correct: String(newPeri),
      explain: `Η περίμετρος διπλασιάζεται: ${2 * (a + b)} · 2 ＝ ${newPeri} cm.`
    };
  },
  () => {
    const origL = randInt(20, 50);
    const newL = origL * 4;
    return {
      title: 'Κεφ. 59 • Τετραπλασιασμός Μήκους',
      prompt: `Μια γραμμή μήκους ${origL} cm μεγεθύνεται με συντελεστή 4. Πόσο είναι το νέο μήκος της σε cm;`,
      type: 'input',
      correct: String(newL),
      explain: `${origL} · 4 ＝ ${newL} cm.`
    };
  },
  () => {
    const options = shuffle([...new Set(['Παραμένει 60°', 'Γίνεται 120°', 'Γίνεται 180°', 'Γίνεται 30°'])]);
    return {
      title: 'Κεφ. 59 • Ισόπλευρο Τρίγωνο & Μεγέθυνση',
      prompt: 'Ένα ισόπλευρο τρίγωνο έχει γωνίες 60°. Αν διπλασιάσουμε τις πλευρές του, πόση θα είναι κάθε γωνία του νέου τριγώνου;',
      type: 'mcq',
      options,
      correct: 'Παραμένει 60°',
      explain: 'Οι γωνίες ενός ισόπλευρου τριγώνου είναι πάντα 60°, ανεξάρτητα από το μέγεθός του.'
    };
  },
  () => {
    const origSide = randInt(24, 60);
    const newSide = origSide / 3;
    return {
      title: 'Κεφ. 59 • Σμίκρυνση στο 1/3',
      prompt: `Ένα τετράγωνο πλευράς ${origSide} cm σμικρύνεται με συντελεστή 1/3. Πόση είναι η νέα πλευρά του;`,
      type: 'input',
      correct: String(newSide),
      explain: `${origSide} : 3 ＝ ${newSide} cm.`
    };
  }
];

// ΚΕΦΑΛΑΙΟ 60: ΜΟΝΑΔΕΣ ΜΕΤΡΗΣΗΣ ΒΑΡΟΥΣ (ΜΑΖΑΣ)
const POOL_CH60 = [
  () => {
    const t = randInt(2, 7);
    const kg = t * 1000;
    return {
      title: 'Κεφ. 60 • Τόνοι σε Κιλά',
      prompt: `Πόσα κιλά (kg) είναι οι ${t} τόνοι (t);`,
      type: 'input',
      correct: String(kg),
      explain: `1 t ＝ 1.000 kg. Άρα: ${t} · 1.000 ＝ ${kg} kg.`
    };
  },
  () => {
    const kg = randInt(3, 12);
    const g = kg * 1000;
    return {
      title: 'Κεφ. 60 • Κιλά σε Γραμμάρια',
      prompt: `Πόσα γραμμάρια (g) είναι τα ${kg} κιλά (kg);`,
      type: 'input',
      correct: String(g),
      explain: `1 kg ＝ 1.000 g. Άρα: ${kg} · 1.000 ＝ ${g} g.`
    };
  },
  () => {
    const gross = randInt(18, 25);
    const tare = 2;
    const net = gross - tare;
    return {
      title: 'Κεφ. 60 • Καθαρό Βάρος',
      prompt: `Ένα τελάρο με μήλα έχει μικτό βάρος ${gross} kg. Αν το άδειο τελάρο (απόβαρο) ζυγίζει ${tare} kg, ποιο είναι το καθαρό βάρος των μήλων;`,
      type: 'input',
      correct: String(net),
      explain: `Καθαρό Βάρος ＝ Μικτό Βάρος － Απόβαρο ＝ ${gross} － ${tare} ＝ ${net} kg.`
    };
  },
  () => {
    const isTrue = Math.random() > 0.5;
    return {
      title: 'Κεφ. 60 • Ορισμός Μικτού Βάρους',
      prompt: isTrue
        ? '«Μικτό βάρος ονομάζεται το συνολικό βάρος του εμπορεύματος μαζί με τη συσκευασία του (Καθαρό ＋ Απόβαρο).»'
        : '«Μικτό βάρος είναι το βάρος μόνο της συσκευασίας χωρίς το περιεχόμενο.»',
      type: 'tf',
      correct: isTrue,
      explain: isTrue ? 'Σωστά! Μικτό ＝ Καθαρό ＋ Απόβαρο.' : 'Λάθος! Το βάρος μόνο της συσκευασίας ονομάζεται απόβαρο (τάρα).'
    };
  },
  () => {
    const g = randInt(1500, 6500);
    const kg = (g / 1000).toFixed(2).replace('.', ',');
    return {
      title: 'Κεφ. 60 • Γραμμάρια σε Κιλά',
      prompt: `Μετάτρεψε τα ${g} γραμμάρια (g) σε κιλά (kg):`,
      type: 'input',
      correct: kg,
      explain: `Διαιρούμε με το 1.000: ${g} : 1.000 ＝ ${kg} kg.`
    };
  },
  () => {
    const g = randInt(3, 15);
    const mg = g * 1000;
    return {
      title: 'Κεφ. 60 • Γραμμάρια σε Χιλιοστόγραμμα',
      prompt: `Πόσα χιλιοστόγραμμα (mg) είναι τα ${g} γραμμάρια (g);`,
      type: 'input',
      correct: String(mg),
      explain: `1 g ＝ 1.000 mg. Άρα: ${g} · 1.000 ＝ ${mg} mg.`
    };
  },
  () => {
    const net = randInt(15, 30);
    const tare = 3;
    const gross = net + tare;
    return {
      title: 'Κεφ. 60 • Υπολογισμός Μικτού Βάρους',
      prompt: `Το καθαρό βάρος ενός φορτίου είναι ${net} kg και το απόβαρο είναι ${tare} kg. Πόσο είναι το μικτό βάρος σε kg;`,
      type: 'input',
      correct: String(gross),
      explain: `Μικτό ＝ Καθαρό ＋ Απόβαρο ＝ ${net} ＋ ${tare} ＝ ${gross} kg.`
    };
  },
  () => {
    const options = shuffle([...new Set(['Το χιλιόγραμμο (κιλό - kg)', 'Το γραμμάριο (g)', 'Ο τόνος (t)', 'Το χιλιοστόγραμμο (mg)'])]);
    return {
      title: 'Κεφ. 60 • Βασική Μονάδα Βάρους',
      prompt: 'Ποια είναι η βασική μονάδα μέτρησης του βάρους (μάζας) στην καθημερινή μας ζωή;',
      type: 'mcq',
      options,
      correct: 'Το χιλιόγραμμο (κιλό - kg)',
      explain: 'Βασική μονάδα μέτρησης είναι το χιλιόγραμμο (κιλό - kg).'
    };
  }
];

// ΚΕΦΑΛΑΙΟ 61: ΜΟΝΑΔΕΣ ΜΕΤΡΗΣΗΣ ΧΡΟΝΟΥ
const POOL_CH61 = [
  () => {
    const h = randInt(2, 5);
    const m = h * 60;
    return {
      title: 'Κεφ. 61 • Ώρες σε Λεπτά',
      prompt: `Πόσα λεπτά (min) είναι οι ${h} ώρες (h);`,
      type: 'input',
      correct: String(m),
      explain: `1 h ＝ 60 min. Άρα: ${h} · 60 ＝ ${m} min.`
    };
  },
  () => {
    const m = randInt(5, 25);
    const s = m * 60;
    return {
      title: 'Κεφ. 61 • Λεπτά σε Δευτερόλεπτα',
      prompt: `Πόσα δευτερόλεπτα (s) είναι τα ${m} λεπτά (min);`,
      type: 'input',
      correct: String(s),
      explain: `1 min ＝ 60 s. Άρα: ${m} · 60 ＝ ${s} s.`
    };
  },
  () => {
    const isTrue = Math.random() > 0.5;
    return {
      title: 'Κεφ. 61 • Δεκαδική Ώρα',
      prompt: isTrue
        ? '«Ο χρόνος 1,5 ώρα ισοδυναμεί με 1 ώρα και 30 λεπτά (και όχι 1 ώρα και 50 λεπτά).»'
        : '«Ο χρόνος 1,5 ώρα ισοδυναμεί με 1 ώρα και 50 λεπτά επειδή το 5 σημαίνει 50 λεπτά.»',
      type: 'tf',
      correct: isTrue,
      explain: isTrue ? 'Σωστά! Το 0,5 της ώρας είναι τα μισά των 60 λεπτών (30 min).' : 'Λάθος! 1,5 h ＝ 1 h 30 min (μισή ώρα).'
    };
  },
  () => {
    const yearPool = [
      { y: 1821, c: 19 },
      { y: 1453, c: 15 },
      { y: 1940, c: 20 },
      { y: 2024, c: 21 },
      { y: 1789, c: 18 }
    ];
    const item = yearPool[randInt(0, yearPool.length - 1)];
    return {
      title: 'Κεφ. 61 • Εύρεση Αιώνα',
      prompt: `Σε ποιον αιώνα ανήκει το έτος ${item.y}; (Γράψε μόνο τον αριθμό του αιώνα, π.χ. ${item.c}):`,
      type: 'input',
      correct: String(item.c),
      explain: `Για το έτος ${item.y}, προσθέτουμε 1 στα πρώτα ψηφία (${Math.floor(item.y / 100)} ＋ 1) ➔ ${item.c}ος αιώνας.`
    };
  },
  () => {
    const gmt = randInt(9, 14);
    const athens = gmt + 2;
    const options = shuffle([...new Set([`${athens}:00`, `${gmt}:00`, `${gmt - 2}:00`, `${athens + 2}:00`])]);
    return {
      title: 'Κεφ. 61 • Ώρα Greenwich & Αθήνα',
      prompt: `Όταν στο Greenwich (UTC 0) είναι ${gmt}:00, τι ώρα είναι στην Αθήνα (UTC+2);`,
      type: 'mcq',
      options,
      correct: `${athens}:00`,
      explain: `Η Αθήνα είναι 2 ώρες μπροστά από το Greenwich: ${gmt}:00 ＋ 2 ώρες ＝ ${athens}:00.`
    };
  },
  () => {
    const options = shuffle([...new Set(['3.600 δευτερόλεπτα', '600 δευτερόλεπτα', '6.000 δευτερόλεπτα', '60 δευτερόλεπτα'])]);
    return {
      title: 'Κεφ. 61 • Δευτερόλεπτα μίας Ώρας',
      prompt: 'Πόσα δευτερόλεπτα (s) περιέχει 1 ολόκληρη ώρα (h);',
      type: 'mcq',
      options,
      correct: '3.600 δευτερόλεπτα',
      explain: '1 h ＝ 60 min ＝ 60 · 60 s ＝ 3.600 s.'
    };
  },
  () => {
    const isTrue = Math.random() > 0.5;
    return {
      title: 'Κεφ. 61 • Δίσεκτο Έτος',
      prompt: isTrue
        ? '«Το δίσεκτο έτος έχει 366 ημέρες και συμβαίνει κάθε 4 χρόνια.»'
        : '«Το δίσεκτο έτος έχει 365 ημέρες και ο Φεβρουάριος έχει 28 ημέρες.»',
      type: 'tf',
      correct: isTrue,
      explain: isTrue ? 'Σωστά! Στο δίσεκτο έτος ο Φεβρουάριος έχει 29 ημέρες.' : 'Λάθος! Το δίσεκτο έτος έχει 366 ημέρες.'
    };
  },
  () => {
    const d = randInt(2, 6);
    const h = d * 24;
    return {
      title: 'Κεφ. 61 • Ημέρες σε Ώρες',
      prompt: `Πόσες ώρες περιέχονται σε ${d} ημέρες (24ωρα);`,
      type: 'input',
      correct: String(h),
      explain: `${d} · 24 ＝ ${h} ώρες.`
    };
  }
];

// ΚΕΦΑΛΑΙΟ 62: ΤΟ ΕΥΡΩ, ΜΕΤΑΤΡΟΠΕΣ, ΤΟΚΟΣ & ΕΠΙΤΟΚΙΟ
const POOL_CH62 = [
  () => {
    const e = randInt(3, 9);
    const c = 50;
    const totalC = e * 100 + c;
    return {
      title: 'Κεφ. 62 • Ευρώ σε Λεπτά',
      prompt: `Πόσα λεπτά είναι το χρηματικό ποσό των ${e},50 €;`,
      type: 'input',
      correct: String(totalC),
      explain: `${e},50 · 100 ＝ ${totalC} λεπτά.`
    };
  },
  () => {
    const cents = randInt(350, 850);
    const euros = (cents / 100).toFixed(2).replace('.', ',');
    return {
      title: 'Κεφ. 62 • Λεπτά σε Ευρώ',
      prompt: `Γράψε τα ${cents} λεπτά σε δεκαδική μορφή ευρώ (€):`,
      type: 'input',
      correct: euros,
      explain: `${cents} : 100 ＝ ${euros} €.`
    };
  },
  () => {
    const paid = 10;
    const cost = randInt(4, 8) + 0.4;
    const change = Number((paid - cost).toFixed(2)).toFixed(2).replace('.', ',');
    return {
      title: 'Κεφ. 62 • Ρέστα από 10€',
      prompt: `Αγοράσαμε προϊόντα αξίας ${cost.toFixed(2).replace('.', ',')} € και πληρώσαμε με χαρτονόμισμα των ${paid} €. Πόσα ρέστα θα πάρουμε;`,
      type: 'input',
      correct: change,
      explain: `${paid},00 － ${cost.toFixed(2).replace('.', ',')} ＝ ${change} €.`
    };
  },
  () => {
    const cap = 1000;
    const r = randInt(2, 5);
    const interest = (cap * r) / 100;
    return {
      title: 'Κεφ. 62 • Υπολογισμός Ετήσιου Τόκου',
      prompt: `Ένα κεφάλαιο ${cap} € κατατίθεται για 1 έτος με επιτόκιο ${r}%. Πόσο τόκο (σε €) θα αποδώσει;`,
      type: 'input',
      correct: String(interest),
      explain: `Τ ＝ (${cap} · ${r}) : 100 ＝ ${interest} €.`
    };
  },
  () => {
    const options = shuffle([...new Set(['Τ ＝ (Κ · Ε · χ) : 100', 'Τ ＝ (Κ ＋ Ε ＋ χ) : 100', 'Τ ＝ (Κ · 100) : Ε', 'Τ ＝ (Κ · Ε) : χ'])]);
    return {
      title: 'Κεφ. 62 • Τύπος Τόκου',
      prompt: 'Ποιος είναι ο σωστός τύπος για τον υπολογισμό του απλού τόκου;',
      type: 'mcq',
      options,
      correct: 'Τ ＝ (Κ · Ε · χ) : 100',
      explain: 'Ο τόκος υπολογίζεται ως Τ ＝ (Κ · Ε · χ) : 100.'
    };
  },
  () => {
    const isTrue = Math.random() > 0.5;
    return {
      title: 'Κεφ. 62 • Έννοια Επιτοκίου',
      prompt: isTrue
        ? '«Επιτόκιο είναι ο τόκος που αποδίδουν 100 € για χρονικό διάστημα 1 έτους.»'
        : '«Επιτόκιο είναι το συνολικό ποσό που καταθέτουμε στην τράπεζα.»',
      type: 'tf',
      correct: isTrue,
      explain: isTrue ? 'Σωστά! Το επιτόκιο εκφράζεται ως ποσοστό στα 100.' : 'Λάθος! Το αρχικό ποσό ονομάζεται κεφάλαιο.'
    };
  },
  () => {
    const cap = 2000;
    const r = 3;
    const total = cap + (cap * r) / 100;
    return {
      title: 'Κεφ. 62 • Τελικό Ποσό',
      prompt: `Καταθέτουμε ${cap} € με επιτόκιο ${r}% για 1 έτος (τόκος ${(cap * r) / 100} €). Πόσα χρήματα θα έχουμε συνολικά στο τέλος του έτους;`,
      type: 'input',
      correct: String(total),
      explain: `Τελικό Ποσό ＝ Κεφάλαιο ＋ Τόκος ＝ ${cap} ＋ ${(cap * r) / 100} ＝ ${total} €.`
    };
  },
  () => {
    const isTrue = Math.random() > 0.5;
    return {
      title: 'Κεφ. 62 • Δεκαδικά Λεπτά',
      prompt: isTrue
        ? '«Το ποσό 3,05 € σημαίνει 3 ευρώ και 5 λεπτά (και όχι 50 λεπτά).»'
        : '«Το ποσό 3,05 € σημαίνει 3 ευρώ και 50 λεπτά.»',
      type: 'tf',
      correct: isTrue,
      explain: isTrue ? 'Σωστά! 0,05 € ＝ 5 λεπτά. Τα 50 λεπτά γράφονται 0,50 €.' : 'Λάθος! 3,05 € σημαίνει 3 ευρώ και 5 λεπτά.'
    };
  }
];

// ΚΕΦΑΛΑΙΟ 63: ΓΕΩΜΕΤΡΙΚΑ ΜΟΤΙΒΑ & ΠΛΑΚΟΣΤΡΩΣΕΙΣ
const POOL_CH63 = [
  () => {
    const n = randInt(5, 12);
    const count = n * n;
    return {
      title: 'Κεφ. 63 • Τετραγωνικό Μοτίβο (n²)',
      prompt: `Σε ένα τετραγωνικό μοτίβο τελειών διαστάσεων ${n} επί ${n}, πόσες τελείες υπάρχουν συνολικά;`,
      type: 'input',
      correct: String(count),
      explain: `Κανόνας n · n: ${n} · ${n} ＝ ${count} τελείες.`
    };
  },
  () => {
    const options = shuffle([...new Set(['Ισόπλευρα τρίγωνα, τετράγωνα και κανονικά εξάγωνα', 'Μόνο τετράγωνα και κύκλοι', 'Κανονικά πεντάγωνα και οκτάγωνα', 'Όλα τα κανονικά πολύγωνα'])]);
    return {
      title: 'Κεφ. 63 • Κανονικές Πλακοστρώσεις',
      prompt: 'Ποια κανονικά πολύγωνα μπορούν μόνα τους να πλακοστρώσουν το επίπεδο χωρίς να αφήνουν καθόλου κενά;',
      type: 'mcq',
      options,
      correct: 'Ισόπλευρα τρίγωνα, τετράγωνα και κανονικά εξάγωνα',
      explain: 'Μόνο αυτά τα 3 κανονικά πολύγωνα έχουν γωνίες που διαιρούν ακριβώς τις 360° (60°, 90°, 120°).'
    };
  },
  () => {
    const isTrue = Math.random() > 0.5;
    return {
      title: 'Κεφ. 63 • Γωνίες Πλακόστρωσης',
      prompt: isTrue
        ? '«Σε μια πλακόστρωση χωρίς κενά, το άθροισμα των γωνιών γύρω από κάθε κοινή κορυφή ισούται πάντα με 360°.»'
        : '«Σε μια πλακόστρωση, το άθροισμα των γωνιών γύρω από κάθε κοινή κορυφή ισούται με 180°.»',
      type: 'tf',
      correct: isTrue,
      explain: isTrue ? 'Σωστά! Πρέπει να καλύπτεται πλήρης γωνία 360°.' : 'Λάθος! Πρέπει να είναι ακριβώς 360°.'
    };
  },
  () => {
    const n = randInt(6, 12);
    const matches = 3 * n + 1;
    return {
      title: 'Κεφ. 63 • Μοτίβο με Σπίρτα (3n ＋ 1)',
      prompt: `Σε μια σειρά ενωμένων τετραγώνων με σπίρτα, ο αριθμός των σπίρτων δίνεται από τον τύπο 3 · n ＋ 1. Πόσα σπίρτα χρειάζονται για n ＝ ${n} τετράγωνα;`,
      type: 'input',
      correct: String(matches),
      explain: `(3 · ${n}) ＋ 1 ＝ ${3 * n} ＋ 1 ＝ ${matches} σπίρτα.`
    };
  },
  () => {
    const isTrue = Math.random() > 0.5;
    return {
      title: 'Κεφ. 63 • Κηρήθρα Μελισσών',
      prompt: isTrue
        ? '«Οι μέλισσες κατασκευάζουν τις κηρήθρες με κανονικά εξάγωνα επειδή εξασφαλίζουν μέγιστο χώρο με ελάχιστο κερί.»'
        : '«Οι μέλισσες κατασκευάζουν κηρήθρες με κανονικά πεντάγωνα.»',
      type: 'tf',
      correct: isTrue,
      explain: isTrue ? 'Σωστά! Το εξάγωνο είναι η πιο αποδοτική δομή της φύσης.' : 'Λάθος! Χρησιμοποιούν κανονικά εξάγωνα.'
    };
  },
  () => {
    const pos = randInt(41, 69);
    const rem = pos % 4;
    const shapes = ['Τρίγωνο', 'Κύκλος', 'Τετράγωνο', 'Ρόμβος'];
    const ans = shapes[rem === 0 ? 3 : rem - 1];
    const options = shuffle([...shapes]);
    return {
      title: 'Κεφ. 63 • Κυκλικό Μοτίβο 4 Σχημάτων',
      prompt: `Σε ένα επαναλαμβανόμενο μοτίβο: Τρίγωνο, Κύκλος, Τετράγωνο, Ρόμβος (πυρήνας 4 σχημάτων), ποιο σχήμα βρίσκεται στην ${pos}η θέση;`,
      type: 'mcq',
      options,
      correct: ans,
      explain: `${pos} : 4 ＝ ${Math.floor(pos / 4)} με υπόλοιπο ${rem}. Άρα είναι το ${ans}.`
    };
  },
  () => {
    const n = randInt(8, 14);
    const res = 2 * n + 1;
    return {
      title: 'Κεφ. 63 • Αυξανόμενο Μοτίβο (2n ＋ 1)',
      prompt: `Ένα γεωμετρικό μοτίβο αυξάνεται με τον κανόνα: Πλήθος ＝ 2 · n ＋ 1. Πόσα στοιχεία έχει για n ＝ ${n};`,
      type: 'input',
      correct: String(res),
      explain: `(2 · ${n}) ＋ 1 ＝ ${2 * n} ＋ 1 ＝ ${res}.`
    };
  },
  () => {
    const options = shuffle([...new Set(['Συνεχής γραμμή που διπλώνει σε ορθές γωνίες', 'Σειρά από ομόκεντρους κύκλους', 'Τυχαία τοποθέτηση τριγώνων', 'Καμπύλες χωρίς γωνίες'])]);
    return {
      title: 'Κεφ. 63 • Αρχαιοελληνικός Μαίανδρος',
      prompt: 'Ποιο είναι το χαρακτηριστικό γνώρισμα του αρχαιοελληνικού μαιάνδρου;',
      type: 'mcq',
      options,
      correct: 'Συνεχής γραμμή που διπλώνει σε ορθές γωνίες',
      explain: 'Ο μαίανδρος είναι συνεχής διακοσμητική ταινία με ορθές γωνίες.'
    };
  }
];

// ΚΕΦΑΛΑΙΟ 64: ΑΡΙΘΜΗΤΙΚΑ ΜΟΤΙΒΑ & ΑΚΟΛΟΥΘΙΕΣ
const POOL_CH64 = [
  () => {
    const start = randInt(3, 7);
    const step = randInt(4, 7);
    const nextVal = start + 4 * step;
    return {
      title: 'Κεφ. 64 • Επόμενος Όρος (+)',
      prompt: `Βρες τον επόμενο όρο της ακολουθίας: ${start}, ${start + step}, ${start + 2 * step}, ${start + 3 * step}, ...`,
      type: 'input',
      correct: String(nextVal),
      explain: `Σε κάθε βήμα προσθέτουμε ${step}. Άρα: ${start + 3 * step} ＋ ${step} ＝ ${nextVal}.`
    };
  },
  () => {
    const start = randInt(60, 90);
    const step = randInt(5, 8);
    const nextVal = start - 4 * step;
    return {
      title: 'Κεφ. 64 • Επόμενος Όρος (－)',
      prompt: `Βρες τον επόμενο όρο της ακολουθίας: ${start}, ${start - step}, ${start - 2 * step}, ${start - 3 * step}, ...`,
      type: 'input',
      correct: String(nextVal),
      explain: `Σε κάθε βήμα αφαιρούμε ${step}. Άρα: ${start - 3 * step} － ${step} ＝ ${nextVal}.`
    };
  },
  () => {
    const n = randInt(6, 12);
    const val = 5 * n - 2;
    return {
      title: 'Κεφ. 64 • Τύπος 5ν － 2',
      prompt: `Ένα αριθμητικό μοτίβο έχει κανόνα: 5 · ν － 2. Ποια είναι η τιμή για ν ＝ ${n};`,
      type: 'input',
      correct: String(val),
      explain: `(5 · ${n}) － 2 ＝ ${5 * n} － 2 ＝ ${val}.`
    };
  },
  () => {
    const a = randInt(2, 4);
    const nextVal = a * 16;
    const options = shuffle([...new Set([String(nextVal), String(nextVal - 4), String(nextVal + 8), String(a * 12)])]);
    return {
      title: 'Κεφ. 64 • Διπλασιασμός (· 2)',
      prompt: `Ποιος είναι ο επόμενος όρος της ακολουθίας: ${a}, ${a * 2}, ${a * 4}, ${a * 8}, ...;`,
      type: 'mcq',
      options,
      correct: String(nextVal),
      explain: `Κάθε όρος διπλασιάζεται: ${a * 8} · 2 ＝ ${nextVal}.`
    };
  },
  () => {
    const isTrue = Math.random() > 0.5;
    return {
      title: 'Κεφ. 64 • Έννοια Όρου Ακολουθίας',
      prompt: isTrue
        ? '«Κάθε αριθμός σε μια ακολουθία ονομάζεται όρος και η θέση του συμβολίζεται συνήθως με ν (1ος, 2ος, ... ν-οστός).»'
        : '«Σε μια ακολουθία όρος ονομάζεται μόνο το άθροισμα όλων των αριθμών μαζί.»',
      type: 'tf',
      correct: isTrue,
      explain: isTrue ? 'Σωστά! Κάθε μεμονωμένος αριθμός είναι ένας όρος.' : 'Λάθος! Κάθε αριθμός της ακολουθίας είναι όρος.'
    };
  },
  () => {
    const mult = randInt(3, 6);
    const res = mult * 20;
    return {
      title: 'Κεφ. 64 • Υπολογισμός 20ού Όρου',
      prompt: `Στην ακολουθία των πολλαπλασίων του ${mult} (${mult}, ${mult * 2}, ${mult * 3}, ...), ποιος είναι ο 20ός όρος (ν ＝ 20);`,
      type: 'input',
      correct: String(res),
      explain: `${mult} · 20 ＝ ${res}.`
    };
  },
  () => {
    const options = shuffle([...new Set(['Κάθε όρος είναι το άθροισμα των δύο προηγούμενων', 'Σε κάθε βήμα προσθέτουμε 10', 'Κάθε όρος διπλασιάζεται', 'Όλοι οι όροι είναι ίσοι'])]);
    return {
      title: 'Κεφ. 64 • Ακολουθία Fibonacci',
      prompt: 'Ποιος είναι ο κανόνας της ακολουθίας Fibonacci (1, 1, 2, 3, 5, 8, 13, ...);',
      type: 'mcq',
      options,
      correct: 'Κάθε όρος είναι το άθροισμα των δύο προηγούμενων',
      explain: 'Κάθε αριθμός ισούται με το άθροισμα των δύο προηγούμενων (π.χ. 5 ＋ 8 ＝ 13).'
    };
  },
  () => {
    const isTrue = Math.random() > 0.5;
    return {
      title: 'Κεφ. 64 • Εύρεση Βήματος',
      prompt: isTrue
        ? '«Για να βρούμε το σταθερό βήμα μιας αριθμητικής ακολουθίας, αφαιρούμε δύο διαδοχικούς όρους: (2ος όρος) － (1ος όρος).»'
        : '«Το σταθερό βήμα υπολογίζεται πάντοτε με πολλαπλασιασμό του 1ου με τον 2ο όρο.»',
      type: 'tf',
      correct: isTrue,
      explain: isTrue ? 'Σωστά! Βήμα ＝ α(ν) － α(ν-1).' : 'Λάθος! Το βήμα υπολογίζεται με αφαίρεση.'
    };
  }
];

// ΚΕΦΑΛΑΙΟ 65: ΣΥΝΘΕΤΑ ΜΟΤΙΒΑ & ΣΧΕΣΕΙΣ ΜΕΓΕΘΩΝ
const POOL_CH65 = [
  () => {
    const a = randInt(2, 4);
    const b = a * 2 + 1;
    const c = b * 2 + 1;
    const d = c * 2 + 1;
    const nextVal = d * 2 + 1;
    return {
      title: 'Κεφ. 65 • Σύνθετος Κανόνας (· 2 ＋ 1)',
      prompt: `Βρες τον επόμενο όρο της ακολουθίας: ${a}, ${b}, ${c}, ${d}, ...`,
      type: 'input',
      correct: String(nextVal),
      explain: `Σε κάθε βήμα διπλασιάζουμε και προσθέτουμε 1: (${d} · 2) ＋ 1 ＝ ${nextVal}.`
    };
  },
  () => {
    const start = randInt(5, 9);
    const n1 = start;
    const n2 = n1 + 4;
    const n3 = n2 - 1;
    const n4 = n3 + 4;
    const n5 = n4 - 1;
    const nextVal = n5 + 4;
    return {
      title: 'Κεφ. 65 • Εναλλασσόμενο Μοτίβο (＋4, －1)',
      prompt: `Βρες τον επόμενο αριθμό της ακολουθίας: ${n1}, ${n2}, ${n3}, ${n4}, ${n5}, ...`,
      type: 'input',
      correct: String(nextVal),
      explain: `Οι πράξεις εναλλάσσονται: ＋4 και μετά －1. Άρα: ${n5} ＋ 4 ＝ ${nextVal}.`
    };
  },
  () => {
    const n = randInt(7, 14);
    const res = 3 * n + 4;
    return {
      title: 'Κεφ. 65 • Τύπος 3ν ＋ 4',
      prompt: `Ένα σύνθετο μοτίβο έχει γενικό τύπο: 3 · ν ＋ 4. Ποια είναι η τιμή για θέση ν ＝ ${n};`,
      type: 'input',
      correct: String(res),
      explain: `(3 · ${n}) ＋ 4 ＝ ${3 * n} ＋ 4 ＝ ${res}.`
    };
  },
  () => {
    const options = shuffle([...new Set(['Πολλαπλασιάζουμε επί 2 και προσθέτουμε 1', 'Προσθέτουμε σταθερά 4', 'Πολλαπλασιάζουμε επί 3', 'Αφαιρούμε 2 σε κάθε βήμα'])]);
    return {
      title: 'Κεφ. 65 • Αναγνώριση Σύνθετου Κανόνα',
      prompt: 'Ποιος είναι ο κανόνας της ακολουθίας: 3, 7, 15, 31, 63, ...;',
      type: 'mcq',
      options,
      correct: 'Πολλαπλασιάζουμε επί 2 και προσθέτουμε 1',
      explain: '3 · 2 ＋ 1 ＝ 7, 7 · 2 ＋ 1 ＝ 15, 15 · 2 ＋ 1 ＝ 31. Ο κανόνας είναι · 2 ＋ 1.'
    };
  },
  () => {
    const isTrue = Math.random() > 0.5;
    return {
      title: 'Κεφ. 65 • Θεωρία Σύνθετων Μοτίβων',
      prompt: isTrue
        ? '«Σε ένα σύνθετο μοτίβο ο κανόνας μπορεί να συνδυάζει δύο πράξεις (π.χ. πολλαπλασιασμό και πρόσθεση μαζί).»'
        : '«Σε κάθε μοτίβο η διαφορά ανάμεσα σε δύο διαδοχικούς όρους είναι πάντα ένας σταθερός αριθμός.»',
      type: 'tf',
      correct: isTrue,
      explain: isTrue ? 'Σωστά! Τα σύνθετα μοτίβα έχουν διπλούς ή εναλλασσόμενους κανόνες.' : 'Λάθος! Στα σύνθετα μοτίβα το βήμα μπορεί να μεταβάλλεται.'
    };
  },
  () => {
    const n = randInt(8, 15);
    const res = 4 * n + 5;
    return {
      title: 'Κεφ. 65 • Χρέωση (4ν ＋ 5)',
      prompt: `Μια συνδρομητική υπηρεσία χρεώνει με τον τύπο: Κόστος ＝ 4 · ν ＋ 5. Πόσο είναι το κόστος για ν ＝ ${n} χρήσεις;`,
      type: 'input',
      correct: String(res),
      explain: `(4 · ${n}) ＋ 5 ＝ ${4 * n} ＋ 5 ＝ ${res} €.`
    };
  },
  () => {
    const options = shuffle([...new Set(['4 · ν ＋ 1', '3 · ν ＋ 2', '5 · ν － 1', '2 · ν ＋ 3'])]);
    return {
      title: 'Κεφ. 65 • Εύρεση Τύπου από Πίνακα',
      prompt: 'Για ν ＝ 1 η τιμή είναι 5, για ν ＝ 2 είναι 9, για ν ＝ 3 είναι 13. Ποιος είναι ο γενικός τύπος;',
      type: 'mcq',
      options,
      correct: '4 · ν ＋ 1',
      explain: 'Το βήμα είναι 4. Για ν ＝ 1: 4 · 1 ＋ 1 ＝ 5. Άρα ο τύπος είναι 4 · ν ＋ 1.'
    };
  },
  () => {
    const isTrue = Math.random() > 0.5;
    return {
      title: 'Κεφ. 65 • Πίνακες Δύο Μεγεθών',
      prompt: isTrue
        ? '«Ένας πίνακας τιμών δύο μεγεθών μάς βοηθά να παρατηρήσουμε πώς μεταβάλλεται ένα μέγεθος καθώς αλλάζει ένα άλλο (π.χ. χρόνος και ύψος).»'
        : '«Στους πίνακες δύο μεγεθών τα δύο μεγέθη δεν συνδέονται ποτέ μεταξύ τους με μαθηματικό κανόνα.»',
      type: 'tf',
      correct: isTrue,
      explain: isTrue ? 'Σωστά! Αποτυπώνει τη μαθηματική σχέση ανάμεσα σε δύο μεταβλητές.' : 'Λάθος! Ο πίνακας κατασκευάζεται ακριβώς για να ανακαλύψουμε τον κανόνα που τα συνδέει.'
    };
  }
];

// ---------------------------------------------------------
// ΣΥΝΘΕΣΗ ΤΩΝ 22 ΕΡΩΤΗΣΕΩΝ (11 ΕΝΟΤΗΤΕΣ x 2 ΕΡΩΤΗΣΕΙΣ)
// ---------------------------------------------------------

function generate22Questions() {
  const chapterPools = [
    { pool: POOL_CH55, ch: 55 },
    { pool: POOL_CH56, ch: 56 },
    { pool: POOL_CH57, ch: 57 },
    { pool: POOL_CH58, ch: 58 },
    { pool: POOL_CH59, ch: 59 },
    { pool: POOL_CH60, ch: 60 },
    { pool: POOL_CH61, ch: 61 },
    { pool: POOL_CH62, ch: 62 },
    { pool: POOL_CH63, ch: 63 },
    { pool: POOL_CH64, ch: 64 },
    { pool: POOL_CH65, ch: 65 }
  ];

  const questionsList = [];
  let qCounter = 1;

  chapterPools.forEach(({ pool }) => {
    const shuffledPool = shuffle(pool);
    // Επιλέγουμε 2 διαφορετικές ασκήσεις από τη δεξαμενή
    const qA = shuffledPool[0]();
    const qB = shuffledPool[1] ? shuffledPool[1]() : shuffledPool[0]();

    [qA, qB].forEach((qData) => {
      questionsList.push({
        id: `q${qCounter}`,
        ...qData
      });
      qCounter += 1;
    });
  });

  return questionsList;
}

// ---------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΣΕΛΙΔΑΣ
// ---------------------------------------------------------

export default function Epanalipsi4Page() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewTest = useCallback(() => {
    const qList = generate22Questions();
    setQuestions(qList);
    const initialAnswers = {};
    qList.forEach(q => {
      initialAnswers[q.id] = q.type === 'tf' ? null : '';
    });
    setAnswers(initialAnswers);
    setSubmitted(false);
    setScore(0);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    loadNewTest();
  }, [loadNewTest]);

  const handleInputChange = (id, val) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [id]: val }));
  };

  const isQuestionCorrect = (q) => {
    const userVal = answers[q.id];
    if (q.type === 'input') {
      if (typeof userVal !== 'string') return false;
      const cleanUser = userVal.replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase();
      const cleanTarget = q.correct.replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase();
      const cleanAlt = q.altCorrect ? q.altCorrect.replace(/\./g, ',').replace(/\s+/g, '').trim().toLowerCase() : null;
      return cleanUser === cleanTarget || (cleanAlt && cleanUser === cleanAlt);
    }
    if (q.type === 'mcq') {
      return userVal === q.correct;
    }
    if (q.type === 'tf') {
      return userVal === q.correct;
    }
    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted || questions.length === 0) return;

    let total = 0;
    questions.forEach(q => {
      if (isQuestionCorrect(q)) total += 1;
    });

    setScore(total);
    setSubmitted(true);
  };

  const getCardStyle = (q) => {
    if (!submitted) return 'bg-white border-slate-200 shadow-sm';
    return isQuestionCorrect(q)
      ? 'bg-emerald-50/70 border-emerald-400 shadow-md ring-1 ring-emerald-400'
      : 'bg-rose-50/70 border-rose-400 shadow-md ring-1 ring-rose-400';
  };

  const answeredCount = Object.values(answers).filter(val => val !== null && val !== '').length;

  return (
    <Layout
      title="4η Επανάληψη: Κεφάλαια 55 έως 65 - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μεγάλο επαναληπτικό διαγώνισμα 22 ερωτήσεων στα Κεφάλαια 55 έως 65 (Μονάδες Μέτρησης, Χρόνος, Χρήματα, Γεωμετρικά & Αριθμητικά Μοτίβα) για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <span className="hidden sm:inline-block bg-indigo-50 border border-indigo-200 text-indigo-700 px-3.5 py-1.5 rounded-xl text-xs font-black">
          📝 22 {toCleanUppercase('Ερωτήσεις')}
        </span>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8 sm:space-y-10">

        {/* 1. HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="space-y-3 max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200">
                <span>🏆 4Η ΜΕΓΑΛΗ ΕΠΑΝΑΛΗΨΗ • ΚΕΦΑΛΑΙΑ 55 - 65 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                Επαναληπτικό Διαγώνισμα: Μετρήσεις, Μοτίβα &amp; Χρήματα
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                22 δυναμικές ερωτήσεις (2 από κάθε ενότητα 55-65) που καλύπτουν πλήρως τις Μονάδες Μέτρησης (Μήκος, Επιφάνεια, Όγκος, Βάρος, Χρόνος), την Κλίμακα, το Ευρώ &amp; τον Τόκο, καθώς και τα Γεωμετρικά, Αριθμητικά και Σύνθετα Μοτίβα!
              </p>
            </div>

            <button
              type="button"
              onClick={loadNewTest}
              className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black shadow-lg transition transform active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 shrink-0 touch-manipulation"
            >
              <span>🔄</span>
              <span>{toCleanUppercase('Νέο Διαγώνισμα')}</span>
            </button>
          </div>
        </section>

        {/* 2. ΦΟΡΜΑ ΜΕ ΤΙΣ 22 ΕΡΩΤΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 2xl:gap-8">
            {questions.map((q, idx) => {
              const qNum = idx + 1;
              return (
                <div
                  key={q.id}
                  className={`p-5 sm:p-7 rounded-3xl border flex flex-col justify-between transition-all ${getCardStyle(q)}`}
                >
                  <div>
                    {/* CARD HEADER */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-black px-3 py-1 bg-sky-100 text-sky-900 rounded-full uppercase tracking-wider">
                        {toCleanUppercase(`Ερώτηση ${qNum}`)} • {toCleanUppercase(q.title)}
                      </span>
                      {submitted && (
                        <span className="text-xl">
                          {isQuestionCorrect(q) ? '✅' : '❌'}
                        </span>
                      )}
                    </div>

                    {/* PROMPT (NO-GIVEAWAY) */}
                    <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-semibold mb-4">
                      {q.type === 'tf' ? `«${q.prompt}»` : q.prompt}
                    </p>

                    {/* INPUTS / OPTIONS */}
                    {q.type === 'mcq' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = answers[q.id] === opt;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              disabled={submitted}
                              onClick={() => handleInputChange(q.id, opt)}
                              className={`p-3 rounded-2xl text-xs sm:text-sm font-mono font-bold border text-center transition touch-manipulation active:scale-95 break-words whitespace-normal leading-snug flex items-center justify-center min-h-[48px] ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {q.type === 'input' && (
                      <div className="space-y-2 mb-3">
                        <input
                          key={`input-${q.id}`}
                          autoComplete="off"
                          spellCheck="false"
                          type="text"
                          inputMode="text"
                          disabled={submitted}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          placeholder="Γράψε την απάντηση..."
                          className="w-full p-3 bg-white border-2 border-slate-200 rounded-2xl font-bold text-center text-base sm:text-lg focus:border-indigo-500 outline-none disabled:bg-slate-100 font-mono tracking-wider shadow-inner"
                        />
                      </div>
                    )}

                    {q.type === 'tf' && (
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <button
                          type="button"
                          disabled={submitted}
                          onClick={() => handleInputChange(q.id, true)}
                          className={`py-3 rounded-2xl font-black text-xs sm:text-sm border transition touch-manipulation active:scale-95 ${
                            answers[q.id] === true
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                          }`}
                        >
                          👍 {toCleanUppercase('Σωστό')}
                        </button>
                        <button
                          type="button"
                          disabled={submitted}
                          onClick={() => handleInputChange(q.id, false)}
                          className={`py-3 rounded-2xl font-black text-xs sm:text-sm border transition touch-manipulation active:scale-95 ${
                            answers[q.id] === false
                              ? 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-300'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                          }`}
                        >
                          👎 {toCleanUppercase('Λάθος')}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* POST-SUBMISSION FEEDBACK */}
                  {submitted && (
                    <div className="mt-4 pt-3 border-t border-slate-200/70 space-y-3">
                      <div
                        className={`p-3 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed ${
                          isQuestionCorrect(q)
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-200'
                            : 'bg-rose-100 text-rose-950 border border-rose-200'
                        }`}
                      >
                        <p className="font-bold mb-1">
                          {isQuestionCorrect(q) ? '🎯 Εξαιρετικά!' : '💡 Επεξήγηση:'}
                        </p>
                        <p>{q.explain}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="flex justify-center pt-4 sm:pt-6">
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-base md:text-lg font-black px-10 py-4 rounded-2xl shadow-xl transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 touch-manipulation"
              >
                <span className="text-2xl">🎯</span>
                <span>{toCleanUppercase('Ολοκλήρωση & Βαθμολόγηση Διαγωνίσματος')}</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* 3. FIXED BOTTOM SCORE FOOTER */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 z-50">
        <div className={`${LAYOUT.CONTAINER} flex flex-col sm:flex-row justify-between items-center gap-3`}>
          
          {/* ΑΡΙΣΤΕΡΑ: SCORE & PERCENTAGE */}
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-base md:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆</span>
              <span>{submitted ? toCleanUppercase('Τελικό Σκορ') : toCleanUppercase('Απαντήθηκαν')}:</span>
              <span className="font-mono text-lg sm:text-xl md:text-2xl">
                {submitted ? `${score} / 22` : `${answeredCount} / 22`}
              </span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {toCleanUppercase('Ποσοστό')}:{' '}
                <span className="text-emerald-400 font-black text-sm sm:text-base">
                  {Math.round((score / 22) * 100)}%
                </span>
              </span>
            )}
          </div>

          {/* ΔΕΞΙΑ: GUIDANCE OR RESTART */}
          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                type="button"
                onClick={loadNewTest}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 touch-manipulation"
              >
                <span>🔄</span>
                <span>{toCleanUppercase('Νέο Διαγώνισμα με διαφορετικές ασκήσεις!')}</span>
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">
                Απάντησε και στις 22 ερωτήσεις και πάτησε «{toCleanUppercase('Ολοκλήρωση & Βαθμολόγηση')}»!
              </p>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}
