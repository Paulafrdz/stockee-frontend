import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import DashboardLayout from '../components/dashboardLayout/DashboardLayout';
import CreateDishModal from '../components/createDishModal/CreateDishModal';
import DishDetailModal from '../components/dishDetailModal/DishDetailModal';
import DishCard from '../components/dishCard/DishCard';
import FloatingButton from '../components/floatingButton/FloatingButton';
import { getStockItems } from '../services/stockService';
import { createDish, getAllDishes, deleteDish, updateDish } from '../services/dishService';
import './DishPage.css';

const DishPage = ({ user }) => {
    const [dishes, setDishes]         = useState([]);
    const [stockItems, setStockItems] = useState([]);
    const [isLoading, setIsLoading]   = useState(true);

    // CreateDishModal 
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingDish, setEditingDish]             = useState(null); 

    // DishDetailModal
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedDish, setSelectedDish]           = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

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

    // Create 
    const handleOpenCreate = () => {
        setEditingDish(null);
        setIsCreateModalOpen(true);
    };

    // Detail 
    const handleViewDetails = (dish) => {
        setSelectedDish(dish);
        setIsDetailModalOpen(true);
    };

    const handleCloseDetail = () => {
        setIsDetailModalOpen(false);
        setSelectedDish(null);
    };

    // Edit 

    const handleEdit = (dish) => {
        setEditingDish(dish);
        setIsDetailModalOpen(false); // Close detail first
        setIsCreateModalOpen(true);
    };

    // Submit 

    const handleSubmitDish = async (dishData) => {
        try {
            if (editingDish) {
                const updated = await updateDish(editingDish.id, dishData);
                setDishes(prev => prev.map(d => d.id === updated.id ? updated : d));
            } else {
                const saved = await createDish(dishData);
                setDishes(prev => [...prev, saved]);
            }
            setIsCreateModalOpen(false);
            setEditingDish(null);
        } catch (error) {
            console.error('❌ Error saving dish:', error);
            throw error; // Let the modal display the error
        }
    };

    const handleCloseCreate = () => {
        setIsCreateModalOpen(false);
        setEditingDish(null);
    };

    // Delete

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

                {isLoading && (
                    <div className="dish-page-loading">Cargando platos...</div>
                )}

                {!isLoading && dishes.length === 0 && (
                    <div className="dish-page-empty">
                        <p className="dish-page-empty-title">Aún no hay platos</p>
                        <p className="dish-page-empty-subtitle">
                            Pulsa el botón + para crear tu primer plato.
                        </p>
                    </div>
                )}

                {!isLoading && dishes.length > 0 && (
                    <div className="dc-grid">
                        {dishes.map(dish => (
                            <DishCard
                                key={dish.id}
                                dish={dish}
                                inventoryItems={stockItems}
                                onViewDetails={handleViewDetails}
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
                onClick={handleOpenCreate}
            />

            {/* Detail modal */}
            <DishDetailModal
                isOpen={isDetailModalOpen}
                onClose={handleCloseDetail}
                onEdit={handleEdit}
                dish={selectedDish}
                inventoryItems={stockItems}
            />

        
            <CreateDishModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseCreate}
                onSubmit={handleSubmitDish}
                inventoryItems={stockItems}
                initialData={editingDish}
            />

        </DashboardLayout>
    );
};

export default DishPage;