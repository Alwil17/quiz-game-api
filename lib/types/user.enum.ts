import {
    pgEnum,
  } from "drizzle-orm/pg-core";
  
  // Enums
  export const roleEnum = pgEnum("role", ["player", "admin"]);
  export const advertisementTypeEnum = pgEnum("advertisement_type", [
    "Banner",
    "Video",
    "Rewarded",
  ]);
  export const transactionTypeEnum = pgEnum("transaction_type", [
    "In-App Purchase",
    "Subscription",
  ]);
  export const transactionStatusEnum = pgEnum("transaction_status", [
    "Pending",
    "Successful",
    "Failed",
  ]);
  export const quizDifficultyEnum = pgEnum("quiz_difficulty", [
    "easy",
    "medium",
    "hard",
  ]);
  export const questionTypeEnum = pgEnum("question_type", ["MCQ", "True/False"]);
  export const questionLevelEnum = pgEnum("question_level", [
    "easy",
    "medium",
    "hard",
  ]);
