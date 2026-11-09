import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { LAYOUT } from '../shared/layout-config';

// 🔑 Access Key από το web3forms.com
const WEB3FORMS_ACCESS_KEY = "2d4b008c-46ed-47e5-987c-458eed8be84b";

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
    metaTitle: "Επικοινωνία & Σχετικά με τον Δημιουργό - LearnMaths.gr",
    metaDesc: "Επικοινωνήστε με το LearnMaths.gr και τον δημιουργό Δημήτρη Γκρίμπα (Μαθηματικό & Μηχανικό Η/Υ). Ερωτήσεις για ασκήσεις, προτάσεις και υποστήριξη μαθητών & εκπαιδευτικών.",
    backText: "Αρχική",
    headerTitle: "✉️ Επικοινωνία",
    headerDesc: "Χρειάζεστε βοήθεια, έχετε κάποια απορία, ερώτηση ή πρόταση βελτίωσης για την πλατφόρμα; Συμπληρώστε τη φόρμα ή στείλτε μου μήνυμα και θα χαρώ να σας απαντήσω!",
    aboutTitle: "Σχετικά με τον Δημιουργό",
    aboutText: "Ονομάζομαι Δημήτρης Γκρίμπας και είμαι ο δημιουργός του LearnMaths.gr. Είμαι Μηχανικός Η/Υ και Πληροφορικής του Πανεπιστημίου Πατρών με Μεταπτυχιακό στη Διδακτική των Θετικών Επιστημών και κάτοχος 2ου πτυχίου από το τμήμα Μαθηματικών του Πανεπιστημίου Πατρών. Στόχος μου είναι να κάνω τη μάθηση των Μαθηματικών προσιτή, διαδραστική και κατανοητή για κάθε μαθητή.",
    howCanHelpTitle: "Πώς μπορώ να βοηθήσω;",
    helpItems: [
      "Ερωτήσεις σχετικά με την ύλη και τις ασκήσεις μαθηματικών",
      "Προτάσεις για νέα διαδραστικά εργαλεία & θέματα εξετάσεων",
      "Αναφορά τεχνικών παρατηρήσεων ή προτάσεων",
      "Συνεργασίες & υποστήριξη εκπαιδευτικών"
    ],
    directEmailLabel: "Απευθείας διεύθυνση ηλεκτρονικού ταχυδρομείου:",
    formTitle: "Φόρμα Επικοινωνίας",
    formSubtitle: "Συμπληρώστε τα στοιχεία σας και το μήνυμά σας θα σταλεί κατευθείαν στο email μου.",
    botcheckLabel: "Μην συμπληρώσετε αυτό το πεδίο αν είστε άνθρωπος",
    nameLabel: "Ονοματεπωνυμο",
    namePlaceholder: "π.χ. Μαρία Παπαδοπούλου",
    emailLabel: "Email Επικοινωνιας",
    emailPlaceholder: "π.χ. email@example.com",
    subjectLabel: "Θεμα",
    subjectPlaceholder: "π.χ. Ερώτηση για άσκηση / Πρόταση βελτίωσης",
    messageLabel: "Το μηνυμα σας",
    messagePlaceholder: "Γράψτε εδώ την απορία, το σχόλιο ή την παρατήρησή σας...",
    statusSuccess: "Το μήνυμά σας στάλθηκε με επιτυχία! Θα σας απαντήσω το συντομότερο δυνατό.",
    statusErrorGeneric: "Υπήρξε πρόβλημα στην αποστολή. Παρακαλώ δοκιμάστε ξανά ή στείλτε απευθείας email στο gkrimpas.apps@gmail.com.",
    statusErrorKey: "Δεν έχει ρυθμιστεί το Access Key. Παρακαλώ βάλτε το κλειδί από το web3forms.com στον κώδικα.",
    statusSending: "Αποστολή μηνύματος...",
    sendBtn: "Αποστολή Μηνύματος",
    sendingBtn: "Αποστολή...",
    privacyNote: "* Προστατεύεται από ανεπιθύμητα μηνύματα (spam protection). Τα στοιχεία σας χρησιμοποιούνται αποκλειστικά για την απάντηση στο μήνυμά σας.",
    formSourceTag: "LearnMaths.gr Φόρμα Επικοινωνίας"
  },
  en: {
    metaTitle: "Contact & About the Creator - LearnMaths.gr",
    metaDesc: "Get in touch with LearnMaths.gr and creator Dimitris Gkrimpas (Mathematician & Computer Engineer). Inquiries, exercise questions, feedback, and educator support.",
    backText: "Home",
    headerTitle: "✉️ Contact",
    headerDesc: "Need help, have a question, inquiry, or suggestion for improving the platform? Fill out the form or send me a message and I will be happy to respond!",
    aboutTitle: "About the Creator",
    aboutText: "My name is Dimitris Gkrimpas and I am the creator of LearnMaths.gr. I am a Computer Engineer and Informatics graduate from the University of Patras, holding a Master's degree in Didactics of Science and a second bachelor's degree from the Department of Mathematics at the University of Patras. My goal is to make learning Mathematics accessible, interactive, and comprehensible for every student.",
    howCanHelpTitle: "How can I help?",
    helpItems: [
      "Questions regarding mathematics curriculum and problem sets",
      "Suggestions for new interactive math simulators & topics",
      "Reporting technical remarks or UX feedback",
      "Collaborations & educator support"
    ],
    directEmailLabel: "Direct email address:",
    formTitle: "Contact Form",
    formSubtitle: "Fill in your details and your message will be sent directly to my inbox.",
    botcheckLabel: "Do not fill this field if you are human",
    nameLabel: "Full Name",
    namePlaceholder: "e.g. John Doe",
    emailLabel: "Contact Email",
    emailPlaceholder: "e.g. email@example.com",
    subjectLabel: "Subject",
    subjectPlaceholder: "e.g. Question about an exercise / Improvement suggestion",
    messageLabel: "Your Message",
    messagePlaceholder: "Write your inquiry, comment, or observation here...",
    statusSuccess: "Your message has been sent successfully! I will reply as soon as possible.",
    statusErrorGeneric: "There was a problem sending your message. Please try again or email directly at gkrimpas.apps@gmail.com.",
    statusErrorKey: "Access Key is not configured. Please set the key from web3forms.com in the code.",
    statusSending: "Sending message...",
    sendBtn: "Send Message",
    sendingBtn: "Sending...",
    privacyNote: "* Protected against spam. Your details are used solely to reply to your inquiry.",
    formSourceTag: "LearnMaths.gr Contact Form"
  }
};

export default function Epikoinonia() {
  const router = useRouter();
  const rawLocale = router?.locale || 'el';
  const locale = TRANSLATIONS[rawLocale] ? rawLocale : 'el';
  const t = TRANSLATIONS[locale];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    botcheck: '' // Honeypot πεδίο
  });

  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.botcheck) {
      setStatus({ state: 'success', message: t.statusSuccess });
      return;
    }

    if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY.includes('ΒΑΛΕ_ΕΔΩ')) {
      setStatus({
        state: 'error',
        message: t.statusErrorKey
      });
      return;
    }

    setStatus({ state: 'loading', message: t.statusSending });

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          from_name: t.formSourceTag,
          botcheck: formData.botcheck
        })
      });

      const result = await response.json();

      if (result.success) {
        setStatus({
          state: 'success',
          message: t.statusSuccess
        });
        setFormData({ name: '', email: '', subject: '', message: '', botcheck: '' });
      } else {
        throw new Error(result.message || t.statusErrorGeneric);
      }
    } catch (err) {
      setStatus({
        state: 'error',
        message: t.statusErrorGeneric
      });
    }
  };

  const canonicalUrl = locale === 'en'
    ? 'https://learnmaths.gr/en/epikoinonia'
    : 'https://learnmaths.gr/epikoinonia';
  const homeUrl = locale === 'en' ? 'https://learnmaths.gr/en' : 'https://learnmaths.gr/';

  // Schema.org: ContactPage & Person (E-E-A-T Author Schema)
  const contactSchema = [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": t.backText, "item": homeUrl },
        { "@type": "ListItem", "position": 2, "name": locale === 'en' ? "Contact" : "Επικοινωνία", "item": canonicalUrl }
      ]
    },
    {
      "@type": "ContactPage",
      "@id": `${canonicalUrl}#webpage`,
      "url": canonicalUrl,
      "name": t.metaTitle,
      "description": t.metaDesc,
      "inLanguage": locale === 'en' ? 'en' : 'el',
      "mainEntity": {
        "@type": "Person",
        "@id": "https://learnmaths.gr/#creator",
        "name": locale === 'en' ? "Dimitris Gkrimpas" : "Δημήτρης Γκρίμπας",
        "jobTitle": locale === 'en' ? "Informatics Educator (PE86), Mathematician & Computer Engineer" : "Εκπαιδευτικός Πληροφορικής (ΠΕ86), Μαθηματικός & Μηχανικός Η/Υ",
        "email": "gkrimpas.apps@gmail.com",
        "alumniOf": [
          {
            "@type": "EducationalOrganization",
            "name": locale === 'en' ? "Department of Computer Engineering and Informatics, University of Patras" : "Τμήμα Μηχανικών Η/Υ και Πληροφορικής, Πανεπιστήμιο Πατρών",
            "url": "https://www.ceid.upatras.gr/"
          },
          {
            "@type": "EducationalOrganization",
            "name": locale === 'en' ? "Department of Mathematics, University of Patras" : "Τμήμα Μαθηματικών, Πανεπιστήμιο Πατρών",
            "url": "https://www.math.upatras.gr/"
          }
        ],
        "knowsAbout": [
          "Mathematics Education",
          "Algebra",
          "Geometry",
          "Educational Software",
          "Didactics of Science"
        ]
      }
    }
  ];

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDesc}
      schemaData={contactSchema}
      backUrl="/"
      backText={t.backText}
      showAds={false}
    >
      <div className={`${LAYOUT.LESSON_CONTAINER} py-8 md:py-12 space-y-12`}>
        <div className="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-gray-100">
          
          {/* Header Τίτλος */}
          <div className="text-center mb-10 md:mb-12">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">{t.headerTitle}</h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {t.headerDesc}
            </p>
          </div>

          {/* Grid 2 Στηλών */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΠΛΗΡΟΦΟΡΙΕΣ & ΣΤΟΙΧΕΙΑ ΔΗΜΙΟΥΡΓΟΥ (5 στήλες) */}
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 shadow-sm">
                <h2 className="font-bold text-xl text-blue-900 mb-2 flex items-center gap-2">
                  <span aria-hidden="true">👨‍🏫</span> {t.aboutTitle}
                </h2>
                <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed">
                  {locale === 'el' ? (
                    <>
                      Ονομάζομαι <strong>Δημήτρης Γκρίμπας</strong> και είμαι ο δημιουργός του LearnMaths.gr.
                      Είμαι Μηχανικός Η/Υ και Πληροφορικής του Πανεπιστημίου Πατρών με Μεταπτυχιακό στη Διδακτική των
                      Θετικών Επιστημών και κάτοχος 2ου πτυχίου από το τμήμα Μαθηματικών του Πανεπιστημίου Πατρών.
                      Στόχος μου είναι να κάνω τη μάθηση των Μαθηματικών προσιτή, διαδραστική και κατανοητή για κάθε μαθητή.
                    </>
                  ) : (
                    <>
                      My name is <strong>Dimitris Gkrimpas</strong> and I am the creator of LearnMaths.gr.
                      I am a Computer Engineer and Informatics graduate from the University of Patras, holding a Master's degree in Didactics of Science
                      and a second bachelor's degree from the Department of Mathematics at the University of Patras.
                      My goal is to make learning Mathematics accessible, interactive, and comprehensible for every student.
                    </>
                  )}
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-inner flex flex-col justify-center space-y-4">
                <h3 className="font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                  <span aria-hidden="true">💡</span> {t.howCanHelpTitle}
                </h3>
                <ul className="space-y-2 text-xs md:text-sm text-slate-700 font-medium">
                  {t.helpItems.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold" aria-hidden="true">✓</span> {item}
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-slate-200/70">
                  <span className="text-xs text-slate-500 block mb-1">{t.directEmailLabel}</span>
                  <a
                    href="mailto:gkrimpas.apps@gmail.com"
                    className="font-bold text-blue-600 hover:text-blue-800 text-sm md:text-base break-all"
                  >
                    gkrimpas.apps@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΦΟΡΜΑ ΕΠΙΚΟΙΝΩΝΙΑΣ (7 στήλες) */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="font-bold text-xl sm:text-2xl text-gray-900 mb-1 flex items-center gap-2">
                  <span aria-hidden="true">📝</span> {t.formTitle}
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm mb-6">
                  {t.formSubtitle}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Honeypot field */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="botcheck">{t.botcheckLabel}</label>
                    <input
                      type="text"
                      name="botcheck"
                      id="botcheck"
                      tabIndex="-1"
                      autoComplete="off"
                      value={formData.botcheck}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      {toCleanUppercase(t.nameLabel)}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t.namePlaceholder}
                      className="w-full p-3 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-xs sm:text-sm bg-slate-50/50 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      {toCleanUppercase(t.emailLabel)}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t.emailPlaceholder}
                      className="w-full p-3 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-xs sm:text-sm bg-slate-50/50 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      {toCleanUppercase(t.subjectLabel)}
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder={t.subjectPlaceholder}
                      className="w-full p-3 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-xs sm:text-sm bg-slate-50/50 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      {toCleanUppercase(t.messageLabel)}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t.messagePlaceholder}
                      className="w-full p-3 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-xs sm:text-sm bg-slate-50/50 focus:bg-white transition resize-none"
                    />
                  </div>

                  {status.state !== 'idle' && (
                    <div
                      className={`p-3.5 rounded-xl text-xs sm:text-sm font-medium ${
                        status.state === 'success'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : status.state === 'error'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {status.message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status.state === 'loading'}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition duration-200 active:scale-95 disabled:opacity-60 text-xs sm:text-sm md:text-base flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {status.state === 'loading' ? (
                      <>
                        <span className="inline-block animate-spin" aria-hidden="true">⏳</span>
                        <span>{t.sendingBtn}</span>
                      </>
                    ) : (
                      <>
                        <span aria-hidden="true">🚀</span>
                        <span>{t.sendBtn}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              <p className="text-[11px] text-gray-400 text-center mt-4">
                {t.privacyNote}
              </p>
            </div>

          </div>

        </div>
      </div>
    </Layout>
  );
}