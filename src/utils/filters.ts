import { HTMLProps } from "react";
import { Filter } from "./searchQueries";
import Validations from "./validations";

export type InputInfo = HTMLProps<HTMLInputElement> & {
	label: string;
};

type AccordionLabel = { accordionLabel: string };

export type FilterIdToInfo<T extends keyof Filter> = AccordionLabel &
	Record<Filter[T], string | InputInfo>;

export const PATIENT_FILTER_ID_TO_INFO: FilterIdToInfo<"patient"> = {
	accordionLabel: "פרטי מטופל",
	"patient-first-name": "שם פרטי",
	"patient-surname": "שם משפחה",
	"patient-state-id": {
		label: "מספר ת.ז",
		type: "number",
	},
};

export const VISITOR_FILTER_ID_TO_INFO: FilterIdToInfo<"visitor"> = {
	accordionLabel: "פרטי מבקרים",
	"visitor-first-name": "שם פרטי",
	"visitor-surname": "שם משפחה",
	"visitor-state-id": {
		label: "מספר ת.ז",
		type: "number",
	},
	"visitor-familial-realtion": "דרגת קרבה",
	"visitor-phone-number": {
		label: "מספר טלפון",
		type: "tel",
	},
	"visitor-email": {
		label: "אימייל",
		type: "email",
	},
};

export const EXTRA_VISITOR_FILTER_ID_TO_INFO: Omit<
	FilterIdToInfo<"extra-visitor">,
	"accordionLabel"
> = {
	"extra-visitor-first-name": "שם פרטי (מבקר נוסף)",
	"extra-visitor-surname": "שם משפחה (מבקר נוסף)",
	"extra-visitor-state-id": {
		label: "מספר ת.ז (מבקר נוסף)",
		type: "number",
	},
	"extra-visitor-familial-realtion": "דרגת קרבה (מבקר נוסף)",
	"extra-visitor-phone-number": {
		label: "מספר טלפון (מבקר נוסף)",
		type: "tel",
	},
	"extra-visitor-email": {
		label: "אימייל (מבקר נוסף)",
		type: "email",
	},
};

export const VISIT_FILTER_ID_TO_INFO: FilterIdToInfo<"visit"> = {
	accordionLabel: "פרטי ביקור",
	"visit-creation-datetime": {
		label: "זמן יצירת הבקשה",
		type: "datetime-local",
	},
};

const FILTER_VALIDATORS: Record<
	Filter[keyof Filter],
	((value: string) => boolean) | RegExp
> = Object.freeze({
	"patient-first-name": Validations.hebrewName,
	"patient-surname": Validations.hebrewName,
	"patient-state-id": Validations.cid,
	"visitor-first-name": Validations.hebrewName,
	"visitor-surname": Validations.hebrewName,
	"visitor-state-id": Validations.cid,
	"visitor-familial-realtion": Validations.hebrew,
	"visitor-phone-number": Validations.phoneNumber,
	"visitor-email": Validations.email,
	"extra-visitor-first-name": Validations.hebrewName,
	"extra-visitor-surname": Validations.hebrewName,
	"extra-visitor-state-id": Validations.cid,
	"extra-visitor-familial-realtion": Validations.hebrew,
	"extra-visitor-phone-number": Validations.phoneNumber,
	"extra-visitor-email": Validations.email,
	"visit-creation-datetime": Validations.date,
});

class InputError extends Error {
	inputName: string;

	constructor(message: string, inputName: string, options?: ErrorOptions) {
		super(message, options);
		this.inputName = inputName;
	}
}

export function validateFormData(
	filtersInfos: Readonly<Record<string, string | InputInfo>[]>,
	data: FormData
): InputError[] | undefined {
	const errors: InputError[] = [];

	for (const { accordionLabel, ...accordionInfo } of filtersInfos) {
		for (const [key, info] of Object.entries(accordionInfo)) {
			const filterValue = data.get(key)?.valueOf();

			if (!filterValue) continue;

			const validator = FILTER_VALIDATORS[key as Filter[keyof Filter]];

			const presumableError = new InputError(
				`השדה "${typeof info === "object" ? info.label : info}" אינו תקין`,
				key
			);

			if (validator instanceof RegExp) {
				if (!validator.test(filterValue.toString())) {
					errors.push(presumableError);
				}
			} else if (!validator(filterValue.toString()))
				errors.push(presumableError);
		}
	}

	return errors.length > 0 ? errors : undefined;
}
