import { useEffect, useMemo, useState } from "react";
import { defaultFavorites, sections } from "./data/searchEngineData";
import logoIcon from "./assets/open-search-192px.png";

const STORAGE_KEYS = {
	pinned: "searchHubPinnedServices",
	defaultService: "searchHubDefaultServiceId",
	theme: "searchHubThemePreference",
	layout: "searchHubLayoutPreference",
	todos: "searchHubTodoItems",
};

const allServices = sections.flatMap((section) =>
	section.forms.map((form) => ({
		...form,
		section: section.title,
		id: `${section.title}:${form.name}`,
	})),
);

const getDefaultPinnedIds = () =>
	allServices
		.filter((service) => defaultFavorites.includes(service.name))
		.map((service) => service.id);

const readStorage = (key, fallback) => {
	if (typeof window === "undefined") return fallback;
	try {
		const raw = window.localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
};

const writeStorage = (key, value) => {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(key, JSON.stringify(value));
	} catch {
		// ignore storage issues in restricted browsers
	}
};

const buildCalendarDays = (date) => {
	const year = date.getFullYear();
	const month = date.getMonth();
	const first = new Date(year, month, 1);
	const offset = (first.getDay() + 6) % 7;
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const previousMonthDays = new Date(year, month, 0).getDate();
	const cells = [];

	for (
		let index = 0;
		index < Math.ceil((offset + daysInMonth) / 7) * 7;
		index += 1
	) {
		if (index < offset) {
			const day = previousMonthDays - offset + index + 1;
			cells.push({
				label: day,
				date: new Date(year, month - 1, day),
				currentMonth: false,
			});
		} else if (index - offset < daysInMonth) {
			const day = index - offset + 1;
			cells.push({
				label: day,
				date: new Date(year, month, day),
				currentMonth: true,
			});
		} else {
			const day = index - offset - daysInMonth + 1;
			cells.push({
				label: day,
				date: new Date(year, month + 1, day),
				currentMonth: false,
			});
		}
	}

	return cells;
};

const getSystemDarkMode = () =>
	typeof window !== "undefined" &&
	window.matchMedia("(prefers-color-scheme: dark)").matches;

function App() {
	const [pinnedIds, setPinnedIds] = useState(() =>
		readStorage(STORAGE_KEYS.pinned, getDefaultPinnedIds()),
	);
	const [defaultServiceId, setDefaultServiceId] = useState(() =>
		readStorage(STORAGE_KEYS.defaultService, allServices[0].id),
	);
	const [theme, setTheme] = useState(() =>
		readStorage(STORAGE_KEYS.theme, "system"),
	);
	const [query, setQuery] = useState("");
	const [layout, setLayout] = useState(() =>
		readStorage(STORAGE_KEYS.layout, "grid"),
	);
	const [showSettings, setShowSettings] = useState(false);
	const [todos, setTodos] = useState(() =>
		readStorage(STORAGE_KEYS.todos, []),
	);
	const [todoInput, setTodoInput] = useState("");
	const [calendarDate, setCalendarDate] = useState(new Date());
	const [now, setNow] = useState(new Date());
	const [expandedSections, setExpandedSections] = useState({});

	const defaultService =
		allServices.find((service) => service.id === defaultServiceId) ||
		allServices[0];
	const isDarkTheme =
		theme === "dark" || (theme === "system" && getSystemDarkMode());

	useEffect(() => writeStorage(STORAGE_KEYS.pinned, pinnedIds), [pinnedIds]);
	useEffect(
		() => writeStorage(STORAGE_KEYS.defaultService, defaultServiceId),
		[defaultServiceId],
	);
	useEffect(() => writeStorage(STORAGE_KEYS.theme, theme), [theme]);
	useEffect(() => writeStorage(STORAGE_KEYS.layout, layout), [layout]);
	useEffect(() => writeStorage(STORAGE_KEYS.todos, todos), [todos]);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const apply = () =>
			document.documentElement.classList.toggle(
				"dark",
				theme === "dark" || (theme === "system" && mediaQuery.matches),
			);
		apply();
		mediaQuery.addEventListener?.("change", apply);
		return () => mediaQuery.removeEventListener?.("change", apply);
	}, [theme]);

	useEffect(() => {
		const interval = setInterval(() => setNow(new Date()), 30000);
		return () => clearInterval(interval);
	}, []);

	const favoriteServices = useMemo(
		() => allServices.filter((service) => pinnedIds.includes(service.id)),
		[pinnedIds],
	);
	const monthLabel = new Intl.DateTimeFormat("en-US", {
		month: "long",
		year: "numeric",
	}).format(calendarDate);
	const calendarDays = buildCalendarDays(calendarDate);

	const engineSuggestionPrefix = useMemo(() => {
		const match = query.match(/\s@([A-Za-z0-9_-]*)$/);
		return match ? match[1].trim() : "";
	}, [query]);

	const engineSuggestions = useMemo(() => {
		if (!engineSuggestionPrefix && !query.includes("@")) return [];
		const normalized = engineSuggestionPrefix.toLowerCase();
		return allServices
			.filter((service) =>
				service.name.toLowerCase().includes(normalized),
			)
			.slice(0, 6);
	}, [engineSuggestionPrefix, query]);

	const resolveSearchService = (rawQuery, fallback = defaultService) => {
		const trimmed = rawQuery.trim();
		if (!trimmed) return fallback;

		const match = trimmed.match(/\s@([A-Za-z0-9_-]*)$/);
		if (!match) return fallback;

		const token = match[1].trim().toLowerCase();
		if (!token) return fallback;

		// First, try to find an exact match or a service that starts with the token
		const candidate = allServices.find(
			(service) =>
				service.name.toLowerCase() === token ||
				service.name.toLowerCase().startsWith(token),
		);

		// If found, return it
		if (candidate) return candidate;

		// Otherwise, return the first suggestion if available
		if (engineSuggestions.length > 0) return engineSuggestions[0];

		return fallback;
	};

	const activeSearchService = resolveSearchService(query, defaultService);

	const handleSearch = (
		service = resolveSearchService(query, defaultService),
	) => {
		const trimmed = query.trim();
		if (!trimmed) return;

		const sanitizedQuery = trimmed
			.replace(/\s@([A-Za-z0-9_-]*)$/, "")
			.trim();
		const searchText = sanitizedQuery || trimmed;
		const url = service.template.replace(
			/\{q\}/gi,
			encodeURIComponent(searchText),
		);
		window.open(url, "_blank", "noopener,noreferrer");
	};

	const togglePin = (serviceId) => {
		setPinnedIds((current) =>
			current.includes(serviceId)
				? current.filter((id) => id !== serviceId)
				: [...current, serviceId],
		);
	};

	const addTodo = (event) => {
		event.preventDefault();
		if (!todoInput.trim()) return;
		setTodos((current) => [
			{
				id: crypto.randomUUID(),
				text: todoInput.trim(),
				completed: false,
			},
			...current,
		]);
		setTodoInput("");
	};

	const toggleTodo = (id) => {
		setTodos((current) =>
			current.map((todo) =>
				todo.id === id ? { ...todo, completed: !todo.completed } : todo,
			),
		);
	};

	const removeTodo = (id) => {
		setTodos((current) => current.filter((todo) => todo.id !== id));
	};

	const selectSuggestion = (service) => {
		const match = query.match(/\s@([A-Za-z0-9_-]*)$/);
		if (!match) {
			setQuery(`${query} @${service.name}`);
			return;
		}

		const position = query.lastIndexOf("@");
		const before = query.slice(0, position);
		setQuery(`${before} @${service.name}`);
	};

	const toggleSectionExpansion = (sectionTitle) => {
		setExpandedSections((current) => ({
			...current,
			[sectionTitle]: !current[sectionTitle],
		}));
	};

	const formattedClock = `${String(now.getHours() % 12 || 12).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} ${now.getHours() >= 12 ? "PM" : "AM"}`;
	const formattedDate = new Intl.DateTimeFormat("en-US", {
		weekday: "short",
		month: "short",
		day: "numeric",
	}).format(now);

	return (
		<div className={isDarkTheme ? "dark" : ""}>
			<div className="min-h-screen bg-slate-100 text-slate-900 transition-colors duration-200">
				<main className="mx-auto max-w-6xl px-3 py-4 sm:px-4 lg:px-6">
					<header className="mb-5 flex flex-col gap-3 overflow-hidden rounded-3xl border border-slate-200 bg-white px-4 py-5 shadow-md sm:px-5 md:flex-row md:items-center md:justify-between">
						<div className="flex w-full flex-row flex-wrap items-center justify-between gap-3">
							<div className="min-w-0 flex items-center gap-3">
								<img
									src={logoIcon}
									alt="Open Search logo"
									className="h-12 w-12"
								/>
								<div>
									<h1 className="text-xl font-semibold text-slate-900">
										Open Search
									</h1>
									<p className="mt-2 text-xs uppercase tracking-wide text-slate-500">
										Keep productive • Search anything
									</p>
								</div>
							</div>
							<div className="flex items-center gap-2 md:w-auto md:justify-end">
								<button
									type="button"
									aria-label="Toggle layout"
									className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:text-slate-900 border border-slate-200 hover:bg-slate-200"
									onClick={() =>
										setLayout((current) =>
											current === "grid"
												? "compact"
												: "grid",
										)
									}
									title="Toggle layout view"
								>
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="currentColor"
									>
										<rect
											x="4"
											y="4"
											width="6"
											height="6"
											rx="1.5"
										/>
										<rect
											x="14"
											y="4"
											width="6"
											height="6"
											rx="1.5"
										/>
										<rect
											x="4"
											y="14"
											width="6"
											height="6"
											rx="1.5"
										/>
										<rect
											x="14"
											y="14"
											width="6"
											height="6"
											rx="1.5"
										/>
									</svg>
								</button>
								<button
									type="button"
									aria-label="Open settings"
									className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:text-slate-900 border border-slate-200 hover:bg-slate-200"
									onClick={() => setShowSettings(true)}
									title="Settings"
								>
									<svg
										className="h-5 w-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
										/>
									</svg>
								</button>
							</div>
						</div>
						<div className="flex w-full justify-center md:w-auto md:justify-end">
							<div className="mt-4 text-end md:mt-0 md:min-w-30">
								<p className="text-2xl font-semibold tracking-tight text-slate-900">
									{formattedClock}
								</p>
								<p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500">
									{formattedDate.toUpperCase()}
								</p>
							</div>
						</div>
					</header>

					<div className="mb-4 grid grid-cols-1 items-start gap-4 md:grid-cols-[minmax(0,1fr)_300px]">
						<div className="min-w-0">
							<div className="mb-4">
								<div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
									<div className="px-4 py-4 sm:px-5">
										<label
											htmlFor="global-search-input"
											className="sr-only"
										>
											Search input
										</label>
										<div className="relative">
											<input
												id="global-search-input"
												type="search"
												value={query}
												onChange={(event) =>
													setQuery(event.target.value)
												}
												onKeyDown={(event) => {
													if (event.key === "Enter") {
														event.preventDefault();
														handleSearch(
															resolveSearchService(
																query,
																defaultService,
															),
														);
													}
												}}
												placeholder="search here... [how to make a cake @youtube]"
												className="w-full min-w-0 rounded-full border-4 border-gray-500/30 bg-white py-3 pl-4 pr-16 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
												autoFocus
												aria-label="Search query"
											/>
											<button
												type="button"
												className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full transition hover:scale-110 hover:bg-slate-100"
												onClick={() =>
													handleSearch(
														resolveSearchService(
															query,
															defaultService,
														),
													)
												}
												aria-label="Search"
												title={`Default search: ${activeSearchService.name}`}
											>
												<img
													src={
														activeSearchService.icon
													}
													alt={
														activeSearchService.name
													}
													className="h-5 w-5 object-contain"
												/>
											</button>
										</div>

										{engineSuggestions.length > 0 && (
											<div className="mt-3 flex flex-wrap gap-2">
												{engineSuggestions.map(
													(service) => (
														<button
															key={service.id}
															type="button"
															className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300"
															onClick={() =>
																selectSuggestion(
																	service,
																)
															}
														>
															<img
																src={
																	service.icon
																}
																alt={
																	service.name
																}
																className="h-4 w-4 rounded-sm object-contain"
															/>
															<span>
																{service.name}
															</span>
														</button>
													),
												)}
											</div>
										)}
									</div>

									<div className="flex flex-wrap justify-center gap-2 mb-3">
										{favoriteServices.map((service) => (
											<button
												key={service.id}
												type="button"
												className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300"
												onClick={() =>
													handleSearch(service)
												}
												title={service.name}
											>
												<img
													src={service.icon}
													alt={service.name}
													className="h-5 w-5 object-contain"
												/>
												<span>{service.name}</span>
											</button>
										))}
									</div>

									<hr className="border-slate-200" />

									<div
										className={
											layout === "compact"
												? "grid gap-4 p-3"
												: "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 p-3"
										}
									>
										{sections.map((section) => {
											const isExpanded =
												expandedSections[section.title];
											const displayedServices =
												layout === "compact" ||
												isExpanded
													? section.forms
													: section.forms.slice(0, 4);
											const hasMore =
												layout === "grid" &&
												section.forms.length > 4;

											return (
												<div
													key={section.title}
													className="space-y-2 rounded-3xl border border-slate-200 bg-white px-2 py-2 shadow-sm"
												>
													<h2 className="p-2 border-slate-200 text-center text-base font-semibold text-slate-800">
														{section.title}
													</h2>
													<div
														className={
															layout === "compact"
																? "flex flex-wrap justify-center gap-2"
																: "flex flex-col gap-2"
														}
													>
														{displayedServices.map(
															(service) => {
																const serviceId = `${section.title}:${service.name}`;
																const isPinned =
																	pinnedIds.includes(
																		serviceId,
																	);

																return (
																	<div
																		key={
																			serviceId
																		}
																		className="flex items-center gap-2"
																	>
																		<div className="flex w-full items-center justify-between gap-2 rounded-full border border-slate-200 bg-white">
																			<button
																				type="button"
																				className="flex flex-1 items-center gap-2 rounded-full px-2 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300"
																				onClick={() =>
																					handleSearch(
																						{
																							...service,
																							id: serviceId,
																						},
																					)
																				}
																			>
																				<img
																					src={
																						service.icon
																					}
																					alt={
																						service.name
																					}
																					className="h-4 w-4 object-contain"
																				/>
																				<span>
																					{
																						service.name
																					}
																				</span>
																			</button>
																			<button
																				type="button"
																				className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition ${isPinned ? "bg-amber-100 text-amber-500" : "text-slate-500 hover:bg-slate-300"}`}
																				onClick={() =>
																					togglePin(
																						serviceId,
																					)
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
																					<svg
																						viewBox="0 0 24 24"
																						width="18"
																						height="18"
																						fill="currentColor"
																						stroke="currentColor"
																						strokeWidth="1"
																						strokeLinecap="round"
																						strokeLinejoin="round"
																						aria-hidden="true"
																					>
																						<path d="M12 17.27l6.18 3.73-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73-1.64 7.03L12 17.27z" />
																					</svg>
																				) : (
																					<svg
																						viewBox="0 0 24 24"
																						width="18"
																						height="18"
																						fill="none"
																						stroke="currentColor"
																						strokeWidth="1.8"
																						strokeLinecap="round"
																						strokeLinejoin="round"
																						aria-hidden="true"
																					>
																						<path d="M12 17.27l6.18 3.73-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73-1.64 7.03L12 17.27z" />
																					</svg>
																				)}
																			</button>
																		</div>
																	</div>
																);
															},
														)}
														{hasMore && (
															<button
																type="button"
																className="w-full flex items-center justify-center gap-2 rounded-full border border-dashed border-slate-300  px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
																onClick={() =>
																	toggleSectionExpansion(
																		section.title,
																	)
																}
															>
																{isExpanded ? (
																	<>
																		Show
																		less
																		<svg
																			viewBox="0 0 24 24"
																			width="16"
																			height="16"
																			fill="none"
																			stroke="currentColor"
																			strokeWidth="2"
																			strokeLinecap="round"
																			strokeLinejoin="round"
																			aria-hidden="true"
																		>
																			<path d="M18 15l-6-6-6 6" />
																		</svg>
																	</>
																) : (
																	<>
																		Show{" "}
																		{section
																			.forms
																			.length -
																			4}{" "}
																		more
																		<svg
																			viewBox="0 0 24 24"
																			width="16"
																			height="16"
																			fill="none"
																			stroke="currentColor"
																			strokeWidth="2"
																			strokeLinecap="round"
																			strokeLinejoin="round"
																			aria-hidden="true"
																		>
																			<path d="M6 9l6 6 6-6" />
																		</svg>
																	</>
																)}
															</button>
														)}
													</div>
												</div>
											);
										})}
									</div>
								</div>
							</div>
						</div>

						<aside className="space-y-5">
							<div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
								<div className="flex items-center justify-between gap-3">
									<h3 className="text-lg font-semibold text-slate-900">
										Calendar
									</h3>
									<div className="flex gap-2">
										<button
											type="button"
											aria-label="Previous month"
											className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100"
											onClick={() =>
												setCalendarDate(
													new Date(
														calendarDate.getFullYear(),
														calendarDate.getMonth() -
															1,
														1,
													),
												)
											}
										>
											‹
										</button>
										<button
											type="button"
											aria-label="Next month"
											className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100"
											onClick={() =>
												setCalendarDate(
													new Date(
														calendarDate.getFullYear(),
														calendarDate.getMonth() +
															1,
														1,
													),
												)
											}
										>
											›
										</button>
									</div>
								</div>

								<div className="mt-4 text-center text-sm font-semibold text-slate-700">
									{monthLabel}
								</div>

								<div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] font-medium uppercase tracking-wider text-slate-500">
									{[
										"Mon",
										"Tue",
										"Wed",
										"Thu",
										"Fri",
										"Sat",
										"Sun",
									].map((day) => (
										<span key={day}>{day}</span>
									))}
								</div>

								<div className="mt-2 grid grid-cols-7 gap-1">
									{calendarDays.map((item) => {
										const isToday =
											item.date.toDateString() ===
											new Date().toDateString();
										const baseStyle = item.currentMonth
											? { color: "var(--calendar-day)" }
											: {
													color: "var(--calendar-day-muted)",
												};
										const style = isToday
											? {
													...baseStyle,
													background:
														"var(--calendar-today-bg)",
													color: "#ffffff",
													fontWeight: 700,
													boxShadow:
														"0 8px 20px var(--calendar-today-shadow)",
												}
											: baseStyle;

										return (
											<button
												key={`${item.date.getFullYear()}-${item.date.getMonth()}-${item.label}`}
												type="button"
												className="flex h-8 w-8 items-center justify-center rounded-full text-sm transition hover:bg-slate-100"
												style={style}
											>
												{item.label}
											</button>
										);
									})}
								</div>
							</div>

							<div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
								<h3 className="text-lg font-semibold text-slate-900">
									Todo
								</h3>
								<form
									onSubmit={addTodo}
									className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]"
								>
									<input
										value={todoInput}
										onChange={(event) =>
											setTodoInput(event.target.value)
										}
										placeholder="Add a task"
										className="w-full rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
									/>
									<button
										type="submit"
										className="rounded-full border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											width="20"
											height="20"
										>
											<path d="M12 2v20m10-10H2" />
										</svg>
									</button>
								</form>

								{todos.length === 0 ? (
									<p className="mt-4 text-sm text-slate-500">
										No tasks yet. Add something important.
									</p>
								) : (
									<ul className="mt-4 space-y-3">
										{todos.map((todo) => (
											<li
												key={todo.id}
												className="flex items-center justify-between gap-3 rounded-full border border-slate-200"
											>
												<button
													type="button"
													className="flex flex-1 items-center gap-3 text-left p-2"
													onClick={() =>
														toggleTodo(todo.id)
													}
												>
													<span
														className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs ${todo.completed ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-400 text-slate-400"}`}
													>
														{todo.completed
															? "✓"
															: ""}
													</span>
													<span
														className={
															todo.completed
																? "text-sm text-slate-400 line-through opacity-70"
																: "text-sm text-slate-700"
														}
													>
														{todo.text}
													</span>
												</button>
												<button
													type="button"
													className="text-xs text-red-500/50 transition hover:text-red-500 hover:bg-slate-200 rounded-full p-2"
													onClick={() =>
														removeTodo(todo.id)
													}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
														width="18"
														height="18"
													>
														<line
															x1="18"
															y1="6"
															x2="6"
															y2="18"
														/>
														<line
															x1="6"
															y1="6"
															x2="18"
															y2="18"
														/>
													</svg>
												</button>
											</li>
										))}
									</ul>
								)}
							</div>
						</aside>
					</div>

					<footer className="mt-10 pt-6 text-center text-sm text-slate-500">
						<div className="flex flex-col items-center gap-2">
							<span>
								© {new Date().getFullYear()} Open Search. All
								rights reserved.
							</span>
							<a
								href="https://github.com/ncodevsec"
								target="_blank"
								rel="noopener noreferrer"
								className="text-slate-400 transition hover:text-slate-600"
							>
								Developed by @ncodevsec
							</a>
						</div>
					</footer>
				</main>

				{showSettings && (
					<div
						className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4"
						onClick={() => setShowSettings(false)}
					>
						<div
							className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl"
							onClick={(event) => event.stopPropagation()}
						>
							<div className="mb-4 flex items-center justify-between">
								<h3 className="text-lg font-semibold text-slate-900">
									Settings
								</h3>
								<button
									type="button"
									className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100"
									onClick={() => setShowSettings(false)}
								>
									×
								</button>
							</div>

							<div className="mb-5">
								<p className="mb-3 text-sm font-medium text-slate-600">
									Theme
								</p>
								<div className="flex flex-wrap gap-2">
									{["system", "light", "dark"].map(
										(option) => (
											<button
												key={option}
												type="button"
												className={`rounded-full border px-3 py-2 text-sm capitalize transition ${theme === option ? "border-blue-400 bg-blue-500/10 text-blue-500" : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"}`}
												onClick={() => {
													setTheme(option);
													setShowSettings(false);
												}}
											>
												{option}
											</button>
										),
									)}
								</div>
							</div>

							<div>
								<p className="mb-3 text-sm font-medium text-slate-600">
									Default Search Engine
								</p>
								<div className="max-h-72 flex flex-wrap gap-2 overflow-y-auto pr-1">
									{allServices.map((service) => (
										<button
											key={service.id}
											type="button"
											className={`flex items-center gap-3 rounded-2xl border px-3 py-2 transition ${defaultServiceId === service.id ? "border-blue-400 bg-blue-500/10 text-blue-500" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}
											onClick={() => {
												setDefaultServiceId(service.id);
												setShowSettings(false);
											}}
										>
											<img
												src={service.icon}
												alt={service.name}
												className="h-5 w-5 rounded-sm object-contain"
											/>
											<span className="text-sm font-medium">
												{service.name}
											</span>
										</button>
									))}
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default App;
