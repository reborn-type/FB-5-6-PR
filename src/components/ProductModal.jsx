import React, { useEffect, useState } from "react";

export default function ProductModal({open, mode, initialProduct, onClose, onSubmit}){
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [countInStock, setCountInStock] = useState("");
    
    useEffect(() => {
        if (!open) return; 
        setName(initialProduct?.name ?? "");
        setPrice(initialProduct?.price != null ? String(initialProduct.price) : "");
        setCategory(initialProduct?.category ?? "");
        setDescription(initialProduct?.description ?? "");
        setCountInStock(initialProduct?.countInStock != null ? String(initialProduct.countInStock) : "");
    }, [open, initialProduct])

    if (!open) return null; 

    const title = mode === "edit" ? "Редактирование товаров" : "Создание товара"; 

    const handleSubmit = (e) => {
        e.preventDefault();

        const trimmed_name = String(name).trim();
        const parsed_price = Number(price);
        const trimmed_category = category.trim();
        const trimmed_description = String(description).trim();
        const parsed_count = Number(countInStock);
        
        if (!trimmed_name) {
            alert("Введите название товара.");
            return;
        }

        if(!parsed_price) {
            alert("Введите цену.");
            return; 
        }

        if(!trimmed_category){
            alert("Выберите категорию товара.")
            return; 
        }

        if(!trimmed_description){
            alert("Введите описание (до 100 символов).")
            return; 
        }

        if (!parsed_count){
            alert("Введите количество товара.")
            return;
        }

        onSubmit({
            id: initialProduct?.id,
            name: trimmed_name,
            price: parsed_price,
            category: trimmed_category,
            description: trimmed_description,
            count: parsed_count,
        })
    }

return (
    <div className="backdrop" onMouseDown={onClose}>
        <div className="modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="modal__header">
            <div className="modal__title">{title}</div>
            <button className="iconBtn" onClick={onClose} arialabel="Закрыть">
                ✕
            </button>
        </div>

        <form className="form" onSubmit={handleSubmit}>
            <label className="label">
                Название
                <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Например, Marcelo Miracles Lazer Jacker"
                autoFocus
                />
            </label>

            <label className="label">
                Цена
                <input
                className="input"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Например, 1000"
                inputMode="numeric"
                />
            </label>

            <label className="label">
                Категория
            <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Выберите категорию</option>
                <option value="верхняя одежда">Верхняя одежда</option>
                <option value="низ">Низ</option>
                <option value="нижнее белье">Нижнее белье</option>
                <option value="аксессуары">Аксессуары</option>
                <option value="обувь">Обувь</option>
            </select>
            </label>

            <label className="label">
                Описание
                <input
                className="input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Например, Черная футболка [52 RU]"
                />
            </label>

            <label className="label">
                Количество
                <input
                className="input"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
                placeholder="Например, 23"
                inputMode="numeric"
                />
            </label>

            <div className="modal__footer">
                <button type="button" className="btn" onClick={onClose}>
                    Отмена
                </button>
                <button type="submit" className="btn btn--primary">
                    {mode === "edit" ? "Сохранить" : "Создать"}
                </button>
            </div>
        </form>
    </div>
</div>
);
};