<template>
    <!-- Thermal Print Wrapper (80mm) -->
    <div class="pos-receipt">
        <!-- Header -->
        <div class="header text-center">
            <h1>James Cook Bakery Cafe</h1>
            <p>House#15, Road#03, Nikunja-2, Dhaka-1229</p>
            <p class="meta">+8801856668991</p>
        </div>

        <div class="dashed-line"></div>

        <!-- Invoice Title & Reg -->
        <div class="text-center" v-if="order">
            <div class="invoice-meta-bar">
                <div class="inv-title">INVOICE</div>
                <div class="meta-inline">
                    <span><strong>NO:</strong> {{ order.reg ?? 'N/A' }}</span>
                    <span>|</span>
                    <span><strong>DATE:</strong> {{ formatDate(order.order_date) }}</span>
                </div>
                <div class="meta-inline">
                    <span>Prepared By: {{ order?.user?.name ?? '-' }}</span>
                </div>
            </div>
        </div>

        <div class="dashed-line"></div>

        <!-- Items Table -->
        <div class="items-section" v-if="cartItems && cartItems.length">
            <div class="table-header flex justify-between bold">
                <span class="col-name">Item</span>
                <span class="col-qty text-center">Qty</span>
                <span class="col-price text-right">Price</span>
                <span class="col-total text-right">Total</span>
            </div>
            <div class="dashed-line thin"></div>

            <div v-for="(item, idx) in cartItems" :key="item.id ?? idx" class="item-row">
                <div class="item-title bold">{{ idx + 1 }}. {{ item.product?.name ?? 'Product' }}</div>
                <div v-if="item.variant?.name" class="item-sub">Var: {{ item.variant.name }}</div>
                <div v-if="item.note" class="item-sub">Note: {{ item.note }}</div>
                
                <div class="item-details flex justify-between">
                    <span class="col-name"></span>
                    <span class="col-qty text-center">{{ item.quantity ?? 1 }}</span>
                    <span class="col-price text-right">{{ formatMoney(item.price) }}</span>
                    <span class="col-total text-right">
                        {{ formatMoney(item.payable_amount ?? ((item.price - (item.discount ?? 0)) * (item.quantity ?? 1))) }}
                    </span>
                </div>
            </div>
        </div>

        <div class="dashed-line"></div>

        <!-- Order Summary -->
        <div class="summary-section" v-if="order">
            <div class="row"><span class="label">Subtotal:</span><span class="value">৳{{ formatMoney(order.subtotal) }}</span></div>
            <div class="row" v-if="Number(order.discount) > 0"><span class="label">Discount:</span><span class="value">-৳{{ formatMoney(order.discount) }}</span></div>
            <div class="row" v-if="Number(order.vat) > 0"><span class="label">VAT({{ formatMoney(order.vat_percentage) }}%):</span><span class="value">৳{{ formatMoney(order.vat) }}</span></div>
            <div class="row" v-if="Number(order.coupon_discount) > 0"><span class="label">Coupon Disc:</span><span class="value">-৳{{ formatMoney(order.coupon_discount) }}</span></div>
            
            <div class="dashed-line thin"></div>
            
            <div class="row bold total-row">
                <span class="label">Total Payable:</span>
                <span class="value">৳{{ formatMoney(order.payable_amount) }}</span>
            </div>
            <div class="row"><span class="label">Paid Amount:</span><span class="value">৳{{ formatMoney(payments[0]?.amount ?? 0) }}</span></div>
            <div class="row bold due-row" v-if="Number(order.due_amount) > 0">
                <span class="label">Due Amount:</span>
                <span class="value">৳{{ formatMoney(order.due_amount) }}</span>
            </div>
        </div>

        <div class="dashed-line"></div>

        <!-- Payment Details (If available) -->
        <div class="payment-section" v-if="payment">
            <!-- <div class="row"><span class="label">Txn Receipt:</span><span class="value">{{ payment.receipt_no ?? '-' }}</span></div> -->
            <div class="row"><span class="label">Paid via:</span><span class="value">{{ getPaymentMethod(payment.payment_method)?.label ?? '-' }}</span></div>
        </div>

        <div class="dashed-line"></div>

        <!-- Order & Customer Info -->
        <div class="info-block" v-if="order">
            <div class="row"><span class="label">Customer:</span><span class="value">{{ order.customer_name ?? '-' }}</span></div>
            <div class="row" v-if="order.customer_phone"><span class="label">Phone:</span><span class="value">{{ order.customer_phone ?? '-' }}</span></div>
            <div class="row"><span class="label">Status:</span><span class="value">{{ order.status ?? 'N/A' }}</span></div>
            <!-- <div class="row"><span class="label">Pay Method:</span><span class="value">{{ getPaymentMethod(order.payment_method)?.label ?? 'N/A' }}</span></div> -->
             <div class="dashed-line thin"></div>
        </div>

        <!-- Signatures -->
        <!-- <div class="signatures flex justify-between" style="margin-top: 10mm;">
            <div class="sig-box">
                {{ order?.user?.name ?? '-' }}
                <div class="sig-line"></div>
                <span>Prepared By</span>
            </div>
            <div class="sig-box">
                <div class="sig-line"></div>
                <span>Customer</span>
            </div>
        </div> -->

        <!-- Footer -->
        <div class="footer text-center">
            <p class="bold">*** THANK YOU ***</p>
            <p>Software Powered By Mercuviax</p>
            <p>+880 1533-021557</p>
        </div>

        <!-- Loading / Error Notifications -->
        <div v-if="orderLoading || cartLoading" class="debug no-print">Loading Invoice Data...</div>
        <div v-if="errorMsg" class="debug error no-print">{{ errorMsg }}</div>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import api from '../../../../../services/api.js';

const route = useRoute();

const orderLoading = ref(false);
const cartLoading = ref(false);
const errorMsg = ref('');

// ==========================================
// 1. Reactive State
// ==========================================
const order = ref(null);
const payments = ref([]);
const payment = ref(null);
const cartItems = ref([]);

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
        const reg = route.params.reg;
        if (!reg) {
            errorMsg.value = "Invalid order reference.";
            return;
        }

        const res = await api.get(`/orders/${route.params.reg}`);
        const responseData = res.data?.data || {};

        order.value = responseData.order || null;

        const rawPayment = responseData.payment || null;

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
    }
}

async function getCartItems() {
    cartLoading.value = true;
    try {
        const res = await api.get(`admin/cart/${route.params.reg}`);
        cartItems.value = res.data?.data || [];
    } catch (err) {
        console.error(err);
        errorMsg.value = err.response?.data?.message || err.message || "Failed to fetch cart items.";
    } finally {
        cartLoading.value = false;
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
        
        // Window close delay for browser safety
        setTimeout(() => {
            window.close();
        }, 100);
    };

    window.onafterprint = () => safeClose();
    
    // Fallback if window regains focus after dialog close
    window.onfocus = () => {
        if (printed) safeClose();
    };

    // Trigger Print
    setTimeout(() => {
        printed = true;
        window.print();
    }, 100);

    // Hard fallback to close if something blocks print dialog
    setTimeout(() => {
        if (printed) safeClose();
    }, 12000);
};

// ==========================================
// 5. Lifecycle Hooks
// ==========================================
onMounted(async () => {
    await Promise.all([
        fetchOrderDetails(),
        getCartItems()
    ]);

    // Triggers print and window auto-close after data load
    if (!errorMsg.value) {
        triggerAutoPrintAndClose();
    }
});
</script>

<style scoped>
/* Mono/Consol Font configuration for POS receipt */
.pos-receipt {
    width: 78mm;
    margin: 0 auto;
    padding: 2mm 1mm;
    background: #fff;
    color: #000;
    font-family: "Consolas", "Courier New", "Lucida Console", Monaco, monospace;
    font-size: 11px;
    line-height: 1.2;
}

/* Helper Utilities */
.text-center { text-align: center; }
.text-right { text-align: right; }
.bold { font-weight: bold; }
.small { font-size: 10px; }
.flex { display: flex; }
.justify-between { justify-content: space-between; }

/* Header & Titles */
.store-name {
    font-size: 16px;
    font-weight: bold;
    margin: 0 0 4px 0;
    text-transform: uppercase;
}
.header p { margin: 1px 0; font-size: 10px; }
.inv-title {
    font-size: 14px;
    margin: 2px 0;
    letter-spacing: 1px;
}

/* Dividers */
.dashed-line {
    border-bottom: 1px dashed #000;
    margin: 6px 0;
}
.dashed-line.thin {
    border-bottom: 1px dotted #000;
    margin: 4px 0;
}

/* Data Rows */
.row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 3px;
    word-break: break-all;
}
.label { color: #000; }
.value { text-align: right; }

/* Item Table */
.items-section { margin: 4px 0; }
.table-header { font-size: 10.5px; }
.col-name { width: 40%; text-align: left; }
.col-qty { width: 15%; }
.col-price { width: 22%; }
.col-total { width: 23%; }

.item-row { margin-bottom: 5px; }
.item-title { word-break: break-word; }
.item-sub { font-size: 9.5px; padding-left: 8px; color: #333; }
.item-details { font-size: 10.5px; margin-top: 2px; }

/* Summary */
.summary-section { margin-top: 4px; }
.total-row { font-size: 12px; }
.due-row { font-size: 11.5px; }

/* Signatures */
.signatures {
    margin-top: 20mm;
    padding: 0 4px;
}
.sig-box {
    width: 40%;
    text-align: center;
    font-size: 9.5px;
}
.sig-line {
    border-top: 1px dashed #000;
    margin-bottom: 3px;
}

/* Footer */
.footer {
    margin-top: 8mm;
    font-size: 9.5px;
}
.footer p { margin: 2px 0; }

.debug { text-align: center; padding: 10px; font-weight: bold; }
.debug.error { color: red; }

/* Print Rules */
@media print {
    @page {
        size: 80mm auto;
        margin: 0mm;
    }
    
    html, body {
        width: 80mm;
        margin: 0 !important;
        padding: 0 !important;
        background: #fff !important;
    }

    .pos-receipt {
        width: 76mm;
        padding: 0;
    }

    .no-print {
        display: none !important;
    }
}
</style>