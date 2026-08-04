"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  BrainCircuit,
  ChevronDown,
  CircleHelp,
  Compass,
  FileText,
  Heart,
  LibraryBig,
  Microscope,
  NotebookPen,
  Play,
  Search,
  Share2,
  Sparkles,
  Stethoscope,
  X,
} from "lucide-react";
import { OrganViewer } from "./OrganViewer";
import { LanguageSwitcher } from "../i18n/LanguageSwitcher";
import { useI18n } from "../i18n/useI18n";
import type { Organ, OrganId } from "../lib/anatomy-data";

type Modal = "lesson" | "quiz" | "animation" | "system" | null;

/**
 * Renders an organ illustration, or its accent glyph for organs that ship as a
 * 3D model without the painted asset set. Keeps every image slot filled instead
 * of leaving a broken `<img>` behind.
 */
function OrganArt({
  organ,
  asset,
  alt,
  size,
}: {
  organ: Organ;
  asset: "thumb" | "organ" | "microscopic" | "compare" | "location";
  alt: string;
  size?: number;
}) {
  if (!organ.illustrated) {
    // An empty alt means a surrounding control already names this, so the
    // glyph should be skipped rather than announced with no label.
    const labelling = alt ? { role: "img", "aria-label": alt } : { "aria-hidden": true };
    return (
      <span className="art-fallback" style={{ "--art-accent": organ.accent } as React.CSSProperties} {...labelling}>
        {organ.icon}
      </span>
    );
  }
  return (
    <img
      key={`${organ.id}-${asset}`}
      src={`/anatomy/${organ.id}/${asset}.webp`}
      alt={alt}
      width={size}
      height={size}
      loading={asset === "thumb" ? "eager" : "lazy"}
      decoding="async"
    />
  );
}

export function AnatomyApp() {
  const { t, organs, organById } = useI18n();
  const [organId, setOrganId] = useState<OrganId>("heart");
  const [autoRotate, setAutoRotate] = useState(true);
  const [compare, setCompare] = useState(false);
  const [modal, setModal] = useState<Modal>(null);
  const [query, setQuery] = useState("");
  const [mobileLibrary, setMobileLibrary] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const prefetched = useRef(new Set<OrganId>());
  const organ = organById[organId];
  const reference = organById[organId === "heart" ? "brain" : "heart"];
  const filteredOrgans = useMemo(
    () => organs.filter((item) => `${item.name} ${item.system}`.toLowerCase().includes(query.toLowerCase())),
    [organs, query],
  );

  useEffect(() => {
    if (!contentRef.current) return;
    gsap.fromTo(contentRef.current.querySelectorAll("[data-reveal]"),
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.48, stagger: 0.035, ease: "power2.out", overwrite: true },
    );
  }, [organId]);

  const selectOrgan = (id: OrganId) => {
    if (organById[id].illustrated) {
      ["organ", "microscopic", "compare", "location"].forEach((asset) => {
        const image = new Image();
        image.src = `/anatomy/${id}/${asset}.webp`;
      });
    }
    setOrganId(id);
    setMobileLibrary(false);
    setCompare(false);
  };

  // Warms the model in the HTTP cache while the pointer is still travelling,
  // so the switch usually renders without a visible loading pass.
  const prefetchOrgan = (id: OrganId) => {
    if (id === organId || prefetched.current.has(id)) return;
    prefetched.current.add(id);
    void fetch(organById[id].model, { priority: "low" } as RequestInit).catch(() => {});
  };

  const quoteLines = t("library.quote").split("\n");

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand" type="button" onClick={() => selectOrgan("heart")} aria-label={t("brand.home")}>
          <strong>Anatomy Atelier<sup>✦</sup></strong>
          <em>{t("brand.tagline")}</em>
        </button>
        <nav className="main-nav" aria-label={t("nav.primary")}>
          <button className="active"><Compass size={17} /> {t("nav.explore")}</button>
          <button><BrainCircuit size={17} /> {t("nav.systems")}</button>
          <button onClick={() => setModal("lesson")}><BookOpen size={17} /> {t("nav.lessons")}</button>
          <button><LibraryBig size={17} /> {t("nav.library")}</button>
          <button><NotebookPen size={17} /> {t("nav.notes")}</button>
        </nav>
        <label className="search-box">
          <Search size={17} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("search.placeholder")} />
        </label>
        <LanguageSwitcher />
        <button className="profile" aria-label={t("a11y.profile")}><span>MA</span><ChevronDown size={15} /></button>
        <button className="mobile-library-trigger" onClick={() => setMobileLibrary(true)} aria-label={t("a11y.openLibrary")}><LibraryBig size={20} /></button>
      </header>

      <div className="workspace">
        <aside className={`organ-library ${mobileLibrary ? "open" : ""}`}>
          <div className="panel-heading">
            <span>{t("library.title")}</span>
            <button aria-label={t("a11y.closeLibrary")} className="mobile-close" onClick={() => setMobileLibrary(false)}><X size={17} /></button>
            <button aria-label={t("a11y.savedOrgans")}><Bookmark size={17} /></button>
          </div>
          <div className="organ-list">
            {filteredOrgans.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`organ-item ${organId === item.id ? "active" : ""}`}
                onClick={() => selectOrgan(item.id)}
                onPointerEnter={() => prefetchOrgan(item.id)}
                onFocus={() => prefetchOrgan(item.id)}
                style={{ "--item-accent": item.accent } as React.CSSProperties}
              >
                <span className="organ-glyph">
                  <OrganArt organ={item} asset="thumb" alt={t("a11y.thumbnail", { name: item.name })} size={47} />
                </span>
                <span><b>{item.name}</b><small>{item.system}</small></span>
                {organId === item.id && <Heart className="favorite" size={14} fill="currentColor" />}
              </button>
            ))}
          </div>
          <button className="view-all" onClick={() => setQuery("")}>{t("library.viewAll")} <ArrowRight size={14} /></button>
          <blockquote>
            <Sparkles size={18} />
            <p>{quoteLines.map((line, index) => (
              <span key={line}>{index > 0 ? <br /> : null}{line}</span>
            ))}</p>
            <em>{t("library.keepExploring")}</em>
          </blockquote>
        </aside>

        <OrganViewer
          organ={organ}
          autoRotate={autoRotate}
          onAutoRotate={setAutoRotate}
          compare={compare}
          onCompare={() => setCompare(!compare)}
        />

        <aside className="info-panel" ref={contentRef}>
          <div className="info-kicker" data-reveal><Heart size={13} fill="currentColor" /> {t("info.theOrgan", { name: organ.name })}</div>
          <div className="info-title-row" data-reveal>
            <div><h1>{organ.name}</h1><em>{organ.poetic}</em></div>
            <span className="specimen-stamp">
              <OrganArt organ={organ} asset="organ" alt={t("a11y.illustration", { name: organ.name })} size={92} />
            </span>
          </div>
          <p className="description" data-reveal>{organ.description}</p>
          <div className="rule" />
          <h2 data-reveal>{t("info.keyFacts")}</h2>
          <dl className="key-facts">
            <div data-reveal><dt><span>◇</span> {t("info.size")}</dt><dd>{organ.size}</dd></div>
            <div data-reveal><dt><span>♙</span> {t("info.weight")}</dt><dd>{organ.weight}</dd></div>
            <div data-reveal><dt><span>⌁</span> {t("info.daily")}</dt><dd>{organ.dailyFact}</dd></div>
            <div data-reveal><dt><span>⌖</span> {t("info.location")}</dt><dd>{organ.location}</dd></div>
            <div data-reveal><dt><span>❋</span> {t("info.bloodSupply")}</dt><dd>{organ.bloodSupply}</dd></div>
            <div data-reveal><dt><span>◈</span> {t("info.function")}</dt><dd>{organ.function}</dd></div>
          </dl>
          <div className="medical-note" data-reveal><Stethoscope size={16} /><p><b>{t("info.medical")}</b>{organ.medical}</p></div>
          <div className="fun-note" data-reveal><Sparkles size={15} /><p><b>{t("info.didYouKnow")}</b>{organ.funFact}</p></div>
          <button className="lesson-button" data-reveal onClick={() => setModal("lesson")}>{t("info.viewLesson")} <ArrowRight size={16} /></button>
          <div className="action-grid" data-reveal>
            <button onClick={() => setModal("animation")}><Play size={15} /> {t("info.animate")}</button>
            <button onClick={() => setModal("quiz")}><CircleHelp size={15} /> {t("info.quiz")}</button>
            <button onClick={() => setCompare(!compare)} className={compare ? "active" : ""}><Share2 size={15} /> {t("info.compare")}</button>
          </div>
        </aside>
      </div>

      {compare && (
        <section className="compare-strip" aria-label={t("a11y.organComparison")}>
          <div className="compare-organ"><OrganArt organ={organ} asset="thumb" alt="" /><span>{t("compare.comparing")}</span><strong>{organ.name}</strong><small>{organ.system}</small></div>
          <b>{t("compare.vs")}</b>
          <div className="compare-organ"><OrganArt organ={reference} asset="thumb" alt="" /><span>{t("compare.reference")}</span><strong>{reference.name}</strong><small>{reference.system}</small></div>
          <dl><div><dt>{t("compare.primaryRole")}</dt><dd>{organ.function}</dd></div><div><dt>{t("compare.scale")}</dt><dd>{organ.size}</dd></div></dl>
          <button onClick={() => setCompare(false)} aria-label={t("a11y.closeComparison")}><X size={16} /></button>
        </section>
      )}

      <section className="learning-cards" aria-label={t("a11y.learningResources", { name: organ.name })}>
        <article className="curiosity-card">
          <span>✿</span>
          <p>{quoteLines.map((line, index) => (
            <span key={line}>{index > 0 ? <br /> : null}{line}</span>
          ))}</p>
          <em>{t("library.keepExploring")}</em>
        </article>
        <article>
          <header><div><em>{t("cards.microscopic")}</em><h3>{organ.tissue}</h3></div><Microscope size={17} /></header>
          <div className="microscope-visual organ-card-image"><OrganArt organ={organ} asset="microscopic" alt={t("a11y.microscopic", { name: organ.name })} /></div>
          <button onClick={() => setModal("lesson")}>{t("cards.exploreTissue")} <ArrowRight size={14} /></button>
        </article>
        <article>
          <header><div><em>{t("cards.compareOrgans")}</em><h3>{organ.comparison}</h3></div><Share2 size={17} /></header>
          <div className="comparison-visual organ-card-image"><OrganArt organ={organ} asset="compare" alt={t("a11y.comparisonArt", { name: organ.comparison })} /></div>
          <button onClick={() => setCompare(true)}>{t("cards.openComparison")} <ArrowRight size={14} /></button>
        </article>
        <article>
          <header><div><em>{t("cards.functionAnimation")}</em><h3>{organ.function}</h3></div><Play size={17} /></header>
          {/* The artwork itself is the control, so the play badge inside it is
              decorative rather than a nested button. */}
          <button
            type="button"
            className="function-visual organ-card-image"
            onClick={() => setModal("animation")}
            aria-label={t("a11y.playAnimation", { name: organ.name.toLowerCase() })}
          >
            <OrganArt organ={organ} asset="organ" alt="" />
            <i className="function-pulse" />
            <span className="play-badge"><Play size={18} fill="currentColor" /></span>
          </button>
          <button onClick={() => setModal("animation")}>{t("cards.playAnimation")} <ArrowRight size={14} /></button>
        </article>
        <article>
          <header><div><em>{t("cards.clinicalNotes")}</em><h3>{t("cards.commonConditions")}</h3></div><FileText size={17} /></header>
          <ul>{organ.conditions.map((condition) => <li key={condition}>{condition}</li>)}</ul>
          <button onClick={() => setModal("lesson")}>{t("cards.seeAll")} <ArrowRight size={14} /></button>
        </article>
        <article className="system-card">
          <header><div><em>{t("cards.whereItWorks")}</em><h3>{organ.system}</h3></div><BrainCircuit size={17} /></header>
          <button
            type="button"
            className="system-visual organ-card-image"
            onClick={() => setModal("system")}
            aria-label={t("a11y.seeInBody", { name: organ.name.toLowerCase() })}
          >
            <OrganArt organ={organ} asset="location" alt="" />
          </button>
          <button onClick={() => setModal("system")}>{t("cards.seeTheSystem")} <ArrowRight size={14} /></button>
        </article>
      </section>

      {modal && <LearningModal type={modal} organ={organ} onClose={() => setModal(null)} />}
      {mobileLibrary && <button className="drawer-backdrop" aria-label={t("a11y.closeLibrary")} onClick={() => setMobileLibrary(false)} />}
    </main>
  );
}

const MODAL_ICON: Record<Exclude<Modal, null>, string> = {
  quiz: "?",
  animation: "▶",
  system: "⌖",
  lesson: "✦",
};

function LearningModal({ type, organ, onClose }: { type: Exclude<Modal, null>; organ: Organ; onClose: () => void }) {
  const { t } = useI18n();
  const organName = organ.name;
  const nameLower = organName.toLowerCase();
  const title =
    type === "quiz" ? t("modal.quizTitle", { name: organName })
    : type === "animation" ? t("modal.animationTitle", { name: organName })
    // Avoids gluing onto `system`, whose wording varies per organ
    // ("Cardiovascular" vs "Nervous System"), and stays grammatical for the
    // plural organs too.
    : type === "system" ? t("modal.systemTitle", { name: organName })
    : t("modal.lessonTitle", { name: nameLower });
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className={`learning-modal ${type === "system" ? "wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label={t("a11y.close")}><X size={18} /></button>
        <span className="modal-icon">{MODAL_ICON[type]}</span>
        <em>{t("modal.guided")}</em>
        <h2 id="modal-title">{title}</h2>
        {type === "quiz" ? (
          <div className="quiz-options">
            <p>{t("modal.quizPrompt", { name: nameLower })}</p>
            <button onClick={onClose}>{t("modal.quizOption1")}</button>
            <button onClick={onClose}>{t("modal.quizOption2")}</button>
            <button onClick={onClose}>{t("modal.quizOption3")}</button>
          </div>
        ) : type === "system" ? (
          <>
            <p>{t("modal.systemBody", { location: organ.location, name: nameLower })}</p>
            {/* Shown whole rather than cropped into the circular demo — the
                point of this view is the figure and its vessels. */}
            <figure className="modal-figure">
              <OrganArt organ={organ} asset="location" alt={t("a11y.systemArt", { name: organName, system: organ.system.toLowerCase() })} />
            </figure>
            <dl className="modal-facts">
              <div><dt>{t("modal.system")}</dt><dd>{organ.system}</dd></div>
              <div><dt>{t("modal.primaryRole")}</dt><dd>{organ.function}</dd></div>
              <div><dt>{t("modal.bloodSupply")}</dt><dd>{organ.bloodSupply}</dd></div>
            </dl>
            <button className="lesson-button" onClick={onClose}>{t("modal.continue")} <ArrowRight size={16} /></button>
          </>
        ) : (
          <>
            <p>{t("modal.studyBody")}</p>
            <div className={`modal-demo ${type === "animation" ? "moving" : ""}`}><OrganArt organ={organ} asset="organ" alt={t("a11y.organIllustration", { name: organName })} /></div>
            <button className="lesson-button" onClick={onClose}>{t("modal.continue")} <ArrowRight size={16} /></button>
          </>
        )}
      </section>
    </div>
  );
}
