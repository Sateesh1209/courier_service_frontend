<script setup>
const props = defineProps({
    employeeDetails: null,
});
</script>
<template>
    <v-row justify="center">
        <v-col cols="6">
            <v-card>
                <v-card-title class="id-card__title">
                    Employee
                </v-card-title>
                <v-card-text class="id-card__content">
                    <template v-if="props.employeeDetails?.email">
                        <div class="id-card__field">
                            <div class="id-card__label">Full Name:</div>
                            <div class="id-card__value">{{ props.employeeDetails?.firstName + " " +
                                props.employeeDetails?.lastName }}
                            </div>
                        </div>
                        <div class="id-card__field">
                            <div class="id-card__label">Email:</div>
                            <div class="id-card__value">{{ props.employeeDetails?.email }}</div>
                        </div>
                        <div class="id-card__field">
                            <div class="id-card__label">Phone:</div>
                            <div class="id-card__value">{{ props.employeeDetails?.phone }}</div>
                        </div>
                        <div class="id-card__field">
                            <div class="id-card__label">Role:</div>
                            <div class="id-card__value">{{ props.employeeDetails?.role?.roleName }}</div>
                        </div>
                    </template>
                    <template v-else>
                        <i v-bind:style="{ textAlign: 'center' }"><span v-bind:style="{
                            color: '#707070',
                            'font-size': '14px',
                        }"> Please enter email id and click on search to fetch the data...</span></i>
                    </template>
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
</style>
