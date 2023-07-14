<script setup>
import { ref, watchPostEffect } from 'vue';
import VueSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import { storeToRefs } from 'pinia';
import FairCalculatorService from '../services/FairCalculatorService';
import CustomerServices from '../services/CustomerServices';
import { useGlobalStore } from '../stores/globalStore';
import CommonServices from '../services/CommonServices';

const globalStore = useGlobalStore();
const { snackBar } = storeToRefs(globalStore);
const props = defineProps({
    showCustomerPopup: false,
    viewType: 'add',
    custId: null,
    getALlCustomers: Function,
    closeCustomerPopup: Function,
    onPhoneChange: Function,
});
const customer = ref({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    street: null,
    avenue: null,
    block: null,
});
watchPostEffect(() => {
    if (props.custId) {
        getCustomerById(props.custId);
    }
});
const availableBlocks = ref([]);
const onCancel = () => {
    customer.value = {
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        street: null,
        avenue: null,
        block: null,
    }
    props.closeCustomerPopup();
}
const onSaveUpdate = () => {
    updateCustomer();
}


async function updateCustomer() {
    let payload = {
        firstName: customer.value.firstName,
        lastName: customer.value.lastName,
        phone: customer.value.phone,
        email: customer.value.email,
        street: customer.value.street.streetName,
        avenue: customer.value.avenue.avenueName,
        block: customer.value.block,
    };
    if (props.viewType == "edit") {
        await CustomerServices.updateCustomer(props.custId, payload)
            .then((response) => {
                if (response.data.status == "Success") {
                    props.getALlCustomers();
                    onCancel();
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
        await CustomerServices.addCustomer(payload)
            .then((response) => {
                if (response.data.status == "Success") {
                    props.getALlCustomers();
                    onCancel();
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

async function getCustomerById(id) {
    await CustomerServices.getCustomerByCustomerId(id)
        .then((response) => {
            customer.value = {
                phone: response.data.data.phone,
                firstName: response.data.data.firstName,
                lastName: response.data.data.lastName,
                email: response.data.data.email,
                block: response.data.data.block,
            }
            customer.value.street = CommonServices.getObjectByName(response.data.data.street, "street");
            customer.value.avenue = CommonServices.getObjectByName(response.data.data.avenue, "avenue");
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
    customer.value.block = null;
    availableBlocks.value = [];
    let addressPoint = null;
    if (customer.value.avenue?.avenueKey && customer.value.street?.streetKey) {
        addressPoint = customer.value.avenue?.avenueKey + customer.value.street?.streetKey;
        getAvailableBlocks(addressPoint);
    }
}

const onPhoneChange = () => {
    var cleaned = ('' + customer.value.phone).replace(/\D/g, '');
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        var intlCode = (match[1] ? '+1 ' : '');
        customer.value.phone = [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
    }
}
</script>
<template>
    <v-dialog persistent v-model:modelValue="props.showCustomerPopup" @update:modelValue="props.showCustomerPopup = $event"
        width="1080">
        <v-card class="rounded-lg elevation-5 mb-8">
            <v-card-title class="headline">
                {{ props.viewType == 'add' ? 'Add' : 'Update' }} Customer
            </v-card-title>
            <v-card-text class="body-1">
                <v-row>
                    <v-col cols="12" sm="6">
                        <v-text-field v-model="customer.firstName" label="First Name*" :rules="[
                            v => !!v || 'First Name is required',
                        ]" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-text-field v-model="customer.lastName" label="Last Name*" :rules="[
                            v => !!v || 'Last Name is required',
                        ]" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-text-field v-model="customer.email" label="Email*" :rules="[
                            v => !!v || 'Email is required',
                            v => v?.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i) || 'Please enter valid email'
                        ]" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-text-field v-model="customer.phone" label="Phone* +1 (xxx) xxx-xxxx" @input="onPhoneChange"
                            :rules="[
                                v => !!v || 'Phone is required',
                                v => v?.length == 17 && v?.charAt(0) == '+' && v?.charAt(1) == '1' || 'Phone must be valid'
                            ]" required></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <h3>Address:</h3>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <VueSelect v-model="customer.avenue" @update:modelValue="onLocationChange"
                            :options="FairCalculatorService.TOTAL_AVENUES" label="avenueName" value="avenueKey"
                            placeholder="Select Avenue*">
                        </VueSelect>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <VueSelect v-model:modelValue="customer.street" @update:modelValue="onLocationChange"
                            :options="FairCalculatorService.TOTAL_STREETS" label="streetName" value="streetKey"
                            placeholder="Select Street*">
                        </VueSelect>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <VueSelect v-model="customer.block" :options="availableBlocks" label="blockName"
                            placeholder="Select Block*">
                        </VueSelect>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-row>
                    <v-col class="d-flex justify-end">
                        <div>
                            <v-btn class="mr-3" variant="flat" color="secondary" @click="onCancel">Cancel</v-btn>
                            <v-btn variant="flat" color="primary" @click="onSaveUpdate" :disabled="!customer?.firstName ||
                                !customer?.lastName ||
                                !customer?.email ||
                                !customer?.email?.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i) ||
                                !customer?.phone ||
                                !customer?.avenue ||
                                !customer?.street ||
                                !customer?.block
                                ">
                                {{ props.viewType == "add" ? "Add Customer" : "Update Customer" }}
                            </v-btn>
                        </div>
                    </v-col>
                </v-row>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>