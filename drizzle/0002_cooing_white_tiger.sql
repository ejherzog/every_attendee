CREATE TABLE "host_invites" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(400) NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by_user_id" integer,
	CONSTRAINT "host_invites_email_unique" UNIQUE("email"),
	CONSTRAINT "host_invites_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "host_invites" ADD CONSTRAINT "host_invites_created_by_user_id_app_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."app_users"("id") ON DELETE no action ON UPDATE no action;