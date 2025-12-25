import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PRODUCTS = [
	{
		name: 'Logitech G Pro X Superlight Black',
		slug: 'logitech-g-pro-x-superlight-black',
		price: 5999,
		oldPrice: 6499,
		category: 'Мишки',
		image: 'https://content1.rozetka.com.ua/goods/images/big/309983933.jpg',
		images: [
			'https://content1.rozetka.com.ua/goods/images/big/309983933.jpg',
			'https://content2.rozetka.com.ua/goods/images/big/309983934.jpg'
		],
		description: 'Найлегша і найшвидша бездротова ігрова миша.',
		inStock: true,
		rating: 4.9,
		reviews: 128,
		colors: [{ name: 'Black', hex: '#000000' }, { name: 'White', hex: '#ffffff' }],
		specs: { sensor: 'HERO 25K', weight: '63g' }
	},
	{
		name: 'Keychron K2 Pro Mechanical RGB',
		slug: 'keychron-k2-pro-mechanical-rgb',
		price: 4500,
		oldPrice: null,
		category: 'Клавіатури',
		image: 'https://content2.rozetka.com.ua/goods/images/big/323337966.jpg',
		images: ['https://content2.rozetka.com.ua/goods/images/big/323337966.jpg'],
		description: 'Бездротова механічна клавіатура з QMK/VIA.',
		inStock: true,
		rating: 4.8,
		reviews: 45,
		colors: [{ name: 'Grey', hex: '#2d3748' }],
		specs: { switches: 'Gateron', type: 'Mechanical' }
	},
	{
		name: 'HyperX Cloud Alpha Wireless',
		slug: 'hyperx-cloud-alpha-wireless',
		price: 7200,
		oldPrice: null,
		category: 'Навушники',
		image: 'https://content2.rozetka.com.ua/goods/images/big/11547900.jpg',
		images: ['https://content2.rozetka.com.ua/goods/images/big/11547900.jpg'],
		description: 'До 300 годин роботи від одного заряду.',
		inStock: true,
		rating: 4.7,
		reviews: 89,
		colors: [{ name: 'Black/Red', hex: '#000000' }],
		specs: { battery: '300h', driver: '50mm' }
	},
	{
		name: 'SteelSeries QcK Heavy XXL',
		slug: 'steelseries-qck-heavy-xxl',
		price: 1499,
		oldPrice: null,
		category: 'Аксесуари',
		image: 'https://content2.rozetka.com.ua/goods/images/big/10747043.jpg',
		images: ['https://content2.rozetka.com.ua/goods/images/big/10747043.jpg'],
		description: 'Легендарний килимок для миші.',
		inStock: true,
		rating: 4.8,
		reviews: 340,
		colors: [{ name: 'Black', hex: '#000000' }],
		specs: { size: 'XXL', thickness: '4mm' }
	}
];

async function main() {
	console.log('Start seeding...');

	// Очищаємо базу перед наповненням (щоб не було дублів)
	await prisma.orderItem.deleteMany();
	await prisma.order.deleteMany();
	await prisma.product.deleteMany();

	// Додаємо товари
	for (const product of PRODUCTS) {
		await prisma.product.create({
			data: product
		});
	}

	console.log('Seeding finished.');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});