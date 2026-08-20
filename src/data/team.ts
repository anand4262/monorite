/**
 * Founders shown in the homepage "Studio" section. imageSrc is null until a
 * real photo is dropped into /public/images/team — the section renders a
 * grayscale monogram placeholder in the meantime instead of breaking.
 */
export interface TeamMember {
  name: string;
  role: string;
  /** Short "years · stack" fragment shown next to the role. Omitted rather
   * than guessed when not confirmed — better an asymmetric pair of cards
   * than an invented credential sitting on a public page. */
  credentials?: string;
  focus: string;
  imageSrc: string | null;
  imageAlt: string;
}

export const team: TeamMember[] = [
  {
    name: "Mahesh Pedapati",
    role: "Co-founder",
    credentials: "3+ yrs · React, Next.js, React Native",
    focus: "Product, systems architecture, and the AI/automation build itself.",
    imageSrc: "/images/team/mahesh.jpg",
    imageAlt: "Mahesh Pedapati, co-founder of Monorite",
  },
  {
    name: "Rahul Yellapu",
    role: "Co-founder",
    credentials: "4+ yrs · Java, Spring, AWS",
    focus: "Backend systems, microservices, and the cloud infrastructure everything runs on.",
    imageSrc: null,
    imageAlt: "Rahul Yellapu, co-founder of Monorite",
  },
];
