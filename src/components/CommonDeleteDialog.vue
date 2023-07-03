<script setup>
const props = defineProps({
    showDeletePopup: false,
    textValue: "",
    onConfDelete: Function,
    closeDeletePopup: Function,
});
</script>
<template>
    <v-dialog persistent v-model="props.showDeletePopup" width="600">
        <v-container>
            <v-card class="rounded-lg elevation-5">
                <div class="pb-2 pl-5 pt-5 pr-5">
                    {{ props.textValue }}
                    <v-row class="mt-3">
                        <v-col class="d-flex justify-end">
                            <v-btn class="mr-3" variant="flat" color="secondary"
                                @click="props.closeDeletePopup()">Cancel</v-btn>
                            <v-btn variant="flat" color="primary" @click="props.onConfDelete()">Confirm</v-btn>
                        </v-col>
                    </v-row>
                </div>
            </v-card>
        </v-container>
    </v-dialog>
</template>