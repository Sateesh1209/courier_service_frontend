import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useGlobalStore = defineStore("dataStore", () => {
  const snackBar = ref({
    value: false,
    color: "",
    text: "",
  });
  // function setSnackBar(payload) {
  //   snackBar.value = {
  //     value: payload.value,
  //     color: payload.color,
  //     text: payload.text,
  //   };
  // }
  // const name = ref("Eduardo");
  // const doubleCount = computed(() => count.value * 2);
  // function increment() {
  //   count.value++;
  // }

  return { snackBar };
  // state: () => ({
  //   // Define your state variables here
  //   snackBar: { value: false, color: "", text: "" },
  // }),
  // actions: {
  //   // Define your actions here
  //   setSnackBar(snackBar) {
  //     this.setSnackBar = {
  //       value: snackBar.value,
  //       color: snackBar.color,
  //       text: snackBar.text,
  //     };
  //   },
  //   getSnackBar() {
  //     return this.snackBar;
  //   },
  //   closeSnackBar() {
  //     this.setSnackBar = {
  //       value: "",
  //       color: "",
  //       text: "",
  //     };
  //   },
  // },
});
