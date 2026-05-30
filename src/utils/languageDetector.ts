export interface Language {
  code: string;
  name: string;
  nativeName: string;
  patterns: RegExp[];
}

export const supportedLanguages: Language[] = [
  // English
  { 
    code: 'en', 
    name: 'English', 
    nativeName: 'English',
    patterns: [
      /\b(the|and|or|but|in|on|at|to|for|of|with|by)\b/gi,
      /\b(write|create|make|help|please|can|you|me|my|I|am|is|are)\b/gi
    ]
  },

  // INDIAN LANGUAGES - Official Languages
  { 
    code: 'hi', 
    name: 'Hindi', 
    nativeName: 'हिंदी',
    patterns: [
      /[\u0900-\u097F]/g, // Devanagari script
      /\b(और|या|लेकिन|में|पर|के|लिए|से|का|की|है|हैं|मैं|आप|मेरे|लिए|एक|की|बारे|में|जॉइनिंग|लेटर|ईमेल|लिखो|करो|हो|गया|गई|गए|थी|था|थे|हूं|है|हैं)\b/gi
    ]
  },
  { 
    code: 'gu', 
    name: 'Gujarati', 
    nativeName: 'ગુજરાતી',
    patterns: [
      /[\u0A80-\u0AFF]/g, // Gujarati script
      /\b(અને|કે|પણ|માં|પર|માટે|થી|નો|ની|છે|છું|હું|તમે|મારા|માટે|એક|ની|વિશે|માં|જોઇનિંગ|લેટર|ઈમેલ|લખો|કરો|છે|ગયું|ગયા|ગયા|હતું|હતા|હતા|છું|છે|છે)\b/gi
    ]
  },
  { 
    code: 'bn', 
    name: 'Bengali', 
    nativeName: 'বাংলা',
    patterns: [
      /[\u0980-\u09FF]/g, // Bengali script
      /\b(এবং|বা|কিন্তু|এ|এ|থেকে|ক|এ|আমি|তুমি|আপনি|আমার|তোমার|আপনার|হয়|হয়|হয়|কর|করো|করুন)\b/gi
    ]
  },
  { 
    code: 'te', 
    name: 'Telugu', 
    nativeName: 'తెలుగు',
    patterns: [
      /[\u0C00-\u0C7F]/g, // Telugu script
      /\b(మరియు|లేదా|కానీ|లో|పై|కు|కోసం|నుండి|అతను|ఆమె|నేను|మీరు|నా|మీ|అవుతుంది|చేయండి|రాయండి)\b/gi
    ]
  },
  { 
    code: 'mr', 
    name: 'Marathi', 
    nativeName: 'मराठी',
    patterns: [
      /[\u0900-\u097F]/g, // Devanagari script
      /\b(आणि|किंवा|पण|मध्ये|वर|साठी|पासून|तो|ती|मी|तुम्ही|माझा|तुमचा|आहे|करा|लिहा)\b/gi
    ]
  },
  { 
    code: 'ta', 
    name: 'Tamil', 
    nativeName: 'தமிழ்',
    patterns: [
      /[\u0B80-\u0BFF]/g, // Tamil script
      /\b(மற்றும்|அல்லது|ஆனால்|இல்|மீது|க்கு|இருந்து|அவன்|அவள்|நான்|நீங்கள்|என்|உங்கள்|ஆகும்|செய்|எழுது)\b/gi
    ]
  },
  { 
    code: 'ur', 
    name: 'Urdu', 
    nativeName: 'اردو',
    patterns: [
      /[\u0600-\u06FF\u0750-\u077F]/g, // Arabic script + extensions
      /\b(اور|یا|لیکن|میں|پر|کے|لیے|سے|وہ|وہ|میں|آپ|میرا|آپ|ہے|کرو|لکھو)\b/gi
    ]
  },
  { 
    code: 'kn', 
    name: 'Kannada', 
    nativeName: 'ಕನ್ನಡ',
    patterns: [
      /[\u0C80-\u0CFF]/g, // Kannada script
      /\b(ಮತ್ತು|ಅಥವಾ|ಆದರೆ|ಇನ್|ಆನ್|ಗೆ|ಇಂದ|ಅವನು|ಅವಳು|ನಾನು|ನೀವು|ನನ್ನ|ನಿಮ್ಮ|ಆಗುತ್ತದೆ|ಮಾಡಿ|ಬರೆಯಿರಿ)\b/gi
    ]
  },
  { 
    code: 'ml', 
    name: 'Malayalam', 
    nativeName: 'മലയാളം',
    patterns: [
      /[\u0D00-\u0D7F]/g, // Malayalam script
      /\b(കൂടാതെ|അല്ലെങ്കിൽ|പക്ഷേ|ഇൽ|ഓൺ|എന്ന്|ഇൽനിന്ന്|അവൻ|അവൾ|ഞാൻ|നിങ്ങൾ|എന്റെ|നിങ്ങളുടെ|ആണ്|ചെയ്യുക|എഴുതുക)\b/gi
    ]
  },
  { 
    code: 'or', 
    name: 'Odia', 
    nativeName: 'ଓଡ଼ିଆ',
    patterns: [
      /[\u0B00-\u0B7F]/g, // Odia script
      /\b(ଏବଂ|କିମ୍ବା|କିନ୍ତୁ|ରେ|ଉପରେ|କୁ|ପାଇଁ|ଠାରୁ|ସେ|ସେ|ମୁଁ|ତୁମେ|ମୋର|ତୁମର|ଅଟେ|କର|ଲେଖ)\b/gi
    ]
  },
  { 
    code: 'as', 
    name: 'Assamese', 
    nativeName: 'অসমীয়া',
    patterns: [
      /[\u0980-\u09FF]/g, // Assamese script (similar to Bengali)
      /\b(আৰু|বা|কিন্তু|ত|উপৰত|লৈ|পৰা|সি|সি|মই|আপুনি|মোৰ|আপোনাৰ|হয়|কৰ|লিখ)\b/gi
    ]
  },
  { 
    code: 'pa', 
    name: 'Punjabi', 
    nativeName: 'ਪੰਜਾਬੀ',
    patterns: [
      /[\u0A00-\u0A7F]/g, // Gurmukhi script
      /\b(ਅਤੇ|ਜਾਂ|ਪਰ|ਵਿਚ|ਤੇ|ਲਈ|ਤੋਂ|ਉਹ|ਉਹ|ਮੈਂ|ਤੁਸੀਂ|ਮੇਰਾ|ਤੁਹਾਡਾ|ਹੈ|ਕਰੋ|ਲਿਖੋ)\b/gi
    ]
  },

  // EUROPEAN LANGUAGES
  { 
    code: 'es', 
    name: 'Spanish', 
    nativeName: 'Español',
    patterns: [
      /\b(el|la|los|las|y|o|pero|en|de|a|por|para|con|sin|que|es|son|soy|eres)\b/gi,
      /\b(escribir|crear|hacer|ayudar|por favor|puedes|me|mi|yo|soy|es|son)\b/gi
    ]
  },
  { 
    code: 'fr', 
    name: 'French', 
    nativeName: 'Français',
    patterns: [
      /\b(le|la|les|et|ou|mais|dans|sur|à|pour|de|avec|par|que|est|sont|je|tu|il|elle)\b/gi,
      /\b(écrire|créer|faire|aider|s'il vous plaît|pouvez|me|mon|ma|je|suis|est|sont)\b/gi
    ]
  },
  { 
    code: 'de', 
    name: 'German', 
    nativeName: 'Deutsch',
    patterns: [
      /\b(der|die|das|und|oder|aber|in|auf|zu|für|von|mit|bei|ist|sind|ich|du|er|sie)\b/gi,
      /\b(schreiben|erstellen|machen|helfen|bitte|können|mir|mein|meine|ich|bin|ist|sind)\b/gi
    ]
  },
  { 
    code: 'it', 
    name: 'Italian', 
    nativeName: 'Italiano',
    patterns: [
      /\b(il|la|lo|gli|le|e|o|ma|in|su|a|per|di|con|da|che|è|sono|io|tu|lui|lei)\b/gi,
      /\b(scrivere|creare|fare|aiutare|per favore|puoi|me|mio|mia|io|sono|è|sono)\b/gi
    ]
  },
  { 
    code: 'pt', 
    name: 'Portuguese', 
    nativeName: 'Português',
    patterns: [
      /\b(o|a|os|as|e|ou|mas|em|no|na|para|de|com|por|que|é|são|eu|você|ele|ela)\b/gi,
      /\b(escrever|criar|fazer|ajudar|por favor|pode|me|meu|minha|eu|sou|é|são)\b/gi
    ]
  },
  { 
    code: 'ru', 
    name: 'Russian', 
    nativeName: 'Русский',
    patterns: [
      /[\u0400-\u04FF]/g, // Cyrillic script
      /\b(и|или|но|в|на|к|для|от|с|по|что|это|есть|я|ты|он|она)\b/gi
    ]
  },
  { 
    code: 'nl', 
    name: 'Dutch', 
    nativeName: 'Nederlands',
    patterns: [
      /\b(de|het|en|of|maar|in|op|naar|voor|van|met|zijn|ik|jij|hij|zij)\b/gi,
      /\b(schrijven|maken|helpen|alsjeblieft|kun|me|mijn|ik|ben|is|zijn)\b/gi
    ]
  },
  { 
    code: 'sv', 
    name: 'Swedish', 
    nativeName: 'Svenska',
    patterns: [
      /\b(och|eller|men|i|på|till|för|från|med|är|jag|du|han|hon)\b/gi,
      /\b(skriva|göra|hjälpa|snälla|kan|mig|min|jag|är|är|är)\b/gi
    ]
  },
  { 
    code: 'no', 
    name: 'Norwegian', 
    nativeName: 'Norsk',
    patterns: [
      /\b(og|eller|men|i|på|til|for|fra|med|er|jeg|du|han|hun)\b/gi,
      /\b(skrive|gjøre|hjelpe|vennligst|kan|meg|min|jeg|er|er|er)\b/gi
    ]
  },
  { 
    code: 'da', 
    name: 'Danish', 
    nativeName: 'Dansk',
    patterns: [
      /\b(og|eller|men|i|på|til|for|fra|med|er|jeg|du|han|hun)\b/gi,
      /\b(skrive|gøre|hjælpe|venligst|kan|mig|min|jeg|er|er|er)\b/gi
    ]
  },

  // ASIAN LANGUAGES
  { 
    code: 'zh', 
    name: 'Chinese', 
    nativeName: '中文',
    patterns: [
      /[\u4E00-\u9FFF]/g, // Chinese characters
      /\b(和|或|但|在|上|到|为|从|与|是|我|你|他|她)\b/gi
    ]
  },
  { 
    code: 'ja', 
    name: 'Japanese', 
    nativeName: '日本語',
    patterns: [
      /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, // Hiragana, Katakana, Kanji
      /\b(と|や|でも|に|で|を|が|は|の|です|である|私|あなた|彼|彼女)\b/gi
    ]
  },
  { 
    code: 'ko', 
    name: 'Korean', 
    nativeName: '한국어',
    patterns: [
      /[\uAC00-\uD7AF]/g, // Hangul
      /\b(그리고|또는|하지만|에|에서|를|가|는|의|입니다|이다|나|당신|그|그녀)\b/gi
    ]
  },
  { 
    code: 'th', 
    name: 'Thai', 
    nativeName: 'ไทย',
    patterns: [
      /[\u0E00-\u0E7F]/g, // Thai script
      /\b(และ|หรือ|แต่|ใน|บน|ถึง|สำหรับ|จาก|กับ|เป็น|ฉัน|คุณ|เขา|เธอ)\b/gi
    ]
  },
  { 
    code: 'vi', 
    name: 'Vietnamese', 
    nativeName: 'Tiếng Việt',
    patterns: [
      /\b(và|hoặc|nhưng|trong|trên|đến|cho|từ|với|là|tôi|bạn|anh|chị)\b/gi,
      /\b(viết|tạo|làm|giúp|xin|bạn|có|tôi|của|tôi|là|viết)\b/gi
    ]
  },
  { 
    code: 'id', 
    name: 'Indonesian', 
    nativeName: 'Bahasa Indonesia',
    patterns: [
      /\b(dan|atau|tetapi|di|pada|ke|untuk|dari|dengan|adalah|saya|anda|dia|dia)\b/gi,
      /\b(menulis|membuat|membantu|tolong|bisa|saya|saya|saya|adalah|adalah|adalah)\b/gi
    ]
  },
  { 
    code: 'ms', 
    name: 'Malay', 
    nativeName: 'Bahasa Melayu',
    patterns: [
      /\b(dan|atau|tetapi|di|pada|ke|untuk|dari|dengan|adalah|saya|anda|dia|dia)\b/gi,
      /\b(menulis|membuat|membantu|tolong|boleh|saya|saya|saya|adalah|adalah|adalah)\b/gi
    ]
  },

  // MIDDLE EASTERN & AFRICAN LANGUAGES
  { 
    code: 'ar', 
    name: 'Arabic', 
    nativeName: 'العربية',
    patterns: [
      /[\u0600-\u06FF]/g, // Arabic script
      /\b(و|أو|لكن|في|على|إلى|من|مع|عن|هو|هي|أنا|أنت)\b/gi
    ]
  },
  { 
    code: 'fa', 
    name: 'Persian', 
    nativeName: 'فارسی',
    patterns: [
      /[\u0600-\u06FF\u0750-\u077F]/g, // Persian script
      /\b(و|یا|اما|در|روی|به|برای|از|با|است|من|شما|او|او)\b/gi
    ]
  },
  { 
    code: 'tr', 
    name: 'Turkish', 
    nativeName: 'Türkçe',
    patterns: [
      /\b(ve|veya|ama|içinde|üzerinde|için|için|ile|ben|sen|o|o)\b/gi,
      /\b(yazmak|yapmak|yardım|lütfen|yapabilir|ben|benim|ben|ben|yaz)\b/gi
    ]
  },
  { 
    code: 'he', 
    name: 'Hebrew', 
    nativeName: 'עברית',
    patterns: [
      /[\u0590-\u05FF]/g, // Hebrew script
      /\b(ו|או|אבל|ב|על|ל|עבור|מ|עם|הוא|היא|אני|אתה)\b/gi
    ]
  },
  { 
    code: 'sw', 
    name: 'Swahili', 
    nativeName: 'Kiswahili',
    patterns: [
      /\b(na|au|lakini|katika|juu|kwa|kutoka|na|ni|mimi|wewe|yeye|yeye)\b/gi,
      /\b(kuandika|kufanya|kusaidia|tafadhali|unaweza|mimi|yangu|mimi|mimi|andika)\b/gi
    ]
  },

  // SOUTH ASIAN LANGUAGES
  { 
    code: 'ne', 
    name: 'Nepali', 
    nativeName: 'नेपाली',
    patterns: [
      /[\u0900-\u097F]/g, // Devanagari script
      /\b(र|वा|तर|मा|मान्छे|गर्न|लेख्न|सक्छ|छ|छु|हो|हुन्छ|म|तपाईं|उहाँ|उनी)\b/gi
    ]
  },
  { 
    code: 'si', 
    name: 'Sinhala', 
    nativeName: 'සිංහල',
    patterns: [
      /[\u0D80-\u0DFF]/g, // Sinhala script
      /\b(සහ|හෝ|නමුත්|හි|මත|සඳහා|සිට|ඔහු|ඇය|මම|ඔබ|මගේ|ඔබේ|වේ|කරන්න|ලියන්න)\b/gi
    ]
  },
  { 
    code: 'my', 
    name: 'Burmese', 
    nativeName: 'မြန်မာ',
    patterns: [
      /[\u1000-\u109F]/g, // Myanmar script
      /\b(နှင့်|သို့မဟုတ်|သို့သော်|တွင်|ပေါ်|အတွက်|မှ|သူ|သူမ|ကျွန်ုပ်|သင်|ကျွန်ုပ်၏|သင်၏|ဖြစ်|လုပ်|ရေး)\b/gi
    ]
  },

  // SOUTHEAST ASIAN LANGUAGES
  { 
    code: 'tl', 
    name: 'Filipino', 
    nativeName: 'Filipino',
    patterns: [
      /\b(at|o|ngunit|sa|sa|para|mula|siya|siya|ako|ikaw|aking|inyong|ay|gawin|sumulat)\b/gi,
      /\b(kumusta|salamat|opo|hindi|oo|mahal|pamilya|trabaho|sulat|email|liham)\b/gi
    ]
  },
  { 
    code: 'km', 
    name: 'Khmer', 
    nativeName: 'ខ្មែរ',
    patterns: [
      /[\u1780-\u17FF]/g, // Khmer script
      /\b(និង|ឬ|ប៉ុន្តែ|នៅ|លើ|សម្រាប់|ពី|គាត់|នាង|ខ្ញុំ|អ្នក|របស់ខ្ញុំ|របស់អ្នក|គឺ|ធ្វើ|សរសេរ)\b/gi
    ]
  },
  { 
    code: 'lo', 
    name: 'Lao', 
    nativeName: 'ລາວ',
    patterns: [
      /[\u0E80-\u0EFF]/g, // Lao script
      /\b(ແລະ|ຫຼື|ແຕ່|ໃນ|ເທິງ|ສໍາລັບ|ຈາກ|ລາວ|ນາງ|ຂ້ອຍ|ເຈົ້າ|ຂອງຂ້ອຍ|ຂອງເຈົ້າ|ແມ່ນ|ເຮັດ|ຂຽນ)\b/gi
    ]
  },

  // AFRICAN LANGUAGES
  { 
    code: 'am', 
    name: 'Amharic', 
    nativeName: 'አማርኛ',
    patterns: [
      /[\u1200-\u137F]/g, // Ethiopic script
      /\b(እና|ወይም|ግን|በ|ላይ|ለ|ከ|እሱ|እሷ|እኔ|አንተ|የእኔ|የአንተ|ነው|አድርግ|ጻፍ)\b/gi
    ]
  },
  { 
    code: 'ha', 
    name: 'Hausa', 
    nativeName: 'Hausa',
    patterns: [
      /\b(da|amma|akan|daga|shi|ita|kai|nawa|naka|yi|rubuta|sannu|na gode|barka|aiki|wasiqa|taimaka)\b/gi
    ]
  },
  { 
    code: 'yo', 
    name: 'Yoruba', 
    nativeName: 'Yorùbá',
    patterns: [
      /\b(ati|tabi|sugbon|lori|fun|lati|emi|iwo|se|bawo|e se|ise|iwe|iran|ranlo)\b/gi
    ]
  },
  { 
    code: 'zu', 
    name: 'Zulu', 
    nativeName: 'isiZulu',
    patterns: [
      /\b(ne|noma|kodwa|ku|phezu|kwe|kusuka|yena|yena|mina|wena|ami|akho|ngu|yenza|bhala)\b/gi,
      /\b(sawubona|ngiyabonga|umsebenzi|incwadi|bhala|siza)\b/gi
    ]
  },
  { 
    code: 'xh', 
    name: 'Xhosa', 
    nativeName: 'isiXhosa',
    patterns: [
      /\b(ne|okanye|kodwa|ku|ngaphezu|kwe|ukusuka|yena|yena|ndim|uyena|yam|yakho|ngu|yenza|bhala)\b/gi,
      /\b(molo|enkosi|umsebenzi|ileta|email|bhala|nceda)\b/gi
    ]
  },

  // NATIVE AMERICAN LANGUAGES
  { 
    code: 'nv', 
    name: 'Navajo', 
    nativeName: 'Diné bizaad',
    patterns: [
      /\b(dóó|éí|ndi|bikáa'gi|biniinaa|bee|bits'ą́ą́dóó|áko|áadi|shi|ni|bi|bí|át'é|yásh|yoo')\b/gi
    ]
  },

  // CONSTRUCTED/AUXILIARY LANGUAGES  
  { 
    code: 'eo', 
    name: 'Esperanto', 
    nativeName: 'Esperanto',
    patterns: [
      /\b(kaj|aŭ|sed|en|sur|al|por|de|li|ŝi|mi|vi|mia|via|estas|fari|skribi)\b/gi,
      /\b(saluton|dankon|laboron|letero|retpoŝto|skribi|helpi)\b/gi
    ]
  },

  // OTHER MAJOR LANGUAGES
  { 
    code: 'pl', 
    name: 'Polish', 
    nativeName: 'Polski',
    patterns: [
      /\b(i|albo|ale|w|na|do|dla|od|z|jest|ja|ty|on|ona)\b/gi,
      /\b(pisać|robić|pomagać|proszę|możesz|mnie|mój|ja|jest|jest|jest)\b/gi
    ]
  },
  { 
    code: 'cs', 
    name: 'Czech', 
    nativeName: 'Čeština',
    patterns: [
      /\b(a|nebo|ale|v|na|do|pro|od|s|je|já|ty|on|ona)\b/gi,
      /\b(psát|dělat|pomáhat|prosím|můžeš|mě|můj|já|jsem|je|je)\b/gi
    ]
  },
  { 
    code: 'hu', 
    name: 'Hungarian', 
    nativeName: 'Magyar',
    patterns: [
      /\b(és|vagy|de|ban|on|hoz|ért|tól|val|én|te|ő|ő)\b/gi,
      /\b(írni|csinálni|segíteni|kérem|tudsz|engem|én|én|én|ír)\b/gi
    ]
  },
  { 
    code: 'fi', 
    name: 'Finnish', 
    nativeName: 'Suomi',
    patterns: [
      /\b(ja|tai|mutta|ssa|lla|lle|varten|sta|kanssa|on|minä|sinä|hän|hän)\b/gi,
      /\b(kirjoittaa|tehdä|auttaa|ole hyvä|voit|minua|minun|minä|olen|on|on)\b/gi
    ]
  },
  { 
    code: 'el', 
    name: 'Greek', 
    nativeName: 'Ελληνικά',
    patterns: [
      /[\u0370-\u03FF]/g, // Greek script
      /\b(και|ή|αλλά|σε|πάνω|για|από|με|είμαι|εγώ|εσύ|αυτός|αυτή)\b/gi
    ]
  },
  { 
    code: 'uk', 
    name: 'Ukrainian', 
    nativeName: 'Українська',
    patterns: [
      /[\u0400-\u04FF]/g, // Cyrillic script
      /\b(і|або|але|в|на|до|для|від|з|є|я|ти|він|вона)\b/gi
    ]
  },
  { 
    code: 'ro', 
    name: 'Romanian', 
    nativeName: 'Română',
    patterns: [
      /\b(și|sau|dar|în|pe|la|pentru|de|cu|este|eu|tu|el|ea)\b/gi,
      /\b(scrie|face|ajuta|te rog|poți|mă|al meu|eu|sunt|este|este)\b/gi
    ]
  },
  { 
    code: 'bg', 
    name: 'Bulgarian', 
    nativeName: 'Български',
    patterns: [
      /[\u0400-\u04FF]/g, // Cyrillic script
      /\b(и|или|но|в|на|до|за|от|с|е|аз|ти|той|тя)\b/gi
    ]
  }
];

const NON_LATIN_SCRIPT =
  /[\u0900-\u097F\u0980-\u09FF\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0600-\u06FF\u0750-\u077F\u0590-\u05FF\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF\u0400-\u04FF\u0370-\u03FF\u1200-\u137F\u1000-\u109F\u1780-\u17FF\u0E00-\u0E7F]/;

const ENGLISH_MARKER =
  /\b(the|and|or|but|a|an|to|for|of|in|on|at|with|by|is|are|was|were|be|been|have|has|had|do|does|did|will|would|can|could|should|may|might|must|write|email|job|please|help|create|make|you|me|my|I|we|they|this|that|from|your|our|their)\b/gi;

function scoreLanguagePatterns(text: string, lang: Language): number {
  return lang.patterns.reduce((total, pattern) => {
    const matches = text.match(pattern);
    return total + (matches?.length ?? 0);
  }, 0);
}

function isMostlyLatinScript(text: string): boolean {
  const letters = text.match(/\p{L}/gu);
  if (!letters?.length) return true;
  const latinLetters = text.match(/[A-Za-z]/g);
  return (latinLetters?.length ?? 0) / letters.length >= 0.85;
}

/** Conservative detection for grammar/input — defaults to English for Latin-script English-like text. */
export function detectInputLanguage(text: string): Language {
  return detectLanguage(text);
}

export function isClearlyEnglish(text: string): boolean {
  return detectInputLanguage(text).code === 'en';
}

export function detectLanguage(text: string): Language {
  const english = getLanguageByCode('en');

  if (!text || text.trim().length === 0) {
    return english;
  }

  if (NON_LATIN_SCRIPT.test(text)) {
    let detected = english;
    let maxScore = 0;
    for (const lang of supportedLanguages) {
      if (lang.code === 'en') continue;
      const score = scoreLanguagePatterns(text, lang);
      if (score > maxScore) {
        maxScore = score;
        detected = lang;
      }
    }
    return maxScore > 0 ? detected : english;
  }

  if (isMostlyLatinScript(text)) {
    let englishScore = scoreLanguagePatterns(text, english);
    const markerHits = text.match(ENGLISH_MARKER);
    if (markerHits) {
      englishScore += markerHits.length * 2;
    }

    let best = english;
    let bestScore = englishScore;

    for (const lang of supportedLanguages) {
      if (lang.code === 'en') continue;
      const score = scoreLanguagePatterns(text, lang);
      if (score > bestScore && score >= englishScore + 3 && score >= 4) {
        bestScore = score;
        best = lang;
      }
    }

    return best;
  }

  let detectedLang = english;
  let maxScore = scoreLanguagePatterns(text, english);

  for (const lang of supportedLanguages) {
    const score = scoreLanguagePatterns(text, lang);
    if (score > maxScore) {
      maxScore = score;
      detectedLang = lang;
    }
  }

  return detectedLang;
}

export function getLanguageByCode(code: string): Language {
  return supportedLanguages.find((lang) => lang.code === code) ?? supportedLanguages[0];
}

export function getLanguageInstructions(language: Language): string {
  const instructions: { [key: string]: string } = {
    // English
    en: "Respond in English with professional, clear communication.",
    // Indian Languages
    hi: "हिंदी में उत्तर दें। व्यावसायिक और स्पष्ट भाषा का उपयोग करें।",
    gu: "ગુજરાતીમાં જવાબ આપો। વ્યાવસાયિક અને સ્પષ્ટ ભાષાનો ઉપયોગ કરો।",
    bn: "বাংলায় উত্তর দিন। পেশাদার এবং স্পষ্ট ভাষা ব্যবহার করুন।",
    te: "తెలుగులో జవాబు ఇవ్వండి। వృత్తిపరమైన మరియు స్పష్టమైన భాషను ఉపయోగించండి।",
    mr: "मराठीत उत्तर द्या। व्यावसायिक आणि स्पष्ट भाषा वापरा।",
    ta: "தமிழில் பதிலளிக்கவும்। தொழில்முறை மற்றும் தெளிவான மொழியைப் பயன்படுத்தவும்।",
    ur: "اردو میں جواب دیں۔ پیشہ ورانہ اور واضح زبان استعمال کریں۔",
    kn: "ಕನ್ನಡದಲ್ಲಿ ಉತ್ತರಿಸಿ। ವೃತ್ತಿಪರ ಮತ್ತು ಸ್ಪಷ್ಟ ಭಾಷೆಯನ್ನು ಬಳಸಿ।",
    ml: "മലയാളത്തിൽ ഉത്തരിക്കുക। പ്രൊഫഷണൽ, വ്യക്തമായ ഭാഷ ഉപയോഗിക്കുക।",
    or: "ଓଡ଼ିଆରେ ଉତ୍ତର ଦିଅନ୍ତୁ। ବୃତ୍ତିଗତ ଏବଂ ସ୍ପଷ୍ଟ ଭାଷା ବ୍ୟବହାର କରନ୍ତୁ।",
    as: "অসমীয়াত উত্তৰ দিয়ক। পেছাদাৰী আৰু স্পষ্ট ভাষা ব্যৱহাৰ কৰক।",
    pa: "ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦਿਓ। ਪੇਸ਼ੇਵਰ ਅਤੇ ਸਪਸ਼ਟ ਭਾਸ਼ਾ ਦੀ ਵਰਤੋਂ ਕਰੋ।",
    
    // European Languages
    es: "Responde en español con comunicación profesional y clara.",
    fr: "Répondez en français avec une communication professionnelle et claire.",
    de: "Antworten Sie auf Deutsch mit professioneller und klarer Kommunikation.",
    it: "Rispondi in italiano con comunicazione professionale e chiara.",
    pt: "Responda em português com comunicação profissional e clara.",
    ru: "Отвечайте на русском языке профессионально и ясно.",
    nl: "Antwoord in het Nederlands met professionele en duidelijke communicatie.",
    sv: "Svara på svenska med professionell och tydlig kommunikation.",
    no: "Svar på norsk med profesjonell og tydelig kommunikasjon.",
    da: "Svar på dansk med professionel og klar kommunikation.",
    pl: "Odpowiedz po polsku w sposób profesjonalny i jasny.",
    cs: "Odpovězte v češtině profesionálně a jasně.",
    hu: "Válaszolj magyarul professzionális és világos kommunikációval.",
    fi: "Vastaa suomeksi ammattimaisesti ja selkeästi.",
    el: "Απαντήστε στα ελληνικά με επαγγελματική και σαφή επικοινωνία.",
    uk: "Відповідайте українською мовою професійно та ясно.",
    ro: "Răspundeți în română cu comunicare profesională și clară.",
    bg: "Отговорете на български език професионално и ясно.",
    
    // Asian Languages
    zh: "用中文回答，使用专业和清晰的沟通。",
    ja: "日本語で専門的で明確なコミュニケーションで回答してください。",
    ko: "전문적이고 명확한 의사소통으로 한국어로 답변하세요.",
    th: "ตอบเป็นภาษาไทยด้วยการสื่อสารที่มืออาชีพและชัดเจน",
    vi: "Trả lời bằng tiếng Việt với giao tiếp chuyên nghiệp và rõ ràng.",
    id: "Jawab dalam bahasa Indonesia dengan komunikasi yang profesional dan jelas.",
    ms: "Jawab dalam bahasa Melayu dengan komunikasi yang profesional dan jelas.",
    
    // South Asian Languages
    ne: "नेपालीमा जवाफ दिनुहोस्। व्यावसायिक र स्पष्ट भाषाको प्रयोग गर्नुहोस्।",
    si: "සිංහලෙන් පිළිතුරු දෙන්න. වෘත්තීය හා පැහැදිලි භාෂාවක් භාවිතා කරන්න.",
    my: "မြန်မာဘာသာဖြင့် ဖြေကြားပါ။ ပရော်ဖက်ရှင်နယ်နှင့် ရှင်းလင်းသော ဆက်သွယ်မှုကို အသုံးပြုပါ။",

    // Southeast Asian Languages
    tl: "Sumagot sa Filipino na may propesyonal at malinaw na komunikasyon.",
    km: "ឆ្លើយជាភាសាខ្មែរដោយប្រើការប្រាស្រ័យទាក់ទងដ៏វិជ្ជាជីវៈនិងច្បាស់លាស់។",
    lo: "ຕອບເປັນພາສາລາວດ້ວຍການສື່ສານທີ່ເປັນມືອາຊີບແລະຊັດເຈນ.",

    // African Languages  
    am: "በአማርኛ በሙያዊ እና ግልጽ በሆነ መልኩ መልስ ይስጡ።",
    ha: "Ka amsa da Hausa tare da sadarwa ta ƙwararru da bayyana.",
    yo: "Dahun ni Yoruba pelu ibaraenisepo ti o ni ogbon ati kedere.",
    zu: "Phendula ngesiZulu ngokuxhumana obuchwepheshe nobucacile.",
    xh: "Phendula ngesiXhosa ngonxibelelwano lobugcisa olucacileyo.",

    // Native American Languages
    nv: "Diné bizaad bee hane' áníłtsoh dóó t'áá hó áłtsoh.",

    // Constructed Languages
    eo: "Respondu en Esperanto kun profesia kaj klara komunikado.",

    // Middle Eastern & African Languages
    ar: "أجب باللغة العربية بتواصل مهني وواضح.",
    fa: "به فارسی با ارتباط حرفه‌ای و واضح پاسخ دهید.",
    tr: "Türkçe olarak profesyonel ve net iletişimle cevaplayın.",
    he: "ענה בעברית עם תקשורת מקצועית וברורה.",
    sw: "Jibu kwa Kiswahili na mawasiliano ya kitaaluma na ya wazi."
  };

  return instructions[language.code] || instructions.en;
}