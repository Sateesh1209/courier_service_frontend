<script setup>
import { onMounted, ref } from 'vue';
import { useGlobalStore } from '../stores/globalStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import AddUpdateCustomer from '../components/AddUpdateCustomer.vue';
import CustomerServices from "../services/CustomerServices.js";
import CommonDeleteDialog from '../components/CommonDeleteDialog.vue';

const globalStore = useGlobalStore();
const { snackBar } = storeToRefs(globalStore);
const router = useRouter();
const showCustomerPopup = ref(false);
const showDeletePopup = ref(false);
const totalCustomers = ref([])
const viewType = ref('add')
const customerDetails = ref({
    id: "",
    phone: "",
    firstName: "",
    lastName: "",
    email: "",
    avenue: "",
    street: "",
    block: "",
});
onMounted(async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user != null && user.roleId == 1) {
        getALlCustomers();
    } else if (user != null && (user.roleId != 1)) {
        router.push({ name: "dashboard" });
    }
});
const openCustomerPopup = (id = null, currViewType = "add") => {
    if (id) {
        customerDetails.value.id = id;
    }
    viewType.value = currViewType;
    showCustomerPopup.value = true;
}
const closeCustomerPopup = () => {
    showCustomerPopup.value = false;
}

async function getALlCustomers() {
    await CustomerServices.getCustomers()
        .then((response) => {
            totalCustomers.value = response.data.data;
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

const deleteCustomer = (cust) => {
    customerDetails.value = cust;
    showDeletePopup.value = true;
}
async function onConfDelete() {
    await CustomerServices.deleteCustomer(customerDetails.value.id)
        .then((response) => {
            if (response.data.status == "Success") {
                getALlCustomers();
                closeDeletePopup();
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
const closeDeletePopup = () => {
    showDeletePopup.value = false;
    customerDetails.value = {
        id: "",
        phone: "",
        firstName: "",
        lastName: "",
        email: "",
        avenue: "",
        street: "",
        block: "",
    }
}
const onPhoneChange = () => {
    var cleaned = ('' + customerDetails.value.phone).replace(/\D/g, '');
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        var intlCode = (match[1] ? '+1 ' : '');
        customerDetails.value.phone = [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
    }
}
</script>
<template>
    <v-container fill-height>
        <v-row align="center">
            <v-col class="d-flex justify-space-between"><v-card-title class="pl-0 text-h4 font-weight-bold">
                    Customers List
                </v-card-title>
                <v-btn class="mt-3" variant="flat" color="deep-purple" @click="() => openCustomerPopup()">Add
                    Customer</v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-card class="rounded-lg elevation-5">
                    <v-row align="center">
                        <v-col cols="12">
                            <v-table>
                                <thead>
                                    <tr v-bind:style="{
                                        backgroundColor: '#b28cf7',
                                    }">
                                        <th class="text-left">First Name</th>
                                        <th class="text-left">Last Name</th>
                                        <th class="text-left">Email</th>
                                        <th class="text-left">Phone</th>
                                        <th class="text-left">Address</th>
                                        <th class="text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-if="totalCustomers.length == 0">
                                        <td colspan="6" v-bind:style="{
                                            color: '#707070',
                                            'font-size': '14px',
                                            textAlign: 'center',
                                        }">
                                            No customers found...
                                        </td>
                                    </tr>
                                    <tr v-for="customer in totalCustomers" :key="customer.customerId">
                                        <td>
                                            {{ customer.firstName }}
                                        </td>
                                        <td>
                                            {{ customer.lastName }}
                                        </td>
                                        <td>
                                            {{ customer.email }}
                                        </td>
                                        <td>
                                            {{ customer?.phone }}
                                        </td>
                                        <td>
                                            {{ customer?.avenue + ", " + customer?.street + ", " + customer?.block }}
                                        </td>
                                        <td>
                                            <v-icon class="mr-3 mt-2" size="large" icon="mdi-pencil"
                                                @click="() => openCustomerPopup(customer.id, 'edit')"></v-icon>
                                            <v-icon class="mt-2" size="large" icon="mdi-delete"
                                                @click="() => deleteCustomer(customer)"></v-icon>
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-col>
                    </v-row></v-card></v-col></v-row>
    </v-container>
    <AddUpdateCustomer :showCustomerPopup="showCustomerPopup" :custId="customerDetails.id" :onPhoneChange="onPhoneChange"
        :closeCustomerPopup="closeCustomerPopup" :getALlCustomers="getALlCustomers" :viewType="viewType" />
    <CommonDeleteDialog :showDeletePopup="showDeletePopup" :onConfDelete="onConfDelete" :closeDeletePopup="closeDeletePopup"
        :textValue="`Are you sure want to delete ${customerDetails.firstName} ${customerDetails.lastName} from customers list.`" />
</template>