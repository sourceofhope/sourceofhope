import { Outlet, ScrollRestoration } from "react-router-dom";
import Header, { HeaderFlagContext } from "../structure/Header";
import Footer from "../structure/Footer";
import { Suspense, useState } from "react";
import Loader from "../structure/Loader";
import { StoreCartProvider } from "../../context/StoreCartContext";

export default function AppLayout() {
	const [isBlocking, setIsBlocking] = useState(false);
	const [bannerActive, setBannerActive] = useState(false);

	return (
		<HeaderFlagContext.Provider
			value={{ bannerActive, setBannerActive, isBlocking, setIsBlocking }}
		>
			<StoreCartProvider>
				<Header />
				<main className="w-full min-h-screen text-sm md:text-md lg:text-lg">
					<Suspense fallback={<Loader />}>
						<Outlet />
					</Suspense>
					<ScrollRestoration getKey={(location) => location.pathname} />
				</main>
				<Footer />
			</StoreCartProvider>
		</HeaderFlagContext.Provider>
	);
}
