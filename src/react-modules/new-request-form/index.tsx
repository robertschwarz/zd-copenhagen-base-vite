import { dispatchLoadEvent } from "../shared/util/dispatchLoadEvent";
import { renderNewRequestForm } from "./renderNewRequestForm";

window.renderNewRequestForm = renderNewRequestForm;

dispatchLoadEvent("new-request-form");
