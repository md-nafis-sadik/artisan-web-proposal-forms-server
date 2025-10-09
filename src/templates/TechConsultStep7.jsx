import { Textarea } from "@/components";
import YesNoButton from "../../shared/others/YesNoButton";
import { useTechConsultForm } from "@/hooks";

function TechConsultStep7() {
  const { formData, updateField } = useTechConsultForm();
  const step = "step7";
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
          Part C – IT Risk management
        </div>
      </div>
      <div className="w-full flex flex-col gap-6">
        <div className="text-xl font-semibold text-black-300">
          20. Does the Insured:
        </div>
        <div className="text-xl font-semibold text-black-300">(i)</div>

        <YesNoButton
          label="(a) Change orders integrated into the final contracts?"
          value={data.changeOrdersIntegrated || "No"}
          onToggle={(value) =>
            handleYesNoToggle("changeOrdersIntegrated", value)
          }
        />

        <YesNoButton
          label="(b) Have legal review of all products, content and material?"
          value={data.legalReviewProducts || "No"}
          onToggle={(value) => handleYesNoToggle("legalReviewProducts", value)}
        />
        <YesNoButton
          label="(c) Waiver or Subrogation of rights of recovery against any other party?"
          value={data.waiverSubrogationRights || "No"}
          onToggle={(value) =>
            handleYesNoToggle("waiverSubrogationRights", value)
          }
        />
        <YesNoButton
          label="(d) Have a dispute / arbitration resolution process?"
          value={data.disputeArbitrationProcess || "No"}
          onToggle={(value) =>
            handleYesNoToggle("disputeArbitrationProcess", value)
          }
        />
        <YesNoButton
          label="(e) Project/Contract Due Diligence/Peer Review process?"
          value={data.projectDueDiligence || "No"}
          onToggle={(value) => handleYesNoToggle("projectDueDiligence", value)}
        />
        <YesNoButton
          label="(f) Use of non-standard or customised contracts?"
          value={data.nonStandardContracts || "No"}
          onToggle={(value) => handleYesNoToggle("nonStandardContracts", value)}
        />
        <div className="text-xl font-semibold text-black-300">
          (ii) negotiate, accept or agree
        </div>
        <YesNoButton
          label="(a) Liability for consequential damage?"
          value={data.liabilityConsequentialDamage || "No"}
          onToggle={(value) =>
            handleYesNoToggle("liabilityConsequentialDamage", value)
          }
        />
        <YesNoButton
          label="(b) Limitation of liability for consequential damages clause in contracts?"
          value={data.limitationLiabilityClause || "No"}
          onToggle={(value) =>
            handleYesNoToggle("limitationLiabilityClause", value)
          }
        />
        <YesNoButton
          label="(c) Waiver or Subrogation of rights of recovery against any other party?"
          value={data.waiverSubrogationRights2 || "No"}
          onToggle={(value) =>
            handleYesNoToggle("waiverSubrogationRights2", value)
          }
        />
        <YesNoButton
          label="(d) Indemnity to other parties?"
          value={data.indemnityOtherParties || "No"}
          onToggle={(value) =>
            handleYesNoToggle("indemnityOtherParties", value)
          }
        />

        <Textarea
          label="If the Insured accepts consequential loss, waiver of subrogation or provides any hold harmless or indemnity to third parties, please provide further details here."
          labelClass="text-xl font-semibold text-black-300"
          placeholder="Please provide details"
          value={data.requiresLicenseDetails || ""}
          onChange={(e) =>
            updateField(step, "requiresLicenseDetails", e.target.value)
          }
        />

        <Textarea
          label="If “No”, please advise below in what circumstances are non-standard contracts used without external legal counsel review (use a separate sheet of your letter head paper if insufficient room below)."
          labelClass="text-xl font-semibold text-black-300"
          placeholder="Please provide details"
          value={data.requiresLicenseDetails || ""}
          onChange={(e) =>
            updateField(step, "requiresLicenseDetails", e.target.value)
          }
        />

        <div className="text-xl font-semibold text-black-300">
          21. Does the Insured have quality control procedures include the
          following:
        </div>

        <YesNoButton
          label="(a) Alpha testing"
          value={data.alphaTesting || "No"}
          onToggle={(value) => handleYesNoToggle("alphaTesting", value)}
        />
        <YesNoButton
          label="(b) Beta testing"
          value={data.betaTesting || "No"}
          onToggle={(value) => handleYesNoToggle("betaTesting", value)}
        />

        <YesNoButton
          label="(c) Formal customer acceptance procedures"
          value={data.formalCustomerAcceptance || "No"}
          onToggle={(value) =>
            handleYesNoToggle("formalCustomerAcceptance", value)
          }
        />
        <YesNoButton
          label="(d) Prototype development"
          value={data.prototypeDevelopment || "No"}
          onToggle={(value) => handleYesNoToggle("prototypeDevelopment", value)}
        />
        <YesNoButton
          label="(e) Statistical process control"
          value={data.statisticalProcessControl || "No"}
          onToggle={(value) =>
            handleYesNoToggle("statisticalProcessControl", value)
          }
        />
        <YesNoButton
          label="(f) Vendor certification process"
          value={data.vendorCertificationProcess || "No"}
          onToggle={(value) =>
            handleYesNoToggle("vendorCertificationProcess", value)
          }
        />
        <YesNoButton
          label="(g) Total quality management"
          value={data.totalQualityManagement || "No"}
          onToggle={(value) =>
            handleYesNoToggle("totalQualityManagement", value)
          }
        />
        <YesNoButton
          label="(h) Written and formalised quality control program"
          value={data.writtenQualityControlProgram || "No"}
          onToggle={(value) =>
            handleYesNoToggle("writtenQualityControlProgram", value)
          }
        />
        <YesNoButton
          label="(i) Insurance verification process ensuring proof of insurances for Sub-Contractors and Vendors, including provisions of Cyber Insurance"
          value={data.insuranceVerificationProcess || "No"}
          onToggle={(value) =>
            handleYesNoToggle("insuranceVerificationProcess", value)
          }
        />
      </div>
    </div>
  );
}

export default TechConsultStep7;
