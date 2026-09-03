import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import PublicRoute from "@/components/PublicRoute";
import ExistingReports from "./pages/cibil/ExistingReports";
import ViewReport from "./pages/cibil/ViewReport";


const LoginPage = lazy(() => import("@/pages/LoginPage"));
const AnchorLoginPage = lazy(() => import("./pages/AnochorLogin/AnchorLoginPage"));
const AdminLoginPage = lazy(() => import("./pages/adminlogin/AdminLoginPage"));
const AdminProtectedRoute = lazy(() => import("./components/AdminProtectedRoute"));
const AdminDashboardPage = lazy(() => import("@/pages/adminlogin/AdminUsersPage"));
const SignupPage = lazy(() => import("@/pages/SignupPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/ForgotPasswordPage"));
const DashboardLayout = lazy(() => import("@/layouts/DashboardLayout"));
const ProtectedRoute = lazy(() => import("@/components/ProtectedRoute"));
const AnchorProtectedRoute = lazy(() => import("./components/AnchorProtectedRoute"));
const AnchorCustomerPage = lazy(() => import("./pages/AnochorLogin/AnchorCustomerPage"));
const SummeryOfDebitAndCredit = lazy(() => import("@/pages/bsa/SummaryOfDebitAndCredit"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const CashFlow = lazy(() => import("@/pages/bsa/cashFlow/CashFlow"));
const OverviewMonthlyWise = lazy(() => import("@/pages/bsa/OverviewMonthlyWise"));
const NotF = lazy(() => import("@/pages/404"));
const GstAnalysisPage = lazy(() => import("@/pages/gst/GstAnalysisPage"));
const GstHistoryPage = lazy(() => import("@/pages/gst/GstHistoryPage"));
const GstReportPage = lazy(() => import("@/components/gstReportPage"));
const ITRTaxCalculationPage = lazy(() => import("@/pages/itr/TaxCalculation"));
const ITRBalanceSheetPage = lazy(() => import("@/pages/itr/BalanceSheet"));
const ITRProfitAndLossStatementPage = lazy(() => import("@/pages/itr/ProfitAndLossStatement"));
const ITRRatioAnalysisPage = lazy(() => import("@/pages/itr/RatioAnalysis"));
const HelpCenterPage = lazy(() => import("@/pages/HelpCenter"));
const CibilCustDataFetching = lazy(() => import("@/pages/cibil/CibilCustDataFetching"));
const ProfileManagement = lazy(()=>import("@/pages/ProfileManagement"))
const CustomerPaymentsPage = lazy(() => import("@/pages/AnochorLogin/CustomerPaymentsPage"));


function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <ErrorBoundary>
              <Suspense
                fallback={
                  <div className="flex h-screen items-center justify-center bg-[#002366]">
                    <span className="h-10 w-10 rounded-full border-4 border-white/20 border-t-white animate-spin" />
                  </div>
                }
              >
                <Routes>
                  {/* Public routes */}
                  <Route element={<PublicRoute />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  </Route>

                  {/* Anchor Login Page */}
                  <Route path="/anchors/login" element={<AnchorLoginPage />} />
                  <Route path="/Anchors/login" element={<AnchorLoginPage />} />

                  {/* Admin Login Page */}
                  <Route path="/admins/login" element={<AdminLoginPage />} />
                  <Route path="/Admins/login" element={<AdminLoginPage />} />

                  {/* Admin Dashboard */}
                  <Route element={<AdminProtectedRoute />}>
                    <Route path="/admins" element={<Navigate to="/admins/user" replace />} />
                    <Route path="/Admins" element={<Navigate to="/admins/user" replace />} />
                    <Route path="/admins/dashboard" element={<Navigate to="/admins/user" replace />} />
                    <Route path="/admins/dashboard/:tab" element={<Navigate to="/admins/user" replace />} />
                    <Route path="/Admins/dashboard" element={<Navigate to="/admins/user" replace />} />
                    <Route path="/Admins/dashboard/:tab" element={<Navigate to="/admins/user" replace />} />
                    <Route path="/admins/:tab" element={<AdminDashboardPage />} />
                    <Route path="/Admins/:tab" element={<AdminDashboardPage />} />
                  </Route>

                  {/* Protected routes */}
                  <Route element={<AnchorProtectedRoute />}>
                    <Route path="/anchors/dashboard" element={<AnchorCustomerPage />} />
                    <Route path="/Anchors/dashboard" element={<AnchorCustomerPage />} />
                  </Route>
                  <Route element={<ProtectedRoute />}>
                    <Route element={<DashboardLayout />}>
                      <Route path="/home/dashboard" element={<DashboardPage />} />
                      <Route
                        path="/bsa/summary-of-debit-and-credit"
                        element={<SummeryOfDebitAndCredit />}
                      />
                      <Route path="/bsa/cash-flow" element={<CashFlow />} />
                      <Route
                        path="/bsa/overview-monthly-wise"
                        element={<OverviewMonthlyWise />}
                      />
                      <Route path="/gst/analysis" element={<GstAnalysisPage />} />
                      <Route path="/gst/history" element={<GstHistoryPage />} />
                      <Route path="/gst/reports" element={<GstReportPage />} />
                      <Route
                        path="/itr/itr-tax-calculation"
                        element={<ITRTaxCalculationPage />}
                      />
                      <Route
                        path="/itr/balance-sheet"
                        element={<ITRBalanceSheetPage />}
                      />
                      <Route
                        path="/itr/profit-and-loss-statement"
                        element={<ITRProfitAndLossStatementPage />}
                      />
                      <Route
                        path="/itr/ratio-analysis"
                        element={<ITRRatioAnalysisPage />}
                      />
                      <Route path="/profile" element={<ProfileManagement />} />
                      <Route path="/cibil" element={<CibilCustDataFetching />} />
                      <Route path="/cibil/reports" element={<ExistingReports />} />
                      <Route path="/cibil/view-report/:reference_id" element={<ViewReport />} />
                      <Route path="/payments" element={<CustomerPaymentsPage />} />
                      <Route path="/help-center" element={<HelpCenterPage />} />
                    </Route>
                  </Route>

                  {/* Default redirect */}
                  <Route path="/" element={<Navigate to="/login" replace />} />
                  <Route path="*" element={<NotF />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
      <Toaster position="top-center" richColors />
    </>
  );
}

export default App;
