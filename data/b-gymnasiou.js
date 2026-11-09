// data/b-gymnasiou.js

export const B_GYMNASIOU_SECTIONS = [
  { 
    id: 'algebra', 
    title: 'Μέρος Α΄: Θεωρία Αριθμών & Άλγεβρα',
    titleEn: 'Part A: Number Theory & Algebra'
  },
  { 
    id: 'geometry', 
    title: 'Μέρος Β΄: Γεωμετρία & Τριγωνομετρία',
    titleEn: 'Part B: Geometry & Trigonometry'
  },
];

export const B_GYMNASIOU_CHAPTERS = [
  // --- ΜΕΡΟΣ Α: ΑΡΙΘΜΟΙ & ΑΛΓΕΒΡΑ ---
  {
    id: '01',
    section: 'algebra',
    slug: '01-dinami-riton-ekth-akeraio',
    icon: '⚡',
    title: 'Δυνάμεις ρητών με εκθέτη ακέραιο',
    titleEn: 'Powers of rationals with integer exponents',
    desc: 'Δυνάμεις ρητών με εκθέτη ακέραιο, ιδιότητες δυνάμεων, πράξεις και εφαρμογές.',
    descEn: 'Powers of rational numbers with integer exponents, exponent rules, and algebraic operations.',
    badge: 'ΚΕΦΑΛΑΙΟ 1',
    badgeEn: 'CHAPTER 1',
    active: true,
    keywords: ['ασκήσεις άλγεβρα', 'δυνάμεις με ακέραιο εκθέτη', 'ιδιότητες δυνάμεων']
  },
  {
    id: '02',
    section: 'algebra',
    slug: '02-tipopoiimeni-morfi',
    icon: '🔬',
    title: 'Τυποποιημένη μορφή ρητών αριθμών',
    titleEn: 'Scientific notation of rational numbers',
    desc: 'Τυποποιημένη μορφή (επιστημονική σημειογραφία), πολύ μικροί και πολύ μεγάλοι αριθμοί.',
    descEn: 'Scientific notation, representation and operations with very large and very small numbers.',
    badge: 'ΚΕΦΑΛΑΙΟ 2',
    badgeEn: 'CHAPTER 2',
    active: true,
    keywords: ['τυποποιημένη μορφή', 'επιστημονική σημειογραφία', 'ασκήσεις μαθηματικών']
  },
  {
    id: '03',
    section: 'algebra',
    slug: '03-arithmitiki-parastasi',
    icon: '🧮',
    title: 'Υπολογισμός αριθμητικών παραστάσεων',
    titleEn: 'Evaluating numerical expressions',
    desc: 'Υπολογισμός παραστάσεων, προτεραιότητα πράξεων, εκθέτες θετικοί και αρνητικοί αριθμοί.',
    descEn: 'Evaluating expressions, order of operations, positive and negative exponents.',
    badge: 'ΚΕΦΑΛΑΙΟ 3',
    badgeEn: 'CHAPTER 3',
    active: true,
    keywords: ['αριθμητικές παραστάσεις', 'προτεραιότητα πράξεων', 'ασκήσεις άλγεβρα']
  },
  {
    id: '04',
    section: 'algebra',
    slug: '04-riza',
    icon: '√',
    title: 'Τετραγωνική ρίζα θετικού αριθμού',
    titleEn: 'Square root of a positive number',
    desc: 'Έννοια τετραγωνικής ρίζας, τέλεια τετράγωνα, υπολογισμός και ιδιότητες ριζών.',
    descEn: 'Concept of square roots, perfect squares, properties, and computation.',
    badge: 'ΚΕΦΑΛΑΙΟ 4',
    badgeEn: 'CHAPTER 4',
    active: true,
    keywords: ['τετραγωνική ρίζα', 'τέλεια τετράγωνα', 'ασκήσεις άλγεβρα']
  },
  {
    id: '05',
    section: 'algebra',
    slug: '05-ritoi-arritoi',
    icon: '♾️',
    title: 'Ρητοί και άρρητοι αριθμοί - Πραγματικοί αριθμοί',
    titleEn: 'Rational and irrational numbers - Real numbers',
    desc: 'Ρητοί και άρρητοι αριθμοί, δεκαδικές αναπαραστάσεις, έννοια πραγματικών αριθμών.',
    descEn: 'Rational and irrational numbers, non-terminating decimals, and the real number set.',
    badge: 'ΚΕΦΑΛΑΙΟ 5',
    badgeEn: 'CHAPTER 5',
    active: true,
    keywords: ['πραγματικοί αριθμοί', 'άρρητοι αριθμοί', 'ασκήσεις μαθηματικά']
  },

  // --- ΜΕΡΟΣ Β: ΓΕΩΜΕΤΡΙΑ & ΤΡΙΓΩΝΟΜΕΤΡΙΑ ---
  {
    id: 'g01',
    section: 'geometry',
    slug: 'g01-pythagoreio',
    icon: '📐',
    title: 'Πυθαγόρειο Θεώρημα: Θεωρία & Ασκήσεις',
    titleEn: 'Pythagorean Theorem: Theory & Exercises',
    desc: 'Ορθογώνια τρίγωνα, υπολογισμός υποτείνουσας και κάθετων πλευρών, αντίστροφο Πυθαγορείου και διαδραστικές ασκήσεις γεωμετρίας.',
    descEn: 'Right triangles, hypotenuse calculations, converse of Pythagorean theorem, and geometry practice problems.',
    badge: 'ΓΕΩΜΕΤΡΙΑ 1',
    badgeEn: 'GEOMETRY 1',
    active: false,
    keywords: [
      'πυθαγόρειο θεώρημα',
      'ασκήσεις γεωμετρία',
      'ορθογώνιο τρίγωνο',
      'υπολογισμός υποτείνουσας',
      'ασκήσεις μαθηματικών'
    ]
  },
  {
    id: 'g02',
    section: 'geometry',
    slug: 'g02-trigonometria',
    icon: '📏',
    title: 'Τριγωνομετρικοί Αριθμοί Οξείας Γωνίας',
    titleEn: 'Trigonometric Ratios of an Acute Angle',
    desc: 'Ημίτονο, συνημίτονο και εφαπτομένη οξείας γωνίας ορθογωνίου τριγώνου, βασικοί τριγωνομετρικοί τύποι και εφαρμογές.',
    descEn: 'Sine, cosine, and tangent in right-angled triangles, trigonometric identities, and applied problems.',
    badge: 'ΓΕΩΜΕΤΡΙΑ 2',
    badgeEn: 'GEOMETRY 2',
    active: false,
    keywords: [
      'τριγωνομετρία',
      'ημίτονο',
      'συνημίτονο',
      'εφαπτομένη',
      'ασκήσεις γεωμετρία'
    ]
  },
];