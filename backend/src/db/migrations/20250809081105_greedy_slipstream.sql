ALTER TABLE "users" ADD COLUMN "unique_id" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_unique_id_unique" UNIQUE("unique_id");