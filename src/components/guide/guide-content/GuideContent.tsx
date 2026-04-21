import { guide } from "@/lib/guide/guideContent.json";
import styles from "./GuideContent.module.scss";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

type GuideContentProps = {
  slug: string;
};

type ParagraphBlock = {
  type: "paragraph";
  content: string;
};

type ListBlock = {
  type: "list";
  content: string[];
};

type BodyItem = ParagraphBlock | ListBlock;

type Section = {
  id: string;
  title: string;
  body: BodyItem[];
};

type Guide = {
  id: number;
  slug: string;
  title: string;
  description: string;
  sections?: Section[];
  navigation: any;
};

const GuideContent = ({ slug }: GuideContentProps) => {
  const typedGuide = guide as Guide[];
  const currentGuide = typedGuide.find((g) => g.slug === slug);

  if (!currentGuide) {
    return (
      <div>
        <h1>404</h1>
      </div>
    );
  }

  const renderBlock = (b: BodyItem, i: number) => {
    switch (b.type) {
      case "paragraph":
        return (
          <p key={i} className={styles.content}>
            {b.content}
          </p>
        );

      case "list":
        return (
          <ul key={i}>
            {b.content.map((c, i) => (
              <li key={i} className={styles.listItem}>
                <span>{i + 1}</span> {c}
              </li>
            ))}
          </ul>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.guideContent}>
      <div className={styles.header}>
        <h1 className={styles.title}>{currentGuide.title}</h1>
        <p className={styles.description}>{currentGuide.description}</p>
      </div>
      <div className={styles.body}>
        {currentGuide.sections?.map((s) => (
          <div className={styles.section} key={s.id}>
            <h1 className={styles.title}>{s.title}</h1>
            {s.body.map(renderBlock)}
          </div>
        ))}
      </div>
      <div className={styles.navigation}>
        <div className={styles.back}>
          <FaAngleLeft />
          <div className={styles.text}>
            <span>Previous</span>
            <p>{currentGuide.navigation.backText}</p>
          </div>
        </div>
        <div className={styles.next}>
          <div className={styles.text}>
            <span>Next</span>
            <p>{currentGuide.navigation.nextText}</p>
          </div>
          <FaAngleRight />
        </div>
      </div>
    </div>
  );
};

export default GuideContent;
