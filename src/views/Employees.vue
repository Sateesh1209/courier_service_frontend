<script setup>
import { onMounted, ref } from 'vue';
import { useGlobalStore } from '../stores/globalStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import AddUpdateEmployee from '../components/AddUpdateEmployee.vue';
import EmployeeServices from "../services/EmployeeServices.js";
import CommonDeleteDialog from '../components/CommonDeleteDialog.vue';

const globalStore = useGlobalStore();
const { snackBar } = storeToRefs(globalStore);
const router = useRouter();
const showEmployeePopup = ref(false);
const showDeletePopup = ref(false);
const totalEmployees = ref([])
const viewType = ref('add')
const employee = ref({
    empId: null,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: null,
})
onMounted(async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user != null && user.roleId == 1) {
        getALlEmployees();
    } else if (user != null && user.roleId != 1) {
        router.push({ name: "dashboard" });
    }
});
const openEmployeePopup = (id = null, currViewType = "add") => {
    viewType.value = currViewType;
    showEmployeePopup.value = true;
    if (id) {
        getEmployeeById(id);
    }
}
const closeEmployeePopup = () => {
    showEmployeePopup.value = false;
    employee.value = {
        empId: null,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        role: null,
    }
}
async function getEmployeeById(id) {
    await EmployeeServices.getEmployeeByEmployeeId(id)
        .then((response) => {
            employee.value = {
                empId: response.data.data.empId,
                firstName: response.data.data.firstName,
                lastName: response.data.data.lastName,
                email: response.data.data.email,
                phone: response.data.data.phone,
                password: "",
                role: response.data.data.role.roleName,
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

async function getALlEmployees() {
    await EmployeeServices.getEmployees()
        .then((response) => {
            totalEmployees.value = response.data.data;
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
async function updateEmployee() {
    let payload = {
        empId: employee.value.empId,
        firstName: employee.value.firstName,
        lastName: employee.value.lastName,
        email: employee.value.email,
        password: employee.value.password,
        phone: employee.value.phone,
        roleId: employee.value.role == "CLERK" ? 2 : 3,
    };
    if (viewType.value == "edit") {
        await EmployeeServices.updateEmployee(employee.value.empId, payload)
            .then((response) => {
                if (response.data.status == "Success") {
                    getALlEmployees();
                    closeEmployeePopup();
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
        await EmployeeServices.addEmployee(payload)
            .then((response) => {
                if (response.data.status == "Success") {
                    getALlEmployees();
                    closeEmployeePopup();
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

const deleteEmployee = (emp) => {
    employee.value = emp;
    showDeletePopup.value = true;
}
async function onConfDelete() {
    await EmployeeServices.deleteEmployee(employee.value.empId)
        .then((response) => {
            if (response.data.status == "Success") {
                getALlEmployees();
                showDeletePopup.value = false;
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
    closeEmployeePopup();
}
const closeDeletePopup = () => {
    showDeletePopup.value = false;
    employee.value = {
        empId: null,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        role: null,
    }
}
const onPhoneChange = () => {
    var cleaned = ('' + employee.value.phone).replace(/\D/g, '');
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        var intlCode = (match[1] ? '+1 ' : '');
        employee.value.phone = [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
        // return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
    }
    // return null;
}
</script>
<template>
    <v-container fill-height>
        <v-row align="center">
            <v-col class="d-flex justify-space-between"><v-card-title class="pl-0 text-h4 font-weight-bold">
                    Employees List
                </v-card-title>
                <v-btn class="mt-3" variant="flat" color="deep-purple" @click="() => openEmployeePopup()">Enroll
                    Employee</v-btn>
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
                                        <th class="text-left">Role</th>
                                        <th class="text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-if="totalEmployees.length == 0">
                                        <td colspan="6" v-bind:style="{
                                            color: '#707070',
                                            'font-size': '14px',
                                            textAlign: 'center',
                                        }">
                                            No employees found...
                                        </td>
                                    </tr>
                                    <tr v-for="emp in totalEmployees" :key="emp.empId">
                                        <td>
                                            {{ emp.firstName }}
                                        </td>
                                        <td>
                                            {{ emp.lastName }}
                                        </td>
                                        <td>
                                            {{ emp.email }}
                                        </td>
                                        <td>
                                            {{ emp?.phone }}
                                        </td>
                                        <td>
                                            {{ emp.role.roleName }}
                                        </td>
                                        <td>
                                            <v-icon class="mr-3 mt-2" size="large" icon="mdi-pencil"
                                                @click="() => openEmployeePopup(emp.empId, 'edit')"></v-icon>
                                            <v-icon class="mt-2" size="large" icon="mdi-delete"
                                                @click="() => deleteEmployee(emp)"></v-icon>
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-col>
                    </v-row></v-card></v-col></v-row>
    </v-container>
    <AddUpdateEmployee :showEmployeePopup="showEmployeePopup" :employee="employee" :onPhoneChange="onPhoneChange"
        :closeEmployeePopup="closeEmployeePopup" :updateEmployee="updateEmployee" :viewType="viewType" />
    <CommonDeleteDialog :showDeletePopup="showDeletePopup" :onConfDelete="onConfDelete" :closeDeletePopup="closeDeletePopup"
        :textValue="`Are you sure want to delete ${employee.firstName} ${employee.lastName} from employees list.`" />
</template>