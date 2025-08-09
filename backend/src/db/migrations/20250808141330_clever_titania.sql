CREATE TABLE "quest_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"quest_id" varchar(100) NOT NULL,
	"progress" integer DEFAULT 0,
	"target" integer NOT NULL,
	"completed" boolean DEFAULT false,
	"claimed" boolean DEFAULT false,
	"completed_at" timestamp,
	"claimed_at" timestamp,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "quest_rewards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"quest_id" varchar(100) NOT NULL,
	"coins" integer DEFAULT 0,
	"xp" integer DEFAULT 0,
	"claimed_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "level" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "xp" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "coins" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "daily_streak" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_check_in" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "total_study_time" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "achievements" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "quest_progress" ADD CONSTRAINT "quest_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_rewards" ADD CONSTRAINT "quest_rewards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;