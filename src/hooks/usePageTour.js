import { useEffect, useRef } from "react";
import {driver} from 'driver.js';
import 'driver.js/dist/driver.css';

const usePageTour = (section, steps) => {
    const driverRef = useRef(null);

    useEffect(() => {
        const key = `stockee_tour_${section}`
        if (localStorage.getItem(key)) return;

        const timer = setTimeout(() => {
            driverRef.current = driver ({
                showProgress: true, 
                progressText: '{{current}} de {{total}}',
                nextBtnText: 'Sigueinte →',
                prevBtnText: '← Anterior',
                doneBtnText: '¡Entendido!',
                steps,
                onDestroyed: () => {
                    localStorage.setItem(key, 'true');
                },
            });

            driverRef.current.drive();
        }, 600);

        return () => {
            clearTimeout(timer);
            driverRef.current?.destroy();
        };
    }, [section])
};

export default usePageTour;