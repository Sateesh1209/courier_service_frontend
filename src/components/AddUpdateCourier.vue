<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import VueSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import RouteMapView from './RouteMapView.vue';
import { useGlobalStore } from '../stores/globalStore';
import { storeToRefs } from 'pinia';
import FairCalculatorService from '../services/FairCalculatorService';
import CustomerServices from '../services/CustomerServices';
import CommonServices from '../services/CommonServices';
import CommonCustomerDetails from './CommonCustomerDetails.vue';
import CourierServices from '../services/CourierServices';

const routeDirections = ref([]);
const panel = ref([0]);
const globalStore = useGlobalStore();
const route = useRoute();
const viewType = ref("add");
const pickupSearch = ref();
const dropSearch = ref();
const { snackBar } = storeToRefs(globalStore);
const router = useRouter();

const availableBlocks = ref({
    pickup: [],
    drop: [],
});
const companyInfo = ref({});
const customerDetails = ref({
    pickup: {
        id: null,
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
        id: null,
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
    id: null,
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

onMounted(async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user != null && (user.roleId == 1 || user.roleId == 2)) {
        if (route?.params?.courierId) {
            viewType.value = "edit";
            getCourierDetailsById(route?.params?.courierId);
        } else {
            viewType.value = "add";
        }
        companyInfo.value = user.companyInfo;
    } else if (user != null && user.roleId != 1) {
        router.push({ name: "couriers" });
    }
});

const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const year = dateTime.getFullYear();
    const month = String(dateTime.getMonth() + 1).padStart(2, "0");
    const date = String(dateTime.getDate()).padStart(2, "0");
    const hours = String(dateTime.getHours()).padStart(2, "0");
    const minutes = String(dateTime.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${date}T${hours}:${minutes}`;
}

async function getCourierDetailsById(id) {
    await CourierServices.getCourierByCourierId(id)
        .then((response) => {
            if (response.data?.status == "Success") {
                let tempObj = {
                    pickup: {
                        ...response.data?.data?.senderDetails,
                        samePoint: JSON.parse(response.data?.data?.pickupPoint?.split("/")[2]),
                    },
                    drop: {
                        ...response.data?.data?.receiverDetails,
                        samePoint: JSON.parse(response.data?.data?.dropoffPoint?.split("/")[2]),
                    },
                };
                courierDetails.value.id = id;
                courierDetails.value.deliveryInstructions = response.data?.data?.deliveryInstructions;
                courierDetails.value.requestedDateTime = formatDateTime(response.data?.data?.requestedDateTime);
                customerDetails.value = tempObj;
                customerDetails.value.pickup = tempObj.pickup;
                customerDetails.value.drop = tempObj.drop;
                if (tempObj.pickup.samePoint) {
                    assignAddresses(tempObj.pickup, 'pickup')
                } else {
                    assignAddressesByPoint(response.data?.data?.pickupPoint, 'pickup')
                }
                if (tempObj.drop.samePoint) {
                    assignAddresses(tempObj.drop, 'drop')
                } else {
                    assignAddressesByPoint(response.data?.data?.dropoffPoint, 'drop')
                }
            }
        })
        .catch((error) => {
            console.log(error);
            snackBar.value = {
                value: true,
                color: "error",
                text: error.response?.data?.message,
            }
        });
}

async function updateCourier() {
    let payload = {
        id: parseInt(courierDetails.value.id),
        sender: customerDetails.value.pickup.id,
        receiver: customerDetails.value.drop.id,
        pickupPoint: courierDetails.value.pickupAvenue?.avenueKey + courierDetails.value.pickupStreet?.streetKey + "/" + courierDetails.value.pickupBlock + "/" + customerDetails.value.pickup.samePoint,
        dropoffPoint: courierDetails.value.dropAvenue?.avenueKey + courierDetails.value.dropStreet?.streetKey + "/" + courierDetails.value.dropBlock + "/" + customerDetails.value.drop.samePoint,
        estimateTime: courierDetails.value.estimatedTime,
        estimateBlocks: courierDetails.value.estimatedBlocks,
        quotedPrice: courierDetails.value.quotedPrice,
        totalPrice: 0,
        requestedDateTime: courierDetails.value.requestedDateTime,
        deliveryInstructions: courierDetails.value.deliveryInstructions,
    };
    if (viewType.value == "edit") {
        await CourierServices.updateCourier(courierDetails.value.id, payload)
            .then((response) => {
                if (response.data?.status == "Success") {
                    snackBar.value = {
                        value: true,
                        color: "green",
                        text: response.data?.message,
                    }
                    router.push({ name: "couriers" });
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
    } else {
        await CourierServices.addCourier(payload)
            .then((response) => {
                if (response.data?.status == "Success") {
                    snackBar.value = {
                        value: true,
                        color: "green",
                        text: response.data?.message,
                    }
                    router.push({ name: "couriers" });
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
}

const onCancel = () => {
    router.push({ name: "couriers" });
}

const onSaveUpdate = () => {
    updateCourier();
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
const getAddressObjectByPoint = (point) => {
    let points = {
        street: null,
        avenue: null,
        block: null,
    }
    points.street = CommonServices.getObjectById(point?.slice(2, 4), "street");
    points.avenue = CommonServices.getObjectById(point?.slice(0, 2), "avenue");
    points.block = point?.split("/")[1];
    return points;
}

const assignAddressesByPoint = (point, type, points = {
    street: null,
    avenue: null,
    block: null,
}) => {
    points = getAddressObjectByPoint(point);
    if (type == 'pickup') {
        courierDetails.value.pickupAvenue = points.avenue;
        courierDetails.value.pickupStreet = points.street;
        courierDetails.value.pickupBlock = points.block;
    } else {
        courierDetails.value.dropAvenue = points.avenue;
        courierDetails.value.dropStreet = points.street;
        courierDetails.value.dropBlock = points.block;
    }
    getDirections();
}
const assignAddresses = (customer, type, points = {
    street: null,
    avenue: null,
    block: null,
}) => {
    points = getAddressObject(customer.street, customer.avenue, customer.block);
    if (type == 'pickup') {
        courierDetails.value.pickupAvenue = points.avenue;
        courierDetails.value.pickupStreet = points.street;
        courierDetails.value.pickupBlock = points.block;
    } else {
        courierDetails.value.dropAvenue = points.avenue;
        courierDetails.value.dropStreet = points.street;
        courierDetails.value.dropBlock = points.block;
    }
    getDirections();
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
            if (response.data?.status == 'Success') {
                customer = {
                    id: response.data?.data.id,
                    phone: response.data?.data.phone,
                    firstName: response.data?.data.firstName,
                    lastName: response.data?.data.lastName,
                    email: response.data?.data.email,
                    block: response.data?.data.block,
                    street: response.data?.data.street,
                    avenue: response.data?.data.avenue,
                    samePoint: true,
                }
            }
            if (type == 'pickup') {
                customerDetails.value.pickup = customer;
            } else {
                customerDetails.value.drop = customer;
            }
            assignAddresses(customer, type, points);
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
                text: error.response.data?.message,
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
            if (routeDirections.value.length != 0) {
                clearRoutes();
            }
        } else if (shortestRoute?.length <= 1) {
            snackBar.value = {
                value: true,
                color: "error",
                text: "No route found for selected points. Please choose different pickup/drop points.",
            }
            if (routeDirections.value.length != 0) {
                clearRoutes();
            }
        } else {
            routeDirections.value = shortestRoute;
            courierDetails.value.estimatedBlocks = shortestRoute.length - 1;
            courierDetails.value.estimatedTime = (shortestRoute.length - 1) * companyInfo.value?.timePerBlock;
            courierDetails.value.quotedPrice = (shortestRoute.length - 1) * companyInfo.value?.pricePerBlock;
        }
    } else if (routeDirections.value.length != 0) {
        clearRoutes();
    }
}
const clearRoutes = () => {
    routeDirections.value = [];
    courierDetails.value.estimatedBlocks = 0;
    courierDetails.value.estimatedTime = 0;
    courierDetails.value.quotedPrice = 0;
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
    const startTimeParts = companyInfo.value?.startHour?.split(":");
    const startHours = parseInt(startTimeParts[0], 10);
    const startMinutes = parseInt(startTimeParts[1], 10);
    const endTimeParts = companyInfo.value?.endHour.split(":");
    const endHours = parseInt(endTimeParts[0], 10);
    const endMinutes = parseInt(endTimeParts[1], 10);

    const currentDate = new Date();
    const selectedHours = selectedDate.getHours();
    const selectedMinutes = selectedDate.getMinutes();
    if (selectedDate > currentDate &&
        ((selectedHours > startHours || (selectedHours === startHours && selectedMinutes >= startMinutes)) &&
            (selectedHours < endHours || (selectedHours === endHours && selectedMinutes <= endMinutes)))) {
        return true;
    } else {
        return `Please select valid future date and time between ${getTime(companyInfo.value?.startHour)} to ${getTime(companyInfo.value?.endHour)}`;
    }
}

const getTime = (time) => {
    const timeString = time;
    const timeParts = timeString.split(':');
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);

    const formattedTime = new Date(0, 0, 0, hours, minutes).toLocaleString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    return formattedTime;
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
                                    <v-btn v-if="viewType == 'add'"
                                        :disabled="!(courierDetails.pickupBlock && courierDetails.dropBlock && routeDirections.length > 0 && courierDetails.requestedDateTime && validateDateTime(courierDetails.requestedDateTime) == true && courierDetails.deliveryInstructions)"
                                        variant="flat" color="primary" @click="onSaveUpdate">Add
                                        Courier</v-btn>
                                    <v-btn v-else
                                        :disabled="!(courierDetails.pickupBlock && courierDetails.dropBlock && routeDirections.length > 0 && courierDetails.requestedDateTime && validateDateTime(courierDetails.requestedDateTime) == true && courierDetails.deliveryInstructions)"
                                        variant="flat" color="primary" @click="onSaveUpdate">Update
                                        Courier</v-btn>
                                </div>
                            </v-col>
                        </v-row>
                    </v-card-actions>
                </v-card>
            </v-col></v-row>
    </v-container>
</template>