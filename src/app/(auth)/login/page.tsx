'use client';

import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoggingIn, loginError } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm shadow-xl">
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-2xl font-bold font-serif text-primary">تسجيل الدخول</CardTitle>
        <CardDescription>أهلاً بك مرة أخرى في رحاب القرآن</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {loginError && (
            <Alert variant="destructive">
              <AlertDescription>{(loginError as Error).message}</AlertDescription>
            </Alert>
          )}
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
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </Button>
          <div className="text-sm text-center text-muted-foreground">
            ليس لديك حساب؟{' '}
            <Link href="/register" className="text-secondary font-semibold hover:underline">
              أنشئ حساباً جديداً
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
