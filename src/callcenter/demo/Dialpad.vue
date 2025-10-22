<template>
    <!-- PAGE DIAPAD -->
    <section id="page-diapad" class="w-100">
      <!-- Typing Number Section -->
      <div class="wrap-typing-number pl-15 pr-15 mt-10 mb-30 d-flex justify-content-between">
        <input
          type="text"
          v-model="typedNumber"
          placeholder="+84965890179"
          class="font-size-24 color-black border-none"
        />
        <button class="btn-close border-none bg-transparent" @click="clearTypedNumber">
          <img :src="closeIcon" />
        </button>
      </div>
  
      <!-- Dialpad Section -->
      <div class="wrap-diapad mb-10">
        <div class="diapad-row" v-for="(row, rowIndex) in dialpadKeys" :key="rowIndex">
          <button
            class="diapad-key"
            v-for="(key, keyIndex) in row"
            :key="keyIndex"
            @click="addToTypedNumber(key.number)"
          >
            <span class="diapad-key-number">{{ key.number }}</span>
            <span class="diapad-key-text">{{ key.text }}</span>
          </button>
        </div>
      </div>
  
      <!-- Call Using Dropdown -->
      <div class="wrap-call-using-dropdown position-relative" v-if="showDropdown">
        <div id="list-from-numbers" class="call-using-dropdown box-shadow3 border-radius-8 bg-white">
          <div
            class="call-using-dropdown-item cursor-pointer p-15 pt-10 pb-10"
            v-for="(number, index) in fromNumbers"
            :key="index"
            @click="selectFromNumber(number)"
          >
            <div>
              <span class="call-using-text-name display-block">{{ number.name }}</span>
              <span class="call-using-text-phone display-block">{{ number.phone }}</span>
            </div>
          </div>
        </div>
        <div class="icon-dropdown right-40"></div>
      </div>
  
      <!-- Call Using Section -->
      <div class="wrap-call-using pl-20 pr-20 position-relative cursor-pointer" @click="toggleDropdown">
        <div class="call-using-text mb-1">Sử dụng số</div>
        <div class="call-using-select p-15 d-flex justify-content-between">
          <div>
            <span id="from-number-callout-alias" class="call-using-text-name display-block">
              {{ selectedFromNumber.name }}
            </span>
            <span id="from-number-callout" class="call-using-text-phone display-block">
              {{ selectedFromNumber.phone }}
            </span>
          </div>
          <img :src="dropdownIcon" />
        </div>
      </div>
    </section>
  </template>
  
  <script>
  /* eslint-disable */
  import closeIcon from "@/callcenter/assets/stringee-widget/images/icon-close.svg";
  import dropdownIcon from "@/callcenter/assets/stringee-widget/images/icon-dropdown.svg";
  
  export default {
    name: "Dialpad",
    data() {
      return {
        closeIcon,
        typedNumber: "",
        showDropdown: false,
        selectedFromNumber: {
          name: "Number 1",
          phone: "+84899199586",
        },
        fromNumbers: [
          { name: "Number 1", phone: "+84899199586" },
          { name: "Number 2", phone: "+84966050926" },
        ],
        dialpadKeys: [
          [
            { number: "1", text: "" },
            { number: "2", text: "ABC" },
            { number: "3", text: "DEF" },
          ],
          [
            { number: "4", text: "GHI" },
            { number: "5", text: "JKL" },
            { number: "6", text: "MNO" },
          ],
          [
            { number: "7", text: "PQRS" },
            { number: "8", text: "TUV" },
            { number: "9", text: "WXYZ" },
          ],
          [
            { number: "*", text: "" },
            { number: "0", text: "+" },
            { number: "#", text: "" },
          ],
        ],
      };
    },
    methods: {
      addToTypedNumber(key) {
        this.typedNumber += key;
      },
      clearTypedNumber() {
        this.typedNumber = "";
      },
      toggleDropdown() {
        this.showDropdown = !this.showDropdown;
      },
      selectFromNumber(number) {
        this.selectedFromNumber = number;
        this.showDropdown = false;
      },
    },
  };
  </script>
  
  <style scoped lang="scss">
  @import "@/callcenter/assets/stringee-widget/css/all-style-1.0.0.css";
  
  /* Add additional styles here if needed */
  .diapad-key-number {
    height: 37px;
  }
  </style>