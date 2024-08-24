import { Link, Head } from "@inertiajs/react";

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const baseUrl = window.location.origin;

    return (
        <>
            <Head title="Welcome">
                <link rel="icon" type="image/x-icon" href={`${baseUrl}/images/consentprotect-fav.ico`}/>
            </Head>
            <div className="bg-gray-50 text-black/50">
                <img
                    id="background"
                    className="absolute w-full h-screen"
                    src="https://res.cloudinary.com/dieyb51bz/image/upload/v1713259123/my-rabbai/Fixed-aspect-ratio-spacer_cwpfgu.png"
                />
                <div className="relative min-h-screen selection:bg-[#FF2D20] selection:text-white">
                    <div className="relative w-full h-full">
                        <header className="flex items-center gap-2 py-5 lg:grid-cols-3 border-b">
                            <div><img src={`${baseUrl}/images/consentprotect-black.png`} className="md:h-16 md:ml-10 h-10 ml-5" alt="" /></div>
                            <nav className="px-6 flex flex-1 justify-end">
                                {auth.user ? (
                                    <Link
                                        href={route("dashboard")}
                                        className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20]"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route("login")}
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20]"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route("register")}
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20]"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </header>

                        <main className="h-full flex items-center justify-center w-full">
                            <div className="mt-52 ring-2 md:rounded-2xl ring-gray-400 p-10 bg-[#2c394b]">
                                {/* <h1 className="text-5xl font-extrabold bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-transparent bg-clip-text">
                                    Push Consent Protect
                                </h1> */}
                                <img src={`${baseUrl}/images/consentprotect-white.png`} className="h-24" alt="" />
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
}
