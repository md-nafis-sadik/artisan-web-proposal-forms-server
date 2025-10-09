import { AddAnother, Input, Textarea } from "@/components";
import YesNoButton from "../../shared/others/YesNoButton";
import { useTechConsultForm } from "@/hooks";

function TechConsultStep6() {
  const {
    formData,
    updateField,
    addArrayItem,
    removeArrayItem,
    updateTCArrayField,
  } = useTechConsultForm();
  const step = "step6";
  const data = formData[step] || {};
  const handleYesNoToggle = (field, value, detailsField = null) => {
    updateField(step, field, value);
    if (value === "No" && detailsField) {
      updateField(step, detailsField, "");
    }
  };

  const handleAddOtherProfessionalServiceDetails = () => {
    addArrayItem(step, "otherProfessionalServiceDetails", {
      subsidiaryName: "",
      subsidiaryCeasedDate: "",
    });
  };

  const handleAddOtherPreviousBusinessDetails = () => {
    addArrayItem(step, "previousBusinessDetails", {
      principleName: "",
      previousBusinessName: "",
      professionalServices: "",
    });
  };

  const handleAddRepresentationOutsideDetails = () => {
    addArrayItem(step, "representationOutsideDetails", {
      country: "",
      fees: "",
      staffNumber: "",
      officeNumber: "",
    });
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
        <div className="flex flex-col gap-5">
          <YesNoButton
            label="12. Does the Insured anticipate any changes to the above Activities in the next 12 months?"
            value={data.australianFinancialServicesLicence || "No"}
            onToggle={(value) =>
              handleYesNoToggle(
                "australianFinancialServicesLicence",
                value,
                "australianFinancialServicesDetails"
              )
            }
          />
          {data.australianFinancialServicesLicence === "Yes" && (
            <Textarea
              placeholder="Please provide details"
              value={data.australianFinancialServicesDetails || ""}
              onChange={(e) =>
                updateField(
                  step,
                  "australianFinancialServicesDetails",
                  e.target.value
                )
              }
            />
          )}
        </div>

        <div className="flex flex-col gap-5">
          <YesNoButton
            label="13. Has the Insured performed any other professional service or activity other than described in 6 (i) above and for which cover may be required?"
            value={data.anticipateChanges || "No"}
            onToggle={(value) =>
              handleYesNoToggle(
                "anticipateChanges",
                value,
                "anticipateChangesDetails"
              )
            }
          />
          {data.anticipateChanges === "Yes" && (
            <Textarea
              placeholder="Please provide details"
              value={data.anticipateChangesDetails || ""}
              onChange={(e) =>
                updateField(step, "anticipateChangesDetails", e.target.value)
              }
            />
          )}
        </div>

        <div className="flex flex-col gap-5">
          <YesNoButton
            label="14. Is cover required for professional services or activities which have been provided by a former subsidiary?"
            value={data.otherProfessionalService || "No"}
            onToggle={(value) => {
              handleYesNoToggle("otherProfessionalService", value);
              // Initialize with one empty business if Yes is selected and array is empty
              if (
                value === "Yes" &&
                (!data.otherProfessionalService ||
                  data.otherProfessionalService.length === 0)
              ) {
                addArrayItem(step, "otherProfessionalServiceDetails", {
                  subsidiaryName: "",
                  subsidiaryCeasedDate: "",
                });
              }
            }}
          />
          {data.otherProfessionalService === "Yes" && (
            <div className="flex flex-col gap-6">
              {/* Render all previous businesses */}
              {(data.otherProfessionalServiceDetails || []).map(
                (service, index) => (
                  <div key={index} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label={`Name subsidiary`}
                        value={service?.subsidiaryName || ""}
                        onChange={(e) =>
                          updateTCArrayField(
                            step,
                            "otherProfessionalServiceDetails",
                            index,
                            "subsidiaryName",
                            e.target.value
                          )
                        }
                        placeholder="Name subsidiary"
                      />
                      <Input
                        label="Date ceased to be a subsidiary"
                        value={service?.subsidiaryCeasedDate || ""}
                        onChange={(e) =>
                          updateTCArrayField(
                            step,
                            "otherProfessionalServiceDetails",
                            index,
                            "subsidiaryCeasedDate",
                            e.target.value
                          )
                        }
                        placeholder="Date ceased to be a subsidiary"
                      />
                    </div>
                    {index > 1 && (
                      <button
                        onClick={() =>
                          removeArrayItem(
                            step,
                            "otherProfessionalServiceDetails",
                            index
                          )
                        }
                        className="text-red-600 self-start"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                )
              )}
              <AddAnother onClick={handleAddOtherProfessionalServiceDetails} />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-5">
          <YesNoButton
            label="15. Has the Insured or any of its subsidiaries undertaken any mergers or acquisitions in the last five years?"
            value={data.formerSubsidiaryServicesCover || "No"}
            onToggle={(value) =>
              handleYesNoToggle(
                "formerSubsidiaryServicesCover",
                value,
                "formerSubsidiaryDetails"
              )
            }
          />
          {data.formerSubsidiaryServicesCover === "Yes" && (
            <Textarea
              placeholder="Please provide details"
              value={data.formerSubsidiaryDetails || ""}
              onChange={(e) =>
                updateField(step, "formerSubsidiaryDetails", e.target.value)
              }
            />
          )}
        </div>
        <div className="flex flex-col gap-5">
          <YesNoButton
            label="16. Has the Insured or any of its subsidiaries been involved in any joint ventures in the last five years?"
            value={data.mergersAcquisitions || "No"}
            onToggle={(value) =>
              handleYesNoToggle(
                "mergersAcquisitions",
                value,
                "mergersAcquisitionsDetails"
              )
            }
          />
          {data.mergersAcquisitions === "Yes" && (
            <Textarea
              placeholder="Please provide details"
              value={data.mergersAcquisitionsDetails || ""}
              onChange={(e) =>
                updateField(step, "mergersAcquisitionsDetails", e.target.value)
              }
            />
          )}
        </div>

        <div className="flex flex-col gap-5">
          <YesNoButton
            label="17. Does the Insured require cover for any previous business including the previous business of any principal or director?"
            value={data.previousBusiness || "No"}
            onToggle={(value) => {
              handleYesNoToggle("previousBusiness", value);
              // Initialize with one empty business if Yes is selected and array is empty
              if (
                value === "Yes" &&
                (!data.previousBusiness || data.previousBusiness.length === 0)
              ) {
                addArrayItem(step, "previousBusinessDetails", {
                  principleName: "",
                  previousBusinessName: "",
                  professionalServices: "",
                });
              }
            }}
          />
          {data.previousBusiness === "Yes" && (
            <div className="flex flex-col gap-6">
              {/* Render all previous businesses */}
              {(data.previousBusinessDetails || []).map((service, index) => (
                <div key={index} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Input
                      label={`Name of Principal or Director`}
                      value={service?.principalName || ""}
                      onChange={(e) =>
                        updateTCArrayField(
                          step,
                          "previousBusinessDetails",
                          index,
                          "principalName",
                          e.target.value
                        )
                      }
                      placeholder="Name of Principal or Director"
                    />
                    <Input
                      label="Name of Previous Business"
                      value={service?.previousBusinessName || ""}
                      onChange={(e) =>
                        updateTCArrayField(
                          step,
                          "previousBusinessDetails",
                          index,
                          "previousBusinessName",
                          e.target.value
                        )
                      }
                      placeholder="Name of Previous Business"
                    />
                    <Input
                      label="Professional Services/ Activitiesy"
                      value={service?.professionalServices || ""}
                      onChange={(e) =>
                        updateTCArrayField(
                          step,
                          "previousBusinessDetails",
                          index,
                          "professionalServices",
                          e.target.value
                        )
                      }
                      placeholder="Professional Services/ Activities"
                    />
                  </div>
                  {index > 2 && (
                    <button
                      onClick={() =>
                        removeArrayItem(step, "previousBusinessDetails", index)
                      }
                      className="text-red-600 self-start"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <AddAnother onClick={handleAddOtherPreviousBusinessDetails} />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <YesNoButton
            label="18. Does the Insured hold any license or accreditation which is required in order to provide professional services or activities for which cover is requested?"
            value={data.jointVentures || "No"}
            onToggle={(value) =>
              handleYesNoToggle("jointVentures", value, "jointVenturesDetails")
            }
          />
          {data.jointVentures === "Yes" && (
            <Textarea
              placeholder="Please provide details"
              value={data.jointVenturesDetails || ""}
              onChange={(e) =>
                updateField(step, "jointVenturesDetails", e.target.value)
              }
            />
          )}
        </div>

        <div className="flex flex-col gap-5">
          <YesNoButton
            label="19. Does the Insured have any representation outside of Australia?"
            value={data.representationOutside || "No"}
            onToggle={(value) => {
              handleYesNoToggle("representationOutside", value);
              // Initialize with one empty business if Yes is selected and array is empty
              if (
                value === "Yes" &&
                (!data.representationOutside ||
                  data.representationOutside.length === 0)
              ) {
                addArrayItem(step, "representationOutsideDetails", {
                  subsidiaryName: "",
                  subsidiaryCeasedDate: "",
                });
              }
            }}
          />
          {data.representationOutside === "Yes" && (
            <div className="flex flex-col gap-6">
              {/* Render all previous businesses */}
              {(data.representationOutsideDetails || []).map(
                (service, index) => (
                  <div key={index} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <Input
                        label={`Country`}
                        value={service?.country || ""}
                        onChange={(e) =>
                          updateTCArrayField(
                            step,
                            "representationOutsideDetails",
                            index,
                            "country",
                            e.target.value
                          )
                        }
                        placeholder="Country"
                      />
                      <Input
                        label="Fees/Turnover"
                        value={service?.fees || ""}
                        onChange={(e) =>
                          updateTCArrayField(
                            step,
                            "representationOutsideDetails",
                            index,
                            "fees",
                            e.target.value
                          )
                        }
                        placeholder="$"
                      />
                      <Input
                        label="Number of staff"
                        value={service?.staffNumber || ""}
                        onChange={(e) =>
                          updateTCArrayField(
                            step,
                            "representationOutsideDetails",
                            index,
                            "staffNumber",
                            e.target.value
                          )
                        }
                        placeholder="Number of staff"
                      />
                      <Input
                        label="Number of offices"
                        value={service?.officeNumber || ""}
                        onChange={(e) =>
                          updateTCArrayField(
                            step,
                            "representationOutsideDetails",
                            index,
                            "officeNumber",
                            e.target.value
                          )
                        }
                        placeholder="Number of offices"
                      />
                    </div>
                    {index > 2 && (
                      <button
                        onClick={() =>
                          removeArrayItem(
                            step,
                            "representationOutsideDetails",
                            index
                          )
                        }
                        className="text-red-600 self-start"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                )
              )}
              <AddAnother onClick={handleAddRepresentationOutsideDetails} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TechConsultStep6;
