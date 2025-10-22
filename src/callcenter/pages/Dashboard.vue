<script>
import Layout from "@/app_manage_dynamic_api/layout/main.vue";
import CallDashboard from "../components/CallDashboard.vue";
export default {
    components: { Layout, CallDashboard}
}
</script>

<template>
  <Layout
    :address="{ title: 'Trung tâm cuộc gọi / Dashboard' }"
    chooseMenu="ban-do"
  >
    <div class="chat-wrapper gap-xl-1 mx-n4 p-1 h-100 d-flex flex-column">
      <div
        class="card mb-0 flex-grow-1 position-relative"
        style="overflow: hidden auto"
      >
        <div class="card-body container-fluid">
          <div class="row">
            <CallDashboard></CallDashboard>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
