<script setup>
import moment from 'moment';
import CommonServices from '../services/CommonServices';
import checkMarkImg from '../images/check-mark.gif';
const props = defineProps({
    successPopup: {
        showPopup: false,
        message: "",
    },
    closeSuccessPopup: Function,
});
const onClose = () => {
    props.closeSuccessPopup();
}
</script>
<template>
    <v-dialog persistent v-model:modelValue="props.successPopup.showPopup"
        @update:modelValue="props.successPopup.showPopup = $event" width="1080">
        <v-card class="rounded-lg elevation-5 mb-8">
            <v-row align="center" justify="center">
                <v-col align="center">
                    <img :src="checkMarkImg" />
                </v-col>
            </v-row>
            <v-row align="center" justify="center">
                <v-col align="center">
                    <v-card-text class="headline">
                        <i v-bind:style="{ textAlign: 'center' }"><b v-bind:style="{
                            'font-size': '18px',
                        }">{{ props.successPopup.message }} </b></i>
                    </v-card-text>
                </v-col>
            </v-row>
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