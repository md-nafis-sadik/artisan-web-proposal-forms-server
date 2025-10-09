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
        <label class="block text-[10px] text-black-300 mb-1 truncate">
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

const generateDynamicRows = (fieldConfigs, dataArgs) => {
  if (!fieldConfigs) return "";
  
  if (!dataArgs || dataArgs.length === 0) return "";
  
  const normalizedConfigs = Array.isArray(fieldConfigs) ? fieldConfigs : [fieldConfigs];
  
  const normalizedData = parseDataArguments(dataArgs, normalizedConfigs.length);
  
  return normalizedData
    .map((rowValues) => {
      const fieldHTMLArray = generateFieldsHTML(normalizedConfigs, rowValues);
      
      const gridClass = getGridClass(fieldHTMLArray.length);
      
      return `
        <div class="${gridClass} gap-2 mb-2">
          ${fieldHTMLArray.join("")}
        </div>
      `;
    })
    .join("");
};

const parseDataArguments = (dataArgs, fieldCount) => {
  // If first argument is an array, treat it as the main data source
  if (dataArgs.length === 1 && Array.isArray(dataArgs[0])) {
    const data = dataArgs[0];
    
    // If it's an array of objects (like form data), return it directly
    if (data.length > 0 && typeof data[0] === 'object' && !Array.isArray(data[0])) {
      return data;
    }

    // If it's an array of arrays, return it directly
    if (Array.isArray(data[0])) {
      return data;
    }
    
    // If it's a simple array that matches field count, wrap it
    if (data.length === fieldCount) {
      return [data];
    }
    
    // Otherwise return as single row
    return [data];
  }
  
  // Handle multiple arguments
  if (dataArgs.length > 0 && dataArgs.length <= 4) {
    const allPrimitive = dataArgs.every(arg => !Array.isArray(arg) && typeof arg !== 'object');
    
    if (allPrimitive) {
      return [dataArgs];
    }
    
    return dataArgs.map(arg => Array.isArray(arg) ? arg : [arg]);
  }
  
  return [];
};

const generateFieldsHTML = (fieldConfigs, rowValues) => {
  const fieldHTMLArray = [];
  
  fieldConfigs.forEach((field, index) => {
    let value;
    
    // If rowValues is an object and field has a fieldName property, use that
    if (typeof rowValues === 'object' && !Array.isArray(rowValues) && field.fieldName) {
      value = rowValues[field.fieldName];
    } else {
      // Otherwise use index-based access
      value = Array.isArray(rowValues) ? rowValues[index] : rowValues;
    }
    
    const html = field.type === "date" 
      ? generateDateFieldHTML(field.label, value, field.placeholder || "")
      : generateFieldHTML(field.label, value, field.placeholder || "");
    
    fieldHTMLArray.push(html);
  });
  
  return fieldHTMLArray;
};

const getGridClass = (fieldCount) => {
  const gridClasses = {
    1: "grid grid-cols-1",
    2: "grid grid-cols-2",
    3: "grid grid-cols-3",
    4: "grid grid-cols-4"
  };
  
  return gridClasses[fieldCount] || "grid grid-cols-1";
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

export const generate6v3YesNoHTML = (label, data, labelClass = "") => {
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
                          <div class="grid grid-cols-4 gap-2 mb-2">
                          ${generateDateFieldHTML(
                            "Date of Claim or Loss",
                            value1.claimDate,
                            "DD/MM/YYYY"
                          )}
                            ${generateFieldHTML(
                              `Details of Each Claim or Loss`,
                              value1.claimDetails,
                              "Details here"
                            )}
                          ${generateFieldHTML(
                            "Cost of Claim Insured",
                            value1.claimCost,
                            "$"
                          )}
                          ${generateFieldHTML(
                            "Estimated Outstanding Loss",
                            value1.claimLoss,
                            "$"
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
        <div class="flex flex-col gap-2">
                    ${
                      data.value1 &&
                      data.value1
                        .map(
                          (value1, index) => `
                          <div class="grid grid-cols-2 gap-2 mb-2">
                          ${generateFieldHTML(
                            "Name subsidiary",
                            value1.subsidiaryName,
                            "Name subsidiary"
                          )}
                            ${generateFieldHTML(
                              `Date ceased to be a subsidiary`,
                              value1.subsidiaryCeasedDate,
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

export const generateDynamicYesNoHTML = (
  label, 
  config,  // { value0: "Yes/No", value1: field config or array of field configs }
  ...dataArgs  // Can be array OR individual values (data1, data2, data3, data4)
) => {
  return `
    <div class="flex flex-col gap-1 mb-2">
      <div class="flex justify-between items-start gap-2">
        <div class="text-xs font-semibold text-black-300 w-3/4 ${config.labelClass || ""}">
          ${label}
        </div>
        <div class="flex gap-2">
          <div class="min-w-[90px] text-center px-4 py-1 text-[10px] rounded-[4px] ${
            config.value0 === "No"
              ? "bg-gradient-to-r from-[#ED09FE] to-[#189AFE] text-white"
              : "bg-gray-200 text-gray-600"
          }">No</div>
          <div class="min-w-[90px] text-center px-4 py-1 text-[10px] rounded-[4px] ${
            config.value0 === "Yes"
              ? "bg-gradient-to-r from-[#ED09FE] to-[#189AFE] text-white"
              : "bg-gray-200 text-gray-600"
          }">Yes</div>
        </div>
      </div>
      ${
        config.value0 === "Yes"
          ? `
      <div class="mt-2">
        <div class="flex flex-col gap-1">
          ${generateDynamicRows(config.value1, dataArgs)}
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
