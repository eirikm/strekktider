import { Duration } from "./duration";

export type EtappeMetadata = {
  etappeNavn: string;
  fraPost?: string;
  tilPost?: string;
  postNummer: number;
};

export type Metadata = {
  etapper: EtappeMetadata[];
};

export type LegData = {
  etappetid?: Duration;
  etappeplassering?: number;
  totaltid?: Duration;
  totalplassering?: number;
};

export type Entry = {
  plassering?: number;
  name?: string;
  club?: string;
  sluttid?: Duration | "disket" | "ikke startet";
  diff?: Duration;
  etapper: LegData[];
};

export type Strekktider = {
  metadata: Metadata;
  deltakere: Entry[];
};
