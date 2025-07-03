import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";

import styles from "./index.module.css";

export default function Home(): JSX.Element {
  return (
    <Layout
      title='마녀의 문서 저장소'
      description='마녀(김성현)의 문서와 메모 저장소'
    >
      <main>
        <div className={styles.features}>
          <h1>
            <Link to='https://witch.work/'>마녀(김성현)</Link>가 본 문서와 관련
            메모를 저장하는 곳
          </h1>
        </div>
      </main>
    </Layout>
  );
}
