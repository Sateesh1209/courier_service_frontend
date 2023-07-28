<script setup>
import VueSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import FairCalculatorService from '../services/FairCalculatorService';


const props = defineProps({
    showCompanyPopup: false,
    company: null,
    availableBlocks: [],
    onLocationChange: Function,
    updateCompany: Function,
    onPhoneChange: Function,
    closeCompanyPopup: Function,
});

const onCancel = () => {
    props.closeCompanyPopup();
}
const onSaveUpdate = () => {
    props.updateCompany();
}
const openTimePicker = () => {
    this.$refs.timeField.$el.querySelector('input').focus();
}
const billingCycleHint = (billingCycle) => {
    switch (billingCycle) {
        case "Weekly": return "Bill will be generated at 9AM of every Sunday";
        case "Monthly": return "Bill will be generated at 9AM of every Month Day 1";
        case "Yearly": return "Bill will be generated at 9AM of every Year Month 1 Day 1";
    }
}
</script>
<template>
    <v-dialog persistent v-model:modelValue="props.showCompanyPopup" @update:modelValue="props.showCompanyPopup = $event"
        width="1080">
        <v-card class="rounded-lg elevation-5 mb-8">
            <v-card-title class="headline">
                Update Company Details
            </v-card-title>
            <v-card-text class="body-1">
                <v-row>
                    <v-col cols="12" sm="6">
                        <v-text-field v-model:modelValue="props.company.name"
                            @update:modelValue="props.company.name = $event" label="Company Name*" :rules="[
                                v => !!v || 'Company Name is required',
                            ]" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-text-field v-model:modelValue="props.company.cancelCharges"
                            @update:modelValue="props.company.cancelCharges = $event" label="Cancel Charge Post Pickup($)*"
                            :rules="[
                                v => !!v || 'Cancel Charge Post Pickup is required',
                                v => /^[0-9]+(\.[0-9]+)?$/.test(v) || 'Invalid number format',
                            ]" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-text-field v-model:modelValue="props.company.pricePerBlock"
                            @update:modelValue="props.company.pricePerBlock = $event" label="Price Per Block($)*" :rules="[
                                v => !!v || 'Price Per Block is required',
                                v => /^[0-9]+(\.[0-9]+)?$/.test(v) || 'Invalid number format',
                            ]" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-text-field v-model:modelValue="props.company.timePerBlock"
                            @update:modelValue="props.company.timePerBlock = $event" label="Time Taken Per Block(Minutes)*"
                            :rules="[
                                v => !!v || 'Time Taken Per Block is required',
                                v => /^\d+$/.test(v) || 'Only whole numbers are allowed',
                            ]" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-text-field v-model:modelValue="props.company.onTimeBonus"
                            @update:modelValue="props.company.onTimeBonus = $event" label="On Time Delivery Bonus(%)*"
                            :rules="[
                                v => !!v || 'On Time Delivery Bonus is required',
                                v => /^[0-9]+(\.[0-9]+)?$/.test(v) || 'Invalid number format',
                            ]" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-select v-model:modelValue="props.company.billingCycle"
                            @update:modelValue="props.company.billingCycle = $event"
                            :items="['Weekly', 'Monthly', 'Yearly']" density="comfortable" label="Billing Cycle*" :rules="[
                                v => !!v || 'Billing Cycle is required',
                            ]" persistent-hint :hint="billingCycleHint(props.company.billingCycle)"></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-text-field v-model:modelValue="props.company.phone"
                            @update:modelValue="props.company.phone = $event" label="Phone* +1 (xxx) xxx-xxxx"
                            @input="props.onPhoneChange" :rules="[
                                v => !!v || 'Phone is required',
                                v => v?.length == 17 && v?.charAt(0) == '+' && v?.charAt(1) == '1' || 'Phone must be valid'
                            ]" required></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <h3>Address:</h3>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <VueSelect v-model="props.company.avenue" @update:modelValue="props.onLocationChange"
                            :options="FairCalculatorService.TOTAL_AVENUES" label="avenueName" value="avenueKey"
                            placeholder="Select Avenue*">
                        </VueSelect>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <VueSelect v-model:modelValue="props.company.street" @update:modelValue="props.onLocationChange"
                            :options="FairCalculatorService.TOTAL_STREETS" label="streetName" value="streetKey"
                            placeholder="Select Street*">
                        </VueSelect>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <VueSelect v-model="props.company.block" :options="props.availableBlocks" label="blockName"
                            placeholder="Select Block*">
                        </VueSelect>
                    </v-col>
                    <v-col cols="12">
                        <h3>Delivery Timings:</h3>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-text-field v-model:modelValue="props.company.startHour"
                            @update:modelValue="props.company.startHour = $event" label="Orders Delivered From Time*"
                            :type="'time'" :append-icon-cb="openTimePicker" :rules="[
                                v => !!v || 'Orders Delivered From Time is required',
                            ]" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-text-field v-model:modelValue="props.company.endHour"
                            @update:modelValue="props.company.endHour = $event" label="Orders Delivered To Time*"
                            :type="'time'" :append-icon-cb="openTimePicker" :rules="[
                                v => !!v || 'Orders Delivered To Time is required',
                            ]" required></v-text-field>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-row>
                    <v-col class="d-flex justify-end">
                        <div>
                            <v-btn class="mr-3" variant="flat" color="secondary" @click="onCancel">Cancel</v-btn>
                            <v-btn variant="flat" color="primary" @click="onSaveUpdate" :disabled="!props.company?.name ||
                                !props.company?.pricePerBlock ||
                                !props.company?.pricePerBlock?.match(/^[0-9]+(\.[0-9]+)?$/) ||
                                !props.company?.timePerBlock ||
                                !props.company?.timePerBlock?.match(/^\d+$/) ||
                                !props.company?.startHour ||
                                !props.company?.endHour ||
                                !props.company?.cancelCharges ||
                                !props.company?.cancelCharges?.match(/^[0-9]+(\.[0-9]+)?$/) ||
                                !props.company?.onTimeBonus ||
                                !props.company?.onTimeBonus?.match(/^[0-9]+(\.[0-9]+)?$/) ||
                                !props.company.billingCycle ||
                                !props.company?.phone ||
                                !props.company?.avenue ||
                                !props.company?.street ||
                                !props.company?.block
                                ">Update Company</v-btn>
                        </div>
                    </v-col>
                </v-row>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>