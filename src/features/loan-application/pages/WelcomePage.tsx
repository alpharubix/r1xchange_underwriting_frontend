
import { useState, type FormEvent } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  FileCheck2,
  LockKeyhole,
  Sparkles,
  Plus,
  Settings2,
  Pencil,
  Trash2,
  X,
  Power,
} from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';
import type { BankConfig } from '../types';

type CreditStatus = 'Draft' | 'Active' | 'Inactive';
type SecurityType = 'Secured' | 'Unsecured';
type ModalType = 'create' | 'manage' | null;

interface CreditProduct {
  id: string;
  bankCode: string;
  name: string;
  type: string;
  securityType: SecurityType;
  minAmount: number;
  maxAmount: number;
  interestRate: number;
  tenure: number;
  status: CreditStatus;
}

interface CreditForm {
  name: string;
  type: string;
  securityType: SecurityType;
  minAmount: string;
  maxAmount: string;
  interestRate: string;
  tenure: string;
}

const INITIAL_FORM: CreditForm = {
  name: '',
  type: 'Business Loan',
  securityType: 'Secured',
  minAmount: '50000',
  maxAmount: '500000',
  interestRate: '12',
  tenure: '36',
};

const PRODUCT_TYPES = [
  'Business Loan',
  'Supply Chain Finance',
  'Gold Loan',
  'Silver Loan',
  'Personal Loan',
];

const formatCurrency = (amount: number) =>
  `₹${amount.toLocaleString('en-IN')}`;

export function WelcomePage() {
  const { bank } = useOutletContext<{ bank: BankConfig }>();

  const [modal, setModal] = useState<ModalType>(null);
  const [credits, setCredits] = useState<CreditProduct[]>([]);
  const [form, setForm] = useState<CreditForm>(INITIAL_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [formError, setFormError] = useState('');

  const bankCredits = credits.filter(
    (credit) => credit.bankCode === bank.bankCode,
  );

  const filteredCredits = bankCredits.filter(
    (credit) =>
      statusFilter === 'All' || credit.status === statusFilter,
  );

  const activeCount = bankCredits.filter(
    (credit) => credit.status === 'Active',
  ).length;

  const draftCount = bankCredits.filter(
    (credit) => credit.status === 'Draft',
  ).length;

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setEditingId(null);
    setFormError('');
  };

  const closeModal = () => {
    setModal(null);
    resetForm();
  };

  const openCreateModal = () => {
    resetForm();
    setModal('create');
  };

  const openManageModal = () => {
    setStatusFilter('All');
    setModal('manage');
  };

  const saveCredit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');

    const minAmount = Number(form.minAmount);
    const maxAmount = Number(form.maxAmount);
    const interestRate = Number(form.interestRate);
    const tenure = Number(form.tenure);

    if (!form.name.trim()) {
      setFormError('Please enter a product name.');
      return;
    }

    if (
      !Number.isFinite(minAmount) ||
      !Number.isFinite(maxAmount) ||
      minAmount <= 0 ||
      maxAmount < minAmount
    ) {
      setFormError(
        'Enter valid loan amounts. The maximum must be at least the minimum.',
      );
      return;
    }

    if (
      !Number.isFinite(interestRate) ||
      interestRate <= 0 ||
      interestRate > 100
    ) {
      setFormError('Interest rate must be greater than 0 and at most 100%.');
      return;
    }

    if (
      !Number.isInteger(tenure) ||
      tenure < 1 ||
      tenure > 600
    ) {
      setFormError('Tenure must be between 1 and 600 months.');
      return;
    }

    const existing = bankCredits.find(
      (credit) => credit.id === editingId,
    );

    const product: CreditProduct = {
      id: editingId ?? crypto.randomUUID(),
      bankCode: bank.bankCode,
      name: form.name.trim(),
      type: form.type,
      securityType: form.securityType,
      minAmount,
      maxAmount,
      interestRate,
      tenure,
      status: existing?.status ?? 'Draft',
    };

    setCredits((previous) => {
      if (editingId) {
        return previous.map((credit) =>
          credit.id === editingId &&
          credit.bankCode === bank.bankCode
            ? product
            : credit,
        );
      }

      return [...previous, product];
    });

    closeModal();
  };

  const editCredit = (credit: CreditProduct) => {
    if (credit.bankCode !== bank.bankCode) return;

    setEditingId(credit.id);
    setForm({
      name: credit.name,
      type: credit.type,
      securityType: credit.securityType,
      minAmount: String(credit.minAmount),
      maxAmount: String(credit.maxAmount),
      interestRate: String(credit.interestRate),
      tenure: String(credit.tenure),
    });
    setFormError('');
    setModal('create');
  };

  const toggleCreditStatus = (id: string) => {
    setCredits((previous) =>
      previous.map((credit) => {
        if (
          credit.id !== id ||
          credit.bankCode !== bank.bankCode
        ) {
          return credit;
        }

        return {
          ...credit,
          status:
            credit.status === 'Active' ? 'Inactive' : 'Active',
        };
      }),
    );
  };

  const deleteCredit = (credit: CreditProduct) => {
    if (credit.bankCode !== bank.bankCode) return;

    const confirmed = window.confirm(
      `Delete "${credit.name}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setCredits((previous) =>
      previous.filter(
        (item) =>
          !(
            item.id === credit.id &&
            item.bankCode === bank.bankCode
          ),
      ),
    );
  };

  return (
    <>
      <style>{`
        .credit-management {
          margin: 56px 0;
        }

        .credit-management-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 24px;
        }

        .credit-management-heading h2 {
          margin: 8px 0;
          font-size: 28px;
          font-weight: 700;
        }

        .credit-management-heading > div > p:not(.loan-eyebrow) {
          color: #64748b;
          margin: 0;
          line-height: 1.6;
        }

        .credit-count {
          background: #eef2ff;
          color: #4338ca;
          padding: 8px 13px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
        }

        .credit-action-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px;
        }

        .credit-action-card {
          padding: 28px;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          background: #fff;
          transition: transform 180ms ease, box-shadow 180ms ease;
        }

        .credit-action-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.07);
        }

        .credit-action-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: #eef2ff;
          color: #4f46e5;
          margin-bottom: 16px;
        }

        .manage-credit-card .credit-action-icon {
          background: #ecfdf5;
          color: #047857;
        }

        .credit-action-card h3 {
          margin: 0 0 10px;
          font-size: 21px;
          color: #0f172a;
        }

        .credit-action-card > p {
          color: #64748b;
          line-height: 1.7;
          min-height: 54px;
          margin-bottom: 22px;
        }

        .credit-action-card .loan-button,
        .credit-empty-state .loan-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
        }

        .credit-action-card .loan-button-secondary,
        .credit-modal .loan-button-secondary {
          background: #fff;
          color: #334155;
          border: 1px solid #cbd5e1;
        }

        .credit-card-meta {
          display: block;
          margin-top: 14px;
          font-size: 12px;
          color: #64748b;
        }

        .credit-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          background: rgba(15, 23, 42, 0.58);
          backdrop-filter: blur(4px);
          overflow-y: auto;
        }

        .credit-modal {
          width: 100%;
          max-width: 720px;
          max-height: calc(100dvh - 40px);
          overflow-y: auto;
          background: #fff;
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.2);
          animation: credit-modal-enter 180ms ease-out;
          color: #0f172a;
        }

        @keyframes credit-modal-enter {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.99);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .credit-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          padding-bottom: 22px;
          border-bottom: 1px solid #e2e8f0;
        }

        .credit-modal-header h2 {
          margin: 8px 0 0;
          font-size: 25px;
        }

        .credit-icon-button {
          display: grid;
          place-items: center;
          width: 38px;
          height: 38px;
          flex-shrink: 0;
          border: 1px solid #e2e8f0;
          background: #fff;
          color: #475569;
          border-radius: 10px;
          cursor: pointer;
        }

        .credit-form {
          padding-top: 22px;
        }

        .credit-form label {
          display: flex;
          flex-direction: column;
          gap: 8px;
          color: #334155;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 18px;
        }

        .credit-form input,
        .credit-form select,
        .credit-manage-toolbar select {
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
          padding: 12px;
          border: 1px solid #cbd5e1;
          border-radius: 9px;
          background: #fff;
          color: #0f172a;
          font: inherit;
          outline: none;
        }

        .credit-form input:focus,
        .credit-form select:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
        }

        .credit-form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0 18px;
        }

        .credit-form-error {
          padding: 12px;
          margin: 0 0 18px;
          border-radius: 9px;
          color: #b91c1c;
          background: #fef2f2;
          font-size: 13px;
        }

        .credit-modal-footer {
          display: flex;
          justify-content: flex-end;
          flex-wrap: wrap;
          gap: 12px;
          border-top: 1px solid #e2e8f0;
          padding-top: 20px;
          margin-top: 8px;
        }

        .credit-manage-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin: 20px 0;
          color: #64748b;
          font-size: 13px;
        }

        .credit-manage-toolbar select {
          width: auto;
          max-width: 180px;
        }

        .credit-product-list {
          display: grid;
          gap: 16px;
        }

        .credit-product-item {
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 20px;
        }

        .credit-product-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .credit-product-top h3 {
          margin: 0 0 6px;
          color: #0f172a;
          font-size: 17px;
        }

        .credit-product-top p {
          margin: 0;
          color: #64748b;
          font-size: 13px;
        }

        .credit-status {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
        }

        .credit-status-active {
          background: #dcfce7;
          color: #166534;
        }

        .credit-status-draft {
          background: #fef3c7;
          color: #92400e;
        }

        .credit-status-inactive {
          background: #f1f5f9;
          color: #475569;
        }

        .credit-product-details {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          padding: 20px 0;
          margin-top: 18px;
          border-top: 1px solid #f1f5f9;
          border-bottom: 1px solid #f1f5f9;
        }

        .credit-product-details div {
          display: flex;
          flex-direction: column;
          gap: 7px;
          min-width: 0;
        }

        .credit-product-details span {
          color: #64748b;
          font-size: 11px;
        }

        .credit-product-details strong {
          color: #0f172a;
          font-size: 13px;
          overflow-wrap: anywhere;
        }

        .credit-product-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 16px;
        }

        .credit-small-button {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 10px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #fff;
          color: #334155;
          font-size: 12px;
          cursor: pointer;
        }

        .credit-small-button:hover,
        .credit-icon-button:hover {
          background: #f8fafc;
        }

        .credit-delete-button {
          color: #dc2626;
        }

        .credit-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 44px 16px;
          color: #64748b;
        }

        .credit-empty-state h3 {
          color: #0f172a;
          margin: 14px 0 6px;
        }

        .credit-empty-state p {
          margin-bottom: 20px;
        }

        @media (max-width: 640px) {
          .credit-management-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .credit-action-grid {
            grid-template-columns: 1fr;
          }

          .credit-action-card {
            padding: 22px;
          }

          .credit-form-grid {
            grid-template-columns: 1fr;
          }

          .credit-modal {
            padding: 20px;
          }

          .credit-product-details {
            grid-template-columns: 1fr;
          }

          .credit-manage-toolbar {
            align-items: flex-start;
            flex-direction: column;
          }

          .credit-manage-toolbar select {
            width: 100%;
            max-width: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .credit-action-card,
          .credit-modal {
            animation: none;
            transition: none;
          }
        }
      `}</style>

      <div className="loan-breadcrumb">
        <span>{bank.bankName}</span>
        <ChevronRight size={15} aria-hidden="true" />
        <span>Loan application</span>
      </div>

      <section className="loan-hero">
        <div className="loan-hero-copy">
          <p className="loan-eyebrow">
            <Sparkles size={15} aria-hidden="true" />
            A clearer way to borrow
          </p>

          <h1>Welcome to {bank.bankName}</h1>

          <p className="loan-hero-subtitle">
            Find the right loan for your needs with a simple and
            transparent application process.
          </p>

          <p className="loan-bank-message">{bank.welcomeMessage}</p>

          <Link
            className="loan-button loan-button-primary loan-apply-button"
            to={`/bank/${bank.bankCode}/apply/products`}
          >
            Apply for Loan
            <ArrowRight size={18} aria-hidden="true" />
          </Link>

          <p className="loan-no-obligation">
            Explore your options. No commitment at this stage.
          </p>
        </div>

        <div
          className="loan-hero-visual"
          aria-label="Illustration of a loan application"
        >
          <div className="loan-visual-orbit loan-orbit-one" />
          <div className="loan-visual-orbit loan-orbit-two" />

          <div className="loan-visual-card">
            <div className="loan-visual-card-header">
              <span className="loan-visual-logo">
                <FileCheck2 size={20} aria-hidden="true" />
              </span>

              <span>
                <strong>Loan application</strong>
                <small>Designed around you</small>
              </span>

              <BadgeCheck
                className="loan-visual-check"
                size={21}
                aria-hidden="true"
              />
            </div>

            <div className="loan-visual-row">
              <span>Choose a product</span>
              <span className="loan-visual-line" />
            </div>

            <div className="loan-visual-row">
              <span>Review your options</span>
              <span className="loan-visual-line short" />
            </div>

            <div className="loan-visual-bottom">
              <span>
                <LockKeyhole size={14} aria-hidden="true" />
                Secure by design
              </span>
              <span className="loan-visual-status">Getting started</span>
            </div>
          </div>

          <div
            className="loan-visual-accent loan-accent-one"
            aria-hidden="true"
          />
          <div
            className="loan-visual-accent loan-accent-two"
            aria-hidden="true"
          />
        </div>
      </section>

      {/* Bank credit management */}
      <section className="credit-management">
        <div className="credit-management-heading">
          <div>
            <p className="loan-eyebrow">Bank administration</p>
            <h2>Credit Management</h2>
            <p>
              Create and manage the credit products offered by{' '}
              {bank.bankName}.
            </p>
          </div>

          <span className="credit-count">
            {bankCredits.length}{' '}
            {bankCredits.length === 1 ? 'product' : 'products'}
          </span>
        </div>

        <div className="credit-action-grid">
          <article className="credit-action-card create-credit-card">
            <div className="credit-action-icon">
              <Plus size={25} aria-hidden="true" />
            </div>

            <h3>Create Credit</h3>

            <p>
              Configure a new loan product, define its limits, set
              interest rates, and manage its availability.
            </p>

            <button
              type="button"
              className="loan-button loan-button-primary"
              onClick={openCreateModal}
            >
              Create New Credit
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          </article>

          <article className="credit-action-card manage-credit-card">
            <div className="credit-action-icon">
              <Settings2 size={25} aria-hidden="true" />
            </div>

            <h3>Manage Credit</h3>

            <p>
              View existing products, update their configuration, and
              control whether they are active.
            </p>

            <button
              type="button"
              className="loan-button loan-button-secondary"
              onClick={openManageModal}
            >
              Manage Products
              <ChevronRight size={17} aria-hidden="true" />
            </button>

            <span className="credit-card-meta">
              {activeCount} active · {draftCount} drafts
            </span>
          </article>
        </div>
      </section>

      {/* Existing benefits section */}
      <section className="loan-benefits" aria-labelledby="benefits-heading">
        <div className="loan-section-heading">
          <p className="loan-eyebrow">Built for clarity</p>
          <h2 id="benefits-heading">
            A straightforward way to get started
          </h2>
          <p>Know what to expect at each step of your application.</p>
        </div>

        <div className="loan-benefit-grid">
          <article className="loan-benefit">
            <span className="loan-benefit-icon">
              <ArrowRight size={21} aria-hidden="true" />
            </span>
            <h3>Simple application process</h3>
            <p>Move through a clear set of steps at your own pace.</p>
          </article>

          <article className="loan-benefit">
            <span className="loan-benefit-icon">
              <BadgeCheck size={21} aria-hidden="true" />
            </span>
            <h3>Transparent assessment</h3>
            <p>
              Understand the information needed to assess your eligibility.
            </p>
          </article>

          <article className="loan-benefit">
            <span className="loan-benefit-icon">
              <LockKeyhole size={21} aria-hidden="true" />
            </span>
            <h3>Information handled securely</h3>
            <p>
              Your application details are treated with care and protection.
            </p>
          </article>
        </div>
      </section>

      {/* Credit modals */}
      {modal && (
        <div
          className="credit-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <section
            className="credit-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="credit-modal-title"
          >
            <header className="credit-modal-header">
              <div>
                <p className="loan-eyebrow">{bank.bankName}</p>
                <h2 id="credit-modal-title">
                  {modal === 'create'
                    ? editingId
                      ? 'Edit Credit Product'
                      : 'Create Credit'
                    : 'Manage Credit Products'}
                </h2>
              </div>

              <button
                type="button"
                className="credit-icon-button"
                aria-label="Close modal"
                onClick={closeModal}
              >
                <X size={21} aria-hidden="true" />
              </button>
            </header>

            {modal === 'create' ? (
              <form className="credit-form" onSubmit={saveCredit}>
                <label>
                  Product Name
                  <input
                    required
                    maxLength={100}
                    value={form.name}
                    placeholder="e.g. Business Growth Loan"
                    onChange={(event) =>
                      setForm({ ...form, name: event.target.value })
                    }
                  />
                </label>

                <div className="credit-form-grid">
                  <label>
                    Product Type
                    <select
                      value={form.type}
                      onChange={(event) =>
                        setForm({ ...form, type: event.target.value })
                      }
                    >
                      {PRODUCT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Security Type
                    <select
                      value={form.securityType}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          securityType: event.target.value as SecurityType,
                        })
                      }
                    >
                      <option value="Secured">Secured</option>
                      <option value="Unsecured">Unsecured</option>
                    </select>
                  </label>

                  <label>
                    Minimum Amount (₹)
                    <input
                      type="number"
                      min="1"
                      required
                      value={form.minAmount}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          minAmount: event.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Maximum Amount (₹)
                    <input
                      type="number"
                      min="1"
                      required
                      value={form.maxAmount}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          maxAmount: event.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Annual Interest Rate (%)
                    <input
                      type="number"
                      min="0.01"
                      max="100"
                      step="0.01"
                      required
                      value={form.interestRate}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          interestRate: event.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Tenure (months)
                    <input
                      type="number"
                      min="1"
                      max="600"
                      step="1"
                      required
                      value={form.tenure}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          tenure: event.target.value,
                        })
                      }
                    />
                  </label>
                </div>

                {formError && (
                  <p className="credit-form-error" role="alert">
                    {formError}
                  </p>
                )}

                <div className="credit-modal-footer">
                  <button
                    type="button"
                    className="loan-button loan-button-secondary"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="loan-button loan-button-primary"
                  >
                    {editingId ? 'Save Changes' : 'Save as Draft'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="credit-manage-content">
                <div className="credit-manage-toolbar">
                  <span>
                    {filteredCredits.length}{' '}
                    {filteredCredits.length === 1 ? 'product' : 'products'} found
                  </span>

                  <select
                    aria-label="Filter products by status"
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value)
                    }
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {filteredCredits.length === 0 ? (
                  <div className="credit-empty-state">
                    <Settings2 size={34} aria-hidden="true" />

                    <h3>No credit products found</h3>

                    <p>
                      Create your first credit product to manage it here.
                    </p>

                    <button
                      type="button"
                      className="loan-button loan-button-primary"
                      onClick={openCreateModal}
                    >
                      <Plus size={17} aria-hidden="true" />
                      Create Credit
                    </button>
                  </div>
                ) : (
                  <div className="credit-product-list">
                    {filteredCredits.map((credit) => (
                      <article
                        className="credit-product-item"
                        key={`${credit.bankCode}-${credit.id}`}
                      >
                        <div className="credit-product-top">
                          <div>
                            <h3>{credit.name}</h3>
                            <p>
                              {credit.type} · {credit.securityType}
                            </p>
                          </div>

                          <span
                            className={`credit-status credit-status-${credit.status.toLowerCase()}`}
                          >
                            {credit.status}
                          </span>
                        </div>

                        <div className="credit-product-details">
                          <div>
                            <span>Loan range</span>
                            <strong>
                              {formatCurrency(credit.minAmount)}
                              {' – '}
                              {formatCurrency(credit.maxAmount)}
                            </strong>
                          </div>

                          <div>
                            <span>Interest rate</span>
                            <strong>{credit.interestRate}% p.a.</strong>
                          </div>

                          <div>
                            <span>Maximum tenure</span>
                            <strong>{credit.tenure} months</strong>
                          </div>
                        </div>

                        <div className="credit-product-actions">
                          <button
                            type="button"
                            className="credit-small-button"
                            onClick={() => editCredit(credit)}
                          >
                            <Pencil size={15} aria-hidden="true" />
                            Edit
                          </button>

                          <button
                            type="button"
                            className="credit-small-button"
                            onClick={() => toggleCreditStatus(credit.id)}
                          >
                            <Power size={15} aria-hidden="true" />
                            {credit.status === 'Active'
                              ? 'Deactivate'
                              : 'Activate'}
                          </button>

                          <button
                            type="button"
                            className="credit-small-button credit-delete-button"
                            onClick={() => deleteCredit(credit)}
                          >
                            <Trash2 size={15} aria-hidden="true" />
                            Delete
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}

export default WelcomePage;
