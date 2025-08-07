CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"phone_number" varchar(20),
	"avatar_url" text,
	"date_of_birth" timestamp,
	"gender" varchar(10),
	"school_name" varchar(255),
	"grade_level" varchar(20),
	"target_university" varchar(255),
	"target_major" varchar(255),
	"email_verified" boolean DEFAULT false,
	"phone_verified" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"is_premium" boolean DEFAULT false,
	"premium_expires_at" timestamp,
	"last_login_at" timestamp,
	"password_reset_token" varchar(255),
	"password_reset_expires" timestamp,
	"email_verification_token" varchar(255),
	"timezone" varchar(50) DEFAULT 'Asia/Jakarta',
	"language" varchar(5) DEFAULT 'id',
	"notification_preferences" jsonb DEFAULT '{"email_notifications":true,"push_notifications":true,"study_reminders":true,"achievement_notifications":true,"leaderboard_updates":true}'::jsonb,
	"profile_visibility" varchar(20) DEFAULT 'public',
	"show_real_name" boolean DEFAULT true,
	"show_school" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_text" text NOT NULL,
	"question_image_url" text,
	"explanation" text,
	"explanation_image_url" text,
	"subject" varchar(50) NOT NULL,
	"sub_topic" varchar(100) NOT NULL,
	"difficulty_level" varchar(20) NOT NULL,
	"question_type" varchar(20) DEFAULT 'multiple_choice' NOT NULL,
	"options" jsonb DEFAULT '[]'::jsonb,
	"correct_answer" varchar(10),
	"discrimination" numeric(10, 6) DEFAULT '1.0',
	"difficulty" numeric(10, 6) DEFAULT '0.0',
	"guessing" numeric(10, 6) DEFAULT '0.25',
	"times_used" integer DEFAULT 0,
	"times_correct" integer DEFAULT 0,
	"average_time_spent" integer DEFAULT 0,
	"source" varchar(100),
	"year" integer,
	"question_number" integer,
	"created_by" uuid,
	"reviewed_by" uuid,
	"review_status" varchar(20) DEFAULT 'draft',
	"review_notes" text,
	"is_active" boolean DEFAULT true,
	"is_premium" boolean DEFAULT false,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"keywords" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tryout_packages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"thumbnail_url" text,
	"package_type" varchar(50) NOT NULL,
	"category" varchar(50) NOT NULL,
	"difficulty_level" varchar(20) NOT NULL,
	"target_score" integer,
	"total_questions" integer NOT NULL,
	"duration_minutes" integer NOT NULL,
	"subject_distribution" jsonb DEFAULT '{"matematika":15,"fisika":12,"kimia":12,"biologi":12,"bahasa_indonesia":20,"bahasa_inggris":20}'::jsonb,
	"question_selection_strategy" varchar(50) DEFAULT 'adaptive',
	"is_free" boolean DEFAULT false,
	"price" numeric(10, 2) DEFAULT '0',
	"premium_only" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"is_featured" boolean DEFAULT false,
	"available_from" timestamp,
	"available_until" timestamp,
	"total_attempts" integer DEFAULT 0,
	"average_score" numeric(5, 2) DEFAULT '0',
	"completion_rate" numeric(5, 2) DEFAULT '0',
	"created_by" uuid,
	"reviewed_by" uuid,
	"review_status" varchar(20) DEFAULT 'draft',
	"tags" jsonb DEFAULT '[]'::jsonb,
	"keywords" text,
	"meta_description" text,
	"auto_publish_at" timestamp,
	"auto_archive_at" timestamp,
	"view_count" integer DEFAULT 0,
	"bookmark_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tryout_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"package_id" uuid NOT NULL,
	"status" varchar(20) DEFAULT 'not_started' NOT NULL,
	"started_at" timestamp,
	"completed_at" timestamp,
	"paused_at" timestamp,
	"expires_at" timestamp,
	"total_duration_seconds" integer DEFAULT 0,
	"pause_duration_seconds" integer DEFAULT 0,
	"remaining_time_seconds" integer,
	"selected_questions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"current_question_index" integer DEFAULT 0,
	"total_questions" integer NOT NULL,
	"questions_answered" integer DEFAULT 0,
	"questions_skipped" integer DEFAULT 0,
	"questions_flagged" jsonb DEFAULT '[]'::jsonb,
	"raw_score" integer DEFAULT 0,
	"scaled_score" numeric(6, 2),
	"percentile_rank" numeric(5, 2),
	"subject_scores" jsonb DEFAULT '{"matematika":{"raw":0,"scaled":0,"total_questions":0},"fisika":{"raw":0,"scaled":0,"total_questions":0},"kimia":{"raw":0,"scaled":0,"total_questions":0},"biologi":{"raw":0,"scaled":0,"total_questions":0},"bahasa_indonesia":{"raw":0,"scaled":0,"total_questions":0},"bahasa_inggris":{"raw":0,"scaled":0,"total_questions":0}}'::jsonb,
	"estimated_ability" numeric(8, 4),
	"ability_standard_error" numeric(8, 4),
	"average_time_per_question" numeric(6, 2),
	"fastest_question_time" integer,
	"slowest_question_time" integer,
	"total_clicks" integer DEFAULT 0,
	"total_scrolls" integer DEFAULT 0,
	"window_focus_lost_count" integer DEFAULT 0,
	"copy_paste_attempts" integer DEFAULT 0,
	"allow_review" boolean DEFAULT true,
	"allow_pause" boolean DEFAULT true,
	"show_timer" boolean DEFAULT true,
	"randomize_questions" boolean DEFAULT false,
	"randomize_options" boolean DEFAULT false,
	"ip_address" varchar(45),
	"user_agent" text,
	"screen_resolution" varchar(20),
	"browser_info" jsonb,
	"suspicious_activities" jsonb DEFAULT '[]'::jsonb,
	"user_feedback" text,
	"user_rating" integer,
	"admin_notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"session_id" uuid NOT NULL,
	"question_id" uuid NOT NULL,
	"question_order" integer NOT NULL,
	"subject" varchar(50) NOT NULL,
	"user_answer" text,
	"correct_answer" text NOT NULL,
	"is_correct" boolean NOT NULL,
	"is_skipped" boolean DEFAULT false,
	"is_flagged" boolean DEFAULT false,
	"time_spent_seconds" integer NOT NULL,
	"answered_at" timestamp NOT NULL,
	"first_interaction_at" timestamp,
	"interaction_count" integer DEFAULT 0,
	"option_changes" integer DEFAULT 0,
	"confidence_level" integer,
	"answer_pattern" jsonb,
	"question_difficulty" numeric(10, 6),
	"question_discrimination" numeric(10, 6),
	"question_guessing" numeric(10, 6),
	"response_probability" numeric(8, 6),
	"information_value" numeric(8, 6),
	"response_time_percentile" numeric(5, 2),
	"difficulty_appropriateness" numeric(5, 2),
	"device_type" varchar(20),
	"browser_type" varchar(50),
	"is_suspicious" boolean DEFAULT false,
	"suspicious_reasons" jsonb DEFAULT '[]'::jsonb,
	"reviewed_by_user" boolean DEFAULT false,
	"user_feedback" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "question_stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" uuid NOT NULL,
	"total_attempts" integer DEFAULT 0,
	"correct_attempts" integer DEFAULT 0,
	"incorrect_attempts" integer DEFAULT 0,
	"skipped_attempts" integer DEFAULT 0,
	"success_rate" numeric(5, 2) DEFAULT '0',
	"average_time_seconds" numeric(8, 2) DEFAULT '0',
	"median_time_seconds" numeric(8, 2) DEFAULT '0',
	"fastest_time_seconds" integer,
	"slowest_time_seconds" integer,
	"time_percentiles" jsonb DEFAULT '{"p25":0,"p50":0,"p75":0,"p90":0,"p95":0}'::jsonb,
	"current_difficulty" numeric(10, 6) DEFAULT '0',
	"current_discrimination" numeric(10, 6) DEFAULT '1',
	"current_guessing" numeric(10, 6) DEFAULT '0.25',
	"difficulty_standard_error" numeric(10, 6),
	"discrimination_standard_error" numeric(10, 6),
	"guessing_standard_error" numeric(10, 6),
	"parameter_estimation_iterations" integer DEFAULT 0,
	"parameter_convergence_achieved" boolean DEFAULT false,
	"log_likelihood" numeric(12, 6),
	"option_distribution" jsonb DEFAULT '{}'::jsonb,
	"distractor_analysis" jsonb DEFAULT '{}'::jsonb,
	"performance_by_ability" jsonb DEFAULT '{"low":{"attempts":0,"correct":0,"avg_time":0},"medium":{"attempts":0,"correct":0,"avg_time":0},"high":{"attempts":0,"correct":0,"avg_time":0}}'::jsonb,
	"performance_by_grade" jsonb DEFAULT '{}'::jsonb,
	"performance_by_school_type" jsonb DEFAULT '{}'::jsonb,
	"discrimination_quality" varchar(20),
	"difficulty_appropriateness" varchar(20),
	"needs_review" boolean DEFAULT false,
	"review_reasons" jsonb DEFAULT '[]'::jsonb,
	"last_reviewed_at" timestamp,
	"reviewed_by" uuid,
	"performance_trend" varchar(20),
	"trend_confidence" numeric(5, 2),
	"used_in_packages" jsonb DEFAULT '[]'::jsonb,
	"usage_frequency_rank" integer,
	"suspicious_response_count" integer DEFAULT 0,
	"anomaly_score" numeric(5, 2) DEFAULT '0',
	"last_calculated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "question_stats_question_id_unique" UNIQUE("question_id")
);
--> statement-breakpoint
CREATE TABLE "user_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"total_tryouts_taken" integer DEFAULT 0,
	"total_tryouts_completed" integer DEFAULT 0,
	"total_questions_answered" integer DEFAULT 0,
	"total_correct_answers" integer DEFAULT 0,
	"overall_accuracy" numeric(5, 2) DEFAULT '0',
	"average_score" numeric(6, 2) DEFAULT '0',
	"best_score" numeric(6, 2) DEFAULT '0',
	"latest_score" numeric(6, 2) DEFAULT '0',
	"current_ability" numeric(8, 4) DEFAULT '0',
	"ability_standard_error" numeric(8, 4) DEFAULT '1',
	"ability_confidence_interval" jsonb DEFAULT '{"lower":-2,"upper":2}'::jsonb,
	"subject_abilities" jsonb DEFAULT '{"matematika":{"ability":0,"standard_error":1,"attempts":0,"correct":0},"fisika":{"ability":0,"standard_error":1,"attempts":0,"correct":0},"kimia":{"ability":0,"standard_error":1,"attempts":0,"correct":0},"biologi":{"ability":0,"standard_error":1,"attempts":0,"correct":0},"bahasa_indonesia":{"ability":0,"standard_error":1,"attempts":0,"correct":0},"bahasa_inggris":{"ability":0,"standard_error":1,"attempts":0,"correct":0}}'::jsonb,
	"performance_trend" varchar(20) DEFAULT 'stable',
	"trend_strength" numeric(5, 2) DEFAULT '0',
	"learning_velocity" numeric(8, 4) DEFAULT '0',
	"consistency_score" numeric(5, 2) DEFAULT '0',
	"total_study_time_minutes" integer DEFAULT 0,
	"average_session_duration" numeric(8, 2) DEFAULT '0',
	"average_time_per_question" numeric(6, 2) DEFAULT '0',
	"comfortable_difficulty_range" jsonb DEFAULT '{"min":-1,"max":1}'::jsonb,
	"challenge_level_preference" varchar(20) DEFAULT 'balanced',
	"strongest_subjects" jsonb DEFAULT '[]'::jsonb,
	"weakest_subjects" jsonb DEFAULT '[]'::jsonb,
	"improvement_areas" jsonb DEFAULT '[]'::jsonb,
	"target_score" integer,
	"target_university" varchar(255),
	"target_major" varchar(255),
	"target_exam_date" timestamp,
	"goal_progress_percentage" numeric(5, 2) DEFAULT '0',
	"estimated_readiness" numeric(5, 2) DEFAULT '0',
	"days_until_target" integer,
	"current_streak_days" integer DEFAULT 0,
	"longest_streak_days" integer DEFAULT 0,
	"last_activity_date" timestamp,
	"weekly_progress" jsonb DEFAULT '{"tryouts_completed":0,"questions_answered":0,"accuracy":0,"study_time_minutes":0}'::jsonb,
	"monthly_progress" jsonb DEFAULT '{"tryouts_completed":0,"questions_answered":0,"accuracy":0,"study_time_minutes":0}'::jsonb,
	"percentile_rank_overall" numeric(5, 2) DEFAULT '50',
	"percentile_rank_by_grade" numeric(5, 2) DEFAULT '50',
	"percentile_rank_by_target" numeric(5, 2) DEFAULT '50',
	"optimal_question_difficulty" numeric(8, 4) DEFAULT '0',
	"recommended_study_intensity" varchar(20) DEFAULT 'moderate',
	"preferred_study_times" jsonb DEFAULT '[]'::jsonb,
	"average_session_questions" numeric(6, 2) DEFAULT '0',
	"completion_rate" numeric(5, 2) DEFAULT '100',
	"predicted_utbk_score" integer,
	"prediction_confidence" numeric(5, 2),
	"prediction_last_updated" timestamp,
	"milestones_achieved" jsonb DEFAULT '[]'::jsonb,
	"next_milestone" jsonb,
	"data_reliability_score" numeric(5, 2) DEFAULT '100',
	"last_major_update" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_progress_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "tryout_sessions" ADD CONSTRAINT "tryout_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tryout_sessions" ADD CONSTRAINT "tryout_sessions_package_id_tryout_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."tryout_packages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_answers" ADD CONSTRAINT "user_answers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_answers" ADD CONSTRAINT "user_answers_session_id_tryout_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."tryout_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_answers" ADD CONSTRAINT "user_answers_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_stats" ADD CONSTRAINT "question_stats_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "questions_subject_idx" ON "questions" USING btree ("subject");--> statement-breakpoint
CREATE INDEX "questions_difficulty_idx" ON "questions" USING btree ("difficulty_level");--> statement-breakpoint
CREATE INDEX "questions_sub_topic_idx" ON "questions" USING btree ("sub_topic");--> statement-breakpoint
CREATE INDEX "questions_review_status_idx" ON "questions" USING btree ("review_status");--> statement-breakpoint
CREATE INDEX "questions_is_active_idx" ON "questions" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "questions_source_year_idx" ON "questions" USING btree ("source","year");--> statement-breakpoint
CREATE INDEX "tryout_packages_type_idx" ON "tryout_packages" USING btree ("package_type");--> statement-breakpoint
CREATE INDEX "tryout_packages_category_idx" ON "tryout_packages" USING btree ("category");--> statement-breakpoint
CREATE INDEX "tryout_packages_difficulty_idx" ON "tryout_packages" USING btree ("difficulty_level");--> statement-breakpoint
CREATE INDEX "tryout_packages_is_active_idx" ON "tryout_packages" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "tryout_packages_is_featured_idx" ON "tryout_packages" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "tryout_packages_availability_idx" ON "tryout_packages" USING btree ("available_from","available_until");--> statement-breakpoint
CREATE INDEX "tryout_packages_review_status_idx" ON "tryout_packages" USING btree ("review_status");--> statement-breakpoint
CREATE INDEX "tryout_sessions_user_id_idx" ON "tryout_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "tryout_sessions_package_id_idx" ON "tryout_sessions" USING btree ("package_id");--> statement-breakpoint
CREATE INDEX "tryout_sessions_status_idx" ON "tryout_sessions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "tryout_sessions_completed_at_idx" ON "tryout_sessions" USING btree ("completed_at");--> statement-breakpoint
CREATE INDEX "tryout_sessions_user_package_idx" ON "tryout_sessions" USING btree ("user_id","package_id");--> statement-breakpoint
CREATE INDEX "tryout_sessions_created_at_idx" ON "tryout_sessions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "user_answers_user_id_idx" ON "user_answers" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_answers_session_id_idx" ON "user_answers" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "user_answers_question_id_idx" ON "user_answers" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "user_answers_subject_idx" ON "user_answers" USING btree ("subject");--> statement-breakpoint
CREATE INDEX "user_answers_is_correct_idx" ON "user_answers" USING btree ("is_correct");--> statement-breakpoint
CREATE INDEX "user_answers_answered_at_idx" ON "user_answers" USING btree ("answered_at");--> statement-breakpoint
CREATE INDEX "user_answers_session_question_idx" ON "user_answers" USING btree ("session_id","question_order");--> statement-breakpoint
CREATE INDEX "user_answers_user_subject_idx" ON "user_answers" USING btree ("user_id","subject");--> statement-breakpoint
CREATE INDEX "user_answers_is_suspicious_idx" ON "user_answers" USING btree ("is_suspicious");--> statement-breakpoint
CREATE INDEX "question_stats_question_id_idx" ON "question_stats" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "question_stats_success_rate_idx" ON "question_stats" USING btree ("success_rate");--> statement-breakpoint
CREATE INDEX "question_stats_difficulty_idx" ON "question_stats" USING btree ("current_difficulty");--> statement-breakpoint
CREATE INDEX "question_stats_discrimination_idx" ON "question_stats" USING btree ("current_discrimination");--> statement-breakpoint
CREATE INDEX "question_stats_total_attempts_idx" ON "question_stats" USING btree ("total_attempts");--> statement-breakpoint
CREATE INDEX "question_stats_needs_review_idx" ON "question_stats" USING btree ("needs_review");--> statement-breakpoint
CREATE INDEX "question_stats_last_calculated_idx" ON "question_stats" USING btree ("last_calculated_at");--> statement-breakpoint
CREATE INDEX "question_stats_usage_rank_idx" ON "question_stats" USING btree ("usage_frequency_rank");--> statement-breakpoint
CREATE INDEX "user_progress_user_id_idx" ON "user_progress" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_progress_current_ability_idx" ON "user_progress" USING btree ("current_ability");--> statement-breakpoint
CREATE INDEX "user_progress_overall_accuracy_idx" ON "user_progress" USING btree ("overall_accuracy");--> statement-breakpoint
CREATE INDEX "user_progress_average_score_idx" ON "user_progress" USING btree ("average_score");--> statement-breakpoint
CREATE INDEX "user_progress_percentile_rank_idx" ON "user_progress" USING btree ("percentile_rank_overall");--> statement-breakpoint
CREATE INDEX "user_progress_last_activity_idx" ON "user_progress" USING btree ("last_activity_date");--> statement-breakpoint
CREATE INDEX "user_progress_target_exam_date_idx" ON "user_progress" USING btree ("target_exam_date");--> statement-breakpoint
CREATE INDEX "user_progress_updated_at_idx" ON "user_progress" USING btree ("updated_at");