import { getSortedPosts } from "@utils/content-utils";
import { buildAtomFeed, renderFeedEntries } from "@utils/feed-utils";
import type { APIContext } from "astro";
import { profileConfig, siteConfig } from "@/config";
import pkg from "../../package.json";

export const prerender = true;

export async function GET(context: APIContext): Promise<Response> {
	const includeContent = (siteConfig.feed?.contentMode ?? "full") === "full";
	const blog = await getSortedPosts();
	const entries = await renderFeedEntries(blog, { includeContent });
	// site_url 留空时回退到本地基址，避免 new URL("") 抛错；填写正式域名后自动生效
	const site = context.site ?? new URL(siteConfig.site_url || "http://localhost:4321");
	const xml = buildAtomFeed({
		site,
		title: siteConfig.title,
		subtitle: siteConfig.subtitle || siteConfig.description || "",
		entries,
		authorName: profileConfig.name,
		generator: `Firefly v${pkg.version}`,
		includeContent,
	});
	return new Response(xml, {
		headers: { "Content-Type": "application/atom+xml; charset=utf-8" },
	});
}
