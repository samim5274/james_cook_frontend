<template>
    <div class="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-200">
        <Header
            @open-sidebar="sidebarOpen = true"
            @search="onSearch"
            :isDark="isDark" @toggle-theme="toggleTheme"
        />

        <div class="flex min-h-[calc(100vh-56px)]">
            <Navbar
                v-model="active"
                :open="sidebarOpen"
                @close="sidebarOpen = false"
            />

            <Message
                :successMsg="successMsg"
                :errorMsg="errorMsg"
                @update:successMsg="successMsg = $event"
                @update:errorMsg="errorMsg = $event"
            />

            <!-- Content -->
            <div class="min-h-screen w-full bg-slate-50/50 dark:bg-slate-950 transition-colors duration-300 p-4 lg:p-8 font-sans antialiased text-slate-800 dark:text-slate-200">
                <div class=" mx-auto bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xl rounded-2xl overflow-hidden backdrop-blur-md">
                
                    <header class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 px-6 py-5 bg-slate-50/30 dark:bg-slate-900/40">
                        <div class="flex items-center gap-3">
                        <div class="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
                            <i class="fa-brands fa-opencart text-xl"></i>
                        </div>
                        <div>
                            <h2 class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Marketing Strategy</h2>
                            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Earning structure, points policy & rank rewards</p>
                        </div>
                        </div>

                        <span class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/30">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active Plan
                        </span>
                    </header>

                    <div class="p-6 space-y-8">
                        
                        <div class="relative overflow-hidden bg-gradient-to-r from-amber-100 to-orange-50/40 dark:from-amber-950/20 dark:to-transparent border-l-4 border-amber-500 p-5 rounded-r-2xl shadow-sm">
                            <div class="flex items-start gap-4">
                                <div class="p-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl text-base shrink-0 animate-pulse">
                                    <i class="fa-solid fa-triangle-exclamation"></i>
                                </div>
                                
                                <div class="space-y-3 flex-1">
                                    <div class="flex flex-wrap items-center gap-2">
                                        <h3 class="text-sm font-black text-amber-950 dark:text-amber-300 tracking-wide">
                                            গুরুত্বপূর্ণ নোটিশ: অ্যাকাউন্ট অ্যাক্টিভেশন পলিসি
                                        </h3>
                                        <span class="inline-flex items-center rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                                            Official Policy
                                        </span>
                                    </div>
                                    
                                    <ul class="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
                                        <li class="flex items-start gap-2">
                                            <i class="fa-solid fa-circle-chevron-right text-amber-500 text-[10px] mt-1 shrink-0"></i>
                                            <p>
                                                <span class="text-amber-600 dark:text-amber-400 font-bold">শর্তাবলী ১:</span> 
                                                ব্যবসায়িক ধারাবাহিকতা বজায় রাখতে প্রতি মাসে সর্বনিম্ন 
                                                <span class="inline-block px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 font-black">
                                                    ১০০ পয়েন্ট
                                                </span> 
                                                পণ্য বা সেবা পারচেজ করা বাধ্যতামূলক। অন্যথায়, উক্ত আইডিটি স্বয়ংক্রিয়ভাবে 
                                                <span class="text-rose-600 dark:text-rose-400 underline decoration-2 underline-offset-2">ডিঅ্যাক্টিভ (Deactive)</span> হয়ে যাবে।
                                            </p>
                                        </li>

                                        <li class="flex items-start gap-2">
                                            <i class="fa-solid fa-circle-chevron-right text-amber-500 text-[10px] mt-1 shrink-0"></i>
                                            <p>
                                                <span class="text-amber-600 dark:text-amber-400 font-bold">শর্তাবলী ২:</span> 
                                                স্টার ক্লাব ও ডায়নামিক ক্লাবের সম্মানিত সদস্য এবং র‍্যাঙ্ক অর্জনকারী লিডারদের টিম ম্যানেজমেন্ট ও দক্ষতার স্বার্থে প্রতি সপ্তাহে নূন্যতম 
                                                <span class="text-slate-950 dark:text-white font-extrabold underline decoration-amber-500/50 decoration-2 underline-offset-2">১টি অফিশিয়াল কোম্পানির মিটিংয়ে</span> 
                                                উপস্থিত থাকা আবশ্যক।
                                            </p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <section class="space-y-6">
                            <div class="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800/80 pb-4">
                                <div class="w-1.5 h-5 bg-indigo-600 dark:bg-indigo-500 rounded-full shadow-sm shadow-indigo-500/30"></div>
                                <div>
                                    <h3 class="text-base font-black tracking-tight text-slate-900 dark:text-white">আর্নিং ও পয়েন্ট পলিসি</h3>
                                    <p class="text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase mt-0.5">Income & Generation Structure</p>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                
                                <div class="group relative overflow-hidden bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-emerald-500/20 dark:hover:border-emerald-500/20 transition-all duration-300">
                                    <div class="flex justify-between items-center">
                                        <span class="text-[10px] font-black tracking-widest uppercase px-2.5 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-lg border border-emerald-100 dark:border-emerald-500/10">
                                            Direct Income
                                        </span>
                                        <div class="p-2 bg-slate-50 dark:bg-slate-800 group-hover:bg-emerald-500 group-hover:text-white dark:group-hover:bg-emerald-500 text-slate-400 dark:text-slate-500 rounded-xl transition-all duration-300">
                                            <i class="fa-solid fa-user-plus text-sm"></i>
                                        </div>
                                    </div>
                                    <h4 class="text-xs font-bold text-slate-400 dark:text-slate-500 mt-5 uppercase tracking-wider">Per Refer Bonus</h4>
                                    <p class="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">৳ ২০০</p>
                                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed font-medium">প্রতিটি সফল ডিরেক্ট রেফারেলের জন্য ওয়ালেটে তাত্ক্ষণিক বোনাস যুক্ত হবে।</p>
                                    <div class="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-emerald-500 transition-all duration-300"></div>
                                </div>

                                <div class="group relative overflow-hidden bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-500/20 dark:hover:border-blue-500/20 transition-all duration-300">
                                    <div class="flex justify-between items-center">
                                        <span class="text-[10px] font-black tracking-widest uppercase px-2.5 py-1 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 rounded-lg border border-blue-100 dark:border-blue-500/10">
                                            Binary Matching
                                        </span>
                                        <div class="p-2 bg-slate-50 dark:bg-slate-800 group-hover:bg-blue-500 group-hover:text-white dark:group-hover:bg-blue-500 text-slate-400 dark:text-slate-500 rounded-xl transition-all duration-300">
                                            <i class="fa-solid fa-diagram-project text-sm"></i>
                                        </div>
                                    </div>
                                    <h4 class="text-xs font-bold text-slate-400 dark:text-slate-500 mt-5 uppercase tracking-wider">Matching Bonus</h4>
                                    <p class="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">৳ ১০০</p>
                                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed font-medium">লেফট এবং রাইট উভয় টিমের সফল ম্যাচিং রেশিও কমপ্লিট হওয়ার বোনাস।</p>
                                    <div class="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-blue-500 transition-all duration-300"></div>
                                </div>

                                <div class="group relative overflow-hidden bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-500/20 dark:hover:border-indigo-500/20 transition-all duration-300">
                                    <div class="flex justify-between items-center">
                                        <span class="text-[10px] font-black tracking-widest uppercase px-2.5 py-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 rounded-lg border border-indigo-100 dark:border-indigo-500/10">
                                            Upline Reward
                                        </span>
                                        <div class="p-2 bg-slate-50 dark:bg-slate-800 group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-500 text-slate-400 dark:text-slate-500 rounded-xl transition-all duration-300">
                                            <i class="fa-solid fa-arrow-turn-up text-sm"></i>
                                        </div>
                                    </div>
                                    <h4 class="text-xs font-bold text-slate-400 dark:text-slate-500 mt-5 uppercase tracking-wider">Refer Point Gen</h4>
                                    <p class="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">১০০ <span class="text-base font-bold text-slate-400">Pt</span></p>
                                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed font-medium">নতুন জেনারেশন তৈরিতে নির্দিষ্ট আপলাইন লেভেলের প্রত্যেকে ১০০ পয়েন্ট পাবেন।</p>
                                    <div class="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-indigo-500 transition-all duration-300"></div>
                                </div>

                                <div class="group relative overflow-hidden bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-purple-500/20 dark:hover:border-purple-500/20 transition-all duration-300">
                                    <div class="flex justify-between items-center">
                                        <span class="text-[10px] font-black tracking-widest uppercase px-2.5 py-1 bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 rounded-lg border border-purple-100 dark:border-purple-500/10">
                                            Purchase Value
                                        </span>
                                        <div class="p-2 bg-slate-50 dark:bg-slate-800 group-hover:bg-purple-500 group-hover:text-white dark:group-hover:bg-purple-500 text-slate-400 dark:text-slate-500 rounded-xl transition-all duration-300">
                                            <i class="fa-solid fa-bag-shopping text-sm"></i>
                                        </div>
                                    </div>
                                    <h4 class="text-xs font-bold text-slate-400 dark:text-slate-500 mt-5 uppercase tracking-wider">User Purchase Profit</h4>
                                    <p class="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1.5">১ Pt = ৳ ২</p>
                                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed font-medium">ডাউনলাইন কোনো প্রোডাক্ট পারচেজ করলে আপলাইনের সবাই প্রতি পয়েন্টে ২ টাকা পাবেন।</p>
                                    <div class="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-purple-500 transition-all duration-300"></div>
                                </div>

                            </div>
                        </section>

                        <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <!-- ১. Star Club Card -->
                            <div class="group relative overflow-hidden bg-white border border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 dark:hover:shadow-indigo-500/5 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-all duration-300">
                                <!-- ব্যাকগ্রাউন্ড ওয়াটারমার্ক আইকন -->
                                <div class="absolute -right-4 -bottom-6 text-indigo-500/[0.05] dark:text-indigo-400/[0.03] text-9xl font-black select-none pointer-events-none transition-transform duration-500 group-hover:scale-110">
                                    <i class="fa-solid fa-star"></i>
                                </div>
                                
                                <!-- টপ অ্যাকসেন্ট লাইন -->
                                <div class="absolute top-0 left-0 h-[3px] w-1/3 bg-indigo-500 rounded-r-full"></div>
                                
                                <div class="flex flex-col h-full justify-between relative z-10">
                                    <div>
                                        <span class="text-[10px] uppercase font-black tracking-widest text-indigo-600 dark:text-indigo-400">Club Level 4</span>
                                        <h4 class="text-lg font-black mt-1 flex items-center gap-2 text-slate-900 dark:text-white">
                                            <i class="fa-solid fa-star text-amber-500 dark:text-amber-400 text-sm animate-pulse"></i> Star Club
                                        </h4>
                                    </div>
                                    <p class="text-xs mt-4 text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
                                        সর্বমোট 
                                        <span class="inline-block px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 font-black border border-indigo-100 dark:border-indigo-500/10 text-[11px]">
                                            ১০ জন ডিরেক্ট স্পন্সর
                                        </span> 
                                        (10 Direct Sponsor) সফলভাবে সম্পন্ন করলে আপনার অ্যাকাউন্টে স্টার ক্লাব মেম্বারশিপ অ্যাক্টিভ হবে।
                                    </p>
                                </div>
                            </div>

                            <!-- ২. Dynamic Club Card -->
                            <div class="group relative overflow-hidden bg-white border border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 dark:hover:shadow-purple-500/5 hover:border-purple-500/30 dark:hover:border-purple-500/30 transition-all duration-300">
                                <!-- ব্যাকগ্রাউন্ড ওয়াটারমার্ক আইকন -->
                                <div class="absolute -right-4 -bottom-6 text-purple-500/[0.05] dark:text-purple-400/[0.03] text-9xl font-black select-none pointer-events-none transition-transform duration-500 group-hover:scale-110">
                                    <i class="fa-solid fa-rocket"></i>
                                </div>
                                
                                <!-- টপ অ্যাকসেন্ট লাইন -->
                                <div class="absolute top-0 left-0 h-[3px] w-1/3 bg-purple-500 rounded-r-full"></div>
                                
                                <div class="flex flex-col h-full justify-between relative z-10">
                                    <div>
                                        <span class="text-[10px] uppercase font-black tracking-widest text-purple-600 dark:text-purple-400">Club Level 5</span>
                                        <h4 class="text-lg font-black mt-1 flex items-center gap-2 text-slate-900 dark:text-white">
                                            <i class="fa-solid fa-rocket text-purple-500 dark:text-purple-400 text-sm"></i> Dynamic Club
                                        </h4>
                                    </div>
                                    <p class="text-xs mt-4 text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
                                        আপনার নিজস্ব ডাউনলাইন টিমে নূন্যতম 
                                        <span class="inline-block px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 font-black border border-purple-100 dark:border-purple-500/10 text-[11px]">
                                            ১০ জন ডিরেক্ট স্টার
                                        </span> 
                                        (10 Direct Star) মেম্বার থাকলে আপনি সফলভাবে ডায়নামিক ক্লাবে উন্নীত হবেন।
                                    </p>
                                </div>
                            </div>

                            <!-- ৩. Company Dealership Card -->
                            <div class="group relative overflow-hidden bg-white border border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 dark:hover:shadow-amber-500/5 hover:border-amber-500/30 dark:hover:border-amber-500/30 transition-all duration-300">
                                <!-- ব্যাকগ্রাউন্ড ওয়াটারমার্ক আইকন -->
                                <div class="absolute -right-4 -bottom-6 text-amber-500/[0.05] dark:text-amber-400/[0.02] text-9xl font-black select-none pointer-events-none transition-transform duration-500 group-hover:scale-110">
                                    <i class="fa-solid fa-building"></i>
                                </div>
                                
                                <!-- টপ অ্যাকসেন্ট লাইন -->
                                <div class="absolute top-0 left-0 h-[3px] w-1/3 bg-amber-500 rounded-r-full"></div>
                                
                                <div class="flex flex-col h-full justify-between relative z-10">
                                    <div>
                                        <span class="text-[10px] uppercase font-black tracking-widest text-amber-600 dark:text-amber-500">Level 6 Executive</span>
                                        <h4 class="text-lg font-black mt-1 flex items-center gap-2 text-slate-900 dark:text-white">
                                            <i class="fa-solid fa-briefcase text-amber-500 dark:text-amber-500 text-sm"></i> Company Dealership
                                        </h4>
                                    </div>
                                    <p class="text-xs mt-4 text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
                                        অফিস সেলসের ওপর বিশেষ 
                                        <span class="text-amber-600 dark:text-amber-400 font-bold">গ্লোবাল রয়্যালটি</span>, 
                                        আকর্ষণীয় হ্যান্ডেলিং মার্জিন অথবা ডিলারশিপের বিশেষ প্রাতিষ্ঠানিক ও অফিশিয়াল সুযোগ-সুবিধা।
                                    </p>
                                </div>
                            </div>

                        </section>

                        <section class="space-y-4">
                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                                <div class="flex items-center gap-2">
                                <div class="w-1 h-5 bg-indigo-500 rounded-full"></div>
                                <h3 class="text-base font-bold tracking-tight text-slate-900 dark:text-white">র‍্যাঙ্ক এচিভমেন্ট ও রিওয়ার্ড লিস্ট</h3>
                                </div>
                                <span class="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 px-2.5 py-1 rounded-md border border-slate-200/40 dark:border-slate-700/40">
                                <i class="fa-solid fa-shield-halved text-[10px]"></i> Structure Target
                                </span>
                            </div>

                            <div class="overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-[0_4px_20px_-4px_rgba(0,0,0,0,05)]">
                                <div class="overflow-x-auto">
                                    <table class="w-full text-left border-collapse min-w-[700px]">
                                    <thead>
                                        <tr class="bg-slate-50/70 dark:bg-slate-800/30 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/50">
                                        <th class="px-6 py-3.5 font-semibold">Rank Designation</th>
                                        <th class="px-6 py-3.5 font-semibold text-right">A - Group (Pt)</th>
                                        <th class="px-6 py-3.5 font-semibold text-right">B - Group (Pt)</th>
                                        <th class="px-6 py-3.5 font-semibold text-right">Cash Bonus</th>
                                        <th class="px-6 py-3.5 font-semibold pl-12">Gift & Premium Tour</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-100/70 dark:divide-slate-800/40 text-xs font-medium">
                                        <tr 
                                        v-for="rank in rankData" 
                                        :key="rank.name" 
                                        class="hover:bg-slate-50/40 dark:hover:bg-slate-800/10 transition-colors duration-200 group"
                                        >
                                        <!-- Rank Designation -->
                                        <td class="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">
                                            <div class="flex items-center gap-2.5">
                                            <span class="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-indigo-500 group-hover:scale-125 transition-all duration-200"></span>
                                            <span class="tracking-wide group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{{ rank.name }}</span>
                                            </div>
                                        </td>

                                        <!-- A Group (Aligned Right for Numbers) -->
                                        <td class="px-6 py-4 text-right text-slate-500 dark:text-slate-400 font-mono tracking-tight">{{ rank.aGroup }}</td>

                                        <!-- B Group (Aligned Right for Numbers) -->
                                        <td class="px-6 py-4 text-right text-slate-500 dark:text-slate-400 font-mono tracking-tight">{{ rank.bGroup }}</td>

                                        <!-- Cash Bonus (Styled as Premium Badge/Text) -->
                                        <td class="px-6 py-4 text-right font-bold text-emerald-600 dark:text-emerald-500 font-mono">
                                            <span class="inline-block px-2 py-0.5 rounded bg-emerald-500/5 dark:bg-emerald-500/10 text-[11px]">
                                            {{ rank.cash }}
                                            </span>
                                        </td>

                                        <!-- Gift & Tour (Clean typography with alignment) -->
                                        <td class="px-6 py-4 pl-12 text-slate-600 dark:text-slate-400 font-medium">
                                            <div class="flex items-center gap-2">
                                            <i class="fa-solid text-[10px] opacity-40 group-hover:opacity-100 transition-opacity" 
                                                :class="rank.gift.includes('TOUR') ? 'fa-plane-departure text-sky-500' : 'fa-gift text-amber-500'">
                                            </i>
                                            <span :class="rank.gift.includes('+') ? 'text-indigo-600/90 dark:text-indigo-400 font-semibold' : ''">
                                                {{ rank.gift }}
                                            </span>
                                            </div>
                                        </td>
                                        </tr>
                                    </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>

                        <!-- Rank Cards -->
                        <!-- <section class="space-y-5">
                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                                <div class="flex items-center gap-2.5">
                                    <div class="w-1.5 h-5 bg-indigo-500 rounded-full shadow-sm shadow-indigo-500/20"></div>
                                    <div>
                                        <h3 class="text-base font-black tracking-tight text-slate-900 dark:text-white">র‍্যাঙ্ক এچیভমেন্ট ও রিওয়ার্ড লিস্ট</h3>
                                        <p class="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">Rank & Rewards Catalog</p>
                                    </div>
                                </div>
                                <span class="inline-flex self-start sm:self-auto items-center gap-1.5 text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 px-3 py-1 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                                    <i class="fa-solid fa-shield-halved text-[11px] text-indigo-500"></i> Structure Target
                                </span>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                <div 
                                    v-for="rank in rankData" 
                                    :key="rank.name" 
                                    class="group relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                                >
                                    <div class="absolute -right-4 -bottom-6 text-slate-500/[0.03] dark:text-slate-400/[0.02] text-9xl font-black select-none pointer-events-none transition-transform duration-500 group-hover:scale-110">
                                        <i class="fa-solid" :class="rank.gift.includes('TOUR') ? 'fa-plane' : 'fa-box-open'"></i>
                                    </div>

                                    <div>
                                        <div class="flex items-start justify-between gap-3">
                                            <div class="flex items-center gap-2">
                                                <div class="p-2 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 transition-colors group-hover:bg-indigo-500 group-hover:text-white dark:group-hover:bg-indigo-500">
                                                    <i class="fa-solid fa-medal text-sm"></i>
                                                </div>
                                                <h4 class="text-sm font-black text-slate-800 dark:text-white tracking-wide group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                    {{ rank.name }}
                                                </h4>
                                            </div>
                                            <span class="inline-flex items-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 text-xs font-black text-emerald-700 dark:text-emerald-400 border border-emerald-200/30 dark:border-emerald-500/10 font-mono">
                                                {{ rank.cash }}
                                            </span>
                                        </div>

                                        <div class="grid grid-cols-2 gap-2 mt-4 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 text-center">
                                            <div>
                                                <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">A - Group</p>
                                                <p class="text-sm font-black text-slate-700 dark:text-slate-300 font-mono mt-0.5">{{ rank.aGroup }} <span class="text-[10px] font-medium text-slate-400">Pt</span></p>
                                            </div>
                                            <div class="border-l border-slate-200/60 dark:border-slate-700/60">
                                                <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">B - Group</p>
                                                <p class="text-sm font-black text-slate-700 dark:text-slate-300 font-mono mt-0.5">{{ rank.bGroup }} <span class="text-[10px] font-medium text-slate-400">Pt</span></p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 relative z-10">
                                        <div class="flex items-center gap-2 text-xs font-bold">
                                            <div class="shrink-0">
                                                <i class="fa-solid text-xs shadow-sm p-1.5 rounded-md" 
                                                :class="rank.gift.includes('TOUR') ? 'fa-plane-departure bg-sky-50 text-sky-500 dark:bg-sky-500/10 dark:text-sky-400' : 'fa-gift bg-amber-50 text-amber-500 dark:bg-amber-500/10 dark:text-amber-400'">
                                                </i>
                                            </div>
                                            <span class="leading-relaxed" :class="rank.gift.includes('+') ? 'text-indigo-600 dark:text-indigo-400 font-extrabold' : 'text-slate-600 dark:text-slate-400'">
                                                {{ rank.gift }}
                                            </span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </section> -->

                    </div>

                    

                    <footer class="bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/60 px-6 py-6">
                        <div class="max-w-4xl mx-auto space-y-3.5">
                            
                            <div class="flex flex-col sm:flex-row items-center sm:items-start gap-3 p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 dark:bg-amber-500/5 dark:border-amber-500/20 shadow-sm transition-all duration-300">
                                <span class="inline-flex shrink-0 items-center rounded-lg bg-amber-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-sm shadow-amber-500/20">
                                    Notice 01
                                </span>
                                <div class="flex items-center gap-2 text-center sm:text-left text-xs font-bold text-slate-600 dark:text-slate-300">
                                    <i class="fa-solid fa-circle-exclamation text-amber-500 text-base shrink-0 animate-pulse"></i>
                                    <p class="leading-relaxed">
                                        শর্তাবলী: প্রতি মাসে সর্বনিম্ন 
                                        <span class="inline-block px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400 font-black border border-amber-500/20">
                                            ১০০ পয়েন্ট
                                        </span> 
                                        পারচেজ না করলে আইডি স্বয়ংক্রিয়ভাবে <span class="text-rose-500 dark:text-rose-400 underline decoration-2 underline-offset-2">ডিঅ্যাক্টিভ (Deactive)</span> হয়ে যাবে।
                                    </p>
                                </div>
                            </div>

                            <div class="flex flex-col sm:flex-row items-center sm:items-start gap-3 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 dark:bg-indigo-500/5 dark:border-indigo-500/20 shadow-sm transition-all duration-300">
                                <span class="inline-flex shrink-0 items-center rounded-lg bg-indigo-600 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-sm shadow-indigo-500/20">
                                    Notice 02
                                </span>
                                <div class="flex items-center gap-2 text-center sm:text-left text-xs font-bold text-slate-600 dark:text-slate-300">
                                    <i class="fa-solid fa-circle-info text-indigo-500 text-base shrink-0"></i>
                                    <p class="leading-relaxed">
                                        শর্তাবলী ২: 
                                        <span class="text-indigo-600 dark:text-indigo-400 font-extrabold">স্টার ক্লাব ও ডায়নামিক ক্লাব</span> 
                                        এর সদস্য এবং র‍্যাঙ্ক অর্জনকারী লিডারদের প্রতি সপ্তাহে মিনিমাম 
                                        <span class="underline decoration-indigo-500 decoration-2 underline-offset-4 text-slate-800 dark:text-white">১ টি কোম্পানির মিটিং এ</span> 
                                        উপস্থিত থাকতে হবে।
                                    </p>
                                </div>
                            </div>

                        </div>
                    </footer>
                
                </div>
            </div>
        </div>
        <FooterSection />
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../../../services/api.js';

import Navbar from "../navbar.vue";
import Header from "../header.vue";
import Message from '../../../Message/message.vue';
import FooterSection from "../../../e-commerce/footer.vue";

const router = useRouter();

const loading = ref(false);
const successMsg = ref('');
const errorMsg = ref('');

const active = ref('dashboard');








const rankData = ref([
  { name: 'SILVER', aGroup: '10,000', bGroup: '10,000', cash: '5,000 TK', gift: 'GIFT' },
  { name: 'GOLD', aGroup: '20,000', bGroup: '20,000', cash: '10,000 TK', gift: 'NATIONAL TOUR' },
  { name: 'PLATINUM', aGroup: '50,000', bGroup: '50,000', cash: '25,000 TK', gift: 'COX-BAZAR TOUR' },
  { name: 'DIAMOND', aGroup: '100,000', bGroup: '100,000', cash: '50,000 TK', gift: 'SMART PHONE' },
  { name: 'BLUE DIAMOND', aGroup: '200,000', bGroup: '200,000', cash: '100,000 TK', gift: 'LAPTOP' },
  { name: 'GREEN DIAMOND', aGroup: '500,000', bGroup: '500,000', cash: '250,000 TK', gift: 'INTERNATIONAL TOUR' },
  { name: 'PURPLE DIAMOND', aGroup: '1,000,000', bGroup: '1,000,000', cash: '500,000 TK', gift: 'SPECIAL BIKE' },
  { name: 'RED DIAMOND', aGroup: '2,000,000', bGroup: '2,000,000', cash: '1,000,000 TK', gift: 'GOLD + INTERNATIONAL TOUR' },
  { name: 'BLACK DIAMOND', aGroup: '5,000,000', bGroup: '5,000,000', cash: '2,500,000 TK', gift: 'LAND + INTERNATIONAL TOUR' },
  { name: 'ELITE DIAMOND', aGroup: '10,000,000', bGroup: '10,000,000', cash: '5,000,000 TK', gift: 'CAR + INTERNATIONAL TOUR' },
  { name: 'ROYAL DIAMOND', aGroup: '20,000,000', bGroup: '20,000,000', cash: '1-CORE', gift: 'SPECIAL FLAT + INTERNATIONAL TOUR' },
  { name: 'CROWN DIAMOND', aGroup: '50,000,000', bGroup: '50,000,000', cash: '2.5-CORE', gift: 'APARTMENT + INTERNATIONAL TOUR' },
])








// dark and light mode
const isDark = ref(false);
const sidebarOpen = ref(false);

function applyTheme(dark) {
    isDark.value = dark;   // VERY IMPORTANT
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
}

function toggleTheme() {
    applyTheme(!isDark.value);
}

function onSearch(q) {
    // console.log("search:", q);
}


/* ESC to close drawer */
onMounted(() => {
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") sidebarOpen.value = false;
    });
    const saved = localStorage.getItem("theme");
    if (saved === "dark") applyTheme(true);
    else if (saved === "light") applyTheme(false);
    else {
        const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        applyTheme(systemDark);
    }
});
</script>

<style scoped>
/* Smooth theme switching transition */
.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
}
</style>