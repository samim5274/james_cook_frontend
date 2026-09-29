<template>
    <div class="min-h-screen bg-slate-100 p-4 print:bg-white print:p-0">
        
        <!-- Floating Print Button (Screen view only) -->
        <div class="mx-auto mb-4 flex max-w-4xl justify-end gap-2 print:hidden">
            <button 
                @click="triggerPrint" 
                class="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-all cursor-pointer"
            >
                <i class="fa-solid fa-print"></i>
                <span>Print Report</span>
            </button>
        </div>

        <!-- Print Container (A4 Printable Area) -->
        <div class="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm print:max-w-none print:rounded-none print:p-0 print:shadow-none">
            
            <!-- Report Header -->
            <div class="flex flex-col gap-5 border-b border-slate-200 pb-5">
    
                <!-- Company Top Header -->
                <div class="text-center">
                    <h1>James Cook Bakery Cafe</h1>
                    <p>House#15, Road#03, Nikunja-2, Dhaka-1229</p>
                    <p class="meta">+8801856668991</p>
                </div>

                <hr class="border-dashed border-slate-200" />

                <!-- Report Info Header -->
                <div class="flex items-start justify-between">
                    <div>
                        <h2 class="text-xl font-black uppercase tracking-wider text-slate-800">Stock Report</h2>
                        <p class="mt-1 text-xs font-medium text-slate-500">
                            Date Range: 
                            <span class="font-bold text-slate-700">{{ printData.startDate || 'N/A' }}</span> 
                            to 
                            <span class="font-bold text-slate-700">{{ printData.endDate || 'N/A' }}</span>
                        </p>
                        <p v-if="printData.searchQuery" class="mt-0.5 text-xs text-slate-500">
                            Search Term: <span class="font-semibold text-slate-700">"{{ printData.searchQuery }}"</span>
                        </p>
                    </div>
                    
                    <div class="text-right">
                        <span class="rounded-lg bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700 print:bg-slate-100 print:text-slate-800">
                            Report Summary
                        </span>
                        <p class="mt-2 text-[10px] font-semibold text-slate-400">Printed On:</p>
                        <p class="text-xs font-medium text-slate-600">{{ printTime }}</p>
                    </div>
                </div>

            </div>

            <!-- Summary Cards Section -->
            <div v-if="printData.summary" class="my-5 grid grid-cols-5 gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <div>
                    <p class="text-[9px] font-bold uppercase tracking-wider text-slate-500">Stock In</p>
                    <p class="mt-1 text-sm font-black text-emerald-600">{{ Number(printData.summary.total_stock_in || 0).toLocaleString('en-BD') }}</p>
                </div>
                <div>
                    <p class="text-[9px] font-bold uppercase tracking-wider text-slate-500">Stock Out</p>
                    <p class="mt-1 text-sm font-black text-rose-600">{{ Number(printData.summary.total_stock_out || 0).toLocaleString('en-BD') }}</p>
                </div>
                <div>
                    <p class="text-[9px] font-bold uppercase tracking-wider text-slate-500">Net Stock</p>
                    <p class="mt-1 text-sm font-black text-indigo-600">{{ Number(printData.summary.net_stock || 0).toLocaleString('en-BD') }}</p>
                </div>
                <div>
                    <p class="text-[9px] font-bold uppercase tracking-wider text-slate-500">Purchase Value</p>
                    <p class="mt-1 text-sm font-black text-slate-800">৳ {{ Number(printData.summary.total_purchase_value || 0).toLocaleString('en-BD', { minimumFractionDigits: 2 }) }}</p>
                </div>
                <div>
                    <p class="text-[9px] font-bold uppercase tracking-wider text-slate-500">Stock Out Value</p>
                    <p class="mt-1 text-sm font-black text-slate-800">৳ {{ Number(printData.summary.total_stock_out_sales_value || 0).toLocaleString('en-BD', { minimumFractionDigits: 2 }) }}</p>
                </div>
            </div>

            <!-- Report Items Table -->
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                    <thead>
                        <tr class="border-b-2 border-slate-300 bg-slate-100 text-[10px] uppercase tracking-wider text-slate-600 print:bg-slate-200">
                            <th class="p-2.5">#</th>
                            <th class="p-2.5">Reg / Date</th>
                            <th class="p-2.5">Product</th>
                            <th class="p-2.5 text-right">Qty In</th>
                            <th class="p-2.5 text-right">Qty Out</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-200">
                        <tr v-for="(item, index) in printData.items" :key="index" class="hover:bg-slate-50">
                            <td class="p-2.5 font-medium text-slate-500">{{ index + 1 }}</td>
                            <td class="p-2.5">
                                <div class="font-bold text-slate-800">#{{ item.reg ?? 'N/A' }}</div>
                                <div class="text-[10px] text-slate-400">{{ formatDateTime(item.date) }}</div>
                            </td>
                            <td class="p-2.5">
                                <div class="font-bold text-slate-800">
                                    {{ item.product?.name ?? item.product_name ?? item.name ?? '-' }}
                                </div>
                                <div v-if="item.remark" class="mt-0.5 text-[10px] text-slate-500 italic">
                                    {{ item.remark }}
                                </div>
                            </td>
                            <td class="p-2.5 text-right font-bold text-emerald-600">{{ item.stockIn > 0 ? `+${item.stockIn}` : '-' }}</td>
                            <td class="p-2.5 text-right font-bold text-rose-600">{{ item.stockOut > 0 ? `-${item.stockOut}` : '-' }}</td>
                        </tr>
                        <tr v-if="!printData.items || printData.items.length === 0">
                            <td colspan="5" class="p-6 text-center text-slate-400 font-medium">No record found.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Report Footer -->
            <div class="mt-10 flex justify-between border-t border-slate-200 pt-4 text-[10px] text-slate-400 print:fixed print:bottom-4 print:left-0 print:right-0 print:px-8">
                <p>Generated automatically via Mercuviax System.</p>
                <p>Powered by: Mercuviax || +8801533021557</p>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

const printData = ref({});
const printTime = ref('');

function formatDateTime(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).format(date);
}

function triggerPrint() {
    window.print();
}

onMounted(() => {
    printTime.value = new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });

    const storedData = localStorage.getItem('print_report_data');
    if (storedData) {
        printData.value = JSON.parse(storedData);
    }

    nextTick(() => {
        setTimeout(() => {
            window.print();
        }, 100);
    });
});
</script>

<style scoped>
@media print {
    @page {
        size: A4 portrait;
        margin: 12mm 10mm 15mm 10mm; /* Top, Right, Bottom, Left */
    }
    
    html, body {
        background: white !important;
        font-size: 11px;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }

    table {
        page-break-inside: auto;
    }
    
    tr {
        page-break-inside: avoid;
        page-break-after: auto;
    }

    thead {
        display: table-header-group;
    }

    tfoot {
        display: table-footer-group;
    }
}
</style>