import { Icon } from "./Icon";
import { buildCalendarDays } from "../utils/searchConfig";

export function CalendarCard({ calendarDate, setCalendarDate }) {
	const monthLabel = new Intl.DateTimeFormat("en-US", {
		month: "long",
		year: "numeric",
	}).format(calendarDate);
	const calendarDays = buildCalendarDays(calendarDate);

	return (
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
									calendarDate.getMonth() - 1,
									1,
								),
							)
						}
					>
						<Icon name="fa-chevron-left" className="text-xs" />
					</button>
					<button
						type="button"
						aria-label="Next month"
						className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100"
						onClick={() =>
							setCalendarDate(
								new Date(
									calendarDate.getFullYear(),
									calendarDate.getMonth() + 1,
									1,
								),
							)
						}
					>
						<Icon name="fa-chevron-right" className="text-xs" />
					</button>
				</div>
			</div>

			<div className="mt-4 text-center text-sm font-semibold text-slate-700">
				{monthLabel}
			</div>

			<div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] font-medium uppercase tracking-wider text-slate-500">
				{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
					(day) => (
						<span key={day}>{day}</span>
					),
				)}
			</div>

			<div className="mt-2 grid grid-cols-7 gap-1">
				{calendarDays.map((item) => {
					const isToday =
						item.date.toDateString() === new Date().toDateString();
					const baseStyle = item.currentMonth
						? { color: "var(--calendar-day)" }
						: { color: "var(--calendar-day-muted)" };
					const style = isToday
						? {
								...baseStyle,
								background: "var(--calendar-today-bg)",
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
	);
}
