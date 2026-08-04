export type UiMessages = {
  brand: {
    home: string;
    tagline: string;
  };
  nav: {
    primary: string;
    explore: string;
    systems: string;
    lessons: string;
    library: string;
    notes: string;
  };
  search: {
    placeholder: string;
  };
  a11y: {
    profile: string;
    openLibrary: string;
    closeLibrary: string;
    savedOrgans: string;
    closeComparison: string;
    close: string;
    learningResources: string;
    playAnimation: string;
    seeInBody: string;
    organComparison: string;
    thumbnail: string;
    illustration: string;
    microscopic: string;
    comparisonArt: string;
    systemArt: string;
    organIllustration: string;
  };
  library: {
    title: string;
    viewAll: string;
    quote: string;
    keepExploring: string;
  };
  info: {
    theOrgan: string;
    keyFacts: string;
    size: string;
    weight: string;
    daily: string;
    location: string;
    bloodSupply: string;
    function: string;
    medical: string;
    didYouKnow: string;
    viewLesson: string;
    animate: string;
    quiz: string;
    compare: string;
  };
  compare: {
    comparing: string;
    reference: string;
    vs: string;
    primaryRole: string;
    scale: string;
  };
  cards: {
    microscopic: string;
    exploreTissue: string;
    compareOrgans: string;
    openComparison: string;
    functionAnimation: string;
    playAnimation: string;
    clinicalNotes: string;
    commonConditions: string;
    seeAll: string;
    whereItWorks: string;
    seeTheSystem: string;
  };
  modal: {
    guided: string;
    quizTitle: string;
    animationTitle: string;
    systemTitle: string;
    lessonTitle: string;
    quizPrompt: string;
    quizOption1: string;
    quizOption2: string;
    quizOption3: string;
    systemBody: string;
    studyBody: string;
    system: string;
    primaryRole: string;
    bloodSupply: string;
    continue: string;
  };
  viewer: {
    label: string;
    tools: string;
    rotate: string;
    zoom: string;
    isolate: string;
    section: string;
    layers: string;
    compare: string;
    reset: string;
    tip: string;
    tipBody: string;
    preparing: string;
    autoRotate: string;
    caption: string;
    canvasAria: string;
  };
  language: {
    label: string;
    switchTo: string;
  };
};

export const uiEn: UiMessages = {
  brand: {
    home: "Anatomy Atelier home",
    tagline: "Learn anatomy like an artist",
  },
  nav: {
    primary: "Primary navigation",
    explore: "Explore",
    systems: "Systems",
    lessons: "Lessons",
    library: "Library",
    notes: "Notes",
  },
  search: {
    placeholder: "Search organs, topics…",
  },
  a11y: {
    profile: "Open learner profile",
    openLibrary: "Open organ library",
    closeLibrary: "Close library",
    savedOrgans: "Saved organs",
    closeComparison: "Close comparison",
    close: "Close",
    learningResources: "{name} learning resources",
    playAnimation: "Play the {name} function animation",
    seeInBody: "See where the {name} sits in the body",
    organComparison: "Organ comparison",
    thumbnail: "{name} thumbnail",
    illustration: "{name} anatomical illustration",
    microscopic: "{name} microscopic tissue view",
    comparisonArt: "{name} anatomical comparison",
    systemArt: "{name} shown in place within the {system}",
    organIllustration: "{name} illustration",
  },
  library: {
    title: "Organ library",
    viewAll: "View all organs",
    quote: "Learning is\nan act of curiosity.",
    keepExploring: "Keep exploring!",
  },
  info: {
    theOrgan: "The {name}",
    keyFacts: "Key facts",
    size: "Size",
    weight: "Weight",
    daily: "Daily",
    location: "Location",
    bloodSupply: "Blood supply",
    function: "Function",
    medical: "Medical importance",
    didYouKnow: "Did you know",
    viewLesson: "View lesson",
    animate: "Animate",
    quiz: "Quiz",
    compare: "Compare",
  },
  compare: {
    comparing: "Comparing",
    reference: "Reference",
    vs: "vs.",
    primaryRole: "Primary role",
    scale: "Scale",
  },
  cards: {
    microscopic: "Microscopic view",
    exploreTissue: "Explore tissue",
    compareOrgans: "Compare organs",
    openComparison: "Open comparison",
    functionAnimation: "Function animation",
    playAnimation: "Play animation",
    clinicalNotes: "Clinical notes",
    commonConditions: "Common conditions",
    seeAll: "See all",
    whereItWorks: "Where it works",
    seeTheSystem: "See the system",
  },
  modal: {
    guided: "Guided discovery",
    quizTitle: "{name} quick quiz",
    animationTitle: "{name} in motion",
    systemTitle: "{name} in the body",
    lessonTitle: "Inside the {name}",
    quizPrompt: "Which statement best describes the {name}?",
    quizOption1: "It plays a specialized role in maintaining the body",
    quizOption2: "It works completely independently",
    quizOption3: "It is active only during sleep",
    systemBody: "{location}. Trace how the {name} connects to the rest of the body.",
    studyBody: "Follow the highlighted structures, rotate the specimen, and connect form with function. This short study moment is designed to build a durable mental model.",
    system: "System",
    primaryRole: "Primary role",
    bloodSupply: "Blood supply",
    continue: "Continue exploring",
  },
  viewer: {
    label: "{name} interactive viewer",
    tools: "3D viewer tools",
    rotate: "Rotate",
    zoom: "Zoom",
    isolate: "Isolate",
    section: "Cross-section",
    layers: "Layers",
    compare: "Compare",
    reset: "Reset",
    tip: "Tip",
    tipBody: "Drag to rotate\nScroll to zoom\nClick a dot to learn more",
    preparing: "Preparing the {name}",
    autoRotate: "Auto rotate",
    caption: "3D specimen · click a dot to explore",
    canvasAria: "Interactive 3D anatomy model. Drag to rotate, scroll to zoom, and click a dot to read about that structure.",
  },
  language: {
    label: "Language",
    switchTo: "Switch language to {label}",
  },
};
