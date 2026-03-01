import { XMLParser } from "fast-xml-parser";

export type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
  const response = await fetch(feedURL, {
    headers: {
      "User-Agent": "gator",
    },
  });

  if (!response.ok) {
    throw new Error("failed to fetch feed");
  }

  const xmlText = await response.text();

  const parser = new XMLParser({
    ignoreAttributes: false,
  });

  const parsed = parser.parse(xmlText);

  if (!parsed.rss || !parsed.rss.channel) {
    throw new Error("invalid RSS format");
  }

  const channel = parsed.rss.channel;

  if (!channel.title || !channel.link || !channel.description) {
    throw new Error("missing channel metadata");
  }

  let items: any[] = [];

  if (channel.item) {
    if (Array.isArray(channel.item)) {
      items = channel.item;
    } else {
      items = [channel.item];
    }
  }

  const formattedItems: RSSItem[] = [];

  for (const item of items) {
    if (!item.title || !item.link || !item.description || !item.pubDate) {
      continue;
    }

    formattedItems.push({
      title: item.title,
      link: item.link,
      description: item.description,
      pubDate: item.pubDate,
    });
  }

  return {
    channel: {
      title: channel.title,
      link: channel.link,
      description: channel.description,
      item: formattedItems,
    },
  };
}
