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
// 1. Отримати профіль
app.get('/api/user/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
	try {
		// Додаємо перевірку на існування req.user
		if (!req.user) return res.sendStatus(403);

		const user = await prisma.user.findUnique({
			where: { id: req.user.userId },
			select: { name: true, email: true, phone: true, address: true }
		});
		res.json(user);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch profile' });
	}
});

// 2. Оновити профіль
app.put('/api/user/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
	const { name, phone, address } = req.body;
	try {
		if (!req.user) return res.sendStatus(403);

		const updatedUser = await prisma.user.update({
			where: { id: req.user.userId },
			data: { name, phone, address }
		});
		res.json(updatedUser);
	} catch (error) {
		res.status(500).json({ error: 'Failed to update profile' });
	}
});

// 3. Отримати замовлення
app.get('/api/user/orders', authenticateToken, async (req: AuthRequest, res: Response) => {
	try {
		if (!req.user) return res.sendStatus(403);

		const orders = await prisma.order.findMany({
			where: { userId: req.user.userId },
			include: { items: { include: { product: true } } },
			orderBy: { createdAt: 'desc' }
		});
		res.json(orders);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch orders' });
	}
});

// 4. Створити нове замовлення (Для користувачів ТА гостей)
app.post('/api/orders', async (req: Request, res: Response) => {
	const { items, total, contactInfo } = req.body;

	let userId: number | null = null;

	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (token) {
		try {
			const decoded: any = jwt.verify(token, JWT_SECRET);
			userId = decoded.userId;
		} catch (e) {
			console.log("Token invalid or expired, proceeding as guest");
		}
	}

	try {
		const order = await prisma.order.create({
			data: {
				// --- ВИПРАВЛЕННЯ ТУТ ---
				// Якщо userId === null, ми передаємо undefined, що задовольняє типи Prisma
				userId: userId ?? undefined,

				total: Number(total),
				status: 'processing',
				name: contactInfo?.name || "",
				phone: contactInfo?.phone || "",
				address: contactInfo?.address || "",
				items: {
					create: items.map((item: any) => ({
						productId: Number(item.id),
						quantity: Number(item.quantity),
						price: Number(item.price)
					}))
				}
			}
		});
		res.json(order);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to create order' });
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