import React from 'react';
import styles from '@/styles/Loader.module.css';


const Loader = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className={styles.loader}>
                <div className={styles.gear}></div>
                <div className={styles.gear}></div>
                <div className={styles.gear}></div>
            </div>
        </div>
    );
};

export default Loader;
