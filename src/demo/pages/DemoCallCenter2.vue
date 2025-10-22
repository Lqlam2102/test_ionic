<template>
    <BDropdown dropstart :offset="{ alignmentAxis: 57, crossAxis: 0, mainAxis: -42 }"
        class="ms-1 dropdown" toggle-class="btn-icon btn-topbar rounded-circle mode-layout arrow-none"
        menu-class="dropdown-menu-end p-0" text="Manual close (auto-close=false)" auto-close="outside">
        <template #button-content>
            <button type="button" class="btn btn-success btn-icon waves-effect waves-light"
                @click="showCallCentral = !showCallCentral">
                <i class="ri-phone-fill fs-20"></i>
            </button>
        </template>
        <div class="call-widget card p-3" @keydown="handleKeyDown" tabindex="0" v-if="showCallCentral">
            <template v-if="calling">
                <CallInScene @end-call="endCall"></CallInScene>
            </template>
            <template v-else>
                <div class="header mb-3">
                    <h4 class="card-title text-center mb-1">Sẵn sàng</h4>
                    <div class="contact-info text-center mb-3">
                        <div>Nguyễn Bảo Khánh</div>
                        <div>contact@3saqjsc.vn</div>
                        <div>+84 0965890179</div>
                    </div>
                </div>
                <div class="phone-display mb-3 p-2 text-center d-flex align-items-center">
                    <div class="display-number scrollable w-100" ref="displayNumber">
                        <span v-for="(char, index) in phoneNumber" :key="index">
                            {{ char }}
                        </span>
                        <span v-if="!phoneNumber">Sử dụng số</span>
                    </div>
                    <button style="margin-bottom: 3px;"
                        class="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle" @click="clearNumber">
                        <i class="ri-close-circle-line fs-24 text-muted"></i>
                    </button>
                </div>

                <div class="keypad">
                    <div class="row mb-2">
                        <div class="col-4 key" @click="appendNumber('1')" data-key="1">
                            <div class="number">1</div>
                            <div class="letters"></div>
                        </div>
                        <div class="col-4 key" @click="appendNumber('2')" data-key="2">
                            <div class="number">2</div>
                            <div class="letters">ABC</div>
                        </div>
                        <div class="col-4 key" @click="appendNumber('3')" data-key="3">
                            <div class="number">3</div>
                            <div class="letters">DEF</div>
                        </div>
                    </div>

                    <div class="row mb-2">
                        <div class="col-4 key" @click="appendNumber('4')" data-key="4">
                            <div class="number">4</div>
                            <div class="letters">GHI</div>
                        </div>
                        <div class="col-4 key" @click="appendNumber('5')" data-key="5">
                            <div class="number">5</div>
                            <div class="letters">JKL</div>
                        </div>
                        <div class="col-4 key" @click="appendNumber('6')" data-key="6">
                            <div class="number">6</div>
                            <div class="letters">MNO</div>
                        </div>
                    </div>

                    <div class="row mb-2">
                        <div class="col-4 key" @click="appendNumber('7')" data-key="7">
                            <div class="number">7</div>
                            <div class="letters">PQRS</div>
                        </div>
                        <div class="col-4 key" @click="appendNumber('8')" data-key="8">
                            <div class="number">8</div>
                            <div class="letters">TUV</div>
                        </div>
                        <div class="col-4 key" @click="appendNumber('9')" data-key="9">
                            <div class="number">9</div>
                            <div class="letters">WXYZ</div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-4 key" @click="appendNumber('*')" data-key="*">
                            <div class="number">*</div>
                        </div>
                        <div class="col-4 key" @click="appendNumber('0')" data-key="0">
                            <div class="number">0</div>
                        </div>
                        <div class="col-4 key" @click="appendNumber('#')" data-key="#">
                            <div class="number">#</div>
                        </div>
                    </div>
                </div>

                <div class="action-buttons mt-3 d-flex justify-content-between">
                    <button class="btn btn-primary" @click="startCall">
                        <i class="bi bi-telephone"></i> Gọi
                    </button>
                    <button class="btn btn-outline-secondary" @click="deleteLastNumber">
                        <i class="ri-delete-back-2-fill"></i>
                    </button>
                </div>
            </template>
        </div>
    </BDropdown>
</template>

<script>
import CallInScene from '../../callcenter/components/CallInScene.vue';
export default {
    name: 'CallWidget',
    components: {
        CallInScene
    },
    data() {
        return {
            phoneNumber: '',
            selectedIndex: null, // Vị trí của số được chọn
            calling: false,
            showCallCentral: false
        };
    },
    methods: {
        appendNumber(num) {
            this.phoneNumber += num;

            // Cuộn đến cuối phần hiển thị số
            this.$nextTick(() => {
                const displayNumber = this.$refs.displayNumber;
                if (displayNumber) {
                    displayNumber.scrollLeft = displayNumber.scrollWidth;
                }
            });
        },
        clearNumber() {
            this.phoneNumber = '';
            this.selectedIndex = null; // Đặt lại vị trí được chọn
        },
        deleteLastNumber() {
            this.phoneNumber = this.phoneNumber.slice(0, -1);
        },
        // selectNumber(index) {
        //     // Lưu vị trí của số được chọn
        //     this.selectedIndex = index;
        // },
        // deleteSelectedNumber() {
        //     if (this.selectedIndex !== null) {
        //         // Xóa số tại vị trí được chọn
        //         this.phoneNumber =
        //             this.phoneNumber.slice(0, this.selectedIndex) +
        //             this.phoneNumber.slice(this.selectedIndex + 1);

        //         // Đặt lại vị trí được chọn
        //         this.selectedIndex = null;
        //     }
        // },
        startCall() {
            if (!this.phoneNumber) {
                alert('Vui lòng nhập số điện thoại');
                return;
            }
            this.calling = true
        },
        endCall() {
            this.calling = false
            this.phoneNumber = ''
        },
        handleKeyDown(event) {
            if (event.key >= '0' && event.key <= '9') {
                this.appendNumber(event.key);
                this.highlightKey(event.key);
                return;
            }
            switch (event.key) {
                case '*':
                case '#':
                    this.appendNumber(event.key);
                    this.highlightKey(event.key);
                    break;
                case 'Backspace':
                    this.deleteLastNumber();
                    break;
                case 'Enter':
                    this.startCall();
                    break;
            }
        },
        highlightKey(key) {
            const keyElement = this.$el.querySelector(`[data-key="${key}"]`);
            if (keyElement) {
                keyElement.classList.add('key-active');
                setTimeout(() => {
                    keyElement.classList.remove('key-active');
                }, 200);
            }
        }
    }
};
</script>

<style scoped>
.call-widget {
    min-width: 350px;
    max-width: 350px;
    margin: auto;
    border: 1px solid #dee2e6;
    border-radius: 0.375rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    outline: none;
    height: 500px
        /* Remove default focus outline */
}

.call-widget:focus {
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.header {
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
}

.contact-info div {
    font-size: 0.9rem;
    line-height: 1.4;
    color: #666;
}

.phone-display {
    background-color: #f8f9fa;
    border-radius: 5px;
    position: relative;
}

.display-number {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 5px;
    overflow-x: auto;
    /* Cho phép cuộn ngang */
    white-space: nowrap;
    /* Ngăn nội dung xuống dòng */
    padding: 5px;
    scrollbar-width: none;
    /* Ẩn scrollbar trên Firefox */
}

.display-number::-webkit-scrollbar {
    display: none;
    /* Ẩn scrollbar trên Chrome, Edge và Safari */
}

.company-name {
    font-size: 0.9rem;
    color: #666;
}

.call-type {
    font-size: 0.8rem;
    color: #28a745;
    font-weight: bold;
}

.key {
    text-align: center;
    cursor: pointer;
    border-radius: 5px;
    transition: all 0.2s;
    user-select: none;
}

.key:hover {
    background-color: #f0f0f0;
}

.key-active {
    background-color: #d1e7ff !important;
    transform: scale(0.95);
}

.number {
    font-size: 1.5rem;
    font-weight: bold;
}

.letters {
    font-size: 0.7rem;
    color: #666;
    margin-top: -5px;
}

.action-buttons .btn {
    width: 48%;
}
</style>