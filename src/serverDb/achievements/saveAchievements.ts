import * as Sentry from "@sentry/node";
import { julmustracetDb } from "../dbs";

export default async function saveAchievements(achievements) {
  let hasSentryError = false;
  const result = await julmustracetDb.bulkDocs(achievements);
  // The only reason to get conflicts is because we are doing a delete of a now defunct achievement.
  const retries = result.reduce((ret, doc, index) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (doc.error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (doc.status !== 409) {
        // TODO Log this badboi
        const error = new Error("Achievement save failed.");
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        error.result = doc;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        error.data = achievements[index];
        Sentry.captureException(error);
        hasSentryError = true;
        return ret;
      }
      ret.push(achievements[index]);
    }
    return ret;
  }, []);
  if (hasSentryError) {
    try {
      await Sentry.flush(2000);
    } catch (err) {
      // if it fails it fails
    }
  }
  if (retries.length <= 0) {
    return;
  }
  const newOnes = await julmustracetDb.allDocs({
    keys: retries.map((r) => r._id),
    include_docs: true,
  });

  await julmustracetDb.bulkDocs(
    retries.map((r, i) => ({ ...r, _rev: newOnes[i]._rev }))
  );
}
