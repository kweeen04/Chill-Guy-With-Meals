
import {
    Disclosure,

    DisclosurePanel,
} from '@headlessui/react'

import ProfileSideBar from './components/ProfileSideBar'

export default function Example({ children }) {

    return (
        <div>
            <Disclosure as="div" className="relative overflow-hidden bg-sky-700 pb-32 mt-16">
                <nav className="relative z-10 border-b border-teal-500/25 bg-transparent data-open:bg-sky-900 lg:border-none lg:bg-transparent data-open:lg:bg-transparent">
                    <DisclosurePanel className="bg-sky-900 lg:hidden">
                        <div className="border-t border-sky-800 pt-4 pb-3">
                        </div>
                    </DisclosurePanel>
                </nav>
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 inset-y-0 left-1/2 w-full -translate-x-1/2 transform overflow-hidden data-open:bottom-0 lg:inset-y-0 data-open:lg:inset-y-0"
                >
                    <div className="absolute inset-0 flex">
                        <div style={{ backgroundColor: '#0a527b' }} className="h-full w-1/2" />
                        <div style={{ backgroundColor: '#065d8c' }} className="h-full w-1/2" />
                    </div>
                    <div className="relative flex justify-center">
                        <svg width={1750} height={308} viewBox="0 0 1750 308" className="shrink-0">
                            <path d="M284.161 308H1465.84L875.001 182.413 284.161 308z" fill="#0369a1" />
                            <path d="M1465.84 308L16.816 0H1750v308h-284.16z" fill="#065d8c" />
                            <path d="M1733.19 0L284.161 308H0V0h1733.19z" fill="#0a527b" />
                            <path d="M875.001 182.413L1733.19 0H16.816l858.185 182.413z" fill="#0a4f76" />
                        </svg>
                    </div>
                </div>
                <header className="relative py-10">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
                    </div>
                </header>
            </Disclosure>

            <main className="relative -mt-32">
                <div className="mx-auto max-w-(--breakpoint-xl) px-4 pb-6 sm:px-6 lg:px-8 lg:pb-16">
                    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                        <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-x lg:divide-y-0">
                            <aside className="py-6 lg:col-span-3">
                                <ProfileSideBar />
                            </aside>

                            {/* Children pages */}
                            <div className="divide-y divide-gray-200 lg:col-span-9">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
