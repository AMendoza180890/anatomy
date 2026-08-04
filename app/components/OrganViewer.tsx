"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  CircleDashed,
  Layers3,
  Maximize2,
  RotateCcw,
  ScanLine,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import type { Hotspot, Organ } from "../lib/anatomy-data";
import type { AnatomyViewer } from "../lib/three/viewer";
import { useI18n } from "../i18n/useI18n";

type Props = {
  organ: Organ;
  autoRotate: boolean;
  onAutoRotate: (enabled: boolean) => void;
  compare: boolean;
  onCompare: () => void;
};

export function OrganViewer({ organ, autoRotate, onAutoRotate, compare, onCompare }: Props) {
  const { t, locale } = useI18n();
  const mountRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<AnatomyViewer | null>(null);
  const organRef = useRef(organ);
  const autoRotateRef = useRef(autoRotate);
  const [selected, setSelected] = useState<Hotspot | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [slowLoad, setSlowLoad] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);

  // A typical organ is ready well inside a second — flashing a loading panel for
  // that reads as jank. It only appears if the fetch is genuinely slow; the flag
  // is cleared by onLoading when the next load starts.
  useEffect(() => {
    if (!loading) return;
    const timer = window.setTimeout(() => setSlowLoad(true), 900);
    return () => window.clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    organRef.current = organ;
  }, [organ]);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    let cancelled = false;
    let viewer: AnatomyViewer | null = null;

    void import("../lib/three/viewer").then(({ AnatomyViewer: Viewer }) => {
      if (cancelled || !mountRef.current) return;
      viewer = new Viewer(mountRef.current, {
        onSelect: (hotspot) => {
          if (!hotspot) {
            setSelected(null);
            return;
          }
          // Resolve labels from the live locale catalog so switching language
          // does not require reloading the GLB.
          const localized = organRef.current.hotspots.find((item) => item.id === hotspot.id);
          setSelected(localized ?? hotspot);
        },
        onLoading: (isLoading, value) => {
          setLoading(isLoading);
          setProgress(value);
          if (isLoading) setSlowLoad(false);
        },
      });
      viewerRef.current = viewer;
      viewer.setAutoRotate(autoRotateRef.current);
      viewer.setAriaLabel(t("viewer.canvasAria"));
      const current = organRef.current;
      viewer.setOrgan(current.model, current.hotspots, current.accent).catch(() => {
        setLoading(false);
        setProgress(0);
      });
    });

    return () => {
      cancelled = true;
      viewerRef.current = null;
      viewer?.dispose();
    };
    // Intentionally mount-once; locale aria updates via a dedicated effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    viewerRef.current?.setOrgan(organ.model, organ.hotspots, organ.accent).catch(() => {
      setLoading(false);
      setProgress(0);
    });
    // Reload only when the specimen changes — not when locale copy updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organ.id, organ.model, organ.accent]);

  useEffect(() => viewerRef.current?.setAutoRotate(autoRotate), [autoRotate]);

  useEffect(() => {
    viewerRef.current?.setAriaLabel(t("viewer.canvasAria"));
  }, [locale, t]);

  // Keep the selected hotspot's copy in sync when the locale changes.
  useEffect(() => {
    setSelected((current) => {
      if (!current) return null;
      return organ.hotspots.find((hotspot) => hotspot.id === current.id) ?? null;
    });
  }, [organ]);

  // The viewer drives the callout's position directly, so a spinning model
  // never costs a React render.
  const calloutRef = useCallback((node: HTMLDivElement | null) => {
    viewerRef.current?.attachCallout(node);
  }, []);

  const handleTool = (tool: string) => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    if (tool === "rotate") onAutoRotate(!autoRotate);
    if (tool === "zoom") viewer.zoom(-1);
    if (tool === "isolate") setActiveTool(viewer.toggleIsolate() ? tool : null);
    if (tool === "section") setActiveTool(viewer.toggleCrossSection() ? tool : null);
    if (tool === "layers") setActiveTool(viewer.toggleLayers() ? tool : null);
    if (tool === "compare") onCompare();
    if (tool === "reset") {
      viewer.reset();
      setActiveTool(null);
    }
  };

  const tools = useMemo(
    () => [
      { id: "rotate", label: t("viewer.rotate"), icon: RotateCcw },
      { id: "zoom", label: t("viewer.zoom"), icon: Search },
      { id: "isolate", label: t("viewer.isolate"), icon: CircleDashed },
      { id: "section", label: t("viewer.section"), icon: ScanLine },
      { id: "layers", label: t("viewer.layers"), icon: Layers3 },
      { id: "compare", label: t("viewer.compare"), icon: Box },
      { id: "reset", label: t("viewer.reset"), icon: RotateCcw },
    ],
    [t],
  );

  const tipLines = t("viewer.tipBody").split("\n");

  return (
    <section className="viewer-shell" aria-label={t("viewer.label", { name: organ.name })}>
      <div className="viewer-glow" style={{ "--organ-accent": organ.accent } as React.CSSProperties} />
      <div ref={mountRef} className="three-mount" />

      <div className="viewer-tools" aria-label={t("viewer.tools")}>
        {tools.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`tool-button ${(activeTool === id || (id === "compare" && compare)) ? "active" : ""}`}
            onClick={() => handleTool(id)}
            aria-pressed={activeTool === id || (id === "compare" && compare)}
            title={label}
          >
            <Icon size={19} strokeWidth={1.65} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <aside className="tip-note" aria-label={t("viewer.tip")}>
        <span><Sparkles size={15} /> {t("viewer.tip")}</span>
        <p>{tipLines.map((line, index) => (
          <span key={line}>{index > 0 ? <br /> : null}{line}</span>
        ))}</p>
      </aside>

      {selected && (
        <div className="hotspot-callout" ref={calloutRef} data-side="right">
          <div className="callout-body" style={{ "--hotspot-color": selected.color } as React.CSSProperties}>
            <button className="callout-close" type="button" onClick={() => viewerRef.current?.clearSelection()} aria-label={t("a11y.close")}>
              <X size={13} />
            </button>
            <b>{selected.label}</b>
            <small>{selected.detail}</small>
          </div>
        </div>
      )}

      {/* Screen-reader equivalent of the dots, which live in the canvas. */}
      <ul className="hotspot-index">
        {organ.hotspots.map((hotspot) => (
          <li key={hotspot.id}>{hotspot.label}: {hotspot.detail}</li>
        ))}
      </ul>

      {loading && slowLoad && (
        <div className="model-loader" role="status" aria-live="polite">
          <div className="loader-orbit"><Maximize2 size={20} /></div>
          <strong>{t("viewer.preparing", { name: organ.name.toLowerCase() })}</strong>
          <span>{Math.max(8, Math.round(progress * 100))}%</span>
        </div>
      )}

      <button className="auto-rotate" type="button" onClick={() => onAutoRotate(!autoRotate)} aria-pressed={autoRotate}>
        <RotateCcw size={14} /> {t("viewer.autoRotate")}
        <span className={`switch ${autoRotate ? "on" : ""}`}><i /></span>
      </button>

      <div className="view-caption">
        <span>{t("viewer.caption")}</span>
        <strong>{organ.scientificName}</strong>
      </div>
    </section>
  );
}
