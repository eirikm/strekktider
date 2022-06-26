import React from "react";
import data from "./small.json";
import './App.css';

const sprintf = require("sprintf-js").sprintf;

export default function App() {
  const prettyPrintTid = (t: any) => {
    if (t.hours > 0) {
      return sprintf("%d:%02d.%02d", t.hours, t.minutes, t.seconds);
    } else {
      return sprintf("%d.%02d", t.minutes, t.seconds);
    }
  };

  return (
    <div className="overflow-auto">
      <table className="table-auto w-max border-separate border-spacing-0">
        <thead>
          <tr>
            <td className="sticky left-0 bg-white border-0 border-neutral-400 border-b-2">&nbsp;</td>
            <td className="sticky left-10 bg-white border-0 border-neutral-400 border-b-2 border-r-2">&nbsp;</td>
            {data.metadata.etapper.map((e) => {
              return (
                <th colSpan={2} className="px-8 border-0 border-neutral-400 border-b-2 border-r-2">
                  {e.etappeNavn} ({e.postNummer})
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.deltakere.map((d, idx) => {
            const stickyColor = idx % 2 == 0 ? "bg-amber-200" : "bg-rose-200";
            const color = idx % 2 == 0 ? "bg-amber-100" : "bg-rose-100";
            return (
              <>
                <tr>
                  <th rowSpan={2} className={`align-top ${stickyColor} sticky left-0 w-10 border-0 border-neutral-400 border-b-2`}>
                    {d.plassering}
                  </th>
                  <th className={`text-left ${stickyColor} sticky left-10 px-2 border-neutral-400 border-r-2`}>{d.name}</th>
                  {d.etapper.map((e) => {
                    return (
                      <>
                        <td className={`text-right ${color}`}>
                          {prettyPrintTid(e.etappetid)}
                        </td>
                        <td className={`text-right ${color} border-neutral-400 border-r-2 pr-2`}>
                          ({e.etappeplassering})
                          </td>
                      </>
                    );
                  })}
                </tr>
                <tr className="">
                  <th className={`text-left ${stickyColor} sticky left-10 border-0 border-neutral-400 border-b-2 border-r-2 px-2`}>{d.club}</th>
                  {d.etapper.map((e) => {
                    return (
                      <>
                        <td className={`text-right ${color} border-0 border-neutral-400 border-b-2`}>
                          {prettyPrintTid(e.totaltid)}
                        </td>
                        <td className={`text-right ${color} border-0 border-neutral-400 border-b-2 border-r-2 pr-2`}>
                          ({e.totalplassering})
                          </td>
                      </>
                    );
                  })}
                </tr>
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
