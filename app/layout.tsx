import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BIOPAVE | Gạch sinh thái thấm nước",
  description: "Khảo sát ý kiến và khám phá giải pháp gạch sinh thái thấm nước BIOPAVE từ nhóm nghiên cứu Đại học Cần Thơ.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
