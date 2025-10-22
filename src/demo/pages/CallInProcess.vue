<template>
    <div class="header">
        <div class="contact-info text-center">
            <div class="contact-name">Nguyễn Bảo Khánh</div>
            <div class="call-status">Đang đổ chuông...</div>
            <div class="phone-number">0965890179</div>
        </div>
    </div>
    <hr>
    <div class="d-flex justify-content-center  text-muted">
        <button class="btn btn-ghost" v-for="action in acitons" :key="action.name" @click="action.action">
            <i :class="action.icon" class="fs-24"></i>
        </button>
    </div>
    <div class="action-buttons mt-4 d-flex gap-2 justify-content-center">
        <button class="btn btn-danger btn-end-call" @click="endCall">
            <i class="bi bi-telephone-x"></i> Kết thúc
        </button>
    </div>

</template>

<script>
export default {
    name: 'CallInProgress',
    methods: {
        endCall() {
            this.$emit('call-ended');
        },
        handleKeyDown(event) {
            if (event.key === 'Escape') {
                this.endCall();
            }
        }
    },
    data() {
        return {
            acitons: [
                {
                    name: 'Tắt mic',
                    icon: 'bx bx-microphone', // bx bx-microphone-off
                    action: this.endCall
                },
                {
                    name: 'Giữ cuộc gọi',
                    icon: 'ri-pause-fill',
                    action: this.endCall
                },
                {
                    name: 'Chuyển tiếp cuộc gọi',
                    icon: ' ri-share-forward-line',
                    action: this.endCall
                },
                {
                    name: 'Thêm người tham gia',
                    icon: 'mdi mdi-plus',
                    action: this.endCall
                }

            ]
        }
    }
};
</script>

<style scoped>
.call-widget {
    max-width: 350px;
    margin: auto;
    border: 1px solid #dee2e6;
    border-radius: 0.375rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    outline: none;
    height: 500px;
}

.contact-info {
    padding: 15px 0;
}

.contact-name {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 5px;
}

.call-status {
    font-size: 1rem;
    color: #666;
    margin-bottom: 10px;
}

.phone-number {
    font-size: 1.3rem;
    font-weight: bold;
    margin-bottom: 5px;
}

.transaction-number {
    font-size: 0.9rem;
    color: #666;
}

.call-restriction-notice {
    background-color: #f8f9fa;
    border-radius: 5px;
    margin-top: 20px;
}

.restriction-text {
    font-size: 0.9rem;
    color: #666;
}

.btn-end-call {
    width: 200px;
    padding: 10px 20px;
    font-size: 1.1rem;
    border-radius: 50px;
}

.action-buttons {
    position: absolute;
    bottom: 30px;
    left: 0;
    right: 0;
    padding: 0 20px;
}
</style>