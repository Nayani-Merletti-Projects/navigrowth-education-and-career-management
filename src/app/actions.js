"use server";
import { neon } from "@neondatabase/serverless";
import bcrypt from 'bcrypt';

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
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('Creating user with hashed password:', hashedPassword);
  const result = await sql`
    INSERT INTO id (username, password, skills, goals)
    VALUES (${combinedUsername}, ${hashedPassword}, '[]'::json, '[]'::json)
    RETURNING *
  `;
  console.log('User created:', result[0]);
  return result[0];
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

export async function updateUsernameAndEmail(userId, newUsername, newEmail) {
  // First, get the current username and email
  const currentUser = await sql`SELECT username FROM id WHERE id = ${userId}`;
  const [currentUsername, currentEmail] = currentUser[0].username.split('|');

  // Use the new email if provided, otherwise use the current email
  const emailToUse = newEmail || currentEmail;

  const combinedUsername = `${newUsername}|${emailToUse}`;
  
  console.log(`Updating user ${userId} to: ${combinedUsername}`);

  const result = await sql`
    UPDATE id 
    SET username = ${combinedUsername} 
    WHERE id = ${userId} 
    RETURNING username
  `;

  console.log('Update result:', result);

  return result[0]?.username;
}


export async function getPassword(userId) {
  console.log('Getting password for user:', userId);
  const result = await sql`SELECT password FROM id WHERE id = ${userId}`;
  console.log('Database result:', result);
  return result[0]?.password;
}

export async function updatePassword(userId, newPassword) {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  return await sql`UPDATE id SET password = ${hashedPassword} WHERE id = ${userId} RETURNING id`;
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


export async function updateGoal(userId, goalData) {
  console.log("Updating goal:", { userId, goalData });
  try {
    // First, get the current goals
    const currentGoals = await sql`
      SELECT goals FROM id WHERE id = ${userId}
    `;

    let updatedGoals;
    if (!currentGoals[0]?.goals || currentGoals[0].goals.length === 0) {
      // If there are no goals, create a new array with the new goal
      updatedGoals = [goalData];
    } else {
      // If there are existing goals, update or add the new goal
      const existingGoals = currentGoals[0].goals;
      const goalIndex = existingGoals.findIndex(g => g.title === goalData.title);
      if (goalIndex !== -1) {
        // Update existing goal
        existingGoals[goalIndex] = goalData;
        updatedGoals = existingGoals;
      } else {
        // Add new goal
        updatedGoals = [...existingGoals, goalData];
      }
    }

    // Update the goals in the database
    const result = await sql`
      UPDATE id
      SET goals = ${JSON.stringify(updatedGoals)}
      WHERE id = ${userId}
      RETURNING goals
    `;

    console.log("Goal updated, new goals array:", result[0]?.goals);
    return result[0]?.goals;
  } catch (error) {
    console.error("Error in updateGoal:", error);
    throw error;
  }
}

export async function getGoals(userId) {
  const result = await sql`SELECT goals FROM id WHERE id = ${userId}`;
  console.log("Current goals in database:", result[0]?.goals);
  return result[0]?.goals || [];
}

export async function removeGoal(userId, goalTitle) {
  await sql`
    UPDATE id 
    SET goals = (
      SELECT COALESCE(json_agg(el), '[]'::json)
      FROM (
        SELECT el
        FROM json_array_elements(COALESCE(goals, '[]'::json)) el
        WHERE (el->>'title') != ${goalTitle}
      ) sub
    )
    WHERE id = ${userId}
  `;
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