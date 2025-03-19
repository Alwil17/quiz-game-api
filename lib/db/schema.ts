import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  decimal,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations, } from 'drizzle-orm';
// import { 
//   advertisementTypeEnum, 
//   questionLevelEnum, 
//   questionTypeEnum, 
//   quizDifficultyEnum, 
//   transactionStatusEnum, 
//   transactionTypeEnum 
// } from '../types/user.enum';

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

  export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    role: varchar('role', { length: 20 }).notNull().default('player'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    deletedAt: timestamp('deleted_at'),
  });

  // Tables
  
  export const advertisements = pgTable("Advertisement", {
    id: serial("id").primaryKey(),
    displayCount: integer("display_count"),
    type: advertisementTypeEnum("type"),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    deletedAt: timestamp('deleted_at'),
  });
  
  export const gameSessions = pgTable("GameSession", {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .references(() => users.id)
      .notNull(),
    quizId: integer("quiz_id")
      .references(() => quizzes.id)
      .notNull(),
    score: integer("score"),
    sessionDate: timestamp("session_date").defaultNow(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    deletedAt: timestamp('deleted_at'),
  });
  
  export const transactions = pgTable("Transaction", {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .references(() => users.id)
      .notNull(),
    transactionDate: timestamp("transaction_date").defaultNow(),
    amount: decimal("amount", { precision: 10, scale: 2 }),
    type: transactionTypeEnum("type"),
    status: transactionStatusEnum("status"),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    deletedAt: timestamp('deleted_at'),
  });
  
  export const leaderboards = pgTable("Leaderboard", {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .references(() => users.id)
      .notNull(),
    totalScore: integer("total_score"),
    rank: integer("rank"),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    deletedAt: timestamp('deleted_at'),
  });
  
  export const quizzes = pgTable("Quiz", {
    id: serial("id").primaryKey(),
    description: text("description"),
    categoryId: integer("category_id")
      .references(() => categories.id)
      .notNull(),
    authorId: integer("author_id")
      .references(() => users.id),
    title: varchar("title", { length: 255 }),
    difficulty: quizDifficultyEnum("difficulty"),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    deletedAt: timestamp('deleted_at'),
  });
  
  export const questions = pgTable("Question", {
    id: serial("id").primaryKey(),
    quizId: integer("quiz_id")
      .references(() => quizzes.id)
      .notNull(),
    text: text("text"),
    type: questionTypeEnum("type"),
    level: questionLevelEnum("level"),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    deletedAt: timestamp('deleted_at'),
  });
  
  export const answers = pgTable("Answer", {
    id: serial("id").primaryKey(),
    questionId: integer("question_id")
      .references(() => questions.id)
      .notNull(),
    text: text("text"),
    isCorrect: boolean("is_correct"),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    deletedAt: timestamp('deleted_at'),
  });
  
  export const categories = pgTable("Category", {
    id: serial("id").primaryKey(),
    description: text("description"),
    name: varchar("name", { length: 100 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    deletedAt: timestamp('deleted_at'),
  });
  
  // Relations
  export const usersRelations = relations(users, ({ many }) => ({
    gameSessions: many(gameSessions),
    transactions: many(transactions),
    leaderboards: many(leaderboards),
    teamMembers: many(teamMembers),
    invitationsSent: many(invitations),
    quizzes: many(quizzes),
  }));
  
  export const quizzesRelations = relations(quizzes, ({ many, one }) => ({
    questions: many(questions),
    category: one(categories, {
      fields: [quizzes.categoryId],
      references: [categories.id],
    }),
    author: one(users, {
      fields: [quizzes.authorId],
      references: [users.id],
    }),
  }));
  
  export const questionsRelations = relations(questions, ({ many, one }) => ({
    answers: many(answers),
    quiz: one(quizzes, {
      fields: [questions.quizId],
      references: [quizzes.id],
    }),
  }));
  
  export const answersRelations = relations(answers, ({ one }) => ({
    question: one(questions, {
      fields: [answers.questionId],
      references: [questions.id],
    }),
  }));
  
  export const categoriesRelations = relations(categories, ({ many }) => ({
    quizzes: many(quizzes),
  }));
  
  export const gameSessionsRelations = relations(gameSessions, ({ one }) => ({
    user: one(users, {
      fields: [gameSessions.userId],
      references: [users.id],
    }),
    quiz: one(quizzes, {
      fields: [gameSessions.quizId],
      references: [quizzes.id],
    }),
  }));
  
  export const transactionsRelations = relations(transactions, ({ one }) => ({
    user: one(users, {
      fields: [transactions.userId],
      references: [users.id],
    }),
  }));
  
  export const leaderboardsRelations = relations(leaderboards, ({ one }) => ({
    user: one(users, {
      fields: [leaderboards.userId],
      references: [users.id],
    }),
  }));

/**
 * POUR MULTI JOUEUR
 */

export const teams = pgTable('teams', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  stripeCustomerId: text('stripe_customer_id').unique(),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  stripeProductId: text('stripe_product_id'),
  planName: varchar('plan_name', { length: 50 }),
  subscriptionStatus: varchar('subscription_status', { length: 20 }),
});

export const teamMembers = pgTable('team_members', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  role: varchar('role', { length: 50 }).notNull(),
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
});

export const invitations = pgTable('invitations', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  email: varchar('email', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull(),
  invitedBy: integer('invited_by')
    .notNull()
    .references(() => users.id),
  invitedAt: timestamp('invited_at').notNull().defaultNow(),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
});

/**
 * FIN MULTI JOUEUR
 */

export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  userId: integer('user_id').references(() => users.id),
  action: text('action').notNull(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  ipAddress: varchar('ip_address', { length: 45 }),
});

export const teamsRelations = relations(teams, ({ many }) => ({
  teamMembers: many(teamMembers),
  activityLogs: many(activityLogs),
  invitations: many(invitations),
}));

// export const usersRelations = relations(users, ({ many }) => ({
//   teamMembers: many(teamMembers),
//   invitationsSent: many(invitations),
// }));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  team: one(teams, {
    fields: [invitations.teamId],
    references: [teams.id],
  }),
  invitedBy: one(users, {
    fields: [invitations.invitedBy],
    references: [users.id],
  }),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  team: one(teams, {
    fields: [activityLogs.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type Advertisement = typeof advertisements.$inferSelect;
export type GameSession = typeof gameSessions.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Leaderboard = typeof leaderboards.$inferSelect;
export type Quiz = typeof quizzes.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type Answer = typeof answers.$inferSelect;
export type Category = typeof categories.$inferSelect;

// Types pour les opérations d'insertion (facultatif)
export type NewUser = typeof users.$inferInsert;
export type NewAdvertisement = typeof advertisements.$inferInsert;
export type NewGameSession = typeof gameSessions.$inferInsert;
export type NewTransaction = typeof transactions.$inferInsert;
export type NewLeaderboard = typeof leaderboards.$inferInsert;
export type NewQuiz = typeof quizzes.$inferInsert;
export type NewQuestion = typeof questions.$inferInsert;
export type NewAnswer = typeof answers.$inferInsert;
export type NewCategory = typeof categories.$inferInsert;
//
export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;
export type TeamDataWithMembers = Team & {
  teamMembers: (TeamMember & {
    user: Pick<User, 'id' | 'name' | 'email'>;
  })[];
};

export enum ActivityType {
  SIGN_UP = 'SIGN_UP',
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT',
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',
  UPDATE_ACCOUNT = 'UPDATE_ACCOUNT',
  CREATE_TEAM = 'CREATE_TEAM',
  REMOVE_TEAM_MEMBER = 'REMOVE_TEAM_MEMBER',
  INVITE_TEAM_MEMBER = 'INVITE_TEAM_MEMBER',
  ACCEPT_INVITATION = 'ACCEPT_INVITATION',
}
