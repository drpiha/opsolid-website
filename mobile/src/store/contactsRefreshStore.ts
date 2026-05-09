// -----------------------------------------------------------------------
// contactsRefreshStore — tiny zustand atom that lets the public-card
// viewer signal the Contacts tab that its list is stale.
//
// Flow:
//   1. User taps Save / Remove on `(app)/public/[slug]`. After the network
//      call resolves, the viewer calls `markDirty()`.
//   2. Contacts tab's `useFocusEffect` re-fetches on every focus regardless,
//      but the dirty bit acts as a hint so the tab knows a refetch is
//      *required* even if it just rendered.
//   3. After Contacts re-fetches, it calls `clearDirty()`.
//
// Why a store and not a simple useFocusEffect? The viewer can save a card,
// then the user back-swipes to Discover (NOT Contacts). When they later tap
// Contacts, the focus effect would still fire — but if Contacts had been
// rendered offscreen-but-mounted in some future tab arrangement, this dirty
// bit ensures the next focus refetches. It's a belt-and-braces signal.
// -----------------------------------------------------------------------

import { create } from 'zustand';

type ContactsRefreshStore = {
  dirty: boolean;
  markDirty: () => void;
  clearDirty: () => void;
};

export const useContactsRefreshStore = create<ContactsRefreshStore>((set) => ({
  dirty: false,
  markDirty: () => set({ dirty: true }),
  clearDirty: () => set({ dirty: false }),
}));
