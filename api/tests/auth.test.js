import { describe, it, expect, afterAll } from "vitest";
import request from "supertest";
import app from "../app.js";
import prisma from "../lib/prisma.js";

const runId = Date.now().toString().slice(-8);
const testUser = {
  username: `t_auth_${runId}`,
  email: `test_auth_${runId}@example.com`,
  password: "Password123!",
};

describe("auth", () => {
  afterAll(async () => {
    await prisma.user.deleteMany({ where: { username: testUser.username } });
  });

  it("rejects registration with an invalid email", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ username: "shortemail", email: "not-an-email", password: "Password123!" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid input");
  });

  it("rejects registration with a too-short password", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ username: "shortpw_user", email: "shortpw@example.com", password: "123" });

    expect(res.status).toBe(400);
  });

  it("registers a new user with valid input", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);

    expect(res.status).toBe(201);
  });

  it("rejects a duplicate username", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);

    expect(res.status).toBe(409);
  });

  it("rejects login with a wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: testUser.username, password: "wrong-password" });

    expect(res.status).toBe(400);
  });

  it("rejects login for a username that does not exist", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: `no_such_user_${runId}`, password: "whatever123" });

    expect(res.status).toBe(400);
  });

  it("logs in successfully with correct credentials and sets a cookie", async () => {
    const res = await request(app).post("/api/auth/login").send(testUser);

    expect(res.status).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();
    expect(res.body.username).toBe(testUser.username);
  });
});
