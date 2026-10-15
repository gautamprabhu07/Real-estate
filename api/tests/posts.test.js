import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../app.js";
import prisma from "../lib/prisma.js";

const runId = Date.now().toString().slice(-8);
const owner = {
  username: `t_owner_${runId}`,
  email: `test_owner_${runId}@example.com`,
  password: "Password123!",
};
const intruder = {
  username: `t_intrdr_${runId}`,
  email: `test_intruder_${runId}@example.com`,
  password: "Password123!",
};

const validPost = {
  postData: {
    title: "Test Listing",
    price: 1000,
    address: "1 Test St",
    city: "Testville",
    bedroom: 2,
    bathroom: 1,
    type: "rent",
    property: "apartment",
    latitude: "30.2672",
    longitude: "-97.7431",
  },
};

let ownerCookie;
let intruderCookie;
let postId;

describe("posts ownership", () => {
  beforeAll(async () => {
    await request(app).post("/api/auth/register").send(owner);
    await request(app).post("/api/auth/register").send(intruder);

    const ownerLogin = await request(app).post("/api/auth/login").send(owner);
    ownerCookie = ownerLogin.headers["set-cookie"];

    const intruderLogin = await request(app).post("/api/auth/login").send(intruder);
    intruderCookie = intruderLogin.headers["set-cookie"];
  });

  afterAll(async () => {
    await prisma.post.deleteMany({ where: { title: "Test Listing" } });
    await prisma.user.deleteMany({
      where: { username: { in: [owner.username, intruder.username] } },
    });
  });

  it("rejects an invalid post payload", async () => {
    const res = await request(app)
      .post("/api/posts")
      .set("Cookie", ownerCookie)
      .send({ postData: { title: "Missing required fields" } });

    expect(res.status).toBe(400);
  });

  it("creates a post for the authenticated owner", async () => {
    const res = await request(app)
      .post("/api/posts")
      .set("Cookie", ownerCookie)
      .send(validPost);

    expect(res.status).toBe(200);
    expect(res.body.id).toBeDefined();
    postId = res.body.id;
  });

  it("blocks a non-owner from updating the post", async () => {
    const res = await request(app)
      .put(`/api/posts/${postId}`)
      .set("Cookie", intruderCookie)
      .send({ postData: { price: 9999 } });

    expect(res.status).toBe(403);
  });

  it("blocks a non-owner from deleting the post", async () => {
    const res = await request(app)
      .delete(`/api/posts/${postId}`)
      .set("Cookie", intruderCookie);

    expect(res.status).toBe(403);
  });

  it("allows the owner to update their own post", async () => {
    const res = await request(app)
      .put(`/api/posts/${postId}`)
      .set("Cookie", ownerCookie)
      .send({ postData: { price: 1500 } });

    expect(res.status).toBe(200);
    expect(res.body.price).toBe(1500);
  });

  it("allows the owner to delete their own post", async () => {
    const res = await request(app)
      .delete(`/api/posts/${postId}`)
      .set("Cookie", ownerCookie);

    expect(res.status).toBe(200);
  });
});
