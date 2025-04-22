import { Handlers, PageProps } from "$fresh/server.ts";
import { extract } from "$std/front_matter/yaml.ts";
import MarkdownIt from "https://esm.sh/markdown-it@13.0.1"
import { basename } from "$std/path/mod.ts";
import Layout from "../../components/Layout.tsx";

type Project = {
    slug: string;
    title: string;
    created: string;
    thumbnail?: string;
    tags: string[];
    links: {label: string; url: string} [];
    excerpt: string;
};

export const handler: Handlers<Project[]> = {
    async GET(_, ctx) {
        const projectsDir = "content/projects";
        const projects: Project[] = [];
        const mdParser = new MarkdownIt();

        for await (const entry of Deno.readDir(projectsDir)) {
            if (!entry.name.endsWith(".md")) continue;
            
            const text = await Deno.readTextFile(`${projectsDir}/${entry.name}`);
            const { attrs, body } = extract(text);
            if (attrs.published !== true) continue;
            
            projects.push({
                slug: basename(entry.name, ".md"),
                title: attrs.title as string ?? entry.name,
                created: attrs.created as string?? "",
                thumbnail: attrs.thumbnail as string ?? null,
                tags: attrs.tags as string[] ?? [],
                links: attrs.links as {label:string, url:string}[] ?? [],
                excerpt: mdParser.render(body).slice(0, 300), // HTML 요약
            });
        }

        return ctx.render(projects);
    },
};

export default function ProjectPage({ data }: PageProps<Project[]>) {
    return (
        <Layout>
            <h1 class="text-3xl font-bold mb-6">📂 프로젝트 노트</h1>
            <ul class="grid gap-6">
                {data.map((project) => (
                    <li class="p-4 border rounded shadow hover:shadow-md transition">
                        {project.thumbnail && (
                            <img
                                src={project.thumbnail}
                                alt={project.title}
                                class="w-full h-48 object-cover mb-3 rounded"
                            />
                        )}
                        <a href={`/projects/${project.slug}`} class="text-lx font-semibold text-lessernavy hover:text-mint">
                            {project.title}
                        </a>
                        <p class="text-sm text-gray-500 mt-1">{project.created}</p>

                        <div class="flex flex-wrap gap-2 mt-2">
                            {project.tags.map((tag) =>  (
                                <span class="bg-champagne text-sm px-2 py-0.5 rounded text-gray-800">#{tag}</span>
                            ))}
                        </div>

                        <div
                            class="prose max-w-none text-sm text-gray-700"
                            dangerouslySetInnerHTML={{ __html: project.excerpt }}
                        />

                        <div class="flex gap-3 mt-4">
                            {project.links.map((link) =>
                            <a
                                href={link.url}
                                class="text-sm underline text-mint hover:text-lessernavy"
                                target="_blank"
                            >
                                {link.label}
                            </a>)}
                        </div>
                    </li>
                ))}
            </ul>
        </Layout>
        // <main class="p-8 max-w-4xl mx-auto">
        // </main>
    );
}