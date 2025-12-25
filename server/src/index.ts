import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

app.use(cors());
app.use(express.json());

// --- MIDDLEWARE: Перевірка токена ---
interface AuthRequest extends Request {
	user?: { userId: number; role: string };
}

const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

	if (!token) return res.sendStatus(401);

	jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
		if (err) return res.sendStatus(403);
		req.user = user;
		next();
	});
};

// --- ROUTES ---

app.get('/', (req, res) => {
	res.send('TechZone API is running 🚀');
});

// AUTH
app.post('/api/auth/register', async (req, res) => {
	const { email, password, name } = req.body;
	try {
		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) return res.status(400).json({ error: 'User already exists' });

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: { email, name, password: hashedPassword }
		});

		const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
		res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
	} catch (error) {
		res.status(500).json({ error: 'Registration failed' });
	}
});

app.post('/api/auth/login', async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user || !(await bcrypt.compare(password, user.password))) {
			return res.status(400).json({ error: 'Invalid email or password' });
		}

		const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
		res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
	} catch (error) {
		res.status(500).json({ error: 'Login failed' });
	}
});

// USER PROFILE (Захищені маршрути)
// Отримати профіль
app.get('/api/user/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: req.user?.userId },
			select: { name: true, email: true, phone: true, address: true }
		});
		res.json(user);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch profile' });
	}
});

// Оновити профіль
app.put('/api/user/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
	const { name, phone, address } = req.body;
	try {
		const updatedUser = await prisma.user.update({
			where: { id: req.user?.userId },
			data: { name, phone, address }
		});
		res.json(updatedUser);
	} catch (error) {
		res.status(500).json({ error: 'Failed to update profile' });
	}
});

// Отримати замовлення
app.get('/api/user/orders', authenticateToken, async (req: AuthRequest, res: Response) => {
	try {
		const orders = await prisma.order.findMany({
			where: { userId: req.user?.userId },
			include: { items: { include: { product: true } } },
			orderBy: { createdAt: 'desc' }
		});
		res.json(orders);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch orders' });
	}
});

// PRODUCTS
app.get('/api/products', async (req, res) => {
	try {
		const products = await prisma.product.findMany();
		res.json(products);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch products' });
	}
});

app.get('/api/products/slug/:slug', async (req, res) => {
	try {
		const product = await prisma.product.findUnique({ where: { slug: req.params.slug } });
		if (!product) return res.status(404).json({ error: 'Product not found' });
		res.json(product);
	} catch (error) {
		res.status(500).json({ error: 'Error fetching product' });
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});