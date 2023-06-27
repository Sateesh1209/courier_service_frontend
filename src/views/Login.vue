<script setup>
import { ref } from 'vue';
import logo from "../images/express_logo.png";

const loginType = ref("user");
</script>
<template>
    <v-container fill-height>
        <div id="body">
            <!-- <marquee behavior="scroll" direction="right" scrollamount="50"><v-img class="mx-2" :src="logo" height="150"
                    width="150" contain></v-img></marquee> -->
            <v-row align="center" class="align-center justify-center"><v-col class="v-col-auto"><v-img class="mx-2"
                        :src="logo" height="150" width="150" contain></v-img></v-col>
                <v-col class="v-col-auto">
                    <div class="pl-0 text-h4 font-weight-bold">Courier Services...</div>
                </v-col>
            </v-row>
            <v-card class="rounded-lg mx-auto" max-width="600">
                <v-toolbar dark color="primary">
                    <v-toolbar-title>Login</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-form>
                        <v-text-field name="login" label="User Name" type="text"></v-text-field>
                        <v-text-field id="password" name="password" label="Password" type="password"></v-text-field>
                        <v-radio-group v-model="loginType" inline>
                            <v-radio label="Admin" value="admin"></v-radio>
                            <v-radio label="Clerk" value="clerk"></v-radio>
                            <v-radio label="Delivery" value="delivery"></v-radio>
                        </v-radio-group>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" to="/">Login</v-btn>
                </v-card-actions>
            </v-card>
            <!-- <v-card class="rounded-lg mx-auto" max-width="600">
                <v-card-title class="headline mb-2 text-center">Login</v-card-title>
                <v-card-text>
                    <v-text-field v-model="user.email" label="Email*" :hint="emailInValid && 'Please enter valid email'"
                        @input="onEmailChange" required></v-text-field>

                    <v-text-field v-model="user.password" label="Password*" type="password" required></v-text-field>
                    <v-radio-group v-model="loginType" inline>
                        <v-radio label="User" value="user"></v-radio>
                        <v-radio label="Admin" value="admin"></v-radio>
                    </v-radio-group>
                </v-card-text>
                <v-card-actions>
                    <v-btn v-if="loginType == 'user'" variant="flat" color="secondary" @click="openCreateAccount()">Create
                        Account</v-btn>
                    <v-spacer></v-spacer>

                    <v-btn variant="flat" color="primary" :disabled="emailInValid || !user.email || !user.password"
                        @click="login()">Login</v-btn>
                </v-card-actions>
            </v-card> -->
        </div>
    </v-container>
</template>
<!-- <template>
    <v-app id="inspire">
       <v-content>
          <v-container fluid fill-height>
             <v-layout align-center justify-center>
                <v-flex xs12 sm8 md4>
                   <v-card class="elevation-12">
                      <v-toolbar dark color="primary">
                         <v-toolbar-title>Login form</v-toolbar-title>
                      </v-toolbar>
                      <v-card-text>
                         <v-form>
                            <v-text-field
                               prepend-icon="person"
                               name="login"
                               label="Login"
                               type="text"
                            ></v-text-field>
                            <v-text-field
                               id="password"
                               prepend-icon="lock"
                               name="password"
                               label="Password"
                               type="password"
                            ></v-text-field>
                         </v-form>
                      </v-card-text>
                      <v-card-actions>
                         <v-spacer></v-spacer>
                         <v-btn color="primary" to="/">Login</v-btn>
                      </v-card-actions>
                   </v-card>
                </v-flex>
             </v-layout>
          </v-container>
       </v-content>
    </v-app>
 </template> -->