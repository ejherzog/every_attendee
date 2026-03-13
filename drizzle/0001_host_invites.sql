CREATE TABLE IF NOT EXISTS "host_invites" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(400) NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone NOT NULL DEFAULT now(),
	"created_by_user_id" integer
);
--> statement-breakpoint
ALTER TABLE "host_invites" ADD CONSTRAINT "host_invites_email_unique" UNIQUE("email");
--> statement-breakpoint
ALTER TABLE "host_invites" ADD CONSTRAINT "host_invites_token_unique" UNIQUE("token");
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "host_invites" ADD CONSTRAINT "host_invites_created_by_user_id_app_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."app_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_host_invites_token" ON "host_invites" ("token");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_host_invites_expires_at" ON "host_invites" ("expires_at");
