export const getPricingDetails = (module: string, currentAmount: number) => {
  switch (module.toUpperCase()) {
    case 'BSA':
      return {
        base: 479,
        gst: 86,
        total: 565,
        period: '1 Year',
        periodLabel: '(12 month period for 1 Bank Acc.)',
      };
    case 'GST':
      return {
        base: 475,
        gst: 86,
        total: 561,
        period: '1 Year',
        periodLabel: '(12 month period for 1 GST No.)',
      };
    case 'ITR':
      return {
        base: 445,
        gst: 80,
        total: 525,
        period: '2 Years',
        periodLabel: '(2 Financial Years for 1 Business)',
      };
    case 'CIBIL':
      return {
        base: 545,
        gst: 98,
        total: 643,
        period: 'Latest Report',
        periodLabel: '(Credit Bureau Records till date)',
      };
    default:
      return {
        base: currentAmount,
        gst: 0,
        total: currentAmount,
        period: 'N/A',
        periodLabel: '',
      };
  }
};
