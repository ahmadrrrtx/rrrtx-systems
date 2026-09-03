// Renders sample partner documents from the uploaded master templates.
// Used to generate the public /partners carousel artwork and to sanity-check
// the template overlay pipeline. Not part of the application runtime.
//
// Run:  npx tsx scripts/render-partner-samples.ts

import fs from "fs/promises";
import path from "path";
import { buildTemplatePdf } from "../src/lib/partner-template-doc";

const OUT = path.join(process.cwd(), "public", "assets", "templates", "samples");

const SAMPLE = {
  name: "Ayesha Khan",
  firstName: "Ayesha",
  country: "Pakistan",
  rankLabel: "Bronze",
  partnerId: "RRRTX-A7K29",
  issueDate: "September 03, 2026",
  documentId: "RRRTX-CERT-2026-0001",
  verificationUrl: "https://rrrtx-systems.com/verify/RRRTX-CERT-2026-0001",
};

async function main() {
  await fs.mkdir(OUT, { recursive: true });

  const certificate = await buildTemplatePdf("certificate", {
    name: SAMPLE.name,
    rankLabel: SAMPLE.rankLabel,
    partnerId: SAMPLE.partnerId,
    issueDate: SAMPLE.issueDate,
    documentId: SAMPLE.documentId,
    verificationUrl: SAMPLE.verificationUrl,
  });
  await fs.writeFile(path.join(OUT, "certificate-sample.pdf"), certificate);

  const letter = await buildTemplatePdf("joining_letter", {
    name: SAMPLE.name,
    firstName: SAMPLE.firstName,
    country: SAMPLE.country,
    rankLabel: SAMPLE.rankLabel,
    partnerId: SAMPLE.partnerId,
    issueDate: SAMPLE.issueDate,
  });
  await fs.writeFile(path.join(OUT, "joining-letter-sample.pdf"), letter);

  const agreement = await buildTemplatePdf("agreement", {
    name: SAMPLE.name,
    issueDate: SAMPLE.issueDate,
    acceptanceRecordId: "RRRTX-AG-2026-0001",
  });
  await fs.writeFile(path.join(OUT, "agreement-sample.pdf"), agreement);

  console.log("Rendered:", ["certificate-sample.pdf", "joining-letter-sample.pdf", "agreement-sample.pdf"].join(", "));
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
