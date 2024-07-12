"use server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export async function getAllUsers() {
  return await sql`SELECT * FROM id`;
}

export async function getUserById(userId) {
  return await sql`SELECT * FROM id WHERE id = ${userId}`;
}

export async function getUserByUsername(username) {
  return await sql`SELECT * FROM id WHERE username LIKE ${username + '%'}`;
}

export async function createUser(username, email, password) {
  const combinedUsername = `${username}|${email}`;
  return await sql`
    INSERT INTO id (username, password, skills, goals)
    VALUES (${combinedUsername}, ${password}, '[]'::json, '[]'::json)
    RETURNING *
  `;
}

export async function updateUser(userId, username, email, password, path) {
  const combinedUsername = `${username}|${email}`;
  return await sql`
    UPDATE id
    SET username = ${combinedUsername},
        password = ${password},
        path = ${path}
    WHERE id = ${userId}
    RETURNING *
  `;
}

export async function deleteUser(userId) {
  return await sql`DELETE FROM id WHERE id = ${userId}`;
}

export async function getUsername(userId) {
  const result = await sql`SELECT username FROM id WHERE id = ${userId}`;
  return result[0]?.username.split('|')[0];
}

export async function getEmail(userId) {
  const result = await sql`SELECT username FROM id WHERE id = ${userId}`;
  return result[0]?.username.split('|')[1];
}

export async function setUsername(userId, newUsername, newEmail) {
  const combinedUsername = `${newUsername}|${newEmail}`;
  return await sql`UPDATE id SET username = ${combinedUsername} WHERE id = ${userId} RETURNING username`;
}

export async function getPassword(userId) {
  const result = await sql`SELECT password FROM id WHERE id = ${userId}`;
  return result[0]?.password;
}

export async function setPassword(userId, newPassword) {
  return await sql`UPDATE id SET password = ${newPassword} WHERE id = ${userId} RETURNING id`;
}

export async function getAllSkills(userId) {
  const result = await sql`SELECT skills FROM id WHERE id = ${userId}`;
  console.log("Current skills in database:", result[0]?.skills);
  return result[0]?.skills || [];
}

export async function addSkill(userId, skillName, skillDescription) {
  console.log("Adding skill:", { userId, skillName, skillDescription });
  const newSkill = { name: skillName, description: skillDescription };
  try {
    const result = await sql`
      UPDATE id 
      SET skills = (
        CASE
          WHEN skills IS NULL OR skills::text = '[]' THEN json_build_array(${JSON.stringify(newSkill)}::json)
          ELSE (SELECT json_agg(el) FROM (SELECT json_array_elements(skills) as el UNION ALL SELECT ${JSON.stringify(newSkill)}::json) sub)
        END
      )
      WHERE id = ${userId}
      RETURNING skills
    `;
    console.log("Skill added, new skills array:", result[0]?.skills);
    return newSkill;
  } catch (error) {
    console.error("Error in addSkill:", error);
    throw error;
  }
}

export async function removeSkill(userId, skillName) {
  await sql`
    UPDATE id 
    SET skills = (
      SELECT COALESCE(json_agg(el), '[]'::json)
      FROM (
        SELECT el
        FROM json_array_elements(COALESCE(skills, '[]'::json)) el
        WHERE (el->>'name') != ${skillName}
      ) sub
    )
    WHERE id = ${userId}
  `;
}

export async function getPath(userId) {
  const result = await sql`SELECT path FROM id WHERE id = ${userId}`;
  return result[0]?.path;
}

export async function setPath(userId, newPath) {
  return await sql`UPDATE id SET path = ${newPath} WHERE id = ${userId} RETURNING path`;
}

export async function getGoals(userId) {
  const result = await sql`SELECT goals FROM id WHERE id = ${userId}`;
  return result[0]?.goals || [];
}

export async function setGoals(userId, newGoals) {
  return await sql`UPDATE id SET goals = ${JSON.stringify(newGoals)}::json WHERE id = ${userId} RETURNING goals`;
}

export async function getUsersBySkill(skill) {
  return await sql`SELECT * FROM id WHERE skills @> '[{"name": ${skill}}]'::json`;
}

export async function getUsersByPath(path) {
  return await sql`SELECT * FROM id WHERE path = ${path}`;
}

export async function searchUsers(query) {
  return await sql`
    SELECT * FROM id
    WHERE username ILIKE ${'%' + query + '%'}
    OR skills::text ILIKE ${'%' + query + '%'}
    OR goals::text ILIKE ${'%' + query + '%'}
  `;
}

export async function countUsers() {
  const result = await sql`SELECT COUNT(*) FROM id`;
  return result[0].count;
}

export async function getAllUniqueSkills() {
  return await sql`
    SELECT DISTINCT json_array_elements(skills)->>'name' AS skill 
    FROM id 
    WHERE skills IS NOT NULL AND skills != '[]'::json
    ORDER BY skill
  `;
}

export async function getAllUniquePaths() {
  return await sql`SELECT DISTINCT path FROM id WHERE path IS NOT NULL ORDER BY path`;
}

export async function getUsersWithMostSkills(limit = 10) {
  return await sql`
    SELECT id, username, json_array_length(skills) AS skill_count
    FROM id
    WHERE skills IS NOT NULL AND skills != '[]'::json
    ORDER BY skill_count DESC
    LIMIT ${limit}
  `;
}

export async function getUsersWithLeastSkills(limit = 10) {
  return await sql`
    SELECT id, username, json_array_length(skills) AS skill_count
    FROM id
    WHERE skills IS NOT NULL AND skills != '[]'::json
    ORDER BY skill_count ASC
    LIMIT ${limit}
  `;
}

export async function getMostCommonGoals(limit = 10) {
  return await sql`
    SELECT json_array_elements(goals) AS goal, COUNT(*) AS count
    FROM id
    WHERE goals IS NOT NULL AND goals != '[]'::json
    GROUP BY goal
    ORDER BY count DESC
    LIMIT ${limit}
  `;
}

export async function getUsersWithSimilarSkills(userId, limit = 10) {
  const userSkills = await getAllSkills(userId);
  return await sql`
    SELECT id, username, skills,
           (SELECT COUNT(*) 
            FROM json_array_elements(id.skills) user_skill
            WHERE user_skill->>'name' IN (SELECT skill->>'name' FROM json_array_elements(${JSON.stringify(userSkills)}::json) skill)
           ) AS common_skills_count
    FROM id
    WHERE id != ${userId} AND skills IS NOT NULL AND skills != '[]'::json
    ORDER BY common_skills_count DESC
    LIMIT ${limit}
  `;
}