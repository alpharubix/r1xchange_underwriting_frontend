export const MOCK_WALLET_BALANCE = (service: string = 'BSA') => ({
  message: 'Wallet balance fetched successfully',
  data: {
    user_id: 'usr_demo_customer_101',
    service: service.toUpperCase(),
    is_balance_available: true,
    available_balance: 50000,
  },
});

export const MOCK_CREATE_ORDER_RESPONSE = {
  message: 'Payment order created successfully',
  data: {
    user_id: 'usr_demo_customer_101',
    order_id: 'order_demo_771829',
    amount: 150000,
    currency: 'INR',
    service: 'BSA',
  },
};

export const MOCK_VALIDATE_PAYMENT_RESPONSE = {
  message: 'Payment validated successfully',
  data: {
    razorpay_payment_id: 'pay_demo_991823',
    razorpay_order_id: 'order_demo_771829',
    payment_status: 'SUCCESS',
  },
};

export const MOCK_PENDING_PAYMENTS = {
  message: 'Pending payments retrieved successfully',
  data: {
    pending_order: null,
    is_pending_payment_found: false,
  },
};
