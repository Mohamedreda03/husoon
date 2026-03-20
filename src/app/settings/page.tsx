'use client';

import { useUser } from '@/hooks/useUser';
import { useNotifications } from '@/hooks/useNotifications';
import { useTodayPlan } from '@/hooks/useTodayPlan';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronRight, Bell, Settings as SettingsIcon, LogOut, Trash2, BookOpen, Download, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { updateUserProfile, getUserLogs } from '@/lib/appwrite/database';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SettingsPage() {
  const { user, logout, isLoading: isUserLoading } = useUser();
  const { profile, isLoading: isProfileLoading } = useTodayPlan();
  const { isSubscribed, permission, requestPermission, subscribe } = useNotifications();
  const router = useRouter();

  const [pagesDone, setPagesDone] = useState(0);
  const [pagesPerDay, setPagesPerDay] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setPagesDone(profile.pagesDone);
      setPagesPerDay(profile.pagesPerDay);
    }
  }, [profile]);

  const handleNotificationToggle = async (checked: boolean) => {
    if (checked) {
      const granted = await requestPermission();
      if (granted) {
        await subscribe();
      }
    } else {
      toast.info('لإيقاف الإشعارات تماماً، يرجى تعطيلها من إعدادات المتصفح');
    }
  };

  const handleSaveProgress = async () => {
    if (!profile) return;
    setIsSaving(true);
    try {
      await updateUserProfile(profile.$id, {
        pagesDone: Number(pagesDone),
        pagesPerDay: Number(pagesPerDay),
      });
      toast.success('تم تحديث بيانات الحفظ بنجاح ✅');
    } catch (error) {
      toast.error('حدث خطأ أثناء حفظ البيانات');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = async () => {
    if (!user) return;
    try {
      const logs = await getUserLogs(user.$id);
      const dataStr = JSON.stringify({ profile, logs }, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `husoon-backup-${new Date().toISOString().split('T')[0]}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      toast.success('تم تصدير البيانات بنجاح 📂');
    } catch (error) {
      toast.error('فشل في تصدير البيانات');
    }
  };

  const handleResetProgress = async () => {
    if (!profile) return;
    try {
      await updateUserProfile(profile.$id, {
        pagesDone: 0,
        streakCount: 0,
        lastActiveDate: undefined,
      });
      toast.success('تم إعادة تعيين التقدم بنجاح');
      router.push('/onboarding');
    } catch (error) {
      toast.error('حدث خطأ أثناء إعادة التعيين');
    }
  };

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12 text-right" dir="rtl">
      <main className="container mx-auto px-4 mt-8 space-y-6 max-w-3xl">
        {/* Memorization Progress */}
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle className="text-lg font-serif font-bold text-primary flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              بيانات الحفظ
            </CardTitle>
            <CardDescription>تحكم في تقدمك ووتيرة حفظك اليومية</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pagesDone">الصفحات المحفوظة حالياً</Label>
                <Input 
                  id="pagesDone" 
                  type="number" 
                  value={pagesDone} 
                  onChange={(e) => setPagesDone(Number(e.target.value))}
                  min={0}
                  max={604}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pagesPerDay">وتيرة الحفظ (صفحة/يوم)</Label>
                <Select value={pagesPerDay.toString()} onValueChange={(v) => setPagesPerDay(Number(v))}>
                  <SelectTrigger id="pagesPerDay">
                    <SelectValue placeholder="اختر الوتيرة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">نصف صفحة</SelectItem>
                    <SelectItem value="1">صفحة واحدة</SelectItem>
                    <SelectItem value="2">صفحتان</SelectItem>
                    <SelectItem value="3">ثلاث صفحات</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleSaveProgress} disabled={isSaving} className="w-full sm:w-auto">
              {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle className="text-lg font-serif font-bold text-primary flex items-center gap-2">
              <Bell className="w-5 h-5" />
              تنبيهات الحفظ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">إشعارات المتصفح</Label>
                <p className="text-sm text-muted-foreground">تلقي تنبيهات يومية على هذا الجهاز</p>
              </div>
              <Switch checked={isSubscribed} onCheckedChange={handleNotificationToggle} />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle className="text-lg font-serif font-bold text-primary flex items-center gap-2">
              <Download className="w-5 h-5" />
              إدارة البيانات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">تنزيل نسخة احتياطية من كافة سجلاتك وحفظك بصيغة JSON.</p>
            <Button variant="outline" onClick={handleExportData} className="gap-2">
              <Download className="w-4 h-4" />
              تصدير بياناتي
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-lg font-serif font-bold text-destructive flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              منطقة الخطر
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <p className="font-bold">إعادة تعيين التقدم</p>
                <p className="text-xs text-muted-foreground">سيتم تصفير عدد الصفحات والـ Streak. لن يتم حذف السجلات السابقة.</p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="gap-2">
                    <Trash2 className="w-4 h-4" />
                    إعادة تعيين
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent dir="rtl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>هل أنت متأكد تماماً؟</AlertDialogTitle>
                    <AlertDialogDescription>
                      هذا الإجراء سيقوم بتصفير تقدمك الحالي في الحفظ. لن تتمكن من التراجع عن هذا الإجراء لاحقاً.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetProgress} className="bg-destructive hover:bg-destructive/90">
                      نعم، أعد التعيين
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="pt-4 border-t border-destructive/10">
              <Button variant="ghost" onClick={() => logout()} className="text-muted-foreground hover:text-destructive w-full justify-start gap-2">
                <LogOut className="w-4 h-4" />
                تسجيل الخروج من الحساب
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
