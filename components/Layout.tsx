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
            <main class="flex-grow">{children}</main>
            <Footer />
        </div>
    )
}