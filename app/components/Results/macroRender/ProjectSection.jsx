"use client";

import React from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import SeverityDot from "../../Common/SeverityDot";

import RenderProjectMacro from "../renderProjectMacro";
import RenderTerritoryMacro from "../renderTerritoryMacro";
import Feedback from "../../Common/Feedback";

const ProjectSection = React.memo(function ProjectSection({
  projectEntry,
  territoryEntry,
  // isOpen,
  // setIsOpen,
  projectMacroOverallSeverity,
  projectName,
  territoryName,
  projectNameSeverity,
  territoryNameSeverity,
  expandSignal,
  collapseSignal,
}) {
  React.useEffect(() => {
    console.log("ProjectSection actual render");
  }, []);
  const [expandedProjectSub, setExpandedProjectSub] = React.useState({});

  const [expandedTerritorySub, setExpandedTerritorySub] = React.useState({});

  // React.useEffect(() => {
  //   const projKeys = {};
  //   const terrKeys = {};

  //   projectEntry?.data?.forEach((block, bi) => {
  //     projKeys[`project-main-${bi}`] = true;

  //     block.results?.forEach((_, ri) => {
  //       projKeys[`project-sub-${bi}-${ri}`] = true;
  //     });
  //   });

  //   territoryEntry?.data?.forEach((block, bi) => {
  //     terrKeys[`territory-main-${bi}`] = true;

  //     block.results?.forEach((_, ri) => {
  //       terrKeys[`territory-sub-${bi}-${ri}`] = true;
  //     });
  //   });

  //   setExpandedProjectSub(projKeys);
  //   setExpandedTerritorySub(terrKeys);
  // }, [expandSignal]);

  const prevExpandSignal = React.useRef(expandSignal);

  React.useEffect(() => {
    // run only when Expand All clicked
    if (prevExpandSignal.current === expandSignal) return;

    prevExpandSignal.current = expandSignal;

    const projKeys = {};
    const terrKeys = {};

    // ---------- PROJECT ----------
    projectEntry?.data?.forEach((content, ci) => {
      projKeys[`project-main-${content.category}`] = true;

      content.results?.forEach((res, ri) => {
        projKeys[`project-sub-${content.category}-${res.sub_category}`] = true;

        projKeys[`project-src-${content.category}-${res.sub_category}`] = true;

        Object.entries(res.analysis || {}).forEach((_, vi) => {
          projKeys[`env-${ci}-${ri}-${vi}`] = true;
        });
      });
    });

    // ---------- TERRITORY ----------
    territoryEntry?.data?.forEach((content) => {
      terrKeys[`territory-main-${content.category}`] = true;

      content.results?.forEach((res) => {
        terrKeys[`territory-sub-${content.category}-${res.sub_category}`] =
          true;

        terrKeys[`territory-src-${content.category}-${res.sub_category}`] =
          true;
      });
    });

    setExpandedProjectSub(projKeys);
    setExpandedTerritorySub(terrKeys);
  }, [expandSignal]); // ✅ FIXED

  React.useEffect(() => {
    setExpandedProjectSub({});
    setExpandedTerritorySub({});
  }, [collapseSignal]);

  return (
    // <Disclosure open={isOpen} onChange={setIsOpen}>
    <Disclosure>
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
                    <Feedback section="Project" entityName={projectName} />
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
                    <Feedback section="Territory" entityName={territoryName} />
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
});

export default ProjectSection;
