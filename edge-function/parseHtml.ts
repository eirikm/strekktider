import * as fs from "fs";
import BeautifulDom from "beautiful-dom";
import HTMLElementData from "beautiful-dom/dist/htmlelement";
import { Duration } from "./duration";
import { Entry, EtappeMetadata, LegData, Metadata } from './types';

const fileContent = fs
  .readFileSync("small.html", "latin1")
  .replace(/&nbsp;/gi, "");

const dom = new BeautifulDom(fileContent);

const TABLE = "TABLE";
const TR = "TR";
const TD = "TD";

const tables = dom.getElementsByTagName(TABLE);
const table = tables[0];
const rows: HTMLElementData[] = table.getElementsByTagName(TR);

const debug = false;
const debugCells = false;

const getMetadata = (rows: HTMLElementData[]): Metadata => {
  const headerRow = rows[1];

  const cells = headerRow.getElementsByTagName(TD);

  // drop first and last element of array
  cells.shift();
  cells.pop();

  const etapper: EtappeMetadata[] = cells.map((html: HTMLElementData) => {
    const [etappeNavn, p2] = html.innerText.split(" ")
    const [fraPost, tilPost] = etappeNavn.split("-")
    const postNummer = Number(unwrap(p2))

    return {
      etappeNavn,
      fraPost,
      tilPost,
      postNummer,
    };
  });

  if (debug) console.log("antall etapper: ", etapper.length);

  return { etapper };
};

const getRunnerLegData = (
  cellsInFirstRow: HTMLElementData[],
  cellsInSecondRow: HTMLElementData[]
): LegData[] => {
  const legData: LegData[] = [];
  while (cellsInFirstRow.length > 0 && cellsInSecondRow.length > 0) {
    // etappetid
    const etappetidC = cellsInFirstRow.shift();
    if (debugCells) console.log("etappetidC: ", etappetidC);
    const etappetid = Duration.parse(etappetidC?.innerText);
    if (debug) console.log("etappetid: ", etappetid);

    // etappeplassering
    const etappeplasseringC = cellsInFirstRow.shift();
    if (debugCells) console.log("etappeplasseringC: ", etappeplasseringC);
    const etappeplassering = parsePlassering(etappeplasseringC?.innerText);
    if (debug) console.log("etappeplassering", etappeplassering);

    // totaltid
    const totaltidC = cellsInSecondRow.shift();
    if (debugCells) console.log("totaltidC: ", totaltidC);
    const totaltid = Duration.parse(totaltidC?.innerText);
    if (debug) console.log("totaltid: ", totaltid);

    // totalplassering
    const totalplasseringC = cellsInSecondRow.shift();
    if (debugCells) console.log("totalplasseringC: ", totalplasseringC);
    const totalplassering = parsePlassering(totalplasseringC?.innerText);
    if (debug) console.log("totalplassering: ", totalplassering);

    legData.push({
      etappetid,
      etappeplassering,
      totaltid,
      totalplassering,
    });
  }

  return legData;
};

const unwrap = (str: string | undefined): string | undefined => {
  if (str === undefined) return undefined

  const r = /\((.*?)\)/;
  const m = r.exec(str);

  if (!m) {
    return undefined;
  } else {
    return m[1];
  }
}

const parsePlassering = (str: string | undefined): number | undefined => {
  const r = /\((\d+)\)/;
  if (str === undefined) return undefined;

  const m = r.exec(str);

  if (!m) {
    return undefined;
  } else {
    return Number(m[1]);
  }
};

const parseSluttid = (
  str: string | undefined
): Duration | "disket" | "ikke startet" | undefined => {
  if (str === "disket") return "disket";
  if (str === "ikke startet") return "ikke startet";
  return Duration.parse(str);
};

const getRunnerData = (
  row1?: HTMLElementData,
  row2?: HTMLElementData
): Entry | undefined => {
  if (row1 === undefined || row2 === undefined) return undefined;

  const cellsInFirstRow = row1.getElementsByTagName(TD);
  cellsInFirstRow.pop(); // remove name last in list
  const cellsInSecondRow = row2.getElementsByTagName(TD);
  cellsInSecondRow.pop(); // remove club last in list

  const plasseringC = cellsInFirstRow.shift();
  if (debugCells) console.log("plasseringC: ", plasseringC);
  const plassering =
    !!plasseringC && plasseringC.innerText !== ""!
      ? Number(plasseringC?.innerText)
      : undefined;
  if (debug) console.log("plassering: ", plassering);

  const navnC = cellsInFirstRow.shift();
  if (debugCells) console.log("navnC: ", navnC);
  const navn = navnC?.innerText;
  if (debug) console.log("navn: ", navn);

  const klubbC = cellsInSecondRow.shift();
  if (debugCells) console.log("klubbC: ", klubbC);
  const klubb = klubbC?.innerText;
  if (debug) console.log("klubb: ", klubb);

  const sluttidC = cellsInFirstRow.shift();
  if (debugCells) console.log("sluttidC", sluttidC);
  const sluttid = parseSluttid(sluttidC?.innerText);
  if (debug) console.log("sluttid: ", sluttid?.toString());

  const diffC = cellsInFirstRow.shift();
  if (debugCells) console.group("diffC: ", diffC);
  const diff = !!diffC ? Duration.parse(diffC?.innerText) : undefined;
  if (debug) console.log("diff: ", diff);

  const legData = getRunnerLegData(cellsInFirstRow, cellsInSecondRow);

  return {
    plassering: plassering,
    name: navn,
    club: klubb,
    sluttid,
    diff,
    etapper: legData,
  };
};

const getFoo = (rows: HTMLElementData[]) => {
  const metadata = getMetadata(rows);

  const tableRows: HTMLElementData[] = rows.slice(2);

  const entries = [];
  while (tableRows.length > 0) {
    entries.push(getRunnerData(tableRows.shift(), tableRows.shift()));
  }
  return {
    metadata,
    deltakere: entries,
  };
};

const result = getFoo(rows)
const json = JSON.stringify(result)
console.log(json);

