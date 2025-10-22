import { ref, reactive } from "vue"
import API from "@/helpers/api/useAxios.js";

const showModalAddStep = ref(false)

const setShowModalAddStep = (value, order_step) => {
  showModalAddStep.value = value
  if (order_step) formAddStep.order = order_step
}

const showModalFullScreenSteps = ref(false)

const setShowModalFullScreenSteps = (value) => {
  showModalFullScreenSteps.value = value
}

const formAddStep = reactive({
  workflow: "01d3e099-c1e1-41f0-891d-34e6c8603c6a",
  order: 5,
  name: "",
  description: "",
  approve_type: "",
  assignee_id: "",
  added_actions: "",
  is_disabled: false,
});

const addStepWorkflow = (form, then_fc = () => { }, err_fc = () => { }, final_fc = () => { }) => {
  API()
    .post("/workflow/step/", form, "Đã thêm mới", "Vui lòng kiểm tra lại")
    .then((response) => {
      if (response?.ok) {
        then_fc(response);
        resetFormAdd(); // Đặt lại form sau khi gửi thành công
      }
      final_fc();
    })
    .catch((error) => {
      err_fc(error);
      final_fc();
    });
};

const resetFormAdd = () => {
  formAddStep.workflow = "01d3e099-c1e1-41f0-891d-34e6c8603c6a";
  formAddStep.order = '';
  formAddStep.name = "";
  formAddStep.description = "";
  formAddStep.approve_type = "";
  formAddStep.assignee_id = "";
  formAddStep.added_actions = "";
  formAddStep.is_disabled = false;
};

export {
  showModalAddStep,
  setShowModalAddStep,
  showModalFullScreenSteps,
  setShowModalFullScreenSteps,
  formAddStep,
  addStepWorkflow,
  resetFormAdd
}
