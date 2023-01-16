import {ResourceSupport} from "./ResourceSupport";
import {CsarListEntry} from "./CsarListEntry";

export interface CsarList extends ResourceSupport {
    csars: Array<CsarListEntry>;
}
