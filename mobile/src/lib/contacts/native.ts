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

  const urls = [];
  if (card.slug) urls.push({ label: 'OpSolid', url: `https://opsolid.de/c/${card.slug}` });

  const contact: Contacts.Contact = {
    [Contacts.Fields.ContactType]: Contacts.ContactTypes.Person,
    [Contacts.Fields.FirstName]: firstName,
    [Contacts.Fields.LastName]: lastName,
    [Contacts.Fields.Name]: fullName,
    name: fullName,
    contactType: Contacts.ContactTypes.Person,
    firstName,
    lastName,
    company,
    jobTitle,
    emails: email
      ? [{ email, label: Contacts.EmailLabels.Work, isPrimary: true }]
      : undefined,
    phoneNumbers: phone
      ? [{ number: phone, label: Contacts.PhoneNumberLabels.Mobile, isPrimary: true }]
      : undefined,
    urlAddresses: urls.length ? urls : undefined,
    image: photoUrl ? { uri: photoUrl } : undefined,
  } as unknown as Contacts.Contact;

  try {
    await Contacts.addContactAsync(contact);
    return 'saved';
  } catch {
    return 'failed';
  }
}
