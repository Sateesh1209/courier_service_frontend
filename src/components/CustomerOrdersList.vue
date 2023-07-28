<script setup>
import { ref, watchEffect, watchPostEffect } from 'vue';
import VueSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import { storeToRefs } from 'pinia';
import CustomerServices from '../services/CustomerServices';
import { useGlobalStore } from '../stores/globalStore';
import CommonServices from '../services/CommonServices';

const globalStore = useGlobalStore();
const { snackBar } = storeToRefs(globalStore);
const props = defineProps({
    showOrdersListPopup: false,
    custId: null,
    closeOrdersListPopup: Function,
});
const custId = ref(props.custId);
const custTotalAmount = ref(0);
watchPostEffect(() => {
    if (custId.value) {
        getCustomerOrdersList(custId.value);
    }
})
const ordersList = ref([]);
const onClose = () => {
    props.closeOrdersListPopup();
}

async function getCustomerOrdersList(id) {
    await CustomerServices.getCustomerOrdersList(id)
        .then((response) => {
            ordersList.value = response.data?.data;
            let totalPrice = 0;
            if (response.data.data?.length > 0) {
                response.data.data?.map(item => {
                    totalPrice = totalPrice + item.totalPrice;
                })
                custTotalAmount.value = totalPrice;
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
</script>
<template>
    <v-dialog persistent v-model:modelValue="props.showOrdersListPopup"
        @update:modelValue="props.showOrdersListPopup = $event" width="1080">
        <v-card class="rounded-lg elevation-5 mb-8">
            <v-card-title class="headline">
                Customer Orders List
            </v-card-title>
            <v-card-text class="body-1">
                <v-row align="center">
                    <v-col cols="12">
                        <v-table>
                            <thead>
                                <tr v-bind:style="{
                                    backgroundColor: '#b28cf7',
                                }">
                                    <th class="text-left">Sender</th>
                                    <th class="text-left">Reciever</th>
                                    <th class="text-left">Pickup</th>
                                    <th class="text-left">Drop</th>
                                    <th class="text-left">Quoted Price($)</th>
                                    <th class="text-left">Assigned To</th>
                                    <th class="text-left">Status</th>
                                    <th class="text-left">Price Charged($)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="ordersList.length == 0">
                                    <td colspan="8" v-bind:style="{
                                        color: '#707070',
                                        'font-size': '14px',
                                        textAlign: 'center',
                                    }">
                                        No orders found...
                                    </td>
                                </tr>
                                <tr v-for="order in ordersList" :key="order.id">
                                    <td>
                                        {{ order?.senderDetails?.firstName + " " + order?.senderDetails?.lastName }}
                                    </td>
                                    <td>
                                        {{ order?.receiverDetails?.firstName + " " + order?.receiverDetails?.lastName }}
                                    </td>
                                    <td>
                                        {{ order?.pickupPoint?.split("/")[1] }}
                                    </td>
                                    <td>
                                        {{ order?.dropoffPoint?.split("/")[1] }}
                                    </td>
                                    <td>{{ order?.quotedPrice }}</td>
                                    <td>{{ order?.assignedToDetails?.empId ?
                                        (order?.assignedToDetails?.firstName + " " +
                                            order?.assignedToDetails?.lastName) : "-" }}</td>

                                    <td>{{ order?.status.statusName }}</td>
                                    <td>{{ order?.totalPrice ? order?.totalPrice : "-" }}</td>
                                </tr>
                                <tr v-if="ordersList.length != 0">
                                    <td colspan="6"></td>
                                    <td><b>Total Price:</b></td>
                                    <td><b>{{ custTotalAmount }}$</b></td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-row>
                    <v-col class="d-flex justify-end">
                        <div>
                            <v-btn class="mr-3" variant="flat" color="secondary" @click="onClose">Close</v-btn>
                        </div>
                    </v-col>
                </v-row>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>