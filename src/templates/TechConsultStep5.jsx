import { DatePicker, Input, Textarea } from "@/components";
import { usePIForm } from "@/hooks/usePIForm";
import YesNoButton from "../../shared/others/YesNoButton";
import { dateToUnix, unixToDate } from "@/services";
import { useTechConsultForm } from "@/hooks";

function TechConsultStep5() {
  const { formData, updateField, updateTCArrayField } = useTechConsultForm();
  const step = "step5";
  const data = formData[step] || {};

  const handleYesNoToggle = (field, value, detailsField = null) => {
    updateField(step, field, value);
    if (value === "No" && detailsField) {
      updateField(step, detailsField, "");
    }
  };

  return (
    <div className="w-full flex flex-col md:items-center md:justify-center gap-10">
      <div className="flex flex-col md:items-center gap-2">
        <div className="gradient-text text-4xl font-semibold">
          Technology Consultants Combined Liability Form
        </div>
        <div className="text-gray-700 text-xl font-bold">
          Part B – Activities, Income and Contracts
        </div>
      </div>
      <div className="w-full flex flex-col gap-6">
        <div className="flex flex-col gap-6">
          <div className="text-xl font-semibold text-black-300">
            9. Please state the percentage of gross revenue (fee / turnover) for
            each of the activities set out below:
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-xl font-semibold text-black-300">
              Business Discipline
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Input
                label="Bespoke software (1st party developed)"
                placeholder="0%"
                value={data.bespokeSoftware || ""}
                onChange={(e) =>
                  updateField(step, "bespokeSoftware", e.target.value)
                }
              />
              <Input
                label="Data processing"
                placeholder="0%"
                value={data.dataProcessing || ""}
                onChange={(e) =>
                  updateField(step, "dataProcessing", e.target.value)
                }
              />

              <Input
                label="Education & training"
                placeholder="0%"
                value={data.educationTraining || ""}
                onChange={(e) =>
                  updateField(step, "educationTraining", e.target.value)
                }
              />
              <Input
                label="Facilities management / outsourcing"
                placeholder="0%"
                value={data.facilitiesManagement || ""}
                onChange={(e) =>
                  updateField(step, "facilitiesManagement", e.target.value)
                }
              />
              <Input
                label="General IT advice / consulting"
                placeholder="0%"
                value={data.generalITAdvice || ""}
                onChange={(e) =>
                  updateField(step, "generalITAdvice", e.target.value)
                }
              />

              <Input
                label="Hardware design / manufacture / installation"
                placeholder="0%"
                value={data.hardwareDesign || ""}
                onChange={(e) =>
                  updateField(step, "hardwareDesign", e.target.value)
                }
              />
              <Input
                label="Internet service provider"
                placeholder="0%"
                value={data.internetServiceProvider || ""}
                onChange={(e) =>
                  updateField(step, "internetServiceProvider", e.target.value)
                }
              />
              <Input
                label="Project management"
                placeholder="0%"
                value={data.projectManagement || ""}
                onChange={(e) =>
                  updateField(step, "projectManagement", e.target.value)
                }
              />

              <Input
                label="Sale and supply of 3rd party hardware"
                placeholder="0%"
                value={data.saleSupply3rdPartyHardware || ""}
                onChange={(e) =>
                  updateField(
                    step,
                    "saleSupply3rdPartyHardware",
                    e.target.value
                  )
                }
              />
              <Input
                label="Sale of customisable software (3rd party developed, 1st party customised)"
                labelClass="truncate"
                placeholder="0%"
                value={data.saleCustomisableSoftware || ""}
                onChange={(e) =>
                  updateField(step, "saleCustomisableSoftware", e.target.value)
                }
              />
              <Input
                label="Sale of packaged software (3rd party developed)"
                labelClass="truncate"
                placeholder="0%"
                value={data.salePackagedSoftware || ""}
                onChange={(e) =>
                  updateField(step, "salePackagedSoftware", e.target.value)
                }
              />

              <Input
                label="Software maintenance"
                placeholder="0%"
                value={data.softwareMaintenance || ""}
                onChange={(e) =>
                  updateField(step, "softwareMaintenance", e.target.value)
                }
              />
              <Input
                label="Systems integration"
                placeholder="0%"
                value={data.systemsIntegration || ""}
                onChange={(e) =>
                  updateField(step, "systemsIntegration", e.target.value)
                }
              />
              <Input
                label="Web design"
                placeholder="0%"
                value={data.webDesign || ""}
                onChange={(e) => updateField(step, "webDesign", e.target.value)}
              />
            </div>
            <Textarea
              label="Other (please specify below)"
              placeholder="Please provide details"
              value={data.businessDisciplineOtherDetails || ""}
              onChange={(e) =>
                updateField(
                  step,
                  "businessDisciplineOtherDetails",
                  e.target.value
                )
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="text-xl font-semibold text-black-300">
            10. Please indicate the end user applications for your services:
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-xl font-semibold text-black-300">End User</div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Input
                label="Administrative"
                placeholder="0%"
                value={data.administrative || ""}
                onChange={(e) =>
                  updateField(step, "administrative", e.target.value)
                }
              />
              <Input
                label="Accounting / Financial (Non Fund Transfer)"
                placeholder="0%"
                value={data.accountingFinancial || ""}
                onChange={(e) =>
                  updateField(step, "accountingFinancial", e.target.value)
                }
              />

              <Input
                label="Architectural / Engineering"
                placeholder="0%"
                value={data.architecturalEngineering || ""}
                onChange={(e) =>
                  updateField(step, "architecturalEngineering", e.target.value)
                }
              />
              <Input
                label="Communications: Utilities / Info Services"
                placeholder="0%"
                value={data.communicationsUtilities || ""}
                onChange={(e) =>
                  updateField(step, "communicationsUtilities", e.target.value)
                }
              />
              <Input
                label="Database Management Systems"
                placeholder="0%"
                value={data.databaseManagement || ""}
                onChange={(e) =>
                  updateField(step, "databaseManagement", e.target.value)
                }
              />

              <Input
                label="Educational"
                placeholder="0%"
                value={data.educational || ""}
                onChange={(e) =>
                  updateField(step, "educational", e.target.value)
                }
              />
              <Input
                label="Fund Transfer"
                placeholder="0%"
                value={data.fundTransfer || ""}
                onChange={(e) =>
                  updateField(step, "fundTransfer", e.target.value)
                }
              />
              <Input
                label="Imaging"
                placeholder="0%"
                value={data.imaging || ""}
                onChange={(e) => updateField(step, "imaging", e.target.value)}
              />

              <Input
                label="Inventory Control"
                placeholder="0%"
                value={data.inventoryControl || ""}
                onChange={(e) =>
                  updateField(step, "inventoryControl", e.target.value)
                }
              />

              <Input
                label="LAN / Network Management"
                labelClass="truncate"
                placeholder="0%"
                value={data.lanNetworkManagement || ""}
                onChange={(e) =>
                  updateField(step, "lanNetworkManagement", e.target.value)
                }
              />

              <Input
                label="Medical Management"
                placeholder="0%"
                value={data.medicalManagement || ""}
                onChange={(e) =>
                  updateField(step, "medicalManagement", e.target.value)
                }
              />
              <Input
                label="Manufacturing Process Control Systems"
                placeholder="0%"
                value={data.manufacturingProcessControl || ""}
                onChange={(e) =>
                  updateField(
                    step,
                    "manufacturingProcessControl",
                    e.target.value
                  )
                }
              />
              <Input
                label="Scientific / Mathematical"
                placeholder="0%"
                value={data.scientificMathematical || ""}
                onChange={(e) =>
                  updateField(step, "scientificMathematical", e.target.value)
                }
              />
              <Input
                label="Security (firewalls etc.)"
                labelClass="truncate"
                placeholder="0%"
                value={data.security || ""}
                onChange={(e) => updateField(step, "security", e.target.value)}
              />
            </div>
            <Textarea
              label="Other (please specify below)"
              placeholder="Please provide details"
              value={data.endUserOtherDetails || ""}
              onChange={(e) =>
                updateField(step, "endUserOtherDetails", e.target.value)
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="text-xl font-semibold text-black-300">
            11. Please state the percentage of gross income/fees for each
            industries set out below:
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-xl font-semibold text-black-300">Industry</div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Input
                label="Aerospace"
                placeholder="0%"
                value={data.aerospace || ""}
                onChange={(e) => updateField(step, "aerospace", e.target.value)}
              />

              <Input
                label="Communications / Transportation"
                placeholder="0%"
                value={data.communicationsTransportation || ""}
                onChange={(e) =>
                  updateField(
                    step,
                    "communicationsTransportation",
                    e.target.value
                  )
                }
              />
              <Input
                label="Construction / Mining / Agriculture"
                placeholder="0%"
                value={data.constructionMiningAgriculture || ""}
                onChange={(e) =>
                  updateField(
                    step,
                    "constructionMiningAgriculture",
                    e.target.value
                  )
                }
              />
              <Input
                label="Education"
                placeholder="0%"
                value={data.educationIndustry || ""}
                onChange={(e) =>
                  updateField(step, "educationIndustry", e.target.value)
                }
              />

              <Input
                label="Financial Institutions"
                placeholder="0%"
                value={data.financialInstitutions || ""}
                onChange={(e) =>
                  updateField(step, "financialInstitutions", e.target.value)
                }
              />
              <Input
                label="Government (military)"
                placeholder="0%"
                value={data.governmentMilitary || ""}
                onChange={(e) =>
                  updateField(step, "governmentMilitary", e.target.value)
                }
              />
              <Input
                label="Government (non-military)"
                placeholder="0%"
                value={data.governmentNonMilitary || ""}
                onChange={(e) =>
                  updateField(step, "governmentNonMilitary", e.target.value)
                }
              />

              <Input
                label="Health Care / Medical Services"
                placeholder="0%"
                value={data.healthCareMedical || ""}
                onChange={(e) =>
                  updateField(step, "healthCareMedical", e.target.value)
                }
              />
              <Input
                label="Home Use"
                labelClass="truncate"
                placeholder="0%"
                value={data.homeUse || ""}
                onChange={(e) => updateField(step, "homeUse", e.target.value)}
              />
              <Input
                label="Manufacturing / Industrial"
                labelClass="truncate"
                placeholder="0%"
                value={data.manufacturingIndustrial || ""}
                onChange={(e) =>
                  updateField(step, "manufacturingIndustrial", e.target.value)
                }
              />
              <Input
                label="Trade: Retail / Wholesale"
                placeholder="0%"
                value={data.tradeRetailWholesale || ""}
                onChange={(e) =>
                  updateField(step, "tradeRetailWholesale", e.target.value)
                }
              />
            </div>
            <Textarea
              label="Other (please specify below)"
              placeholder="Please provide details"
              value={data.industryOtherDetails || ""}
              onChange={(e) =>
                updateField(step, "industryOtherDetails", e.target.value)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TechConsultStep5;
