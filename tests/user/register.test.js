const app = require("../../app");
const request = require("supertest");

const user = {
    username:"precious",
    email:"preciouslizeo56@gmail.com",
    password:"@Precious2005"
}
describe("Users API", () => {
   it("POST /student/register/ sends email", async () => {
    const res = await request(app).post("/student/register/").send(user).set("Accept", "application/json");
    console.log(`status: ${res.statusCode}`);
    console.log(res.body);
   }) 
}) 
