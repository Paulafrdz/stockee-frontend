// Sales

export const salesTourSteps = [
    {
        element: '#sales-add-btn',
        popover: {
            title: 'Añadir venta',
            description: 'Para añadir los platos y las cantidades que hayas vendido en el día.',
            side: 'left',
            align: 'start',
        },
    },
];


// Stock

export const stockTourSteps = [
   
    {
        element: '#stock-badge-ok',
        popover: {
            title: 'Estado Ok',
            description: 'Verde significa que el stock está por encima del mínimo. Todo en orden.',
            side: 'top',
            aligne: 'start',
        },
    },
    {
        element: '#stock-badge-low',
        popover: {
            title: 'Estado Low',
            description: 'Naranja significa stock bajo — estás entre el mínimo y 1.5 veces el mínimo. Conviene reponer pronto.',
            side: 'top',
            align: 'start',
        },
    },
    {
        element: '#stock-badge-critical',
        popover: {
            title: 'Estado Crítico',
            description: 'Rosa/rojo significa stock crítico — estás por debajo del 50% del mínimo. Repón cuanto antes.',
            side: 'top',
            align: 'start',
        },
    },
    {
        element: '#stock-add-btn',
        popover: {
            title: 'Añadir ingrediente',
            description: 'Pulsa aquí para añadir un nuevo ingrediente al inventario. Puedes definir su stock actual y mínimo.',
            side: 'left',
            align: 'start',
        },
    },
];

// Dishes

export const dishesTourSteps = [
    {
        element: '#dishes-add-btn',
        popover: {
            title: 'Crear un plato',
            description: 'Pulsa aquí para crear un nuevo plato. Podrás darle nombre, icono y asociarle ingredientes del inventario.',
            side: 'left',
            align: 'start',
        },
    },
   
];

// Orders

export const orderTourSteps = [
    {
        element: '#order-submit-btn',
        popover: {
            title: 'Añadir ingrediente manualmente',
            description: 'Si necesitas añadir un ingrediente que no aparece en as recomendaciones, usa este botón.',
            side: 'left',
            align: 'start',
        },
    },
];

// Analytics

export const analyticsTourSteps = [
   
    {
        element: '#analytics-efficiency-table',
        popover: {
            title: 'Eficiencia por producto',
            desciption: 'Tabla con el rendimiento de cada ingrediente, que porcentaje se aprovecha vs. se desperdicia.',
            side: 'top',
            align: 'start',
        },
    },
    {
        element: '#analytics-add-btn',
        popover: {
            tittle: 'Registrar merma',
            description: 'Pulsa aquí para registrar un desperdicio. Esto alimenta los gráficos.',
            side: 'left',
            align: 'start',
        },
    },
];