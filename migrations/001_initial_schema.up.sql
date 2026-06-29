CREATE TABLE "workspace" (
  "id" uuid NOT NULL,
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "user_id" uuid,
  PRIMARY KEY ("id")
);

CREATE TABLE "project" (
  "id" uuid NOT NULL,
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "workspace_id" uuid,
  PRIMARY KEY ("id")
);

CREATE TABLE "task" (
  "id" uuid NOT NULL,
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "project_id" uuid,
  PRIMARY KEY ("id")
);

CREATE TABLE "user" (
  "id" uuid NOT NULL,
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  PRIMARY KEY ("id")
);

CREATE TABLE "attachment" (
  "id" uuid NOT NULL,
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "task_id" uuid,
  PRIMARY KEY ("id")
);