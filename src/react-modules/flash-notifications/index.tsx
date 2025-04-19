import { dispatchLoadEvent } from "../shared/util/dispatchLoadEvent";
import { renderFlashNotifications } from "./renderFlashNotifications";

window.renderFlashNotifications = renderFlashNotifications;

dispatchLoadEvent("flash-notifications");
