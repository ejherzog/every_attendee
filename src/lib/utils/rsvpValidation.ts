import validator from 'validator';

export const NAME_MAX_LENGTH = 50;

/** Valid attending options; matches DB CHECK constraint. */
export const ATTENDING_OPTIONS = ['Yes', 'No', 'Maybe'] as const;

export type AttendingOption = (typeof ATTENDING_OPTIONS)[number];

/** Server-side: validates attending value from parsed JSON. */
export function isValidAttending(attending: unknown): attending is AttendingOption {
	return typeof attending === 'string' && ATTENDING_OPTIONS.includes(attending as AttendingOption);
}

export function isValidName(name: string | undefined): boolean {
	const trimmed = (name ?? '').trim();
	return trimmed.length > 0 && trimmed.length <= NAME_MAX_LENGTH;
}

/** Server-side: accepts unknown from JSON parsing. */
export function isValidNameStrict(name: unknown): boolean {
	if (typeof name !== 'string') return false;
	const trimmed = name.trim();
	return trimmed.length > 0 && trimmed.length <= NAME_MAX_LENGTH;
}

/** Server-side: validates contact from parsed JSON (accepts unknown). */
export function hasValidContactStrict(phone: unknown, email: unknown): boolean {
	const phoneStr = (phone ?? '').toString().trim();
	const emailStr = (email ?? '').toString().trim();
	const hasValidPhone = phoneStr.length > 0 && validator.isMobilePhone(phoneStr, 'any');
	const hasValidEmail = emailStr.length > 0 && validator.isEmail(emailStr);
	return hasValidPhone || hasValidEmail;
}

export function hasValidContact(phone: string | undefined, email: string | undefined): boolean {
	const phoneTrimmed = (phone ?? '').trim();
	const emailTrimmed = (email ?? '').trim();
	const hasValidPhone = phoneTrimmed.length > 0 && validator.isMobilePhone(phoneTrimmed, 'any');
	const hasValidEmail = emailTrimmed.length > 0 && validator.isEmail(emailTrimmed);
	return hasValidPhone || hasValidEmail;
}
