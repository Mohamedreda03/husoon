'use client';

import { useState, useEffect } from 'react';
import { useUser } from './useUser';
import { toast } from 'sonner';

export function useNotifications() {
  const { user } = useUser();
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' ? Notification.permission : 'default'
  );
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  const checkSubscription = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      setIsSubscribed(!!sub);
      setSubscription(sub);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      checkSubscription();
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('هذا المتصفح لا يدعم الإشعارات');
      return false;
    }

    const res = await Notification.requestPermission();
    setPermission(res);
    return res === 'granted';
  };

  const subscribe = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      // Fetch VAPID public key from API
      const res = await fetch('/api/push/vapid');
      const { publicKey } = await res.json();

      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicKey,
      });

      // Save to Appwrite via our API
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.$id, subscription: sub }),
      });

      setIsSubscribed(true);
      setSubscription(sub);
      toast.success('تم تفعيل الإشعارات بنجاح ✅');
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('فشل في تفعيل الإشعارات، حاول مرة أخرى');
    }
  };

  return {
    permission,
    isSubscribed,
    subscription,
    requestPermission,
    subscribe,
  };
}
