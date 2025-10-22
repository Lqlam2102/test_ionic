import { reactive, ref } from "vue";

const isContentVisible = ref(false);
const currentNode = reactive({
    name: ''
});

const toggleContent = () => {
    isContentVisible.value = !isContentVisible.value;
}
const setCurrentNode = ({ name = '' }) => {
    currentNode.name = name;
}

export { isContentVisible, currentNode, toggleContent, setCurrentNode };