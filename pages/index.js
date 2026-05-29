import Head from 'next/head';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans scroll-smooth">
      <Head>
        <title>LearnMaths.gr - Τα Μαθηματικά Αλλιώς</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <meta name="description" content="Η σύγχρονη πλατφόρμα εκμάθησης Μαθηματικών για το Δημοτικό, το Γυμνάσιο και τα Πρότυπα Σχολεία" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* ΜΠΑΡΑ ΠΛΟΗΓΗΣΗΣ (NAVBAR) */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-2xl font-black text-blue-600 tracking-tight">
            LearnMaths<span className="text-indigo-600">.gr</span>
          </div>
          <div className="flex items-center gap-6 font-medium">
            <a href="#demotiko" className="hover:text-blue-600 transition">Δημοτικό</a>
            <a href="#gymnasio" className="hover:text-indigo-600 transition">Γυμνάσιο</a>
            <a href="#protypa" className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition duration-300">
              🎯 Εισαγωγή σε Πρότυπα
            </a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="bg-gradient-to-r py-16 text-center text-white from-blue-600 to-indigo-700 shadow-lg">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">
            LearnMaths.gr
          </h1>
          <p className="text-xl font-light opacity-90 mb-8">
            Μάθε τα Μαθηματικά εύκολα, γρήγορα και διαδραστικά από το Δημοτικό έως το Γυμνάσιο!
          </p>
          
          {/* ΚΟΥΜΠΙΑ ΠΛΟΗΓΗΣΗΣ */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <a href="#demotiko" className="bg-white text-blue-700 px-6 py-3 rounded-full font-bold shadow-md hover:bg-gray-100 transition duration-300">
              Δημοτικό 🎒
            </a>
            <a href="#gymnasio" className="bg-indigo-500 text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-indigo-600 transition duration-300 border border-indigo-400">
              Γυμνάσιο 📐
            </a>
          </div>

          {/* GOOGLE PLAY STORE BADGE */}
          <div className="flex flex-col items-center justify-center mt-6">
            <p className="text-sm font-medium opacity-80 mb-3 uppercase tracking-wider">Κατεβάστε την εφαρμογή μας</p>
            <a 
              href="https://play.google.com/store/apps/details?id=com.gkrimpas.learn_maths&pcampaignid=web_share" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-block transform hover:scale-105 transition duration-300 shadow-xl rounded-lg overflow-hidden bg-black border border-gray-800"
            >
              <svg viewBox="0 0 512 512" className="w-44 h-auto p-2" xmlns="http://www.w3.org/2000/svg">
                <g fill="#fff">
                  <path d="M410.7 274.6c0-43.7 35.4-79.1 79.1-79.1 3.2 0 6.3.2 9.4.6v-25.1c-16.7-32.9-46.3-57.8-82.6-68.5l-2.6-.7c-21.8-6.1-44.5-5.9-66.2.7l-4.1 1.3c-23.7 7.7-44.6 22-60.3 41.3-15.7-19.3-36.6-33.6-60.3-41.3l-4.1-1.3c-21.7-6.6-44.4-6.8-66.2-.7l-2.6.7c-36.3 10.7-65.9 35.6-82.6 68.5v206.1c16.7 32.9 46.3 57.8 82.6 68.5l2.6.7c21.8 6.1 44.5 5.9 66.2-.7l4.1-1.3c23.7-7.7 44.6-22 60.3-41.3 15.7 19.3 36.6 33.6 60.3 41.3l4.1 1.3c21.7 6.6 44.4 6.8 66.2.7l2.6-.7c36.3-10.7 65.9-35.6 82.6-68.5v-25.1c-3.1.4-6.2.6-9.4.6-43.7 0-79.1-35.4-79.1-79.1z" opacity=".05"/>
                  <path d="M472.5 253.9l-341.3-197c-9.1-5.3-20.2-5.3-29.3 0L92.3 62.4C87 65.4 83.8 71 83.8 77.2v357.5c0 6.2 3.2 11.8 8.5 14.8l9.6 5.5c4.6 2.6 9.6 3.9 14.7 3.9 5.1 0 10.1-1.3 14.7-3.9l341.3-197c9.1-5.2 14.7-14.9 14.7-25.4.1-10.7-5.5-20.4-14.8-25.7z" fill="url(#a)"/>
                  <path d="M403.7 256L92.3 77.2c-5.3-3-8.5-8.6-8.5-14.8V61c0 6.2 3.2 11.8 8.5 14.8L403.7 254c9.3 5.3 14.8 15 14.8 25.5 0-10.6-5.5-20.2-14.8-25.5z" fill="#fff" opacity=".1"/>
                  <path d="M92.3 434.8L403.7 255c9.3-5.3 14.8-15 14.8-25.5 0 10.6-5.5 20.2-14.8 25.5L92.3 433.4c-5.3 3-8.5 8.6-8.5 14.8v1.4c0-6.2 3.2-11.8 8.5-14.8z" fill="#000" opacity=".15"/>
                  <path d="M35.6 42.4h32.2v4.8H54v14h12.5v4.7H54v14.6H35.6v-38.1zm52.4 22.9c0 4.6-1.1 8.2-3.4 10.8-2.3 2.6-5.7 3.9-10.2 3.9s-7.9-1.3-10.2-3.9c-2.3-2.6-3.4-6.2-3.4-10.8v-10c0-4.6 1.1-8.2 3.4-10.8s5.7-3.9 10.2-3.9 7.9 1.3 10.2 3.9c2.3 2.6 3.4 6.2 3.4 10.8v10zm-18.4-10v10c0 2.9.6 5.1 1.7 6.5s2.8 2.2 4.9 2.2 3.8-.7 4.9-2.2 1.7-3.6 1.7-6.5v-10c0-2.9-.6-5.1-1.7-6.5s-2.8-2.2-4.9-2.2-3.8.7-4.9 2.2-1.7 3.6-1.7 6.5zm47.2 25.2h-7.8l-1.3-4.5h-10.4l-1.3 4.5h-5.2l9-27.5h5.1l11.9 27.5zm-10.4-8.8l-3.9-13.1-3.9 13.1h7.8zm30.3-5.3l-8.6-13.4h5.8l5.6 9 5.6-9h5.6l-8.6 13.4V80.5h-5.4V66.4zm34.2 14.1h-16.1v-38.1H190v4.8h-11.3v11.4h10.4v4.7h-10.4V80.5zm27.4-23.7v23.7h-4.8V56.8h-7.5V52h19.8v4.8h-7.5zm24 23.7l-9-27.5h5l6.5 21.2 6.5-21.2h5l-9 27.5h-5zm34.9-14l-8.6-13.5h5.8l5.6 9 5.6-9h5.6l-8.6 13.5V80.5h-5.4V66.5zm19.9-24.1h4.8V80.5h-4.8V42.4zm23.8 21.7c0-2.8.9-5.1 2.6-6.8 1.8-1.7 4.1-2.5 7-2.5s5.2.8 6.9 2.4c1.7 1.6 2.6 3.9 2.6 6.8v1.6h-14.3v1c0 2 .5 3.5 1.4 4.5.9 1 2.3 1.5 4.1 1.5 2.6 0 4.6-.9 6.2-2.8l2.6 2.9c-2.3 2.8-5.5 4.2-9.5 4.2-3.2 0-5.8-.9-7.7-2.8-1.9-1.9-2.9-4.5-2.9-7.8v-4.8zm14.3-1.6c0-1.6-.4-2.8-1.1-3.6-.7-.8-1.7-1.2-3-1.2s-2.3.4-3 1.2c-.7.8-1.1 2-1.1 3.6v1.6h8.2v-1.6zm22.9-11c0 3.2.9 5.7 2.6 7.4 1.7 1.8 4.2 2.7 7.4 2.7l3.8-.2V66h-3.4c-1.8 0-3.1-.4-3.9-1.3-.8-.9-1.2-2.2-1.2-4.1v-18.2h-5.3zm20.8 10c0-4.6 1.1-8.2 3.3-10.8s5.4-3.9 9.6-3.9 7.4 1.3 9.6 3.9c2.2 2.6 3.3 6.2 3.3 10.8v10c0 4.6-1.1 8.2-3.3 10.8s-5.4 3.9-9.6 3.9-7.4-1.3-9.6-3.9c-2.2-2.6-3.3-6.2-3.3-10.8v-10zm18.4-10v10c0 2.9.5 5.1 1.5 6.5s2.5 2.1 4.4 2.1 3.4-.7 4.4-2.1c1-1.4 1.5-3.6 1.5-6.5v-10c0-2.9-.5-5.1-1.5-6.5s-2.5-2.1-4.4-2.1-3.4.7-4.4 2.1c-1 1.4-1.5 3.6-1.5 6.5zm43.3 3.6h-5.4v16.9h-4.8V56.5h-5.4V52h15.6v4.5zm19.6 16.9h-4.8V52h4.8v28.5zm16-16.1h-4.3V80.5h-4.8V56.4h-4.3V52h13.4v4.4zm10.7-5.1c0 3 1 5.3 2.9 6.8 1.9 1.5 4.6 2.3 8.1 2.3h3.8V80.5h-4.8v-8.7H457c-2 0-3.4-.4-4.2-1.2-.8-.8-1.2-2-1.2-3.5V52.1zm12.9 2c0-1.4-.3-2.4-.9-3.1s-1.6-1-2.9-1h-1.4V59h1.4c1.3 0 2.2-.3 2.9-1 .7-.7.9-1.7.9-3.2v-2.1zm31.7 15.6c0-2.8.9-5.1 2.6-6.8 1.8-1.7 4.1-2.5 7-2.5s5.2.8 6.9 2.4c1.7 1.6 2.6 3.9 2.6 6.8v1.6H490v1c0 2 .5 3.5 1.4 4.5.9 1 2.3 1.5 4.1 1.5 2.6 0 4.6-.9 6.2-2.8l2.6 2.9c-2.3 2.8-5.5 4.2-9.5 4.2-3.2 0-5.8-.9-7.7-2.8-1.9-1.9-2.9-4.5-2.9-7.8V66.2zm14.3-1.6c0-1.6-.4-2.8-1.1-3.6-.7-.8-1.7-1.2-3-1.2s-2.3.4-3 1.2c-.7.8-1.1 2-1.1 3.6v1.6h8.2v-1.6zM35.6 109.1V140h17.9c5.2 0 9.2-1.3 12.1-4 2.9-2.7 4.4-6.5 4.4-11.4v-4.1c0-4.9-1.5-8.7-4.4-11.4-2.9-2.7-6.9-4-12.1-4H35.6zm15.6 9h1.9c1.9 0 3.3.4 4.2 1.3.9.9 1.3 2.3 1.3 4.3v4.2c0 2-.4 3.4-1.3 4.3-.9.9-2.3 1.3-4.2 1.3h-1.9v-15.4zm34.2 21.9h-4.8v-21.9h4.8v21.9zm2.4-27.1c0-.9.3-1.6.8-2.1s1.3-.8 2.2-.8 1.6.3 2.1.8.8 1.2.8 2.1-.3 1.6-.8 2.1-1.3.8-2.2.8-1.6-.3-2.1-.8-.8-1.2-.8-2.1zm31.7 5.2h-4.8v12.2c0 1.5-.3 2.6-.9 3.2-.6.6-1.5 1-2.9 1h-.8V140h1.5c2.7 0 4.7-.7 5.9-2 1.2-1.4 1.8-3.6 1.8-6.6V119zm13.1 11.2c0-3.3.9-5.9 2.8-7.7s4.4-2.7 7.7-2.7h2.8V140h-4.8V124h-.6c-1.4 0-2.5.4-3.2 1.2-.7.8-1.1 2.1-1.1 3.8v11h-4.8v-18.1zm39.1-.1c0-2.8.9-5.1 2.6-6.8 1.8-1.7 4.1-2.5 7-2.5s5.2.8 6.9 2.4c1.7 1.6 2.6 3.9 2.6 6.8v1.6H173v1c0 2 .5 3.5 1.4 4.5.9 1 2.3 1.5 4.1 1.5 2.6 0 4.6-.9 6.2-2.8l2.6 2.9c-2.3 2.8-5.5 4.2-9.5 4.2-3.2 0-5.8-.9-7.7-2.8-1.9-1.9-2.9-4.5-2.9-7.8v-4.9zm14.3-1.6c0-1.6-.4-2.8-1.1-3.6-.7-.8-1.7-1.2-3-1.2s-2.3.4-3 1.2c-.7.8-1.1 2-1.1 3.6v1.6h8.2v-1.6zm22.4-11.7l5.9 14.6 5.9-14.6h5.1l-9 20.9c-1.6 3.7-3.4 6.2-5.4 7.6-2 1.4-4.5 2-7.5 2h-2.1V140h1.1c2 0 3.5-.4 4.5-1.3 1-.9 1.9-2.4 2.6-4.5l.8-2-11.9-23.1h5.1z"/>
                </g>
                <defs>
                  <linearGradient id="a" gradientUnits="userSpaceOnUse" x1="289.4" x2="114.3" y1="56.7" y2="431.8">
                    <stop offset="0" stop-color="#00a0ff"/>
                    <stop offset=".01" stop-color="#00a0ff"/>
                    <stop offset=".26" stop-color="#00c1ff"/>
                    <stop offset=".51" stop-color="#00e1ff"/>
                    <stop offset=".76" stop-color="#00f3ff"/>
                    <stop offset="1" stop-color="#00f7ff"/>
                  </linearGradient>
                </defs>
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* ΕΝΟΤΗΤΑ ΠΡΟΤΥΠΩΝ ΣΧΟΛΕΙΩΝ */}
      <section id="protypa" className="py-16 bg-amber-50 border-b border-amber-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-block bg-amber-200 text-amber-800 font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wide mb-3">
            Ειδική Προετοιμασία
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">🎯 Εισαγωγή στα Πρότυπα Σχολεία</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
            Κάνε τη μετάβαση από την **ΣΤ' Δημοτικού στην Α' Γυμνασίου** με απόλυτη επιτυχία! Εξειδικευμένο υλικό, στρατηγικές και τεστ προσομοίωσης για τις εξετάσεις των Πρότυπων Γυμνασίων.
          </p>
          <div className="bg-white p-6 rounded-2xl shadow-md max-w-xl mx-auto border border-amber-200">
            <h4 className="font-bold text-lg mb-4 text-amber-900">Τι περιλαμβάνει η προετοιμασία:</h4>
            <ul className="text-left space-y-2 text-gray-600 text-sm mb-6">
              <li>✅ Θέματα προηγούμενων ετών αναλυτικά λυμένα.</li>
              <li>✅ Τεχνικές διαχείρισης χρόνου και ερωτήσεων πολλαπλής επιλογής.</li>
              <li>✅ Online Quiz προσομοίωσης με το σύστημα των εξετάσεων.</li>
            </ul>
            <button className="w-full bg-amber-500 text-white py-3 rounded-xl font-bold hover:bg-amber-600 transition shadow-md">
              Έναρξη Προετοιμασίας Προτύπων
            </button>
          </div>
        </div>
      </section>

      {/* ΔΗΜΟΤΙΚΟ SECTION */}
      <section id="demotiko" className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2 text-blue-600">🎒 Μαθηματικά Δημοτικού</h2>
          <p className="text-center text-gray-500 mb-10">Χτίζουμε γερές βάσεις για το μέλλον</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 border border-gray-200">
              <div className="bg-teal-500 py-4 text-center text-white font-bold text-xl">Δ' Δημοτικού</div>
              <div className="p-6 text-center">
                <p className="text-gray-600 mb-6 text-sm">Μεγάλοι αριθμοί, γεωμετρικά σχήματα & βασικές πράξεις.</p>
                <button className="w-full bg-teal-500 text-white py-2 rounded-lg font-medium hover:bg-teal-600 transition">Είσοδος στην Τάξη</button>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 border border-gray-200">
              <div className="bg-cyan-500 py-4 text-center text-white font-bold text-xl">Ε' Δημοτικού</div>
              <div className="p-6 text-center">
                <p className="text-gray-600 mb-6 text-sm">Κλάσματα, δεκαδικοί αριθμοί & εισαγωγή στα ποσοστά.</p>
                <button className="w-full bg-cyan-500 text-white py-2 rounded-lg font-medium hover:bg-cyan-600 transition">Είσοδος στην Τάξη</button>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 border border-gray-200">
              <div className="bg-blue-500 py-4 text-center text-white font-bold text-xl">ΣΤ' Δημοτικού</div>
              <div className="p-6 text-center">
                <p className="text-gray-600 mb-6 text-sm">Ανάλογα ποσά, εξισώσεις, κλίμακες & προετοιμασία για το Γυμνάσιο.</p>
                <button className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition">Είσοδος στην Τάξη</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ΓΥΜΝΑΣΙΟΥ SECTION */}
      <section id="gymnasio" className="py-16 bg-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2 text-indigo-600">📐 Μαθηματικά Γυμνασίου</h2>
          <p className="text-center text-gray-500 mb-10">Εμβαθύνουμε στην άλγεβρα και τη γεωμετρία</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 border border-gray-200">
              <div className="bg-indigo-500 py-4 text-center text-white font-bold text-xl">Α' Γυμνασίου</div>
              <div className="p-6 text-center">
                <p className="text-gray-600 mb-6 text-sm">Κλάσματα, Εξισώσεις, Ποσοστά & βασική Γεωμετρία.</p>
                <button className="w-full bg-indigo-500 text-white py-2 rounded-lg font-medium hover:bg-indigo-600 transition">Είσοδος στην Τάξη</button>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 border border-gray-200">
              <div className="bg-violet-500 py-4 text-center text-white font-bold text-xl">Β' Γυμνασίου</div>
              <div className="p-6 text-center">
                <p className="text-gray-600 mb-6 text-sm">Ρητοί Αριθμοί, Συναρτήσεις, Πυθαγόρειο Θεώρημα.</p>
                <button className="w-full bg-violet-500 text-white py-2 rounded-lg font-medium hover:bg-violet-600 transition">Είσοδος στην Τάξη</button>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 border border-gray-200">
              <div className="bg-purple-500 py-4 text-center text-white font-bold text-xl">Γ' Γυμνασίου</div>
              <div className="p-6 text-center">
                <p className="text-gray-600 mb-6 text-sm">Αλγεβρικές Παραστάσεις, Μονώνυμα, Ταυτότητες & Ομοιότητα.</p>
                <button className="w-full bg-purple-500 text-white py-2 rounded-lg font-medium hover:bg-purple-600 transition">Είσοδος στην Τάξη</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-8 text-center text-sm">
        <p>© {new Date().getFullYear()} LearnMaths.gr. Με ❤️ για τους μαθητές μας.</p>
      </footer>
    </div>
  );
}
