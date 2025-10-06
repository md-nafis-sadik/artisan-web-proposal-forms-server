export const formatValue = (value) => {
  if (!value || value === "") return null;
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
};

export const generateFieldHTML = (
  label,
  value,
  placeholder = "",
  extraClasses = ""
) => {
  const displayValue = formatValue(value);
  const isEmpty = !displayValue;

  return `
    <div class="avoid-break ${extraClasses}">
        <label class="block text-[10px] text-black-300 mb-1">
            ${label}
        </label>
        <div class="border border-gray-300 rounded-lg px-3 py-2 h-[32px] flex items-center text-[10px] placeholder:text-[10px] ${
          isEmpty ? "text-gray-300 italic" : "text-black-300"
        }">
            ${displayValue || placeholder || `Enter ${label.replace(" *", "")}`}
        </div>
    </div>`;
};

export const generateCheckboxHTML = (label, checked) => {
  return `
    <div class="flex items-center gap-2 mb-2">
        <div class="flex items-center justify-center w-[11px] h-[11px] border-2 border-black rounded-full flex-shrink-0 ${
          checked ? "bg-black" : "bg-white"
        }">
            ${
              checked
                ? '<span class="text-black text-[10px] leading-none bg-black w-[10px] h-[10px] rounded-full border-2 border-white">✓</span>'
                : ""
            }
        </div>
        <span class="text-[10px] text-gray-700">${label}</span>
    </div>
  `;
};

export const formatDate = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-GB");
};

export const generateDateFieldHTML = (label, timestamp, placeholder = "") => {
  const displayValue = timestamp ? formatDate(timestamp) : "";
  const showPlaceholder = !timestamp;
  const placeholderText = placeholder || `Enter ${label.replace(" *", "")}`;

  return `
     <div class="avoid-break">
        <label class="block text-[10px] text-black-300 mb-1">
            ${label}
        </label>
        <div class="border border-gray-300 rounded-lg px-3 py-2 h-[32px] flex items-center text-[10px] placeholder:text-[10px] ${
          showPlaceholder ? "text-gray-300 italic" : "text-black-300"
        }">
            ${displayValue || placeholderText}
        </div>
    </div>
  `;
};

export const generateYesNoHTML = (
  label,
  value,
  details = "",
  detailsLabel = "",
  labelClass = "",
  other = false
) => {
  return `
    <div class="flex flex-col gap-1 mb-2">
      <div class="flex ${
        other
          ? "flex-col gap-1 items-start"
          : "justify-between items-start gap-2"
      }">
        <div class="text-[10px] font-semibold text-black-300 ${
          other ? "w-full" : "w-3/4"
        } ${labelClass}">${label}</div>
        <div class="flex gap-2">
        <div class="min-w-[90px] text-center px-4 py-1 text-[10px] rounded-[4px] ${
          value === "No"
            ? "bg-gradient-to-r from-[#ED09FE] to-[#189AFE] text-white"
            : "bg-gray-200 text-gray-600"
        }">No</div>
              <div class="min-w-[90px] text-center px-4 py-1 text-[10px] rounded-[4px] ${
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
        <label class="block text-[10px] text-black-300 mb-1">
            ${detailsLabel}
        </label>
        <div class="border border-gray-300 rounded-lg px-3 py-2 h-[32px] flex items-center text-[10px] placeholder:text-[10px] ${
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

export const generate2FieldYesNoHTML = (label, data, labelClass = "") => {
  return `
    <div class="flex flex-col gap-1 mb-2">
      <div class="text-[10px] font-semibold text-black-300 w-full ${labelClass}">${label}</div>
      <div class="flex justify-between items-start gap-2">
        ${generateFieldHTML("Previous 12 months", data.value1, "$", "w-full")}
        ${generateFieldHTML("Last 12 months", data.value2, "$", "w-full")}
        <div class="flex flex-col gap-1 items-start mt-1">
          <div class="text-[10px] font-semibold text-black-300 w-3/4">Tick if previously done</div>
          <div class="flex gap-2 items-center">
            <div class="min-w-[90px] text-center px-4 py-1 text-[10px] rounded-[4px] ${
              data.value3 === "No"
                ? "bg-gradient-to-r from-[#ED09FE] to-[#189AFE] text-white"
                : "bg-gray-200 text-gray-600"
            }">No</div>
            <div class="min-w-[90px] text-center px-4 py-1 text-[10px] rounded-[4px] ${
              data.value3 === "Yes"
                ? "bg-gradient-to-r from-[#ED09FE] to-[#189AFE] text-white"
                : "bg-gray-200 text-gray-600"
            }">Yes</div>
          </div>
        </div>
      </div>
    </div>
  `;
};

export const generate6YesNoHTML = (label, data, labelClass = "") => {
  return `
    <div class="flex flex-col gap-1 mb-2">
      <div class="flex justify-between items-start gap-2"
      }">
        <div class="text-xs font-semibold text-black-300
          w-3/4
         ${labelClass}">${label}</div>
        <div class="flex gap-2">
        <div class="min-w-[90px] text-center px-4 py-1 text-[10px] rounded-[4px] ${
          data.value0 === "No"
            ? "bg-gradient-to-r from-[#ED09FE] to-[#189AFE] text-white"
            : "bg-gray-200 text-gray-600"
        }">No</div>
              <div class="min-w-[90px] text-center px-4 py-1 text-[10px] rounded-[4px] ${
                data.value0 === "Yes"
                  ? "bg-gradient-to-r from-[#ED09FE] to-[#189AFE] text-white"
                  : "bg-gray-200 text-gray-600"
              }">Yes</div>
          
        </div>
      </div>
      ${
        data.value0 === "Yes"
          ? `
      <div class="mt-2">
        <div class="grid grid-cols-3 gap-2">
                    ${generateFieldHTML(
                      "Name of Insurer",
                      data.value1,
                      "Name of Insurer"
                    )}
                    ${generateFieldHTML("Premium", data.value2, "$")}
                    ${generateFieldHTML("Limit of indemnity", data.value3, "$")}
                    ${generateFieldHTML("Excess", data.value4, "$")}
                    ${generateDateFieldHTML(
                      "Expiry Date",
                      data.value5,
                      "DD/MM/YYYY"
                    )}
                    ${generateDateFieldHTML(
                      "Retroactive Date Specified",
                      data.value6,
                      "DD/MM/YYYY"
                    )}
        </div>
    </div>

      `
          : ""
      }
    </div>
  `;
};

export const generate6v2YesNoHTML = (label, data, labelClass = "") => {
  return `
    <div class="flex flex-col gap-1 mb-2">
      <div class="flex justify-between items-start gap-2"
      }">
        <div class="text-xs font-semibold text-black-300
          w-3/4
         ${labelClass}">${label}</div>
        <div class="flex gap-2">
        <div class="min-w-[90px] text-center px-4 py-1 text-[10px] rounded-[4px] ${
          data.value0 === "No"
            ? "bg-gradient-to-r from-[#ED09FE] to-[#189AFE] text-white"
            : "bg-gray-200 text-gray-600"
        }">No</div>
              <div class="min-w-[90px] text-center px-4 py-1 text-[10px] rounded-[4px] ${
                data.value0 === "Yes"
                  ? "bg-gradient-to-r from-[#ED09FE] to-[#189AFE] text-white"
                  : "bg-gray-200 text-gray-600"
              }">Yes</div>
          
        </div>
      </div>
      ${
        data.value0 === "Yes"
          ? `
      <div class="mt-2">
        <div class="flex flex-col gap-1">
                    ${
                      data.value1 &&
                      data.value1
                        .map(
                          (value1, index) => `
                          <div class="grid grid-cols-3 gap-2 mb-2">
                            ${generateFieldHTML(
                              `Name of Principal or Director`,
                              value1.principalName,
                              "Name subsidiary"
                            )}
                          ${generateFieldHTML(
                            "Name of Previous Business",
                            value1.businessName,
                            "Name subsidiary"
                          )}
                          ${generateFieldHTML(
                            "Professional Services/ Activities",
                            value1.professionalServices,
                            "Date ceased to be a subsidiary"
                          )}
                        </div>
                      `
                        )
                        .join("")
                    }
        </div>
    </div>

      `
          : ""
      }
    </div>
  `;
};

export const generate4YesNoHTML = (label, data, labelClass = "") => {
  return `
    <div class="flex flex-col gap-1 mb-2">
      <div class="flex justify-between items-start gap-2"
      }">
        <div class="text-xs font-semibold text-black-300
          w-3/4
         ${labelClass}">${label}</div>
        <div class="flex gap-2">
        <div class="min-w-[90px] text-center px-4 py-1 text-[10px] rounded-[4px] ${
          data.value0 === "No"
            ? "bg-gradient-to-r from-[#ED09FE] to-[#189AFE] text-white"
            : "bg-gray-200 text-gray-600"
        }">No</div>
              <div class="min-w-[90px] text-center px-4 py-1 text-[10px] rounded-[4px] ${
                data.value0 === "Yes"
                  ? "bg-gradient-to-r from-[#ED09FE] to-[#189AFE] text-white"
                  : "bg-gray-200 text-gray-600"
              }">Yes</div>
          
        </div>
      </div>
      ${
        data.value0 === "Yes"
          ? `
      <div class="mt-2">
        <div class="grid grid-cols-2 gap-2">
                    ${generateFieldHTML(
                      "Name subsidiary",
                      data.value1,
                      "Name subsidiary"
                    )}
                    ${generateFieldHTML(
                      "Date ceased to be a subsidiary",
                      data.value2,
                      "Date ceased to be a subsidiary"
                    )}
                    ${generateFieldHTML(
                      "Name subsidiary",
                      data.value3,
                      "Name subsidiary"
                    )}
                    ${generateFieldHTML(
                      "Date ceased to be a subsidiary",
                      data.value4,
                      "Date ceased to be a subsidiary"
                    )}
        </div>
    </div>

      `
          : ""
      }
    </div>
  `;
};

export const generatePageTemplate = (
  content,
  title = "",
  needsPageBreak = false,
  avoidBreak = false
) => {
  return `
    <div class="${needsPageBreak ? "page-break" : ""} ${
    avoidBreak ? "avoid-break avoid-break-border" : ""
  }">
      ${content}
    </div>
  `;
};
