import { readConfig, setUser } from "./config";
import {
  createUser,
  getUserByName,
  deleteAllUsers,
} from "./lib/db/queries/users";
import {
  createFeed,
  getFeedByUrl,
  createFeedFollow,
  getFeedFollowsForUser,
  deleteFeedFollowByUrl,
} from "./lib/db/queries/feeds";
import { db } from "./lib/db";
import { users } from "./lib/db/schema";
import { eq } from "drizzle-orm";
import type { User } from "./lib/db/schema";

type CommandHandler = (args: string[]) => Promise<void>;

type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
  return async (args: string[]) => {
    const config = readConfig();
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.name, config.currentUserName));

    if (!user) process.exit(1);

    const cmdName = process.argv[2];
    await handler(cmdName, user, ...args);
  };
}

const commands: Record<string, CommandHandler> = {
  register: async (args) => {
    if (args.length < 1) process.exit(1);
    const name = args[0];
    const existing = await getUserByName(name);
    if (existing) process.exit(1);

    await createUser(name);
    setUser(name);
  },

  login: async (args) => {
    if (args.length < 1) process.exit(1);
    const name = args[0];
    const user = await getUserByName(name);
    if (!user) process.exit(1);

    setUser(name);
  },

  reset: async () => {
    await deleteAllUsers();
  },

  addfeed: middlewareLoggedIn(async (_cmd, user, ...args) => {
    if (args.length < 2) process.exit(1);

    const [name, url] = args;
    const feed = await createFeed(name, url, user.id);
    const follow = await createFeedFollow(user.id, feed.id);

    console.log(follow.feedName);
    console.log(follow.userName);
  }),

  follow: middlewareLoggedIn(async (_cmd, user, ...args) => {
    if (args.length < 1) process.exit(1);

    const url = args[0];
    const feed = await getFeedByUrl(url);
    if (!feed) process.exit(1);

    const follow = await createFeedFollow(user.id, feed.id);

    console.log(follow.feedName);
    console.log(follow.userName);
  }),

  unfollow: middlewareLoggedIn(async (_cmd, user, ...args) => {
    if (args.length < 1) process.exit(1);

    const url = args[0];
    await deleteFeedFollowByUrl(user.id, url);
  }),

  following: middlewareLoggedIn(async (_cmd, user) => {
    const follows = await getFeedFollowsForUser(user.id);

    for (const f of follows) {
      console.log(f.feedName);
    }
  }),
};

async function runCommand() {
  const [, , command, ...args] = process.argv;
  const handler = commands[command];
  if (!handler) process.exit(1);
  await handler(args);
}

async function main() {
  await runCommand();
  process.exit(0);
}

main();
