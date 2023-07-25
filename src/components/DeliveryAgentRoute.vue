<script setup>
import { ref, watchPostEffect } from 'vue';
import moment from 'moment';
import VueSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import RouteMapView from './RouteMapView.vue';
import CommonServices from '../services/CommonServices';
import FairCalculatorService from '../services/FairCalculatorService';
import { useGlobalStore } from '../stores/globalStore';
import { storeToRefs } from 'pinia';

const globalStore = useGlobalStore();
const { snackBar } = storeToRefs(globalStore);
const userDetails = ref(null);
const routeDirections = ref([]);
const deliveryStatus = ref(null);
const deliveryStatuses = ref([]);
const courierDetails = ref({
    pickupAvenue: null,
    dropAvenue: null,
    pickupStreet: null,
    dropStreet: null,
    pickupBlock: null,
    dropBlock: null,
});
const props = defineProps({
    showDeliveryRoutePopup: false,
    delivery: null,
    updateDeliveryStatus: Function,
    closeDeliveryRoutePopup: Function,
});
const delivery = ref(props.delivery);
watchPostEffect(() => {
    if (delivery.value) {
        const user = JSON.parse(localStorage.getItem("user"));
        userDetails.value = user;
        deliveryStatuses.value = user?.statuses?.filter(item => {
            if (delivery.value?.status.statusId == 6) {
                return item.statusId == 4 || item.statusId == 7;
            } else {
                return item.statusId == 4 || item.statusId == 6 || item.statusId == 7;
            }
        })
        assignAddressesByPoint(delivery.value?.pickupPoint, "pickup");
        assignAddressesByPoint(delivery.value?.dropoffPoint, "drop");
    }
})
const onCancel = () => {
    props.closeDeliveryRoutePopup();
}
const onUpdateStatus = () => {
    let quotedPrice = parseFloat(delivery.value?.quotedPrice);
    if (new Date(delivery.value?.requestedDateTime) > new Date()) {
        quotedPrice = quotedPrice + (quotedPrice * parseInt(userDetails.value?.companyInfo?.onTimeBonus) / 100);
    }
    props.updateDeliveryStatus(deliveryStatus.value?.statusId, quotedPrice);
}

const getDirections = () => {
    let pickupPoint = null;
    let dropPoint = null;
    pickupPoint = courierDetails.value.pickupAvenue?.avenueKey + courierDetails.value.pickupStreet?.streetKey;
    dropPoint = courierDetails.value.dropAvenue?.avenueKey + courierDetails.value.dropStreet?.streetKey;
    let shortestRoute = FairCalculatorService.findShortRoute(pickupPoint, dropPoint);
    console.log(shortestRoute, "shortestRouteshortestRoute");
    routeDirections.value = shortestRoute;
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
const formattedDate = (date) => {
    return moment(date).format('YYYY-MM-DD HH:mm')
}
</script>
<template>
    <v-dialog persistent v-model:modelValue="props.showDeliveryRoutePopup"
        @update:modelValue="props.showDeliveryRoutePopup = $event" width="1080">
        <v-card class="rounded-lg elevation-5 mb-8">
            <v-card-title class="headline">
                Ongoing Order
            </v-card-title>
            <v-card-text class="body-1">
                <v-row>
                    <v-col cols="12">
                        <h3><i>Delivery Details:</i></h3>
                        <v-row align="center" justify="center"
                            v-bind:style="{ 'font-size': '18px', 'white-space': 'nowrap', 'margin': '5px' }">
                            <v-col cols="12">
                                <v-row>
                                    <v-col cols="6">
                                        <v-row>
                                            <v-col>Sender: <b><i>{{
                                                CommonServices.capitalCase(delivery?.senderDetails?.firstName
                                                    + " " +
                                                    delivery?.senderDetails?.lastName)
                                            }}</i></b></v-col>
                                        </v-row>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-row>
                                            <v-col>Reciever: <b><i>{{
                                                CommonServices.capitalCase(delivery?.receiverDetails?.firstName
                                                    + " " +
                                                    delivery?.receiverDetails?.lastName)
                                            }}</i></b></v-col>
                                        </v-row>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="6">
                                        <v-row>
                                            <v-col>Pickup: <b><i>{{
                                                courierDetails.pickupAvenue?.avenueName + ", " +
                                                courierDetails.pickupStreet?.streetName + ", " +
                                                courierDetails.pickupBlock }}</i></b></v-col>
                                        </v-row>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-row>
                                            <v-col>Drop: <b><i>{{
                                                courierDetails.dropAvenue?.avenueName + ", " +
                                                courierDetails.dropStreet?.streetName + ", " +
                                                courierDetails.dropBlock }}</i></b></v-col>
                                        </v-row>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="6">
                                        <v-row>
                                            <v-col>Quoted Price: <b><i>{{
                                                delivery.quotedPrice }}$</i></b></v-col>
                                        </v-row>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-row>
                                            <v-col>Deliver By: <b><i>{{
                                                formattedDate(delivery?.requestedDateTime) }}</i></b></v-col>
                                        </v-row>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="4">
                                        <v-row>
                                            <v-col>
                                                <VueSelect v-model="deliveryStatus" :options="deliveryStatuses"
                                                    label="statusName" value="statusId" placeholder="Delivery Status">
                                                </VueSelect>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="12">
                        <h3><i>Route Map:</i></h3>
                        <v-row>
                            <v-col cols="12" v-bind:style="{ marginTop: '20px' }">
                                <RouteMapView :routeDirections="routeDirections" :courierDetails="courierDetails" />
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
                            <v-btn variant="flat" color="primary" :disabled="!deliveryStatus" @click="onUpdateStatus">Update
                                Status</v-btn>
                        </div>
                    </v-col>
                </v-row>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>