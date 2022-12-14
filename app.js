require("dotenv").config();
const express = require("express");
const userRouter = require("./src/user/user.route");
const tokenVerification = require("./src/middleware/token.verification")
const authRouter = require("./src/auth/auth.route");
const postRouter = require("./src/post/post.route");
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./src/config/swagger");
const app = express();

const port = process.env.PORT || 8080;

app.use(express.json());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.get("/", tokenVerification , (req, res) => {
  const authUser = req.auth;
   // res.send("Hello World!");
   res.json({halo : authUser.email})
});

app.use(postRouter);
app.use(userRouter);
app.use(authRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
