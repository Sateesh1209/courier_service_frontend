<script setup>
import { onMounted, ref } from 'vue';
import moment from 'moment';
import { useGlobalStore } from '../stores/globalStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import CommonDeleteDialog from '../components/CommonDeleteDialog.vue';
import DeliveriesCard from '../components/DeliveriesCard.vue';
import CourierServices from '../services/CourierServices';
import DeliveryAgentRoute from '../components/DeliveryAgentRoute.vue';
import SuccessPopup from '../components/SuccessPopup.vue';

const globalStore = useGlobalStore();
const { snackBar } = storeToRefs(globalStore);
const panel = ref([0]);
const router = useRouter();
const userDetails = ref(null);
const selectedCourier = ref(null);
const showPickupPopup = ref(false);
const successPopup = ref({
    showPopup: false,
    message: "",
});
const showDeliveryRoutePopup = ref(false);
const totalDeliveries = ref({
    ongoing: [],
    total: [],
})
onMounted(async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    userDetails.value = user;
    if (user != null && user.roleId == 3) {
        getALlCouriersByEmployee();
    } else if (user != null && (user.roleId != 3)) {
        router.push({ name: "couriers" });
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
const pickUpOrder = (courier) => {
    selectedCourier.value = courier;
    showPickupPopup.value = true;
}
const closePickupPopup = () => {
    showPickupPopup.value = false;
}
const closeDeliveryRoutePopup = () => {
    showDeliveryRoutePopup.value = false;
}

const showSuccessPopup = (msg) => {
    successPopup.value.showPopup = true;
    successPopup.value.message = msg;
};
const closeSuccessPopup = () => {
    successPopup.value.showPopup = false;
    successPopup.value.message = '';
};
async function updateDeliveryStatus(statusId, totalPrice) {
    let payload = {
        id: parseInt(selectedCourier.value.id),
        statusId: statusId,
    };
    if (statusId == 4) {
        payload.totalPrice = Math.round(totalPrice * 100) / 100;
    }
    await CourierServices.updateDeliveryStatus(payload.id, payload)
        .then((response) => {
            if (response.data?.status == "Success") {
                snackBar.value = {
                    value: true,
                    color: "green",
                    text: response.data?.message,
                }
                showDeliveryRoutePopup.value = false;
                if (statusId == 4 && (new Date(selectedCourier.value?.requestedDateTime) > new Date())) {
                    showSuccessPopup(`Congratulations! Since you delivered the order before requested time ${userDetails.value?.companyInfo?.onTimeBonus}% bonus on Quoted Price(${selectedCourier.value?.quotedPrice}$) added. Total amount for the order is ${totalPrice}$`);
                }
                getALlCouriersByEmployee();
            } else {
                snackBar.value = {
                    value: true,
                    color: "error",
                    text: response.data?.message,
                }
            }
        })
        .catch((error) => {
            console.log(error);
            snackBar.value = {
                value: true,
                color: "error",
                text: error.response?.message,
            }
        });
}
async function onPickUpOrder() {
    let payload = {
        id: parseInt(selectedCourier.value.id),
        pickedUpTime: new Date(),
    };
    await CourierServices.pickupCourier(payload.id, payload)
        .then((response) => {
            if (response.data?.status == "Success") {
                snackBar.value = {
                    value: true,
                    color: "green",
                    text: response.data?.message,
                }
                getALlCouriersByEmployee();
                showPickupPopup.value = false;
            } else {
                snackBar.value = {
                    value: true,
                    color: "error",
                    text: response.data?.message,
                }
            }
        })
        .catch((error) => {
            console.log(error);
            snackBar.value = {
                value: true,
                color: "error",
                text: error.response.data?.message,
            }
        });
}
const openRouteMap = (courier) => {
    selectedCourier.value = courier;
    showDeliveryRoutePopup.value = true;
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

        <v-expansion-panels v-model="panel">
            <v-expansion-panel>
                <v-expansion-panel-title mandatory>
                    <template v-slot:default="{ expanded }">
                        <v-row no-gutters>
                            <v-col class="d-flex justify-start"><b v-bind:style="{
                                'font-size': '20px',
                            }">Ongoing(Picked up) deliveries</b></v-col>
                            <v-col cols="8" class="text--secondary"> </v-col>
                        </v-row>
                    </template>
                </v-expansion-panel-title>
                <v-expansion-panel-text class="pl-15 pr-15">
                    <v-row v-if="totalDeliveries?.ongoing?.length == 0">
                        <v-col cols="12"><i v-bind:style="{ textAlign: 'center' }"><span v-bind:style="{
                            color: '#707070',
                            'font-size': '14px',
                        }"> You don't have any pickedup orders. Please go to 'My Deliveries' section to pickup assigned
                                    order
                                    if you have any. You can also assign orders yourself from 'Couriers' page...</span></i>
                        </v-col>
                    </v-row>
                    <template v-else>
                        <DeliveriesCard v-for="delivery in totalDeliveries?.ongoing" :key="delivery.id" :delivery="delivery"
                            :openRouteMap="openRouteMap" />
                    </template>
                </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel>
                <v-expansion-panel-title mandatory>
                    <template v-slot:default="{ expanded }">
                        <v-row no-gutters>
                            <v-col class="d-flex justify-start"><b v-bind:style="{
                                'font-size': '20px',
                            }">My Deliveries</b></v-col>
                            <v-col cols="8" class="text--secondary"> </v-col>
                        </v-row>
                    </template>
                </v-expansion-panel-title>

                <v-expansion-panel-text>
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
                                                    <th class="text-left">Deliver By Date</th>
                                                    <th class="text-left">Delivered Time</th>
                                                    <th class="text-left">Quoted Price($)</th>
                                                    <th class="text-left">Collected Price($)</th>
                                                    <th class="text-left">Status</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-if="totalDeliveries?.total.length == 0">
                                                    <td colspan="10" v-bind:style="{
                                                        color: '#707070',
                                                        'font-size': '14px',
                                                        textAlign: 'center',
                                                    }">
                                                        No deliveries found...
                                                    </td>
                                                </tr>
                                                <tr v-for="delivery in totalDeliveries?.total" :key="delivery.deliveryId">
                                                    <td>
                                                        {{ delivery?.senderDetails?.firstName + " " +
                                                            delivery?.senderDetails?.lastName
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
                                                        {{ formattedDate(delivery?.requestedDateTime) }}
                                                    </td>
                                                    <td>
                                                        {{ delivery?.deliveredTime ? formattedDate(delivery?.deliveredTime)
                                                            : "-" }}
                                                    </td>
                                                    <td>{{ delivery?.quotedPrice }}</td>
                                                    <td>{{ delivery?.totalPrice ? delivery?.totalPrice : "-" }}</td>
                                                    <td>{{ delivery?.status.statusName }}</td>
                                                    <td>
                                                        <v-tooltip
                                                            v-if="userDetails?.roleId == 3 && delivery?.status?.statusId == 2 && delivery?.assignedTo == userDetails?.empId"
                                                            location="top" text="Pickup Order">
                                                            <template v-slot:activator="{ props }">
                                                                <v-icon v-bind="props" class="ml-3 mt-2" color="#673AB7"
                                                                    size="large" icon="mdi-moped"
                                                                    @click="() => pickUpOrder(delivery)">
                                                                    <v-tooltip activator="parent"
                                                                        location="top">Tooltip</v-tooltip></v-icon>
                                                            </template>
                                                        </v-tooltip>
                                                    </td>
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
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-container>
    <CommonDeleteDialog :showDeletePopup="showPickupPopup" :onConfDelete="onPickUpOrder"
        :closeDeletePopup="closePickupPopup"
        :textValue="`Are you sure want to pickup ${selectedCourier?.senderDetails?.firstName}'s order.`" />
    <DeliveryAgentRoute :key="selectedCourier?.id" :delivery="selectedCourier"
        :showDeliveryRoutePopup="showDeliveryRoutePopup" :closeDeliveryRoutePopup="closeDeliveryRoutePopup"
        :updateDeliveryStatus="updateDeliveryStatus" />
    <SuccessPopup :successPopup="successPopup" :closeSuccessPopup="closeSuccessPopup" />
</template>