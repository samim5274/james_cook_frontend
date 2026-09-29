import { ref, computed } from "vue";
import api, { makeImg } from "../services/api";

const authUser = ref(
    JSON.parse(localStorage.getItem("user")) || null
);

const isLoggedIn = computed(() => !!authUser.value);

const avatarUrl = computed(() =>
    authUser.value?.photo
        ? makeImg(authUser.value.photo)
        : "/images/avatar.png"
);

// duplicate call block
let inFlightRequest = null;
let hasFetched = false;

async function loadUser(force = false) {
    const token = localStorage.getItem("token");

    if (!token) {
        authUser.value = null;
        hasFetched = true;
        return authUser.value;
    }

    if (hasFetched && !force) {
        return authUser.value;
    }

    if (inFlightRequest) {
        return inFlightRequest;
    }

    inFlightRequest = api.get("/user")
        .then(({ data }) => {
        authUser.value = data;
        localStorage.setItem("user", JSON.stringify(data));
        hasFetched = true;
        return authUser.value;
    })
    .catch((err) => {
        logout();
        throw err;
    })
        .finally(() => {
        inFlightRequest = null;
    });

    return inFlightRequest;

}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    authUser.value = null;
    hasFetched = false;
}

export function useAuth() {
    return {
        authUser,
        isLoggedIn,
        avatarUrl,
        loadUser,
        logout,
    };
}