import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Δ')/g);
  return parts
    .map((part) => {
      if (part === "Δ'") return "Δ'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

const TRANSLATIONS = {
  el: {
    pageTitle: "Τα Γεωμετρικά Στερεά Σώματα - Θεωρία | LearnMaths.gr",
    pageDesc: "Μαθαίνουμε τα γεωμετρικά στερεά: κύβος, παραλληλεπίπεδο, πυραμίδες, κύλινδρος, κώνος και σφαίρα. Υπολογισμός εδρών, ακμών και κορυφών με διαδραστικό εργαστήριο.",
    backText: "Δ' Δημοτικού",
    badgeGrade: "Δ' ΔΗΜΟΤΙΚΟΥ",
    exercisesBtn: "Ασκήσεις",
    heroTitle: "Τα Γεωμετρικά Στερεά Σώματα",
    heroDesc: "Εξερευνούμε τα τρισδιάστατα γεωμετρικά σχήματα: κύβος, παραλληλεπίπεδο, πυραμίδες, κύλινδρος, κώνος και σφαίρα! Μαθαίνουμε να μετράμε τις έδρες, τις ακμές και τις κορυφές τους.",
    heroCardTitle: "Έτοιμος για εξάσκηση;",
    heroCardDesc: "Δοκίμασε τις διαδραστικές ασκήσεις στα γεωμετρικά στερεά για να εμπεδώσεις τα χαρακτηριστικά τους!",
    heroCardBtn: "Μετάβαση στις Ασκήσεις",
    coreConceptsTitle: "Τα 3 Βασικά Στοιχεία των Πολυέδρων",
    facesBadge: "1. ΕΔΡΕΣ (Ε)",
    facesTitle: "Οι Επίπεδες Επιφάνειες",
    facesText: "Είναι τα επίπεδα γεωμετρικά σχήματα (τετράγωνα, ορθογώνια, τρίγωνα ή κύκλοι) που περικλείουν και σχηματίζουν το στερεό σώμα.",
    edgesBadge: "2. ΑΚΜΕΣ (Α)",
    edgesTitle: "Οι Γραμμές Τομής",
    edgesText: "Είναι τα ευθύγραμμα τμήματα όπου συναντώνται δύο γειτονικές έδρες του στερεού.",
    verticesBadge: "3. ΚΟΡΥΦΕΣ (Κ)",
    verticesTitle: "Τα Σημεία Ένωσης",
    verticesText: "Είναι τα σημεία όπου ενώνονται τρεις ή περισσότερες ακμές (οι «γωνίες» του στερεού).",
    labTitle: "Διαδραστικό Εργαστήριο Γεωμετρικών Στερεών",
    labSubtitle: "Επίλεξε οποιοδήποτε στερεό σώμα για να παρατηρήσεις τη μορφή του, τις έδρες, τις ακμές και τις κορυφές του!",
    prevSolid: "Προηγούμενο",
    nextSolid: "Επόμενο",
    identityTitle: "Ταυτότητα Στερεού",
    statFaces: "Εδρες",
    statEdges: "Ακμες",
    statVertices: "Κορυφες",
    surfaceTypeTitle: "Είδος Επιφανειών / Εδρών:",
    examplesTitle: "Αντικείμενα στην καθημερινότητα:",
    tableTitle: "Συγκεντρωτικός Πίνακας Στερεών Σωμάτων",
    thSolid: "Στερεο Σωμα",
    thCategory: "Κατηγορια",
    thFaces: "Εδρες",
    thEdges: "Ακμες",
    thVertices: "Κορυφες",
    thShapes: "Σχημα Εδρων / Βασεων",
    ctaTitle: "Ώρα για Εξάσκηση!",
    ctaDesc: "Έμαθες τις έδρες, τις ακμές και τις κορυφές των γεωμετρικών στερεών; Δοκίμασε τις διαδραστικές ασκήσεις!",
    ctaBtn: "Ξεκίνα τις Ασκήσεις",
    footerGrade: "Μαθηματικά Δ' Δημοτικού",
    footerChapter: "Κεφάλαιο 27: Γεωμετρικά Στερεά Σώματα",
    footerAction: "Μετάβαση στις Ασκήσεις",
    solids: {
      cube: {
        name: "Κύβος",
        category: "Πολύεδρο",
        facesDesc: "6 ίσα τετράγωνα",
        examples: "Ζάρι, κύβος του Ρούμπικ, κουτί δώρου"
      },
      cuboid: {
        name: "Ορθογώνιο Παραλληλεπίπεδο",
        category: "Πολύεδρο",
        facesDesc: "6 ορθογώνια (ανά 2 απέναντι ίσα)",
        examples: "Κουτί παπουτσιών, βιβλίο, τούβλο, ντουλάπα"
      },
      sqPyramid: {
        name: "Τετραγωνική Πυραμίδα",
        category: "Πολύεδρο (Πυραμίδα)",
        facesDesc: "1 τετράγωνη βάση ＋ 4 τριγωνικές έδρες",
        examples: "Πυραμίδες της Αιγύπτου, σκηνή κάμπινγκ"
      },
      triPyramid: {
        name: "Τριγωνική Πυραμίδα (Τετράεδρο)",
        category: "Πολύεδρο (Πυραμίδα)",
        facesDesc: "1 τριγωνική βάση ＋ 3 τριγωνικές έδρες (4 τρίγωνα)",
        examples: "Τριγωνικό πακέτο χυμού, πυραμίδα παιχνίδι"
      },
      cylinder: {
        name: "Κύλινδρος",
        category: "Σώμα εκ Περιστροφής",
        facesDesc: "2 ίσοι κυκλικοί δίσκοι (βάσεις) ＋ 1 καμπύλη επιφάνεια",
        examples: "Κουτάκι αναψυκτικού, κερί, κονσέρβα"
      },
      cone: {
        name: "Κώνος",
        category: "Σώμα εκ Περιστροφής",
        facesDesc: "1 κυκλική βάση ＋ 1 καμπύλη επιφάνεια",
        examples: "Χωνάκι παγωτού, κώνος τροχαίας, καπέλο πάρτι"
      },
      sphere: {
        name: "Σφαίρα",
        category: "Σώμα εκ Περιστροφής",
        facesDesc: "1 ενιαία καμπύλη επιφάνεια (καμία επίπεδη έδρα)",
        examples: "Μπάλα ποδοσφαίρου, υδρόγειος σφαίρα, πορτοκάλι"
      }
    }
  },
  en: {
    pageTitle: "3D Geometric Solids - Theory | LearnMaths.gr",
    pageDesc: "Learn 3D geometric solids: cube, rectangular prism, pyramids, cylinder, cone, and sphere. Counting faces, edges, and vertices with an interactive lab.",
    backText: "4th Grade",
    badgeGrade: "GRADE 4",
    exercisesBtn: "Exercises",
    heroTitle: "3D Geometric Solids",
    heroDesc: "Explore three-dimensional geometric shapes: cube, rectangular prism, pyramids, cylinder, cone, and sphere! Learn to count their faces, edges, and vertices.",
    heroCardTitle: "Ready to practice?",
    heroCardDesc: "Try the interactive exercises on 3D geometric solids to master their characteristics!",
    heroCardBtn: "Go to Exercises",
    coreConceptsTitle: "The 3 Core Elements of Polyhedra",
    facesBadge: "1. FACES (F)",
    facesTitle: "The Flat Surfaces",
    facesText: "These are the flat geometric shapes (squares, rectangles, triangles, or circles) that enclose and form the 3D solid.",
    edgesBadge: "2. EDGES (E)",
    edgesTitle: "The Line Segments",
    edgesText: "These are the straight line segments where two adjacent faces of the solid meet.",
    verticesBadge: "3. VERTICES (V)",
    verticesTitle: "The Corner Points",
    verticesText: "These are the points where three or more edges connect (the sharp corners of the solid).",
    labTitle: "Interactive 3D Solids Lab",
    labSubtitle: "Select any 3D solid to explore its geometry, faces, edges, and vertices!",
    prevSolid: "Previous",
    nextSolid: "Next",
    identityTitle: "Solid Identity",
    statFaces: "Faces",
    statEdges: "Edges",
    statVertices: "Vertices",
    surfaceTypeTitle: "Type of Surfaces / Faces:",
    examplesTitle: "Real-world objects:",
    tableTitle: "Summary Table of 3D Solids",
    thSolid: "Solid Shape",
    thCategory: "Category",
    thFaces: "Faces",
    thEdges: "Edges",
    thVertices: "Vertices",
    thShapes: "Shape of Faces / Bases",
    ctaTitle: "Time for Practice!",
    ctaDesc: "Mastered the faces, edges, and vertices of geometric solids? Test your skills with interactive exercises!",
    ctaBtn: "Start Exercises",
    footerGrade: "Grade 4 Mathematics",
    footerChapter: "Chapter 27: 3D Geometric Solids",
    footerAction: "Go to Exercises",
    solids: {
      cube: {
        name: "Cube",
        category: "Polyhedron",
        facesDesc: "6 equal squares",
        examples: "Dice, Rubik's cube, gift box"
      },
      cuboid: {
        name: "Rectangular Prism (Cuboid)",
        category: "Polyhedron",
        facesDesc: "6 rectangles (opposite pairs equal)",
        examples: "Shoe box, book, brick, wardrobe"
      },
      sqPyramid: {
        name: "Square Pyramid",
        category: "Polyhedron (Pyramid)",
        facesDesc: "1 square base ＋ 4 triangular faces",
        examples: "Pyramids of Giza, camping tent"
      },
      triPyramid: {
        name: "Triangular Pyramid (Tetrahedron)",
        category: "Polyhedron (Pyramid)",
        facesDesc: "1 triangular base ＋ 3 triangular faces (4 triangles)",
        examples: "Tetrahedral juice pack, pyramid toy"
      },
      cylinder: {
        name: "Cylinder",
        category: "Solid of Revolution",
        facesDesc: "2 equal circular disks (bases) ＋ 1 curved surface",
        examples: "Soda can, candle, tin can"
      },
      cone: {
        name: "Cone",
        category: "Solid of Revolution",
        facesDesc: "1 circular base ＋ 1 curved surface",
        examples: "Ice cream cone, traffic cone, party hat"
      },
      sphere: {
        name: "Sphere",
        category: "Solid of Revolution",
        facesDesc: "1 continuous curved surface (no flat faces)",
        examples: "Soccer ball, globe, orange"
      }
    }
  }
};

const SOLIDS_BASE = [
  {
    id: 'cube',
    translationKey: 'cube',
    faces: 6,
    edges: 12,
    vertices: 8,
    tagBg: 'bg-blue-100 text-blue-900 border-blue-200',
    svg: (
      <svg className="w-48 h-48 mx-auto block select-none" viewBox="0 0 200 200">
        <line x1="50" y1="130" x2="50" y2="70" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="50" y1="130" x2="110" y2="130" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="50" y1="130" x2="90" y2="160" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <polygon points="90,100 150,100 150,160 90,160" fill="#3b82f6" fillOpacity="0.35" stroke="#1d4ed8" strokeWidth="3" />
        <polygon points="90,100 150,100 110,70 50,70" fill="#60a5fa" fillOpacity="0.45" stroke="#1d4ed8" strokeWidth="3" />
        <polygon points="150,100 150,160 110,130 110,70" fill="#2563eb" fillOpacity="0.55" stroke="#1d4ed8" strokeWidth="3" />
      </svg>
    )
  },
  {
    id: 'cuboid',
    translationKey: 'cuboid',
    faces: 6,
    edges: 12,
    vertices: 8,
    tagBg: 'bg-teal-100 text-teal-900 border-teal-200',
    svg: (
      <svg className="w-52 h-48 mx-auto block select-none" viewBox="0 0 220 200">
        <line x1="40" y1="130" x2="40" y2="70" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="40" y1="130" x2="130" y2="130" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="40" y1="130" x2="80" y2="160" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <polygon points="80,100 170,100 170,160 80,160" fill="#14b8a6" fillOpacity="0.35" stroke="#0f766e" strokeWidth="3" />
        <polygon points="80,100 170,100 130,70 40,70" fill="#2dd4bf" fillOpacity="0.45" stroke="#0f766e" strokeWidth="3" />
        <polygon points="170,100 170,160 130,130 130,70" fill="#0d9488" fillOpacity="0.55" stroke="#0f766e" strokeWidth="3" />
      </svg>
    )
  },
  {
    id: 'sq-pyramid',
    translationKey: 'sqPyramid',
    faces: 5,
    edges: 8,
    vertices: 5,
    tagBg: 'bg-amber-100 text-amber-950 border-amber-200',
    svg: (
      <svg className="w-48 h-48 mx-auto block select-none" viewBox="0 0 200 200">
        <line x1="40" y1="130" x2="130" y2="130" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="40" y1="130" x2="70" y2="160" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="40" y1="130" x2="100" y2="40" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <polygon points="70,160 160,160 100,40" fill="#f59e0b" fillOpacity="0.35" stroke="#b45309" strokeWidth="3" strokeLinejoin="round" />
        <polygon points="160,160 130,130 100,40" fill="#d97706" fillOpacity="0.55" stroke="#b45309" strokeWidth="3" strokeLinejoin="round" />
        <polygon points="70,160 100,40 40,130" fill="#fbbf24" fillOpacity="0.25" stroke="#b45309" strokeWidth="3" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    id: 'tri-pyramid',
    translationKey: 'triPyramid',
    faces: 4,
    edges: 6,
    vertices: 4,
    tagBg: 'bg-rose-100 text-rose-950 border-rose-200',
    svg: (
      <svg className="w-48 h-48 mx-auto block select-none" viewBox="0 0 200 200">
        <line x1="90" y1="120" x2="100" y2="40" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="40" y1="150" x2="90" y2="120" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="160" y1="150" x2="90" y2="120" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <polygon points="40,150 160,150 100,40" fill="#f43f5e" fillOpacity="0.4" stroke="#be123c" strokeWidth="3" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    id: 'cylinder',
    translationKey: 'cylinder',
    faces: 3,
    edges: 0,
    vertices: 0,
    tagBg: 'bg-purple-100 text-purple-950 border-purple-200',
    svg: (
      <svg className="w-48 h-48 mx-auto block select-none" viewBox="0 0 200 200">
        <path d="M 50,150 A 50,15 0 0,1 150,150" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <path d="M 50,60 L 50,150 A 50,15 0 0,0 150,150 L 150,60 Z" fill="#8b5cf6" fillOpacity="0.35" stroke="#6d28d9" strokeWidth="3" />
        <ellipse cx="100" cy="60" rx="50" ry="15" fill="#a78bfa" fillOpacity="0.65" stroke="#6d28d9" strokeWidth="3" />
      </svg>
    )
  },
  {
    id: 'cone',
    translationKey: 'cone',
    faces: 2,
    edges: 0,
    vertices: 1,
    tagBg: 'bg-cyan-100 text-cyan-950 border-cyan-200',
    svg: (
      <svg className="w-48 h-48 mx-auto block select-none" viewBox="0 0 200 200">
        <path d="M 50,150 A 50,15 0 0,1 150,150" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <path d="M 50,150 L 100,40 L 150,150 A 50,15 0 0,1 50,150 Z" fill="#06b6d4" fillOpacity="0.35" stroke="#0e7490" strokeWidth="3" />
        <circle cx="100" cy="40" r="4.5" fill="#fbbf24" />
      </svg>
    )
  },
  {
    id: 'sphere',
    translationKey: 'sphere',
    faces: 1,
    edges: 0,
    vertices: 0,
    tagBg: 'bg-emerald-100 text-emerald-950 border-emerald-200',
    svg: (
      <svg className="w-48 h-48 mx-auto block select-none" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="65" fill="#10b981" fillOpacity="0.35" stroke="#047857" strokeWidth="3" />
        <path d="M 35,100 A 65,20 0 0,1 165,100" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <path d="M 35,100 A 65,20 0 0,0 165,100" fill="none" stroke="#047857" strokeWidth="2.5" />
        <ellipse cx="80" cy="75" rx="15" ry="8" fill="#ffffff" fillOpacity="0.6" transform="rotate(-30, 80, 75)" />
      </svg>
    )
  }
];

export default function StereaTheoryPage() {
  const router = useRouter();
  const rawLocale = router?.locale || 'el';
  const locale = TRANSLATIONS[rawLocale] ? rawLocale : 'el';
  const t = TRANSLATIONS[locale];

  const formatNumber = (num) => {
    return num.toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
  };

  const solidsData = SOLIDS_BASE.map((item) => {
    const sTrans = t.solids[item.translationKey];
    return {
      ...item,
      name: sTrans.name,
      category: sTrans.category,
      facesDesc: sTrans.facesDesc,
      examples: sTrans.examples
    };
  });

  const [selectedSolidIndex, setSelectedSolidIndex] = useState(0);
  const currentSolid = solidsData[selectedSolidIndex];

  const handleSelectSolid = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSolidIndex(index);
  };

  const handleNextSolid = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSolidIndex((prev) => (prev + 1) % solidsData.length);
  };

  const handlePrevSolid = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSolidIndex((prev) => (prev - 1 + solidsData.length) % solidsData.length);
  };

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/d-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/d-dimotikou/27-sterea-ask"
          className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>🎯</span> {t.exercisesBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        {/* HEADER & EXERCISES PROMO CARD */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                {toCleanUppercase(t.badgeGrade)}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                🧊 {t.heroTitle}
              </h1>
              <p className="text-blue-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                {t.heroDesc}
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h2 className="font-extrabold text-white text-lg">{t.heroCardTitle}</h2>
              <p className="text-xs text-blue-100">
                {t.heroCardDesc}
              </p>
              <Link
                href="/d-dimotikou/27-sterea-ask"
                className="inline-block w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-3 px-4 rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-sm"
              >
                🎯 {t.heroCardBtn}
              </Link>
            </div>
          </div>
        </div>

        {/* ΘΕΩΡΙΑ - ΤΑ 3 ΒΑΣΙΚΑ ΣΤΟΙΧΕΙΑ ΤΩΝ ΣΤΕΡΕΩΝ */}
        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-8">
          <div className="border-b pb-4 border-slate-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>📖</span> {t.coreConceptsTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. ΕΔΡΕΣ */}
            <div className="bg-blue-50/70 p-5 sm:p-6 rounded-2xl border border-blue-100 space-y-3 shadow-sm">
              <div className="bg-blue-600 text-white font-black text-xs px-3 py-1 rounded-full w-fit">
                {toCleanUppercase(t.facesBadge)}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-blue-950">
                {t.facesTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.facesText}
              </p>
            </div>

            {/* 2. ΑΚΜΕΣ */}
            <div className="bg-purple-50/70 p-5 sm:p-6 rounded-2xl border border-purple-100 space-y-3 shadow-sm">
              <div className="bg-purple-600 text-white font-black text-xs px-3 py-1 rounded-full w-fit">
                {toCleanUppercase(t.edgesBadge)}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-purple-950">
                {t.edgesTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.edgesText}
              </p>
            </div>

            {/* 3. ΚΟΡΥΦΕΣ */}
            <div className="bg-emerald-50/70 p-5 sm:p-6 rounded-2xl border border-emerald-100 space-y-3 shadow-sm">
              <div className="bg-emerald-600 text-white font-black text-xs px-3 py-1 rounded-full w-fit">
                {toCleanUppercase(t.verticesBadge)}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-emerald-950">
                {t.verticesTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.verticesText}
              </p>
            </div>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΕΞΕΡΕΥΝΗΣΗΣ ΣΤΕΡΕΩΝ */}
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="border-b pb-4 border-slate-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>🧮</span> {t.labTitle}
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              {t.labSubtitle}
            </p>
          </div>

          {/* ΚΟΥΜΠΙΑ ΕΠΙΛΟΓΗΣ ΣΤΕΡΕΟΥ */}
          <div className="flex flex-wrap gap-1.5">
            {solidsData.map((s, idx) => (
              <button
                key={s.id}
                onClick={(e) => handleSelectSolid(e, idx)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95 touch-manipulation select-none ${
                  selectedSolidIndex === idx
                    ? 'bg-indigo-600 text-white font-black shadow-md shadow-indigo-200'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>

          {/* ΚΑΡΤΕΛΑ ΑΝΑΛΥΣΗΣ ΤΟΥ ΕΠΙΛΕΓΜΕΝΟΥ ΣΤΕΡΕΟΥ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start pt-2">
            {/* ΑΡΙΣΤΕΡΑ: 3D SVG ΑΠΕΙΚΟΝΙΣΗ */}
            <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col items-center justify-center space-y-3">
              <span className="text-[11px] font-black uppercase tracking-widest text-indigo-400">
                {toCleanUppercase(currentSolid.category)}
              </span>

              <div className="py-2 w-full max-w-[240px] aspect-square flex items-center justify-center">
                {currentSolid.svg}
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white font-mono text-center">
                {currentSolid.name}
              </h3>

              {/* Πλοήγηση Steppers */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handlePrevSolid}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 text-xs font-bold transition active:scale-95 touch-manipulation"
                  title={t.prevSolid}
                >
                  ◀ {t.prevSolid}
                </button>
                <span className="text-xs font-mono text-slate-400">
                  {formatNumber(selectedSolidIndex + 1)} / {formatNumber(solidsData.length)}
                </span>
                <button
                  onClick={handleNextSolid}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 text-xs font-bold transition active:scale-95 touch-manipulation"
                  title={t.nextSolid}
                >
                  {t.nextSolid} ▶
                </button>
              </div>
            </div>

            {/* ΔΕΞΙΑ: ΑΝΑΛΥΤΙΚΑ ΣΤΟΙΧΕΙΑ */}
            <div className="space-y-4 bg-slate-50 p-5 sm:p-7 rounded-3xl border border-slate-200">
              <div className="flex justify-between items-center border-b pb-3 border-slate-200">
                <h4 className="text-lg sm:text-xl font-black text-slate-900">
                  📋 {t.identityTitle}
                </h4>
                <span className={`text-xs font-black px-3 py-1 rounded-full border ${currentSolid.tagBg}`}>
                  {toCleanUppercase(currentSolid.category)}
                </span>
              </div>

              {/* ΜΕΤΡΗΤΕΣ: ΕΔΡΕΣ - ΑΚΜΕΣ - ΚΟΡΥΦΕΣ */}
              <div className="grid grid-cols-3 gap-2.5 text-center font-mono">
                <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-bold text-slate-500 block uppercase font-sans">
                    {toCleanUppercase(t.statFaces)}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-blue-600 min-w-[50px] inline-block">
                    {formatNumber(currentSolid.faces)}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-bold text-slate-500 block uppercase font-sans">
                    {toCleanUppercase(t.statEdges)}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-purple-600 min-w-[50px] inline-block">
                    {formatNumber(currentSolid.edges)}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-bold text-slate-500 block uppercase font-sans">
                    {toCleanUppercase(t.statVertices)}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-600 min-w-[50px] inline-block">
                    {formatNumber(currentSolid.vertices)}
                  </span>
                </div>
              </div>

              {/* ΠΕΡΙΓΡΑΦΗ ΕΔΡΩΝ & ΠΑΡΑΔΕΙΓΜΑΤΑ */}
              <div className="space-y-2.5 pt-1 text-xs sm:text-sm text-slate-700">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-1 shadow-sm">
                  <p className="font-bold text-slate-900">📐 {t.surfaceTypeTitle}</p>
                  <p className="text-slate-600 leading-relaxed">{currentSolid.facesDesc}</p>
                </div>

                <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/80 space-y-1 shadow-sm">
                  <p className="font-bold text-amber-950">🌍 {t.examplesTitle}</p>
                  <p className="text-amber-900 leading-relaxed">{currentSolid.examples}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ΣΥΝΟΠΤΙΚΟΣ ΠΙΝΑΚΑΣ ΟΛΩΝ ΤΩΝ ΣΤΕΡΕΩΝ */}
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="border-b pb-4 border-slate-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>📊</span> {t.tableTitle}
            </h2>
          </div>

          {/* MOBILE VIEW: Stacked Cards (Χωρίς οριζόντιο scroll)[cite: 2] */}
          <div className="block sm:hidden space-y-3">
            {solidsData.map((s) => (
              <div
                key={`card-${s.id}`}
                className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 shadow-xs"
              >
                <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <h3 className="font-black text-slate-900 text-sm">
                    {s.name}
                  </h3>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${s.tagBg}`}>
                    {toCleanUppercase(s.category)}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center font-mono">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 block font-sans uppercase">
                      {toCleanUppercase(t.thFaces)}
                    </span>
                    <span className="text-base font-black text-blue-600">
                      {formatNumber(s.faces)}
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 block font-sans uppercase">
                      {toCleanUppercase(t.thEdges)}
                    </span>
                    <span className="text-base font-black text-purple-600">
                      {formatNumber(s.edges)}
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 block font-sans uppercase">
                      {toCleanUppercase(t.thVertices)}
                    </span>
                    <span className="text-base font-black text-emerald-600">
                      {formatNumber(s.vertices)}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 leading-relaxed">
                  <span className="font-bold text-slate-900 block mb-0.5">
                    {t.thShapes}:
                  </span>
                  {s.facesDesc}
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP VIEW: Κλασικός Πίνακας (μόνο για sm: και πάνω)[cite: 2] */}
          <div className="hidden sm:block overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 uppercase font-black text-[11px] tracking-wider border-b border-slate-200">
                  <th className="p-3">{toCleanUppercase(t.thSolid)}</th>
                  <th className="p-3">{toCleanUppercase(t.thCategory)}</th>
                  <th className="p-3 text-center">{toCleanUppercase(t.thFaces)}</th>
                  <th className="p-3 text-center">{toCleanUppercase(t.thEdges)}</th>
                  <th className="p-3 text-center">{toCleanUppercase(t.thVertices)}</th>
                  <th className="p-3">{toCleanUppercase(t.thShapes)}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {solidsData.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-black text-slate-900">{s.name}</td>
                    <td className="p-3 text-slate-600">{s.category}</td>
                    <td className="p-3 text-center font-bold font-mono text-blue-600">{formatNumber(s.faces)}</td>
                    <td className="p-3 text-center font-bold font-mono text-purple-600">{formatNumber(s.edges)}</td>
                    <td className="p-3 text-center font-bold font-mono text-emerald-600">{formatNumber(s.vertices)}</td>
                    <td className="p-3 text-slate-600">{s.facesDesc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BOTTOM EXERCISES CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">📝 {t.ctaTitle}</h3>
            <p className="text-slate-800 text-sm md:text-base">
              {t.ctaDesc}
            </p>
          </div>
          <Link
            href="/d-dimotikou/27-sterea-ask"
            className="bg-slate-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            {t.ctaBtn} ➔
          </Link>
        </div>
      </div>

      {/* ΣΤΑΘΕΡΟ BOTTOM FOOTER */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3 px-4 sm:px-6 shadow-2xl">
        <div className="max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xl hidden sm:inline select-none">🧊</span>
            <div className="min-w-0">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider truncate">
                {toCleanUppercase(t.footerGrade)}
              </p>
              <p className="text-sm font-black text-white truncate">
                {t.footerChapter}
              </p>
            </div>
          </div>
          <Link
            href="/d-dimotikou/27-sterea-ask"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs sm:text-sm transition transform active:scale-95 shadow-md flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <span>🎯</span>
            <span>{t.footerAction}</span>
          </Link>
        </div>
      </footer>
    </Layout>
  );
}