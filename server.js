const express = require('express');
const mysql = require('mysql2'); // FIXED: Sirf ek baar rakha hai ab
const cors = require('cors');
const path = require('path'); // 🛠️ NEW: Path module added for safe HTML rendering
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Database Connection Pool
// Single URL se database connect karne ka tarika
const db = mysql.createPool({
    uri: process.env.DATABASE_URL, // Yeh apne aap poori string read kar lega
    ssl: {
        rejectUnauthorized: false
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
db.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Database connection failed:", err.message);
    } else {
        console.log("MySQL Connected Successfully via URL 🚀");
        connection.release();
    }
});
// 🛠️ FIXED ROUTE: Serve frontend views safely using path.join
app.get('/admin-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// ==========================================
// PRODUCTS CRUD + STOCK TOGGLE APIS
// ==========================================
// PRODUCTS GET API (FINAL FIXED)
// FINAL HARD-FIX ROUTE
app.get('/api/products', (req, res) => {
    db.query(
        'SELECT * FROM products WHERE is_deleted = 0 ORDER BY id DESC',
        (err, results) => {

            if (err) {
                console.log(err);
                return res.status(500).json({ error: err.message || err });
            }

            res.json(results);
        }
    );
});

app.post('/api/admin/products', (req, res) => {
    const { category_id, name, price, image_url } = req.body;
    db.query('INSERT INTO products (category_id, name, price, image_url) VALUES (?, ?, ?, ?)', [category_id, name, price, image_url], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Product created", id: result.insertId });
    });
});

app.put('/api/admin/products/:id', (req, res) => {
    const { category_id, name, price, image_url } = req.body;
    db.query('UPDATE products SET category_id = ?, name = ?, price = ?, image_url = ? WHERE id = ?', [category_id, name, price, image_url, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Product updated successfully" });
    });
});

app.patch('/api/admin/products/:id/toggle-stock', (req, res) => {
    db.query('UPDATE products SET is_available = NOT is_available WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Stock visibility altered" });
    });
});

app.delete('/api/admin/products/:id', (req, res) => {
    db.query('UPDATE products SET is_deleted = 1 WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Product archived successfully" });
    });
});

// ==========================================
// CATEGORIES & ORDERS APIS
// ==========================================

// 📁 FIXED: Send all category details including image_url
app.get('/api/categories', (req, res) => {
    db.query('SELECT * FROM categories ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 📁 FIXED: Accept and save image_url from Admin Dashboard Category Manager Form
app.post('/api/admin/categories', (req, res) => {
    const { name, image_url } = req.body;
    db.query('INSERT INTO categories (name, image_url) VALUES (?, ?)', [name, image_url], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Saved successfully", id: result.insertId });
    });
});

app.delete('/api/admin/categories/:id', (req, res) => {
    db.query('DELETE FROM categories WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Deleted" });
    });
});

app.get('/api/admin/orders', (req, res) => {
    db.query('SELECT * FROM orders ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.patch('/api/admin/orders/:id/status', (req, res) => {
    db.query('UPDATE orders SET status = ? WHERE id = ?', [req.body.status, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Status shifted" });
    });
});

// ==========================================
// OFFERS MANAGEMENT WITH LIVE DATE LOGIC
// ==========================================
app.post('/api/admin/offers', (req, res) => {
    const { title, discount_percentage, start_date, end_date } = req.body;
    db.query('INSERT INTO offers (title, discount_percentage, start_date, end_date) VALUES (?, ?, ?, ?)', [title, discount_percentage, start_date, end_date], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Offer active" });
    });
});

app.get('/api/admin/offers', (req, res) => {
    db.query('SELECT * FROM offers ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/api/offers/active', (req, res) => {
    db.query('SELECT * FROM offers WHERE CURDATE() >= start_date AND CURDATE() <= end_date', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.delete('/api/admin/offers/:id', (req, res) => {
    db.query('DELETE FROM offers WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Purged" });
    });
});

app.get("/", (req, res) => {
    res.send("Backend is running successfully 🚀");
});

// Render variable detect karne ke liye 10000 port fallback rakha hai
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});