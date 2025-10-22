import { reactive } from "vue";
import Swal from "sweetalert2";
import API from "../../helper/api/useAxios.js";
import { errorToast } from "@/helpers/api/toastStyle";
import tool_bar from "./tool_bar.js";
import { swapArr } from "../../common/common.js";
import { base64Encode } from "@/helpers/utils/stringHandle.js";

const setTable = (name, key, show = true, sort = false, searchField, classes) => {
  let tempCol = { name: name, key: key, show: show, searchField: searchField, classes: classes };
  if (sort) {
    tempCol.sort = {
      selector: key,
      desc: false,
      active: false,
    };
  } else {
    tempCol.sort = false;
  }
  return tempCol;
};

function separateData(data, searchableTypes = ["text", "number"]) {
  const search = [];
  const filters = [];

  data.forEach((item) => {
    if (searchableTypes.includes(item.type)) {
      search.push(item);
    } else {
      filters.push(item);
    }
  });

  return { search, filters };
}
var RESTABLE = [];
const ClassToolBar = new tool_bar();

class manage_data {
  constructor(path, param = "") {
    // Tách đường dẫn và chuỗi tham số
    const [pathPart, paramPart] = path.split("?");

    // Lấy đường dẫn chính
    this.CONSTPATH = pathPart.split("?")[0];

    // Lấy tham số
    if (paramPart) {
      this.PARAM = paramPart;
    } else {
      this.PARAM = param;
    }

    // this.PARAM = `${param}`;
    // this.CONSTPATH = path;
    // khai báo mặc định cho dữ liệu api
    this.data = reactive({
      results: [],
      total_pages: 1,
      current_page_number: 1,
      total_objects: 0,
      isLoading: true,
      checkedAll: false,
      loadedPreload: false,
    });
    ClassToolBar.setHandleAction(path, this.data, this);

    const { data: toolBar } = ClassToolBar.getData();
    this.toolBar = toolBar;
    this.init()
  }
  async init() {
    try {
      this.data.loadedPreload = false;
      const res = await API().get(`${this.CONSTPATH}/preload/${this.PARAM ? `?${this.PARAM}` : ""}`);
      if (!res) return;

      RESTABLE = res.attributes.map((item) =>
        setTable(item.name, item.path, item?.show, item?.sort, item.search_field, item.classes)
      );
      this.attribute = reactive(RESTABLE);

      const tempsearch_ = separateData(res.search);
      this.searchFields = res.search;
      this.columnSearch = [];
      console.log("ÂC")

      ClassToolBar.setActions(res.actions);
      ClassToolBar.setFilters(tempsearch_.search);
      ClassToolBar.setFieldFilter(tempsearch_.filters);
      ClassToolBar.setQuickSearch(res.quick_search);
      ClassToolBar.setFeatures(res?.features)
      ClassToolBar.setColumnFilter([])
    } finally {
      this.data.loadedPreload = true;
    }
  }

  getData() {
    return {
      data: this.data,
      toolbar: { ...this.toolBar },
      attribute: this.attribute,
    };
  }

  getSearchFields() {
    return this.searchFields;
  }
  setParam(param) {
    this.PARAM = param;
  }

  async handleCallApi(patch_api = this.CONSTPATH, param = this.PARAM) {
    if (!this.data.loadedPreload) {
      setTimeout(() => {
        this.handleCallApi();
      }, 200);
      return;
    }
    this.data.isLoading = true;
    this.data.checkedAll = false;
    let res = await API().get(
      `${patch_api}/?per_page=${this.data.per_page ?? 10}&page=${this.data.current_page_number
      }${this.convertParamsEncode64("sort")}${this.convertParamsEncode64(
        "filter"
      )}&${param}`
    );
    if (res?.message) {
      errorToast(res.message);
      this.data.isLoading = false;
      return;
    }
    if (!res?.results) {
      res = { ...res, results: [] };
    }
    this.data.results = res.results.map((item) => {
      return { ...item, checked: false };
    });
    this.data.total_pages = res.total_pages;
    this.data.total_objects = res.total_objects;
    this.data.isLoading = false;
    return this.data;
  }

  handleFilter(filters, toolBar = this.toolBar) {
    filters.forEach((filter) => {
      // Cập nhật toolBar.filters.params
      toolBar.filters.params.forEach((param) => {
        if (param.params === filter.field) {
          param.selected = true;
          param.value.push({
            value: filter.value,
            operator: filter.operator,
          });
        } else {
          param.selected = false;
        }
      });
      // Cập nhật toolBar.fieldFilter
      toolBar.fieldFilter.forEach((field) => {
        if (field.params === filter.field) {
          field.selected = true;
          field.value.push({
            value: filter.value,
            operator: filter.operator,
          });
        } else {
          field.selected = false;
        }
      });
    });

    this.handleCallApi();
  }

  removeTextSearch() {
    this.toolBar.filters.search = "";
    this.handleCallApi();
  }

  async handleDelete(item, patch_api = this.CONSTPATH) {
    const result = await Swal.fire({
      title: "Bạn có muốn xoá không?",
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
    const res = await API().remove(`/${patch_api}/${item.id}/`);
    if (res?.instance?.id) {
      this.handleCallApi();
      Swal.fire(
        "Deleted!",
        `Bạn đã xoá ${res.instance?.name ? res.instance.name : "thành công"}`,
        "success"
      );
      return;
    }
    if (res?.id) {
      this.handleCallApi();
      Swal.fire(
        "Deleted!",
        `Bạn đã xoá ${res?.name ? res.name : "thành công"}`,
        "success"
      );
      return;
    }
    // errorToast(
    //   "Hệ thống đang bảo trì! Thêm mới nhóm lớp dữ liệu không thành công. Vui lòng thử lại sau"
    // );
    try {
      errorToast(res.message);
    } catch (error) {
      errorToast("Xóa thất bại!");
    }
  }
  async handleUpToTop(item, patch_api = this.CONSTPATH) {
    const result = await Swal.fire({
      title: "Bạn có muốn đưa lên đầu không?",
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
    const res = await API().post(`/${patch_api}/${item.id}/up-to-top/`);
    if (res?.error) {
      errorToast(res?.message ?? res?.msg ?? "Thao tác không thành công");  
      return;
    }
    this.handleCallApi();
  }

  async deleteMultiRecord(ArraySelected) {
    // Lấy danh sách bản ghi đã chọn
    const selectedRecords = ArraySelected.value;

    if (selectedRecords.length === 0) {
      errorToast("Vui lòng chọn ít nhất một bản ghi để xóa.");
      return;
    }

    // Hiển thị hộp thoại xác nhận
    const confirmResult = await Swal.fire({
      title: `Bạn có chắc muốn xoá ${selectedRecords.length} bản ghi đã chọn không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Không",
    });

    if (!confirmResult.isConfirmed) {
      return;
    }

    let successCount = 0;
    let failCount = 0;

    // Duyệt qua từng bản ghi để xóa
    for (const record of selectedRecords) {
      try {
        const res = await API().remove(`/${this.CONSTPATH}/${record.id}/`);
        if (res?.instance?.id || res?.id) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (error) {
        failCount++;
      }
    }

    // Hiển thị kết quả
    if (failCount === 0) {
      Swal.fire(
        "Deleted!",
        `Bạn đã xoá thành công ${successCount} bản ghi.`,
        "success"
      );
    } else {
      Swal.fire(
        "Partial Deletion",
        `Đã xoá thành công ${successCount} bản ghi. Không thể xoá ${failCount} bản ghi.`,
        "info"
      );
      errorToast(`Không thể xoá ${failCount} bản ghi.`);
    }

    // Gọi lại API để làm mới danh sách
    this.handleCallApi();
  }

  convertParamsEncode64(type) {
    switch (type) {
      case "sort":
        // Lọc các trường đang được sort
        var activeSortFields = this.attribute
          .filter((item) => item.sort && item.sort.active)
          .map((item) => ({
            selector: item.sort.selector,
            desc: item.sort.desc,
          }));

        if (activeSortFields.length === 0) return "";

        var jsonStringSort = JSON.stringify(activeSortFields);
        var base64Sort = base64Encode(jsonStringSort);
        return `&sort=${base64Sort}`;

      case "filter":
        var result_search = [];
        this.toolBar.filters.params
          .filter((item) => item.selected)
          .forEach((item) => {
            item.value.forEach((value) => {
              result_search.push([
                `${item.params}`,
                value.operator,
                value.value,
              ]);
            });
          });

        var result_field = [];
        this.toolBar.fieldFilter.forEach((field) => {
          if (field.selected && Array.isArray(field.value)) {
            field.value.forEach((val) => {
              result_field.push([field.params, val.operator, val.value]);
            });
          }
        });

        var appliedQuickSearch = this.toolBar.quickSearch
          .filter((item) => item.apply)
          .flatMap((item) => item.value);

        var columnFilter = this.toolBar.columnFilter;

        var fullFilterData = [
          ...result_search,
          ...result_field,
          ...appliedQuickSearch,
          ...columnFilter,
        ];

        if (fullFilterData.length === 0) return "";

        var jsonStringFilter = JSON.stringify(fullFilterData);
        var base64Filter = base64Encode(jsonStringFilter);
        return `&filter=${base64Filter}`;
    }

    return "";
  }

  //Sự kiện cho Toolbar
  //Action-toolbar
  get showActions() {
    if (!this.data.results) {
      return false;
    } else if (this.data.results.some((item) => item.checked === true)) {
      return true;
    }
    return false;
  }

  setCheckedAll() {
    this.data.results = this.data.results.map((item) => {
      item.checked = this.data.checkedAll;
      return item;
    });
  }

  //Action-attribute
  swapAttribute(index1, index2) {
    swapArr(this.attribute, index1, index2);
  }

  //Filter-search
  handleTextSearch() {
    const self = this;
    self.data.current_page_number = 1;
    self.handleCallApi();
  }

  getViewType() {
    return ClassToolBar.getTypeViewActive();
  }

  setViewType(_index) {
    ClassToolBar.setTypeViewActive(_index);
  }

  setColumnFilter(columnFilter) {
    ClassToolBar.setColumnFilter(columnFilter);
  }
}

export default manage_data;
