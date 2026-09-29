<template>
    <div class="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-200">
        <HeaderSection
            :is-dark="isDark"
            @toggle-dark="toggleDarkMode"
            @toggle-menu="toggleMenu"
        />

        <div class="flex min-h-[calc(100vh-56px)]">
            <Navbar
                :mobile-menu="mobileMenu"
                @close="mobileMenu = false" />

            <Message
                :successMsg="successMsg"
                :errorMsg="errorMsg"
                @update:successMsg="successMsg = $event"
                @update:errorMsg="errorMsg = $event"
            />

            <!-- Content -->
            <div class="flex-1 min-w-0 flex flex-col">
                <div class="min-h-screen bg-gray-50 dark:bg-[#0f172e]">
                    <div class="mx-auto px-4 sm:px-6 lg:px-8 pt-5">

                        <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white"><i class="fa-solid fa-calendar-plus"></i> Create New Product</h2>

                        <form @submit.prevent="submit" class="space-y-6">

                            <!-- Name -->
                            <div>
                                <label class="label">Product Name</label>
                                <input v-model="form.name" class="input" placeholder="e.g Classic Leather Backpack"/>
                                <p class="error" v-if="errors.name">{{ errors.name[0] }}</p>
                            </div>

                            <!-- SKU -->
                            <div>
                                <label class="label">SKU</label>
                                <input v-model="form.sku" class="input" placeholder="e.g L-BACKPACK-001"/>
                                <p class="error" v-if="errors.sku">{{ errors.sku[0] }}</p>
                            </div>

                            <!-- Brands -->
                            <div>
                                <label class="label">Brand</label>
                                <select v-model="form.brand">
                                    <option disabled selected value="">-- Select Brand --</option>
                                    <option v-for="brand in brands" :value="brand.id">{{ brand.name }}</option>
                                </select>
                                <p class="error" v-if="errors.brand">{{ errors.brand[0] }}</p>
                            </div>

                            <!-- Category + Subcategory -->
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="label">Category</label>
                                    <select v-model="form.category">
                                        <option disabled selected value="">-- Select Category --</option>
                                        <option v-for="category in categories" :value="category.id">{{ category.name }}</option>
                                    </select>
                                    <p class="error" v-if="errors.category">{{ errors.category[0] }}</p>
                                </div>

                                <div>
                                    <label class="label">Sub Category</label>
                                    <select v-model="form.subcategory">
                                        <option disabled selected value="">-- Select Sub-Category --</option>
                                        <option v-for="subcategory in filteredSubCategories" :value="subcategory.id">{{ subcategory.name }}</option>
                                    </select>
                                    <p class="error" v-if="errors.subcategory">{{ errors.subcategory[0] }}</p>
                                </div>
                            </div>

                            <!-- Price + Stock -->
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="label">Purchase Price</label>
                                    <input type="number" v-model="form.purchase_price" min="0" class="input" placeholder="e.g BDT ৳ 450.00"/>
                                </div>

                                <div>
                                    <label class="label">Price</label>
                                    <input type="number" v-model="form.price" min="0" class="input" placeholder="e.g BDT ৳ 450.00"/>
                                </div>
                            </div>

                            <!-- Discount Price -->
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="label">Discount (Optional)</label>
                                    <input type="number" v-model="form.discount" min="0" class="input" placeholder="e.g BDT ৳ 400.00"/>
                                    <p class="error" v-if="errors.discount">{{ errors.discount[0] }}</p>
                                </div>
                                <div>
                                    <label class="label">Point</label>
                                    <input type="number" v-model="form.point" min="0" class="input" placeholder="e.g 100"/>
                                    <p class="error" v-if="errors.point">{{ errors.point[0] }}</p>
                                </div>
                            </div>

                            <!-- Minimum Stock -->
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="label">Stock Quantity</label>
                                    <input type="number" readonly v-model="form.stock_quantity" min="0" class="input" placeholder="e.g 15 pcs"/>
                                </div>

                                <div>
                                    <label class="label">Minimum Stock Alert</label>
                                    <input type="number" v-model="form.min_stock" min="0" class="input" placeholder="e.g 5 pcs"/>
                                    <p class="error" v-if="errors.min_stock">{{ errors.min_stock[0] }}</p>
                                </div>
                            </div>

                            <!-- Summary -->
                            <div>
                                <label class="label">Summary</label>
                                <input type="text" v-model="form.summary" class="input" placeholder="e.g Product Summary"/>
                                <p class="error" v-if="errors.summary">{{ errors.summary[0] }}</p>
                            </div>

                            <!-- Description -->
                            <div>
                                <label class="label">Description</label>
                                <textarea v-model="form.description" class="input" placeholder="e.g Detailed product description"></textarea>
                                <p class="error" v-if="errors.description">{{ errors.description[0] }}</p>
                            </div>

                            <!-- SLUG -->
                            <div>
                                <label class="label">SLUG</label>
                                <input type="text" v-model="form.slug" class="input" placeholder="e.g classic-leather-backpack-xz4a"/>
                                <p class="error" v-if="errors.slug">{{ errors.slug[0] }}</p>
                            </div>

                            <div class="grid grid-cols-3 gap-4">
                                <!-- Is Active -->
                                <div>
                                    <label class="label" for="is_active">Is Active</label>
                                    <input type="checkbox" v-model="form.is_active" id="is_active"/>
                                    <label class="ml-2 text-slate-900 dark:text-slate-50 cursor-pointer" for="is_active">Active Product</label>
                                </div>
                            </div>

                            <!-- Multi Image Upload -->
                            <div>
                                <label class="label">Product Images</label>

                                <!-- Drag & Drop Zone -->
                                <div
                                    class="rounded-2xl border-2 border-dashed p-5 transition bg-white dark:bg-slate-800"
                                    :class="isDragOver ? 'border-blue-500 bg-blue-50 dark:bg-slate-700' : 'border-slate-300 dark:border-slate-600'"
                                    @dragover.prevent="onDragOver"
                                    @dragleave="onDragLeave"
                                    @drop.prevent="onDrop">
                                    <div class="flex items-center justify-between gap-4 flex-wrap">
                                    <div class="text-sm text-slate-600 dark:text-slate-300">
                                        <div class="font-semibold text-slate-800 dark:text-white">Drag & drop images here</div>
                                        <div class="text-xs text-slate-500 dark:text-slate-400">or click Browse (jpg, png, webp)</div>
                                    </div>

                                    <!-- Browse Button -->
                                    <label class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white cursor-pointer hover:bg-slate-800">
                                        Browse
                                        <input
                                        type="file"
                                        accept="image/*"
                                        class="hidden"
                                        multiple
                                        @change="handleImage"
                                        />
                                    </label>
                                    </div>

                                    <!-- Preview -->
                                    <div v-if="preview.length" class="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    <div v-for="(img, idx) in preview" :key="idx" class="relative">
                                        <img :src="img.url" class="h-full w-full rounded-xl border object-cover"/>
                                        <button type="button" class="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700" @click="removeImage(idx)">
                                        ✕
                                        </button>
                                        <p class="text-xs text-slate-500 mt-1 text-center truncate dark:text-slate-300">{{ img.file.name }}</p>
                                    </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Buttons -->
                            <div class="flex gap-3 pt-4">
                                <button :disabled="loading" class="bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700">
                                    {{ loading ? 'Saving...' : 'Save Product' }}
                                </button>

                                <button type="button" @click="resetForm()" class="bg-red-600 text-white px-5 py-2 rounded-xl hover:bg-red-700">
                                    Clear
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
    <FooterSection />
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api, {makeImg} from '../../../../services/api.js'

import Navbar from "../../admin/admin-navbar.vue";
import HeaderSection from "../../admin/admin-header.vue";
import Message from '../../../Message/message.vue'
import FooterSection from "../../../footer.vue";





const mobileMenu = ref(false);

function toggleMenu() {
    mobileMenu.value = !mobileMenu.value;
}





const router = useRouter()
const successMsg = ref('')
const errorMsg = ref('')
const loading = ref(false)
const errors = reactive({})
const active = ref('dashboard');
const preview = ref([])
const isDragOver = ref(false)




//  Image Handling
function setFile(file) {
    if (!file.type?.startsWith("image/")) return;
    form.images.push(file);
    preview.value.push({
        file,
        url: URL.createObjectURL(file),
    });
}

function handleImage(e) {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => setFile(file));
}

function onDrop(e) {
    isDragOver.value = false;
    const files = Array.from(e.dataTransfer?.files || []);
    files.forEach((file) => setFile(file));
}

function onDragOver(e){
    e.preventDefault()
    isDragOver.value = true
}

function onDragLeave(){
    isDragOver.value = false
}

function removeImage(idx) {
    form.images.splice(idx, 1);
    preview.value.splice(idx, 1);
}






// get category
const categories = ref([]);
async function fetchCategories(){
    try{
        const res = await api.get('/products/get-categories')
        categories.value = res.data.data;
    }catch(err){
        console.error('Failed to fetch categories:', err)
    }
}





// get subcategory
const subcategories = ref([]);
async function fetchSubCategories(){
    try{
        const res = await api.get('/products/get-subcategories')
        subcategories.value = res.data.data;
    }catch(err){
        console.error('Failed to fetch subcategories:', err)
    }
}

// filter subcategories based on selected category
const filteredSubCategories = computed(() => {
    if (!form.category) return [];

    return subcategories.value.filter(sub =>
        Number(sub.category_id) === Number(form.category)
    );
});





// get brand
const brands = ref([]);
async function fetchBrands(){
    try{
        const res = await api.get('/products/get-brands')
        brands.value = res.data.data;
    }catch(err){
        console.error('Failed to fetch brands:', err)
    }
}






function resetErrorAndLoading() {
    loading.value = true;
    errorMsg.value = "";
}

// Initial state object for reset purpose
const initialForm = {
    name: '',
    sku: '',
    category: '',
    subcategory: '',
    brand: '',
    purchase_price:'',
    price: '',
    discount: '',
    stock_quantity: '0',
    min_stock: '',
    images: [],       // for uploaded files

    summary: '',
    description: '',
    slug: '',
    is_active: true,
    point: '',
}

// reactive form
const form = reactive({ ...initialForm })

// reset function
function resetForm() {
    // reset all fields
    Object.keys(initialForm).forEach(key => {
        form[key] = Array.isArray(initialForm[key]) ? [] : initialForm[key]
    })

    // reset preview and errors
    preview.value = []
    Object.keys(errors).forEach(key => delete errors[key])

    // reset success/error messages
    successMsg.value = ''
    errorMsg.value = ''
}

/* Submit */
async function submit(){
    resetErrorAndLoading();

    try{
        const fd = new FormData()

        // normal fields
        fd.append('name', form.name);
        fd.append('sku', form.sku);
        fd.append('category', form.category);
        fd.append('subcategory', form.subcategory);
        fd.append('brand', form.brand);
        fd.append('purchase_price', form.purchase_price);
        fd.append('price', form.price);
        fd.append('discount', form.discount || 0);
        fd.append('stock_quantity', form.stock_quantity);
        fd.append('min_stock', form.min_stock || 0);
        fd.append('point', form.point || 0);

        fd.append('summary', form.summary || '');
        fd.append('description', form.description || '');
        fd.append('slug', form.slug || '');

        fd.append('is_active', form.is_active ? 1 : 0);

        // images FIX
        form.images.forEach(file => {
            fd.append('images[]', file);
        });

        const res = await api.post('/products/create', fd, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })

        resetForm();
        successMsg.value = res.data.message || 'Product created successfully!';
        router.push('/admin/create-product')

    }catch(err){
        if(err.response?.data?.errors){
            Object.assign(errors, err.response.data.errors)
        }
        errorMsg.value = err.response?.data?.message || 'Failed to create product.'
    }finally{
        loading.value = false
    }
}









// dark and light mode
const isDark = ref(false);
function applyTheme(dark) {
    isDark.value = dark;
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
}

function toggleTheme() {
    applyTheme(!isDark.value);
}

function toggleDarkMode() {
    isDark.value = !isDark.value;
    document.documentElement.classList.toggle("dark",isDark.value);
    localStorage.setItem("theme",isDark.value ? "dark" : "light");
}



/* ESC to close drawer */
onMounted(() => {
    fetchCategories();
    fetchSubCategories();
    fetchBrands();





    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") sidebarOpen.value = false;
    });
    const saved = localStorage.getItem("theme");
    if (saved === "dark") applyTheme(true);
    else if (saved === "light") applyTheme(false);
    else applyTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
});
</script>

<style scoped>
@reference "../style.css";

.label{
  @apply text-sm font-semibold text-slate-700 block mb-1 dark:text-slate-300;
}
.input, select{
  @apply w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-800 dark:text-white dark:border-slate-600;
}
.error{
  @apply text-xs text-red-500 mt-1;
}
</style>

