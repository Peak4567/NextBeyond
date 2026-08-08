import Swal from "sweetalert2";
import { icon } from "@fortawesome/fontawesome-svg-core";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faTrash,
  faFloppyDisk,
  faTriangleExclamation,
  faCheck,
  faXmark,
  faCircleQuestion,
} from "@fortawesome/free-solid-svg-icons";

type Variant = "danger" | "primary" | "warning";

function faSvg(def: IconDefinition) {
  const rendered = icon(def);
  return rendered ? rendered.html.join("") : "";
}

const ICON_BY_VARIANT: Record<Variant, IconDefinition> = {
  danger: faTrash,
  primary: faFloppyDisk,
  warning: faTriangleExclamation,
};

interface ConfirmOptions {
  title?: string;
  text?: string;
  confirmText?: string;
  cancelText?: string;
  icon?: IconDefinition;
}

async function baseConfirm(variant: Variant, opts: ConfirmOptions) {
  const iconDef = opts.icon ?? ICON_BY_VARIANT[variant];

  const result = await Swal.fire({
    html: `
      <div class="nb-swal-icon nb-swal-icon-${variant}">${faSvg(iconDef)}</div>
      <h2 class="nb-swal-title">${opts.title ?? ""}</h2>
      ${opts.text ? `<p class="nb-swal-html">${opts.text}</p>` : ""}
    `,
    showCancelButton: true,
    confirmButtonText: opts.confirmText ?? "ยืนยัน",
    cancelButtonText: opts.cancelText ?? "ยกเลิก",
    buttonsStyling: false,
    reverseButtons: true,
    focusCancel: variant === "danger",
    backdrop: "rgba(15,23,42,0.55)",
    customClass: {
      popup: "nb-swal-popup",
      htmlContainer: "nb-swal-html-container",
      actions: "nb-swal-actions",
      confirmButton: `nb-swal-btn nb-swal-btn-${variant === "danger" ? "danger" : "confirm"}`,
      cancelButton: "nb-swal-btn nb-swal-btn-cancel",
    },
  });

  return result.isConfirmed;
}

export function confirmDelete(opts: ConfirmOptions = {}) {
  return baseConfirm("danger", {
    title: opts.title ?? "ยืนยันการลบข้อมูล?",
    text: opts.text ?? "เมื่อลบแล้วจะไม่สามารถกู้คืนได้",
    confirmText: opts.confirmText ?? "ลบข้อมูล",
    cancelText: opts.cancelText,
  });
}

export function confirmSave(opts: ConfirmOptions = {}) {
  return baseConfirm("primary", {
    title: opts.title ?? "ยืนยันการบันทึกข้อมูล?",
    text: opts.text,
    confirmText: opts.confirmText ?? "บันทึก",
    cancelText: opts.cancelText,
  });
}

export function confirmWarning(opts: ConfirmOptions = {}) {
  return baseConfirm("warning", {
    title: opts.title ?? "ยืนยันการดำเนินการ?",
    text: opts.text,
    confirmText: opts.confirmText ?? "ยืนยัน",
    cancelText: opts.cancelText,
    icon: opts.icon ?? faCircleQuestion,
  });
}

function toast(variant: "success" | "error", title: string, text?: string) {
  const iconDef = variant === "success" ? faCheck : faXmark;

  Swal.fire({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: variant === "success" ? 2400 : 3200,
    timerProgressBar: true,
    background: "transparent",
    backdrop: false,
    html: `
      <div class="nb-toast nb-toast-${variant}">
        <span class="nb-toast-icon">${faSvg(iconDef)}</span>
        <div>
          <p class="nb-toast-title">${title}</p>
          ${text ? `<p class="nb-toast-text">${text}</p>` : ""}
        </div>
      </div>
    `,
    customClass: { popup: "nb-swal-toast" },
  });
}

export function notifySuccess(title: string, text?: string) {
  toast("success", title, text);
}

export function notifyError(title: string, text?: string) {
  toast("error", title, text);
}
