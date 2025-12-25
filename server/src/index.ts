import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- ROUTES ---

// Головна
app.get('/', (req, res) => {
	res.send('TechZone API is running 🚀');
});

// 1. Отримати всі товари
app.get('/api/products', async (req, res) => {
	try {
		const products = await prisma.product.findMany();
		res.json(products);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to fetch products' });
	}
});

// 2. Отримати один товар за SLUG (для URL: /product/logitech-mouse)
app.get('/api/products/slug/:slug', async (req, res) => {
	const { slug } = req.params;
	try {
		const product = await prisma.product.findUnique({
			where: { slug: slug }
		});

		if (!product) {
			return res.status(404).json({ error: 'Product not found' });
		}

		res.json(product);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Something went wrong' });
	}
});

// 3. Отримати один товар за ID (резервний варіант)
app.get('/api/products/:id', async (req, res) => {
	const { id } = req.params;
	try {
		const product = await prisma.product.findUnique({
			where: { id: Number(id) }
		});

		if (!product) {
			return res.status(404).json({ error: 'Product not found' });
		}

		res.json(product);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Something went wrong' });
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});