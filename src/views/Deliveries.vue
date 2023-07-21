<script setup>
import { onMounted, ref } from 'vue';
import moment from 'moment';
import { useGlobalStore } from '../stores/globalStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import CommonDeleteDialog from '../components/CommonDeleteDialog.vue';
import CourierServices from '../services/CourierServices';

const globalStore = useGlobalStore();
const { snackBar } = storeToRefs(globalStore);
const router = useRouter();
const userDetails = ref(null);
const showDeletePopup = ref(false);
const totalDeliveries = ref([])
onMounted(async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    userDetails.value = user;
    if (user != null && user.roleId == 3) {
        getALlCouriersByEmployee();
    } else if (user != null && (user.roleId != 3)) {
        router.push({ name: "dashboard" });
    }
});

async function getALlCouriersByEmployee() {
    await CourierServices.getCouriersByEmployee(userDetails.value.empId)
        .then((response) => {
            totalDeliveries.value = response.data.data;
        })
        .catch((error) => {
            console.log(error);
            snackBar.value = {
                value: true,
                color: "error",
                text: error.response.data.message,
            }
        });
}

const formattedDate = (date) => {
    return moment(date).format('YYYY-MM-DD HH:mm')
}
</script>
<template>
    <v-container fill-height>
        <v-row align="center">
            <v-col class="d-flex justify-space-between"><v-card-title class="pl-0 text-h4 font-weight-bold">
                    Deliveries List
                </v-card-title>
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
                                        <th class="text-left">Sender</th>
                                        <th class="text-left">Receiver</th>
                                        <th class="text-left">Pickup</th>
                                        <th class="text-left">Drop</th>
                                        <th class="text-left">Delivery Instructions</th>
                                        <th class="text-left">Deliver By Date</th>
                                        <th class="text-left">Delivered Time</th>
                                        <th class="text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-if="totalDeliveries.length == 0">
                                        <td colspan="8" v-bind:style="{
                                            color: '#707070',
                                            'font-size': '14px',
                                            textAlign: 'center',
                                        }">
                                            No deliveries found...
                                        </td>
                                    </tr>
                                    <tr v-for="delivery in totalDeliveries" :key="delivery.deliveryId">
                                        <td>
                                            {{ delivery?.senderDetails?.firstName + " " + delivery?.senderDetails?.lastName
                                            }}
                                        </td>
                                        <td>
                                            {{ delivery?.receiverDetails?.firstName + " " +
                                                delivery?.receiverDetails?.lastName }}
                                        </td>
                                        <td>
                                            {{ delivery?.pickupPoint?.split("/")[1] }}
                                        </td>
                                        <td>
                                            {{ delivery?.dropoffPoint?.split("/")[1] }}
                                        </td>
                                        <td>
                                            {{ delivery?.deliveryInstructions }}
                                        </td>
                                        <td>
                                            {{ formattedDate(delivery?.requestedDateTime) }}
                                        </td>
                                        <td>
                                            {{ delivery?.deliveredTime ? formattedDate(delivery?.deliveredTime) : "-" }}
                                        </td>
                                        <td>{{ delivery?.status.statusName }}</td>
                                        <!-- <td>
                                            <v-icon class="mr-3 mt-2" size="large" icon="mdi-pencil"
                                                @click="() => openCustomerPopup(delivery.id, 'edit')"></v-icon>
                                            <v-icon class="mt-2" size="large" icon="mdi-delete"
                                                @click="() => deleteCustomer(delivery)"></v-icon>
                                        </td> -->
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-col>
                    </v-row></v-card></v-col></v-row>
    </v-container>
    <!-- <CommonDeleteDialog :showDeletePopup="showDeletePopup" :onConfDelete="onConfDelete" :closeDeletePopup="closeDeletePopup"
        :textValue="`Are you sure want to delete ${deliveryDetails.firstName} ${deliveryDetails.lastName} from deliverys list.`" /> -->
</template>