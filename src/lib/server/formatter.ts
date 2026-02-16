import type { Person } from '$lib/types/People';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
	weekday: 'short',
	month: 'short',
	day: '2-digit',
	year: 'numeric'
});

const timeFormatter = new Intl.DateTimeFormat('en-US', {
	timeStyle: 'short'
});

const lf = new Intl.ListFormat('en');

export function getHosts(hosts: Person[]) {
	let host_names: string[] = [];
	hosts.forEach((person) => {
		host_names.push(person.name);
	});
	return lf.format(host_names);
}

export function getWhenFromTimestamps(start_time?: string, end_time?: string) {
	if (!(start_time && end_time)) return undefined;

	const start = new Date(start_time);
	const end = new Date(end_time);
	let when = dateFormatter.format(start);
	if (areSameDay(start, end)) {
		when = when.concat(`<br>${getTime(start, end)}`);
	} else {
		when = when.concat(`  ${timeFormatter.format(start)}<br>until<br>`);
		when = when.concat(`${dateFormatter.format(end)}  ${timeFormatter.format(end)}`);
	}
	return when;
}

export function containsIgnoreCase(big_string: string, sub_string: string) {
	return big_string.toLowerCase().includes(sub_string.toLowerCase());
}

function getTime(start: Date, end: Date) {
	return `${timeFormatter.format(start)} - ${timeFormatter.format(end)}`;
}

function areSameDay(time1: Date, time2: Date) {
	return (
		time1.getFullYear() == time2.getFullYear() &&
		time1.getMonth() == time2.getMonth() &&
		time1.getDate() == time2.getDate()
	);
}
