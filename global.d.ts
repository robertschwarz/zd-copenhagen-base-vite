import type { NewRequestFormProps } from "./src/react-modules/new-request-form/NewRequestForm";
import type { Settings } from "./src/react-modules/shared";

declare global {
  interface Window {
    renderNewRequestForm: (
      settings: Settings,
      props: NewRequestFormProps,
      container: HTMLElement
    ) => void;
    renderFlashNotifications: (settings: Settings, closeLabel: string) => void;
  }
}
export default global;
