'use client';
import React from 'react';
import { AnimalIcon, RequestIcon } from '@/shared/icons';

export const OverviewCards = () => {
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4 md:gap-3">
            {/* <!-- Metric Item Start --> */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                        <AnimalIcon className="text-gray-800 size-6 dark:text-white/90" />
                    </div>
                    {/* <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div> */}
                </div>

                <div className="flex items-end justify-between mt-5">
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Animais Disponíveis</span>
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">3,782</h4>
                    </div>
                    {/* <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge> */}
                </div>
            </div>
            {/* <!-- Metric Item End --> */}

            {/* <!-- Metric Item Start --> */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                        <AnimalIcon className="text-gray-800 size-6 dark:text-white/90" />
                    </div>
                    {/* <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div> */}
                </div>

                <div className="flex items-end justify-between mt-5">
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 md:whitespace-normal sm:whitespace-nowrap">
                            Animais já Adotados
                        </span>
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">3,782</h4>
                    </div>
                    {/* <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge> */}
                </div>
            </div>
            {/* <!-- Metric Item End --> */}

            {/* <!-- Metric Item Start --> */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                    <RequestIcon className="text-gray-800 dark:text-white/90" />
                </div>
                <div className="flex items-end justify-between mt-5">
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 md:whitespace-normal sm:whitespace-nowrap">
                            Requisições Pendentes
                        </span>
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">5,359</h4>
                    </div>

                    {/* <Badge color="error">
            <ArrowDownIcon className="text-error-500" />
            9.05%
          </Badge> */}
                </div>
            </div>
            {/* <!-- Metric Item End --> */}

            {/* <!-- Metric Item Start --> */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                    <RequestIcon className="text-gray-800 dark:text-white/90" />
                </div>
                <div className="flex items-end justify-between mt-5">
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Requisições ao todo</span>
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">5,359</h4>
                    </div>

                    {/* <Badge color="error">
            <ArrowDownIcon className="text-error-500" />
            9.05%
          </Badge> */}
                </div>
            </div>
            {/* <!-- Metric Item End --> */}
        </div>
    );
};
