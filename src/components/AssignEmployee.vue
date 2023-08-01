<script setup>
import { ref } from 'vue';
import VueSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import EmployeeServices from '../services/EmployeeServices';
import CourierServices from '../services/CourierServices';
import CommonEmployeeDetails from './CommonEmployeeDetails.vue';
import { useGlobalStore } from '../stores/globalStore';
import { storeToRefs } from 'pinia';

const props = defineProps({
    showAssignPopup: false,
    courierId: "",
    allDeliveryAgents: [],
    getALlCouriers: Function,
    closeAssignPopup: Function,
});

const employeeDetails = ref(null);
const globalStore = useGlobalStore();
const { snackBar } = storeToRefs(globalStore);
const employeeSearch = ref();
async function getDeliveryEmployeeByEmail() {
    await EmployeeServices.getDeliveryEmployeeByEmail(employeeSearch.value)
        .then((response) => {
            if (response.data?.status == 'Success') {
                employeeDetails.value = response.data.data;
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
const onCancel = () => {
    employeeDetails.value = {};
    employeeSearch.value = "";
    props.closeAssignPopup();
}

async function onAssign() {
    let payload = {
        id: parseInt(props.courierId),
        assignedTo: employeeDetails.value?.empId,
        assignedTime: new Date(),
    };
    await CourierServices.assignCourier(props.courierId, payload)
        .then((response) => {
            if (response.data?.status == "Success") {
                snackBar.value = {
                    value: true,
                    color: "green",
                    text: response.data?.message,
                }
                props.getALlCouriers();
                onCancel();
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
</script>
<template>
    <v-dialog persistent v-model:modelValue="props.showAssignPopup" @update:modelValue="props.showAssignPopup = $event"
        width="1080">
        <v-container>
            <v-card class="rounded-lg elevation-5">
                <v-card-title class="headline">
                    Assign Delivery Agent
                </v-card-title>
                <v-card-text class="body-1 mt-5">
                    <v-row>
                        <v-col cols="12" sm="12">
                            <v-row justify="center">
                                <v-col cols="8" sm="6" align-self="center">
                                    <VueSelect v-model="employeeDetails" :options="props.allDeliveryAgents" label="fullName"
                                        value="id" placeholder="Search Delivery Agent...">
                                    </VueSelect>
                                    <!-- <v-text-field v-model="employeeSearch" label="Search by email..." type="search" :rules="[
                                        v => !v || v?.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i) || 'Please enter valid email'
                                    ]"></v-text-field> -->
                                </v-col>
                                <!-- <v-col cols="4" sm="2" align-self="center">
                                    <v-btn variant="flat" color="primary" @click="() => getDeliveryEmployeeByEmail()"
                                        :disabled="!employeeSearch ||
                                            !employeeSearch?.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)">Search</v-btn>
                                </v-col> -->
                                <v-col cols="12">
                                    <CommonEmployeeDetails :employeeDetails="employeeDetails" />
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-row>
                        <v-col class="d-flex justify-end">
                            <div>
                                <v-btn class="mr-3" variant="flat" color="secondary" @click="onCancel">Cancel</v-btn>
                                <v-btn variant="flat" color="primary" :disabled="!employeeDetails?.email"
                                    @click="onAssign">Assign</v-btn>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-actions>
            </v-card>
        </v-container>
    </v-dialog>
</template>