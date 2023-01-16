/**
 * Class that reflects ServiceTemplateInstanceList ressource provided by API
 */
import {ResourceSupport} from "./ResourceSupport";
import {ServiceTemplateInstanceListEntry} from "./ServiceTemplateInstanceListEntry";

export interface ServiceTemplateInstanceList extends ResourceSupport {
    service_template_instances: Array<ServiceTemplateInstanceListEntry>;
}
