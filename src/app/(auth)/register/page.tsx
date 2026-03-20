'use client';

import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register, isRegistering, registerError } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتان');
      return;
    }

    if (password.length < 8) {
      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return;
    }

    register({ email, password, name });
  };

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm shadow-xl">
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-2xl font-bold font-serif text-primary">إنشاء حساب جديد</CardTitle>
        <CardDescription>ابدأ رحلتك المباركة في حفظ كتاب الله</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {(error || registerError) && (
            <Alert variant="destructive">
              <AlertDescription>
                {error || (registerError as Error).message}
              </AlertDescription>
            </Alert>
          )}
          <div className="space-y-2 text-right">
            <Label htmlFor="name">الاسم الكريم</Label>
            <Input 
              id="name" 
              placeholder="الاسم الثلاثي" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="text-right focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2 text-right">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="example@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-right focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2 text-right">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="text-right focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2 text-right">
            <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
            <Input 
              id="confirmPassword" 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="text-right focus-visible:ring-primary"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
            disabled={isRegistering}
          >
            {isRegistering ? 'جاري إنشاء الحساب...' : 'بدء الرحلة'}
          </Button>
          <div className="text-sm text-center text-muted-foreground">
            لديك حساب بالفعل؟{' '}
            <Link href="/login" className="text-secondary font-semibold hover:underline">
              سجل دخولك هنا
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
