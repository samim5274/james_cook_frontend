<template>
    <!-- A4 Print Wrapper -->
    <div class="a4-invoice">

        <!-- ================= HEADER (80mm style, scaled for A4) ================= -->
        <div class="header text-center">
            <h1>James Cook Bakery Cafe</h1>
            <p>House#15, Road#03, Nikunja-2, Dhaka-1229</p>
            <p class="meta">+8801856668991</p>
        </div>

        <div class="dashed-line thin"></div>

        <!-- Invoice Title & Meta -->
        <div class="invoice-meta-bar" v-if="order">
            <div class="meta-bar-top">
                <span class="inv-title">INVOICE</span>
                <span class="inv-sub">#{{ order.reg ?? 'N/A' }}</span>
            </div>

            <div class="meta-grid">
                <div class="meta-col">
                    <div class="row"><span class="label">Order No:</span><span class="value">{{ order.order_number ?? 'N/A' }}</span></div>
                    <div class="row"><span class="label">Date:</span><span class="value">{{ formatDate(order.order_date) }}</span></div>
                </div>
                <div class="meta-col">
                    <div class="row"><span class="label">Prepared By:</span><span class="value">{{ order?.user?.name ?? '-' }}</span></div>
                    <div class="row"><span class="label">Payment:</span><span class="value capitalize">{{ getPaymentMethod(order.payment_method)?.label ?? 'N/A' }}</span></div>
                </div>
                <div class="meta-col">
                    <div class="row"><span class="label">Status:</span><span class="value">{{ formatStatus(order.status) }}</span></div>
                </div>
            </div>
        </div>

        <div class="dashed-line thin"></div>

        <!-- ================= BILL TO / SUPPLIER ================= -->
        <div class="parties-grid" v-if="order">
            <div class="party-box party-box--supplier">
                <p class="party-title">Bill From (Supplier)</p>
                <p class="party-name">{{ order.supplier?.name || order.supplier_name || 'N/A' }}</p>
                <p v-if="order.supplier?.company_name">{{ order.supplier.company_name }}</p>
                <p v-if="order.supplier?.phone || order.supplier_phone">Phone: {{ order.supplier?.phone || order.supplier_phone }}</p>
                <p v-if="order.supplier?.email">Email: {{ order.supplier.email }}</p>
                <p v-if="fullSupplierAddress">{{ fullSupplierAddress }}</p>
            </div>

            <div class="party-box party-box--customer">
                <p class="party-title">Bill To (Customer)</p>
                <p class="party-name">{{ order.supplier_name || 'N/A' }}</p>
                <p v-if="order.supplier_phone">Phone: {{ order.supplier_phone }}</p>
            </div>
        </div>

        <div class="dashed-line thin"></div>

        <div class="dashed-line"></div>

        <!-- ================= ITEMS TABLE ================= -->
        <table class="items-table" v-if="cartItems && cartItems.length">
            <thead>
                <tr>
                    <th class="col-sl">#</th>
                    <th class="col-name">Item</th>
                    <th class="col-qty text-center">Qty</th>
                    <th class="col-price text-right">Unit Price</th>
                    <th class="col-total text-right">Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, idx) in cartItems" :key="item.id ?? idx">
                    <td class="col-sl">{{ idx + 1 }}</td>
                    <td class="col-name">
                        <div class="item-title">{{ item.product?.name || item.product_name || 'Product' }}</div>
                        <div v-if="item.variant?.name" class="item-sub">Variant: {{ item.variant.name }}</div>
                        <div v-if="item.note" class="item-sub">Note: {{ item.note }}</div>
                    </td>
                    <td class="col-qty text-center">{{ item.quantity ?? 1 }}</td>
                    <td class="col-price text-right">{{ formatMoney(item.unit_price ?? item.price) }}</td>
                    <td class="col-total text-right">
                        {{ formatMoney(
                            item.subtotal ??
                            item.payable_amount ??
                            (((item.unit_price ?? item.price ?? 0) - (item.discount ?? 0)) * (item.quantity ?? 1))
                        ) }}
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-else class="empty-items">No items found for this order.</div>

        <!-- ================= SUMMARY ================= -->
        <div class="summary-wrap" v-if="order">
            <div class="summary-left">
                <div class="notes-box" v-if="order.remarks">
                    <p class="notes-title">Order Remarks</p>
                    <p class="notes-text">{{ order.remarks }}</p>
                </div>
                <div class="notes-box" v-if="order.supplier?.notes">
                    <p class="notes-title">Supplier Note</p>
                    <p class="notes-text">{{ order.supplier.notes }}</p>
                </div>
            </div>

            <div class="summary-right">
                <div class="row"><span class="label">Subtotal:</span><span class="value">৳{{ formatMoney(order.subtotal) }}</span></div>
                <div class="row" v-if="Number(order.discount) > 0"><span class="label">Discount:</span><span class="value">-৳{{ formatMoney(order.discount) }}</span></div>
                <div class="row" v-if="Number(order.vat) > 0"><span class="label">VAT ({{ order.vat_percentage ?? 0 }}%):</span><span class="value">৳{{ formatMoney(order.vat) }}</span></div>
                <div class="row" v-if="Number(order.coupon_discount) > 0"><span class="label">Coupon Discount:</span><span class="value">-৳{{ formatMoney(order.coupon_discount) }}</span></div>

                <div class="dashed-line thin"></div>

                <div class="row bold total-row">
                    <span class="label">Total Payable:</span>
                    <span class="value">৳{{ formatMoney(order.payable_amount) }}</span>
                </div>
                <!-- <div class="row"><span class="label">Paid Amount:</span><span class="value">৳{{ formatMoney(paidAmount) }}</span></div>
                <div class="row bold due-row" v-if="Number(order.due_amount) > 0">
                    <span class="label">Due Amount:</span>
                    <span class="value">৳{{ formatMoney(order.due_amount) }}</span>
                </div>
                <div class="paid-badge" v-else>Fully Paid</div> -->
            </div>
        </div>

        <div class="dashed-line"></div>

        <!-- ================= PAYMENT HISTORY ================= -->
        <div class="payment-history" v-if="payments && payments.length">
            <p class="section-title">Payment History</p>
            <table class="payment-table">
                <thead>
                    <tr>
                        <th class="col-sl">#</th>
                        <th class="col-pnum">Payment No.</th>
                        <th class="col-method">Method</th>
                        <th class="col-date">Paid At</th>
                        <th class="col-by">Received By</th>
                        <th class="col-type">Discount</th>
                        <th class="col-amount text-right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, idx) in payments" :key="item.id ?? idx">
                        <td class="col-sl">{{ idx + 1 }}</td>
                        <td class="col-pnum">{{ item.payment_number || item.receipt_no || `#${idx + 1}` }}</td>
                        <td class="col-method capitalize">{{ item.payment_method || 'N/A' }}</td>
                        <td class="col-date">{{ item.paid_at ? formatDateTime(item.paid_at) : '-' }}</td>
                        <td class="col-by">{{ item.user?.name || 'N/A' }}</td>
                        <td class="col-type capitalize">-৳{{ item.discount || '-' }}</td>
                        <td class="col-amount text-right">৳{{ formatMoney(item.amount) }}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr class="bold">
                        <td colspan="6" class="text-right">Total Paid:</td>
                        <td class="text-right">৳{{ formatMoney(totalPaidFromHistory) }}</td>
                    </tr>
                </tfoot>
            </table>
            <div class="dashed-line" v-if="payments && payments.length"></div>
            <div class="row bold due-row" v-if="Number(order.due_amount) > 0">
                <span class="label">Due Amount:</span>
                <span class="value">৳{{ formatMoney(order.due_amount) }}</span>
            </div>
            <div class="paid-badge" v-else>Fully Paid</div>
        </div>

        <div class="dashed-line" v-if="payments && payments.length"></div>

        <!-- ================= SIGNATURES ================= -->
        <div class="signatures flex justify-between">
            <div class="sig-box">
                <div class="sig-line"></div>
                <span>{{ order?.user?.name ?? 'Prepared By' }}</span>
            </div>
            <div class="sig-box">
                <div class="sig-line"></div>
                <span>Authorized Signature</span>
            </div>
            <div class="sig-box">
                <div class="sig-line"></div>
                <span>Customer / Supplier</span>
            </div>
        </div>

        <!-- ================= FOOTER (80mm style) ================= -->
        <div class="footer text-center">
            <div class="dashed-line"></div>
            <p class="bold">*** THANK YOU FOR YOUR BUSINESS ***</p>
            <p>Software Powered By Mercuviax</p>
            <p>+880 1533-021557</p>
        </div>

        <!-- Loading / Error -->
        <div v-if="orderLoading || cartLoading" class="debug no-print">Loading Invoice Data...</div>
        <div v-if="errorMsg" class="debug error no-print">{{ errorMsg }}</div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import api from "../../../../services/api.js";

const route = useRoute();

const orderLoading = ref(false);
const cartLoading = ref(false);
const errorMsg = ref("");

// ==========================================
// Reactive State
// ==========================================
const order = ref(null);
const payments = ref([]);
const payment = ref(null);
const cartItems = ref([]);

// ==========================================
// Helpers / Formatters
// ==========================================
const formatMoney = (amount) => {
    if (amount === null || amount === undefined || isNaN(Number(amount))) return "0.00";
    return Number(amount).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

// Used by Payment History table (date + time)
const formatDateTime = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const formatStatus = (status) => {
    if (!status) return "N/A";
    return String(status).replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

function getPaymentMethod(method) {
    const map = {
        cod: { label: "Cash on Delivery" },
        cash: { label: "Cash" },
        bank_transfer: { label: "Bank Transfer" },
        mobile_banking: { label: "Mobile Banking" },
        card: { label: "Card" },
        paypal: { label: "PayPal" },
        wallet: { label: "Wallet" },
    };
    return map[method?.toLowerCase()] || { label: method || "COD" };
}

const paidAmount = computed(() => {
    if (order.value?.paid_amount !== undefined) return Number(order.value.paid_amount || 0);
    return Number(payments.value?.[0]?.amount || 0);
});

const fullSupplierAddress = computed(() => {
    const s = order.value?.supplier;
    if (!s) return "";
    return [s.address, s.city, s.postal_code, s.country].filter(Boolean).join(", ");
});

// Sum of all payment history rows (fixes previous reference to undefined "orderPayments")
const totalPaidFromHistory = computed(() => {
    return (payments.value || []).reduce((sum, p) => sum + Number(p.amount || 0), 0);
});

// ==========================================
// API Data Fetching
// ==========================================
async function fetchOrderDetails() {
    orderLoading.value = true;
    try {
        const reg = route.params.reg;
        if (!reg) {
            errorMsg.value = "Invalid order reference.";
            return;
        }

        const res = await api.get(`/purchase/order/details/${reg}`);
        const data = res.data?.data;

        if (!data?.order) {
            errorMsg.value = "Purchase order not found.";
            return;
        }

        order.value = data.order;
        cartItems.value = data.cartItems || [];

        const rawPayment = data.payments || data.payment || null;

        if (Array.isArray(rawPayment)) {
            payments.value = rawPayment;
            payment.value = rawPayment[0] || null;
        } else if (rawPayment) {
            payments.value = [rawPayment];
            payment.value = rawPayment;
        } else {
            payments.value = [];
            payment.value = null;
        }
    } catch (err) {
        errorMsg.value = err.response?.data?.message || err.message || "Failed to fetch order.";
    } finally {
        orderLoading.value = false;
        cartLoading.value = false;
    }
}

// ==========================================
// Auto Print & Window Close
// ==========================================
const triggerAutoPrintAndClose = () => {
    let printed = false;
    let closed = false;

    const safeClose = () => {
        if (closed) return;
        closed = true;
        window.onafterprint = null;
        window.onfocus = null;
        setTimeout(() => window.close(), 100);
    };

    window.onafterprint = () => safeClose();
    window.onfocus = () => { if (printed) safeClose(); };

    setTimeout(() => {
        printed = true;
        window.print();
    }, 150);

    setTimeout(() => { if (printed) safeClose(); }, 12000);
};

// ==========================================
// Lifecycle
// ==========================================
onMounted(async () => {
    await fetchOrderDetails();

    if (!errorMsg.value) {
        triggerAutoPrintAndClose();
    }
});
</script>

<style scoped>
/* ================= A4 Base ================= */
.a4-invoice {
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto;
    padding: 15mm 14mm;
    background: #fff;
    color: #000;
    font-family: "Segoe UI", Arial, "Helvetica Neue", sans-serif;
    font-size: 12.5px;
    line-height: 1.45;
    box-sizing: border-box;
}

/* Utilities */
.text-center { text-align: center; }
.text-right { text-align: right; }
.bold { font-weight: 700; }
.capitalize { text-transform: capitalize; }
.flex { display: flex; }
.justify-between { justify-content: space-between; }

/* ================= Header (matches 80mm style) ================= */
.header .store-name {
    font-size: 22px;
    font-weight: 800;
    margin: 0 0 4px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
.header p {
    margin: 2px 0;
    font-size: 11.5px;
    color: #333;
}

/* Dividers */
.dashed-line {
    border-bottom: 1.4px dashed #444;
    margin: 10px 0;
}
.dashed-line.thin {
    border-bottom: 1px dotted #666;
    margin: 6px 0;
}
/* Invoice meta (compact) */
.invoice-meta-bar {
    padding: 2px 0;
}
.meta-bar-top {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 6px;
}
.inv-title {
    font-size: 15px;
    font-weight: 800;
    letter-spacing: 1.5px;
}
.inv-sub {
    font-size: 11px;
    color: #666;
    font-weight: 600;
}
.meta-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 2px 16px;
    font-size: 11px;
}
.meta-col .row { margin-bottom: 1px; }
.row {
    display: flex;
    justify-content: space-between;
    gap: 6px;
}
.label { color: #666; }
.value { text-align: right; font-weight: 600; }

/* Bill From / Bill To (compact) */
.parties-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin: 0;
}
.party-box {
    border-left: 2px solid #333;
    padding: 2px 8px;
}
.party-box--supplier { border-left-color: #333; }
.party-box--customer { border-left-color: #0a7a3d; }
.party-box p {
    margin: 1px 0;
    font-size: 11px;
    line-height: 1.3;
}
.party-title {
    font-size: 9px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #888;
    margin-bottom: 2px !important;
}
.party-box--supplier .party-title { color: #555; }
.party-box--customer .party-title { color: #0a7a3d; }
.party-name {
    font-size: 12.5px;
    font-weight: 700;
    margin-bottom: 1px !important;
}
/* ================= Items Table ================= */
.items-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 4px;
}
.items-table thead th {
    background: #f2f2f2;
    border-top: 1.4px solid #000;
    border-bottom: 1.4px solid #000;
    font-size: 10.5px;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    padding: 6px 6px;
    font-weight: 700;
    text-align: left;
}
.items-table tbody td {
    padding: 6px 6px;
    border-bottom: 1px solid #ddd;
    vertical-align: top;
    font-size: 12px;
}
.col-sl { width: 6%; }
.col-name { width: 50%; }
.col-qty { width: 12%; }
.col-price { width: 16%; }
.col-total { width: 16%; }

.item-title { font-weight: 600; }
.item-sub { font-size: 10.5px; color: #666; padding-left: 4px; }

.empty-items {
    text-align: center;
    padding: 20px 0;
    color: #777;
    font-size: 12px;
}

/* ================= Payment History ================= */
.payment-history {
    margin: 8px 0;
}
.section-title {
    font-weight: 800;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #555;
    margin-bottom: 6px;
}
.payment-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11px;
}
.payment-table th, .payment-table td {
    padding: 5px 6px;
    border-bottom: 1px solid #eee;
    text-align: left;
}
.payment-table thead th {
    background: #f7f7f7;
    border-top: 1px solid #999;
    border-bottom: 1px solid #999;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 9.5px;
    letter-spacing: 0.3px;
}
.payment-table .col-amount { color: #0a7a3d; font-weight: 600; }
.payment-table tfoot td {
    border-top: 1.4px solid #000;
    border-bottom: none;
    font-size: 12px;
}

/* ================= Summary ================= */
.summary-wrap {
    display: grid;
    grid-template-columns: 1fr 260px;
    gap: 24px;
    margin-top: 14px;
    align-items: start;
}
.summary-left { padding-top: 2px; }
.notes-box {
    margin-bottom: 10px;
    padding-left: 8px;
    border-left: 2px solid #999;
}
.notes-title {
    font-size: 10.5px;
    font-weight: 700;
    text-transform: uppercase;
    color: #555;
    margin-bottom: 2px;
}
.notes-text {
    font-size: 11.5px;
    color: #333;
    font-style: italic;
    white-space: pre-wrap;
}

.summary-right .row {
    margin-bottom: 4px;
    font-size: 12px;
}
.total-row {
    font-size: 14px;
    padding-top: 2px;
}
.due-row {
    color: #b00000;
    font-size: 12.5px;
}
.paid-badge {
    margin-top: 4px;
    text-align: right;
    font-size: 11px;
    font-weight: 700;
    color: #0a7a3d;
}

/* ================= Signatures ================= */
.signatures {
    margin-top: 40px;
    padding: 0 4px;
}
.sig-box {
    width: 28%;
    text-align: center;
    font-size: 11px;
}
.sig-line {
    border-top: 1px solid #000;
    margin-bottom: 5px;
    height: 32px;
}

/* ================= Footer ================= */
.footer p {
    margin: 2px 0;
    font-size: 11px;
    color: #333;
}
.footer .bold {
    font-size: 12.5px;
}

/* Debug */
.debug { text-align: center; padding: 10px; font-weight: bold; }
.debug.error { color: red; }

/* ================= Print Rules (A4) ================= */
@media print {
    @page {
        size: A4;
        margin: 12mm 12mm;
    }

    html, body {
        width: 210mm;
        margin: 0 !important;
        padding: 0 !important;
        background: #fff !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }

    .a4-invoice {
        width: 100%;
        min-height: auto;
        padding: 0;
        box-shadow: none;
    }

    .items-table,
    .payment-table {
        page-break-inside: auto;
    }
    .items-table tr,
    .payment-table tr {
        page-break-inside: avoid;
        page-break-after: auto;
    }
    thead {
        display: table-header-group;
    }

    .no-print {
        display: none !important;
    }
}

/* ================= Screen Preview (non-print) ================= */
@media screen {
    .a4-invoice {
        box-shadow: 0 0 12px rgba(0, 0, 0, 0.12);
        margin: 20px auto;
    }
}
</style>