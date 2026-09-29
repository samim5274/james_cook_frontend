import { createRouter, createWebHistory } from 'vue-router';

// Auth Routes
const Login = () => import('../components/Auth/login.vue');
const Register = () => import('../components/Auth/register.vue');
const SocialLogin = () => import('../components/Auth/SocialCallback.vue');
const FindAccount = () => import('../components/Auth/find-account.vue');
const otpVerification = () => import('../components/Auth/otp-verification.vue');
const resetPassword = () => import('../components/Auth/reset-password.vue');
const Unauthorized = () => import('../components/Auth/unauthorized.vue');






const AdminDashboard = () => import('../components/Dashboard/admin/admin-dashboard.vue');
const AdminProfile = () => import('../components/Dashboard/admin/admin-profile.vue');


// product import
const AdminProductList = () => import('../components/Dashboard/admin/product/product-list.vue');
const AdminCreateProduct = () => import('../components/Dashboard/admin/product/create-product.vue');
const AdminProductEdit = () => import('../components/Dashboard/admin/product/product-edit.vue');
const AdminProductSetting = () => import('../components/Dashboard/admin/product/product-setting.vue');




// Product Stock
const ProductStock = () => import('../components/Dashboard/admin/stock/product-stock.vue');
const StockReport = () => import('../components/Dashboard/admin/stock/report-stock.vue');
const StockReportPrint = () => import('../components/Dashboard/admin/stock/stock-report-print.vue');
const PurchaseProductStock = () => import('../components/Dashboard/admin/stock/purchase-product.vue');
const PurchaseList = () => import('../components/Dashboard/admin/stock/purchase-list.vue');
const PurchaseDetails = () => import('../components/Dashboard/admin/stock/purchase-order-details.vue');
const PurchaseInvoicePrint = () => import('../components/Dashboard/admin/stock/purchase-invoice-print.vue');








const SaleCart = () => import('../components/Dashboard/admin/cart/cart.vue');
const SaleOrderList = () => import('../components/Dashboard/admin/SaleReturn/order-list.vue');
const SaleReturn = () => import('../components/Dashboard/admin/SaleReturn/sale-return.vue');
const OrderList = () => import('../components/Dashboard/admin/order/order.vue');
const OrderDetails = () => import('../components/Dashboard/admin/order/order-details.vue');
const PrintInvoice = () => import('../components/Dashboard/admin/order/print/print-order-invoice-80mm.vue');
const PrintPaymentInvoice = () => import('../components/Dashboard/admin/order/print/print-payment-invoice-A4.vue');
const OrderPayment = () => import('../components/Dashboard/admin/order/order-payment.vue');
const DueList = () => import('../components/Dashboard/admin/payment/due-list.vue');
const DueDetails = () => import('../components/Dashboard/admin/payment/due-details.vue');






// Report File import
const SaleReport = () => import('../components/Dashboard/admin/reports/report-sale.vue');
const SaleReportDayByDay = () => import('../components/Dashboard/admin/reports/report-sale-day-by-day.vue');
const PurchaseReport = () => import('../components/Dashboard/admin/reports/report-purchase.vue');
const PaymentReport = () => import('../components/Dashboard/admin/reports/report-payment.vue');
const UserReport = () => import('../components/Dashboard/admin/reports/report-user-sale.vue');
const CustomerReport = () => import('../components/Dashboard/admin/reports/report-customer.vue');
const ProductSaleReport = () => import('../components/Dashboard/admin/reports/report-product-sale.vue');
const ProductBySaleReport = () => import('../components/Dashboard/admin/reports/report-product-by-sale.vue');
const CustomerDueReport = () => import('../components/Dashboard/admin/reports/report-customer-due.vue');
const SupplyerDueReport = () => import('../components/Dashboard/admin/reports/report-supplyers-due.vue');
const ExpenseReport = () => import('../components/Dashboard/admin/reports/report-expenses.vue');
const ProfitAndLossReport = () => import('../components/Dashboard/admin/reports/report-profit-loss.vue');
const AnalyticReport = () => import('../components/Dashboard/admin/reports/analysis.vue');








const C_Notice = () => import('../components/Dashboard/admin/notice/notice.vue');
const C_Notice_details = () => import('../components/Dashboard/admin/notice/customer-notice-details.vue');










const Expenses = () => import('../components/Dashboard/admin/Expense/expenses.vue');
const ExpensesPrint = () => import('../components/Dashboard/admin/Expense/print-expenses.vue')
const ExpensesDetails = () => import('../components/Dashboard/admin/Expense/expenses-details.vue')
const ExpensesSetting = () => import('../components/Dashboard/admin/Expense/expenses-setting.vue')











const routes = [
    // Auth Routes
    { path: '/login', component: Login, meta: {title: "Login - Mercuviax - Pos Software | Bangladesh's Best POS Software Company"} },
    { path: '/register/:refer_code?', component: Register, meta: {title: "Register - Mercuviax - Pos Software | Bangladesh's Best POS Software Company"} },
    { path: '/forget-password', component: FindAccount, meta: {title: "Forget Password - Mercuviax - Pos Software | Bangladesh's Best POS Software Company"} },
    { path: '/otp-verification', component: otpVerification, meta: {title: "OTP Verification - Mercuviax - Pos Software | Bangladesh's Best POS Software Company", requiresEmail: true} },
    { path: '/reset-password', component: resetPassword, meta: {title: "Reset Password - Mercuviax - Pos Software | Bangladesh's Best POS Software Company", requiresEmail: true} },
    { path: '/unauthorized', component: Unauthorized, meta: {title: "Unauthorized - Mercuviax - Pos Software | Bangladesh's Best POS Software Company"} },
    { path: "/auth/social", component: SocialLogin, meta: { title: "Social Login - Mercuviax - Pos Software | Bangladesh's Best POS Software Company" }},











    // Admin Route 
    { path: "/", component: AdminDashboard, meta: { title: "Dashboard - Mercuviax - Pos Software | Bangladesh's Best POS Software Company" }},

    { path: "/admin/dashboard", component: AdminDashboard, meta: { requiresAuth: true, roles: ['admin', 'super_admin'], title: "Admin Dashboard - Mercuviax - Pos Software | Bangladesh's Best POS Software Company" }},
    { path: "/admin/profile", component: AdminProfile, meta: { requiresAuth: true, roles: ['admin', 'super_admin'], title: "Profile - Mercuviax - Pos Software | Bangladesh's Best POS Software Company" }},
    

    // Product routes
    { path: "/admin/products", component: AdminProductList, meta: { requiresAuth: true, roles: ['admin', 'super_admin'], title: "Products List - Mercuviax - Pos Software | Bangladesh's Best POS Software Company" }},
    { path: "/admin/create-product", component: AdminCreateProduct, meta: { requiresAuth: true, roles: ['admin', 'super_admin'], title: "Create Product - Mercuviax - Pos Software | Bangladesh's Best POS Software Company" }},
    { path: "/admin/product/setting", component: AdminProductSetting, meta: { requiresAuth: true, roles: ['admin', 'super_admin'], title: "Product Settings - Mercuviax - Pos Software | Bangladesh's Best POS Software Company" }},
    { path: '/admin/product-edit/:slug', component: AdminProductEdit, meta: { requiresAuth: true, roles: ['admin', 'super_admin'], title: "Edit Product - Mercuviax - Pos Software | Bangladesh's Best POS Software Company" } },
    
    
    
    
    
    // Product stock
    { path: '/admin/product/stock', component: ProductStock, meta: { requiresAuth: true, roles: ['staff', 'admin', 'super_admin'], title: "Product Stock - Mercuviax - Pos Software | Bangladesh's Best POS Software Company" } },
    { path: '/admin/reports/stock', component: StockReport, meta: { requiresAuth: true, roles: ['staff', 'admin', 'super_admin'], title: "Stock Report's - Mercuviax - Pos Software | Bangladesh's Best POS Software Company" } },
    { path: '/admin/stock-report-print', component: StockReportPrint, meta: { requiresAuth: true, roles: ['staff', 'admin', 'super_admin'], title: "Stock Report Print's - Mercuviax - Pos Software | Bangladesh's Best POS Software Company" } },
    { path: '/admin/product/purchase/stock', component: PurchaseProductStock, meta: { requiresAuth: true, roles: ['staff', 'admin', 'super_admin'], title: "Purchase product stocks - Mercuviax - Pos Software | Bangladesh's Best POS Software Company" } },
    { path: '/admin/product/purchase/list', component: PurchaseList, meta: { requiresAuth: true, roles: ['staff', 'admin', 'super_admin'], title: "Purchase List - Mercuviax - Pos Software | Bangladesh's Best POS Software Company" } },
    { path: '/admin/purchase/details/:reg/:order_number/:slug', component: PurchaseDetails, meta: { requiresAuth: true, roles: ['staff', 'admin', 'super_admin'], title: "Purchase Details - Mercuviax - Pos Software | Bangladesh's Best POS Software Company" } },
    { path: '/admin/purchase/order/invoice-print/:reg', component: PurchaseInvoicePrint, meta: { requiresAuth: true, roles: ['staff', 'admin', 'super_admin'], title: "Purchase Invoice Print - Mercuviax - Pos Software | Bangladesh's Best POS Software Company" } },
    
    
    
    
    
    
    
    // Sale Cart
    { path: '/sale-cart', component: SaleCart, meta: { requiresAuth: true, roles: ['admin', 'super_admin', 'staff'], title: "Sale Cart - Mercuviax - Pos Software | Bangladesh's Best POS Software Company" } },
    { path: '/admin/orders', component: OrderList, meta: { requiresAuth: true, roles: ['admin', 'super_admin', 'staff'], title: "Order List - Mercuviax - Pos Software | Bangladesh's Best POS Software Company" } },
    { path: '/admin/orders/:reg/:slug', component: OrderDetails, meta: { requiresAuth: true, roles: ['admin', 'super_admin', 'staff'], title: "Order Details - Mercuviax - Pos Software | Bangladesh's Best POS Software Company" } },
    // Print invoice
    { path: '/admin/order/invoice-print/:reg', component: PrintInvoice, meta: {requiresAuth: true, roles: ['admin', 'super_admin', 'staff'], title: "Print Order Details"}},
    { path: '/admin/order/payment/invoice-print/:payment_number/:order_id', component: PrintPaymentInvoice, meta: {requiresAuth: true, roles: ['admin', 'super_admin', 'staff'], title: "Print Order Payment Details"}},
    { path: '/admin/orders/payment', component: OrderPayment, meta: {requiresAuth: true, roles: ['admin', 'super_admin', 'staff'], title: "Order Payment Details"}},
    { path: '/admin/sale/order', component: SaleOrderList, meta: { requiresAuth: true, roles: ['admin', 'super_admin', 'staff'], title: "Sale Order - Mercuviax - Pos Software | Bangladesh's Best POS Software Company" } },
    { path: '/admin/sale/order/return/:reg/:slug', component: SaleReturn, meta: { requiresAuth: true, roles: ['admin', 'super_admin', 'staff'], title: "Sale Return - Mercuviax - Pos Software | Bangladesh's Best POS Software Company" } },
     
    // Sale Report
    { path: '/admin/reports/sale', component: SaleReport, meta: {requiresAuth: true, roles: ['admin', 'super_admin', 'staff'], title: "Sale Reports"}},
    { path: '/admin/reports/sale/day-by-day', component: SaleReportDayByDay, meta: {requiresAuth: true, roles: ['admin', 'super_admin', 'staff'], title: "Sale Reports Day By Day"}},
    { path: '/admin/reports/purchase', component: PurchaseReport, meta: {requiresAuth: true, roles: ['admin', 'super_admin', 'staff'], title: "Purchase Report's"}},
    { path: '/admin/reports/payment', component: PaymentReport, meta: {requiresAuth: true, roles: ['admin', 'super_admin', 'staff'], title: "Payments Reports"}},
    { path: '/admin/reports/user/sale', component: UserReport, meta: {requiresAuth: true, roles: ['admin', 'super_admin', 'staff'], title: "User Sale Reports"}},
    { path: '/admin/reports/customer', component: CustomerReport, meta: {requiresAuth: true, roles: ['admin', 'super_admin', 'staff'], title: "Customer Due Report's"}},
    { path: '/admin/reports/product-sales', component: ProductSaleReport, meta: {requiresAuth: true, roles: ['admin', 'super_admin', 'staff'], title: "Product Sale Report's"}},
    { path: '/admin/reports/product-by-sales', component: ProductBySaleReport, meta: {requiresAuth: true, roles: ['admin', 'super_admin', 'staff'], title: "Product By Sale Report's"}},
    { path: '/admin/reports/customer-due', component: CustomerDueReport, meta: {requiresAuth: true, roles: ['admin', 'super_admin', 'staff'], title: "Customer Due Report's"}},
    { path: '/admin/reports/supplier-due', component: SupplyerDueReport, meta: {requiresAuth: true, roles: ['admin', 'super_admin', 'staff'], title: "Supplyer Due Report's"}},
    { path: '/admin/reports/expense', component: ExpenseReport, meta: {requiresAuth: true, roles: ['admin', 'super_admin', 'staff'], title: "Expenses Report's"}},
    { path: '/admin/reports/profit-loss', component: ProfitAndLossReport, meta: {requiresAuth: true, roles: ['admin', 'super_admin', 'staff'], title: "Profit & Loss"}},
    { path: '/admin/reports/analytics', component: AnalyticReport, meta: {requiresAuth: true, roles: ['admin', 'super_admin', 'staff'], title: "Analytics Report"}},
    
    
    // Due Routes
    { path: '/admin/payment/due', component: DueList, meta: {requiresAuth: true, roles: ['admin', 'super_admin', 'staff'], title: "Due List"}},
    { path: '/admin/payment/due/details/:reg/:slug', component: DueDetails, meta: {requiresAuth: true, roles: ['admin', 'super_admin', 'staff'], title: "Due Details"}},










    { path: '/admin/notice', component: C_Notice, meta:{title: 'Notice', requiresAuth: true, roles: ['staff', 'admin', 'super_admin']}},
    { path: '/admin/notice/:id/details', component: C_Notice_details, meta:{title: 'Notice Details', requiresAuth: true, roles: ['staff', 'admin', 'super_admin']}},
    
    
    
    
    
    
    
    
    
    
    { path: '/admin/expenses', component: Expenses, meta:{title: 'Expenses', requiresAuth: true, roles: ['staff', 'admin', 'super_admin']}},
    { path: '/admin/expenses/print/:id', component: ExpensesPrint, meta:{title: 'Expenses Print', requiresAuth: true, roles: ['staff', 'admin', 'super_admin']}},
    { path: '/admin/expenses/details/:id', component: ExpensesDetails, meta:{title: 'Expenses Details', requiresAuth: true, roles: ['staff', 'admin', 'super_admin']}},
    { path: '/admin/expenses/setting', component: ExpensesSetting, meta:{title: 'Expenses Setting', requiresAuth: true, roles: ['staff', 'admin', 'super_admin']}},

    
]












const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_BASE_URL || '/'),
    routes,

    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        }

        return {
            top: 0,
            behavior: "smooth",
        };
    },
});








// security check
router.beforeEach((to, from, next) => {
  
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem('user'));

    // Set page title
    if (to.meta.title) {
        document.title = to.meta.title;
    }

    // Check if route requires email
    if (to.meta.requiresEmail) {
        const email = localStorage.getItem('email')
        if (!email) {
        // Email not found, redirect to forget-password
        return next('/forget-password');
        }
    }

    if (to.meta.requiresAuth && !token) {
        return next('/login');
    }

    // console.log(to.meta.roles);
    if (to.meta.roles) {
        if (!user) {
        return next('/login');
        }

        if (!to.meta.roles.includes(user.role)) {
        return next('/unauthorized');
        }
    }

    next();
});

export default router