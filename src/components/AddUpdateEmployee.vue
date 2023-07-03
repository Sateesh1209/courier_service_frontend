<script setup>
import { ref } from 'vue';

const roles = ref(['CLERK', 'DELIVERY AGENT']);
const enablePassword = ref(false);
const props = defineProps({
    showEmployeePopup: false,
    viewType: 'add',
    employee: null,
    updateEmployee: Function,
    closeEmployeePopup: Function,
    onPhoneChange: Function,
});
const onCancel = () => {
    enablePassword.value = false;
    props.closeEmployeePopup();
}
const onSaveUpdate = () => {
    enablePassword.value = false;
    props.updateEmployee();
}
</script>
<template>
    <v-dialog persistent v-model:modelValue="props.showEmployeePopup" @update:modelValue="props.showEmployeePopup = $event"
        width="1080">
        <v-card class="rounded-lg elevation-5 mb-8">
            <v-card-title class="headline">
                {{ props.viewType == 'add' ? 'Add' : 'Update' }} Employee
            </v-card-title>
            <v-card-text class="body-1">
                <v-row>
                    <v-col cols="12" sm="6">
                        <v-text-field v-model:modelValue="props.employee.firstName"
                            @update:modelValue="props.employee.firstName = $event" label="First Name*" :rules="[
                                v => !!v || 'First Name is required',
                            ]" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-text-field v-model:modelValue="props.employee.lastName"
                            @update:modelValue="props.employee.lastName = $event" label="Last Name*" :rules="[
                                v => !!v || 'Last Name is required',
                            ]" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-text-field v-model:modelValue="props.employee.email"
                            @update:modelValue="props.employee.email = $event" label="Email*" :rules="[
                                v => !!v || 'Email is required',
                                v => v?.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i) || 'Please enter valid email'
                            ]" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-text-field v-model:modelValue="props.employee.phone"
                            @update:modelValue="props.employee.phone = $event" label="Phone* +1 (xxx) xxx-xxxx"
                            @input="props.onPhoneChange" :rules="[
                                v => !!v || 'Phone is required',
                                v => v?.length == 17 && v?.charAt(0) == '+' && v?.charAt(1) == '1' || 'Phone must be valid'
                            ]" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-select v-model:modelValue="props.employee.role" @update:modelValue="props.employee.role = $event"
                            :items="roles" density="comfortable" label="Role*" :rules="[
                                v => !!v || 'Role is required',
                            ]"></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-row>
                            <v-col :cols="enablePassword == false && props.viewType == 'edit' ? 10 : 12"><v-text-field
                                    v-model:modelValue="props.employee.password"
                                    @update:modelValue="props.employee.password = $event" label="Password*" required
                                    type="password" :rules="[
                                        v => !!v || 'Password is required',
                                    ]"
                                    :disabled="enablePassword == false && props.viewType == 'edit'"></v-text-field></v-col>
                            <v-col v-if="enablePassword == false && props.viewType == 'edit'" cols="2"><v-icon class="mt-2"
                                    size="large" icon="mdi-pencil" @click="() => enablePassword = true"></v-icon></v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-row>
                    <v-col class="d-flex justify-end">
                        <div>
                            <v-btn class="mr-3" variant="flat" color="secondary" @click="onCancel">Cancel</v-btn>
                            <v-btn v-if="props.viewType == 'add'" variant="flat" color="primary" @click="onSaveUpdate"
                                :disabled="!props.employee?.firstName ||
                                    !props.employee?.lastName ||
                                    !props.employee?.email ||
                                    !props.employee?.email?.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i) ||
                                    !props.employee?.phone ||
                                    !props.employee?.role ||
                                    !props.employee?.password || !(props.employee?.phone?.length == 17 && props.employee?.phone?.charAt(0) == '+' && props.employee?.phone?.charAt(1) == '1')
                                    ">Enroll Employee</v-btn>
                            <v-btn v-else variant="flat" color="primary" @click="onSaveUpdate" :disabled="!props.employee?.firstName ||
                                !props.employee?.lastName ||
                                !props.employee?.email ||
                                !props.employee?.email?.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i) ||
                                !props.employee?.phone ||
                                !props.employee?.role ||
                                (!props.employee?.password && enablePassword == true) || !(props.employee?.phone?.length == 17 && props.employee?.phone?.charAt(0) == '+' && props.employee?.phone?.charAt(1) == '1')
                                ">Update Employee</v-btn>
                        </div>
                    </v-col>
                </v-row>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>