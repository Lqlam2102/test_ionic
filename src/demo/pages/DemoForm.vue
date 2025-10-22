<script>
import { useFetch } from "@/helpers/api/api.js";
import { inject } from "vue";
import Select from "@/base/components/select/Select.vue";
import DateInput from "@/base/components/date/date.vue";
import AccordionRecord from "@/base/components/accordion/AccordionRecord.vue";
import Photo from "@/base/components/photo/Photo.vue";
import Images from "@/base/components/photo/Images.vue";
import { usePost, usePatch } from "@/helpers/api/api.js";
import { errorToast, successToast } from "@/helpers/api/toastStyle.js";
import FormLoading from "@/base/components/form/builder/components/FormLoading.vue";
import MapLocation from "@/base/components/type_form_record/MapLocation.vue";
import Object3d from "@/base/components/object3d/Object3d.vue";
import TextEditor from "@/base/components/editor/TextEditor.vue";
export default {
    setup() {
        return {
            apiPath: "http://127.0.0.1:8000/api/notification/form/",
            manage_data: inject("manage-data"),
            successCode: [200, 201],
        };
    },
    data() {
        return {
            AUTOPASS_FIELDS: ["date", "text", "datetime"],
            formUrl: "http://127.0.0.1:8000/api/notification/form/",
            currentObjectId: "",
            formStructures: {},
            formStructuresAdd: [],
            isLoadingFormAdd: false,
            formStructuresEdit: [],
            isLoadingFormEdit: false,
            formStructuresView: [],
            isLoadingFormView: false,
            selectedPermissons: [],
            formsTemplate: [],
            formTypes: {
                text: "text",
                textarea: "textarea",
                texteditor: "text_editor",
                datetime: "datetime",
                date: "date",
                select: "select",
                image: "image",
                point: "point",
                polygon: "polygon",
                line: "line",
                object3d: "object3d",
            },
            dataTypes: {
                string: "string",
                string_separate: "string_separate",
                foreign_key: "foreign_key",
                json: "json",
                file: "file",
                multi_file: "multi_file",
                dynamic_file_or_foreign_key: "dynamic_file_or_foreign_key",
            },
        };
    },
    components: {
        Select,
        DateInput,
        AccordionRecord,
        FormLoading,
        Photo,
        Images,
        MapLocation,
        Object3d,
        TextEditor,
    },
    async mounted() {
        this.handleClickAdd();
    },
    methods: {
        compare: function (left, operator, right) {
            switch (operator) {
                case "==":
                    return left == right;
                case "===":
                    return left === right;
                case "!=":
                    return left != right;
                case "!==":
                    return left !== right;
                case ">":
                    return left > right;
                case "<":
                    return left < right;
                case ">=":
                    return left >= right;
                case "<=":
                    return left <= right;
                default:
                    throw new Error("Operator không hợp lệ");
            }
        },
        getHeads: function (separateCondition) {
            /*
            NOTE: Tìm vị trí attribute của điều khiện
                ">form-thong-tin-chu-the#>fields#-type.slug#&==#(ca-nhan)"
            GIẢI NGHĨA: sẽ phân tách theo # và các element bắt đầu bằng > sẽ là heads
            */
            let heads = separateCondition.filter((separate) =>
                separate.startsWith(">")
            );
            heads = heads.map((head) => head.substring(1));
            return heads;
        },
        getOperator: function (separateCondition) {
            /*
            NOTE: Tìm vị trí attribute của điều khiện
                ">form-thong-tin-chu-the#>fields#-type.slug#&==#(ca-nhan)"
            GIẢI NGHĨA: sẽ phân tách theo # và các element bắt đầu bằng & sẽ là điều kiện so sánh
            */
            let operator = separateCondition.find((separate) =>
                separate.startsWith("&")
            );
            return operator.substring(1);
        },
        getVariables: function (separateCondition) {
            /*
            NOTE: Tìm vị trí attribute của điều khiện
                ">form-thong-tin-chu-the#>fields#-type.slug#&==#(ca-nhan)"
            GIẢI NGHĨA: 
            leftVar sẽ phân tách theo # và element bắt đầu bằng - sẽ là biến so sánh trái
            rightVar sẽ phân tách theo # và element bắt đầu bằng ( và kết thúc bằng ) sẽ là dữ liệu so sánh phải
            */
            let leftVar = separateCondition.find((separate) =>
                separate.startsWith("-")
            );
            let rightVar = separateCondition.find(
                (separate) => separate.startsWith("(") && separate.endsWith(")")
            );
            return {
                leftVar: leftVar.substring(1),
                rightVar: rightVar ? rightVar.slice(1, -1) : "",
            };
        },
        locateStructure: function (heads, structures) {
            /*
            NOTE: Tìm vị trí attribute của điều khiện
            ["form-thong-tin-chu-the", "fields"]
            trường hợp này sẽ tìm element có id = form-thong-tin-chu-the và truy vấn trong fields
            [
            {
                "id":"form-thong-tin-chu-the",
                "title":"Thông tin chủ thể",
                "fields":[
                    {
                    ...
                    "field":"name",
                    ...
                    },
                    { 
                    ...
                    "field":"type",
                    ...
                    }
                ]
            },
            {
                ...
                "conditions":[
                    ...
                    ">form-thong-tin-chu-the#>fields#-type.slug#&==#(ca-nhan)"
                    ...
                ]
                ...
            ]
            */
            const formId = heads[0];
            const formAttr = heads[1];
            let form = structures.find((item) => item.id === formId);
            const attribute = form[formAttr];
            return attribute;
        },
        getValueLeftVar: function (leftVar, attribute) {
            const separateVar = leftVar.split(".");
            let fieldValue = null;
            /*
            NOTE: element đầu tiên trong mảng separateVar chính là tên của field cần lấy giá trị
                  các element tiếp theo được mặc định là subFields hay là truy vấn sâu
            
            VÍ DỤ: trường type có giá trị như sau : 
            "type": {
                "id":"2ea6442f-dd8e-438d-b0c0-e491c3aace78",
                "created_date":"2024-08-15T03:51:00Z",
                "updated_date":"2024-08-15T03:51:00Z",
                "is_active":true,
                "name":"Cá nhân",
                "slug":"ca-nhan"
            }
            VÀ TRUY VẤN CỦA NGƯỜI DÙNG LÀ type.slug == (ca-nhan)
            => Khi đó sẽ lấy attribute slug của trường type để truy vấn 
            */
            if (separateVar.length) {
                const fieldName = separateVar[0];
                const field = attribute.find((attr) => attr["field"] == fieldName);
                fieldValue = field["value"];
            }
            // TRUY VẤN SÂU
            if (fieldValue && separateVar.length > 1) {
                const subFields = separateVar.slice(1);
                subFields.forEach((field) => {
                    fieldValue = fieldValue[field];
                });
            }
            return fieldValue;
        },
        isSatisfyConditions: function (conditions, structures) {
            let isSatisfy = true;
            if (conditions) {
                conditions.forEach((condition) => {
                    const separateCondition = condition.split("#");
                    const heads = this.getHeads(separateCondition);
                    const operator = this.getOperator(separateCondition);
                    const varsCheck = this.getVariables(separateCondition);
                    const attribute = this.locateStructure(heads, structures);
                    const leftValue = this.getValueLeftVar(
                        varsCheck["leftVar"],
                        attribute
                    );
                    const rightValue = varsCheck["rightVar"];
                    isSatisfy = this.compare(leftValue, operator, rightValue);
                });
            }
            return isSatisfy;
        },
        getFieldPlaceholder: function (field) {
            let placeholder = field.placeholder
                ? field.placeholder
                : `Nhập ${field?.name?.toLowerCase()}`;
            if (field?.form_type == "select")
                placeholder = field.placeholder
                    ? field.placeholder
                    : `Chọn ${field?.name?.toLowerCase()}`;
            return placeholder;
        },
        getTheFieldRef: function (field, structure) {
            return structure?.id + field?.field;
        },
        focusToField: function (ref) {
            return ref;
        },
        isSatisfyFormRequires: function (structures) {
            let isSatisfied = true;
            console.log("ACB");
            structures.forEach((structure) => {
                // Nếu block này không thỏa mãn điều kiện thì không cần check (giống như việc nếu họ chọn type là cá nhân thì các phần type là
                // Đơn vị phòng ban và Công ty không cần nhập thông tin)
                if (!this.isSatisfyConditions(structure.conditions, structures)) return;
                structure?.fields?.forEach((field) => {
                    if (field?.require && !field.value) {
                        const theFieldRef = this.getTheFieldRef(field, structure);
                        this.focusToField(theFieldRef);
                        const errorMsg = "Vui lòng " + this.getFieldPlaceholder(field);
                        errorToast(errorMsg);
                        isSatisfied = false;
                    }
                });
            });
            return isSatisfied;
        },
        convertStringPointToPoint: function (stringPoint) {
            const [lat, lng] = stringPoint.split(", ").map(Number);
            return { lat, lng };
        },
        buildData: function (field) {
            let isPassed = true;
            let data = field.value;
            // Nếu dữ liệu rõng thì trả về không thực hiện kiểm tra nữa
            if (!data) return data;
            // Kiểm tra form select
            // Mặc định form select đã sử dụng TreeSelect hoặc SelectInput component nên dữ liệu sẽ được thống nhất theo 1 kiểu
            else if (field.form_type == this.formTypes.select) {
                if (field.multiple) {
                    data = JSON.stringify(
                        data.map((d) => {
                            return { id: d.id };
                        })
                    );
                } else {
                    data = field?.value?.id;
                }
            } else if (this.AUTOPASS_FIELDS.includes(field.form_type)) {
                if (field.data_type == this.dataTypes.string_separate) {
                    data = JSON.stringify(
                        data.split(",").map((separate) => separate.trim())
                    );
                }
            } else if (
                field.form_type == this.formTypes.image ||
                field.form_type == this.formTypes.object3d
            ) {
                if (field.data_type == this.dataTypes.dynamic_file_or_foreign_key) {
                    if (data?.id) data = data.id;
                    else if (typeof data === "string" || data instanceof String) {
                        isPassed = false;
                    }
                } else {
                    // Trường hợp ảnh được thêm và tiến hành chỉnh sửa thì dữ liệu ảnh sẽ trả về dưới dạng string
                    // Nếu người dùng không thay đổi ảnh thì dữ liệu vẫn là string trường hợp này không cần đẩy lại field này
                    // Khi đẩy lên sẽ bị lỗi ảnh
                    if (typeof data === "string" || data instanceof String) {
                        isPassed = false;
                    }
                }
            } else if (field.form_type == this.formTypes.point) {
                if (field.data_type == this.dataTypes.json) {
                    data = JSON.stringify(this.convertStringPointToPoint(data));
                }
            }
            return {
                accept: isPassed,
                data: data,
            };
        },
        buildFormData: function (structures) {
            if (!this.isSatisfyFormRequires(structures)) return false;
            const formData = new FormData();
            structures.forEach((structure) => {
                // Nếu block này không thỏa mãn điều kiện thì không cần check (giống như việc nếu họ chọn type là cá nhân thì các phần type là
                // Đơn vị phòng ban và Công ty không cần nhập thông tin)
                if (!this.isSatisfyConditions(structure.conditions, structures)) return;
                structure?.fields?.forEach((field) => {
                    if (field?.value) {
                        const buildData = this.buildData(field);
                        const FORM_FILE_FIELDS = [this.formTypes.image];
                        if (buildData.accept) {
                            if (FORM_FILE_FIELDS.includes(field.form_type)) {
                                if (
                                    field.data_type == this.dataTypes.multi_file ||
                                    field.multiple
                                ) {
                                    buildData.data.forEach((file) => {
                                        formData.append(field.field, file);
                                    });
                                } else {
                                    formData.append(field.field, buildData.data);
                                }
                            } else {
                                formData.append(field.field, buildData.data);
                            }
                        }
                    }
                });
            });
            return formData;
        },
        setFormsStructures: function () {
            this.formsTemplate = [
                {
                    head: {
                        id: "add",
                        name: "Thêm mới",
                        btns: [
                            {
                                name: "Thêm mới",
                                icon: "ri-save-2-fill",
                                class: "btn btn-warning btn-icon waves-effect waves-light",
                                click: ($e, structures) => this.handleAdd(structures),
                            },
                            {
                                name: "Làm mới",
                                icon: "las la-undo-alt",
                                class: "btn btn-danger btn-icon waves-effect waves-light",
                                click: () => this.handleClickAdd(),
                            },
                        ],
                    },
                    body: {
                        isLoading: this.isLoadingFormAdd,
                        structures: this.formStructuresAdd,
                    },
                },
                {
                    head: {
                        id: "update",
                        name: "Chỉnh sửa",
                        btns: [
                            {
                                name: "Chỉnh sửa",
                                icon: "ri-save-2-fill",
                                class: "btn btn-warning btn-icon waves-effect waves-light",
                                click: ($e, structures) => this.handEdit(structures),
                            },
                            {
                                name: "Làm mới",
                                icon: "las la-undo-alt",
                                class: "btn btn-danger btn-icon waves-effect waves-light",
                                click: () => {
                                    this.handleClickEdit(this.currentObjectId);
                                },
                            },
                        ],
                    },
                    body: {
                        isLoading: this.isLoadingFormEdit,
                        structures: this.formStructuresEdit,
                    },
                },
                {
                    head: {
                        id: "view",
                        name: "Xem chi tiết",
                        btns: [
                            {
                                name: "Chỉnh sửa",
                                icon: "las la-edit",
                                type: "offcanvas",
                                dataBsTarget: "update",
                                class: "btn btn-warning btn-icon waves-effect waves-light",
                                click: () => {
                                    this.handleClickEdit(this.currentObjectId);
                                },
                            },
                            {
                                name: "Xóa bản ghi",
                                icon: "ri-delete-bin-5-line",
                                class: "btn btn-danger btn-icon waves-effect waves-light",
                                click: () => this.handleDelete(),
                            },
                        ],
                    },
                    body: {
                        isLoading: this.isLoadingFormView,
                        structures: this.formStructuresView,
                    },
                },
            ];
        },
        handleClickAdd: async function () {
            this.isLoadingFormAdd = true;
            this.setFormsStructures();
            await useFetch(this.formUrl + `add/`).then((data) => {
                if (!data?.length) return;
                data.forEach((structure, index) => {
                    this.formStructuresAdd[index] = structure;
                });
            });
            this.isLoadingFormAdd = false;
            this.setFormsStructures();
        },
        handleClickEdit: async function (objectId) {
            this.currentObjectId = objectId;
            this.isLoadingFormEdit = true;
            this.setFormsStructures();
            await useFetch(this.formUrl + `update/?id=${objectId}`).then((data) => {
                console.log(data);
                data.forEach((structure, index) => {
                    this.formStructuresEdit[index] = structure;
                });
            });
            this.isLoadingFormEdit = false;
            this.setFormsStructures();
        },
        handleClickView: async function (objectId) {
            this.currentObjectId = objectId;
            this.isLoadingFormView = true;
            this.setFormsStructures();
            await useFetch(this.formUrl + `view/?id=${objectId}`).then((data) => {
                data.forEach((structure, index) => {
                    this.formStructuresView[index] = structure;
                });
            });
            this.isLoadingFormView = false;
            this.setFormsStructures();
        },
        handleAdd: function (structures) {
            const formData = this.buildFormData(structures);
            if (formData == false) return;
            usePost(this.apiPath, formData).then((res) => {
                if (this.successCode.includes(res.status)) {
                    successToast("Thêm thành công!");
                } else {
                    errorToast("Thêm thất bại, vui lòng thử lại sau!");
                }
                this.manage_data.handleCallApi();
            });
        },
        handEdit: function (structures) {
            const formData = this.buildFormData(structures);
            if (formData == false) return;
            usePatch(this.apiPath + `/${this.currentObjectId}`, formData).then(
                async (res) => {
                    if (this.successCode.includes(res.status)) {
                        successToast("Cập nhật thành công!");
                    } else {
                        errorToast("Cập nhật thất bại, vui lòng thử lại sau!");
                    }
                    this.handleClickEdit(this.currentObjectId);
                    this.manage_data.handleCallApi();
                }
            );
        },
        handleDelete: function () {
            const objectId = { id: this.currentObjectId };

            this.manage_data.handleDelete(objectId);
        },
    },
};
</script>

<template>
    <template v-if="!formsTemplate[0].form.body.isLoading">
        <form action="#">
            <template v-for="(structure, index) in form.body.structures" :key="index">
                <AccordionRecord :title="structure.title.toUpperCase()" v-if="
                    isSatisfyConditions(structure.conditions, form.body.structures)
                ">
                    <b-row>
                        <b-col :lg="field.col" class="mb-3" v-for="(field, indexField) in structure.fields"
                            :key="indexField">
                            <label :for="getTheFieldRef(field, structure)" class="form-label mb-1">{{ field.name }}
                                <span class="text-danger" v-if="field.require">*</span>
                            </label>
                            <template v-if="field.form_type == formTypes.text">
                                <input type="text" class="form-control" :id="getTheFieldRef(field, structure)"
                                    :disabled="field.disable" :ref="getTheFieldRef(field, structure)"
                                    :placeholder="getFieldPlaceholder(field)" v-model="field.value" />
                            </template>
                            <template v-else-if="field.form_type == formTypes.textarea">
                                <textarea class="form-control" :ref="getTheFieldRef(field, structure)"
                                    :id="getTheFieldRef(field, structure)" :disabled="field.disable"
                                    :placeholder="getFieldPlaceholder(field)" v-model="field.value"></textarea>
                            </template>
                            <template v-else-if="field.form_type == formTypes.texteditor">
                                <TextEditor v-model="field.value" :data="field.value" :disable="field.disable">
                                </TextEditor>
                            </template>
                            <template v-else-if="field.form_type == formTypes.select">
                                <Select :api="field.source" :isLocalSearch="!field.source" :localData="field.init_data"
                                    :multiSelect="field.multiple" :id="getTheFieldRef(field, structure)"
                                    :ref="getTheFieldRef(field, structure)" :defaultValue="field.value"
                                    :label="field.search_field" :searchField="field.search_field"
                                    :labelField="field.search_field" :isCloseOnSelect="true"
                                    :defaultValueLabel="getFieldPlaceholder(field)" :disable="field.disable"
                                    :showIcon="field.show_icon" iconFiled="name"
                                    @change-data="(data) => (field.value = data)">
                                </Select>
                            </template>
                            <template v-else-if="field.form_type == formTypes.date">
                                <DateInput :placeholder="getFieldPlaceholder(field)"
                                    :ref="getTheFieldRef(field, structure)" :id="getTheFieldRef(field, structure)"
                                    v-model="field.value" :disabled="field.disable">
                                </DateInput>
                            </template>
                            <template v-else-if="field.form_type == formTypes.image">
                                <template v-if="field.data_type == dataTypes.multi_file">
                                    <Images v-model="field.value" :disable="field.disable" :images="field.value"
                                        @onDeleteImage="handleClickEdit(currentObjectId)"
                                        :id="getTheFieldRef(field, structure)" :source="field.source">
                                    </Images>
                                </template>
                                <template v-else>
                                    <Photo :id="getTheFieldRef(field, structure)" :currentPhoto="field.value"
                                        v-model="field.value" :label="field.name" :disable="field.disable"
                                        :gallery="field.gallery" :dynamic_pick="field.data_type ==
                                            dataTypes.dynamic_file_or_foreign_key
                                            ">
                                    </Photo>
                                </template>
                            </template>
                            <template v-else-if="field.form_type == formTypes.point">
                                <MapLocation v-model="field.value" :disable="field.disable"></MapLocation>
                            </template>
                            <template v-else-if="field.form_type == formTypes.object3d">
                                <Object3d :id="getTheFieldRef(field, structure)" v-model="field.value"
                                    :disable="field.disable" :currentObject="field.value"></Object3d>
                            </template>
                            <template v-else>
                                <input type="text" class="form-control" :ref="getTheFieldRef(field, structure)"
                                    :placeholder="getFieldPlaceholder(field)" :id="getTheFieldRef(field, structure)"
                                    v-model="field.value" :disabled="field.disable" />
                            </template>
                        </b-col>
                    </b-row>
                </AccordionRecord>
            </template>
        </form>
    </template>
    <template v-else>
        <FormLoading></FormLoading>
    </template>
</template>
