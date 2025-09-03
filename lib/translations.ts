export type Language = {
  code: string
  name: string
  nativeName: string
  translations: {
    // Certificate texts
    title: string
    subtitle: string
    dateTimeLabel: string
    locationLabel: string
    issueLabel: string
    noteLabel: string
    footerText: string
    scanQrText: string
    // Form labels
    selectIssueType: string
    enterLocation: string
    addNote: string
    uploadPhoto: string
    chooseLeaders: string
    generateCertificate: string
    shareOnline: string
  }
}

export const languages: Language[] = [
  {
    code: 'en-hi',
    name: 'English + Hindi',
    nativeName: 'English + हिंदी',
    translations: {
      title: 'Civic Issue Certificate',
      subtitle: 'नागरिक समस्या प्रमाणपत्र',
      dateTimeLabel: 'Date & Time / दिनांक',
      locationLabel: 'Location / स्थान',
      issueLabel: 'Issue',
      noteLabel: 'Note',
      footerText: 'This certificate documents a civic issue reported by a citizen.',
      scanQrText: 'Scan to view report\nरिपोर्ट देखने हेतु स्कैन करें',
      selectIssueType: 'Select Issue Type / समस्या का चयन करें',
      enterLocation: 'Enter Location / स्थान दर्ज करें',
      addNote: 'Add Note (Optional) / नोट जोड़ें (वैकल्पिक)',
      uploadPhoto: 'Upload Photo / फोटो अपलोड करें',
      chooseLeaders: 'Choose Leaders / नेताओं का चयन करें',
      generateCertificate: 'Generate Certificate / प्रमाणपत्र बनाएं',
      shareOnline: 'Share Online / ऑनलाइन साझा करें'
    }
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    translations: {
      title: 'குடிமைப் பிரச்சனை சான்றிதழ்',
      subtitle: 'மக்கள் குரல்',
      dateTimeLabel: 'தேதி & நேரம்',
      locationLabel: 'இடம்',
      issueLabel: 'பிரச்சனை',
      noteLabel: 'குறிப்பு',
      footerText: 'இந்த சான்றிதழ் ஒரு குடிமகனால் புகாரளிக்கப்பட்ட குடிமைப் பிரச்சனையை ஆவணப்படுத்துகிறது.',
      scanQrText: 'அறிக்கையைப் பார்க்க ஸ்கேன் செய்யவும்',
      selectIssueType: 'பிரச்சனை வகையைத் தேர்ந்தெடுக்கவும்',
      enterLocation: 'இடத்தை உள்ளிடவும்',
      addNote: 'குறிப்பு சேர்க்கவும் (விருப்பம்)',
      uploadPhoto: 'புகைப்படத்தை பதிவேற்றவும்',
      chooseLeaders: 'தலைவர்களைத் தேர்ந்தெடுக்கவும்',
      generateCertificate: 'சான்றிதழ் உருவாக்கவும்',
      shareOnline: 'ஆன்லைனில் பகிரவும்'
    }
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    translations: {
      title: 'పౌర సమస్య ధృవీకరణ పత్రం',
      subtitle: 'ప్రజా స్వరం',
      dateTimeLabel: 'తేదీ & సమయం',
      locationLabel: 'ప్రదేశం',
      issueLabel: 'సమస్య',
      noteLabel: 'గమనిక',
      footerText: 'ఈ ధృవీకరణ పత్రం ఒక పౌరుడు నివేదించిన పౌర సమస్యను దస్తావేజు చేస్తుంది.',
      scanQrText: 'నివేదికను చూడటానికి స్కాన్ చేయండి',
      selectIssueType: 'సమస్య రకాన్ని ఎంచుకోండి',
      enterLocation: 'ప్రదేశాన్ని నమోదు చేయండి',
      addNote: 'గమనికను జోడించండి (ఐచ్ఛికం)',
      uploadPhoto: 'ఫోటోను అప్‌లోడ్ చేయండి',
      chooseLeaders: 'నాయకులను ఎంచుకోండి',
      generateCertificate: 'ధృవీకరణ పత్రాన్ని సృష్టించండి',
      shareOnline: 'ఆన్‌లైన్‌లో షేర్ చేయండి'
    }
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    translations: {
      title: 'নাগরিক সমস্যা সনদপত্র',
      subtitle: 'জনগণের কণ্ঠস্বর',
      dateTimeLabel: 'তারিখ ও সময়',
      locationLabel: 'স্থান',
      issueLabel: 'সমস্যা',
      noteLabel: 'নোট',
      footerText: 'এই সনদপত্রটি একজন নাগরিকের দ্বারা রিপোর্ট করা একটি নাগরিক সমস্যার দলিল।',
      scanQrText: 'রিপোর্ট দেখতে স্ক্যান করুন',
      selectIssueType: 'সমস্যার ধরন নির্বাচন করুন',
      enterLocation: 'স্থান লিখুন',
      addNote: 'নোট যোগ করুন (ঐচ্ছিক)',
      uploadPhoto: 'ছবি আপলোড করুন',
      chooseLeaders: 'নেতাদের বেছে নিন',
      generateCertificate: 'সনদপত্র তৈরি করুন',
      shareOnline: 'অনলাইনে শেয়ার করুন'
    }
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    translations: {
      title: 'नागरी समस्या प्रमाणपत्र',
      subtitle: 'लोकांचा आवाज',
      dateTimeLabel: 'दिनांक आणि वेळ',
      locationLabel: 'स्थान',
      issueLabel: 'समस्या',
      noteLabel: 'टीप',
      footerText: 'हे प्रमाणपत्र एका नागरिकाने नोंदवलेल्या नागरी समस्येचे दस्तऐवजीकरण करते.',
      scanQrText: 'अहवाल पाहण्यासाठी स्कॅन करा',
      selectIssueType: 'समस्येचा प्रकार निवडा',
      enterLocation: 'स्थान प्रविष्ट करा',
      addNote: 'टीप जोडा (पर्यायी)',
      uploadPhoto: 'फोटो अपलोड करा',
      chooseLeaders: 'नेते निवडा',
      generateCertificate: 'प्रमाणपत्र तयार करा',
      shareOnline: 'ऑनलाईन शेअर करा'
    }
  }
]
