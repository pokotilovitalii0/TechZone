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

// --- MIDDLEWARE ---
interface AuthRequest extends Request {
	user?: { userId: number; role: string };
}

const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) return res.sendStatus(401);

	jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
		if (err) return res.sendStatus(403);
		req.user = user;
		next();
	});
};

// Для адміна (залишаємо як було)
const authenticateAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) return res.sendStatus(401);

	jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
		if (err) return res.sendStatus(403);
		if (user.role !== 'ADMIN') return res.status(403).json({ error: 'Access denied' });
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

// USER PROFILE
app.get('/api/user/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
	try {
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

// ADMIN ORDERS
app.get('/api/admin/orders', authenticateAdmin, async (req: AuthRequest, res: Response) => {
	try {
		const orders = await prisma.order.findMany({
			include: { items: { include: { product: true } } },
			orderBy: { createdAt: 'desc' }
		});
		res.json(orders);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch orders' });
	}
});

app.put('/api/admin/orders/:id/status', authenticateAdmin, async (req: AuthRequest, res: Response) => {
	const { id } = req.params;
	const { status } = req.body;
	try {
		const order = await prisma.order.update({
			where: { id: Number(id) },
			data: { status }
		});
		res.json(order);
	} catch (error) {
		res.status(500).json({ error: 'Failed to update order' });
	}
});

// CREATE ORDER
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
			console.log("Guest checkout (token invalid or missing)");
		}
	}

	try {
		const order = await prisma.order.create({
			data: {
				userId: userId ?? undefined,
				total: Number(total),
				status: 'processing',
				name: contactInfo?.name || "Гість",
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

// --- ОНОВЛЕНИЙ МАРШРУТ ПРОДУКТІВ (ПОШУК) ---
app.get('/api/products', async (req, res) => {
	try {
		const { q } = req.query; // Отримуємо параметр ?q=...

		const where: any = {};

		// Якщо є параметр q, додаємо умови пошуку
		if (q) {
			where.OR = [
				// Шукаємо в назві (без урахування регістру)
				{ name: { contains: String(q), mode: 'insensitive' } },
				// Шукаємо в описі
				{ description: { contains: String(q), mode: 'insensitive' } },
				// Шукаємо в категорії
				{ category: { contains: String(q), mode: 'insensitive' } }
			];
		}

		const products = await prisma.product.findMany({
			where: where,
			orderBy: { createdAt: 'desc' } // Спочатку нові
		});

		res.json(products);
	} catch (error) {
		console.error(error);
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