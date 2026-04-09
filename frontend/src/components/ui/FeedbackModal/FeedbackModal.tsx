import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '../Button/Button';
import styles from './FeedbackModal.module.css';

interface Props {
  message: string;
  onClose: () => void;
}

export const FeedbackModal: React.FC<Props> = ({ message, onClose }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.icon}>
          <CheckCircle size={64} strokeWidth={2.5} />
        </div>

        <div className={styles.message}>
          {message}
        </div>

        <div className={styles.divider} />

        <div className={styles.actions}>
          <Button onClick={onClose}>
            Aceptar
          </Button>
        </div>
      </div>
    </div>
  );
};