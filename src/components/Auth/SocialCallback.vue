<script setup>
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../../services/api";

const route = useRoute();
const router = useRouter();

onMounted(async () => {
    const token = route.query.token;

    if (!token) {
        return router.push("/login");
    }

    localStorage.setItem("token", token);

    try {
        const { data } = await api.get("/user", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        localStorage.setItem("user", JSON.stringify(data));

        router.replace("/");
    } catch (e) {
        localStorage.removeItem("token");
        router.replace("/login");
    }
});
</script>

<template>
    <div class="flex justify-center items-center h-screen">
        Logging in...
    </div>
</template>