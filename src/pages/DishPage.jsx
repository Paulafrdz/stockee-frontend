import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import DashboardLayout from '../components/dashboardLayout/DashboardLayout';
import CreateDishModal from '../components/createDishModal/CreateDishModal';
import DishCard from '../components/dishCard/DishCard';
import FloatingButton from '../components/floatingButton/FloatingButton';
import { getStockItems } from '../services/stockService';
import { createDish, getAllDishes, deleteDish } from '../services/dishService';
import './DishPage.css';

const DishPage = ({ user }) => {
    const [dishes, setDishes]           = useState([]);
    const [stockItems, setStockItems]   = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading]     = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    // Fetch dishes and stock items in parallel
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [dishesData, stockData] = await Promise.all([
                getAllDishes(),
                getStockItems(),
            ]);
            setDishes(dishesData);
            setStockItems(stockData);
        } catch (error) {
            console.error('❌ Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateDish = async (dishData) => {
        try {
            const savedDish = await createDish(dishData);
            console.log('✅ Dish created:', savedDish);
            setDishes(prev => [...prev, savedDish]); // Add to list without re-fetching
            setIsModalOpen(false);
        } catch (error) {
            console.error('❌ Error creating dish:', error);
            throw error; // Let the modal display the error
        }
    };

    const handleDelete = async (dishId) => {
        try {
            await deleteDish(dishId);
            setDishes(prev => prev.filter(d => d.id !== dishId));
        } catch (error) {
            console.error('❌ Error deleting dish:', error);
        }
    };

    return (
        <DashboardLayout
            user={user}
            activeTab="dish"
            title="Platos"
            subtitle="Gestiona los platos de tu restaurante"
        >
            <div className="dish-page">

                <div className="dish-page-header">
                    <h1 className="dish-page-title">Platos</h1>
                    <p className="dish-page-subtitle">
                        {dishes.length} {dishes.length === 1 ? 'plato' : 'platos'} registrados
                    </p>
                </div>

                {/* Loading state */}
                {isLoading && (
                    <div className="dish-page-loading">
                        Cargando platos...
                    </div>
                )}

                {/* Empty state */}
                {!isLoading && dishes.length === 0 && (
                    <div className="dish-page-empty">
                        <p className="dish-page-empty-title">Aún no hay platos</p>
                        <p className="dish-page-empty-subtitle">
                            Pulsa el botón + para crear tu primer plato.
                        </p>
                    </div>
                )}

                {/* Dish grid */}
                {!isLoading && dishes.length > 0 && (
                    <div className="dc-grid">
                        {dishes.map(dish => (
                            <DishCard
                                key={dish.id}
                                dish={dish}
                                inventoryItems={stockItems}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}

            </div>

            {/* Floating action button */}
            <FloatingButton
                icon={Plus}
                variant="primary"
                size="small"
                tooltip="Crear plato"
                onClick={() => setIsModalOpen(true)}
            />

            {/* Create dish modal */}
            <CreateDishModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateDish}
                inventoryItems={stockItems}
            />
        </DashboardLayout>
    );
};

export default DishPage;