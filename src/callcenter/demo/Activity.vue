<template>
    <section id="page-activity" class="w-100">
        <div class="w-100 text-center">
            <p>Những cuộc gọi gần đây</p>
        </div>
        <div class="line-dotted"></div>
        <div class="wrap-activity-list">
            <div class="wrap-activity-list-content">
                <div v-for="(group, groupIndex) in activityGroups" :key="groupIndex">
                    <div class="activity-date">{{ group.date }}</div>
                    <div class="d-flex flex-column gap-2">
                        <div v-for="(activity, activityIndex) in group.activities" :key="activityIndex"
                            class="wrap-activity-item d-flex">
                            <div class="activity-icon">
                                <img :src="activity.icon" alt="Activity Icon" />
                            </div>
                            <div class="activity-info">
                                <div class="activity-phone">{{ activity.phone }}</div>
                                <div class="activity-via">{{ activity.via }}</div>
                            </div>
                            <div class="activity-time">{{ activity.time }}</div>
                            <div class="activity-more">
                                <img :src="arrowIcon" alt="More" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import callOutIcon from "@/callcenter/assets/stringee-widget/images/icon-call-out.svg";
import callInIcon from "@/callcenter/assets/stringee-widget/images/icon-call-in.svg";
import callMissIcon from "@/callcenter/assets/stringee-widget/images/icon-call-miss.svg";
import arrowIcon from "@/callcenter/assets/stringee-widget/images/icon-arrow-point-to-right.svg";

export default {
    name: "Activity",
    data() {
        return {
            callOutIcon,
            callInIcon,
            callMissIcon,
            arrowIcon, // Import arrow icon for "More" section
            activityGroups: [
                {
                    date: "20/06/2018",
                    activities: [
                        {
                            icon: callOutIcon,
                            phone: "+84 966050824",
                            via: "Giangle via Stringee",
                            time: "6:40 PM",
                        },
                        {
                            icon: callInIcon,
                            phone: "+84 966050824",
                            via: "Giangle via Stringee",
                            time: "6:40 PM",
                        },
                        {
                            icon: callMissIcon,
                            phone: "+84 966050824",
                            via: "Giangle via Stringee",
                            time: "6:40 PM",
                        },
                    ],
                },
                {
                    date: "21/06/2018",
                    activities: [
                        {
                            icon: callOutIcon,
                            phone: "+84 966050824",
                            via: "Giangle via Stringee",
                            time: "7:00 PM",
                        },
                    ],
                },
                {
                    date: "20/06/2018",
                    activities: [
                        {
                            icon: callOutIcon,
                            phone: "+84 966050824",
                            via: "Giangle via Stringee",
                            time: "6:40 PM",
                        },
                        {
                            icon: callInIcon,
                            phone: "+84 966050824",
                            via: "Giangle via Stringee",
                            time: "6:40 PM",
                        },
                        {
                            icon: callMissIcon,
                            phone: "+84 966050824",
                            via: "Giangle via Stringee",
                            time: "6:40 PM",
                        },
                    ],
                },
                {
                    date: "21/06/2018",
                    activities: [
                        {
                            icon: callOutIcon,
                            phone: "+84 966050824",
                            via: "Giangle via Stringee",
                            time: "7:00 PM",
                        },
                    ],
                },
            ],
        };
    },
};
</script>
<style scoped lang="scss">
@import "@/callcenter/assets/stringee-widget/css/all-style-1.0.0.css";
</style>