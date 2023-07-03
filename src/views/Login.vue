<script setup>
import { ref } from 'vue';
import logo from "../images/express_logo.png";
import UserServices from "../services/UserServices.js";
import { useGlobalStore } from '../stores/globalStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const props = defineProps({
    onLogin: Function,
});
const globalStore = useGlobalStore();
const { snackBar } = storeToRefs(globalStore);
const router = useRouter();
const login = ref({
    email: "",
    password: "",
});
const emailInValid = ref(false);

async function loginClick() {
    await UserServices.loginUser(login)
        .then((data) => {
            window.localStorage.setItem("user", JSON.stringify(data.data.data));
            snackBar.value = {
                value: true,
                color: "green",
                text: "Login successful!",
            }
            // window.location.href = "/Dashboard"
            router.push({ name: "dashboard" });
            props.onLogin();
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
function onEmailChange() {
    if (login.value.email) {
        if (login.value.email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)) {
            emailInValid.value = false;
        } else {
            emailInValid.value = true;
        }
    } else {
        emailInValid.value = false;
    }
}
</script>
<template>
    <v-container fill-height>
        <div id="body">
            <v-row align="center" class="align-center justify-center"><v-col class="v-col-auto"><v-img class="mx-2"
                        :src="logo" height="150" width="150" contain></v-img></v-col>
                <v-col class="v-col-auto">
                    <div class="pl-0 text-h4 font-weight-bold"><i>Courier Services</i></div>
                </v-col>
            </v-row>
            <v-card class="rounded-lg mx-auto" max-width="600">
                <v-toolbar dark color="deep-purple">
                    <v-toolbar-title>Login</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-form>
                        <v-text-field v-model="login.email" name="login" label="Email Address"
                            :hint="emailInValid && 'Please enter valid email'" @input="onEmailChange"
                            type="text"></v-text-field>
                        <v-text-field v-model="login.password" id="password" name="password" label="Password"
                            type="password"></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn variant="flat" color="deep-purple" :disabled="emailInValid || !login.email || !login.password"
                        @click="loginClick()">Login</v-btn>
                </v-card-actions>
            </v-card>
        </div>
    </v-container>
</template>