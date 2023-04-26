const axios = require("axios");

describe("POST /api/user/signIn", () => {
    test("POST /api/user/signIn", async () => {
        const response = await axios.post("http://api.local.app.garden/user/signIn", {
            email: "kartashov104@gmail.com",
            password: "3498569",
        });

        expect(response.status).toBe(200);
    });
});
