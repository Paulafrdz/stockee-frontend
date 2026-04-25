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
    {
        element: '#sales-table',
        popover: {
            title: 'Lista de platos vendidos',
            description: 'Aquí se muestran todos los platos vendidos, al final del dia la tabla se limpia sola y se añade al historial de ventas.',
            side: 'top',
            align: 'start',
        },
    },
];


// Stock

export const stockTourSteps = [
    {
        element: '#stock-table',
        popover: {
            title: 'Tabla de ingredientes',
            description: 'Aquí ves todos tus ingredientes con su stock actual, mínimo y unidad.',
            side: 'top',
            aligne: 'start',
        },
    },
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
    {
        element: '#dishes-grid',
        popover: {
            title: 'Tus platos',
            description: 'Cada card representa un pplato de tu carta. El color del borde indica si tiene  ingredientes con stock bajo.',
            side: 'top',
            align: 'start',
        },
    },
    {
        element: '#dishes-card-first',
        popover: {
            title: 'Detalle de la card',
            description: 'Haz click en cualquier plato para ver sus ingredientes y su esta de stock en detalle. Desde ahí puedes editarlo.',
            side: 'rigth',
            align: 'start',
        },
    },
];

// Orders

export const orderTourSteps = [
    {
        element: '#order-tabs',
        popover: {
            title: 'Recomendaciones e historial',
            desciption: 'En "Recomendaciones" verás qué ingredientes necesitas reponer según tu stock actual. En "Historial" están todos los pedidos que has realizado.',
            side: 'bottom',
            align: 'start',
        },
    },
    {
        element: '#order-table',
        popover: {
            title: 'Lista de ingredientes a pedir',
            descripcion: 'Stockee. calcula automáticamente la cantidad recomendada, Puedes ajustarla con los botones + y - de cada fila.',
            side: 'top',
            align: 'start',
        },
    },
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
        element: '#analytics-stats',
        popover: {
            title: 'Resuemn de eficiencia',
            descriptio: 'Aquí ves de un vistazo tu eficiencia global, el desperdicio total y los productos con peor rendimiento.',
            side: 'bottom',
            align: 'start',
        },
    },
    {
        element: '#analytics-pie-chart',
        popover: {
            title: 'Causas de desperdicio',
            description: 'Este gráfico muestra de qué tipo son tus mermas: caducidad, errores de preparación, merma natural, etc.',
            side: 'rigth',
            align: 'start',
        },
    },
    {
        element: '#analytics-trend-chart',
        popover: {
            title: 'Tendencia semanal',
            description: 'Evolución del desperdico a lo largo del tiempo. Te ayuda a detectar si estás mejorando o empeorando.',
            side: 'left',
            align: 'start',
        },
    },
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