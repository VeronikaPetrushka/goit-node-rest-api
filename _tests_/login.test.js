import mongoose from "mongoose";
import request from "supertest";

import app from "../app.js";
import User from "../schemas/user.js";
import bcrypt from "bcrypt";

const findUser = (filter) => User.findOne(filter);
const deleteUsers = (filter) => User.deleteMany(filter);

const { DB_URI, PORT = 3000 } = process.env;

describe("test /login route", () => {
  let server = null;
  beforeAll(async () => {
    await mongoose.connect(DB_URI);
    server = app.listen(PORT);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  beforeEach(async () => {
    await deleteUsers({});
    const password = await bcrypt.hash("123456", 10);
    await User.create({
      email: "bogdan@gmail.com",
      password,
      subscription: "starter",
    });
  });

  afterEach(async () => {
    await deleteUsers({});
  });

  test("test /login with correct data", async () => {
    const loginData = {
      email: "bogdan@gmail.com",
      password: "123456",
    };

    const { statusCode, body } = await request(app)
      .post("/api/users/login")
      .send(loginData);

    expect(statusCode).toBe(200);
    expect(body.token).toBeDefined();
    expect(body.user.email).toBe(loginData.email);
    expect(body.user.subscription).toBe("starter");

    const user = await findUser({ email: loginData.email });
    expect(user).toBeDefined();
    expect(user.email).toBe(loginData.email);
  });
});
