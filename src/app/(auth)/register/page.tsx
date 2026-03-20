'use client';

import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import Link from 'next/link';
import { BookOpen, Mail, Lock, Eye, LogIn, User } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    <div className="bg-surface-container-lowest rounded-xl shadow-2xl shadow-on-surface/5 overflow-hidden relative border-r-8 border-secondary">
      {/* Hero Header Section */}
      <div className="pt-12 pb-8 px-10 text-center">
        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-container/10 text-primary">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-4xl font-bold text-primary mb-3">إنشاء حساب جديد</h1>
        <p className="font-sans text-on-surface-variant text-sm leading-relaxed">ابدأ رحلتك المباركة في حفظ كتاب الله</p>
      </div>

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="px-10 pb-12 space-y-6">
        {(error || registerError) && (
          <div className="p-4 bg-error-container text-on-error-container rounded-lg text-sm font-sans font-medium text-center alert">
            {error || (registerError as Error).message}
          </div>
        )}

        {/* Name Field */}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-xs font-bold text-on-surface-variant mr-1">الاسم الكريم</label>
          <div className="relative">
            <User className="absolute right-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
            <input 
              id="name" 
              placeholder="الاسم الثلاثي" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full h-14 pr-12 pl-4 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 placeholder:text-outline/50 text-on-surface font-sans"
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-xs font-bold text-on-surface-variant mr-1">البريد الإلكتروني</label>
          <div className="relative">
            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
            <input 
              id="email" 
              type="email" 
              placeholder="example@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-14 pr-12 pl-4 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 placeholder:text-outline/50 text-on-surface font-sans"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label htmlFor="password" className="block text-xs font-bold text-on-surface-variant">كلمة المرور</label>
          </div>
          <div className="relative">
            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
            <input 
              id="password" 
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-14 pr-12 pl-12 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 placeholder:text-outline/50 text-on-surface font-sans"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label htmlFor="confirmPassword" className="block text-xs font-bold text-on-surface-variant">تأكيد كلمة المرور</label>
          </div>
          <div className="relative">
            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
            <input 
              id="confirmPassword" 
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full h-14 pr-12 pl-12 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 placeholder:text-outline/50 text-on-surface font-sans"
            />
            <button 
              type="button" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Primary CTA Button */}
        <button 
          type="submit" 
          disabled={isRegistering}
          className="w-full h-14 mt-4 bg-linear-to-br from-primary to-primary-container text-white font-bold rounded-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 font-sans disabled:opacity-50"
        >
          <LogIn className="w-5 h-5" />
          {isRegistering ? 'جاري إنشاء الحساب...' : 'بدء الرحلة'}
        </button>

      </form>

      {/* Secondary CTA Footer */}
      <div className="bg-surface-container-low/50 py-6 px-10 text-center">
        <p className="text-sm text-on-surface-variant font-sans flex items-center justify-center gap-1">
          لديك حساب بالفعل؟{' '}
          <Link href="/login" className="text-secondary font-bold mr-2 hover:text-on-secondary-container transition-colors inline-flex items-center gap-1 group">
            سجل دخولك هنا
          </Link>
        </p>
      </div>
    </div>
  );
}
