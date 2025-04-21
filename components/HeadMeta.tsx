type Props = {
    title: string;
    description?: string;
    url: string;
    image?: string;
};

export default function HeadMeta({ title, description, url, image }: Props) {
    return (
        <head>
            <title>{title}</title>
            <meta name="description" content={description ?? title} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description ?? title} />
            <meta property="og:type" content="article" />
            <meta property="og:url" content={url} />
            {image && <meta property="og:image" content={image} />}
        </head>
    );
}