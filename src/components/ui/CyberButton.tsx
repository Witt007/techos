'use client';

import { useRef, useState, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CyberButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
    variant?: 'default' | 'magenta' | 'filled' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    glitch?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
}

const CyberButton = forwardRef<HTMLButtonElement, CyberButtonProps>(
    ({
        children,
        variant = 'default',
        size = 'md',
        glitch = false,
        icon,
        iconPosition = 'left',
        className = '',
        ...props
    }, ref) => {
        const [isHovered, setIsHovered] = useState(false);
        const buttonRef = useRef<HTMLButtonElement>(null);

        const sizeClasses = {
            sm: 'px-4 py-2 text-xs',
            md: 'px-6 py-3 text-sm',
            lg: 'px-8 py-4 text-base',
        };

        const variantClasses = {
            default: 'cyber-btn',
            magenta: 'cyber-btn cyber-btn--magenta',
            filled: 'cyber-btn cyber-btn--filled',
            ghost: 'cyber-btn border-transparent hover:border-[var(--neon-cyan)]',
        };

        return (
            <motion.button
                ref={ref || buttonRef}
                className={`${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                {...props}
            >
                {/* Glitch overlay */}
                {glitch && isHovered && (
                    <>
                        <span
                            className="absolute inset-0 flex items-center justify-center opacity-80"
                            style={{
                                color: 'var(--neon-cyan)',
                                clipPath: 'inset(20% 0 30% 0)',
                                transform: 'translate(-2px, 0)',
                                animation: 'glitch-1 0.2s infinite linear alternate-reverse',
                            }}
                        >
                            {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
                            {children as React.ReactNode}
                            {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
                        </span>
                        <span
                            className="absolute inset-0 flex items-center justify-center opacity-80"
                            style={{
                                color: 'var(--neon-magenta)',
                                clipPath: 'inset(60% 0 10% 0)',
                                transform: 'translate(2px, 0)',
                                animation: 'glitch-2 0.2s infinite linear alternate-reverse',
                            }}
                        >
                            {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
                            {children as React.ReactNode}
                            {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
                        </span>
                    </>
                )}

                {/* Main content */}
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {icon && iconPosition === 'left' && icon}
                    {children as React.ReactNode}
                    {icon && iconPosition === 'right' && icon}
                </span>

                {/* Corner decorations */}
                <span
                    className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 opacity-50"
                    style={{ borderColor: 'currentColor' }}
                />
                <span
                    className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 opacity-50"
                    style={{ borderColor: 'currentColor' }}
                />
            </motion.button>
        );
    }
);

CyberButton.displayName = 'CyberButton';

export default CyberButton;
