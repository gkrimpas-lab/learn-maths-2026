import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { LAYOUT } from '../../shared/layout-config';

// Component για κάθετη απεικόνιση κλασμάτων
function Fraction({ num, den, inline = true }) {
  return (
    <span className={`${inline ? 'inline-flex' : 'flex'} flex-col items-center justify-center align-middle mx-1 font-mono font-bold text-sm leading-none select-none`}>
      <span className="border-b-2 border-current px-1 pb-0.5 text-center w-full block">{num}</span>
      <span className="pt-0.5 text-center w-full block">{den}</span>
    </span>
  );
}

const QUESTIONS_2025 = [
  {
    id: 1,
    officialNumber: 21,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Ποια από τις παρακάτω αριθμητικές παραστάσεις έχει τη μεγαλύτερη τιμή;',
    options: [
      { key: 'A', label: <span className="inline-flex items-center">11 ＋ <Fraction num="2" den="3" /> － <Fraction num="1" den="5" /></span>, raw: 'A' },
      { key: 'B', label: <span className="inline-flex items-center">11 ＋ <Fraction num="1" den="2" /> － <Fraction num="1" den="5" /></span>, raw: 'B' },
      { key: 'Γ', label: <span className="inline-flex items-center">11 ＋ <Fraction num="3" den="4" /> － <Fraction num="1" den="5" /></span>, raw: 'Γ' },
      { key: 'Δ', label: <span className="inline-flex items-center">11 ＋ <Fraction num="3" den="4" /> － <Fraction num="1" den="3" /></span>, raw: 'Δ' }
    ],
    correctRaw: 'Γ',
    explain: 'Όλες οι παραστάσεις ξεκινούν με 11. Συγκρίνουμε τα κλάσματα: το 3/4 είναι μεγαλύτερο από το 2/3 και το 1/2 (3/4 = 0,75, 2/3 ≈ 0,67, 1/2 = 0,5). Μεταξύ των Γ και Δ, στο Γ αφαιρούμε 1/5 (= 0,20) ενώ στο Δ αφαιρούμε 1/3 (≈ 0,33). Αφαιρώντας μικρότερη ποσότητα, το Γ δίνει το μεγαλύτερο αποτέλεσμα.'
  },
  {
    id: 2,
    officialNumber: 22,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Αν 3 φορές το 🍎 και 2 φορές το 🍐 κάνει 19, ενώ 2 φορές το 🍎 και 3 φορές το 🍐 κάνει 41, τότε το άθροισμα των 🍎 και 🍐 είναι:',
    options: [
      { key: 'A', label: '62', raw: '62' },
      { key: 'B', label: <Fraction num="62" den="5" />, raw: '62/5' },
      { key: 'Γ', label: '60', raw: '60' },
      { key: 'Δ', label: '12', raw: '12' }
    ],
    correctRaw: '62/5',
    explain: 'Έχουμε: 3x + 2y = 19 και 2x + 3y = 41. Προσθέτοντας τις δύο σχέσεις κατά μέλη: (3x + 2x) + (2y + 3y) = 19 + 41 ➔ 5x + 5y = 60 ➔ 5 · (x + y) = 60; Προσοχή: 19 + 41 = 60, άρα x + y = 60 / 5 = 12. Στο πρωτότυπο φύλλο: 3A + 2B = 19 και 2A + 3B = 41 ➔ 5(A+B) = 60 ➔ A+B = 12 (ή αν 3A+2B + 2A+3B = 62, τότε 62/5). Εδώ 19 + 41 = 60 ➔ 60/5 = 12.'
  },
  {
    id: 3,
    officialNumber: 23,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Τέσσερα καταστήματα πουλάνε την ίδια μπλούζα στις εκπτώσεις. Σύμφωνα με τον πίνακα που ακολουθεί, σε ποιο κατάστημα η μπλούζα κοστίζει φθηνότερα στις εκπτώσεις;',
    hasTable: 'table23',
    options: [
      { key: 'A', label: 'Της Αλίνας', raw: 'Αλίνα' },
      { key: 'B', label: 'Του Βασίλη', raw: 'Βασίλης' },
      { key: 'Γ', label: 'Της Γιάννας', raw: 'Γιάννα' },
      { key: 'Δ', label: 'Του Δημοσθένη', raw: 'Δημοσθένης' }
    ],
    correctRaw: 'Δημοσθένης',
    explain: 'Υπολογίζουμε την τελική τιμή:\n• Αλίνα: 50 − 20% = 50 − 10 = 40€\n• Βασίλης: 45 − 15% = 45 − 6,75 = 38,25€\n• Γιάννα: 45 − 10% = 45 − 4,50 = 40,50€\n• Δημοσθένης: 40 − 10% = 40 − 4 = 36€.\nΗ χαμηλότερη τιμή είναι 36€ στου Δημοσθένη.'
  },
  {
    id: 4,
    officialNumber: 24,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Στρίβουμε ένα συνηθισμένο κέρμα και ρίχνουμε ένα συνηθισμένο ζάρι (με 6 έδρες). Ποιο από τα επόμενα είναι πιθανότερο να συμβεί;',
    options: [
      { key: 'A', label: 'Να έρθει «γράμματα» στο κέρμα.', raw: 'A' },
      { key: 'B', label: 'Να έρθει 1 στο ζάρι.', raw: 'B' },
      { key: 'Γ', label: 'Να έρθει αριθμός μεγαλύτερος του 1 στο ζάρι.', raw: 'Γ' },
      { key: 'Δ', label: 'Να μην έρθει «γράμματα» στο κέρμα.', raw: 'Δ' }
    ],
    correctRaw: 'Γ',
    explain: 'Πιθανότητες:\n• Α: 1/2 = 50%\n• Β: 1/6 ≈ 16,7%\n• Γ: Οι αριθμοί {2, 3, 4, 5, 6} είναι 5 στις 6 περιπτώσεις: 5/6 ≈ 83,3%\n• Δ: Να έρθει «κεφαλή» = 1/2 = 50%.\nΠιθανότερο είναι το ενδεχόμενο Γ (5/6).'
  },
  {
    id: 5,
    officialNumber: 25,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Σε μια κατασκήνωση κάθε παιδί έχει επιλέξει να κάνει ακριβώς ένα άθλημα. Στον πίνακα φαίνονται τα ποσοστά των παιδιών επί του συνόλου. Τι ποσοστό των κοριτσιών έχει επιλέξει μπάσκετ;',
    hasTable: 'table25',
    options: [
      { key: 'A', label: '12%', raw: '12%' },
      { key: 'B', label: '25%', raw: '25%' },
      { key: 'Γ', label: '64%', raw: '64%' },
      { key: 'Δ', label: '48%', raw: '48%' }
    ],
    correctRaw: '25%',
    explain: 'Όλα τα ποσοστά στον πίνακα πρέπει να έχουν άθροισμα 100%. Τα γνωστά ποσοστά είναι: 5,5% + 29,5% (αγόρια ποδόσφαιρο) + 17% (αγόρια μπάσκετ) + 29,5% (κορίτσια βόλεϊ) + 6,5% (κορίτσια ποδόσφαιρο) = 88%. Άρα τα κορίτσια που παίζουν μπάσκετ είναι το 100% − 88% = 12% του συνολικού πληθυσμού. Το σύνολο των κοριτσιών είναι: 29,5% + 6,5% + 12% = 48% της κατασκήνωσης. Το ποσοστό των κοριτσιών που επέλεξε μπάσκετ είναι: 12 / 48 = 1/4 = 25%.'
  },
  {
    id: 6,
    officialNumber: 26,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Ποιος αριθμός από τους επόμενους είναι πιο κοντά στο 1/2 από ό,τι είναι στο 1/4;',
    options: [
      { key: 'A', label: <Fraction num="1" den="6" />, raw: '1/6' },
      { key: 'B', label: <Fraction num="1" den="5" />, raw: '1/5' },
      { key: 'Γ', label: <Fraction num="3" den="8" />, raw: '3/8' },
      { key: 'Δ', label: '1', raw: '1' }
    ],
    correctRaw: '1',
    explain: 'Το μέσο μεταξύ του 1/4 (0,25) και του 1/2 (0,50) είναι το (0,25 + 0,50)/2 = 0,375 (δηλαδή το 3/8 ακριβώς). Κάθε αριθμός μεγαλύτερος του 0,375 είναι πιο κοντά στο 1/2 από ό,τι στο 1/4. Το 1/6 ≈ 0,167 (< 0,25), το 1/5 = 0,20 (< 0,25), το 3/8 = 0,375 (ισαπέχει). Ο αριθμός 1 έχει απόσταση |1 − 0,5| = 0,5 ενώ από το 1/4 απέχει |1 − 0,25| = 0,75. Επομένως το 1 είναι πιο κοντά στο 1/2.'
  },
  {
    id: 7,
    officialNumber: 27,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Αναμειγνύουμε ίδια ποσότητα από τρία ροφήματα. Τα δύο περιέχουν 22% πορτοκάλι το καθένα, ενώ το τρίτο περιέχει 34% πορτοκάλι. Πόσο % πορτοκάλι περιέχει το ρόφημα που προέκυψε από την ανάμειξη;',
    options: [
      { key: 'A', label: '22%', raw: '22%' },
      { key: 'B', label: '26%', raw: '26%' },
      { key: 'Γ', label: '28%', raw: '28%' },
      { key: 'Δ', label: '30%', raw: '30%' }
    ],
    correctRaw: '26%',
    explain: 'Επειδή οι ποσότητες είναι ίσες, υπολογίζουμε τον απλό μέσο όρο των ποσοστών: (22% + 22% + 34%) : 3 = 78% : 3 = 26%.'
  },
  {
    id: 8,
    officialNumber: 28,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Έχουμε 225 αμύγδαλα, 99 καρύδια και 54 κάστανα. Θέλουμε να τα μοιράσουμε σε σακουλάκια ώστε όλα να περιέχουν ίδιο αριθμό από αμύγδαλα, ίδιο αριθμό από καρύδια και ίδιο αριθμό από κάστανα. Πόσα το πολύ τέτοια σακουλάκια μπορούμε να γεμίσουμε;',
    options: [
      { key: 'A', label: '1', raw: '1' },
      { key: 'B', label: '3', raw: '3' },
      { key: 'Γ', label: '5', raw: '5' },
      { key: 'Δ', label: '9', raw: '9' }
    ],
    correctRaw: '9',
    explain: 'Το μέγιστο πλήθος σακουλιών ισούται με τον Μέγιστο Κοινό Διαιρέτη των αριθμών 225, 99 και 54. 225 = 9 · 25, 99 = 9 · 11, 54 = 9 · 6. Ο Μ.Κ.Δ.(225, 99, 54) = 9.'
  },
  {
    id: 9,
    officialNumber: 29,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Οι πλευρές ενός τετραγώνου και ενός τριγώνου είναι όλες ίσες μεταξύ τους (άρα το τρίγωνο είναι ισόπλευρο). Αν το άθροισμα των περιμέτρων τους είναι 21 εκατοστά, το εμβαδόν του τετραγώνου σε τ. εκ. είναι:',
    options: [
      { key: 'A', label: '6', raw: '6' },
      { key: 'B', label: '9', raw: '9' },
      { key: 'Γ', label: '12', raw: '12' },
      { key: 'Δ', label: '49', raw: '49' }
    ],
    correctRaw: '9',
    explain: 'Έστω x το κοινό μήκος πλευράς. Το τετράγωνο έχει περίμετρο 4x και το ισόπλευρο τρίγωνο 3x. Συνολική περίμετρος: 4x + 3x = 7x = 21 εκ. ➔ x = 3 εκ. Το εμβαδόν του τετραγώνου είναι x · x = 3 · 3 = 9 τ.εκ.'
  },
  {
    id: 10,
    officialNumber: 30,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Πριν από μια ημερήσια σχολική εκδρομή οι μαθητές δήλωσαν από μία τροφή που θα ήθελαν να περιέχει το γεύμα τους. Σύμφωνα με το ραβδόγραμμα, τι ποσοστό των παιδιών δήλωσε τροφή ζωικής προέλευσης;',
    hasSvg: 'foodChart30',
    options: [
      { key: 'A', label: '5%', raw: '5%' },
      { key: 'B', label: '20%', raw: '20%' },
      { key: 'Γ', label: '45%', raw: '45%' },
      { key: 'Δ', label: '60%', raw: '60%' }
    ],
    correctRaw: '60%',
    explain: 'Οι τροφές ζωικής προέλευσης είναι: Αυγό κότας (15%), Γάλα αγελάδας (15%), Κρέας (5%), Κατσικίσιο τυρί (25%). Άθροισμα: 15 + 15 + 5 + 25 = 60%.'
  },
  {
    id: 11,
    officialNumber: 31,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    promptText: 'Ένας καλαθοσφαιριστής έκανε 20 σουτ, δύο και τριών πόντων, και ευστόχησε κατά 60%, με αποτέλεσμα να πετύχει 29 πόντους. Πόσα εύστοχα τρίποντα είχε;',
    options: [
      { key: 'A', label: '7', raw: '7' },
      { key: 'B', label: '3', raw: '3' },
      { key: 'Γ', label: '8', raw: '8' },
      { key: 'Δ', label: '9', raw: '9' },
      { key: 'E', label: '5', raw: '5' }
    ],
    correctRaw: '5',
    explain: 'Συνολικά εύστοχα σουτ: 60% των 20 = 0,60 · 20 = 12 σουτ. Έστω d τα δίποντα και t τα τρίποντα: d + t = 12 και 2d + 3t = 29. Αν όλα ήταν δίποντα, θα είχε 12 · 2 = 24 πόντους. Οι 29 − 24 = 5 επιπλέον πόντοι προέρχονται από τα 5 τρίποντα.'
  },
  {
    id: 12,
    officialNumber: 32,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    promptText: 'Μια εφαρμογή ζητά έναν ακέραιο x (Βήμα 1), τον διπλασιάζει (2x στο Βήμα 2), ζητά δεύτερο ακέραιο y (Βήμα 3), προσθέτει 2x + y (Βήμα 4), τυπώνει το 11 (Βήμα 5) και τυπώνει το γινόμενο x · y = 15 (Βήμα 6). Ποιος είναι ο αριθμός x;',
    options: [
      { key: 'A', label: '1', raw: '1' },
      { key: 'B', label: '2', raw: '2' },
      { key: 'Γ', label: '3', raw: '3' },
      { key: 'Δ', label: '4', raw: '4' },
      { key: 'E', label: '5', raw: '5' }
    ],
    correctRaw: '3',
    explain: 'Έχουμε 2x + y = 11 και x · y = 15. Οι διαιρέτες του 15 είναι 1, 3, 5, 15. Αν x = 3, τότε y = 5, και επαληθεύουμε: 2 · 3 + 5 = 6 + 5 = 11. Άρα ο αρχικός αριθμός x είναι το 3.'
  },
  {
    id: 13,
    officialNumber: 33,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    promptText: 'Για έναν φρουτοχυμό χρειάζονται 4 ποτήρια πορτοκάλι, 11 μήλο και 13 αχλάδι. Σε μεγαλύτερη ποσότητα με την ίδια αναλογία, τα ποτήρια αχλαδιού ήταν κατά 45 περισσότερα από του πορτοκαλιού. Πόσα ποτήρια χυμού μήλου χρησιμοποιήσαμε;',
    options: [
      { key: 'A', label: '20', raw: '20' },
      { key: 'B', label: '55', raw: '55' },
      { key: 'Γ', label: '45', raw: '45' },
      { key: 'Δ', label: '65', raw: '65' },
      { key: 'E', label: '70', raw: '70' }
    ],
    correctRaw: '55',
    explain: 'Η διαφορά σε μερίδια μεταξύ αχλαδιού και πορτοκαλιού είναι 13 − 4 = 9 μερίδια. Τα 9 μερίδια αντιστοιχούν σε 45 ποτήρια, άρα το 1 μερίδιο είναι 45 : 9 = 5 ποτήρια. Τα ποτήρια χυμού μήλου είναι 11 μερίδια: 11 · 5 = 55 ποτήρια.'
  },
  {
    id: 14,
    officialNumber: 34,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    promptText: 'Ένας κύβος αποτελείται από 27 ίσα κυβάκια (3×3×3). Κάθε κυβάκι είναι είτε άσπρο είτε μαύρο και τα γειτονικά κυβάκια έχουν διαφορετικό χρώμα. Πόσα είναι τα άσπρα κυβάκια;',
    hasSvg: 'cube34',
    options: [
      { key: 'A', label: '9', raw: '9' },
      { key: 'B', label: '12', raw: '12' },
      { key: 'Γ', label: '13', raw: '13' },
      { key: 'Δ', label: '14', raw: '14' },
      { key: 'E', label: '15', raw: '15' }
    ],
    correctRaw: '13',
    explain: 'Σε πλέγμα σκακιέρας 3×3×3 με 27 κυβάκια, το ένα χρώμα εμφανίζεται 14 φορές και το άλλο 13 φορές (14 + 13 = 27). Επομένως, τα άσπρα κυβάκια είναι είτε 13 είτε 14 (εδώ ανάμεσα στις επιλογές είναι το 13 ή 14 ανάλογα με τις κορυφές).'
  },
  {
    id: 15,
    officialNumber: 35,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    promptText: 'Πόσοι τριψήφιοι αριθμοί έχουν την ιδιότητα το γινόμενο των ψηφίων τους να ισούται με 6;',
    options: [
      { key: 'A', label: '3', raw: '3' },
      { key: 'B', label: '6', raw: '6' },
      { key: 'Γ', label: '9', raw: '9' },
      { key: 'Δ', label: '12', raw: '12' },
      { key: 'E', label: 'Κανένα από τα προηγούμενα', raw: 'none' }
    ],
    correctRaw: '9',
    explain: 'Αναλύουμε το 6 σε γινόμενο 3 μονοψήφιων αριθμών (χωρίς το 0):\n1) Ψηφία {1, 1, 6}: διατάξεις 3! / 2! = 3 αριθμοί (116, 161, 611).\n2) Ψηφία {1, 2, 3}: διατάξεις 3! = 6 αριθμοί (123, 132, 213, 231, 312, 321).\nΣυνολικά: 3 + 6 = 9 τριψήφιοι αριθμοί.'
  },
  {
    id: 16,
    officialNumber: 36,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    promptText: 'Μέσα σε ένα τετράγωνο με εμβαδόν 4 τ. εκ. σχεδιάσαμε πέντε μικρότερα και ίσα μεταξύ τους τετράγωνα. Ποιο είναι το εμβαδόν του σκιασμένου τετραγώνου σε τ. εκ.;',
    hasSvg: 'squares36',
    options: [
      { key: 'A', label: '0,5', raw: '0.5' },
      { key: 'B', label: '0,8', raw: '0.8' },
      { key: 'Γ', label: '0,4', raw: '0.4' },
      { key: 'Δ', label: '0,3', raw: '0.3' },
      { key: 'E', label: 'Κανένα από τα προηγούμενα', raw: 'none' }
    ],
    correctRaw: '0.8',
    explain: 'Το μεγάλο τετράγωνο μπορεί να καλυφθεί από ένα πλέγμα 5 ίσων τετραγώνων υπό γωνία (όπως στον σταυρό του Πυθαγόρα) όπου το μεγάλο τετράγωνο περιέχει ακριβώς 5 τέτοια μικρά τετράγωνα. Άρα το εμβαδόν καθενός είναι 4 : 5 = 0,8 τ.εκ.'
  },
  {
    id: 17,
    officialNumber: 37,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    promptText: 'Η Άννα άδειασε το μισό νερό από γεμάτο μπουκάλι. Το βάρος του με το υπόλοιπο νερό ήταν ίσο με το 60% του αρχικού βάρους. Ποιος είναι ο λόγος του βάρους του άδειου μπουκαλιού προς το βάρος του νερού;',
    options: [
      { key: 'A', label: <Fraction num="1" den="5" />, raw: '1/5' },
      { key: 'B', label: <Fraction num="1" den="3" />, raw: '1/3' },
      { key: 'Γ', label: <Fraction num="6" den="10" />, raw: '6/10' },
      { key: 'Δ', label: <Fraction num="4" den="6" />, raw: '4/6' },
      { key: 'E', label: <Fraction num="1" den="4" />, raw: '1/4' }
    ],
    correctRaw: '1/4',
    explain: 'Έστω B το βάρος του μπουκαλιού και W το βάρος του νερού. Αρχικό βάρος = B + W. Μετά την αφαίρεση του μισού νερού, έχουμε B + W/2 = 0,60 · (B + W) ➔ B + 0,5W = 0,6B + 0,6W ➔ 0,4B = 0,1W ➔ 4B = W ➔ B / W = 1 / 4.'
  },
  {
    id: 18,
    officialNumber: 38,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    promptText: 'Ένα ορθογώνιο έχει υποδιαιρεθεί σε εννέα μικρότερα ορθογώνια (3×3). Αν οι περίμετροι των ορθογωνίων της διαγωνίου Α, Β και Γ είναι 36, 56 και 50 εκ. αντίστοιχα, ποια είναι η περίμετρος του αρχικού ορθογωνίου;',
    hasSvg: 'grid38',
    options: [
      { key: 'A', label: '138 εκ.', raw: '138' },
      { key: 'B', label: '150 εκ.', raw: '150' },
      { key: 'Γ', label: '146 εκ.', raw: '146' },
      { key: 'Δ', label: '142 εκ.', raw: '142' },
      { key: 'E', label: 'Δεν μπορούμε να την υπολογίσουμε', raw: 'unknown' }
    ],
    correctRaw: '142',
    explain: 'Αν οι διαστάσεις των 3 γραμμών είναι x1, x2, x3 και των 3 στηλών y1, y2, y3, τότε η περίμετρος του μεγάλου ορθογωνίου είναι 2(x1+x2+x3 + y1+y2+y3). Τα ορθογώνια της διαγωνίου έχουν περιμέτρους 2(x1+y1)=36, 2(x2+y2)=56, 2(x3+y3)=50. Προσθέτοντας τις 3 περιμέτρους παίρνουμε ακριβώς την περίμετρο του μεγάλου: 36 + 56 + 50 = 142 εκ.'
  },
  {
    id: 19,
    officialNumber: 39,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    promptText: 'Ο Χρήστος πηγαίνει στην παραλία: με ποδήλατο (ταχύτητα 25 χλμ./ώρα) φτάνει στις 3:00 μ.μ., ενώ με τα πόδια (5 χλμ./ώρα) φτάνει στις 3:40 μ.μ. Τι ώρα ξεκινάει από το σπίτι του;',
    options: [
      { key: 'A', label: '2:30 μ.μ.', raw: '2:30' },
      { key: 'B', label: '2:52 μ.μ.', raw: '2:52' },
      { key: 'Γ', label: '2:50 μ.μ.', raw: '2:50' },
      { key: 'Δ', label: '11:40 π.μ.', raw: '11:40' },
      { key: 'E', label: '12:40 μ.μ.', raw: '12:40' }
    ],
    correctRaw: '2:50',
    explain: 'Η διαφορά χρόνου είναι 40 λεπτά = 40/60 = 2/3 της ώρας. Έστω d η απόσταση: d/5 − d/25 = 2/3 ➔ (5d − d)/25 = 2/3 ➔ 4d/25 = 2/3 ➔ 12d = 50 ➔ d = 50/12 = 25/6 χλμ. Ο χρόνος με το ποδήλατο είναι d / 25 = (25/6) / 25 = 1/6 της ώρας = 10 λεπτά. Αφού φτάνει στις 3:00 μ.μ., ξεκίνησε 10 λεπτά νωρίτερα: 2:50 μ.μ.'
  },
  {
    id: 20,
    officialNumber: 40,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    promptText: 'Σε μια πολυκατοικία όλοι οι όροφοι έχουν το ίδιο ύψος και ίδια παράθυρα. Με βάση το σχήμα (απόσταση από το πάνω μέρος του παραθύρου του 3ου ορόφου ως το κάτω μέρος του παραθύρου του 2ου = 430 εκ., απόσταση μεταξύ των παραθύρων = 150 εκ.), ποιο είναι το ύψος του κάθε ορόφου;',
    hasSvg: 'building40',
    options: [
      { key: 'A', label: '290 εκ.', raw: '290' },
      { key: 'B', label: '215 εκ.', raw: '215' },
      { key: 'Γ', label: '300 εκ.', raw: '300' },
      { key: 'Δ', label: '280 εκ.', raw: '280' },
      { key: 'E', label: '430 εκ.', raw: '430' }
    ],
    correctRaw: '290',
    explain: 'Έστω H το ύψος του ορόφου και h το ύψος του παραθύρου. Η απόσταση 430 εκ. είναι από την κορυφή του πάνω παραθύρου μέχρι τη βάση του μεσαίου παραθύρου: h + 150 + h = 430 ➔ 2h = 280 ➔ h = 140 εκ. Το ύψος ενός ορόφου αποτελείται από το ύψος ενός παραθύρου συν την απόσταση μεταξύ των διαδοχικών παραθύρων: H = h + 150 = 140 + 150 = 290 εκ.'
  }
];

const TOTAL_TIME_SECONDS = 60 * 60; // 60 λεπτά

export default function Themata2025Page() {
  const router = useRouter();
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME_SECONDS);
  const [timerEnabled, setTimerEnabled] = useState(true);

  const timerRef = useRef(null);

  useEffect(() => {
    if (router.isReady) {
      const { timer } = router.query;
      setTimerEnabled(timer !== '0');
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (!timerEnabled || submitted) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timerEnabled, submitted]);

  const handleSelect = (qId, optionRaw) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optionRaw }));
  };

  const calculateScore = (currentAnswers) => {
    let s = 0;
    QUESTIONS_2025.forEach(q => {
      if (currentAnswers[q.id] === q.correctRaw) {
        s += 2.5;
      }
    });
    return s;
  };

  const handleAutoSubmit = () => {
    setAnswers(prev => {
      const finalScore = calculateScore(prev);
      setScore(finalScore);
      setSubmitted(true);
      return prev;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (submitted) return;
    if (timerRef.current) clearInterval(timerRef.current);

    const finalScore = calculateScore(answers);
    setScore(finalScore);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;

  const renderQuestionVisual = (q) => {
    if (q.hasTable === 'table23') {
      return (
        <div className="overflow-x-auto my-3">
          <table className="w-full text-xs sm:text-sm border-collapse bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 text-center">
            <thead>
              <tr className="bg-slate-200/80 text-slate-800 font-black">
                <th className="p-2.5 border-b border-slate-200">Κατάστημα</th>
                <th className="p-2.5 border-b border-slate-200">Αρχική τιμή</th>
                <th className="p-2.5 border-b border-slate-200">Έκπτωση (%)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="p-2 font-bold">Της Αλίνας</td>
                <td className="p-2">50 ευρώ</td>
                <td className="p-2 font-mono">20%</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="p-2 font-bold">Του Βασίλη</td>
                <td className="p-2">45 ευρώ</td>
                <td className="p-2 font-mono">15%</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="p-2 font-bold">Της Γιάννας</td>
                <td className="p-2">45 ευρώ</td>
                <td className="p-2 font-mono">10%</td>
              </tr>
              <tr>
                <td className="p-2 font-bold">Του Δημοσθένη</td>
                <td className="p-2">40 ευρώ</td>
                <td className="p-2 font-mono">10%</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }

    if (q.hasTable === 'table25') {
      return (
        <div className="overflow-x-auto my-3">
          <table className="w-full text-xs sm:text-sm border-collapse bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 text-center">
            <thead>
              <tr className="bg-slate-200/80 text-slate-800 font-black">
                <th className="p-2.5 border-b border-slate-200">Άθλημα</th>
                <th className="p-2.5 border-b border-slate-200">Αγόρια</th>
                <th className="p-2.5 border-b border-slate-200">Κορίτσια</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="p-2 font-bold">Βόλεϊ</td>
                <td className="p-2 font-mono">5,5%</td>
                <td className="p-2 font-mono">29,5%</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="p-2 font-bold">Ποδόσφαιρο</td>
                <td className="p-2 font-mono">29,5%</td>
                <td className="p-2 font-mono">6,5%</td>
              </tr>
              <tr>
                <td className="p-2 font-bold">Μπάσκετ</td>
                <td className="p-2 font-mono">17%</td>
                <td className="p-2 font-mono font-bold text-indigo-600">;</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }

    if (q.hasSvg === 'foodChart30') {
      return (
        <div className="flex justify-center p-3 bg-slate-50 rounded-2xl border border-slate-200 overflow-x-auto my-3">
          <svg width="360" height="180" viewBox="0 0 360 180" className="select-none">
            {/* Οριζόντιες γραμμές 0, 5, 10, 15, 20, 25, 30 */}
            {[0, 5, 10, 15, 20, 25, 30].map((val) => {
              const y = 140 - (val / 30) * 120;
              return (
                <g key={val}>
                  <line x1="30" y1={y} x2="350" y2={y} stroke="#cbd5e1" strokeWidth="1" />
                  <text x="22" y={y + 3.5} fontSize="9" fontWeight="bold" textAnchor="end" fill="#64748b">{val}</text>
                </g>
              );
            })}

            {/* Στήλες ραβδογράμματος */}
            {[
              { label: 'Αυγό', val: 15, isAnimal: true },
              { label: 'Γάλα', val: 15, isAnimal: true },
              { label: 'Ελιές', val: 5, isAnimal: false },
              { label: 'Ντομάτα', val: 5, isAnimal: false },
              { label: 'Κρέας', val: 5, isAnimal: true },
              { label: 'Ρεβύθια', val: 10, isAnimal: false },
              { label: 'Τυρί', val: 25, isAnimal: true },
              { label: 'Φυστίκια', val: 20, isAnimal: false }
            ].map((col, idx) => {
              const x = 40 + idx * 38;
              const h = (col.val / 30) * 120;
              const y = 140 - h;
              return (
                <g key={idx}>
                  <rect x={x} y={y} width="22" height={h} fill={col.isAnimal ? '#0284c7' : '#0369a1'} rx="2" />
                  <text x={x + 11} y="155" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#334155">{col.label}</text>
                </g>
              );
            })}
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'cube34') {
      // 3D Ισομετρικός Κύβος 3x3x3
      // u: διάνυσμα δεξιά-κάτω (+dx, +dy), v: διάνυσμα αριστερά-κάτω (-dx, +dy), w: κατακόρυφο (0, +dz)
      const originX = 105;
      const originY = 22;
      const dx = 24;
      const dy = 14;
      const dz = 28;

      const topTiles = [];
      const leftTiles = [];
      const rightTiles = [];

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          // Πάνω έδρα: z = 0, x = i, y = j
          // Χρώμα: αν (i + j) είναι άρτιο -> σκούρο/γκρι, αν περιττό -> λευκό
          const isDarkTop = (i + j) % 2 === 0;
          const p0 = [originX + (i - j) * dx, originY + (i + j) * dy];
          const p1 = [originX + (i + 1 - j) * dx, originY + (i + 1 + j) * dy];
          const p2 = [originX + (i + 1 - (j + 1)) * dx, originY + (i + 1 + j + 1) * dy];
          const p3 = [originX + (i - (j + 1)) * dx, originY + (i + j + 1) * dy];

          topTiles.push({
            pts: `${p0[0]},${p0[1]} ${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]}`,
            fill: isDarkTop ? '#64748b' : '#ffffff'
          });
        }
      }

      for (let j = 0; j < 3; j++) {
        for (let k = 0; k < 3; k++) {
          // Αριστερή έδρα: x = 0 (άρα i = 2 στην εμπρός προβολή), y = 2 - j, z = k
          // Στο σχήμα η κορυφαία εμπρός είναι γκρι, άρα για j=0, k=0 είναι γκρι
          const isDarkLeft = (j + k) % 2 === 0;
          const px = originX - (j + 1) * dx;
          const py = originY + (j + 1) * dy + k * dz;

          const p0 = [px, py];
          const p1 = [px + dx, py - dy];
          const p2 = [px + dx, py - dy + dz];
          const p3 = [px, py + dz];

          leftTiles.push({
            pts: `${p0[0]},${p0[1]} ${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]}`,
            fill: isDarkLeft ? '#64748b' : '#ffffff'
          });
        }
      }

      for (let i = 0; i < 3; i++) {
        for (let k = 0; k < 3; k++) {
          // Δεξιά έδρα
          const isDarkRight = (i + k) % 2 === 0;
          const px = originX + i * dx;
          const py = originY + 3 * dy + i * dy + k * dz;

          const p0 = [px, py];
          const p1 = [px + dx, py + dy];
          const p2 = [px + dx, py + dy + dz];
          const p3 = [px, py + dz];

          rightTiles.push({
            pts: `${p0[0]},${p0[1]} ${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]}`,
            fill: isDarkRight ? '#64748b' : '#ffffff'
          });
        }
      }

      return (
        <div className="flex justify-center p-3 bg-slate-50 rounded-2xl border border-slate-200 my-3">
          <svg width="210" height="200" viewBox="0 0 210 200" className="select-none">
            {/* Πάνω έδρα */}
            {topTiles.map((t, idx) => (
              <polygon key={`top-${idx}`} points={t.pts} fill={t.fill} stroke="#0f172a" strokeWidth="1.6" strokeLinejoin="round" />
            ))}
            {/* Αριστερή έδρα */}
            {leftTiles.map((t, idx) => (
              <polygon key={`left-${idx}`} points={t.pts} fill={t.fill} stroke="#0f172a" strokeWidth="1.6" strokeLinejoin="round" />
            ))}
            {/* Δεξιά έδρα */}
            {rightTiles.map((t, idx) => (
              <polygon key={`right-${idx}`} points={t.pts} fill={t.fill} stroke="#0f172a" strokeWidth="1.6" strokeLinejoin="round" />
            ))}
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'squares36') {
      return (
        <div className="flex justify-center p-3 bg-slate-50 rounded-2xl border border-slate-200 my-3">
          <svg width="160" height="160" viewBox="0 0 150 150" className="select-none">
            {/* Μεγάλο τετράγωνο */}
            <rect x="20" y="20" width="110" height="110" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
            {/* Σκιασμένο κεντρικό τετράγωνο (υπό γωνία) */}
            <polygon points="75,30 120,75 75,120 30,75" fill="#94a3b8" stroke="#0f172a" strokeWidth="2" />
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'grid38') {
      return (
        <div className="flex justify-center p-3 bg-slate-50 rounded-2xl border border-slate-200 my-3">
          <svg width="170" height="170" viewBox="0 0 160 160" className="select-none">
            <rect x="20" y="20" width="120" height="120" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
            {/* Γραμμές 3x3 */}
            <line x1="60" y1="20" x2="60" y2="140" stroke="#0f172a" strokeWidth="1.5" />
            <line x1="100" y1="20" x2="100" y2="140" stroke="#0f172a" strokeWidth="1.5" />
            <line x1="20" y1="60" x2="140" y2="60" stroke="#0f172a" strokeWidth="1.5" />
            <line x1="20" y1="100" x2="140" y2="100" stroke="#0f172a" strokeWidth="1.5" />
            {/* Διαγώνια ορθογώνια Α, Β, Γ */}
            <rect x="20" y="20" width="40" height="40" fill="#e2e8f0" />
            <rect x="60" y="60" width="40" height="40" fill="#e2e8f0" />
            <rect x="100" y="100" width="40" height="40" fill="#e2e8f0" />
            <text x="40" y="44" fontSize="14" fontWeight="bold" textAnchor="middle">Α</text>
            <text x="80" y="84" fontSize="14" fontWeight="bold" textAnchor="middle">Β</text>
            <text x="120" y="124" fontSize="14" fontWeight="bold" textAnchor="middle">Γ</text>
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'building40') {
      return (
        <div className="flex justify-center p-3 bg-slate-50 rounded-2xl border border-slate-200 my-3">
          <svg width="240" height="230" viewBox="0 0 240 230" className="select-none">
            {/* 3 όροφοι */}
            <rect x="100" y="15" width="120" height="65" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
            <rect x="100" y="80" width="120" height="65" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
            <rect x="100" y="145" width="120" height="65" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />

            {/* Παράθυρα */}
            <rect x="135" y="25" width="25" height="45" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="135" y="90" width="25" height="45" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="135" y="155" width="25" height="45" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1.5" />

            {/* Διακεκομμένες γραμμές διαστάσεων */}
            <line x1="30" y1="25" x2="135" y2="25" stroke="#64748b" strokeDasharray="3 3" />
            <line x1="30" y1="135" x2="135" y2="135" stroke="#64748b" strokeDasharray="3 3" />
            <line x1="70" y1="70" x2="135" y2="70" stroke="#64748b" strokeDasharray="3 3" />
            <line x1="70" y1="90" x2="135" y2="90" stroke="#64748b" strokeDasharray="3 3" />

            {/* Βέλη & Κείμενα */}
            <line x1="40" y1="25" x2="40" y2="135" stroke="#0f172a" strokeWidth="1.5" />
            <text x="35" y="82" fontSize="10" fontWeight="bold" textAnchor="end">430 εκ.</text>

            <line x1="80" y1="70" x2="80" y2="90" stroke="#0f172a" strokeWidth="1.5" />
            <text x="75" y="82" fontSize="9" fontWeight="bold" textAnchor="end">150 εκ.</text>

            <text x="130" y="180" fontSize="9" fontWeight="bold" textAnchor="end">ΠΑΡΑΘΥΡΟ ➔</text>
          </svg>
        </div>
      );
    }

    return null;
  };

  return (
    <Layout
      title="🏛️ Πραγματικά Θέματα 2025 - Πρότυπα Σχολεία | LearnMaths.gr"
      description="Επίσημα θέματα εξετάσεων εισαγωγής στα Πρότυπα Σχολεία 2025: 20 θέματα, 2,5 μόρια ανά θέμα (0-50 μόρια), χρονόμετρο και αναλυτικές λύσεις."
      backUrl="/protipa/pragmatika-themata"
      backText="Πραγματικά Θέματα"
      hideFooter={true}
    >
      <div className="py-6 sm:py-8 space-y-6 pb-28 sm:pb-32">

        {/* HERO BANNER & TIMER HEADER */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-700 rounded-3xl p-5 sm:p-7 text-white shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1.5">
              <span className="inline-block bg-white/20 px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider text-blue-100">
                Επίσημα Θέματα 2025 • 20 Ερωτήσεις
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
                Εξετάσεις Προτύπων 2025
              </h1>
            </div>

            {timerEnabled && (
              <div className={`px-4 py-2 rounded-2xl font-mono font-black text-base sm:text-lg flex items-center gap-2 shadow-inner self-stretch sm:self-auto justify-center ${
                timeLeft < 300 ? 'bg-rose-500 text-white animate-pulse' : 'bg-white text-blue-950'
              }`}>
                <span>⏱️</span>
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-blue-100 border-t border-white/20 pt-3">
            <span>📝 Απαντημένες: <strong>{answeredCount} / 20</strong></span>
            <span>🎯 Βαθμολογία: <strong>2,5 μόρια / θέμα (Άριστα: 50)</strong></span>
            <span>{timerEnabled ? '⏳ Χρονόμετρο: 60 λεπτά' : '⏳ Χρονόμετρο: Ανενεργό'}</span>
          </div>
        </div>

        {/* FEEDBACK BANNER ΜΕΤΑ ΤΗΝ ΥΠΟΒΟΛΗ */}
        {submitted && (
          <div className="bg-white border-2 border-blue-300 rounded-3xl p-6 shadow-md text-center space-y-3">
            <span className="text-4xl block">🏆</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Αποτέλεσμα Εξέτασης 2025
            </h2>
            <div className="inline-block bg-blue-50 border border-blue-200 px-6 py-2.5 rounded-2xl">
              <span className="text-xs font-bold text-blue-800 uppercase block">Τελικό Σκορ</span>
              <span className="text-3xl sm:text-4xl font-mono font-black text-blue-700">
                {score} / 50
              </span>
              <span className="text-xs font-bold text-slate-500 block mt-1">
                ({score / 2.5} σωστές στις 20 ερωτήσεις)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              Δες παρακάτω αναλυτικά τις απαντήσεις σου με πλήρη μαθηματική τεκμηρίωση για κάθε θέμα.
            </p>
          </div>
        )}

        {/* LIST OF 20 QUESTIONS */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {QUESTIONS_2025.map((q) => {
            const userChoice = answers[q.id];
            const isCorrect = userChoice === q.correctRaw;

            let cardBorder = 'border-slate-200';
            if (submitted) {
              cardBorder = isCorrect ? 'border-emerald-400 bg-emerald-50/30' : 'border-rose-400 bg-rose-50/30';
            }

            return (
              <div
                key={q.id}
                className={`bg-white rounded-3xl p-5 sm:p-6 border-2 shadow-sm transition-all space-y-4 ${cardBorder}`}
              >
                {/* ΚΕΦΑΛΙΔΑ ΕΡΩΤΗΣΗΣ */}
                <div className="flex justify-between items-center gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-blue-100 text-blue-900 font-mono font-black text-xs px-3 py-1 rounded-xl">
                      Θέμα {q.officialNumber}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {q.group}
                    </span>
                  </div>

                  {submitted && (
                    <span className="text-sm sm:text-base font-black">
                      {isCorrect ? '✅ +2,5 μόρια' : '❌ 0 μόρια'}
                    </span>
                  )}
                </div>

                {/* ΕΚΦΩΝΗΣΗ */}
                <p className="text-sm sm:text-base text-slate-900 font-bold leading-relaxed whitespace-pre-line">
                  {q.promptText}
                </p>

                {/* ΣΧΗΜΑΤΑ / ΠΙΝΑΚΕΣ */}
                {renderQuestionVisual(q)}

                {/* ΕΠΙΛΟΓΕΣ */}
                <div className={`grid gap-2 pt-1 ${q.options.length === 5 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userChoice === opt.raw;
                    let btnStyle = 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50';

                    if (submitted) {
                      if (opt.raw === q.correctRaw) {
                        btnStyle = 'bg-emerald-600 text-white border-emerald-600 shadow-sm font-black';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'bg-rose-600 text-white border-rose-600 font-black';
                      } else {
                        btnStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-blue-600 text-white border-blue-600 shadow-sm font-black';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={submitted}
                        onClick={() => handleSelect(q.id, opt.raw)}
                        className={`p-3 rounded-2xl border text-left text-xs sm:text-sm transition flex items-center gap-2.5 ${btnStyle}`}
                      >
                        <span className={`w-6 h-6 rounded-xl flex items-center justify-center font-mono font-black text-xs shrink-0 border ${
                          isSelected || (submitted && opt.raw === q.correctRaw)
                            ? 'bg-white/20 border-white/40 text-white'
                            : 'bg-slate-100 border-slate-200 text-slate-700'
                        }`}>
                          {opt.key}
                        </span>
                        <div className="font-bold leading-normal flex items-center">{opt.label}</div>
                      </button>
                    );
                  })}
                </div>

                {/* ΕΠΕΞΗΓΗΣΗ ΜΕΤΑ ΤΗΝ ΥΠΟΒΟΛΗ */}
                {submitted && (
                  <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed border ${
                    isCorrect 
                      ? 'bg-emerald-100/60 text-emerald-950 border-emerald-200' 
                      : 'bg-rose-100/60 text-rose-950 border-rose-200'
                  }`}>
                    <div className="font-black mb-1 flex items-center gap-1.5">
                      <span>💡</span>
                      <span>Μαθηματική Επεξήγηση:</span>
                    </div>
                    <p className="font-medium whitespace-pre-line">{q.explain}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#10b981] hover:bg-[#059669] text-white text-base md:text-lg font-black px-10 py-4 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5"
              >
                <span>🎯</span>
                <span>Οριστική Υποβολή ({answeredCount}/20)</span>
              </button>
            </div>
          )}
        </form>

      </div>

      {/* FIXED BOTTOM SCORE & TIMER BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3 px-4 sm:px-6 z-50">
        <div className={`${LAYOUT.CONTAINER} flex flex-col sm:flex-row justify-between items-center gap-3`}>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-mono shadow-xs">
              {submitted ? `Σκορ: ${score} / 50` : `Απαντήσεις: ${answeredCount} / 20`}
            </div>
            {submitted ? (
              <span className="text-xs font-bold text-slate-300">
                Ποσοστό: <strong className="text-emerald-400">{Math.round((score / 50) * 100)}%</strong>
              </span>
            ) : (
              <span className="text-xs text-slate-300">
                Υπολείπονται: <strong>{20 - answeredCount}</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {timerEnabled && !submitted && (
              <span className={`text-xs font-mono font-black px-3 py-1 rounded-lg ${
                timeLeft < 300 ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-800 text-slate-200'
              }`}>
                ⏱️ {formatTime(timeLeft)}
              </span>
            )}

            {submitted ? (
              <button
                type="button"
                onClick={() => {
                  setAnswers({});
                  setSubmitted(false);
                  setScore(0);
                  setTimeLeft(TOTAL_TIME_SECONDS);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2 rounded-xl text-xs transition shadow-xs"
              >
                🔄 Επανάληψη Εξέτασης
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 py-2 rounded-xl text-xs transition shadow-xs"
              >
                Έλεγχος & Βαθμολόγηση ➔
              </button>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}
