<template>
    <!-- Print Wrapper -->
    <div class="a4-page">
        <div class="half-page">

            <!-- Loading overlay -->
            <div v-if="isLoading" class="state-overlay">
                <div class="spinner"></div>
                <p>Loading invoice...</p>
            </div>

            <!-- Error state -->
            <div v-else-if="errorMsg" class="state-overlay">
                <p class="state-error">{{ errorMsg }}</p>
                <button class="retry-btn" @click="reload">Retry</button>
            </div>

            <!-- Empty state -->
            <div v-else-if="!order" class="state-overlay">
                <p class="state-error">Order not found.</p>
            </div>

            <!-- Invoice content -->
            <template v-else>
                <!-- Header -->
                <div class="header">
                    <div class="header-left">
                        <h1>James Cook Bakery Cafe</h1>
                        <p>House # 15, Road # 03, Nikunja - 2, Dhaka - 1229</p>
                        <p class="meta">
                            +8801856668991
                        </p>
                    </div>
                    <div class="header-right">
                        <h2>INVOICE</h2>
                        <p class="inv-no">#{{ order.reg ?? 'N/A' }}</p>
                        <p class="inv-date">{{ formatDate(order.date) }}</p>
                    </div>
                </div>

                <hr class="divider" />

                <!-- Order + Customer Information -->
                <div class="two-col" :class="densityClass">
                    <div class="card">
                        <div class="card-header">Order Info</div>
                        <div class="card-body">
                            <div class="row"><span class="label">No</span><span class="value">{{ order.reg ?? 'N/A' }}</span></div>
                            <div class="row"><span class="label">Date</span><span class="value">{{ formatDate(order.date) }}</span></div>
                            <div class="row"><span class="label">Status</span><span class="value">{{ order.status ?? 'N/A' }}</span></div>
                            <div class="row"><span class="label">Payment</span><span class="value">{{ order.payment_status ?? 'N/A' }}</span></div>
                            <div class="row"><span class="label">Method</span><span class="value">{{ getPaymentMethod(order.payment_method)?.label ?? 'N/A' }}</span></div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">Customer Info</div>
                        <div class="card-body">
                            <div class="row"><span class="label">Name</span><span class="value">{{ order.contact_name ?? '-' }}</span></div>
                            <div class="row"><span class="label">Phone</span><span class="value">{{ order.contact_number ?? '-' }}</span></div>
                            <div class="row"><span class="label">Address</span><span class="value">{{ order.shipping_address ?? '-' }}</span></div>
                            <div class="row"><span class="label">Area</span><span class="value">{{ [order.upazila?.name, order.district?.name].filter(Boolean).join(', ') || '-' }}</span></div>
                        </div>
                    </div>
                </div>

                <!-- Cart Items -->
                <div class="items-section" :class="densityClass" v-if="cartItems && cartItems.length">
                    <div class="section-title">Order Items</div>
                    <table class="items-table">
                        <thead>
                            <tr>
                                <th class="col-sl">#</th>
                                <th class="col-item">Item</th>
                                <th class="col-qty text-center">Qty</th>
                                <th class="col-price text-right">Price</th>
                                <th class="col-total text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, idx) in cartItems" :key="item.id ?? idx">
                                <td class="col-sl">{{ idx + 1 }}</td>
                                <td class="col-item">
                                    {{ item.product?.name ?? 'Item unavailable' }}
                                    <span v-if="item.variant?.name" class="item-variant">({{ item.variant.name }})</span>
                                </td>
                                <td class="col-qty text-center">{{ item.quantity ?? 1 }}</td>
                                <td class="col-price text-right">৳{{ formatMoney(item.price) }}</td>
                                <td class="col-total text-right">
                                    ৳{{ formatMoney(lineTotal(item)) }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="items-empty" v-else-if="!cartLoading">
                    No items found for this order.
                </div>

                <!-- Payment / Delivery -->
                <div class="two-col" :class="densityClass" v-if="payment || deliveryCharge">
                    <div class="card" v-if="payment">
                        <div class="card-header">Payment</div>
                        <div class="card-body">
                            <div class="row"><span class="label">Receipt</span><span class="value">{{ payment.receipt_no ?? '-' }}</span></div>
                            <div class="row"><span class="label">Status</span><span class="value">{{ payment.status ?? '-' }}</span></div>
                            <div class="row"><span class="label">Paid</span><span class="value highlight-green">৳{{ formatMoney(payment.amount) }}</span></div>
                        </div>
                    </div>
                    <div class="card" v-if="deliveryCharge">
                        <div class="card-header">Delivery Charge</div>
                        <div class="card-body">
                            <div class="row"><span class="label">Amount</span><span class="value highlight-green">৳{{ formatMoney(deliveryCharge.amount) }}</span></div>
                            <div class="row"><span class="label">Status</span><span class="value">{{ deliveryCharge.payment_status ?? '-' }}</span></div>
                        </div>
                    </div>
                </div>

                <!-- Order Summary -->
                <div class="card" :class="densityClass">
                    <div class="card-header">Order Summary</div>
                    <div class="card-body">
                        <table class="summary-table">
                            <tr><td>Subtotal</td><td class="text-right">৳{{ formatMoney(order.amount) }}</td></tr>
                            <tr><td>Discount</td><td class="text-right text-red">-৳{{ formatMoney(order.discount) }}</td></tr>
                            <tr><td>Shipping</td><td class="text-right">৳{{ formatMoney(order.shipping_charge) }}</td></tr>
                            <tr class="total-row"><td>Total Payable</td><td class="text-right">৳{{ formatMoney(order.payable_amount) }}</td></tr>
                            <tr><td>Paid</td><td class="text-right text-green">৳{{ formatMoney(order.paid_amount) }}</td></tr>
                            <tr class="due-row"><td>Due</td><td class="text-right text-red">৳{{ formatMoney(order.due_amount) }}</td></tr>
                        </table>
                    </div>
                </div>

                <!-- Signatures -->
                <div class="signatures">
                    <div class="sig">
                        <span class="pb-2">{{ user.name }}</span>
                        <div class="sig-line"></div><span>Prepared By</span>
                    </div>
                    <div class="sig"><div class="sig-line"></div><span>Approved By</span></div>
                </div>

                <!-- Footer -->
                <div class="footer">
                    Powered by <strong>Mercuviax</strong> | +880 1533-021557
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, computed } from "vue";
import { useRoute } from "vue-router";
import api from '../../../../services/api';

const route = useRoute();

const orderLoading = ref(false);
const cartLoading = ref(false);
const errorMsg = ref('');

const isLoading = computed(() => orderLoading.value || cartLoading.value);

// ==========================================
// 1. Reactive State
// ==========================================
const order = ref(null);
const payments = ref([]);
const payment = ref(null);
const deliveryCharge = ref(null);
const cartItems = ref([]);
const user = ref(null);

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
    const d = new Date(date);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

function lineTotal(item) {
    if (item.payable_amount !== undefined && item.payable_amount !== null) {
        return Number(item.payable_amount);
    }
    const price = Number(item.price) || 0;
    const discount = Number(item.discount) || 0;
    const qty = Number(item.quantity) || 1;
    return (price - discount) * qty;
}

// ==========================================
// 3. API Data Fetching Functions
// ==========================================
async function fetchOrderDetails() {
    orderLoading.value = true;
    errorMsg.value = '';
    try {
        const reg = route.params.reg;
        if (!reg) {
            errorMsg.value = "Invalid order reference.";
            return;
        }

        const res = await api.get(`/orders/${reg}`);
        const responseData = res.data?.data || {};

        order.value = responseData.order || null;
        user.value = responseData.user || null;

        if (!order.value) {
            errorMsg.value = "Order not found.";
            return;
        }

        const rawPayment = responseData.payment || responseData.order?.payment;
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

        deliveryCharge.value = responseData.deliveryCharge || null;
    } catch (err) {
        errorMsg.value =
            err.response?.data?.message ||
            err.message ||
            "Something went wrong while fetching the order.";
    } finally {
        orderLoading.value = false;
    }
}

async function getCartItems() {
    cartLoading.value = true;
    try {
        const reg = route.params.reg;
        if (!reg) return;

        const res = await api.get(`/cart/${reg}`);
        cartItems.value = res.data?.data || [];
    } catch (err) {
        // Non-fatal: invoice can still render without items list.
        if (!errorMsg.value) {
            errorMsg.value =
                err.response?.data?.message ||
                err.message ||
                "Something went wrong while fetching cart items.";
        }
    } finally {
        cartLoading.value = false;
    }
}

async function loadAll() {
    await Promise.all([
        fetchOrderDetails(),
        getCartItems(),
    ]);
}

function reload() {
    loadAll();
}

// ==========================================
// 4. Payment method display config
// ==========================================
function getPaymentMethod(method) {
    const map = {
        cod: { label: 'Cash on delivery' },
        cash: { label: 'Cash' },
        bank_transfer: { label: 'Bank transfer' },
        mobile_banking: { label: 'Mobile banking' },
        card: { label: 'Card' },
        paypal: { label: 'PayPal' },
        wallet: { label: 'Wallet' },
        advance: { label: 'Advance payment' },
    };
    return map[method?.toLowerCase()] || map.cod;
}

// ==========================================
// 5. Density scaling (handles many-item overflow)
// ==========================================
const densityClass = computed(() => {
    const count = cartItems.value?.length || 0;
    if (count > 12) return 'density-tight';
    if (count > 6) return 'density-compact';
    return '';
});

// ==========================================
// 6. Print + auto-close (only runs once content is ready)
// ==========================================
let printTimer = null;
let closeTimer = null;
let printed = false;

function cleanupPrintHandlers() {
    window.onafterprint = null;
    window.onfocus = null;
    document.removeEventListener("visibilitychange", onVisibility);
    if (printTimer) clearTimeout(printTimer);
    if (closeTimer) clearTimeout(closeTimer);
}

function safeClose() {
    cleanupPrintHandlers();
    setTimeout(() => window.close(), 50);
}

function onVisibility() {
    if (!document.hidden && printed) safeClose();
}

function triggerPrintFlow() {
    document.addEventListener("visibilitychange", onVisibility);
    window.onafterprint = () => safeClose();
    window.onfocus = () => { if (printed) safeClose(); };

    printTimer = setTimeout(() => {
        printed = true;
        window.print();
    }, 300);

    closeTimer = setTimeout(() => {
        if (printed) safeClose();
    }, 15000);
}

// ==========================================
// 7. Lifecycle Hooks
// ==========================================
onMounted(async () => {
    await loadAll();
    if (order.value && !errorMsg.value) {
        triggerPrintFlow();
    }
});

onBeforeUnmount(() => {
    cleanupPrintHandlers();
});
</script>


















<style scoped>
    /* A4 landscape fixed page, half-page invoice */
    .a4-page {
    width: 297mm;
    /* height: 210mm; */
    min-height: 210mm; /* height min-height */
    background: #fff;
    margin: 0 auto;
    position: relative;
    /* overflow: hidden; Hide */
    }

    .half-page {
    width: 148.5mm;
    /* height: 210mm; */
    min-height: 210mm; /* height min-height */
    margin: 0 auto;
    padding: 8mm;
    box-sizing: border-box;
    /* overflow: hidden; */
    color: #0f172a;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    position: relative;
    }

    /* Loading / error / empty states */
    .state-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 8mm;
    text-align: center;
    }
    .state-overlay p { font-size: 12px; color: #475569; margin: 0; }
    .state-error { color: #dc2626 !important; font-weight: 600; }
    .spinner {
    width: 26px;
    height: 26px;
    border: 3px solid #e2e8f0;
    border-top-color: #4338ca;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
    to { transform: rotate(360deg); }
    }
    .retry-btn {
    border: 1px solid #4338ca;
    background: #fff;
    color: #4338ca;
    font-size: 11px;
    font-weight: 600;
    padding: 5px 14px;
    border-radius: 5px;
    cursor: pointer;
    }
    .retry-btn:hover { background: #eef2ff; }

    /* Header */
    .header { display: flex; justify-content: space-between; align-items: flex-start; }
    .header-left h1 { font-size: 15px; font-weight: 800; margin: 0 0 2px 0; }
    .header-left p { font-size: 8.5px; margin: 1px 0; color: #334155; }
    .header-left .meta { font-size: 8px; color: #475569; line-height: 1.3; }

    .header-right { text-align: right; }
    .header-right h2 { font-size: 15px; font-weight: 900; margin: 0; letter-spacing: 1px; color: #4338ca; }
    .header-right .inv-no { font-size: 9px; font-weight: 700; margin: 2px 0 0 0; }
    .header-right .inv-date { font-size: 8px; color: #475569; margin: 1px 0 0 0; }

    .divider { margin: 4px 0 6px 0; border: none; border-top: 1.5px solid #0f172a; }

    /* Two column info */
    .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3mm;
    margin-bottom: 3mm;
    }

    .card {
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 3mm;
    }
    .card-header {
    background: #4338ca;
    color: #fff;
    font-size: 8.5px;
    font-weight: 700;
    padding: 2.5px 6px;
    }
    .card-body { padding: 3px 6px; }

    .row {
    display: flex;
    justify-content: space-between;
    gap: 4px;
    padding: 1.2px 0;
    border-bottom: 1px dashed #e2e8f0;
    font-size: 8px;
    }
    .row:last-child { border-bottom: none; }
    .label { color: #64748b; }
    .value { font-weight: 600; text-align: right; word-break: break-word; }
    .highlight-green { color: #059669; }

    /* Items table */
    .items-section {
    margin-bottom: 3mm;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    overflow: hidden;
    }
    .section-title {
    background: #4338ca;
    color: #fff;
    font-size: 8.5px;
    font-weight: 700;
    padding: 2.5px 6px;
    }
    .items-table { width: 100%; border-collapse: collapse; font-size: 8px; }
    .items-table thead th {
    background: #eef2ff;
    color: #3730a3;
    text-align: left;
    padding: 3px 6px;
    font-size: 7px;
    text-transform: uppercase;
    border-bottom: 1px solid #cbd5e1;
    }
    .items-table tbody td {
    padding: 2.5px 6px;
    border-bottom: 1px solid #f1f5f9;
    }
    .items-table tbody tr:last-child td { border-bottom: none; }
    .item-variant { color: #64748b; font-size: 7px; }
    .col-sl { width: 7%; }
    .col-item { width: 47%; }
    .col-qty { width: 12%; }
    .col-price { width: 17%; }
    .col-total { width: 17%; }

    .items-empty {
    font-size: 8px;
    color: #94a3b8;
    text-align: center;
    padding: 3mm 0;
    border: 1px dashed #cbd5e1;
    border-radius: 4px;
    margin-bottom: 3mm;
    }

    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .text-red { color: #dc2626; }
    .text-green { color: #059669; }

    /* Summary */
    .summary-table { width: 100%; border-collapse: collapse; font-size: 8.5px; }
    .summary-table td { padding: 1.5px 2px; }
    .summary-table tr.total-row td {
    font-weight: 800;
    border-top: 1.5px solid #0f172a;
    padding-top: 3px;
    font-size: 9.5px;
    color: #4338ca;
    }
    .summary-table tr.due-row td {
    font-weight: 800;
    border-top: 1px dashed #cbd5e1;
    padding-top: 2px;
    }

    /* Signatures */
    .signatures {
    display: flex;
    justify-content: space-between;
    gap: 6mm;
    margin-top: 5mm;
    }
    .sig { width: 50%; text-align: center; font-size: 7.5px; color: #0f172a; }
    .sig-line { width: 70%; margin: 0 auto 1.5mm auto; border-top: 1px solid #0f172a; }

    /* Footer */
    .footer {
    text-align: center;
    margin-top: 3mm;
    padding-top: 2mm;
    border-top: 1px solid #e2e8f0;
    font-size: 7px;
    color: #64748b;
    }

    /* ===== Density scaling: shrinks everything when many items exist ===== */
    .density-compact .row,
    .density-compact .items-table { font-size: 7.3px; }
    .density-compact .card-body { padding: 2px 6px; }
    .density-compact .items-table thead th,
    .density-compact .items-table tbody td { padding: 2px 6px; }

    .density-tight .row,
    .density-tight .items-table { font-size: 6.6px; }
    .density-tight .card-body { padding: 1.5px 5px; }
    .density-tight .items-table thead th,
    .density-tight .items-table tbody td { padding: 1.5px 5px; }
    .density-tight .card-header,
    .density-tight .section-title { font-size: 7.5px; padding: 2px 6px; }

    /* Print */
    @media print {
        @page { size: A4 landscape; margin: 0; }

        :global(html), :global(body) {
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
        }

        .state-overlay { display: none !important; }

        .items-table thead { display: table-header-group; } /* every header repeat */
        .items-table tr { page-break-inside: avoid; }
        .card, .two-col, .signatures { page-break-inside: avoid; }
    }
</style>