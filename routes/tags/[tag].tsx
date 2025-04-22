import { Handlers, PageProps } from "$fresh/server.ts";
import { extract } from "$std/front_matter/yaml.ts";
import { basename } from "$std/path/mod.ts";
import Layout from "../../components/Layout.tsx";

type ContentMeta = {
    slug: string;
    title: string;
    created: string;
    tags: string[];
    type: "note" | "project";
};

type Data = {
    tag: string;
    notes: ContentMeta[];
    projects: ContentMeta[];
};

export const handler: Handlers<Data> = {
    async GET(req, ctx) {
        const tag = decodeURIComponent(ctx.params.tag);
        const notes: ContentMeta[] = [];
        const projects: ContentMeta[] = [];
        const notesDir = "content/notes";
        const projectsDir = "content/projects";

        for await (const entry of Deno.readDir(notesDir)){
            if (!entry.name.endsWith(".md")) continue;
            
            const text = await Deno.readTextFile(`${notesDir}/${entry.name}`);
            const { attrs } = extract(text);
            if (attrs.published !== true) continue;

            const tags = attrs.tags as string[] ?? [];

            if (tags.includes(tag)) {
                notes.push({
                    slug: basename(entry.name, ".md"),
                    title: attrs.title as string ?? entry.name,
                    created: attrs.created as string ?? "",
                    tags,
                    type: "note",
                });
            }
        }

        for await (const entry of Deno.readDir(projectsDir)){
            if (!entry.name.endsWith(".md")) continue;
            
            const text = await Deno.readTextFile(`${projectsDir}/${entry.name}`);
            const { attrs } = extract(text);
            if (attrs.published !== true) continue;

            const tags = attrs.tags as string[] ?? [];

            if (tags.includes(tag)) {
                projects.push({
                    slug: basename(entry.name, ".md"),
                    title: attrs.title as string ?? entry.name,
                    created: attrs.created as string ?? "",
                    tags,
                    type: "project",
                });
            }
        }

        return ctx.render({ tag, notes, projects });
    }
};

export default function TagPage({ data }: PageProps<Data>) {
    const { tag, notes, projects } = data;
    
    return (
        <Layout>
            <h1 class="p-8 max-w-4xl mx-auto">
            🏷️ 태그: <span class="text-mint">#{tag}</span>
            </h1>
            <p class="text-sm text-gray-500 mb-4">
                프로젝트 {projects.length}개 / 노트 {notes.length}개
            </p>
            <a href="/tags" class="text-sm text-blue-500 underline mb-6 inline-block">
                전체 태그 보기 →
            </a>

            {projects.length > 0 && (
                <>
                    <h2 class="text-xl font-semibold mt-6 mb-2 text-lessernavy">📂 관련 프로젝트</h2>
                    <ul class="grid gap-4">
                        {projects.map((project) => (
                            <li class="border rounded p-4 shadow hover:shadow-md transition">
                                <a href={`/projects/${project.slug}`} class="text-lg font-bold text-mint hover:underline">
                                    {project.title}
                                </a>
                                <p class="text-sm text-gray-500">{project.created}</p>
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {notes.length > 0 && (
                <>
                    <h2 class="text-xl font-semibold mt-6 mb-2 text-lessernavy">📚 관련 노트</h2>
                    <ul class="grid gap-4">
                        {notes.map((note) => (
                            <li class="border rounded p-4 shadow hover:shadow-md transition">
                                <a href={`/notes/${note.slug}`} class="text-lg font-bold text-mint hover:underline">
                                    {note.title}
                                </a>
                                <p class="text-sm text-gray-500">{note.created}</p>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </Layout>
    )
}