import { Icon } from "./Icon";

export function FavoriteBar({ favoriteServices, showFavoriteNames, onSearch }) {
	return (
		<div className="mb-3 flex flex-wrap justify-center gap-2">
			{favoriteServices.map((service) => (
				<button
					key={service.id}
					type="button"
					className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white p-2 text-sm text-slate-700 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300"
					onClick={() => onSearch(service)}
					title={service.name}
				>
					<img
						src={service.icon}
						alt={service.name}
						className="h-5 w-5 object-contain"
					/>
					{showFavoriteNames && <span>{service.name}</span>}
				</button>
			))}
		</div>
	);
}
