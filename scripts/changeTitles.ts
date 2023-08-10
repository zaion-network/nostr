import { readFileSync, readdirSync, writeFileSync } from "fs";
import {
  TopUtilities as HigherUtilities,
  TopUtilities,
} from "../../../../../Desktop/Als Analyzer Project/class/using DeeperUtilities/using DeepUtilites/using LowUtilities/using Utilities/using HighUtilities/using HigherUtilities/TopUtilities";

const {
  JavaScript: {
    ArrayUtils: {
      grabPartToEdit,
      substituteEditedPart,
      FilterCallbacks: {
        startsWithString: startsWith,
        includesString: includes,
        exclude,
        partToEditStartMaker,
        finderMaker,
        definerMaker,
        detailsEditorMaker,
        declarationAdderMaker,
      },
    },
    String_utils: { splitAtChar: splitAt, customTag },
  },
} = HigherUtilities;
type customTagMaker = HigherUtilities.JavaScript.String_utils.customTagMaker;

const splitAtReturn = splitAt(`\n`);

var files = readdirSync(".").filter(startsWith("Nip_")).filter(includes(`ts`));
const toExclude = [
  "Nip_001.ts",
  "Nip_002.ts",
  "Nip_003.ts",
  "Nip_004.ts",
  "Nip_005.ts",
];
files = files.filter(exclude(toExclude));

const file = files[0];

const defineNipName = definerMaker(`    export import Nip_`, `Nip_`, [
  `Nip_`,
  "",
]);

const declarations = readFileSync(`./Nips.ts`)
  .toString()
  .split(`\n`)
  .filter(startsWith(`    ["`))
  .map((e) => e.replace(`    `, ``))
  .map((e) => e.split(`=`))
  .map((e) => [
    e[0].replace(`["`, ``).replace(`"]`, ``).trim(),
    e[1].replaceAll(`"`, ``).replaceAll(`,`, ``).trim(),
  ]);
const addNiptitles: customTagMaker = (
  ...args
) => customTag`    export namespace Nips {
    export interface nipTitles {
      ["${args[0]}"]?: "${args[1]}"
    }
  }`;

const namespaceAdder = detailsEditorMaker(
  defineNipName,
  declarations,
  addNiptitles
);

const common = partToEditStartMaker();
const defineStart = common("declare");
const defineEnd = common(`}`);
const grapPartToEdit = grabPartToEdit(defineStart, defineEnd);

const addNipsAssignment: customTagMaker = (
  ...args
) => /**  */ customTag`${args[0]}

N.Nips.nipTitles = {
  ...N.Nips.nipTitles,
  "${args[1]}": "${args[2]}",
} as const;`;

const declarationAdder = declarationAdderMaker(declarations, addNipsAssignment);

const findIndex = finderMaker(startsWith, `    export`);

interface fileSaver {
  (path: string, content: string): void;
}
const saveFile: fileSaver = (path, content) => {
  writeFileSync(path, content);
  console.log(`Succesfully saved file: ${path}`);
};

let res2 = new TopUtilities.FileEditor(files[0])
  .read(readFileSync)
  .split(splitAtReturn)
  .grabPart(grapPartToEdit)
  .details(findIndex)
  .add(namespaceAdder)
  .add(declarationAdder)
  .substitute(substituteEditedPart).result;

console.log(res2.slice(0, 550));
