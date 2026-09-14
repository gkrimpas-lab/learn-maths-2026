// pages/st-dimotikou/40-logos-ask.js
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Βοηθητικη συναρτηση ΜΚΔ
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

// Τυχαιος ακεραιος στο [min, max]
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Τυχαια επιλογη απο πινακα
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Μορφοποιηση δεκαδικου με κομμα
function formatDecimal(val, decimals = 2) {
  const rounded = Number(val.toFixed(decimals));
  return String(rounded).replace('.', ',');
}

// Δεξαμενη Κανονικων Προβληματων (10 διαφορετικα προβληματα)
const STANDARD_PROBLEMS_POOL = [
  {
    id: 'p_std_1',
    generate: () => {
      const g = randInt(2, 5);
      const boysRatio = randInt(3, 5);
      let girlsRatio = randInt(3, 5);
      while (girlsRatio === boysRatio) girlsRatio = randInt(2, 6);
      const boys = boysRatio * g;
      const girls = girlsRatio * g;
      const total = boys + girls;
      const gcd = getGCD(girls, total);
      return {
        text: `Σε μια τάξη της ΣΤ' Δημοτικού φοιτούν ${boys} αγόρια και ${girls} κορίτσια. Ποιος είναι ο απλοποιημένος λόγος των κοριτσιών προς το σύνολο των μαθητών της τάξης;`,
        ansNum: girls / gcd,
        ansDen: total / gcd,
        explanation: `Το σύνολο των μαθητών είναι ${boys} ＋ ${girls} ＝ ${total}. Ο λόγος των κοριτσιών προς το σύνολο είναι ${girls} ： ${total}. Διαιρούμε με τον ΜΚΔ(${girls}, ${total}) ＝ ${gcd}, άρα ο απλοποιημένος λόγος είναι ${girls / gcd} ： ${total / gcd}.`
      };
    }
  },
  {
    id: 'p_std_2',
    generate: () => {
      const width = randInt(4, 9) * 10; // σε cm
      const lengthMeters = randInt(1, 3); // σε m
      const lengthCm = lengthMeters * 100;
      const gcd = getGCD(width, lengthCm);
      return {
        text: `Ένα ορθογώνιο πανό έχει πλάτος ${width} cm και μήκος ${lengthMeters} m. Ποιος είναι ο απλοποιημένος λόγος του πλάτους προς το μήκος του;`,
        ansNum: width / gcd,
        ansDen: lengthCm / gcd,
        explanation: `Μετατρέπουμε το μήκος σε ίδια μονάδα: ${lengthMeters} m ＝ ${lengthCm} cm. Ο λόγος είναι ${width} ： ${lengthCm}. Διαιρούμε με τον ΜΚΔ(${width}, ${lengthCm}) ＝ ${gcd} και προκύπτει ${width / gcd} ： ${lengthCm / gcd}.`
      };
    }
  },
  {
    id: 'p_std_3',
    generate: () => {
      const sugar = randInt(2, 6) * 50; // π.χ. 250 g
      const flour = randInt(2, 4) * 500; // π.χ. 1000 g (1 kg)
      const gcd = getGCD(sugar, flour);
      return {
        text: `Σε μια συνταγή ζαχαροπλαστικής χρησιμοποιούνται ${sugar} g ζάχαρης και ${flour / 1000} kg αλευριού. Βρείτε τον απλοποιημένο λόγο της ποσότητας της ζάχαρης προς την ποσότητα του αλευριού.`,
        ansNum: sugar / gcd,
        ansDen: flour / gcd,
        explanation: `Μετατρέπουμε το αλεύρι σε γραμμάρια: ${flour / 1000} kg ＝ ${flour} g. Ο λόγος είναι ${sugar} ： ${flour}. Απλοποιώντας με τον ΜΚΔ(${sugar}, ${flour}) ＝ ${gcd}, έχουμε ${sugar / gcd} ： ${flour / gcd}.`
      };
    }
  },
  {
    id: 'p_std_4',
    generate: () => {
      const base = randInt(3, 8);
      const mult = randInt(2, 4);
      const wins = base * mult;
      const losses = base * 2;
      const gcd = getGCD(wins, losses);
      return {
        text: `Μια ομάδα μπάσκετ σε ένα τουρνουά πέτυχε ${wins} νίκες και είχε ${losses} ήττες. Ποιος είναι ο λόγος των νικών προς τις ήττες σε ανάγωγη μορφή;`,
        ansNum: wins / gcd,
        ansDen: losses / gcd,
        explanation: `Ο λόγος των νικών προς τις ήττες είναι ${wins} ： ${losses}. Διαιρώντας αριθμητή και παρονομαστή με τον ΜΚΔ(${wins}, ${losses}) ＝ ${gcd}, βρίσκουμε ${wins / gcd} ： ${losses / gcd}.`
      };
    }
  },
  {
    id: 'p_std_5',
    generate: () => {
      const timeMinutes = randInt(2, 5) * 15;
      const hours = 2;
      const hoursInMinutes = hours * 60;
      const gcd = getGCD(timeMinutes, hoursInMinutes);
      return {
        text: `Ένας ποδηλάτης προπονήθηκε για ${timeMinutes} λεπτά το πρωί και ${hours} ώρες το απόγευμα. Ποιος είναι ο ανάγωγος λόγος του πρωινού χρόνου προς τον απογευματινό χρόνο προπόνησης;`,
        ansNum: timeMinutes / gcd,
        ansDen: hoursInMinutes / gcd,
        explanation: `Μετατρέπουμε τις ${hours} ώρες σε λεπτά: ${hours} · 60 ＝ ${hoursInMinutes} λεπτά. Ο λόγος είναι ${timeMinutes} ： ${hoursInMinutes}. Μετά από απλοποίηση με το ${gcd}, έχουμε ${timeMinutes / gcd} ： ${hoursInMinutes / gcd}.`
      };
    }
  },
  {
    id: 'p_std_6',
    generate: () => {
      const red = randInt(4, 9) * 3;
      const white = randInt(4, 9) * 2;
      const gcd = getGCD(red, white);
      return {
        text: `Σε ένα κατάστημα ανθοπωλείου υπάρχουν ${red} κόκκινα τριαντάφυλλα και ${white} λευκά τριαντάφυλλα. Ποιος είναι ο απλοποιημένος λόγος των κόκκινων προς τα λευκά τριαντάφυλλα;`,
        ansNum: red / gcd,
        ansDen: white / gcd,
        explanation: `Ο λόγος είναι ${red} ： ${white}. Διαιρούμε και τους δύο όρους με το ${gcd} και έχουμε ${red / gcd} ： ${white / gcd}.`
      };
    }
  },
  {
    id: 'p_std_7',
    generate: () => {
      const perimeter = randInt(20, 36) * 2;
      const side = randInt(4, 8);
      const gcd = getGCD(side, perimeter);
      return {
        text: `Ένα ισόπλευρο τρίγωνο έχει πλευρά μήκους ${side} cm και ένα ορθογώνιο έχει περίμετρο ${perimeter} cm. Ποιος είναι ο απλοποιημένος λόγος της πλευράς του τριγώνου προς την περίμετρο του ορθογωνίου;`,
        ansNum: side / gcd,
        ansDen: perimeter / gcd,
        explanation: `Ο λόγος είναι ${side} ： ${perimeter}. Διαιρώντας με τον ΜΚΔ(${side}, ${perimeter}) ＝ ${gcd}, βρίσκουμε ${side / gcd} ： ${perimeter / gcd}.`
      };
    }
  },
  {
    id: 'p_std_8',
    generate: () => {
      const saved = randInt(3, 7) * 20;
      const cost = saved + randInt(2, 5) * 20;
      const gcd = getGCD(saved, cost);
      return {
        text: `Ο Νίκος αποταμίευσε ${saved} € για να αγοράσει ένα ποδήλατο αξίας ${cost} €. Ποιος είναι ο ανάγωγος λόγος των χρημάτων που συγκέντρωσε προς τη συνολική αξία του ποδηλάτου;`,
        ansNum: saved / gcd,
        ansDen: cost / gcd,
        explanation: `Ο λόγος των αποταμιεύσεων προς τη συνολική τιμή είναι ${saved} ： ${cost}. Με απλοποίηση με το ${gcd}, προκύπτει ${saved / gcd} ： ${cost / gcd}.`
      };
    }
  },
  {
    id: 'p_std_9',
    generate: () => {
      const juice = randInt(3, 6) * 150;
      const water = randInt(2, 4) * 500;
      const gcd = getGCD(juice, water);
      return {
        text: `Σε μια κανάτα αναμειγνύουμε ${juice} ml συμπυκνωμένου χυμού με ${water / 1000} l νερό. Ποιος είναι ο απλοποιημένος λόγος του χυμού προς το νερό;`,
        ansNum: juice / gcd,
        ansDen: water / gcd,
        explanation: `Μετατρέπουμε σε ml: ${water / 1000} l ＝ ${water} ml. Ο λόγος είναι ${juice} ： ${water}. Διαιρούμε με τον ΜΚΔ(${juice}, ${water}) ＝ ${gcd} και λαμβάνουμε ${juice / gcd} ： ${water / gcd}.`
      };
    }
  },
  {
    id: 'p_std_10',
    generate: () => {
      const pagesRead = randInt(4, 9) * 25;
      const totalPages = pagesRead + randInt(2, 5) * 50;
      const gcd = getGCD(pagesRead, totalPages);
      return {
        text: `Η Ελένη διάβασε ${pagesRead} σελίδες από ένα βιβλίο που έχει συνολικά ${totalPages} σελίδες. Ποιος είναι ο απλοποιημένος λόγος των σελίδων που διάβασε προς το σύνολο των σελίδων;`,
        ansNum: pagesRead / gcd,
        ansDen: totalPages / gcd,
        explanation: `Ο λόγος είναι ${pagesRead} ： ${totalPages}. Διαιρούμε με τον ΜΚΔ(${pagesRead}, ${totalPages}) ＝ ${gcd}, άρα έχουμε ${pagesRead / gcd} ： ${totalPages / gcd}.`
      };
    }
  }
];

// Δεξαμενη Προβληματων Αυξημενης Δυσκολιας (10 διαφορετικα προβληματα)
const HARD_PROBLEMS_POOL = [
  {
    id: 'p_hard_1',
    generate: () => {
      const rA = randInt(3, 5);
      const rB = randInt(6, 8);
      const unit = randInt(12, 25);
      const sum = (rA + rB) * unit;
      const valB = rB * unit;
      return {
        text: `Δύο χωράφια έχουν συνολικό εμβαδόν ${sum} m². Ο λόγος του εμβαδού του πρώτου χωραφιού προς το εμβαδόν του δεύτερου είναι ${rA} ： ${rB}. Πόσα m² είναι το εμβαδόν του μεγαλύτερου χωραφιού;`,
        correctVal: valB,
        explanation: `Το σύνολο των ίσων μερών είναι ${rA} ＋ ${rB} ＝ ${rA + rB}. Κάθε μέρος αντιστοιχεί σε ${sum} ： ${rA + rB} ＝ ${unit} m². Το μεγαλύτερο χωράφι έχει ${rB} μέρη, άρα ${rB} · ${unit} ＝ ${valB} m².`
      };
    }
  },
  {
    id: 'p_hard_2',
    generate: () => {
      const rX = randInt(2, 4);
      const rY = randInt(5, 7);
      const diffMultiplier = randInt(8, 20);
      const diff = (rY - rX) * diffMultiplier;
      const y = rY * diffMultiplier;
      return {
        text: `Ο λόγος των ηλικιών ενός παιδιού και του πατέρα του είναι ${rX} ： ${rY}. Αν ο πατέρας είναι κατά ${diff} έτη μεγαλύτερος από το παιδί, πόσα έτη είναι η ηλικία του πατέρα;`,
        correctVal: y,
        explanation: `Η διαφορά των μερών είναι ${rY} － ${rX} ＝ ${rY - rX} μέρη, τα οποία αντιστοιχούν σε ${diff} έτη. Άρα το 1 μέρος είναι ${diff} ： ${rY - rX} ＝ ${diffMultiplier} έτη. Η ηλικία του πατέρα είναι ${rY} · ${diffMultiplier} ＝ ${y} έτη.`
      };
    }
  },
  {
    id: 'p_hard_3',
    generate: () => {
      const rL = randInt(4, 6);
      const rW = randInt(2, 3);
      const k = randInt(5, 12);
      const length = rL * k;
      const width = rW * k;
      const semi = length + width;
      const perimeter = 2 * semi;
      const area = length * width;
      return {
        text: `Σε ένα ορθογώνιο οικόπεδο ο λόγος του μήκους προς το πλάτος είναι ${rL} ： ${rW} και η περίμετρός του είναι ${perimeter} m. Πόσα m² είναι το εμβαδόν του οικοπέδου;`,
        correctVal: area,
        explanation: `Το ημιπερίμετρος (μήκος ＋ πλάτος) είναι ${perimeter} ： 2 ＝ ${semi} m. Τα μέρη είναι ${rL} ＋ ${rW} ＝ ${rL + rW}. Το 1 μέρος ισούται με ${semi} ： ${rL + rW} ＝ ${k} m. Άρα μήκος ＝ ${length} m και πλάτος ＝ ${width} m. Το εμβαδόν είναι ${length} · ${width} ＝ ${area} m².`
      };
    }
  },
  {
    id: 'p_hard_4',
    generate: () => {
      const priceA = randInt(12, 20) * 10;
      const increase = 20;
      const priceB = priceA * (1 + increase / 100);
      const gcd = getGCD(priceA, priceB);
      return {
        text: `Ένα προϊόν κόστιζε ${priceA} € και μετά από ανατίμηση κοστίζει ${priceB} €. Ποιος είναι ο απλοποιημένος λόγος της αρχικής τιμής προς τη νέα αυξημένη τιμή;`,
        ansNum: priceA / gcd,
        ansDen: priceB / gcd,
        explanation: `Ο λόγος αρχικής προς νέα τιμή είναι ${priceA} ： ${priceB}. Διαιρούμε με τον ΜΚΔ(${priceA}, ${priceB}) ＝ ${gcd} και βρίσκουμε ${priceA / gcd} ： ${priceB / gcd}.`
      };
    }
  },
  {
    id: 'p_hard_5',
    generate: () => {
      const part1 = randInt(2, 4);
      const part2 = randInt(3, 5);
      const part3 = randInt(5, 7);
      const sumParts = part1 + part2 + part3;
      const unit = randInt(15, 30);
      const totalAmount = sumParts * unit;
      const maxPartVal = Math.max(part1, part2, part3) * unit;
      return {
        text: `Τρεις φίλοι μοιράστηκαν το ποσό των ${totalAmount} € σε λόγο ${part1} ： ${part2} ： ${part3}. Πόσα € πήρε αυτός που έλαβε το μεγαλύτερο μερίδιο;`,
        correctVal: maxPartVal,
        explanation: `Τα συνολικά μέρη είναι ${part1} ＋ ${part2} ＋ ${part3} ＝ ${sumParts}. Το 1 μέρος αντιστοιχεί σε ${totalAmount} ： ${sumParts} ＝ ${unit} €. Το μεγαλύτερο μερίδιο είναι ${Math.max(part1, part2, part3)} · ${unit} ＝ ${maxPartVal} €.`
      };
    }
  },
  {
    id: 'p_hard_6',
    generate: () => {
      const speed1 = randInt(6, 10) * 10;
      const speed2 = randInt(11, 14) * 10;
      const gcd = getGCD(speed1, speed2);
      return {
        text: `Δύο αυτοκίνητα κινούνται με σταθερή ταχύτητα ${speed1} km/h και ${speed2} km/h αντίστοιχα. Ποιος είναι ο απλοποιημένος λόγος του χρόνου που χρειάζεται το πρώτο προς το δεύτερο για να διανύσουν την ίδια απόσταση;`,
        ansNum: speed2 / gcd,
        ansDen: speed1 / gcd,
        explanation: `Όταν η απόσταση είναι σταθερή, ο χρόνος είναι αντιστρόφως ανάλογος της ταχύτητας. Άρα ο λόγος των χρόνων t1 : t2 ισούται με τον αντίστροφο λόγο των ταχυτήτων v2 : v1 ＝ ${speed2} ： ${speed1}. Απλοποιώντας με τον ΜΚΔ(${speed2}, ${speed1}) ＝ ${gcd}, έχουμε ${speed2 / gcd} ： ${speed1 / gcd}.`
      };
    }
  },
  {
    id: 'p_hard_7',
    generate: () => {
      const k = randInt(4, 9);
      const copper = 7 * k;
      const zinc = 3 * k;
      const totalAlloy = copper + zinc;
      return {
        text: `Ένα μεταλλικό κράμα βάρους ${totalAlloy} kg αποτελείται από χαλκό και ψευδάργυρο με λόγο ${7} ： ${3}. Πόσα kg χαλκού περιέχονται στο κράμα;`,
        correctVal: copper,
        explanation: `Τα μέρη είναι 7 ＋ 3 ＝ 10. Το κάθε μέρος ζυγίζει ${totalAlloy} ： 10 ＝ ${k} kg. Ο χαλκός αποτελείται από 7 μέρη, άρα περιέχει 7 · ${k} ＝ ${copper} kg.`
      };
    }
  },
  {
    id: 'p_hard_8',
    generate: () => {
      const a = randInt(2, 5);
      const b = randInt(3, 7);
      const c = randInt(4, 8);
      const gcd = getGCD(a, c);
      return {
        text: `Αν ο λόγος x ： y είναι ίσος με ${a} ： ${b} και ο λόγος y ： z είναι ίσος με ${b} ： ${c}, ποιος είναι ο απλοποιημένος λόγος x ： z;`,
        ansNum: a / gcd,
        ansDen: c / gcd,
        explanation: `Επειδή x/y ＝ ${a}/${b} και y/z ＝ ${b}/${c}, πολλαπλασιάζουμε τους λόγους: (x/y) · (y/z) ＝ (${a}/${b}) · (${b}/${c}) ＝ ${a}/${c}. Απλοποιώντας με τον ΜΚΔ(${a}, ${c}) ＝ ${gcd}, βρίσκουμε ${a / gcd} ： ${c / gcd}.`
      };
    }
  },
  {
    id: 'p_hard_9',
    generate: () => {
      const salt = randInt(2, 5) * 10;
      const water = randInt(6, 12) * 50;
      const totalSolution = salt + water;
      const gcd = getGCD(salt, totalSolution);
      return {
        text: `Διαλύουμε ${salt} g αλατιού σε ${water} g νερού. Ποιος είναι ο απλοποιημένος λόγος της μάζας του αλατιού προς τη συνολική μάζα του διαλύματος;`,
        ansNum: salt / gcd,
        ansDen: totalSolution / gcd,
        explanation: `Η συνολική μάζα του διαλύματος είναι ${salt} ＋ ${water} ＝ ${totalSolution} g. Ο λόγος αλατιού προς διάλυμα είναι ${salt} ： ${totalSolution}. Διαιρώντας με τον ΜΚΔ(${salt}, ${totalSolution}) ＝ ${gcd}, έχουμε ${salt / gcd} ： ${totalSolution / gcd}.`
      };
    }
  },
  {
    id: 'p_hard_10',
    generate: () => {
      const girlsRatio = randInt(4, 6);
      const boysRatio = randInt(3, 5);
      const diffMultiplier = randInt(3, 7);
      const diffParts = Math.abs(girlsRatio - boysRatio) || 1;
      const actualDiff = diffParts * diffMultiplier * 2;
      const k = actualDiff / diffParts;
      const totalParts = girlsRatio + boysRatio;
      const total = totalParts * k;
      return {
        text: `Σε μια κατασκήνωση ο λόγος των κοριτσιών προς τα αγόρια είναι ${girlsRatio} ： ${boysRatio}. Αν τα κορίτσια είναι κατά ${actualDiff} περισσότερα από τα αγόρια, ποιο είναι το συνολικό πλήθος των παιδιών;`,
        correctVal: total,
        explanation: `Η διαφορά των μερών είναι ${diffParts}. Αντιστοιχεί σε ${actualDiff} παιδιά, άρα 1 μέρος ＝ ${actualDiff} ： ${diffParts} ＝ ${k} παιδιά. Το σύνολο των μερών είναι ${girlsRatio} ＋ ${boysRatio} ＝ ${totalParts}. Άρα συνολικά παιδιά: ${totalParts} · ${k} ＝ ${total}.`
      };
    }
  }
];

// Δημιουργια των 10 δυναμικων ερωτησεων
function generateQuestions() {
  const qList = [];

  // Q1 (Input - Fraction)
  {
    const m = randInt(3, 9);
    let n1 = randInt(2, 7);
    let n2 = randInt(2, 7);
    while (n1 === n2) n2 = randInt(2, 8);
    const num = n1 * m;
    const den = n2 * m;
    const gcd = getGCD(num, den);
    qList.push({
      id: 1,
      type: 'fraction_input',
      title: 'Ερώτηση 1 • Απλοποίηση Λόγου',
      instruction: 'Γράψτε τον λόγο στην απλούστερη ανάγωγη μορφή του (αριθμητής / παρονομαστής):',
      prompt: `Να απλοποιηθεί πλήρως ο λόγος ${num} ： ${den}`,
      ansNum: num / gcd,
      ansDen: den / gcd,
      explanation: `Διαιρούμε και τους δύο όρους με τον Μέγιστο Κοινό Διαιρέτη ΜΚΔ(${num}, ${den}) ＝ ${gcd}: (${num} ： ${gcd}) / (${den} ： ${gcd}) ＝ ${num / gcd} ： ${den / gcd}.`
    });
  }

  // Q2 (MCQ)
  {
    const num = randInt(3, 9);
    const den = pickRandom([2, 4, 5, 8, 10]);
    const val = num / den;
    const valStr = formatDecimal(val, 3);
    const fake1 = formatDecimal(den / num, 3);
    const fake2 = formatDecimal(val + 0.5, 3);
    const fake3 = formatDecimal(Math.max(0.1, val - 0.25), 3);

    const options = [
      { text: valStr, isCorrect: true },
      { text: fake1, isCorrect: false },
      { text: fake2, isCorrect: false },
      { text: fake3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 2,
      type: 'mcq',
      title: 'Ερώτηση 2 • Τιμή του Λόγου',
      instruction: 'Επιλέξτε τη σωστή δεκαδική τιμή του λόγου:',
      prompt: `Ποια είναι η ακριβής τιμή του λόγου ${num} ： ${den};`,
      options,
      correctText: valStr,
      explanation: `Η τιμή του λόγου βρίσκεται εκτελώντας τη διαίρεση του προηγούμενου όρου με τον επόμενο: ${num} ： ${den} ＝ ${valStr}.`
    });
  }

  // Q3 (Input - Fraction)
  {
    const cm = randInt(15, 45) * 2;
    const m = randInt(2, 4);
    const mInCm = m * 100;
    const gcd = getGCD(cm, mInCm);
    qList.push({
      id: 3,
      type: 'fraction_input',
      title: 'Ερώτηση 3 • Σύγκριση Ομοειδών Μεγεθών',
      instruction: 'Υπολογίστε τον ανάγωγο λόγο (αριθμητής / παρονομαστής):',
      prompt: `Ποιος είναι ο απλοποιημένος λόγος του μήκους ${cm} cm προς το μήκος ${m} m;`,
      ansNum: cm / gcd,
      ansDen: mInCm / gcd,
      explanation: `Μετατρέπουμε τα ${m} m σε cm: ${m} · 100 ＝ ${mInCm} cm. Ο λόγος είναι ${cm} ： ${mInCm}. Διαιρούμε με τον ΜΚΔ(${cm}, ${mInCm}) ＝ ${gcd} και προκύπτει ${cm / gcd} ： ${mInCm / gcd}.`
    });
  }

  // Q4 (MCQ)
  {
    const a = randInt(3, 8);
    const b = randInt(4, 9);
    const options = [
      { text: `Ο λόγος ${b} ： ${a}`, isCorrect: true },
      { text: `Ο λόγος ${a} ： ${a + b}`, isCorrect: false },
      { text: `Ο λόγος ${a * 2} ： ${b * 2}`, isCorrect: false },
      { text: `Ο λόγος 1 ： ${b}`, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 4,
      type: 'mcq',
      title: 'Ερώτηση 4 • Αντίστροφος Λόγος',
      instruction: 'Επιλέξτε τη σωστή μαθηματική πρόταση:',
      prompt: `Ποιος είναι ο αντίστροφος λόγος του λόγου ${a} ： ${b};`,
      options,
      correctText: `Ο λόγος ${b} ： ${a}`,
      explanation: `Αντίστροφος ενός λόγου α ： β ονομάζεται ο λόγος β ： α. Το γινόμενό τους είναι ίσο με 1: (${a}/${b}) · (${b}/${a}) ＝ 1.`
    });
  }

  // Q5 (Input - Decimal)
  {
    const hours = randInt(2, 4);
    const speed = randInt(65, 95);
    const km = speed * hours;
    qList.push({
      id: 5,
      type: 'decimal_input',
      title: 'Ερώτηση 5 • Λόγος Ετεροειδών Μεγεθών',
      instruction: 'Εισαγάγετε τον αριθμό (ακέραιος ή δεκαδικός):',
      prompt: `Ένα τρένο διανύει ${km} km σε ${hours} ώρες. Ποια είναι η τιμή του λόγου της απόστασης προς τον χρόνο (δηλαδή η μέση ταχύτητα σε km/h);`,
      correctVal: speed,
      correctStr: String(speed),
      explanation: `Ο λόγος της απόστασης προς τον χρόνο είναι ${km} ： ${hours} ＝ ${speed} km/h.`
    });
  }

  // Q6 (MCQ)
  {
    const baseA = randInt(2, 5);
    const baseB = randInt(3, 7);
    const mult = randInt(3, 6);
    const eqA = baseA * mult;
    const eqB = baseB * mult;

    const correct = `${eqA} ： ${eqB}`;
    const wrong1 = `${eqA + 1} ： ${eqB}`;
    const wrong2 = `${eqA} ： ${eqB + 2}`;
    const wrong3 = `${baseA * 2} ： ${baseB * 3}`;

    const options = [
      { text: correct, isCorrect: true },
      { text: wrong1, isCorrect: false },
      { text: wrong2, isCorrect: false },
      { text: wrong3, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 6,
      type: 'mcq',
      title: 'Ερώτηση 6 • Ισοδύναμοι Λόγοι',
      instruction: 'Επιλέξτε τον λόγο που είναι ίσος με τον δοσμένο:',
      prompt: `Ποιος από τους παρακάτω λόγους είναι ίσος με τον λόγο ${baseA} ： ${baseB};`,
      options,
      correctText: correct,
      explanation: `Πολλαπλασιάζοντας και τους δύο όρους του ${baseA} ： ${baseB} με το ${mult}, έχουμε (${baseA} · ${mult}) ： (${baseB} · ${mult}) ＝ ${eqA} ： ${eqB}.`
    });
  }

  // Q7 & Q8: Κανονικα Προβληματα (1 Input Fraction, 1 MCQ)
  {
    const shuffledStd = [...STANDARD_PROBLEMS_POOL].sort(() => Math.random() - 0.5);
    const stdProb1 = shuffledStd[0].generate();
    const stdProb2 = shuffledStd[1].generate();

    // Q7 (Input - Fraction)
    qList.push({
      id: 7,
      type: 'fraction_input',
      title: 'Ερώτηση 7 • Πρόβλημα Καθημερινής Εφαρμογής',
      instruction: 'Λύστε το πρόβλημα και γράψτε τον απλοποιημένο λόγο (αριθμητής / παρονομαστής):',
      prompt: stdProb1.text,
      ansNum: stdProb1.ansNum,
      ansDen: stdProb1.ansDen,
      explanation: stdProb1.explanation
    });

    // Q8 (MCQ)
    const correctFrac = `${stdProb2.ansNum} ： ${stdProb2.ansDen}`;
    const fakeA = `${stdProb2.ansDen} ： ${stdProb2.ansNum}`;
    const fakeB = `${stdProb2.ansNum + 1} ： ${stdProb2.ansDen}`;
    const fakeC = `${stdProb2.ansNum} ： ${stdProb2.ansDen + 2}`;

    const optionsQ8 = [
      { text: correctFrac, isCorrect: true },
      { text: fakeA, isCorrect: false },
      { text: fakeB, isCorrect: false },
      { text: fakeC, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 8,
      type: 'mcq',
      title: 'Ερώτηση 8 • Πρόβλημα Αναλογίας',
      instruction: 'Επιλέξτε τη σωστή απάντηση για το πρόβλημα:',
      prompt: stdProb2.text,
      options: optionsQ8,
      correctText: correctFrac,
      explanation: stdProb2.explanation
    });
  }

  // Q9 & Q10: Προβληματα Αυξημενης Δυσκολιας (1 Input, 1 MCQ)
  {
    const shuffledHard = [...HARD_PROBLEMS_POOL].sort(() => Math.random() - 0.5);
    const hardProb1 = shuffledHard[0].generate();
    const hardProb2 = shuffledHard[1].generate();

    // Q9 (Input)
    if (hardProb1.ansNum !== undefined) {
      qList.push({
        id: 9,
        type: 'fraction_input',
        title: 'Ερώτηση 9 • Πρόβλημα Αυξημένης Δυσκολίας',
        instruction: 'Υπολογίστε τον ανάγωγο λόγο (αριθμητής / παρονομαστής):',
        prompt: hardProb1.text,
        ansNum: hardProb1.ansNum,
        ansDen: hardProb1.ansDen,
        explanation: hardProb1.explanation
      });
    } else {
      qList.push({
        id: 9,
        type: 'decimal_input',
        title: 'Ερώτηση 9 • Πρόβλημα Αυξημένης Δυσκολίας',
        instruction: 'Υπολογίστε και εισαγάγετε το τελικό αποτέλεσμα:',
        prompt: hardProb1.text,
        correctVal: hardProb1.correctVal,
        correctStr: String(hardProb1.correctVal),
        explanation: hardProb1.explanation
      });
    }

    // Q10 (MCQ)
    let correctText10 = '';
    let fake10A = '';
    let fake10B = '';
    let fake10C = '';

    if (hardProb2.ansNum !== undefined) {
      correctText10 = `${hardProb2.ansNum} ： ${hardProb2.ansDen}`;
      fake10A = `${hardProb2.ansDen} ： ${hardProb2.ansNum}`;
      fake10B = `${hardProb2.ansNum + 1} ： ${hardProb2.ansDen}`;
      fake10C = `${hardProb2.ansNum} ： ${hardProb2.ansDen + 1}`;
    } else {
      correctText10 = `${hardProb2.correctVal}`;
      fake10A = `${hardProb2.correctVal + randInt(5, 15)}`;
      fake10B = `${Math.max(1, hardProb2.correctVal - randInt(4, 12))}`;
      fake10C = `${Math.round(hardProb2.correctVal * 1.5)}`;
    }

    const optionsQ10 = [
      { text: correctText10, isCorrect: true },
      { text: fake10A, isCorrect: false },
      { text: fake10B, isCorrect: false },
      { text: fake10C, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    qList.push({
      id: 10,
      type: 'mcq',
      title: 'Ερώτηση 10 • Σύνθετο Πρόβλημα Αυξημένης Δυσκολίας',
      instruction: 'Επιλέξτε τη σωστή επιλογή:',
      prompt: hardProb2.text,
      options: optionsQ10,
      correctText: correctText10,
      explanation: hardProb2.explanation
    });
  }

  return qList;
}

export default function LogosExercisesPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Δημιουργια νεων ασκησεων
  const loadNewSet = useCallback(() => {
    const q = generateQuestions();
    setQuestions(q);
    setAnswers({});
    setIsSubmitted(false);
    setScore(0);
  }, []);

  useEffect(() => {
    loadNewSet();
  }, [loadNewSet]);

  // Χειρισμος Input με καθαρισμο χαρακτηρων (0-9 και κομμα)
  const handleInputChange = (fieldKey, rawValue) => {
    if (isSubmitted) return;
    let sanitized = rawValue.replace(/\./g, ',');
    sanitized = sanitized.replace(/[^0-9,]/g, '');
    const parts = sanitized.split(',');
    if (parts.length > 2) {
      sanitized = parts[0] + ',' + parts.slice(1).join('');
    }
    if (sanitized.length > 10) {
      sanitized = sanitized.slice(0, 10);
    }
    setAnswers((prev) => ({
      ...prev,
      [fieldKey]: sanitized
    }));
  };

  // Χειρισμος MCQ
  const handleSelectMCQ = (qId, optionText) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [`q_${qId}`]: optionText
    }));
  };

  // Ελεγχος Απαντησεων
  const handleCheckAnswers = () => {
    let currentScore = 0;

    questions.forEach((q) => {
      if (q.type === 'mcq') {
        const userChoice = answers[`q_${q.id}`];
        if (userChoice === q.correctText) {
          currentScore += 1;
        }
      } else if (q.type === 'fraction_input') {
        const userNum = parseInt(answers[`q_${q.id}_num`] || '0', 10);
        const userDen = parseInt(answers[`q_${q.id}_den`] || '0', 10);
        if (userNum === q.ansNum && userDen === q.ansDen) {
          currentScore += 1;
        }
      } else if (q.type === 'decimal_input') {
        const userValStr = (answers[`q_${q.id}`] || '').trim().replace(',', '.');
        const userVal = parseFloat(userValStr);
        if (!isNaN(userVal) && Math.abs(userVal - q.correctVal) < 0.01) {
          currentScore += 1;
        }
      }
    });

    setScore(currentScore);
    setIsSubmitted(true);
  };

  return (
    <Layout
      title="Ασκήσεις: Η Έννοια του Λόγου - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="10 απαιτητικές ασκήσεις και προβλήματα αυξημένης δυσκολίας στην έννοια του λόγου, απλοποίηση, σύγκριση μεγεθών και αναλογίες για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/40-logos"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>📖 Θεωρία</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 space-y-8 pb-32">
        
        {/* Banner Header */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-14 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-sky-200">
              <span>ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΞΑΣΚΗΣΗ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Ασκήσεις &amp; Προβλήματα: Η Έννοια του Λόγου
            </h1>
            <p className="text-sky-100 text-sm sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              10 απαιτητικές δραστηριότητες που περιλαμβάνουν 4 ρεαλιστικά προβλήματα (2 βασικά &amp; 2 αυξημένης δυσκολίας). Συμπληρώστε τις απαντήσεις σας σε ανάγωγη μορφή και ελέγξτε την επίδοσή σας.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between">
            <span className="text-xs sm:text-sm text-sky-200">
              ⚡ Κάθε σετ δημιουργείται δυναμικά με τυχαίες παραμέτρους.
            </span>
            <button
              type="button"
              onClick={loadNewSet}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm"
            >
              <span>🔄 ΝΕΕΣ ΑΣΚΗΣΕΙΣ</span>
            </button>
          </div>
        </section>

        {/* Λιστα 10 Ασκησεων */}
        <div className="space-y-6">
          {questions.map((q, idx) => {
            let isCorrect = false;
            if (isSubmitted) {
              if (q.type === 'mcq') {
                isCorrect = answers[`q_${q.id}`] === q.correctText;
              } else if (q.type === 'fraction_input') {
                const un = parseInt(answers[`q_${q.id}_num`] || '0', 10);
                const ud = parseInt(answers[`q_${q.id}_den`] || '0', 10);
                isCorrect = un === q.ansNum && ud === q.ansDen;
              } else if (q.type === 'decimal_input') {
                const uv = parseFloat((answers[`q_${q.id}`] || '').replace(',', '.'));
                isCorrect = !isNaN(uv) && Math.abs(uv - q.correctVal) < 0.01;
              }
            }

            return (
              <article
                key={`q-${q.id}-${idx}`}
                className={`bg-white rounded-3xl border p-6 sm:p-8 shadow-sm transition-all ${
                  isSubmitted
                    ? isCorrect
                      ? 'border-emerald-400 bg-emerald-50/20'
                      : 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Επικεφαλιδα Ερωτησης */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg">
                    {q.title}
                  </span>
                  {isSubmitted && (
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isCorrect ? '✓ ΣΩΣΤΟ' : '✗ ΛΑΘΟΣ'}
                    </span>
                  )}
                </div>

                {/* Εκφωνηση */}
                <div className="space-y-2 mb-5">
                  <p className="text-xs sm:text-sm font-semibold text-slate-500">
                    {q.instruction}
                  </p>
                  <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                    {q.prompt}
                  </p>
                </div>

                {/* Περιοχη Απαντησης */}
                <div className="py-2">
                  
                  {/* 1. Fraction Input */}
                  {q.type === 'fraction_input' && (
                    <div className="flex items-center gap-3">
                      <div className="inline-flex items-center bg-slate-50 p-2.5 rounded-2xl border border-slate-300 shadow-inner gap-2">
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={10}
                          disabled={isSubmitted}
                          placeholder="αριθμητής"
                          value={answers[`q_${q.id}_num`] || ''}
                          onChange={(e) => handleInputChange(`q_${q.id}_num`, e.target.value)}
                          className="w-24 sm:w-28 text-center font-mono font-bold text-base sm:text-lg text-slate-900 bg-white border border-slate-300 rounded-xl py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                        />
                        <span className="text-xl sm:text-2xl font-black text-slate-500 px-1 select-none">
                          /
                        </span>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={10}
                          disabled={isSubmitted}
                          placeholder="παρονομαστής"
                          value={answers[`q_${q.id}_den`] || ''}
                          onChange={(e) => handleInputChange(`q_${q.id}_den`, e.target.value)}
                          className="w-24 sm:w-28 text-center font-mono font-bold text-base sm:text-lg text-slate-900 bg-white border border-slate-300 rounded-xl py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                        />
                      </div>
                      <span className="text-xs text-slate-500 hidden sm:inline">
                        (Μορφή λόγου: αριθμητής / παρονομαστής)
                      </span>
                    </div>
                  )}

                  {/* 2. Decimal / Single Input */}
                  {q.type === 'decimal_input' && (
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        inputMode="decimal"
                        maxLength={10}
                        disabled={isSubmitted}
                        placeholder="Απάντηση..."
                        value={answers[`q_${q.id}`] || ''}
                        onChange={(e) => handleInputChange(`q_${q.id}`, e.target.value)}
                        className="w-36 sm:w-44 text-center font-mono font-bold text-base sm:text-lg text-slate-900 bg-white border border-slate-300 rounded-2xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed shadow-inner"
                      />
                      <span className="text-xs text-slate-500">
                        (Ακέραιος ή δεκαδικός με κόμμα)
                      </span>
                    </div>
                  )}

                  {/* 3. Multiple Choice (MCQ) */}
                  {q.type === 'mcq' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = answers[`q_${q.id}`] === opt.text;
                        return (
                          <button
                            key={`opt-${q.id}-${oIdx}`}
                            type="button"
                            disabled={isSubmitted}
                            onClick={() => handleSelectMCQ(q.id, opt.text)}
                            className={`p-3.5 rounded-2xl border text-left font-semibold text-sm sm:text-base transition active:scale-98 touch-manipulation flex items-center justify-between ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                            } disabled:cursor-not-allowed`}
                          >
                            <span>{opt.text}</span>
                            <span
                              className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                                isSelected
                                  ? 'border-white bg-white text-blue-600 font-bold'
                                  : 'border-slate-400 bg-transparent'
                              }`}
                            >
                              {isSelected ? '●' : ''}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                </div>

                {/* Feedback μετα την υποβολη */}
                {isSubmitted && (
                  <div
                    className={`mt-4 p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed space-y-1.5 ${
                      isCorrect
                        ? 'bg-emerald-100/60 border-emerald-300 text-emerald-950'
                        : 'bg-rose-100/60 border-rose-300 text-rose-950'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <span>{isCorrect ? '🎉 Εξαιρετικά!' : '💡 Μαθηματική Επεξήγηση:'}</span>
                    </div>
                    <div>{q.explanation}</div>
                    {!isCorrect && (
                      <div className="font-semibold pt-1 text-slate-800">
                        Σωστή απάντηση:{' '}
                        {q.type === 'fraction_input' ? (
                          <span className="font-mono font-bold text-blue-900">
                            {q.ansNum} / {q.ansDen}
                          </span>
                        ) : q.type === 'decimal_input' ? (
                          <span className="font-mono font-bold text-blue-900">
                            {q.correctStr}
                          </span>
                        ) : (
                          <span className="font-mono font-bold text-blue-900">
                            {q.correctText}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Κουμπι Ελεγχου στο τελος της φορμας */}
        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={handleCheckAnswers}
            disabled={isSubmitted}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-lg px-8 py-4 rounded-2xl shadow-xl transition active:scale-95 touch-manipulation"
          >
            <span>🎯 Έλεγχος Απαντήσεων</span>
          </button>
        </div>

      </div>

      {/* Fixed Bottom Score Bar */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3.5 px-4 sm:px-8 shadow-2xl">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 sm:gap-8">
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold block">
                ΣΚΟΡ
              </span>
              <span className="font-mono font-black text-lg sm:text-2xl text-amber-300">
                {score} <span className="text-slate-500 text-base">/ 10</span>
              </span>
            </div>

            <div className="hidden xs:block border-l border-slate-700 pl-4 sm:pl-8">
              <span className="text-xs text-slate-400 uppercase font-semibold block">
                ΠΟΣΟΣΤΟ
              </span>
              <span className="font-mono font-black text-lg sm:text-2xl text-emerald-400">
                {Math.round((score / 10) * 100)} %
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleCheckAnswers}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm shadow-md transition active:scale-95 touch-manipulation uppercase"
              >
                ΕΛΕΓΧΟΣ
              </button>
            ) : (
              <button
                type="button"
                onClick={loadNewSet}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm shadow-md transition active:scale-95 touch-manipulation uppercase"
              >
                🔄 ΝΕΕΣ ΑΣΚΗΣΕΙΣ
              </button>
            )}
          </div>

        </div>
      </footer>
    </Layout>
  );
}
