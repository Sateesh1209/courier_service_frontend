<script setup>
import { onMounted, ref } from 'vue';
import { useGlobalStore } from '../stores/globalStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import UpdateCompanyVue from '../components/UpdateCompany.vue';
import CompanyServices from "../services/CompanyServices.js";
import FairCalculatorService from '../services/FairCalculatorService';
import CommonServices from '../services/CommonServices';

const globalStore = useGlobalStore();
const { snackBar } = storeToRefs(globalStore);
const router = useRouter();
const availableBlocks = ref([]);
const showCompanyPopup = ref(false);
const constantData = ref(null);
const companyDetails = ref({
    id: "",
    name: "",
    cancelCharges: "",
    startHour: "",
    endHour: "",
    pricePerBlock: "",
    timePerBlock: "",
    onTimeBonus: "",
    billingCycle: "",
    avenue: null,
    street: null,
    block: "",
});
onMounted(async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user != null && user.roleId == 1) {
        getCompanyDetails();
    } else if (user != null && (user.roleId != 1)) {
        router.push({ name: "couriers" });
    }
});
const openCompanyPopup = () => {
    showCompanyPopup.value = true;
}
const closeCompanyPopup = () => {
    companyDetails.value = {...constantData.value};
    showCompanyPopup.value = false;
}

async function getCompanyDetails() {
    await CompanyServices.getCompanyDetails()
        .then((response) => {
            companyDetails.value = {...response.data.data};
            constantData.value = {...response.data.data};
            let streetItem = CommonServices.getObjectByName(response.data.data.street, "street");
            companyDetails.value.street = streetItem;
            constantData.value.street = streetItem;
            let avenueItem = CommonServices.getObjectByName(response.data.data.avenue, "avenue");
            companyDetails.value.avenue = avenueItem;
            constantData.value.avenue = avenueItem;
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

async function updateCompany() {
    let payload = {
        id: companyDetails.value.id,
        name: companyDetails.value.name,
        cancelCharges: companyDetails.value.cancelCharges,
        startHour: companyDetails.value.startHour,
        endHour: companyDetails.value.endHour,
        pricePerBlock: companyDetails.value.pricePerBlock,
        timePerBlock: companyDetails.value.timePerBlock,
        onTimeBonus: companyDetails.value.onTimeBonus,
        billingCycle: companyDetails.value.billingCycle,
        avenue: companyDetails.value.avenue.avenueName,
        street: companyDetails.value.street.streetName,
        block: companyDetails.value.block,
    };
    await CompanyServices.updateCompanyDetails(companyDetails.value.id, payload)
        .then((response) => {
            if (response.data.status == "Success") {
                getCompanyDetails();
                showCompanyPopup.value = false;
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

const getAvailableBlocks = (point) => {
    let filteredBlocks = [];
    FairCalculatorService.BLOCKS.map(item => {
        if (item.leftRoutes.includes(point) || item.rightRoutes.includes(point) || item.topRoutes.includes(point) || item.bottomRoutes.includes(point)) {
            filteredBlocks.push(item.label);
        }
    })
    availableBlocks.value = filteredBlocks;
}

const onLocationChange = () => {
    companyDetails.value.block = null;
    availableBlocks.value = [];
    let addressPoint = null;
    if (companyDetails.value.avenue?.avenueKey && companyDetails.value.street?.streetKey) {
        addressPoint = companyDetails.value.avenue?.avenueKey + companyDetails.value.street?.streetKey;
        getAvailableBlocks(addressPoint);
    }
}
</script>
<template>
    <v-container fill-height>
        <v-row align="center">
            <v-col class="d-flex justify-space-between"><v-card-title class="pl-0 text-h4 font-weight-bold">
                    Company Details
                </v-card-title>
                <v-btn class="mt-3" variant="flat" color="deep-purple" @click="() => openCompanyPopup()">Update
                    Company</v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-card class="rounded-lg elevation-5">
                    <v-row align="center" justify="center"
                        v-bind:style="{ 'font-size': '20px', 'white-space': 'nowrap', 'margin': '20px' }">
                        <v-col cols="10">
                            <v-row>
                                <v-col cols="6">
                                    <v-row>
                                        <v-col><b>Company Name:</b> {{ companyDetails.name }}</v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols="6">
                                    <v-row>
                                        <v-col><b>Cancel Charge Post Pickup:</b> {{ companyDetails.cancelCharges }}$</v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="6">
                                    <v-row>
                                        <v-col><b>Orders Delivered From Time:</b> {{ companyDetails.startHour }}</v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols="6">
                                    <v-row>
                                        <v-col><b>Orders Delivered To Time:</b> {{ companyDetails.endHour }}</v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="6">
                                    <v-row>
                                        <v-col><b>Price Per Block:</b> {{ companyDetails.pricePerBlock }}$</v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols="6">
                                    <v-row>
                                        <v-col><b>Time Taken Per Block:</b> {{ companyDetails.timePerBlock }}mins</v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="6">
                                    <v-row>
                                        <v-col><b>On Time Delivery Bonus:</b> {{ companyDetails.onTimeBonus }}%</v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols="6">
                                    <v-row>
                                        <v-col><b>Billing Cycle:</b> {{ companyDetails?.billingCycle }}</v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="6">
                                    <v-row>
                                        <v-col><b>Address:</b> {{ companyDetails.block + ', ' +
                                            companyDetails.avenue?.avenueName + ', ' + companyDetails.street?.streetName
                                        }}</v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row></v-card></v-col></v-row>
    </v-container>
    <UpdateCompanyVue :showCompanyPopup="showCompanyPopup" :onLocationChange="onLocationChange"
        :availableBlocks="availableBlocks" :company="companyDetails" :updateCompany="updateCompany"
        :closeCompanyPopup="closeCompanyPopup" :getCompanyDetails="getCompanyDetails" />
</template>