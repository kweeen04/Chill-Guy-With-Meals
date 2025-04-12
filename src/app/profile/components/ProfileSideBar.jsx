"use client"

import {
    CogIcon,
    CreditCardIcon,
    KeyIcon,
    UserCircleIcon,
    BeakerIcon,
    HeartIcon
} from '@heroicons/react/24/outline'
import { classNames } from '@/utils/classNames'
import { usePathname } from 'next/navigation'
const subNavigation = [
    { name: 'Profile', href: '/profile/info', icon: UserCircleIcon, current: true },
    { name: 'Account', href: '#', icon: CogIcon, current: false },
    { name: 'Password', href: '#', icon: KeyIcon, current: false },
    { name: 'Diet info', href: '/profile/diet', icon: BeakerIcon, current: false },
    { name: 'Favorites', href: '/profile/favorite', icon: HeartIcon, current: false },
    { name: 'Billing', href: '#', icon: CreditCardIcon, current: false },

]

export default function ProfileSideBar() {
    const pathname = usePathname()
    return (
        <div>

            <nav className="space-y-1">
                {subNavigation.map((item) => {
                    const isActive = pathname.startsWith(item.href)
                    return (
                        <a
                            key={item.name}
                            href={item.href}
                            aria-current={isActive ? 'page' : undefined}
                            className={classNames(
                                isActive
                                    ? 'border-teal-500 bg-teal-50 text-teal-700 hover:bg-teal-50 hover:text-teal-700'
                                    : 'border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900',
                                'group flex items-center border-l-4 px-3 py-2 text-sm font-medium',
                            )}
                        >
                            <item.icon
                                aria-hidden="true"
                                className={classNames(
                                    isActive
                                        ? 'text-teal-500 group-hover:text-teal-500'
                                        : 'text-gray-400 group-hover:text-gray-500',
                                    'mr-3 -ml-1 size-6 shrink-0',
                                )}
                            />
                            <span className="truncate">{item.name}</span>
                        </a>
                    )
                })}
            </nav>
        </div>
    )
}
