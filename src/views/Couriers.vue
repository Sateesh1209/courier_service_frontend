<script setup>
import { onMounted, ref } from 'vue';
import { useGlobalStore } from '../stores/globalStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const globalStore = useGlobalStore();
const { snackBar } = storeToRefs(globalStore);
const router = useRouter();
onMounted(async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user != null && (user.roleId == 1 || user.roleId == 2)) {
        // getALlCouriers();
    } else if (user != null && user.roleId != 1 && user.roleId != 2) {
        router.push({ name: "dashboard" });
    }
});
const openCourierPopup = () => {
    router.push({ name: "addCourier" });
   
}
</script>
<template>
    <v-container fill-height>
        <v-row align="center">
            <v-col class="d-flex justify-space-between"><v-card-title class="pl-0 text-h4 font-weight-bold">
                    Couriers List
                </v-card-title>
                <v-btn class="mt-3" variant="flat" color="deep-purple" @click="() => openCourierPopup()">Add Courier</v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-card class="rounded-lg elevation-5">
                    <v-row align="center">
                        <v-col cols="12">
                            <v-table>
                                <thead>
                                    <tr v-bind:style="{
                                        backgroundColor: '#b28cf7',
                                    }">
                                        <th class="text-left">User</th>
                                        <th class="text-left">Email</th>
                                        <th class="text-left">Phone</th>
                                        <th class="text-left">Pickup</th>
                                        <th class="text-left">Drop</th>
                                        <th class="text-left">Fair($)</th>
                                        <th class="text-left">Status</th>
                                        <th class="text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            Satheesh Kumar
                                        </td>
                                        <td>
                                            satheesh@gmail.com
                                        </td>
                                        <td>
                                            +1827267234
                                        </td>
                                        <td>
                                            Block 1
                                        </td>
                                        <td>
                                            Block 12
                                        </td>
                                        <td>35</td>
                                        <td>Initiated</td>
                                        <td>
                                            <v-icon class="mr-3 mt-2" size="large" icon="mdi-pencil"></v-icon>
                                            <v-icon class="mt-2" size="large" icon="mdi-delete"></v-icon>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Vamshi Dhagad
                                        </td>
                                        <td>
                                            vamshi@gmail.com
                                        </td>
                                        <td>
                                            +9282882822
                                        </td>
                                        <td>
                                            Block 24
                                        </td>
                                        <td>
                                            Block 3
                                        </td>
                                        <td>78</td>
                                        <td>Delivered</td>
                                        <td>
                                            -
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-col>
                    </v-row></v-card></v-col></v-row>
    </v-container>
</template>