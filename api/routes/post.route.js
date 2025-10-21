import express from "express";

const router = express.Router() ;

router.get("/test", (req, res) => {
console. log ("router works!");
res.send("Post route works and server is responding!");
});

export default router;