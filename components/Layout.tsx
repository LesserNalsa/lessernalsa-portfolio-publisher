import { ComponentChildren } from "preact";
import Header from "./Header.tsx";
import Footer from "./Footer.tsx";

type Props = {
    children: ComponentChildren;
};

export default function Layout({ children }: Props) {
    return (
        <div class="min-h-screen flex flex-col bg-white text-gray-800 font-sans">
            <Header />
            <main class="flex-1 max-w-4xl max-auto w-full px-4 py-8">{children}</main>
            <Footer />
        </div>
    )
}