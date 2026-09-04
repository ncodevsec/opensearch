import { defaultFavorites, sections } from "../data/searchEngineData";

export const STORAGE_KEYS = {
    pinned: "openSearchPinnedServices",
    theme: "openSearchThemePreference",
    layout: "openSearchLayoutPreference",
    todos: "openSearchTodoItems",
    showFavoriteNames: "openSearchShowFavoriteNames",
    showCalendar: "openSearchShowCalendar",
    showTodoList: "openSearchShowTodoList",
    showDateTime: "openSearchShowDateTime",
};

export const allServices = sections.flatMap((section) =>
    section.forms.map((form) => ({
        ...form,
        section: section.title,
        id: `${section.title}:${form.name}`,
    })),
);

export const getDefaultPinnedIds = () =>
    allServices
        .filter((service) => defaultFavorites.includes(service.name))
        .map((service) => service.id);

export const getDefaultSearchService = (favoriteServices) => {
    const fallbackService =
        allServices.find((service) => service.name === "Google") ||
        allServices[0];
    return favoriteServices[0] || fallbackService;
};

export const readStorage = (key, fallback) => {
    if (typeof window === "undefined") return fallback;
    try {
        const raw = window.localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
};

export const writeStorage = (key, value) => {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // ignore storage issues in restricted browsers
    }
};

export const buildCalendarDays = (date) => {
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

export const getSystemDarkMode = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

export const isTabletViewport = () =>
    typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;

export const getDefaultResponsiveVisibility = () => isTabletViewport();
