import { useEffect, useReducer, useRef } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import axios from 'axios';

const TOUR_STEPS = [
    {
        element: '#nav-dashboard',
        popover: {
            title: 'Bienvenido a Stockee.',
            description: 'Este es tu panel principal. Aquí verás un resumen rápido de tus ventas, stock y eficiencia.',
            side: 'rigth',
            aligne: 'start'
        },
    },
    {
        element: '#nav-sales',
        popover: {
            title: 'Ventas',
            description: 'Registra las ventas del día. El stock se actualiza automáticamente al añadir una venta.',
            side: 'rigth',
            aligne: 'start'
        },
    },
    {
        element: '#nav-dishes',
        popover: {
            title: 'Platos',
            description: 'Crea y edita tus platos, asocia ingredientes y gestiona tu carta.',
            side: 'right',
            aligne: 'start',
        },

    },
    {
        element: '#nav-stock',
        popover: {
            title: 'Gestión de stock',
            description: 'Controla tus ingredientes, sus cantidades y alertas de stock mínimo.',
            side: 'rigth',
            aligne: 'start'
        },
    },
    {
        element: '#nav-order',
        popover: {
            title: 'Pedidos',
            description: 'Genera pedidos recomendados según tu stock actual y el uso semanal de ingredientes.',
            side: 'rigth',
            aligne: 'start',
        },
    },
    {
        element: '#nav-analytics',
        popover: {
            title: '📊 Eficiencia',
            description: 'Analiza el desperdicio, la eficiencia por producto y registra mermas.',
            side: 'right',
            align: 'start',
        },
    },
    {
        popover: {
            titel: '¡Todo listo!',
            description: 'Ya conoces las secciones principales. Puedes empezar añadiendo tus primeros ingredientes en Stock.',
        },
    },
];

const useOnboarding = () => {
    const driverRef = useRef(null);

    useEffect(() => {
        const checkAndStartTour = async () => {
            try {
                const {data} = await axios.get('/api/users/onboarding-status');
                if (data.complete) return;

                driverRef.current = driver ({
                    showProgress: true,
                    progressText: '{{current}} de {{total}}',
                    nextBtnText: 'Sigueinte ->',
                    prevBtnText: '<- Anterior',
                    doneBtnText: '¡Empezar!',
                    steps: TOUR_STEPS,
                    onDestroyed: async = () => {
                        try {
                            await.axios.patch('/api/users/complete-onboarding');
                        } catch (err) {
                            console.error('Error al marcar onboarding como completado:', err);
                        }
                    },
                })

                setTimeout(() => {
                    driverRef.current.driver();
                }, 800);
            } catch (err) {
                console.error('Error al comprobar estado de onboarding:', err);
            }
        };

        checkAndStartTour();

        return () => {
            driverRef.current?.destroy();
        };
    }, []);
};

export default useOnboarding();