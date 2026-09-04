import { Icon } from "./Icon";

function Toggle({ label, description, checked, onToggle }) {
	return (
		<div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
			<div>
				<p className="text-sm font-medium text-slate-700">{label}</p>
				<p className="text-xs text-slate-500">{description}</p>
			</div>
			<button
				type="button"
				role="switch"
				aria-checked={checked}
				className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${checked ? "bg-blue-500" : "bg-gray-400"}`}
				onClick={onToggle}
			>
				<span
					className={`inline-block h-5 w-5 transform rounded-full bg-gray-50 transition ${checked ? "translate-x-6" : "translate-x-1"}`}
				/>
			</button>
		</div>
	);
}

export function SettingsModal({
	theme,
	setTheme,
	showFavoriteNames,
	setShowFavoriteNames,
	showCalendar,
	setShowCalendar,
	showTodoList,
	setShowTodoList,
	showDateTime,
	setShowDateTime,
	onClose,
}) {
	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
			onClick={onClose}
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
						onClick={onClose}
					>
						<Icon name="fa-xmark" className="text-sm" />
					</button>
				</div>

				<div className="mb-5">
					<p className="mb-3 text-sm font-medium text-slate-600">
						Theme
					</p>
					<div className="flex flex-wrap gap-2">
						{["system", "light", "dark"].map((option) => {
							const icons = {
								system: "fa-circle-half-stroke",
								light: "fa-sun",
								dark: "fa-moon",
							};
							return (
								<button
									key={option}
									type="button"
									title={
										option.charAt(0).toUpperCase() +
										option.slice(1)
									}
									className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${theme === option ? "border-blue-400 bg-blue-500/10 text-blue-500" : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"}`}
									onClick={() => {
										setTheme(option);
									}}
								>
									<Icon
										name={icons[option]}
										className="text-sm"
									/>
								</button>
							);
						})}
					</div>
				</div>

				<div className="mb-5 space-y-3">
					<p className="mb-2 text-sm font-medium text-slate-600">
						Dashboard Widgets
					</p>
					<Toggle
						label="Show date & time"
						description="Display the header clock and date."
						checked={showDateTime}
						onToggle={() => setShowDateTime((current) => !current)}
					/>
					<Toggle
						label="Show calendar"
						description="Display the calendar card in the sidebar."
						checked={showCalendar}
						onToggle={() => setShowCalendar((current) => !current)}
					/>
					<Toggle
						label="Show todo list"
						description="Display the to-do list card in the sidebar."
						checked={showTodoList}
						onToggle={() => setShowTodoList((current) => !current)}
					/>
				</div>

				<div className="mb-5 space-y-3">
					<p className="mb-2 text-sm font-medium text-slate-600">
						Favorite Search Services
					</p>
					<Toggle
						label="Show names"
						description="Turn off to display only icons in the favorites bar."
						checked={showFavoriteNames}
						onToggle={() =>
							setShowFavoriteNames((current) => !current)
						}
					/>
				</div>
			</div>
		</div>
	);
}
