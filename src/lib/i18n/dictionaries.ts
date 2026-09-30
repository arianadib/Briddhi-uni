import type { Locale } from "./locales";

/**
 * UI copy. English is the key source; Bangla must provide every key.
 * Voice rules (docs/DESIGN.md → Voice): sentence case, plain verbs, an action
 * keeps the same name through the flow, errors never apologise.
 * Bangla copy is draft pending content review.
 */
const en = {
  "lang.bn": "বাংলা",
  "lang.en": "English",
  "lang.label": "Language",
  "theme.label": "Appearance",
  "theme.system": "Auto",
  "theme.light": "Light",
  "theme.dark": "Dark",

  "action.answer": "Answer",
  "action.tryAgain": "Try again",
  "action.continueWatching": "Continue watching",
  "action.shareResult": "Share result",
  "action.goPro": "Go Pro",
  "action.startOnBriddhi": "Start on Briddhi",
  "action.nextEpisode": "Next episode",
  "action.sendCode": "Send code",
  "action.close": "Close",

  "quiz.question": "Question",
  "quiz.xpReward": "{xp} XP",
  "quiz.correct": "Correct.",
  "quiz.incorrect": "Not quite.",
  "quiz.oneMoreTry": "You have one more try.",
  "quiz.answerIs": "The answer is {answer}.",
  "quiz.proLocked": "This question is in Pro",
  "quiz.resuming": "The video continues in a moment",
  "quiz.optionState.correct": "correct",
  "quiz.optionState.incorrect": "incorrect",

  "xp.gained": "+{xp} XP",
  "xp.total": "{xp} XP",
  "streak.days": "{n}-day streak",
  "streak.none": "No streak yet",
  "level.name.1": "Saver",
  "level.name.2": "Learner",
  "level.name.3": "Investor",
  "level.name.4": "Portfolio Builder",
  "level.name.5": "Market Pro",
  "level.progress": "{xp} of {next} XP",
  "level.label": "Level {n}, {name}",

  "pro.mark": "Pro",
  "pro.perk.allQuestions": "Every question in every episode",
  "pro.perk.streakFreeze": "Streak freeze",
  "pro.perk.certificates": "Certificates",

  "player.loading": "Loading video",
  "player.error": "The video couldn't play. Check your connection and try again.",
  "player.retry": "Try again",
  "player.region": "Video: {title}",
  "player.glideBack": "Answer this question to go further.",
  "player.finished": "Episode finished",
  "player.replay": "Watch again",
  "quiz.sample": "Sample questions, pending review",
  "quiz.continueIn": "Continues in {n}",
  "player.play": "Play",
  "player.pause": "Pause",
  "player.seek": "Video position",
  "player.pausePoint.answered": "Answered question",
  "player.pausePoint.upcoming": "Upcoming question",
  "player.pausePoint.pro": "Pro question",

  "leaderboard.you": "You",
  "leaderboard.rank": "#{rank} of {total}",

  "field.phone": "Mobile number",
  "field.phone.hint": "We'll text you a 6-digit code.",
  "field.phone.invalid": "Enter an 11-digit mobile number starting with 01.",
  "field.otp": "Verification code",
  "field.otp.hint": "Enter the 6-digit code we sent to {phone}.",
  "field.name": "Your name",
  "field.university": "University (optional)",

  "series.cobrand": "Briddhi × {partner}",
  "series.progress": "{done} of {total} watched",
  "video.episode": "Episode {n}",
  "video.remaining": "{time} left",

  "nav.home": "Home",
  "nav.library": "Library",
  "nav.leaderboard": "Leaderboard",
  "nav.profile": "Profile",
  "nav.allPlaylists": "All playlists",

  "badge.locked": "Not earned yet",

  disclaimer:
    "Education only, not investment advice. Mutual fund investments are subject to market risk. Read the fund's documents before investing.",
};

export type MessageKey = keyof typeof en;
type Dictionary = Record<MessageKey, string>;

const bn: Dictionary = {
  "lang.bn": "বাংলা",
  "lang.en": "English",
  "lang.label": "ভাষা",
  "theme.label": "থিম",
  "theme.system": "অটো",
  "theme.light": "লাইট",
  "theme.dark": "ডার্ক",

  "action.answer": "উত্তর দিন",
  "action.tryAgain": "আবার চেষ্টা করুন",
  "action.continueWatching": "দেখা চালিয়ে যান",
  "action.shareResult": "ফলাফল শেয়ার করুন",
  "action.goPro": "Pro নিন",
  "action.startOnBriddhi": "Briddhi-তে শুরু করুন",
  "action.nextEpisode": "পরের পর্ব",
  "action.sendCode": "কোড পাঠান",
  "action.close": "বন্ধ করুন",

  "quiz.question": "প্রশ্ন",
  "quiz.xpReward": "{xp} XP",
  "quiz.correct": "ঠিক উত্তর।",
  "quiz.incorrect": "হয়নি।",
  "quiz.oneMoreTry": "আরেকবার চেষ্টা করতে পারবেন।",
  "quiz.answerIs": "সঠিক উত্তর: {answer}।",
  "quiz.proLocked": "এই প্রশ্নটি Pro-তে আছে",
  "quiz.resuming": "ভিডিও একটু পরেই চলবে",
  "quiz.optionState.correct": "সঠিক",
  "quiz.optionState.incorrect": "ভুল",

  "xp.gained": "+{xp} XP",
  "xp.total": "{xp} XP",
  "streak.days": "{n} দিনের স্ট্রিক",
  "streak.none": "এখনও স্ট্রিক নেই",
  "level.name.1": "সঞ্চয়ী",
  "level.name.2": "শিক্ষার্থী",
  "level.name.3": "বিনিয়োগকারী",
  "level.name.4": "পোর্টফোলিও নির্মাতা",
  "level.name.5": "মার্কেট প্রো",
  "level.progress": "{next} XP-র মধ্যে {xp}",
  "level.label": "লেভেল {n}, {name}",

  "pro.mark": "Pro",
  "pro.perk.allQuestions": "প্রতিটি পর্বের সব প্রশ্ন",
  "pro.perk.streakFreeze": "স্ট্রিক ফ্রিজ",
  "pro.perk.certificates": "সার্টিফিকেট",

  "player.loading": "ভিডিও লোড হচ্ছে",
  "player.error": "ভিডিওটি চালানো যায়নি। ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন।",
  "player.retry": "আবার চেষ্টা করুন",
  "player.region": "ভিডিও: {title}",
  "player.glideBack": "সামনে যেতে এই প্রশ্নের উত্তর দিন।",
  "player.finished": "পর্ব শেষ",
  "player.replay": "আবার দেখুন",
  "quiz.sample": "নমুনা প্রশ্ন, পর্যালোচনার অপেক্ষায়",
  "quiz.continueIn": "{n} সেকেন্ডে চলবে",
  "player.play": "চালান",
  "player.pause": "থামান",
  "player.seek": "ভিডিওর অবস্থান",
  "player.pausePoint.answered": "উত্তর দেওয়া প্রশ্ন",
  "player.pausePoint.upcoming": "আসন্ন প্রশ্ন",
  "player.pausePoint.pro": "Pro প্রশ্ন",

  "leaderboard.you": "আপনি",
  "leaderboard.rank": "{total} জনের মধ্যে #{rank}",

  "field.phone": "মোবাইল নম্বর",
  "field.phone.hint": "আমরা আপনাকে ৬ সংখ্যার একটি কোড পাঠাব।",
  "field.phone.invalid": "০১ দিয়ে শুরু হওয়া ১১ সংখ্যার মোবাইল নম্বর দিন।",
  "field.otp": "যাচাই কোড",
  "field.otp.hint": "{phone} নম্বরে পাঠানো ৬ সংখ্যার কোডটি দিন।",
  "field.name": "আপনার নাম",
  "field.university": "বিশ্ববিদ্যালয় (ঐচ্ছিক)",

  "series.cobrand": "Briddhi × {partner}",
  "series.progress": "{total}টির মধ্যে {done}টি দেখা হয়েছে",
  "video.episode": "পর্ব {n}",
  "video.remaining": "{time} বাকি",

  "nav.home": "হোম",
  "nav.library": "লাইব্রেরি",
  "nav.leaderboard": "লিডারবোর্ড",
  "nav.profile": "প্রোফাইল",
  "nav.allPlaylists": "সব প্লেলিস্ট",

  "badge.locked": "এখনও অর্জিত হয়নি",

  disclaimer:
    "শুধু শিক্ষার উদ্দেশ্যে, বিনিয়োগ পরামর্শ নয়। মিউচুয়াল ফান্ডে বিনিয়োগ বাজার ঝুঁকির অধীন। বিনিয়োগের আগে ফান্ডের নথিপত্র পড়ুন।",
};

export const dictionaries: Record<Locale, Dictionary> = { en, bn };

/** Fills {placeholders} in a message. */
export function interpolate(message: string, vars?: Record<string, string | number>): string {
  if (!vars) return message;
  return message.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}
