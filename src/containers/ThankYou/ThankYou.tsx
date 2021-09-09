import React, { useState, useEffect } from "react";
import styles from "./ThankYou.module.css";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
export const ThankYou: React.FC = (props: any) => {
    return (
        <React.Fragment>
            <div className={styles.alphabox}>
                <div className={styles.alphaboxinner}>
                    <div className={styles.apic}>
                        <img src={process.env.PUBLIC_URL + "Tick.png"} />
                    </div>
                    <div className={styles.aheading}>Thank You!</div>
                    <div className={styles.acontent}>
                        The Alpha testing has been completed.
                        <br />
                        Thank you for your participation.</div>
                    <div className={styles.logos}>
                        <div><img src={process.env.PUBLIC_URL + "PG 360 edited-01.png"} /></div>|
                        <div><img src={process.env.PUBLIC_URL + "OBedited-01.png"} /></div>|
                        <div><img src={process.env.PUBLIC_URL + "RA 360-01.png"} /></div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default ThankYou;