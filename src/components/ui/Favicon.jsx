import { NavLink } from "react-router-dom";

export default function Favicon({ className }) {
	return (
		<NavLink
			to="/"
			className={`${className} text-lg flex items-center justify-center p-1 rounded-2xl`}
		>
			<img
				src="/core/TSOH-Favicon.png"
				alt="Go Home"
				className="w-fit aspect-square"
				draggable={false}
			/>
		</NavLink>
	);
}
