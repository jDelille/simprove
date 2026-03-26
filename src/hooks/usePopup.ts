import { create } from 'zustand';

type PopupState = {
  [key: string]: boolean;
};

type Popup = {
  popups: PopupState;
  openPopup: (popupName: string) => void;
  closePopup: (popupName: string) => void;
};

const usePopup = create<Popup>((set) => ({
  popups: {},
  openPopup: (popupName: string) => {
    set((state) => ({
      popups: { ...state.popups, [popupName]: true },
    }));
  },
  closePopup: (popupName: string) => {
    set((state) => ({
      popups: { ...state.popups, [popupName]: false },
    }));
  },
}));

export default usePopup;