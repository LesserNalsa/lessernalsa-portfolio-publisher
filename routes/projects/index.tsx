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
    type: string;
    links: {label: string; url: string} [];
    excerpt: string;
};

const TYPES = ["tool", "video", "site", "app", "code"];

type Data = {
    projects: Project[];
    selectedTag: string | null;
    selectedType: string | null;
}

export const handler: Handlers<Data> = {
    async GET(req, ctx) {
        const tag = new URL(req.url).searchParams.get("tag");
        const type = new URL(req.url).searchParams.get("type");

        const projectsDir = "content/projects";
        const projects: Project[] = [];
        const mdParser = new MarkdownIt();

        for await (const entry of Deno.readDir(projectsDir)) {
            if (!entry.name.endsWith(".md")) continue;
            
            const raw = await Deno.readTextFile(`${projectsDir}/${entry.name}`);
            const { attrs, body } = extract(raw);
            if (attrs.published !== true) continue;

            const tags = attrs.tags as string[] ?? [];

            if  (tag && !tags.includes(tag)) continue;
            if (type && type !== attrs.type) continue;
            
            projects.push({
                slug: basename(entry.name, ".md"),
                title: attrs.title as string ?? entry.name,
                created: attrs.created as string?? "",
                thumbnail: attrs.thumbnail as string ?? null,
                tags,
                type: attrs.type as string ?? "etc",
                links: attrs.links as {label:string, url:string}[] ?? [],
                excerpt: mdParser.render(body).slice(0, 300), // HTML 요약
            });
        }

        return ctx.render({projects, selectedTag: tag, selectedType: type});
    },
};

function typeBadge(type: string){
    const styleMap: Record<string, string> = {
        tool:   "bg-mint",
        video:  "bg-blue-300",
        site:   "bg-yellow-200",
        app:    "bg-pink-300",
        code:   "bg-purple-200",
        etc:    "bg-gray-200",
    };
    return styleMap[type] ?? styleMap["etc"];
}

export default function ProjectPage({ data }: PageProps<Data>) {
    const { projects, selectedTag, selectedType } = data;
    return (
        <Layout>
            <h1 class="text-3xl font-bold mb-6">📂 프로젝트 노트</h1>

            <div class="flex gap-3 flex-wrap mb-6">
                <a
                    href="/projects"
                    class={`px-3 py-1 rounded border text-sm ${!selectedTag ? "bg-lessernavy text-white" : "bg-white text-gray-600 border-gray-300"}`}
                >
                        전체
                    </a>
                    {TYPES.map((type) => (
                        <a
                            href={`/projects?type=${type}`}
                            class={`px-3 py-1 rounded border text-sm ${selectedType === type ? "bg-lessernavy text-white" : "bg-white text-gray-600 border-gray-300"}`}
                        >
                            {type}
                        </a>      
                    ))}
            </div>

            {selectedTag && (
                <div class="mb-4">
                    <span class="mb-4 text-gray-600">Tag: </span>
                    <span class="inline-block bg-mint text-white px-2 py-0.5 rounded text-sm font-medium">{data.selectedTag}</span>
                    <a href='/projects' class="ml-4 text-sm text-blue-500 underline">모두 보기</a>
                </div>
            )}
            <ul class="grid gap-6">
                {projects.map((project) => (
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
                        {/* <a href={`/projects?type=${project.type}`} class={`inline-block px-2 py-0.5 rounded text-sm text-white ${typeBedge(project.type)}`}>
                            {project.type}
                        </a> */}
                        <span class={`inline-block text-xs px-2 py-0.5 rounded ${typeBadge(project.type)} text-white mb-2`}>
                            {project.type}
                        </span>
                        <p class="text-sm text-gray-500 mt-1">{project.created}</p>

                            <div class="flex flex-wrap gap-2 mt-2">
                                {project.tags.map((tag) =>  (
                                    <a 
                                        href={`/projects?tag=${encodeURIComponent(tag)}`}
                                        class="bg-champagne text-sm px-2 py-0.5 rounded text-gray-800 hover:bg-yellow-200"
                                    >
                                        #{tag}
                                    </a>
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