import { reactive } from "vue"

const recordTreeNode = reactive({
    mode: 'view',
    idDepartment: null,
    departmentDetails: {}
})

export { recordTreeNode }