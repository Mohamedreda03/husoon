'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { databases } from '@/lib/appwrite/client';
import { APPWRITE_CONFIG } from '@/lib/appwrite/config';
import { useUser } from '@/hooks/useUser';
import { Query } from 'appwrite';
import { ArrowLeft } from 'lucide-react';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [pagesDone, setPagesDone] = useState(0);
  const [pagesPerDay, setPagesPerDay] = useState(1);
  const [notificationTime, setNotificationTime] = useState('07:00');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useUser();
  const router = useRouter();

  const handleComplete = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      const profiles = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.users,
        [Query.equal('userId', user.$id)]
      );

      if (profiles.documents.length > 0) {
        await databases.updateDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collections.users,
          profiles.documents[0].$id,
          {
            pagesDone: Number(pagesDone),
            pagesPerDay: Number(pagesPerDay),
            notificationTime: notificationTime,
          }
        );
      }
      
      router.push('/');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else handleComplete();
  };

  const skipStep = () => {
    handleNext();
  };

  return (
    <div className="text-on-surface bg-background min-h-screen flex flex-col items-center" dir="rtl">
      
      {/* Background Ornaments */}
      <div className="fixed bottom-0 left-0 w-full overflow-hidden h-64 -z-10 pointer-events-none opacity-20">
        <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-primary-container rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[800px] h-40 bg-surface-container-highest rounded-full blur-[80px]"></div>
      </div>

      <div className="w-full max-w-2xl px-8 py-16 md:py-24">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="font-serif text-5xl font-bold text-primary mb-4 tracking-tight">حصون</h1>
          <p className="font-sans text-on-surface-variant tracking-wide">رحلة تثبيت القرآن الكريم</p>
        </header>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-20 w-full px-4">
          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm ${step >= 1 ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-outline'}`}>١</div>
            <span className={`text-xs font-bold font-sans ${step >= 1 ? 'text-primary' : 'text-outline'}`}>الحفظ الحالي</span>
          </div>
          <div className="h-[2px] bg-surface-container-highest grow mx-4">
            <div className="h-full bg-primary transition-all duration-500" style={{ width: step >= 2 ? '100%' : '0%' }}></div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm ${step >= 2 ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-outline'}`}>٢</div>
            <span className={`text-xs font-medium font-sans ${step >= 2 ? 'text-primary font-bold' : 'text-outline'}`}>الخطة</span>
          </div>
          <div className="h-[2px] bg-surface-container-highest grow mx-4">
            <div className="h-full bg-primary transition-all duration-500" style={{ width: step >= 3 ? '100%' : '0%' }}></div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm ${step >= 3 ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-outline'}`}>٣</div>
            <span className={`text-xs font-medium font-sans ${step >= 3 ? 'text-primary font-bold' : 'text-outline'}`}>التنبيهات</span>
          </div>
        </div>

        {/* Main Content */}
        <main className="space-y-12 min-h-[350px]">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="text-center space-y-4 mb-12">
                <h2 className="font-serif text-4xl text-on-surface font-bold">كم عدد الصفحات التي تحفظها؟</h2>
                <p className="font-sans text-on-surface-variant text-lg">أدخل عدد الصفحات التي أتممت حفظها من المصحف الشريف</p>
              </div>
              <div className="relative flex flex-col items-center group">
                <div className="w-full max-w-sm bg-surface-container-low p-10 rounded-xl border-r-4 border-secondary shadow-sm transition-all duration-300 focus-within:bg-surface-container-lowest focus-within:shadow-md">
                  <div className="flex flex-col items-center gap-4">
                    <input 
                      autoFocus 
                      className="w-full bg-transparent text-center font-serif text-8xl font-bold text-primary focus:outline-none placeholder:text-surface-container-highest border-none p-0" 
                      max="604" min="0" placeholder="0" type="number"
                      value={pagesDone || ''}
                      onChange={(e) => setPagesDone(Number(e.target.value))}
                    />
                    <div className="text-secondary font-sans font-bold tracking-widest text-sm uppercase">صفحة من ٦٠٤</div>
                  </div>
                </div>
                <div className="mt-8 grid grid-cols-4 gap-4 w-full max-w-sm">
                  <button onClick={() => setPagesDone(100)} className="py-2 px-4 rounded-full bg-surface-container-highest text-on-surface-variant text-xs font-bold font-sans hover:bg-surface-container transition-colors">١٠٠ صفحة</button>
                  <button onClick={() => setPagesDone(20)} className="py-2 px-4 rounded-full bg-surface-container-highest text-on-surface-variant text-xs font-bold font-sans hover:bg-surface-container transition-colors">جزء عم</button>
                  <button onClick={() => setPagesDone(302)} className="py-2 px-4 rounded-full bg-surface-container-highest text-on-surface-variant text-xs font-bold font-sans hover:bg-surface-container transition-colors">نصف القرآن</button>
                  <button onClick={() => setPagesDone(604)} className="py-2 px-4 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold font-sans hover:opacity-90 transition-opacity">خاتم</button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="text-center space-y-4 mb-12">
                <h2 className="font-serif text-4xl text-on-surface font-bold">ما هي وتيرة الحفظ اليومية؟</h2>
                <p className="font-sans text-on-surface-variant text-lg">بناءً على هذا المعدل سيتم اقتراح مهامك اليومية</p>
              </div>
              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                {[
                  { value: 0.5, label: 'نصف صفحة' },
                  { value: 1, label: 'صفحة واحدة' },
                  { value: 2, label: 'صفحتان' },
                  { value: 3, label: 'ثلاث صفحات' },
                ].map((option) => (
                  <button 
                    key={option.value}
                    onClick={() => setPagesPerDay(option.value)}
                    className={`py-8 px-4 rounded-2xl flex flex-col items-center gap-2 transition-all font-sans font-bold ${pagesPerDay === option.value ? 'bg-primary text-on-primary shadow-lg scale-105' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high border border-outline/10'}`}
                  >
                    <span className={pagesPerDay === option.value ? 'text-secondary-fixed' : 'text-primary'}>{option.value}</span>
                    <span className="text-sm">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="text-center space-y-4 mb-12">
                <h2 className="font-serif text-4xl text-on-surface font-bold">متى تريد أن نذكرك بحفظك؟</h2>
                <p className="font-sans text-on-surface-variant text-lg">سنرسل لك تنبيهاً يومياً في هذا الوقت</p>
              </div>
              <div className="flex flex-col items-center group">
                <div className="w-full max-w-sm bg-surface-container-low p-10 rounded-xl border-r-4 border-secondary shadow-sm transition-all duration-300 focus-within:bg-surface-container-lowest focus-within:shadow-md">
                  <div className="flex flex-col items-center gap-4">
                    <input 
                      type="time" 
                      value={notificationTime}
                      onChange={(e) => setNotificationTime(e.target.value)}
                      className="w-full bg-transparent text-center font-serif text-6xl font-bold text-primary focus:outline-none placeholder:text-surface-container-highest border-none p-0"
                    />
                    <div className="text-secondary font-sans font-bold tracking-widest text-sm uppercase">بتوقيت جهازك</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-12 flex flex-col items-center gap-6">
            <button 
              onClick={handleNext}
              disabled={isSubmitting}
              className="w-full max-w-sm py-5 rounded-xl bg-linear-to-br from-primary to-primary-container text-on-primary font-sans font-bold text-lg shadow-lg shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'جاري التحضير...' : (step === 3 ? 'ابدأ رحلة الحفظ' : 'التالي')}</span>
              {!isSubmitting && <ArrowLeft className="w-5 h-5" />}
            </button>
            {step < 3 && (
              <button 
                onClick={skipStep}
                className="font-sans text-secondary font-medium hover:text-on-secondary-container transition-colors"
              >
                تخطي هذه الخطوة مؤقتاً
              </button>
            )}
            {step > 1 && (
              <button 
                onClick={() => setStep(step - 1)}
                className="font-sans text-outline hover:text-primary transition-colors mt-2 text-sm"
              >
                العودة للخطوة السابقة
              </button>
            )}
          </div>
        </main>

        <footer className="mt-20 text-center opacity-30 pointer-events-none">
          <div className="flex justify-center gap-12 mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10"></div>
            <div className="w-16 h-16 rounded-full bg-secondary/10"></div>
            <div className="w-16 h-16 rounded-full bg-primary/10"></div>
          </div>
          <p className="font-serif text-sm">«خيركم من تعلم القرآن وعلمه»</p>
        </footer>
      </div>
    </div>
  );
}
