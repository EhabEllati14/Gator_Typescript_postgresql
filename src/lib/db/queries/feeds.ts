import { db } from "..";
import { feeds, users, feedFollows, posts } from "../schema";
import { eq, and, desc, inArray } from "drizzle-orm";

export async function createFeed(name: string, url: string, userId: string) {
  const [result] = await db
    .insert(feeds)
    .values({ name, url, userId })
    .returning();
  return result;
}

export async function getFeedByUrl(url: string) {
  const [feed] = await db.select().from(feeds).where(eq(feeds.url, url));
  return feed;
}

export async function createFeedFollow(userId: string, feedId: string) {
  const [result] = await db
    .insert(feedFollows)
    .values({ userId, feedId })
    .returning();

  const [full] = await db
    .select({
      userName: users.name,
      feedName: feeds.name,
    })
    .from(feedFollows)
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .where(eq(feedFollows.id, result.id));

  return full;
}

export async function getFeedFollowsForUser(userId: string) {
  return await db
    .select({ feedName: feeds.name })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .where(eq(feedFollows.userId, userId));
}

export async function deleteFeedFollowByUrl(userId: string, url: string) {
  const feed = await getFeedByUrl(url);
  if (!feed) return;

  await db
    .delete(feedFollows)
    .where(
      and(
        eq(feedFollows.userId, userId),
        eq(feedFollows.feedId, feed.id)
      )
    );
}

export async function createPost(data: {
  title: string;
  url: string;
  description?: string;
  publishedAt?: Date;
  feedId: string;
}) {
  try {
    await db.insert(posts).values(data);
  } catch {
    // ignore duplicate url errors
  }
}

export async function getPostsForUser(userId: string, limit: number) {
  const userFeeds = await db
    .select({ feedId: feedFollows.feedId })
    .from(feedFollows)
    .where(eq(feedFollows.userId, userId));

  const feedIds = userFeeds.map((f) => f.feedId);
  if (feedIds.length === 0) return [];

  return await db
    .select()
    .from(posts)
    .where(inArray(posts.feedId, feedIds))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
}
