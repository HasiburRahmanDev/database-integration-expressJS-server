import { pool } from "../../db";
import type { IUser } from "./user.interface";

const createUserIntoDB = async (payload: IUser) => {
  const { email, name, age, password } = payload;
  const result = await pool.query(
    `
          INSERT INTO users(email, name, age, password) VALUES($1,$2, $3,$4) 
          RETURNING * `,
    [email, name, age, password],
  );
  return result;
};

const getAllUsersFromDB = async () => {
  const result = await pool.query(`
          SELECT * FROM users
          `);

  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const result = await pool.query(
    `
      SELECT * FROM users WHERE id=$1
      `,
    [id],
  );
  return result;
};

const updateUserFromDB = async (payload: IUser, id: string) => {
  const { name, age, password, is_active } = payload;
  const result = await pool.query(
    `
      UPDATE users set 
      name=COALESCE($1,name), 
      age=COALESCE($2,age), 
      password=COALESCE($3,password), 
      is_active=COALESCE($4,is_active) 
      WHERE id=$5 RETURNING *
      `,
    [name, age, password, is_active, id],
  );

  return result;
};

const deleteUserFromDB = async (id: string) => {
  const result = await pool.query(
    `
      DELETE FROM users WHERE id=$1
      `,
    [id],
  );
  return result;
};

export const userService = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserFromDB,
  deleteUserFromDB,
};
