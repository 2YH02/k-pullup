import Alert from "@common/alert";
import { create } from "zustand";

type AlertProps = React.ComponentProps<typeof Alert>;
type AlertOptions = Omit<AlertProps, "open">;

interface AlertState {
  alertState: AlertProps;
  openAlert: (options: AlertOptions) => void;
  closeAlert: () => void;
}

const defaultValues: AlertProps = {
  open: false,
  title: null,
  description: null,
  onClick: () => {},
  onClickAsync: async () => {},
  cancel: false,
};

const useAlertStore = create<AlertState>()((set) => ({
  alertState: defaultValues,
  openAlert: ({ onClick, onClickAsync, ...options }: AlertOptions) =>
    set({
      alertState: {
        ...options,
        onClick: onClick
          ? () => {
              set({ alertState: defaultValues });
              onClick();
            }
          : undefined,
        onClickAsync: onClickAsync
          ? async () => {
              await onClickAsync();
            }
          : undefined,
        open: true,
      },
    }),
  closeAlert: () => set({ alertState: defaultValues }),
}));

export default useAlertStore;
