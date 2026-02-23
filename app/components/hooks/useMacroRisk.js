import {
  calculateOverallRiskFromCategories,
  calculateCountryMacroRisk,
  calculatePartnerMacroRisk,
  calculateProjectMacroRisk,
} from "../Common/riskUtils";





export function useMacroRisk(
  countryEntry,
  customerEntry,
  projectEntry,
  territoryEntry
) {


  const overallCountryRisk =
    countryEntry?.data?.length > 0
      ? calculateCountryMacroRisk(countryEntry.data)
      : null;


  const overallPartnerRisk =
    customerEntry?.data?.length > 0
      ? calculatePartnerMacroRisk(customerEntry.data)
      : null;


  const projectMacroOverallSeverity = calculateProjectMacroRisk(
    projectEntry?.data,
    territoryEntry?.data,
  );


  const projectNameSeverity =
    projectEntry?.data?.length > 0
      ? calculateOverallRiskFromCategories(projectEntry.data)
      : null;

  const territoryNameSeverity =
    territoryEntry?.data?.length > 0
      ? calculateOverallRiskFromCategories(territoryEntry.data)
      : null;



  return {
    overallCountryRisk,
    overallPartnerRisk,
    projectMacroOverallSeverity,
    projectNameSeverity,
    territoryNameSeverity,
  };

}