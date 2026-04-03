import React, { useState, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, icon, error, className, id, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className={`${styles.inputWrapper} ${className || ''}`}>
      <label htmlFor={inputId} className={styles.label}>{label}</label>
      <div 
        className={`${styles.inputContainer} ${isFocused ? styles.focused : ''} ${error ? styles.error : ''}`}
      >
        {icon && <div className={styles.icon}>{icon}</div>}
        <input
          id={inputId}
          className={styles.input}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};
