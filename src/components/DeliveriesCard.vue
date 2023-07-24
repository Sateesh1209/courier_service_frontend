<script setup>
import { ref } from 'vue';
import moment from 'moment';
import CommonServices from '../services/CommonServices';

const props = defineProps({
    delivery: null,
    openRouteMap: Function,
});
const formattedDate = (date) => {
    return moment(date).format('YYYY-MM-DD HH:mm')
}
</script>
<template>
    <v-card class="rounded-lg elevation-5 mb-8">
        <v-card-title class="headline">
            <v-row align="center">
                <v-col>
                    <v-row>
                        <v-col>
                            {{ props.delivery?.pickupPoint?.split("/")[1] }} <v-icon v-bind:style="{ marginLeft: '6px' }"
                                start icon="mdi-bike-fast"></v-icon>
                            {{ props.delivery?.dropoffPoint?.split("/")[1] }}
                            <v-chip class="ma-2" color="primary" label>
                                Sender : {{ CommonServices.capitalCase(props.delivery?.senderDetails?.firstName + " " +
                                    props.delivery?.senderDetails?.lastName)
                                }}</v-chip>
                            <v-chip class="ma-2" color="accent" label>
                                Receiver : {{ CommonServices.capitalCase(props.delivery?.receiverDetails?.firstName + " " +
                                    props.delivery?.receiverDetails?.lastName) }}
                            </v-chip>
                            <v-chip v-if="props.delivery?.status.statusId == 3" class="ma-2" color="green-darken-2" label>
                                <v-icon start icon="mdi-map-marker-path"></v-icon>
                                In Transit
                            </v-chip>
                            <v-chip v-else class="ma-2" color="orange-darken-2" label>
                                <v-icon start icon="mdi-progress-clock"></v-icon>
                                {{ props.delivery?.status.statusName }}
                            </v-chip></v-col>
                    </v-row>
                    <v-row>
                        <v-chip class="ma-2 mb-5" color="purple-darken-2" label>
                            <v-icon start icon="mdi-routes-clock"></v-icon>
                            To be delivered by : {{ formattedDate(props.delivery?.requestedDateTime) }}
                        </v-chip>
                    </v-row>
                </v-col>
                <v-col class="d-flex justify-end">
                    <v-btn variant="flat" color="primary" @click="() => props.openRouteMap(props.delivery)">Open</v-btn>
                </v-col>
            </v-row>
        </v-card-title>
        <v-card-text class="body-1">
            {{ props.delivery?.deliveryInstructions }}
        </v-card-text>
    </v-card>
</template>