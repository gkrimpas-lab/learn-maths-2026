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
  {
    id: '06-pragmatikoi',
    section: 'algebra',
    slug: '06-pragmatikoi',
    icon: '√',
    title: 'Πραγματικοί Αριθμοί, Τετράγωνοι Αριθμοί & Δυνάμεις',
    titleEn: 'Real Numbers, Square Numbers & Integer Powers',
    desc: 'Πραγματικοί και άρρητοι αριθμοί, γεωμετρική τοποθέτηση άρρητων στην ευθεία ℝ, τετράγωνοι αριθμοί, δυνάμεις με βάση πραγματικό και εκθέτη ακέραιο και ιδιότητες δυνάμεων.',
    descEn: 'Real and irrational numbers, locating irrationals on the real number line ℝ, square numbers, powers with real bases and integer exponents, and exponent properties.',
    badge: 'ΚΕΦΑΛΑΙΟ 6',
    badgeEn: 'CHAPTER 6',
    active: true,
    keywords: [
      'ασκήσεις άλγεβρα',
      'πραγματικοί αριθμοί',
      'άρρητοι αριθμοί',
      'τετράγωνοι αριθμοί',
      'τοποθέτηση άρρητων στην ευθεία',
      'τετραγωνική ρίζα',
      'δυνάμεις με ακέραιο εκθέτη',
      'αρνητικός εκθέτης',
      'ιδιότητες δυνάμεων',
      'algebra exercises',
      'real numbers',
      'irrational numbers',
      'square numbers',
      'real number line',
      'square root',
      'integer exponents',
      'negative exponent',
      'exponent properties'
    ]
  },
  {
    id: '07-epanalipsi-1',
    section: 'algebra',
    slug: '07-epanalipsi-1',
    icon: '🏆',
    title: 'Επαναληπτικές Ασκήσεις Άλγεβρας: Ενότητες 1 έως 6',
    titleEn: 'Review Exercises in Algebra: Units 1 to 6',
    desc: 'Επαναληπτικό διαγώνισμα στα Κεφάλαια 1 έως 6 με 2 ασκήσεις ανά κεφάλαιο και 6 δύσκολα συνδυαστικά προβλήματα σε δυνάμεις ρητών με ακέραιο εκθέτη, τυποποιημένη μορφή, αριθμητικές παραστάσεις, τετραγωνικές ρίζες και πραγματικούς αριθμούς.',
    descEn: 'Review test covering Chapters 1 to 6 with 2 exercises per chapter and 6 challenging multi-step problems on integer exponents, scientific notation, numerical expressions, square roots, and real numbers.',
    badge: 'ΕΠΑΝΑΛΗΨΗ 1',
    badgeEn: 'REVIEW 1',
    isReview: true,
    active: true,
    keywords: [
      'επανάληψη άλγεβρα β γυμνασίου',
      'επανάληψη κεφάλαια 1 έως 6',
      'δυνάμεις με ακέραιο εκθέτη επανάληψη',
      'τυποποιημένη μορφή επανάληψη',
      'τετραγωνική ρίζα επανάληψη',
      'πραγματικοί αριθμοί επανάληψη',
      'διαγώνισμα β γυμνασίου',
      'grade 8 algebra review',
      'powers scientific notation square roots review',
      'chapters 1 to 6 test'
    ]
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
