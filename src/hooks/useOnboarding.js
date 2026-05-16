import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

let globalDriver = null;
let isOnboardingRunning = false;
let onboardingCompleted = false;

const waitForElement = (selector, timeout = 3000) =>
    new Promise((resolve, reject) => {
        const el = document.querySelector(selector);

        if (el) return resolve(el);

        const observer = new MutationObserver(() => {
            const found = document.querySelector(selector);

            if (found) {
                observer.disconnect();
                resolve(found);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Elemento ${selector} no encontrado`));
        }, timeout);
    });

const navigateAndWait = async (navigate, path, selector) => {
    navigate(path);

    if (selector) {
        await waitForElement(selector);
    }

    await new Promise(r => setTimeout(r, 300));
};

const useOnboarding = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Evitar doble instancia
        if (isOnboardingRunning) return;

        const checkAndStartTour = async () => {
            const token = localStorage.getItem('token');

            if (!token) return;

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            try {
                const { data } = await axios.get(
                    `${API_URL}/api/users/onboarding-status`,
                    { headers }
                );

                // Ya completado
                if (data.completed) return;

                // Ya corriendo
                if (isOnboardingRunning) return;

                onboardingCompleted = false;

                const goNext = async (path, selector) => {
                    await navigateAndWait(navigate, path, selector);
                    globalDriver?.moveNext();
                };

                const goPrev = async (path, selector) => {
                    await navigateAndWait(navigate, path, selector);
                    globalDriver?.movePrevious();
                };

                const steps = [
                    // 1 ─ Bienvenida
                    {
                        popover: {
                            title: 'Bienvenido a Stockeo',
                            description:
                                'Tu app de gestión de stock. En este tour rápido te enseñamos cómo empezar a sacarle partido.',
                            align: 'center',
                            nextBtnText: 'Empezar tour →',

                            onNextClick: async () => {
                                await goNext('/stock', '#stock-add-btn');
                            },
                        },
                    },

                    // 2 ─ Stock
                    {
                        element: '#stock-add-btn',

                        popover: {
                            title: 'Empieza por el stock',
                            description:
                                'Añade tus ingredientes: nombre, cantidad actual, mínimo y unidad.',

                            side: 'left',
                            align: 'start',

                            onNextClick: async () => {
                                await goNext('/dishes', '#dishes-add-btn');
                            },

                            onPrevClick: () => {
                                globalDriver?.movePrevious();
                            },
                        },
                    },

                    // 3 ─ Platos
                    {
                        element: '#dishes-add-btn',

                        popover: {
                            title: 'Crea tus platos',
                            description:
                                'Asocia ingredientes a cada plato para descontar stock automáticamente.',

                            side: 'left',
                            align: 'start',

                            onNextClick: async () => {
                                await goNext('/sales', '#sales-add-btn');
                            },

                            onPrevClick: async () => {
                                await goPrev('/stock', '#stock-add-btn');
                            },
                        },
                    },

                    // 4 ─ Ventas
                    {
                        element: '#sales-add-btn',

                        popover: {
                            title: 'Registra tus ventas',
                            description:
                                'Cada venta descuenta ingredientes automáticamente del inventario.',

                            side: 'left',
                            align: 'start',

                            onNextClick: async () => {
                                await goNext('/order', '#order-add-btn');
                            },

                            onPrevClick: async () => {
                                await goPrev('/dishes', '#dishes-add-btn');
                            },
                        },
                    },

                    // 5 ─ Pedidos
                    {
                        element: '#order-add-btn',

                        popover: {
                            title: 'Gestiona pedidos',
                            description:
                                'Stockeo te ayuda a saber cuándo y cuánto pedir.',

                            side: 'left',
                            align: 'start',

                            onNextClick: async () => {
                                await goNext('/analytics', '#analytics-add-btn');
                            },

                            onPrevClick: async () => {
                                await goPrev('/sales', '#sales-add-btn');
                            },
                        },
                    },

                    // 6 ─ Analytics
                    {
                        element: '#analytics-add-btn',

                        popover: {
                            title: 'Controla el desperdicio',
                            description:
                                'Registra mermas y analiza eficiencia y pérdidas.',

                            side: 'left',
                            align: 'start',

                            onNextClick: () => {
                                globalDriver?.moveNext();
                            },

                            onPrevClick: async () => {
                                await goPrev('/order', '#order-add-btn');
                            },
                        },
                    },

                    // 7 ─ Final
                    {
                        popover: {
                            title: '¡Ya estás listo!',
                            description:
                                'Empieza añadiendo ingredientes y creando tus primeros platos.',

                            align: 'center',
                            doneBtnText: '¡Empezar!',

                            onNextClick: async () => {
                                onboardingCompleted = true;

                                try {
                                    await axios.patch(
                                        `${API_URL}/api/users/complete-onboarding`,
                                        {},
                                        { headers }
                                    );

                                    console.log('✅ Onboarding completado');
                                } catch (err) {
                                    console.error(
                                        '❌ Error completando onboarding:',
                                        err
                                    );
                                }

                                isOnboardingRunning = false;

                                globalDriver?.destroy();
                            },

                            onPrevClick: async () => {
                                await goPrev('/analytics', '#analytics-add-btn');
                            },
                        },
                    },
                ];

                globalDriver = driver({
                    stageRadius: 15,
                    stagePadding: 3,

                    showProgress: true,
                    progressText: '{{current}} de {{total}}',

                    nextBtnText: 'Siguiente →',
                    prevBtnText: '← Anterior',
                    doneBtnText: '¡Empezar!',

                    allowClose: true,

                    steps,

                    onDestroyed: () => {
                        if (!onboardingCompleted) {
                            console.log(
                                '⛔ Onboarding cerrado antes de completarse'
                            );
                        }

                        isOnboardingRunning = false;
                    },
                });

                isOnboardingRunning = true;

                setTimeout(() => {
                    globalDriver?.drive();
                }, 800);

            } catch (err) {
                console.error(
                    '❌ Error comprobando onboarding:',
                    err
                );
            }
        };

        checkAndStartTour();

        return () => {};
    }, []);
};

export default useOnboarding;