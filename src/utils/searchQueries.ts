const sorts = [
	"visit-datetime",
	"visit-creation-datetime",
	"patient-name",
	"visitor-name",
] as const;
export type Sort = (typeof sorts)[number];

const orderDirections = ["ASC", "DESC"] as const;
export type OrderDirection = (typeof orderDirections)[number];

export const filters = {
	patient: ["first-name", "surname", "state-id"],
	visitor: [
		"first-name",
		"surname",
		"state-id",
		"email",
		"phone-number",
		"familial-realtion",
	],
	"extra-visitor": [
		"first-name",
		"surname",
		"state-id",
		"email",
		"phone-number",
		"familial-realtion",
	],
	visit: ["creation-datetime"],
} as const;
export type Filter = {
	[R in keyof typeof filters]: `${R}-${(typeof filters)[R][number]}`;
};

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
		values: sorts,
	},
	orderDirection: {
		name: "order-directions",
		values: orderDirections,
	},
	filters: {
		name: "filters",
	},
} as const;
