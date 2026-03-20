import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="font-sans text-on-surface min-h-screen flex items-center justify-center p-6 selection:bg-secondary-container selection:text-on-secondary-container bg-background" style={{ backgroundImage: 'radial-gradient(var(--surface-variant) 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} dir="rtl">
      {/* Spiritual Background Accent Elements */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, rgba(0, 67, 56, 0.03) 0%, rgba(252, 249, 243, 0) 70%)' }}></div>
      <div className="fixed -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed -bottom-24 -left-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Main Authentication Container */}
      <main className="relative w-full max-w-[480px]">
        {children}
        
        {/* Branding Footer */}
        <footer className="mt-12 text-center opacity-40">
          <p className="font-serif text-2xl text-primary font-bold tracking-widest">حـصـون</p>
          <p className="text-[10px] text-on-surface-variant mt-1 font-medium tracking-tighter">تحفيظ القرآن الكريم بالنهج الحديث</p>
        </footer>
      </main>
    </div>
  );
}
