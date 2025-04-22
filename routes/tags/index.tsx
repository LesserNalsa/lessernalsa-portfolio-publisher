import { Handlers, PageProps } from "$fresh/server.ts";
import { extract } from "$std/front_matter/yaml.ts";
import Layout from "../../components/Layout.tsx";

type TagMeta = {
    name: string;
    count: number;
};

export const handler: Handlers<TagMeta[]> = {
    async GET(_, ctx) {
        const notesDir = "content/notes";
        const projectsDir = "content/projects";
        const tagCount: Record<string, number> = {};

        const contentPaths =  [
            {dir: "content/notes", type: "note"},
            {dir: "content/projects", type: "project"},
        ];

        for (const { dir } of contentPaths) {
            for await (const entry of Deno.readDir(dir)) {
                if (!entry.name.endsWith(".md")) continue;

                const text = await Deno.readTextFile(`${dir}/${entry.name}`);
                const { attrs } = extract(text);
                if (attrs.published !== true) continue;

                const tags = attrs.tags as string[] ?? [];

                for (const tag of tags) {
                    tagCount[tag] = (tagCount[tag] || 0) + 1;
                }
            }
        }

        const sortedTags = Object.entries(tagCount)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => a.name.localeCompare(b.name));

        return ctx.render(sortedTags)
    },
};

export default function TagsPage({ data }: PageProps<TagMeta[]>) {
    return (
        <Layout>
            <h1 class="text-3xl font-bold mb-6">🏷️ 전체 태그</h1>
            <ul class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {data.map((tag) => (
                    <li>
                        <a 
                            href={`/tags/${encodeURIComponent(tag.name)}`} 
                            class="text-mint hover:text-lassernavy text-sm font-medium underline"
                        >
                            #{tag.name} <span class="text-gray-500">({tag.count})</span>
                        </a>
                    </li>
                ))}
            </ul>
        </Layout>
    );
}