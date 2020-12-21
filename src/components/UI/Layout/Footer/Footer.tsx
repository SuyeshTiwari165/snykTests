import React from 'react';
import styles from './Footer.module.css';

export const Footer: React.FC = () => (
  <div className={styles.Footer} data-testid="Footer">
    CyberCompliance360 | © Copyright 2020
  </div>
);

export default Footer;
