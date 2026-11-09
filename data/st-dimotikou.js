// data/st-dimotikou.js

export const ST_DIMOTIKOU_SECTIONS = [
  { 
    id: 'sec1', 
    title: 'Ενότητα 1: Φυσικοί & Δεκαδικοί Αριθμοί - Πράξεις',
    titleEn: 'Unit 1: Natural & Decimal Numbers - Operations'
  },
  { 
    id: 'sec2', 
    title: 'Ενότητα 2: Διαιρετότητα, ΜΚΔ, ΕΚΠ & Κλάσματα',
    titleEn: 'Unit 2: Divisibility, GCD, LCM & Fractions'
  },
  { 
    id: 'sec3', 
    title: 'Ενότητα 3: Εξισώσεις & Μεταβλητές',
    titleEn: 'Unit 3: Equations & Variables'
  },
  { 
    id: 'sec4', 
    title: 'Ενότητα 4: Λόγοι, Αναλογίες & Ποσοστά',
    titleEn: 'Unit 4: Ratios, Proportions & Percentages'
  },
  { 
    id: 'sec5', 
    title: 'Ενότητα 5: Στατιστική, Μοτίβα, Γεωμετρία & Μετρήσεις',
    titleEn: 'Unit 5: Statistics, Patterns, Geometry & Measurements'
  },
];

export const ST_DIMOTIKOU_MODULES = [
  // --- ΕΝΟΤΗΤΑ 1: ΑΡΙΘΜΟΙ & ΠΡΑΞΕΙΣ ---
  { 
    id: '01-fysikoi', 
    section: 'sec1', 
    label: '🔢 1. Φυσικοί αριθμοί', 
    labelEn: '🔢 1. Natural numbers',
    href: '/st-dimotikou/01-fysikoi' 
  },
  { 
    id: '02-dekadikoi', 
    section: 'sec1', 
    label: '🪙 2. Δεκαδικοί αριθμοί', 
    labelEn: '🪙 2. Decimal numbers',
    href: '/st-dimotikou/02-dekadikoi' 
  },
  { 
    id: '03-arithmoi-dekadika-klasmata', 
    section: 'sec1', 
    label: '🔄 3. Μετατροπή δεκαδικών σε δεκαδικά κλάσματα', 
    labelEn: '🔄 3. Converting decimals to decimal fractions',
    href: '/st-dimotikou/03-arithmoi-dekadika-klasmata' 
  },
  { 
    id: '04-sigkrisi-arithmon', 
    section: 'sec1', 
    label: '⚖️ 4. Σύγκριση και διάταξη δεκαδικών αριθμών', 
    labelEn: '⚖️ 4. Comparing and ordering decimals',
    href: '/st-dimotikou/04-sigkrisi-arithmon' 
  },
  { 
    id: '05-prosthesi', 
    section: 'sec1', 
    label: '➕ 5. Πρόσθεση φυσικών και δεκαδικών αριθμών', 
    labelEn: '➕ 5. Adding whole and decimal numbers',
    href: '/st-dimotikou/05-prosthesi' 
  },
  { 
    id: '06-pollaplasiasmos', 
    section: 'sec1', 
    label: '✖️ 6. Πολλαπλασιασμός φυσικών και δεκαδικών', 
    labelEn: '✖️ 6. Multiplying whole and decimal numbers',
    href: '/st-dimotikou/06-pollaplasiasmos' 
  },
  { 
    id: '07-pollaplasiasmos-dinameis-deka', 
    section: 'sec1', 
    label: '⚡ 7. Πολλαπλασιασμός με δυνάμεις του 10', 
    labelEn: '⚡ 7. Multiplying by powers of 10',
    href: '/st-dimotikou/07-pollaplasiasmos-dinameis-deka' 
  },
  { 
    id: '08-diairesi', 
    section: 'sec1', 
    label: '➗ 8. Διαίρεση φυσικών και δεκαδικών αριθμών', 
    labelEn: '➗ 8. Division of whole and decimal numbers',
    href: '/st-dimotikou/08-diairesi' 
  },
  { 
    id: '09-diairesi-dinameis-deka', 
    section: 'sec1', 
    label: '📉 9. Διαίρεση με δυνάμεις του 10', 
    labelEn: '📉 9. Dividing by powers of 10',
    href: '/st-dimotikou/09-diairesi-dinameis-deka' 
  },
  { 
    id: '10-proteraiotita-prakseon', 
    section: 'sec1', 
    label: '🧮 10. Προτεραιότητα των πράξεων', 
    labelEn: '🧮 10. Order of operations',
    href: '/st-dimotikou/10-proteraiotita-prakseon' 
  },
  { 
    id: '11-problimata', 
    section: 'sec1', 
    label: '💡 11. Στρατηγικές επίλυσης προβλημάτων', 
    labelEn: '💡 11. Problem-solving strategies',
    href: '/st-dimotikou/11-problimata' 
  },
  { 
    id: '12-stroggilopoiisi', 
    section: 'sec1', 
    label: '🎯 12. Στρογγυλοποίηση αριθμών', 
    labelEn: '🎯 12. Rounding numbers',
    href: '/st-dimotikou/12-stroggilopoiisi' 
  },

  // --- ΕΝΟΤΗΤΑ 2: ΔΙΑΙΡΕΤΟΤΗΤΑ, ΜΚΔ, ΕΚΠ & ΚΛΑΣΜΑΤΑ ---
  { 
    id: '13-diairetes', 
    section: 'sec2', 
    label: '🛡️ 13. Διαιρέτες φυσικού αριθμού', 
    labelEn: '🛡️ 13. Divisors of a natural number',
    href: '/st-dimotikou/13-diairetes' 
  },
  { 
    id: '14-mkd', 
    section: 'sec2', 
    label: '👑 14. Μέγιστος Κοινός Διαιρέτης (Μ.Κ.Δ.)', 
    labelEn: '👑 14. Greatest Common Divisor (GCD)',
    href: '/st-dimotikou/14-mkd' 
  },
  { 
    id: '15-kritiria-diairetotitas', 
    section: 'sec2', 
    label: '🔍 15. Κριτήρια διαιρετότητας', 
    labelEn: '🔍 15. Divisibility rules',
    href: '/st-dimotikou/15-kritiria-diairetotitas' 
  },
  { 
    id: '16-protoi', 
    section: 'sec2', 
    label: '💎 16. Πρώτοι και σύνθετοι αριθμοί', 
    labelEn: '💎 16. Prime and composite numbers',
    href: '/st-dimotikou/16-protoi' 
  },
  { 
    id: '17-paragontopoiisi', 
    section: 'sec2', 
    label: '🌳 17. Ανάλυση σε γινόμενο πρώτων παραγόντων', 
    labelEn: '🌳 17. Prime factorization',
    href: '/st-dimotikou/17-paragontopoiisi' 
  },
  { 
    id: '18-pollaplasia', 
    section: 'sec2', 
    label: '📈 18. Πολλαπλάσια φυσικού αριθμού', 
    labelEn: '📈 18. Multiples of a natural number',
    href: '/st-dimotikou/18-pollaplasia' 
  },
  { 
    id: '19-ekp', 
    section: 'sec2', 
    label: '🎯 19. Ελάχιστο Κοινό Πολλαπλάσιο (Ε.Κ.Π.)', 
    labelEn: '🎯 19. Least Common Multiple (LCM)',
    href: '/st-dimotikou/19-ekp' 
  },
  { 
    id: '20-ekp-protoi', 
    section: 'sec2', 
    label: '⚙️ 20. Υπολογισμός Ε.Κ.Π. με πρώτους παράγοντες', 
    labelEn: '⚙️ 20. Finding LCM using prime factorization',
    href: '/st-dimotikou/20-ekp-protoi' 
  },
  { 
    id: '21-dinameis', 
    section: 'sec2', 
    label: '💪 21. Η έννοια της δύναμης (Δυνάμεις φυσικών)', 
    labelEn: '💪 21. Concept of exponents and powers',
    href: '/st-dimotikou/21-dinameis' 
  },
  { 
    id: '22-dinameis-deka', 
    section: 'sec2', 
    label: '🚀 22. Δυνάμεις του 10', 
    labelEn: '🚀 22. Powers of 10',
    href: '/st-dimotikou/22-dinameis-deka' 
  },
  { 
    id: '23-klasma', 
    section: 'sec2', 
    label: '🍕 23. Η έννοια του κλάσματος και είδη κλασμάτων', 
    labelEn: '🍕 23. Concept and types of fractions',
    href: '/st-dimotikou/23-klasma' 
  },
  { 
    id: '24-klasma-se-dekadiko', 
    section: 'sec2', 
    label: '📊 24. Μετατροπή κλάσματος σε δεκαδικό αριθμό', 
    labelEn: '📊 24. Converting fractions to decimals',
    href: '/st-dimotikou/24-klasma-se-dekadiko' 
  },
  { 
    id: '25-isodinama-klasmata', 
    section: 'sec2', 
    label: '🪞 25. Ισοδύναμα κλάσματα και απλοποίηση', 
    labelEn: '🪞 25. Equivalent fractions and simplification',
    href: '/st-dimotikou/25-isodinama-klasmata' 
  },
  { 
    id: '26-sigkrisi-klasmaton', 
    section: 'sec2', 
    label: '⚖️ 26. Σύγκριση και διάταξη κλασμάτων', 
    labelEn: '⚖️ 26. Comparing and ordering fractions',
    href: '/st-dimotikou/26-sigkrisi-klasmaton' 
  },
  { 
    id: '27-prosthesi-klasmaton', 
    section: 'sec2', 
    label: '➕ 27. Πρόσθεση κλασμάτων', 
    labelEn: '➕ 27. Addition of fractions',
    href: '/st-dimotikou/27-prosthesi-klasmaton' 
  },
  { 
    id: '28-afairesi-klasmaton', 
    section: 'sec2', 
    label: '➖ 28. Αφαίρεση κλασμάτων', 
    labelEn: '➖ 28. Subtraction of fractions',
    href: '/st-dimotikou/28-afairesi-klasmaton' 
  },
  { 
    id: '29-pollaplasiasmos-klasmaton', 
    section: 'sec2', 
    label: '✖️ 29. Πολλαπλασιασμός κλασμάτων', 
    labelEn: '✖️ 29. Multiplication of fractions',
    href: '/st-dimotikou/29-pollaplasiasmos-klasmaton' 
  },
  { 
    id: '30-diairesi-klasmaton', 
    section: 'sec2', 
    label: '➗ 30. Διαίρεση κλασμάτων (Αντίστροφοι αριθμοί)', 
    labelEn: '➗ 30. Division of fractions and reciprocals',
    href: '/st-dimotikou/30-diairesi-klasmaton' 
  },
  { 
    id: '31-epanalipsi-1', 
    section: 'sec2', 
    label: '🏆 31. Επανάληψη: Κεφάλαια 1 – 30', 
    labelEn: '🏆 31. Review: Chapters 1 – 30',
    href: '/st-dimotikou/31-epanalipsi-1', 
    isReview: true 
  },

  // --- ΕΝΟΤΗΤΑ 3: ΕΞΙΣΩΣΕΙΣ ---
  { 
    id: '32-metabliti', 
    section: 'sec3', 
    label: '🧩 32. Η έννοια της μεταβλητής (x)', 
    labelEn: '🧩 32. The concept of a variable (x)',
    href: '/st-dimotikou/32-metabliti' 
  },
  { 
    id: '33-agnostos-kai-prosthesi', 
    section: 'sec3', 
    label: '➕ 33. Εξισώσεις: x ＋ α ＝ β', 
    labelEn: '➕ 33. Equations: x ＋ a ＝ b',
    href: '/st-dimotikou/33-agnostos-kai-prosthesi' 
  },
  { 
    id: '34-agnostos-kai-afairesi', 
    section: 'sec3', 
    label: '➖ 34. Εξισώσεις: x － α ＝ β', 
    labelEn: '➖ 34. Equations: x － a ＝ b',
    href: '/st-dimotikou/34-agnostos-kai-afairesi' 
  },
  { 
    id: '35-gnostos-meion-agnostos', 
    section: 'sec3', 
    label: '🔻 35. Εξισώσεις: α － x ＝ β', 
    labelEn: '🔻 35. Equations: a － x ＝ b',
    href: '/st-dimotikou/35-gnostos-meion-agnostos' 
  },
  { 
    id: '36-gnostos-epi-agnostos', 
    section: 'sec3', 
    label: '✖️ 36. Εξισώσεις: α · x ＝ β', 
    labelEn: '✖️ 36. Equations: a · x ＝ b',
    href: '/st-dimotikou/36-gnostos-epi-agnostos' 
  },
  { 
    id: '37-agnostos-dia-gnostos', 
    section: 'sec3', 
    label: '➗ 37. Εξισώσεις: x : α ＝ β', 
    labelEn: '➗ 37. Equations: x : a ＝ b',
    href: '/st-dimotikou/37-agnostos-dia-gnostos' 
  },
  { 
    id: '38-gnostos-dia-agnostos', 
    section: 'sec3', 
    label: '🔄 38. Εξισώσεις: α : x ＝ β', 
    labelEn: '🔄 38. Equations: a : x ＝ b',
    href: '/st-dimotikou/38-gnostos-dia-agnostos' 
  },
  { 
    id: '39-epanalipsi-2', 
    section: 'sec3', 
    label: '🏆 39. Επανάληψη: Κεφάλαια 32 – 38', 
    labelEn: '🏆 39. Review: Chapters 32 – 38',
    href: '/st-dimotikou/39-epanalipsi-2', 
    isReview: true 
  },

  // --- ΕΝΟΤΗΤΑ 4: ΛΟΓΟΙ, ΑΝΑΛΟΓΙΕΣ & ΠΟΣΟΣΤΑ ---
  { 
    id: '40-logos', 
    section: 'sec4', 
    label: '⚖️ 40. Λόγος δύο μεγεθών', 
    labelEn: '⚖️ 40. Ratio of two quantities',
    href: '/st-dimotikou/40-logos' 
  },
  { 
    id: '41-analogia', 
    section: 'sec4', 
    label: '🔗 41. Από τους λόγους στις αναλογίες', 
    labelEn: '🔗 41. From ratios to proportions',
    href: '/st-dimotikou/41-analogia' 
  },
  { 
    id: '42-analogia-xiasti', 
    section: 'sec4', 
    label: '⚔️ 42. Ιδιότητες αναλογιών (Γινόμενα χιαστί)', 
    labelEn: '⚔️ 42. Proportion properties (Cross-multiplication)',
    href: '/st-dimotikou/42-analogia-xiasti' 
  },
  { 
    id: '43-posa', 
    section: 'sec4', 
    label: '📌 43. Σταθερά και μεταβλητά ποσά', 
    labelEn: '📌 43. Constant and variable quantities',
    href: '/st-dimotikou/43-posa' 
  },
  { 
    id: '44-analoga-posa', 
    section: 'sec4', 
    label: '📈 44. Ανάλογα ποσά και συντελεστής αναλογίας', 
    labelEn: '📈 44. Directly proportional quantities and constant',
    href: '/st-dimotikou/44-analoga-posa' 
  },
  { 
    id: '45-problem-analoga-posa', 
    section: 'sec4', 
    label: '🛒 45. Προβλήματα με ανάλογα ποσά', 
    labelEn: '🛒 45. Problems with directly proportional quantities',
    href: '/st-dimotikou/45-problem-analoga-posa' 
  },
  { 
    id: '46-antistrofos-analoga-posa', 
    section: 'sec4', 
    label: '📉 46. Αντιστρόφως ανάλογα ποσά', 
    labelEn: '📉 46. Inversely proportional quantities',
    href: '/st-dimotikou/46-antistrofos-analoga-posa' 
  },
  { 
    id: '47-problem-antistrofos-analoga-posa', 
    section: 'sec4', 
    label: '⏳ 47. Προβλήματα με αντιστρόφως ανάλογα ποσά', 
    labelEn: '⏳ 47. Problems with inversely proportional quantities',
    href: '/st-dimotikou/47-problem-antistrofos-analoga-posa' 
  },
  { 
    id: '48-methodos-trion', 
    section: 'sec4', 
    label: '📋 48. Απλή μέθοδος των τριών στα ανάλογα ποσά', 
    labelEn: '📋 48. Rule of three with direct proportions',
    href: '/st-dimotikou/48-methodos-trion' 
  },
  { 
    id: '49-antistrofos-methodos-trion', 
    section: 'sec4', 
    label: '🔄 49. Απλή μέθοδος των τριών στα αντίστροφα ποσά', 
    labelEn: '🔄 49. Rule of three with inverse proportions',
    href: '/st-dimotikou/49-antistrofos-analoga-posa' 
  },
  { 
    id: '50-pososta', 
    section: 'sec4', 
    label: '🏷️ 50. Η έννοια του ποσοστού', 
    labelEn: '🏷️ 50. The concept of percentage (%)',
    href: '/st-dimotikou/50-pososta' 
  },
  { 
    id: '51-problimata-me-pososta', 
    section: 'sec4', 
    label: '💡 51. Προβλήματα με ποσοστά', 
    labelEn: '💡 51. Real-world percentage problems',
    href: '/st-dimotikou/51-problimata-me-pososta' 
  },
  { 
    id: '52-brisko-arxiki-timi', 
    section: 'sec4', 
    label: '🔙 52. Εύρεση της αρχικής τιμής', 
    labelEn: '🔙 52. Finding the initial value from percentage',
    href: '/st-dimotikou/52-brisko-arxiki-timi' 
  },
  { 
    id: '53-ksero-arxiki-teliki-timi', 
    section: 'sec4', 
    label: '🔍 53. Εύρεση ποσοστού (αρχική και τελική τιμή)', 
    labelEn: '🔍 53. Calculating percentage rate (initial and final value)',
    href: '/st-dimotikou/53-ksero-arxiki-teliki-timi' 
  },
  { 
    id: '54-epanalipsi-3', 
    section: 'sec4', 
    label: '🏆 54. Επανάληψη: Κεφάλαια 40 – 53', 
    labelEn: '🏆 54. Review: Chapters 40 – 53',
    href: '/st-dimotikou/54-epanalipsi-3', 
    isReview: true 
  },

  // --- ΕΝΟΤΗΤΑ 5: ΣΤΑΤΙΣΤΙΚΗ, ΜΟΤΙΒΑ, ΓΕΩΜΕΤΡΙΑ & ΜΕΤΡΗΣΕΙΣ ---
  { 
    id: '55-apeikonisi-data', 
    section: 'sec5', 
    label: '📊 55. Συλλογή δεδομένων: Ραβδόγραμμα & εικονόγραμμα', 
    labelEn: '📊 55. Data collection: Bar charts & pictograms',
    href: '/st-dimotikou/55-apeikonisi-data' 
  },
  { 
    id: '56-pinakas-sixnotiton', 
    section: 'sec5', 
    label: '📑 56. Ταξινόμηση δεδομένων & πίνακας συχνοτήτων', 
    labelEn: '📑 56. Data classification & frequency tables',
    href: '/st-dimotikou/56-pinakas-sixnotiton' 
  },
  { 
    id: '57-alla-grafimata', 
    section: 'sec5', 
    label: '🥧 57. Γραφήματα γραμμής & κυκλικά διαγράμματα', 
    labelEn: '🥧 57. Line graphs & pie charts',
    href: '/st-dimotikou/57-alla-grafimata' 
  },
  { 
    id: '58-mesos-oros', 
    section: 'sec5', 
    label: '🎯 58. Μέσος Όρος', 
    labelEn: '🎯 58. Mean (Average)',
    href: '/st-dimotikou/58-mesos-oros' 
  },
  { 
    id: '59-mikos', 
    section: 'sec5', 
    label: '📏 59. Μέτρηση Μήκους', 
    labelEn: '📏 59. Measuring length',
    href: '/st-dimotikou/59-mikos' 
  },
  { 
    id: '60-baros', 
    section: 'sec5', 
    label: '⚖️ 60. Μέτρηση Βάρους (Μάζας)', 
    labelEn: '⚖️ 60. Measuring weight (mass)',
    href: '/st-dimotikou/60-baros' 
  },
  { 
    id: '61-xronos', 
    section: 'sec5', 
    label: '⏰ 61. Μέτρηση Χρόνου', 
    labelEn: '⏰ 61. Measuring time',
    href: '/st-dimotikou/61-xronos' 
  },
  { 
    id: '62-xrimata', 
    section: 'sec5', 
    label: '💶 62. Χρήματα - Ευρώ', 
    labelEn: '💶 62. Money - Euro transactions',
    href: '/st-dimotikou/62-xrimata' 
  },
  { 
    id: '63-geometrika-motiba', 
    section: 'sec5', 
    label: '🔷 63. Γεωμετρικά Μοτίβα', 
    labelEn: '🔷 63. Geometric patterns',
    href: '/st-dimotikou/63-geometrika-motiba' 
  },
  { 
    id: '64-arithmitika-motiba', 
    section: 'sec5', 
    label: '🔢 64. Αριθμητικά Μοτίβα', 
    labelEn: '🔢 64. Number patterns',
    href: '/st-dimotikou/64-arithmitika-motiba' 
  },
  { 
    id: '65-sintheta-motiba', 
    section: 'sec5', 
    label: '🌀 65. Σύνθετα Μοτίβα', 
    labelEn: '🌀 65. Complex repeating patterns',
    href: '/st-dimotikou/65-sintheta-motiba' 
  },
  { 
    id: '66-epanalipsi-4', 
    section: 'sec5', 
    label: '🏆 66. Επανάληψη: Κεφάλαια 55 – 65', 
    labelEn: '🏆 66. Review: Chapters 55 – 65',
    href: '/st-dimotikou/66-epanalipsi-4', 
    isReview: true 
  },
  { 
    id: '67-sximata', 
    section: 'sec5', 
    label: '📐 67. Γεωμετρικά Σχήματα - Πολύγωνα', 
    labelEn: '📐 67. Geometric shapes - Polygons',
    href: '/st-dimotikou/67-sximata' 
  },
  { 
    id: '68-gonies', 
    section: 'sec5', 
    label: '🧭 68. Γωνίες και είδη γωνιών', 
    labelEn: '🧭 68. Angles and angle types',
    href: '/st-dimotikou/68-gonies' 
  },
  { 
    id: '69-athroisma-gonion', 
    section: 'sec5', 
    label: '🔺 69. Άθροισμα Γωνιών Τριγώνου & Τετραπλεύρου', 
    labelEn: '🔺 69. Angle sum of triangles & quadrilaterals',
    href: '/st-dimotikou/69-athroisma-gonion' 
  },
  { 
    id: '70-megethinsi-smikrinsi', 
    section: 'sec5', 
    label: '🔎 70. Κλίμακα - Μεγέθυνση & Σμίκρυνση σχημάτων', 
    labelEn: '🔎 70. Scale - Enlargement & reduction of shapes',
    href: '/st-dimotikou/70-megethinsi-smikrinsi' 
  },
  { 
    id: '71-simmetria', 
    section: 'sec5', 
    label: '🪞 71. Αξονική Συμμετρία', 
    labelEn: '🪞 71. Line symmetry',
    href: '/st-dimotikou/71-simmetria' 
  },
  { 
    id: '72-embadon', 
    section: 'sec5', 
    label: '🟩 72. Μέτρηση Επιφανειών - Εμβαδόν', 
    labelEn: '🟩 72. Surface measurement - Area',
    href: '/st-dimotikou/72-embadon' 
  },
  { 
    id: '73-embadon-parallilogrammou', 
    section: 'sec5', 
    label: '▰ 73. Εμβαδόν Παραλληλογράμμου', 
    labelEn: '▰ 73. Area of parallelogram',
    href: '/st-dimotikou/73-embadon-parallilogrammou' 
  },
  { 
    id: '74-embadon-trigonou', 
    section: 'sec5', 
    label: '▲ 74. Εμβαδόν Τριγώνου', 
    labelEn: '▲ 74. Area of triangle',
    href: '/st-dimotikou/74-embadon-trigonou' 
  },
  { 
    id: '75-embadon-trapeziou', 
    section: 'sec5', 
    label: '⏢ 75. Εμβαδόν Τραπεζίου', 
    labelEn: '⏢ 75. Area of trapezoid',
    href: '/st-dimotikou/75-embadon-trapeziou' 
  },
  { 
    id: '76-embadon-kiklou', 
    section: 'sec5', 
    label: '⚪ 76. Εμβαδόν Κύκλου', 
    labelEn: '⚪ 76. Area of circle',
    href: '/st-dimotikou/76-embadon-kiklou' 
  },
  { 
    id: '77-anaptigma', 
    section: 'sec5', 
    label: '📦 77. Ανάπτυγμα Κύβου & Παραλληλεπιπέδου', 
    labelEn: '📦 77. Nets of cubes & rectangular prisms',
    href: '/st-dimotikou/77-anaptigma' 
  },
  { 
    id: '78-akmes-korifes', 
    section: 'sec5', 
    label: '📍 78. Ακμές & Κορυφές Στερεών Σωμάτων', 
    labelEn: '📍 78. Edges & vertices of geometric solids',
    href: '/st-dimotikou/78-akmes-korifes' 
  },
  { 
    id: '79-kilindros', 
    section: 'sec5', 
    label: '🥫 79. Κύλινδρος (Ιδιότητες & Ανάπτυγμα)', 
    labelEn: '🥫 79. Cylinder (Properties & Net)',
    href: '/st-dimotikou/79-kilindros' 
  },
  { 
    id: '80-ogkos', 
    section: 'sec5', 
    label: '🧊 80. Η έννοια του Όγκου & Μονάδες Μέτρησης', 
    labelEn: '🧊 80. Concept of volume & cubic units',
    href: '/st-dimotikou/80-ogkos' 
  },
  { 
    id: '81-ogkos-cube', 
    section: 'sec5', 
    label: '🎲 81. Όγκος κύβου & παραλληλεπιπέδου', 
    labelEn: '🎲 81. Volume of cube & rectangular prism',
    href: '/st-dimotikou/81-ogkos-cube' 
  },
  { 
    id: '82-ogkos-kilindrou', 
    section: 'sec5', 
    label: '🛢️ 82. Όγκος κυλίνδρου', 
    labelEn: '🛢️ 82. Volume of cylinder',
    href: '/st-dimotikou/82-ogkos-kilindrou' 
  },
  { 
    id: '83-epanalipsi-5', 
    section: 'sec5', 
    label: '🏆 83. Επανάληψη: Κεφάλαια 67 – 82', 
    labelEn: '🏆 83. Review: Chapters 67 – 82',
    href: '/st-dimotikou/83-epanalipsi-5', 
    isReview: true 
  },
];