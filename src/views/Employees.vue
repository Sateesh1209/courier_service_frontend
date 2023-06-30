<script setup>
import { ref } from 'vue';
import { useGlobalStore } from '../stores/globalStore';
import { storeToRefs } from 'pinia';

const globalStore = useGlobalStore();
const { snackBar } = storeToRefs(globalStore);
const showSn = () => {
    // snackBar.value = { value: true, color: "green", text: "Test snackbar..." }
}
</script>
<template>
    <v-container fill-height>
        <v-row align="center">
            <v-col class="d-flex justify-space-between"><v-card-title class="pl-0 text-h4 font-weight-bold">
                    Employees List
                </v-card-title>
                <v-btn class="mt-3" variant="flat" color="deep-purple" @click="showSn">Enroll Employee</v-btn>
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
                                    <tr>
                                        <td>
                                            Jaswanti
                                        </td>
                                        <td>
                                            J
                                        </td>
                                        <td>
                                            jaswanti@gmail.com
                                        </td>
                                        <td>
                                            +1827267234
                                        </td>
                                        <td>
                                            Delivery Agent
                                        </td>
                                        <td>
                                            <v-icon class="mr-3 mt-2" size="large" icon="mdi-pencil"></v-icon>
                                            <v-icon class="mt-2" size="large" icon="mdi-delete"></v-icon>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Hemanth
                                        </td>
                                        <td>
                                            Chinna
                                        </td>
                                        <td>
                                            hemanth@gmail.com
                                        </td>
                                        <td>
                                            +9282882822
                                        </td>
                                        <td>
                                            Clerk
                                        </td>
                                        <td><v-icon class="mr-3 mt-2" size="large" icon="mdi-pencil"></v-icon>
                                            <v-icon class="mt-2" size="large" icon="mdi-delete"></v-icon>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Divya
                                        </td>
                                        <td>
                                            D
                                        </td>
                                        <td>
                                            divya@gmail.com
                                        </td>
                                        <td>
                                            +1783727722
                                        </td>
                                        <td>
                                            Clerk
                                        </td>
                                        <td><v-icon class="mr-3 mt-2" size="large" icon="mdi-pencil"></v-icon>
                                            <v-icon class="mt-2" size="large" icon="mdi-delete"></v-icon>
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-col>
                    </v-row></v-card></v-col></v-row>
    </v-container>
</template>