<script setup>
import { onMounted, ref } from 'vue';
import { useGlobalStore } from '../stores/globalStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import VueSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import CourierServices from "../services/CourierServices.js";
import CommonDeleteDialog from '../components/CommonDeleteDialog.vue';
import CommonServices from '../services/CommonServices';
import AssignEmployee from '../components/AssignEmployee.vue';
import CustomerServices from '../services/CustomerServices';

const globalStore = useGlobalStore();
const { snackBar } = storeToRefs(globalStore);
const router = useRouter();
const userDetails = ref(null);
const cancelText = ref(null);
const showDeletePopup = ref(false);
const allCustomers = ref([]);
const courierStatusFilter = ref(null);
const courierCustomerFilter = ref(null);
const showSelfAssignPopup = ref(false);
const showAssignPopup = ref(false);
const totalCouriers = ref([]);
const selectedCourier = ref(null);

onMounted(async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    userDetails.value = user;
    if (user != null) {
        getALlCouriers();
        getALlCustomers();
    }
});
const openCourierPopup = (id = null, currViewType = "add") => {
    router.push({ name: "addCourier" });
}

async function getALlCustomers() {
    await CustomerServices.getCustomers()
        .then((response) => {
            response.data.data?.map(item => {
                item.fullName = CommonServices.capitalCase(item?.firstName + " " + item.lastName);
            })
            allCustomers.value = response.data.data;
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

async function getALlCouriers() {
    await CourierServices.getCouriers(courierStatusFilter.value?.statusId ? courierStatusFilter.value?.statusId : 0, courierCustomerFilter.value == null ? 'all' : courierCustomerFilter.value?.id)
        .then((response) => {
            totalCouriers.value = response.data.data;
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

const deleteCourier = (courier) => {
    selectedCourier.value = courier;
    if (courier.status.statusId == 3) {
        cancelText.value = `Are you sure wanted to cancel this order. Since order is already picked up customer will be charged ${userDetails.value?.companyInfo?.cancelCharges}$ for cancelling...`;
    } else {
        cancelText.value = "Are you sure wanted to cancel this order..."
    }
    showDeletePopup.value = true;
}
const assignCourier = (courier) => {
    selectedCourier.value = courier;
    showAssignPopup.value = true;
}
const selfAssign = (courier) => {
    selectedCourier.value = courier;
    showSelfAssignPopup.value = true;
}
async function onSelfAssign() {
    let payload = {
        id: parseInt(selectedCourier.value.id),
        assignedTo: userDetails.value.empId,
        assignedTime: new Date(),
    };
    await CourierServices.assignCourier(payload.id, payload)
        .then((response) => {
            if (response.data?.status == "Success") {
                snackBar.value = {
                    value: true,
                    color: "green",
                    text: response.data?.message,
                }
                getALlCouriers();
                showSelfAssignPopup.value = false;
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
async function onConfCancel() {
    const payload = {
        id: parseInt(selectedCourier.value.id),
        statusId: 5,
    }
    await CourierServices.updateOrderStatus(selectedCourier.value.id, payload)
        .then((response) => {
            if (response.data.status == "Success") {
                getALlCouriers();
                showDeletePopup.value = false;
                snackBar.value = {
                    value: true,
                    color: "green",
                    text: response.data.message,
                }
            }
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
const closeDeletePopup = () => {
    showDeletePopup.value = false;
}
const closeSelfAssignPopup = () => {
    showSelfAssignPopup.value = false;
}
const closeAssignPopup = () => {
    showAssignPopup.value = false;
}

const onEdit = (id) => {
    router.push({ name: 'updateCourier', params: { courierId: id } })
}
</script>
<template>
    <v-container fill-height>
        <v-row align="center">
            <v-col class="d-flex justify-space-between">
                <v-card-title class="pl-0 text-h4 font-weight-bold">
                    Couriers List
                </v-card-title>
                <v-btn v-if="userDetails?.roleId != 3" class="ml-2" variant="flat" color="deep-purple"
                    @click="() => openCourierPopup()">Add Courier</v-btn>
            </v-col>
        </v-row>
        <v-row v-if="userDetails?.roleId == 1 || userDetails?.roleId == 2">
            <v-col cols="12"><i v-bind:style="{ textAlign: 'center' }"><b>Note:
                    </b><span v-bind:style="{
                        color: '#707070',
                        'font-size': '14px',
                    }"> Please note that order details can be edited only when the status is
                        initiated and it can be cancelled only before the order is delivered or cancelled...</span></i>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="d-flex justify-end">
                <div v-bind:style="{ width: '200px', marginRight: '5px' }">
                    <VueSelect v-model="courierCustomerFilter" @update:modelValue="getALlCouriers" :options="allCustomers"
                        label="fullName" value="id" placeholder="Filter by Sender">
                    </VueSelect>
                </div>
                <div v-bind:style="{ width: '200px' }">
                    <VueSelect v-model="courierStatusFilter" @update:modelValue="getALlCouriers"
                        :options="userDetails?.statuses" label="statusName" value="statusId" placeholder="Filter by Status">
                    </VueSelect>
                </div>
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
                                        <th class="text-left">Quoted Price($)</th>
                                        <th class="text-left">Status</th>
                                        <th class="text-left">Assigned To</th>
                                        <th class="text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-if="totalCouriers.length == 0">
                                        <td colspan="8" v-bind:style="{
                                            color: '#707070',
                                            'font-size': '14px',
                                            textAlign: 'center',
                                        }">
                                            No Couriers found...
                                        </td>
                                    </tr>
                                    <tr v-for="courier in totalCouriers" :key="courier.id">
                                        <td>
                                            {{ courier?.senderDetails?.firstName + " " + courier?.senderDetails?.lastName }}
                                        </td>
                                        <td>
                                            {{ courier?.receiverDetails?.firstName + " " +
                                                courier?.receiverDetails?.lastName }}
                                        </td>
                                        <td>
                                            {{ courier?.pickupPoint?.split("/")[1] }}
                                        </td>
                                        <td>
                                            {{ courier?.dropoffPoint?.split("/")[1] }}
                                        </td>
                                        <td>
                                            {{ courier?.quotedPrice }}
                                        </td>
                                        <td>{{ courier?.status.statusName }}</td>
                                        <td>{{ courier?.assignedToDetails?.empId ?
                                            (courier?.assignedToDetails?.firstName + " " +
                                                courier?.assignedToDetails?.lastName) : "-" }}</td>
                                        <td>
                                            <template
                                                v-if="(userDetails?.roleId == 3 && courier?.status?.statusId != 1) || ((userDetails?.roleId == 1 || userDetails?.roleId == 2) && (courier?.status?.statusId == 4 || courier?.status?.statusId == 5 || courier?.status?.statusId == 7))">-</template>
                                            <v-icon
                                                v-if="(userDetails?.roleId == 1 || userDetails?.roleId == 2) && courier?.status?.statusId == 1"
                                                class="mr-3 mt-2" size="large" icon="mdi-pencil"
                                                @click="() => onEdit(courier.id)"></v-icon>
                                            <!-- <v-icon
                                                v-if="(userDetails?.roleId == 1 || userDetails?.roleId == 2) && courier?.status?.statusId == 1"
                                                class="mt-2" size="large" icon="mdi-close-circle-outline"
                                                @click="() => deleteCourier(courier)"></v-icon> -->

                                            <v-tooltip
                                                v-if="(userDetails?.roleId == 1 || userDetails?.roleId == 2) && !(courier?.status?.statusId == 4 || courier?.status?.statusId == 5 || courier?.status?.statusId == 7)"
                                                location="top" text="Cancel Order">
                                                <template v-slot:activator="{ props }">
                                                    <v-icon v-bind="props" class="mt-2" size="large"
                                                        icon="mdi-close-circle-outline"
                                                        @click="() => deleteCourier(courier)">
                                                        <v-tooltip activator="parent"
                                                            location="top">Tooltip</v-tooltip></v-icon>
                                                </template>
                                            </v-tooltip>
                                            <v-tooltip v-if="userDetails?.roleId == 1 && courier?.status?.statusId == 1"
                                                location="top" text="Assign delivery agent">
                                                <template v-slot:activator="{ props }">
                                                    <v-icon v-bind="props" class="ml-3 mt-2" color="#673AB7" size="large"
                                                        icon="mdi-account-arrow-right"
                                                        @click="() => assignCourier(courier)">
                                                        <v-tooltip activator="parent"
                                                            location="top">Tooltip</v-tooltip></v-icon>
                                                </template>
                                            </v-tooltip>
                                            <v-tooltip v-if="userDetails?.roleId == 3 && courier?.status?.statusId == 1"
                                                location="top" text="Assign Yourself">
                                                <template v-slot:activator="{ props }">
                                                    <v-icon v-bind="props" class="ml-3 mt-2" color="#673AB7" size="large"
                                                        icon="mdi-account-arrow-up" @click="() => selfAssign(courier)">
                                                        <v-tooltip activator="parent"
                                                            location="top">Tooltip</v-tooltip></v-icon>
                                                </template>
                                            </v-tooltip>
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-col>
                    </v-row></v-card></v-col></v-row>
    </v-container>
    <AssignEmployee :closeAssignPopup="closeAssignPopup" :showAssignPopup="showAssignPopup" :courierId="selectedCourier?.id"
        :getALlCouriers="getALlCouriers" />
    <CommonDeleteDialog :showDeletePopup="showDeletePopup" :onConfDelete="onConfCancel" :closeDeletePopup="closeDeletePopup"
        :textValue="cancelText" />
    <CommonDeleteDialog :showDeletePopup="showSelfAssignPopup" :onConfDelete="onSelfAssign"
        :closeDeletePopup="closeSelfAssignPopup" :textValue="`Are you sure want to assign it yourself.`" />
</template>