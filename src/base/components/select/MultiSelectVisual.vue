<template>
    <div class="d-flex flex-row" id="treeVisualMulti" :customID="customID" @click="handleClickVisual" :class="{ 'disable-bg': disable}">
        <div id="listMultiItemVisual" :customID="customID">
            <!-- Buttons with Label -->
            <button type="button" :disabled="disable" 
                class="btn btn-primary btn-label waves-effect waves-light btn-sm btn-el-visual button-margin-visual"
                v-for="el in data" :key="el.id">
                <i class="ri-close-line label-icon align-middle fs-16 me-2 icon-close-el" :customID="customID"
                    @click="handleClickRemove(el)"></i>
                {{ getLabelField(el) }}
            </button>
        </div>
    </div>
</template>

<style scoped>
.disable-bg {
    background-color: var(--vz-input-disabled-bg) !important;
    opacity: 1;
}
#treeVisualMulti {
    min-height: 37.5px;
    background-color: white;
    border: 1px solid var(--vz-input-border);
    border-radius: 0.25rem
}

#listMultiItemVisual {
    border: none;
    color: #fff;
    border-radius: 3px;
    padding: 3px;
    margin: 6px 6px 0px 6px;
}

.remove-selected {
    color: #fff;
    margin-right: 7px;
    border-color: #536295;
    padding: 0 8px;
}

.btn-el-visual {
    padding-left: 31px;
    margin-bottom: 6px;
}


.button-margin-visual {
    margin-right: 5px;
}

.icon-close-el {
    width: 25.5px;
}
</style>

<script>

export default {
    components: {
    },
    computed: {
    },
    props: {
        disable: {

        },
        customID: {

        },
        data: {

        },
        labelField: {

        },
        subLabelField: {

        }
    },
    methods: {
        handleClickVisual() {
            if (!this.disable) this.$emit('on-click-visual', true)
        },
        handleClickRemove(node) {
            if (!this.disable) this.$emit('on-remove-node', node)
        },
        getLabelField(node) {
            const valueLabel = node[this.labelField] ? node[this.labelField] : node[this.subLabelField]
            return valueLabel
        },
    }
};
</script>