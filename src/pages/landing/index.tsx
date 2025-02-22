import { IonPage } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import './Landing.css';

const Landing: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => setLoading(false), 1000);
        }, 2000);
    }, []);

    if (!loading) return null;

    return (
        <IonPage className={`landing-page select-none ${fadeOut ? "fade-out" : ""}`}>
            <div className="h-full flex justify-center items-center">
                <h1 className="landing-logo text-[#0f5999]">Omequa</h1>
            </div>
        </IonPage>
    );
};

export default Landing;
