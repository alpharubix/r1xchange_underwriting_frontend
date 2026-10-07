export interface MockUser {
  _id: string;
  user_id: string;
  customer_name: string;
  company_name: string;
  email_id: string;
  phone: string;
  gst_number: string;
  role: string;
  login_id?: string;
  anchor_name?: string;
  created_at: string;
  status: string;
}

export const MOCK_CUSTOMER_USER: MockUser = {
  _id: 'usr_demo_customer_101',
  user_id: 'usr_demo_customer_101',
  customer_name: 'Rajesh Sharma',
  company_name: 'Sharma Trading & Logistics Co.',
  email_id: 'demo@sharmatrading.com',
  phone: '+91 98201 54321',
  gst_number: '27AABCS1429B1Z2',
  role: 'customer',
  created_at: '2024-01-15T10:30:00Z',
  status: 'ACTIVE',
};

export const MOCK_ANCHOR_USER: MockUser = {
  _id: 'usr_demo_anchor_202',
  user_id: 'usr_demo_anchor_202',
  customer_name: 'Sharma Enterprise Anchor',
  anchor_name: 'Sharma Enterprise Anchor',
  company_name: 'Sharma Logistics Anchor Group',
  email_id: 'anchor@sharmatrading.com',
  phone: '+91 98201 98765',
  gst_number: '27AABCS1429B1Z2',
  role: 'anchor',
  login_id: 'anchor_demo',
  created_at: '2023-11-20T08:15:00Z',
  status: 'ACTIVE',
};

export const MOCK_ADMIN_USER: MockUser = {
  _id: 'usr_demo_admin_303',
  user_id: 'usr_demo_admin_303',
  customer_name: 'System Administrator',
  company_name: 'CRISP Financial Platform',
  email_id: 'admin@crisp.example',
  phone: '+91 99999 00000',
  gst_number: '27AAAAA0000A1Z5',
  role: 'admin',
  login_id: 'admin_demo',
  created_at: '2023-01-01T00:00:00Z',
  status: 'ACTIVE',
};

export const MOCK_USERS_LIST = [
  MOCK_CUSTOMER_USER,
  {
    _id: 'usr_demo_102',
    user_id: 'usr_demo_102',
    customer_name: 'Anita Verma',
    company_name: 'Verma Electronics Pvt Ltd',
    email_id: 'anita@vermaelec.com',
    phone: '+91 98765 43210',
    gst_number: '27AAACV5678D1Z9',
    role: 'customer',
    created_at: '2024-02-10T14:20:00Z',
    status: 'ACTIVE',
  },
  {
    _id: 'usr_demo_103',
    user_id: 'usr_demo_103',
    customer_name: 'Vikram Mehta',
    company_name: 'Mehta Textile Mills',
    email_id: 'vikram@mehtatextiles.com',
    phone: '+91 98111 22233',
    gst_number: '27AAACM1234E1Z4',
    role: 'customer',
    created_at: '2024-03-05T09:45:00Z',
    status: 'ACTIVE',
  },
  {
    _id: 'usr_demo_104',
    user_id: 'usr_demo_104',
    customer_name: 'Suresh Patel',
    company_name: 'Patel Agro Industries',
    email_id: 'suresh@patelagro.com',
    phone: '+91 97222 33344',
    gst_number: '24AAACP4321F1Z1',
    role: 'customer',
    created_at: '2024-03-18T11:10:00Z',
    status: 'ACTIVE',
  },
];

export const MOCK_ADMINS_LIST = [
  MOCK_ADMIN_USER,
  {
    _id: 'usr_demo_admin_304',
    user_id: 'usr_demo_admin_304',
    customer_name: 'Priya Sundaram',
    email_id: 'priya.s@crisp.example',
    role: 'admin',
    created_at: '2023-05-12T10:00:00Z',
    status: 'ACTIVE',
  },
];

export const MOCK_ANCHORS_LIST = [
  MOCK_ANCHOR_USER,
  {
    _id: 'usr_demo_anchor_203',
    user_id: 'usr_demo_anchor_203',
    customer_name: 'Global Supply Chain Anchor',
    anchor_name: 'Global Supply Chain Anchor',
    company_name: 'Global Supply Chain Ltd',
    email_id: 'anchor.global@example.com',
    login_id: 'global_anchor',
    role: 'anchor',
    created_at: '2023-09-01T12:00:00Z',
    status: 'ACTIVE',
  },
];

export const MOCK_ASSOCIATED_ANCHORS = [
  {
    _id: 'usr_demo_anchor_202',
    anchor_name: 'Sharma Enterprise Anchor',
    company_name: 'Sharma Logistics Anchor Group',
    email_id: 'anchor@sharmatrading.com',
  },
  {
    _id: 'usr_demo_anchor_203',
    anchor_name: 'Global Supply Chain Anchor',
    company_name: 'Global Supply Chain Ltd',
    email_id: 'anchor.global@example.com',
  },
];
