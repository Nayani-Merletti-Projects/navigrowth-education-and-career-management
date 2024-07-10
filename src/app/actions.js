"use server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

// Get all users
export async function getAllUsers() {
  return await sql`SELECT * FROM "user"`;
}

// Get user by id
export async function getUserById(id) {
  return await sql`SELECT * FROM "user" WHERE id = ${id}`;
}

// Get user by username
export async function getUserByUsername(username) {
  return await sql`SELECT * FROM "user" WHERE username = ${username}`;
}

// Create new user
export async function createUser(username, password, skills, path, goals) {
  return await sql`
    INSERT INTO "user" (username, password, skills, path, goals)
    VALUES (${username}, ${password}, ${skills}, ${path}, ${goals})
    RETURNING *
  `;
}

// Update user
export async function updateUser(id, username, password, skills, path, goals) {
  return await sql`
    UPDATE "user"
    SET username = ${username},
        password = ${password},
        skills = ${skills},
        path = ${path},
        goals = ${goals}
    WHERE id = ${id}
    RETURNING *
  `;
}

// Delete user
export async function deleteUser(id) {
  return await sql`DELETE FROM "user" WHERE id = ${id}`;
}

// Get username
export async function getUsername(id) {
  const result = await sql`SELECT username FROM "user" WHERE id = ${id}`;
  return result[0]?.username;
}

// Set username
export async function setUsername(id, newUsername) {
  return await sql`UPDATE "user" SET username = ${newUsername} WHERE id = ${id} RETURNING username`;
}

// Get password (Note: In practice, you should never return passwords)
export async function getPassword(id) {
  const result = await sql`SELECT password FROM "user" WHERE id = ${id}`;
  return result[0]?.password;
}

// Set password
export async function setPassword(id, newPassword) {
  return await sql`UPDATE "user" SET password = ${newPassword} WHERE id = ${id} RETURNING id`;
}

// Get skills
export async function getSkills(id) {
  const result = await sql`SELECT skills FROM "user" WHERE id = ${id}`;
  return result[0]?.skills;
}

// Set skills
export async function setSkills(id, newSkills) {
  return await sql`UPDATE "user" SET skills = ${newSkills} WHERE id = ${id} RETURNING skills`;
}

// Add skill
export async function addSkill(id, newSkill) {
  return await sql`UPDATE "user" SET skills = array_append(skills, ${newSkill}) WHERE id = ${id} RETURNING skills`;
}

// Remove skill
export async function removeSkill(id, skillToRemove) {
  return await sql`UPDATE "user" SET skills = array_remove(skills, ${skillToRemove}) WHERE id = ${id} RETURNING skills`;
}

// Get path
export async function getPath(id) {
  const result = await sql`SELECT path FROM "user" WHERE id = ${id}`;
  return result[0]?.path;
}

// Set path
export async function setPath(id, newPath) {
  return await sql`UPDATE "user" SET path = ${newPath} WHERE id = ${id} RETURNING path`;
}

// Get goals
export async function getGoals(id) {
  const result = await sql`SELECT goals FROM "user" WHERE id = ${id}`;
  return result[0]?.goals;
}

// Set goals
export async function setGoals(id, newGoals) {
  return await sql`UPDATE "user" SET goals = ${newGoals} WHERE id = ${id} RETURNING goals`;
}

// Get users by skill
export async function getUsersBySkill(skill) {
  return await sql`SELECT * FROM "user" WHERE ${skill} = ANY(skills)`;
}

// Get users by path
export async function getUsersByPath(path) {
  return await sql`SELECT * FROM "user" WHERE path = ${path}`;
}

// Search users by username, skills, or goals
export async function searchUsers(query) {
  return await sql`
    SELECT * FROM "user"
    WHERE username ILIKE ${"%" + query + "%"}
    OR ${query} = ANY(skills)
    OR goals ILIKE ${"%" + query + "%"}
  `;
}

// Count total users
export async function countUsers() {
  const result = await sql`SELECT COUNT(*) FROM "user"`;
  return result[0].count;
}

// Get all unique skills
export async function getAllUniqueSkills() {
  return await sql`SELECT DISTINCT unnest(skills) AS skill FROM "user" ORDER BY skill`;
}

// Get all unique paths
export async function getAllUniquePaths() {
  return await sql`SELECT DISTINCT path FROM "user" ORDER BY path`;
}

// Get users with most skills
export async function getUsersWithMostSkills(limit = 10) {
  return await sql`
    SELECT id, username, array_length(skills, 1) AS skill_count
    FROM "user"
    ORDER BY array_length(skills, 1) DESC
    LIMIT ${limit}
  `;
}

// Get users with least skills
export async function getUsersWithLeastSkills(limit = 10) {
  return await sql`
    SELECT id, username, array_length(skills, 1) AS skill_count
    FROM "user"
    ORDER BY array_length(skills, 1) ASC
    LIMIT ${limit}
  `;
}

// Get most common goals
export async function getMostCommonGoals(limit = 10) {
  return await sql`
    SELECT goals, COUNT(*) AS count
    FROM "user"
    GROUP BY goals
    ORDER BY count DESC
    LIMIT ${limit}
  `;
}

// Get users with similar skills
export async function getUsersWithSimilarSkills(userId, limit = 10) {
  const userSkills = await getSkills(userId);
  return await sql`
    SELECT id, username, skills,
           array_length(ARRAY(SELECT UNNEST(skills) INTERSECT SELECT UNNEST(${userSkills})), 1) AS common_skills_count
    FROM "user"
    WHERE id != ${userId}
    ORDER BY common_skills_count DESC
    LIMIT ${limit}
  `;
}
