CREATE TYPE "public"."advertisement_type" AS ENUM('Banner', 'Video', 'Rewarded');--> statement-breakpoint
CREATE TYPE "public"."question_level" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TYPE "public"."question_type" AS ENUM('MCQ', 'True/False');--> statement-breakpoint
CREATE TYPE "public"."quiz_difficulty" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('player', 'admin');--> statement-breakpoint
CREATE TYPE "public"."transaction_status" AS ENUM('Pending', 'Successful', 'Failed');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('In-App Purchase', 'Subscription');--> statement-breakpoint
CREATE TABLE "Advertisement" (
	"id" serial PRIMARY KEY NOT NULL,
	"display_count" integer,
	"type" "advertisement_type",
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "Answer" (
	"id" serial PRIMARY KEY NOT NULL,
	"question_id" integer NOT NULL,
	"text" text,
	"is_correct" boolean,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "Category" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" text,
	"name" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "GameSession" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"quiz_id" integer NOT NULL,
	"score" integer,
	"session_date" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "Leaderboard" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"total_score" integer,
	"rank" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "Question" (
	"id" serial PRIMARY KEY NOT NULL,
	"quiz_id" integer NOT NULL,
	"text" text,
	"type" "question_type",
	"level" "question_level",
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "Quiz" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" text,
	"category_id" integer NOT NULL,
	"author_id" integer,
	"title" varchar(255),
	"difficulty" "quiz_difficulty",
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "Transaction" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"transaction_date" timestamp DEFAULT now(),
	"amount" numeric(10, 2),
	"type" "transaction_type",
	"status" "transaction_status",
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'player';--> statement-breakpoint
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_question_id_Question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."Question"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "GameSession" ADD CONSTRAINT "GameSession_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "GameSession" ADD CONSTRAINT "GameSession_quiz_id_Quiz_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."Quiz"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Leaderboard" ADD CONSTRAINT "Leaderboard_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Question" ADD CONSTRAINT "Question_quiz_id_Quiz_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."Quiz"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_category_id_Category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."Category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;