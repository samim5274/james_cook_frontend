<template>
    <div class="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-200">
        <Header
            @open-sidebar="sidebarOpen = true"
            @search="onSearch"
            :isDark="isDark"
            @toggle-theme="toggleTheme"
        />

        <div class="flex min-h-[calc(100vh-56px)]">
        <Navbar v-model="active" :open="sidebarOpen" @close="sidebarOpen=false" />

        <main class="flex-1 min-w-0 bg-gray-50 dark:bg-[#0C1326] px-4 sm:px-6 lg:px-8 py-6">
            <Message
                :successMsg="successMsg"
                :errorMsg="errorMsg"
                @update:successMsg="successMsg = $event"
                @update:errorMsg="errorMsg = $event"
            />
            <!-- Header -->
            <div class="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">My Profile</h1>
                    <p class="text-sm text-slate-600 dark:text-slate-300">Update your personal information</p>
                </div>

                <button
                    type="button"
                    @click="refreshProfile"
                    :disabled="loading"
                    class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm
                        hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
                    <i class="fa-solid fa-rotate"></i>
                    Refresh
                </button>
            </div>

            <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <!-- Left: summary card -->
                <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <div class="flex items-center gap-4">

                        <img :src="photoUrl" alt="User photo" class="h-16 w-16 rounded-2xl object-cover ring-2 ring-slate-200 dark:ring-white/10"/>

                        <div class="min-w-0">
                            <p class="truncate text-lg font-bold text-slate-900 dark:text-slate-100">
                                {{ user?.name || "User" }}
                            </p>
                            <p class="truncate text-sm text-slate-500 dark:text-slate-400">
                                {{ user?.email || "No email" }}
                                <span
                                    v-if="user?.email"
                                    class="ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
                                    :class="user?.email_verified_at
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                                    : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'">
                                    {{ user?.email_verified_at ? 'Verified' : 'Not Verified' }}
                                </span>
                            </p>

                            <div class="mt-2 flex flex-wrap gap-2">
                                <span class="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                    <i class="fa-solid fa-user-shield mr-2"></i>
                                    {{ user?.role || "user" }}
                                </span>

                                <span
                                    class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
                                    :class="user?.is_active
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'">
                                    <span class="mr-2 h-2 w-2 rounded-full" :class="user?.is_active ? 'bg-emerald-500' : 'bg-red-500'"></span>
                                        {{ user?.is_active ? "Active" : "Inactive" }}
                                </span>

                                <span
                                    class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
                                    :class="user?.is_profile_completed
                                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'">
                                    <i class="fa-solid fa-circle-check mr-2" v-if="user?.is_profile_completed"></i>
                                    <i class="fa-solid fa-triangle-exclamation mr-2" v-else></i>
                                        {{ user?.is_profile_completed ? "Profile completed" : "Profile incomplete" }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="mt-5 space-y-3 text-sm">
                    <InfoRow label="Phone" :value="[ user?.phone || 'N/A', user?.phone ? h( 'span',
                        {
                            class: [
                            'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold',
                            user?.phone_verified_at
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                                : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
                            ].join(' ')
                        }, user?.phone_verified_at ? 'Verified' : 'Not Verified' ) : null ]"/>
                    <InfoRow label="Date of Birth" :value="formatOnlyDate(user?.dob)" />
                    <InfoRow label="Gender" :value="user?.gender || 'N/A'" />
                    <InfoRow label="Blood group" :value="user?.blood_group || 'N/A'" />
                    <InfoRow label="NID" :value="user?.national_id || 'N/A'" />
                    <InfoRow label="Religion" :value="user?.religion || 'N/A'" />
                    <InfoRow label="Last login" :value="formatDateTime(user?.last_login_at)" />
                    <InfoRow label="Login IP" :value="user?.last_login_ip || 'N/A'" />
                    </div>
                </section>

                <!-- Right: form -->
                <section class="lg:col-span-2 space-y-6">
                    <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <h2 class="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Personal Information</h2>

                        <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Name">
                            <input v-model="form.name" type="text" class="input" placeholder="Your name" />
                            </Field>

                            <Field label="Phone">
                            <input v-model="form.phone" type="text" class="input" placeholder="01XXXXXXXXX" />
                            </Field>

                            <Field label="Email">
                            <input :value="user?.email || ''" disabled class="inputDisabled" />
                            </Field>

                            <Field label="Date of birth">
                            <input v-model="form.dob" type="date" class="input" />
                            </Field>

                            <Field label="Gender">
                            <select v-model="form.gender" class="input">
                                <option value="" disabled="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            </Field>

                            <Field label="Blood group">
                            <select v-model="form.blood_group" class="input">
                                <option value="">Select</option>
                                <option>O+</option><option>O-</option>
                                <option>A+</option><option>A-</option>
                                <option>B+</option><option>B-</option>
                                <option>AB+</option><option>AB-</option>
                            </select>
                            </Field>

                            <Field label="National ID" class="sm:col-span-2">
                            <input v-model="form.national_id" type="text" class="input" placeholder="NID number" />
                            </Field>

                            <Field label="Religion" class="sm:col-span-2">
                            <input v-model="form.religion" type="text" class="input" placeholder="Religion" />
                            </Field>
                        </div>
                    </div>

                    <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <h2 class="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Address</h2>

                        <div class="mt-4 grid grid-cols-1 gap-4">
                            <Field label="Present address">
                            <textarea v-model="form.present_address" rows="3" class="input" placeholder="Present address"></textarea>
                            </Field>

                            <Field label="Permanent address">
                            <textarea v-model="form.permanent_address" rows="3" class="input" placeholder="Permanent address"></textarea>
                            </Field>
                        </div>
                    </div>

                    <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <h2 class="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Photo</h2>

                        <div class="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                            <img :src="photoPreview || photoUrl" class="h-16 w-16 rounded-2xl object-cover ring-2 ring-slate-200 dark:ring-white/10" />

                            <div class="flex-1">
                            <input type="file" accept="image/*" @change="onPhotoChange" class="block w-full text-sm text-slate-600 dark:text-slate-200" />
                            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">PNG/JPG recommended.</p>
                            </div>
                        </div>

                        <div class="mt-5 flex justify-end gap-2">
                            <button
                            type="button"
                            @click="updateProfile"
                            :disabled="saving"
                            class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
                            >
                            <i class="fa-solid fa-floppy-disk"></i>
                            {{ saving ? "Saving..." : "Save Changes" }}
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </main>
        </div>
    </div>
</template>

<script setup>
import { computed, h, onBeforeUnmount, onMounted, ref } from "vue";
import api, { makeImg } from "../../services/api";
import Message from '../Message/message.vue'

import Navbar from "../Dashboard/navbar.vue";
import Header from "../Dashboard/header.vue";

/** small inline components */
const InfoRow = (props) =>
    h( "div",
        { class: "flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60" },
        [ h("span", { class: "text-slate-500 dark:text-slate-300" }, props.label),
    // right side (value)
    h( "span",
        { class: "flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100" },
        Array.isArray(props.value) ? props.value : [props.value] ),
    ]
    );

const Field = (props, { slots }) =>
    h("div", { class: props.class || "" }, [
        h("label", { class: "mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-200" }, props.label),
        slots.default?.(),
    ]);

const sidebarOpen = ref(false);
const active = ref("dashboard");

const isDark = ref(false);
function applyTheme(dark) {
    isDark.value = dark;
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
}
function toggleTheme() {
    applyTheme(!isDark.value);
}
function onSearch(q) {
    console.log("search:", q);
}

const user = ref(null);
const loading = ref(false);
const saving = ref(false);
const errorMsg = ref("");
const successMsg = ref("");

const form = ref({
    name: "",
    phone: "",
    dob: "",
    gender: "",
    blood_group: "",
    present_address: "",
    permanent_address: "",
    national_id: "",
    religion: "",
});

const photoFile = ref(null);
const photoPreview = ref("");

const photoUrl = computed(() => {
    const p = user.value?.photo;
    if (!p) return "/images/avatar.png";
    return makeImg(p);
});

function onPhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    photoFile.value = file;
    photoPreview.value = URL.createObjectURL(file);
}

function formatDateTime(date) {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-BD", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function setSuccess(msg) {
    successMsg.value = msg;
    setTimeout(() => (successMsg.value = ""), 2500);
}
function setError(msg) {
    errorMsg.value = msg;
    setTimeout(() => (errorMsg.value = ""), 3500);
}

function formatOnlyDate(d) {
    if (!d) return "N/A";
    return new Date(d).toLocaleDateString("en-BD", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

// get login user data
async function refreshProfile() {
    loading.value = true;
    try {
        const res = await api.get("/user");
        user.value = res.data;

        const rawDob = user.value?.dob;
        const rawGender = user.value?.gender;

        // fill form
        form.value.name = user.value?.name ?? "";
        form.value.phone = user.value?.phone ?? "";        
        form.value.dob = rawDob ? String(rawDob).slice(0, 10) : "";
        form.value.gender = rawGender ? String(rawGender).toLowerCase().trim() : "";
        form.value.blood_group = user.value?.blood_group ?? "";
        form.value.present_address = user.value?.present_address ?? "";
        form.value.permanent_address = user.value?.permanent_address ?? "";
        form.value.national_id = user.value?.national_id ?? "";
        form.value.religion = user.value?.religion ?? "";
    } catch (e) {
        setError(e?.response?.data?.message || "Failed to load profile");
    } finally {
        loading.value = false;
    }
}

// user update profile
async function updateProfile() {
    saving.value = true;
    try {
        const fd = new FormData();
        fd.append("_method", "PUT");

        Object.entries(form.value).forEach(([k, v]) => {
            if (v !== null && v !== undefined) fd.append(k, v);
        });

        if (photoFile.value) fd.append("photo", photoFile.value);

        const res = await api.post("/profile", fd);
        user.value = res.data?.data ?? user.value;

        if (user.value) {
            form.value.name = user.value.name ?? "";
            form.value.phone = user.value.phone ?? "";
        }

        setSuccess("Profile updated");

    } catch (e) {
        const msg = e?.response?.data?.message || (e?.response?.data?.errors ? Object.values(e.response.data.errors).flat()[0] : null) || "Failed to update profile";
        setError(msg);
    } finally {
        saving.value = false;
    }
}

function handleEsc(e) {
    if (e.key === "Escape") sidebarOpen.value = false;
}

onMounted(() => {
    refreshProfile();
    window.addEventListener("keydown", handleEsc);

    const saved = localStorage.getItem("theme");
    if (saved === "dark") applyTheme(true);
    else if (saved === "light") applyTheme(false);
    else applyTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
});

onBeforeUnmount(() => {
    window.removeEventListener("keydown", handleEsc);
    if (photoPreview.value) URL.revokeObjectURL(photoPreview.value);
});
</script>

<style scoped>
.input{
    @apply w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400
        focus:outline-none focus:ring-2 focus:ring-indigo-500
        dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100;
}
.inputDisabled{
    @apply w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600
        dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300;
}
</style>