'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hand, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface GestureControlProps {
    onGesture: (gesture: GestureType, data?: GestureData) => void;
    enabled?: boolean;
    sensitivity?: number;
}

export type GestureType =
    | 'swipe_left'
    | 'swipe_right'
    | 'swipe_up'
    | 'swipe_down'
    | 'pinch_in'
    | 'pinch_out'
    | 'long_press'
    | 'double_tap';

interface GestureData {
    startX?: number;
    startY?: number;
    endX?: number;
    endY?: number;
    distance?: number;
    duration?: number;
}

interface TouchState {
    startX: number;
    startY: number;
    startTime: number;
    lastTapTime: number;
    initialDistance?: number;
}

export default function GestureControl({
    onGesture,
    enabled = true,
    sensitivity = 50,
}: GestureControlProps) {
    const [isActive, setIsActive] = useState(false);
    const [lastGesture, setLastGesture] = useState<GestureType | null>(null);
    const touchStateRef = useRef<TouchState>({
        startX: 0,
        startY: 0,
        startTime: 0,
        lastTapTime: 0,
    });
    const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

    const getDistance = (touch1: Touch, touch2: Touch) => {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchStart = useCallback((e: TouchEvent) => {
        if (!enabled) return;

        const touch = e.touches[0];
        touchStateRef.current = {
            startX: touch.clientX,
            startY: touch.clientY,
            startTime: Date.now(),
            lastTapTime: touchStateRef.current.lastTapTime,
        };

        // Check for pinch gesture (two fingers)
        if (e.touches.length === 2) {
            touchStateRef.current.initialDistance = getDistance(e.touches[0], e.touches[1]);
        }

        // Start long press timer
        longPressTimerRef.current = setTimeout(() => {
            onGesture('long_press', {
                startX: touch.clientX,
                startY: touch.clientY,
            });
            setLastGesture('long_press');
            setIsActive(true);
            setTimeout(() => setIsActive(false), 500);
        }, 800);
    }, [enabled, onGesture]);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (!enabled) return;

        // Cancel long press if finger moves
        if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }

        // Handle pinch gesture
        if (e.touches.length === 2 && touchStateRef.current.initialDistance) {
            const currentDistance = getDistance(e.touches[0], e.touches[1]);
            const delta = currentDistance - touchStateRef.current.initialDistance;

            if (Math.abs(delta) > sensitivity) {
                const gestureType = delta > 0 ? 'pinch_out' : 'pinch_in';
                onGesture(gestureType, { distance: Math.abs(delta) });
                setLastGesture(gestureType);
                setIsActive(true);
                touchStateRef.current.initialDistance = currentDistance;
            }
        }
    }, [enabled, onGesture, sensitivity]);

    const handleTouchEnd = useCallback((e: TouchEvent) => {
        if (!enabled) return;

        // Clear long press timer
        if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }

        const { startX, startY, startTime, lastTapTime } = touchStateRef.current;
        const touch = e.changedTouches[0];
        const endX = touch.clientX;
        const endY = touch.clientY;
        const duration = Date.now() - startTime;

        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Check for double tap
        const now = Date.now();
        if (distance < 20 && duration < 300) {
            if (now - lastTapTime < 300) {
                onGesture('double_tap', { startX, startY });
                setLastGesture('double_tap');
                setIsActive(true);
                setTimeout(() => setIsActive(false), 500);
                touchStateRef.current.lastTapTime = 0;
                return;
            }
            touchStateRef.current.lastTapTime = now;
        }

        // Check for swipe gestures
        if (distance > sensitivity && duration < 500) {
            let gestureType: GestureType;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Horizontal swipe
                gestureType = deltaX > 0 ? 'swipe_right' : 'swipe_left';
            } else {
                // Vertical swipe
                gestureType = deltaY > 0 ? 'swipe_down' : 'swipe_up';
            }

            onGesture(gestureType, {
                startX,
                startY,
                endX,
                endY,
                distance,
                duration,
            });
            setLastGesture(gestureType);
            setIsActive(true);
            setTimeout(() => setIsActive(false), 500);
        }
    }, [enabled, onGesture, sensitivity]);

    useEffect(() => {
        if (!enabled) return;

        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: true });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
            if (longPressTimerRef.current) {
                clearTimeout(longPressTimerRef.current);
            }
        };
    }, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

    // Visual feedback for gestures
    const getGestureIcon = () => {
        switch (lastGesture) {
            case 'swipe_up': return <ArrowUp size={24} />;
            case 'swipe_down': return <ArrowDown size={24} />;
            case 'swipe_left': return <ArrowLeft size={24} />;
            case 'swipe_right': return <ArrowRight size={24} />;
            default: return <Hand size={24} />;
        }
    };

    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 
                        px-4 py-3 rounded-full bg-[var(--neon-cyan)]/20 
                        border border-[var(--neon-cyan)] text-[var(--neon-cyan)]
                        flex items-center gap-2 shadow-[0_0_20px_var(--neon-cyan)]"
                >
                    {getGestureIcon()}
                    <span className="text-sm font-mono">
                        {lastGesture?.replace('_', ' ')}
                    </span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Hook for gesture navigation
export function useGestureNavigation(enabled: boolean = true) {
    const [lastGesture, setLastGesture] = useState<GestureType | null>(null);

    const handleGesture = useCallback((gesture: GestureType) => {
        setLastGesture(gesture);

        switch (gesture) {
            case 'swipe_left':
                // Navigate to next page
                window.history.forward();
                break;
            case 'swipe_right':
                // Navigate to previous page
                window.history.back();
                break;
            case 'swipe_up':
                // Scroll up
                window.scrollBy({ top: -window.innerHeight / 2, behavior: 'smooth' });
                break;
            case 'swipe_down':
                // Scroll down
                window.scrollBy({ top: window.innerHeight / 2, behavior: 'smooth' });
                break;
            case 'double_tap':
                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
                break;
            case 'pinch_in':
                // Could be used for zoom out
                break;
            case 'pinch_out':
                // Could be used for zoom in
                break;
        }
    }, []);

    return { lastGesture, handleGesture };
}
