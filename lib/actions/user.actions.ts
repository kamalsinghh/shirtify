"use server";

import { auth } from "@clerk/nextjs/server";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { ClerkUser } from "../types";

export const createUser = async ({
  id,
  firstName,
  lastName,
  username,
  avatar,
}: ClerkUser) => {
  try {
    await sql`
      INSERT INTO users (
        id,
        first_name,
        last_name,
        username,
        avatar
      )
      VALUES (
        ${id},
        ${firstName},
        ${lastName},
        ${username},
        ${avatar}
      )
      ON CONFLICT (id) DO NOTHING
    `;
  } catch (error) {
    console.error("Failed to create user:", error);

    return {
      success: false,
      message: "Database Error: Failed to Create User.",
    };
  }

  return {
    success: true,
  };
};

export const updateUser = async ({
  id,
  firstName,
  lastName,
  username,
  avatar,
}: ClerkUser) => {
  try {
    await sql`
      UPDATE users
      SET
        first_name = ${firstName},
        last_name = ${lastName},
        username = ${username},
        avatar = ${avatar}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error("Failed to update user:", error);

    return {
      success: false,
      message: "Database Error: Failed to Update User.",
    };
  }

  revalidatePath(`/profile/${id}`);

  return {
    success: true,
  };
};

export const updateUserBio = async (id: string, bio: string) => {
  const { userId } = await auth();

  if (!userId || userId !== id) {
    throw new Error("You are not authorized.");
  }

  const cleanedBio = bio.trim();

  if (cleanedBio.length > 300) {
    throw new Error("Bio must be 300 characters or fewer.");
  }

  try {
    await sql`
      UPDATE users
      SET bio = ${cleanedBio}
      WHERE id = ${userId}
    `;
  } catch (error) {
    console.error("Failed to update bio:", error);
    throw new Error("Database Error: Failed to Update Bio.");
  }

  revalidatePath(`/profile/${userId}`);

  return {
    success: true,
  };
};

export const getUserDetails = async (userId: string) => {
  try {
    const result = await sql`
      SELECT
        id,
        first_name AS "firstName",
        last_name AS "lastName",
        username,
        avatar,
        bio
      FROM users
      WHERE id = ${userId}
    `;

    return result.rows;
  } catch (error) {
    console.error("Failed to retrieve user:", error);
    throw new Error("Database Error: Failed to Retrieve User.");
  }
};

export const isFollowingUser = async (
  followerId: string,
  followeeId: string,
) => {
  if (!followerId || !followeeId) {
    return {
      exists: false,
    };
  }

  try {
    const result = await sql`
      SELECT EXISTS (
        SELECT 1
        FROM user_following
        WHERE
          follower_id = ${followerId}
          AND followee_id = ${followeeId}
      ) AS exists
    `;

    return {
      exists: Boolean(result.rows[0]?.exists),
    };
  } catch (error) {
    console.error("Failed to check following status:", error);

    return {
      exists: false,
    };
  }
};

export const followUser = async (followerId: string, followeeId: string) => {
  const { userId } = await auth();

  if (!userId || userId !== followerId) {
    throw new Error("You are not authorized.");
  }

  if (followerId === followeeId) {
    throw new Error("You cannot follow yourself.");
  }

  try {
    await sql`
      INSERT INTO user_following (
        follower_id,
        followee_id
      )
      SELECT
        ${userId},
        ${followeeId}
      WHERE NOT EXISTS (
        SELECT 1
        FROM user_following
        WHERE
          follower_id = ${userId}
          AND followee_id = ${followeeId}
      )
    `;
  } catch (error) {
    console.error("Failed to follow user:", error);
    throw new Error("Database Error: Failed to Follow User.");
  }

  revalidatePath(`/profile/${userId}`);
  revalidatePath(`/profile/${followeeId}`);

  return {
    success: true,
  };
};

export const unFollowUser = async (followerId: string, followeeId: string) => {
  const { userId } = await auth();

  const canDeleteConnection = userId === followerId || userId === followeeId;

  if (!userId || !canDeleteConnection) {
    throw new Error("You are not authorized.");
  }

  try {
    await sql`
      DELETE FROM user_following
      WHERE
        follower_id = ${followerId}
        AND followee_id = ${followeeId}
    `;
  } catch (error) {
    console.error("Failed to unfollow user:", error);
    throw new Error("Database Error: Failed to Unfollow User.");
  }

  revalidatePath(`/profile/${followerId}`);
  revalidatePath(`/profile/${followeeId}`);

  return {
    success: true,
  };
};

export const getFollowersList = async (userId: string) => {
  try {
    const result = await sql`
      SELECT
        users.id AS "userId",
        users.username,
        users.first_name AS "firstName",
        users.last_name AS "lastName",
        users.avatar
      FROM user_following
      JOIN users
        ON user_following.follower_id = users.id
      WHERE user_following.followee_id = ${userId}
      ORDER BY users.username ASC
    `;

    return result.rows;
  } catch (error) {
    console.error("Failed to retrieve followers:", error);

    throw new Error("Database Error: Failed to Retrieve Followers.");
  }
};

export const getFollowingList = async (userId: string) => {
  try {
    const result = await sql`
      SELECT
        users.id AS "userId",
        users.username,
        users.first_name AS "firstName",
        users.last_name AS "lastName",
        users.avatar
      FROM user_following
      JOIN users
        ON user_following.followee_id = users.id
      WHERE user_following.follower_id = ${userId}
      ORDER BY users.username ASC
    `;

    return result.rows;
  } catch (error) {
    console.error("Failed to retrieve following list:", error);

    throw new Error("Database Error: Failed to Retrieve Following.");
  }
};
