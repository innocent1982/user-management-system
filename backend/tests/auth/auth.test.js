import request from "supertest";
import app from "../../app.js";

const user = {
    username:"innocent",
    email:"innocentkamesa05@gmail.com",
    password:"@Inno2006"
}
describe("TESTING Users API", () => {

//    it("POST /student/register/ sends email and returns user details and token", async () => {
//     const res = await request(app).post("/users/register/").send(user).set("Accept", "application/json");
//     console.log(`status: ${res.statusCode}`);
//     console.log(res.body.token);
//    })

//    it("POST /student/verify-email/", async () => {
//     const res = await request(app).post("/users/verify-email/?token=a499d6b8-ed6c-41d6-a063-ad1c073bdfa8").set("Accept", "application/json");
//     console.log(`status: ${res.statusCode}`);           
//     console.log(res.body)
//    }) 

    // it("POST login", async () => {
    //     const res = await request(app).post("/users/login/").send({email:user.email, password:user.password}).set("Accept", "application/json");
    //     console.log(`status: ${res.statusCode}`);           
    //     console.log(res.body)
    // })
    it("POST refresh-token", async () => {
        const res = await request(app).post("/users/logout/").send({token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInVzZXJFbWFpbCI6Imlubm9jZW50a2FtZXNhMDVAZ21haWwuY29tIiwiaWF0IjoxNzc1MTk5NTIxLCJleHAiOjE3NzUyODU5MjF9.QpCLzkkDZ5cgBxQaKCcJ3_byNwO21AtlktVGvj3pgZk"}, ).set("Accept", "application/json");
        console.log(`status: ${res.statusCode}`);           
        console.log(res.body)
})
}) 
