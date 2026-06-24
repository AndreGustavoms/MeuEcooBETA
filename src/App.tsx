import Hero from './components/Hero';
import FeatureRow from './components/FeatureRow';
import FaqAccordion from './components/FaqAccordion';
import Footer from './components/Footer';
import { features } from './data/content';

export default function App() {
  return (
    <>
      <Hero />
      {features.map((feature) => (
        <FeatureRow key={feature.id} feature={feature} />
      ))}
      <FaqAccordion />
      <Footer />
    </>
  );
}
