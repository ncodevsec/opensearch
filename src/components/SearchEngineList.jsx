import { Icon } from "./Icon";

export function SearchEngineList({
	sections,
	layout,
	expandedSections,
	pinnedIds,
	togglePin,
	handleSearch,
	toggleSectionExpansion,
}) {
	return (
		<>
			{sections.map((section) => {
				const isExpanded = expandedSections[section.title];
				const displayedServices =
					layout === "compact" || isExpanded
						? section.forms
						: section.forms.slice(0, 4);
				const hasMore = layout === "grid" && section.forms.length > 4;

				return (
					<div
						key={section.title}
						className="space-y-2 rounded-3xl border border-slate-200 bg-white px-2 py-2 shadow-sm"
					>
						<h2 className="p-2  text-center text-base font-semibold text-slate-800">
							{section.title}
						</h2>
						<div
							className={
								layout === "compact"
									? "flex flex-wrap justify-center gap-2"
									: "flex flex-col gap-2"
							}
						>
							{displayedServices.map((service) => {
								const serviceId = `${section.title}:${service.name}`;
								const isPinned = pinnedIds.includes(serviceId);

								return (
									<div
										key={serviceId}
										className="flex items-center gap-2"
									>
										<div className="flex w-full items-center justify-between gap-2 rounded-full bg-white hover:bg-slate-100">
											<button
												type="button"
												className="flex flex-1 items-center gap-2 rounded-full p-1 pl-2 text-left text-sm text-slate-700 transition focus:outline-none focus:ring-2 focus:ring-slate-300"
												onClick={() =>
													handleSearch({
														...service,
														id: serviceId,
													})
												}
											>
												<img
													src={service.icon}
													alt={service.name}
													className="h-5 w-5 object-contain"
												/>
												<span>{service.name}</span>
											</button>
											<button
												type="button"
												className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition ${isPinned ? "text-amber-500 hover:bg-slate-200" : "text-slate-400 hover:bg-amber-100 hover:text-amber-400"}`}
												onClick={() =>
													togglePin(serviceId)
												}
												aria-label={
													isPinned
														? `Remove ${service.name} from favorites`
														: `Add ${service.name} to favorites`
												}
												title={
													isPinned
														? "Unpin from favorites"
														: "Pin to favorites"
												}
											>
												{isPinned ? (
													<Icon
														name="fa-star"
														className="text-base"
													/>
												) : (
													<Icon
														name="fa-regular fa-star"
														className="text-base"
													/>
												)}
											</button>
										</div>
									</div>
								);
							})}
							{hasMore && (
								<button
									type="button"
									className="flex w-full items-center justify-center gap-2 rounded-full border border-dashed border-slate-300 p-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
									onClick={() =>
										toggleSectionExpansion(section.title)
									}
								>
									{isExpanded ? (
										<>
											<span>Show less</span>
											<Icon
												name="fa-chevron-up"
												className="text-xs"
											/>
										</>
									) : (
										<>
											<span>
												Show {section.forms.length - 4}{" "}
												more
											</span>
											<Icon
												name="fa-chevron-down"
												className="text-xs"
											/>
										</>
									)}
								</button>
							)}
						</div>
					</div>
				);
			})}
		</>
	);
}
