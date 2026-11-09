// pages/st-dimotikou/60-baros-ask.js
import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// ---------------------------------------------------------
// ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ & DEFENSIVE CHECKS
// ---------------------------------------------------------

function randInt(min, max) {
  const low = Math.ceil(min);
  const high = Math.floor(max);
  return Math.floor(Math.random() * (high - low + 1)) + low;
}

function shuffleArray(array) {
  if (!Array.isArray(array)) return [];
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
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

// Εγγύηση ακριβώς 4 μοναδικών επιλογών για MCQ
function makeUniqueOptions(correct, wrongCandidates) {
  const unique = new Set();
  if (correct !== undefined && correct !== null && correct !== '') {
    unique.add(String(correct));
  }
  for (const opt of wrongCandidates) {
    if (opt !== undefined && opt !== null && opt !== '') {
      unique.add(String(opt));
    }
    if (unique.size === 4) break;
  }
  let fallbackCounter = 1;
  while (unique.size < 4) {
    unique.add(`${correct} (${fallbackCounter})`);
    fallbackCounter++;
  }
  return shuffleArray(Array.from(unique));
}

// Μορφοποίηση αριθμού (ακέραιος ή δεκαδικός ανάλογα με το locale)
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

// Κανονική μορφή κλάσματος (αριθμητής πάνω, κλασματική γραμμή, παρονομαστής κάτω) - Mobile Friendly
function Fraction({ num, den, className = '' }) {
  return (
    <span
      className={`inline-flex flex-col items-center align-middle mx-1 text-center font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full ${className}`}
    >
      <span className="font-bold pb-0.5 px-1 border-b border-current break-all">{num}</span>
      <span className="font-bold pt-0.5 px-1 break-all">{den}</span>
    </span>
  );
}

// ---------------------------------------------------------
// ΔΕΞΑΜΕΝΕΣ ΠΡΟΒΛΗΜΑΤΩΝ (Q7, Q8, Q9, Q10) - "NO-GIVEAWAY" PEDAGOGY
// ---------------------------------------------------------

const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_wt_std_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const bags = randInt(4, 8);
      const bagKg = 2.5;
      const totalKg = bags * bagKg;
      const totalG = totalKg * 1000;
      const bagKgFormatted = formatNum(bagKg, locale, 1);
      const totalKgFormatted = formatNum(totalKg, locale, 1);
      const thousandFormatted = formatNum(1000, locale, 0);

      return {
        title: isEn ? 'Buying Flour and Converting to Grams' : 'Αγορά Αλευριού και Μετατροπή σε Γραμμάρια',
        prompt: isEn
          ? `A family bought ${bags} bags of flour, weighing ${bagKgFormatted} kg each. How many grams (g) of flour did they buy in total?`
          : `Μια οικογένεια αγόρασε ${bags} σακούλες αλεύρι, βάρους ${bagKgFormatted} kg η καθεμία. Πόσα γραμμάρια (g) αλεύρι αγόρασε συνολικά;`,
        unit: 'g',
        correctVal: String(totalG),
        correctText: `${formatNum(totalG, locale, 0)} g`,
        tableData: [
          {
            item: isEn ? 'Total weight in kg' : 'Βάρος σε κιλά',
            formula: `${bags} · ${bagKgFormatted} kg`,
            val: `${totalKgFormatted} kg`
          },
          {
            item: isEn ? 'Conversion factor' : 'Σχέση μονάδων',
            formula: `1 kg ＝ ${thousandFormatted} g`,
            val: thousandFormatted
          },
          {
            item: isEn ? 'Total weight in g' : 'Συνολικό βάρος σε g',
            formula: `${totalKgFormatted} · ${thousandFormatted}`,
            val: `${formatNum(totalG, locale, 0)} g`
          }
        ],
        explain: (
          <span>
            {isEn
              ? `Total weight in kg: ${bags} · ${bagKgFormatted} ＝ ${totalKgFormatted} kg. Converting to grams: ${totalKgFormatted} · ${thousandFormatted} ＝ ${formatNum(totalG, locale, 0)} g.`
              : `Συνολικό βάρος σε κιλά: ${bags} · ${bagKgFormatted} ＝ ${totalKgFormatted} kg. Μετατρέπουμε σε γραμμάρια πολλαπλασιάζοντας με το ${thousandFormatted}: ${totalKgFormatted} · ${thousandFormatted} ＝ ${formatNum(totalG, locale, 0)} g.`}
          </span>
        ),
        distractors: [
          `${formatNum(totalG + 500, locale, 0)} g`,
          `${formatNum(Math.max(500, totalG - 500), locale, 0)} g`,
          `${formatNum(totalG + 1000, locale, 0)} g`
        ]
      };
    }
  },
  {
    id: 'p_wt_std_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const grossKg = randInt(18, 25);
      const tareG = randInt(12, 18) * 100;
      const tareKg = tareG / 1000;
      const netKg = Number((grossKg - tareKg).toFixed(2));
      const grossKgFormatted = formatNum(grossKg, locale, 0);
      const tareGFormatted = formatNum(tareG, locale, 0);
      const netKgFormatted = formatNum(netKg, locale, 2);
      const tareKgFormatted = formatNum(tareKg, locale, 2);

      return {
        title: isEn ? 'Calculating Net Weight of Oranges' : 'Υπολογισμός Καθαρού Βάρους Πορτοκαλιών',
        prompt: isEn
          ? `A crate full of oranges has a gross weight of ${grossKgFormatted} kg. The empty crate (tare) weighs ${tareGFormatted} g. What is the net weight of the oranges in kilograms (kg)?`
          : `Ένα καφάσι γεμάτο πορτοκάλια έχει μικτό βάρος ${grossKgFormatted} kg. Το άδειο καφάσι (απόβαρο) ζυγίζει ${tareGFormatted} g. Ποιο είναι το καθαρό βάρος των πορτοκαλιών σε κιλά (kg);`,
        unit: 'kg',
        correctVal: netKgFormatted,
        correctText: `${netKgFormatted} kg`,
        tableData: [
          {
            item: isEn ? 'Gross weight' : 'Μικτό βάρος',
            formula: `${grossKgFormatted} kg`,
            val: `${grossKgFormatted} kg`
          },
          {
            item: isEn ? 'Tare in kg' : 'Απόβαρο σε κιλά',
            formulaNode: (
              <span className="inline-flex items-center">
                <Fraction num={tareGFormatted} den="1.000" />
                <span className="ml-1">＝ {tareKgFormatted} kg</span>
              </span>
            ),
            val: `${tareKgFormatted} kg`
          },
          {
            item: isEn ? 'Net weight' : 'Καθαρό βάρος',
            formula: `${grossKgFormatted} － ${tareKgFormatted}`,
            val: `${netKgFormatted} kg`
          }
        ],
        explain: (
          <span>
            {isEn ? 'Convert tare to kg: ' : 'Μετατρέπουμε το απόβαρο σε κιλά: '}
            <Fraction num={tareGFormatted} den="1.000" />
            {` ＝ ${tareKgFormatted} kg. `}
            {isEn
              ? `Net weight: Gross － Tare ＝ ${grossKgFormatted} － ${tareKgFormatted} ＝ ${netKgFormatted} kg.`
              : `Καθαρό βάρος: Μικτό － Απόβαρο ＝ ${grossKgFormatted} － ${tareKgFormatted} ＝ ${netKgFormatted} kg.`}
          </span>
        ),
        distractors: [
          `${formatNum(netKg + 1, locale, 2)} kg`,
          `${formatNum(Math.max(1, netKg - 1), locale, 2)} kg`,
          `${formatNum(netKg + 0.5, locale, 2)} kg`
        ]
      };
    }
  },
  {
    id: 'p_wt_std_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const cheeseG = randInt(3, 7) * 250;
      const pricePerKg = randInt(10, 16);
      const cheeseKg = cheeseG / 1000;
      const cost = Number((cheeseKg * pricePerKg).toFixed(2));
      const cheeseGFormatted = formatNum(cheeseG, locale, 0);
      const costFormatted = formatNum(cost, locale, 2);
      const cheeseKgFormatted = formatNum(cheeseKg, locale, 2);

      return {
        title: isEn ? 'Purchasing Feta Cheese and Total Cost' : 'Αγορά Φέτας και Υπολογισμός Κόστους',
        prompt: isEn
          ? `We bought ${cheeseGFormatted} g of feta cheese at €${pricePerKg} per kilogram. How many euros (€) did we pay?`
          : `Αγοράσαμε ${cheeseGFormatted} g φέτα προς ${pricePerKg} € το κιλό. Πόσα ευρώ (€) πληρώσαμε;`,
        unit: '€',
        correctVal: costFormatted,
        correctText: `${costFormatted} €`,
        tableData: [
          {
            item: isEn ? 'Weight in kg' : 'Βάρος σε κιλά',
            formulaNode: (
              <span className="inline-flex items-center">
                <Fraction num={cheeseGFormatted} den="1.000" />
                <span className="ml-1">＝ ${cheeseKgFormatted} kg</span>
              </span>
            ),
            val: `${cheeseKgFormatted} kg`
          },
          {
            item: isEn ? 'Unit price' : 'Τιμή μονάδας',
            formula: `${pricePerKg} €/kg`,
            val: `${pricePerKg} €`
          },
          {
            item: isEn ? 'Total cost' : 'Συνολικό κόστος',
            formula: `${cheeseKgFormatted} · ${pricePerKg}`,
            val: `${costFormatted} €`
          }
        ],
        explain: (
          <span>
            {isEn ? 'Convert grams to kilograms: ' : 'Μετατρέπουμε τα γραμμάρια σε κιλά: '}
            <Fraction num={cheeseGFormatted} den="1.000" />
            {` ＝ ${cheeseKgFormatted} kg. `}
            {isEn
              ? `Cost: ${cheeseKgFormatted} · ${pricePerKg} ＝ ${costFormatted} €.`
              : `Κόστος: ${cheeseKgFormatted} · ${pricePerKg} ＝ ${costFormatted} €.`}
          </span>
        ),
        distractors: [
          `${formatNum(cost + 2, locale, 2)} €`,
          `${formatNum(Math.max(1, cost - 2), locale, 2)} €`,
          `${formatNum(cost + 3.5, locale, 2)} €`
        ]
      };
    }
  },
  {
    id: 'p_wt_std_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const pills = randInt(20, 50);
      const pillMg = 250;
      const totalMg = pills * pillMg;
      const totalG = totalMg / 1000;
      const totalMgFormatted = formatNum(totalMg, locale, 0);
      const totalGFormatted = formatNum(totalG, locale, 2);

      return {
        title: isEn ? 'Total Medicine Weight in Grams' : 'Συνολικό Βάρος Φαρμάκου σε Γραμμάρια',
        prompt: isEn
          ? `A bottle contains ${pills} tablets of ${pillMg} mg each. How many grams (g) of medication are contained in total?`
          : `Ένα κουτί περιέχει ${pills} χάπια των ${pillMg} mg το καθένα. Πόσα γραμμάρια (g) φαρμάκου περιέχονται συνολικά στο κουτί;`,
        unit: 'g',
        correctVal: totalGFormatted,
        correctText: `${totalGFormatted} g`,
        tableData: [
          {
            item: isEn ? 'Total milligrams' : 'Συνολικά χιλιοστόγραμμα',
            formula: `${pills} · ${pillMg} mg`,
            val: `${totalMgFormatted} mg`
          },
          {
            item: isEn ? 'Conversion factor' : 'Σχέση μονάδων',
            formula: '1 g ＝ 1.000 mg',
            val: '1.000'
          },
          {
            item: isEn ? 'Convert to grams' : 'Μετατροπή σε γραμμάρια',
            formulaNode: (
              <span className="inline-flex items-center">
                <Fraction num={totalMgFormatted} den="1.000" />
                <span className="ml-1">＝ ${totalGFormatted} g</span>
              </span>
            ),
            val: `${totalGFormatted} g`
          }
        ],
        explain: (
          <span>
            {isEn
              ? `Total weight in milligrams: ${pills} · ${pillMg} ＝ ${totalMgFormatted} mg. Converting to grams: `
              : `Συνολικό βάρος σε χιλιοστόγραμμα: ${pills} · ${pillMg} ＝ ${totalMgFormatted} mg. Μετατρέπουμε σε γραμμάρια: `}
            <Fraction num={totalMgFormatted} den="1.000" />
            {` ＝ ${totalGFormatted} g.`}
          </span>
        ),
        distractors: [
          `${formatNum(totalG + 2.5, locale, 2)} g`,
          `${formatNum(Math.max(0.5, totalG - 2.5), locale, 2)} g`,
          `${formatNum(totalG + 5, locale, 2)} g`
        ]
      };
    }
  }
];

const HARD_PROBLEMS_POOL = [
  {
    id: 'p_wt_hard_1',
    generate: (locale) => {
      const isEn = locale === 'en';
      const crates = randInt(15, 30);
      const grossPerCrateKg = 22.5;
      const tarePerCrateG = 1500;
      const tarePerCrateKg = tarePerCrateG / 1000;
      const netPerCrateKg = grossPerCrateKg - tarePerCrateKg;
      const totalNetKg = crates * netPerCrateKg;
      const grossFormatted = formatNum(grossPerCrateKg, locale, 1);
      const tareGFormatted = formatNum(tarePerCrateG, locale, 0);
      const tareKgFormatted = formatNum(tarePerCrateKg, locale, 1);
      const netCrateFormatted = formatNum(netPerCrateKg, locale, 1);
      const totalNetKgFormatted = formatNum(totalNetKg, locale, 1);

      return {
        title: isEn ? 'Total Net Weight of Peach Crates' : 'Συνολικό Καθαρό Βάρος Τελάρων με Ροδάκινα',
        prompt: isEn
          ? `A merchant received ${crates} crates of peaches. The gross weight per crate was ${grossFormatted} kg, and the tare per empty crate was ${tareGFormatted} g. What is the total net weight of the peaches in kilograms (kg)?`
          : `Ένας έμπορος παρέλαβε ${crates} τελάρα με ροδάκινα. Το μικτό βάρος κάθε τελάρου ήταν ${grossFormatted} kg και το απόβαρο κάθε άδειου τελάρου ${tareGFormatted} g. Ποιο είναι το συνολικό καθαρό βάρος των ροδάκινων σε κιλά (kg);`,
        unit: 'kg',
        correctVal: String(totalNetKg),
        correctText: `${totalNetKgFormatted} kg`,
        tableData: [
          {
            item: isEn ? 'Tare per crate in kg' : 'Απόβαρο ανά τελάρο σε κιλά',
            formulaNode: (
              <span className="inline-flex items-center">
                <Fraction num={tareGFormatted} den="1.000" />
                <span className="ml-1">＝ ${tareKgFormatted} kg</span>
              </span>
            ),
            val: `${tareKgFormatted} kg`
          },
          {
            item: isEn ? 'Net weight per crate' : 'Καθαρό βάρος ανά τελάρο',
            formula: `${grossFormatted} － ${tareKgFormatted}`,
            val: `${netCrateFormatted} kg`
          },
          {
            item: isEn ? 'Total net weight' : 'Συνολικό καθαρό βάρος',
            formula: `${crates} · ${netCrateFormatted}`,
            val: `${totalNetKgFormatted} kg`
          }
        ],
        explain: (
          <span>
            {isEn ? 'Convert tare to kg: ' : 'Μετατρέπουμε το απόβαρο σε κιλά: '}
            <Fraction num={tareGFormatted} den="1.000" />
            {` ＝ ${tareKgFormatted} kg. `}
            {isEn
              ? `Net weight per crate: ${grossFormatted} － ${tareKgFormatted} ＝ ${netCrateFormatted} kg. Total net weight: ${crates} · ${netCrateFormatted} ＝ ${totalNetKgFormatted} kg.`
              : `Καθαρό βάρος ανά τελάρο: ${grossFormatted} － ${tareKgFormatted} ＝ ${netCrateFormatted} kg. Συνολικό καθαρό βάρος για τα ${crates} τελάρα: ${crates} · ${netCrateFormatted} ＝ ${totalNetKgFormatted} kg.`}
          </span>
        ),
        distractors: [
          `${formatNum(totalNetKg + 30, locale, 1)} kg`,
          `${formatNum(Math.max(10, totalNetKg - 25), locale, 1)} kg`,
          `${formatNum(totalNetKg + 50, locale, 1)} kg`
        ]
      };
    }
  },
  {
    id: 'p_wt_hard_2',
    generate: (locale) => {
      const isEn = locale === 'en';
      const truckLimitT = 4.2;
      const truckLimitKg = truckLimitT * 1000;
      const bagsCount = 90;
      const bagKg = 40;
      const currentLoadKg = bagsCount * bagKg;
      const remainKg = truckLimitKg - currentLoadKg;
      const remainT = remainKg / 1000;
      const truckLimitFormatted = formatNum(truckLimitT, locale, 1);
      const remainTFormatted = formatNum(remainT, locale, 2);
      const truckLimitKgFormatted = formatNum(truckLimitKg, locale, 0);
      const currentLoadKgFormatted = formatNum(currentLoadKg, locale, 0);
      const remainKgFormatted = formatNum(remainKg, locale, 0);

      return {
        title: isEn ? 'Remaining Truck Payload in Tons' : 'Υπολειπόμενο Επιτρεπόμενο Φορτίο Φορτηγού',
        prompt: isEn
          ? `A truck has a maximum allowed cargo capacity of ${truckLimitFormatted} t. It was loaded with ${bagsCount} cement bags weighing ${bagKg} kg each. How many additional tons (t) can the truck carry without exceeding the limit?`
          : `Ένα φορτηγό έχει μέγιστο επιτρεπόμενο όριο φορτίου ${truckLimitFormatted} t. Φορτώθηκαν σε αυτό ${bagsCount} τσουβάλια τσιμέντο των ${bagKg} kg το καθένα. Πόσους τόνους (t) επιπλέον φορτίου μπορεί να μεταφέρει το φορτηγό χωρίς να ξεπεράσει το όριο;`,
        unit: 't',
        correctVal: remainTFormatted,
        correctText: `${remainTFormatted} t`,
        tableData: [
          {
            item: isEn ? 'Capacity in kg' : 'Όριο σε κιλά',
            formula: `${truckLimitFormatted} · 1.000`,
            val: `${truckLimitKgFormatted} kg`
          },
          {
            item: isEn ? 'Current cargo in kg' : 'Τρέχον φορτίο σε κιλά',
            formula: `${bagsCount} · ${bagKg}`,
            val: `${currentLoadKgFormatted} kg`
          },
          {
            item: isEn ? 'Remaining in tons' : 'Υπόλοιπο σε τόνους',
            formulaNode: (
              <span className="inline-flex items-center">
                <Fraction num={remainKgFormatted} den="1.000" />
                <span className="ml-1">＝ ${remainTFormatted} t</span>
              </span>
            ),
            val: `${remainTFormatted} t`
          }
        ],
        explain: (
          <span>
            {isEn
              ? `Capacity in kg: ${truckLimitFormatted} · 1,000 ＝ ${truckLimitKgFormatted} kg. Current cargo: ${bagsCount} · ${bagKg} ＝ ${currentLoadKgFormatted} kg. Remaining: ${truckLimitKgFormatted} － ${currentLoadKgFormatted} ＝ ${remainKgFormatted} kg ＝ `
              : `Όριο σε κιλά: ${truckLimitFormatted} · 1.000 ＝ ${truckLimitKgFormatted} kg. Τρέχον φορτίο: ${bagsCount} · ${bagKg} ＝ ${currentLoadKgFormatted} kg. Υπόλοιπο σε κιλά: ${truckLimitKgFormatted} － ${currentLoadKgFormatted} ＝ ${remainKgFormatted} kg. Σε τόνους: `}
            <Fraction num={remainKgFormatted} den="1.000" />
            {` ＝ ${remainTFormatted} t.`}
          </span>
        ),
        distractors: [
          `${formatNum(remainT + 0.4, locale, 2)} t`,
          `${formatNum(Math.max(0.1, remainT - 0.2), locale, 2)} t`,
          `${formatNum(remainT + 0.8, locale, 2)} t`
        ]
      };
    }
  },
  {
    id: 'p_wt_hard_3',
    generate: (locale) => {
      const isEn = locale === 'en';
      const netKg = 120;
      const pricePerKg = 4.5;
      const totalRevenue = netKg * pricePerKg;
      const tareWeightKg = 12;
      const grossKg = netKg + tareWeightKg;
      const priceFormatted = formatNum(pricePerKg, locale, 1);
      const revenueFormatted = formatNum(totalRevenue, locale, 1);

      return {
        title: isEn ? 'Revenue from Selling Net Weight of Honey' : 'Είσπραξη από Πώληση Καθαρού Βάρους Μελιού',
        prompt: isEn
          ? `A producer sold honey at €${priceFormatted} per kilogram of net weight. If the gross weight of the containers was ${grossKg} kg and the total tare weight was ${tareWeightKg} kg, how many euros (€) did the producer receive?`
          : `Ένας παραγωγός πούλησε μέλι προς ${priceFormatted} € το κιλό καθαρού βάρους. Αν το μικτό βάρος των δοχείων ήταν ${grossKg} kg και το συνολικό απόβαρο των κενών δοχείων ${tareWeightKg} kg, πόσα ευρώ (€) εισέπραξε;`,
        unit: '€',
        correctVal: revenueFormatted,
        correctText: `${revenueFormatted} €`,
        tableData: [
          {
            item: isEn ? 'Net weight' : 'Καθαρό βάρος',
            formula: `${grossKg} － ${tareWeightKg}`,
            val: `${netKg} kg`
          },
          {
            item: isEn ? 'Unit price' : 'Τιμή ανά κιλό καθαρού',
            formula: `${priceFormatted} €/kg`,
            val: `${priceFormatted} €`
          },
          {
            item: isEn ? 'Total revenue' : 'Συνολική είσπραξη',
            formula: `${netKg} · ${priceFormatted}`,
            val: `${revenueFormatted} €`
          }
        ],
        explain: (
          <span>
            {isEn
              ? `Only net weight is paid! Net weight of honey: ${grossKg} － ${tareWeightKg} ＝ ${netKg} kg. Total revenue: ${netKg} · ${priceFormatted} ＝ ${revenueFormatted} €.`
              : `Πληρώνεται αποκλειστικά το καθαρό βάρος! Καθαρό βάρος μελιού: ${grossKg} － ${tareWeightKg} ＝ ${netKg} kg. Συνολική είσπραξη: ${netKg} · ${priceFormatted} ＝ ${revenueFormatted} €.`}
          </span>
        ),
        distractors: [
          `${formatNum(totalRevenue + 54, locale, 1)} €`,
          `${formatNum(Math.max(10, totalRevenue - 45), locale, 1)} €`,
          `${formatNum(totalRevenue + 90, locale, 1)} €`
        ]
      };
    }
  },
  {
    id: 'p_wt_hard_4',
    generate: (locale) => {
      const isEn = locale === 'en';
      const part1T = 1.8;
      const part2Kg = 750;
      const part3Kg = 450;
      const sumKg = part1T * 1000 + part2Kg + part3Kg;
      const sumT = sumKg / 1000;
      const part1Formatted = formatNum(part1T, locale, 1);
      const sumTFormatted = formatNum(sumT, locale, 2);
      const part2TFormatted = formatNum(part2Kg / 1000, locale, 3);
      const part3TFormatted = formatNum(part3Kg / 1000, locale, 3);
      const part2KgFormatted = formatNum(part2Kg, locale, 0);
      const part3KgFormatted = formatNum(part3Kg, locale, 0);

      return {
        title: isEn ? 'Total Weight of Shipments in Tons' : 'Συνολικό Βάρος Φορτίων σε Τόνους',
        prompt: isEn
          ? `A warehouse received three wheat shipments: the 1st weighed ${part1Formatted} t, the 2nd was ${part2KgFormatted} kg, and the 3rd was ${part3KgFormatted} kg. How many tons (t) of wheat were received in total?`
          : `Σε μια αποθήκη παραδόθηκαν τρία φορτία σιταριού: το 1ο ζύγιζε ${part1Formatted} t, το 2ο ${part2KgFormatted} kg και το 3ο ${part3KgFormatted} kg. Πόσους τόνους (t) σιταριού παρέλαβε συνολικά η αποθήκη;`,
        unit: 't',
        correctVal: sumTFormatted,
        correctText: `${sumTFormatted} t`,
        tableData: [
          {
            item: isEn ? '1st shipment' : '1ο Φορτίο',
            formula: `${part1Formatted} t`,
            val: `${part1Formatted} t`
          },
          {
            item: isEn ? '2nd shipment in tons' : '2ο Φορτίο σε τόνους',
            formulaNode: (
              <span className="inline-flex items-center">
                <Fraction num={part2KgFormatted} den="1.000" />
                <span className="ml-1">＝ ${part2TFormatted} t</span>
              </span>
            ),
            val: `${part2TFormatted} t`
          },
          {
            item: isEn ? '3rd shipment in tons' : '3ο Φορτίο σε τόνους',
            formulaNode: (
              <span className="inline-flex items-center">
                <Fraction num={part3KgFormatted} den="1.000" />
                <span className="ml-1">＝ ${part3TFormatted} t</span>
              </span>
            ),
            val: `${part3TFormatted} t`
          },
          {
            item: isEn ? 'Total weight' : 'Συνολικό βάρος',
            formula: `${part1Formatted} ＋ ${part2TFormatted} ＋ ${part3TFormatted}`,
            val: `${sumTFormatted} t`
          }
        ],
        explain: (
          <span>
            {isEn
              ? `Convert all shipments to tons: 1st: ${part1Formatted} t, 2nd: `
              : `Μετατρέπουμε όλα τα φορτία σε τόνους: 1ο: ${part1Formatted} t, 2ο: `}
            <Fraction num={part2KgFormatted} den="1.000" />
            {` ＝ ${part2TFormatted} t, 3ο: `}
            <Fraction num={part3KgFormatted} den="1.000" />
            {` ＝ ${part3TFormatted} t. `}
            {isEn
              ? `Total: ${part1Formatted} ＋ ${part2TFormatted} ＋ ${part3TFormatted} ＝ ${sumTFormatted} t.`
              : `Άθροισμα: ${part1Formatted} ＋ ${part2TFormatted} ＋ ${part3TFormatted} ＝ ${sumTFormatted} t.`}
          </span>
        ),
        distractors: [
          `${formatNum(sumT + 0.5, locale, 2)} t`,
          `${formatNum(Math.max(0.5, sumT - 0.5), locale, 2)} t`,
          `${formatNum(sumT + 1, locale, 2)} t`
        ]
      };
    }
  }
];

// ---------------------------------------------------------
// ΔΗΜΙΟΥΡΓΙΑ 10 ΔΥΝΑΜΙΚΩΝ ΕΡΩΤΗΣΕΩΝ
// ---------------------------------------------------------

function generateQuestions(locale) {
  const isEn = locale === 'en';

  // Q1: Input - Μετατροπή kg σε g
  const q1Kg = Number((randInt(2, 7) + pickRandom([0.2, 0.4, 0.5, 0.75])).toFixed(2));
  const q1G = Number((q1Kg * 1000).toFixed(0));
  const q1KgFormatted = formatNum(q1Kg, locale, 2);
  const q1GFormatted = formatNum(q1G, locale, 0);

  // Q2: MCQ - Βασική μονάδα μέτρησης μάζας
  const q2Correct = isEn ? 'The kilogram or kilo (kg)' : 'Το χιλιόγραμμο ή κιλό (kg)';
  const q2Distractors = [
    isEn ? 'The ton (t)' : 'Ο τόνος (t)',
    isEn ? 'The gram (g)' : 'Το γραμμάριο (g)',
    isEn ? 'The milligram (mg)' : 'Το χιλιοστόγραμμο (mg)'
  ];
  const q2Options = makeUniqueOptions(q2Correct, q2Distractors);

  // Q3: Input - Μετατροπή g σε kg
  const q3G = randInt(15, 85) * 100 + pickRandom([0, 50]);
  const q3Kg = Number((q3G / 1000).toFixed(3));
  const q3GFormatted = formatNum(q3G, locale, 0);
  const q3KgFormatted = formatNum(q3Kg, locale, 3);

  // Q4: MCQ - Σχέση Μικτού, Καθαρού και Αποβάρου
  const q4Correct = isEn
    ? 'Net Weight ＝ Gross Weight － Tare'
    : 'Καθαρό Βάρος ＝ Μικτό Βάρος － Απόβαρο';
  const q4Distractors = [
    isEn ? 'Net Weight ＝ Gross Weight ＋ Tare' : 'Καθαρό Βάρος ＝ Μικτό Βάρος ＋ Απόβαρο',
    isEn ? 'Tare ＝ Gross Weight ＋ Net Weight' : 'Απόβαρο ＝ Μικτό Βάρος ＋ Καθαρό Βάρος',
    isEn ? 'Gross Weight ＝ Net Weight － Tare' : 'Μικτό Βάρος ＝ Καθαρό Βάρος － Απόβαρο'
  ];
  const q4Options = makeUniqueOptions(q4Correct, q4Distractors);

  // Q5: Input - Μετατροπή kg σε t
  const q5Kg = randInt(12, 75) * 100;
  const q5T = Number((q5Kg / 1000).toFixed(3));
  const q5KgFormatted = formatNum(q5Kg, locale, 0);
  const q5TFormatted = formatNum(q5T, locale, 3);

  // Q6: MCQ - Ισοδυναμία υποδιαιρέσεων και πολλαπλασίων
  const q6Correct = isEn
    ? '1 t ＝ 1,000 kg and 1 kg ＝ 1,000 g'
    : '1 t ＝ 1.000 kg και 1 kg ＝ 1.000 g';
  const q6Distractors = isEn
    ? [
        '1 t ＝ 100 kg and 1 kg ＝ 100 g',
        '1 t ＝ 1,000 g and 1 kg ＝ 1,000 mg',
        '1 kg ＝ 100 g and 1 g ＝ 1,000 mg'
      ]
    : [
        '1 t ＝ 100 kg και 1 kg ＝ 100 g',
        '1 t ＝ 1.000 g και 1 kg ＝ 1.000 mg',
        '1 kg ＝ 100 g και 1 g ＝ 1.000 mg'
      ];
  const q6Options = makeUniqueOptions(q6Correct, q6Distractors);

  // Q7: Standard Problem (Input)
  const spIndex1 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q7Data = STANDARD_PROBLEMS_POOL[spIndex1].generate(locale);

  // Q8: Standard Problem (MCQ)
  let spIndex2 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  while (spIndex2 === spIndex1) spIndex2 = randInt(0, STANDARD_PROBLEMS_POOL.length - 1);
  const q8Data = STANDARD_PROBLEMS_POOL[spIndex2].generate(locale);
  const q8Options = makeUniqueOptions(q8Data.correctText, q8Data.distractors);

  // Q9: Hard Problem (Input)
  const hpIndex1 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q9Data = HARD_PROBLEMS_POOL[hpIndex1].generate(locale);

  // Q10: Hard Problem (MCQ)
  let hpIndex2 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  while (hpIndex2 === hpIndex1) hpIndex2 = randInt(0, HARD_PROBLEMS_POOL.length - 1);
  const q10Data = HARD_PROBLEMS_POOL[hpIndex2].generate(locale);
  const q10Options = makeUniqueOptions(q10Data.correctText, q10Data.distractors);

  return [
    {
      id: 'q1',
      type: 'input',
      inputType: 'number',
      title: isEn ? 'Converting Kilograms to Grams' : 'Μετατροπή από Κιλά σε Γραμμάρια',
      prompt: isEn
        ? `How many grams (g) is ${q1KgFormatted} kg?`
        : `Πόσα γραμμάρια (g) είναι τα ${q1KgFormatted} kg;`,
      correct: String(q1G),
      explain: (
        <span>
          {isEn
            ? `Since 1 kg ＝ 1,000 g, we multiply by 1,000: ${q1KgFormatted} · 1,000 ＝ ${q1GFormatted} g.`
            : `Επειδή 1 kg ＝ 1.000 g, για να μετατρέψουμε κιλά σε γραμμάρια πολλαπλασιάζουμε με το 1.000: ${q1KgFormatted} · 1.000 ＝ ${q1GFormatted} g.`}
        </span>
      )
    },
    {
      id: 'q2',
      type: 'mcq',
      title: isEn ? 'Standard Unit of Weight' : 'Βασική Μονάδα Βάρους',
      prompt: isEn
        ? 'What is the base unit of weight (mass) used in everyday life?'
        : 'Ποια είναι η βασική μονάδα μέτρησης του βάρους (μάζας) στην καθημερινή ζωή;',
      options: q2Options,
      correct: q2Correct,
      explain: (
        <span>
          {isEn
            ? 'The base unit of weight is the kilogram (kg), commonly called kilo.'
            : 'Βασική μονάδα μέτρησης του βάρους είναι το χιλιόγραμμο (kg), το οποίο συνήθως αποκαλούμε απλά κιλό.'}
        </span>
      )
    },
    {
      id: 'q3',
      type: 'input',
      inputType: 'decimal',
      title: isEn ? 'Converting Grams to Kilograms' : 'Μετατροπή από Γραμμάρια σε Κιλά',
      prompt: isEn
        ? `How many kilograms (kg) is ${q3GFormatted} g?`
        : `Πόσα κιλά (kg) είναι τα ${q3GFormatted} g;`,
      correct: q3KgFormatted,
      explain: (
        <span>
          {isEn ? 'To convert grams to kilograms we divide by 1,000: ' : 'Για να μετατρέψουμε γραμμάρια σε κιλά: '}
          <Fraction num={q3GFormatted} den="1.000" />
          {` ＝ ${q3KgFormatted} kg.`}
        </span>
      )
    },
    {
      id: 'q4',
      type: 'mcq',
      title: isEn ? 'Gross & Net Weight Formula' : 'Σχέση Καθαρού & Μικτού Βάρους',
      prompt: isEn
        ? 'What is the correct mathematical formula to calculate the net weight of a product?'
        : 'Ποιος είναι ο σωστός τύπος για τον υπολογισμό του καθαρού βάρους ενός προϊόντος;',
      options: q4Options,
      correct: q4Correct,
      explain: (
        <span>
          {isEn
            ? 'Net weight is calculated by subtracting packaging weight (tare) from gross weight: Net Weight ＝ Gross Weight － Tare.'
            : 'Το καθαρό βάρος προκύπτει αφαιρώντας το βάρος της συσκευασίας (απόβαρο) από το συνολικό βάρος (μικτό): Καθαρό Βάρος ＝ Μικτό Βάρος － Απόβαρο.'}
        </span>
      )
    },
    {
      id: 'q5',
      type: 'input',
      inputType: 'decimal',
      title: isEn ? 'Converting Kilograms to Tons' : 'Μετατροπή από Κιλά σε Τόνους',
      prompt: isEn
        ? `How many tons (t) is ${q5KgFormatted} kg?`
        : `Πόσοι τόνοι (t) είναι τα ${q5KgFormatted} kg;`,
      correct: q5TFormatted,
      explain: (
        <span>
          {isEn
            ? 'Since 1 t ＝ 1,000 kg, to convert kilograms to tons: '
            : 'Επειδή 1 t ＝ 1.000 kg, για να μετατρέψουμε κιλά σε τόνους: '}
          <Fraction num={q5KgFormatted} den="1.000" />
          {` ＝ ${q5TFormatted} t.`}
        </span>
      )
    },
    {
      id: 'q6',
      type: 'mcq',
      title: isEn ? 'Equivalence of Weight Units' : 'Ισοδυναμία Μονάδων Βάρους',
      prompt: isEn
        ? 'Which of the following equivalences is mathematically accurate?'
        : 'Ποια από τις παρακάτω σχέσεις ισοδυναμίας των μονάδων βάρους είναι σωστή;',
      options: q6Options,
      correct: q6Correct,
      explain: (
        <span>
          {isEn
            ? 'One metric ton equals exactly 1,000 kg (1 t ＝ 1,000 kg) and one kilogram equals 1,000 grams (1 kg ＝ 1,000 g).'
            : 'Ένας τόνος έχει ακριβώς 1.000 κιλά (1 t ＝ 1.000 kg) και ένα κιλό έχει ακριβώς 1.000 γραμμάρια (1 kg ＝ 1.000 g).'}
        </span>
      )
    },
    {
      id: 'q7',
      type: 'input',
      inputType: 'number',
      title: `${isEn ? 'Problem' : 'Πρόβλημα'}: ${q7Data.title}`,
      prompt: q7Data.prompt,
      correct: q7Data.correctVal,
      tableData: q7Data.tableData,
      explain: q7Data.explain
    },
    {
      id: 'q8',
      type: 'mcq',
      title: `${isEn ? 'Problem' : 'Πρόβλημα'}: ${q8Data.title}`,
      prompt: q8Data.prompt,
      options: q8Options,
      correct: q8Data.correctText,
      tableData: q8Data.tableData,
      explain: q8Data.explain
    },
    {
      id: 'q9',
      type: 'input',
      inputType: 'number',
      title: `${isEn ? 'Advanced Problem' : 'Σύνθετο Πρόβλημα'}: ${q9Data.title}`,
      prompt: q9Data.prompt,
      correct: q9Data.correctVal,
      tableData: q9Data.tableData,
      explain: q9Data.explain
    },
    {
      id: 'q10',
      type: 'mcq',
      title: `${isEn ? 'Advanced Problem' : 'Σύνθετο Πρόβλημα'}: ${q10Data.title}`,
      prompt: q10Data.prompt,
      options: q10Options,
      correct: q10Data.correctText,
      tableData: q10Data.tableData,
      explain: q10Data.explain
    }
  ];
}

// ---------------------------------------------------------
// ΚΥΡΙΟ COMPONENT ΣΕΛΙΔΑΣ
// ---------------------------------------------------------

export default function BarosExercisesPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';

  const t = useMemo(() => {
    return {
      el: {
        pageTitle: "Ασκήσεις: Μονάδες Βάρους & Μετατροπές - ΣΤ' Δημοτικού | LearnMaths.gr",
        metaDescription: "Διαδραστικές ασκήσεις με 10 θέματα και αυτόματη βαθμολόγηση στις μονάδες μέτρησης βάρους (t, kg, g, mg), στο μικτό και καθαρό βάρος για τη ΣΤ' Δημοτικού.",
        backText: "ΣΤ' Δημοτικού",
        theoryBtn: "Θεωρία",
        heroBadge: "ΚΕΦΑΛΑΙΟ 60 • ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ",
        heroTitle: "Διαδραστικές Ασκήσεις: Μονάδες Βάρους",
        heroDesc: "Λύσε τα 10 δυναμικά θέματα για να εξασκηθείς στη σκάλα μετατροπών των μονάδων βάρους (t, kg, g, mg), στη διάκριση μικτού, καθαρού βάρους και αποβάρου και σε ρεαλιστικά προβλήματα!",
        newSetBtn: "Νέες Ασκήσεις",
        exerciseLabel: "Άσκηση",
        inputPlaceholderNumber: "Απάντηση...",
        inputPlaceholderDecimal: "π.χ. 2,45",
        tableHeaderElement: "Στοιχείο",
        tableHeaderFormula: "Ανάλυση / Μετατροπή",
        tableHeaderVal: "Τιμή",
        feedbackSuccess: "🎯 Εξαιρετικά!",
        feedbackExplanation: "💡 Επεξήγηση:",
        checkBtn: "Έλεγχος Απαντήσεων",
        scoreLabel: "Σκορ",
        answeredLabel: "Απαντήθηκαν",
        pctLabel: "Ποσοστό",
        footerPrompt: "Απάντησε και στις 10 ερωτήσεις και πάτησε «Έλεγχος Απαντήσεων»!"
      },
      en: {
        pageTitle: "Exercises: Weight Units & Conversions - 6th Grade | LearnMaths.gr",
        metaDescription: "Interactive exercises with 10 questions and auto-grading on weight units (t, kg, g, mg), gross, net, and tare weight for 6th Grade.",
        backText: "6th Grade",
        theoryBtn: "Theory",
        heroBadge: "CHAPTER 60 • 6TH GRADE • PRACTICE",
        heroTitle: "Interactive Exercises: Units of Weight",
        heroDesc: "Solve the 10 dynamic questions to master metric weight conversions (t, kg, g, mg), gross, net, and tare weight calculations!",
        newSetBtn: "New Exercises",
        exerciseLabel: "Exercise",
        inputPlaceholderNumber: "Answer...",
        inputPlaceholderDecimal: "e.g. 2.45",
        tableHeaderElement: "Component",
        tableHeaderFormula: "Step / Conversion",
        tableHeaderVal: "Value",
        feedbackSuccess: "🎯 Excellent!",
        feedbackExplanation: "💡 Explanation:",
        checkBtn: "Check Answers",
        scoreLabel: "Score",
        answeredLabel: "Answered",
        pctLabel: "Percentage",
        footerPrompt: "Answer all 10 questions and click “Check Answers”!"
      }
    }[locale];
  }, [locale]);

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const loadNewSet = useCallback(() => {
    const qList = generateQuestions(locale);
    setQuestions(qList);
    const initialAnswers = {};
    qList.forEach((q) => {
      initialAnswers[q.id] = '';
    });
    setAnswers(initialAnswers);
    setSubmitted(false);
    setScore(0);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [locale]);

  useEffect(() => {
    loadNewSet();
  }, [loadNewSet]);

  const handleAnswerChange = (id, rawValue, type) => {
    if (submitted) return;
    if (type === 'input') {
      const q = questions.find((item) => item.id === id);
      let sanitized = String(rawValue);
      if (q?.inputType === 'number') {
        sanitized = sanitized.replace(/[^0-9]/g, '');
      } else if (q?.inputType === 'decimal') {
        const sep = locale === 'en' ? '.' : ',';
        const otherSep = locale === 'en' ? ',' : '.';
        sanitized = sanitized.replace(new RegExp(`\\${otherSep}`, 'g'), sep);
        const allowedRegex = locale === 'en' ? /[^0-9.]/g : /[^0-9,]/g;
        sanitized = sanitized.replace(allowedRegex, '');
        const parts = sanitized.split(sep);
        if (parts.length > 2) {
          sanitized = parts[0] + sep + parts.slice(1).join('');
        }
      }
      if (sanitized.length > 10) {
        sanitized = sanitized.slice(0, 10);
      }
      setAnswers((prev) => ({ ...prev, [id]: sanitized }));
    } else {
      setAnswers((prev) => ({ ...prev, [id]: rawValue }));
    }
  };

  const isQuestionCorrect = (q) => {
    const userVal = answers[q.id];
    if (q.type === 'input') {
      if (typeof userVal !== 'string') return false;
      const cleanUser = userVal
        .replace(/\./g, ',')
        .replace(/\s+/g, '')
        .replace(/(kg|g|t|mg|€)/gi, '')
        .trim()
        .toLowerCase();
      const cleanTarget = String(q.correct)
        .replace(/\./g, ',')
        .replace(/\s+/g, '')
        .replace(/(kg|g|t|mg|€)/gi, '')
        .trim()
        .toLowerCase();

      if (cleanUser === cleanTarget) return true;

      if (q.inputType === 'decimal') {
        const numUser = parseFloat(cleanUser.replace(',', '.'));
        const numTarget = parseFloat(cleanTarget.replace(',', '.'));
        return !isNaN(numUser) && !isNaN(numTarget) && Math.abs(numUser - numTarget) <= 0.05;
      }
      return false;
    }
    if (q.type === 'mcq') {
      return userVal === q.correct;
    }
    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted || questions.length === 0) return;

    let total = 0;
    questions.forEach((q) => {
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

  const answeredCount = Object.values(answers).filter(
    (val) => val !== undefined && val !== null && String(val).trim() !== ''
  ).length;

  return (
    <Layout
      title={t.pageTitle}
      description={t.metaDescription}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/60-baros"
          className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-blue-200 transition shrink-0"
        >
          <span>📖</span>
          <span>{toCleanUppercase(t.theoryBtn)}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8 min-w-0">
        {/* HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200">
                <span>{toCleanUppercase(t.heroBadge)}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                {t.heroTitle}
              </h1>
              <p className="text-sky-100 text-xs sm:text-sm md:text-base leading-relaxed">
                {t.heroDesc}
              </p>
            </div>

            <button
              type="button"
              onClick={loadNewSet}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-black shadow-md transition transform active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 shrink-0 touch-manipulation"
            >
              <span>🔄</span>
              <span>{toCleanUppercase(t.newSetBtn)}</span>
            </button>
          </div>
        </section>

        {/* ΦΟΡΜΑ ΜΕ ΤΙΣ 10 ΕΡΩΤΗΣΕΙΣ */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 2xl:gap-8">
            {questions.map((q, idx) => {
              const qNum = idx + 1;
              return (
                <div
                  key={q.id}
                  className={`p-5 sm:p-7 rounded-3xl border flex flex-col justify-between transition-all min-w-0 ${getCardStyle(
                    q
                  )}`}
                >
                  <div>
                    {/* CARD HEADER */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-black px-3 py-1 bg-sky-100 text-sky-900 rounded-full uppercase tracking-wider">
                        {toCleanUppercase(`${t.exerciseLabel} ${qNum}`)}: {toCleanUppercase(q.title)}
                      </span>
                      {submitted && (
                        <span className="text-xl">
                          {isQuestionCorrect(q) ? '✅' : '❌'}
                        </span>
                      )}
                    </div>

                    {/* PROMPT (NO-GIVEAWAY: ΜΟΝΟ ΕΚΦΩΝΗΣΗ) */}
                    <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-semibold mb-3 break-words [overflow-wrap:anywhere]">
                      {q.prompt}
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
                              onClick={() => handleAnswerChange(q.id, opt, 'mcq')}
                              className={`p-3 rounded-2xl text-xs sm:text-sm font-mono font-bold border text-center transition touch-manipulation active:scale-95 break-words [overflow-wrap:anywhere] whitespace-normal leading-snug flex-1 flex items-center justify-center min-h-[48px] ${
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
                          inputMode={q.inputType === 'decimal' ? 'decimal' : 'numeric'}
                          maxLength={10}
                          disabled={submitted}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value, 'input')}
                          placeholder={
                            q.inputType === 'decimal'
                              ? t.inputPlaceholderDecimal
                              : t.inputPlaceholderNumber
                          }
                          className="w-full p-3 bg-white border-2 border-slate-200 rounded-2xl font-bold text-center text-base sm:text-lg focus:border-indigo-500 outline-none disabled:bg-slate-100 font-mono tracking-wider shadow-inner"
                        />
                      </div>
                    )}
                  </div>

                  {/* POST-SUBMISSION FEEDBACK & TABLEDATA (NO-GIVEAWAY) */}
                  {submitted && (
                    <div className="mt-4 pt-3 border-t border-slate-200/70 space-y-3 min-w-0">
                      {q.tableData && (
                        <div className="w-full overflow-x-auto bg-white/90 p-2.5 rounded-2xl border border-slate-200 block">
                          <table className="w-full text-xs text-left text-slate-700">
                            <thead>
                              <tr className="border-b border-slate-200 font-black text-slate-500 uppercase">
                                <th className="p-1.5">{toCleanUppercase(t.tableHeaderElement)}</th>
                                <th className="p-1.5">{toCleanUppercase(t.tableHeaderFormula)}</th>
                                <th className="p-1.5">{toCleanUppercase(t.tableHeaderVal)}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-mono">
                              {q.tableData.map((row, rIdx) => (
                                <tr key={rIdx}>
                                  <td className="p-1.5 font-sans font-bold text-slate-900 break-words">
                                    {row.item}
                                  </td>
                                  <td className="p-1.5 text-indigo-700 break-words">
                                    {row.formulaNode || row.formula}
                                  </td>
                                  <td className="p-1.5 font-black text-emerald-700 whitespace-nowrap">
                                    {row.val}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      <div
                        className={`p-3 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed break-words [overflow-wrap:anywhere] ${
                          isQuestionCorrect(q)
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-200'
                            : 'bg-rose-100 text-rose-950 border border-rose-200'
                        }`}
                      >
                        <p className="font-bold mb-1">
                          {isQuestionCorrect(q) ? t.feedbackSuccess : t.feedbackExplanation}
                        </p>
                        <div>{q.explain}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-base sm:text-lg font-black px-8 sm:px-10 py-4 rounded-2xl shadow-xl transition transform hover:scale-105 active:scale-95 flex items-center gap-2.5 touch-manipulation"
              >
                <span className="text-xl">🎯</span>
                <span>{toCleanUppercase(t.checkBtn)}</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* FIXED BOTTOM SCORE FOOTER */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-6 z-50">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          {/* SCORE & PERCENTAGE */}
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-base md:text-lg flex items-center gap-2 shadow-sm">
              <span>🏆</span>
              <span>
                {submitted ? toCleanUppercase(t.scoreLabel) : toCleanUppercase(t.answeredLabel)}:
              </span>
              <span className="font-mono text-lg sm:text-xl md:text-2xl">
                {submitted ? score : answeredCount} / 10
              </span>
            </div>
            {submitted && (
              <span className="text-xs sm:text-sm font-bold text-slate-300">
                {toCleanUppercase(t.pctLabel)}:{' '}
                <span className="text-emerald-400 font-black text-sm sm:text-base">
                  {Math.round((score / 10) * 100)}%
                </span>
              </span>
            )}
          </div>

          {/* GUIDANCE OR RESTART */}
          <div className="flex items-center gap-3">
            {submitted ? (
              <button
                type="button"
                onClick={loadNewSet}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base flex items-center gap-2 touch-manipulation"
              >
                <span>🔄</span>
                <span>{toCleanUppercase(t.newSetBtn)}</span>
              </button>
            ) : (
              <p className="text-xs text-slate-400 hidden sm:block">
                {t.footerPrompt}
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}