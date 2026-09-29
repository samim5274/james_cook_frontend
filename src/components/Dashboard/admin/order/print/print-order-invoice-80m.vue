<template>
    <div v-if="order" class="invoice-wrap">
        <!-- HEADER -->
        <div class="invoice-header">
            <h2>{{ company?.name || "YOUR COMPANY" }}</h2>
            <p>{{ company?.address || "" }}</p>
            <p>
                {{ company?.email || "" }}
                <span v-if="company?.email && company?.phone"> || </span>
                {{ company?.phone || "" }}
            </p>
            <p class="order-title">INVOICE</p>
            </div>

            <!-- SUB HEADER -->
            <div class="invoice-subheader">
                <div class="info-line">
                    <span><strong>Bill Officer:</strong> {{ order?.bill_officer || order?.user?.name || "-" }}</span>
                    <span><strong>C.Name:</strong> {{ order?.customerName || order?.customer_name || "-" }}</span>
                </div>
            <div class="info-line">
                <span><strong>C.Phone:</strong> {{ order?.customerPhone || order?.customer_phone || "-" }}</span>
                <span><strong>Date:</strong> {{ formatDate(order?.date || order?.created_at) }}</span>
            </div>
            <div class="info-line">
                <span><strong>Invoice:</strong> {{ order?.reg || "-" }}</span>
                <span><strong>Status:</strong> {{ order?.status || "-" }}</span>
            </div>
            <div class="info-line">
                <span><strong>Payment:</strong> {{ paymentDetails?.payment_method?.name || paymentDetails?.paymentMethod?.name || "-" }}</span>
                <!-- <span><strong>TRX:</strong> {{ paymentDetails?.transaction_id || order?.transaction_id || "-" }}</span> -->
            </div>

        </div>

        <!-- ITEMS TABLE -->
        <table class="items-table">
        <thead>
            <tr>
            <th>#</th>
            <th>Item</th>
            <th>Qty</th>
            <th>৳/Unit</th>
            <th>Total</th>
            </tr>
        </thead>

        <tbody>
            <tr v-for="(it, idx) in items" :key="it.id || idx">
            <td>{{ idx + 1 }}</td>
            <td>{{ limitText(it?.product?.name || it?.name || "Item", 15) }}</td>
            <td>{{ it?.quantity ?? 0 }}</td>
            <td>{{ money(it?.price ?? 0) }}</td>
            <td>{{ money((Number(it?.price || 0) * Number(it?.quantity || 0))) }}</td>
            </tr>
        </tbody>
        </table>

        <!-- TOTALS -->
        <table class="totals-table">
        <tbody>
            <tr class="separator">
            <td>Subtotal:</td>
            <td>৳{{ money(orderSubtotal) }}</td>
            </tr>

            <tr>
            <td>Discount ({{ paymentDetails?.discount_rate ?? 0 }}%)</td>
            <td>- ৳{{ money(orderDiscount) }}</td>
            </tr>

            <tr>
            <td>VAT ({{ paymentDetails?.vat_rate ?? 0 }}%)</td>
            <td>+ ৳{{ money(orderVat) }}</td>
            </tr>

            <tr class="separator final-total">
            <td>Payable:</td>
            <td>৳{{ money(orderPayable) }}</td>
            </tr>

            <tr>
            <td>Paid:</td>
            <td>৳{{ money(orderPaid) }}</td>
            </tr>

            <tr>
            <td class="final-total">Due:</td>
            <td class="final-total">৳{{ money(orderDue) }}</td>
            </tr>
        </tbody>
        </table>

        <div class="note">
        Powered by <strong>SAMIM-HosseN</strong> || +8801533021557
        </div>

        <div class="note">.</div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from "vue";
import { useRoute } from "vue-router";
import api from "../../services/api";

const route = useRoute();

const order = ref(null);
const items = ref([]);
const company = ref(null);
const paymentDetails = ref(null);

function formatDate(dateStr) {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function limitText(text, max = 15) {
    const s = String(text ?? "");
    return s.length > max ? s.slice(0, max) + "..." : s;
}

function money(v) {
    const n = Number(v ?? 0);
    return n.toFixed(2);
}

const orderSubtotal = computed(() => {
  return (items.value || []).reduce(
    (sum, it) => sum + (Number(it.price || 0) * Number(it.quantity || 0)),
    0
  );
});

const orderDiscount = computed(() => Number(paymentDetails.value?.discount_amount ?? 0));
const orderVat = computed(() => Number(paymentDetails.value?.vat_amount ?? 0));
const orderPayable = computed(() => Number(paymentDetails.value?.payable ?? 0));
const orderPaid = computed(() => Number(paymentDetails.value?.pay ?? 0));
const orderDue = computed(() => Number(paymentDetails.value?.due ?? 0));

async function loadOrder() {
    const reg = route.params.reg;
    const res = await api.post(`/order/invoice-print/${reg}`);

    order.value = res.data?.data?.order || null;
    items.value = res.data?.data?.cartitems || [];
    company.value = res.data?.company ?? null;
    paymentDetails.value = res.data?.data?.paymentDetails || null;
}

// onMounted(async () => {
//     await loadOrder();

//     setTimeout(() => window.print(), 300);

//     window.onafterprint = () => {
//         window.close();
//     };

//     const onVisibility = () => {
//         if (!document.hidden) {
//         setTimeout(() => window.close(), 300);
//         }
//     };

//     document.addEventListener("visibilitychange", onVisibility);

//     setTimeout(() => {
//         window.close();
//     }, 800); 

//     window.addEventListener("beforeunload", () => {
//         document.removeEventListener("visibilitychange", onVisibility);
//     });
// });

onMounted(async () => {
    await loadOrder();

    let printed = false;
    let closed = false;

    const safeClose = () => {
        if (closed) return;
        closed = true;

        // cleanup
        window.onafterprint = null;
        window.onfocus = null;
        document.removeEventListener("visibilitychange", onVisibility);

        // close (some browsers need small delay)
        setTimeout(() => window.close(), 50);
    };

    const onVisibility = () => {
        if (!document.hidden && printed) {
        safeClose();
        }
    };

    document.addEventListener("visibilitychange", onVisibility);

    window.onafterprint = () => {
        safeClose();
    };

    window.onfocus = () => {
        if (printed) safeClose();
    };

    setTimeout(() => {
        if (printed) return;
        printed = true;
        window.print();
    }, 300);

    setTimeout(() => {
        if (printed) safeClose();
    }, 15000);
});

</script>



<style scoped>

    .invoice-wrap {
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 10px;
    width: 68mm;
    margin: 0 auto;
    padding: 2mm 2mm;
    line-height: 1.3;
    }

    /* HEADER */
    .invoice-header {
    text-align: center;
    padding: 5px 0;
    border-bottom: 1px dashed #000;
    margin-bottom: 8px;
    }
    .invoice-header h2 {
    font-size: 14px;
    margin: 2px 0;
    text-transform: uppercase;
    }
    .invoice-header p {
    margin: 0;
    font-size: 10px;
    }
    .invoice-header .order-title {
    font-size: 11px;
    font-weight: bold;
    margin-top: 5px;
    }

    /* SUBHEADER */
    .invoice-subheader {
    margin-bottom: 8px;
    font-size: 10px;
    }
    .info-line {
    display: flex;
    justify-content: space-between;
    gap: 6px;
    margin: 1px 0;
    }
    .info-line span { white-space: nowrap; }

    /* ITEMS TABLE */
    .items-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 8px;
    font-size: 9.5px;
    }
    .items-table th, .items-table td {
    padding: 2px 0;
    border: none;
    text-align: right;
    white-space: pre-wrap;
    }
    .items-table thead {
    border-bottom: 1px dashed #000;
    }
    .items-table th:nth-child(1), .items-table td:nth-child(1) { width: 5%;  text-align: left; }
    .items-table th:nth-child(2), .items-table td:nth-child(2) { width: 40%; text-align: left; }
    .items-table th:nth-child(3), .items-table td:nth-child(3) { width: 10%; text-align: right; }
    .items-table th:nth-child(4), .items-table td:nth-child(4) { width: 20%; text-align: right; }
    .items-table th:nth-child(5), .items-table td:nth-child(5) { width: 25%; text-align: right; }

    /* TOTALS */
    .totals-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 10px;
    margin-bottom: 10px;
    }
    .totals-table tr td { padding: 2px 0; }
    .totals-table td:first-child { text-align: left; width: 50%; }
    .totals-table td:last-child { text-align: right; width: 50%; }

    .separator { border-top: 1px dashed #000; }
    .final-total { font-weight: bold; font-size: 11px; }

    /* NOTE */
    .note {
    text-align: center;
    font-size: 10px;
    margin-top: 5px;
    margin-bottom: 15px;
    padding-top: 5px;
    page-break-inside: avoid;
    }
</style>

<!-- print-only global rules -->
<style>
    @media print {
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @page { size: 80mm auto; margin: 0; }
        html, body { margin: 0 !important; padding: 0 !important; }
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
</style>
