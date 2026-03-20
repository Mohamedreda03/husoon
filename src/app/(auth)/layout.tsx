import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">الحصون الخمسة</h1>
        <p className="text-muted-foreground text-lg">نظام حفظ القرآن الكريم</p>
      </div>
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
