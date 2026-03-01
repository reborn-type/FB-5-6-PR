const express = require('express');
const {nanoid} = require('nanoid');
const cors = require("cors");
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();
const PORT = 3001;

app.use(express.json());

app.use(cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));



let products = [
    {id: "abc123", name: "Кожанная куртка Guess", price: 12690, category: "jacket", description: "Материал: кожзам.", countInStock: 12},
    {id: "def232", name: "Куртка Homeless", price: 16990, category: "jacket", description: "Кол-во страз: 1000шт.", countInStock: 14}
]


const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API управления товарами в магазине одежды',
            version: '1.0.0',
            description: 'Простое API для управления товарами',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Локальный сервер',
            },
        ],
    },
    apis: ['/script.js'],
}

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`[${new Date().toISOString()}] [${req.method}] [${res.statusCode} / ${req.path}]`)
        if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
            console.log("Body:", req.body)
        }
    });
    next();
})

/**
* @swagger
* components:
*   schemas:
*       Product:
*           type: object
*           required:
*               - name
*               - price
*               - category
*               - description
*               - countInStock
*           properties:
*               id:
*                   type: string
*                   description: Автоматически сгенерированный уникальный ID товара длиной в 6 символов
*               name:
*                   type: string
*                   description: Название вещи
*               price:
*                   type: integer
*                   description: Стоимость вещи
*               category:
*                   type: string
*                   description: Категория вещи 
*               desrciption:
*                   type: string
*                   description: Описание вещи 
*               countInStock:
*                   type: integet
*                   description: Кол-во вещей доступных на сайте
*               example:
*                   id: "abc123"
*                   name: Guess Hoodie
*                   price: 16232
*                   category: верхняя одежда
*                   description: Черное кожанное худи
*                   countInStock: 121
*/


function findProductOr404(id, res){
    const product = products.find(p => p.id == id);
    if(!product){
        res.status(404).json({error: "Product not found."});
        return null; 
    }
    return product;
}

/**
* @swagger
* /api/products:
*   post:
*       summary: Создает новый товар
*       tags: [Products]
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       type: object
*                       required:
*                           - name
*                           - price          
*                           - category
*                           - description
*                           - countInStock
*                       properties:
*                           name:
*                               type: string
*                           price:
*                               type: integer
*                           category:
*                               type: string
*                           description:
*                               type: string
*                           countInStock:
*                               type: integer
*          responses:
*               201:
*                   description: Товар успешно создан
*                   content:
*                       application/json:
*                           schema:
*                               $ref: '#/components/schemas/Product'
*               400:
*                   description: Ошибка в теле запроса
*/
app.post("/api/products", (req, res) => {
    const {name, price, description, countInStock, category} = req.body;
    if (!category) {
        return res.status(400).json({ error: 'Категория обязательна' });
    }
    const newProduct = {
        id: nanoid(5), 
        name: name.trim(),
        price: price, 
        category: category.trim(),
        description: description.trim(),
        countInStock: countInStock
    }
    products.push(newProduct);
    res.status(201).json(newProduct)
});

/**
* @swagger
* /api/products:
*   get:
*       summary: Возвращает список всех товаров
*       tags: [Product]
*       responses:
*           200:
*               description: Список товаров
*               content:
*                   application/json:
*                       schema:
*                           type: array
*                           items:
*                               $ref: '#/components/schemas/Product'
*/
app.get("/api/products", (req,res) => {
    res.json(products);
})

/**
* @swagger
* /api/products/{id}:
*   get:
*       summary: Получает товара по ID
*       tags: [Product]
*       parameters:
*         - in: path
*           name: id
*           schema:
*               type: string
*           required: true
*           description: ID товара
*       responses:
*           200:
*               description: Данные товара
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Product'
*           404:
*               description: Товар не найден
*/
app.get("/api/products/:id", (req, res) => {
    const id = req.params.id; 
    const product = findProductOr404(id, res); 
    if(!product) {
        res.status(404).json("incorrect id or doesn't exist")
        return;
    }
    res.status(200).json(product); 
})

/**
* @swagger
* /api/products/{id}:
*   patch:
*       summary: Обновляет данные товара
*       tags: [Products]
*       parameters:
*         - in: path
*           name: id
*           schema:
*               type: string
*           required: true
*           description: ID товара
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       type: object
*                       properties:
*                           name:
*                               type: string
*                           price:
*                               type: integer
*                           category:
*                               type: string
*                           description:
*                               type: string
*                           countInStock:
*                               type: string
*       responses:
*           200:
*               description: Обновленный товар
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Product'
*           400:
*               description: Нет данных для обновления
*           404:
*               description: Товар не найден
*/
app.patch("/api/products/:id", (req, res) => {
    const id = req.params.id;
    const product = findProductOr404(id, res);
    if (!product) {
        res.status(404).json("incorrect id or doesn't exist")
        return;
    }

    if(req.body?.name === undefined && req.body?.price === undefined && req.body?.category === undefined && req.body?.description === undefined &&  req.body?.countInStock === undefined){
        return res.status(400).json({
            error: "Nothing to update",
        });
    }

    const {name, price, category, description, countInStock} = req.body;
    if(name !== undefined) product.name = name;
    if(price !== undefined) product.price = price;
    if(category !== undefined) product.category = category;
    if(description !== undefined) product.description = description;
    if(countInStock !== undefined) product.countInStock = countInStock;

    res.json(product)
})


/**
* @swagger
* /api/products/{id}:
*   delete:
*       summary: Удаляет товар
*       tags: [Products]
*       parameters:
*         - in: path
*           name: id
*           schema:
*               type: string
*           required: true
*           description: ID товара
*       responses:
*           204:
*               description: Товар успешно удален (нет тела ответа)
*           404:
*               description: Товар не найден
*/
app.delete("/api/products/:id", (req, res) => {
    const id = req.params.id; 
    const exists = products.some((p) => p.id === id)
    if(!exists) return res.status(404).json({error: "Product not found"});

    products = products.filter(p => p.id !== id);

    res.status(204).send();
});
 
app.use((req, res) => {
    res.status(404).json({error: "Not found"});
})

app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({error: "Internal server error"});
})

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`)
})
