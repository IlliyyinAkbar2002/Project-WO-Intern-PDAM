"use client";

import React, { useState } from "react";
import AdminDashboardCard from "./AdminDashboardCard";
import AdminDashboardProgress from "./AdminDashboardProgress";

export default function AdminDashboardClient() {
  const [showMore, setShowMore] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="w-full bg-neutral-primary-soft border border-default rounded-base shadow-xs p-4 md:p-6">
      <div className="flex justify-between mb-4 md:mb-6">
        <div className="flex items-center">
          <div className="flex justify-center items-center">
            <h5 className="text-xl font-semibold text-heading me-1">
              Work order progress
            </h5>
            <button
              aria-label="info"
              className="w-4 h-4 text-body hover:text-heading cursor-pointer ms-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.529 9.988a2.502 2.502 0 1 1 5 .191A2.441 2.441 0 0 1 12 12.582V14m-.01 3.008H12M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <AdminDashboardCard
          title="To do"
          value={12}
          description="Pending workorders"
        />
        <AdminDashboardCard
          title="In progress"
          value={23}
          description="Currently being worked on"
        />
        <AdminDashboardCard
          title="Done"
          value={64}
          description="Completed tasks"
        />
        <AdminDashboardCard
          title="Total WO"
          value={99}
          description="Total work orders"
        />
      </div>

      <div className="mb-4">
        <AdminDashboardProgress />
      </div>

      <div className="bg-neutral-secondary-medium border border-light-medium p-3 rounded-base">
        <button
          onClick={() => setShowMore(!showMore)}
          type="button"
          className="hover:underline text-sm text-body font-medium inline-flex items-center"
        >
          Show more details
          <svg
            className="w-4 h-4 ms-1"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 9-7 7-7-7"
            />
          </svg>
        </button>
        {showMore && (
          <div
            id="more-details"
            className="border-light border-t pt-3 mt-3 space-y-2"
          >
            <dl className="flex items-center justify-between">
              <dt className="text-body text-sm font-normal">
                Average task completion rate:
              </dt>
              <dd className="inline-flex items-center bg-success-soft border border-success-subtle text-fg-success-strong text-xs font-medium px-1.5 py-0.5 rounded">
                <svg
                  className="w-4 h-4 me-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v13m0-13 4 4m-4-4-4 4"
                  />
                </svg>
                57%
              </dd>
            </dl>
            <dl className="flex items-center justify-between">
              <dt className="text-body text-sm font-normal">
                Days until sprint ends:
              </dt>
              <dd className="inline-flex items-center bg-neutral-primary-medium border border-default-medium text-heading text-xs font-medium px-1.5 py-0.5 rounded">
                13 days
              </dd>
            </dl>
            <dl className="flex items-center justify-between">
              <dt className="text-body text-sm font-normal">Next meeting:</dt>
              <dd className="inline-flex items-center bg-neutral-primary-medium border border-default-medium text-heading text-xs font-medium px-1.5 py-0.5 rounded">
                <svg
                  className="w-3.5 h-3.5 me-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"
                  />
                </svg>
                Thursday
              </dd>
            </dl>
          </div>
        )}
      </div>

      {/* radial chart moved into AdminDashboardProgress (right column) */}

      <div className="grid grid-cols-1 items-center border-light border-t justify-between">
        <div className="flex justify-between items-center pt-4 md:pt-6">
          <div>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              id="dropdownLastDays6Button"
              className="text-sm font-medium text-body hover:text-heading text-center inline-flex items-center"
              type="button"
            >
              Last 7 days
              <svg
                className="w-4 h-4 ms-1.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 9-7 7-7-7"
                />
              </svg>
            </button>
            {dropdownOpen && (
              <div
                id="LastDays6dropdown"
                className="z-10 bg-neutral-primary-medium border border-default-medium rounded-base shadow-lg w-44"
              >
                <ul
                  className="p-2 text-sm text-body font-medium"
                  aria-labelledby="dropdownLastDays6Button"
                >
                  <li>
                    <a
                      href="#"
                      className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                    >
                      Yesterday
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                    >
                      Today
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                    >
                      Last 7 days
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                    >
                      Last 30 days
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                    >
                      Last 90 days
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <a
            href="#"
            className="inline-flex items-center text-fg-brand bg-transparent box-border border border-transparent hover:bg-neutral-secondary-medium focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded-base text-sm px-3 py-2 focus:outline-none"
          >
            Progress report
            <svg
              className="w-4 h-4 ms-1.5 -me-0.5 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 12H5m14 0-4 4m4-4-4-4"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
