import { Handlers, PageProps } from "$fresh/server.ts";
import { extract } from "$std/front_matter/yaml.ts";
import { basename } from "$std/path/mod.ts";
import MarkdownIT from "https://esm.sh/markdown-it@13.0.1";
import Layout from "../../components/Layout.tsx";
import { Head } from "$fresh/runtime.ts";
import HeadMeta from "../../components/HeadMeta.tsx";
import { context } from "https://deno.land/x/esbuild@v0.20.2/mod.d.ts";

type Note = {
    title: string;
    created: string;
    tags: string[];
    html: string;
};

export const handler: Handlers<Note> = {
    async GET(_, ctx) {
        const { slug } = ctx.params;
        const filePath = `content/notes/${slug}.md`;

        try{
            const md = await Deno.readTextFile(filePath);
            const { attrs, body } = extract(md);

            if (attrs.published !== true) {
                return new Response("Not Found", { status: 404 });
            }
    
            const mdParser = new MarkdownIT();
            const html = mdParser.render(body);

            return ctx.render({
                title: attrs.title ?? slug,
                created: attrs.created ?? "",
                tags: attrs.tags ?? [],
                html,
            })
        }catch (_) {
            return new Response("Not Found", { status: 404 });
        }
    },
};

export default function NotePage({data}: PageProps<Note>) {
    return (
        <>
            <Head>
                <HeadMeta 
                    title={data.title}
                    description={data.html.slice(0, 150).replace(/<[^>]+>/g, "")}
                    url={`https://lesser.dev/notes/${data.title}`}
                />
            </Head>
            
            <Layout>
                <h1 class="text-3xl font-bold mb-2 text-lessernavy">{data.title}</h1>
                <p class="text-sm text-gray-500">{data.created}</p>
                <div class="flex gap-2 mt-2 mb-6">
                    {data.tags.map((tag) =>  (
                        <span class="bg-champagne text-sm px-2 py-0.5 rounded text-gray-800">#{tag}</span>
                    ))}
                </div>
                <article 
                    class="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: data.html }} 
                />
            </Layout>
            // <main class="p-8 max-w-3xl mx-auto">
            // </main>
        </>
    );
}