<template>
    <!-- A4 Print Wrapper -->
    <div class="invoice-page">
        <!-- Header -->
        <div class="header">
            <div class="header-left">
                <h1>James Cook Bakery Cafe</h1>
                <p>House#15, Road#03, Nikunja-2, Dhaka-1229</p>
                <p class="meta">+8801856668991</p>
            </div>
            <div class="header-right">
                <div class="inv-title">ORDER INVOICE</div>
                <div class="inv-meta" v-if="order">
                    <p><strong>Reg No:</strong> {{ order.reg ?? 'N/A' }}</p>
                    <p><strong>Order No:</strong> {{ order.order_number ?? 'N/A' }}</p>
                    <p><strong>Order Date:</strong> {{ formatDate(order.order_date) }}</p>
                    <p><strong>Status:</strong> <span class="status-badge">{{ order.status ?? 'N/A' }}</span></p>
                </div>
            </div>
        </div>

        <div class="solid-line"></div>

        <!-- Customer & Prepared By -->
        <div class="info-grid" v-if="order">
            <div class="info-col">
                <div class="info-heading">Bill To</div>
                <p class="bold">{{ order.customer_name ?? '-' }}</p>
                <p v-if="order.customer_phone">Phone: {{ order.customer_phone }}</p>
            </div>
            <div class="info-col text-right">
                <div class="info-heading">Prepared By</div>
                <p>{{ order?.user?.name ?? '-' }}</p>
            </div>
        </div>

        <div class="solid-line"></div>

        <!-- Order Summary -->
        <div class="summary-section" v-if="order">
            <table class="summary-table">
                <tbody>
                    <tr>
                        <td class="label">Subtotal</td>
                        <td class="value">৳{{ formatMoney(order.subtotal) }}</td>
                    </tr>
                    <tr v-if="Number(order.discount) > 0">
                        <td class="label">Discount</td>
                        <td class="value">-৳{{ formatMoney(order.discount) }}</td>
                    </tr>
                    <tr v-if="Number(order.vat) > 0">
                        <td class="label">VAT ({{ formatMoney(order.vat_percentage) }}%)</td>
                        <td class="value">৳{{ formatMoney(order.vat) }}</td>
                    </tr>
                    <tr v-if="Number(order.coupon_discount) > 0">
                        <td class="label">Coupon Discount</td>
                        <td class="value">-৳{{ formatMoney(order.coupon_discount) }}</td>
                    </tr>
                    <tr class="total-row">
                        <td class="label">Total Payable</td>
                        <td class="value">৳{{ formatMoney(order.payable_amount) }}</td>
                    </tr>
                    <tr>
                        <td class="label">Total Paid</td>
                        <td class="value">৳{{ formatMoney(totalPaid) }}</td>
                    </tr>
                    <tr v-if="Number(order.due_amount) > 0" class="due-row">
                        <td class="label">Due Amount</td>
                        <td class="value">৳{{ formatMoney(order.due_amount) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="solid-line"></div>

        <!-- Payment History -->
        <div class="history-section">
            <div class="info-heading">Payment History</div>

            <table class="history-table" v-if="paymentHistory && paymentHistory.length">
                <thead>
                    <tr>
                        <th class="text-left">#</th>
                        <th class="text-left">Payment No.</th>
                        <th class="text-left">Date</th>
                        <th class="text-left">Method</th>
                        <th class="text-left">Received By</th>
                        <th class="text-right">Discount</th>
                        <th class="text-right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, idx) in paymentHistory" :key="item.id ?? idx">
                        <td>{{ idx + 1 }}</td>
                        <td>{{ item.payment_number ?? '-' }}</td>
                        <td>{{ formatDate(item.created_at) }}</td>
                        <td>{{ getPaymentMethod(item.payment_method)?.label ?? '-' }}</td>
                        <td>{{ item.receiver?.name ?? item.user?.name ?? '-' }}</td>
                        <td class="text-right">-৳{{ formatMoney(item.discount) }}</td>
                        <td class="text-right">৳{{ formatMoney(item.amount) }}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td></td>
                        <td colspan="4" class="text-right bold">Total Paid</td>
                        <td class="text-right bold">-৳{{ formatMoney(totalDiscount) }}</td>
                        <td class="text-right bold">৳{{ formatMoney(totalPaid) }}</td>
                    </tr>
                </tfoot>
            </table>

            <p v-else class="no-history">No payment history found.</p>
        </div>

        <!-- Signatures -->
        <div class="signatures">
            <div class="sig-box">
                <div class="sig-line"></div>
                <span>{{ order?.user?.name ?? 'Prepared By' }}</span>
            </div>
            <div class="sig-box">
                <div class="sig-line"></div>
                <span>Customer Signature</span>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p class="bold">*** THANK YOU FOR YOUR BUSINESS ***</p>
            <p>Software Powered By Mercuviax | +880 1533-021557</p>
        </div>

        <!-- Loading / Error Notifications -->
        <div v-if="orderLoading" class="debug no-print">Loading Invoice Data...</div>
        <div v-if="errorMsg" class="debug error no-print">{{ errorMsg }}</div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import api from '../../../../../services/api.js';

const route = useRoute();

const orderLoading = ref(false);
const errorMsg = ref('');

// ==========================================
// 1. Reactive State
// ==========================================
const order = ref(null);
const paymentHistory = ref([]);

const totalPaid = computed(() =>
    paymentHistory.value.reduce((sum, p) => sum + Number(p.amount ?? 0), 0)
);

const totalDiscount = computed(() =>
    paymentHistory.value.reduce((sum, p) => sum + Number(p.discount ?? 0), 0)
);

// ==========================================
// 2. Helper Functions (Formatters)
// ==========================================
const formatMoney = (amount) => {
    if (amount === null || amount === undefined || isNaN(Number(amount))) return '0.00';
    return Number(amount).toLocaleString('en-US', {
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

// ==========================================
// 3. API Data Fetching Functions
// ==========================================
async function fetchOrderDetails() {
    orderLoading.value = true;
    try {
        const paymentNumber = route.params.payment_number;
        const orderId = route.params.order_id;

        if (!paymentNumber || !orderId) {
            errorMsg.value = "Invalid order reference.";
            return;
        }

        const res = await api.get(`/orders/payment/${paymentNumber}/${orderId}`);
        const responseData = res.data?.data || {};

        order.value = responseData.order || null;
        paymentHistory.value = responseData.orderPayment || [];

    } catch (err) {
        errorMsg.value = err.response?.data?.message || err.message || "Failed to fetch order.";
    } finally {
        orderLoading.value = false;
    }
}

function getPaymentMethod(method) {
    const map = {
        cod: { label: 'Cash on Delivery' },
        cash: { label: 'Cash' },
        bank_transfer: { label: 'Bank Transfer' },
        mobile_banking: { label: 'Mobile Banking' },
        card: { label: 'Card' },
        paypal: { label: 'PayPal' },
        wallet: { label: 'Wallet' },
    };
    return map[method?.toLowerCase()] || { label: method || 'COD' };
}

// ==========================================
// 4. Auto Print & Window Close Trigger Logic
// ==========================================
const triggerAutoPrintAndClose = () => {
    let printed = false;
    let closed = false;

    const safeClose = () => {
        if (closed) return;
        closed = true;
        window.onafterprint = null;
        window.onfocus = null;

        setTimeout(() => {
            window.close();
        }, 100);
    };

    window.onafterprint = () => safeClose();

    window.onfocus = () => {
        if (printed) safeClose();
    };

    setTimeout(() => {
        printed = true;
        window.print();
    }, 100);

    setTimeout(() => {
        if (printed) safeClose();
    }, 12000);
};

// ==========================================
// 5. Lifecycle Hooks
// ==========================================
onMounted(async () => {
    await fetchOrderDetails();

    if (!errorMsg.value) {
        triggerAutoPrintAndClose();
    }
});
</script>

<style scoped>
/* A4 Invoice Layout */
.invoice-page {
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto;
    padding: 15mm 18mm;
    background: #fff;
    color: #1a1a1a;
    font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
    font-size: 13px;
    line-height: 1.5;
    box-sizing: border-box;
}

.text-right { text-align: right; }
.text-left { text-align: left; }
.bold { font-weight: 600; }

/* Header */
.header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}
.header-left .store-name {
    font-size: 22px;
    font-weight: 700;
    margin: 0 0 6px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
.header-left p {
    margin: 2px 0;
    font-size: 12px;
    color: #444;
}

.header-right {
    text-align: right;
}
.inv-title {
    font-size: 24px;
    font-weight: 700;
    letter-spacing: 1.5px;
    color: #111;
    margin-bottom: 8px;
}
.inv-meta p {
    margin: 2px 0;
    font-size: 12.5px;
}
.status-badge {
    text-transform: uppercase;
    font-weight: 700;
    font-size: 11px;
}

/* Dividers */
.solid-line {
    border-bottom: 2px solid #111;
    margin: 14px 0;
}

/* Info Grid */
.info-grid {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
}
.info-col { width: 48%; }
.info-heading {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #888;
    margin-bottom: 6px;
}
.info-col p { margin: 2px 0; }

/* Summary Table */
.summary-section {
    margin: 14px 0;
    display: flex;
    justify-content: flex-end;
}
.summary-table {
    width: 100%;
    border-collapse: collapse;
}
.summary-table td {
    padding: 6px 4px;
    font-size: 13px;
}
.summary-table .label {
    color: #555;
}
.summary-table .value {
    text-align: right;
    font-weight: 500;
}
.summary-table .total-row td {
    border-top: 2px solid #111;
    border-bottom: 2px solid #111;
    font-weight: 700;
    font-size: 15px;
    padding-top: 8px;
    padding-bottom: 8px;
}
.summary-table .due-row td {
    color: #c0392b;
    font-weight: 700;
}

/* Payment History Table */
.history-section {
    margin: 14px 0;
}
.history-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
    font-size: 12.5px;
}
.history-table th {
    background: #f4f4f4;
    padding: 8px 6px;
    border-bottom: 2px solid #111;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #333;
}
.history-table td {
    padding: 7px 6px;
    border-bottom: 1px solid #e0e0e0;
}
.history-table tfoot td {
    border-top: 2px solid #111;
    border-bottom: none;
    padding-top: 8px;
    font-size: 13px;
}
.no-history {
    font-size: 12.5px;
    color: #888;
    font-style: italic;
    margin-top: 6px;
}

/* Signatures */
.signatures {
    display: flex;
    justify-content: space-between;
    margin-top: 25mm;
    padding: 0 10mm;
}
.sig-box {
    width: 35%;
    text-align: center;
    font-size: 12px;
}
.sig-line {
    border-top: 1px solid #333;
    margin-bottom: 6px;
    height: 30px;
}

/* Footer */
.footer {
    margin-top: 15mm;
    text-align: center;
    font-size: 11.5px;
    color: #555;
}
.footer p { margin: 3px 0; }

.debug { text-align: center; padding: 10px; font-weight: bold; }
.debug.error { color: red; }

/* Print Rules for A4 */
@media print {
    @page {
        size: A4;
        margin: 0mm;
    }

    html, body {
        width: 210mm;
        height: 297mm;
        margin: 0 !important;
        padding: 0 !important;
        background: #fff !important;
    }

    .invoice-page {
        width: 210mm;
        min-height: 297mm;
        padding: 15mm 18mm;
        box-shadow: none;
    }

    .no-print {
        display: none !important;
    }

    .history-table {
        page-break-inside: auto;
    }
    .history-table tr {
        page-break-inside: avoid;
    }
}
</style>