const sorts = [
	"visit-datetime",
	"visit-creation-datetime",
	"patient-name",
	"visitor-name"
] as const;
export type Sort = typeof sorts[number]; 

const orderDirections = ["ASC", "DESC"] as const;
export type OrderDirection = typeof orderDirections[number];

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
	sortBy: {
		name: "sort-by",
		values: sorts
	},
	orderDirection: {
		name: "order-directions",
		values: orderDirections
	}
} as const;
