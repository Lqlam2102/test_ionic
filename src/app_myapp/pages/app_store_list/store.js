import Swal from "sweetalert2";
import { checkAppDependencies } from '@/app_myapp/utils.js'
import { installApp, uninstallApp } from '@/app_myapp/utils.js'
import { successToast } from '@/helpers/api/toastStyle';
import { delay } from "@/base/store/utils/etc.js"

export async function swal(title) {
    const result = await Swal.fire({
        title: title,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Không",
    });
    if (!result.isConfirmed) {
        return false;
    }
    return true
}

export function areAllDependenciesInstalled(dependencies, installedApps) {
    // Create a set of installed dependencies
    const installedDependenciesSet = new Set(installedApps);

    // Check if all dependencies are present in the installed dependencies set
    return dependencies.every(dep => installedDependenciesSet.has(dep.dependency));
}

export function areAllStrictDependenciesInstalled(dependencies, installedApps) {
    // Create a set of installed dependencies
    const installedDependenciesSet = new Set(installedApps);

    // Filter dependencies with strict_depend: true
    const strictDependencies = dependencies.filter(dep => dep.strict_depend);

    // Check if all strict dependencies are present in the installed dependencies set
    return strictDependencies.every(dep => installedDependenciesSet.has(dep.dependency));
}

export async function handleInstallApp(appId) {
    const isConfirm = await swal("Bạn có chắc chắn cài đặt ứng dụng này?")
    if (isConfirm) {
        const dependencies = await checkAppDependencies(appId)
        if (!dependencies?.length) {
            try {
                await installApp(appId)
            }
            catch {
                return
            }
            window.location = `/system`;
        }
        else {
            return dependencies
        }
    }
}
export async function handleUninstallApp(appId) {
    const isConfirm = await swal("Bạn có chắc chắn gỡ ứng dụng này không? <br> Khi gỡ ứng dụng sẽ mất hết toàn bộ dữ liệu và không thể khôi phục!")
    if (isConfirm) {
        try {
            await uninstallApp(appId)
        }
        catch {
            return
        }
        successToast("Gỡ cài đặt ứng dụng thành công!")
        await delay(4000);
        window.location = `/system`;
    }
}