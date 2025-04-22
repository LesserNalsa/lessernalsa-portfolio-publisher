import { Handlers, PageProps } from "$fresh/server.ts";
import { extract } from "$std/front_matter/yaml.ts";
import { basename } from "$std/path/mod.ts";
import MarkdownIT from "https://esm.sh/markdown-it@13.0.1";
import Layout from "../../components/Layout.tsx";
import { Head } from "$fresh/runtime.ts";
import HeadMeta from "../../components/HeadMeta.tsx";
import { stringToIdentifier } from "$fresh/src/server/init_safe_deps.ts";

type Project = {
    title: string;
    created: string;
    tags: string[];
    thumbnail?: string;
    links: {label: string; url: string}[];
    html: string;
};

export const handler: Handlers<Project> = {
    async GET(_, ctx) {
        const { slug } = ctx.params;
        const filePath = `content/projects/${slug}.md`;

        try{
            const md = await Deno.readTextFile(filePath);
            const { attrs, body } = extract(md);

            if (attrs.published !== true) {
                return new Response("Not Found", { status: 404 });
            }
    
            const mdParser = new MarkdownIT();
            const html = mdParser.render(body);

            return ctx.render({
                title: attrs.title as string ?? slug,
                created: attrs.created as string ?? "",
                tags: attrs.tags as string[] ?? [],
                thumbnail: attrs.thumbnail as string ?? null,
                links: attrs.links as {label: string, url: string}[] ?? [],
                html,
            })
        }catch (_) {
            return new Response("Not Found", { status: 404 });
        }
    },
};

export default function ProjectPage({data}: PageProps<Project>) {
    return (
        <>
            <Head>
                <HeadMeta
                    title={data.title}
                    description={data.html.slice(0, 150).replace(/<[^>]+>/g, "")}
                    url={`https://lessernalsa.dev/projects/${data.title}`}
                    image={`https://lessernalsa.dev/static/images/${data.title}.png`} // 있을 경우
                />
            </Head>
            <Layout>
                {data.thumbnail && (
                    <img
                        src={data.thumbnail}
                        alt={data.title}
                        class="w-full h-72 object-cover mb-6 rounded"
                    />
                )}
                <h1 class="text-3xl font-bold mb-2 text-lessernavy">{data.title}</h1>
                <p class="text-sm text-gray-500">{data.created}</p>

                <div class="flex gap-2 mt-2 mb-6">
                    {data.tags.map((tag) =>  (
                        <span class="bg-champagne text-sm px-2 py-0.5 rounded text-gray-800">#{tag}</span>
                    ))}
                </div>

                <div 
                    class="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: data.html }} 
                    />

                <div class="flex gap-4">
                    {data.links.map((link) => (
                        <a
                        href={link.url}
                        class="text-sm underline text-mint hover:text-lessernavy"
                        target="_blank"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            </Layout>
        </>
    );
}