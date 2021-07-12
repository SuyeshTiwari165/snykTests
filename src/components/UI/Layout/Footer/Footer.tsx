import React from 'react';
import styles from './Footer.module.css';

export const Footer: React.FC = () => (
  <div className={styles.Footer} data-testid="Footer">
    © 2021 - All Rights Reserved, PIISecured
  </div>
);

export default Footer;
