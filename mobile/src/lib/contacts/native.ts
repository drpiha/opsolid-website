import * as Contacts from 'expo-contacts';
import { API_BASE } from '../api/client';
import type { ApiCard } from '../api/types';

export type SaveResult = 'saved' | 'denied' | 'unsupported' | 'failed';

export async function saveCardToDeviceContacts(card: ApiCard): Promise<SaveResult> {
  const data = (card.cardData ?? {}) as Record<string, unknown>;
  const fullName = (data.name as string)?.trim();
  if (!fullName) return 'failed';

  const { status } = await Contacts.requestPermissionsAsync();
  if (status !== Contacts.PermissionStatus.GRANTED) return 'denied';

  const [firstName, ...rest] = fullName.split(/\s+/);
  const lastName = rest.join(' ').trim() || undefined;
  const email = (data.email as string)?.trim();
  const phone = (data.phone as string)?.trim();
  const company = (data.company as string)?.trim();
  const jobTitle = (data.title as string)?.trim();

  const photoUrl =
    card.photoPath && !card.photoPath.startsWith('http')
      ? `${API_BASE}${card.photoPath}`
      : (card.photoPath ?? undefined);

  const urlAddresses: { label: string; url: string }[] = [];
  if (card.slug) {
    urlAddresses.push({ label: 'OpSolid', url: `https://opsolid.de/c/${card.slug}` });
  }

  const contact = {
    name: fullName,
    firstName,
    lastName,
    company,
    jobTitle,
    contactType: Contacts.ContactTypes.Person,
    emails: email ? [{ email, label: 'work', isPrimary: true }] : undefined,
    phoneNumbers: phone ? [{ number: phone, label: 'mobile', isPrimary: true }] : undefined,
    urlAddresses: urlAddresses.length ? urlAddresses : undefined,
    image: photoUrl ? { uri: photoUrl } : undefined,
  } as unknown as Contacts.Contact;

  try {
    await Contacts.addContactAsync(contact);
    return 'saved';
  } catch {
    return 'failed';
  }
}
