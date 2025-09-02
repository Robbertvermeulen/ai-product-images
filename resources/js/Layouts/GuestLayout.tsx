import { ImagePlus } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
            <div className="flex flex-col items-center">
                <Link href="/" className="flex items-center space-x-2">
                    <ImagePlus className="h-12 w-12 text-[#FF4D00]" />
                    <span className="text-2xl font-bold text-gray-900">ProductImage</span>
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
