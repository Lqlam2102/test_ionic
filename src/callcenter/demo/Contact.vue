<template>
    <!-- PAGE CONTACT -->
    <section id="page-contact" class="w-100">
      <!-- Contact Filter -->
      <div class="wrap-contact-filter p-l-r-20 mb-20 display-table">
        <div class="contact-filter display-flex font-size-12">
          <button
            class="contact-filter-item active p-1 p-l-r-10 mr-10 mt-1 border-none"
            @click="filterContacts('all')"
          >
            Tất cả
          </button>
          <button
            class="contact-filter-item p-1 p-l-r-10 mt-1 border-none"
            @click="filterContacts('group')"
          >
            Nhóm
          </button>
        </div>
        <div class="wrap-input-search">
          <input
            type="text"
            id="inputSearchContact"
            class="input-search position-absolute font-size-18 pl-15 right-0 top-0 display-none border-none outline-none"
            v-model="searchQuery"
            placeholder="Tìm kiếm liên hệ"
          />
          <button
            id="btnSearchContact"
            class="bg-transparent border-none position-absolute btn-finter-search right-15 top-5 p-10 outline-none cursor-pointer"
          >
            <img class="pointer-events-none" :src="searchIcon" />
          </button>
        </div>
      </div>
  
      <div class="line-dotted"></div>
  
      <!-- Contact List -->
      <div class="wrap-contact-list">
        <div class="wrap-contact-list-content">
          <div
            class="wrap-contact-group display-flex pl-15 pt-20"
            v-for="(group, groupIndex) in filteredContacts"
            :key="groupIndex"
          >
            <div class="contact-group-name">
              {{ group.letter }}
            </div>
            <div class="contact-group-item width-100-percent">
              <div
                class="contact-item display-flex"
                v-for="(contact, contactIndex) in group.contacts"
                :key="contactIndex"
              >
                <button
                  class="wrap-contact-item-avatar border-radius-12 width-35 height-35 text-center"
                  :class="contact.statusClass"
                >
                  <span class="contact-item-avatar">
                    <img :src="userIcon" />
                  </span>
                  <span class="contact-item-status" :class="contact.status"></span>
                </button>
                <div class="wrap-contact-item-info">
                  <div class="contact-item-name">
                    {{ contact.name }}
                  </div>
                  <div class="contact-item-phone">
                    {{ contact.phone }}
                  </div>
                  <div class="contact-item-call visibility-hidden">
                    <button
                      class="btn-round btn-green btn-call-item display-table-cell border-none cursor-pointer"
                      @click="callContact(contact)"
                    >
                      <img :src="phoneIcon" class="icon" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  /* eslint-disable */
  import searchIcon from "@/callcenter/assets/stringee-widget/images/icon-search.svg";
  import userIcon from "@/callcenter/assets/stringee-widget/images/icon-user.svg";
  import phoneIcon from "@/callcenter/assets/stringee-widget/images/icon-phone.svg";
  
  export default {
    name: "Contact",
    data() {
      return {
        searchQuery: "",
        contacts: [
          {
            letter: "A",
            contacts: [
              {
                name: "Pattrick Penna",
                phone: "Stringee",
                status: "status-offline",
                statusClass: "bg-purple",
              },
              {
                name: "Pattrick Penna",
                phone: "Stringee",
                status: "status-online",
                statusClass: "bg-light-green",
              },
              {
                name: "Pattrick Penna",
                phone: "Stringee",
                status: "status-offline",
                statusClass: "bg-light-blue",
              },
            ],
          },
          {
            letter: "B",
            contacts: [
              {
                name: "Pattrick Penna",
                phone: "Stringee",
                status: "status-offline",
                statusClass: "bg-purple",
              },
              {
                name: "Pattrick Penna",
                phone: "Stringee",
                status: "status-online",
                statusClass: "bg-light-green",
              },
              {
                name: "Pattrick Penna",
                phone: "Stringee",
                status: "status-offline",
                statusClass: "bg-light-blue",
              },
            ],
          },
          {
            letter: "C",
            contacts: [
              {
                name: "Pattrick Penna",
                phone: "Stringee",
                status: "status-offline",
                statusClass: "bg-purple",
              },
            ],
          },
        ],
      };
    },
    computed: {
      filteredContacts() {
        if (!this.searchQuery) {
          return this.contacts;
        }
        return this.contacts.map((group) => {
          const filteredGroup = {
            letter: group.letter,
            contacts: group.contacts.filter((contact) =>
              contact.name.toLowerCase().includes(this.searchQuery.toLowerCase())
            ),
          };
          return filteredGroup.contacts.length > 0 ? filteredGroup : null;
        }).filter(Boolean);
      },
    },
    methods: {
      filterContacts(type) {
        console.log(`Filter contacts by: ${type}`);
        // Add logic to filter contacts by type (e.g., all, group)
      },
      callContact(contact) {
        console.log(`Calling ${contact.name}`);
        // Add logic to initiate a call
      },
    },
  };
  </script>
  
  <style scoped lang="scss">
  @import "@/callcenter/assets/stringee-widget/css/all-style-1.0.0.css";
  
  /* Add additional styles here if needed */
  </style>