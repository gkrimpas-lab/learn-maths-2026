// pages/e-dimotikou/29-ogkoi-sximaton.js
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Ε')/g);
  return parts
    .map((part) => {
      if (part === "Ε'") return "Ε'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

function Fraction({ numerator, denominator, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 text-center font-mono leading-none ${className}`}>
      <span className="px-1 text-[0.9em] border-b-2 border-current pb-0.5 w-full block">
        {numerator}
      </span>
      <span className="px-1 text-[0.9em] pt-0.5 w-full block">
        {denominator}
      </span>
    </span>
  );
}

const translations = {
  el: {
    pageTitle: "Τα Γεωμετρικά Στερεά & Όγκοι - Ε' Δημοτικού | LearnMaths.gr",
    pageDescription: "Μάθετε για τα γεωμετρικά στερεά (κύβος, ορθογώνιο παραλληλεπίπεδο, κύλινδρος, κώνος, πυραμίδα, σφαίρα), τους τύπους όγκου τους και εξερευνήστε τον τρισδιάστατο καμβά.",
    backText: "Ε' Δημοτικού",
    exercisesBtn: "Ασκήσεις",
    chapterBadge: "ΚΕΦΑΛΑΙΟ 29 • Ε' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Τα Γεωμετρικά Στερεά & οι Όγκοι τους",
    heroSubtitle: "Εξερευνούμε τα τρισδιάστατα σώματα του χώρου: τα πολύεδρα (κύβος, παραλληλεπίπεδο, πυραμίδα) και τα στερεά εκ περιστροφής (κύλινδρος, κώνος, σφαίρα). Μαθαίνουμε τα χαρακτηριστικά τους και πώς υπολογίζεται ο όγκος τους.",
    theoryLiveStatus: "Θεωρία & Τρισδιάστατος Διαδραστικός Καμβάς Στερεών",
    tryExercises: "Δοκίμασε τις Ασκήσεις",
    keyConceptsTitle: "Βασικές Έννοιες σε 4 Βήματα",
    keyConceptsSubtitle: "Η ταξινόμηση των γεωμετρικών στερεών και οι σχέσεις μεταξύ των όγκων τους.",
    step1Badge: "ΒΗΜΑ 1",
    step1Category: "Ορισμός",
    step1Title: "Τι είναι τα Γεωμετρικά Στερεά;",
    step1Desc: "Σε αντίθεση με τα επίπεδα σχήματα που έχουν μόνο 2 διαστάσεις στο χαρτί, τα γεωμετρικά στερεά έχουν 3 διαστάσεις:",
    step1DimX: "Μήκος (διάσταση x)",
    step1DimY: "Πλάτος (διάσταση y)",
    step1DimZ: "Ύψος (διάσταση z)",
    step1Tip: "💡 Κάθε στερεό καταλαμβάνει χώρο, δηλαδή έχει όγκο και περικλείεται από επιφάνειες (έδρες).",
    step2Badge: "ΒΗΜΑ 2",
    step2Category: "Ταξινόμηση",
    step2Title: "Πολύεδρα & Σώματα Περιστροφής",
    step2Desc: "Τα στερεά χωρίζονται σε δύο μεγάλες ομάδες:",
    step2PolyhedraLabel: "Πολύεδρα:",
    step2PolyhedraDesc: "Περικλείονται αποκλειστικά από επίπεδα πολύγωνα (κύβος, ορθογώνιο παραλληλεπίπεδο, πυραμίδα).",
    step2RevolutionLabel: "Στερεά εκ περιστροφής:",
    step2RevolutionDesc: "Έχουν καμπύλες επιφάνειες και μπορούν να κυλήσουν (κύλινδρος, κώνος, σφαίρα).",
    step2Tip: "⚡ Τα πολύεδρα έχουν επίπεδες έδρες, ευθύγραμμες ακμές και γωνίες (κορυφές).",
    step3Badge: "ΒΗΜΑ 3",
    step3Category: "Συσχέτιση",
    step3Title: "Πρίσματα vs Πυραμίδες",
    step3Desc: "Μια συναρπαστική γεωμετρική σχέση στον όγκο:",
    step3FormulaPrefix: "Όγκος Πυραμίδας ＝",
    step3FormulaNum: "Όγκος Πρίσματος",
    step3FormulaDen: "3",
    step3Explanation: "Αν μια πυραμίδα και ένα πρίσμα (ή ένας κώνος και ένας κύλινδρος) έχουν την ίδια βάση και το ίδιο ύψος, η πυραμίδα χωράει ακριβώς το ένα τρίτο του όγκου του πρίσματος!",
    step3Tip: "🎯 Χρειάζονται ακριβώς 3 γεμάτοι κώνοι νερό για να γεμίσει ένας κύλινδρος με την ίδια βάση και ύψος!",
    step4Badge: "ΒΗΜΑ 4",
    step4Category: "Πραγματική Ζωή",
    step4Title: "Στερεά στην Καθημερινότητα",
    step4Desc: "Όλα τα αντικείμενα γύρω μας είναι γεωμετρικά στερεά:",
    step4ItemBox: "Κουτί παπουτσιών: Ορθογώνιο παραλληλεπίπεδο",
    step4ItemCan: "Κουτάκι αναψυκτικού: Κύλινδρος",
    step4ItemBall: "Μπάλα ποδοσφαίρου: Σφαίρα",
    step4ItemCone: "Χωνάκι παγωτού: Κώνος",
    step4Tip: "🔍 Ο υπολογισμός του όγκου τους μάς επιτρέπει να γνωρίζουμε πόσο υγρό, βάρος ή χώρο μπορούν να αποθηκεύσουν.",
    labBadge: "ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Τρισδιάστατος Εξερευνητής Στερεών Σωμάτων",
    labDesc: "Επίλεξε οποιοδήποτε από τα 6 στερεά για να δεις την τρισδιάστατη γεωμετρική προβολή του, την αναλυτική περιγραφή, τον τύπο όγκου και πραγματικά παραδείγματα.",
    selectSolidTitle: "1. ΕΠΙΛΟΓΗ ΓΕΩΜΕΤΡΙΚΟΥ ΣΤΕΡΕΟΥ",
    solidTypeBadge: "3D ΣΤΕΡΕΟ",
    formulaTitle: "ΜΑΘΗΜΑΤΙΚΟΣ ΤΥΠΟΣ ΟΓΚΟΥ",
    visualTitle: "ΤΡΙΣΔΙΑΣΤΑΤΗ ΓΕΩΜΕΤΡΙΚΗ ΠΡΟΒΟΛΗ",
    summaryCallout: "📦 Όλα τα στερεά σώματα καταλαμβάνουν χώρο σε 3 διαστάσεις και έχουν μετρήσιμο όγκο!",
    ctaTitle: "Ώρα για Εξάσκηση στα Γεωμετρικά Στερεά!",
    ctaSubtitle: "Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις αναγνώρισης στερεών, υπολογισμού όγκου κύβου, παραλληλεπιπέδου, κυλίνδρου και συσχέτισης πρίσματος με πυραμίδα.",
    ctaButton: "Έναρξη Ασκήσεων",
    solids: {
      cube: {
        btnLabel: "🟩 Κύβος",
        title: "🟩 Κύβος",
        category: "Κανονικό Πολύεδρο",
        desc: "Ο κύβος είναι το πιο συμμετρικό στερεό! Έχει 6 τετράγωνες έδρες, 8 κορυφές και 12 ίσες ακμές (μήκος, πλάτος και ύψος είναι ακριβώς ίσα).",
        formula: (
          <span>
            Όγκος ＝ Ακμή · Ακμή · Ακμή &nbsp; ( V ＝ α · α · α )
          </span>
        ),
        example: "Παράδειγμα: Ένα ζάρι επιτραπέζιου ή ο κύβος του Ρούμπικ."
      },
      box: {
        btnLabel: "🟧 Παραλληλεπ.",
        title: "🟧 Ορθογώνιο Παραλληλεπίπεδο",
        category: "Πολύεδρο (Πρίσμα)",
        desc: "Έχει 6 έδρες που είναι ορθογώνια παραλληλόγραμμα. Χαρακτηρίζεται από 3 διαστάσεις: Μήκος (α), Πλάτος (β) και Ύψος (γ).",
        formula: (
          <span>
            Όγκος ＝ Μήκος · Πλάτος · Ύψος &nbsp; ( V ＝ α · β · γ )
          </span>
        ),
        example: "Παράδειγμα: Ένα κουτί παπουτσιών, ένα σπιρτόκουτο ή ένα τούβλο."
      },
      cylinder: {
        btnLabel: "🥤 Κύλινδρος",
        title: "🥤 Κύλινδρος",
        category: "Στερεό εκ Περιστροφής",
        desc: "Αποτελείται από δύο παράλληλες κυκλικές βάσεις (πάνω και κάτω) και μια καμπύλη πλευρική επιφάνεια που του επιτρέπει να κυλάει.",
        formula: (
          <span>
            Όγκος ＝ Εμβαδόν Κυκλικής Βάσης · Ύψος &nbsp; ( V ＝ Εβ · υ )
          </span>
        ),
        example: "Παράδειγμα: Ένα μεταλλικό κουτάκι αναψυκτικού ή ένα κυλινδρικό κερί."
      },
      cone: {
        btnLabel: "🍦 Κώνος",
        title: "🍦 Κώνος",
        category: "Στερεό εκ Περιστροφής",
        desc: "Έχει μία κυκλική βάση στο κάτω μέρος και στενεύει ομοιόμορφα προς τα πάνω καταλήγοντας σε μία μυτερή κορυφή.",
        formula: (
          <span className="inline-flex items-center justify-center flex-wrap gap-1">
            <span>Όγκος ＝</span>
            <Fraction numerator="Εμβαδόν Βάσης · Ύψος" denominator="3" />
            <span className="ml-1">( V ＝</span>
            <Fraction numerator="Εβ · υ" denominator="3" />
            <span>)</span>
          </span>
        ),
        example: "Παράδειγμα: Το χωνάκι του παγωτού ή οι πορτοκαλί κώνοι της τροχαίας."
      },
      pyramid: {
        btnLabel: "📐 Πυραμίδα",
        title: "📐 Πυραμίδα",
        category: "Πολύεδρο",
        desc: "Έχει για βάση ένα πολύγωνο (συχνά τετράγωνο) και τριγωνικές παράπλευρες έδρες που ενώνονται όλες μαζί σε μία κοινή κορυφή.",
        formula: (
          <span className="inline-flex items-center justify-center flex-wrap gap-1">
            <span>Όγκος ＝</span>
            <Fraction numerator="Εμβαδόν Βάσης · Ύψος" denominator="3" />
            <span className="ml-1">( V ＝</span>
            <Fraction numerator="Εβ · υ" denominator="3" />
            <span>)</span>
          </span>
        ),
        example: "Παράδειγμα: Οι διάσημες πυραμίδες της Γκίζας στην Αίγυπτο."
      },
      sphere: {
        btnLabel: "⚽ Σφαίρα",
        title: "⚽ Σφαίρα",
        category: "Στερεό εκ Περιστροφής",
        desc: "Είναι απόλυτα στρογγυλή από οποιαδήποτε πλευρά κι αν την κοιτάξουμε. Όλα τα σημεία της επιφάνειάς της ισαπέχουν από το κέντρο της (ακτίνα ρ).",
        formula: (
          <span>
            Ο όγκος εξαρτάται αποκλειστικά από την ακτίνα ( ρ ) της
          </span>
        ),
        example: "Παράδειγμα: Μια μπάλα μπάσκετ, ένας βόλος ή ο πλανήτης Γη."
      }
    }
  },
  en: {
    pageTitle: "Geometric Solids & Volume - 5th Grade | LearnMaths.gr",
    pageDescription: "Learn about 3D geometric solids (cube, rectangular prism, cylinder, cone, pyramid, sphere), their volume formulas, and explore the interactive 3D visual canvas.",
    backText: "5th Grade",
    exercisesBtn: "Exercises",
    chapterBadge: "CHAPTER 29 • 5TH GRADE",
    heroTitle: "Geometric Solids & Their Volumes",
    heroSubtitle: "Explore three-dimensional space: polyhedra (cube, rectangular prism, pyramid) and solids of revolution (cylinder, cone, sphere). Learn their structural properties and how to calculate their volume.",
    theoryLiveStatus: "Theory & 3D Interactive Solids Explorer",
    tryExercises: "Try the Exercises",
    keyConceptsTitle: "Core Concepts in 4 Steps",
    keyConceptsSubtitle: "Classification of 3D geometric solids and the volume relationships between them.",
    step1Badge: "STEP 1",
    step1Category: "Definition",
    step1Title: "What are Geometric Solids?",
    step1Desc: "Unlike 2D flat figures on paper, geometric solids exist in 3 spatial dimensions:",
    step1DimX: "Length (x dimension)",
    step1DimY: "Width (y dimension)",
    step1DimZ: "Height (z dimension)",
    step1Tip: "💡 Every solid body occupies space, meaning it has volume and is bounded by surfaces (faces).",
    step2Badge: "STEP 2",
    step2Category: "Classification",
    step2Title: "Polyhedra & Solids of Revolution",
    step2Desc: "Geometric solids are classified into two broad categories:",
    step2PolyhedraLabel: "Polyhedra:",
    step2PolyhedraDesc: "Bounded strictly by flat polygonal faces (cube, rectangular prism, pyramid).",
    step2RevolutionLabel: "Solids of revolution:",
    step2RevolutionDesc: "Possess curved rolling surfaces generated by rotating a 2D shape (cylinder, cone, sphere).",
    step2Tip: "⚡ Polyhedra have flat polygonal faces, straight edges, and corners (vertices).",
    step3Badge: "STEP 3",
    step3Category: "Relationship",
    step3Title: "Prisms vs Pyramids",
    step3Desc: "A remarkable geometric relationship in volume:",
    step3FormulaPrefix: "Pyramid Volume ＝",
    step3FormulaNum: "Prism Volume",
    step3FormulaDen: "3",
    step3Explanation: "If a pyramid and a prism (or a cone and a cylinder) share the same base and identical height, the pyramid holds exactly one third of the prism volume!",
    step3Tip: "🎯 It takes exactly 3 full cones of water to completely fill a cylinder of the same base and height!",
    step4Badge: "STEP 4",
    step4Category: "Real World",
    step4Title: "Solids in Everyday Life",
    step4Desc: "All physical items around us are 3D geometric solids:",
    step4ItemBox: "Shoebox: Rectangular prism",
    step4ItemCan: "Soda can: Cylinder",
    step4ItemBall: "Soccer ball: Sphere",
    step4ItemCone: "Ice cream cone: Cone",
    step4Tip: "🔍 Calculating volume helps us determine how much liquid, weight, or storage space objects can hold.",
    labBadge: "INTERACTIVE LAB",
    labTitle: "3D Geometric Solids Explorer",
    labDesc: "Select any of the 6 geometric solids to inspect its 3D projection, structural properties, volume formula, and real-world examples.",
    selectSolidTitle: "1. SELECT GEOMETRIC SOLID",
    solidTypeBadge: "3D SOLID",
    formulaTitle: "MATHEMATICAL VOLUME FORMULA",
    visualTitle: "3D GEOMETRIC PROJECTION",
    summaryCallout: "📦 All solid bodies occupy 3D space and possess a measurable volume!",
    ctaTitle: "Time to Practice Geometric Solids!",
    ctaSubtitle: "Test your knowledge on identifying 3D solids, calculating volumes of cubes, rectangular prisms, cylinders, and relating pyramids to prisms.",
    ctaButton: "Start Exercises",
    solids: {
      cube: {
        btnLabel: "🟩 Cube",
        title: "🟩 Cube",
        category: "Regular Polyhedron",
        desc: "The cube is the most symmetric solid! It features 6 congruent square faces, 8 vertices, and 12 equal edges (length, width, and height are identical).",
        formula: (
          <span>
            Volume ＝ Edge · Edge · Edge &nbsp; ( V ＝ a · a · a )
          </span>
        ),
        example: "Example: Playing dice or a Rubik's cube."
      },
      box: {
        btnLabel: "🟧 Rect. Prism",
        title: "🟧 Rectangular Prism",
        category: "Polyhedron (Prism)",
        desc: "It has 6 rectangular faces and is characterized by 3 independent dimensions: Length (a), Width (b), and Height (c).",
        formula: (
          <span>
            Volume ＝ Length · Width · Height &nbsp; ( V ＝ a · b · c )
          </span>
        ),
        example: "Example: A shoebox, a matchbox, or a building brick."
      },
      cylinder: {
        btnLabel: "🥤 Cylinder",
        title: "🥤 Cylinder",
        category: "Solid of Revolution",
        desc: "Composed of two parallel congruent circular bases (top and bottom) and a smooth curved lateral surface allowing it to roll.",
        formula: (
          <span>
            Volume ＝ Circular Base Area · Height &nbsp; ( V ＝ Ab · h )
          </span>
        ),
        example: "Example: A metal soda can or a cylindrical candle."
      },
      cone: {
        btnLabel: "🍦 Cone",
        title: "🍦 Cone",
        category: "Solid of Revolution",
        desc: "Has one circular base at the bottom and tapers smoothly upwards to a single pointed apex.",
        formula: (
          <span className="inline-flex items-center justify-center flex-wrap gap-1">
            <span>Volume ＝</span>
            <Fraction numerator="Base Area · Height" denominator="3" />
            <span className="ml-1">( V ＝</span>
            <Fraction numerator="Ab · h" denominator="3" />
            <span>)</span>
          </span>
        ),
        example: "Example: An ice cream cone or an orange traffic cone."
      },
      pyramid: {
        btnLabel: "📐 Pyramid",
        title: "📐 Pyramid",
        category: "Polyhedron",
        desc: "Features a polygon as its base (often a square) and triangular lateral faces that all meet at a common top apex.",
        formula: (
          <span className="inline-flex items-center justify-center flex-wrap gap-1">
            <span>Volume ＝</span>
            <Fraction numerator="Base Area · Height" denominator="3" />
            <span className="ml-1">( V ＝</span>
            <Fraction numerator="Ab · h" denominator="3" />
            <span>)</span>
          </span>
        ),
        example: "Example: The Great Pyramids of Giza in Egypt."
      },
      sphere: {
        btnLabel: "⚽ Sphere",
        title: "⚽ Sphere",
        category: "Solid of Revolution",
        desc: "Perfectly round in all directions. Every point on its outer surface is equidistant from its center (radius r).",
        formula: (
          <span>
            Volume depends strictly on its radius ( r )
          </span>
        ),
        example: "Example: A basketball, a glass marble, or planet Earth."
      }
    }
  }
};

export default function OgkoiSximatonTheoryPage() {
  const router = useRouter();
  const currentLocale = router?.locale === 'en' ? 'en' : 'el';
  const t = translations[currentLocale];

  const [activeSolid, setActiveSolid] = useState('cube');

  const cubeSide = 110;
  const rectW = 150;
  const rectH = 95;
  const rectD = 65;
  const cylRadius = 55;
  const cylHeight = 130;
  const coneRadius = 55;
  const coneHeight = 130;
  const pyrSize = 120;
  const pyrHeight = 130;
  const sphereRadius = 70;

  const currentSolid = t.solids[activeSolid];

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDescription}
      backUrl="/e-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/29-ogkoi-sximaton-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 {t.exercisesBtn}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-10 2xl:space-y-14">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{toCleanUppercase(t.chapterBadge)}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              {t.heroSubtitle}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t.theoryLiveStatus}</span>
            </div>
            <Link
              href="/e-dimotikou/29-ogkoi-sximaton-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2.5 2xl:px-7 2xl:py-3.5 rounded-xl shadow-md transition active:scale-95 text-sm 2xl:text-base"
            >
              <span>{t.tryExercises}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΑΝΑΛΥΣΗΣ ΘΕΩΡΙΑΣ ΣΕ 4 ΒΗΜΑΤΑ */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              {t.keyConceptsTitle}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base 2xl:text-xl mt-1">
              {t.keyConceptsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-6 2xl:gap-8">
            {/* Βήμα 1ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step1Badge)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step1Category}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step1Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step1Desc}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono">
                  <div>• <strong>{t.step1DimX}</strong></div>
                  <div>• <strong>{t.step1DimY}</strong></div>
                  <div>• <strong>{t.step1DimZ}</strong></div>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                {t.step1Tip}
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step2Badge)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step2Category}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step2Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step2Desc}
                </p>

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-950">
                    • <strong>{t.step2PolyhedraLabel}</strong> {t.step2PolyhedraDesc}
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    • <strong>{t.step2RevolutionLabel}</strong> {t.step2RevolutionDesc}
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {t.step2Tip}
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step3Badge)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step3Category}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step3Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step3Desc}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono text-center">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-bold text-amber-950 shadow-inner inline-flex items-center justify-center flex-wrap gap-1">
                    <span>{t.step3FormulaPrefix}</span>
                    <Fraction numerator={t.step3FormulaNum} denominator={t.step3FormulaDen} className="text-xs sm:text-sm font-bold" />
                  </div>
                  <p className="text-slate-600 text-xs font-sans text-left pt-1">
                    {t.step3Explanation}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                {t.step3Tip}
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step4Badge)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step4Category}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step4Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step4Desc}
                </p>

                <div className="space-y-1.5 text-xs sm:text-sm 2xl:text-base">
                  <div>• <strong>{t.step4ItemBox}</strong></div>
                  <div>• <strong>{t.step4ItemCan}</strong></div>
                  <div>• <strong>{t.step4ItemBall}</strong></div>
                  <div>• <strong>{t.step4ItemCone}</strong></div>
                </div>
              </div>

              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 text-xs 2xl:text-sm text-purple-950 font-medium">
                {t.step4Tip}
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΣΤΕΡΕΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 {toCleanUppercase(t.labBadge)}</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              {t.labTitle}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.labDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Αριστερή Στήλη: Επιλογέας & Πληροφορίες */}
            <div className="lg:col-span-6 2xl:col-span-6 space-y-6 bg-slate-50 p-4 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200 flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500 uppercase mb-3">
                    {toCleanUppercase(t.selectSolidTitle)}
                  </h4>

                  {/* Grid Επιλογής 6 Στερεών */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                    {Object.keys(t.solids).map((key) => {
                      const solid = t.solids[key];
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setActiveSolid(key)}
                          className={`p-3 rounded-2xl font-bold text-xs sm:text-sm transition active:scale-95 text-center shadow-xs border ${
                            activeSolid === key
                              ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {solid.btnLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Κάρτα Ταυτότητας Στερεού */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black uppercase text-blue-700 tracking-wider">
                      {currentSolid.category}
                    </span>
                    <span className="text-xs font-mono text-slate-400 font-bold">{t.solidTypeBadge}</span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black text-slate-900">
                    {currentSolid.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                    {currentSolid.desc}
                  </p>
                </div>
              </div>

              {/* Πράσινη Κάρτα Τύπου & Παραδείγματος */}
              <div className="bg-emerald-50 text-slate-900 p-4 sm:p-5 rounded-2xl border border-emerald-200 space-y-2.5 shadow-xs text-center mt-4">
                <span className="text-[11px] font-black text-emerald-800 uppercase tracking-wider block">
                  {toCleanUppercase(t.formulaTitle)}
                </span>
                <div className="text-sm sm:text-base font-black font-mono text-emerald-700 bg-white p-3 rounded-xl border border-emerald-200 inline-flex items-center justify-center flex-wrap gap-1">
                  {currentSolid.formula}
                </div>
                <p className="text-xs text-emerald-900 font-medium italic pt-0.5">
                  {currentSolid.example}
                </p>
              </div>
            </div>

            {/* Δεξιά Στήλη: SVG 3D Προβολή */}
            <div className="lg:col-span-6 2xl:col-span-6 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-between space-y-6">
              <div className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500 px-1">
                <span>{toCleanUppercase(t.visualTitle)}</span>
                <span className="font-mono text-blue-600 font-bold">{currentSolid.title}</span>
              </div>

              {/* SVG 3D Canvas */}
              <div className="w-full max-w-[360px] aspect-square bg-white p-4 rounded-2xl border border-slate-200 shadow-inner flex items-center justify-center overflow-hidden my-auto">
                <svg
                  width="300"
                  height="300"
                  viewBox="0 0 300 300"
                  className="w-full h-full drop-shadow-sm"
                  shapeRendering="geometricPrecision"
                >
                  {/* ΚΥΒΟΣ */}
                  {activeSolid === 'cube' && (
                    <g transform="translate(95, 95)">
                      <rect
                        x="0"
                        y="35"
                        width={cubeSide}
                        height={cubeSide}
                        fill="#93c5fd"
                        stroke="#2563eb"
                        strokeWidth="2"
                        opacity="0.85"
                      />
                      <path
                        d={`M 0 35 L 35 0 L ${cubeSide + 35} 0 L ${cubeSide} 35 Z`}
                        fill="#bfdbfe"
                        stroke="#2563eb"
                        strokeWidth="2"
                      />
                      <path
                        d={`M ${cubeSide} 35 L ${cubeSide + 35} 0 L ${cubeSide + 35} ${cubeSide} L ${cubeSide} ${cubeSide + 35} Z`}
                        fill="#60a5fa"
                        stroke="#2563eb"
                        strokeWidth="2"
                      />
                    </g>
                  )}

                  {/* ΟΡΘΟΓΩΝΙΟ ΠΑΡΑΛΛΗΛΕΠΙΠΕΔΟ */}
                  {activeSolid === 'box' && (
                    <g transform="translate(65, 105)">
                      <rect
                        x="0"
                        y={rectD}
                        width={rectW}
                        height={rectH}
                        fill="#fde68a"
                        stroke="#d97706"
                        strokeWidth="2"
                        opacity="0.85"
                      />
                      <path
                        d={`M 0 ${rectD} L ${rectD} 0 L ${rectW + rectD} 0 L ${rectW} ${rectD} Z`}
                        fill="#fef3c7"
                        stroke="#d97706"
                        strokeWidth="2"
                      />
                      <path
                        d={`M ${rectW} ${rectD} L ${rectW + rectD} 0 L ${rectW + rectD} ${rectH} L ${rectW} ${rectH + rectD} Z`}
                        fill="#fcd34d"
                        stroke="#d97706"
                        strokeWidth="2"
                      />
                    </g>
                  )}

                  {/* ΚΥΛΙΝΔΡΟΣ */}
                  {activeSolid === 'cylinder' && (
                    <g transform="translate(150, 65)">
                      <path
                        d={`M ${-cylRadius} 30 L ${-cylRadius} ${cylHeight} A ${cylRadius} 24 0 0 0 ${cylRadius} ${cylHeight} L ${cylRadius} 30 Z`}
                        fill="#a7f3d0"
                        stroke="#059669"
                        strokeWidth="2"
                      />
                      <ellipse
                        cx="0"
                        cy={cylHeight}
                        rx={cylRadius}
                        ry="24"
                        fill="none"
                        stroke="#059669"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                      />
                      <ellipse
                        cx="0"
                        cy="30"
                        rx={cylRadius}
                        ry="24"
                        fill="#d1fae5"
                        stroke="#059669"
                        strokeWidth="2"
                      />
                    </g>
                  )}

                  {/* ΚΩΝΟΣ */}
                  {activeSolid === 'cone' && (
                    <g transform="translate(150, 65)">
                      <path
                        d={`M ${-coneRadius} ${coneHeight} L 0 0 L ${coneRadius} ${coneHeight} A ${coneRadius} 24 0 0 1 ${-coneRadius} ${coneHeight} Z`}
                        fill="#fbcfe8"
                        stroke="#db2777"
                        strokeWidth="2"
                      />
                      <path
                        d={`M ${-coneRadius} ${coneHeight} A ${coneRadius} 24 0 0 0 ${coneRadius} ${coneHeight}`}
                        fill="none"
                        stroke="#db2777"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                      />
                    </g>
                  )}

                  {/* ΠΥΡΑΜΙΔΑ */}
                  {activeSolid === 'pyramid' && (
                    <g transform="translate(150, 65)">
                      <path
                        d={`M ${-pyrSize / 2} ${pyrHeight} L 0 0 L ${pyrSize / 2} ${pyrHeight} Z`}
                        fill="#fed7aa"
                        stroke="#ea580c"
                        strokeWidth="2"
                      />
                      <path
                        d={`M ${pyrSize / 2} ${pyrHeight} L ${pyrSize / 2 + 35} ${pyrHeight - 20} L 0 0 Z`}
                        fill="#ffedd5"
                        stroke="#ea580c"
                        strokeWidth="2"
                      />
                      <path
                        d={`M ${-pyrSize / 2} ${pyrHeight} L ${35 - pyrSize / 2} ${pyrHeight - 20} L ${pyrSize / 2 + 35} ${pyrHeight - 20}`}
                        fill="none"
                        stroke="#ea580c"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                      />
                    </g>
                  )}

                  {/* ΣΦΑΙΡΑ */}
                  {activeSolid === 'sphere' && (
                    <g transform="translate(150, 150)">
                      <circle
                        cx="0"
                        cy="0"
                        r={sphereRadius}
                        fill="#fca5a5"
                        stroke="#dc2626"
                        strokeWidth="2"
                        opacity="0.85"
                      />
                      <ellipse
                        cx="0"
                        cy="0"
                        rx={sphereRadius}
                        ry="24"
                        fill="none"
                        stroke="#dc2626"
                        strokeWidth="2"
                        strokeDasharray="5 5"
                      />
                      <ellipse
                        cx="0"
                        cy="0"
                        rx={sphereRadius}
                        ry="23"
                        fill="none"
                        stroke="#dc2626"
                        strokeWidth="1"
                        opacity="0.4"
                      />
                    </g>
                  )}
                </svg>
              </div>

              {/* Callout Συμπεράσματος */}
              <div className="w-full max-w-md p-3.5 bg-slate-100 rounded-2xl border border-slate-200 text-center font-mono text-xs sm:text-sm text-slate-700">
                {t.summaryCallout}
              </div>
            </div>
          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              {t.ctaTitle}
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              {t.ctaSubtitle}
            </p>
          </div>

          <Link
            href="/e-dimotikou/29-ogkoi-sximaton-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 {t.ctaButton}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}