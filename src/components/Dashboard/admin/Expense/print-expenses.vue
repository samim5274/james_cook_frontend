<template>
    <!-- Print Wrapper -->
    <div class="a4-page">
        <!-- Half Page (centered) -->
        <div class="half-page">
        <!-- Header -->
        <div class="header">
            <h1>Mercuviax Software</h1>
            <p>Ka-153/3, Khilkhet, Dhaka-1229</p>
            <p class="meta">
            mercuviax@gmail.com
            <span> | Phone: +8801533021557</span>
            <span> | Website: www.mercuviax.com</span>
            </p>

            <hr />
            <h2>Expense Details</h2>
        </div>

        <!-- Expense Box -->
        <div class="expense-box">
            <div class="row">
            <div class="col">
                <span class="label">Title</span>
                <div class="value">{{ expense?.title || "-" }}</div>
            </div>

            <div class="col right">
                <span class="label">Date</span>
                <div class="value">{{ expense?.date ? formatDate(expense.date) : "-" }}</div>
            </div>
            </div>

            <div class="row">
            <div class="col">
                <span class="label">Created By</span>
                <div class="value">{{ expenseUserName }}</div>
            </div>

            <div class="col right">
                <span class="label">Category</span>
                <div class="value">{{ expense?.category?.name || "N/A" }}</div>
            </div>
            </div>

            <div class="row">
            <div class="col">
                <span class="label">Subcategory</span>
                <div class="value">{{ expense?.subcategory?.name || "N/A" }}</div>
            </div>

            <div class="col right">
                <span class="label">Reference</span>
                <div class="value">#{{ expense?.id ?? "-" }}</div>
            </div>
            </div>

            <div class="remark">
            <span class="label">Remark</span>
            <div class="remark-box">
                {{ expense?.remark || "N/A" }}
            </div>
            </div>

            <div class="amount">
            <span class="amount-label">Amount</span>
            <div class="amount-value">৳ {{ formatMoney(expense?.amount) }}/-</div>
            </div>
        </div>

        <!-- Signatures -->
        <div class="signatures">
            <div class="sig">
            <div class="sig-line"></div>
            <span>Prepared By</span> - {{ expenseUserName }}
            </div>
            <div class="sig">
            <div class="sig-line"></div>
            <span>Approved By</span>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            Powered by <strong>Mercuviax Software</strong> || +880 1533-021557
        </div>

        <!-- Debug (optional) -->
        <div v-if="loading" class="debug">Loading...</div>
        <div v-if="errorMsg" class="debug error">{{ errorMsg }}</div>
        </div>
    </div>

</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import api from '../../../../services/api.js'

const route = useRoute();

const loading = ref(false);
const errorMsg = ref("");

const expense = ref(null);

const expenseUserName = computed(() => {
    const u = expense.value?.user;
    if (!u) return "-";
    const first = u.first_name || "";
    const last = u.last_name || "";
    const full = `${first} ${last}`.trim();
    return full || u.name || "-";
});

function formatDate(dateStr) {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function formatMoney(val) {
    const n = Number(val);
    if (Number.isNaN(n)) return "0.00";
    return n.toFixed(2);
}

async function fetchPrintData(id) {
    try {
        loading.value = true;
        errorMsg.value = "";

        const res = await api.get(`/expenses/print/${id}`);

        expense.value = res.data?.data ?? null;
        
        // console.log(expense.value);

        setTimeout(() => {
            window.print();
            setTimeout(() => window.close(), 100);
        }, 100);
    } catch (err) {
        // console.log("AXIOS ERROR:", err);
        // console.log("STATUS:", err?.response?.status);
        // console.log("DATA:", err?.response?.data);
        // console.log("HEADERS:", err?.response?.headers);
        errorMsg.value = err?.response?.data?.message || "Failed to load print data.";
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    const id = route.params.id;
    if(id) fetchPrintData(id);
    else errorMsg.value = "Route param id missing.";
});
</script>















<style scoped>
/* A4 landscape fixed page */
.a4-page {
    width: 297mm;
    height: 210mm;
    background: #fff;
    margin: 0 auto;
    position: relative;

    /* must: prevent extra page */
    overflow: hidden;
}

/* Half page fixed height-safe */
.half-page {
    width: 148.5mm;
    height: 210mm;            /* lock inside one page */
    margin: 0 auto;
    padding: 8mm;             /* ⬇ reduced */
    box-sizing: border-box;

    /* prevent overflow pushing to page 2 */
    overflow: hidden;
}

/* Header */
.header { text-align: center; }
.header h1 { font-size: 20px; font-weight: 800; margin: 0 0 3px 0; }
.header p { font-size: 11px; margin: 2px 0; }
.header .meta { font-size: 10px; }
.header hr { margin: 6px 0; border: none; border-top: 1px solid #000; }
.header h2 { font-size: 14px; font-weight: 800; margin: 4px 0 0 0; }

/* Expense box (make compact) */
.expense-box {
    margin-top: 6mm;          /* ⬇ reduced */
    border: 2px solid #000;
    border-radius: 8px;
    padding: 7mm;             /* ⬇ reduced */
    box-sizing: border-box;
}

/* Rows compact */
.row {
    display: flex;
    justify-content: space-between;
    gap: 6mm;                 /* ⬇ reduced */
    margin-bottom: 4mm;       /* ⬇ reduced */
}

.col { width: 50%; min-width: 0; }
.right { text-align: right; }

.label { display: block; font-size: 11px; color: #4b5563; margin-bottom: 1mm; }
.value { font-size: 13px; font-weight: 700; color: #0f172a; word-break: break-word; }

/* Remark compact */
.remark {
    margin-top: 3mm;
}

.remark-box {
    margin-top: 1.5mm;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    padding: 4mm;
    font-size: 12px;
    background: #f8fafc;

    /* auto height */
    height: auto;
    max-height: none;
    overflow: visible;
    word-break: break-word;
}


/* Amount compact */
.amount {
    margin-top: 5mm;
    padding-top: 4mm;
    border-top: 1px dashed #000;
    text-align: center;
}
.amount-label { display: block; font-size: 11px; color: #475569; }
.amount-value { margin-top: 1mm; font-size: 18px; font-weight: 900; }

/* Signatures compact */
.signatures {
    display: flex;
    justify-content: space-between;
    gap: 12mm;
    margin-top: 10mm;         /* ⬇ reduced */
}
.sig { width: 50%; text-align: center; font-size: 11px; color: #0f172a; }
.sig-line { width: 70%; margin: 0 auto 1.5mm auto; border-top: 2px solid #000; }

/* Footer compact */
.footer {
    text-align: center;
    margin-top: 6mm;          /* ⬇ reduced */
    font-size: 10px;
    color: #0f172a;
}

/* Debug off in print */
@media print {
    @page { size: A4 landscape; margin: 0; }

    :global(html), :global(body) {
        margin: 0 !important;
        padding: 0 !important;
        background: #fff !important;
    }

    /* prevent any extra top/bottom whitespace */
    .debug { display: none !important; }
}
</style>
