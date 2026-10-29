import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Check,
  X,
  Eye,
  Anchor,
  Users,
  Phone,
  Mail,
  Activity,
  ArrowLeft,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/lib/toast';
import { useQuery } from '@tanstack/react-query';
import { getAnchorsList, getUsersList, extractPaginatedData } from '@/api/user';
import ServiceReport from './ServiceReport';

export interface CustomerDetailRecord {
  accountid: string;
  customername: string;
  companyname: string;
  emailid: string;
  phone: string;
  emailverified?: boolean;
  phoneverified?: boolean;
  gstnumber: string;
  secondarygstlist?: string;
  status: 'Active' | 'Inactive' | string;
  role?: string;
  createat?: string;
  updatedat?: string;
  lastloginat?: string;
  anchor_id?: string;
  anchor_code?: string;
  bsa?: boolean | null;
  gst?: boolean | null;
  itr?: boolean | null;
  cibil?: boolean | null;
  raw?: any;
}

export interface AnchorRecord {
  _id: string;
  anchor_name: string;
  anchor_code: string;
  loginid: string;
  is_active: boolean;
  role: string;
  createat: string;
  updatedat: string;
  createby: string;
  updateby: string;
}

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

export default function AdminAnchorsPage() {
  const [anchorsList, setAnchorsList] = useState<AnchorRecord[]>([]);

  // Pagination states for anchors
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // URL search params for hierarchical navigation
  const [searchParams, setSearchParams] = useSearchParams();
  const anchorIdParam = searchParams.get('anchorId');
  const userIdParam = searchParams.get('userId');
  const customerIdParam = searchParams.get('customerId');

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit: pageSize,
    }),
    [currentPage, pageSize]
  );

  // Fetch anchors list
  const { data: fetchedAnchors, isLoading: isAnchorsLoading } = useQuery({
    queryKey: ['admin', 'anchors-list', currentPage, pageSize],
    queryFn: () => getAnchorsList(queryParams),
    placeholderData: (previousData) => previousData,
  });

  const paginationData = useMemo(() => {
    return extractPaginatedData<any>(fetchedAnchors, currentPage, pageSize);
  }, [fetchedAnchors, currentPage, pageSize]);

  useEffect(() => {
    if (paginationData.items) {
      const mapped = paginationData.items.map((anchor: any) => ({
        _id: anchor._id || anchor.id || '',
        anchor_name: anchor.anchor_name || anchor.anchorName || anchor['anchor name'] || '',
        anchor_code: anchor.anchor_code || anchor.anchorCode || anchor['anchor code'] || '',
        loginid: anchor.login_id || anchor.loginid || '',
        is_active:
          typeof anchor.is_active === 'boolean'
            ? anchor.is_active
            : anchor.is_active === 'true' || anchor.is_active === 1 || anchor.is_active === '1',
        role: anchor.role || 'ANCHOR',
        createat: anchor.created_at || anchor.createat || '',
        updatedat: anchor.updated_at || anchor.updatedat || '',
        createby: anchor.created_by || anchor.createby || '',
        updateby: anchor.updated_by || anchor.updateby || '',
      }));
      setAnchorsList(mapped);
    }
  }, [paginationData.items]);

  // Pre-fetch all anchors for reliable direct URL lookup across pagination
  const { data: allAnchorsRaw } = useQuery({
    queryKey: ['admin', 'all-anchors-lookup'],
    queryFn: () => getAnchorsList({ limit: 200 }),
    staleTime: 60000,
  });

  const allKnownAnchors = useMemo(() => {
    const rawItems = extractPaginatedData<any>(allAnchorsRaw, 1, 200).items;
    const list = rawItems.length > 0 ? rawItems : paginationData.items || [];
    return list.map((anchor: any) => ({
      _id: anchor._id || anchor.id || '',
      anchor_name: anchor.anchor_name || anchor.anchorName || anchor['anchor name'] || '',
      anchor_code: anchor.anchor_code || anchor.anchorCode || anchor['anchor code'] || '',
      loginid: anchor.login_id || anchor.loginid || '',
      is_active:
        typeof anchor.is_active === 'boolean'
          ? anchor.is_active
          : anchor.is_active === 'true' || anchor.is_active === 1 || anchor.is_active === '1',
      role: anchor.role || 'ANCHOR',
      createat: anchor.created_at || anchor.createat || '',
      updatedat: anchor.updated_at || anchor.updatedat || '',
      createby: anchor.created_by || anchor.createby || '',
      updateby: anchor.updated_by || anchor.updateby || '',
    }));
  }, [allAnchorsRaw, paginationData.items]);

  // Derive Current Selected Anchor
  const currentSelectedAnchor = useMemo(() => {
    if (!anchorIdParam) return null;
    const cleanId = anchorIdParam.trim().toLowerCase();
    const found =
      allKnownAnchors.find(
        (a) =>
          (a._id && a._id.toLowerCase() === cleanId) ||
          (a.anchor_code && a.anchor_code.toLowerCase() === cleanId) ||
          (a.loginid && a.loginid.toLowerCase() === cleanId)
      ) ||
      anchorsList.find(
        (a) =>
          (a._id && a._id.toLowerCase() === cleanId) ||
          (a.anchor_code && a.anchor_code.toLowerCase() === cleanId) ||
          (a.loginid && a.loginid.toLowerCase() === cleanId)
      );

    if (found) return found;

    return {
      _id: '',
      anchor_name: anchorIdParam,
      anchor_code: anchorIdParam,
      loginid: '',
      is_active: true,
      role: 'ANCHOR',
      createat: '',
      updatedat: '',
      createby: 'SYSTEM',
      updateby: 'SYSTEM',
    } as AnchorRecord;
  }, [anchorIdParam, allKnownAnchors, anchorsList]);

  // Effective anchor query identifier
  const effectiveAnchorQueryId = useMemo(() => {
    if (!anchorIdParam && !currentSelectedAnchor) return '';
    return (
      currentSelectedAnchor?.anchor_code ||
      currentSelectedAnchor?._id ||
      anchorIdParam ||
      ''
    );
  }, [anchorIdParam, currentSelectedAnchor]);

  // Fetch users specifically under this anchor (following Anchor Portal architecture)
  const { data: fetchedAnchorUsersRaw, isLoading: isUsersLoading } = useQuery({
    queryKey: ['admin', 'anchor-users', effectiveAnchorQueryId],
    queryFn: () =>
      getUsersList({
        anchor_id: effectiveAnchorQueryId,
        limit: 1000,
      }),
    enabled: Boolean(effectiveAnchorQueryId),
    staleTime: 30000,
  });

  // Pre-fetch all users for sub-customer hierarchy lookups
  const { data: fetchedUsersRaw } = useQuery({
    queryKey: ['admin', 'all-users-association'],
    queryFn: () => getUsersList({ limit: 1000 }),
    staleTime: 60000,
  });

  const allUsersList = useMemo(() => {
    const rawItems = extractPaginatedData<any>(fetchedUsersRaw, 1, 1000).items;
    return rawItems.map((u: any, index: number): CustomerDetailRecord => ({
      accountid: findAccountId(u, index),
      customername: u.customername || u.customer_name || u.customerName || u.name || '',
      companyname: u.companyname || u.company_name || u.companyName || '',
      emailid: u.emailid || u.email_id || u.emailId || u.email || '',
      emailverified: Boolean(u.emailverified ?? u.email_verified ?? u.emailVerified),
      phone: u.phone || u.phone_no || u.phoneNo || u.phoneNumber || '',
      phoneverified: Boolean(u.phoneverified ?? u.phone_verified ?? u.phoneVerified),
      gstnumber: u.gstnumber || u.gst_number || u.gstNumber || u.gst || '',
      status: String(u.status || '').toLowerCase() === 'active' || u.status === true ? 'Active' : 'Inactive',
      role: u.role || 'USER',
      createat: u.createat || u.created_at || u.createAt || u.createdAt || '',
      updatedat: u.updatedat || u.updated_at || u.updatedAt || '',
      lastloginat: findLastLoginValue(u),
      secondarygstlist: Array.isArray(u.secondary_gst_list)
        ? u.secondary_gst_list.join(', ')
        : u.secondarygstlist || u.secondary_gst_list || '',
      anchor_id: u.anchor_id ? String(u.anchor_id) : '',
      anchor_code: u.anchor_code || u.site_code || '',
      bsa: getFlagValue(u, 'bsa'),
      gst: getFlagValue(u, 'gst'),
      itr: getFlagValue(u, 'itr'),
      cibil: getFlagValue(u, 'cibil'),
      raw: u,
    }));
  }, [fetchedUsersRaw]);

  // Derive Users associated with the Selected Anchor
  const associatedUsers = useMemo(() => {
    if (!effectiveAnchorQueryId) return [];

    const rawItems = extractPaginatedData<any>(fetchedAnchorUsersRaw, 1, 1000).items;
    
    // If backend returned specific anchor users, map them directly
    if (rawItems.length > 0) {
      return rawItems.map((u: any, index: number): CustomerDetailRecord => ({
        accountid: findAccountId(u, index),
        customername: u.customername || u.customer_name || u.customerName || u.name || '',
        companyname: u.companyname || u.company_name || u.companyName || '',
        emailid: u.emailid || u.email_id || u.emailId || u.email || '',
        emailverified: Boolean(u.emailverified ?? u.email_verified ?? u.emailVerified),
        phone: u.phone || u.phone_no || u.phoneNo || u.phoneNumber || '',
        phoneverified: Boolean(u.phoneverified ?? u.phone_verified ?? u.phoneVerified),
        gstnumber: u.gstnumber || u.gst_number || u.gstNumber || u.gst || '',
        status: String(u.status || '').toLowerCase() === 'active' || u.status === true ? 'Active' : 'Inactive',
        role: u.role || 'USER',
        createat: u.createat || u.created_at || u.createAt || u.createdAt || '',
        updatedat: u.updatedat || u.updated_at || u.updatedAt || '',
        lastloginat: findLastLoginValue(u),
        secondarygstlist: Array.isArray(u.secondary_gst_list)
          ? u.secondary_gst_list.join(', ')
          : u.secondarygstlist || u.secondary_gst_list || '',
        anchor_id: u.anchor_id ? String(u.anchor_id) : '',
        anchor_code: u.anchor_code || u.site_code || '',
        bsa: getFlagValue(u, 'bsa'),
        gst: getFlagValue(u, 'gst'),
        itr: getFlagValue(u, 'itr'),
        cibil: getFlagValue(u, 'cibil'),
        raw: u,
      }));
    }

    // Fallback: match from allUsersList if fetchedAnchorUsersRaw is still syncing
    if (!currentSelectedAnchor) return [];
    const aId = (currentSelectedAnchor._id || '').toLowerCase();
    const aCode = (currentSelectedAnchor.anchor_code || '').toLowerCase();
    const aLogin = (currentSelectedAnchor.loginid || '').toLowerCase();

    return allUsersList.filter((u) => {
      const uAnchor = (u.anchor_id || '').toLowerCase();
      const uSite = (u.raw?.site_code || u.anchor_code || '').toLowerCase();
      return (
        (aId && uAnchor === aId) ||
        (aCode && (uAnchor === aCode || uSite === aCode)) ||
        (aLogin && uAnchor === aLogin)
      );
    });
  }, [effectiveAnchorQueryId, fetchedAnchorUsersRaw, currentSelectedAnchor, allUsersList]);

  // Derive Current Selected User under the selected anchor
  const currentSelectedUser = useMemo(() => {
    if (!userIdParam) return null;
    return (
      associatedUsers.find(
        (u) =>
          u.accountid === userIdParam ||
          (u.raw && String(u.raw._id) === userIdParam) ||
          u.customername.toLowerCase() === userIdParam.toLowerCase()
      ) || null
    );
  }, [userIdParam, associatedUsers]);

  // Derive Associated Customers for the selected user
  const associatedCustomers = useMemo(() => {
    if (!currentSelectedUser) return [];
    // Primary customer is the customer underwriting profile itself
    const primaryCustomer: CustomerDetailRecord = {
      ...currentSelectedUser,
      customername:
        currentSelectedUser.customername ||
        currentSelectedUser.companyname ||
        `Customer ${currentSelectedUser.accountid}`,
    };

    // Plus any other customer records that reference this user ID
    const subCustomers = allUsersList.filter(
      (u) =>
        u.accountid !== currentSelectedUser.accountid &&
        (u.raw?.created_by === currentSelectedUser.accountid ||
          u.raw?.user_id === currentSelectedUser.accountid ||
          u.raw?.parent_id === currentSelectedUser.accountid)
    );

    return [primaryCustomer, ...subCustomers];
  }, [currentSelectedUser, allUsersList]);

  // Derive Current Selected Customer for detail inspection
  const currentSelectedCustomer = useMemo(() => {
    if (!customerIdParam) return null;
    return (
      associatedCustomers.find(
        (c) =>
          c.accountid === customerIdParam ||
          (c.raw && String(c.raw._id) === customerIdParam) ||
          c.customername.toLowerCase() === customerIdParam.toLowerCase()
      ) ||
      associatedUsers.find(
        (u) =>
          u.accountid === customerIdParam ||
          (u.raw && String(u.raw._id) === customerIdParam) ||
          u.customername.toLowerCase() === customerIdParam.toLowerCase()
      ) ||
      null
    );
  }, [customerIdParam, associatedCustomers, associatedUsers]);

  // Navigation Handlers
  const handleSelectAnchor = (anchor: AnchorRecord) => {
    setSearchParams(
      (prev) => {
        prev.set('anchorId', anchor.anchor_code || anchor._id || anchor.loginid || '');
        prev.delete('userId');
        prev.delete('customerId');
        return prev;
      },
      { replace: false }
    );
  };

  const handleSelectUser = (user: CustomerDetailRecord) => {
    setSearchParams(
      (prev) => {
        prev.set('userId', user.accountid);
        prev.delete('customerId');
        return prev;
      },
      { replace: false }
    );
  };

  const handleSelectCustomer = (customer: CustomerDetailRecord) => {
    setSearchParams(
      (prev) => {
        prev.set('customerId', customer.accountid);
        return prev;
      },
      { replace: false }
    );
  };

  const handleViewUserReports = (user: CustomerDetailRecord) => {
    try {
      sessionStorage.setItem(`customer_${user.accountid}`, JSON.stringify(user));
    } catch {}
    setSearchParams(
      (prev) => {
        prev.set('userId', user.accountid);
        prev.set('customerId', user.accountid);
        return prev;
      },
      { replace: false }
    );
    toast.info(`Viewing reports for ${user.customername || user.accountid}`);
  };

  const handleBackToAnchors = () => {
    setSearchParams(
      (prev) => {
        prev.delete('anchorId');
        prev.delete('userId');
        prev.delete('customerId');
        return prev;
      },
      { replace: false }
    );
  };

  const handleBackToAnchorUsers = () => {
    setSearchParams(
      (prev) => {
        prev.delete('userId');
        prev.delete('customerId');
        return prev;
      },
      { replace: false }
    );
  };

  const handleBackToUserCustomers = () => {
    setSearchParams(
      (prev) => {
        prev.delete('customerId');
        return prev;
      },
      { replace: false }
    );
  };

  // Filter input states for Anchors List
  const [filteranchorname, setFilteranchorname] = useState('');
  const [filteranchorcode, setFilteranchorcode] = useState('');
  const [filterloginid, setFilterloginid] = useState('');
  const [filterisactive, setFilterisactive] = useState('all');
  const [filterrole, setFilterrole] = useState('');

  // Filter input states for Associated Users
  const [filterUserAccId, setFilterUserAccId] = useState('');
  const [filterUserName, setFilterUserName] = useState('');
  const [filterUserPhone, setFilterUserPhone] = useState('');
  const [filterUserCompany, setFilterUserCompany] = useState('');
  const [filterUserGst, setFilterUserGst] = useState('');
  const [filterUserStatus, setFilterUserStatus] = useState('all');

  // Modal states for creating anchor
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newFormData, setNewFormData] = useState({
    anchor_name: '',
    anchor_code: '',
    loginid: '',
    is_active: true,
    role: 'ANCHOR',
  });

  // Filtered anchors list
  const filteredAnchorsList = useMemo(() => {
    return anchorsList.filter((item) => {
      const matchAnchorName = filteranchorname
        ? item.anchor_name.toLowerCase().includes(filteranchorname.toLowerCase())
        : true;
      const matchAnchorCode = filteranchorcode
        ? item.anchor_code.toLowerCase().includes(filteranchorcode.toLowerCase())
        : true;
      const matchLoginId = filterloginid
        ? item.loginid.toLowerCase().includes(filterloginid.toLowerCase())
        : true;
      const matchStatus =
        filterisactive !== 'all'
          ? filterisactive === 'true'
            ? item.is_active === true
            : item.is_active === false
          : true;
      const matchRole = filterrole ? item.role === filterrole : true;

      return matchAnchorName && matchAnchorCode && matchLoginId && matchStatus && matchRole;
    });
  }, [anchorsList, filteranchorname, filteranchorcode, filterloginid, filterisactive, filterrole]);

  // Filtered associated users list
  const filteredAssociatedUsers = useMemo(() => {
    return associatedUsers.filter((u) => {
      const matchAcc = filterUserAccId
        ? u.accountid.toLowerCase().includes(filterUserAccId.toLowerCase())
        : true;
      const matchName = filterUserName
        ? u.customername.toLowerCase().includes(filterUserName.toLowerCase())
        : true;
      const matchPhone = filterUserPhone
        ? u.phone.toLowerCase().includes(filterUserPhone.toLowerCase())
        : true;
      const matchCompany = filterUserCompany
        ? u.companyname.toLowerCase().includes(filterUserCompany.toLowerCase())
        : true;
      const matchGst = filterUserGst
        ? u.gstnumber.toLowerCase().includes(filterUserGst.toLowerCase())
        : true;
      const matchStatus =
        filterUserStatus !== 'all'
          ? u.status.toLowerCase() === filterUserStatus.toLowerCase()
          : true;

      return matchAcc && matchName && matchPhone && matchCompany && matchGst && matchStatus;
    });
  }, [
    associatedUsers,
    filterUserAccId,
    filterUserName,
    filterUserPhone,
    filterUserCompany,
    filterUserGst,
    filterUserStatus,
  ]);

  const isServerPaginated = paginationData.is_server_paginated;
  const totalPages = isServerPaginated
    ? paginationData.total_pages
    : Math.max(1, Math.ceil(filteredAnchorsList.length / pageSize));
  const totalRecords = isServerPaginated
    ? paginationData.total_records
    : filteredAnchorsList.length;

  const paginatedAnchorsList = useMemo(() => {
    if (isServerPaginated) return filteredAnchorsList;
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAnchorsList.slice(startIndex, startIndex + pageSize);
  }, [filteredAnchorsList, isServerPaginated, currentPage, pageSize]);

  // Create Anchor Submit
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFormData.anchor_name || !newFormData.anchor_code || !newFormData.loginid) {
      toast.error('Mandatory fields (Anchor Name, Anchor Code, Login ID) are missing.');
      return;
    }

    const now = new Date();
    const formatted = `${now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })} ${now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })}`;

    const newRecord: AnchorRecord = {
      _id: String(Date.now()),
      anchor_name: newFormData.anchor_name,
      anchor_code: newFormData.anchor_code,
      loginid: newFormData.loginid,
      is_active: newFormData.is_active,
      role: newFormData.role,
      createat: formatted,
      updatedat: formatted,
      createby: 'ADMIN',
      updateby: 'ADMIN',
    };

    setAnchorsList((prev) => [newRecord, ...prev]);
    toast.success('Anchor created successfully.');
    setIsCreateModalOpen(false);
    setNewFormData({
      anchor_name: '',
      anchor_code: '',
      loginid: '',
      is_active: true,
      role: 'ANCHOR',
    });
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // LEVEL 4: Customer Details View (Anchor > User > Customer Details)
  // ═══════════════════════════════════════════════════════════════════════════
  if (currentSelectedAnchor && currentSelectedUser && currentSelectedCustomer) {
    const customerForServiceReport = {
      id: currentSelectedCustomer.accountid,
      name: currentSelectedCustomer.customername || `Customer ${currentSelectedCustomer.accountid}`,
      customer_name: currentSelectedCustomer.customername,
      phone: currentSelectedCustomer.phone,
      phone_no: currentSelectedCustomer.phone,
      company_name: currentSelectedCustomer.companyname,
      gst_no: currentSelectedCustomer.gstnumber,
      status: currentSelectedCustomer.status,
      bsa: currentSelectedCustomer.bsa,
      gst: currentSelectedCustomer.gst,
      itr: currentSelectedCustomer.itr,
      cibil: currentSelectedCustomer.cibil,
      anchor_code: currentSelectedAnchor.anchor_code,
      anchor_id: currentSelectedAnchor._id,
      created_by: currentSelectedCustomer.raw?.created_by,
      updated_by: currentSelectedCustomer.raw?.updated_by,
    };

    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f4f6f9]">
        {/* Breadcrumb Navigation Header */}
        <div className="bg-white border-b border-slate-200 px-8 py-3.5 shrink-0 flex items-center gap-2 text-xs font-semibold text-slate-500 overflow-x-auto">
          <button
            onClick={handleBackToAnchors}
            className="hover:text-[#000080] transition-colors cursor-pointer"
          >
            Anchor
          </button>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <button
            onClick={handleBackToAnchorUsers}
            className="hover:text-[#000080] transition-colors cursor-pointer"
          >
            {currentSelectedAnchor.anchor_name}
          </button>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <button
            onClick={handleBackToAnchorUsers}
            className="hover:text-[#000080] transition-colors cursor-pointer"
          >
            Users
          </button>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <button
            onClick={handleBackToUserCustomers}
            className="hover:text-[#000080] transition-colors cursor-pointer"
          >
            Customers
          </button>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold">
            {customerForServiceReport.name} (Service Report)
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <ServiceReport
            selectedCustomer={customerForServiceReport}
            onBack={handleBackToUserCustomers}
          />
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // LEVEL 3: User Details & Associated Customers (Anchor > User Details)
  // ═══════════════════════════════════════════════════════════════════════════
  if (currentSelectedAnchor && currentSelectedUser) {
    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f4f6f9]">
        {/* Header with Breadcrumbs & Back Navigation */}
        <header className="bg-white border-b border-slate-200 px-8 py-5 shrink-0 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 overflow-x-auto">
            <button
              onClick={handleBackToAnchors}
              className="hover:text-[#000080] transition-colors cursor-pointer"
            >
              Anchor
            </button>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <button
              onClick={handleBackToAnchorUsers}
              className="hover:text-[#000080] transition-colors cursor-pointer"
            >
              {currentSelectedAnchor.anchor_name}
            </button>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <button
              onClick={handleBackToAnchorUsers}
              className="hover:text-[#000080] transition-colors cursor-pointer"
            >
              Users
            </button>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold">
              Customers
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToAnchorUsers}
                className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors shadow-sm cursor-pointer"
                title="Back to Users"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    {currentSelectedUser.customername || `User ${currentSelectedUser.accountid}`} — Customers
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      currentSelectedUser.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        currentSelectedUser.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}
                    />
                    {currentSelectedUser.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Account ID: <strong className="text-slate-700">{currentSelectedUser.accountid}</strong> • Anchor:{' '}
                  <strong className="text-slate-700">{currentSelectedAnchor.anchor_name}</strong> ({currentSelectedAnchor.anchor_code})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                Associated Customers: <strong>{associatedCustomers.length}</strong>
              </span>
            </div>
          </div>
        </header>

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6">
          {/* User Details Summary Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              User Profile Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Company Name
                </span>
                <p className="font-bold text-slate-800">{currentSelectedUser.companyname || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Email ID
                </span>
                <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Mail className="h-3 w-3 text-slate-400" />
                  {currentSelectedUser.emailid || 'N/A'}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Phone
                </span>
                <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Phone className="h-3 w-3 text-slate-400" />
                  {currentSelectedUser.phone || 'N/A'}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  GST Number
                </span>
                <p className="font-mono font-bold text-slate-800">{currentSelectedUser.gstnumber || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Created At
                </span>
                <p className="text-slate-600">{currentSelectedUser.createat || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Last Login
                </span>
                <p className="text-slate-600">{currentSelectedUser.lastloginat || '-'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Role
                </span>
                <p className="font-bold text-slate-800 uppercase">{currentSelectedUser.role || 'USER'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Anchor Reference
                </span>
                <p className="font-mono text-slate-700">{currentSelectedAnchor.anchor_code}</p>
              </div>
            </div>
          </div>

          {/* Associated Customers Section */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#000080]" />
                  Customers ({associatedCustomers.length})
                </h2>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Customer underwriting records linked to {currentSelectedUser.customername || currentSelectedUser.accountid}.
                </p>
              </div>
            </div>

            {/* Customers Table */}
            <div className="overflow-x-auto border border-gray-100 rounded-2xl shadow-sm bg-white">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-bold text-[11px] uppercase tracking-wider bg-white">
                    <th className="py-3.5 px-4 font-bold text-gray-400">ACCOUNT ID</th>
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
                  {associatedCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-16 text-center text-slate-400">
                        <Users className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                        <p className="text-sm font-bold text-slate-600">No customers associated with this user</p>
                      </td>
                    </tr>
                  ) : (
                    associatedCustomers.map((cust, idx) => (
                      <tr
                        key={cust.accountid || idx}
                        className="hover:bg-gray-50/70 transition-colors cursor-pointer text-gray-800"
                        onClick={() => handleSelectCustomer(cust)}
                      >
                        {/* ACCOUNT ID */}
                        <td className="py-4 px-4 font-mono text-xs text-gray-600">
                          {cust.accountid}
                        </td>

                        {/* CUSTOMER NAME */}
                        <td className="py-4 px-4 font-bold text-gray-900">
                          {cust.customername || 'N/A'}
                        </td>

                        {/* MOBILE NUMBER */}
                        <td className="py-4 px-4 text-gray-700">
                          {cust.phone || '-'}
                        </td>

                        {/* COMPANY NAME */}
                        <td className="py-4 px-4 text-gray-700">
                          {cust.companyname || '-'}
                        </td>

                        {/* GST NO */}
                        <td className="py-4 px-4 text-gray-700 font-mono">
                          {cust.gstnumber || '-'}
                        </td>

                        {/* STATUS */}
                        <td className="py-4 px-4">
                          {cust.status && String(cust.status).toLowerCase() === 'active' ? (
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
                          {cust.bsa ? (
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
                          {cust.gst ? (
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
                          {cust.itr ? (
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
                          {cust.cibil ? (
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
                            onClick={() => handleSelectCustomer(cust)}
                            className="p-1.5 rounded-lg bg-[#000080]/10 text-[#000080] hover:bg-[#000080] hover:text-white transition-all shadow-sm cursor-pointer"  
                            title="Customer Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // LEVEL 2: Anchor Details & Associated Users (Anchor Details)
  // ═══════════════════════════════════════════════════════════════════════════
  if (currentSelectedAnchor) {
    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f4f6f9]">
        {/* Header with Breadcrumbs & Back Navigation */}
        <header className="bg-white border-b border-slate-200 px-8 py-5 shrink-0 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 overflow-x-auto">
            <button
              onClick={handleBackToAnchors}
              className="hover:text-[#000080] transition-colors cursor-pointer"
            >
              Anchor
            </button>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">
              {currentSelectedAnchor.anchor_name}
            </span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold">
              Users
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToAnchors}
                className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors shadow-sm cursor-pointer"
                title="Back to Anchors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    {currentSelectedAnchor.anchor_name} — Users
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      currentSelectedAnchor.is_active
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        currentSelectedAnchor.is_active ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}
                    />
                    {currentSelectedAnchor.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Anchor Code: <strong className="text-slate-700">{currentSelectedAnchor.anchor_code}</strong> • Login ID:{' '}
                  <strong className="text-slate-700">{currentSelectedAnchor.loginid}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-xl">
                <Users className="h-4 w-4 text-[#000080]" />
                <span className="text-xs font-bold text-[#000080]">
                  Users: {associatedUsers.length}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6">
          {/* Anchor Details Summary Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              Anchor Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Anchor Code
                </span>
                <p className="font-mono font-bold text-slate-800">{currentSelectedAnchor.anchor_code}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Login ID
                </span>
                <p className="font-bold text-slate-800">{currentSelectedAnchor.loginid}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Role
                </span>
                <p className="font-bold text-slate-800 uppercase">{currentSelectedAnchor.role}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Created At
                </span>
                <p className="text-slate-600">{currentSelectedAnchor.createat || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Created By
                </span>
                <p className="text-slate-600">{currentSelectedAnchor.createby || 'SYSTEM'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Last Updated
                </span>
                <p className="text-slate-600">{currentSelectedAnchor.updatedat || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Associated Users Table Section */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#000080]" />
                  Users ({associatedUsers.length})
                </h2>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Select a user to view their customers and underwriting details.
                </p>
              </div>
            </div>

            {/* Filters for Associated Users */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="space-y-1">
                <Label className="text-[10px] font-bold text-slate-500 uppercase">Account ID</Label>
                <Input
                  placeholder="Filter Account ID"
                  value={filterUserAccId}
                  onChange={(e) => setFilterUserAccId(e.target.value)}
                  className="h-10 text-xs rounded-xl bg-slate-50 border-slate-200"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-bold text-slate-500 uppercase">User Name</Label>
                <Input
                  placeholder="Filter Name"
                  value={filterUserName}
                  onChange={(e) => setFilterUserName(e.target.value)}
                  className="h-10 text-xs rounded-xl bg-slate-50 border-slate-200"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-bold text-slate-500 uppercase">Company</Label>
                <Input
                  placeholder="Filter Company"
                  value={filterUserCompany}
                  onChange={(e) => setFilterUserCompany(e.target.value)}
                  className="h-10 text-xs rounded-xl bg-slate-50 border-slate-200"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-bold text-slate-500 uppercase">Phone</Label>
                <Input
                  placeholder="Filter Phone"
                  value={filterUserPhone}
                  onChange={(e) => setFilterUserPhone(e.target.value)}
                  className="h-10 text-xs rounded-xl bg-slate-50 border-slate-200"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-bold text-slate-500 uppercase">GSTIN</Label>
                <Input
                  placeholder="Filter GSTIN"
                  value={filterUserGst}
                  onChange={(e) => setFilterUserGst(e.target.value)}
                  className="h-10 text-xs rounded-xl bg-slate-50 border-slate-200"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-bold text-slate-500 uppercase">Status</Label>
                <select
                  value={filterUserStatus}
                  onChange={(e) => setFilterUserStatus(e.target.value)}
                  className="h-10 w-full px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none"
                >
                  <option value="all">All</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto border border-gray-100 rounded-2xl shadow-sm bg-white">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-bold text-[11px] uppercase tracking-wider bg-white">
                    <th className="py-3.5 px-4 font-bold text-gray-400">ACCOUNT ID</th>
                    <th className="py-3.5 px-4 font-bold text-gray-400">USER NAME</th>
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
                  {isUsersLoading ? (
                    <tr>
                      <td colSpan={11} className="py-16 text-center text-gray-400">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <Activity className="h-7 w-7 animate-spin text-[#000080]" />
                          <span className="text-xs font-bold text-slate-600">Loading associated users...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredAssociatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-16 text-center text-gray-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Users className="h-8 w-8 text-slate-300" />
                          <p className="text-sm font-bold text-slate-600">No users associated with this anchor</p>
                          <p className="text-xs text-slate-400">
                            Users created under anchor code {currentSelectedAnchor.anchor_code || anchorIdParam} will appear here.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredAssociatedUsers.map((user, idx) => (
                      <tr
                        key={user.accountid || idx}
                        className="hover:bg-gray-50/70 transition-colors cursor-pointer text-gray-800"
                        onClick={() => handleSelectUser(user)}
                      >
                        {/* ACCOUNT ID */}
                        <td className="py-4 px-4 font-mono text-xs text-gray-600">
                          {user.accountid}
                        </td>

                        {/* USER NAME */}
                        <td className="py-4 px-4 font-bold text-gray-900">
                          {user.customername || 'N/A'}
                        </td>

                        {/* MOBILE NUMBER */}
                        <td className="py-4 px-4 text-gray-700">
                          {user.phone || '-'}
                        </td>

                        {/* COMPANY NAME */}
                        <td className="py-4 px-4 text-gray-700">
                          {user.companyname || '-'}
                        </td>

                        {/* GST NO */}
                        <td className="py-4 px-4 text-gray-700 font-mono">
                          {user.gstnumber || '-'}
                        </td>

                        {/* STATUS */}
                        <td className="py-4 px-4">
                          {user.status && String(user.status).toLowerCase() === 'active' ? (
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
                          {user.bsa ? (
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
                          {user.gst ? (
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
                          {user.itr ? (
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
                          {user.cibil ? (
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
                        <td className="py-4 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleViewUserReports(user)}
                              className="p-1.5 rounded-lg bg-[#000080]/10 text-[#000080] hover:bg-[#000080] hover:text-white transition-all shadow-sm cursor-pointer"
                              title="View Underwriting Reports"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                           
                             
                            
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // LEVEL 1: Anchors Listing Page
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#f4f6f9]">
      {/* Top Header */}
      <header className="flex items-center justify-between bg-white px-8 py-5 border-b border-slate-200 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            CRISP ADMIN PORTAL
          </h1>
          <p className="text-sm text-slate-500 font-semibold mt-0.5">
            Anchors Management — View anchor organizations and manage user hierarchies.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#000080] hover:bg-[#002366] text-white flex items-center gap-2 rounded-xl h-11 px-5 font-bold shadow-md transition-all duration-200 hover:scale-[1.02]"
          >
            <Plus className="h-4.5 w-4.5" />
            Create Anchor
          </Button>
        </div>
      </header>

      {/* Body Container */}
      <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Anchor className="h-5 w-5 text-[#000080]" />
              Anchor List Portal
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Showing page {currentPage} of {totalPages}
            </p>
          </div>

          {/* ─── FILTERS ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Anchor Name Filter */}
            <div className="space-y-1.5">
              <Label htmlFor="faname" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Anchor Name
              </Label>
              <Input
                id="faname"
                placeholder="Enter Anchor Name"
                value={filteranchorname}
                onChange={(e) => setFilteranchorname(e.target.value)}
                className="h-11 border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white rounded-xl text-sm"
              />
            </div>

            {/* Anchor Code Filter */}
            <div className="space-y-1.5">
              <Label htmlFor="facode" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Anchor Code
              </Label>
              <Input
                id="facode"
                placeholder="Enter Anchor Code"
                value={filteranchorcode}
                onChange={(e) => setFilteranchorcode(e.target.value)}
                className="h-11 border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white rounded-xl text-sm"
              />
            </div>

            {/* Login ID Filter */}
            <div className="space-y-1.5">
              <Label htmlFor="flogin" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Login ID
              </Label>
              <Input
                id="flogin"
                placeholder="Enter Login ID"
                value={filterloginid}
                onChange={(e) => setFilterloginid(e.target.value)}
                className="h-11 border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white rounded-xl text-sm"
              />
            </div>

            {/* Status Filter */}
            <div className="space-y-1.5">
              <Label htmlFor="fstatus" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Status
              </Label>
              <select
                id="fstatus"
                value={filterisactive}
                onChange={(e) => setFilterisactive(e.target.value)}
                className="h-11 w-full px-3 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#000080] rounded-xl text-sm outline-none font-semibold text-slate-700"
              >
                <option value="all">Select Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            {/* Role Filter */}
            <div className="space-y-1.5">
              <Label htmlFor="frole" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Role
              </Label>
              <select
                id="frole"
                value={filterrole}
                onChange={(e) => setFilterrole(e.target.value)}
                className="h-11 w-full px-3 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#000080] rounded-xl text-sm outline-none font-semibold text-slate-700"
              >
                <option value="">Select Role</option>
                <option value="ANCHOR">ANCHOR</option>
                <option value="SUPER_ANCHOR">SUPER_ANCHOR</option>
              </select>
            </div>
          </div>

          {/* ─── DATA TABLE ─── */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="p-3.5">Anchor Name</th>
                  <th className="p-3.5">Anchor Code</th>
                  <th className="p-3.5">Login ID</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Created At</th>
                  <th className="p-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {isAnchorsLoading ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Activity className="h-7 w-7 animate-spin text-[#000080]" />
                        <span className="text-xs font-bold text-slate-600">Loading anchors...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedAnchorsList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Anchor className="h-8 w-8 text-slate-300" />
                        <p className="text-sm font-bold text-slate-600">No anchors found</p>
                        <p className="text-xs text-slate-400">Try adjusting your filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedAnchorsList.map((item, idx) => (
                    <tr
                      key={item._id || idx}
                      className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                      onClick={() => handleSelectAnchor(item)}
                    >
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 group-hover:text-[#000080] transition-colors flex items-center gap-2">
                          <div className="h-7 w-7 rounded-lg bg-blue-50 text-[#000080] flex items-center justify-center font-bold text-xs shrink-0">
                            {item.anchor_name.slice(0, 2).toUpperCase()}
                          </div>
                          <span>{item.anchor_name}</span>
                        </div>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-slate-800">
                        {item.anchor_code}
                      </td>
                      <td className="p-3.5 font-medium text-slate-700">
                        {item.loginid}
                      </td>
                      <td className="p-3.5">
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {item.role}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            item.is_active
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              item.is_active ? 'bg-emerald-500' : 'bg-slate-400'
                            }`}
                          />
                          {item.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-500 whitespace-nowrap">
                        {item.createat || '-'}
                      </td>
                      <td className="p-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSelectAnchor(item)}
                          className="h-8 px-3 rounded-lg text-xs font-bold text-[#000080] hover:bg-[#000080]/10 flex items-center gap-1.5 mx-auto"
                        >
                          
                          <Eye className='h-6 w-5 '/>
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ─── PAGINATION ─── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-500">
            <div>
              Showing {filteredAnchorsList.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
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

      {/* ─── CREATE ANCHOR MODAL ─── */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    Create New Anchor
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Add a new anchor organization to the platform
                  </p>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleCreateSubmit} className="flex-1 flex flex-col overflow-hidden">
                <div className="p-8 space-y-4 overflow-y-auto flex-1">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="naname" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Anchor Name *
                      </Label>
                      <Input
                        id="naname"
                        placeholder="e.g. Acme Lending"
                        required
                        value={newFormData.anchor_name}
                        onChange={(e) =>
                          setNewFormData((prev) => ({
                            ...prev,
                            anchor_name: e.target.value,
                          }))
                        }
                        className="h-11 rounded-xl text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="ncode" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Anchor Code *
                      </Label>
                      <Input
                        id="ncode"
                        placeholder="e.g. ANC01"
                        required
                        value={newFormData.anchor_code}
                        onChange={(e) =>
                          setNewFormData((prev) => ({
                            ...prev,
                            anchor_code: e.target.value,
                          }))
                        }
                        className="h-11 rounded-xl text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="nlogin" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Login ID *
                      </Label>
                      <Input
                        id="nlogin"
                        placeholder="e.g. anchor_login"
                        required
                        value={newFormData.loginid}
                        onChange={(e) =>
                          setNewFormData((prev) => ({
                            ...prev,
                            loginid: e.target.value,
                          }))
                        }
                        className="h-11 rounded-xl text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="nstatus" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Status
                      </Label>
                      <select
                        id="nstatus"
                        value={newFormData.is_active ? 'Active' : 'Inactive'}
                        onChange={(e) =>
                          setNewFormData((prev) => ({
                            ...prev,
                            is_active: e.target.value === 'Active',
                          }))
                        }
                        className="h-11 w-full px-3 bg-white border border-slate-200 rounded-xl text-sm outline-none font-semibold text-slate-700"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="nrole" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Role
                      </Label>
                      <select
                        id="nrole"
                        value={newFormData.role}
                        onChange={(e) =>
                          setNewFormData((prev) => ({
                            ...prev,
                            role: e.target.value,
                          }))
                        }
                        className="h-11 w-full px-3 bg-white border border-slate-200 rounded-xl text-sm outline-none font-semibold text-slate-700"
                      >
                        <option value="ANCHOR">ANCHOR</option>
                        <option value="SUPER_ANCHOR">SUPER_ANCHOR</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="rounded-xl font-bold px-6 h-11 border-slate-200 hover:bg-slate-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#000080] hover:bg-[#002366] text-white rounded-xl font-bold px-6 h-11 shadow-md"
                  >
                    Create Record
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
