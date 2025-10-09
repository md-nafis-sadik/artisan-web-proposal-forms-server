import { createSlice } from "@reduxjs/toolkit";

const techConsultFormSlice = createSlice({
  name: "techConsultForm",
  initialState: {
    currentStep: 1,
    success: false,
    formData: {
      step1: {
        brokerName: "",
        brokerCompanyName: "",
        brokerPhoneNumber: "",
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        authorised: "No",
        accurate: "No",
        submission: "No",
        collection: "No",
      },
      step2: {
        // Privacy & Consent step - informational only
      },
      step3: {
        insuredEntities: [
          {
            entity: "",
            dateIncorporated: undefined,
            abn: "",
          },
        ],
        telephoneNumber: "",
        emailAddress: "",
        websites: "",
        address: "",
        state: "",
        postCode: "",
        principals: [
          {
            name: "",
            age: "",
            qualifications: "",
            startDate: undefined,
          },
        ],
        directorsFullTime: "",
        directorsPartTime: "",
        qualifiedFullTime: "",
        qualifiedPartTime: "",
        adminFullTime: "",
        adminPartTime: "",
        totalFullTime: "",
        totalPartTime: "",
      },
      step4: {
        australiaPrevious12: "",
        australiaLast12: "",
        australiaNext12: "",
        excludingPrevious12: "",
        excludingLast12: "",
        excludingNext12: "",
        includingPrevious12: "",
        includingLast12: "",
        includingNext12: "",
        totalPrevious12: "",
        totalLast12: "",
        totalNext12: "",
        projects: [
          {
            clientName: "",
            startDate: undefined,
            completionDate: undefined,
            contractValue: "",
            description: "",
            percentage: "",
          },
          {
            clientName: "",
            startDate: undefined,
            completionDate: undefined,
            contractValue: "",
            description: "",
            percentage: "",
          },
          {
            clientName: "",
            startDate: undefined,
            completionDate: undefined,
            contractValue: "",
            description: "",
            percentage: "",
          },
        ],
        manufacturing: "No",
        manufacturingPercentage: "",
        supplyMaterials: "No",
        supplyPercentage: "",
        subcontract: "No",
        subcontractPercentage: "",
        subcontractDetails: "",
        subcontractInsurance: "No",
      },
      step5: {
        // Business Discipline percentages (Question 9)
        bespokeSoftware: "",
        dataProcessing: "",
        educationTraining: "",
        facilitiesManagement: "",
        generalITAdvice: "",
        hardwareDesign: "",
        internetServiceProvider: "",
        projectManagement: "",
        saleSupply3rdPartyHardware: "",
        saleCustomisableSoftware: "",
        salePackagedSoftware: "",
        softwareMaintenance: "",
        systemsIntegration: "",
        webDesign: "",
        businessDisciplineOtherDetails: "",

        // End User Applications percentages (Question 10)
        administrative: "",
        accountingFinancial: "",
        architecturalEngineering: "",
        communicationsUtilities: "",
        databaseManagement: "",
        educational: "",
        fundTransfer: "",
        imaging: "",
        inventoryControl: "",
        lanNetworkManagement: "",
        medicalManagement: "",
        manufacturingProcessControl: "",
        scientificMathematical: "",
        security: "",
        endUserOtherDetails: "",

        // Industry percentages (Question 11)
        aerospace: "",
        communicationsTransportation: "",
        constructionMiningAgriculture: "",
        educationIndustry: "",
        financialInstitutions: "",
        governmentMilitary: "",
        governmentNonMilitary: "",
        healthCareMedical: "",
        homeUse: "",
        manufacturingIndustrial: "",
        tradeRetailWholesale: "",
        industryOtherDetails: "",
      },
      step6: {
        // Miscellaneous questions 9-14
        australianFinancialServicesLicence: "No",
        australianFinancialServicesDetails: "",
        anticipateChanges: "No",
        anticipateChangesDetails: "",
        otherProfessionalService: "No",
        otherProfessionalServiceDetails: [
          {
            subsidiaryName: "",
            subsidiaryCeasedDate: "",
          },
          {
            subsidiaryName: "",
            subsidiaryCeasedDate: "",
          },
        ],
        formerSubsidiaryServicesCover: "No",
        formerSubsidiaryDetails: "",
        mergersAcquisitions: "No",
        mergersAcquisitionsDetails: "",
        previousBusiness: "No",
        previousBusinessDetails: [
          {
            principleName: "",
            previousBusinessName: "",
            professionalServices: "",
          },
          {
            principleName: "",
            previousBusinessName: "",
            professionalServices: "",
          },
          {
            principleName: "",
            previousBusinessName: "",
            professionalServices: "",
          },
        ],
        jointVentures: "No",
        jointVenturesDetails: "",
        representationOutside: "No",
        representationOutsideDetails: [
          {
            country: "",
            fees: "",
            staffNumber: "",
            officeNumber: "",
          },
          {
            country: "",
            fees: "",
            staffNumber: "",
            officeNumber: "",
          },
          {
            country: "",
            fees: "",
            staffNumber: "",
            officeNumber: "",
          },
        ],
      },
      step7: {
        // Question 20 - Contract management practices (i)
        changeOrdersIntegrated: "No",
        legalReviewProducts: "No",
        waiverSubrogationRights: "No",
        disputeArbitrationProcess: "No",
        projectDueDiligence: "No",
        nonStandardContracts: "No",

        // Question 20 - Contract terms (ii)
        liabilityConsequentialDamage: "No",
        limitationLiabilityClause: "No",
        waiverSubrogationRights2: "No",
        indemnityOtherParties: "No",
        requiresLicenseDetails: "",

        // Question 21 - Quality control procedures
        alphaTesting: "No",
        betaTesting: "No",
        formalCustomerAcceptance: "No",
        prototypeDevelopment: "No",
        statisticalProcessControl: "No",
        vendorCertificationProcess: "No",
        totalQualityManagement: "No",
        writtenQualityControlProgram: "No",
        insuranceVerificationProcess: "No",
      },
      step8: {
        // Insurance Details
        hasCurrentPI: "No",
        currentPIInsurer: "",
        currentPIPremium: "",
        currentPILimit: "",
        currentPIExcess: "",
        currentPIExpiryDate: undefined,
        currentPIRetroactiveDate: undefined,
        // State breakdown percentages
        nsw: "",
        vic: "",
        qld: "",
        sa: "",
        wa: "",
        act: "",
        tas: "",
        nt: "",
        other: "",
      },
      step9: {
        // Claims (Questions 22-26)
        awareOfCircumstances: "No",
        circumstancesDetails: "",
        pendingClaims: "No",
        claimsDetails: [
          {
            claimDate: undefined,
            claimDetails: "",
            claimCost: "",
            claimLoss: "",
          },
          {
            claimDate: undefined,
            claimDetails: "",
            claimCost: "",
            claimLoss: "",
          },
          {
            claimDate: undefined,
            claimDetails: "",
            claimCost: "",
            claimLoss: "",
          },
        ],
        prosecution: "No",
        prosecutionDetails: "",
        disciplinaryAction: "No",
        disciplinaryDetails: "",
        piInsuranceDeclined: "No",
        declinedDetails: "",
      },
      step10: {
        signed: "",
        nameOfPartner: "",
        onBehalfOf: "",
        declarationDate: undefined,
      },
    },
  },
  reducers: {
    updateField: (state, action) => {
      const { step, field, value } = action.payload;
      state.formData[step][field] = value;
    },
    updateNestedField: (state, action) => {
      const { step, field, subField, value } = action.payload;
      if (!state.formData[step][field]) {
        state.formData[step][field] = {};
      }
      state.formData[step][field][subField] = value;
    },
    updateTCArrayField: (state, action) => {
      const { step, field, index, subField, value } = action.payload;
      // Ensure step data exists
      if (!state.formData[step]) {
        state.formData[step] = {};
      }
      // Ensure array field exists
      if (!state.formData[step][field]) {
        state.formData[step][field] = [];
      }
      // Ensure array item exists at index
      if (!state.formData[step][field][index]) {
        state.formData[step][field][index] = {};
      }
      // Set the value
      state.formData[step][field][index][subField] = value;
    },
    addArrayItem: (state, action) => {
      const { step, field, item } = action.payload;
      if (!state.formData[step][field]) {
        state.formData[step][field] = [];
      }
      state.formData[step][field].push(item);
    },
    removeArrayItem: (state, action) => {
      const { step, field, index } = action.payload;
      if (
        state.formData[step][field] &&
        state.formData[step][field].length > 1
      ) {
        state.formData[step][field].splice(index, 1);
      }
    },
    setStep: (state, action) => {
      state.currentStep = action.payload;
    },
    setSuccess: (state, action) => {
      state.success = action.payload;
    },
    resetForm: (state) => {
      state.currentStep = 1;
      // Reset step1
      state.formData.step1 = {
        brokerName: "",
        brokerCompanyName: "",
        brokerPhoneNumber: "",
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        authorised: "No",
        accurate: "No",
        submission: "No",
        collection: "No",
      };

      // Reset step3
      state.formData.step3 = {
        insuredEntities: [
          {
            entity: "",
            dateIncorporated: undefined,
            abn: "",
          },
        ],
        telephoneNumber: "",
        emailAddress: "",
        websites: "",
        address: "",
        state: "",
        postCode: "",
        principals: [
          {
            name: "",
            age: "",
            qualifications: "",
            startDate: undefined,
          },
        ],
        directorsFullTime: "",
        directorsPartTime: "",
        qualifiedFullTime: "",
        qualifiedPartTime: "",
        adminFullTime: "",
        adminPartTime: "",
        totalFullTime: "",
        totalPartTime: "",
      };

      // Reset step4
      state.formData.step4 = {
        australiaPrevious12: "",
        australiaLast12: "",
        australiaNext12: "",
        excludingPrevious12: "",
        excludingLast12: "",
        excludingNext12: "",
        includingPrevious12: "",
        includingLast12: "",
        includingNext12: "",
        totalPrevious12: "",
        totalLast12: "",
        totalNext12: "",
        projects: [
          {
            clientName: "",
            startDate: undefined,
            completionDate: undefined,
            contractValue: "",
            description: "",
            percentage: "",
          },
          {
            clientName: "",
            startDate: undefined,
            completionDate: undefined,
            contractValue: "",
            description: "",
            percentage: "",
          },
          {
            clientName: "",
            startDate: undefined,
            completionDate: undefined,
            contractValue: "",
            description: "",
            percentage: "",
          },
        ],
        manufacturing: "No",
        manufacturingPercentage: "",
        supplyMaterials: "No",
        supplyPercentage: "",
        subcontract: "No",
        subcontractPercentage: "",
        subcontractDetails: "",
        subcontractInsurance: "No",
      };

      state.formData.step5 = {
        // Business Discipline percentages (Question 9)
        bespokeSoftware: "",
        dataProcessing: "",
        educationTraining: "",
        facilitiesManagement: "",
        generalITAdvice: "",
        hardwareDesign: "",
        internetServiceProvider: "",
        projectManagement: "",
        saleSupply3rdPartyHardware: "",
        saleCustomisableSoftware: "",
        salePackagedSoftware: "",
        softwareMaintenance: "",
        systemsIntegration: "",
        webDesign: "",
        businessDisciplineOtherDetails: "",

        // End User Applications percentages (Question 10)
        administrative: "",
        accountingFinancial: "",
        architecturalEngineering: "",
        communicationsUtilities: "",
        databaseManagement: "",
        educational: "",
        fundTransfer: "",
        imaging: "",
        inventoryControl: "",
        lanNetworkManagement: "",
        medicalManagement: "",
        manufacturingProcessControl: "",
        scientificMathematical: "",
        security: "",
        endUserOtherDetails: "",

        // Industry percentages (Question 11)
        aerospace: "",
        communicationsTransportation: "",
        constructionMiningAgriculture: "",
        educationIndustry: "",
        financialInstitutions: "",
        governmentMilitary: "",
        governmentNonMilitary: "",
        healthCareMedical: "",
        homeUse: "",
        manufacturingIndustrial: "",
        tradeRetailWholesale: "",
        industryOtherDetails: "",
      };

      // Reset step5
      state.formData.step6 = {
        australianFinancialServicesLicence: "No",
        australianFinancialServicesDetails: "",
        anticipateChanges: "No",
        anticipateChangesDetails: "",
        otherProfessionalService: "No",
        otherProfessionalServiceDetails: [
          {
            subsidiaryName: "",
            subsidiaryCeasedDate: "",
          },
          {
            subsidiaryName: "",
            subsidiaryCeasedDate: "",
          },
        ],
        formerSubsidiaryServicesCover: "No",
        formerSubsidiaryDetails: "",
        mergersAcquisitions: "No",
        mergersAcquisitionsDetails: "",
        previousBusiness: "No",
        previousBusinessDetails: [
          {
            principleName: "",
            previousBusinessName: "",
            professionalServices: "",
          },
          {
            principleName: "",
            previousBusinessName: "",
            professionalServices: "",
          },
          {
            principleName: "",
            previousBusinessName: "",
            professionalServices: "",
          },
        ],
        jointVentures: "No",
        jointVenturesDetails: "",
        representationOutside: "No",
        representationOutsideDetails: [
          {
            country: "",
            fees: "",
            staffNumber: "",
            officeNumber: "",
          },
          {
            country: "",
            fees: "",
            staffNumber: "",
            officeNumber: "",
          },
          {
            country: "",
            fees: "",
            staffNumber: "",
            officeNumber: "",
          },
        ],
      };

      // Reset step7
      state.formData.step7 = {
        // Question 20 - Contract management practices (i)
        changeOrdersIntegrated: "No",
        legalReviewProducts: "No",
        waiverSubrogationRights: "No",
        disputeArbitrationProcess: "No",
        projectDueDiligence: "No",
        nonStandardContracts: "No",

        // Question 20 - Contract terms (ii)
        liabilityConsequentialDamage: "No",
        limitationLiabilityClause: "No",
        waiverSubrogationRights2: "No",
        indemnityOtherParties: "No",
        requiresLicenseDetails: "",

        // Question 21 - Quality control procedures
        alphaTesting: "No",
        betaTesting: "No",
        formalCustomerAcceptance: "No",
        prototypeDevelopment: "No",
        statisticalProcessControl: "No",
        vendorCertificationProcess: "No",
        totalQualityManagement: "No",
        writtenQualityControlProgram: "No",
        insuranceVerificationProcess: "No",
      };

      // Reset step7
      state.formData.step8 = {
        hasCurrentPI: "No",
        currentPIInsurer: "",
        currentPIPremium: "",
        currentPILimit: "",
        currentPIExcess: "",
        currentPIExpiryDate: undefined,
        currentPIRetroactiveDate: undefined,
        nsw: "",
        vic: "",
        qld: "",
        sa: "",
        wa: "",
        act: "",
        tas: "",
        nt: "",
        other: "",
      };

      // Reset step9
      state.formData.step9 = {
        awareOfCircumstances: "No",
        circumstancesDetails: "",
        pendingClaims: "No",
        claimsDetails: [
          {
            claimDate: undefined,
            claimDetails: "",
            claimCost: "",
            claimLoss: "",
          },
          {
            claimDate: undefined,
            claimDetails: "",
            claimCost: "",
            claimLoss: "",
          },
          {
            claimDate: undefined,
            claimDetails: "",
            claimCost: "",
            claimLoss: "",
          },
        ],
        prosecution: "No",
        prosecutionDetails: "",
        disciplinaryAction: "No",
        disciplinaryDetails: "",
        piInsuranceDeclined: "No",
        declinedDetails: "",
      };

      // Reset step9
      state.formData.step10 = {
        signed: "",
        nameOfPartner: "",
        onBehalfOf: "",
        declarationDate: undefined,
      };
    },
  },
});

export const {
  updateField,
  updateNestedField,
  updateTCArrayField,
  addArrayItem,
  removeArrayItem,
  setStep,
  resetForm,
  setSuccess,
} = techConsultFormSlice.actions;
export default techConsultFormSlice.reducer;
