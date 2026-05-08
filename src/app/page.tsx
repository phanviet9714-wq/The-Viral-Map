import { getAllConcepts } from '@/lib/markdown';
import ConceptGrid from '@/components/ConceptGrid';

export default async function Home() {
  const concepts = await getAllConcepts();
  
  return (
    <ConceptGrid initialConcepts={concepts} />
  );
}
