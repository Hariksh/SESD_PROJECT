const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');

class App {
    constructor() {
        this.app = express();
        this.config();
        this.setupDatabase();
        this.routes();
    }

    config() {
        dotenv.config();
        this.app.use(cors());
        this.app.use(express.json());
    }

    setupDatabase() {
        connectDB();
    }

    routes() {
        this.app.get('/', (req, res) => {
            res.send('OOP API is running...');
        });
        this.app.use('/api/auth', authRoutes);
        this.app.use('/api/products', productRoutes);
    }

    start() {
        const PORT = process.env.PORT || 5001;
        this.app.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        });
    }
}

const application = new App();
application.start();
