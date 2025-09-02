import { ImagePlus } from 'lucide-react';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';
import { 
    Sparkles,
    Image, 
    Settings, 
    HelpCircle,
    Menu,
    X,
    Plus,
    Link2,
    Package
} from 'lucide-react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const navigation = [
        { name: 'Studio', href: '/dashboard', icon: Sparkles, current: route().current('dashboard') },
        { name: 'Products', href: '/products', icon: Package, current: route().current('products.*') },
    ];

    const secondaryNavigation = [
        { name: 'Settings', href: '/settings', icon: Settings, current: route().current('settings') },
        { name: 'Help', href: '/help', icon: HelpCircle, current: route().current('help') },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex h-screen">
                {/* Sidebar */}
                <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-white border-r border-gray-200 flex flex-col`}>
                    {/* Logo and toggle */}
                    <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
                        <Link href="/" className={`flex items-center ${!sidebarOpen && 'justify-center'}`}>
                            <ImagePlus className="h-8 w-8 text-[#FF4D00]" />
                            {sidebarOpen && (
                                <span className="ml-2 text-xl text-gray-900">
                                    <span className="font-bold">ProductImage</span>
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-1.5 rounded-lg hover:bg-gray-100"
                        >
                            {sidebarOpen ? (
                                <X className="h-5 w-5 text-gray-500" />
                            ) : (
                                <Menu className="h-5 w-5 text-gray-500" />
                            )}
                        </button>
                    </div>

                    {/* Primary Navigation */}
                    <nav className="flex-1 px-2 py-4 space-y-1">
                        {/* New Generation Button */}
                        <Link
                            href="/dashboard"
                            className={`flex items-center ${sidebarOpen ? '' : 'justify-center'} mb-4 px-4 py-2 bg-gradient-to-r from-[#FF4D00] to-[#FF6B35] text-white rounded-lg hover:from-[#E64400] hover:to-[#E65A1F] transition-all shadow-lg`}
                        >
                            <Link2 className="h-5 w-5" />
                            {sidebarOpen && <span className="ml-2">New URL/Upload</span>}
                        </Link>

                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                                    flex items-center px-3 py-2 rounded-lg transition-colors
                                    ${item.current 
                                        ? 'bg-orange-50 text-[#FF4D00]' 
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                    }
                                    ${!sidebarOpen && 'justify-center'}
                                `}
                            >
                                <item.icon className={`h-5 w-5 ${sidebarOpen ? 'mr-3' : ''}`} />
                                {sidebarOpen && <span>{item.name}</span>}
                            </Link>
                        ))}
                    </nav>

                    {/* Secondary Navigation */}
                    <div className="px-2 py-4 border-t border-gray-200 space-y-1">
                        {secondaryNavigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                                    flex items-center px-3 py-2 rounded-lg transition-colors
                                    ${item.current 
                                        ? 'bg-gray-100 text-gray-900' 
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }
                                    ${!sidebarOpen && 'justify-center'}
                                `}
                            >
                                <item.icon className={`h-5 w-5 ${sidebarOpen ? 'mr-3' : ''}`} />
                                {sidebarOpen && <span>{item.name}</span>}
                            </Link>
                        ))}
                    </div>

                    {/* User Section */}
                    <div className="p-4 border-t border-gray-200">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className={`flex items-center w-full text-left hover:bg-gray-50 rounded-lg p-2 ${!sidebarOpen && 'justify-center'}`}>
                                    <div className="flex-shrink-0">
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#FF4D00] to-[#FF6B35] flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    {sidebarOpen && (
                                        <div className="ml-3 flex-1">
                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                            <div className="text-xs text-gray-500">{user.email}</div>
                                        </div>
                                    )}
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                <Dropdown.Link href={route('profile.edit')}>
                                    Profile
                                </Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Top Header */}
                    <header className="bg-white shadow-sm border-b border-gray-200">
                        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center">
                            {header}
                        </div>
                    </header>

                    {/* Page Content */}
                    <main className="flex-1 overflow-y-auto bg-gray-50">
                        {children}
                    </main>
                </div>
            </div>

            {/* Mobile Navigation (for responsive) */}
            <div className={`sm:hidden ${showingNavigationDropdown ? 'block' : 'hidden'}`}>
                <div className="space-y-1 pb-3 pt-2">
                    <ResponsiveNavLink
                        href={route('dashboard')}
                        active={route().current('dashboard')}
                    >
                        Dashboard
                    </ResponsiveNavLink>
                </div>

                <div className="border-t border-gray-200 pb-1 pt-4">
                    <div className="px-4">
                        <div className="text-base font-medium text-gray-800">
                            {user.name}
                        </div>
                        <div className="text-sm font-medium text-gray-500">
                            {user.email}
                        </div>
                    </div>

                    <div className="mt-3 space-y-1">
                        <ResponsiveNavLink href={route('profile.edit')}>
                            Profile
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            method="post"
                            href={route('logout')}
                            as="button"
                        >
                            Log Out
                        </ResponsiveNavLink>
                    </div>
                </div>
            </div>
        </div>
    );
}