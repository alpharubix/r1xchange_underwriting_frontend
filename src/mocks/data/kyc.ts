export const MOCK_KYC_AADHAAR_OTP = {
  aadhaar_number: 'XXXX-XXXX-4582',
  reference_id: 'AADHAAR-REF-8849201',
};

export const MOCK_KYC_AADHAAR_DETAILS = {
  name: 'Rajesh Sharma',
  dob: '15/06/1982',
  gender: 'MALE',
  aadhaar_number: 'XXXX-XXXX-4582',
  address: {
    house: '402',
    street: 'Bandra Kurla Complex',
    loc: 'Bandra East',
    vtc: 'Mumbai',
    dist: 'Mumbai Suburban',
    state: 'Maharashtra',
    pc: '400051',
  },
  verification_status: 'VERIFIED',
};

export const MOCK_DIGILOCKER_SESSION = {
  kyc_flow_id: 'DIGI-FLOW-2026-99120',
  digilocker_url: 'https://digilocker.gov.in/public/oauth2/1/authorize',
  kyc_url: 'https://digilocker.gov.in/public/oauth2/1/authorize',
  session_status: 'COMPLETED',
};

export const MOCK_DIGILOCKER_DOCUMENTS = [
  {
    documentType: 'PAN Card',
    documentFormat: 'pdf',
    documentUri: 'in.gov.pan-AABCS1429B',
    documentUrl: 'https://digilocker.gov.in/doc/pan-preview.pdf',
  },
  {
    documentType: 'Aadhaar Card',
    documentFormat: 'pdf',
    documentUri: 'in.gov.uidai-4582',
    documentUrl: 'https://digilocker.gov.in/doc/aadhaar-preview.pdf',
  },
  {
    documentType: 'GST Registration Certificate (Form GST REG-06)',
    documentFormat: 'pdf',
    documentUri: 'in.gov.gstin-27AABCS1429B1Z2',
    documentUrl: 'https://digilocker.gov.in/doc/gst-certificate.pdf',
  },
];
