<template>
  <div class="m-0" no-body>
    <div class="ckeditor-classic">
      <ckeditor
        ref="editor"
        v-model="editorData"
        :editor="editor"
        :config="editorConfig"
      ></ckeditor>
    </div>
  </div>
</template>

<script>
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { BASE_URL } from "@/helpers/api/axiosHttp";
class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
    this.url = BASE_URL + "/api/img/"; // Your upload URL
  }

  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          const data = new FormData();
          data.append("image", file);

          fetch(this.url, {
            method: "POST",
            body: data,
          })
            .then((response) => response.json())
            .then((result) => {
              if (result.image) {
                resolve({
                  default: result.image,
                });
              } else {
                reject(result.message);
              }
            })
            .catch((error) => {
              reject(error.message);
            });
        })
    );
  }

  abort() {
    // Handle aborting the upload process if necessary
  }
}

function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader);
  };
}

export default {
  components: {
    ckeditor: CKEditor.component,
  },
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    disable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      editor: ClassicEditor,
      editorData: "",
      editorInstance: null,
      editorConfig: {
        extraPlugins: [MyCustomUploadAdapterPlugin],
      },
    };
  },
  mounted() {
    this.editorData = this.modelValue;
    this.$nextTick(() => {
      this.editorInstance = this.$refs.editor.instance;
      this.updateReadOnlyMode(this.disable);
    });
  },
  watch: {
    disable(newVal) {
      this.updateReadOnlyMode(newVal);
    },
    editorData() {
      this.$emit("update:modelValue", this.editorData);
    },
    modelValue() {
      this.editorData = this.modelValue;
    },
  },
  methods: {
    updateReadOnlyMode(isReadOnly) {
      if (this.editorInstance) {
        if (isReadOnly) {
          this.editorInstance.enableReadOnlyMode("my-feature-id");
        } else {
          this.editorInstance.disableReadOnlyMode("my-feature-id");
        }
      }
    },
  },
};
</script>
