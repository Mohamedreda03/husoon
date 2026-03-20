'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { databases } from '@/lib/appwrite/client';
import { APPWRITE_CONFIG } from '@/lib/appwrite/config';
import { useUser } from '@/hooks/useUser';
import { Query } from 'appwrite';

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
      // Find the user profile document
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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-primary/20 shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`w-3 h-3 rounded-full mx-1 ${step >= s ? 'bg-primary' : 'bg-muted'}`}
              />
            ))}
          </div>
          <CardTitle className="text-2xl font-serif text-primary">إعداد خطة الحفظ</CardTitle>
          <CardDescription>لنخصص لك جدولاً يناسبك تماماً</CardDescription>
        </CardHeader>

        <CardContent className="py-6 min-h-[200px]">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-left-4">
              <Label className="text-lg block text-right">كم صفحة حفظت حتى الآن؟</Label>
              <p className="text-sm text-muted-foreground text-right">ادخل عدد الصفحات التي تتقن حفظها حالياً (من 0 إلى 604)</p>
              <Input 
                type="number" 
                min="0" 
                max="604" 
                value={pagesDone}
                onChange={(e) => setPagesDone(Number(e.target.value))}
                className="text-center text-2xl h-16 border-primary/30"
              />
              <div className="text-center text-secondary font-bold">
                {pagesDone > 0 ? `أنت في الجزء ${Math.floor(pagesDone / 20) + 1}` : 'ستبدأ من البداية (سورة البقرة)'}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-left-4">
              <Label className="text-lg block text-right">ما هي وتيرة الحفظ اليومية؟</Label>
              <Select onValueChange={(val) => setPagesPerDay(Number(val))} defaultValue="1">
                <SelectTrigger className="h-16 text-right text-lg border-primary/30">
                  <SelectValue placeholder="اختر الوتيرة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5" className="text-right">نصف صفحة يومياً</SelectItem>
                  <SelectItem value="1" className="text-right">صفحة واحدة يومياً</SelectItem>
                  <SelectItem value="2" className="text-right">صفحتان يومياً</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-left-4">
              <Label className="text-lg block text-right">متى تريد أن نذكرك بحفظك؟</Label>
              <Input 
                type="time" 
                value={notificationTime}
                onChange={(e) => setNotificationTime(e.target.value)}
                className="text-center text-2xl h-16 border-primary/30"
              />
              <p className="text-sm text-muted-foreground text-center">سنرسل لك تنبيهاً يومياً في هذا الوقت</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between flex-row-reverse">
          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)} className="w-full bg-primary hover:bg-primary/90">
              التالي
            </Button>
          ) : (
            <Button onClick={handleComplete} className="w-full bg-secondary hover:bg-secondary/90" disabled={isSubmitting}>
              {isSubmitting ? 'جاري الحفظ...' : 'ابدأ الآن'}
            </Button>
          )}
          
          {step > 1 && (
            <Button variant="ghost" onClick={() => setStep(step - 1)} className="ml-2">
              السابق
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
