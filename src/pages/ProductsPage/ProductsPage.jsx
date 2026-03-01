import React, {useEffect, useState} from 'react'; 
import "./ProductsPage.css"; 


import ProductsList from "../../components/ProductsList.jsx";
import ProductModal from "../../components/ProductModal.jsx";
import {api} from "../../api/index"

export default function ProductsPage() {
    const [products, setProducts] = useState([]);

    //  {id: 1, name: "Джерси-футболка casher", price: "3500", category: "Верхняя одежда", description: "Черно-белая", countInStock: 3},
    //   {id: 2, name: "Джерси casher", price: "6500", category: "Верхняя одежда", description: "Черная", countInStock: 1},
     //   {id: 3, name: "Шорты casher", price: "4500", category: "Шорты", description: "Бело-зеленые", countInStock: 12},

    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [modalMode, setModalMode] = useState("create");
    const [editingProduct, setEditingProduct] = useState(null);


    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await api.getProducts();
            setProducts(data);
        } catch (err) {
            console.error(err);
            alert("Ошибка загрузки товаров");
        } finally {
            setLoading(false);
        }
    };

    const openCreate = () => {
        setModalMode("create");
        setEditingProduct(null);
        setModalOpen(true);
    };
    
    const openEdit = (user) => {
        setModalMode("edit");
        setEditingProduct(user);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingProduct(null);
    };

    const handleDelete = async (id) => {
        const ok = window.confirm("Удалить товар?");
        if (!ok) return;
        try {
            await api.deleteProduct(id);
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error(err);
            alert("Ошибка удаления");
        }
    };

    const handleSubmitModal = async (payload) => {
        try {
            if (modalMode === "create") {
                const newProduct = await api.createProduct(payload);
                setProducts((prev) => [ ...prev, newProduct]);
            } else {
                const updatedProduct = await api.updateProduct(payload.id, payload);
                setProducts((prev) =>
                    prev.map((p) => (p.id === payload.id ? updatedProduct : p))
                );
            }
            closeModal();
        } catch (err) {
            console.error(err);
            alert("Ошибка сохранения товара.");
        }
    }

    return (
        <div className="page">
            <header className="header">
                <div className="header__inner">
                    <div className="brand">Products App</div>
                    <div className="header__right">React</div>
                </div>
            </header>

            <main className="main">
                <div className="container">
                    <div className="toolbar">
                    <h1 className="title">Товары</h1>
                    <button className="btn btn--primary" onClick={openCreate}>
                        + Создать
                    </button>
                </div>

                {loading ? (
                    <div className="empty">Загрузка...</div>
                ) : (
                    <ProductsList products={products} onEdit={openEdit} onDelete={handleDelete} />
                )}

                </div>
            </main>

            <footer className="footer">
                <div className="footer__inner">© {new Date().getFullYear()} Clothes Store App</div>
            </footer>
            <ProductModal open={modalOpen} mode={modalMode} 
                    initialProduct={editingProduct} 
                    onClose={closeModal} 
                    onSubmit={handleSubmitModal}
            />
        </div>
    );
};

