// src/hooks/useOrderTimer.js
import { useState, useEffect } from 'react';
import { updateOrderStatus } from '../api/client';

export const useOrderTimer = (order, onStatusUpdate) => {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!order?.expires_at) {
      setTimeRemaining(null);
      return;
    }

    const updateTimer = async () => {
      const now = new Date().getTime();
      const expires = new Date(order.expires_at).getTime();
      const diff = expires - now;

      if (diff <= 0) {
        setIsExpired(true);
        setTimeRemaining({ hours: 0, minutes: 0, seconds: 0 });
        
        // Auto-complete the order if it's still active
        if (order.status !== 'completed' && order.status !== 'cancelled') {
          try {
            await updateOrderStatus(order.id, 'completed');
            if (onStatusUpdate) {
              onStatusUpdate(order.id, 'completed');
            }
          } catch (err) {
            console.error('Auto-complete error:', err);
          }
        }
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining({ hours, minutes, seconds });
      setIsExpired(false);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [order?.expires_at, order?.status, order?.id, onStatusUpdate]);

  const formatTime = () => {
    if (!timeRemaining) return '00:00:00';
    const { hours, minutes, seconds } = timeRemaining;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return {
    timeRemaining,
    isExpired,
    formattedTime: formatTime(),
  };
};
