// -----------------------------------------------------------------------
// templatePickerStore — tiny zustand atom that buffers the template id
// picked from the modal preview screen back to the parent edit/create form.
//
// The flow is:
//   1. Edit/create screen pushes /(app)/cards/template-preview with the
//      currently selected templateId.
//   2. The preview screen lets the user swipe through the catalog. On
//      "Apply", it writes `pickedId` here and `router.back()`s.
//   3. The edit/create screen reads `pickedId` on focus, applies it to its
//      `templateId` state, and clears the atom so a stale pick doesn't fire
//      twice.
//
// Why a store and not router params? Returning data through router params
// requires a polling `useLocalSearchParams` + a sentinel value to avoid
// re-applying on every re-render; a one-shot atom is simpler and keeps the
// edit screen's effect dependency list small.
// -----------------------------------------------------------------------

import { create } from 'zustand';

type TemplatePickerStore = {
  pickedId: number | null;
  setPickedId: (id: number) => void;
  consume: () => number | null;
};

export const useTemplatePickerStore = create<TemplatePickerStore>((set, get) => ({
  pickedId: null,
  setPickedId: (id) => set({ pickedId: id }),
  consume: () => {
    const id = get().pickedId;
    if (id !== null) set({ pickedId: null });
    return id;
  },
}));
