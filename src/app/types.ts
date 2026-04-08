export type NoticeTone = "info" | "success" | "error";

export type AppNotice = {
  tone: NoticeTone;
  text: string;
};
