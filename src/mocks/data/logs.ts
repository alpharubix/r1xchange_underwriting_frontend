export const MOCK_SYSTEM_LOGS = Array.from({ length: 25 }, (_, i) => {
  const paths = [
    '/v1/user/me',
    '/v1/bsa/overview-monthly-wise',
    '/v1/bsa/bank-accounts',
    '/v1/cibil/overview/CIBIL-REF-2026-88492',
    '/v1/gst/overview',
    '/v1/itr/tax-calculation',
    '/v1/lending/check-eligibility',
    '/v1/wallet/balance/BSA',
  ];
  const methods = ['GET', 'POST', 'GET', 'GET', 'POST', 'GET', 'GET', 'POST'];
  const idx = i % paths.length;
  const now = new Date(Date.now() - i * 3600 * 1000).toISOString();

  return {
    _id: `log_item_${1000 + i}`,
    timestamp: now,
    status: 'SUCCESS',
    request: {
      method: methods[idx],
      path: paths[idx],
      request_id: `req_demo_${5000 + i}`,
      trace_id: `trace_${8000 + i}`,
      request_size_bytes: 256,
      headers: {
        'content-type': 'application/json',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0',
      },
    },
    response: {
      status_code: 200,
      response_size_bytes: 1420 + i * 45,
    },
    user: {
      role: i % 3 === 0 ? 'admin' : i % 2 === 0 ? 'anchor' : 'customer',
      user_id: 'usr_demo_customer_101',
      organization_id: 'org_sharma_trading',
    },
    client: {
      ip_address: '103.22.140.42',
      platform: 'Windows 11',
      user_agent: 'Chrome/122.0.0.0',
    },
    service: {
      service_name: 'underwriting-tool-api',
      revision: 'v1.4.2-demo',
      environment: 'demo-standalone',
      git_commit: 'a1b2c3d4',
    },
    performance: {
      duration_ms: Math.floor(40 + Math.random() * 120),
    },
    error: {
      occurred: false,
    },
  };
});
