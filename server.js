
const express = require('express');
const http = require('http');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send("Product Inventory Management API is Running!");
});
let products = [
    { id: 1, name: "Laptop", price: 55000, category: "Electronics" },
    { id: 2, name: "Mobile", price: 25000, category: "Electronics" },
    { id: 3, name: "Keyboord", price: 1500, category: "Accessories" }
];
app.get('/products', (req, res) => {
    res.json(products);
});

app.get('/products/:id', (req, res) => {
    const product = products.find(
        p => p.id === Number(req.params.id)
    );

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
});

app.post('/products', (req, res) => {
    const { name, price, category } = req.body;

    if (!name || price === undefined || !category ||
        Number(price) <= 0 || !Number.isFinite(Number(price))) {
        return res.status(400).json({
            message: "Enter valid name, price and category"
        });
    }

    const newProduct = {
        id: products.length
            ? Math.max(...products.map(p => p.id)) + 1
            : 1,
        name,
        price: Number(price),
        category
    };

    products.push(newProduct);

    res.status(201).json({
        message: "Product added successfully",
        product: newProduct
    });
});

app.put('/products/:id', (req, res) => {
    const product = products.find(
        p => p.id === Number(req.params.id)
    );

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    const { name, price, category } = req.body;

    if (!name || !category || price === undefined ||
        Number(price) <= 0 || !Number.isFinite(Number(price))) {
        return res.status(400).json({
            message: "Enter valid name, price and category"
        });
    }

    product.name = name;
    product.price = Number(price);
    product.category = category;

    res.json({
        message: "Product updated successfully",
        product
    });
});

app.delete('/products/:id', (req, res) => {
    const index = products.findIndex(
        p => p.id === Number(req.params.id)
    );

    if (index === -1) {
        return res.status(404).json({ message: "Product not found" });
    }

    const deletedProduct = products.splice(index, 1);

    res.json({
        message: "Product deleted successfully",
        product: deletedProduct[0]
    });
});

const server = http.createServer(app);

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
