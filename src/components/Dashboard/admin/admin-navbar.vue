```vue
<template>
    <!-- Mobile Overlay -->
    <div
        v-show="mobileMenu"
        class="fixed inset-0 z-40 bg-black/40 dark:bg-black/60 lg:hidden"
        @click="$emit('close')"
    ></div>

    <!-- Sidebar -->
    <aside
        class="fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-200
            lg:static lg:translate-x-0 lg:h-auto overflow-y-auto
            bg-white text-slate-900 border-r border-slate-200
            dark:bg-slate-900 dark:text-slate-100 dark:border-white/10"
        :class="mobileMenu ? 'translate-x-0' : '-translate-x-full'"
    >
        <nav class="p-3">
            <ul class="space-y-1">

                <!-- Main -->
                <li class="px-3 pt-1 pb-2">
                    <span class="section-title">Main</span>
                </li>

                <li>
                    <button
                        type="button"
                        class="menu-item"
                        :class="activeKey === 'dashboard' ? activeMenu : ''"
                        @click="pick('dashboard')"
                    >
                        <span class="menu-icon"><i class="fa-solid fa-house"></i></span>
                        <span class="menu-title">Dashboard</span>
                    </button>
                </li>

                <li>
                    <button
                        type="button"
                        class="menu-item"
                        :class="activeKey === 'profile' ? activeMenu : ''"
                        @click="pick('profile')"
                    >
                        <span class="menu-icon"><i class="fa-regular fa-circle-user"></i></span>
                        <span class="menu-title">Profile</span>
                    </button>
                </li>

                <li>
                    <button
                        type="button"
                        class="menu-item"
                        :class="activeKey === 'cart' ? activeMenu : ''"
                        @click="pick('cart')"
                    >
                        <span class="menu-icon"><i class="fa-solid fa-cart-plus"></i></span>
                        <span class="menu-title">Cart</span>
                    </button>
                </li>

                <li>
                    <button
                        type="button"
                        class="menu-item"
                        :class="activeKey === 'dueCollection' ? activeMenu : ''"
                        @click="pick('dueCollection')"
                    >
                        <span class="menu-icon"><i class="fa-solid fa-coins"></i></span>
                        <span class="menu-title">Due Collection</span>
                    </button>
                </li>

                <!-- <li>
                    <button
                        type="button"
                        class="menu-item"
                        :class="activeKey === 'saleReturn' ? activeMenu : ''"
                        @click="pick('saleReturn')"
                    >
                        <span class="menu-icon"><i class="fa-solid fa-arrow-rotate-left"></i></span>
                        <span class="menu-title">Sale Return</span>
                    </button>
                </li> -->

                <!-- Products -->
                <li class="px-3 pt-4 pb-2">
                    <span class="section-title">Products</span>
                </li>

                <li>
                    <button
                        type="button"
                        class="dropdown-menu"
                        :class="pagesOpen ? dropdownActive : ''"
                        @click="pagesOpen = !pagesOpen"
                    >
                        <span class="menu-icon">
                            <i class="fa-regular fa-folder-open"></i>
                        </span>
                        <span class="menu-title">Product Details</span>
                        <svg
                            class="h-4 w-4 opacity-70 transition-transform"
                            :class="pagesOpen ? 'rotate-180' : ''"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-width="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>

                    <div v-show="pagesOpen" class="submenu">
                        <ul class="py-1">
                            <li>
                                <button
                                    type="button"
                                    class="submenu-item"
                                    :class="activeKey === 'products' ? submenuActive : ''"
                                    @click="pick('products')"
                                >
                                    <i class="fa-solid fa-list"></i>
                                    Product List
                                </button>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    class="submenu-item"
                                    :class="activeKey === 'create' ? submenuActive : ''"
                                    @click="pick('create')"
                                >
                                    <i class="fa-solid fa-plus"></i>
                                    Create Product
                                </button>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    class="submenu-item"
                                    :class="activeKey === 'product_setting' ? submenuActive : ''"
                                    @click="pick('product_setting')"
                                >
                                    <i class="fa-solid fa-sliders"></i>
                                    Product Settings
                                </button>
                            </li>
                        </ul>
                    </div>
                </li>

                <!-- Inventory -->
                <li class="pt-1">
                    <button
                        type="button"
                        class="dropdown-menu"
                        :class="stockPagesOpen ? dropdownActive : ''"
                        @click="stockPagesOpen = !stockPagesOpen"
                    >
                        <span class="menu-icon">
                            <i class="fa-solid fa-warehouse"></i>
                        </span>
                        <span class="menu-title">Inventory</span>
                        <svg
                            class="h-4 w-4 opacity-70 transition-transform"
                            :class="stockPagesOpen ? 'rotate-180' : ''"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-width="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>

                    <div v-show="stockPagesOpen" class="submenu">
                        <ul class="py-1">
                            <li>
                                <button
                                    type="button"
                                    class="submenu-item"
                                    :class="activeKey === 'product_stock' ? submenuActive : ''"
                                    @click="pick('product_stock')"
                                >
                                    <i class="fa-solid fa-boxes-stacked"></i>
                                    Stock In
                                </button>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    class="submenu-item"
                                    :class="activeKey === 'purchase_product' ? submenuActive : ''"
                                    @click="pick('purchase_product')"
                                >
                                    <i class="fa-solid fa-cart-shopping"></i>
                                    Purchase
                                </button>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    class="submenu-item"
                                    :class="activeKey === 'purchase_list' ? submenuActive : ''"
                                    @click="pick('purchase_list')"
                                >
                                    <i class="fa-solid fa-clipboard-list"></i>
                                    Purchase List
                                </button>
                            </li>
                        </ul>
                    </div>
                </li>

                <!-- Orders -->
                <li class="pt-1">
                    <button
                        type="button"
                        class="dropdown-menu"
                        :class="orderPagesOpen ? dropdownActive : ''"
                        @click="orderPagesOpen = !orderPagesOpen"
                    >
                        <span class="menu-icon">
                            <i class="fa-solid fa-check-to-slot"></i>
                        </span>
                        <span class="menu-title">Orders</span>
                        <svg
                            class="h-4 w-4 opacity-70 transition-transform"
                            :class="orderPagesOpen ? 'rotate-180' : ''"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-width="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>

                    <div v-show="orderPagesOpen" class="submenu">
                        <ul class="py-1">
                            <li>
                                <button
                                    type="button"
                                    class="submenu-item"
                                    :class="activeKey === 'orders' ? submenuActive : ''"
                                    @click="pick('orders')"
                                >
                                    <i class="fa-solid fa-receipt"></i>
                                    Orders
                                </button>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    class="submenu-item"
                                    :class="activeKey === 'order_payment' ? submenuActive : ''"
                                    @click="pick('order_payment')"
                                >
                                    <i class="fa-solid fa-money-bill"></i>
                                    Payment
                                </button>
                            </li>
                        </ul>
                    </div>
                </li>

                <!-- Expenses -->
                <!-- <li class="pt-1">
                    <button
                        type="button"
                        class="dropdown-menu"
                        :class="expensesPagesOpen ? dropdownActive : ''"
                        @click="expensesPagesOpen = !expensesPagesOpen"
                    >
                        <span class="menu-icon">
                            <i class="fa-solid fa-hand-holding-dollar"></i>
                        </span>
                        <span class="menu-title">Expenses</span>
                        <svg
                            class="h-4 w-4 opacity-70 transition-transform"
                            :class="expensesPagesOpen ? 'rotate-180' : ''"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-width="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>

                    <div v-show="expensesPagesOpen" class="submenu">
                        <ul class="py-1">
                            <li>
                                <button
                                    type="button"
                                    class="submenu-item"
                                    :class="activeKey === 'expenses' ? submenuActive : ''"
                                    @click="pick('expenses')"
                                >
                                    <i class="fa-solid fa-money-bill-wave"></i>
                                    Expenses
                                </button>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    class="submenu-item"
                                    :class="activeKey === 'SettingExpenses' ? submenuActive : ''"
                                    @click="pick('SettingExpenses')"
                                >
                                    <i class="fa-solid fa-gear"></i>
                                    Settings
                                </button>
                            </li>
                        </ul>
                    </div>
                </li> -->

                <!-- Notice -->
                <!-- <li class="pt-1">
                    <button
                        type="button"
                        class="menu-item"
                        :class="activeKey === 'notice' ? activeMenu : ''"
                        @click="pick('notice')"
                    >
                        <span class="menu-icon">
                            <i class="fa-solid fa-bell"></i>
                        </span>
                        <span class="menu-title">Notice</span>
                    </button>
                </li> -->

                <!-- Reports -->
                <li class="px-3 pt-4 pb-2">
                    <span class="section-title">Reports & Analytics</span>
                </li>

                <li>
                    <button
                        type="button"
                        class="dropdown-menu"
                        :class="reportPagesOpen ? dropdownActive : ''"
                        @click="reportPagesOpen = !reportPagesOpen"
                    >
                        <span class="menu-icon">
                            <i class="fa-solid fa-chart-line"></i>
                        </span>
                        <span class="menu-title">Reports</span>
                        <svg
                            class="h-4 w-4 opacity-70 transition-transform"
                            :class="reportPagesOpen ? 'rotate-180' : ''"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-width="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>

                    <div v-show="reportPagesOpen" class="submenu">
                        <ul class="py-2">

                            <li class="px-4 pb-1">
                                <span class="report-section-title">Sales & Purchase</span>
                            </li>

                            <li>
                                <button
                                    type="button"
                                    class="submenu-item"
                                    :class="activeKey === 'report_sale' ? submenuActive : ''"
                                    @click="pick('report_sale')"
                                >
                                    <i class="fa-solid fa-cart-shopping"></i>
                                    Sales Report
                                </button>
                            </li>

                            <li>
                                <button
                                    type="button"
                                    class="submenu-item"
                                    :class="activeKey === 'report_sale_day_by_day' ? submenuActive : ''"
                                    @click="pick('report_sale_day_by_day')"
                                >
                                    <i class="fa-solid fa-dolly"></i>
                                    Sales Report Day By Day
                                </button>
                            </li>

                            <li>
                                <button
                                    type="button"
                                    class="submenu-item"
                                    :class="activeKey === 'report_purchase' ? submenuActive : ''"
                                    @click="pick('report_purchase')"
                                >
                                    <i class="fa-solid fa-bag-shopping"></i>
                                    Purchase Report
                                </button>
                            </li>

                            <li>
                                <button
                                    type="button"
                                    class="submenu-item"
                                    :class="activeKey === 'report_product_sales' ? submenuActive : ''"
                                    @click="pick('report_product_sales')"
                                >
                                    <i class="fa-solid fa-chart-column"></i>
                                    Product-wise Sales
                                </button>
                            </li>

                            <li>
                                <button
                                    type="button"
                                    class="submenu-item"
                                    :class="activeKey === 'report_product_by_sale' ? submenuActive : ''"
                                    @click="pick('report_product_by_sale')"
                                >
                                    <i class="fa-solid fa-box-open"></i>
                                    Product by Sales
                                </button>
                            </li>

                            <li class="my-2">
                                <hr class="border-slate-300 dark:border-slate-700">
                            </li>

                            <li class="px-4 pb-1">
                                <span class="report-section-title">Customer & Supplier</span>
                            </li>

                            <li>
                                <button
                                    type="button"
                                    class="submenu-item"
                                    :class="activeKey === 'report_customer' ? submenuActive : ''"
                                    @click="pick('report_customer')"
                                >
                                    <i class="fa-solid fa-users"></i>
                                    Customer Report
                                </button>
                            </li>

                            <li>
                                <button
                                    type="button"
                                    class="submenu-item"
                                    :class="activeKey === 'report_customer_due' ? submenuActive : ''"
                                    @click="pick('report_customer_due')"
                                >
                                    <i class="fa-solid fa-hand-holding-dollar"></i>
                                    Customer Due
                                </button>
                            </li>

                            <li>
                                <button
                                    type="button"
                                    class="submenu-item"
                                    :class="activeKey === 'report_supplier_due' ? submenuActive : ''"
                                    @click="pick('report_supplier_due')"
                                >
                                    <i class="fa-solid fa-truck"></i>
                                    Supplier Due
                                </button>
                            </li>

                            <li class="my-2">
                                <hr class="border-slate-300 dark:border-slate-700">
                            </li>

                            <li class="px-4 pb-1">
                                <span class="report-section-title">Inventory</span>
                            </li>

                            <li>
                                <button
                                    type="button"
                                    class="submenu-item"
                                    :class="activeKey === 'report_stock' ? submenuActive : ''"
                                    @click="pick('report_stock')"
                                >
                                    <i class="fa-solid fa-boxes-stacked"></i>
                                    Stock Report
                                </button>
                            </li>

                            <li class="my-2">
                                <hr class="border-slate-300 dark:border-slate-700">
                            </li>

                            <li class="px-4 pb-1">
                                <span class="report-section-title">Finance & Accounting</span>
                            </li>

                            <li>
                                <button
                                    type="button"
                                    class="submenu-item"
                                    :class="activeKey === 'report_payment' ? submenuActive : ''"
                                    @click="pick('report_payment')"
                                >
                                    <i class="fa-solid fa-money-bill-transfer"></i>
                                    Payment Report
                                </button>
                            </li>

                            <li>
                                <button
                                    type="button"
                                    class="submenu-item"
                                    :class="activeKey === 'report_expense' ? submenuActive : ''"
                                    @click="pick('report_expense')"
                                >
                                    <i class="fa-solid fa-receipt"></i>
                                    Expense Report
                                </button>
                            </li>

                            <li>
                                <button
                                    type="button"
                                    class="submenu-item"
                                    :class="activeKey === 'report_profit_loss' ? submenuActive : ''"
                                    @click="pick('report_profit_loss')"
                                >
                                    <i class="fa-solid fa-chart-pie"></i>
                                    Profit & Loss
                                </button>
                            </li>

                            <li class="my-2">
                                <hr class="border-slate-300 dark:border-slate-700">
                            </li>

                            <li class="px-4 pb-1">
                                <span class="report-section-title">Users</span>
                            </li>

                            <li>
                                <button
                                    type="button"
                                    class="submenu-item"
                                    :class="activeKey === 'report_user' ? submenuActive : ''"
                                    @click="pick('report_user')"
                                >
                                    <i class="fa-solid fa-user-group"></i>
                                    User Report
                                </button>
                            </li>

                            <li class="mt-1">
                                <button
                                    type="button"
                                    class="submenu-item"
                                    :class="activeKey === 'report_analytics' ? submenuActive : ''"
                                    @click="pick('report_analytics')"
                                >
                                    <i class="fa-solid fa-chart-line"></i>
                                    Business Analytics
                                </button>
                            </li>

                        </ul>
                    </div>
                </li>

                <!-- System -->
                <li class="px-3 pt-4 pb-2">
                    <span class="section-title">System</span>
                </li>

                <!-- <li>
                    <button
                        type="button"
                        class="menu-item"
                        :class="activeKey === 'setting' ? activeMenu : ''"
                        @click="pick('setting')"
                    >
                        <span class="menu-icon">
                            <i class="fa-solid fa-gear"></i>
                        </span>
                        <span class="menu-title">Settings</span>
                    </button>
                </li> -->

                <li class="pt-1">
                    <button
                        type="button"
                        class="menu-item hover:text-red-600 dark:hover:text-red-400"
                        @click="pick('logout')"
                    >
                        <span class="menu-icon">
                            <i class="fa-solid fa-arrow-right-from-bracket"></i>
                        </span>
                        <span class="menu-title">Logout</span>
                    </button>
                </li>

            </ul>
        </nav>
    </aside>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../../../services/api";
import { useAuth } from "../../../stores/auth";

const { loadUser, logout: authLogout } = useAuth();

defineProps({
    mobileMenu: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["close", "update:modelValue", "navigate"]);
const route = useRoute();
const router = useRouter();

const pagesOpen = ref(false);
const stockPagesOpen = ref(false);
const orderPagesOpen = ref(false);
const reportPagesOpen = ref(false);
const expensesPagesOpen = ref(false);

const activeMenu =
    "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 " +
    "dark:bg-white/10 dark:text-white dark:ring-white/10";

const dropdownActive =
    "bg-slate-100 ring-1 ring-slate-200 " +
    "dark:bg-white/10 dark:ring-white/10";

const submenuActive =
    "bg-white text-slate-900 font-medium " +
    "dark:bg-white/10 dark:text-white";

const routeMap = {
    dashboard: "/admin/dashboard",
    profile: "/admin/profile",
    cart: "/sale-cart",
    dueCollection: "/admin/payment/due",
    saleReturn: "/admin/sale/order",

    products: "/admin/products",
    create: "/admin/create-product",
    product_setting: "/admin/product/setting",

    product_stock: "/admin/product/stock",
    purchase_product: "/admin/product/purchase/stock",
    purchase_list: "/admin/product/purchase/list",

    orders: "/admin/orders",
    order_payment: "/admin/orders/payment",

    report_sale: "/admin/reports/sale",
    report_sale_day_by_day: "/admin/reports/sale/day-by-day",
    report_purchase: "/admin/reports/purchase",
    report_product_by_sale: "/admin/reports/product-by-sales",
    report_product_sales: "/admin/reports/product-sales",
    report_payment: "/admin/reports/payment",
    report_user: "/admin/reports/user/sale",
    report_customer_due: "/admin/reports/customer-due",
    report_customer: "/admin/reports/customer",
    report_supplier_due: "/admin/reports/supplier-due",
    report_stock: "/admin/reports/stock",
    report_expense: "/admin/reports/expense",
    report_profit_loss: "/admin/reports/profit-loss",
    report_analytics: "/admin/reports/analytics",

    notice: "/admin/notice",
    expenses: "/admin/expenses",
    SettingExpenses: "/admin/expenses/setting",
    setting: "/admin/setting",
    logout: "/login",
};

const routeMatch = [
    { key: "dashboard", prefixes: ["/admin/dashboard"] },
    { key: "profile", prefixes: ["/admin/profile"] },
    { key: "cart", prefixes: ["/sale-cart"] },
    { key: "dueCollection", prefixes: ["/admin/payment/due"] },
    { key: "saleReturn", prefixes: ["/admin/sale/order", "/admin/sale/order/return/"] },

    { key: "products", prefixes: ["/admin/products", "/admin/product-edit"] },
    { key: "create", prefixes: ["/admin/create-product"] },
    { key: "product_setting", prefixes: ["/admin/product/setting"] },

    { key: "product_stock", prefixes: ["/admin/product/stock"] },
    { key: "purchase_product", prefixes: ["/admin/product/purchase/stock"] },
    { key: "purchase_list", prefixes: ["/admin/product/purchase/list", "/admin/purchase/details"] },

    { key: "order_payment", prefixes: ["/admin/orders/payment"] },
    { key: "orders", prefixes: ["/admin/orders", "/admin/customer-details/"] },

    { key: "report_sale_day_by_day", prefixes: ["/admin/reports/sale/day-by-day"] },
    { key: "report_product_by_sale", prefixes: ["/admin/reports/product-by-sales"] },
    { key: "report_sale", prefixes: ["/admin/reports/sale"] },
    { key: "report_purchase", prefixes: ["/admin/reports/purchase"] },
    { key: "report_product_sales", prefixes: ["/admin/reports/product-sales"] },
    { key: "report_payment", prefixes: ["/admin/reports/payment"] },
    { key: "report_user", prefixes: ["/admin/reports/user/sale"] },
    { key: "report_customer_due", prefixes: ["/admin/reports/customer-due"] },
    { key: "report_customer", prefixes: ["/admin/reports/customer"] },
    { key: "report_supplier_due", prefixes: ["/admin/reports/supplier-due"] },
    { key: "report_stock", prefixes: ["/admin/reports/stock"] },
    { key: "report_expense", prefixes: ["/admin/reports/expense"] },
    { key: "report_profit_loss", prefixes: ["/admin/reports/profit-loss"] },
    { key: "report_analytics", prefixes: ["/admin/reports/analytics"] },

    { key: "notice", prefixes: ["/admin/notice"] },
    { key: "SettingExpenses", prefixes: ["/admin/expenses/setting"] },
    { key: "expenses", prefixes: ["/admin/expenses"] },
    { key: "setting", prefixes: ["/admin/setting"] },
    { key: "logout", prefixes: ["/logout"] },
];

const activeKey = computed(() => {
    const path = route.path;

    const hit = routeMatch.find(item =>
        item.prefixes.some(prefix => path.startsWith(prefix))
    );

    return hit?.key ?? "dashboard";
});

async function pick(key) {
    emit("update:modelValue", key);
    emit("navigate", key);

    if (key === "logout") {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            // Ignore logout API error.
        } finally {
            authLogout();
            emit("close");
            return router.push("/login");
        }
    }

    const targetRoute = routeMap[key];

    if (targetRoute && route.path !== targetRoute) {
        await router.push(targetRoute);
    }

    emit("close");
}

watch(
    activeKey,
    key => {
        const productKeys = [
            "products",
            "create",
            "product_setting",
        ];

        const inventoryKeys = [
            "product_stock",
            "purchase_product",
            "purchase_list",
        ];

        const orderKeys = [
            "orders",
            "order_payment",
        ];

        const expenseKeys = [
            "expenses",
            "SettingExpenses",
        ];

        const reportKeys = [
            "report_sale",
            "report_product_by_sale",
            "report_sale_day_by_day",
            "report_purchase",
            "report_product_sales",
            "report_payment",
            "report_user",
            "report_customer_due",
            "report_customer",
            "report_supplier_due",
            "report_stock",
            "report_expense",
            "report_profit_loss",
            "report_analytics",
        ];

        pagesOpen.value = productKeys.includes(key);
        stockPagesOpen.value = inventoryKeys.includes(key);
        orderPagesOpen.value = orderKeys.includes(key);
        expensesPagesOpen.value = expenseKeys.includes(key);
        reportPagesOpen.value = reportKeys.includes(key);
    },
    { immediate: true }
);

onMounted(loadUser);
</script>

<style scoped>
.menu-item,
.dropdown-menu {
    @apply w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left
        transition focus:outline-none focus:ring-2 focus:ring-slate-500/40
        hover:bg-slate-100 dark:hover:bg-white/10;
}

.menu-item .menu-icon,
.dropdown-menu .menu-icon {
    @apply w-5 text-center opacity-90 shrink-0;
}

.menu-title {
    @apply text-sm font-medium flex-1;
}

.dropdown-menu {
    @apply cursor-pointer;
}

.submenu {
    @apply mt-1 ml-6 mr-2 rounded-xl ring-1 bg-slate-50 ring-slate-200
        dark:bg-black/20 dark:ring-white/10;
}

.submenu-item {
    @apply w-full flex items-center gap-3 px-4 py-2 text-sm text-left
        transition hover:bg-white dark:hover:bg-white/10;
}

.submenu-item i {
    @apply w-4 text-center opacity-60 text-xs;
}

.section-title,
.report-section-title {
    @apply text-[10px] font-semibold uppercase tracking-wider
        text-slate-400 dark:text-slate-500;
}
</style>    