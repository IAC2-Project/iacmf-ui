import {LinkReference} from "./LinkReference";

export interface ResourceSupport {
    _links: Map<string, LinkReference>;
}
