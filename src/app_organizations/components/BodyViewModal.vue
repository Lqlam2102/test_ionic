<template>
  <AccordionInfor :title="`PHÒNG BAN: ${department.name}`">
    <div class="ps-3">
      <table class="table table-borderless ps-3 mb-3">
        <tbody>
          <!-- <tr>
            <td class="col-4 ps-0 text-muted" scope="row">ID:</td>
            <th>{{ department.id }}</th>
          </tr> -->
          <tr>
            <td class="col-4 ps-0 text-muted" scope="row">Mã:</td>
            <th>{{ department.code }}</th>
          </tr>
          <tr>
            <td class="col-4 ps-0 text-muted" scope="row">Tên đầy đủ:</td>
            <th>{{ department.name }}</th>
          </tr>
          <tr>
            <td class="col-4 ps-0 text-muted" scope="row">Tên viết tắt:</td>
            <th>{{ department.short_name }}</th>
          </tr>
          <tr>
            <td class="col-4 ps-0 text-muted" scope="row">Ngày tạo:</td>
            <th>{{ formatDate(department.created_date) }}</th>
          </tr>
          <tr>
            <td class="col-4 ps-0 text-muted" scope="row">Ngày cập nhật:</td>
            <th>{{ formatDate(department.updated_date) }}</th>
          </tr>
        </tbody>
      </table>
    </div>
  </AccordionInfor>

  <AccordionInfor title="TRƯỞNG PHÒNG">
    <div class="ps-3">
      <div class="row">
        <div class="col-4">
          <img
            class="d-block w-100 rounded-circle"
            :src="department.department_head?.photo"
            alt="Avatar"
          />
        </div>
        <div class="col">
          <div class="card-block">
            <p>
              <strong
                >{{ department.department_head.first_name }}
                {{ department.department_head.last_name }}</strong
              >
            </p>
            <p>{{ department.department_head.username }}</p>
            <p>
              Ngày tham gia:
              {{ formatDate(department.department_head.date_joined) }}
            </p>
            <br />
            <a href="#" class="btn btn-primary btn-sm float-right">Xem Thêm</a>
          </div>
        </div>
      </div>
    </div>
  </AccordionInfor>
</template>

<script setup>
import { ref } from "vue";
import AccordionInfor from "@/base/components/accordion/AccordionRecord.vue";
import { ID_ORGANIZATION } from "@/helpers/utils/config_system";
const department = ref({
  id: "30d3809e-a009-4f95-9878-e6dcf3c4cafd",
  users: [],
  tree_path: "/30d3809e-a009-4f95-9878-e6dcf3c4cafd/",
  created_date: "2025-02-10T07:52:35.579480Z",
  updated_date: "2025-02-11T07:10:20.408408Z",
  is_deleted: false,
  code: "demo",
  name: "Thêm thử nghiệm",
  short_name: "demo",
  description: null,
  phone_number: null,
  fax: null,
  email: null,
  address: null,
  missions: null,
  owner: null,
  department_head: {
    id: "430526cb-e2fd-4b51-9455-6e408720168d",
    username: "lam",
    first_name: "Lâm",
    last_name: "Lê Quý",
    user_role: null,
    photo: "/media/photos/avatar-1.jpg",
    date_joined: "2025-02-10T04:50:15.612425Z",
  },
  parent: null,
  organization: ID_ORGANIZATION,
  department_level: null,
  created_by: null,
  updated_by: null,
});

const formatDate = (isoString) => {
  const date = new Date(isoString);
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;
};
</script>
