import React from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/F1Button.module.css';

const F1Button = ({ label, path }) => {
    const router = useRouter();

    const handleClick = () => {
        router.push(path);
    };

    return (
        <button className={styles.button} onClick={handleClick}>
            {label}
            <div className={styles.hoverEffect}>
                <div></div>
            </div>
        </button>
    );
};

export default F1Button;
