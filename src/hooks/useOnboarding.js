import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import axios from 'axios';

const waitForElement = (selector, timeout = 3000) =>
    new Promise((resolve, reject) => {
        const el = document.querySelector(selector);
        if (el) return resolve(el);

        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                observer.disconnect();
                resolve(el);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Elemento ${selector} no encontrado en ${timeout}ms`));
        }, timeout);
    });

const navigateAndWait = async (navigate, path, elementSelector) => {
    navigate(path);
    if (elementSelector) {
        await waitForElement(elementSelector);
    }
    await new Promise(r => setTimeout(r, 300));
};

const useOnboarding = () => {
    const driverRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAndStartTour = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                const { data } = await axios.get(
                    'http://localhost:8080/api/users/onboarding-status',
                    { headers }
                );

                if (data.completed) return;

                const goNext = async (path, elementSelector) => {
                    await navigateAndWait(navigate, path, elementSelector);
                    driverRef.current?.moveNext();
                };

                const goPrev = async (path, elementSelector) => {
                    await navigateAndWait(navigate, path, elementSelector);
                    driverRef.current?.movePrevious();
                 }

                const steps = [
                    {
                        popover: {
                            title: 'Bienvenido a Stockee.',
                            description: 'Tu app de gestión de stock. En este tour rápido te enseñamos cómo empezar a sacarle partido, solo te llevará un par de minutos.',
                            align: 'center',
                            nextBtnText: 'Empezar tour →',
                            onNextClick: async () => {
                                await goNext('/stock', '#stock-add-btn');
                            },
                        },
                    },
                    {
                        element: '#stock-add-btn',
                        popover: {
                            title: 'Empieza por el stock',
                            description: 'Pulsa este botón para añadir tus primeros ingredientes: nombre, cantidad actual, mínimo y unidad.',
                            side: 'left',
                            align: 'start',
                            onNextClick: async () => {
                                await goNext('/dishes', '#dishes-add-btn');
                            },
                            onPrevClick: () => {
                                driverRef.current?.movePrevious();
                            },
                        },
                    },
                    {
                        element: '#dishes-add-btn',
                        popover: {
                            title: 'Crea tus platos',
                            description: 'Aquí defines tu carta. Cada plato lleva asociados los ingredientes del inventario así Stockee. sabe qué se consume.',
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
                    {
                        element: '#sales-add-btn',
                        popover: {
                            title: 'Registra tus ventas',
                            description: 'Cada vez que vendas un plato, regístralo aquí. El stock de ingredientes se descuenta automáticamente.',
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
                    {
                        element: '#order-add-btn',
                        popover: {
                            title: 'Gestiona tus pedidos',
                            description: 'Cuando el stock baje, Stockee. te sugiere automáticamente qué pedir y en qué cantidad. También puedes añadir ingredientes manualmente.',
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
                    {
                        element: '#analytics-add-btn',
                        popover: {
                            title: 'Controla el desperdicio',
                            description: 'Aquí registras mermas y ves gráficas de eficiencia por producto. Cuanto más registres, más útil se vuelve esta sección.',
                            side: 'left',
                            align: 'start',
                            onNextClick: () => {
                                driverRef.current?.moveNext();
                            },
                            onPrevClick: async () => {
                                await goPrev('/order', '#order-add-btn');
                            },
                        },
                    },
                    {
                        popover: {
                            title: '¡Ya estás listo!',
                            description: 'Empieza añadiendo tus ingredientes en Stock y crea tu primer plato.',
                            align: 'center',
                            doneBtnText: '¡Empezar!',
                            onPrevClick: async () => {
                                await goPrev('/analytics', '#analytics-add-btn');
                            },
                        },
                    },
                ];


                driverRef.current = driver({
                    stageRadius: 15,
                    stagePadding: 3,
                    showProgress: true,
                    progressText: '{{current}} de {{total}}',
                    nextBtnText: 'Siguiente →',
                    prevBtnText: '← Anterior',
                    doneBtnText: '¡Empezar!',
                    steps,
                    onDestroyed: async () => {
                        try {
                            await axios.patch(
                                'http://localhost:8080/api/users/complete-onboarding',
                                {},
                                { headers }
                            );
                        } catch (err) {
                            console.error('Error al marcar onboarding como completado:', err);
                        }
                    },
                });

                setTimeout(() => {
                    driverRef.current.drive();
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

export default useOnboarding;