import { Store } from "pullstate";
import { getRandomString } from "../Utils/CalculationUtils";

export const NotificationStore = new Store({ notifications: [] });

export const showSuccessNotification = (message) => {
    let id = getRandomString(8) + Date.now();
    let isTransparent = false;

    NotificationStore.update((s) => {
        s.notifications.push({ message, type: "success", id, isTransparent });
    });

    setTimeout(() => {
        NotificationStore.update((s) => {
            s.notifications = s.notifications.filter((i) => i.id !== id);
        });
    }, 5000);

    setTimeout(() => {
        isTransparent = true;
        NotificationStore.update((s) => {
            s.notifications = s.notifications.map((i) => {
                if (i.id === id) {
                    return { ...i, isTransparent };
                }
                return i;
            });
        });
    }, 3500);
};

export const showErrorNotification = (message) => {
    let id = getRandomString(8) + Date.now();
    let isTransparent = false;

    NotificationStore.update((s) => {
        s.notifications.push({ message, type: "error", id, isTransparent });
    });

    setTimeout(() => {
        NotificationStore.update((s) => {
            s.notifications = s.notifications.filter((i) => i.id !== id);
        });
    }, 5000);

    setTimeout(() => {
        isTransparent = true;
        NotificationStore.update((s) => {
            s.notifications = s.notifications.map((i) => {
                if (i.id === id) {
                    return { ...i, isTransparent };
                }
                return i;
            });
        });
    }, 3500);
};

export const showWarningNotification = (message) => {
    let id = getRandomString(8) + Date.now();
    let isTransparent = false;

    NotificationStore.update((s) => {
        s.notifications.push({ message, type: "warning", id, isTransparent });
    });

    setTimeout(() => {
        NotificationStore.update((s) => {
            s.notifications = s.notifications.filter((i) => i.id !== id);
        });
    }, 5000);

    setTimeout(() => {
        isTransparent = true;
        NotificationStore.update((s) => {
            s.notifications = s.notifications.map((i) => {
                if (i.id === id) {
                    return { ...i, isTransparent };
                }
                return i;
            });
        });
    }, 3500);
};
