export const SEARCH_QUERIES = {
	dateFilterType: {
		name: "date-filter-type",
		value: "all-from-today",
	},
	dateFilter: {
		name: "date-filter",
		values: {
			min: "min",
			specific: "specific",
		},
	},
	toggleLinkActive: {
		name: "toggle-link-active",
	},
} as const;
