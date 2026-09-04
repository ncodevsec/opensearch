import { useEffect, useMemo, useState } from "react";
import logoIcon from "./assets/open-search-192px.png";
import { CalendarCard } from "./components/CalendarCard";
import { FavoriteBar } from "./components/FavoriteBar";
import { Icon } from "./components/Icon";
import { SearchEngineList } from "./components/SearchEngineList";
import { SettingsModal } from "./components/SettingsModal";
import { TodoCard } from "./components/TodoCard";
import { sections } from "./data/searchEngineData";
import {
	STORAGE_KEYS,
	allServices,
	getDefaultPinnedIds,
	getDefaultResponsiveVisibility,
	getDefaultSearchService,
	getSystemDarkMode,
	readStorage,
	writeStorage,
} from "./utils/searchConfig";

function App() {
	const [pinnedIds, setPinnedIds] = useState(() =>
		readStorage(STORAGE_KEYS.pinned, getDefaultPinnedIds()),
	);
	const [theme, setTheme] = useState(() =>
		readStorage(STORAGE_KEYS.theme, "system"),
	);
	const [showFavoriteNames, setShowFavoriteNames] = useState(() =>
		readStorage(
			STORAGE_KEYS.showFavoriteNames,
			getDefaultResponsiveVisibility(),
		),
	);
	const [showCalendar, setShowCalendar] = useState(() =>
		readStorage(
			STORAGE_KEYS.showCalendar,
			getDefaultResponsiveVisibility(),
		),
	);
	const [showTodoList, setShowTodoList] = useState(() =>
		readStorage(
			STORAGE_KEYS.showTodoList,
			getDefaultResponsiveVisibility(),
		),
	);
	const [showDateTime, setShowDateTime] = useState(() =>
		readStorage(
			STORAGE_KEYS.showDateTime,
			getDefaultResponsiveVisibility(),
		),
	);
	const [query, setQuery] = useState("");
	const [layout, setLayout] = useState(() =>
		readStorage(STORAGE_KEYS.layout, "grid"),
	);
	const [showSettings, setShowSettings] = useState(false);
	const [showServiceList, setShowServiceList] = useState(false);
	const [todos, setTodos] = useState(() =>
		readStorage(STORAGE_KEYS.todos, []),
	);
	const [todoInput, setTodoInput] = useState("");
	const [calendarDate, setCalendarDate] = useState(new Date());
	const [now, setNow] = useState(new Date());
	const [expandedSections, setExpandedSections] = useState({});

	const favoriteServices = useMemo(
		() => allServices.filter((service) => pinnedIds.includes(service.id)),
		[pinnedIds],
	);
	const defaultService = useMemo(
		() => getDefaultSearchService(favoriteServices),
		[favoriteServices],
	);
	const isDarkTheme =
		theme === "dark" || (theme === "system" && getSystemDarkMode());

	useEffect(() => writeStorage(STORAGE_KEYS.pinned, pinnedIds), [pinnedIds]);
	useEffect(() => writeStorage(STORAGE_KEYS.theme, theme), [theme]);
	useEffect(
		() => writeStorage(STORAGE_KEYS.showFavoriteNames, showFavoriteNames),
		[showFavoriteNames],
	);
	useEffect(
		() => writeStorage(STORAGE_KEYS.showCalendar, showCalendar),
		[showCalendar],
	);
	useEffect(
		() => writeStorage(STORAGE_KEYS.showTodoList, showTodoList),
		[showTodoList],
	);
	useEffect(
		() => writeStorage(STORAGE_KEYS.showDateTime, showDateTime),
		[showDateTime],
	);
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

		const candidate = allServices.find(
			(service) =>
				service.name.toLowerCase() === token ||
				service.name.toLowerCase().startsWith(token),
		);

		if (candidate) return candidate;
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

	const hasSidebarWidgets = showCalendar || showTodoList;
	const contentGridClass = hasSidebarWidgets
		? "mb-4 grid grid-cols-1 items-start gap-4 md:grid-cols-[minmax(0,1fr)_300px]"
		: "mb-4 grid grid-cols-1 items-start gap-4 md:grid-cols-1";

	return (
		<div className={isDarkTheme ? "dark" : ""}>
			<div className="min-h-screen bg-slate-100 text-slate-900 transition-colors duration-200">
				<main className="mx-auto max-w-6xl px-3 py-4 sm:px-4 lg:px-6">
					<header className="mb-5 flex flex-col gap-3 overflow-hidden rounded-3xl border border-slate-200 bg-white px-4 py-5 shadow-md sm:px-5 md:flex-row md:items-center md:justify-between">
						<div className="flex w-full flex-row flex-wrap items-center justify-between gap-3">
							<div className="flex min-w-0 items-center gap-3">
								<img
									src={logoIcon}
									alt="Open Search logo"
									className="h-12 w-12"
								/>
								<div>
									<h1 className="text-xl font-semibold text-slate-900">
										Open Search
									</h1>
									<p className="mt-2 hidden text-xs uppercase tracking-wide text-slate-500 md:block">
										Keep productive • Search anything
									</p>
								</div>
							</div>
							<div className="flex items-center gap-2 md:w-auto md:justify-end">
								<button
									type="button"
									aria-label="Toggle layout"
									className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900"
									onClick={() =>
										setLayout((current) =>
											current === "grid"
												? "compact"
												: "grid",
										)
									}
									title="Toggle layout view"
								>
									<Icon
										name="fa-grip"
										className="text-base"
									/>
								</button>
								<button
									type="button"
									aria-label="Open settings"
									className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900"
									onClick={() => setShowSettings(true)}
									title="Settings"
								>
									<Icon
										name="fa-gear"
										className="text-base"
									/>
								</button>
							</div>
						</div>

						{showDateTime && (
							<div className="w-full justify-center md:flex md:w-auto md:justify-end">
								<div className="mt-4 text-center md:text-end md:mt-0 md:min-w-30">
									<p className="text-2xl font-semibold tracking-tight text-slate-900">
										{formattedClock}
									</p>
									<p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500">
										{formattedDate.toUpperCase()}
									</p>
								</div>
							</div>
						)}
					</header>

					<div className={contentGridClass}>
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

									<FavoriteBar
										favoriteServices={favoriteServices}
										showFavoriteNames={showFavoriteNames}
										onSearch={handleSearch}
									/>

									<hr className="border-slate-200" />

									<div className="p-3 md:hidden">
										<button
											type="button"
											className={`flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${showServiceList ? "border-blue-200 bg-blue-500/10 text-blue-400" : "border-slate-300 text-slate-700 hover:bg-slate-100"}`}
											onClick={() =>
												setShowServiceList(
													(current) => !current,
												)
											}
										>
											{showServiceList
												? "Hide Search Engine List"
												: "Show Search Engine List"}
											<Icon
												name={
													showServiceList
														? "fa-chevron-up"
														: "fa-chevron-down"
												}
												className="text-xs"
											/>
										</button>
									</div>

									<div
										className={`${showServiceList ? "grid" : "hidden"} md:grid ${layout === "compact" ? "md:grid gap-4 p-3" : "md:grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-3"}`}
									>
										<SearchEngineList
											sections={sections}
											layout={layout}
											expandedSections={expandedSections}
											pinnedIds={pinnedIds}
											togglePin={togglePin}
											handleSearch={handleSearch}
											toggleSectionExpansion={
												toggleSectionExpansion
											}
										/>
									</div>
								</div>
							</div>
						</div>

						{hasSidebarWidgets && (
							<aside className="space-y-5">
								{showCalendar && (
									<CalendarCard
										calendarDate={calendarDate}
										setCalendarDate={setCalendarDate}
									/>
								)}
								{showTodoList && (
									<TodoCard
										todos={todos}
										todoInput={todoInput}
										setTodoInput={setTodoInput}
										addTodo={addTodo}
										toggleTodo={toggleTodo}
										removeTodo={removeTodo}
									/>
								)}
							</aside>
						)}
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
					<SettingsModal
						theme={theme}
						setTheme={setTheme}
						showFavoriteNames={showFavoriteNames}
						setShowFavoriteNames={setShowFavoriteNames}
						showCalendar={showCalendar}
						setShowCalendar={setShowCalendar}
						showTodoList={showTodoList}
						setShowTodoList={setShowTodoList}
						showDateTime={showDateTime}
						setShowDateTime={setShowDateTime}
						onClose={() => setShowSettings(false)}
					/>
				)}
			</div>
		</div>
	);
}

export default App;
