export const portalRouter = "";
export const dataMangeRouter = "manage";
export const systemMangeRouter = "manage/settings";
import APP_AUTH_ROUTER from "@/app_auth/router.js";
import APP_DEMO from "../demo/router.js";
import APP_MYAPP_ROUTER from "@/app_myapp/router.js";
import APP_MANAGE_USER_ROUTER from "@/app_user/router.js";
import APP_MANAGE_SYSTEM_ROUTER from "@/app_system_manage/router.js";
import APP_PERSONNAL_ROUTER from "../app_manage_personnel/router.js";
import APP_ORGANIZATION_ROUTER from "../app_organizations/router.js";
import APP_BOUNDARY from "../app_boundary/router.js";
import APP_NOTIFICATION from "../app_notification/router.js";
import APP_CAMPAIGN from "../app_campaign/router.js";
import APP_CANDIDATE from "../app_candidate/router.js";
import APP_INTERVIEW_ROUTER from "../app_interview/router.js";
import APP_CUSTOMER_ROUTER from "../app_customers/router.js";
import app_logs_candidate from "../app_logs_candidate/router.js";
import app_laborer from "../app_laborer/router.js";
import app_public from "../app_public/router.js";
import APP_CALLCENTER_ROUTER from "@/callcenter/router.js";
import APP_BACKUP_ROUTER from "../app_backup/router.js";
import APP_SYSTEM_LOGS_ROUTER from "../app_system_logs/router.js";
import APP_REPORT_ROUTER from "@/app_dashboard_reports/router.js";
import APP_MANAGE_KPI_ROUTER from "@/app_manage_kpi/router.js";
import APP_MANAGE_REPORT_ROUTER from "@/app_manage_report/router.js";
import app_manager_workflow from "@/app_manager_workflow/router.js";

export default [
  ...APP_AUTH_ROUTER(""),
  {
    path: '/',
    redirect: '/system',
  },
  ...app_public(),
  ...APP_DEMO("demo"),
  ...APP_MYAPP_ROUTER("system"),
  ...APP_MANAGE_USER_ROUTER("manage/user"),
  ...APP_MANAGE_SYSTEM_ROUTER("system/settings"),
  ...APP_PERSONNAL_ROUTER(""),
  ...APP_ORGANIZATION_ROUTER(""),
  ...APP_BOUNDARY("manage/boundaries"),
  ...APP_NOTIFICATION(),
  ...APP_CAMPAIGN(),
  ...APP_CANDIDATE(),
  ...APP_INTERVIEW_ROUTER(),
  ...APP_CUSTOMER_ROUTER(),
  ...app_logs_candidate(),
  ...app_laborer(),
  ...APP_CALLCENTER_ROUTER("callcenter"),
  ...APP_BACKUP_ROUTER(""),
  ...APP_SYSTEM_LOGS_ROUTER(""),
  ...APP_REPORT_ROUTER(""),
  ...APP_MANAGE_KPI_ROUTER("manage/kpi"),
  ...APP_MANAGE_REPORT_ROUTER("manage/report"),
  ...app_manager_workflow()
];
