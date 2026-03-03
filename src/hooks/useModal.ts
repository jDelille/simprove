import { create } from 'zustand';

type ModalState = {
  [key: string]: boolean;
};

type Modal = {
  modals: ModalState;
  openModal: (modalName: string) => void;
  closeModal: (modalName: string) => void;
};

const useModal = create<Modal>((set) => ({
  modals: {},
  openModal: (modalName: string) => {
    set((state) => ({
      modals: { ...state.modals, [modalName]: true },
    }));
  },
  closeModal: (modalName: string) => {
    set((state) => ({
      modals: { ...state.modals, [modalName]: false },
    }));
  },
}));

export default useModal;