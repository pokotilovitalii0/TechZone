import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
	const { pathname } = useLocation();

	useEffect(() => {
		// Миттєвий скрол вгору при зміні маршруту
		window.scrollTo(0, 0);
	}, [pathname]);

	return null;
};

export default ScrollToTop;