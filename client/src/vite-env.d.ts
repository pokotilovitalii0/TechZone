/// <reference types="vite/client" />

/* Додай це, якщо імпортуєш зображення вручну */
declare module '*.png' {
	const value: string;
	export default value;
}
declare module '*.jpg' {
	const value: string;
	export default value;
}
declare module '*.jpeg' {
	const value: string;
	export default value;
}
declare module '*.webp' {
	const value: string;
	export default value;
}