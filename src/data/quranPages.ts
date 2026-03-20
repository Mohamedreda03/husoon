export interface QuranPageInfo {
  page: number;
  surah: string;
  juz: number;
}

// Simple lookup for demo purposes. In a real app, this would cover all 604 pages.
export const getPageInfo = (pageNumber: number): QuranPageInfo => {
  // Logic to determine surah and juz based on page number
  // Pages 1-2: Al-Fatihah
  // Pages 2-50: Al-Baqarah, etc.
  
  let surah = "البقرة";
  if (pageNumber <= 1) surah = "الفاتحة";
  else if (pageNumber <= 50) surah = "البقرة";
  else if (pageNumber <= 76) surah = "آل عمران";
  else if (pageNumber <= 106) surah = "النساء";
  else if (pageNumber <= 127) surah = "المائدة";
  else if (pageNumber <= 150) surah = "الأنعام";
  else if (pageNumber <= 176) surah = "الأعراف";
  else if (pageNumber <= 186) surah = "الأنفال";
  else if (pageNumber <= 207) surah = "التوبة";
  else if (pageNumber <= 221) surah = "يونس";
  else if (pageNumber <= 235) surah = "هود";
  else if (pageNumber <= 248) surah = "يوسف";
  else if (pageNumber <= 255) surah = "الرعد";
  else if (pageNumber <= 261) surah = "إبراهيم";
  else if (pageNumber <= 267) surah = "الحجر";
  else if (pageNumber <= 281) surah = "النحل";
  else if (pageNumber <= 293) surah = "الإسراء";
  else if (pageNumber <= 304) surah = "الكهف";
  else if (pageNumber <= 312) surah = "مريم";
  else if (pageNumber <= 321) surah = "طه";
  else if (pageNumber <= 331) surah = "الأنبياء";
  else if (pageNumber <= 341) surah = "الحج";
  else if (pageNumber <= 350) surah = "المؤمنون";
  else if (pageNumber <= 359) surah = "النور";
  else if (pageNumber <= 366) surah = "الفرقان";
  else if (pageNumber <= 376) surah = "الشعراء";
  else if (pageNumber <= 385) surah = "النمل";
  else if (pageNumber <= 396) surah = "القصص";
  else if (pageNumber <= 404) surah = "العنكبوت";
  else if (pageNumber <= 410) surah = "الروم";
  else if (pageNumber <= 414) surah = "لقمان";
  else if (pageNumber <= 417) surah = "السجدة";
  else if (pageNumber <= 427) surah = "الأحزاب";
  else if (pageNumber <= 434) surah = "سبأ";
  else if (pageNumber <= 440) surah = "فاطر";
  else if (pageNumber <= 445) surah = "يس";
  else if (pageNumber <= 452) surah = "الصافات";
  else if (pageNumber <= 458) surah = "ص";
  else if (pageNumber <= 466) surah = "الزمر";
  else if (pageNumber <= 476) surah = "غافر";
  else if (pageNumber <= 482) surah = "فصلت";
  else if (pageNumber <= 489) surah = "الشورى";
  else if (pageNumber <= 495) surah = "الزخرف";
  else if (pageNumber <= 498) surah = "الدخان";
  else if (pageNumber <= 501) surah = "الجاثية";
  else if (pageNumber <= 506) surah = "الأحقاف";
  else if (pageNumber <= 510) surah = "محمد";
  else if (pageNumber <= 515) surah = "الفتح";
  else if (pageNumber <= 517) surah = "الحجرات";
  else if (pageNumber <= 520) surah = "ق";
  else if (pageNumber <= 525) surah = "الذاريات";
  else if (pageNumber <= 528) surah = "الطور";
  else if (pageNumber <= 531) surah = "النجم";
  else if (pageNumber <= 534) surah = "القمر";
  else if (pageNumber <= 537) surah = "الرحمن";
  else if (pageNumber <= 541) surah = "الواقعة";
  else if (pageNumber <= 545) surah = "الحديد";
  else if (pageNumber <= 548) surah = "المجادلة";
  else if (pageNumber <= 552) surah = "الحشر";
  else if (pageNumber <= 555) surah = "الممتحنة";
  else if (pageNumber <= 557) surah = "الصف";
  else if (pageNumber <= 559) surah = "الجمعة";
  else if (pageNumber <= 561) surah = "المنافقون";
  else if (pageNumber <= 563) surah = "التغابن";
  else if (pageNumber <= 565) surah = "الطلاق";
  else if (pageNumber <= 567) surah = "التحريم";
  else if (pageNumber <= 569) surah = "الملك";
  else if (pageNumber <= 571) surah = "القلم";
  else if (pageNumber <= 573) surah = "الحاقة";
  else if (pageNumber <= 575) surah = "المعارج";
  else if (pageNumber <= 577) surah = "نوح";
  else if (pageNumber <= 579) surah = "الجن";
  else if (pageNumber <= 581) surah = "المزمل";
  else if (pageNumber <= 583) surah = "المدثر";
  else if (pageNumber <= 584) surah = "القيامة";
  else if (pageNumber <= 586) surah = "الإنسان";
  else if (pageNumber <= 587) surah = "المرسلات";
  else if (pageNumber <= 589) surah = "النبأ";
  else if (pageNumber <= 590) surah = "النازعات";
  else if (pageNumber <= 592) surah = "عبس";
  else if (pageNumber <= 593) surah = "التكوير";
  else if (pageNumber <= 594) surah = "الانفطار";
  else if (pageNumber <= 595) surah = "المطففين";
  else if (pageNumber <= 596) surah = "الانشقاق";
  else if (pageNumber <= 597) surah = "البروج";
  else if (pageNumber <= 598) surah = "الطارق";
  else if (pageNumber <= 599) surah = "الأعلى";
  else if (pageNumber <= 600) surah = "الغاشية";
  else if (pageNumber <= 601) surah = "الفجر";
  else if (pageNumber <= 602) surah = "البلد";
  else if (pageNumber <= 603) surah = "الشمس";
  else if (pageNumber <= 604) surah = "الضحى";
  
  const juz = Math.floor((pageNumber - 1) / 20) + 1;
  
  return {
    page: pageNumber,
    surah: surah,
    juz: Math.min(30, juz)
  };
};
