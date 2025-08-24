import Link from 'next/link';
import React from 'react';

interface BreadcrumbProps {
    pageTitle: string;
    sideElement?: React.ReactNode;
    breadcrumbItems?: {
        label: string;
        href: string;
    }[];
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle, sideElement, breadcrumbItems }) => {
    return (
        <div className="flex justify-between items-center dark:bg-gray-900">
            <div className="flex flex-wrap flex-col items-start gap-3 mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90" x-text="pageName">
                    {pageTitle}
                </h2>
                <nav>
                    <ol className="flex items-center gap-1.5">
                        <li>
                            <Link
                                className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
                                href="/painel"
                            >
                                Ínicio
                                <svg
                                    className="stroke-current"
                                    width="17"
                                    height="16"
                                    viewBox="0 0 17 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                                        stroke=""
                                        strokeWidth="1.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </Link>
                        </li>
                        {breadcrumbItems?.map((item) => (
                            <li key={item.href}>
                                <Link
                                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
                                    href={item.href}
                                >
                                    {item.label}
                                    <svg
                                        className="stroke-current"
                                        width="17"
                                        height="16"
                                        viewBox="0 0 17 16"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                                            stroke=""
                                            strokeWidth="1.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </Link>
                            </li>
                        ))}
                        <li className="text-sm text-brand-500 font-semibold dark:text-white/90">{pageTitle}</li>
                    </ol>
                </nav>
            </div>
            {sideElement && <div className="flex justify-end items-center gap-2">{sideElement}</div>}
        </div>
    );
};

export default PageBreadcrumb;
