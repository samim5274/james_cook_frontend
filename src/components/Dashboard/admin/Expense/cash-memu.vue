<template>
    <!-- Print Wrapper (A4 Landscape Base) -->
    <div class="a4-page">
        <!-- Half Page Container -->
        <div class="half-page">
            <div class="voucher-border">
                
                <!-- Header Section -->
                <div class="voucher-header">
                    <div class="header-top">
                        <div class="company-info">
                            <h1 class="company-name">MERCUVIAX SOFTWARE</h1>
                            <p class="company-address">Ka-153/3, Khilkhet, Dhaka-1229, Bangladesh</p>
                            <p class="company-contact">Phone: +880 1533-021557 | Email: mercuviax@gmail.com</p>
                        </div>
                        <div class="voucher-badge-box">
                            <div class="voucher-badge">EXPENSE VOUCHER</div>
                        </div>
                    </div>
                </div>

                <!-- Voucher Meta Data Bar -->
                <div class="meta-section">
                    <div class="meta-item">
                        <span class="meta-label">VOUCHER NO:</span>
                        <span class="meta-value">#EXP-{{ expense?.id ?? "0000" }}</span>
                    </div>
                    <div class="meta-item text-center">
                        <span class="meta-label">PAYMENT MODE:</span>
                        <span class="meta-value">CASH / DIGITAL</span>
                    </div>
                    <div class="meta-item text-right">
                        <span class="meta-label">DATE:</span>
                        <span class="meta-value">{{ expense?.date ? formatDate(expense.date) : "-" }}</span>
                    </div>
                </div>

                <!-- Grid Details Table -->
                <table class="voucher-table">
                    <thead>
                        <tr>
                            <th style="width: 8%;">SL</th>
                            <th style="width: 62%;">PARTICULARS / ACCOUNT HEAD</th>
                            <th style="width: 30%; text-align: right;">AMOUNT (BDT)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="text-center font-bold">01</td>
                            <td>
                                <div class="item-title">{{ expense?.title || "Expense Record" }}</div>
                                <div class="item-meta">
                                    <span><strong>Category:</strong> {{ expense?.category?.name || "N/A" }}</span>
                                    <span v-if="expense?.subcategory?.name"> | <strong>Subcategory:</strong> {{ expense.subcategory.name }}</span>
                                </div>
                                <div class="item-remark" v-if="expense?.remark">
                                    <strong>Note:</strong> {{ expense.remark }}
                                </div>
                            </td>
                            <td class="text-right font-bold amount-cell">
                                ৳ {{ formatMoney(expense?.amount) }}
                            </td>
                        </tr>
                        <!-- Empty Rows to Fill Space Elegantly -->
                        <tr class="empty-row">
                            <td class="text-center">-</td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="2" class="text-right font-bold total-label">TOTAL AMOUNT:</td>
                            <td class="text-right font-black total-amount">
                                ৳ {{ formatMoney(expense?.amount) }}
                            </td>
                        </tr>
                    </tfoot>
                </table>

                <!-- Info Bar -->
                <div class="info-row">
                    <div class="info-item">
                        <span class="info-label">PAID TO / PREPARED BY:</span>
                        <span class="info-value">{{ expenseUserName }}</span>
                    </div>
                </div>

                <!-- Signatures Grid -->
                <div class="signature-section">
                    <div class="sig-col">
                        <div class="sig-line"></div>
                        <p class="sig-label">Prepared By</p>
                        <p class="sig-sub">{{ expenseUserName }}</p>
                    </div>
                    <div class="sig-col">
                        <div class="sig-line"></div>
                        <p class="sig-label">Checked By</p>
                        <p class="sig-sub">Accounts Dept.</p>
                    </div>
                    <div class="sig-col">
                        <div class="sig-line"></div>
                        <p class="sig-label">Approved By</p>
                        <p class="sig-sub">Authorized Stamp</p>
                    </div>
                </div>

                <!-- Footer Line -->
                <div class="voucher-footer">
                    <span>Software Generated Receipt | Powered by <strong>Mercuviax Software</strong></span>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import api from '../../../../services/api.js';

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
    return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

async function fetchPrintData(id) {
    try {
        loading.value = true;
        errorMsg.value = "";

        const res = await api.get(`/expenses/print/${id}`);
        expense.value = res.data?.data ?? null;

        setTimeout(() => {
            window.print();
            setTimeout(() => window.close(), 100);
        }, 200);
    } catch (err) {
        errorMsg.value = err?.response?.data?.message || "Failed to load print data.";
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    const id = route.params.id;
    if (id) fetchPrintData(id);
    else errorMsg.value = "Route param id missing.";
});
</script>

<style scoped>
/* Page Layout Setup */
.a4-page {
    width: 297mm;
    height: 210mm;
    background: #ffffff;
    margin: 0 auto;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Half Page Frame Ratio */
.half-page {
    width: 148.5mm;
    height: 210mm;
    padding: 6mm;
    box-sizing: border-box;
    background: #ffffff;
}

/* Corporate Outer Double Border */
.voucher-border {
    border: 2px solid #0f172a;
    outline: 1px solid #0f172a;
    outline-offset: -4px;
    padding: 6mm 7mm;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

/* Header Section */
.header-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 2px solid #0f172a;
    padding-bottom: 3mm;
}

.company-name {
    font-size: 16px;
    font-weight: 900;
    color: #0f172a;
    margin: 0;
    letter-spacing: 0.5px;
}

.company-address, .company-contact {
    font-size: 9px;
    color: #334155;
    margin: 1px 0 0 0;
}

.voucher-badge-box {
    text-align: right;
}

.voucher-badge {
    background: #0f172a;
    color: #ffffff;
    font-size: 10px;
    font-weight: 800;
    padding: 4px 10px;
    letter-spacing: 0.8px;
    display: inline-block;
}

/* Meta Data Bar */
.meta-section {
    display: flex;
    justify-content: space-between;
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    padding: 4px 8px;
    margin-top: 3mm;
}

.meta-item {
    font-size: 9.5px;
}

.meta-label {
    color: #475569;
    font-weight: 700;
    margin-right: 3px;
}

.meta-value {
    color: #0f172a;
    font-weight: 800;
}

/* Table Design */
.voucher-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 3mm;
    flex-grow: 1;
}

.voucher-table th {
    background: #0f172a;
    color: #ffffff;
    font-size: 9.5px;
    font-weight: 700;
    padding: 4px 6px;
    border: 1px solid #0f172a;
    letter-spacing: 0.5px;
}

.voucher-table td {
    border: 1px solid #cbd5e1;
    padding: 6px;
    font-size: 10px;
    color: #0f172a;
    vertical-align: top;
}

.item-title {
    font-weight: 800;
    font-size: 11px;
    color: #0f172a;
}

.item-meta {
    font-size: 9px;
    color: #475569;
    margin-top: 2px;
}

.item-remark {
    font-size: 9px;
    color: #334155;
    margin-top: 4px;
    background: #f1f5f9;
    padding: 3px 5px;
    border-left: 2px solid #0f172a;
}

.amount-cell {
    font-size: 12px;
}

.empty-row td {
    height: 12mm; /* Fills up vertical gap nicely */
}

/* Footer / Total */
.voucher-table tfoot td {
    border-top: 2px solid #0f172a;
    background: #f8fafc;
    padding: 5px;
}

.total-label {
    font-size: 10px;
    color: #0f172a;
}

.total-amount {
    font-size: 13px;
    color: #0f172a;
}

/* Info Row */
.info-row {
    margin-top: 3mm;
    border-bottom: 1px dashed #cbd5e1;
    padding-bottom: 2mm;
}

.info-item {
    font-size: 10px;
}

.info-label {
    font-weight: 700;
    color: #475569;
    margin-right: 5px;
}

.info-value {
    font-weight: 700;
    color: #0f172a;
}

/* Signatures */
.signature-section {
    display: flex;
    justify-content: space-between;
    gap: 6mm;
    margin-top: 10mm;
}

.sig-col {
    flex: 1;
    text-align: center;
}

.sig-line {
    border-top: 1.5px solid #0f172a;
    margin-bottom: 3px;
}

.sig-label {
    font-size: 9.5px;
    font-weight: 800;
    color: #0f172a;
    margin: 0;
}

.sig-sub {
    font-size: 8.5px;
    color: #64748b;
    margin: 1px 0 0 0;
}

/* Footer */
.voucher-footer {
    text-align: center;
    border-top: 1px solid #e2e8f0;
    padding-top: 1.5mm;
    margin-top: 2mm;
}

.voucher-footer span {
    font-size: 8.5px;
    color: #94a3b8;
}

/* Utility */
.text-center { text-align: center; }
.text-right { text-align: right; }
.font-bold { font-weight: 700; }
.font-black { font-weight: 900; }

/* Print Rules */
@media print {
    @page {
        size: A4 landscape;
        margin: 0;
    }

    :global(html), :global(body) {
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
    }
}
</style>