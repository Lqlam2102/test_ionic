export const setupResizeTable = () => {
    setTimeout(() => {
        var tables = document.getElementsByTagName("table");
        for (var i = 0; i < tables.length; i++) {
            resizableGrid(tables[i]);
        }
    }, 500);

    function resizableGrid(table) {
        var row = table.getElementsByTagName("tr")[0],
            cols = row ? row.children : undefined;
        if (!cols) return;

        var tableHeight = table.offsetHeight;

        for (var i = 0; i < cols.length; i++) {
            var div = createDiv(tableHeight);
            cols[i].appendChild(div);
            cols[i].style.position = "relative";
            setListeners(div);
        }

        function setListeners(div) {
            var pageX, curCol, nxtCol, curColWidth, nxtColWidth;

            div.addEventListener("mousedown", function (e) {
                curCol = e.target.parentElement;
                nxtCol = curCol.nextElementSibling;
                pageX = e.pageX;

                var padding = paddingDiff(curCol);

                curColWidth = curCol.offsetWidth - padding;
                if (nxtCol) nxtColWidth = nxtCol.offsetWidth - padding;
            });

            div.addEventListener("mouseover", function (e) {
                e.target.style.borderRight = "2px solid #9595af";
            });

            div.addEventListener("mouseout", function (e) {
                e.target.style.borderRight = "";
            });

            document.addEventListener("mousemove", function (e) {
                if (curCol) {
                    var diffX = e.pageX - pageX;

                    if (nxtCol) nxtCol.style.width = nxtColWidth - diffX + "px";

                    curCol.style.width = curColWidth + diffX + "px";
                }
            });

            document.addEventListener("mouseup", function () {
                curCol = undefined;
                nxtCol = undefined;
                pageX = undefined;
                nxtColWidth = undefined;
                curColWidth = undefined;
            });
        }

        function createDiv(height) {
            var div = document.createElement("div");
            div.style.top = 0;
            div.style.right = 0;
            div.style.width = "5px";
            div.style.position = "absolute";
            div.style.cursor = "col-resize";
            div.style.userSelect = "none";
            div.style.height = height + "px";
            return div;
        }

        function paddingDiff(col) {
            if (getStyleVal(col, "box-sizing") == "border-box") {
                return 0;
            }

            var padLeft = getStyleVal(col, "padding-left");
            var padRight = getStyleVal(col, "padding-right");
            return parseInt(padLeft) + parseInt(padRight);
        }

        function getStyleVal(elm, css) {
            return window.getComputedStyle(elm, null).getPropertyValue(css);
        }
    }
};

export const buildTree = (data) => {
    if (!data || !Array.isArray(data)) return {}; // Xử lý dữ liệu không hợp lệ

    const nodeMap = {}; // Bản đồ lưu trữ các node theo ID
    const rootNodes = {}; // Object để lưu các node gốc

    // Tạo bản đồ các nút dựa trên ID
    data.forEach((item) => {
        nodeMap[item.id] = {
            ...item,
            children: {}, // Khởi tạo children là một object rỗng
        };
    });

    // Xây dựng cấu trúc cây từ tree_path
    data.forEach((item) => {
        const treePath = item.tree_path; // Đường dẫn cây
        const pathSegments = treePath.split("/").filter((segment) => segment); // Tách đường dẫn thành các phần tử

        if (pathSegments.length > 1) {
            // Nếu nút này có cha (parent)
            const parentId = pathSegments[pathSegments.length - 2]; // Lấy ID cha từ phần tử trước đó
            if (nodeMap[parentId]) {
                nodeMap[parentId].children[item.id] = nodeMap[item.id]; // Thêm node hiện tại vào children của cha (dạng object)
            }
        } else {
            // Nếu đây là node gốc (không có parent)
            rootNodes[item.id] = nodeMap[item.id]; // Thêm node vào rootNodes
        }
    });

    return rootNodes; // Trả về danh sách các node gốc với cây phân cấp đầy đủ
};


export function buildDataTreeSelect(data) {
    const tree = []; // Root is an array now

    data.forEach((item) => {
        const codes = item.tree_path.split("/").filter((code) => code);
        let currentNode = tree;

        codes.forEach((code) => {
            // Find if the code already exists in the current children array
            let childNode = currentNode.find((child) => child.code === code);

            if (!childNode) {
                // Create a new node if it doesn't exist
                childNode = {
                    code,         // Current code
                    ...item,      // Add item properties
                    children: [], // Initialize children as an array
                };
                currentNode.push(childNode); // Add new node to children
            }

            // Move pointer to the children array of the current node
            currentNode = childNode.children;
        });
    });

    return tree; // Final tree structure
}
