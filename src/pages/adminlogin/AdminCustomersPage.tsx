import { useState, useMemo, type MouseEvent } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Users,
  Check,
  Copy,
  Pin,
  X,
  Activity,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { toast } from '@/lib/toast';
import { getUsersList, extractPaginatedData } from '@/api/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ServiceReport from './ServiceReport';
import { type CustomerDetailRecord } from './AdminAnchorsPage';


const findAccountId = (user: any, index: number): string => {
  if (!user) return `ACC-${100 + index}`;
  return (
    user._id ||
    user.id ||
    user.cust_id ||
    user.customer_id ||
    user.customerId ||
    user.user_id ||
    user.userId ||
    user.account_id ||
    user.accountId ||
    user.accountid ||
    `ACC-${100 + index}`
  );
};

const TEST_ACCOUNT_ID = '69e539ec4a74da6067477c22';



const getFlagValue = (userObj: any, baseKey: string): boolean => {
  if (!userObj) return false;
  const keys = Object.keys(userObj);
  const searchKey = baseKey.toLowerCase();

  const matchedKey = keys.find((k) => {
    const lk = k.toLowerCase();
    return (
      lk === searchKey ||
      lk === `is_${searchKey}` ||
      lk === `${searchKey}_status` ||
      lk === `${searchKey}status` ||
      lk === `is${searchKey}` ||
      lk === `${searchKey}_completed` ||
      lk === `is_${searchKey}_completed` ||
      lk === `${searchKey}_uploaded` ||
      lk === `is_${searchKey}_uploaded` ||
      lk === `${searchKey}uploaded`
    );
  });

  if (matchedKey !== undefined) {
    const val = userObj[matchedKey];
    if (typeof val === 'string') {
      const lowerVal = val.toLowerCase();
      if (
        lowerVal === 'true' ||
        lowerVal === 'completed' ||
        lowerVal === 'success' ||
        lowerVal === 'active' ||
        lowerVal === '1'
      ) {
        return true;
      }
      if (
        lowerVal === 'false' ||
        lowerVal === 'failed' ||
        lowerVal === 'pending' ||
        lowerVal === '0'
      ) {
        return false;
      }
    }
    if (typeof val === 'number') {
      return val === 1;
    }
    if (typeof val === 'boolean') {
      return val;
    }
    return Boolean(val);
  }
  return false;
};

const findLastLoginValue = (user: any): string => {
  if (!user) return '-';
  const keys = Object.keys(user);
  for (const key of keys) {
    const lowerKey = key.toLowerCase();
    if (
      (lowerKey.includes('login') || lowerKey.includes('active')) &&
      (lowerKey.includes('at') || lowerKey.includes('time') || lowerKey.includes('date') || lowerKey.includes('dt'))
    ) {
      const val = user[key];
      if (val !== null && val !== undefined && val !== '') return String(val);
    }
  }
  return '-';
};

export default function AdminCustomersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [copiedCustomerId, setCopiedCustomerId] = useState<string | null>(null);
  const customerIdParam = searchParams.get('customerId');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedServiceFilters, setSelectedServiceFilters] = useState<
    Array<'bsa' | 'gst' | 'itr' | 'cibil'>
  >([]);
  const [includeNoReports, setIncludeNoReports] = useState(false);

  const { data: fetchedData, isLoading } = useQuery({
    queryKey: ['admin', 'all-customers-list'],
    queryFn: async () => {
      const requestLimit = 1000;
      const firstResponse = await getUsersList({ page: 1, limit: requestLimit });
      const firstPage = extractPaginatedData<any>(firstResponse, 1, requestLimit);

      if (!firstPage.is_server_paginated || firstPage.total_pages <= 1) {
        return firstPage.items;
      }

      const allUsers = [...firstPage.items];
      for (let firstPageToLoad = 2; firstPageToLoad <= firstPage.total_pages; firstPageToLoad += 5) {
        const pageNumbers = Array.from(
          { length: Math.min(5, firstPage.total_pages - firstPageToLoad + 1) },
          (_, index) => firstPageToLoad + index
        );
        const pages = await Promise.all(
          pageNumbers.map(async (page) => {
            const response = await getUsersList({ page, limit: requestLimit });
            return extractPaginatedData<any>(response, page, requestLimit).items;
          })
        );
        allUsers.push(...pages.flat());
      }

      return allUsers;
    },
  });

  const customersList = useMemo(() => {
    return (fetchedData || []).map((user: any, index: number) => ({
        accountid: findAccountId(user, index),
        customername:
          user.customername ||
          user.customer_name ||
          user.customerName ||
          user.name ||
          user.username ||
          '',
        companyname:
          user.companyname ||
          user.company_name ||
          user.companyName ||
          '',
        emailid:
          user.emailid ||
          user.email_id ||
          user.emailId ||
          user.email ||
          '',
        emailverified: Boolean(
          user.emailverified ?? user.email_verified ?? user.emailVerified
        ),
        phone:
          user.phone ||
          user.phone_no ||
          user.phoneNo ||
          user.phoneNumber ||
          '',
        phoneverified: Boolean(
          user.phoneverified ?? user.phone_verified ?? user.phoneVerified
        ),
        gstnumber:
          user.gstnumber ||
          user.gst_number ||
          user.gstNumber ||
          user.gst_no ||
          user.gstNo ||
          user.gst ||
          '',
        status:
          String(user.status || '').toLowerCase() === 'active' ||
          user.status === true
            ? 'Active'
            : 'Inactive',
        role: user.role || 'USER',
        createat:
          user.createat ||
          user.created_at ||
          user.createAt ||
          user.createdAt ||
          '',
        updatedat:
          user.updatedat ||
          user.updated_at ||
          user.updatedAt ||
          '',
        lastloginat: findLastLoginValue(user),
        secondarygstlist: Array.isArray(user.secondary_gst_list)
          ? user.secondary_gst_list.join(', ')
          : user.secondarygstlist ||
            user.secondary_gst_list ||
            '',
        anchor_id: user.anchor_id ? String(user.anchor_id) : '',
        anchor_code: user.anchor_code || user.anchorCode || user.site_code || '',
        bsa: getFlagValue(user, 'bsa'),
        gst: getFlagValue(user, 'gst'),
        itr: getFlagValue(user, 'itr'),
        cibil: getFlagValue(user, 'cibil'),
        raw: user,
      }));
  }, [fetchedData]);

  // Filter input states
  const [filterAccId, setFilterAccId] = useState('');
  const [filterCustomerName, setFilterCustomerName] = useState('');
  const [filterEmailId, setFilterEmailId] = useState('');
  const [filterPhone, setFilterPhone] = useState('');
  const [filterCompanyName, setFilterCompanyName] = useState('');
  const [filterGstNumber, setFilterGstNumber] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAnchorId, setFilterAnchorId] = useState('');

  // Selected customer for detail view
  const selectedCustomer = useMemo(() => {
    if (!customerIdParam) return null;
    return (
      customersList.find(
        (c) =>
          c.accountid === customerIdParam ||
          (c.raw && String(c.raw._id) === customerIdParam) ||
          c.customername.toLowerCase() === customerIdParam.toLowerCase()
      ) || null
    );
  }, [customerIdParam, customersList]);

  const handleSelectCustomer = (cust: CustomerDetailRecord) => {
    setSearchParams(
      (prev) => {
        prev.set('customerId', cust.accountid);
        return prev;
      },
      { replace: false }
    );
  };

  const handleBackToCustomers = () => {
    setSearchParams(
      (prev) => {
        prev.delete('customerId');
        return prev;
      },
      { replace: false }
    );
  };

  // Live client-side filters on current page or server-backed items
  const filteredList = useMemo(() => {
    return customersList.filter((item) => {
      const matchAccId = filterAccId
        ? item.accountid.toLowerCase().includes(filterAccId.toLowerCase())
        : true;
      const matchCustomerName = filterCustomerName
        ? item.customername.toLowerCase().includes(filterCustomerName.toLowerCase())
        : true;
      const matchEmail = filterEmailId
        ? item.emailid.toLowerCase().includes(filterEmailId.toLowerCase())
        : true;
      const matchPhone = filterPhone
        ? item.phone.toLowerCase().includes(filterPhone.toLowerCase())
        : true;
      const matchCompanyName = filterCompanyName
        ? item.companyname.toLowerCase().includes(filterCompanyName.toLowerCase())
        : true;
      const matchGstNumber = filterGstNumber
        ? item.gstnumber.toLowerCase().includes(filterGstNumber.toLowerCase())
        : true;
      const matchStatus =
        filterStatus !== 'all'
          ? item.status.toLowerCase() === filterStatus.toLowerCase()
          : true;
      const matchAnchor = filterAnchorId
        ? (item.anchor_id || '').toLowerCase().includes(filterAnchorId.toLowerCase())
        : true;
      const hasAnyReport = Boolean(item.bsa || item.gst || item.itr || item.cibil);
      const matchesSelectedService = selectedServiceFilters.every(
        (service) => item[service]
      );
      const matchReports = includeNoReports
        ? !hasAnyReport
        : selectedServiceFilters.length > 0
          ? matchesSelectedService
          : hasAnyReport;

      return (
        matchAccId &&
        matchCustomerName &&
        matchEmail &&
        matchPhone &&
        matchCompanyName &&
        matchGstNumber &&
        matchStatus &&
        matchAnchor &&
        matchReports
      );
    });
  }, [
    customersList,
    filterAccId,
    filterCustomerName,
    filterEmailId,
    filterPhone,
    filterCompanyName,
    filterGstNumber,
    filterStatus,
    filterAnchorId,
    selectedServiceFilters,
    includeNoReports,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredList.length / pageSize));
  const totalRecords = filteredList.length;
  const activeCustomerFilterCount =
    [
      filterAccId,
      filterCustomerName,
      filterEmailId,
      filterPhone,
      filterCompanyName,
      filterGstNumber,
      filterAnchorId,
    ].filter((value) => value.trim()).length +
    Number(filterStatus !== 'all') +
    selectedServiceFilters.length +
    Number(includeNoReports);

  const getTextFilterClass = (isActive: boolean) =>
    `h-10 text-xs rounded-xl transition-all duration-200 ${
      isActive
        ? 'border-[#000080] bg-blue-50/70 text-[#000080] shadow-sm ring-2 ring-blue-100'
        : 'bg-slate-50 border-slate-200 focus:bg-white'
    }`;

  const paginatedList = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredList.slice(startIndex, startIndex + pageSize);
  }, [filteredList, currentPage, pageSize]);

  const toggleServiceFilter = (service: 'bsa' | 'gst' | 'itr' | 'cibil') => {
    setIncludeNoReports(false);
    const isSelected = selectedServiceFilters.includes(service);
    const nextFilters = isSelected
      ? selectedServiceFilters.filter((selected) => selected !== service)
      : [...selectedServiceFilters, service];
    setSelectedServiceFilters(nextFilters);
    setCurrentPage(1);
    toast.info(
      nextFilters.length > 0
        ? `Customers must have all selected reports: ${nextFilters.map((item) => item.toUpperCase()).join(', ')}.`
        : 'Showing customers with at least one analyzed report.'
    );
  };

  const notifyTextFilter = (label: string, value: string) => {
    if (value.trim()) {
      toast.info(`Customer records are now filtered by ${label}.`);
    }
  };

  const handleCopyCustomerId = async (
    event: MouseEvent<HTMLButtonElement>,
    customerId: string
  ) => {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(customerId);
      setCopiedCustomerId(customerId);
      toast.success('User ID copied to clipboard.');
      window.setTimeout(() => setCopiedCustomerId(null), 2000);
    } catch (error) {
      toast.error('Unable to copy User ID to clipboard.');
      console.error('Failed to copy customer User ID:', error);
    }
  };

  // If a customer is selected, show ServiceReport View
  if (selectedCustomer) {
    const customerForServiceReport = {
      id: selectedCustomer.accountid,
      name: selectedCustomer.customername || `Customer ${selectedCustomer.accountid}`,
      customer_name: selectedCustomer.customername,
      phone: selectedCustomer.phone,
      phone_no: selectedCustomer.phone,
      company_name: selectedCustomer.companyname,
      gst_no: selectedCustomer.gstnumber,
      status: selectedCustomer.status,
      bsa: selectedCustomer.bsa,
      gst: selectedCustomer.gst,
      itr: selectedCustomer.itr,
      cibil: selectedCustomer.cibil,
      anchor_code: selectedCustomer.anchor_code,
      anchor_id: selectedCustomer.anchor_id,
      created_by: selectedCustomer.raw?.created_by,
      updated_by: selectedCustomer.raw?.updated_by,
    };

    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f4f6f9]">
        {/* Breadcrumb Navigation Header */}
        <div className="bg-white border-b border-slate-200 px-8 py-3.5 shrink-0 flex items-center gap-2 text-xs font-semibold text-slate-500 overflow-x-auto">
          <button
            onClick={handleBackToCustomers}
            className="hover:text-[#000080] transition-colors cursor-pointer"
          >
            Customers
          </button>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <button
            onClick={handleBackToCustomers}
            className="hover:text-[#000080] transition-colors cursor-pointer"
          >
             Customers List
          </button>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold">
            {customerForServiceReport.name} (Service Report)
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <ServiceReport
            selectedCustomer={customerForServiceReport}
            onBack={handleBackToCustomers}
          />
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#f4f6f9]">
      {/* Top Header */}
      <header className="flex items-center justify-between bg-white px-8 py-5 border-b border-slate-200 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            CRISP ADMIN PORTAL
          </h1>
          <p className="text-sm text-slate-500 font-semibold mt-0.5">
             Customers List — View and manage all underwriting customer profiles.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-xl">
            <Users className="h-4 w-4 text-[#000080]" />
            <span className="text-xs font-bold text-[#000080]">
              Total Customers : {totalRecords} 
            </span>
          </div>
        </div>
      </header>

      {/* Body Container */}
      <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="h-5 w-5 text-[#000080]" />
              Customers List
              {activeCustomerFilterCount > 0 && (
                <motion.span
                  key={activeCustomerFilterCount}
                  initial={{ opacity: 0, scale: 0.8, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#000080]"
                  title="Customer filters are applied"
                  aria-label="Customer filters are applied"
                >
                  <Pin className="h-3 w-3 fill-current" />
                  {activeCustomerFilterCount} filter{activeCustomerFilterCount === 1 ? '' : 's'} applied
                </motion.span>
              )}
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Showing page {currentPage} of {totalPages}
            </p>
          </div>

          {/* ─── FILTERS ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {/* Account ID Filter */}
            <div className="space-y-1">
              <Label htmlFor="f-acc-id" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                User ID
              </Label>
              <Input
                id="f-acc-id"
                placeholder="User ID"
                value={filterAccId}
                onChange={(e) => {
                  setFilterAccId(e.target.value);
                  setCurrentPage(1);
                }}
                onBlur={(e) => notifyTextFilter('User ID', e.target.value)}
                className={getTextFilterClass(Boolean(filterAccId.trim()))}
              />
            </div>

            {/* Customer Name Filter */}
            <div className="space-y-1">
              <Label htmlFor="f-cust-name" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Customer Name
              </Label>
              <Input
                id="f-cust-name"
                placeholder="Name"
                value={filterCustomerName}
                onChange={(e) => {
                  setFilterCustomerName(e.target.value);
                  setCurrentPage(1);
                }}
                onBlur={(e) => notifyTextFilter('customer name', e.target.value)}
                className={getTextFilterClass(Boolean(filterCustomerName.trim()))}
              />
            </div>

            {/* Email Filter */}
            <div className="space-y-1">
              <Label htmlFor="f-email" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Email
              </Label>
              <Input
                id="f-email"
                placeholder="Email ID"
                value={filterEmailId}
                onChange={(e) => {
                  setFilterEmailId(e.target.value);
                  setCurrentPage(1);
                }}
                onBlur={(e) => notifyTextFilter('email', e.target.value)}
                className={getTextFilterClass(Boolean(filterEmailId.trim()))}
              />
            </div>

            {/* Phone Filter */}
            <div className="space-y-1">
              <Label htmlFor="f-phone" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Phone
              </Label>
              <Input
                id="f-phone"
                placeholder="Phone No"
                value={filterPhone}
                onChange={(e) => {
                  setFilterPhone(e.target.value);
                  setCurrentPage(1);
                }}
                onBlur={(e) => notifyTextFilter('phone', e.target.value)}
                className={getTextFilterClass(Boolean(filterPhone.trim()))}
              />
            </div>

            {/* Company Name Filter */}
            <div className="space-y-1">
              <Label htmlFor="f-company" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Company
              </Label>
              <Input
                id="f-company"
                placeholder="Company"
                value={filterCompanyName}
                onChange={(e) => {
                  setFilterCompanyName(e.target.value);
                  setCurrentPage(1);
                }}
                onBlur={(e) => notifyTextFilter('company name', e.target.value)}
                className={getTextFilterClass(Boolean(filterCompanyName.trim()))}
              />
            </div>

            {/* GST Number Filter */}
            <div className="space-y-1">
              <Label htmlFor="f-gst" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                GST Number
              </Label>
              <Input
                id="f-gst"
                placeholder="GSTIN"
                value={filterGstNumber}
                onChange={(e) => {
                  setFilterGstNumber(e.target.value);
                  setCurrentPage(1);
                }}
                onBlur={(e) => notifyTextFilter('GST number', e.target.value)}
                className={getTextFilterClass(Boolean(filterGstNumber.trim()))}
              />
            </div>

            {/* Anchor ID Filter */}
            <div className="space-y-1">
              <Label htmlFor="f-anchor" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Anchor ID
              </Label>
              <Input
                id="f-anchor"
                placeholder="Anchor ID"
                value={filterAnchorId}
                onChange={(e) => {
                  setFilterAnchorId(e.target.value);
                  setCurrentPage(1);
                }}
                onBlur={(e) => notifyTextFilter('Anchor ID', e.target.value)}
                className={getTextFilterClass(Boolean(filterAnchorId.trim()))}
              />
            </div>

            {/* Status Filter */}
            <div className="space-y-1">
              <Label htmlFor="f-status" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Status
              </Label>
              <select
                id="f-status"
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                  toast.info(
                    e.target.value === 'all'
                      ? 'Showing customers with any account status.'
                      : `Showing ${e.target.value.toLowerCase()} customers only.`
                  );
                }}
                className={`h-10 w-full px-2.5 rounded-xl border text-xs font-semibold outline-none transition-all duration-200 ${
                  filterStatus !== 'all'
                    ? 'border-[#000080] bg-blue-50/70 text-[#000080] shadow-sm ring-2 ring-blue-100'
                    : 'bg-slate-50 border-slate-200 text-slate-700 focus:bg-white focus:border-[#000080]'
                }`}
              >
                <option value="all">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <fieldset className="space-y-2 sm:col-span-2 md:col-span-4 lg:col-span-8">
              <legend className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Report Filters
              </legend>
              <div className="flex flex-wrap gap-3">
                {([
                  ['bsa', 'BSA'],
                  ['gst', 'GST'],
                  ['itr', 'ITR'],
                  ['cibil', 'CIBIL'],
                ] as const).map(([service, label]) => (
                  <motion.label
                    key={service}
                    whileHover={{ y: -2, scale: 1.025 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 22 }}
                    className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors duration-200 ${
                      selectedServiceFilters.includes(service)
                        ? 'border-[#000080] bg-blue-50 text-[#000080] shadow-sm ring-2 ring-blue-100'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedServiceFilters.includes(service)}
                      onChange={() => toggleServiceFilter(service)}
                      className="h-4 w-4 accent-[#000080]"
                    />
                    {label}
                  </motion.label>
                ))}
                <motion.label
                  whileHover={{ y: -2, scale: 1.025 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 22 }}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors duration-200 ${
                    includeNoReports
                      ? 'border-[#000080] bg-blue-50 text-[#000080] shadow-sm ring-2 ring-blue-100'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={includeNoReports}
                    onChange={(event) => {
                      const checked = event.target.checked;
                      setIncludeNoReports(checked);
                      if (checked) {
                        setSelectedServiceFilters([]);
                        toast.info('Showing customers without any analyzed reports.');
                      } else {
                        toast.info('Showing customers with at least one analyzed report.');
                      }
                      setCurrentPage(1);
                    }}
                    className="h-4 w-4 accent-[#000080]"
                  />
                  No Reports
                </motion.label>
              </div>
              <p className="text-[11px] text-slate-400">
                By default, customers with at least one analyzed report are shown. Select services to require all selected reports, or choose “No Reports” to show customers without analyzed reports.
              </p>
            </fieldset>
          </div>

          {/* ─── DATA TABLE ─── */}
          <div className="overflow-x-auto border border-gray-100 rounded-2xl shadow-sm bg-white">
            <table className="w-full min-w-[1250px] table-fixed text-left border-collapse">
              <colgroup>
                <col className="w-10" />
                <col className="w-[190px]" />
                <col className="w-[150px]" />
                <col className="w-[120px]" />
                <col className="w-[140px]" />
                <col className="w-[150px]" />
                <col className="w-[110px]" />
                <col className="w-[70px]" />
                <col className="w-[70px]" />
                <col className="w-[70px]" />
                <col className="w-[70px]" />
                <col className="w-[70px]" />
              </colgroup>
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold text-[11px] uppercase tracking-wider bg-white">
                  <th className="py-3.5 px-2 font-bold text-gray-400">
                    <span className="sr-only">Copy User ID</span>
                  </th>
                  <th className="py-3.5 px-3 font-bold text-gray-400">User ID</th>
                  <th className="py-3.5 px-4 font-bold text-gray-400">CUSTOMER NAME</th>
                  <th className="py-3.5 px-4 font-bold text-gray-400">MOBILE NUMBER</th>
                  <th className="py-3.5 px-4 font-bold text-gray-400">COMPANY NAME</th>
                  <th className="py-3.5 px-4 font-bold text-gray-400">GST NO</th>
                  <th className="py-3.5 px-4 font-bold text-gray-400">STATUS</th>
                  <th className="py-3.5 px-4 font-bold text-center text-gray-400">BSA</th>
                  <th className="py-3.5 px-4 font-bold text-center text-gray-400">GST</th>
                  <th className="py-3.5 px-4 font-bold text-center text-gray-400">ITR</th>
                  <th className="py-3.5 px-4 font-bold text-center text-gray-400">CIBIL</th>
                  <th className="py-3.5 px-4 font-bold text-center text-gray-400">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {isLoading ? (
                  <tr>
                    <td colSpan={12} className="py-16 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Activity className="h-7 w-7 animate-spin text-[#000080]" />
                        <span className="text-xs font-bold text-slate-600">Loading customers...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedList.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="py-16 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Users className="h-8 w-8 text-slate-300" />
                        <p className="text-sm font-bold text-slate-600">No customers found</p>
                        <p className="text-xs text-slate-400">Try adjusting your filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedList.map((item, idx) => (
                    <motion.tr
                      key={item.accountid || idx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut', delay: Math.min(idx * 0.025, 0.2) }}
                      className="hover:bg-gray-50/70 transition-colors cursor-pointer text-gray-800"
                      onClick={() => handleSelectCustomer(item)}
                    >
                      {/* COPY USER ID */}
                      <td className="py-4 px-2 text-center" onClick={(event) => event.stopPropagation()}>
                        {item.accountid && (
                          <button
                            type="button"
                            onClick={(event) => handleCopyCustomerId(event, item.accountid)}
                            className="inline-flex rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                            title="Copy User ID"
                            aria-label={`Copy User ID ${item.accountid}`}
                          >
                            {copiedCustomerId === item.accountid ? (
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        )}
                      </td>

                      {/* ACCOUNT ID */}
                      <td className="py-4 px-3 font-mono text-xs text-gray-600">
                        <span className="block truncate whitespace-nowrap" title={item.accountid}>
                          {item.accountid}
                        </span>
                        {item.accountid.toLowerCase() === TEST_ACCOUNT_ID && (
                          <span className="mt-1 inline-flex rounded-md border border-amber-200 bg-amber-50 px-1.5 py-0.5 font-sans text-[10px] font-semibold leading-tight text-amber-800">
                            Test account
                          </span>
                        )}
                      </td>

                      {/* CUSTOMER NAME */}
                      <td className="py-4 px-4 font-bold text-gray-900">
                        {item.customername || 'N/A'}
                      </td>

                      {/* MOBILE NUMBER */}
                      <td className="py-4 px-4 text-gray-700">
                        {item.phone || '-'}
                      </td>

                      {/* COMPANY NAME */}
                      <td className="py-4 px-4 text-gray-700">
                        {item.companyname || '-'}
                      </td>

                      {/* GST NO */}
                      <td className="py-4 px-4 text-gray-700 font-mono">
                        {item.gstnumber || <p className='text-red-700 text-bold'>Not Found</p>}
                      </td>

                      {/* STATUS */}
                      <td className="py-4 px-4">
                        {item.status && String(item.status).toLowerCase() === 'active' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF9F0] text-[#2E9B5C]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#2E9B5C]" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FDEEEE] text-[#E5484D]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#E5484D]" />
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* BSA */}
                      <td className="py-4 px-4 text-center">
                        {item.bsa ? (
                          <span
                            className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-[#EAF9F0] text-[#2E9B5C]"
                            title="Completed"
                          >
                            <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-[#FDEEEE] text-[#E5484D]"
                            title="Pending / Incomplete"
                          >
                            <X className="h-3.5 w-3.5 stroke-[2.5]" />
                          </span>
                        )}
                      </td>

                      {/* GST */}
                      <td className="py-4 px-4 text-center">
                        {item.gst ? (
                          <span
                            className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-[#EAF9F0] text-[#2E9B5C]"
                            title="Completed"
                          >
                            <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-[#FDEEEE] text-[#E5484D]"
                            title="Pending / Incomplete"
                          >
                            <X className="h-3.5 w-3.5 stroke-[2.5]" />
                          </span>
                        )}
                      </td>

                      {/* ITR */}
                      <td className="py-4 px-4 text-center">
                        {item.itr ? (
                          <span
                            className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-[#EAF9F0] text-[#2E9B5C]"
                            title="Completed"
                          >
                            <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-[#FDEEEE] text-[#E5484D]"
                            title="Pending / Incomplete"
                          >
                            <X className="h-3.5 w-3.5 stroke-[2.5]" />
                          </span>
                        )}
                      </td>

                      {/* CIBIL */}
                      <td className="py-4 px-4 text-center">
                        {item.cibil ? (
                          <span
                            className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-[#EAF9F0] text-[#2E9B5C]"
                            title="Completed"
                          >
                            <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-[#FDEEEE] text-[#E5484D]"
                            title="Pending / Incomplete"
                          >
                            <X className="h-3.5 w-3.5 stroke-[2.5]" />
                          </span>
                        )}
                      </td>

                      {/* ACTION */}
                      <td
                        className="py-4 px-4 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => handleSelectCustomer(item)}
                          className="p-1.5 rounded-lg bg-[#002366]/10 text-[#002366] hover:bg-[#002366] hover:text-white transition-all shadow-sm mx-auto flex items-center justify-center cursor-pointer"
                          title="Customer Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ─── PAGINATION ─── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-500">
            <div>
              Showing {filteredList.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
              {Math.min(currentPage * pageSize, totalRecords)} of {totalRecords} entries
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage <= 1}
                className="h-8 w-8 p-0 rounded-lg"
                title="First Page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="h-8 w-8 p-0 rounded-lg"
                title="Previous Page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="px-3 py-1 font-bold text-slate-800 bg-slate-50 rounded-lg border border-slate-200">
                {currentPage} / {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="h-8 w-8 p-0 rounded-lg"
                title="Next Page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage >= totalPages}
                className="h-8 w-8 p-0 rounded-lg"
                title="Last Page"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
