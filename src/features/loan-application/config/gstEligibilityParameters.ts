export interface GstParameterGroup {
  id: string;
  title: string;
  parameters: string[];
}

export interface GstParameterSection {
  id: string;
  title: string;
  groups: GstParameterGroup[];
}

export const gstParameterSections: GstParameterSection[] = [
  {
    id: 'overview',
    title: 'GST Overview',
    groups: [
      {
        id: 'account-details',
        title: 'Account Details',
        parameters: [
          'Period To',
          'GSTIN',
          'GSTR Analysis Report',
          'Period From',
          'State of Operations (based on maximum gross sales)',
          'PAN',
        ],
      },
      {
        id: 'overview-of-returns',
        title: 'Overview of GST Returns',
        parameters: [
          'Adjustments due to Amendments (D)',
          'Total Value of Debit Notes Issued (B)',
          'Total Value of Credit Notes Issued (C)',
          'Total Value of Sales (A)',
          'Gross Sales (E = A + B - C + D)',
          'Total Value of Purchases (F)',
          'Total Value of Credit Notes Issued (H)',
          'Gross Purchases (J = F - G + H + I)',
          'Total Value of Debit Notes Issued (G)',
          'Adjustments due to Amendments (I)',
          'Gross Profit (K = E - J)',
          'Total GST Liability (L)',
          'Input Tax Credit Available (M)',
          'Profit after GST (N = K - L + M)',
        ],
      },
      {
        id: 'comparison-gstr-3b',
        title: 'Comparison with GSTR 3B',
        parameters: [
          'Total Outward Supply — Percentage Variation',
          'Total Outward Supply — As per GSTR 1',
          'Total Outward Supply — As per GSTR 3B',
          'Export Value — Percentage Variation',
          'Export Value — As per GSTR 1',
          'Export Value — As per GSTR 3B',
          'NIL / Exempted / Non-GST — Percentage Variation',
          'NIL / Exempted / Non-GST — As per GSTR 1',
          'NIL / Exempted / Non-GST — As per GSTR 3B',
          'Input Tax Credit — Percentage Variation',
          'Input Tax Credit — As per GSTR 2A',
          'Input Tax Credit — As per GSTR 3B',
        ],
      },
      {
        id: 'business-breakup',
        title: 'Business Breakup',
        parameters: [
          'Sales (GSTR 1) — B2CL (Business to Customers Large)',
          'Sales (GSTR 1) — CDNR (Credit and Debit Notes Registered)',
          'Sales (GSTR 1) — CDNUR (Credit and Debit Notes Unregistered)',
          'Sales (GSTR 1) — B2CS (Business to Customers Small)',
          'Sales (GSTR 1) — NIL (NIL / Exempted / Non-GST)',
          'Sales (GSTR 1) — B2B (Business to Business)',
          'Sales (GSTR 1) — Exports',
          'Purchases (GSTR 2A) — CDNR (Credit and Debit Notes Registered)',
          'Purchases (GSTR 2A) — Reverse Charge',
          'Purchases (GSTR 2A) — Imports',
          'Purchases (GSTR 2A) — B2B (Business to Business)',
        ],
      },
      {
        id: 'business-breakup-gstr1',
        title: 'Business Breakup — GSTR 1',
        parameters: [
          'B2CL (Business to Customers Large)',
          'CDNR (Credit and Debit Notes Registered)',
          'CDNUR (Credit and Debit Notes Unregistered)',
          'B2CS (Business to Customers Small)',
          'NIL (NIL / Exempted / Non-GST)',
          'B2B (Business to Business)',
          'Exports',
        ],
      },
      {
        id: 'snapshot-averages',
        title: 'Snapshot — Averages',
        parameters: [
          'Average Sales per Customer',
          'Average Purchases per Supplier',
          'Average Sales per Month',
          'Average Purchases per Month',
        ],
      },
    ],
  },
  {
    id: 'suppliers-customers',
    title: 'Top Suppliers & Customers',
    groups: [
      {
        id: 'supplier-account-details',
        title: 'Account Details',
        parameters: [
          'Period To',
          'GSTIN',
          'GSTR Analysis Report',
          'Period From',
          'State of Operations (based on maximum gross sales)',
          'PAN',
        ],
      },
      {
        id: 'major-suppliers',
        title: '10 Major Suppliers',
        parameters: [
          'Supplier — Serial Number',
          'Supplier — Name',
          'Supplier — Total Amount',
          'Supplier — Total Number of Invoices',
        ],
      },
      {
        id: 'major-customers',
        title: '10 Major Customers',
        parameters: [
          'Customer — Serial Number',
          'Customer — Name',
          'Customer — Total Amount',
          'Customer — Total Number of Invoices',
        ],
      },
      {
        id: 'common-suppliers-customers',
        title: 'Common Suppliers / Customers',
        parameters: ['Common Suppliers / Customers'],
      },
    ],
  },
  {
    id: 'monthly-summary',
    title: 'Monthly Sales & Purchase Summary',
    groups: [
      {
        id: 'monthly-account-details',
        title: 'Account Details',
        parameters: [
          'Period To',
          'GSTIN',
          'GSTR Analysis Report',
          'Period From',
          'State of Operations (based on maximum gross sales)',
          'PAN',
        ],
      },
      {
        id: 'monthly-purchases',
        title: 'Monthly Purchases Summary',
        parameters: [
          'Purchases — Month',
          'Purchases — Taxable Value',
          'Purchases — Tax',
          'Purchases — Total Taxable Value',
          'Purchases — Total Tax',
        ],
      },
      {
        id: 'monthly-sales',
        title: 'Monthly Sales Summary',
        parameters: [
          'Sales — Month',
          'Sales — Taxable Value',
          'Sales — Tax',
          'Sales — Total Taxable Value',
          'Sales — Total Tax',
        ],
      },
    ],
  },
];

export interface GstParameter {
  id: string;
  label: string;
  section: string;
  group: string;
}

export const allGstParameters: GstParameter[] = gstParameterSections.flatMap(
  (section) =>
    section.groups.flatMap((group) =>
      group.parameters.map((label, index) => ({
        id: `${section.id}:${group.id}:${index}`,
        label,
        section: section.title,
        group: group.title,
      }))
    )
);
