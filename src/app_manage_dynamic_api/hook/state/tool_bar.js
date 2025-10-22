// Đối tượng thanh công cụ là 1 thành phần nhỏ của trang quản lý
// Chức năng: tạo ra 1 đối tượng mới lưu trữ dữ liệu reactive cho thanh công cụ quản lý
// Khởi tạo mới trong mange_data và xử lý sự kiệm trong đó
// Không gọi API ở đây. Dữ liệu sẽ được gọi trong mange_data, chỉ có 1 api config cho app

import { reactive, ref } from "vue";
import TableView from "../../components/type_view/TableView.vue";
import CardView from "../../components/type_view/CardView.vue";
import API from "../../helper/api/useAxios.js";
import { DownloadAttachment } from "../../common/common.js";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { errorToast } from "@/helpers/api/toastStyle";
import Swal from "sweetalert2";
import { SERVER_URL } from "@/helpers/utils/config_system.js";

const toastId = ref("");
const notify = (title = "Đang tiến hành kiểm tra") =>
(toastId.value = toast.loading(title, {
  autoClose: false,
  transition: toast.TRANSITIONS.SLIDE,
  position: toast.POSITION.BOTTOM_RIGHT,
  icon: false,
}));
const close = () => {
  toast.remove(toastId.value);
};
const setTypeView = (
  title,
  classIcon,
  component,
  active = false,
  props = {}
) => {
  return {
    type: title,
    icon: classIcon,
    component: component,
    active: active,
    props: props,
  };
};

class tool_bar {
  constructor() {
    this.data = reactive({
      filters: {
        search: "",
        params: [],
      },
      path: '',
      quickSearch: [],
      fieldFilter: [],
      columnFilter: [],
      features: [],
      typeView: [
        setTypeView("card", "las la-list", CardView),
        setTypeView("table", "las la-th-list", TableView, true),
      ],
      actions: {
        default: [],
        more: [],
      },
      export: [],
      delete: [],
      showModalFilter: {
        value: false,
      },
    });
  }

  listDataManage() { return []; }

  getData() {
    return {
      data: {
        ...this.data,
      },
    };
  }

  getTypeViewActive() {
    return this.data.typeView.filter((item) => item.active === true)[0];
  }

  setTypeViewActive(_index) {
    this.data.typeView = this.data.typeView.map((item) => {
      item.active = false;
      return item;
    });
    this.data.typeView[_index].active = true;
  }

  setActions(ACTIONS) {
    this.data.actions.default.length = 0;
    if (!ACTIONS?.default?.length) return;
    const setAction = (name, class_icon, show = true, handle = () => { }) => {
      switch (name) {
        case "Xóa theo mục đã chọn":
          handle = this.data.delete[0].handle;
          break;
        default:
      }
      return { name: name, icon: class_icon, show: show, handle: handle };
    };
    this.data.actions.default = ACTIONS.default.map((item) => {
      return setAction(item.name, item.icon, item.permission, () => { this.handleExport(item) });
    });
  }

  setFilters(FILTERS) {
    this.data.filters.search = "";
    this.data.filters.params.length = 0;
    console.log(FILTERS);
    if (!FILTERS.length) return;
    const setFilter = (name, params, type = "text", selected = false) => {
      return {
        name: name,
        params: params,
        type: type,
        selected: selected,
        value: [],
      };
    };
    this.data.filters.params = FILTERS.map((item) => {
      return setFilter(item.name, item.params, item.type);
    });
  }

  setFieldFilter(FILTERS) {
    this.data.fieldFilter.length = 0;
    if (!FILTERS?.length) return;
    FILTERS.map((field) => {
      this.data.fieldFilter.push({
        ...field,
        name: field["name"],
        params: field["params"],
        type: field.type,
        selected: false,
        value: [],
      });
    });
  }

  setHandleAction(path, data, selfManageClass) {
    this.data.path = path;
    this.listDataManage = () => {
      const { data } = selfManageClass.getData()
      return data;
    };
    this.data.export.length = 0;
    this.data.delete.length = 0;
    const setItem = (name, icon, handle = () => { }) => {
      return { name: name, icon: icon, handle: handle };
    };
    this.data.delete.push(
      setItem("Đã chọn", "mdi mdi-shape-plus", async () => {
        let arrValue = [];
        if (data.results.length) {
          arrValue = data.results.filter((item) => {
            return item.checked;
          });
        }
        if (!arrValue.length) {
          errorToast("Vui lòng chọn những mục bạn muốn xoá");
          return;
        }
        const result = await Swal.fire({
          title: `Bạn có muốn xoá ${arrValue.length} mục không?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Đồng ý",
          cancelButtonText: "Không",
        });
        if (!result.isConfirmed) {
          return;
        }
        let _success = 0;
        let _error = 0;
        // Tạo một mảng chứa các promise từ việc gọi API
        const apiPromises = arrValue.map(async (element) => {
          try {
            const res = await API().remove(`/${path}/${element?.id}/`);
            if (res?.instance?.id) {
              _success++;
            } else {
              _error++;
            }
          } catch (error) {
            _error++;
          }
        });

        try {
          // Đợi cho tất cả các promise hoàn thành
          await Promise.all(apiPromises);

          if (_success) {
            Swal.fire("Deleted!", `Bạn đã xoá ${_success} mục`, "success");
          }
          if (_error) {
            errorToast(`Xoá thất bại ${_error} mục`);
          }
          selfManageClass.handleCallApi();
        } catch (error) {
          errorToast("Xoá thất bại");
        }
      })
    );
  }

  setQuickSearch(quickSearch) {
    this.data.quickSearch.length = 0;
    if (!quickSearch) return;
    if (quickSearch?.length === 0) return;
    quickSearch.map((item) => {
      this.data.quickSearch.push(item);
    });
  }
  setColumnFilter(columnFilter) {
    console.log(columnFilter);
    this.data.columnFilter.length = 0;
    if (
      columnFilter === undefined ||
      columnFilter === null ||
      columnFilter === ""
    )
      return;

    columnFilter.map((column) => {
      if (column?.isForce) {
        let data = column.searchValue;
        if (typeof data[0] == typeof []) {
          data.forEach((filter) => this.data.columnFilter.push(filter));
        } else {
          this.data.columnFilter.push(data);
        }
      } else {
        const data = [
          column?.searchField,
          column?.searchOperater,
          column?.searchValue,
        ];
        if (column?.searchValue === "") return;
        this.data.columnFilter.push(data);
      }
    });
  }

  setFeatures(features) {
    this.data.features.length = 0;
    features?.forEach((element) => {
      this.data.features.push(element);
    });
  }

  async handleExport(item, path = this.data.path, data = this.listDataManage()) {
    /**
    * Hàm xử lý xuất file Excel từ hành động được cấu hình động
    * @param item - cấu hình hành động export
    * @param path - base path API (ví dụ "worker")
    * @param data - danh sách dữ liệu hiện tại để lọc mục đã chọn
    */

    notify();
    let query = "";
    if (item.params) {
      const ids = data?.results
        ?.filter((el) => el.checked)
        .map((el) => el.id)
        .join(",");

      if (!ids) {
        await close();
        return; // hoặc show toast: "Chưa chọn mục nào để xuất"
      }

      query = `?${item.params}=${ids}`;
    }

    await DownloadAttachment(`${SERVER_URL}/api/${path}/${item.api}/${query}`);
    close();
  }

}
export default tool_bar;
