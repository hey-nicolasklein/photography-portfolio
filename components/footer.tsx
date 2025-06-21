import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 mt-16">
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-gray-500 mb-4 md:mb-0 font-light tracking-wider uppercase">
                        © {new Date().getFullYear()} Nicolas Klein Photography
                    </p>
                    <div className="flex space-x-6">
                        <Link
                            href="/impressum"
                            className="text-sm text-gray-500 hover:text-black transition-colors font-light tracking-wider uppercase"
                        >
                            Impressum
                        </Link>
                        <Link
                            href="https://www.instagram.com/hey.nicolasklein/"
                            className="text-sm text-gray-500 hover:text-black transition-colors font-light tracking-wider uppercase"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Instagram
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
} 