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
  {
    id: '08-kanonikotites',
    section: 'algebra',
    slug: '08-kanonikotites',
    icon: '📈',
    title: 'Γραμμικές Αριθμητικές Κανονικότητες & Τετράγωνοι Αριθμοί',
    titleEn: 'Linear Number Patterns & Square Numbers',
    desc: 'Γραμμικές αριθμητικές κανονικότητες ρητών αριθμών (y = α · ν + β), όρος κανονικότητας, θέση του όρου, σταθερή διαφορά και τετράγωνοι αριθμοί (y = ν²) με 12 διαδραστικές ασκήσεις.',
    descEn: 'Linear number patterns of rational numbers (y = a · n + b), term value, term position, constant difference, and square numbers (y = n²) with 12 interactive exercises.',
    badge: 'ΚΕΦΑΛΑΙΟ 7',
    badgeEn: 'CHAPTER 7',
    active: true,
    keywords: [
      'γραμμικές αριθμητικές κανονικότητες',
      'κανονικότητες β γυμνασίου',
      'όρος κανονικότητας',
      'θέση του όρου',
      'τετράγωνοι αριθμοί',
      'άλγεβρα β γυμνασίου κεφάλαιο 7',
      'linear number patterns grade 8',
      'square numbers pattern',
      'grade 8 algebra chapter 7'
    ]
  },
  {
    id: '09-algebriki-parastasi',
    section: 'algebra',
    slug: '09-algebriki-parastasi',
    icon: '🔤',
    title: 'Αλγεβρικές Παραστάσεις, Όμοιοι Όροι & Ισοδύναμες Παραστάσεις',
    titleEn: 'Algebraic Expressions, Like Terms & Equivalent Expressions',
    desc: 'Έννοια αλγεβρικής παράστασης (ως γινόμενο ή άθροισμα), μεταβλητή, συντελεστής, σταθερός όρος, όμοιοι όροι, αναγωγή, αριθμητική τιμή και ισοδύναμες παραστάσεις με 12 διαδραστικές ασκήσεις.',
    descEn: 'Algebraic expressions as products or sums, variables, coefficients, constant terms, combining like terms, numerical value, and equivalent expressions with 12 interactive exercises.',
    badge: 'ΚΕΦΑΛΑΙΟ 8',
    badgeEn: 'CHAPTER 8',
    active: true,
    keywords: [
      'αλγεβρικές παραστάσεις β γυμνασίου',
      'όμοιοι όροι αναγωγή',
      'συντελεστής μεταβλητή σταθερός όρος',
      'αριθμητική τιμή αλγεβρικής παράστασης',
      'ισοδύναμες αλγεβρικές παραστάσεις',
      'άλγεβρα β γυμνασίου κεφάλαιο 8',
      'algebraic expressions grade 8',
      'combining like terms equivalent expressions'
    ]
  },
  {
    id: '10-epimeristiki-idiotita',
    section: 'algebra',
    slug: '10-epimeristiki-idiotita',
    icon: '✖️',
    title: 'Ιδιότητες Πράξεων, Επιμεριστική & Διπλή Επιμεριστική Ιδιότητα',
    titleEn: 'Properties of Operations, Distributive & Double Distributive Property',
    desc: 'Ιδιότητες πράξεων στις αλγεβρικές παραστάσεις, απαλοιφή παρενθέσεων, επιμεριστική ιδιότητα α(β + γ) και διπλή επιμεριστική ιδιότητα (α + β)(γ + δ) με 12 διαδραστικές ασκήσεις.',
    descEn: 'Properties of algebraic operations, removing parentheses, distributive property a(b + c), and double distributive property (a + b)(c + d) with 12 interactive exercises.',
    badge: 'ΚΕΦΑΛΑΙΟ 9',
    badgeEn: 'CHAPTER 9',
    active: true,
    keywords: [
      'επιμεριστική ιδιότητα β γυμνασίου',
      'διπλή επιμεριστική ιδιότητα',
      'απαλοιφή παρενθέσεων',
      'ιδιότητες πράξεων αλγεβρικές παραστάσεις',
      'άλγεβρα β γυμνασίου κεφάλαιο 9',
      'distributive property grade 8',
      'double distributive property foil'
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
