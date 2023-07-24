<script setup>
const props = defineProps({
    customerDetails: null,
    customer: null,
    handlePointSwitch: Function,
    type: 'pickup',
});
</script>
<template>
    <v-row justify="center">
        <v-col cols="6">
            <v-card>
                <v-card-title class="id-card__title">
                    Customer
                </v-card-title>
                <v-card-actions class="id-card__actions">
                    <v-spacer></v-spacer>
                    <v-switch v-model:modelValue="props.customerDetails.samePoint"
                        @update:modelValue="props.customerDetails.samePoint = $event"
                        @change="() => props.handlePointSwitch(props.type)" color="white" class="id-card__switch"
                        hide-details>
                        <template v-slot:label>
                            <span class="switch__label">Same {{ props.type }} point</span>
                        </template>
                    </v-switch>
                </v-card-actions>
                <v-card-text class="id-card__content">
                    <div class="id-card__field">
                        <div class="id-card__label">Full Name:</div>
                        <div class="id-card__value">{{ props.customerDetails.firstName + " " +
                            props.customerDetails.lastName }}
                        </div>
                    </div>
                    <div class="id-card__field">
                        <div class="id-card__label">Email:</div>
                        <div class="id-card__value">{{ props.customerDetails.email }}</div>
                    </div>
                    <div class="id-card__field">
                        <div class="id-card__label">Phone:</div>
                        <div class="id-card__value">{{ props.customerDetails.phone }}</div>
                    </div>
                    <div class="id-card__field">
                        <div class="id-card__label">Address:</div>
                        <div class="id-card__value">{{
                            props.customerDetails.block + ", " + props.customerDetails.avenue +
                            ", " + props.customerDetails.street }}</div>
                    </div>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>
  
<style scoped>
.id-card__title {
    background-color: #673AB7;
    color: white;
}

.id-card__content {
    padding: 16px;
}

.id-card__field {
    display: flex;
    margin-bottom: 8px;
}

.id-card__label {
    flex: 1;
    font-weight: bold;
}

.id-card__value {
    flex: 2;
}

.id-card__actions {
    position: absolute;
    top: 0;
    right: 0;
}

.switch__label {
    color: white;
    font-weight: 600;
}
</style>
