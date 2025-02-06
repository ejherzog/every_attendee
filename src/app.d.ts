// See https://kit.svelte.dev/docs/types#app

import type { User } from "$lib/server/auth";
import type { DB_AppUser } from "$lib/types/db/DB_AppUser";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | null;
			session: Session | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
