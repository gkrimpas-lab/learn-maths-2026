import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { LAYOUT } from '../../shared/layout-config';

const QUESTIONS = [
  {
    id: 1,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    prompt: 'Ποια είναι η τιμή της παρακάτω αριθμητικής παράστασης;\n(13 : 2 − 2³ : 2) : 0,25 − 1⁵',
    options: ['9', '4', '1,5', '10'],
    correct: '9',
    explain: '2³ = 8. Έχουμε: 13 : 2 = 6,5 και 8 : 2 = 4. Άρα (6,5 − 4) = 2,5. Έπειτα: 2,5 : 0,25 = 10 (αφού 2,5 : 1/4 = 2,5 · 4 = 10). Τέλος, 1⁵ = 1, άρα 10 − 1 = 9.'
  },
  {
    id: 2,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    prompt: 'Ποιος είναι ο μικρότερος τετραψήφιος φυσικός αριθμός ο οποίος διαιρείται ταυτόχρονα με το 3, το 4 και το 5;',
    options: ['1.000', '1.020', '1.050', '1.080'],
    correct: '1.020',
    explain: 'Το Ε.Κ.Π.(3, 4, 5) = 60. Ψάχνουμε το μικρότερο πολλαπλάσιο του 60 που είναι ≥ 1.000. Διαιρούμε 1.000 : 60 = 16 (υπόλοιπο 40). Το επόμενο πολλαπλάσιο είναι 60 · 17 = 1.020.'
  },
  {
    id: 3,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    prompt: 'Ένα δοχείο είναι γεμάτο με λάδι κατά τα 7/10 του συνολικού του όγκου. Αδειάζουμε 3 ίδια φλιτζάνια λάδι από το δοχείο και πλέον είναι γεμάτο κατά το 1/10. Με πόσα τέτοια φλιτζάνια λάδι γεμίζει ολόκληρο το δοχείο αν είναι τελείως άδειο;',
    options: ['5', '6', '8', '10'],
    correct: '5',
    explain: 'Τα 3 φλιτζάνια αντιστοιχούν σε 7/10 − 1/10 = 6/10 = 3/5 του δοχείου. Άρα το 1 φλιτζάνι αντιστοιχεί σε (3/5) : 3 = 1/5 του δοχείου. Επομένως, για ολόκληρο το δοχείο (5/5) χρειάζονται ακριβώς 5 φλιτζάνια.'
  },
  {
    id: 4,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    prompt: 'Ένα ζευγάρι παπούτσια κόστιζε αρχικά 80€. Στις εκπτώσεις αγοράστηκε στην τιμή των 56€. Ποιο ήταν το ποσοστό (%) της έκπτωσης που έγινε στην αρχική τιμή;',
    options: ['24%', '30%', '40%', '70%'],
    correct: '30%',
    explain: 'Το ποσό της έκπτωσης είναι 80 − 56 = 24€. Το ποσοστό έκπτωσης επί της αρχικής τιμής είναι 24 / 80 = 3 / 10 = 30%.'
  },
  {
    id: 5,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    prompt: 'Το τριπλάσιο ενός άγνωστου αριθμού x, αυξημένο κατά το 1/3 του ίδιου αριθμού, ισούται με 20. Ποια από τις παρακάτω εξισώσεις περιγράφει σωστά το πρόβλημα;',
    options: ['3 · x − x : 3 = 20', '3 · x + x : 3 = 20', '3 · (x + x : 3) = 20', 'x : 3 + 3 = 20'],
    correct: '3 · x + x : 3 = 20',
    explain: 'Τριπλάσιο του x: 3 · x. Αυξημένο κατά το ένα τρίτο του: + x : 3. Άρα: 3 · x + x : 3 = 20.'
  },
  {
    id: 6,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    prompt: 'Ποιο από τα παρακάτω κλάσματα βρίσκεται πιο κοντά στον δεκαδικό αριθμό 0,8 στην αριθμογραμμή;',
    options: ['3/4', '7/10', '43/50', '21/25'],
    correct: '21/25',
    explain: 'Μετατρέπουμε σε δεκαδικούς: 3/4 = 0,75 (απόσταση |0,8 − 0,75| = 0,05), 7/10 = 0,70 (απόσταση 0,10), 43/50 = 0,86 (απόσταση 0,06), 21/25 = 0,84 (απόσταση |0,8 − 0,84| = 0,04). Η μικρότερη απόσταση είναι το 0,04, άρα το 21/25.'
  },
  {
    id: 7,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    prompt: 'Ο μέσος όρος 6 συνεχόμενων άρτιων (ζυγών) φυσικών αριθμών είναι 15. Ποιος είναι ο μεγαλύτερος από αυτούς τους έξι αριθμούς;',
    options: ['16', '18', '20', '22'],
    correct: '20',
    explain: 'Το άθροισμα των 6 αριθμών είναι 6 · 15 = 90. Αν ο πρώτος είναι α, οι αριθμοί είναι α, α+2, α+4, α+6, α+8, α+10. Άθροισμα: 6α + 30 = 90 ➔ 6α = 60 ➔ α = 10. Οι αριθμοί είναι 10, 12, 14, 16, 18, 20. Ο μεγαλύτερος είναι το 20.'
  },
  {
    id: 8,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    prompt: 'Ένα τετράγωνο έχει εμβαδόν 64 τ.εκ. Αν διπλασιάσουμε το μήκος της πλευράς του, πόσο θα γίνει η περίμετρος του νέου τετραγώνου;',
    options: ['32 εκ.', '48 εκ.', '64 εκ.', '128 εκ.'],
    correct: '64 εκ.',
    explain: 'Η πλευρά του αρχικού τετραγώνου είναι 8 εκ. (αφού 8 · 8 = 64). Διπλασιάζοντας την πλευρά, η νέα πλευρά γίνεται 2 · 8 = 16 εκ. Η νέα περίμετρος είναι 4 · 16 = 64 εκ.'
  },
  {
    id: 9,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    prompt: 'Η Ελένη και η Δήμητρα έχουν μαζί 45 βιβλία. Αν η Ελένη δώσει 5 βιβλία στη Δήμητρα, τότε η Δήμητρα θα έχει ακριβώς τα διπλάσια βιβλία από την Ελένη. Πόσα βιβλία είχε αρχικά η Ελένη;',
    options: ['15', '20', '25', '30'],
    correct: '20',
    explain: 'Το συνολικό πλήθος των βιβλίων παραμένει 45. Στο τέλος, αν η Ελένη έχει 1 μέρος, η Δήμητρα έχει 2 μέρη, δηλαδή σύνολο 3 ίσα μέρη. Κάθε μέρος είναι 45 : 3 = 15 βιβλία. Άρα στο τέλος η Ελένη έχει 15 βιβλία. Επειδή έδωσε 5, αρχικά είχε 15 + 5 = 20 βιβλία.'
  },
  {
    id: 10,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    prompt: 'Σε ποιον αριθμό αντιστοιχεί ο όρος που λείπει από το παρακάτω αριθμητικό μοτίβο;\n2, 6, 12, 20, 30, __, 56, 72',
    options: ['36', '40', '42', '45'],
    correct: '42',
    explain: 'Οι διαφορές των διαδοχικών όρων είναι: +4, +6, +8, +10, +12, +14, +16. Επομένως, μετά το 30 προσθέτουμε 12: 30 + 12 = 42 (και 42 + 14 = 56).'
  },
  {
    id: 11,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    prompt: 'Για την αγορά 6 ίδιων τετραδίων και 4 ίδιων στυλό πληρώσαμε συνολικά 24€. Αν αγοράζαμε 6 ίδια τετράδια και 7 ίδια στυλό θα πληρώναμε συνολικά 33€. Πόσα ευρώ κοστίζει το ένα τετράδιο;',
    options: ['1,5€', '2€', '2,5€', '3€', '4€'],
    correct: '2€',
    explain: 'Η διαφορά στα έξοδα οφείλεται στα 7 − 4 = 3 επιπλέον στυλό: 33 − 24 = 9€. Άρα το 1 στυλό κοστίζει 9 : 3 = 3€. Τα 4 στυλό κοστίζουν 4 · 3 = 12€. Συνεπώς τα 6 τετράδια κοστίζουν 24 − 12 = 12€, άρα το 1 τετράδιο κοστίζει 12 : 6 = 2€.'
  },
  {
    id: 12,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    prompt: 'Ο πληθυσμός των μελισσών σε μια πρότυπη κυψέλη αυξάνεται κατά 20% κάθε μήνα. Αν σήμερα η κυψέλη έχει 5.000 μέλισσες, πόσες μέλισσες θα έχει μετά από ακριβώς δύο μήνες;',
    options: ['6.000', '7.000', '7.200', '7.500', '8.000'],
    correct: '7.200',
    explain: '1ος μήνας: αύξηση 20% στο 5.000 = 1.000 ➔ 6.000 μέλισσες. 2ος μήνας: αύξηση 20% στο 6.000 = 1.200 ➔ 6.000 + 1.200 = 7.200 μέλισσες.'
  },
  {
    id: 13,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    prompt: 'Έχουμε τρία ίδια ποτήρια. Το 1ο ποτήρι είναι κατά 3/4 γεμάτο με νερό και το 2ο είναι κατά 1/2 γεμάτο με νερό. Αδειάζουμε όλο το νερό που περιείχε αρχικά το 3ο ποτήρι μέσα στο 1ο και στο 2ο ποτήρι, με αποτέλεσμα αυτά τα δύο να γεμίσουν τελείως. Τι μέρος του 3ου ποτηριού ήταν γεμάτο με νερό αρχικά;',
    options: ['1/4', '3/8', '1/2', '3/4', '7/8'],
    correct: '3/4',
    explain: 'Για να γεμίσει το 1ο ποτήρι χρειάζεται 1 − 3/4 = 1/4. Για να γεμίσει το 2ο ποτήρι χρειάζεται 1 − 1/2 = 1/2 = 2/4. Συνολικό νερό που έδωσε το 3ο ποτήρι: 1/4 + 2/4 = 3/4.'
  },
  {
    id: 14,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    prompt: 'Τα παιδιά του τμήματος ΣΤ1 ενός σχολείου χωρίστηκαν σε εξάδες για ένα παιχνίδι και περίσσεψαν 4 παιδιά. Την ίδια ημέρα, όταν όλα τα παιδιά των τμημάτων ΣΤ1 και ΣΤ2 μαζί χωρίστηκαν σε εξάδες, δεν περίσσεψε κανένα παιδί. Αν χωρίσουμε μόνο τα παιδιά του τμήματος ΣΤ2 σε εξάδες, πόσα παιδιά θα περισσέψουν;',
    options: ['1 παιδί', '2 παιδιά', '3 παιδιά', '4 παιδιά', 'Κανένα παιδί'],
    correct: '2 παιδιά',
    explain: 'Αφού το άθροισμα των παιδιών είναι πολλαπλάσιο του 6 και το ΣΤ1 αφήνει υπόλοιπο 4 όταν διαιρείται με το 6, το ΣΤ2 πρέπει να αφήνει υπόλοιπο 6 − 4 = 2 παιδιά, ώστε το άθροισμα των υπολοίπων (4 + 2 = 6) να σχηματίζει ακέραιη νέα εξάδα.'
  },
  {
    id: 15,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    prompt: 'Ο Γιώργος μπορεί να βάψει έναν μεγάλο τοίχο σε 6 ώρες, ενώ ο Δημήτρης μπορεί να βάψει τον ίδιο ακριβώς τοίχο σε 3 ώρες. Αν εργαστούν μαζί και με τον ίδιο ρυθμό, σε πόσες ώρες θα ολοκληρώσουν το βάψιμο του τοίχου;',
    options: ['1,5 ώρα', '2 ώρες', '3 ώρες', '4 ώρες', '4,5 ώρες'],
    correct: '2 ώρες',
    explain: 'Σε 1 ώρα ο Γιώργος βάφει το 1/6 του τοίχου και ο Δημήτρης το 1/3 = 2/6. Μαζί σε 1 ώρα βάφουν 1/6 + 2/6 = 3/6 = 1/2 του τοίχου. Άρα για ολόκληρο τον τοίχο χρειάζονται ακριβώς 2 ώρες.'
  },
  {
    id: 16,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    prompt: 'Ένας σχολικός κήπος έχει σχήμα ορθογωνίου με διαστάσεις 15 μέτρα και 10 μέτρα. Στο εσωτερικό του κήπου και κατά μήκος όλων των πλευρών του κατασκευάζουμε έναν πλακόστρωτο διάδρομο σταθερού πλάτους 1 μέτρου. Ποιο είναι το συνολικό εμβαδόν του διαδρόμου αυτού;',
    options: ['25 τ.μ.', '44 τ.μ.', '46 τ.μ.', '50 τ.μ.', '104 τ.μ.'],
    correct: '46 τ.μ.',
    explain: 'Το συνολικό αρχικό εμβαδόν είναι 15 · 10 = 150 τ.μ. Ο εσωτερικός χώρος που απομένει έχει διαστάσεις μειωμένες κατά 2 μέτρα σε κάθε διάσταση (1 μ. από κάθε πλευρά): μήκος 15 − 2 = 13 μ. και πλάτος 10 − 2 = 8 μ. Εμβαδόν εσωτερικού: 13 · 8 = 104 τ.μ. Εμβαδόν διαδρόμου: 150 − 104 = 46 τ.μ.'
  },
  {
    id: 17,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    prompt: 'Σε μια έρευνα για τις προτιμήσεις διακοπών των μαθητών, το 70% των ερωτηθέντων απάντησε ότι προτιμά το βουνό. Από αυτούς που δεν προτιμούν το βουνό, οι μισοί απάντησαν ότι προτιμούν τη θάλασσα. Αν όσοι προτιμούν τη θάλασσα είναι 45 μαθητές, πόσοι ήταν συνολικά οι μαθητές που συμμετείχαν στην έρευνα;',
    options: ['150', '200', '250', '300', '450'],
    correct: '300',
    explain: 'Αυτοί που δεν προτιμούν το βουνό είναι 100% − 70% = 30%. Οι μισοί από αυτούς είναι το 15% του συνόλου. Το 15% αντιστοιχεί σε 45 μαθητές. Άρα το σύνολο (100%) είναι (45 : 15) · 100 = 3 · 100 = 300 μαθητές.'
  },
  {
    id: 18,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    prompt: 'Ένα αυτοκίνητο κατανάλωσε το 1/8 της βενζίνης της συνολικής χωρητικότητας του ρεζερβουάρ του για ένα ταξίδι. Πριν ξεκινήσει το ταξίδι, το ρεζερβουάρ περιείχε 30 λίτρα βενζίνης. Μετά το τέλος του ταξιδιού, το ρεζερβουάρ ήταν ακριβώς μισογεμάτο. Πόσα λίτρα βενζίνης χωράει συνολικά το ρεζερβουάρ του αυτοκινήτου;',
    options: ['40 λίτρα', '45 λίτρα', '48 λίτρα', '50 λίτρα', '60 λίτρα'],
    correct: '48 λίτρα',
    explain: 'Έστω C η συνολική χωρητικότητα. Αρχικά είχαμε 30 λίτρα, αφαιρέθηκε C/8 και έμεινε C/2. Άρα: 30 − C/8 = C/2 ➔ 30 = C/2 + C/8 = 4C/8 + C/8 = 5C/8 ➔ 5C = 240 ➔ C = 48 λίτρα.'
  },
  {
    id: 19,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    prompt: 'Ο μέσος όρος των βαθμών ενός μαθητή σε 4 διαγωνίσματα Μαθηματικών είναι 15. Αν στο 5ο διαγώνισμα γράψει βαθμό 20, ποιος θα είναι ο νέος μέσος όρος των βαθμών του στα 5 διαγωνίσματα;',
    options: ['15', '15,5', '16', '16,5', '17'],
    correct: '16',
    explain: 'Το άθροισμα των 4 πρώτων διαγωνισμάτων είναι 4 · 15 = 60. Με το 5ο διαγώνισμα το νέο άθροισμα γίνεται 60 + 20 = 80. Ο νέος μέσος όρος είναι 80 : 5 = 16.'
  },
  {
    id: 20,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    prompt: 'Σε μια ατελή διαίρεση φυσικών αριθμών, το πηλίκο είναι 8 και το υπόλοιπο είναι 5. Αν γνωρίζουμε ότι ο διαιρετέος είναι διψήφιος αριθμός, πόσες διαφορετικές δυνατές τιμές μπορεί να πάρει ο διαιρέτης της διαίρεσης αυτής;',
    options: ['4', '5', '6', '7', '8'],
    correct: '6',
    explain: 'Ισχύει Δ = 8 · δ + 5. Επειδή το υπόλοιπο είναι 5, πρέπει ο διαιρέτης δ > 5 (άρα δ ≥ 6). Επιπλέον ο Δ είναι διψήφιος, άρα Δ ≤ 99 ➔ 8δ + 5 ≤ 99 ➔ 8δ ≤ 94 ➔ δ ≤ 11. Οι δυνατές τιμές του διαιρέτη είναι δ ∈ {6, 7, 8, 9, 10, 11}, δηλαδή ακριβώς 6 διαφορετικές τιμές.'
  },
  {
    id: 21,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    prompt: 'Ένα ορθογώνιο και ένα ισόπλευρο τρίγωνο έχουν την ίδια περίμετρο. Το ορθογώνιο έχει μήκος 11 εκ. και πλάτος 7 εκ. Πόσο είναι το μήκος της κάθε πλευράς του ισόπλευρου τριγώνου;',
    options: ['9 εκ.', '10 εκ.', '12 εκ.', '14 εκ.', '18 εκ.'],
    correct: '12 εκ.',
    explain: 'Η περίμετρος του ορθογωνίου είναι 2 · (11 + 7) = 2 · 18 = 36 εκ. Αφού το τρίγωνο είναι ισόπλευρο και έχει την ίδια περίμετρο, η κάθε πλευρά του ισούται με 36 : 3 = 12 εκ.'
  },
  {
    id: 22,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    prompt: 'Ένας ποδηλάτης διανύει απόσταση 18 χιλιομέτρων σε 45 λεπτά με σταθερή ταχύτητα. Πόσα χιλιόμετρα θα διανύσει σε 1 ώρα και 15 λεπτά αν διατηρήσει την ίδια ταχύτητα;',
    options: ['24 χλμ.', '27 χλμ.', '30 χλμ.', '32 χλμ.', '36 χλμ.'],
    correct: '30 χλμ.',
    explain: 'Ο χρόνος 1 ώρα και 15 λεπτά αντιστοιχεί σε 60 + 15 = 75 λεπτά. Η ταχύτητα ανά λεπτό είναι 18 : 45 = 2/5 = 0,4 χλμ./λεπτό. Σε 75 λεπτά θα διανύσει 75 · 0,4 = 30 χλμ.'
  },
  {
    id: 23,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    prompt: 'Ένας μαθητής ξόδεψε το 1/4 του χαρτζιλικιού του για ένα βιβλίο και στη συνέχεια το 40% των χρημάτων που του είχαν απομείνει για ένα παιχνίδι. Αν του έμειναν 18€, πόσο ήταν το αρχικό του χαρτζιλίκι;',
    options: ['36€', '40€', '45€', '48€', '60€'],
    correct: '40€',
    explain: 'Μετά το βιβλίο μένει το 1 − 1/4 = 3/4 (ή 75%) των χρημάτων. Ξοδεύει το 40% του 75% = 0,40 · 75% = 30% του αρχικού ποσού. Του απομένει 75% − 30% = 45% του αρχικού ποσού. Αν το 45% είναι 18€, το συνολικό ποσό είναι 18 : 0,45 = 40€.'
  },
  {
    id: 24,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    prompt: 'Σε ένα τουρνουά σκακιού συμμετέχουν 6 παίκτες. Κάθε παίκτης παίζει ακριβώς μία παρτίδα με καθέναν από τους υπόλοιπους παίκτες. Πόσες παρτίδες σκακιού θα διεξαχθούν συνολικά σε ολόκληρο το τουρνουά;',
    options: ['12', '15', '18', '30', '36'],
    correct: '15',
    explain: 'Κάθε παίκτης παίζει με τους υπόλοιπους 5. Για 6 παίκτες έχουμε 6 · 5 = 30 αναμετρήσεις. Επειδή κάθε παρτίδα μετράει και για τους δύο παίκτες, ο συνολικός αριθμός παρτίδων είναι 30 : 2 = 15.'
  },
  {
    id: 25,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    prompt: 'Ένας ανθοπώλης έχει 48 κόκκινα τριαντάφυλλα και 72 λευκά τριαντάφυλλα. Θέλει να φτιάξει όμοιες ανθοδέσμες, χρησιμοποιώντας όλα τα λουλούδια, έτσι ώστε κάθε ανθοδέσμη να έχει τον ίδιο αριθμό κόκκινων και τον ίδιο αριθμό λευκών τριαντάφυλλων. Ποιος είναι ο μέγιστος αριθμός από τέτοιες ανθοδέσμες που μπορεί να φτιάξει;',
    options: ['12', '16', '24', '36', '48'],
    correct: '24',
    explain: 'Ο μέγιστος αριθμός ανθοδεσμών αντιστοιχεί στον Μέγιστο Κοινό Διαιρέτη των αριθμών 48 και 72: Μ.Κ.Δ.(48, 72) = 24. Σε κάθε ανθοδέσμη θα υπάρχουν 48 : 24 = 2 κόκκινα και 72 : 24 = 3 λευκά τριαντάφυλλα.'
  }
];

const TOTAL_TIME_SECONDS = 60 * 60; // 60 λεπτά

export default function ProtoTestProsomoiosisPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME_SECONDS);
  const [timerEnabled, setTimerEnabled] = useState(true);

  const timerRef = useRef(null);

  // Ανάγνωση του query param `timer` (0 ή 1)
  useEffect(() => {
    if (router.isReady) {
      const { timer } = router.query;
      if (timer === '0') {
        setTimerEnabled(false);
      } else {
        setTimerEnabled(true);
      }
    }
  }, [router.isReady, router.query]);

  // Αντίστροφη μέτρηση
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

  const handleSelect = (qId, option) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const calculateScore = (currentAnswers) => {
    let s = 0;
    QUESTIONS.forEach(q => {
      if (currentAnswers[q.id] === q.correct) {
        s += 2; // 2 μόρια ανά σωστή απάντηση (σύνολο 50)
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

  return (
    <Layout
      title="🎯 1ο Τεστ Προσομοίωσης Προτύπων - LearnMaths.gr"
      description="1ο Διαγνωστικό Τεστ Προσομοίωσης Μαθηματικών για τα Πρότυπα Σχολεία: 25 θέματα, 60 λεπτά, βαθμολογία 0-50 με αναλυτικές λύσεις."
      backUrl="/protipa/test-prosomoiosis"
      backText="Τεστ Προσομοίωσης"
      hideFooter={true}
    >
      <div className="py-6 sm:py-8 space-y-6 pb-28 sm:pb-32">

        {/* HERO BANNER & TIMER HEADER */}
        <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 rounded-3xl p-5 sm:p-7 text-white shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1.5">
              <span className="inline-block bg-white/20 px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider text-purple-100">
                1ο Τεστ • 25 Θέματα (Άριστα: 50 Μόρια)
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
                1ο Τεστ Προσομοίωσης Εξετάσεων
              </h1>
            </div>

            {timerEnabled && (
              <div className={`px-4 py-2 rounded-2xl font-mono font-black text-base sm:text-lg flex items-center gap-2 shadow-inner self-stretch sm:self-auto justify-center ${
                timeLeft < 300 ? 'bg-rose-500 text-white animate-pulse' : 'bg-white text-indigo-950'
              }`}>
                <span>⏱️</span>
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-purple-100 border-t border-white/20 pt-3">
            <span>📝 Απαντημένες: <strong>{answeredCount} / 25</strong></span>
            <span>🎯 Βαθμολογία: <strong>2 μόρια / σωστό</strong></span>
            <span>{timerEnabled ? '⏳ Χρονόμετρο: Ενεργό (60\')' : '⏳ Χρονόμετρο: Ανενεργό'}</span>
          </div>
        </div>

        {/* FEEDBACK BANNER ΜΕΤΑ ΤΗΝ ΥΠΟΒΟΛΗ */}
        {submitted && (
          <div className="bg-white border-2 border-indigo-300 rounded-3xl p-6 shadow-md text-center space-y-3">
            <span className="text-4xl block">🏆</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Ολοκλήρωση Τεστ!
            </h2>
            <div className="inline-block bg-indigo-50 border border-indigo-200 px-6 py-2 rounded-2xl">
              <span className="text-xs font-bold text-indigo-800 uppercase block">Τελικό Σκορ</span>
              <span className="text-3xl sm:text-4xl font-mono font-black text-indigo-600">
                {score} / 50
              </span>
              <span className="text-xs font-bold text-slate-500 block mt-1">
                ({score / 2} σωστές στις 25 ερωτήσεις)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              Δες παρακάτω αναλυτικά ποιες ερωτήσεις απάντησες σωστά (✅) ή λάθος (❌) μαζί με την αναλυτική μαθηματική λύση για κάθε θέμα.
            </p>
          </div>
        )}

        {/* LIST OF 25 QUESTIONS */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {QUESTIONS.map((q) => {
            const userChoice = answers[q.id];
            const isCorrect = userChoice === q.correct;

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
                    <span className="bg-slate-100 text-slate-800 font-mono font-black text-xs px-3 py-1 rounded-xl">
                      Θέμα {q.id}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {q.group}
                    </span>
                  </div>

                  {submitted && (
                    <span className="text-lg font-black">
                      {isCorrect ? '✅ +2 μόρια' : '❌ 0 μόρια'}
                    </span>
                  )}
                </div>

                {/* ΕΚΦΩΝΗΣΗ */}
                <p className="text-sm sm:text-base text-slate-900 font-bold leading-relaxed whitespace-pre-line">
                  {q.prompt}
                </p>

                {/* ΕΠΙΛΟΓΕΣ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userChoice === opt;
                    let btnStyle = 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50';

                    if (submitted) {
                      if (opt === q.correct) {
                        btnStyle = 'bg-emerald-600 text-white border-emerald-600 shadow-sm font-black';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'bg-rose-600 text-white border-rose-600 font-black';
                      } else {
                        btnStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-indigo-600 text-white border-indigo-600 shadow-sm font-black';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={submitted}
                        onClick={() => handleSelect(q.id, opt)}
                        className={`p-3 rounded-2xl border text-left text-xs sm:text-sm transition flex items-center gap-3 ${btnStyle}`}
                      >
                        <span className={`w-6 h-6 rounded-xl flex items-center justify-center font-mono font-black text-xs shrink-0 border ${
                          isSelected || (submitted && opt === q.correct)
                            ? 'bg-white/20 border-white/40 text-white'
                            : 'bg-slate-100 border-slate-200 text-slate-700'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="font-mono font-bold leading-tight">{opt}</span>
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
                    <p className="font-medium">{q.explain}</p>
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
                className="w-full sm:w-auto bg-[#10b981] hover:bg-[#059669] text-white text-base sm:text-lg font-black px-10 py-4 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5"
              >
                <span>🎯</span>
                <span>Οριστική Υποβολή Τεστ ({answeredCount}/25)</span>
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
              {submitted ? `Σκορ: ${score} / 50` : `Απαντήσεις: ${answeredCount} / 25`}
            </div>
            {submitted ? (
              <span className="text-xs font-bold text-slate-300">
                Ποσοστό: <strong className="text-emerald-400">{Math.round((score / 50) * 100)}%</strong>
              </span>
            ) : (
              <span className="text-xs text-slate-300">
                Υπολείπονται: <strong>{25 - answeredCount}</strong>
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
                🔄 Επανάληψη Τεστ
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
