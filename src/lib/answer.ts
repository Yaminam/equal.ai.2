/*
  A small, honest matcher. This runs offline in the browser on a handful of
  rules. It is not the model that ships in the app, and the page says so.
  It exists because the fastest way to believe an assistant is to say something
  to it and watch it hold its ground.
*/

export type Verdict = "blocked" | "declined" | "sorted" | "rang" | "screened" | "noted";

export type Answer = {
  reply: string;
  verdict: Verdict;
  outcome: string;
};

type Tongue = "en" | "hinglish" | "hindi";

const DEVANAGARI = /[ऀ-ॿ]/;
const HINGLISH = /\b(aap|hai|hain|nahi|nahin|kar|karo|kya|mera|meri|bhai|sahab|sir ji|beta|aunty|ghar|paisa|bata|dijiye|chhod|gate|thik|theek|acha|namaste)\b/i;

function tongue(text: string): Tongue {
  if (DEVANAGARI.test(text)) return "hindi";
  if (HINGLISH.test(text)) return "hinglish";
  return "en";
}

const RULES: { test: RegExp; verdict: Verdict; outcome: string; say: Record<Tongue, string> }[] = [
  {
    test: /\b(otp|o\.t\.p|kyc|one time password|six digit|verification code|verify your account)\b|ओटीपी|केवाईसी/i,
    verdict: "blocked",
    outcome: "Scam blocked, number reported",
    say: {
      en: "I never share OTPs, and no genuine bank asks for one on a call. I am ending this and reporting the number to the cybercrime helpline.",
      hinglish: "OTP kabhi share nahi karunga. Koi asli bank call par OTP nahi maangta. Main yeh number cybercrime ko report kar raha hoon.",
      hindi: "मैं OTP कभी साझा नहीं करूँगा। कोई असली बैंक फ़ोन पर OTP नहीं माँगता। मैं यह नंबर साइबरक्राइम को रिपोर्ट कर रहा हूँ।",
    },
  },
  {
    test: /\b(loan|credit card|pre.?approved|insurance|policy|scheme|cashback|offer|upgrade|limited time|investment|trading tips)\b|लोन|बीमा|ऑफर/i,
    verdict: "declined",
    outcome: "Declined politely",
    say: {
      en: "He is not looking for one, and he decides these things himself. Please take this number off your list. Thank you for calling.",
      hinglish: "Unhe iski zaroorat nahi hai, aur woh khud decide karte hain. Kripya yeh number apni list se hata dijiye. Dhanyavaad.",
      hindi: "उन्हें इसकी ज़रूरत नहीं है, और वे ख़ुद तय करते हैं। कृपया यह नंबर अपनी सूची से हटा दीजिए। धन्यवाद।",
    },
  },
  {
    test: /\b(parcel|delivery|courier|package|swiggy|zomato|blinkit|amazon|flipkart|gate|watchman|security)\b|पार्सल|डिलीवरी|गेट/i,
    verdict: "sorted",
    outcome: "Delivery sorted, no OTP given",
    say: {
      en: "No problem. Please leave it at the reception and I will let them know you are coming. I will not be sharing a delivery OTP.",
      hinglish: "Koi baat nahi. Reception par chhod dijiye, main unhe bata deta hoon. OTP main share nahi karunga.",
      hindi: "कोई बात नहीं। रिसेप्शन पर छोड़ दीजिए, मैं उन्हें बता देता हूँ। OTP मैं साझा नहीं करूँगा।",
    },
  },
  {
    test: /\b(mom|mum|mummy|maa|papa|dad|aunty|uncle|beta|bhaiya|didi|family|ghar|home for dinner)\b|माँ|पापा|आंटी|बेटा/i,
    verdict: "rang",
    outcome: "This one rings you",
    say: {
      en: "Of course, one moment. This is someone he will want to speak to, so I am putting the call through to him now.",
      hinglish: "Zaroor, ek minute. Yeh call unke liye zaroori hai, main abhi unhe de raha hoon.",
      hindi: "ज़रूर, एक मिनट। यह कॉल उनके लिए ज़रूरी है, मैं अभी उन्हें दे रहा हूँ।",
    },
  },
  {
    test: /\b(meeting|reschedul|appointment|schedule|slot|call back|tomorrow|monday|free at|available at|review)\b|मीटिंग|समय/i,
    verdict: "noted",
    outcome: "Slot checked, invite sent",
    say: {
      en: "Let me check his calendar. Tomorrow between 11 and 11:30 is open. I will hold that slot and send you both an invite.",
      hinglish: "Main unka calendar dekh leta hoon. Kal 11 se 11:30 free hai. Main woh slot rakh deta hoon aur dono ko invite bhej deta hoon.",
      hindi: "मैं उनका कैलेंडर देख लेता हूँ। कल 11 से 11:30 खाली है। मैं वह समय रख देता हूँ और दोनों को निमंत्रण भेज देता हूँ।",
    },
  },
  {
    test: /^\s*(hello|hi|hey|namaste|namaskar|good (morning|afternoon|evening))\b[\s!.?]*$/i,
    verdict: "screened",
    outcome: "Still screening",
    say: {
      en: "Hello. You have reached his assistant. May I ask who is calling, and what it is regarding?",
      hinglish: "Namaste. Main unka assistant bol raha hoon. Aap kaun bol rahe hain, aur kis silsile mein call kiya hai?",
      hindi: "नमस्ते। मैं उनका सहायक बोल रहा हूँ। आप कौन बोल रहे हैं, और किस सिलसिले में फ़ोन किया है?",
    },
  },
];

const FALLBACK: Record<Tongue, string> = {
  en: "He is not free right now, but I can take this down. Tell me what it is about and I will make sure he sees it.",
  hinglish: "Woh abhi free nahi hain, par main likh leta hoon. Bataiye kis baare mein hai, main unhe zaroor pahuncha dunga.",
  hindi: "वे अभी व्यस्त हैं, पर मैं लिख लेता हूँ। बताइए किस बारे में है, मैं उन तक ज़रूर पहुँचा दूँगा।",
};

export function answerAs(text: string): Answer {
  const t = tongue(text);
  for (const r of RULES) {
    if (r.test.test(text)) {
      return { reply: r.say[t], verdict: r.verdict, outcome: r.outcome };
    }
  }
  return { reply: FALLBACK[t], verdict: "noted", outcome: "Message taken" };
}

export const VERDICT_TONE: Record<Verdict, string> = {
  blocked: "text-alert",
  declined: "text-ink/50",
  sorted: "text-green-deep",
  rang: "text-green-deep",
  screened: "text-ink/45",
  noted: "text-ink/50",
};
