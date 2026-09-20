"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import type { getOpsoAccountCopy } from "@/content/opso-account";
import type { OpsoCard, OpsoDraft, OpsoIdentity, OpsoLocale, OpsoPrivacy, OpsoProfile, OpsoTemplate, OpsoTerms } from "@/lib/opso-web/contracts";
import styles from "./account.module.css";

type Props = { locale: OpsoLocale; copy: ReturnType<typeof getOpsoAccountCopy> };
const emptyProfile: OpsoProfile = { name: "", role: "", company: "", email: "", phone: "", location: "" };
const defaultPrivacy: OpsoPrivacy = { discoverable: false, indexable: false, showEmail: false, showPhone: false };
class RequestError extends Error { constructor(readonly code: string, readonly status: number) { super(code); } }

export default function OpsoAccount({ locale, copy: c }: Props) {
  const csrf = useRef(""); const [user, setUser] = useState<OpsoIdentity | null>(null);
  const [ready, setReady] = useState(false); const [unavailable, setUnavailable] = useState(false);
  const [busy, setBusy] = useState(false); const [message, setMessage] = useState(""); const [failed, setFailed] = useState(false);
  const [email, setEmail] = useState(""); const [code, setCode] = useState(""); const [challenge, setChallenge] = useState(false);
  const [cards, setCards] = useState<OpsoCard[]>([]); const [templates, setTemplates] = useState<OpsoTemplate[]>([]);
  const [terms, setTerms] = useState<OpsoTerms | null>(null); const [accepted, setAccepted] = useState(false);
  const [selected, setSelected] = useState<OpsoCard | null>(null); const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<OpsoProfile>({ ...emptyProfile }); const [privacy, setPrivacy] = useState<OpsoPrivacy>({ ...defaultPrivacy });
  const [cardLocale, setCardLocale] = useState<OpsoLocale>(locale); const [visibility, setVisibility] = useState<OpsoDraft["visibility"]>("public");
  const [slug, setSlug] = useState(""); const [templateId, setTemplateId] = useState(""); const [conflict, setConflict] = useState(false);
  const [checkedPreview, setCheckedPreview] = useState<Pick<OpsoProfile, "name" | "role" | "company" | "email" | "phone"> | null>(null);
  const draft = { id: selected?.id ?? "", expectedRevision: selected?.draftRevision ?? 0, profile, privacy, cardLocale, visibility };
  const dirty = selected ? JSON.stringify({ profile, privacy, cardLocale, visibility }) !== JSON.stringify({ profile: selected.profile, privacy: selected.privacy, cardLocale: selected.cardLocale, visibility: selected.visibility }) : true;

  async function api<T>(action: string, body?: unknown): Promise<T> {
    const response = await fetch(`/api/opso/${action}`, { method: body === undefined ? "GET" : "POST", cache: "no-store", credentials: "same-origin", headers: body === undefined ? {} : { "Content-Type": "application/json", "X-Opso-Csrf": csrf.current }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
    const result = await response.json();
    if (!response.ok) throw new RequestError(typeof result.error === "string" ? result.error : "request_failed", response.status);
    if (result.csrf) csrf.current = result.csrf; return result as T;
  }
  function show(text: string, error = false) { setMessage(text); setFailed(error); }
  function onError(error: unknown) {
    const value = error instanceof RequestError ? error : new RequestError("request_failed", 0);
    if (value.code === "web_account_unavailable") { setUnavailable(true); show(c.unavailable, true); }
    else if (value.code === "draft_revision_conflict" || value.code === "card_changed_elsewhere") { setConflict(true); show(c.conflictHelp, true); }
    else if (["card_limit", "published_card_limit", "onboarding_card_exists"].includes(value.code)) show(c.limitError, true);
    else if (value.status === 429) show(c.rateError, true);
    else if (value.code === "terms_acceptance_required") { setTerms(null); setAccepted(false); void api<OpsoTerms>("terms").then(setTerms).catch(() => {}); show(c.termsError, true); }
    else if (["page_blocks_not_ready", "page_pages_not_ready", "invalid_localized_page_document", "page_document_downgrade_not_allowed"].includes(value.code)) show(c.readinessError, true);
    else if (value.code === "challenge_expired") { setChallenge(false); show(c.invalidCode, true); }
    else if (value.code === "csrf_required" || value.status === 401) { if (challenge && value.status === 401) show(c.invalidCode, true); else { setUser(null); setChallenge(false); show(c.authError, true); } }
    else show(c.error, true);
  }
  async function run(task: () => Promise<void>) { setBusy(true); setMessage(""); try { await task(); } catch (error) { onError(error); } finally { setBusy(false); } }
  async function load() {
    const [list, layouts, currentTerms] = await Promise.all([api<{ items: OpsoCard[] }>("cards"), api<{ items: OpsoTemplate[] }>("templates"), api<OpsoTerms>("terms")]);
    setCards(list.items); setTemplates(layouts.items.filter((item) => item.canCreate)); setTemplateId((old) => old || layouts.items.find((item) => item.canCreate)?.id || ""); setTerms(currentTerms);
    return list.items;
  }
  useEffect(() => {
    let active = true;
    void (async () => {
      try { const session = await api<{ user: OpsoIdentity | null; csrf: string }>("session"); if (!active) return; setUser(session.user); if (session.user) await load(); }
      catch (error) { if (active) onError(error); }
      finally { if (active) setReady(true); }
    })();
    return () => { active = false; };
    // Account initialization is once per mounted locale page, not per edit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function choose(card: OpsoCard | null) {
    setSelected(card); setProfile(card ? { ...card.profile } : { ...emptyProfile, email: user?.email ?? "" }); setPrivacy(card ? { ...card.privacy } : { ...defaultPrivacy });
    setCardLocale(card?.cardLocale ?? locale); setVisibility(card && ["public", "unlisted", "private", "event_only"].includes(card.visibility) ? card.visibility as OpsoDraft["visibility"] : "private");
    if (!card) setVisibility("public"); setSlug(card?.slug ?? ""); setEditing(true); setConflict(false); setCheckedPreview(null); setMessage("");
  }
  function savedCard(card: OpsoCard) { setSelected(card); setCards((old) => [card, ...old.filter((item) => item.id !== card.id)]); setProfile({ ...card.profile }); setPrivacy({ ...card.privacy }); setCardLocale(card.cardLocale); setVisibility(card.visibility as OpsoDraft["visibility"]); setConflict(false); }
  function clearPreview() { setCheckedPreview(null); }
  async function signIn(event: FormEvent) {
    event.preventDefault(); await run(async () => {
      if (!challenge) { await api("session"); await api("start", { email }); setChallenge(true); show(c.codeSent); }
      else { const session = await api<{ user: OpsoIdentity }>("verify", { code }); setUser(session.user); setCode(""); setChallenge(false); setEditing(false); setSelected(null); setProfile({ ...emptyProfile }); await load(); }
    });
  }
  async function save(event: FormEvent) {
    event.preventDefault(); await run(async () => {
      const result = selected ? await api<{ card: OpsoCard }>("save", draft) : await api<{ card: OpsoCard }>("create", { goal: "personal_brand", cardLocale, profile, privacy, templateId, slug });
      const created = !selected; savedCard(result.card); show(created ? c.created : c.saved);
    });
  }
  const preview = checkedPreview ?? { ...profile, email: privacy.showEmail ? profile.email : "", phone: privacy.showPhone ? profile.phone : "" };
  const fieldLimits = { name: 120, role: 120, company: 160, email: 254, phone: 40, location: 160 };
  return <article className={styles.page}><div className="wrap">
    <header className={styles.header}><div><p className={styles.eyebrow}>{c.eyebrow}</p><h1>{c.title}</h1><p>{c.intro}</p></div>{user && <div className={styles.identity}><span>{user.email}</span><button disabled={busy} onClick={() => void run(async () => { const result = await api<{ revoked: boolean }>("logout", {}); setUser(null); setCards([]); setEditing(false); setSelected(null); setProfile({ ...emptyProfile }); await api("session"); show(result.revoked ? c.loggedOut : c.logoutPartial); })}>{c.logout}</button></div>}</header>
    {message && <div className={failed ? styles.error : styles.notice} role={failed ? "alert" : "status"}>{message}</div>}
    {!ready ? <p role="status">{c.loading}</p> : !user ? !unavailable && <section className={styles.login}><div><p className={styles.eyebrow}>OpSo</p><h2>{c.signIn}</h2><p>{c.emailHelp}</p></div><form onSubmit={(event) => void signIn(event)}><label>{c.email}<input required type="email" autoComplete="email" maxLength={254} value={email} disabled={busy || challenge} onChange={(event) => setEmail(event.target.value)} /></label>{challenge && <label>{c.code}<input autoFocus required inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" minLength={6} maxLength={6} value={code} disabled={busy} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} /></label>}<button className="btn btn-primary" disabled={busy}>{busy ? c.working : challenge ? c.verify : c.sendCode}</button>{challenge && <button type="button" disabled={busy} onClick={() => { setChallenge(false); setCode(""); setMessage(""); }}>{c.changeEmail}</button>}</form></section> : !editing ? <section>
      <div className={styles.sectionHeading}><h2>{c.cards}</h2>{cards.length === 0 && <button className="btn btn-primary" disabled={busy} onClick={() => choose(null)}>{c.create}</button>}</div>
      {cards.length === 0 ? <div className={styles.empty}><h3>{c.empty}</h3><p>{c.emptyHelp}</p></div> : <div className={styles.cardGrid}>{cards.map((card) => <div className={styles.cardTile} key={card.id}><span className={styles.badge}>{card.status === "published" ? c.publishedStatus : c.draft}</span><h3>{card.profile.name || card.slug}</h3><p>{[card.profile.role, card.profile.company].filter(Boolean).join(" · ")}</p><p className={styles.small}>opso.cc/{card.slug}</p><button className="btn btn-secondary" disabled={busy} onClick={() => choose(card)}>{c.edit}</button>{card.url && <a href={card.url} target="_blank" rel="noopener noreferrer">{c.openCard} ↗</a>}</div>)}</div>}
    </section> : <section>
      <div className={styles.sectionHeading}><button disabled={busy} onClick={() => setEditing(false)}>← {c.back}</button><h2>{selected ? c.edit : c.create}</h2></div>
      <div className={styles.editor}><div><form onSubmit={(event) => void save(event)} className={styles.form}>
        <fieldset disabled={busy}><legend>{c.edit}</legend><div className={styles.fields}>{(Object.keys(fieldLimits) as (keyof OpsoProfile)[]).map((key) => <label key={key}>{c[key]}<input required={key === "name"} type={key === "email" ? "email" : key === "phone" ? "tel" : "text"} maxLength={fieldLimits[key]} value={profile[key]} onChange={(event) => { setProfile({ ...profile, [key]: event.target.value }); clearPreview(); }} /></label>)}<label>{c.language}<select value={cardLocale} onChange={(event) => { setCardLocale(event.target.value as OpsoLocale); clearPreview(); }}><option value="de">Deutsch</option><option value="en">English</option><option value="tr">Türkçe</option></select></label></div></fieldset>
        {!selected && <><fieldset disabled={busy}><legend>{c.layout}</legend><p>{c.layoutHelp}</p><div className={styles.layouts}>{templates.map((template) => <label className={templateId === template.id ? styles.layoutSelected : styles.layout} key={template.id}><input type="radio" name="layout" required value={template.id} checked={templateId === template.id} onChange={() => setTemplateId(template.id)} /><span aria-hidden="true" style={{ background: template.accent }} /><strong>{template.name}</strong><small>{template.description}</small></label>)}</div></fieldset><fieldset disabled={busy}><legend>{c.slug}</legend><label><span className={styles.small}>opso.cc/</span><input required value={slug} pattern="[a-z0-9][a-z0-9\-]{1,62}[a-z0-9]" minLength={3} maxLength={64} onChange={(event) => setSlug(event.target.value.toLowerCase())} aria-describedby="slug-help" /></label><p id="slug-help" className={styles.small}>{c.slugHelp}</p><button type="button" onClick={() => void run(async () => { const result = await api<{ available: boolean }>("slug", { slug }); show(result.available ? c.slugAvailable : c.slugTaken, !result.available); })}>{c.checkSlug}</button></fieldset></>}
        <fieldset disabled={busy}><legend>{c.privacy}</legend>{(Object.keys(defaultPrivacy) as (keyof OpsoPrivacy)[]).map((key) => <label className={styles.checkbox} key={key}><input type="checkbox" checked={privacy[key]} onChange={(event) => { setPrivacy({ ...privacy, [key]: event.target.checked }); clearPreview(); }} />{c[key]}</label>)}{selected && <><label>{c.visibility}<select value={visibility} onChange={(event) => setVisibility(event.target.value as OpsoDraft["visibility"])}><option value="public">{c.public}</option><option value="unlisted">{c.unlisted}</option><option value="private">{c.private}</option>{selected.visibility === "event_only" && <option value="event_only">{c.eventOnly}</option>}</select></label><p className={styles.small}>{c.visibilityHelp}</p></>}</fieldset>
        <button className="btn btn-primary" disabled={busy || conflict || (!selected && !templateId)}>{busy ? c.working : selected ? c.save : c.create}</button>
      </form>
      {conflict && <div className={styles.notice}><p>{c.conflictHelp}</p><button disabled={busy} onClick={() => void run(async () => { const current = (await load()).find((card) => card.id === selected?.id); if (current) choose(current); })}>{c.refresh}</button></div>}
      {selected && <div className={styles.publish}>{terms && !terms.accepted && <><label className={styles.checkbox}><input type="checkbox" checked={accepted} disabled={busy} onChange={(event) => setAccepted(event.target.checked)} />{c.terms}</label><a href={terms.documentUrl} target="_blank" rel="noopener noreferrer">{c.readTerms} ↗</a></>}<button className="btn btn-primary" disabled={busy || dirty || conflict || !terms || (!terms.accepted && !accepted)} onClick={() => void run(async () => { if (!terms?.accepted) setTerms(await api<OpsoTerms>("accept-terms", { version: terms!.version, language: locale, accepted: true })); const result = await api<{ card: OpsoCard }>("publish", { id: selected.id, expectedRevision: selected.draftRevision }); savedCard(result.card); show(c.published); })}>{c.publish}</button>{dirty && <p className={styles.small}>{c.savedFirst}</p>}{selected.url && <div className={styles.share}><a href={selected.url} target="_blank" rel="noopener noreferrer">{c.openCard} ↗</a><p>{selected.url}</p><button disabled={busy} onClick={() => void run(async () => { await navigator.clipboard.writeText(selected.url!); show(c.copied); })}>{c.copyLink}</button></div>}</div>}
      </div><aside className={styles.preview}><p className={styles.eyebrow}>{c.profilePreview}</p><div className={styles.previewCard}><span className={styles.monogram} aria-hidden="true">{preview.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("") || "O"}</span><h3>{preview.name || c.name}</h3><p>{preview.role}</p><strong>{preview.company}</strong>{preview.email && <p className={styles.previewContact}>{preview.email}</p>}{preview.phone && <p className={styles.previewContact}>{preview.phone}</p>}<div className={styles.wordmark}>OpSo<span>by OpSolid</span></div></div><p className={styles.small}>{c.previewHelp}</p>{selected && <button className="btn btn-secondary" disabled={busy || conflict} onClick={() => void run(async () => { const result = await api<{ preview: typeof checkedPreview }>("preview", draft); setCheckedPreview(result.preview); show(c.verifiedPreview); })}>{c.serverPreview}</button>}</aside></div>
    </section>}
    <footer className={styles.companion}><div><h2>{c.companion}</h2><p>{c.companionHelp}</p><Link className="btn btn-secondary" href={`/${locale}/opso#availability`}>{c.availability} ↗</Link></div><div><p>{c.legacy}</p><Link href={`/${locale}/dashboard/cards`}>{c.legacyLink} ↗</Link></div></footer>
  </div></article>;
}
