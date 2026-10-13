import { site } from "@/content/site";
import typography from "@/styles/typography.module.css";
import styles from "./MeasurementJourney.module.css";

export function MeasurementJourney() {
  return (
    <figure className={styles.figure}>
      <figcaption className={typography.caption}>{site.solution.conceptualLabel}</figcaption>
      <ol className={styles.journey} aria-label={site.solution.journey}>
        {site.solution.nodes.map((node, index) => (
          <li key={node} className={styles.node}>
            <span>{node}</span>
            {index < site.solution.nodes.length - 1 && (
              <>
                <svg className={styles.vertical} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M12 0V22M8 18L12 22L16 18" />
                </svg>
                <svg className={index === 2 ? styles.continuation : styles.horizontal} viewBox={index === 2 ? "0 0 600 48" : "0 0 24 24"} preserveAspectRatio="none" aria-hidden="true" focusable="false">
                  <path d={index === 2 ? "M500 0V24H100V46M96 42L100 46L104 42" : "M0 12H22M18 8L22 12L18 16"} />
                </svg>
              </>
            )}
          </li>
        ))}
      </ol>
      <p className={`${typography.reading} ${typography.body}`}>{site.solution.conditionalReturn}</p>
    </figure>
  );
}
