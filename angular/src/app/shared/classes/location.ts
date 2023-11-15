import { Comment } from "./comment";

export class Location {
  _id!: string;
  name!: string;
  category!: string;
  type!: string;
  keywords!: string[];
  description!: string;
  location!: string;
  institution!: string;
  heritage!: string;
  municipality!: string;
  coordinates!: number[];
  synonyms?: string[];
  datation!: string;
  authors!: string;
  fields!: string[];
  rating?: number;
  distance!: number;
  comments?: Comment[];
}