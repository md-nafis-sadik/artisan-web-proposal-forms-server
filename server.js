import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";
import puppeteer from "puppeteer";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter
  .verify()
  .then(() => {
    console.log("✅ Transporter verification successful");
  })
  .catch((err) => {
    console.error("❌ Transporter verification failed:", err);
  });

// PDF Generation Helper Functions
const formatValue = (value) => {
  if (!value || value === "") return null;
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
};

const generateFieldHTML = (
  label,
  value,
  placeholder = "",
  extraClasses = ""
) => {
  const displayValue = formatValue(value);
  const isEmpty = !displayValue;

  return `
    <div class="avoid-break ${extraClasses}">
        <label class="block text-[9px] text-black-300 mb-1">
            ${label}
        </label>
        <div class="border border-gray-300 rounded-lg px-3 py-2 h-[32px] flex items-center text-[9px] placeholder:text-[9px] ${
          isEmpty ? "text-gray-300 italic" : "text-black-300"
        }">
            ${displayValue || placeholder || `Enter ${label.replace(" *", "")}`}
        </div>
    </div>`;
};

const generateCheckboxHTML = (label, checked) => {
  return `
    <div class="flex items-center gap-2 mb-2">
        <div class="flex items-center justify-center w-[11px] h-[11px] border-2 border-black rounded-full flex-shrink-0 ${
          checked ? "bg-black" : "bg-white"
        }">
            ${
              checked
                ? '<span class="text-black text-[9px] leading-none bg-black w-[9px] h-[9px] rounded-full border-2 border-white">✓</span>'
                : ""
            }
        </div>
        <span class="text-[9px] text-gray-700">${label}</span>
    </div>
  `;
};

const formatDate = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-GB");
};

const generateDateFieldHTML = (label, timestamp, placeholder = "") => {
  const displayValue = timestamp ? formatDate(timestamp) : "";
  const showPlaceholder = !timestamp;
  const placeholderText = placeholder || `Enter ${label.replace(" *", "")}`;

  return `
     <div class="avoid-break">
        <label class="block text-[9px] text-black-300 mb-1">
            ${label}
        </label>
        <div class="border border-gray-300 rounded-lg px-3 py-2 h-[32px] flex items-center text-[9px] placeholder:text-[9px] ${
          showPlaceholder ? "text-gray-300 italic" : "text-black-300"
        }">
            ${displayValue || placeholderText}
        </div>
    </div>
  `;
};

const generateYesNoHTML = (label, value, details = "", detailsLabel = "") => {
  return `
    <div class="flex flex-col gap-1 mb-2">
      <div class="flex justify-between items-start">
        <div class="text-[9px] font-semibold text-black-300 w-3/4">${label}</div>
        <div class="flex gap-2">
        <div class="px-4 py-1 text-[9px] rounded-[4px] ${
            value === "No"
              ? "bg-gradient-to-r from-[#ED09FE] to-[#189AFE] text-white"
              : "bg-gray-200 text-gray-600"
          }">No</div>
          <div class="px-4 py-1 text-[9px] rounded-[4px] ${
            value === "Yes"
              ? "bg-gradient-to-r from-[#ED09FE] to-[#189AFE] text-white"
              : "bg-gray-200 text-gray-600"
          }">Yes</div>

        </div>
      </div>
      ${
        value === "Yes" && details
          ? `
      <div class="mt-2">
        <label class="block text-[9px] text-black-300 mb-1">
            ${detailsLabel}
        </label>
        <div class="border border-gray-300 rounded-lg px-3 py-2 h-[32px] flex items-center text-[9px] placeholder:text-[9px] ${
          !details ? "text-gray-300 italic" : "text-black-300"
        }">
            ${details || `Enter Details}`}
        </div>
    </div>

      `
          : ""
      }
    </div>
  `;
};

const generateStep1HTML = (data, needsPageBreak = false) => {
  return `
    <div class="${needsPageBreak ? "page-break" : ""}">
      <!-- Logo -->



      <div class="relative flex bg-white">
        <!-- Background Image -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-[642px] h-[480px] bg-[url('${process.env.FRONTEND_BASE_URL}/src/assets/images/background-pdf.png')] bg-no-repeat bg-center bg-cover"></div>
        </div>

        <!-- Form Content -->
        <div class="relative flex-1 flex flex-col items-center justify-center z-10">
              <div class="text-sm font-bold text-black-300 text-center w-full">
        Miscellaneous PI Proposal Form
      </div>
        <div class="text-sm font-bold text-center w-full text-[#5174FE] mt-4"
      >Client Information</div>
          <div class="w-full mx-4 xl:mx-auto px-6 py-4 my-4 xl:my-8">
            <div class="first-step w-full flex flex-col md:items-center md:justify-center gap-10">

              <!-- Disclaimer -->
              <div class="flex flex-col gap-[13px]">
                <div class="flex flex-col gap-1">
                  <div class="text-[11px] font-semibold text-black-300">Disclaimer</div>
                  <div class="text-gray-700 text-[8px]">
                    Thanks for your interest. Applications must be submitted by a licensed insurance broker on behalf of any proposer.
                  </div>
                </div>

                <!-- Broker Information -->
                <div class="flex flex-col gap-[9px]">
                  <div class="text-[11px] font-semibold text-black-300">Broker Information</div>
                  <div class="grid grid-cols-3 gap-[13px]">
                    ${generateFieldHTML(
                      "Broker Name *",
                      data.brokerName,
                      "Enter Broker Name"
                    )}
                    ${generateFieldHTML(
                      "Broker Company Name *",
                      data.brokerCompanyName,
                      "Enter Broker Company Name"
                    )}
                    ${generateFieldHTML(
                      "Broker Phone Number *",
                      data.brokerPhoneNumber,
                      "Enter Broker Phone Number"
                    )}
                  </div>
                </div>

                <!-- Client Information -->
                <div class="flex flex-col gap-[9px]">
                  <div class="text-[11px] font-semibold text-black-300">Client Information</div>
                  <div class="grid grid-cols-3 gap-[13px]">
                    ${generateFieldHTML(
                      "Client Name *",
                      data.clientName,
                      "Enter Client Name"
                    )}
                    ${generateFieldHTML(
                      "Client Email *",
                      data.clientEmail,
                      "Enter Client Email"
                    )}
                    ${generateFieldHTML(
                      "Client Phone (Optional)",
                      data.clientPhone,
                      "Enter Client Phone"
                    )}
                  </div>
                </div>

                <!-- Confirmations -->
                <div class="flex flex-col gap-[6px]">
                  ${generateCheckboxHTML(
                    "I am authorised to act for the client.",
                    data.authorised === "Yes"
                  )}
                  ${generateCheckboxHTML(
                    "The information is complete and accurate to the best of my knowledge.",
                    data.accurate === "Yes"
                  )}
                  ${generateCheckboxHTML(
                    "I understand and confirm this submission is broker‑led and not direct to the insurer.",
                    data.submission === "Yes"
                  )}
                  ${generateCheckboxHTML(
                    "No data collection required.",
                    data.collection === "Yes"
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

const generateStep2HTML = (data, needsPageBreak = false) => {
  return `
    <div class="${needsPageBreak ? "page-break" : ""} avoid-break mb-12">
      <div class="relative flex bg-white">
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-[642px] h-[480px] bg-[url('${process.env.FRONTEND_BASE_URL}/src/assets/images/background-pdf.png')] bg-no-repeat bg-center bg-cover"></div>
        </div>

        <div class="relative flex-1 flex flex-col items-center justify-center z-10">
          <div class="text-sm font-bold text-center w-full text-[#5174FE] mt-4">
            Important Notices and Disclosures
          </div>
          <div class="w-full mx-4 xl:mx-auto px-6 py-4 my-4 xl:my-8">
            <div class="first-step w-full flex flex-col md:items-center md:justify-center gap-10">
              <div class="w-full flex flex-col gap-6">
                <div class="flex flex-col gap-4">
                  <div>
                    <div class="text-xs font-semibold text-black-300">
                      Your duty of disclosure
                    </div>
                    <div class="text-gray-700 text-[9px] mt-2">
                      Before you enter into an insurance contract, you have a
                      duty to tell us anything that you know, or could
                      reasonably be expected to know, may affect our decision to
                      insure you and on what terms. You have this duty until we
                      agree to insure you. You have the same duty before you
                      renew, extend, vary or reinstate an insurance contract.
                      You do not need to tell us anything that:
                    </div>
                  </div>
                  <div class="text-gray-700 text-[9px]">
                    <ul class="list-disc list-inside">
                      <li>reduces the risk we insure you for; or</li>
                      <li>we know or should know as an insurer; or</li>
                      <li>is common knowledge; or</li>
                      <li>we waive your duty to tell us about</li>
                    </ul>
                  </div>
                  <div>
                    <div class="text-xs font-semibold text-black-300">
                      If you do not tell us anything
                    </div>
                    <div class="text-gray-700 text-[9px] mt-2">
                      If you do not tell us anything you are required to, we may
                      cancel your contract or reduce the amount we will pay you
                      if you make a claim, or both. If your failure to tell us
                      is fraudulent, we may refuse to pay a claim and treat the
                      contract as if it never existed.
                    </div>
                  </div>
                  <div>
                    <div class="text-xs font-semibold text-black-300">
                      Claims made policy
                    </div>
                    <div class="text-gray-700 text-[9px] mt-2">
                      The Policy is issued on a claims made and notified basis.
                      This means that the Policy only covers the Insured for
                      claims first made against the Insured during the Period of
                      Insurance and notified to us during the Period of
                      Insurance. Section 40(3) of the Insurance Contracts Act
                      1984 may provide additional rights at law. That section
                      provides that where the insured gave notice in writing to
                      the insurer of facts that might give rise to a claim
                      against the insured as soon as was reasonably practicable
                      after the insured became aware of those facts but during
                      the period of insurance, the insurer is not relieved of
                      liability under the contract in respect of the claim, when
                      made, by reason only that it was made after the expiration
                      of the period of insurance.
                    </div>
                  </div>
                  <div>
                    <div class="text-xs font-semibold text-black-300">
                      Retroactive date
                    </div>
                    <div class="text-gray-700 text-[9px] mt-2">
                      The proposed insurance may be limited by a Retroactive
                      Date. If so, the policy will not cover any claims or
                      circumstances arising from any events, services,
                      activities, errors or omissions or conduct prior to the
                      Retroactive Date.
                    </div>
                  </div>
                  <div>
                    <div class="text-xs font-semibold text-black-300">
                      Subrogation
                    </div>
                    <div class="text-gray-700 text-[9px] mt-2">
                      Where you have prejudiced Artisan Underwriting Pty Ltd
                      (including its Insurers or underwriters) rights to recover
                      a loss from another party, this may have the effect of
                      excluding or limiting our (Artisan’s) or our Underwriters
                      liability in respect of that loss.
                    </div>
                  </div>
                  <div>
                    <div class="text-xs font-semibold text-black-300">
                      Privacy Notice
                    </div>
                    <div class="text-gray-700 text-[9px] mt-2">
                      We safeguard your privacy and the confidentiality of your
                      personal information and are committed to handling your
                      personal information in a responsible way. We will abide
                      by the Privacy Act 1988 (Cth) (the ‘Act’) including the
                      Australian Privacy Principles which are set out in the
                      Act. We have developed a Privacy Policy that sets out how
                      we collect, store, use and disclose your personal
                      information. Please refer to our website below for a copy
                      of our Privacy Policy
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

const generateStep3HTML = (data, needsPageBreak = false) => {
  return `
    <div class="${needsPageBreak ? "page-break" : ""} avoid-break mb-4">
      <div class="relative flex bg-white">
        <!-- Background Image -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-[642px] h-[480px] bg-[url('${process.env.FRONTEND_BASE_URL}/src/assets/images/background-pdf.png')] bg-no-repeat bg-center bg-cover"></div>
        </div>
      </div>
        <div class="relative flex-1 flex flex-col items-center justify-center z-10 mb-6">
          <div class="text-xs font-bold text-center w-full text-[#5174FE] mb-4">
            Part A – Insured Details
          </div>
          <div class="w-full mx-4 xl:mx-auto px-6 py-4 my-4 xl:my-8">
            <div class="w-full flex flex-col gap-4">
              <!-- Section 1: Insured Entities -->
              <div class="flex flex-col gap-2">
                <div class="text-xs font-semibold text-black-300">
                  1. Please provide responses to all of the below fields:
                </div>

                ${
                  data.step3.insuredEntities &&
                  data.step3.insuredEntities
                    .map(
                      (entity, index) => `
                  <div class="grid grid-cols-4 gap-2 mb-2">
                    ${generateFieldHTML(
                      `Insured Entity ${index + 1}`,
                      entity.entity,
                      "Enter Insured Entities"
                    )}
                    ${generateDateFieldHTML(
                      "Date Incorporated",
                      entity.dateIncorporated,
                      "DD/MM/YYYY"
                    )}
                    ${generateFieldHTML("ABN", entity.abn, "ABN")}
                    ${generateFieldHTML(
                      "Business Number",
                      entity.businessNumber,
                      "Business Number"
                    )}
                  </div>
                `
                    )
                    .join("")
                }
              </div>

              <!-- Section 2: Contact Information -->
              <div class="flex flex-col gap-2">
                <div class="text-xs font-semibold text-black-300">
                  2. Please provide responses to all of the below fields:
                </div>

                <div class="grid grid-cols-2 gap-2">
                  ${generateFieldHTML(
                    "Telephone Number",
                    data.step3.telephoneNumber,
                    "Enter Telephone Number"
                  )}
                  ${generateFieldHTML(
                    "Email Address",
                    data.step3.emailAddress,
                    "Enter Email Address"
                  )}
                </div>
              </div>

              <!-- Section 3: Principals -->
              <div class="flex flex-col gap-2">
                <div class="text-xs font-semibold text-black-300">
                  3. All principals, directors with their details:
                </div>

                ${
                  data.step3.principals &&
                  data.step3.principals
                    .map(
                      (principal, index) => `
                  <div class="grid grid-cols-4 gap-2 mb-2">
                    ${generateFieldHTML(
                      `Name of Principal/Director ${index + 1}`,
                      principal.name,
                      "Enter Name Here"
                    )}
                    ${generateFieldHTML("Age", principal.age, "Enter Age")}
                    ${generateFieldHTML(
                      "Qualifications",
                      principal.qualifications,
                      "Qualifications"
                    )}
                    ${generateDateFieldHTML(
                      "Start date with Insured",
                      principal.startDate,
                      "DD/MM/YYYY"
                    )}
                  </div>
                `
                    )
                    .join("")
                }
              </div>

              <!-- Section 4: Staff Numbers -->
              <div class="flex flex-col gap-2">
                <div class="text-xs font-semibold text-black-300">
                  4. Principals, directors and staff with work status:
                </div>

                <div class="flex flex-col gap-1 mb-2">
                  <div class="text-[9px] font-semibold text-black-300">Directors, partners, principals</div>
                  <div class="grid grid-cols-2 gap-2">
                    ${generateFieldHTML(
                      "Full time",
                      data.step3.directorsFullTime,
                      "Enter Full time"
                    )}
                    ${generateFieldHTML(
                      "Part Time",
                      data.step3.directorsPartTime,
                      "Part Time"
                    )}
                  </div>
                </div>

                <div class="flex flex-col gap-1 mb-2">
                  <div class="text-[9px] font-semibold text-black-300">Administration/Other staff</div>
                  <div class="grid grid-cols-2 gap-2">
                    ${generateFieldHTML(
                      "Full time",
                      data.step3.adminFullTime,
                      "Enter Full time"
                    )}
                    ${generateFieldHTML(
                      "Part Time",
                      data.step3.adminPartTime,
                      "Part Time"
                    )}
                  </div>
                </div>

                <div class="flex flex-col gap-1">
                  <div class="text-[9px] font-semibold text-gray-700">Total all staff</div>
                  <div class="grid grid-cols-2 gap-2">
                    ${generateFieldHTML(
                      "Full time",
                      data.step3.totalFullTime,
                      "Enter Full time"
                    )}
                    ${generateFieldHTML(
                      "Part Time",
                      data.step3.totalPartTime,
                      "Part Time"
                    )}
                  </div>
                </div>
              </div>

              <!-- Section 5: Activities -->
              <div class="flex flex-col gap-2">
                <div class="text-xs font-semibold text-black-300">
                  5. Please list all professional services provided and allocate an approximate percentage of the Insureds income for each.
                </div>

                <div class="flex flex-col gap-1 mb-2">
                  <div class="text-[9px] font-semibold text-gray-700">(i) Activities Performed (include all activities and services)</div>

                  ${
                    data.step3.activities &&
                    data.step3.activities
                      .map(
                        (activity, index) => `
                    <div class="grid grid-cols-2 gap-2 mb-2">
                      ${generateFieldHTML(
                        `Activity ${index + 1}`,
                        activity.activity,
                        "Enter Activities Performed"
                      )}
                      ${generateFieldHTML(
                        "% Holdings",
                        activity.percentage,
                        "% Holdings"
                      )}
                    </div>
                  `
                      )
                      .join("")
                  }
                </div>

                ${generateYesNoHTML(
                  "(ii) Does the Insured anticipate any changes to the above Activities in the next 12 months?",
                  data.step3.anticipateChanges,
                  data.step3.anticipateChangesDetails,
                  "Please provide details"
                )}

                ${generateYesNoHTML(
                  "(iii) Has the Insured performed any other professional service or activity other than described in 6 (i) above and for which cover may be required?",
                  data.step3.otherServices,
                  data.step3.otherServicesDetails,
                  "Please provide details"
                )}

                ${generateYesNoHTML(
                  "(iv) Is cover required for professional services or activities which have been provided by a former subsidiary?",
                  data.step3.formerSubsidiary,
                  data.step3.formerSubsidiaryDetails,
                  "Please provide details"
                )}
              </div>

              <!-- Section 6-10: Yes/No Questions -->
              <div class="flex flex-col gap-2">
                ${generateYesNoHTML(
                  "6. Has the Insured or any of its subsidiaries undertaken any mergers or acquisitions in the last five years?",
                  data.step3.mergers,
                  data.step3.mergersDetails,
                  "Please provide details"
                )}

                ${generateYesNoHTML(
                  "7. Has the Insured or any of its subsidiaries been involved in any joint ventures in the last five years?",
                  data.step3.jointVentures,
                  data.step3.jointVenturesDetails,
                  "Please provide details"
                )}

                ${generateYesNoHTML(
                  "8. Does the Insured require cover for any previous business including the previous business of any principal or director?",
                  data.step3.previousBusiness,
                  data.step3.previousBusinessDetails,
                  "Please provide details"
                )}

                ${generateYesNoHTML(
                  "9. Does the Insured hold any licence or accreditation which is required in order to provide professional services or activities for which cover is requested?",
                  data.step3.licenses,
                  data.step3.licensesDetails,
                  "Please provide details"
                )}

                ${generateYesNoHTML(
                  "10. Does the Insured have any representation outside of Australia?",
                  data.step3.overseasRepresentation,
                  "",
                  ""
                )}

                ${
                  data.step3.overseasRepresentation === "Yes" && data.step3.overseasOffices
                    ? `
                  <div class="ml-4 mt-2">
                    ${data.step3.overseasOffices
                      .map(
                        (office, index) => `
                      <div class="grid grid-cols-4 gap-2 mb-2">
                        ${generateFieldHTML(
                          `Country ${index + 1}`,
                          office.country,
                          "Enter Country"
                        )}
                        ${generateFieldHTML("Fees/Turnover", office.fees, "$")}
                        ${generateFieldHTML(
                          "Number of staff",
                          office.staff,
                          "Number of staff"
                        )}
                        ${generateFieldHTML(
                          "Number of offices",
                          office.offices,
                          "Number of offices"
                        )}
                      </div>
                    `
                      )
                      .join("")}
                  </div>
                `
                    : ""
                }
              </div>
            </div>
          </div>
        </div>

        <div class="relative flex-1 flex flex-col items-center justify-center z-10 mb-4">
          <div class="text-xs font-bold text-center w-full text-[#5174FE] mb-4">
            Part B – Income and Contracts
          </div>
          <div class="w-full mx-4 xl:mx-auto px-6 py-4 my-4 xl:my-8">
            <div class="w-full flex flex-col gap-4">
              <!-- Section 11: Income Table -->
              <div class="flex flex-col gap-2">
                <div class="text-xs font-semibold text-black-300">
                  11. Please provide responses to all of the below fields:
                </div>

                <!-- Australia -->
                <div class="flex flex-col gap-1 mb-2">
                  <div class="text-[9px] font-semibold text-black-300">Australia</div>
                  <div class="grid grid-cols-3 gap-2">
                    ${generateFieldHTML(
                      "Previous 12 months",
                      data.step4.australiaPrevious12,
                      "Previous 12 months"
                    )}
                    ${generateFieldHTML(
                      "Last 12 months",
                      data.step4.australiaLast12,
                      "Last 12 months"
                    )}
                    ${generateFieldHTML(
                      "Next 12 months",
                      data.step4.australiaNext12,
                      "Next 12 months"
                    )}
                  </div>
                </div>

                <!-- Excluding (USA/Canada) -->
                <div class="flex flex-col gap-1 mb-2">
                  <div class="text-[9px] font-semibold text-black-300">Excluding (USA/Canada)</div>
                  <div class="grid grid-cols-3 gap-2">
                    ${generateFieldHTML(
                      "Previous 12 months",
                      data.step4.excludingPrevious12,
                      "Previous 12 months"
                    )}
                    ${generateFieldHTML(
                      "Last 12 months",
                      data.step4.excludingLast12,
                      "Last 12 months"
                    )}
                    ${generateFieldHTML(
                      "Next 12 months",
                      data.step4.excludingNext12,
                      "Next 12 months"
                    )}
                  </div>
                </div>

                <!-- Including (USA/Canada) -->
                <div class="flex flex-col gap-1 mb-2">
                  <div class="text-[9px] font-semibold text-black-300">Including (USA/Canada)</div>
                  <div class="grid grid-cols-3 gap-2">
                    ${generateFieldHTML(
                      "Previous 12 months",
                      data.step4.includingPrevious12,
                      "Previous 12 months"
                    )}
                    ${generateFieldHTML(
                      "Last 12 months",
                      data.step4.includingLast12,
                      "Last 12 months"
                    )}
                    ${generateFieldHTML(
                      "Next 12 months",
                      data.step4.includingNext12,
                      "Next 12 months"
                    )}
                  </div>
                </div>

                <!-- Total -->
                <div class="flex flex-col gap-1">
                  <div class="text-[9px] font-semibold text-gray-700">Total</div>
                  <div class="grid grid-cols-3 gap-2">
                    ${generateFieldHTML(
                      "Previous 12 months",
                      data.step4.totalPrevious12,
                      "Previous 12 months"
                    )}
                    ${generateFieldHTML(
                      "Last 12 months",
                      data.step4.totalLast12,
                      "Last 12 months"
                    )}
                    ${generateFieldHTML(
                      "Next 12 months",
                      data.step4.totalNext12,
                      "Next 12 months"
                    )}
                  </div>
                </div>
              </div>

              <!-- Section 12: Projects -->
              <div class="flex flex-col gap-2">
                <div class="text-xs font-semibold text-black-300">
                  12. Please provide us
                </div>

                <div class="flex flex-col gap-1 mb-2">
                  <div class="text-[9px] font-semibold text-black-300">(i) The 3 largest Projects/Contracts in the last 5 years (including current).</div>

                  ${
                    data.step4.projects &&
                    data.step4.projects
                      .map(
                        (project, index) => `
                      <div class="grid grid-cols-3 gap-2 mb-2">
                        ${generateFieldHTML(
                          `Client Name ${index + 1}`,
                          project.clientName,
                          "Client Name"
                        )}
                        ${generateDateFieldHTML(
                          "Start Date",
                          project.startDate,
                          "DD/MM/YYYY"
                        )}
                        ${generateDateFieldHTML(
                          "Completion Date",
                          project.completionDate,
                          "DD/MM/YYYY"
                        )}
                      </div>
                    `
                      )
                      .join("")
                  }
                </div>

                <div class="flex flex-col gap-1 mb-2">
                  <div class="text-[9px] font-semibold text-black-300">(ii) Project/Contract Specifics of the aforementioned.</div>

                  ${
                    data.step4.projects &&
                    data.step4.projects
                      .map(
                        (project, index) => `
                      <div class="grid grid-cols-3 gap-2 mb-2">
                        ${generateFieldHTML(
                          `Project/Contract Type ${index + 1}`,
                          project.description,
                          "Project/Contract Type"
                        )}
                        ${generateFieldHTML(
                          "Project/Contract Value",
                          project.contractValue,
                          "$"
                        )}
                        ${generateFieldHTML(
                          "Scope of Services Provided",
                          project.percentage,
                          "Scope of Services Provided"
                        )}
                      </div>
                    `
                      )
                      .join("")
                  }
                </div>
              </div>

              <!-- Section 13: Manufacturing Questions -->
              <div class="flex flex-col gap-2">
                <div class="text-xs font-semibold text-black-300">
                  13. Does the Insured undertake (either themselves or on their behalf) any:
                </div>

                ${generateYesNoHTML(
                  "(a) Manufacturing, construction, erection or installation?",
                  data.step4.manufacturing,
                  data.step4.manufacturingPercentage
                    ? `${data.manufacturingPercentage}%`
                    : "",
                  "What percentage of the total fees/turnover declared in 12 relates to such work"
                )}

                ${generateYesNoHTML(
                  "(b) Supply of materials, plant, goods, products or equipment?",
                  data.step4.supplyMaterials,
                  data.step4.supplyPercentage ? `${data.step4.supplyPercentage}%` : "",
                  "What percentage of the total fees/turnover declared in 12 relates to such work"
                )}
              </div>

              <!-- Section 14: Subcontracting -->
              <div class="flex flex-col gap-2">
                ${generateYesNoHTML(
                  "14. Does the Insured subcontract out any of their Professional Services/Activities?",
                  data.step4.subcontract,
                  "",
                  ""
                )}

                ${
                  data.step4.subcontract === "Yes"
                    ? `
                  <div class="ml-4 mt-2 flex flex-col gap-2">
                    <div class="flex flex-col gap-1">
                      <div class="text-[9px] font-semibold text-black-300">(a) Please confirm the percentage of fees/turnover paid to subcontractors in the last 12 months?</div>
                      ${generateFieldHTML(
                        "Percentage",
                        data.step4.subcontractPercentage,
                        "%"
                      )}
                    </div>

                    <div class="flex flex-col gap-1">
                      <div class="text-[9px] font-semibold text-black-300">(b) Provide full details of the Professional Services Subcontracted.</div>
                      <div class="border border-gray-300 rounded-lg px-3 py-2 min-h-[60px] text-[9px] ${
                        !data.step4.subcontractDetails
                          ? "text-gray-300 italic"
                          : "text-black-300"
                      }">
                        ${data.step4.subcontractDetails || "Please provide details"}
                      </div>
                    </div>

                    ${generateYesNoHTML(
                      "(c) Confirm that all subcontractors carry Professional Indemnity insurance?",
                      data.step4.subcontractInsurance,
                      "",
                      ""
                    )}
                  </div>
                `
                    : ""
                }
              </div>
            </div>
          </div>
        </div>
        <div class="relative flex-1 flex flex-col items-center justify-center z-10 mb-4">
          <div class="text-xs font-bold text-center w-full text-[#5174FE] mb-4">
            Part C – Insurance Details
          </div>
          <div class="w-full mx-4 xl:mx-auto px-6 py-4 my-4 xl:my-8">
            <div class="w-full flex flex-col gap-4">
              <!-- Section 15: Current PI Insurance -->
              <div class="flex flex-col gap-2">
                ${generateYesNoHTML(
                  "15. Does the Insured carry an active and current Professional Indemnity Insurance Policy?",
                  data.step5.hasCurrentPI,
                  data.step5.currentPIDetails,
                  "Please provide details"
                )}
              </div>

              <!-- Section 16: Stamp Duty Declaration -->
              <div class="flex flex-col gap-2">
                <div class="text-xs font-semibold text-black-300">
                  16. Stamp Duty Declaration – Please provide a percentage breakdown of fees/turnover by location as follows
                </div>

                <!-- First row of states -->
                <div class="grid grid-cols-3 gap-2 mb-2">
                  ${generateFieldHTML("NSW", data.step5.nsw, "0%")}
                  ${generateFieldHTML("VIC", data.step5.vic, "0%")}
                  ${generateFieldHTML("QLD", data.step5.qld, "0%")}
                </div>

                <!-- Second row of states -->
                <div class="grid grid-cols-3 gap-2 mb-2">
                  ${generateFieldHTML("SA", data.step5.sa, "0%")}
                  ${generateFieldHTML("WA", data.step5.wa, "0%")}
                  ${generateFieldHTML("ACT", data.step5.act, "0%")}
                </div>

                <!-- Third row of states -->
                <div class="grid grid-cols-3 gap-2">
                  ${generateFieldHTML("TAS", data.step5.tas, "0%")}
                  ${generateFieldHTML("NT", data.step5.nt, "0%")}
                  ${generateFieldHTML("Other", data.step5.other, "0%")}
                </div>
              </div>
            </div>
          </div>
        </div>
         <div class="relative flex-1 flex flex-col items-center justify-center z-10 mb-4">
          <div class="text-xs font-bold text-center w-full text-[#5174FE] mb-4">
            Part D – Claims
          </div>
          <div class="w-full mx-4 xl:mx-auto px-6 py-4 my-4 xl:my-8">
            <div class="w-full flex flex-col gap-4">
              <!-- Section 17: Circumstances -->
              <div class="flex flex-col gap-2">
                ${generateYesNoHTML(
                  "17. Is the Insured aware of any circumstance or incident which may give rise to a claim against the Insured or its partners/principals/directors or employees?",
                  data.step6.awareOfCircumstances,
                  data.step6.circumstancesDetails,
                  "Please provide details"
                )}
              </div>

              <!-- Section 18: Pending Claims -->
              <div class="flex flex-col gap-2">
                ${generateYesNoHTML(
                  "18. Has there ever been or is there any pending claims against the Insured, its subsidiaries, previous businesses or predecessors in business or its current or former partners/principals/directors or employees for actual or alleged breaches of professional duties or services for which this policy relates?",
                  data.step6.pendingClaims,
                  data.step6.claimsDetails,
                  "Please provide details"
                )}
              </div>

              <!-- Section 19: Prosecution -->
              <div class="flex flex-col gap-2">
                ${generateYesNoHTML(
                  "19. Is the Insured aware of any actual or pending prosecution, investigation or inquiry of the Insured or any partners/principals/directors or employees under any statute, legislation, regulation or By-Law whatsoever?",
                  data.step6.prosecution,
                  data.step6.prosecutionDetails,
                  "Please provide details"
                )}
              </div>

              <!-- Section 20: Disciplinary Action -->
              <div class="flex flex-col gap-2">
                ${generateYesNoHTML(
                  "20. Has the Insured or any partner/directors or employees ever been subject to any disciplinary action, been fined or penalised, or been the subject of an inquiry investigating or alleging professional misconduct?",
                  data.step6.disciplinaryAction,
                  data.step6.disciplinaryDetails,
                  "Please provide details"
                )}
              </div>

              <!-- Section 21: PI Insurance Declined -->
              <div class="flex flex-col gap-2">
                ${generateYesNoHTML(
                  "21. Has the Insured (including its subsidiaries, previous businesses or predecessors in business or its current or former partners/principals/directors) ever had any Insurer decline a proposal, imposed any special terms, cancelled or refused to renew a Professional Indemnity Insurance policy?",
                  data.step6.piInsuranceDeclined,
                  data.step6.declinedDetails,
                  "Please provide details"
                )}
              </div>
            </div>
          </div>
        </div>

        <div class="relative flex-1 flex flex-col items-center justify-center z-10 mb-4">
          <div class="text-xs font-bold text-center w-full text-[#5174FE] mb-4">
            Part E – Declaration
          </div>
          <div class="w-full mx-4 xl:mx-auto px-6 py-4 my-4 xl:my-8">
            <div class="w-full flex flex-col gap-4">
              <!-- Declaration Text -->
              <div class="flex flex-col gap-2">
                <div class="text-xs font-semibold text-black-300">
                  Please Note:
                </div>

                <div class="text-[8px] text-gray-700 mb-2">
                  Signing the Declaration does not bind either the proposed Insured or the Insurer to execute this or any insurance whatsoever.
                </div>

                <div class="text-[8px] text-gray-700 mb-2">
                  By signing this Declaration, the Insured declares that all necessary inquiries into the accuracy of the responses given in this proposal have been made and the Insured confirms that the statements and particulars given in this proposal are true, accurate and complete and that no material facts have been omitted, misstated or suppressed. The Insured agrees that if any of the information changes between the date of this proposal and the inception date of the insurance to which this proposal relates, the Insured will give immediate notice thereof to the Artisan Underwriting Pty Ltd (Artisan).
                </div>

                <div class="text-[8px] text-gray-700 mb-2">
                  The Insured acknowledges receipt of the Important Notice, Privacy Notice and Duty of Disclosure information contained in this proposal and confirms they have read and understood the content of them. The Insured consents to Artisan Underwriting Pty Ltd collecting, using and disclosing personal information as set out in Artisan's Privacy Notice in this proposal and the policy. If the Insured has provided or will provide information to Artisan about any other individuals, the Insured confirms that they are authorised to disclose the other individual's personal information to Artisan and give the above consent on their behalf.
                </div>

                <div class="text-[8px] text-gray-700 mb-4">
                  The signatory below confirms that they are authorised by the Insured (and its subsidiaries, previous businesses, partners/principals/directors if applicable) to complete this proposal form and to accept quotation terms for this insurance on behalf of the Insureds (and its subsidiaries, previous businesses, partners/principals/directors) behalf.
                </div>
              </div>

              <!-- Declaration Form -->
              <div class="flex flex-col gap-3 p-4 border border-gray-300 rounded-lg">
                <div class="flex flex-col gap-2">
                  <div class="flex justify-between items-center">
                    <div class="text-[9px] font-semibold text-gray-700 w-1/3">Signed</div>
                    <div class="w-2/3">
                      ${generateFieldHTML("", data.step7.signed, "Provide Info...")}
                    </div>
                  </div>
                </div>

                <div class="flex flex-col gap-2">
                  <div class="flex justify-between items-center">
                    <div class="text-[9px] font-semibold text-gray-700 w-1/3">Name of Partner(s) or Director(s)</div>
                    <div class="w-2/3">
                      ${generateFieldHTML(
                        "",
                        data.step7.nameOfPartner,
                        "Provide Info..."
                      )}
                    </div>
                  </div>
                </div>

                <div class="flex flex-col gap-2">
                  <div class="flex justify-between items-center">
                    <div class="text-[9px] font-semibold text-gray-700 w-1/3">On behalf of</div>
                    <div class="w-2/3">
                      ${generateFieldHTML(
                        "",
                        data.step7.onBehalfOf,
                        "Provide Info..."
                      )}
                    </div>
                  </div>
                </div>

                <div class="flex flex-col gap-2">
                  <div class="flex justify-between items-center">
                    <div class="text-[9px] font-semibold text-gray-700 w-1/3">Date</div>
                    <div class="w-2/3">
                      ${generateDateFieldHTML(
                        "",
                        data.step7.declarationDate,
                        "DD/MM/YYYY"
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
      </div>
    </div>
  `;
};


const generateTailwindHTML = (formData) => {
  const steps = Object.keys(formData).filter(
    (stepKey) => formData[stepKey] && Object.keys(formData[stepKey]).length > 0
  );

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Miscellaneous PI Proposal Form</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <script>
          tailwind.config = {
              theme: {
                  extend: {
                      colors: {
                          primary: '#596efe',
                          'black-300': '#4a4a4a'
                      }
                  }
              }
          }
      </script>
      <style>
          @media print {
              .page-break { page-break-before: always; }
              .no-break { page-break-inside: avoid; }
              .avoid-break { break-inside: avoid; }
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
          @page {
              size: A4;
              margin: 20mm 15mm;
          }
      </style>
  </head>
  <body class="bg-white font-sans text-sm leading-relaxed">
      <div class="max-w-4xl mx-auto p-8">
          <!-- Header -->
          <div class="w-full justify-center items-center relative z-20 mb-4">
          <img src="${process.env.FRONTEND_BASE_URL}/src/assets/images/pdfLogo.png" class="w-[82px] h-auto mx-auto" alt="Background Logo" />
        </div>

        <!-- Form Title -->
          ${steps
            .map((stepKey, index) => {
              switch (stepKey) {
                case "step1":
                  return generateStep1HTML(formData[stepKey], false);
                case "step2":
                  return generateStep2HTML(formData[stepKey], true);
                case "step3":
                  return generateStep3HTML(formData, true);
                default:
                  return "";
              }
            })
            .join("")}

      </div>
  </body>
  </html>`;
};

// PDF Generation Endpoint
app.post("/api/generate-pdf", async (req, res) => {
  let browser;

  try {
    console.time("PDF Generation");
    const { formData } = req.body;

    if (!formData) {
      return res.status(400).json({
        error: "Missing formData in request body",
      });
    }

    console.log("🔄 Starting PDF generation...");

    // Launch browser with optimized settings
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
      ],
    });

    const page = await browser.newPage();

    // Set viewport for consistent rendering
    await page.setViewport({
      width: 1200,
      height: 800,
      deviceScaleFactor: 2,
    });

    // Generate HTML content
    const htmlContent = generateTailwindHTML(formData);

    // Set content and wait for everything to load
    await page.setContent(htmlContent, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // Wait a bit more for Tailwind to fully apply
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("🎨 HTML content loaded, generating PDF...");

    // Generate PDF with optimized settings
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "15mm",
        bottom: "20mm",
        left: "15mm",
      },
      displayHeaderFooter: false,
      preferCSSPageSize: true,
      scale: 1,
    });

    console.timeEnd("PDF Generation");
    console.log(
      "✅ PDF generated successfully, size:",
      Math.round(pdf.length / 1024),
      "KB"
    );

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Length", pdf.length);
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="miscellaneous-pi-proposal-form.pdf"'
    );

    // Send PDF
    res.send(pdf);
  } catch (error) {
    console.error("❌ Error generating PDF:", error);
    res.status(500).json({
      error: "Error generating PDF",
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  } finally {
    if (browser) {
      try {
        await browser.close();
        console.log("🔒 Browser closed successfully");
      } catch (closeError) {
        console.error("❌ Error closing browser:", closeError);
      }
    }
  }
});

// Email endpoint (existing code)
// app.post("/api/send-email", async (req, res) => {
//   try {
//     const { to, from, subject, body, pdfBase64, filename } = req.body;

//     if (!pdfBase64 || !to || !subject || !body) {
//       return res.status(400).json({
//         error: "Missing required fields",
//         required: ["to", "subject", "body", "pdfBase64"],
//       });
//     }

//     console.time("Prepare Mail Options");
//     const mailOptions = {
//       from: from || process.env.EMAIL_USER,
//       to,
//       subject,
//       text: body,
//       html: `
//         <div style="font-family: Arial, sans-serif; line-height: 1.6;">
//           <h2 style="color: #333;">New Form Submission</h2>
//           <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
//             <pre style="white-space: pre-wrap; font-family: monospace; font-size: 12px;">${body}</pre>
//           </div>
//           <p style="margin-top: 20px; color: #666;">
//             <strong>Note:</strong> Complete form details are attached as a PDF.
//           </p>
//         </div>
//       `,
//       attachments: [
//         {
//           filename: filename || "miscellaneous-pi-proposal-form.pdf",
//           content: pdfBase64,
//           encoding: "base64",
//           contentType: "application/pdf",
//         },
//       ],
//     };

//     res.status(200).json({
//       success: true,
//       message: "Email request received. Sending in background...",
//     });

//     const info = await transporter.sendMail(mailOptions);

//     console.log("📤 Email sent successfully:", info.messageId);
//   } catch (error) {
//     console.error("❌ Error sending email:", error);
//   }
// });

// Email endpoint (updated code)
app.post("/api/send-email", async (req, res) => {
  try {
    const { to, from, subject, body, pdfBase64, filename } = req.body;

    if (!pdfBase64 || !to || !subject || !body) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["to", "subject", "body", "pdfBase64"],
      });
    }

    console.time("Prepare Mail Options");

    // Create HTML content with footer
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #333;">New Form Submission</h2>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
          <pre style="white-space: pre-wrap; font-family: monospace; font-size: 12px;">${body}</pre>
        </div>
        <p style="margin-top: 20px; color: #666;">
          <strong>Note:</strong> Complete form details are attached as a PDF.
        </p>

        <!-- Footer -->
        <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #ddd; color: #666; font-size: 12px;">
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="margin: 0; line-height: 1.4;">
            <strong>DO NOT REPLY</strong> to this email address. This mailbox is not monitored.<br>
            For all queries, please contact: <a href="mailto:quotes@artisanuw.com.au" style="color: #0066cc;">quotes@artisanuw.com.au</a>
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: "Artisan Proposals (No‑Reply) <noreply@artisanuw.com.au>", // Updated from header
      replyTo: "quotes@artisanuw.com.au", // Added reply-to header
      to,
      subject: subject || "Your Artisan proposal has been received", // Default subject if none provided
      text: `${body}\n\n---\nDO NOT REPLY to this email address. This mailbox is not monitored.\nFor all queries, please contact: quotes@artisanuw.com.au`,
      html: htmlContent,
      attachments: [
        {
          filename: filename || "miscellaneous-pi-proposal-form.pdf",
          content: pdfBase64,
          encoding: "base64",
          contentType: "application/pdf",
        },
      ],
    };

    res.status(200).json({
      success: true,
      message: "Email request received. Sending in background...",
    });

    const info = await transporter.sendMail(mailOptions);

    console.log("📤 Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
});

// Health check (existing code)
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    services: {
      email: "available",
      pdf: "available",
    },
  });
});

// Test PDF endpoint (for development)
app.get("/api/test-pdf", async (req, res) => {
  try {
    const testFormData = {
      step1: {
        brokerName: "John Doe",
        brokerCompanyName: "ABC Insurance Brokers",
        brokerPhoneNumber: "+1-555-0123",
        clientName: "Jane Smith",
        clientEmail: "jane.smith@example.com",
        clientPhone: "+1-555-0456",
        authorised: "Yes",
        accurate: "Yes",
        submission: "Yes",
        collection: "No",
      },
      step2: {
        companyName: "Tech Solutions Inc.",
        businessType: "Software Development",
        yearsInBusiness: "5",
      },
    };

    // Forward to the PDF generation endpoint
    req.body = { formData: testFormData };
    return app._router.handle(
      Object.assign(req, {
        method: "POST",
        url: "/api/generate-pdf",
      }),
      res
    );
  } catch (error) {
    res
      .status(500)
      .json({ error: "Test PDF generation failed", message: error.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📧 Email service: available`);
  console.log(`📄 PDF service: available`);
  console.log(`🔗 Test PDF: http://localhost:${port}/api/test-pdf`);
});
