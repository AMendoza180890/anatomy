import { AnatomyApp } from "./components/AnatomyApp";
import { I18nProvider } from "./i18n/I18nProvider";

export default function Home() {
  return (
    <I18nProvider>
      <AnatomyApp />
    </I18nProvider>
  );
}
