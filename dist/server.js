import express, {} from "express";
import { error } from "node:console";
import { Pool } from "pg";
import config from "./config";
const app = express();
const port = config.port;
app.use(express.json());
const pool = new Pool({
    connectionString: config.connection_string,
});
const initDB = async () => {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(20),
      email VARCHAR(20) UNIQUE NOT NULL,
      password VARCHAR(20) NOT NULL,
      is_active BOOLEAN DEFAULT true,
      age INT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      )
      `);
        console.log("database connected successfully");
    }
    catch (error) {
        console.log(error);
    }
};
initDB();
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Express server",
        author: "Next level",
    });
});
// Post users in the database
app.post("/api/users", async (req, res) => {
    const { email, name, age, password } = req.body;
    try {
        const result = await pool.query(`
      INSERT INTO users(email, name, age, password) VALUES($1,$2, $3,$4) 
      RETURNING * `, [email, name, age, password]);
        res.status(201).json({
            message: "user created successfully",
            data: result.rows[0],
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
            error: error,
        });
    }
});
app.get("/api/users", async (req, res) => {
    try {
        const result = await pool.query(`
          SELECT * FROM users
          `);
        res.status(200).json({
            success: true,
            message: "users retrieved successfully",
            data: result.rows,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error,
        });
    }
});
// get a single user
app.get("/api/users/:id", async (req, res) => {
    const { id } = req.params;
    // console.log(id);
    try {
        const result = await pool.query(`
      SELECT * FROM users WHERE id=$1
      `, [id]);
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "user not found",
                data: {},
            });
        }
        res.status(200).json({
            success: true,
            message: "user retrieved successfully",
            data: result.rows[0],
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error,
        });
    }
});
// Update user
app.put("/api/users/:id", async (req, res) => {
    const { id } = req.params;
    const { name, age, password, is_active } = req.body;
    try {
        const result = await pool.query(`
      UPDATE users set 
      name=COALESCE($1,name), 
      age=COALESCE($2,age), 
      password=COALESCE($3,password), 
      is_active=COALESCE($4,is_active) 
      WHERE id=$5 RETURNING *
      `, [name, age, password, is_active, id]);
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "user not found",
                data: {},
            });
        }
        res.status(200).json({
            success: true,
            message: "Updated successfully",
            data: result.rows[0],
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error,
        });
    }
});
// Delete user
app.delete("/api/users/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
      DELETE FROM users WHERE id=$1
      `, [id]);
        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "user not found",
                data: {},
            });
        }
        res.status(200).json({
            success: true,
            message: "Deleted successfully",
            data: {},
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error,
        });
    }
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
//# sourceMappingURL=server.js.map