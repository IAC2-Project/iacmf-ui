/**
 * Class that reflects ServiceTemplateInstanceListEntry ressource provided by API
 */
import {ResourceSupport} from "./ResourceSupport";

export interface ServiceTemplateInstanceListEntry extends ResourceSupport {
    id: number;
    created_at: string;
    csar_id: string;
    service_template_id: string;
    state: string;
}
