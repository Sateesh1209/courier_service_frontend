<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import VueSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import RouteMapView from './RouteMapView.vue';
import { useGlobalStore } from '../stores/globalStore';
import { storeToRefs } from 'pinia';
import FairCalculatorService from '../services/FairCalculatorService';
import CustomerServices from '../services/CustomerServices';
import CommonServices from '../services/CommonServices';
import CommonCustomerDetails from './CommonCustomerDetails.vue';

const routeDirections = ref([]);
const panel = ref([0]);
const globalStore = useGlobalStore();
const pickupSearch = ref();
const dropSearch = ref();
const { snackBar } = storeToRefs(globalStore);
const router = useRouter();

const availableBlocks = ref({
    pickup: [],
    drop: [],
});
const customerDetails = ref({
    pickup: {
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        street: "",
        avenue: "",
        block: "",
        samePoint: true,
    },
    drop: {
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        street: "",
        avenue: "",
        block: "",
        samePoint: true,
    },
});
const courierDetails = ref({
    pickupAvenue: null,
    dropAvenue: null,
    pickupStreet: null,
    dropStreet: null,
    pickupBlock: null,
    dropBlock: null,
    requestedDateTime: null,
    estimatedTime: 0,
    estimatedBlocks: 0,
    quotedPrice: 0,
    deliveryInstructions: null,
});

async function updateCourier() {
    let payload = {
        empId: employee.value.empId,
        firstName: employee.value.firstName,
        lastName: employee.value.lastName,
        email: employee.value.email,
        password: employee.value.password,
        phone: employee.value.phone,
        roleId: employee.value.role == "CLERK" ? 2 : 3,
    };
    if (viewType.value == "edit") {
        await CourierServices.updateCourier(employee.value.empId, payload)
            .then((response) => {
                if (response.data.status == "Success") {
                    getALlCouriers();
                    closeCourierPopup();
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
    } else {
        await CourierServices.addCourier(payload)
            .then((response) => {
                if (response.data.status == "Success") {
                    getALlCouriers();
                    closeCourierPopup();
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
}

const onCancel = () => {
    router.push({ name: "couriers" });
}

const onSaveUpdate = () => {
    // updateCourier();
}

const getAddressObject = (street, avenue, block) => {
    let points = {
        street: null,
        avenue: null,
        block: null,
    }
    points.street = CommonServices.getObjectByName(street, "street");
    points.avenue = CommonServices.getObjectByName(avenue, "avenue");
    points.block = block;
    return points;
}
async function getCustomerByEmail(email, type = 'pickup') {
    let customer = {
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        street: "",
        avenue: "",
        block: "",
        samePoint: true,
    };
    let points = {
        street: null,
        avenue: null,
        block: null,
    }
    await CustomerServices.getCustomerByCustomerEmail(email)
        .then((response) => {
            if (response.data.status == 'Success') {
                customer = {
                    phone: response.data.data.phone,
                    firstName: response.data.data.firstName,
                    lastName: response.data.data.lastName,
                    email: response.data.data.email,
                    block: response.data.data.block,
                    street: response.data.data.street,
                    avenue: response.data.data.avenue,
                    samePoint: true,
                }
                points = getAddressObject(response.data.data.street, response.data.data.avenue, response.data.data.block);
            }
            if (type == 'pickup') {
                customerDetails.value.pickup = customer;
                courierDetails.value.pickupAvenue = points.avenue;
                courierDetails.value.pickupStreet = points.street;
                courierDetails.value.pickupBlock = points.block;
            } else {
                customerDetails.value.drop = customer;
                courierDetails.value.dropAvenue = points.avenue;
                courierDetails.value.dropStreet = points.street;
                courierDetails.value.dropBlock = points.block;
            }
            getDirections();
        })
        .catch((error) => {
            console.log(error);
            if (type == 'pickup') {
                customerDetails.value.pickup = customer;
                courierDetails.value.pickupAvenue = points.avenue;
                courierDetails.value.pickupStreet = points.street;
                courierDetails.value.pickupBlock = points.block;
            } else {
                customerDetails.value.drop = customer;
                courierDetails.value.dropAvenue = points.avenue;
                courierDetails.value.dropStreet = points.street;
                courierDetails.value.dropBlock = points.block;
            }
            getDirections();
            snackBar.value = {
                value: true,
                color: "error",
                text: error.response.data.message,
            }
        });
}

const getAvailableBlocks = (point, pointType) => {
    let filteredBlocks = [];
    FairCalculatorService.BLOCKS.map(item => {
        if (item.leftRoutes.includes(point) || item.rightRoutes.includes(point) || item.topRoutes.includes(point) || item.bottomRoutes.includes(point)) {
            filteredBlocks.push(item.label);
        }
    })
    pointType == 'pick' ? availableBlocks.value.pickup = filteredBlocks : availableBlocks.value.drop = filteredBlocks;
}

const getDirections = () => {
    let pickupPoint = null;
    let dropPoint = null;
    if (courierDetails.value.pickupAvenue?.avenueKey && courierDetails.value.pickupStreet?.streetKey) {
        pickupPoint = courierDetails.value.pickupAvenue?.avenueKey + courierDetails.value.pickupStreet?.streetKey;
        getAvailableBlocks(pickupPoint, 'pick');
    }
    if (courierDetails.value.dropAvenue?.avenueKey && courierDetails.value.dropStreet?.streetKey) {
        dropPoint = courierDetails.value.dropAvenue?.avenueKey + courierDetails.value.dropStreet?.streetKey;
        getAvailableBlocks(dropPoint, 'drop');
    }
    if (pickupPoint && dropPoint && courierDetails.value.pickupBlock && courierDetails.value.dropBlock) {
        let shortestRoute = FairCalculatorService.findShortRoute(pickupPoint, dropPoint);
        console.log(shortestRoute);
        if (pickupPoint == dropPoint) {
            snackBar.value = {
                value: true,
                color: "error",
                text: "Pickup and Drop points must be different...",
            }
        } else if (shortestRoute?.length <= 1) {
            snackBar.value = {
                value: true,
                color: "error",
                text: "No route found for selected points. Please choose different pickup/drop points.",
            }
        } else {
            routeDirections.value = shortestRoute;
            courierDetails.value.estimatedBlocks = shortestRoute.length - 1;
            courierDetails.value.estimatedTime = (shortestRoute.length - 1) * 3;
            courierDetails.value.quotedPrice = (shortestRoute.length - 1) * 1.5;
        }
    } else if (routeDirections.value.length != 0) {
        routeDirections.value = [];
        courierDetails.value.estimatedBlocks = 0;
        courierDetails.value.estimatedTime = 0;
        courierDetails.value.quotedPrice = 0;
    }
}
const onLocationChange = (changeType) => {
    if (changeType == 'pickAvenue' || changeType == 'pickStreet') {
        courierDetails.value.pickupBlock = null;
        availableBlocks.value.pickup = [];
    }
    else if (changeType == 'dropAvenue' || changeType == 'dropStreet') {
        courierDetails.value.dropBlock = null;
        availableBlocks.value.drop = [];
    }
    getDirections();
}

const validateDateTime = (value) => {
    if (!value) {
        return true;
    }
    const selectedDate = new Date(value);
    const now = new Date();

    const isFutureDate = selectedDate > now;
    const isWithinTimeRange = selectedDate.getHours() >= 7 && selectedDate.getHours() < 16;

    if (isFutureDate && isWithinTimeRange) {
        return true;
    } else {
        return 'Please select valid future date and time between 7AM to 4PM';
    }
}

const onCheckCustomer = (pointType) => {
    if (pointType == 'pickup') {
        getCustomerByEmail(pickupSearch.value, pointType);
    } else {
        getCustomerByEmail(dropSearch.value, pointType);
    }
}

const handlePointSwitch = (customerType) => {
    if (customerType == 'pickup') {
        if (customerDetails.value.pickup.samePoint) {
            let points = getAddressObject(customerDetails.value.pickup.street, customerDetails.value.pickup.avenue, customerDetails.value.pickup.block);
            courierDetails.value.pickupAvenue = points.avenue;
            courierDetails.value.pickupStreet = points.street;
            courierDetails.value.pickupBlock = points.block;
            getDirections();
        } else {
            courierDetails.value.pickupAvenue = null;
            courierDetails.value.pickupStreet = null;
            courierDetails.value.pickupBlock = null;
            getDirections();
        }
    } else {
        if (customerDetails.value.drop.samePoint) {
            let points = getAddressObject(customerDetails.value.drop.street, customerDetails.value.drop.avenue, customerDetails.value.drop.block);
            courierDetails.value.dropAvenue = points.avenue;
            courierDetails.value.dropStreet = points.street;
            courierDetails.value.dropBlock = points.block;
            getDirections();
        } else {
            courierDetails.value.dropAvenue = null;
            courierDetails.value.dropStreet = null;
            courierDetails.value.dropBlock = null;
            getDirections();
        }
    }
}
</script>
<template>
    <v-container fill-height>
        <v-row align="center">
            <v-col class="d-flex justify-space-between"><v-card-title class="pl-0 text-h4 font-weight-bold">
                    Add Courier
                </v-card-title>
                <v-btn class="mt-3" variant="outlined" color="primary" @click="$router.go(-1)">Back</v-btn>
            </v-col>
        </v-row>
        <v-row align="center">
            <v-col>
                <v-card class="rounded-lg elevation-5" :style="{
                    'max-height': '85vh',
                    'overflow': 'auto',
                    'overflow-x': 'hidden'
                }">
                    <v-card-text>
                        <v-expansion-panels v-model="panel">
                            <v-expansion-panel>
                                <v-expansion-panel-title mandatory>
                                    <template v-slot:default="{ expanded }">
                                        <v-row no-gutters>
                                            <v-col class="d-flex justify-start"><b v-bind:style="{
                                                'font-size': '24px',
                                            }">Customer Details</b></v-col>
                                            <v-col cols="8" class="text--secondary"> </v-col>
                                        </v-row>
                                    </template>
                                </v-expansion-panel-title>
                                <v-expansion-panel-text class="pl-15 pr-15">
                                    <v-row v-bind:style="{ margin: '10px' }">
                                        <v-col cols="12">
                                            <h3>Pickup Details</h3>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-row>
                                                <v-col cols="12" sm="12">
                                                    <v-row justify="center">
                                                        <v-col cols="8" sm="6" align-self="center">
                                                            <v-text-field v-model="pickupSearch" label="Search by email..."
                                                                type="search" :rules="[
                                                                    v => !v || v?.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i) || 'Please enter valid email'
                                                                ]"></v-text-field>
                                                        </v-col>
                                                        <v-col cols="4" sm="2" align-self="center">
                                                            <v-btn variant="flat" color="primary"
                                                                @click="() => onCheckCustomer('pickup')"
                                                                :disabled="!pickupSearch ||
                                                                    !pickupSearch?.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)">Search</v-btn>
                                                        </v-col>
                                                    </v-row>
                                                </v-col>
                                                <v-col v-if="customerDetails.pickup.email" cols="12">
                                                    <CommonCustomerDetails :handlePointSwitch="handlePointSwitch"
                                                        :customerDetails="customerDetails.pickup" type="pickup" />
                                                </v-col>
                                                <v-col v-else cols="12"><i v-bind:style="{ textAlign: 'center' }"><b>Note:
                                                        </b><span v-bind:style="{
                                                            color: '#707070',
                                                            'font-size': '14px',
                                                        }"> Please Search for a customer by email id. If you didn't
                                                            find any
                                                            customer or wanted to add a new customer please do reach out to
                                                            Admin...</span></i>
                                                </v-col>
                                                <template v-if="!customerDetails.pickup.samePoint">
                                                    <v-col cols="12" sm="4">
                                                        <VueSelect v-model="courierDetails.pickupAvenue"
                                                            @update:modelValue="() => onLocationChange('pickAvenue')"
                                                            :options="FairCalculatorService.TOTAL_AVENUES"
                                                            label="avenueName" value="avenueKey"
                                                            placeholder="Select Avenue*">
                                                        </VueSelect>
                                                    </v-col>
                                                    <v-col cols="12" sm="4">
                                                        <VueSelect v-model:modelValue="courierDetails.pickupStreet"
                                                            @update:modelValue="() => onLocationChange('pickStreet')"
                                                            :options="FairCalculatorService.TOTAL_STREETS"
                                                            label="streetName" value="streetKey"
                                                            placeholder="Select Street*">
                                                        </VueSelect>
                                                    </v-col>
                                                    <v-col cols="12" sm="4">
                                                        <VueSelect v-model:modelValue="courierDetails.pickupBlock"
                                                            @update:modelValue="onLocationChange"
                                                            :options="availableBlocks.pickup" label="blockName"
                                                            value="streetKey" placeholder="Select Block*">
                                                        </VueSelect>
                                                    </v-col>
                                                </template>
                                            </v-row>
                                        </v-col>
                                        <v-divider></v-divider>
                                        <v-col cols="12">
                                            <v-row>
                                                <v-col cols="12">
                                                    <h3>Drop Details</h3>
                                                </v-col>
                                                <v-col cols="12" sm="12">
                                                    <v-row justify="center">
                                                        <v-col cols="8" sm="6" align-self="center">
                                                            <v-text-field v-model="dropSearch" label="Search by email..."
                                                                :rules="[
                                                                    v => !v || v?.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i) || 'Please enter valid email'
                                                                ]"></v-text-field>
                                                        </v-col>
                                                        <v-col cols="4" sm="2" align-self="center">
                                                            <v-btn variant="flat" color="primary"
                                                                @click="() => onCheckCustomer('drop')"
                                                                :disabled="!dropSearch ||
                                                                    !dropSearch?.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)">Search</v-btn>
                                                        </v-col>
                                                    </v-row>
                                                </v-col>
                                                <v-col v-if="customerDetails.drop.email" cols="12">
                                                    <CommonCustomerDetails :handlePointSwitch="handlePointSwitch"
                                                        :customerDetails="customerDetails.drop" type="drop" />
                                                </v-col>
                                                <v-col v-else cols="12"><i v-bind:style="{ textAlign: 'center' }"><b>Note:
                                                        </b><span v-bind:style="{
                                                            color: '#707070',
                                                            'font-size': '14px',
                                                        }"> Please Search for a customer by email id. If you didn't
                                                            find any
                                                            customer or wanted to add a new customer please do reach out to
                                                            Admin...</span></i>
                                                </v-col>
                                                <template v-if="!customerDetails.drop.samePoint">
                                                    <v-col cols="12" sm="4">
                                                        <VueSelect v-model:modelValue="courierDetails.dropAvenue"
                                                            @update:modelValue="() => onLocationChange('dropAvenue')"
                                                            :options="FairCalculatorService.TOTAL_AVENUES"
                                                            label="avenueName" value="avenueKey"
                                                            placeholder="Select Avenue*">
                                                        </VueSelect>
                                                    </v-col>
                                                    <v-col cols="12" sm="4">
                                                        <VueSelect v-model:modelValue="courierDetails.dropStreet"
                                                            @update:modelValue="() => onLocationChange('dropStreet')"
                                                            :options="FairCalculatorService.TOTAL_STREETS"
                                                            label="streetName" value="streetKey"
                                                            placeholder="Select Street*">
                                                        </VueSelect>
                                                    </v-col>
                                                    <v-col cols="12" sm="4">
                                                        <VueSelect v-model:modelValue="courierDetails.dropBlock"
                                                            @update:modelValue="onLocationChange"
                                                            :options="availableBlocks.drop" label="blockName"
                                                            value="streetKey" placeholder="Select Block*">
                                                        </VueSelect>
                                                    </v-col>
                                                </template>
                                            </v-row>
                                        </v-col>
                                    </v-row>
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                            <v-expansion-panel>
                                <v-expansion-panel-title mandatory>
                                    <template v-slot:default="{ expanded }">
                                        <v-row no-gutters>
                                            <v-col class="d-flex justify-start"><b v-bind:style="{
                                                'font-size': '24px',
                                            }">Delivery Details</b></v-col>
                                            <v-col cols="8" class="text--secondary"> </v-col>
                                        </v-row>
                                    </template>
                                </v-expansion-panel-title>

                                <v-expansion-panel-text class="pl-15 pr-15">
                                    <v-row v-if="courierDetails.pickupBlock && courierDetails.dropBlock">
                                        <v-col cols="12">
                                            <v-row>
                                                <v-col cols="6">
                                                    <v-text-field v-model="courierDetails.requestedDateTime"
                                                        label="Requested Delivery Date Time*" type="datetime-local"
                                                        :rules="[v => !!v || 'This field is required', validateDateTime]"></v-text-field>
                                                </v-col>
                                                <v-col cols="6">
                                                    <v-text-field v-model="courierDetails.deliveryInstructions"
                                                        label="Delivery Instructions*"
                                                        :rules="[
                                                            v => !!v || 'Delivery instructions are required']"></v-text-field>
                                                </v-col>
                                            </v-row>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-row align="center" justify="center"
                                                v-bind:style="{ 'font-size': '18px', 'white-space': 'nowrap', 'margin': '5px' }">
                                                <v-col cols="12">
                                                    <v-row>
                                                        <v-col cols="6">
                                                            <v-row>
                                                                <v-col>Estimated Delivery Time Post Pickup: <b><i>{{
                                                                    courierDetails.estimatedTime
                                                                }} minutes</i></b></v-col>
                                                            </v-row>
                                                        </v-col>
                                                        <v-col cols="6">
                                                            <v-row>
                                                                <v-col>Estimated Blocks: <b><i>{{
                                                                    courierDetails.estimatedBlocks
                                                                }}</i></b></v-col>
                                                            </v-row>
                                                        </v-col>
                                                    </v-row>
                                                    <v-row>
                                                        <v-col cols="6">
                                                            <v-row>
                                                                <v-col>Quoted Price: <b><i>{{
                                                                    courierDetails.quotedPrice }}$</i></b></v-col>
                                                            </v-row>
                                                        </v-col>
                                                    </v-row>
                                                </v-col>
                                            </v-row>
                                        </v-col>
                                        <v-col cols="12" v-bind:style="{ 'font-size': '20px' }"><b><i
                                                    v-bind:style="{ color: '#19AC2F' }">
                                                    {{ courierDetails?.pickupAvenue?.avenueName + ", " +
                                                        courierDetails?.pickupStreet?.streetName +
                                                        ", " + courierDetails?.pickupBlock }}</i> <b> --> </b>
                                                <i v-bind:style="{ color: '#ac1919' }"> {{
                                                    courierDetails?.dropAvenue?.avenueName
                                                    + ", " +
                                                    courierDetails?.dropStreet?.streetName +
                                                    ", " + courierDetails?.dropBlock }}</i></b>
                                        </v-col>
                                    </v-row>
                                    <v-row v-else>
                                        <v-col cols="12"><i v-bind:style="{ textAlign: 'center' }">
                                                <b>Note:</b>
                                                <span v-bind:style="{
                                                    color: '#707070',
                                                    'font-size': '14px',
                                                }"> Please select customers along with pickup and drop addresses from
                                                    "Customer Details" tab to
                                                    generate shortest path and fair details...</span></i>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12">
                                            <h3>Route Map</h3>
                                        </v-col>
                                        <v-col cols="12">
                                            <RouteMapView :routeDirections="routeDirections"
                                                :courierDetails="courierDetails" />
                                        </v-col>
                                    </v-row>
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-card-text>
                    <v-card-actions>
                        <v-row>
                            <v-col class="d-flex justify-end">
                                <div>
                                    <v-btn class="mr-3" variant="flat" color="secondary" @click="onCancel">Cancel</v-btn>
                                    <v-btn v-if="viewType == 'add'" variant="flat" color="primary" @click="onSaveUpdate">Add
                                        Courier</v-btn>
                                    <v-btn v-else variant="flat" color="primary" @click="onSaveUpdate">Update
                                        Courier</v-btn>
                                </div>
                            </v-col>
                        </v-row>
                    </v-card-actions>
                </v-card>
            </v-col></v-row>
    </v-container>
</template>