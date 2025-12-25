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

// Головна сторінка
app.get('/', (req, res) => {
	res.send('TechZone API is running 🚀');
});

// Отримати всі товари
app.get('/api/products', async (req, res) => {
	try {
		const products = await prisma.product.findMany();
		res.json(products);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to fetch products' });
	}
});

// Отримати один товар за ID
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