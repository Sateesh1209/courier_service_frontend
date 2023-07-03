<script setup>
import { onMounted, ref } from 'vue';
import courierBG from "./images/courierBG.jpg";
import courierBG2 from "./images/courierBG2.jpg";
import { useRouter } from 'vue-router';
import { useGlobalStore } from './stores/globalStore'
import { storeToRefs } from 'pinia';

const router = useRouter();
const globalStore = useGlobalStore();
const { snackBar } = storeToRefs(globalStore);
const user = ref(null);
const drawer = ref(true);
const rail = ref(false);
onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  if (location.pathname == "/" && user.value != null) {
    localStorage.removeItem("user");
    user.value = null;
  } else if (location.pathname != "/" && user.value == null) {
    router.push({ name: "login" });
  }
});
const logout = () => {
  localStorage.removeItem("user");
  user.value = null;
  snackBar.value = { value: true, color: "green", text: "Logout Success..." }
  router.push({ name: "login" });
}
const closeSnackBar = () => {
  snackBar.value = { value: false, color: "", text: "" }
}
const onLogin = () => {
  user.value = JSON.parse(localStorage.getItem("user"));
}
</script>

<template>
  <v-app :style="{
    'background-image': `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)),
                  url(${courierBG2})`,
    'background-position': 'center',
    'background-repeat': 'no-repeat',
    'background-size': 'cover',
  }">
    <v-main>
      <template v-if="!user">
        <router-view :onLogin="onLogin" />
      </template>
      <template v-else>
        <!-- <v-card> -->
        <v-layout>
          <v-navigation-drawer class="bg-deep-purple" theme="dark" permanent v-model="drawer" :rail="rail"
            @click="rail = false">
            <template v-slot:prepend>
              <v-list-item :title="user.firstName + ' ' + user.lastName" nav :subtitle="user.roleName">
                <template v-slot:prepend>
                  <v-avatar color="#7952C0">
                    <span class="white-text text-h5">{{ `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` }}</span>
                  </v-avatar>
                </template>
                <template v-slot:append>
                  <v-btn variant="text" :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
                    @click.stop="rail = !rail"></v-btn>
                </template>
              </v-list-item>
            </template>

            <v-divider></v-divider>
            <v-list density="compact" nav>
              <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" value="dashboard"
                :to="'/Dashboard'"></v-list-item>
              <v-list-item v-if="user.roleId == 1" prepend-icon="mdi-account-multiple" title="Employees" value="employees"
                :to="'/Employees'"></v-list-item>
              <v-list-item prepend-icon="mdi-truck-delivery" title="Couriers" value="couriers"
                :to="'/Couriers'"></v-list-item>
            </v-list>

            <template v-slot:append>
              <v-list density="compact" nav>
                <v-list-item v-bind:style="{
                  'background-color': '#000000  !important',
                }" variant="tonal" prepend-icon="mdi-logout-variant" @click="logout">
                  <v-list-item-title v-bind:style="{
                    'font-size': '16px',
                    'font-weight': 600
                  }" v-text="'Logout'"></v-list-item-title></v-list-item>
              </v-list>
            </template>
          </v-navigation-drawer>
          <v-main style="min-height: 100vh" color="transparent"><router-view /></v-main>
        </v-layout>
        <!-- </v-card> -->
      </template>
    </v-main>
  </v-app>
  <v-snackbar v-model="snackBar.value" rounded="pill">
    {{ snackBar.text }}
    <template v-slot:actions>
      <v-btn :color="snackBar.color" variant="text" @click="closeSnackBar">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>
