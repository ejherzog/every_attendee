CREATE TABLE "cohost_invites" (
	"id" serial PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"email" varchar(400),
	"event_id" varchar(6) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by_user_id" integer,
	CONSTRAINT "cohost_invites_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "cohost_invites" ADD CONSTRAINT "cohost_invites_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cohost_invites" ADD CONSTRAINT "cohost_invites_created_by_user_id_app_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."app_users"("id") ON DELETE no action ON UPDATE no action;