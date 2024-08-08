export default class Validations {
	static hebrew: RegExp = /^[א-ת]{1,}$/;
	static hebrewName: RegExp = /^[א-ת]{2,12}$/;
	static phoneNumber: RegExp = /^0?(([23489]{1}[0-9]{7})|[57]{1}[0-9]{8})+$/;
	static email: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
	static cid(value: string): boolean {
		if (value.length > 9 || isNaN(Number(value))) return false;

		let digitsArray = Array.from(`${"0".repeat(9 - value.length)}${value}`).map(
			(char) => Number(char)
		);

		digitsArray = digitsArray.map((value, index) => {
			if ((index + 1) % 2 === 0) {
				value = value * 2;

				if (value > 9) {
					const numberDigits = String(value)
						.split("")
						.map((char) => Number(char));
					return numberDigits[0] + numberDigits[1];
				}
			}

			return value;
		});

		const sum = digitsArray.reduce((acc, value) => acc + value, 0);

		return sum % 10 === 0;
	}
	static date(value: string) {
		return !isNaN(new Date(value).getTime());
	}
}

export type Validator = (value: string) => boolean | RegExp;
