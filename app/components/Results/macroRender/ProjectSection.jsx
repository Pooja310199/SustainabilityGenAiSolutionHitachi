"use client";

import React from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import SeverityDot from "../../Common/SeverityDot";

import RenderProjectMacro from "../renderProjectMacro";
import RenderTerritoryMacro from "../renderTerritoryMacro";

export default function ProjectSection({
  projectEntry,
  territoryEntry,
  isOpen,
  setIsOpen,
  projectMacroOverallSeverity,
  projectName,
  territoryName,
  projectNameSeverity,
  territoryNameSeverity,
  expandedProjectSub,
  setExpandedProjectSub,
  expandedTerritorySub,
  setExpandedTerritorySub,
}) {
  return (
    <Disclosure open={isOpen} onChange={setIsOpen}>
      {({ open }) => (
        <div className="border rounded-lg bg-white category-header">
          {/* HEADER */}
          <Disclosure.Button className="w-full flex justify-between items-center px-4 py-3 bg-gray-100">
            <div className="px-4 py-2">
              <span className="flex items-center gap-2">
                <SeverityDot level={projectMacroOverallSeverity} />
                {projectMacroOverallSeverity}
              </span>

              <span>
                Project
                {(projectName || territoryName) && (
                  <span className="ml-2 text-sm font-normal text-gray-600">
                    – {[projectName, territoryName].filter(Boolean).join(" / ")}
                  </span>
                )}
              </span>
            </div>

            <ChevronUpIcon className={`${open ? "rotate-180" : ""} h-5 w-5`} />
          </Disclosure.Button>

          {/* PANEL */}
          <Disclosure.Panel className="p-4">
            {(projectName || territoryName) && (
              <div>
                {projectName && (
                  <p className="text-s font-semibold mb-4">
                    Project Name:
                    <span className="font-normal ml-1">{projectName}</span>
                    <span className="flex items-center gap-2">
                      <SeverityDot level={projectNameSeverity} />
                      {projectNameSeverity}
                    </span>
                  </p>
                )}

                {territoryName && (
                  <p className="text-s font-semibold mb-4">
                    Territory Name:
                    <span className="font-normal ml-1">{territoryName}</span>
                    <span className="flex items-center gap-2">
                      <SeverityDot level={territoryNameSeverity} />
                      {territoryNameSeverity}
                    </span>
                  </p>
                )}
              </div>
            )}

            {/* PROJECT */}
            {projectEntry?.data?.map((content, idx) => (
              <RenderProjectMacro
                key={`proj-${idx}`}
                content={content}
                index={idx}
                expandedProjectSub={expandedProjectSub}
                setExpandedProjectSub={setExpandedProjectSub}
              />
            ))}

            {/* TERRITORY */}
            {territoryEntry?.data?.map((content, idx) => (
              <RenderTerritoryMacro
                key={`terr-${idx}`}
                content={content}
                index={idx}
                expandedTerritorySub={expandedTerritorySub}
                setExpandedTerritorySub={setExpandedTerritorySub}
              />
            ))}
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
}
