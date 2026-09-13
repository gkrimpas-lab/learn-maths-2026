import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../shared/layout-config';

export default function Epikoinonia() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'loading', message: 'Αποστολή μηνύματος...' });

    try {
      // Αντικατάστησε το YOUR_FORMSPREE_ID με το ID της φόρμας σου από το formspree.io
      const response = await fetch('https://formspree.io/f/YOUR_FORMSPREE_ID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus({
          state: 'success',
          message: 'Το μήνυμά σας στάλθηκε με επιτυχία! Θα σας απαντήσω το συντομότερο δυνατό.'
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Παρουσιάστηκε σφάλμα κατά την αποστολή.');
      }
    } catch (err) {
      setStatus({
        state: 'error',
        message: 'Υπήρξε πρόβλημα στην αποστολή. Παρακαλώ δοκιμάστε ξανά ή στείλτε απευθείας email.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>✉️ Επικοινωνία - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        {/* NAVBAR */}
        <nav className="bg-white shadow-md w-full sticky top-0 z-50">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            <Link href="/" className="text-2xl font-black text-blue-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            <Link
              href="/"
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-sm"
            >
              🏠 Αρχική Σελίδα
            </Link>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-12 space-y-12`}>
          <div className="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-gray-100">
            
            {/* Header Τίτλος */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-black text-gray-900 mb-4">✉️ Επικοινωνία</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Χρειάζεστε βοήθεια, έχετε κάποια απορία, ερώτηση ή πρόταση βελτίωσης για την πλατφόρμα;
                Συμπληρώστε τη φόρμα ή στείλτε μου μήνυμα και θα χαρώ να σας απαντήσω!
              </p>
            </div>

            {/* Grid 2 Στηλών */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
              
              {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΠΛΗΡΟΦΟΡΙΕΣ & ΣΤΟΙΧΕΙΑ (5 στήλες) */}
              <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                  <h3 className="font-bold text-xl text-blue-900 mb-2 flex items-center gap-2">
                    <span>👨‍🏫</span> Σχετικά με τον Δημιουργό
                  </h3>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    Ονομάζομαι <strong>Δημήτρης Γκρίμπας</strong> και είμαι ο δημιουργός του LearnMaths.gr.
                    Είμαι Μηχανικός Η/Υ και Πληροφορικής του Πανεπιστημίου Πατρών με Μεταπτυχιακό στη Διδακτική των
                    Θετικών Επιστημών και κάτοχος 2ου πτυχίου από το τμήμα Μαθηματικών του Πανεπιστημίου Πατρών.
                    Στόχος μου είναι να κάνω τη μάθηση των Μαθηματικών προσιτή, διαδραστική και κατανοητή για κάθε μαθητή.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-inner flex flex-col justify-center space-y-4">
                  <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                    <span>💡</span> Πώς μπορώ να βοηθήσω;
                  </h3>
                  <ul className="space-y-2 text-xs md:text-sm text-slate-700 font-medium">
                    <li className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold">✓</span> Ερωτήσεις σχετικά με την ύλη και τις ασκήσεις
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold">✓</span> Προτάσεις για νέα διαδραστικά εργαλεία &amp; θέματα
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold">✓</span> Αναφορά τεχνικών προβλημάτων ή παρατηρήσεων
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold">✓</span> Συνεργασίες &amp; υποστήριξη εκπαιδευτικών
                    </li>
                  </ul>

                  <div className="pt-4 border-t border-slate-200/70">
                    <span className="text-xs text-slate-500 block mb-1">Απευθείας διεύθυνση ηλεκτρονικού ταχυδρομείου:</span>
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
                  <h3 className="font-bold text-2xl text-gray-900 mb-1 flex items-center gap-2">
                    <span>📝</span> Φόρμα Επικοινωνίας
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">
                    Συμπληρώστε τα στοιχεία σας και το μήνυμά σας θα σταλεί κατευθείαν στο email μου.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Ονοματεπώνυμο
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="π.χ. Μαρία Παπαδοπούλου"
                        className="w-full p-3 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm bg-slate-50/50 focus:bg-white transition"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Email Επικοινωνίας
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="π.χ. email@example.com"
                        className="w-full p-3 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm bg-slate-50/50 focus:bg-white transition"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Θέμα
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="π.χ. Ερώτηση για άσκηση / Πρόταση βελτίωσης"
                        className="w-full p-3 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm bg-slate-50/50 focus:bg-white transition"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Το μήνυμά σας
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows="4"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Γράψτε εδώ την απορία, το σχόλιο ή την παρατήρησή σας..."
                        className="w-full p-3 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm bg-slate-50/50 focus:bg-white transition resize-none"
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
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition duration-200 active:scale-95 disabled:opacity-60 text-sm md:text-base flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {status.state === 'loading' ? (
                        <>
                          <span className="inline-block animate-spin">⏳</span>
                          Αποστολή...
                        </>
                      ) : (
                        <>
                          <span>🚀</span> Αποστολή Μηνύματος
                        </>
                      )}
                    </button>
                  </form>
                </div>

                <p className="text-[11px] text-gray-400 text-center mt-4">
                  * Τα στοιχεία σας χρησιμοποιούνται αποκλειστικά για την απάντηση στο μήνυμά σας.
                </p>
              </div>

            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700 mt-12">
        <p>© {new Date().getFullYear()} LearnMaths.gr. Με ❤️ για τους μαθητές μας.</p>
      </footer>
    </div>
  );
}
