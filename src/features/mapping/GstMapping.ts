/**
 * GST report parameter mappings generated from the supplied GST report sample.
 *
 * Paths start at `report`. Array sections use `[]` to indicate an array item.
 * Keys that contain periods are represented using bracket notation, e.g. ["S.No"].
 * When evaluating an array parameter, select the appropriate month, supplier,
 * customer, HSN, or other record from the array.
 *
 * These mappings reflect the field names and structure in the supplied sample.
 */
export const GST_PARAMETER_MAPPING = {
  "accountDetails": {
    "gstin": "report[].Account Details.GSTIN",
    "gstrAnalysisReport": "report[].Account Details.GSTR Analysis Report  - ",
    "pan": "report[].Account Details.PAN",
    "periodFrom": "report[].Account Details.periodFrom",
    "periodTo": "report[].Account Details.periodTo",
    "stateOfOperationsBasedOnMaxGrossSales": "report[].Account Details[\"State of Operations(based on max. gross sales)\"]",
  },
  "customerSummary.categorizationOfInvoiceType": {
    "customBondedWarehouse": "report[]. Customer Summary[].Categorization of Invoice Type.Custom Bonded Warehouse",
    "deemedExports": "report[]. Customer Summary[].Categorization of Invoice Type.Deemed Exports",
    "regularB2BInvoices": "report[]. Customer Summary[].Categorization of Invoice Type.Regular B2B Invoices",
    "sezExportsWithPayment": "report[]. Customer Summary[].Categorization of Invoice Type.SEZ Exports with payment",
    "sezExportsWithoutPayment": "report[]. Customer Summary[].Categorization of Invoice Type.SEZ exports without payment",
  },
  "customerSummary.stateWiseCustomerFrequency": {
    "frequency": "report[]. Customer Summary[].State-wise Customer Frequency [].Frequency ",
    "registered": "report[]. Customer Summary[].State-wise Customer Frequency [].Registered",
    "sNo": "report[]. Customer Summary[].State-wise Customer Frequency [][\"S.No\"]",
    "state": "report[]. Customer Summary[].State-wise Customer Frequency [].State",
    "tax": "report[]. Customer Summary[].State-wise Customer Frequency [].Tax",
    "taxableValue": "report[]. Customer Summary[].State-wise Customer Frequency [].Taxable Value",
    "unregistered": "report[]. Customer Summary[].State-wise Customer Frequency [].Unregistered",
  },
  "customerSummary.stateWiseRegisteredCustomerFrequency": {
    "state": "report[]. Customer Summary[].State-wise Registered Customer Frequency [].State",
    "statePercentage": "report[]. Customer Summary[].State-wise Registered Customer Frequency [].State Percentage",
  },
  "customerSummary.summaryOfCustomers": {
    "filingStatusFiledInvoicesRaised": "report[]. Customer Summary[].Summary of Customers[].Filing Status (Filed-Invoices Raised)",
    "name": "report[]. Customer Summary[].Summary of Customers[].Name",
    "proportionInTotalSupplyValue": "report[]. Customer Summary[].Summary of Customers[].Proportion in Total Supply Value",
    "regularIrregular": "report[]. Customer Summary[].Summary of Customers[].Regular-Irregular",
    "sNo": "report[]. Customer Summary[].Summary of Customers[][\"S.No\"]",
    "tax": "report[]. Customer Summary[].Summary of Customers[].Tax",
    "totalTaxableValue": "report[]. Customer Summary[].Summary of Customers[].Total Taxable Value",
  },
  "dataStatus": {
    "gstR1": "report[].Data Status[].GstR1",
    "gstR2A": "report[].Data Status[].GstR2A",
    "gstR3B": "report[].Data Status[].GstR3B",
    "gstin": "report[].Data Status[].GSTIN",
    "returnPeriod": "report[].Data Status[].Return Period",
  },
  "hsnSummary.hsnSummary.data": {
    "code": "report[].Hsn Summary[].Hsn Summary[].data[].Code",
    "description": "report[].Hsn Summary[].Hsn Summary[].data[].Description",
    "inTaxableValue": "report[].Hsn Summary[].Hsn Summary[].data[].% in Taxable Value",
    "quantity": "report[].Hsn Summary[].Hsn Summary[].data[].Quantity",
    "sNo": "report[].Hsn Summary[].Hsn Summary[].data[][\"S.No\"]",
    "taxRateCharged": "report[].Hsn Summary[].Hsn Summary[].data[].Tax Rate charged",
    "taxableValue": "report[].Hsn Summary[].Hsn Summary[].data[].Taxable Value",
    "unit": "report[].Hsn Summary[].Hsn Summary[].data[].Unit",
  },
  "hsnSummary.hsnSummary.total": {
    "inTaxableValue": "report[].Hsn Summary[].Hsn Summary[].Total.% in Taxable Value",
    "quantity": "report[].Hsn Summary[].Hsn Summary[].Total.Quantity",
    "taxableValue": "report[].Hsn Summary[].Hsn Summary[].Total.Taxable Value",
  },
  "majorSuppliersCustomers.10MajorCustomers": {
    "nameOfCustomer": "report[].Major Suppliers & Customers [].10 Major Customers[].Name of Customer",
    "sNo": "report[].Major Suppliers & Customers [].10 Major Customers[][\"S.No\"]",
    "totalAmount": "report[].Major Suppliers & Customers [].10 Major Customers[].Total Amount ",
    "totalNoOfInvoices": "report[].Major Suppliers & Customers [].10 Major Customers[][\"Total No. of invoices\"]",
  },
  "majorSuppliersCustomers.10MajorSuppliers": {
    "nameOfSupplier": "report[].Major Suppliers & Customers [].10 Major Suppliers[].Name of Supplier",
    "sNo": "report[].Major Suppliers & Customers [].10 Major Suppliers[][\"S.No\"]",
    "totalAmount": "report[].Major Suppliers & Customers [].10 Major Suppliers[].Total Amount ",
    "totalNoOfInvoices": "report[].Major Suppliers & Customers [].10 Major Suppliers[][\"Total No. of invoices\"]",
  },
  "monthlySalesPurchase.monthlyPurchasesSummary.data": {
    "month": "report[].Monthly Sales&Purchase[].Monthly Purchases Summary[].data[].Month",
    "tax": "report[].Monthly Sales&Purchase[].Monthly Purchases Summary[].data[].Tax",
    "taxableValue": "report[].Monthly Sales&Purchase[].Monthly Purchases Summary[].data[].Taxable Value",
  },
  "monthlySalesPurchase.monthlyPurchasesSummary.total": {
    "tax": "report[].Monthly Sales&Purchase[].Monthly Purchases Summary[].Total.Tax",
    "taxableValue": "report[].Monthly Sales&Purchase[].Monthly Purchases Summary[].Total.Taxable Value",
  },
  "monthlySalesPurchase.monthlySaleSummary.data": {
    "month": "report[].Monthly Sales&Purchase[].Monthly Sale Summary[].data[].Month",
    "tax": "report[].Monthly Sales&Purchase[].Monthly Sale Summary[].data[].Tax",
    "taxableValue": "report[].Monthly Sales&Purchase[].Monthly Sale Summary[].data[].Taxable Value",
  },
  "monthlySalesPurchase.monthlySaleSummary.total": {
    "tax": "report[].Monthly Sales&Purchase[].Monthly Sale Summary[].Total.Tax",
    "taxableValue": "report[].Monthly Sales&Purchase[].Monthly Sale Summary[].Total.Taxable Value",
  },
  "overview.businessBreakUpGSTR1": {
    "b2BBusinessToBusiness": "report[].Overview[].Business BreakUp - GSTR1.B2B (Business to Business)",
    "b2CLBusinessToCustomersLarge": "report[].Overview[].Business BreakUp - GSTR1.B2CL (Business to Customers Large)",
    "b2CSBusinessToCustomersSmall": "report[].Overview[].Business BreakUp - GSTR1.B2CS (Business to Customers Small)",
    "cdnrCreditAndDebitNotesRegistered": "report[].Overview[].Business BreakUp - GSTR1.CDNR (Credit and Debit Notes Registered)",
    "cdnurCreditAndDebitNotesUnRegistered": "report[].Overview[].Business BreakUp - GSTR1.CDNUR (Credit and Debit Notes Un-Registered)",
    "exports": "report[].Overview[].Business BreakUp - GSTR1.Exports",
    "nilNILExemptedNonGST": "report[].Overview[].Business BreakUp - GSTR1.NIL (NIL-Exempted-Non-GST)",
  },
  "overview.businessBreakup.purchasesTakeValuesFroGSTR2A": {
    "b2BBusinessToBusiness": "report[].Overview[].Business Breakup [].Purchases (Take Values fro  GSTR 2A).B2B (Business to Business)",
    "cdnrCreditAndDebitNotesRegistered": "report[].Overview[].Business Breakup [].Purchases (Take Values fro  GSTR 2A).CDNR (Credit and Debit Notes Registered)",
    "imports": "report[].Overview[].Business Breakup [].Purchases (Take Values fro  GSTR 2A).Imports",
    "reverseCharge": "report[].Overview[].Business Breakup [].Purchases (Take Values fro  GSTR 2A).Reverse Charge",
  },
  "overview.businessBreakup.salesTakeValuesFromGSTR1": {
    "b2BBusinessToBusiness": "report[].Overview[].Business Breakup [].Sales (Take values from  GSTR 1).B2B (Business to Business)",
    "b2CLBusinessToCustomersLarge": "report[].Overview[].Business Breakup [].Sales (Take values from  GSTR 1).B2CL (Business to Customers Large)",
    "b2CSBusinessToCustomersSmall": "report[].Overview[].Business Breakup [].Sales (Take values from  GSTR 1).B2CS (Business to Customers Small)",
    "cdnrCreditAndDebitNotesRegistered": "report[].Overview[].Business Breakup [].Sales (Take values from  GSTR 1).CDNR (Credit and Debit Notes Registered)",
    "cdnurCreditAndDebitNotesUnRegistered": "report[].Overview[].Business Breakup [].Sales (Take values from  GSTR 1).CDNUR (Credit and Debit Notes Un-Registered)",
    "exports": "report[].Overview[].Business Breakup [].Sales (Take values from  GSTR 1).Exports",
    "nilNILExemptedNonGST": "report[].Overview[].Business Breakup [].Sales (Take values from  GSTR 1).NIL (NIL-Exempted-Non-GST)",
  },
  "overview.comparisonWithGSTR3B.exportValue": {
    "asPerGSTR1": "report[].Overview[].Comparison with GSTR 3B[].Export Value.As per GSTR 1",
    "asPerGSTR3B": "report[].Overview[].Comparison with GSTR 3B[].Export Value.As per GSTR 3B",
    "variation": "report[].Overview[].Comparison with GSTR 3B[].Export Value.% Variation",
  },
  "overview.comparisonWithGSTR3B.inputTaxCredit": {
    "asPerGSTR2A": "report[].Overview[].Comparison with GSTR 3B[].Input Tax Credit.As per GSTR 2A",
    "asPerGSTR3B": "report[].Overview[].Comparison with GSTR 3B[].Input Tax Credit.As per GSTR 3B",
    "variation": "report[].Overview[].Comparison with GSTR 3B[].Input Tax Credit.% Variation",
  },
  "overview.comparisonWithGSTR3B.nilExemptedNonGst": {
    "asPerGSTR1": "report[].Overview[].Comparison with GSTR 3B[].NIL-Exempted-Non-Gst.As per GSTR 1",
    "asPerGSTR3B": "report[].Overview[].Comparison with GSTR 3B[].NIL-Exempted-Non-Gst.As per GSTR 3B",
    "variation": "report[].Overview[].Comparison with GSTR 3B[].NIL-Exempted-Non-Gst.% Variation",
  },
  "overview.comparisonWithGSTR3B.totalOutwardSupply": {
    "asPerGSTR1": "report[].Overview[].Comparison with GSTR 3B[].Total Outward Supply.As per GSTR 1",
    "asPerGSTR3B": "report[].Overview[].Comparison with GSTR 3B[].Total Outward Supply.As per GSTR 3B",
    "variation": "report[].Overview[].Comparison with GSTR 3B[].Total Outward Supply.% Variation",
  },
  "overview.overviewOfGSTReturns.grossProfit": {
    "grossProfitKEJ": "report[].Overview[].Overview of GST Returns[].Gross Profit.Gross Profit (K=E-J)",
  },
  "overview.overviewOfGSTReturns.gstr1": {
    "adjustmentsDueToAmendmentsD": "report[].Overview[].Overview of GST Returns[].GSTR 1.Adjustments due to Amendments (D)",
    "grossSalesEABCD": "report[].Overview[].Overview of GST Returns[].GSTR 1.Gross Sales (E=A+B-C+D)",
    "totalValueOfCreditNotesIssuedC": "report[].Overview[].Overview of GST Returns[].GSTR 1.Total Value of Credit Notes Issued (C)",
    "totalValueOfDebitNotesIssuedB": "report[].Overview[].Overview of GST Returns[].GSTR 1.Total Value of Debit Notes Issued (B)",
    "totalValueOfSalesA": "report[].Overview[].Overview of GST Returns[].GSTR 1.Total Value of Sales (A)",
  },
  "overview.overviewOfGSTReturns.gstr2": {
    "adjustmentsDueToAmendmentsI": "report[].Overview[].Overview of GST Returns[].GSTR 2.Adjustments due to Amendments (I)",
    "grossPurchasesJFGHI": "report[].Overview[].Overview of GST Returns[].GSTR 2.Gross Purchases (J=F-G+H+I)",
    "totalValueOfCreditNotesIssuedH": "report[].Overview[].Overview of GST Returns[].GSTR 2.Total Value of Credit Notes Issued(H)",
    "totalValueOfDebitNotesIssuedG": "report[].Overview[].Overview of GST Returns[].GSTR 2.Total Value of Debit Notes Issued (G)",
    "totalValueOfPuchasesF": "report[].Overview[].Overview of GST Returns[].GSTR 2.Total Value of Puchases (F)",
  },
  "overview.overviewOfGSTReturns.inputTaxCreditAvailable": {
    "inputTaxCreditAvailableM": "report[].Overview[].Overview of GST Returns[].Input Tax Credit Available.Input Tax Credit Available(M)",
  },
  "overview.overviewOfGSTReturns.profitAfterGST": {
    "profitAfterGSTNKLM": "report[].Overview[].Overview of GST Returns[].Profit after GST.Profit after GST (N=K-L+M)",
  },
  "overview.overviewOfGSTReturns.totalGSTLiability": {
    "totalGSTLiabilityL": "report[].Overview[].Overview of GST Returns[].Total GST Liability.Total GST Liability(L)",
  },
  "snapshot.averages": {
    "averagePurchasesPerMonth": "report[].Snapshot[].Averages.Average Purchases per Month",
    "averagePurchasesPerSupplier": "report[].Snapshot[].Averages.Average Purchases per Supplier",
    "averageSalesPerCustomer": "report[].Snapshot[].Averages.Average Sales per Customer",
    "averageSalesPerMonth": "report[].Snapshot[].Averages.Average Sales per Month",
  },
  "snapshot.description": {
    "areInvoicesRaisedForOverseasBusiness": "report[].Snapshot[].Description.Are invoices raised for overseas business",
    "doesBusinessDealsWithECommercePlatform": "report[].Snapshot[].Description.Does business deals with E-Commerce Platform",
    "doesTheCompanyHasClientsInOtherState": "report[].Snapshot[].Description.Does the company has clients in other state",
    "totalExports": "report[].Snapshot[].Description.Total Exports",
    "totalTaxableValueFromRegisteredCustomers": "report[].Snapshot[].Description.Total Taxable Value from Registered Customers",
    "totalTaxableValueFromUnregisteredCustomers": "report[].Snapshot[].Description.Total Taxable Value from Unregistered Customers",
    "totalValueOfCreditDebitNotesGSTR1TotalSalesValue": "report[].Snapshot[].Description.Total Value of Credit & Debit Notes (GSTR1)/Total Sales Value",
    "totalValueOfCreditDebitNotesGSTR2ATotalPurchaseValue": "report[].Snapshot[].Description.Total Value of Credit & Debit Notes (GSTR2A)/Total Purchase Value",
    "totalValueOfExemptedGoodsTotalTaxableValue": "report[].Snapshot[].Description.Total Value of Exempted Goods/Total Taxable Value",
  },
  "snapshot.registeredUNREGISTEREDGSTR1": {
    "registered": "report[].Snapshot[].REGISTERED/UNREGISTERED (%) - GSTR 1.Registered",
    "unRegistered": "report[].Snapshot[].REGISTERED/UNREGISTERED (%) - GSTR 1.UnRegistered",
  },
  "supplierSummary.stateWiseSupplierFrequency": {
    "frequency": "report[].Supplier Summary[].State-wise Supplier Frequency [].Frequency ",
    "sNo": "report[].Supplier Summary[].State-wise Supplier Frequency [][\"S.No\"]",
    "state": "report[].Supplier Summary[].State-wise Supplier Frequency [].State",
    "stateField": "report[].Supplier Summary[].state-wise supplier Frequency[].State",
    "statePercentage": "report[].Supplier Summary[].state-wise supplier Frequency[].State Percentage",
    "tax": "report[].Supplier Summary[].State-wise Supplier Frequency [].Tax",
    "taxableValue": "report[].Supplier Summary[].State-wise Supplier Frequency [].Taxable Value",
  },
  "supplierSummary.summaryOfRegisteredSuppliers": {
    "filingStatusFiledInvoicesRaised": "report[].Supplier Summary[].Summary of Registered Suppliers[].Filing Status (Filed-Invoices Raised)",
    "name": "report[].Supplier Summary[].Summary of Registered Suppliers[].Name",
    "proportionInTotalSupplyValue": "report[].Supplier Summary[].Summary of Registered Suppliers[].Proportion in Total Supply Value",
    "regularIrregular": "report[].Supplier Summary[].Summary of Registered Suppliers[].Regular-Irregular",
    "sNo": "report[].Supplier Summary[].Summary of Registered Suppliers[][\"S.No\"]",
    "tax": "report[].Supplier Summary[].Summary of Registered Suppliers[].Tax",
    "totalTaxableValue": "report[].Supplier Summary[].Summary of Registered Suppliers[].Total Taxable Value",
  },
} as const;

export type GstParameterGroup = keyof typeof GST_PARAMETER_MAPPING;

/** All available GST parameter groups. */
export const GST_PARAMETER_GROUPS = Object.keys(
  GST_PARAMETER_MAPPING,
) as GstParameterGroup[];

/** Resolve a mapped path from its group and parameter key. */
export function getGstParameterPath(
  group: GstParameterGroup,
  parameter: string,
): string | undefined {
  const mapping: Record<string, string> = GST_PARAMETER_MAPPING[group] as Record<
    string,
    string
  >;
  return mapping[parameter];
}

/** Flatten the mapping for searchable/draggable parameter lists. */
export const ALL_GST_PARAMETERS = Object.entries(GST_PARAMETER_MAPPING).flatMap(
  ([group, parameters]) =>
    Object.entries(parameters).map(([key, path]) => ({
      id: `${group}.${key}`,
      group: group as GstParameterGroup,
      key,
      label: key
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/^./, (character) => character.toUpperCase()),
      path,
    })),
);

