const express = require("express");
const problemRouter = express.Router();

const adminMiddleware = require("../middleware/adminMiddleware")
const createProblem = require("../controllers/userProblem")


problemRouter.post("/create",adminMiddleware, createProblem);
// problemRouter.delete("/:id", deleteProblem);
// problemRouter.patch("/:id", updateProblem);


// problemRouter.get("/:id",getProblemById);
// problemRouter.get("/", getAllProblem);
// problemRouter.get("/user", solvedAllProblembyUser);


module.exports = problemRouter;